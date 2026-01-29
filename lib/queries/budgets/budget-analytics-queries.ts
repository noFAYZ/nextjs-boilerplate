/**
 * Budget Analytics Query Factories
 * Defines query keys and options for TanStack Query
 */

import { queryOptions } from '@tanstack/react-query';
import { budgetAnalyticsApi } from '@/lib/services/budget-analytics-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  GetSpendingByCategoryParams,
  GetEnvelopeRankingParams,
} from '@/lib/types/budget-analytics';

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

/**
 * Query key factory for budget analytics queries
 */
export const budgetAnalyticsKeys = {
  all: ['budget-analytics'] as const,
  dashboardMetrics: (orgId?: string) => [...budgetAnalyticsKeys.all, 'dashboard-metrics', orgId] as const,
  spendingByCategory: (params?: GetSpendingByCategoryParams, orgId?: string) =>
    [...budgetAnalyticsKeys.all, 'spending-by-category', params, orgId] as const,
  periodComparison: (orgId?: string) => [...budgetAnalyticsKeys.all, 'period-comparison', orgId] as const,
  envelopeRanking: (params?: GetEnvelopeRankingParams, orgId?: string) =>
    [...budgetAnalyticsKeys.all, 'envelope-ranking', params, orgId] as const,
  spendingVelocity: (orgId?: string) => [...budgetAnalyticsKeys.all, 'spending-velocity', orgId] as const,
  healthScore: (orgId?: string) => [...budgetAnalyticsKeys.all, 'health-score', orgId] as const,
} as const;

/**
 * Query options factory for budget analytics queries
 */
export const budgetAnalyticsQueries = {
  /**
   * Get comprehensive dashboard metrics
   */
  dashboardMetrics: (orgId?: string) =>
    queryOptions({
      queryKey: budgetAnalyticsKeys.dashboardMetrics(orgId),
      queryFn: () => budgetAnalyticsApi.getDashboardMetrics(getCurrentOrganizationId(orgId)),
      staleTime: 1 * 60 * 1000, // 1 minute
      gcTime: 15 * 60 * 1000, // 15 minutes
    }),

  /**
   * Get spending breakdown by category
   */
  spendingByCategory: (params?: GetSpendingByCategoryParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetAnalyticsKeys.spendingByCategory(params, orgId),
      queryFn: () => budgetAnalyticsApi.getSpendingByCategory({
        ...params,
        organizationId: getCurrentOrganizationId(orgId),
      }),
      staleTime: 1 * 60 * 1000, // 1 minute
      gcTime: 15 * 60 * 1000, // 15 minutes
    }),

  /**
   * Get period comparison (current vs previous)
   */
  periodComparison: (orgId?: string) =>
    queryOptions({
      queryKey: budgetAnalyticsKeys.periodComparison(orgId),
      queryFn: () => budgetAnalyticsApi.getPeriodComparison(getCurrentOrganizationId(orgId)),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),

  /**
   * Get envelope ranking by efficiency
   */
  envelopeRanking: (params?: GetEnvelopeRankingParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetAnalyticsKeys.envelopeRanking(params, orgId),
      queryFn: () => budgetAnalyticsApi.getEnvelopeRanking({
        ...params,
        organizationId: getCurrentOrganizationId(orgId),
      }),
      staleTime: 1 * 60 * 1000, // 1 minute
      gcTime: 15 * 60 * 1000, // 15 minutes
    }),

  /**
   * Get spending velocity (daily, weekly, monthly)
   */
  spendingVelocity: (orgId?: string) =>
    queryOptions({
      queryKey: budgetAnalyticsKeys.spendingVelocity(orgId),
      queryFn: () => budgetAnalyticsApi.getSpendingVelocity(getCurrentOrganizationId(orgId)),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),

  /**
   * Get financial health score (0-100)
   */
  healthScore: (orgId?: string) =>
    queryOptions({
      queryKey: budgetAnalyticsKeys.healthScore(orgId),
      queryFn: () => budgetAnalyticsApi.getFinancialHealthScore(getCurrentOrganizationId(orgId)),
      staleTime: 10 * 60 * 1000, // 10 minutes - doesn't change that often
      gcTime: 60 * 60 * 1000, // 1 hour
    }),
} as const;
