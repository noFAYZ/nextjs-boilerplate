import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  queryOptions,
} from '@tanstack/react-query';
import { budgetApi } from '@/lib/services/budget-api';
import { invalidateByDependency } from '@/lib/query-invalidation';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  Budget,
  BudgetAnalytics,
  BudgetSummary,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  GetBudgetsParams,
  GetBudgetParams,
  AddBudgetTransactionRequest,
  BudgetsResponse,
  BudgetResponse,
  BudgetAnalyticsResponse,
  BudgetSummaryResponse,
} from '@/lib/types/budget';

/**
 * Helper to get current organization ID from store
 * Uses .getState() to access state outside of React components
 */
function getCurrentOrganizationId(explicitOrgId?: string): string | undefined {
  if (explicitOrgId) return explicitOrgId;
  try {
    const orgId = useOrganizationStore.getState().selectedOrganizationId;
    return orgId || undefined;
  } catch {
    return undefined;
  }
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const budgetKeys = {
  all: ['budgets'] as const,

  // Budget lists
  lists: (orgId?: string) => [...budgetKeys.all, 'list', orgId] as const,
  list: (params?: GetBudgetsParams, orgId?: string) => [...budgetKeys.lists(orgId), params] as const,

  // Single budget
  details: (orgId?: string) => [...budgetKeys.all, 'detail', orgId] as const,
  detail: (id: string, params?: GetBudgetParams, orgId?: string) =>
    [...budgetKeys.details(orgId), id, params] as const,

  // Analytics & Summary
  analytics: (orgId?: string) => [...budgetKeys.all, 'analytics', orgId] as const,
  summary: (orgId?: string) => [...budgetKeys.all, 'summary', orgId] as const,

  // Transactions
  transactions: (budgetId: string, orgId?: string) =>
    [...budgetKeys.all, 'transactions', budgetId, orgId] as const,
};

// ============================================================================
// QUERY OPTIONS FACTORY
// ============================================================================

export const budgetQueries = {
  // Get all budgets
  budgets: (params?: GetBudgetsParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetKeys.list(params, orgId),
      queryFn: () =>
        budgetApi.getBudgets(
          { ...params, organizationId: getCurrentOrganizationId(orgId) },
        ),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 3, // 3 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      select: (data: BudgetsResponse) => data.success ? data : { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } },
    }),

  // Get single budget
  budget: (id: string, params?: GetBudgetParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetKeys.detail(id, params, orgId),
      queryFn: () =>
        budgetApi.getBudget(id, { ...params, organizationId: getCurrentOrganizationId(orgId) }),
      enabled: !!id,
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      select: (data: BudgetResponse) => data.success ? data.data : null,
    }),

  // Get budget analytics
  analytics: (orgId?: string) =>
    queryOptions({
      queryKey: budgetKeys.analytics(orgId),
      queryFn: () =>
        budgetApi.getBudgetAnalytics(getCurrentOrganizationId(orgId)),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      select: (data: BudgetAnalyticsResponse) => data.success ? data.data : null,
    }),

  // Get budget summary
  summary: (orgId?: string) =>
    queryOptions({
      queryKey: budgetKeys.summary(orgId),
      queryFn: () =>
        budgetApi.getBudgetSummary(getCurrentOrganizationId(orgId)),
      staleTime: 1000 * 60 * 3, // 3 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      select: (data: BudgetSummaryResponse) => data.success ? data.data : null,
    }),
};

// ============================================================================
// MUTATIONS
// ============================================================================

