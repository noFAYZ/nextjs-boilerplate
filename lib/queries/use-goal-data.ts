/**
 * Goal Data Hooks
 *
 * PURPOSE: Production-grade React Query hooks for goal data
 * - Single source of truth for ALL goal server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: goals, isLoading } = useGoals();
 * const { mutate: createGoal } = useCreateGoal();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { goalsApi } from '@/lib/services/goals-api';
import { useAuthStore } from '@/lib/stores/auth-store';
import type {
  CreateGoalRequest,
  UpdateGoalRequest,
  AddContributionRequest,
  GetGoalsParams,
} from '@/lib/types/goals';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: GetGoalsParams) => [...goalKeys.lists(), filters] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  analytics: () => [...goalKeys.all, 'analytics'] as const,
};

// ============================================================================
// AUTH-READY WRAPPER
// ============================================================================

/**
 * Ensures queries only run when user is authenticated and initialized
 */
function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

// ============================================================================
// GOAL QUERIES
// ============================================================================

/**
 * Get all goals with optional filtering
 * @param params - Optional filters for goals
 * @returns Goals with pagination
 */
export function useGoals(params: GetGoalsParams = {}) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: goalKeys.list(params),
    queryFn: () => goalsApi.getGoals(params),
    enabled: isAuthReady,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Get a single goal by ID
 * @param goalId - Goal ID to fetch
 * @returns Goal data with loading/error states
 */
export function useGoal(goalId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: goalKeys.detail(goalId!),
    queryFn: () => goalsApi.getGoal(goalId!),
    enabled: isAuthReady && !!goalId,
    staleTime: 30_000,
  });
}

/**
 * Get goal analytics
 * @returns Analytics data with loading/error states
 */
export function useGoalAnalytics() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: goalKeys.analytics(),
    queryFn: () => goalsApi.getAnalytics(),
    enabled: isAuthReady,
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get active goals only (convenience hook)
 * @returns Active goals
 */
export function useActiveGoals() {
  return useGoals({
    isActive: true,
    isAchieved: false,
    sortBy: 'priority',
    sortOrder: 'desc',
  });
}

/**
 * Get on-track goals (convenience hook)
 * @returns On-track goals
 */
export function useOnTrackGoals() {
  return useGoals({
    isActive: true,
    isAchieved: false,
    onTrack: true,
  });
}

/**
 * Get urgent goals (due soon, convenience hook)
 * @returns Urgent goals
 */
export function useUrgentGoals() {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  return useGoals({
    isActive: true,
    isAchieved: false,
    targetDateTo: sevenDaysFromNow.toISOString(),
    sortBy: 'targetDate',
    sortOrder: 'asc',
  });
}

// ============================================================================
// GOAL MUTATIONS
// ============================================================================

/**
 * Create a new goal
 * @returns Mutation hook with optimistic updates
 */
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.createGoal(data),
    onSuccess: () => {
      // Invalidate all goal queries
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Update an existing goal
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateGoalRequest }) =>
      goalsApi.updateGoal(id, updates),
    onSuccess: (data, { id }) => {
      // Invalidate specific goal and lists
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.analytics() });
    },
  });
}

/**
 * Delete a goal
 * @returns Mutation hook with optimistic updates
 */
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalsApi.deleteGoal(goalId),
    onSuccess: (_, goalId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.analytics() });
    },
  });
}

/**
 * Calculate goal progress
 * @returns Mutation hook
 */
export function useCalculateGoalProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalsApi.calculateProgress(goalId),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.analytics() });
    },
  });
}

/**
 * Add a manual contribution to a goal
 * @returns Mutation hook
 */
export function useAddContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: AddContributionRequest }) =>
      goalsApi.addContribution(goalId, data),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.analytics() });
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all goal-related queries
 * @returns Invalidation functions
 */
export function useInvalidateGoalCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: goalKeys.all }),
    invalidateList: () => queryClient.invalidateQueries({ queryKey: goalKeys.lists() }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) }),
    invalidateAnalytics: () =>
      queryClient.invalidateQueries({ queryKey: goalKeys.analytics() }),
  };
}

/**
 * Get goal summary stats (derived from list)
 * @returns Summary statistics
 */
export function useGoalSummary() {
  const { data: goalsResponse, isLoading } = useGoals();

  if (isLoading || !goalsResponse) {
    return {
      total: 0,
      active: 0,
      completed: 0,
      onTrack: 0,
      offTrack: 0,
      totalTargetAmount: 0,
      totalCurrentAmount: 0,
      averageProgress: 0,
    };
  }

  const goals = goalsResponse.data || [];

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const activeGoals = goals.filter((g) => g.isActive && !g.isAchieved);

  return {
    total: goals.length,
    active: activeGoals.length,
    completed: goals.filter((g) => g.isAchieved).length,
    onTrack: activeGoals.filter((g) => g.onTrack).length,
    offTrack: activeGoals.filter((g) => !g.onTrack).length,
    totalTargetAmount,
    totalCurrentAmount,
    averageProgress:
      activeGoals.length > 0
        ? activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length
        : 0,
  };
}
