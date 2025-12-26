/**
 * Transaction Data Hooks
 * React Query hooks for all transaction-related operations
 * Provides queries and mutations for CRUD, filtering, categorization, and analytics
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/services/transactions-api';
import { transactionQueries, transactionMutations, transactionKeys } from './transactions-queries';
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
    onSuccess: (data) => {
      // Invalidate related caches
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create transaction:', error);
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
    onSuccess: (data) => {
      // Invalidate related caches
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to bulk create transactions:', error);
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
      // Cancel any outgoing refetches for transaction lists
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });

      // Snapshot the previous data
      const previousTransactions = queryClient.getQueryData(transactionKeys.lists());

      // Optimistically update the transaction in the cache
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

      return { previousTransactions };
    },
    onSuccess: (data, variables) => {
      // Invalidate specific and related caches with background refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id), refetchType: 'background' });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists(), refetchType: 'background' });
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats(), refetchType: 'background' });
    },
    onError: (error, variables, context) => {
      console.error('Failed to update transaction:', error);
      // Rollback optimistic update on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
      }
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
    onSuccess: (data, id) => {
      // Invalidate related caches
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to delete transaction:', error);
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
