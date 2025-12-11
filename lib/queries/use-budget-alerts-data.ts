/**
 * Budget Alerts Data Hooks
 * Consumer hooks for budget alert features
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  budgetAlertsQueries,
  budgetAlertsKeys,
  budgetAlertsMutations,
} from './budget-alerts-queries';
import type {
  GetPendingAlertsParams,
  GetAlertHistoryParams,
} from '@/lib/types/budget-alerts';
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
 * Get pending alerts
 */
export function usePendingAlerts(
  params?: GetPendingAlertsParams,
  organizationId?: string,
  options?: { enabled?: boolean }
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAlertsQueries.pending(params, orgId),
    enabled: isAuthReady && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get alert history
 */
export function useAlertHistory(
  params?: GetAlertHistoryParams,
  organizationId?: string,
  options?: { enabled?: boolean }
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetAlertsQueries.history(params, orgId),
    enabled: isAuthReady && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Process budget alerts
 */
export function useProcessAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    ...budgetAlertsMutations.processAlerts,
    onSuccess: () => {
      // Invalidate pending alerts after processing
      queryClient.invalidateQueries({
        queryKey: budgetAlertsKeys.pending(undefined),
      });
      // Invalidate history as well
      queryClient.invalidateQueries({
        queryKey: budgetAlertsKeys.history(undefined),
      });
    },
  });
}

/**
 * Dismiss a specific alert
 */
export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    ...budgetAlertsMutations.dismissAlert,
    onSuccess: () => {
      // Invalidate pending alerts
      queryClient.invalidateQueries({
        queryKey: budgetAlertsKeys.pending(undefined),
      });
    },
  });
}
