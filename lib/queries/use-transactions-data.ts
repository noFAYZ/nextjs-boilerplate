/**
 * Transaction Data Hooks
 * React Query hooks for all transaction-related operations
 * Provides queries and mutations for CRUD, filtering, categorization, and analytics
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/services/transactions-api';
import { transactionQueries, transactionMutations, transactionKeys } from './transactions-queries';
import { invalidateByDependency } from '@/lib/query-invalidation';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

// ============================================================================
// TRANSACTION QUERIES
// ============================================================================

/**
 * Get transactions with advanced filtering
 */
export function useTransactions(
  params?: {
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
): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.list(params),
    enabled: true,
  });
}

/**
 * Get single transaction by ID
 */
export function useTransaction(id: string): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.detail(id),
    enabled: !!id,
  });
}

/**
 * Get transaction statistics
 */
export function useTransactionStats(params?: {
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
}): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.stats(params),
    enabled: true,
  });
}

/**
 * Get transaction categories
 */
export function useTransactionCategories(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categories(),
    enabled: true,
  });
}

/**
 * Get transaction category groups
 */
export function useTransactionCategoryGroups(): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.categoriesGroups(),
    enabled: true,
  });
}

/**
 * Get merchants
 */
export function useMerchants(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): UseQueryResult<any, Error> {
  return useQuery({
    ...transactionQueries.merchants(params),
    enabled: true,
  });
}

/**
 * Search categories by name
 */
export function useSearchCategories(query: string): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: async () => {
      const response = await transactionsApi.searchCategories(query);
      if (!response.success) throw new Error(response.error?.message || 'Failed to search categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!query,
  });
}

// ============================================================================
// TRANSACTION MUTATIONS
// ============================================================================

/**
 * Create a single transaction
 */
export function useCreateTransaction(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.create(),
    onMutate: async (newTransaction) => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });
      await queryClient.cancelQueries({ queryKey: transactionKeys.stats() });

      // Get previous data
      const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
      const previousStats = queryClient.getQueryData(transactionKeys.stats());

      // Optimistically add to list
      if (previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: [
              { ...newTransaction, id: `temp-${Date.now()}`, createdAt: new Date() },
              ...(Array.isArray(old.data) ? old.data : []),
            ],
          };
        });
      }

      return { previousTransactions, previousStats };
    },
    onError: (error, variables, context) => {
      console.error('Failed to create transaction:', error);
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'transactions:update');
    },
  });
}

/**
 * Create multiple transactions at once
 */
export function useBulkCreateTransactions(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.bulkCreate(),
    onMutate: async (newTransactions) => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });
      await queryClient.cancelQueries({ queryKey: transactionKeys.stats() });

      // Get previous data
      const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
      const previousStats = queryClient.getQueryData(transactionKeys.stats());

      // Optimistically add all to list
      if (previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
          if (!old || !old.data) return old;
          const tempTransactions = (Array.isArray(newTransactions) ? newTransactions : [newTransactions]).map(
            (tx, idx) => ({
              ...tx,
              id: `temp-${Date.now()}-${idx}`,
              createdAt: new Date(),
            })
          );
          return {
            ...old,
            data: [...tempTransactions, ...(Array.isArray(old.data) ? old.data : [])],
          };
        });
      }

      return { previousTransactions, previousStats };
    },
    onError: (error, variables, context) => {
      console.error('Failed to bulk create transactions:', error);
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'transactions:update');
    },
  });
}

/**
 * Update transaction
 */
export function useUpdateTransaction(): UseMutationResult<any, Error, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    ...transactionMutations.update(),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });
      await queryClient.cancelQueries({ queryKey: transactionKeys.detail(variables.id) });
      await queryClient.cancelQueries({ queryKey: transactionKeys.stats() });

      // Snapshot the previous data
      const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
      const previousDetail = queryClient.getQueryData(transactionKeys.detail(variables.id));
      const previousStats = queryClient.getQueryData(transactionKeys.stats());

      // Optimistically update the transaction in list
      if (previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: Array.isArray(old.data)
              ? old.data.map((tx: any) =>
                  tx.id === variables.id
                    ? { ...tx, ...variables.data }
                    : tx
                )
              : old.data,
          };
        });
      }

      // Optimistically update the detail view
      if (previousDetail) {
        queryClient.setQueryData(transactionKeys.detail(variables.id), {
          ...previousDetail,
          ...variables.data,
        });
      }

      return { previousTransactions, previousDetail, previousStats };
    },
    onError: (error, variables, context) => {
      console.error('Failed to update transaction:', error);
      // Rollback optimistic updates on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(transactionKeys.detail(variables.id), context.previousDetail);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate with background refetch to confirm server state
      invalidateByDependency(queryClient, 'transactions:update');
    },
  });
}

/**
 * Delete transaction
 */
export function useDeleteTransaction(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsApi.deleteTransaction(id),
    onMutate: async (id) => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });
      await queryClient.cancelQueries({ queryKey: transactionKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: transactionKeys.stats() });

      // Get previous data
      const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
      const previousDetail = queryClient.getQueryData(transactionKeys.detail(id));
      const previousStats = queryClient.getQueryData(transactionKeys.stats());

      // Optimistically remove from list
      if (previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: Array.isArray(old.data)
              ? old.data.filter((tx: any) => tx.id !== id)
              : old.data,
          };
        });
      }

      // Clear detail cache
      queryClient.removeQueries({ queryKey: transactionKeys.detail(id) });

      return { previousTransactions, previousDetail, previousStats };
    },
    onError: (error, id, context) => {
      console.error('Failed to delete transaction:', error);
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
    onSuccess: () => {
      invalidateByDependency(queryClient, 'transactions:delete');
    },
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
