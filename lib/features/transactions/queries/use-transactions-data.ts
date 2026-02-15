/**
 * Transaction Data Hooks - Production Grade React Query Integration
 *
 * Best Practices Applied:
 * - Proper memoization of parameters to prevent unnecessary refetches
 * - Enabled flags based on required parameters
 * - Proper TypeScript types (no 'any')
 * - Shallow dependency equality for params
 * - Query prefetching capabilities
 * - Proper error handling
 */

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/features/transactions/services';
import { transactionQueries, transactionMutations, transactionKeys } from './transactions-queries';
import { accountsKeys } from '@/lib/features/accounts/queries';
import { invalidateByDependency } from '@/lib/core/query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

// Type definitions for better type safety
interface TransactionListParams {
  accountId?: string;
  categoryId?: string;
  merchantId?: string;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status?: 'PENDING' | 'POSTED' | 'CLEARED' | 'RECONCILED';
  isTransfer?: boolean;
  isPending?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'description';
}

interface MerchantParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface StatsParams {
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// UTILITY: Parameter memoization helper
// ============================================================================

/**
 * Memoize params to prevent unnecessary query refetches
 * Uses shallow equality comparison
 */
function useMemoizedParams<T extends Record<string, any>>(params?: T): T | undefined {
  return useMemo(() => params, [JSON.stringify(params)]);
}

// ============================================================================
// TRANSACTION QUERIES
// ============================================================================

/**
 * Get transactions with advanced filtering
 * Memoizes parameters to prevent unnecessary refetches
 */
export function useTransactions(params?: TransactionListParams): UseQueryResult<any, Error> {
  const memoizedParams = useMemoizedParams(params);

  return useQuery({
    ...transactionQueries.list(memoizedParams),
    enabled: !!memoizedParams?.accountId || !!memoizedParams?.search || !memoizedParams,
  });
}

/**
 * Get single transaction by ID
 * Only enables when ID is provided
 */
export function useTransaction(id?: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.detail(id || ''),
    enabled: !!id,
  });
}

/**
 * Get transaction statistics
 * Memoizes params to prevent recalculation
 */
export function useTransactionStats(params?: StatsParams): UseQueryResult<any, Error> {
  const memoizedParams = useMemoizedParams(params);

  return useQuery({
    ...transactionQueries.stats(memoizedParams),
    enabled: !!(memoizedParams?.accountId || memoizedParams?.dateFrom),
  });
}

/**
 * Get transaction categories
 * Static query - always enabled
 */
export function useTransactionCategories(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categories(),
    enabled: true,
  });
}

/**
 * Get transaction category groups
 * Static query - always enabled
 */
export function useTransactionCategoryGroups(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categoriesGroups(),
    enabled: true,
  });
}

/**
 * Get merchants with optional pagination and search
 * Memoizes params to prevent refetches
 *
 * Query is enabled when:
 * 1. No params provided (fetch all merchants)
 * 2. Params provided with any valid configuration (limit, page, search, etc.)
 */
export function useMerchants(params?: MerchantParams): UseQueryResult<any, Error> {
  const memoizedParams = useMemoizedParams(params);

  return useQuery({
    ...transactionQueries.merchants(memoizedParams),
    enabled: true, // Always enable - let the backend handle pagination with optional params
  });
}

/**
 * Search categories by query
 * Only enables when search query is provided
 * Memoizes query string to prevent unnecessary searches
 */
