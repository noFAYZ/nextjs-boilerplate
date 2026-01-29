import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryEnvelopeApi, CategoryEnvelope, CategoryAnalytics } from '@/lib/services/category-envelope-api';

/**
 * Query keys for category envelope operations
 */
export const categoryEnvelopeKeys = {
  all: ['category-envelopes'] as const,
  balance: (categoryId: string) => [...categoryEnvelopeKeys.all, 'balance', categoryId] as const,
  allocationHistory: (categoryId: string) => [...categoryEnvelopeKeys.all, 'allocation-history', categoryId] as const,
  spendingHistory: (categoryId: string) => [...categoryEnvelopeKeys.all, 'spending-history', categoryId] as const,
  analytics: (categoryId: string) => [...categoryEnvelopeKeys.all, 'analytics', categoryId] as const,
};

/**
 * Allocate funds to a category envelope
 */
export function useAllocateToCategory(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; description?: string; sourceAccountId?: string }) =>
      categoryEnvelopeApi.allocateToCategory(categoryId, data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.balance(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.allocationHistory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.analytics(categoryId),
      });
    },
  });
}

/**
 * Record spending from a category envelope
 */
export function useRecordCategorySpending(categoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      amount: number;
      description: string;
      transactionDate?: string;
      merchantName?: string;
      sourceType?: string;
      sourceId?: string;
      tags?: string[];
    }) => categoryEnvelopeApi.recordSpending(categoryId, data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.balance(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.spendingHistory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.analytics(categoryId),
      });
    },
  });
}

/**
 * Get current balance for a category envelope
 */
export function useCategoryBalance(categoryId: string | null) {
  return useQuery({
    queryKey: categoryId ? categoryEnvelopeKeys.balance(categoryId) : [],
    queryFn: () => {
      if (!categoryId) throw new Error('Category ID required');
      return categoryEnvelopeApi.getBalance(categoryId);
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get allocation history for a category envelope
 */
export function useCategoryAllocationHistory(
  categoryId: string | null,
  params?: { limit?: number; offset?: number }
) {
  return useQuery({
    queryKey: categoryId ? categoryEnvelopeKeys.allocationHistory(categoryId) : [],
    queryFn: () => {
      if (!categoryId) throw new Error('Category ID required');
      return categoryEnvelopeApi.getAllocationHistory(categoryId, params);
    },
    enabled: !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get spending history for a category envelope
 */
export function useCategorySpendingHistory(
  categoryId: string | null,
  params?: { limit?: number; offset?: number }
) {
  return useQuery({
    queryKey: categoryId ? categoryEnvelopeKeys.spendingHistory(categoryId) : [],
    queryFn: () => {
      if (!categoryId) throw new Error('Category ID required');
      return categoryEnvelopeApi.getSpendingHistory(categoryId, params);
    },
    enabled: !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get analytics for a category envelope
 */
export function useCategoryEnvelopeAnalytics(categoryId: string | null) {
  return useQuery({
    queryKey: categoryId ? categoryEnvelopeKeys.analytics(categoryId) : [],
    queryFn: () => {
      if (!categoryId) throw new Error('Category ID required');
      return categoryEnvelopeApi.getAnalytics(categoryId);
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Bulk allocate to multiple categories
 */
export function useBulkAllocateToCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      allocations: Array<{
        categoryId: string;
        amount: number;
        description?: string;
      }>;
    }) => categoryEnvelopeApi.bulkAllocate(data),
    onSuccess: () => {
      // Invalidate all category envelope queries
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.all,
      });
    },
  });
}

/**
 * Split spending across multiple categories
 */
export function useSplitCategorySpending() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      spends: Array<{
        categoryId: string;
        amount: number;
        description?: string;
        merchantName?: string;
      }>;
      transactionDate?: string;
    }) => categoryEnvelopeApi.splitSpending(data),
    onSuccess: () => {
      // Invalidate all category envelope queries
      queryClient.invalidateQueries({
        queryKey: categoryEnvelopeKeys.all,
      });
    },
  });
}
