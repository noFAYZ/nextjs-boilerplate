/**
 * Budget Forecasting Query Factories
 * Defines query keys and options for TanStack Query
 */

import { queryOptions } from '@tanstack/react-query';
import { budgetForecastingApi } from '@/lib/services/budget-forecasting-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  GetEnvelopeForecastParams,
  GetBudgetForecastParams,
} from '@/lib/types/budget-forecasting';

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
 * Query key factory for budget forecasting queries
 */
export const budgetForecastingKeys = {
  all: ['budget-forecasting'] as const,

  // Envelope forecasts
  envelopes: (orgId?: string) => [...budgetForecastingKeys.all, 'envelopes', orgId] as const,
  envelope: (envelopeId: string, orgId?: string) =>
    [...budgetForecastingKeys.envelopes(orgId), envelopeId] as const,
  envelopeForecast: (envelopeId: string, params?: GetEnvelopeForecastParams, orgId?: string) =>
    [...budgetForecastingKeys.envelope(envelopeId, orgId), 'forecast', params] as const,
  envelopeInsights: (envelopeId: string, orgId?: string) =>
    [...budgetForecastingKeys.envelope(envelopeId, orgId), 'insights'] as const,

  // Budget forecasts
  budgets: (orgId?: string) => [...budgetForecastingKeys.all, 'budgets', orgId] as const,
  budget: (budgetId: string, orgId?: string) =>
    [...budgetForecastingKeys.budgets(orgId), budgetId] as const,
  budgetForecast: (budgetId: string, params?: GetBudgetForecastParams, orgId?: string) =>
    [...budgetForecastingKeys.budget(budgetId, orgId), 'forecast', params] as const,
} as const;

/**
 * Query options factory for budget forecasting queries
 */
export const budgetForecastingQueries = {
  /**
   * Get envelope forecast
   */
  envelopeForecast: (envelopeId: string, params?: GetEnvelopeForecastParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetForecastingKeys.envelopeForecast(envelopeId, params, orgId),
      queryFn: () => budgetForecastingApi.getEnvelopeForecast(envelopeId, { ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 5 * 60 * 1000, // 5 minutes - forecasts don't change that often
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),

  /**
   * Get spending insights for an envelope
   */
  envelopeInsights: (envelopeId: string, orgId?: string) =>
    queryOptions({
      queryKey: budgetForecastingKeys.envelopeInsights(envelopeId, orgId),
      queryFn: () => budgetForecastingApi.getSpendingInsights(envelopeId, getCurrentOrganizationId(orgId)),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),

  /**
   * Get budget forecast
   */
  budgetForecast: (budgetId: string, params?: GetBudgetForecastParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetForecastingKeys.budgetForecast(budgetId, params, orgId),
      queryFn: () => budgetForecastingApi.getBudgetForecast(budgetId, { ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),
} as const;

/**
 * Mutation factory for budget forecasting mutations
 */
export const budgetForecastingMutations = {
  forecastSpending: {
    mutationFn: budgetForecastingApi.forecastSpending.bind(budgetForecastingApi),
  },
} as const;
