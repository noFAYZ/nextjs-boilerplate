/**
 * Budget Alerts Query Factories
 * Defines query keys and options for TanStack Query
 */

import { queryOptions } from '@tanstack/react-query';
import { budgetAlertsApi } from '@/lib/services/budget-alerts-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  GetPendingAlertsParams,
  GetAlertHistoryParams,
} from '@/lib/types/budget-alerts';

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
 * Query key factory for budget alerts queries
 */
export const budgetAlertsKeys = {
  all: ['budget-alerts'] as const,
  pending: (params?: GetPendingAlertsParams, orgId?: string) =>
    [...budgetAlertsKeys.all, 'pending', params, orgId] as const,
  history: (params?: GetAlertHistoryParams, orgId?: string) =>
    [...budgetAlertsKeys.all, 'history', params, orgId] as const,
} as const;

/**
 * Query options factory for budget alerts queries
 */
export const budgetAlertsQueries = {
  /**
   * Get pending alerts
   */
  pending: (params?: GetPendingAlertsParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetAlertsKeys.pending(params, orgId),
      queryFn: () => budgetAlertsApi.getPendingAlerts({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 1 * 60 * 1000, // 1 minute - alerts should be fresh
      gcTime: 15 * 60 * 1000, // 15 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }),

  /**
   * Get alert history
   */
  history: (params?: GetAlertHistoryParams, orgId?: string) =>
    queryOptions({
      queryKey: budgetAlertsKeys.history(params, orgId),
      queryFn: () => budgetAlertsApi.getAlertHistory({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    }),
} as const;

/**
 * Mutation factory for budget alerts mutations
 */
export const budgetAlertsMutations = {
  processAlerts: {
    mutationFn: budgetAlertsApi.processBudgetAlerts.bind(budgetAlertsApi),
  },
  dismissAlert: {
    mutationFn: budgetAlertsApi.dismissAlert.bind(budgetAlertsApi),
  },
} as const;
