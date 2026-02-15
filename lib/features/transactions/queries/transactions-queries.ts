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
// QUERY KEYS FACTORY - Comprehensive keys for all 60+ endpoints
// ============================================================================

export const transactionKeys = {
  // Root keys
  all: (orgId: string | null) => ['transactions', orgId] as const,

  // Transactions CRUD & Search
  lists: (orgId: string | null) => [...transactionKeys.all(orgId), 'list'] as const,
  list: (filters?: Record<string, any>, orgId?: string | null) =>
    [...transactionKeys.lists(orgId ?? null), filters] as const,
  search: (query?: Record<string, any>, orgId?: string | null) =>
    [...transactionKeys.all(orgId), 'search', query] as const,

  // Transaction Details
  details: (orgId: string | null) => [...transactionKeys.all(orgId), 'detail'] as const,
  detail: (id: string, orgId?: string | null) =>
    [...transactionKeys.details(orgId ?? null), id] as const,

  // Transaction Statistics
  stats: (orgId: string | null) => [...transactionKeys.all(orgId), 'stats'] as const,

  // Transaction Notes
  notes: (orgId: string | null) => [...transactionKeys.all(orgId), 'notes'] as const,
  note: (transactionId: string, orgId?: string | null) =>
    [...transactionKeys.notes(orgId ?? null), transactionId] as const,

  // Transaction Attachments
  attachments: (orgId: string | null) => [...transactionKeys.all(orgId), 'attachments'] as const,
  attachment: (transactionId: string, orgId?: string | null) =>
    [...transactionKeys.attachments(orgId ?? null), transactionId] as const,

  // Categories
  categories: (orgId: string | null) => [...transactionKeys.all(orgId), 'categories'] as const,
  category: (id: string, orgId?: string | null) =>
    [...transactionKeys.categories(orgId ?? null), id] as const,

  // Category Groups
  categoriesGroups: (orgId: string | null) => [...transactionKeys.categories(orgId), 'groups'] as const,
  categoryGroup: (id: string, orgId?: string | null) =>
    [...transactionKeys.categoriesGroups(orgId ?? null), id] as const,

  // Category Rules
  categoryRules: (orgId: string | null) => [...transactionKeys.all(orgId), 'category-rules'] as const,
  categoryRule: (id: string, orgId?: string | null) =>
    [...transactionKeys.categoryRules(orgId ?? null), id] as const,
  merchantRules: (orgId: string | null) =>
    [...transactionKeys.categoryRules(orgId), 'merchant-rules'] as const,
  merchantRule: (id: string, orgId?: string | null) =>
    [...transactionKeys.merchantRules(orgId ?? null), id] as const,
  categorizationStats: (orgId: string | null) =>
    [...transactionKeys.categoryRules(orgId), 'stats'] as const,

  // Categorization Rules
  categorizationRules: (orgId: string | null) =>
    [...transactionKeys.all(orgId), 'categorization-rules'] as const,
  categorizationRule: (id: string, orgId?: string | null) =>
    [...transactionKeys.categorizationRules(orgId ?? null), id] as const,
  categorizationRuleStats: (id: string, orgId?: string | null) =>
    [...transactionKeys.categorizationRule(id, orgId), 'stats'] as const,

  // Findings & Analytics
  findings: (orgId: string | null) => [...transactionKeys.all(orgId), 'findings'] as const,
  recurringPatterns: (accountId: string, orgId?: string | null) =>
    [...transactionKeys.findings(orgId ?? null), 'recurring', accountId] as const,
  expectedTransactions: (accountId: string, orgId?: string | null) =>
    [...transactionKeys.findings(orgId ?? null), 'expected', accountId] as const,
  reconciliationProgress: (accountId: string, orgId?: string | null) =>
    [...transactionKeys.findings(orgId ?? null), 'reconciliation', accountId] as const,

  // Merchants
  merchants: (orgId: string | null) => [...transactionKeys.all(orgId), 'merchants'] as const,
  merchant: (id: string, orgId?: string | null) =>
    [...transactionKeys.merchants(orgId ?? null), id] as const,
};

// ============================================================================
// QUERY OPTIONS FACTORY
// ============================================================================