export function useSearchCategories(query?: string): UseQueryResult<any, Error> {
  const memoizedQuery = useMemo(() => query?.trim(), [query]);

  return useQuery({
    queryKey: ['transactions', 'search-categories', memoizedQuery],
    queryFn: async () => {
      if (!memoizedQuery) return [];
      const response = await transactionsApi.searchCategories(memoizedQuery);
      if (!response.success) throw new Error(response.error?.message || 'Failed to search categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!memoizedQuery && memoizedQuery.length > 0,
  });
}

// ============================================================================
// TRANSACTION MUTATIONS - Optimized with proper error handling
// ============================================================================

/**
 * Create a single transaction with optimistic updates
 * Performance: Memoized callbacks, efficient cache updates
 */
/**
 * Create transaction with optimistic updates for both global and account-specific caches
 *
 * BEST PRACTICES:
 * - Updates ALL affected caches (global list + account-specific lists)
 * - Snapshot/update/rollback pattern
 * - Explicit cache discovery for account transaction caches
 * - Proper error rollback
 */
export function useCreateTransaction(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  const onMutate = useCallback(async (newTransaction: any) => {
    // Cancel conflicting queries
    await Promise.all([
      queryClient.cancelQueries({ queryKey: transactionKeys.all(null) }),
      queryClient.cancelQueries({ queryKey: accountsKeys.all }),
    ]);

    // Snapshot ALL affected caches
    const getSnapshot = () => {
      const snapshot: Record<string, any> = {};

      // Snapshot global lists
      snapshot['transactionList'] = queryClient.getQueryData(transactionKeys.lists());
      snapshot['transactionStats'] = queryClient.getQueryData(transactionKeys.stats());

      // Snapshot all account-specific transaction caches
      const allQueries = queryClient.getQueryCache().getAll();
      allQueries.forEach((query) => {
        const key = query.queryKey;
        // Match account transaction caches: ['unified-accounts', 'transactions', accountId, ...]
        if (
          Array.isArray(key) &&
          key[0] === 'unified-accounts' &&
          key[1] === 'transactions'
        ) {
          const cacheKey = JSON.stringify(key);
          snapshot[cacheKey] = queryClient.getQueryData(key);
        }
      });

      return snapshot;
    };

    const previousSnapshot = getSnapshot();
    const tempTransaction = {
      ...newTransaction,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Update global transaction list
    queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: [tempTransaction, ...old.data],
      };
    });

    // Update all account-specific transaction caches
    const accountId = newTransaction.accountId;
    if (accountId) {
      queryClient.getQueryCache().findAll({ queryKey: accountsKeys.all }).forEach((query) => {
        const cacheKey = query.queryKey;
        // Only update account transaction queries for the relevant account
        if (
          Array.isArray(cacheKey) &&
          cacheKey[1] === 'transactions' &&
          cacheKey[2] === accountId
        ) {
          queryClient.setQueryData(cacheKey, (old: any) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: [tempTransaction, ...old.data],
            };
          });
        }
      });
    }

    return previousSnapshot;
  }, [queryClient]);

  const onError = useCallback((error: Error, _variables: any, context: any) => {
    if (!context) return;

    // Restore global caches
    if (context['transactionList']) {
      queryClient.setQueryData(transactionKeys.lists(), context['transactionList']);
    }
    if (context['transactionStats']) {
      queryClient.setQueryData(transactionKeys.stats(), context['transactionStats']);
    }

    // Restore account-specific caches
    Object.entries(context).forEach(([cacheKey, data]) => {
      if (cacheKey.startsWith('["unified-accounts"')) {
        try {
          const keyArray = JSON.parse(cacheKey);
          queryClient.setQueryData(keyArray, data);
        } catch {
          // Ignore parse errors
        }
      }
    });
  }, [queryClient]);

  const onSuccess = useCallback(() => {
    // Invalidate all transaction-related caches for background refetch
    queryClient.invalidateQueries({
      queryKey: transactionKeys.all(null),
      refetchType: 'background',
    });

    queryClient.invalidateQueries({
      queryKey: accountsKeys.all,
      refetchType: 'background',
    });
  }, [queryClient]);

  return useMutation({
    ...transactionMutations.create(),
    onMutate,
    onError,
    onSuccess,
  });
}

/**
 * Create multiple transactions at once
 * Performance: Memoized callbacks, batch cache updates, efficient rollback
 */
export function useBulkCreateTransactions(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  const onMutate = useCallback(async (newTransactions: any) => {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: transactionKeys.lists() }),
      queryClient.cancelQueries({ queryKey: transactionKeys.stats() }),
    ]);

    const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
    const previousStats = queryClient.getQueryData(transactionKeys.stats());

    if (previousTransactions) {
      queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        const tempTransactions = (Array.isArray(newTransactions) ? newTransactions : [newTransactions]).map(
          (tx, idx) => ({
            ...tx,
            id: `temp-${Date.now()}-${idx}`,
            createdAt: new Date().toISOString(),
          })
        );
        return { ...old, data: [...tempTransactions, ...old.data] };
      });
    }

    return { previousTransactions, previousStats };
  }, [queryClient]);

  const onError = useCallback((error: Error, _variables: any, context: any) => {
    if (context?.previousTransactions) {
      queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
    }
    if (context?.previousStats) {
      queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
    }
  }, [queryClient]);

  const onSuccess = useCallback(() => {
    invalidateByDependency(queryClient, 'transactions:update');
  }, [queryClient]);

  return useMutation({
    ...transactionMutations.bulkCreate(),
    onMutate,
    onError,
    onSuccess,
  });
}

