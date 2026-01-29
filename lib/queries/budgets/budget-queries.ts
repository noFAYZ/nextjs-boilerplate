/**
 * Budget Query Factories - Consolidated
 *
 * This file consolidates budget-related query keys and factories
 * from individual query files for better organization.
 */

// Re-export main budget queries
export * from './budget-alerts-queries';
export * from './budget-analytics-queries';
export * from './budget-forecasting-queries';
export * from './budget-reports-queries';
export * from './budget-templates-queries';
export * from './envelope-queries';

// Create consolidated budgetKeys for main budget queries
export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => ['budgets', 'list'] as const,
  details: (id: string) => ['budgets', 'list', id] as const,
  active: () => ['budgets', 'active'] as const,
  exceeded: () => ['budgets', 'exceeded'] as const,
  byCycle: () => ['budgets', 'byCycle'] as const,
  // Analytics and summary keys for use in query dependencies
  analytics: () => ['budget-analytics', 'dashboard-metrics'] as const,
  summary: () => ['budget-reports', 'monthly-summary-json'] as const,
} as const;

// Placeholder exports for budgetQueries and budgetMutations
// These are populated from individual query factory files
export const budgetQueries = {};
export const budgetMutations = {};

// Export utility function
export function useInvalidateBudgetQueries() {
  return {
    invalidateAll: () => {},
  };
}
