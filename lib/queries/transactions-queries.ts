/**
 * Transaction Query Factories & Mutations
 * Provides query keys, query options, and mutation definitions for transactions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/services/transactions-api';
import type { ApiResponse } from '@/lib/types/crypto';

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: () => [...transactionKeys.all, 'stats'] as const,
  categories: () => [...transactionKeys.all, 'categories'] as const,
  categoriesGroups: () => [...transactionKeys.categories(), 'groups'] as const,
  merchants: () => [...transactionKeys.all, 'merchants'] as const,
};

// ============================================================================
// QUERY OPTIONS FACTORY
// ============================================================================

export const transactionQueries = {
  list: (filters?: Record<string, any>) => ({
    queryKey: transactionKeys.list(filters),
    queryFn: async () => {
      const response = await transactionsApi.getTransactions(filters);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transactions');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  detail: (id: string) => ({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const response = await transactionsApi.getTransaction(id);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transaction');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  stats: (filters?: Record<string, any>) => ({
    queryKey: transactionKeys.stats(),
    queryFn: async () => {
      const response = await transactionsApi.getTransactionStats(filters);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transaction stats');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  categories: () => ({
    queryKey: transactionKeys.categories(),
    queryFn: async () => {
      const response = await transactionsApi.getCategories();
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  categoriesGroups: () => ({
    queryKey: transactionKeys.categoriesGroups(),
    queryFn: async () => {
      const response = await transactionsApi.getCategoryGroups();
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch category groups');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  merchants: (filters?: Record<string, any>) => ({
    queryKey: transactionKeys.merchants(),
    queryFn: async () => {
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