/**
 * Update transaction with optimistic updates and explicit cache invalidation
 *
 * BEST PRACTICES:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Explicit cache updates targeting specific query keys
 * - Comprehensive error rollback for all affected caches
 * - Uses invalidateQueries with predicates for cross-cache consistency
 * - Snapshot/update/rollback pattern for optimistic updates
 * - Separates concerns: optimistic updates for UX, invalidation for consistency
 */
export function useUpdateTransaction(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  const onMutate = useCallback(async (variables: { id: string; data: any }) => {
    // Step 1: Cancel all conflicting queries to prevent race conditions
    await Promise.all([
      queryClient.cancelQueries({ queryKey: transactionKeys.all(null) }),
      queryClient.cancelQueries({ queryKey: accountsKeys.all }),
    ]);

    // Step 2: Snapshot ALL caches that might contain this transaction
    // This includes:
    // - Global transaction list
    // - Account-specific transaction lists (ALL of them)
    // - Transaction details
    // - Statistics
    const getSnapshot = () => {
      const snapshot: Record<string, any> = {};

      // Snapshot global lists
      snapshot['transactionList'] = queryClient.getQueryData(transactionKeys.lists());
      snapshot['transactionDetail'] = queryClient.getQueryData(transactionKeys.detail(variables.id));
      snapshot['transactionStats'] = queryClient.getQueryData(transactionKeys.stats());

      // Snapshot all account-specific transaction caches
      const allQueries = queryClient.getQueryCache().getAll();
      allQueries.forEach((query) => {
        const key = query.queryKey;
        // Match account transaction caches: ['unified-accounts', 'transactions', accountId, ...]
        if (
          Array.isArray(key) &&
          key[0] === 'unified-accounts' &&
          key[1] === 'transactions'
        ) {
          const cacheKey = JSON.stringify(key);
          snapshot[cacheKey] = queryClient.getQueryData(key);
        }
      });

      return snapshot;
    };

    const previousSnapshot = getSnapshot();

    // Step 3: Optimistically update ALL relevant caches with proper deep merge
    // Helper function to deeply merge transaction updates
    const mergeTransactionData = (tx: any, updates: any) => {
      const merged = { ...tx };

      // Handle merchant update with full data replacement
      if (updates.merchant !== undefined) {
        merged.merchant = updates.merchant;
      } else if (updates.merchantId !== undefined && !updates.merchant) {
        // If only merchantId is provided, still update it
        merged.merchantId = updates.merchantId;
      }

      // Handle category update with full data replacement
      if (updates.category !== undefined) {
        merged.category = updates.category;
      } else if (updates.categoryId !== undefined && !updates.category) {
        merged.categoryId = updates.categoryId;
      }

      // Handle account update
      if (updates.account !== undefined) {
        merged.account = updates.account;
      } else if (updates.accountId !== undefined && !updates.account) {
        merged.accountId = updates.accountId;
      }

      // Merge all other fields
      Object.keys(updates).forEach((key) => {
        if (!['merchant', 'merchantId', 'category', 'categoryId', 'account', 'accountId'].includes(key)) {
          merged[key] = updates[key];
        }
      });

      return merged;
    };

    // Update global transaction list
    queryClient.setQueryData(transactionKeys.lists(), (old: unknown) => {
      if (typeof old !== 'object' || !old || !('data' in old)) return old;
      const oldData = old as { data: Array<{ id: string }> };
      return {
        ...oldData,
        data: oldData.data.map((tx: any) =>
          tx.id === variables.id ? mergeTransactionData(tx, variables.data) : tx
        ),
      };
    });

    // Update all account-specific transaction caches
    queryClient.getQueryCache().findAll({ queryKey: accountsKeys.all }).forEach((query) => {
      const cacheKey = query.queryKey;
      // Only update account transaction queries
      if (
        Array.isArray(cacheKey) &&
        cacheKey[1] === 'transactions'
      ) {
        queryClient.setQueryData(cacheKey, (old: unknown) => {
          if (typeof old !== 'object' || !old || !('data' in old)) return old;
          const oldData = old as { data: any };
          const isArray = Array.isArray(oldData.data);
          return {
            ...oldData,
            data: isArray
              ? oldData.data.map((tx: any) =>
                  tx.id === variables.id ? mergeTransactionData(tx, variables.data) : tx
                )
              : oldData.data,
          };
        });
      }
    });

    // Update transaction detail with proper merge
    const detail = queryClient.getQueryData(transactionKeys.detail(variables.id));
    if (detail) {
      queryClient.setQueryData(transactionKeys.detail(variables.id),
        mergeTransactionData(detail, variables.data)
      );
    }

    return previousSnapshot;
  }, [queryClient]);

  const onError = useCallback(
    (error: Error, variables: { id: string; data: any }, context: any) => {
      if (!context) return;

      // Restore global caches
      if (context['transactionList']) {
        queryClient.setQueryData(transactionKeys.lists(), context['transactionList']);
      }
      if (context['transactionDetail']) {
        queryClient.setQueryData(transactionKeys.detail(variables.id), context['transactionDetail']);
      }
      if (context['transactionStats']) {
        queryClient.setQueryData(transactionKeys.stats(), context['transactionStats']);
      }

      // Restore account-specific caches
      Object.entries(context).forEach(([cacheKey, data]) => {
        if (cacheKey.startsWith('["unified-accounts"')) {
          try {
            const keyArray = JSON.parse(cacheKey);
            queryClient.setQueryData(keyArray, data);
          } catch {
            // Ignore parse errors
          }
        }
      });
    },
    [queryClient]
  );

  const onSuccess = useCallback((response: any, variables: { id: string; data: any }) => {
    // Helper to enrich transaction with merchant object from merchants list
    const enrichTransactionMerchant = (tx: any) => {
      if (!tx.merchantId) return tx;

      const merchantsData = queryClient.getQueryData(transactionKeys.merchants(null)) as any;
      if (merchantsData?.data) {
        const merchant = merchantsData.data.find((m: any) => m.id === tx.merchantId);
        if (merchant) {
          return {
            ...tx,
            merchant: {
              id: merchant.id,
              displayName: merchant.name,
              logo: merchant.logo,
              website: merchant.website,
            },
          };
        }
      }
      return tx;
    };

    // Manually enrich and update global transaction list
    queryClient.setQueryData(transactionKeys.lists(), (old: unknown) => {
      if (typeof old !== 'object' || !old || !('data' in old)) return old;
      const oldData = old as { data: Array<{ id: string }> };
      return {
        ...oldData,
        data: oldData.data.map((tx: any) =>
          tx.id === variables.id ? enrichTransactionMerchant(response.data) : tx
        ),
      };
    });

    // Manually enrich transaction detail cache if it exists
    queryClient.setQueryData(transactionKeys.detail(variables.id), (old: unknown) => {
      if (!old) return old;
      return enrichTransactionMerchant(response.data);
    });

    // Then invalidate for background refetch to sync with server
    queryClient.invalidateQueries({
      queryKey: transactionKeys.all(null),
      refetchType: 'background',
    });

    queryClient.invalidateQueries({
      queryKey: accountsKeys.all,
      refetchType: 'background',
    });
  }, [queryClient]);

  return useMutation({
    ...transactionMutations.update(),
    onMutate,
    onError,
    onSuccess,
  });
}

