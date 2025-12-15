/**
 * Income Allocation Data Hooks
 * Consumer hooks for income allocation features
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  incomeAllocationQueries,
  incomeAllocationKeys,
  incomeAllocationMutations,
} from './income-allocation-queries';
import type {
  GetIncomeAllocationSuggestionsParams,
  AllocateIncomeRequest,
  GetIncomeAllocationHistoryParams,
  GetIncomeRecommendationsParams,
  AllocationFeedback,
} from '@/lib/types/income-allocation';
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
 * Get income allocation suggestions
 */
export function useIncomeAllocationSuggestions(
  params: GetIncomeAllocationSuggestionsParams,
  organizationId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
  }
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...incomeAllocationQueries.suggestions(params, orgId),
    enabled: isAuthReady && !!params.incomeAmount && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Allocate income to envelopes
 */
export function useAllocateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    ...incomeAllocationMutations.allocateIncome,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: incomeAllocationKeys.all,
      });
    },
  });
}

/**
 * Get income allocation history
 */
export function useIncomeAllocationHistory(
  params?: GetIncomeAllocationHistoryParams,
  organizationId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
  }
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...incomeAllocationQueries.history(params, orgId),
    enabled: isAuthReady && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Get income recommendations for a specific period
 */
export function useIncomeRecommendations(
  period?: 'weekly' | 'monthly' | 'yearly',
  organizationId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
  }
) {
  const user = useAuthStore((state) => state.user);
  const orgId = useContextOrganizationId(organizationId);
  const isAuthReady = !!user;

  return useQuery({
    ...incomeAllocationQueries.recommendations(period, orgId),
    enabled: isAuthReady && (options?.enabled ?? true),
    ...options,
  });
}

/**
 * Record allocation feedback for ML training
 */
export function useRecordAllocationFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    ...incomeAllocationMutations.recordFeedback,
    onSuccess: () => {
      // Invalidate suggestions to get updated recommendations
      queryClient.invalidateQueries({
        queryKey: incomeAllocationKeys.suggestions(undefined),
      });
    },
  });
}
