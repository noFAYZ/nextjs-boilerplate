/**
 * Budget Templates Query Factories
 * Defines query keys and options for TanStack Query
 */

import { queryOptions } from '@tanstack/react-query';
import { budgetTemplatesApi } from '@/lib/services/budget-templates-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type { BudgetTemplate, TemplateType } from '@/lib/types/budget-templates';

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
 * Query key factory for budget templates queries
 */
export const budgetTemplatesKeys = {
  all: ['budget-templates'] as const,
  list: (orgId?: string) => [...budgetTemplatesKeys.all, 'list', orgId] as const,
  detail: (id: string, orgId?: string) => [...budgetTemplatesKeys.all, 'detail', id, orgId] as const,
  byType: (type: TemplateType, orgId?: string) => [...budgetTemplatesKeys.all, 'by-type', type, orgId] as const,
} as const;

/**
 * Query options factory for budget templates queries
 */
export const budgetTemplatesQueries = {
  /**
   * Get all available budget templates
   */
  list: (orgId?: string) =>
    queryOptions({
      queryKey: budgetTemplatesKeys.list(orgId),
      queryFn: () => budgetTemplatesApi.getBudgetTemplates(getCurrentOrganizationId(orgId)),
      staleTime: 30 * 60 * 1000, // 30 minutes - templates don't change often
      gcTime: 60 * 60 * 1000, // 1 hour
    }),

  /**
   * Get a specific budget template by ID
   */
  detail: (id: string, orgId?: string) =>
    queryOptions({
      queryKey: budgetTemplatesKeys.detail(id, orgId),
      queryFn: () => budgetTemplatesApi.getBudgetTemplate(id, getCurrentOrganizationId(orgId)),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
      enabled: !!id,
    }),

  /**
   * Get templates filtered by type
   */
  byType: (type: TemplateType, orgId?: string) =>
    queryOptions({
      queryKey: budgetTemplatesKeys.byType(type, orgId),
      queryFn: () => budgetTemplatesApi.getBudgetTemplates(getCurrentOrganizationId(orgId)).then(templates =>
        templates.filter(t => t.type === type)
      ),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    }),
} as const;

/**
 * Mutation factory for budget templates mutations
 */
export const budgetTemplatesMutations = {
  applyTemplate: {
    mutationFn: budgetTemplatesApi.applyBudgetTemplate.bind(budgetTemplatesApi),
  },
} as const;