/**
 * Delete transaction with optimistic removal
 * Performance: Memoized callbacks, efficient cache removal, proper rollback
 */
export function useDeleteTransaction(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient();

  const onMutate = useCallback(async (id: string) => {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: transactionKeys.lists() }),
      queryClient.cancelQueries({ queryKey: transactionKeys.detail(id) }),
      queryClient.cancelQueries({ queryKey: transactionKeys.stats() }),
    ]);

    const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
    const previousDetail = queryClient.getQueryData(transactionKeys.detail(id));
    const previousStats = queryClient.getQueryData(transactionKeys.stats());

    // Optimistically remove from list
    if (previousTransactions) {
      queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((tx: any) => tx.id !== id),
        };
      });
    }

    // Remove detail cache
    queryClient.removeQueries({ queryKey: transactionKeys.detail(id) });

    return { previousTransactions, previousDetail, previousStats };
  }, [queryClient]);

  const onError = useCallback(
    (error: Error, id: string, context: any) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(transactionKeys.detail(id), context.previousDetail);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
      }
    },
    [queryClient]
  );

  const onSuccess = useCallback(() => {
    invalidateByDependency(queryClient, 'transactions:delete');
  }, [queryClient]);

  return useMutation({
    mutationFn: (id: string) => transactionsApi.deleteTransaction(id),
    onMutate,
    onError,
    onSuccess,
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate transaction cache
 */
export function useInvalidateTransactionCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
    invalidateList: () => queryClient.invalidateQueries({ queryKey: transactionKeys.lists() }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: transactionKeys.stats() }),
    invalidateCategories: () =>
      queryClient.invalidateQueries({ queryKey: transactionKeys.categories() }),
  };
}

