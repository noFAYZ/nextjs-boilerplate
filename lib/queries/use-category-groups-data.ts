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
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
  }
): UseQueryResult<{
  groups: CustomCategoryGroup[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}, unknown> {
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
): UseMutationResult<CustomCategoryGroup, unknown, {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}, unknown> {
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
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const oldData = old as { data?: CustomCategoryGroup[] };
          if (!oldData.data) return old;
          return {
            ...oldData,
            data: oldData.data.filter((g) => g.id !== groupId),
          };
        }
      );

      return { previousData };
    },
    onError: (err, variables, context: { previousData?: unknown } | undefined) => {
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
  {
    groupId: string;
    name: string;
    displayName?: string;
    description?: string;
    icon?: string;
    color?: string;
    emoji?: string;
    parentCategoryId?: string;
  },
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
): UseMutationResult<CustomCategory, unknown, {
  name?: string;
  displayName?: string;
  description?: string;
  icon?: string;
  color?: string;
  emoji?: string;
  isActive?: boolean;
  enableAlerts?: boolean;
  alert50Percent?: boolean;
  alert75Percent?: boolean;
  alert90Percent?: boolean;
  alertExceeded?: boolean;
}, unknown> {
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
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const oldData = old as { data?: Array<CustomCategoryGroup & { categories?: CustomCategory[] }> };
          if (!oldData.data) return old;
          return {
            ...oldData,
            data: oldData.data.map((group) => ({
              ...group,
              categories: (group.categories || []).filter((cat) => cat.id !== categoryId),
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (err, variables, context: { previousData?: unknown } | undefined) => {
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
): UseMutationResult<{
  categoryId: string;
  allocatedAmount: number;
  previousBalance: number;
  currentBalance: number;
  totalSpent: number;
  percentageUsed: number;
  allocation: AllocationHistory;
}, unknown, {
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
        queryClient.setQueryData(categoryGroupsKeys.balance(categoryId), (old: unknown) => {
          const oldBalance = old as CategoryBalance;
          return {
            ...oldBalance,
            balance: {
              ...oldBalance.balance,
              currentBalance: (oldBalance.balance?.currentBalance || 0) + newData.amount,
            },
          };
        });
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
    onError: (err, variables, context: { previousBalance?: unknown } | undefined) => {
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
): UseMutationResult<{
  categoryId: string;
  allocatedAmount: number;
  previousBalance: number;
  totalSpent: number;
  currentBalance: number;
  percentageUsed: number;
  spending: SpendingRecord;
  alerts: Array<unknown>;
}, unknown, {
  amount: number;
  description: string;
  merchantName?: string;
  transactionDate?: string;
  sourceType?: string;
  sourceId?: string;
  notes?: string;
  tags?: string[];
}, unknown> {
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
        queryClient.setQueryData(categoryGroupsKeys.balance(categoryId), (old: unknown) => {
          const oldBalance = old as CategoryBalance;
          const newTotalSpent = (oldBalance.balance?.totalSpent || 0) + newSpending.amount;
          return {
            ...oldBalance,
            balance: {
              ...oldBalance.balance,
              totalSpent: newTotalSpent,
              currentBalance: (oldBalance.balance?.currentBalance || 0) - newSpending.amount,
              percentageUsed: (newTotalSpent / (oldBalance.balance?.allocatedAmount || 1)) * 100,
              isExceeded: newTotalSpent > (oldBalance.balance?.allocatedAmount || 0),
            },
          };
        });
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
    onError: (err, variables, context: { previousBalance?: unknown } | undefined) => {
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
): UseMutationResult<{
  categoryId: string;
  previousAllocation: number;
  newAllocation: number;
  difference: number;
  currentBalance: number;
  reason?: string;
  updatedAt: string;
}, unknown, {
  newAmount: number;
  reason?: string;
  description?: string;
}, unknown> {
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
export function useTransferFunds(): UseMutationResult<{
  transfer: {
    fromCategory: {
      id: string;
      name: string;
      previousBalance: number;
      newBalance: number;
    };
    toCategory: {
      id: string;
      name: string;
      previousBalance: number;
      newBalance: number;
    };
    amount: number;
    reason?: string;
    timestamp: string;
  };
}, unknown, {
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
export function useBulkAllocate(): UseMutationResult<{
  totalAllocated: number;
  allocations: Array<{
    categoryId: string;
    amount: number;
    status: string;
    previousBalance: number;
    newBalance: number;
  }>;
}, unknown, {
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
): UseQueryResult<{
  categoryId: string;
  allocations: AllocationHistory[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}, unknown> {
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
): UseQueryResult<{
  categoryId: string;
  spending: SpendingRecord[];
  summary: {
    totalSpent: number;
    transactionCount: number;
    averageTransaction: number;
    largestTransaction: number;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}, unknown> {
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
): UseQueryResult<{
  categoryId: string;
  name: string;
  month: string;
  allocatedAmount: number;
  totalSpent: number;
  transactions: Array<{
    date: string;
    amount: number;
    merchant: string;
    description: string;
    type: string;
  }>;
  daily: Array<{
    date: string;
    amount: number;
    balance: number;
    percentageUsed: number;
  }>;
}, unknown> {
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
export function useCategoryTemplates(): UseQueryResult<{
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    groupCount: number;
    categoryCount: number;
  }>;
  meta: {
    timestamp: string;
    count: number;
  };
}, unknown> {
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
export function useCategoryTemplate(templateId: string): UseQueryResult<{
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    icon: string;
    groups: Array<{
      name: string;
      description: string;
      sortOrder: number;
      categories: Array<{
        name: string;
        description?: string;
        icon?: string;
        color?: string;
        categoryType: 'ENVELOPE' | 'TRANSACTION';
        cycleType?: string;
        purpose?: string[];
      }>;
    }>;
  };
}, unknown> {
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
): UseMutationResult<{
  success: boolean;
  data: {
    templateId: string;
    groupsCreated: number;
    categoriesCreated: number;
    message: string;
  };
  meta: {
    timestamp: string;
  };
}, unknown, void, unknown> {
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
