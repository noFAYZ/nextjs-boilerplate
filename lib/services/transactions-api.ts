import { apiClient } from '@/lib/api-client';
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
    metadata?: Record<string, any>;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    description: string;
    categoryId?: string;
    status: string;
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
    return apiClient.get(`${this.basePath}/categories/groups`, organizationId);
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
    return apiClient.get(`${this.basePath}/categories${query ? `?${query}` : ''}`, organizationId);
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
    return apiClient.get(`${this.basePath}/categories/search?q=${encodeURIComponent(query)}`, organizationId);
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
    return apiClient.get(`${this.basePath}/merchants${query ? `?${query}` : ''}`, organizationId);
  }
}

export const transactionsApi = new TransactionsApiService();
export default transactionsApi;
