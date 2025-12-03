/**
 * Category Groups Data Hooks
 *
 * React Query hooks for managing category groups, categories, and envelope
 * operations with automatic caching and cache invalidation.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { categoryGroupsApi, CustomCategoryGroup, CustomCategory, CategoryBalance, CategorySummary, CategoryAnalytics } from '@/lib/services/category-groups-api';
import { useAuthStore } from '@/lib/stores/auth-store';

// ============================================================================
// QUERY KEYS
// ============================================================================

const categoryGroupsKeys = {
  all: ['category-groups'] as const,

  // Category Groups
  lists: () => [...categoryGroupsKeys.all, 'list'] as const,
  list: (params?: { includeCategories?: boolean; activeOnly?: boolean; page?: number; limit?: number }) =>
    [...categoryGroupsKeys.lists(), params] as const,
  detail: (id: string) => [...categoryGroupsKeys.all, 'detail', id] as const,

  // Categories
  categories: () => [...categoryGroupsKeys.all, 'categories'] as const,
  categoriesList: (params?: { groupId?: string; activeOnly?: boolean; search?: string; page?: number; limit?: number }) =>
    [...categoryGroupsKeys.categories(), 'list', params] as const,
  categoriesEnvelope: () => [...categoryGroupsKeys.categories(), 'envelope'] as const,
  categoriesGrouped: () => [...categoryGroupsKeys.categories(), 'grouped'] as const,

  // Balance & Analytics
  balance: (id: string, params?: { periodStart?: string; periodEnd?: string }) =>
    [...categoryGroupsKeys.all, 'balance', id, params] as const,
  summary: (id: string) => [...categoryGroupsKeys.all, 'summary', id] as const,
  analytics: (id: string, params?: { period?: string; months?: number }) =>
    [...categoryGroupsKeys.all, 'analytics', id, params] as const,

  // History
  history: (id: string) => [...categoryGroupsKeys.all, 'history', id] as const,
  allocationHistory: (id: string, params?: { limit?: number; offset?: number }) =>
    [...categoryGroupsKeys.history(id), 'allocations', params] as const,
  spendingHistory: (id: string, params?: { limit?: number; offset?: number; startDate?: string; endDate?: string }) =>
    [...categoryGroupsKeys.history(id), 'spending', params] as const,
  monthlySpending: (id: string, params?: { year?: number; month?: number }) =>
    [...categoryGroupsKeys.history(id), 'monthly', params] as const,

  // Templates
  templates: () => [...categoryGroupsKeys.all, 'templates'] as const,
  templatesList: () => [...categoryGroupsKeys.templates(), 'list'] as const,
  templateDetail: (id: string) => [...categoryGroupsKeys.templates(), 'detail', id] as const,
};

// ============================================================================
// AUTH HELPER
// ============================================================================

function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

// ============================================================================
// CATEGORY GROUPS QUERIES & MUTATIONS
// ============================================================================

/**
 * Get all category groups with their categories
 */
export function useCategoryGroups(
  params?: {
    includeCategories?: boolean;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  },
  options?: any
): UseQueryResult<any, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.list(params),
    queryFn: () => categoryGroupsApi.getGroups(params),
    enabled: isAuthReady,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get single category group
 */
export function useCategoryGroup(
  groupId: string | null,
  includeCategories: boolean = true
): UseQueryResult<CustomCategoryGroup, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.detail(groupId || ''),
    queryFn: () => categoryGroupsApi.getGroup(groupId || '', includeCategories),
    enabled: isAuthReady && !!groupId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create category group
 */
export function useCreateCategoryGroup(): UseMutationResult<
  CustomCategoryGroup,
  unknown,
  {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
    },
  });
}

/**
 * Update category group
 */
export function useUpdateCategoryGroup(
  groupId: string
): UseMutationResult<CustomCategoryGroup, unknown, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.detail(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
    },
  });
}

/**
 * Delete category group
 */
export function useDeleteCategoryGroup(
  groupId: string
): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => categoryGroupsApi.deleteGroup(groupId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: categoryGroupsKeys.lists(),
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(categoryGroupsKeys.lists());

      // Optimistically update by filtering out the deleted group
      queryClient.setQueriesData(
        { queryKey: categoryGroupsKeys.lists() },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((g: any) => g.id !== groupId),
          };
        }
      );

      return { previousData };
    },
    onError: (err, variables, context: any) => {
      // Revert to previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(categoryGroupsKeys.lists(), context.previousData);
      }
    },
    onSuccess: () => {
      // Invalidate detail queries
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.detail(groupId),
      });
    },
  });
}