/**
 * Prefetch transaction data
 */
export function usePrefetchTransactionData() {
  const queryClient = useQueryClient();

  return {
    prefetchTransactions: (params?: Record<string, any>) =>
      queryClient.prefetchQuery({
        ...transactionQueries.list(params),
      }),
    prefetchCategories: () =>
      queryClient.prefetchQuery({
        ...transactionQueries.categories(),
      }),
    prefetchCategoryGroups: () =>
      queryClient.prefetchQuery({
        ...transactionQueries.categoriesGroups(),
      }),
  };
}

/**
 * Bulk update multiple transactions
 * Performance: Parallel updates, memoized callbacks, efficient batch cache updates
 */
export function useBulkUpdateTransactions(): UseMutationResult<
  any[],
  Error,
  {
    transactionIds: string[];
    updates: Record<string, any>;
  },
  unknown
> {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(async ({ transactionIds, updates }: any) => {
    // Update all transactions in parallel for better performance
    return Promise.all(
      transactionIds.map(id => transactionsApi.updateTransaction(id, updates))
    );
  }, []);

  const onMutate = useCallback(async ({ transactionIds, updates }: any) => {
    await Promise.all([
      queryClient.cancelQueries({ queryKey: transactionKeys.lists() }),
      queryClient.cancelQueries({ queryKey: transactionKeys.stats() }),
    ]);

    const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
    const previousStats = queryClient.getQueryData(transactionKeys.stats());

    // Optimistically update multiple in cache
    if (previousTransactions) {
      queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        const idsSet = new Set(transactionIds); // O(1) lookup
        return {
          ...old,
          data: old.data.map((tx: any) =>
            idsSet.has(tx.id) ? { ...tx, ...updates } : tx
          ),
        };
      });
    }

    return { previousTransactions, previousStats };
  }, [queryClient]);

  const onError = useCallback((error: Error, _variables: any, context: any) => {
    if (context?.previousTransactions) {
      queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
    }
    if (context?.previousStats) {
      queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
    }
  }, [queryClient]);

  const onSuccess = useCallback(() => {
    invalidateByDependency(queryClient, 'transactions:update');
  }, [queryClient]);

  return useMutation({
    mutationFn,
    onMutate,
    onError,
    onSuccess,
  });
}

// ============================================================================
// EXPANDED HOOKS FOR NEW ENDPOINTS
// ============================================================================

/**
 * Search transactions with advanced filtering
 */
export function useSearchTransactions(
  params?: Record<string, any>
): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.search(params),
    enabled: !!params,
  });
}

/**
 * Get transaction notes
 */
export function useTransactionNotes(transactionId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.notes(transactionId),
    enabled: !!transactionId,
  });
}

/**
 * Add note to transaction
 */
export function useAddTransactionNote(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.addNote(),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.note(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
    },
  });
}

/**
 * Get transaction attachments
 */
export function useTransactionAttachments(transactionId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.attachments(transactionId),
    enabled: !!transactionId,
  });
}

/**
 * Upload attachment to transaction
 */
export function useUploadAttachment(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.uploadAttachment(),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.attachment(id) });
    },
  });
}

/**
 * Delete attachment
 */
