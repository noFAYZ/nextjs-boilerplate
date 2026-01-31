/**
 * Transaction Query Factories & Mutations
 * Provides query keys, query options, and mutation definitions for transactions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/features/transactions/services';
import { useOrganizationStore } from '@/lib/features/organization/stores';
import type { ApiResponse } from '@/lib/types/crypto';

// ============================================================================
// HELPER: Get current organization ID from store (not from closure)
// ============================================================================

function getCurrentOrganizationId(explicitOrgId?: string | null): string | null {
  if (explicitOrgId !== undefined) return explicitOrgId;
  try {
    return useOrganizationStore.getState().selectedOrganizationId ?? null;
  } catch {
    return null;
  }
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const transactionKeys = {
  all: (orgId: string | null) => ['transactions', orgId] as const,
  lists: (orgId: string | null) => [...transactionKeys.all(orgId), 'list'] as const,
  list: (filters?: Record<string, any>, orgId?: string | null) =>
    [...transactionKeys.lists(orgId ?? null), filters] as const,
  details: (orgId: string | null) => [...transactionKeys.all(orgId), 'detail'] as const,
  detail: (id: string, orgId?: string | null) =>
    [...transactionKeys.details(orgId ?? null), id] as const,
  stats: (orgId: string | null) => [...transactionKeys.all(orgId), 'stats'] as const,
  categories: (orgId: string | null) => [...transactionKeys.all(orgId), 'categories'] as const,
  categoriesGroups: (orgId: string | null) => [...transactionKeys.categories(orgId), 'groups'] as const,
  merchants: (orgId: string | null) => [...transactionKeys.all(orgId), 'merchants'] as const,
};

// ============================================================================
// QUERY OPTIONS FACTORY
// ============================================================================

export const transactionQueries = {
  list: (filters?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.list(filters, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransactions(filters);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transactions');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  detail: (id: string, orgId?: string | null) => ({
    queryKey: transactionKeys.detail(id, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransaction(id);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transaction');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  stats: (filters?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.stats(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransactionStats(filters);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transaction stats');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  categories: (orgId?: string | null) => ({
    queryKey: transactionKeys.categories(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getCategories();
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  categoriesGroups: (orgId?: string | null) => ({
    queryKey: transactionKeys.categoriesGroups(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getCategoryGroups();
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch category groups');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  merchants: (filters?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.merchants(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getMerchants(filters);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch merchants');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),
};

// ============================================================================
// MUTATION DEFINITIONS
// ============================================================================

export const transactionMutations = {
  create: () => ({
    mutationFn: transactionsApi.createTransaction,
  }),

  bulkCreate: () => ({
    mutationFn: transactionsApi.bulkCreateTransactions,
  }),

  update: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.updateTransaction(id, data),
  }),

  delete: () => ({
    mutationFn: transactionsApi.deleteTransaction,
  }),
};
