'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { envelopeApi } from '@/lib/services/envelope-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import {
  envelopesQueryOptions,
  envelopeQueryOptions,
  envelopePeriodAnalyticsQueryOptions,
  envelopePeriodHistoryQueryOptions,
  envelopeAllocationHistoryQueryOptions,
  envelopeSpendingHistoryQueryOptions,
  allocationRulesQueryOptions,
  envelopeRulesQueryOptions,
  allocationRuleQueryOptions,
  envelopeKeys,
} from '@/lib/queries/envelope-queries';
import type {
  Envelope,
  CreateEnvelopeRequest,
  UpdateEnvelopeRequest,
  AllocateRequest,
  AllocationRule,
  CreateAllocationRuleRequest,
  EnvelopePeriod,
  PeriodAnalytics,
} from '@/lib/services/envelope-api';

/**
 * Helper to get organization ID from context store or explicit parameter
 */
function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}

/**
 * Hook to fetch all envelopes for the current user
 */
export function useEnvelopes(params?: {
  status?: string;
  envelopeType?: string;
  skip?: number;
  take?: number;
}, organizationId?: string) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery(envelopesQueryOptions(params, orgId));
}

/**
 * Hook to fetch a single envelope by ID
 */
export function useEnvelope(envelopeId: string | null, organizationId?: string) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...envelopeQueryOptions(envelopeId || '', orgId),
    enabled: !!envelopeId,
  });
}

/**
 * Hook to fetch period analytics for an envelope
 */
export function useEnvelopePeriodAnalytics(envelopeId: string | null, organizationId?: string) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...envelopePeriodAnalyticsQueryOptions(envelopeId || '', orgId),
    enabled: !!envelopeId,
  });
}

/**
 * Hook to fetch period history for an envelope
 */
export function useEnvelopePeriodHistory(
  envelopeId: string | null,
  params?: { limit?: number; offset?: number },
  organizationId?: string
) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...envelopePeriodHistoryQueryOptions(envelopeId || '', params, orgId),
    enabled: !!envelopeId,
  });
}

/**
 * Hook to fetch allocation history for an envelope
 */
export function useEnvelopeAllocationHistory(
  envelopeId: string | null,
  params?: { startDate?: string; endDate?: string },
  organizationId?: string
) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...envelopeAllocationHistoryQueryOptions(envelopeId || '', params, orgId),
    enabled: !!envelopeId,
  });
}

/**
 * Hook to fetch spending history for an envelope
 */
export function useEnvelopeSpendingHistory(
  envelopeId: string | null,
  params?: { limit?: number; offset?: number; startDate?: string; endDate?: string },
  organizationId?: string
) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...envelopeSpendingHistoryQueryOptions(envelopeId || '', params, orgId),
    enabled: !!envelopeId,
  });
}

/**
 * Hook to fetch allocation rules with optional filtering
 */
export function useAllocationRules(params?: {
  envelopeId?: string;
  isActive?: boolean;
  ruleType?: string;
  skip?: number;
  take?: number;
}, organizationId?: string) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery(allocationRulesQueryOptions(params, orgId));
}

/**
 * Hook to fetch all rules for a specific envelope
 */
export function useEnvelopeRules(envelopeId: string | null, onlyActive = true, organizationId?: string) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...envelopeRulesQueryOptions(envelopeId || '', onlyActive, orgId),
    enabled: !!envelopeId,
  });
}

/**
 * Hook to fetch a single allocation rule
 */
export function useAllocationRule(ruleId: string | null, organizationId?: string) {
  const orgId = useContextOrganizationId(organizationId);
  return useQuery({
    ...allocationRuleQueryOptions(ruleId || '', orgId),
    enabled: !!ruleId,
  });
}

/**
 * Hook to create a new envelope
 */
export function useCreateEnvelope() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnvelopeRequest) => envelopeApi.createEnvelope(data),
    onSuccess: (response) => {
      // Invalidate envelopes list to refetch
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.lists(),
      });
      // Optionally add to cache
      if (response.data) {
        queryClient.setQueryData(
          envelopeKeys.detail(response.data.id),
          response
        );
      }
    },
  });
}

/**
 * Hook to update an envelope
 */
export function useUpdateEnvelope(envelopeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEnvelopeRequest) =>
      envelopeApi.updateEnvelope(envelopeId, data),
    onSuccess: (response) => {
      // Update the individual envelope cache
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.detail(envelopeId),
      });
      // Invalidate list cache
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.lists(),
      });
    },
  });
}

