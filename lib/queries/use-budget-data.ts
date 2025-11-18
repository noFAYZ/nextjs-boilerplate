/**
 * Budget Data Hooks
 *
 * PURPOSE: Consolidated, production-grade React Query hooks for budget data
 * - Single source of truth for ALL budget server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: budgets, isLoading } = useBudgets();
 * const { mutate: createBudget } = useCreateBudget();
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import { budgetKeys, budgetQueries, budgetMutations } from './budget-queries';
import { useAuthStore } from '@/lib/stores/auth-store';
import type {
  GetBudgetsParams,
  GetBudgetParams,
  BudgetSourceType,
} from '@/lib/types/budget';

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
// BUDGET QUERIES
// ============================================================================

/**
 * Get all budgets with filtering, sorting, and pagination
 * @param params - Budget filter and pagination parameters
 * @returns Budgets with pagination and loading/error states
 */
export function useBudgets(params?: GetBudgetsParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...budgetQueries.budgets(params),
    enabled: isAuthReady,
  });
}

/**
 * Get a single budget by ID
 * @param budgetId - Budget ID to fetch
 * @param params - Include options for periods, alerts, transactions
 * @returns Budget data with loading/error states
 */
export function useBudget(budgetId: string | null, params?: GetBudgetParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...budgetQueries.budget(budgetId!, params),
    enabled: isAuthReady && !!budgetId,
  });
}

/**
 * Get active budgets only (convenience hook)
 * @returns Active budgets with loading/error states
 */
export function useActiveBudgets() {
  return useBudgets({ isActive: true, includeArchived: false });
}

/**
 * Get exceeded budgets (convenience hook)
 * @returns Exceeded budgets with loading/error states
 */
export function useExceededBudgets() {
  return useBudgets({ isExceeded: true, isActive: true });
}

/**
 * Get budgets by cycle (convenience hook)
 * @param cycle - Budget cycle (WEEKLY, MONTHLY, QUARTERLY, YEARLY)
 * @returns Budgets filtered by cycle
 */
export function useBudgetsByCycle(cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') {
  return useBudgets({ cycle, isActive: true });
}

/**
 * Get budgets by source type (convenience hook)
 * @param sourceType - Budget source type
 * @returns Budgets filtered by source type
 */
export function useBudgetsBySource(sourceType: string) {
  return useBudgets({ sourceType: sourceType as BudgetSourceType, isActive: true });
}

/**
 * Get budgets for a specific category
 * @param categoryId - Category ID
 * @returns Budgets linked to the category
 */
export function useBudgetsByCategory(categoryId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...budgetQueries.budgets({ categoryId: categoryId! }),
    enabled: isAuthReady && !!categoryId,
  });
}

/**
 * Get budgets for a specific bank account
 * @param accountId - Account ID
 * @returns Budgets linked to the account
 */
export function useBudgetsByAccount(accountId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...budgetQueries.budgets({ accountId: accountId! }),
    enabled: isAuthReady && !!accountId,
  });
}

// ============================================================================
// ANALYTICS & SUMMARY QUERIES
// ============================================================================

/**
 * Get comprehensive budget analytics
 * @returns Budget analytics with loading/error states
 */
export function useBudgetAnalytics() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...budgetQueries.analytics(),
    enabled: isAuthReady,
  });
}

/**
 * Get budget summary (lighter weight than analytics)
 * @returns Budget summary with loading/error states
 */
export function useBudgetSummary() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...budgetQueries.summary(),
    enabled: isAuthReady,
  });
}

// ============================================================================
// BUDGET MUTATIONS (CRUD OPERATIONS)
// ============================================================================

/**
 * Create a new budget
 * @returns Mutation hook with optimistic updates
 */
export const useCreateBudget = budgetMutations.useCreateBudget;

/**
 * Update an existing budget
 * @returns Mutation hook with optimistic updates
 */
export const useUpdateBudget = budgetMutations.useUpdateBudget;

/**
 * Delete a budget permanently
 * @returns Mutation hook with cache cleanup
 */
export const useDeleteBudget = budgetMutations.useDeleteBudget;

// ============================================================================
// BUDGET OPERATION MUTATIONS
// ============================================================================

/**
 * Refresh budget spending from transactions
 * @returns Mutation hook to recalculate spending
 */
export const useRefreshBudget = budgetMutations.useRefreshBudget;

/**
 * Archive a budget
 * @returns Mutation hook to archive budget
 */
export const useArchiveBudget = budgetMutations.useArchiveBudget;

/**
 * Unarchive a budget
 * @returns Mutation hook to unarchive budget
 */
export const useUnarchiveBudget = budgetMutations.useUnarchiveBudget;

/**
 * Pause a budget
 * @returns Mutation hook to pause budget
 */
export const usePauseBudget = budgetMutations.usePauseBudget;

/**
 * Resume a paused budget
 * @returns Mutation hook to resume budget
 */
export const useResumeBudget = budgetMutations.useResumeBudget;

/**
 * Add a manual transaction to a budget
 * @returns Mutation hook to add transaction
 */
export const useAddBudgetTransaction = budgetMutations.useAddBudgetTransaction;

// ============================================================================
// EXPORT ALL INVALIDATION UTILITIES
// ============================================================================

export { useInvalidateBudgetQueries } from './budget-queries';
