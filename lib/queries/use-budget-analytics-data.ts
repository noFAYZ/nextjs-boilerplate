/**
 * Budget Analytics Data Hooks
 * Consumer hooks for analytics and metrics features
 */

import { useQuery } from '@tanstack/react-query';
import { budgetAnalyticsQueries } from './budget-analytics-queries';
import type {
  GetSpendingByCategoryParams,
  GetEnvelopeRankingParams,
} from '@/lib/types/budget-analytics';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';

/**
 * Helper to get organization ID from context store or explicit parameter
 */
function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}

/**
 * Get comprehensive dashboard metrics
 */
export function useDashboardMetrics(organizationId?: string, options?: Record<string, unknown>) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAnalyticsQueries.dashboardMetrics(orgId),
    enabled: isAuthReady && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Get spending breakdown by category
 */
export function useSpendingByCategory(
  params?: GetSpendingByCategoryParams,
  organizationId?: string,
  options?: Record<string, unknown>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAnalyticsQueries.spendingByCategory(params, orgId),
    enabled: isAuthReady && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Get period comparison (current vs previous)
 */
export function usePeriodComparison(organizationId?: string, options?: Record<string, unknown>) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAnalyticsQueries.periodComparison(orgId),
    enabled: isAuthReady && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Get envelope ranking by efficiency
 */
export function useEnvelopeRanking(
  params?: GetEnvelopeRankingParams,
  organizationId?: string,
  options?: Record<string, unknown>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAnalyticsQueries.envelopeRanking(params, orgId),
    enabled: isAuthReady && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Get spending velocity (daily, weekly, monthly)
 */
export function useSpendingVelocity(organizationId?: string, options?: Record<string, unknown>) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAnalyticsQueries.spendingVelocity(orgId),
    enabled: isAuthReady && (options?.enabled !== false),
    ...options,
  });
}

/**
 * Get financial health score (0-100)
 */
export function useFinancialHealthScore(organizationId?: string, options?: Record<string, unknown>) {
  const user = useAuthStore((state) => state.user);


  const isAuthReady = !!user;

  return useQuery({
    ...budgetAnalyticsQueries.healthScore(organizationId),
    enabled: isAuthReady && (options?.enabled !== false),
    ...options,
  });
}