/**
 * Hook to delete an envelope
 */
export function useDeleteEnvelope() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (envelopeId: string) => envelopeApi.deleteEnvelope(envelopeId),
    onSuccess: (response) => {
      // Invalidate all envelope queries
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.all,
      });
    },
  });
}

/**
 * Hook to allocate funds to an envelope
 */
export function useAllocateToEnvelope(envelopeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AllocateRequest) =>
      envelopeApi.allocateToEnvelope(envelopeId, data),
    onSuccess: () => {
      // Invalidate envelope detail and analytics
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.detail(envelopeId),
      });
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.analytics_for_envelope(envelopeId),
      });
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.allocation_history(envelopeId),
      });
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.lists(),
      });
    },
  });
}

/**
 * Hook to record spending for an envelope
 */
export function useRecordEnvelopeSpending(envelopeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; description?: string }) =>
      envelopeApi.recordSpending(envelopeId, data),
    onSuccess: () => {
      // Invalidate envelope detail and analytics
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.detail(envelopeId),
      });
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.analytics_for_envelope(envelopeId),
      });
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.spending_history(envelopeId),
      });
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.lists(),
      });
    },
  });
}

/**
 * Hook to create an allocation rule
 */
export function useCreateAllocationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAllocationRuleRequest) =>
      envelopeApi.createAllocationRule(data),
    onSuccess: (response) => {
      // Invalidate rules list
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.rule_lists(),
      });
      // Invalidate rules for the specific envelope
      if (response.data?.envelopeId) {
        queryClient.invalidateQueries({
          queryKey: envelopeKeys.rules_for_envelope(response.data.envelopeId),
        });
      }
    },
  });
}

/**
 * Hook to update an allocation rule
 */
export function useUpdateAllocationRule(ruleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateAllocationRuleRequest>) =>
      envelopeApi.updateAllocationRule(ruleId, data),
    onSuccess: (response) => {
      // Invalidate the rule cache
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.rule_detail(ruleId),
      });
      // Invalidate rules list
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.rule_lists(),
      });
      // Invalidate rules for the envelope
      if (response.data?.envelopeId) {
        queryClient.invalidateQueries({
          queryKey: envelopeKeys.rules_for_envelope(response.data.envelopeId),
        });
      }
    },
  });
}

/**
 * Hook to delete an allocation rule
 */
export function useDeleteAllocationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: string) => envelopeApi.deleteAllocationRule(ruleId),
    onSuccess: () => {
      // Invalidate all rule queries
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.rule_lists(),
      });
    },
  });
}

/**
 * Hook to get available amount to allocate
 */
export function useAvailableToAllocate() {
  return useQuery({
    queryKey: [...envelopeKeys.all, 'available-to-allocate'],
    queryFn: () => envelopeApi.getAvailableToAllocate(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get dashboard summary data
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: [...envelopeKeys.all, 'dashboard-summary'],
    queryFn: () => envelopeApi.getDashboardSummary(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to split spending across multiple envelopes
 */
export function useSplitSpending() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      envelopes: Array<{ envelopeId: string; amount: number }>;
      totalAmount: number;
      transactionId?: string;
    }) => envelopeApi.splitSpending(data),
    onSuccess: () => {
      // Invalidate all envelope and summary queries
      queryClient.invalidateQueries({
        queryKey: envelopeKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: [...envelopeKeys.all, 'dashboard-summary'],
      });
      queryClient.invalidateQueries({
        queryKey: [...envelopeKeys.all, 'available-to-allocate'],
      });
    },
  });
}

/**
 * Hook to get all envelopes with stats and filtering
 */
export function useAllEnvelopesWithStats(params?: {
  status?: string;
  envelopeType?: string;
  sortBy?: 'name' | 'allocatedAmount' | 'spentAmount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  skip?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: [...envelopeKeys.lists(), 'with-stats', params],
    queryFn: () => envelopeApi.getAllEnvelopesWithStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get quick stats for a specific envelope
 */
export function useEnvelopeQuickStats(envelopeId: string | null) {
  return useQuery({
    queryKey: [...envelopeKeys.details(), 'quick-stats', envelopeId],
    queryFn: () => envelopeApi.getEnvelopeQuickStats(envelopeId || ''),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!envelopeId,
  });
}