export const transactionQueries = {
  // ============================================================================
  // TRANSACTION QUERIES
  // ============================================================================

  list: (filters?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.list(filters, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.listTransactions(filters, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transactions');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  detail: (id: string, orgId?: string | null) => ({
    queryKey: transactionKeys.detail(id, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransaction(id, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transaction');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  search: (query?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.search(query, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.searchTransactions(query || {}, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to search transactions');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  stats: (filters?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.stats(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransactionStats(filters, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch transaction stats');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  // ============================================================================
  // TRANSACTION NOTES
  // ============================================================================

  notes: (transactionId: string, orgId?: string | null) => ({
    queryKey: transactionKeys.note(transactionId, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransactionNotes(transactionId, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch notes');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  // ============================================================================
  // TRANSACTION ATTACHMENTS
  // ============================================================================

  attachments: (transactionId: string, orgId?: string | null) => ({
    queryKey: transactionKeys.attachment(transactionId, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getTransactionAttachments(transactionId, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch attachments');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  // ============================================================================
  // CATEGORY QUERIES
  // ============================================================================

  categories: (orgId?: string | null) => ({
    queryKey: transactionKeys.categories(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.listCategories(currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  // ============================================================================
  // CATEGORY GROUP QUERIES
  // ============================================================================

  categoriesGroups: (orgId?: string | null) => ({
    queryKey: transactionKeys.categoriesGroups(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.listCategoryGroups(currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch category groups');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  // ============================================================================
  // CATEGORY RULES QUERIES
  // ============================================================================

  categoryRules: (orgId?: string | null) => ({
    queryKey: transactionKeys.categoryRules(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.listCategoryRules(currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch category rules');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  merchantRules: (orgId?: string | null) => ({
    queryKey: transactionKeys.merchantRules(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.listMerchantRules(currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch merchant rules');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  categorizationStats: (orgId?: string | null) => ({
    queryKey: transactionKeys.categorizationStats(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getCategorizationStats(currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch categorization stats');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  // ============================================================================
  // CUSTOM CATEGORIZATION RULES QUERIES
  // ============================================================================

  categorizationRules: (orgId?: string | null) => ({
    queryKey: transactionKeys.categorizationRules(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.listCategorizationRules(currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch categorization rules');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  categorizationRule: (id: string, orgId?: string | null) => ({
    queryKey: transactionKeys.categorizationRule(id, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getCategorizationRule(id, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch categorization rule');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),

  categorizationRuleStats: (id: string, orgId?: string | null) => ({
    queryKey: transactionKeys.categorizationRuleStats(id, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getCategorizationRuleStats(id, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch rule statistics');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  // ============================================================================
  // FINDINGS & ANALYTICS QUERIES
  // ============================================================================

  recurringPatterns: (accountId: string, orgId?: string | null) => ({
    queryKey: transactionKeys.recurringPatterns(accountId, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.detectRecurringPatterns(accountId, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to detect patterns');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 60 minutes
  }),

  expectedTransactions: (accountId: string, orgId?: string | null) => ({
    queryKey: transactionKeys.expectedTransactions(accountId, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getExpectedTransactions(accountId, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch expected transactions');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 60 minutes
  }),

  reconciliationProgress: (accountId: string, orgId?: string | null) => ({
    queryKey: transactionKeys.reconciliationProgress(accountId, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getReconciliationProgress(accountId, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch reconciliation progress');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  // ============================================================================
  // MERCHANT QUERIES
  // ============================================================================

  merchants: (filters?: Record<string, any>, orgId?: string | null) => ({
    queryKey: transactionKeys.merchants(orgId ?? null),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await transactionsApi.getMerchants(filters, currentOrgId);
      if (!response.success) throw new Error(response.error?.message || 'Failed to fetch merchants');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  }),
};

// ============================================================================
// MUTATION DEFINITIONS - Comprehensive mutations for all 60+ endpoints
// ============================================================================

export const transactionMutations = {
  // ============================================================================
  // TRANSACTION MUTATIONS
  // ============================================================================

  create: () => ({
    mutationFn: transactionsApi.createTransaction,
  }),

  bulkCreate: () => ({
    mutationFn: transactionsApi.createTransactionsBulk,
  }),

  bulkValidate: () => ({
    mutationFn: transactionsApi.validateBulkTransactions,
  }),

  update: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // Filter out 'merchant' object before sending to API (API only accepts merchantId)
      // The merchant object is used for optimistic updates in onMutate
      const { merchant, ...apiData } = data;
      return transactionsApi.updateTransaction(id, apiData);
    },
  }),

  delete: () => ({
    mutationFn: transactionsApi.deleteTransaction,
  }),

  reconcile: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.reconcileTransaction(id, data),
  }),

  // ============================================================================
  // TRANSACTION NOTES & ATTACHMENTS
  // ============================================================================

  addNote: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.addTransactionNote(id, data),
  }),

  uploadAttachment: () => ({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      transactionsApi.uploadTransactionAttachment(id, file),
  }),

  deleteAttachment: () => ({
    mutationFn: transactionsApi.deleteAttachment,
  }),

  makeAttachmentPublic: () => ({
    mutationFn: transactionsApi.makeAttachmentPublic,
  }),

  makeAttachmentPrivate: () => ({
    mutationFn: transactionsApi.makeAttachmentPrivate,
  }),

  // ============================================================================
  // CATEGORY MUTATIONS
  // ============================================================================

  createCategory: () => ({
    mutationFn: transactionsApi.createCategory,
  }),

  updateCategory: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.updateCategory(id, data),
  }),

  deleteCategory: () => ({
    mutationFn: transactionsApi.deleteCategory,
  }),

  initializeDefaultCategories: () => ({
    mutationFn: transactionsApi.initializeDefaultCategories,
  }),

  toggleCategoryStatus: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.toggleCategoryStatus(id, data),
  }),

  // ============================================================================
  // CATEGORY GROUP MUTATIONS
  // ============================================================================

  createCategoryGroup: () => ({
    mutationFn: transactionsApi.createCategoryGroup,
  }),

  updateCategoryGroup: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.updateCategoryGroup(id, data),
  }),

  deleteCategoryGroup: () => ({
    mutationFn: transactionsApi.deleteCategoryGroup,
  }),

  toggleCategoryGroupStatus: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.toggleCategoryGroupStatus(id, data),
  }),

  // ============================================================================
  // CATEGORY RULES MUTATIONS
  // ============================================================================

  createCategoryRule: () => ({
    mutationFn: transactionsApi.createCategoryRule,
  }),

  updateCategoryRule: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.updateCategoryRule(id, data),
  }),

  deleteCategoryRule: () => ({
    mutationFn: transactionsApi.deleteCategoryRule,
  }),

  createMerchantRule: () => ({
    mutationFn: transactionsApi.createMerchantRule,
  }),

  deleteMerchantRule: () => ({
    mutationFn: transactionsApi.deleteMerchantRule,
  }),

  bulkRecategorize: () => ({
    mutationFn: transactionsApi.bulkRecategorize,
  }),

  // ============================================================================
  // CUSTOM CATEGORIZATION RULES MUTATIONS
  // ============================================================================

  createCategorizationRule: () => ({
    mutationFn: transactionsApi.createCategorizationRule,
  }),

  updateCategorizationRule: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.updateCategorizationRule(id, data),
  }),

  deleteCategorizationRule: () => ({
    mutationFn: transactionsApi.deleteCategorizationRule,
  }),

  testCategorizationRule: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.testCategorizationRule(id, data),
  }),

  enableCategorizationRule: () => ({
    mutationFn: transactionsApi.enableCategorizationRule,
  }),

  disableCategorizationRule: () => ({
    mutationFn: transactionsApi.disableCategorizationRule,
  }),

  setCategorizationRulePriority: () => ({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.setCategorizationRulePriority(id, data),
  }),

  duplicateCategorizationRule: () => ({
    mutationFn: transactionsApi.duplicateCategorizationRule,
  }),

  importCategorizationRules: () => ({
    mutationFn: transactionsApi.importCategorizationRules,
  }),

  // ============================================================================
  // FINDINGS & ANALYTICS MUTATIONS
  // ============================================================================

  autoCategorizeAccount: () => ({
    mutationFn: transactionsApi.autoCategorizeAccount,
  }),

  exportAccountTransactions: () => ({
    mutationFn: ({ accountId, params }: { accountId: string; params: any }) =>
      transactionsApi.exportAccountTransactions(accountId, params),
  }),

  findMatchingTransactions: () => ({
    mutationFn: transactionsApi.findMatchingTransactions,
  }),
};
