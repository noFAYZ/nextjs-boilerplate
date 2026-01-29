/**
 * Category Matching Data Hooks
 * Consumer hooks for category and envelope matching features
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  categoryMatchingQueries,
  categoryMatchingKeys,
  categoryMatchingMutations,
} from './category-matching-queries';
import type {
  GetEnvelopeSuggestionsParams,
  GetCategorySuggestionsParams,
  GetMerchantMatchesParams,
  GetEnvelopeSuggestionsResponse,
  GetCategorySuggestionsResponse,
  GetMerchantMatchesResponse,
} from '@/lib/types/category-matching';
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
 * Get envelope suggestions for a transaction
 */
export function useEnvelopeSuggestions(
  params?: GetEnvelopeSuggestionsParams,
  organizationId?: string,
  options?: Omit<UseQueryOptions<GetEnvelopeSuggestionsResponse>, 'queryKey' | 'queryFn'>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...categoryMatchingQueries.envelopeSuggestions(params!, orgId),
    enabled: isAuthReady && !!params?.transactionId && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get category suggestions based on merchant and amount
 */
export function useCategorySuggestions(
  params?: GetCategorySuggestionsParams,
  organizationId?: string,
  options?: Omit<UseQueryOptions<GetCategorySuggestionsResponse>, 'queryKey' | 'queryFn'>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...categoryMatchingQueries.categorySuggestions(params!, orgId),
    enabled:
      isAuthReady && !!params?.merchantName && !!params?.amount && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get historical merchant matches
 */
export function useMerchantMatches(
  merchantName?: string,
  organizationId?: string,
  options?: Omit<UseQueryOptions<GetMerchantMatchesResponse>, 'queryKey' | 'queryFn'>
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  const params: GetMerchantMatchesParams = {
    merchantName: merchantName || '',
  };

  return useQuery({
    ...categoryMatchingQueries.merchantMatches(params, orgId),
    enabled: isAuthReady && !!merchantName && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get bulk suggestions for multiple transactions
 */
export function useGetBulkSuggestions() {
  const queryClient = useQueryClient();

  return useMutation({
    ...categoryMatchingMutations.getBulkSuggestions,
    onSuccess: () => {
      // Invalidate suggestions queries
      queryClient.invalidateQueries({
        queryKey: categoryMatchingKeys.envelopeSuggestions(undefined),
      });
    },
  });
}

/**
 * Create a new category mapping rule
 */
export function useCreateCategoryMappingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    ...categoryMatchingMutations.createMappingRule,
    onSuccess: () => {
      // Invalidate suggestions to apply new rules
      queryClient.invalidateQueries({
        queryKey: categoryMatchingKeys.all,
      });
    },
  });
}

/**
 * Apply mapping rules to transactions
 */
export function useApplyMappingRules() {
  const queryClient = useQueryClient();

  return useMutation({
    ...categoryMatchingMutations.applyMappingRules,
    onSuccess: () => {
      // Invalidate all category matching queries
      queryClient.invalidateQueries({
        queryKey: categoryMatchingKeys.all,
      });
    },
  });
}
