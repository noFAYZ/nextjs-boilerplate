/**
 * Category Matching Query Factories
 * Defines query keys and options for TanStack Query
 */

import { queryOptions } from '@tanstack/react-query';
import { categoryMatchingApi } from '@/lib/services/category-matching-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  GetEnvelopeSuggestionsParams,
  GetCategorySuggestionsParams,
  GetMerchantMatchesParams,
} from '@/lib/types/category-matching';

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
 * Query key factory for category matching queries
 */
export const categoryMatchingKeys = {
  all: ['category-matching'] as const,
  envelopeSuggestions: (params?: GetEnvelopeSuggestionsParams, orgId?: string) =>
    [...categoryMatchingKeys.all, 'envelope-suggestions', params, orgId] as const,
  categorySuggestions: (params?: GetCategorySuggestionsParams, orgId?: string) =>
    [...categoryMatchingKeys.all, 'category-suggestions', params, orgId] as const,
  merchantMatches: (merchantName?: string, orgId?: string) =>
    [...categoryMatchingKeys.all, 'merchant-matches', merchantName, orgId] as const,
} as const;

/**
 * Query options factory for category matching queries
 */
export const categoryMatchingQueries = {
  /**
   * Get envelope suggestions for a transaction
   */
  envelopeSuggestions: (params: GetEnvelopeSuggestionsParams, orgId?: string) =>
    queryOptions({
      queryKey: categoryMatchingKeys.envelopeSuggestions(params, orgId),
      queryFn: () => categoryMatchingApi.getEnvelopeSuggestions({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 1 * 60 * 1000, // 1 minute - transaction data changes frequently
      gcTime: 15 * 60 * 1000, // 15 minutes
      enabled: !!params.transactionId,
    }),

  /**
   * Get category suggestions based on merchant and amount
   */
  categorySuggestions: (params: GetCategorySuggestionsParams, orgId?: string) =>
    queryOptions({
      queryKey: categoryMatchingKeys.categorySuggestions(params, orgId),
      queryFn: () => categoryMatchingApi.getCategorySuggestions({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 1 * 60 * 1000, // 1 minute
      gcTime: 15 * 60 * 1000, // 15 minutes
      enabled: !!params.merchantName && !!params.amount,
    }),

  /**
   * Get historical merchant matches
   */
  merchantMatches: (params: GetMerchantMatchesParams, orgId?: string) =>
    queryOptions({
      queryKey: categoryMatchingKeys.merchantMatches(params.merchantName, orgId),
      queryFn: () => categoryMatchingApi.getMerchantMatches({ ...params, organizationId: getCurrentOrganizationId(orgId) }),
      staleTime: 10 * 60 * 1000, // 10 minutes - historical data doesn't change often
      gcTime: 60 * 60 * 1000, // 1 hour
      enabled: !!params.merchantName,
    }),
} as const;

/**
 * Mutation factory for category matching mutations
 */
export const categoryMatchingMutations = {
  getBulkSuggestions: {
    mutationFn: categoryMatchingApi.getBulkSuggestions.bind(categoryMatchingApi),
  },
  createMappingRule: {
    mutationFn: categoryMatchingApi.createCategoryMappingRule.bind(categoryMatchingApi),
  },
  applyMappingRules: {
    mutationFn: categoryMatchingApi.applyMappingRules.bind(categoryMatchingApi),
  },
} as const;
