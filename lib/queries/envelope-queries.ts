import { queryOptions } from '@tanstack/react-query';
import { envelopeApi } from '@/lib/services/envelope-api';
import { useOrganizationStore } from '@/lib/stores/organization-store';
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
 * Query keys for envelope-related queries
 */
export const envelopeKeys = {
  all: ['envelopes'] as const,
  lists: (orgId?: string) => [...envelopeKeys.all, 'list', orgId] as const,
  list: (filters?: Record<string, unknown>, orgId?: string) =>
    [...envelopeKeys.lists(orgId), { ...filters }] as const,
  details: (orgId?: string) => [...envelopeKeys.all, 'detail', orgId] as const,
  detail: (id: string, orgId?: string) => [...envelopeKeys.details(orgId), id] as const,
  analytics: (orgId?: string) => [...envelopeKeys.all, 'analytics', orgId] as const,
  analytics_for_envelope: (id: string, orgId?: string) => [...envelopeKeys.analytics(orgId), id] as const,
  periods: (orgId?: string) => [...envelopeKeys.all, 'periods', orgId] as const,
  periods_for_envelope: (id: string, orgId?: string) => [...envelopeKeys.periods(orgId), id] as const,
  history: (orgId?: string) => [...envelopeKeys.all, 'history', orgId] as const,
  allocation_history: (id: string, orgId?: string) => [...envelopeKeys.history(orgId), 'allocation', id] as const,
  spending_history: (id: string, orgId?: string) => [...envelopeKeys.history(orgId), 'spending', id] as const,
  rules: ['allocation-rules'] as const,
  rule_lists: (orgId?: string) => [...envelopeKeys.rules, 'list', orgId] as const,
  rule_list: (filters?: Record<string, unknown>, orgId?: string) =>
    [...envelopeKeys.rule_lists(orgId), { ...filters }] as const,
  rule_details: (orgId?: string) => [...envelopeKeys.rules, 'detail', orgId] as const,
  rule_detail: (id: string, orgId?: string) => [...envelopeKeys.rule_details(orgId), id] as const,
  rules_for_envelope: (id: string, orgId?: string) => [...envelopeKeys.rule_lists(orgId), 'envelope', id] as const,
};

/**
 * Query factory for envelopes list
 */
export const envelopesQueryOptions = (params?: {
  status?: string;
  envelopeType?: string;
  skip?: number;
  take?: number;
}, orgId?: string) =>
  queryOptions({
    queryKey: envelopeKeys.list(params, orgId),
    queryFn: () => envelopeApi.getEnvelopes({ ...params, organizationId: getCurrentOrganizationId(orgId) } as any),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query factory for single envelope
 */
export const envelopeQueryOptions = (envelopeId: string, orgId?: string) =>
  queryOptions({
    queryKey: envelopeKeys.detail(envelopeId, orgId),
    queryFn: () => envelopeApi.getEnvelope(envelopeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for period analytics
 */
export const envelopePeriodAnalyticsQueryOptions = (envelopeId: string, orgId?: string) =>
  queryOptions({
    queryKey: envelopeKeys.analytics_for_envelope(envelopeId, orgId),
    queryFn: () => envelopeApi.getPeriodAnalytics(envelopeId),
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for analytics
    enabled: !!envelopeId,
  });

/**
 * Query factory for period history
 */
export const envelopePeriodHistoryQueryOptions = (
  envelopeId: string,
  params?: { limit?: number; offset?: number },
  orgId?: string
) =>
  queryOptions({
    queryKey: envelopeKeys.periods_for_envelope(envelopeId, orgId),
    queryFn: () => envelopeApi.getPeriodHistory(envelopeId, { ...params, organizationId: getCurrentOrganizationId(orgId) } as any),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for allocation history
 */
export const envelopeAllocationHistoryQueryOptions = (
  envelopeId: string,
  params?: { startDate?: string; endDate?: string },
  orgId?: string
) =>
  queryOptions({
    queryKey: envelopeKeys.allocation_history(envelopeId, orgId),
    queryFn: () => envelopeApi.getAllocationHistory(envelopeId, { ...params, organizationId: getCurrentOrganizationId(orgId) } as any),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for spending history
 */
export const envelopeSpendingHistoryQueryOptions = (
  envelopeId: string,
  params?: { limit?: number; offset?: number; startDate?: string; endDate?: string },
  orgId?: string
) =>
  queryOptions({
    queryKey: envelopeKeys.spending_history(envelopeId, orgId),
    queryFn: () => envelopeApi.getSpendingHistory(envelopeId, { ...params, organizationId: getCurrentOrganizationId(orgId) } as any),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for allocation rules list
 */
export const allocationRulesQueryOptions = (params?: {
  envelopeId?: string;
  isActive?: boolean;
  ruleType?: string;
  skip?: number;
  take?: number;
}, orgId?: string) =>
  queryOptions({
    queryKey: envelopeKeys.rule_list(params, orgId),
    queryFn: () => envelopeApi.getAllocationRules({ ...params, organizationId: getCurrentOrganizationId(orgId) } as any),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query factory for rules of specific envelope
 */
export const envelopeRulesQueryOptions = (envelopeId: string, onlyActive = true, orgId?: string) =>
  queryOptions({
    queryKey: envelopeKeys.rules_for_envelope(envelopeId, orgId),
    queryFn: () => envelopeApi.getRulesForEnvelope(envelopeId, { onlyActive, organizationId: getCurrentOrganizationId(orgId) } as any),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for single allocation rule
 */
export const allocationRuleQueryOptions = (ruleId: string, orgId?: string) =>
  queryOptions({
    queryKey: envelopeKeys.rule_detail(ruleId, orgId),
    queryFn: () => envelopeApi.getAllocationRule(ruleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!ruleId,
  });
