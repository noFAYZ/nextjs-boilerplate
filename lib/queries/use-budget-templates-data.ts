/**
 * Budget Templates Data Hooks
 * Consumer hooks for budget template features
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  budgetTemplatesQueries,
  budgetTemplatesKeys,
  budgetTemplatesMutations,
} from './budget-templates-queries';
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
 * Get all available budget templates
 */
export function useBudgetTemplates(organizationId?: string, options?: { enabled?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetTemplatesQueries.list(orgId),
    enabled: isAuthReady && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get a specific budget template by ID
 */
export function useBudgetTemplate(
  id?: string,
  organizationId?: string,
  options?: { enabled?: boolean }
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...budgetTemplatesQueries.detail(id || '', orgId),
    enabled: isAuthReady && !!id && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Apply a budget template to create envelopes
 */
export function useApplyBudgetTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    ...budgetTemplatesMutations.applyTemplate,
    onSuccess: () => {
      // Invalidate template queries
      queryClient.invalidateQueries({
        queryKey: budgetTemplatesKeys.all,
      });
      // Also invalidate envelope queries if they exist
      queryClient.invalidateQueries({
        queryKey: ['envelopes'],
      });
    },
  });
}
