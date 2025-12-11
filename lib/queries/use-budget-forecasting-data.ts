/**
 * Budget Forecasting Data Hooks
 * Consumer hooks for budget forecasting features
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  budgetForecastingQueries,
  budgetForecastingKeys,
  budgetForecastingMutations,
} from './budget-forecasting-queries';
import type {
  GetEnvelopeForecastParams,
  GetBudgetForecastParams,
  GetEnvelopeForecastResponse,
  GetBudgetForecastResponse,
  GetEnvelopeInsightsResponse,
} from '@/lib/types/budget-forecasting';
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
 * Get forecast for a specific envelope
 */
export function useEnvelopeForecast(
  envelopeId?: string,
  daysAhead?: number,
  organizationId?: string,
  options?: Omit<UseQueryOptions<GetEnvelopeForecastResponse>, 'queryKey' | 'queryFn'>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  const params: GetEnvelopeForecastParams = {
    daysAhead: daysAhead ?? 30,
  };

  return useQuery({
    ...budgetForecastingQueries.envelopeForecast(envelopeId || '', params, orgId),
    enabled: isAuthReady && !!envelopeId && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get forecast for a specific budget
 */
export function useBudgetForecast(
  budgetId?: string,
  daysAhead?: number,
  organizationId?: string,
  options?: Omit<UseQueryOptions<GetBudgetForecastResponse>, 'queryKey' | 'queryFn'>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  const params: GetBudgetForecastParams = {
    daysAhead: daysAhead ?? 30,
  };

  return useQuery({
    ...budgetForecastingQueries.budgetForecast(budgetId || '', params, orgId),
    enabled: isAuthReady && !!budgetId && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get spending insights for an envelope
 */
export function useSpendingInsights(
  envelopeId?: string,
  organizationId?: string,
  options?: Omit<UseQueryOptions<GetEnvelopeInsightsResponse>, 'queryKey' | 'queryFn'>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetForecastingQueries.envelopeInsights(envelopeId || '', orgId),
    enabled: isAuthReady && !!envelopeId && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Forecast spending for an envelope or budget
 */
export function useForecastSpending() {
  const queryClient = useQueryClient();

  return useMutation({
    ...budgetForecastingMutations.forecastSpending,
    onSuccess: () => {
      // Invalidate forecast queries to refresh data
      queryClient.invalidateQueries({
        queryKey: budgetForecastingKeys.all,
      });
    },
  });
}
