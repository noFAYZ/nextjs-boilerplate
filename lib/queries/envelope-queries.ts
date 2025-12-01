import { queryOptions } from '@tanstack/react-query';
import { envelopeApi } from '@/lib/services/envelope-api';
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
 * Query keys for envelope-related queries
 */
export const envelopeKeys = {
  all: ['envelopes'] as const,
  lists: () => [...envelopeKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...envelopeKeys.lists(), { ...filters }] as const,
  details: () => [...envelopeKeys.all, 'detail'] as const,
  detail: (id: string) => [...envelopeKeys.details(), id] as const,
  analytics: () => [...envelopeKeys.all, 'analytics'] as const,
  analytics_for_envelope: (id: string) => [...envelopeKeys.analytics(), id] as const,
  periods: () => [...envelopeKeys.all, 'periods'] as const,
  periods_for_envelope: (id: string) => [...envelopeKeys.periods(), id] as const,
  history: () => [...envelopeKeys.all, 'history'] as const,
  allocation_history: (id: string) => [...envelopeKeys.history(), 'allocation', id] as const,
  spending_history: (id: string) => [...envelopeKeys.history(), 'spending', id] as const,
  rules: ['allocation-rules'] as const,
  rule_lists: () => [...envelopeKeys.rules, 'list'] as const,
  rule_list: (filters?: Record<string, any>) =>
    [...envelopeKeys.rule_lists(), { ...filters }] as const,
  rule_details: () => [...envelopeKeys.rules, 'detail'] as const,
  rule_detail: (id: string) => [...envelopeKeys.rule_details(), id] as const,
  rules_for_envelope: (id: string) => [...envelopeKeys.rule_lists(), 'envelope', id] as const,
};

/**
 * Query factory for envelopes list
 */
export const envelopesQueryOptions = (params?: {
  status?: string;
  envelopeType?: string;
  skip?: number;
  take?: number;
}) =>
  queryOptions({
    queryKey: envelopeKeys.list(params),
    queryFn: () => envelopeApi.getEnvelopes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query factory for single envelope
 */
export const envelopeQueryOptions = (envelopeId: string) =>
  queryOptions({
    queryKey: envelopeKeys.detail(envelopeId),
    queryFn: () => envelopeApi.getEnvelope(envelopeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for period analytics
 */
export const envelopePeriodAnalyticsQueryOptions = (envelopeId: string) =>
  queryOptions({
    queryKey: envelopeKeys.analytics_for_envelope(envelopeId),
    queryFn: () => envelopeApi.getPeriodAnalytics(envelopeId),
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for analytics
    enabled: !!envelopeId,
  });

/**
 * Query factory for period history
 */
export const envelopePeriodHistoryQueryOptions = (
  envelopeId: string,
  params?: { limit?: number; offset?: number }
) =>
  queryOptions({
    queryKey: envelopeKeys.periods_for_envelope(envelopeId),
    queryFn: () => envelopeApi.getPeriodHistory(envelopeId, params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for allocation history
 */
export const envelopeAllocationHistoryQueryOptions = (
  envelopeId: string,
  params?: { startDate?: string; endDate?: string }
) =>
  queryOptions({
    queryKey: envelopeKeys.allocation_history(envelopeId),
    queryFn: () => envelopeApi.getAllocationHistory(envelopeId, params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for spending history
 */
export const envelopeSpendingHistoryQueryOptions = (
  envelopeId: string,
  params?: { limit?: number; offset?: number; startDate?: string; endDate?: string }
) =>
  queryOptions({
    queryKey: envelopeKeys.spending_history(envelopeId),
    queryFn: () => envelopeApi.getSpendingHistory(envelopeId, params),
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
}) =>
  queryOptions({
    queryKey: envelopeKeys.rule_list(params),
    queryFn: () => envelopeApi.getAllocationRules(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

/**
 * Query factory for rules of specific envelope
 */
export const envelopeRulesQueryOptions = (envelopeId: string, onlyActive = true) =>
  queryOptions({
    queryKey: envelopeKeys.rules_for_envelope(envelopeId),
    queryFn: () => envelopeApi.getRulesForEnvelope(envelopeId, { onlyActive }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!envelopeId,
  });

/**
 * Query factory for single allocation rule
 */
export const allocationRuleQueryOptions = (ruleId: string) =>
  queryOptions({
    queryKey: envelopeKeys.rule_detail(ruleId),
    queryFn: () => envelopeApi.getAllocationRule(ruleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!ruleId,
  });
