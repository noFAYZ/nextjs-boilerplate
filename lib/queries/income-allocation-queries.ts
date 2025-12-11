/**
 * Income Allocation Query Factories
 * Defines query keys and options for TanStack Query
 */

import { queryOptions } from '@tanstack/react-query';
import { incomeAllocationApi } from '@/lib/services/income-allocation-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  GetIncomeAllocationSuggestionsParams,
  GetIncomeAllocationHistoryParams,
  GetIncomeRecommendationsParams,
} from '@/lib/types/income-allocation';

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
 * Query key factory for income allocation queries
 */
export const incomeAllocationKeys = {
  all: ['income-allocation'] as const,
  suggestions: (params?: GetIncomeAllocationSuggestionsParams, orgId?: string) =>
    [...incomeAllocationKeys.all, 'suggestions', params, orgId] as const,
  suggestionsDetailed: (params: GetIncomeAllocationSuggestionsParams, orgId?: string) =>
    [...incomeAllocationKeys.suggestions(params, orgId), 'detailed'] as const,
  history: (params?: GetIncomeAllocationHistoryParams, orgId?: string) =>
    [...incomeAllocationKeys.all, 'history', params, orgId] as const,
  recommendations: (period?: string, orgId?: string) =>
    [...incomeAllocationKeys.all, 'recommendations', period, orgId] as const,
} as const;

/**
 * Query options factory for income allocation queries
 */
export const incomeAllocationQueries = {
  /**
   * Get income allocation suggestions
   */
  suggestions: (params: GetIncomeAllocationSuggestionsParams, orgId?: string) =>
    queryOptions({
      queryKey: incomeAllocationKeys.suggestions(params, orgId),
      queryFn: () => incomeAllocationApi.getIncomeAllocationSuggestions({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 2 * 60 * 1000, // 2 minutes - income suggestions can change with new data
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),

  /**
   * Get income allocation history
   */
  history: (params?: GetIncomeAllocationHistoryParams, orgId?: string) =>
    queryOptions({
      queryKey: incomeAllocationKeys.history(params, orgId),
      queryFn: () => incomeAllocationApi.getIncomeAllocationHistory({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 10 * 60 * 1000, // 10 minutes - history doesn't change often
      gcTime: 60 * 60 * 1000, // 1 hour
    }),

  /**
   * Get income recommendations
   */
  recommendations: (period?: string, orgId?: string) =>
    queryOptions({
      queryKey: incomeAllocationKeys.recommendations(period, orgId),
      queryFn: () => incomeAllocationApi.getIncomeRecommendations({ period, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 30 * 60 * 1000, // 30 minutes - recommendations are less frequently updated
      gcTime: 60 * 60 * 1000, // 1 hour
    }),
} as const;

/**
 * Mutation factory for income allocation mutations
 */
export const incomeAllocationMutations = {
  allocateIncome: {
    mutationFn: incomeAllocationApi.allocateIncome.bind(incomeAllocationApi),
  },
  recordFeedback: {
    mutationFn: incomeAllocationApi.recordAllocationFeedback.bind(incomeAllocationApi),
  },
} as const;