export const budgetMutations = {
  // Create budget
  useCreateBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateBudgetRequest) => {
        const response = await budgetApi.createBudget(data);
        if (!response.success) throw response;
        return response;
      },
      onMutate: async (newBudget) => {
        // Cancel refetches
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
        await queryClient.cancelQueries({ queryKey: budgetKeys.analytics() });
        await queryClient.cancelQueries({ queryKey: budgetKeys.summary() });

        // Get previous data
        const previousLists = queryClient.getQueryData(budgetKeys.lists());
        const previousAnalytics = queryClient.getQueryData(budgetKeys.analytics());
        const previousSummary = queryClient.getQueryData(budgetKeys.summary());

        // Optimistically add to lists
        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: [
              { ...newBudget, id: `temp-${Date.now()}`, createdAt: new Date() },
              ...(Array.isArray(old.data) ? old.data : []),
            ],
          }));
        }

        return { previousLists, previousAnalytics, previousSummary };
      },
      onError: (error, variables, context) => {
        console.error('Failed to create budget:', error);
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
        if (context?.previousAnalytics) {
          queryClient.setQueryData(budgetKeys.analytics(), context.previousAnalytics);
        }
        if (context?.previousSummary) {
          queryClient.setQueryData(budgetKeys.summary(), context.previousSummary);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:create');
      },
    });
  },

  // Update budget
  useUpdateBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: UpdateBudgetRequest }) =>
        budgetApi.updateBudget(id, updates),
      onMutate: async ({ id, updates }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: budgetKeys.detail(id) });
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });

        // Snapshot previous values
        const previousBudget = queryClient.getQueryData(budgetKeys.detail(id));
        const previousLists = queryClient.getQueryData(budgetKeys.lists());

        // Optimistically update detail
        queryClient.setQueryData(budgetKeys.detail(id), (old: BudgetResponse | undefined) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            data: { ...old.data, ...updates },
          };
        });

        // Optimistically update list
        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: old.data.map((budget: any) =>
              budget.id === id ? { ...budget, ...updates } : budget
            ),
          }));
        }

        return { previousBudget, previousLists };
      },
      onError: (error, variables, context) => {
        console.error('Failed to update budget:', error);
        if (context?.previousBudget) {
          queryClient.setQueryData(budgetKeys.detail(variables.id), context.previousBudget);
        }
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:update');
      },
    });
  },

  // Delete budget
  useDeleteBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.deleteBudget(budgetId),
      onMutate: async (budgetId) => {
        // Cancel refetches
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
        await queryClient.cancelQueries({ queryKey: budgetKeys.detail(budgetId) });

        // Get previous data
        const previousLists = queryClient.getQueryData(budgetKeys.lists());

        // Optimistically remove from list
        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: old.data.filter((budget: any) => budget.id !== budgetId),
          }));
        }

        // Clear detail cache
        queryClient.removeQueries({ queryKey: budgetKeys.detail(budgetId) });
        queryClient.removeQueries({ queryKey: budgetKeys.transactions(budgetId) });

        return { previousLists };
      },
      onError: (error, budgetId, context) => {
        console.error('Failed to delete budget:', error);
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:delete');
      },
    });
  },

  // Refresh budget
  useRefreshBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.refreshBudget(budgetId),
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:refresh');
      },
      onError: (error) => {
        console.error('Failed to refresh budget:', error);
      },
    });
  },

  // Archive budget
  useArchiveBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.archiveBudget(budgetId),
      onMutate: async (budgetId) => {
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
        const previousLists = queryClient.getQueryData(budgetKeys.lists());

        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: old.data.map((budget: any) =>
              budget.id === budgetId ? { ...budget, isArchived: true } : budget
            ),
          }));
        }

        return { previousLists };
      },
      onError: (error, budgetId, context) => {
        console.error('Failed to archive budget:', error);
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:archive');
      },
    });
  },

  // Unarchive budget
  useUnarchiveBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.unarchiveBudget(budgetId),
      onMutate: async (budgetId) => {
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
        const previousLists = queryClient.getQueryData(budgetKeys.lists());

        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: old.data.map((budget: any) =>
              budget.id === budgetId ? { ...budget, isArchived: false } : budget
            ),
          }));
        }

        return { previousLists };
      },
      onError: (error, budgetId, context) => {
        console.error('Failed to unarchive budget:', error);
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:unarchive');
      },
    });
  },

  // Pause budget
  usePauseBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.pauseBudget(budgetId),
      onMutate: async (budgetId) => {
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
        const previousLists = queryClient.getQueryData(budgetKeys.lists());

        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: old.data.map((budget: any) =>
              budget.id === budgetId ? { ...budget, isPaused: true } : budget
            ),
          }));
        }

        return { previousLists };
      },
      onError: (error, budgetId, context) => {
        console.error('Failed to pause budget:', error);
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:pause');
      },
    });
  },

  // Resume budget
  useResumeBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.resumeBudget(budgetId),
      onMutate: async (budgetId) => {
        await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });
        const previousLists = queryClient.getQueryData(budgetKeys.lists());

        if (previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), (old: any) => ({
            ...old,
            data: old.data.map((budget: any) =>
              budget.id === budgetId ? { ...budget, isPaused: false } : budget
            ),
          }));
        }

        return { previousLists };
      },
      onError: (error, budgetId, context) => {
        console.error('Failed to resume budget:', error);
        if (context?.previousLists) {
          queryClient.setQueryData(budgetKeys.lists(), context.previousLists);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:resume');
      },
    });
  },

  // Add budget transaction
  useAddBudgetTransaction: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ budgetId, transaction }: { budgetId: string; transaction: AddBudgetTransactionRequest }) =>
        budgetApi.addBudgetTransaction(budgetId, transaction),
      onMutate: async ({ budgetId }) => {
        // Cancel refetches
        await queryClient.cancelQueries({ queryKey: budgetKeys.detail(budgetId) });
        await queryClient.cancelQueries({ queryKey: budgetKeys.transactions(budgetId) });

        // Get previous data
        const previousBudget = queryClient.getQueryData(budgetKeys.detail(budgetId));
        const previousTransactions = queryClient.getQueryData(budgetKeys.transactions(budgetId));

        return { previousBudget, previousTransactions };
      },
      onError: (error, variables, context) => {
        console.error('Failed to add budget transaction:', error);
        if (context?.previousBudget) {
          queryClient.setQueryData(budgetKeys.detail(variables.budgetId), context.previousBudget);
        }
        if (context?.previousTransactions) {
          queryClient.setQueryData(budgetKeys.transactions(variables.budgetId), context.previousTransactions);
        }
      },
      onSuccess: () => {
        invalidateByDependency(queryClient, 'budgets:addTransaction');
      },
    });
  },
};

// ============================================================================
// CUSTOM INVALIDATION HOOKS
// ============================================================================

export const useInvalidateBudgetQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
    invalidateBudgets: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
    },
    invalidateBudget: (budgetId: string) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
    },
    invalidateAnalytics: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
    },
    invalidateSummary: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
    },
  };
};
