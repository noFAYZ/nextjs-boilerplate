/**
 * Envelope Query Options - Query factory functions for envelope-related data
 *
 * These factories create TanStack Query options for envelope queries
 */

import { envelopeApi } from '@/lib/services/envelope-api';
import type { ApiResponse } from '@/lib/types/crypto';

// Budget Query Keys Factory
export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (params?: any) => [...budgetKeys.lists(), params] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
  analytics: () => [...budgetKeys.all, 'analytics'] as const,
  summary: () => [...budgetKeys.all, 'summary'] as const,
};

// Query Keys Factory
export const envelopeKeys = {
  all: ['envelopes'] as const,
  lists: () => [...envelopeKeys.all, 'list'] as const,
  list: (params?: any, orgId?: string) => [...envelopeKeys.lists(), { params, orgId }] as const,
  detail: (id: string) => [...envelopeKeys.all, 'detail', id] as const,
  details: () => [...envelopeKeys.all, 'details'] as const,
  analytics: (id: string, orgId?: string) => [...envelopeKeys.detail(id), 'analytics', orgId] as const,
  history: (id: string, orgId?: string) => [...envelopeKeys.detail(id), 'history', orgId] as const,
  allocation: (id: string, orgId?: string) => [...envelopeKeys.detail(id), 'allocation', orgId] as const,
  spending: (id: string, orgId?: string) => [...envelopeKeys.detail(id), 'spending', orgId] as const,
  rules: () => [...envelopeKeys.all, 'rules'] as const,
  rule: (id: string, orgId?: string) => [...envelopeKeys.rules(), id, orgId] as const,
};

// Query Options Factories
export const envelopeQueries = {
  // List all envelopes
  envelopes: (params?: any, orgId?: string) => ({
    queryKey: envelopeKeys.list(params, orgId),
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelopes(params, orgId);
      } catch (error) {
        console.error('Failed to fetch envelopes:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: any) => data?.data || [],
  }),

  // Get single envelope
  envelope: (id: string, orgId?: string) => ({
    queryKey: envelopeKeys.detail(id),
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelope(id, orgId);
      } catch (error) {
        console.error('Failed to fetch envelope:', error);
        return { success: false, data: null };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: false,
    select: (data: any) => data?.data || null,
  }),

  // Get period analytics for envelope
  envelopePeriodAnalytics: (id: string, orgId?: string) => ({
    queryKey: envelopeKeys.analytics(id, orgId),
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelopePeriodAnalytics(id, orgId);
      } catch (error) {
        console.error('Failed to fetch period analytics:', error);
        return { success: false, data: null };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data: any) => data?.data || null,
  }),

  // Get period history
  envelopePeriodHistory: (id: string, params?: any, orgId?: string) => ({
    queryKey: [...envelopeKeys.history(id, orgId), params] as const,
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelopePeriodHistory(id, params, orgId);
      } catch (error) {
        console.error('Failed to fetch period history:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data: any) => data?.data || [],
  }),

  // Get allocation history
  envelopeAllocationHistory: (id: string, params?: any, orgId?: string) => ({
    queryKey: [...envelopeKeys.allocation(id, orgId), params] as const,
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelopeAllocationHistory(id, params, orgId);
      } catch (error) {
        console.error('Failed to fetch allocation history:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data: any) => data?.data || [],
  }),

  // Get spending history
  envelopeSpendingHistory: (id: string, params?: any, orgId?: string) => ({
    queryKey: [...envelopeKeys.spending(id, orgId), params] as const,
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelopeSpendingHistory(id, params, orgId);
      } catch (error) {
        console.error('Failed to fetch spending history:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data: any) => data?.data || [],
  }),

  // Get all allocation rules
  allocationRules: (orgId?: string) => ({
    queryKey: [...envelopeKeys.rules(), 'allocation', orgId] as const,
    queryFn: async () => {
      try {
        return await envelopeApi.getAllocationRules(orgId);
      } catch (error) {
        console.error('Failed to fetch allocation rules:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data: any) => data?.data || [],
  }),

  // Get single allocation rule
  allocationRule: (id: string, orgId?: string) => ({
    queryKey: envelopeKeys.rule(id, orgId),
    queryFn: async () => {
      try {
        return await envelopeApi.getAllocationRule(id, orgId);
      } catch (error) {
        console.error('Failed to fetch allocation rule:', error);
        return { success: false, data: null };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
    retry: false,
    select: (data: any) => data?.data || null,
  }),

  // Get all envelope rules
  envelopeRules: (orgId?: string) => ({
    queryKey: [...envelopeKeys.rules(), 'envelope', orgId] as const,
    queryFn: async () => {
      try {
        return await envelopeApi.getEnvelopeRules(orgId);
      } catch (error) {
        console.error('Failed to fetch envelope rules:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data: any) => data?.data || [],
  }),
};

// Convenience exports for backward compatibility
export const envelopesQueryOptions = envelopeQueries.envelopes;
export const envelopeQueryOptions = envelopeQueries.envelope;
export const envelopePeriodAnalyticsQueryOptions = envelopeQueries.envelopePeriodAnalytics;
export const envelopePeriodHistoryQueryOptions = envelopeQueries.envelopePeriodHistory;
export const envelopeAllocationHistoryQueryOptions = envelopeQueries.envelopeAllocationHistory;
export const envelopeSpendingHistoryQueryOptions = envelopeQueries.envelopeSpendingHistory;
export const allocationRulesQueryOptions = envelopeQueries.allocationRules;
export const allocationRuleQueryOptions = envelopeQueries.allocationRule;
export const envelopeRulesQueryOptions = envelopeQueries.envelopeRules;