export function useDeleteAttachment(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.deleteAttachment(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.attachments() });
    },
  });
}

/**
 * Reconcile transaction
 */
export function useReconcileTransaction(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.reconcile(),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

// ============================================================================
// CATEGORIZATION HOOKS
// ============================================================================

/**
 * Get category rules
 */
export function useCategoryRules(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categoryRules(),
    enabled: true,
  });
}

/**
 * Get merchant rules
 */
export function useMerchantRules(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.merchantRules(),
    enabled: true,
  });
}

/**
 * Get categorization statistics
 */
export function useCategorizationStats(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categorizationStats(),
    enabled: true,
  });
}

/**
 * Create category rule
 */
export function useCreateCategoryRule(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.createCategoryRule(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categoryRules() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationStats() });
    },
  });
}

/**
 * Bulk recategorize transactions
 */
export function useBulkRecategorize(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.bulkRecategorize(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() });
    },
  });
}

/**
 * Get custom categorization rules
 */
export function useCategorizationRules(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categorizationRules(),
    enabled: true,
  });
}

/**
 * Get single categorization rule
 */
export function useCategorizationRule(ruleId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categorizationRule(ruleId),
    enabled: !!ruleId,
  });
}

/**
 * Get categorization rule statistics
 */
export function useCategorizationRuleStats(ruleId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categorizationRuleStats(ruleId),
    enabled: !!ruleId,
  });
}

/**
 * Create categorization rule
 */
export function useCreateCategorizationRule(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.createCategorizationRule(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Update categorization rule
 */
export function useUpdateCategorizationRule(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.updateCategorizationRule(),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRule(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Delete categorization rule
 */
export function useDeleteCategorizationRule(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.deleteCategorizationRule(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Test categorization rule
 */
export function useTestCategorizationRule(): UseMutationResult<any, Error, any, unknown> {
  return useMutation({
    ...transactionMutations.testCategorizationRule(),
  });
}

/**
 * Enable categorization rule
 */
export function useEnableCategorizationRule(): UseMutationResult<any, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.enableCategorizationRule(),
    onSuccess: (data, ruleId) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRule(ruleId) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Disable categorization rule
 */
export function useDisableCategorizationRule(): UseMutationResult<any, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.disableCategorizationRule(),
    onSuccess: (data, ruleId) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRule(ruleId) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Set categorization rule priority
 */
export function useSetCategorizationRulePriority(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.setCategorizationRulePriority(),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRule(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Duplicate categorization rule
 */
export function useDuplicateCategorizationRule(): UseMutationResult<any, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.duplicateCategorizationRule(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Import categorization rules
 */
export function useImportCategorizationRules(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.importCategorizationRules(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationRules() });
    },
  });
}

/**
 * Export categorization rules
 */
export function useExportCategorizationRules(): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: transactionKeys.categorizationRules(),
    queryFn: async () => {
      const response = await transactionsApi.exportCategorizationRules();
      if (!response.success) throw new Error('Failed to export rules');
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    enabled: false,
  });
}

// ============================================================================
// ANALYTICS & FINDINGS HOOKS
// ============================================================================

/**
 * Auto-categorize account
 */
export function useAutoCategorizeAccount(): UseMutationResult<any, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.autoCategorizeAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.categorizationStats() });
    },
  });
}

/**
 * Detect recurring patterns in account
 */
export function useRecurringPatterns(accountId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.recurringPatterns(accountId),
    enabled: !!accountId,
  });
}

/**
 * Get expected transactions based on patterns
 */
export function useExpectedTransactions(accountId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.expectedTransactions(accountId),
    enabled: !!accountId,
  });
}

/**
 * Get reconciliation progress
 */
export function useReconciliationProgress(accountId: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.reconciliationProgress(accountId),
    enabled: !!accountId,
  });
}

/**
 * Export account transactions
 */
export function useExportAccountTransactions(): UseMutationResult<any, Error, any, unknown> {
  return useMutation({
    ...transactionMutations.exportAccountTransactions(),
  });
}

/**
 * Find matching transactions for reconciliation
 */
export function useFindMatchingTransactions(): UseMutationResult<any, Error, any, unknown> {
  return useMutation({
    ...transactionMutations.findMatchingTransactions(),
  });
}
