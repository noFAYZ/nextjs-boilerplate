/**
 * Transaction Data Hooks
 * React Query hooks for all transaction-related operations
 * Provides queries and mutations for CRUD, filtering, categorization, and analytics
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/features/transactions/services';
import { transactionQueries, transactionMutations, transactionKeys } from './transactions-queries';
import { invalidateByDependency } from '@/lib/core/query';
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

/**
 * Bulk update multiple transactions
 * Updates multiple transactions with the same data in a single operation
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

  return useMutation({
    mutationFn: async ({ transactionIds, updates }) => {
      // Update all transactions in parallel
      const promises = transactionIds.map(id =>
        transactionsApi.updateTransaction(id, updates)
      );
      return Promise.all(promises);
    },
    onMutate: async ({ transactionIds, updates }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });
      await queryClient.cancelQueries({ queryKey: transactionKeys.stats() });

      // Snapshot previous data
      const previousTransactions = queryClient.getQueryData(transactionKeys.lists());
      const previousStats = queryClient.getQueryData(transactionKeys.stats());

      // Optimistically update multiple transactions in cache
      if (previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: Array.isArray(old.data)
              ? old.data.map((tx: any) =>
                  transactionIds.includes(tx.id)
                    ? { ...tx, ...updates }
                    : tx
                )
              : old.data,
          };
        });
      }

      return { previousTransactions, previousStats };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.lists(), context.previousTransactions);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(transactionKeys.stats(), context.previousStats);
      }
    },
    onSuccess: () => {
      // Invalidate with background refetch to confirm server state
      invalidateByDependency(queryClient, 'transactions:update');
    },
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