// ============================================================================
// CATEGORIES QUERIES
// ============================================================================

/**
 * Get all categories with filtering
 */
export function useCategories(params?: {
  groupId?: string;
  activeOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): UseQueryResult<{
  categories: CustomCategory[];
  pagination: any;
}, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.categoriesList(params),
    queryFn: () => categoryGroupsApi.getCategories(params),
    enabled: isAuthReady,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get single category
 */
export function useCategory(
  categoryId: string | null
): UseQueryResult<CustomCategory, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.detail(categoryId || ''),
    queryFn: () => categoryGroupsApi.getCategory(categoryId || ''),
    enabled: isAuthReady && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get envelope categories only
 */
export function useEnvelopeCategories(): UseQueryResult<{
  categories: CustomCategory[];
  count: number;
}, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.categoriesEnvelope(),
    queryFn: () => categoryGroupsApi.getEnvelopeCategories(),
    enabled: isAuthReady,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get categories grouped by type
 */
export function useCategoriesByType(): UseQueryResult<{
  TRANSACTION: { count: number; categories: CustomCategory[] };
  ACCOUNT: { count: number; categories: CustomCategory[] };
  ASSET: { count: number; categories: CustomCategory[] };
  ENVELOPE: { count: number; categories: CustomCategory[] };
}, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.categoriesGrouped(),
    queryFn: () => categoryGroupsApi.getCategoriesByType(),
    enabled: isAuthReady,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create category
 */
export function useCreateCategory(): UseMutationResult<
  CustomCategory,
  unknown,
  any,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.createCategory(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.categoriesList({ groupId: variables.groupId }),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.detail(variables.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
    },
  });
}

/**
 * Update category
 */
export function useUpdateCategory(
  categoryId: string
): UseMutationResult<CustomCategory, unknown, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.updateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.detail(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.categoriesList(),
      });
    },
  });
}

/**
 * Delete category
 */
export function useDeleteCategory(
  categoryId: string
): UseMutationResult<void, unknown, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => categoryGroupsApi.deleteCategory(categoryId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: categoryGroupsKeys.lists(),
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(categoryGroupsKeys.lists());

      // Optimistically update by filtering out the deleted category from all groups
      queryClient.setQueriesData(
        { queryKey: categoryGroupsKeys.lists() },
        (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((group: any) => ({
              ...group,
              categories: (group.categories || []).filter((cat: any) => cat.id !== categoryId),
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (err, variables, context: any) => {
      // Revert to previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(categoryGroupsKeys.lists(), context.previousData);
      }
    },
    onSuccess: () => {
      // Invalidate detail queries
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.detail(categoryId),
      });
    },
  });
}

// ============================================================================
// ENVELOPE OPERATIONS
// ============================================================================

/**
 * Allocate funds to category
 */
export function useAllocateFunds(
  categoryId: string
): UseMutationResult<any, unknown, {
  amount: number;
  description?: string;
  sourceAccountId?: string;
  notes?: string;
}, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.allocate(categoryId, data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: categoryGroupsKeys.balance(categoryId),
      });

      // Snapshot the previous value
      const previousBalance = queryClient.getQueryData(categoryGroupsKeys.balance(categoryId));

      // Optimistically update to new value
      if (previousBalance) {
        queryClient.setQueryData(categoryGroupsKeys.balance(categoryId), (old: any) => ({
          ...old,
          allocations: [...(old?.allocations || []), newData],
          currentBalance: (old?.currentBalance || 0) + newData.amount,
        }));
      }

      return { previousBalance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.balance(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.summary(categoryId),
      });
    },
    onError: (err, variables, context: any) => {
      // Revert to previous value on error
      if (context?.previousBalance) {
        queryClient.setQueryData(categoryGroupsKeys.balance(categoryId), context.previousBalance);
      }
    },
  });
}

/**
 * Record spending against category
 */
export function useRecordSpending(
  categoryId: string
): UseMutationResult<any, unknown, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.recordSpending(categoryId, data),
    onMutate: async (newSpending) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: categoryGroupsKeys.balance(categoryId),
      });

      // Snapshot the previous value
      const previousBalance = queryClient.getQueryData(categoryGroupsKeys.balance(categoryId));

      // Optimistically update balance
      if (previousBalance) {
        queryClient.setQueryData(categoryGroupsKeys.balance(categoryId), (old: any) => ({
          ...old,
          totalSpent: (old?.totalSpent || 0) + newSpending.amount,
          currentBalance: (old?.currentBalance || 0) - newSpending.amount,
          percentageUsed: ((old?.totalSpent || 0) + newSpending.amount) / (old?.allocatedAmount || 1) * 100,
          isExceeded: ((old?.totalSpent || 0) + newSpending.amount) > (old?.allocatedAmount || 0),
        }));
      }

      return { previousBalance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.balance(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.spendingHistory(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.summary(categoryId),
      });
    },
    onError: (err, variables, context: any) => {
      // Revert to previous value on error
      if (context?.previousBalance) {
        queryClient.setQueryData(categoryGroupsKeys.balance(categoryId), context.previousBalance);
      }
    },
  });
}

