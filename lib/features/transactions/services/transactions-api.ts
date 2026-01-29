import { apiClient } from '@/lib/core/api';
import type { ApiResponse } from '@/lib/types/crypto';

/**
 * Transaction API Service
 * Handles all transaction-related operations including CRUD, filtering, categorization, and analytics
 *
 * Base path: /transactions
 */
class TransactionsApiService {
  private readonly basePath = '/transactions';

  // ============================================================================
  // TRANSACTION CRUD OPERATIONS
  // ============================================================================

  /**
   * Create a single transaction
   */
  async createTransaction(data: {
    accountId: string;
    amount: number;
    currency?: string;
    date: string;
    description: string;
    categoryId?: string;
    merchantId?: string;
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    status?: 'PENDING' | 'POSTED' | 'CLEARED' | 'RECONCILED';
    isTransfer?: boolean;
    isPending?: boolean;
    relatedTransactionId?: string;
    notes?: string;
    tags?: string[];
    metadata?: Record<string, any>;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    accountId: string;
    amount: number;
    currency: string;
    date: string;
    description: string;
    type: string;
    status: string;
    categoryId?: string;
    merchantId?: string;
    notes?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}`, data, organizationId);
  }

  /**
   * Create multiple transactions at once
   */
  async bulkCreateTransactions(data: {
    transactions: Array<{
      accountId: string;
      amount: number;
      currency?: string;
      date: string;
      description: string;
      categoryId?: string;
      merchantId?: string;
      type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
      status?: 'PENDING' | 'POSTED' | 'CLEARED' | 'RECONCILED';
      isTransfer?: boolean;
      isPending?: boolean;
      relatedTransactionId?: string;
      notes?: string;
      tags?: string[];
      metadata?: Record<string, any>;
    }>;
  }, organizationId?: string): Promise<ApiResponse<{
    created: number;
    createdTransactions: Array<{ id: string; amount: number; description: string }>;
    errors: number;
    errorDetails: Array<{ index: number; error: string }>;
  }>> {
    return apiClient.post(`${this.basePath}/bulk`, data, organizationId);
  }

  /**
   * Get transactions with advanced filtering
   */
  async getTransactions(params?: {
    accountId?: string;
    categoryId?: string;
    merchantId?: string;
    type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    status?: 'PENDING' | 'POSTED' | 'CLEARED' | 'RECONCILED';
    isTransfer?: boolean;
    isPending?: boolean;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'amount' | 'description';
  }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      accountId: string;
      amount: number;
      date: string;
      description: string;
      type: string;
      status: string;
      categoryId?: string;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.merchantId) searchParams.set('merchantId', params.merchantId);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.isTransfer !== undefined) searchParams.set('isTransfer', params.isTransfer.toString());
    if (params?.isPending !== undefined) searchParams.set('isPending', params.isPending.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.amountMin !== undefined) searchParams.set('amountMin', params.amountMin.toString());
    if (params?.amountMax !== undefined) searchParams.set('amountMax', params.amountMax.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(params?: {
    accountId?: string;
    dateFrom?: string;
    dateTo?: string;
  }, organizationId?: string): Promise<ApiResponse<{
    totalTransactions: number;
    totalIncome: number;
    totalExpense: number;
    netFlow: number;
    averageTransaction: number;
    byCategory: Array<{
      categoryId: string;
      categoryName: string;
      amount: number;
      count: number;
    }>;
    byMerchant: Array<{
      merchantId: string;
      merchantName: string;
      amount: number;
      count: number;
    }>;
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/stats${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get single transaction
   */
  async getTransaction(id: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    accountId: string;
    amount: number;
    currency: string;
    date: string;
    description: string;
    type: string;
    status: string;
    categoryId?: string;
    merchantId?: string;
    notes?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.get(`${this.basePath}/${id}`, organizationId);
  }

  /**
   * Update transaction
   */
  async updateTransaction(id: string, data: {
    description?: string;
    categoryId?: string;
    status?: 'PENDING' | 'POSTED' | 'CLEARED' | 'RECONCILED';
    notes?: string;
    tags?: string[];
    accountId?: string;
    metadata?: Record<string, any>;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    description: string;
    categoryId?: string;
    status: string;
    accountId?: string;
    updatedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${id}`, data, organizationId);
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string, organizationId?: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/${id}`, organizationId);
  }

  // ============================================================================
  // TRANSACTION CATEGORIES & MERCHANTS
  // ============================================================================

  /**
   * Get transaction category groups with categories
   */
  async getCategoryGroups(organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      name: string;
      displayName?: string;
      emoji?: string;
      color?: string;
      categories?: Array<{
        id: string;
        name: string;
        displayName?: string;
        emoji?: string;
        color?: string;
      }>;
    }>;
  }>> {
    return apiClient.get(`/category-groups`, organizationId);
  }

  /**
   * Get flat list of all transaction categories
   */
  async getCategories(params?: {
    groupId?: string;
    page?: number;
    limit?: number;
    activeOnly?: boolean;
    search?: string;
  }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      name: string;
      displayName?: string;
      emoji?: string;
      color?: string;
      groupId: string;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.groupId) searchParams.set('groupId', params.groupId);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.activeOnly !== undefined) searchParams.set('activeOnly', params.activeOnly.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return apiClient.get(`/categories${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Search categories by name
   */
  async searchCategories(query: string, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      name: string;
      displayName?: string;
      emoji?: string;
      color?: string;
      groupId: string;
    }>;
  }>> {
    return apiClient.get(`/categories/search?q=${encodeURIComponent(query)}`, organizationId);
  }

