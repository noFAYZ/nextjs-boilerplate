import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { budgetApi } from '@/lib/services/budget-api';
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
  budgets: (params?: GetBudgetsParams, orgId?: string) => ({
    queryKey: budgetKeys.list(params, orgId),
    queryFn: () => budgetApi.getBudgets(params, orgId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3, // 3 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    select: (data: BudgetsResponse) => data.success ? data : { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } },
  }),

  // Get single budget
  budget: (id: string, params?: GetBudgetParams, orgId?: string) => ({
    queryKey: budgetKeys.detail(id, params, orgId),
    queryFn: () => budgetApi.getBudget(id, params, orgId),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    select: (data: BudgetResponse) => data.success ? data.data : null,
  }),

  // Get budget analytics
  analytics: (orgId?: string) => ({
    queryKey: budgetKeys.analytics(orgId),
    queryFn: () => budgetApi.getBudgetAnalytics(orgId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    select: (data: BudgetAnalyticsResponse) => data.success ? data.data : null,
  }),

  // Get budget summary
  summary: () => ({
    queryKey: budgetKeys.summary(),
    queryFn: () => budgetApi.getBudgetSummary(),
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

        // If the API call succeeded but the response indicates failure, throw the full response
        if (!response.success) {
          throw response;
        }

        return response;
      },
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate all budget queries
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error) => {
        console.error('Failed to create budget:', error);
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

        // Snapshot previous value
        const previousBudget = queryClient.getQueryData(budgetKeys.detail(id));

        // Optimistically update budget
        queryClient.setQueryData(budgetKeys.detail(id), (old: BudgetResponse | undefined) => {
          if (!old || !old.success) return old;
          return {
            ...old,
            data: { ...old.data, ...updates },
          };
        });

        return { previousBudget };
      },
      onSuccess: (response, variables) => {
        if (response.success) {
          // Update the specific budget query
          queryClient.setQueryData(budgetKeys.detail(variables.id), response);

          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error, variables, context) => {
        // Rollback optimistic update on error
        if (context?.previousBudget) {
          queryClient.setQueryData(budgetKeys.detail(variables.id), context.previousBudget);
        }
        console.error('Failed to update budget:', error);
      },
    });
  },

  // Delete budget
  useDeleteBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.deleteBudget(budgetId),
      onSuccess: (response, budgetId) => {
        if (response.success) {
          // Remove budget detail from cache
          queryClient.removeQueries({ queryKey: budgetKeys.detail(budgetId) });
          queryClient.removeQueries({ queryKey: budgetKeys.transactions(budgetId) });

          // Invalidate list and analytics
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error) => {
        console.error('Failed to delete budget:', error);
      },
    });
  },

  // Refresh budget
  useRefreshBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.refreshBudget(budgetId),
      onSuccess: (response, budgetId) => {
        if (response.success) {
          // Invalidate the budget detail to refresh spending data
          queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
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
      onSuccess: (response, budgetId) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error) => {
        console.error('Failed to archive budget:', error);
      },
    });
  },

  // Unarchive budget
  useUnarchiveBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.unarchiveBudget(budgetId),
      onSuccess: (response, budgetId) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error) => {
        console.error('Failed to unarchive budget:', error);
      },
    });
  },

  // Pause budget
  usePauseBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.pauseBudget(budgetId),
      onSuccess: (response, budgetId) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error) => {
        console.error('Failed to pause budget:', error);
      },
    });
  },

  // Resume budget
  useResumeBudget: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (budgetId: string) => budgetApi.resumeBudget(budgetId),
      onSuccess: (response, budgetId) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
        }
      },
      onError: (error) => {
        console.error('Failed to resume budget:', error);
      },
    });
  },

  // Add budget transaction
  useAddBudgetTransaction: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ budgetId, transaction }: { budgetId: string; transaction: AddBudgetTransactionRequest }) =>
        budgetApi.addBudgetTransaction(budgetId, transaction),
      onSuccess: (response, variables) => {
        if (response.success) {
          // Invalidate budget to refresh spending
          queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.budgetId) });
          queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
          queryClient.invalidateQueries({ queryKey: budgetKeys.transactions(variables.budgetId) });
        }
      },
      onError: (error) => {
        console.error('Failed to add budget transaction:', error);
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