/**
 * Adjust allocation amount
 */
export function useAdjustAllocation(
  categoryId: string
): UseMutationResult<any, unknown, any, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.adjustAllocation(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.balance(categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.detail(categoryId),
      });
    },
  });
}

/**
 * Transfer funds between categories
 */
export function useTransferFunds(): UseMutationResult<any, unknown, {
  fromCategoryId: string;
  toCategoryId: string;
  amount: number;
  reason?: string;
  description?: string;
}, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.transferFunds(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.balance(variables.fromCategoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.balance(variables.toCategoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.categoriesList(),
      });
    },
  });
}

/**
 * Bulk allocate to multiple categories
 */
export function useBulkAllocate(): UseMutationResult<any, unknown, {
  allocations: Array<{
    categoryId: string;
    amount: number;
    description?: string;
  }>;
  sourceAccountId?: string;
  description?: string;
}, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryGroupsApi.bulkAllocate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.categoriesList(),
      });
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
    },
  });
}

// ============================================================================
// BALANCE & ANALYTICS QUERIES
// ============================================================================

/**
 * Get category balance with projections
 */
export function useCategoryBalance(
  categoryId: string | null,
  params?: {
    periodStart?: string;
    periodEnd?: string;
  }
): UseQueryResult<CategoryBalance, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.balance(categoryId || '', params),
    queryFn: () => categoryGroupsApi.getBalance(categoryId || '', params),
    enabled: isAuthReady && !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get category summary
 */
export function useCategorySummary(
  categoryId: string | null
): UseQueryResult<CategorySummary, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.summary(categoryId || ''),
    queryFn: () => categoryGroupsApi.getSummary(categoryId || ''),
    enabled: isAuthReady && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get category analytics
 */
export function useCategoryAnalytics(
  categoryId: string | null,
  params?: {
    period?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    months?: number;
  }
): UseQueryResult<CategoryAnalytics, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.analytics(categoryId || '', params),
    queryFn: () => categoryGroupsApi.getAnalytics(categoryId || '', params),
    enabled: isAuthReady && !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get allocation history
 */
export function useAllocationHistory(
  categoryId: string | null,
  params?: {
    limit?: number;
    offset?: number;
  }
): UseQueryResult<any, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.allocationHistory(categoryId || '', params),
    queryFn: () => categoryGroupsApi.getAllocationHistory(categoryId || '', params),
    enabled: isAuthReady && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get spending history
 */
export function useSpendingHistory(
  categoryId: string | null,
  params?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
): UseQueryResult<any, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.spendingHistory(categoryId || '', params),
    queryFn: () => categoryGroupsApi.getSpendingHistory(categoryId || '', params),
    enabled: isAuthReady && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get monthly spending breakdown
 */
export function useMonthlySpending(
  categoryId: string | null,
  params?: {
    year?: number;
    month?: number;
  }
): UseQueryResult<any, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.monthlySpending(categoryId || '', params),
    queryFn: () => categoryGroupsApi.getMonthlySpending(categoryId || '', params),
    enabled: isAuthReady && !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// CATEGORY TEMPLATES QUERIES & MUTATIONS
// ============================================================================

/**
 * Get all available category templates for onboarding
 */
export function useCategoryTemplates(): UseQueryResult<any, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.templatesList(),
    queryFn: () => categoryGroupsApi.getTemplates(),
    enabled: isAuthReady,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Get detailed template information with all categories and groups
 */
export function useCategoryTemplate(templateId: string): UseQueryResult<any, unknown> {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: categoryGroupsKeys.templateDetail(templateId),
    queryFn: () => categoryGroupsApi.getTemplate(templateId),
    enabled: isAuthReady && !!templateId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Apply a category template to user's account
 */
export function useApplyCategoryTemplate(
  templateId: string
): UseMutationResult<any, unknown, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => categoryGroupsApi.applyTemplate(templateId),
    onSuccess: () => {
      // Invalidate category groups list to refetch with new template data
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.lists(),
      });
      // Invalidate categories list
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.categoriesList(),
      });
      // Invalidate categorized data
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.categoriesGrouped(),
      });
    },
  });
}