  /**
   * Get merchants
   */
  async getMerchants(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      name: string;
      category: string;
      logoUrl?: string;
      isVerified: boolean;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return apiClient.get(`/merchants${query ? `?${query}` : ''}`, organizationId);
  }

  // ============================================================================
  // TRANSACTION NOTES & TAGS
  // ============================================================================

  /**
   * Get transaction notes
   */
  async getTransactionNotes(transactionId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.get(`${this.basePath}/${transactionId}/notes`, organizationId);
  }

  /**
   * Add/update transaction notes
   */
  async updateTransactionNotes(transactionId: string, notes: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    notes: string;
    updatedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${transactionId}/notes`, { notes }, organizationId);
  }

  /**
   * Delete transaction notes
   */
  async deleteTransactionNotes(transactionId: string, organizationId?: string): Promise<ApiResponse<{
    success: boolean;
    message: string;
  }>> {
    return apiClient.delete(`${this.basePath}/${transactionId}/notes`, organizationId);
  }

  /**
   * Add tags to a transaction
   */
  async addTransactionTags(transactionId: string, tags: string[], organizationId?: string): Promise<ApiResponse<{
    id: string;
    tags: string[];
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${transactionId}/tags/add`, { tags }, organizationId);
  }

  /**
   * Remove tags from a transaction
   */
  async removeTransactionTags(transactionId: string, tags: string[], organizationId?: string): Promise<ApiResponse<{
    id: string;
    tags: string[];
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${transactionId}/tags/remove`, { tags }, organizationId);
  }

  /**
   * Replace all tags for a transaction
   */
  async replaceTransactionTags(transactionId: string, tags: string[], organizationId?: string): Promise<ApiResponse<{
    id: string;
    tags: string[];
    updatedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${transactionId}/tags`, { tags }, organizationId);
  }

  /**
   * Get all user tags
   */
  async getAllUserTags(organizationId?: string, sort?: 'name' | 'count' | 'count_desc'): Promise<ApiResponse<Array<{
    tag: string;
    count: number;
    lastUsed: string;
  }>>> {
    const query = sort ? `?sort=${sort}` : '';
    return apiClient.get(`/transactions/user/tags${query}`, organizationId);
  }

  /**
   * Get transactions by tag
   */
  async getTransactionsByTag(tag: string, params?: { limit?: number; offset?: number }, organizationId?: string): Promise<ApiResponse<{
    data: any[];
    metadata: {
      tag: string;
      totalTransactions: number;
      totalAmount: number;
    };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/tags/${tag}${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Search transactions by notes
   */
  async searchTransactionsByNotes(query: string, limit?: number, organizationId?: string): Promise<ApiResponse<{
    data: any[];
  }>> {
    return apiClient.post(`${this.basePath}/search/notes`, { query, limit }, organizationId);
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk categorize transactions
   */
  async bulkCategorizeTransactions(transactionIds: string[], category: string, organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalUpdated: number;
    failed: string[];
    updatedIds: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/categorize`, { transactionIds, category }, organizationId);
  }

  /**
   * Bulk add tags
   */
  async bulkAddTransactionTags(transactionIds: string[], tags: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalUpdated: number;
    failed: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/tag`, { transactionIds, tags, operation: 'add' }, organizationId);
  }

  /**
   * Bulk remove tags
   */
  async bulkRemoveTransactionTags(transactionIds: string[], tags: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalUpdated: number;
    failed: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/tag`, { transactionIds, tags, operation: 'remove' }, organizationId);
  }

  /**
   * Bulk replace tags
   */
  async bulkReplaceTransactionTags(transactionIds: string[], tags: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalUpdated: number;
    failed: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/tag`, { transactionIds, tags, operation: 'replace' }, organizationId);
  }

  /**
   * Bulk add notes
   */
  async bulkAddTransactionNotes(transactionIds: string[], notes: string, organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalUpdated: number;
    failed: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/notes`, { transactionIds, notes, operation: 'add' }, organizationId);
  }

  /**
   * Bulk delete transactions
   */
  async bulkDeleteTransactions(transactionIds: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalDeleted: number;
    failed: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/delete`, { transactionIds }, organizationId);
  }

  /**
   * Bulk restore transactions
   */
  async bulkRestoreTransactions(transactionIds: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalRestored: number;
    failed: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk/restore`, { transactionIds }, organizationId);
  }

  /**
   * Validate bulk operation
   */
  async validateBulkOperation(transactionIds: string[], organizationId?: string): Promise<ApiResponse<{
    valid: string[];
    invalid: string[];
    validCount: number;
    invalidCount: number;
  }>> {
    return apiClient.post(`${this.basePath}/bulk/validate`, { transactionIds }, organizationId);
  }

  // ============================================================================
  // TRANSACTION STATUS & RECONCILIATION
  // ============================================================================

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    status: string;
    reconciliationStatus: string;
    statusHistory: Array<{
      status: string;
      timestamp: string;
    }>;
  }>> {
    return apiClient.get(`${this.basePath}/${transactionId}/status`, organizationId);
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(transactionId: string, status: string, reconciliationStatus?: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    status: string;
    reconciliationStatus?: string;
    updatedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${transactionId}/status`, { status, reconciliationStatus }, organizationId);
  }

  /**
   * Get status history
   */
  async getTransactionStatusHistory(transactionId: string, organizationId?: string): Promise<ApiResponse<Array<{
    id: string;
    status: string;
    fromStatus: string | null;
    toStatus: string;
    timestamp: string;
  }>>> {
    return apiClient.get(`${this.basePath}/${transactionId}/status-history`, organizationId);
  }

  /**
   * Get category history
   */
  async getTransactionCategoryHistory(transactionId: string, organizationId?: string): Promise<ApiResponse<Array<{
    id: string;
    timestamp: string;
    previousCategory: string | null;
    newCategory: string;
    changedBy: string;
    changeMethod: string;
    confidence: number;
  }>>> {
    return apiClient.get(`${this.basePath}/${transactionId}/category-history`, organizationId);
  }

  /**
   * Update transaction category
   */
  async updateTransactionCategory(transactionId: string, category: string, notes?: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    category: string;
    updatedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${transactionId}/category`, { category, notes }, organizationId);
  }

  /**
   * Revert category to previous
   */
  async revertTransactionCategory(transactionId: string, steps?: number, organizationId?: string): Promise<ApiResponse<{
    id: string;
    previousCategory: string;
    newCategory: string;
    stepsReverted?: number;
    revertedAt: string;
  }>> {
    const path = steps ? `${this.basePath}/${transactionId}/category/revert/${steps}` : `${this.basePath}/${transactionId}/category/revert`;
    return apiClient.post(path, {}, organizationId);
  }

  // ============================================================================
  // TRANSACTION ATTACHMENTS
  // ============================================================================

  /**
   * Upload attachment to transaction
   */
  async uploadTransactionAttachment(transactionId: string, file: File, description?: string, isPublic?: boolean, organizationId?: string): Promise<ApiResponse<{
    id: string;
    transactionId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
    description?: string;
    isPublic: boolean;
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    if (isPublic !== undefined) formData.append('isPublic', isPublic.toString());
    return apiClient.post(`${this.basePath}/${transactionId}/attachments`, formData, organizationId);
  }

  /**
   * Get transaction attachments
   */
  async getTransactionAttachments(transactionId: string, organizationId?: string): Promise<ApiResponse<{
    attachments: Array<{
      id: string;
      fileName: string;
      fileSize: number;
      fileType: string;
      uploadedAt: string;
      description?: string;
      isPublic: boolean;
    }>;
    total: number;
  }>> {
    return apiClient.get(`${this.basePath}/${transactionId}/attachments`, organizationId);
  }

  /**
   * Get presigned URL for downloading attachment
   */
  async getAttachmentDownloadUrl(attachmentId: string, organizationId?: string): Promise<ApiResponse<{
    downloadUrl: string;
    expiresIn: number;
  }>> {
    return apiClient.get(`/attachments/${attachmentId}/download`, organizationId);
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(attachmentId: string, organizationId?: string): Promise<ApiResponse<{
    success: boolean;
    message: string;
  }>> {
    return apiClient.delete(`/attachments/${attachmentId}`, organizationId);
  }

  /**
   * Make attachment public
   */
  async makeAttachmentPublic(attachmentId: string, organizationId?: string): Promise<ApiResponse<{
    attachmentId: string;
    isPublic: boolean;
    updatedAt: string;
  }>> {
    return apiClient.put(`/attachments/${attachmentId}/public`, {}, organizationId);
  }

  /**
   * Make attachment private
   */
  async makeAttachmentPrivate(attachmentId: string, organizationId?: string): Promise<ApiResponse<{
    attachmentId: string;
    isPublic: boolean;
    updatedAt: string;
  }>> {
    return apiClient.delete(`/attachments/${attachmentId}/public`, organizationId);
  }

  /**
   * Get attachment quota usage
   */
  async getAttachmentQuotaUsage(organizationId?: string): Promise<ApiResponse<{
    used: number;
    quota: number;
    remaining: number;
    percentageUsed: string;
  }>> {
    return apiClient.get(`/accounts/attachment-quota`, organizationId);
  }

  // ============================================================================
  // DUPLICATE DETECTION & RESOLUTION
  // ============================================================================

  /**
   * Get all duplicates
   */
  async getDuplicates(params?: { status?: string; accountId?: string; limit?: number; offset?: number }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      transactionIds: string[];
      merchant: string;
      amount: number;
      status: string;
      detectedAt: string;
      transactions: any[];
    }>;
    pagination: { total: number; limit: number; offset: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiClient.get(`/banking/duplicates${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get duplicate statistics
   */
  async getDuplicateStats(organizationId?: string): Promise<ApiResponse<{
    totalDuplicates: number;
    pendingDuplicates: number;
    resolvedDuplicates: number;
    ignoredDuplicates: number;
    totalDuplicateAmount: number;
    averageDuplicateAmount: number;
  }>> {
    return apiClient.get(`/banking/duplicates/stats`, organizationId);
  }

  /**
   * Resolve duplicate
   */
  async resolveDuplicate(duplicateId: string, keepTransactionId: string, mergeNotes?: boolean, organizationId?: string): Promise<ApiResponse<{
    duplicateId: string;
    status: string;
    keptTransaction: string;
    deletedTransactions: string[];
    resolvedAt: string;
  }>> {
    return apiClient.post(`/banking/duplicates/resolve`, {
      duplicateId,
      keepTransactionId,
      mergeNotes,
    }, organizationId);
  }

  /**
   * Ignore duplicate
   */
  async ignoreDuplicate(duplicateId: string, reason?: string, organizationId?: string): Promise<ApiResponse<{
    duplicateId: string;
    status: string;
    reason?: string;
    ignoredAt: string;
  }>> {
    return apiClient.post(`/banking/duplicates/${duplicateId}/ignore`, { reason }, organizationId);
  }

  /**
   * Get account duplicates
   */
  async getAccountDuplicates(accountId: string, organizationId?: string): Promise<ApiResponse<{
    data: any[];
    statistics: {
      totalDuplicates: number;
      pendingDuplicates: number;
      totalDuplicateAmount: number;
    };
  }>> {
    return apiClient.get(`/banking/accounts/${accountId}/duplicates`, organizationId);
  }

  // ============================================================================
  // BALANCE HISTORY
  // ============================================================================

  /**
   * Get account balance history
   */
  async getBalanceHistory(accountId: string, params?: { dateFrom?: string; dateTo?: string; limit?: number }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      accountId: string;
      date: string;
      currentBalance: number;
      availableBalance: number;
      limitBalance?: number;
      currency: string;
      source: string;
      createdAt: string;
    }>;
    metadata: {
      total: number;
      limit: number;
      offset: number;
      dateRange: { from: string; to: string };
    };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    const query = searchParams.toString();
    return apiClient.get(`/banking/accounts/${accountId}/balance-history${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get balance trend
   */
  async getBalanceTrend(accountId: string, params?: { days?: number; granularity?: string }, organizationId?: string): Promise<ApiResponse<{
    accountId: string;
    period: string;
    startDate: string;
    endDate: string;
    trend: Array<{
      date: string;
      balance: number;
      change: number;
      changePercent: number;
    }>;
    summary: {
      startBalance: number;
      endBalance: number;
      totalChange: number;
      totalChangePercent: number;
      highBalance: number;
      lowBalance: number;
      averageBalance: number;
      volatility: number;
    };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.days) searchParams.set('days', params.days.toString());
    if (params?.granularity) searchParams.set('granularity', params.granularity);
    const query = searchParams.toString();
    return apiClient.get(`/banking/accounts/${accountId}/balance-trend${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Import balance history (CSV)
   */
  async importBalanceHistory(accountId: string, file: File, organizationId?: string): Promise<ApiResponse<{
    accountId: string;
    totalRecords: number;
    importedRecords: number;
    skippedRecords: number;
    duplicateRecords: number;
    dateRange: { from: string; to: string };
    importedAt: string;
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/banking/accounts/${accountId}/balance-history/import`, formData, organizationId);
  }

  /**
   * Export balance history (CSV)
   */
  async exportBalanceHistory(accountId: string, params?: { dateFrom?: string; dateTo?: string }, organizationId?: string): Promise<ApiResponse<Blob>> {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    const query = searchParams.toString();
    return apiClient.get(`/banking/accounts/${accountId}/balance-history/export${query ? `?${query}` : ''}`, organizationId);
  }

  // ============================================================================
  // ADVANCED SEARCH
  // ============================================================================

  /**
   * Advanced search with multiple filters
   */
  async advancedSearch(filters: {
    merchants?: string[];
    categories?: string[];
    dateRange?: { from: string; to: string };
    amountRange?: { min: number; max: number };
    statuses?: string[];
    reconciliationStatus?: string;
    accounts?: string[];
    isDuplicate?: boolean;
    tags?: string[];
  }, pagination?: { limit?: number; offset?: number }, sort?: string, organizationId?: string): Promise<ApiResponse<{
    data: any[];
    pagination: { total: number; limit: number; offset: number; pages: number };
  }>> {
    return apiClient.post(`${this.basePath}/search/advanced`, {
      filters,
      pagination,
      sort,
    }, organizationId);
  }

  /**
   * Search by merchant
   */
  async searchByMerchant(merchant: string, params?: { limit?: number }, organizationId?: string): Promise<ApiResponse<{
    data: any[];
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/search/merchant/${merchant}${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Search by category
   */
  async searchByCategory(categoryId: string, params?: { limit?: number }, organizationId?: string): Promise<ApiResponse<{
    data: any[];
    summary: {
      totalTransactions: number;
      totalAmount: number;
      averageAmount: number;
      categoryName: string;
    };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/search/category/${categoryId}${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Search by similar amount
   */
  async searchBySimilarAmount(amount: number, tolerance?: number, organizationId?: string): Promise<ApiResponse<{
    data: any[];
  }>> {
    const searchParams = new URLSearchParams();
    searchParams.set('amount', amount.toString());
    if (tolerance) searchParams.set('tolerance', tolerance.toString());
    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/search/similar-amount?${query}`, organizationId);
  }

  /**
   * Get merchant suggestions (autocomplete)
   */
  async getMerchantSuggestions(query: string, limit?: number, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      merchant: string;
      count: number;
      lastUsed: string;
      category: string;
    }>;
  }>> {
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    if (limit) searchParams.set('limit', limit.toString());
    const queryStr = searchParams.toString();
    return apiClient.get(`${this.basePath}/search/merchant-suggestions?${queryStr}`, organizationId);
  }
}

export const transactionsApi = new TransactionsApiService();
export default transactionsApi;
