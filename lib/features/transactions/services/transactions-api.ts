import { apiClient } from '@/lib/core/api';
import type { ApiResponse } from '@/lib/types/crypto';

/**
 * Transaction API Service - Complete Implementation
 *
 * Comprehensive transaction management with 60+ endpoints covering:
 * - Core transactions (CRUD, search, bulk operations)
 * - Transaction notes, attachments, and reconciliation
 * - Categories and category groups management
 * - Category-based and custom categorization rules
 * - Advanced analytics and pattern detection
 * - Merchant tracking and management
 *
 * Base paths:
 * - /api/v1/transactions (18 endpoints)
 * - /api/v1/categories (6 endpoints)
 * - /api/v1/category-groups (5 endpoints)
 * - /api/v1/category-rules (10 endpoints)
 * - /api/v1/categorization-rules (14 endpoints)
 * - /api/v1/findings (6 endpoints)
 * - /api/v1/merchants (1 endpoint)
 */
class TransactionsApiService {
  private readonly basePath = '/transactions';
  private readonly categoriesPath = '/categories';
  private readonly categoryGroupsPath = '/category-groups';
  private readonly categoryRulesPath = '/category-rules';
  private readonly categorizationRulesPath = '/categorization-rules';
  private readonly findingsPath = '/findings';
  private readonly merchantsPath = '/merchants';

  // ============================================================================
  // 1. CORE TRANSACTIONS - CRUD OPERATIONS
  // ============================================================================

  /**
   * List all transactions with filtering and pagination
   *
   * Supported filters:
   * - accountId: Filter by account
   * - categoryId: Filter by category
   * - type: INCOME, EXPENSE, TRANSFER
   * - dateFrom/dateTo: Date range (ISO format)
   * - page/limit: Pagination
   */
  async listTransactions(
    params?: {
      accountId?: string;
      categoryId?: string;
      type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      data: Array<{
        id: string;
        accountId: string;
        amount: number;
        date: string;
        description: string;
        type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
        status: string;
        categoryId: string;
        notes?: string;
        tags?: string[];
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
      };
      timestamp: string;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get(
      `${this.basePath}${query ? `?${query}` : ''}`,
      organizationId
    );
  }

  /**
   * Create a new transaction
   *
   * Supported fields:
   * - accountId (required)
   * - amount (required)
   * - date (required, ISO format)
   * - description (required)
   * - type (required): INCOME, EXPENSE, TRANSFER
   * - status: POSTED, PENDING, CLEARED
   * - categoryId (required)
   * - notes (optional)
   * - tags (optional): Array of tag strings
   */
  async createTransaction(
    data: {
      accountId: string;
      amount: number;
      date: string;
      description: string;
      type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
      status?: 'POSTED' | 'PENDING' | 'CLEARED';
      categoryId: string;
      notes?: string;
      tags?: string[];
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      accountId: string;
      amount: number;
      date: string;
      description: string;
      type: string;
      status: string;
      categoryId: string;
      notes?: string;
      tags?: string[];
      createdAt: string;
    }>
  > {
    return apiClient.post(`${this.basePath}`, data, organizationId);
  }

  /**
   * Get a single transaction by ID
   */
  async getTransaction(
    id: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      accountId: string;
      amount: number;
      date: string;
      description: string;
      type: string;
      status: string;
      categoryId: string;
      notes?: string;
      tags?: string[];
      createdAt: string;
      updatedAt: string;
    }>
  > {
    return apiClient.get(`${this.basePath}/${id}`, organizationId);
  }

  /**
   * Update a transaction
   *
   * Updatable fields:
   * - description
   * - categoryId
   * - status
   * - notes
   * - merchantId
   */
  async updateTransaction(
    id: string,
    data: {
      description?: string;
      categoryId?: string;
      status?: 'POSTED' | 'PENDING' | 'CLEARED';
      notes?: string;
      merchantId?: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      accountId: string;
      amount: number;
      date: string;
      description: string;
      categoryId: string;
      notes?: string;
      updatedAt: string;
    }>
  > {
    return apiClient.put(`${this.basePath}/${id}`, data, organizationId);
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(
    id: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/${id}`, organizationId);
  }

  // ============================================================================
  // 2. SEARCH & FILTERING
  // ============================================================================

  /**
   * Search transactions by query, amount range, date range, etc.
   *
   * Supports advanced filtering:
   * - q: Search query (merchant/description/notes)
   * - accountIds: Comma-separated account IDs
   * - categories: Comma-separated category IDs
   * - merchants: Comma-separated merchant IDs
   * - minAmount/maxAmount: Amount range
   * - dateFrom/dateTo: Date range (YYYY-MM-DD)
   * - isDuplicate: Filter by duplicate status
   */
  async searchTransactions(
    params: {
      q?: string;
      accountIds?: string;
      categories?: string;
      merchants?: string;
      minAmount?: number;
      maxAmount?: number;
      dateFrom?: string;
      dateTo?: string;
      isDuplicate?: boolean;
      limit?: number;
      offset?: number;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        accountId: string;
        amount: number;
        date: string;
        description: string;
        type: string;
        status: string;
        categoryId: string;
        notes?: string;
        createdAt: string;
      }>
    >
  > {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.accountIds) searchParams.set('accountIds', params.accountIds);
    if (params.categories) searchParams.set('categories', params.categories);
    if (params.merchants) searchParams.set('merchants', params.merchants);
    if (params.minAmount !== undefined)
      searchParams.set('minAmount', params.minAmount.toString());
    if (params.maxAmount !== undefined)
      searchParams.set('maxAmount', params.maxAmount.toString());
    if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params.isDuplicate !== undefined)
      searchParams.set('isDuplicate', params.isDuplicate.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    const query = searchParams.toString();
    return apiClient.get(
      `${this.basePath}/search?${query}`,
      organizationId
    );
  }

  // ============================================================================
  // 3. BULK OPERATIONS
  // ============================================================================

  /**
   * Create multiple transactions in a single request
   */
  async createTransactionsBulk(
    data: {
      transactions: Array<{
        accountId: string;
        amount: number;
        date: string;
        description: string;
        type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
        categoryId: string;
        notes?: string;
        tags?: string[];
      }>;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      data: Array<{
        id: string;
        accountId: string;
        amount: number;
        date: string;
        description: string;
        createdAt: string;
      }>;
    }>
  > {
    return apiClient.post(
      `${this.basePath}/bulk`,
      data,
      organizationId
    );
  }

  /**
   * Validate transactions before bulk creation
   */
  async validateBulkTransactions(
    data: {
      transactionIds: string[];
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      valid: number;
      invalid: number;
      total: number;
    }>
  > {
    return apiClient.post(
      `${this.basePath}/bulk/validate`,
      data,
      organizationId
    );
  }

  // ============================================================================
  // 4. STATISTICS
  // ============================================================================

  /**
   * Get transaction statistics for a period
   *
   * Returns:
   * - totalTransactions
   * - totalAmount
   * - averageAmount
   * - largestTransaction
   * - smallestTransaction
   */
  async getTransactionStats(
    params?: {
      accountId?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      totalTransactions: number;
      totalAmount: number;
      averageAmount: number;
      largestTransaction: number;
      smallestTransaction: number;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.accountId)
      searchParams.set('accountId', params.accountId);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);

    const query = searchParams.toString();
    return apiClient.get(
      `${this.basePath}/stats${query ? `?${query}` : ''}`,
      organizationId
    );
  }

  // ============================================================================
  // 5. NOTES & ATTACHMENTS
  // ============================================================================

  /**
   * Get notes for a transaction
   */
  async getTransactionNotes(
    transactionId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      transactionId: string;
      notes: string[];
    }>
  > {
    return apiClient.get(
      `${this.basePath}/${transactionId}/notes`,
      organizationId
    );
  }

  /**
   * Add a note to a transaction
   */
  async addTransactionNote(
    transactionId: string,
    data: {
      text: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; text: string; createdAt: string }>> {
    return apiClient.post(
      `${this.basePath}/${transactionId}/notes`,
      data,
      organizationId
    );
  }

  /**
   * Upload an attachment to a transaction
   * Note: This is a multipart form-data request, may require special handling
   */
  async uploadTransactionAttachment(
    transactionId: string,
    file: File,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      filename: string;
      fileSize: number;
      uploadedAt: string;
    }>
  > {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(
      `${this.basePath}/${transactionId}/attachments`,
      formData,
      organizationId
    );
  }

  /**
   * Get attachments for a transaction
   */
  async getTransactionAttachments(
    transactionId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        filename: string;
        fileSize: number;
        uploadedAt: string;
      }>
    >
  > {
    return apiClient.get(
      `${this.basePath}/${transactionId}/attachments`,
      organizationId
    );
  }

  /**
   * Download an attachment
   */
  async downloadAttachment(
    attachmentId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.get(
      `/attachments/${attachmentId}/download`,
      organizationId
    );
  }

  /**
   * Delete an attachment
   */
  async deleteAttachment(
    attachmentId: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `/attachments/${attachmentId}`,
      organizationId
    );
  }

  /**
   * Make an attachment public
   */
  async makeAttachmentPublic(
    attachmentId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; isPublic: boolean }>> {
    return apiClient.put(
      `/attachments/${attachmentId}/public`,
      {},
      organizationId
    );
  }

  /**
   * Make an attachment private
   */
  async makeAttachmentPrivate(
    attachmentId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; isPublic: boolean }>> {
    return apiClient.delete(
      `/attachments/${attachmentId}/public`,
      organizationId
    );
  }

  // ============================================================================
  // 6. RECONCILIATION
  // ============================================================================

  /**
   * Mark a transaction as reconciled
   *
   * Links two transactions together (e.g., bank statement and manual entry)
   */
  async reconcileTransaction(
    transactionId: string,
    data: {
      matchedTransactionId: string;
      notes?: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      reconciled: boolean;
      matchedTransactionId: string;
    }>
  > {
    return apiClient.post(
      `${this.basePath}/${transactionId}/reconcile`,
      data,
      organizationId
    );
  }

  // ============================================================================
  // 7. CATEGORIES - CRUD OPERATIONS
  // ============================================================================

  /**
   * List all categories (default and custom)
   *
   * Returns:
   * - default: System default categories
   * - custom: User-created categories
   */
  async listCategories(
    organizationId?: string
  ): Promise<
    ApiResponse<{
      default: Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        groupId: string;
      }>;
      custom: Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
      }>;
    }>
  > {
    return apiClient.get(this.categoriesPath, organizationId);
  }

  /**
   * Create a custom category
   */
  async createCategory(
    data: {
      name: string;
      categoryGroupId: string;
      icon: string;
      color: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>
  > {
    return apiClient.post(this.categoriesPath, data, organizationId);
  }

  /**
   * Initialize default categories for user
   */
  async initializeDefaultCategories(
    organizationId?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(
      `${this.categoriesPath}/initialize`,
      {},
      organizationId
    );
  }

  /**
   * Update a category
   */
  async updateCategory(
    categoryId: string,
    data: {
      name?: string;
      icon?: string;
      color?: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>
  > {
    return apiClient.put(
      `${this.categoriesPath}/${categoryId}`,
      data,
      organizationId
    );
  }

  /**
   * Delete a category
   */
  async deleteCategory(
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `${this.categoriesPath}/${categoryId}`,
      organizationId
    );
  }

  /**
   * Toggle category status (enable/disable)
   */
  async toggleCategoryStatus(
    categoryId: string,
    data: {
      isEnabled: boolean;
    },
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; isEnabled: boolean }>> {
    return apiClient.patch(
      `${this.categoriesPath}/${categoryId}/status`,
      data,
      organizationId
    );
  }

  // ============================================================================
  // 8. CATEGORY GROUPS - CRUD OPERATIONS
  // ============================================================================

  /**
   * List all category groups
   */
  async listCategoryGroups(
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        categories?: Array<{
          id: string;
          name: string;
          icon: string;
          color: string;
        }>;
      }>
    >
  > {
    return apiClient.get(this.categoryGroupsPath, organizationId);
  }

  /**
   * Create a category group
   */
  async createCategoryGroup(
    data: {
      name: string;
      icon: string;
      color: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>
  > {
    return apiClient.post(this.categoryGroupsPath, data, organizationId);
  }

  /**
   * Update a category group
   */
  async updateCategoryGroup(
    groupId: string,
    data: {
      name?: string;
      icon?: string;
      color?: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>
  > {
    return apiClient.put(
      `${this.categoryGroupsPath}/${groupId}`,
      data,
      organizationId
    );
  }

  /**
   * Delete a category group
   */
  async deleteCategoryGroup(
    groupId: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `${this.categoryGroupsPath}/${groupId}`,
      organizationId
    );
  }

  /**
   * Toggle category group status
   */
  async toggleCategoryGroupStatus(
    groupId: string,
    data: {
      isEnabled: boolean;
    },
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; isEnabled: boolean }>> {
    return apiClient.patch(
      `${this.categoryGroupsPath}/${groupId}/status`,
      data,
      organizationId
    );
  }

  // ============================================================================
  // 9. CATEGORY RULES - AUTO-CATEGORIZATION RULES
  // ============================================================================

  /**
   * Create a category rule
   *
   * Rules match transaction descriptions and automatically assign categories
   */
  async createCategoryRule(
    data: {
      pattern: string;
      categoryId: string;
      description: string;
      priority: number;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      priority: number;
    }>
  > {
    return apiClient.post(this.categoryRulesPath, data, organizationId);
  }

  /**
   * List all category rules
   */
  async listCategoryRules(
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        pattern: string;
        categoryId: string;
        description: string;
        priority: number;
      }>
    >
  > {
    return apiClient.get(this.categoryRulesPath, organizationId);
  }

  /**
   * Get a single category rule
   */
  async getCategoryRule(
    ruleId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      description: string;
      priority: number;
    }>
  > {
    return apiClient.get(`${this.categoryRulesPath}/${ruleId}`, organizationId);
  }

  /**
   * Update a category rule
   */
  async updateCategoryRule(
    ruleId: string,
    data: {
      pattern?: string;
      categoryId?: string;
      description?: string;
      priority?: number;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      priority: number;
    }>
  > {
    return apiClient.put(
      `${this.categoryRulesPath}/${ruleId}`,
      data,
      organizationId
    );
  }

  /**
   * Delete a category rule
   */
  async deleteCategoryRule(
    ruleId: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `${this.categoryRulesPath}/${ruleId}`,
      organizationId
    );
  }

  /**
   * Create a merchant rule
   *
   * Links a merchant name to a category for automatic categorization
   */
  async createMerchantRule(
    data: {
      merchantName: string;
      categoryId: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      merchantName: string;
      categoryId: string;
    }>
  > {
    return apiClient.post(
      `${this.categoryRulesPath}/merchant-rules`,
      data,
      organizationId
    );
  }

  /**
   * List all merchant rules
   */
  async listMerchantRules(
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        merchantName: string;
        categoryId: string;
      }>
    >
  > {
    return apiClient.get(
      `${this.categoryRulesPath}/merchant-rules`,
      organizationId
    );
  }

  /**
   * Delete a merchant rule
   */
  async deleteMerchantRule(
    ruleId: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `${this.categoryRulesPath}/merchant-rules/${ruleId}`,
      organizationId
    );
  }

  /**
   * Bulk recategorize transactions
   *
   * Changes the category for multiple transactions at once
   */
  async bulkRecategorize(
    data: {
      transactionIds: string[];
      categoryId: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      updated: number;
      failed: number;
      total: number;
    }>
  > {
    return apiClient.post(
      `${this.categoryRulesPath}/bulk-recategorize`,
      data,
      organizationId
    );
  }

  /**
   * Get categorization statistics
   *
   * Shows how many transactions have been categorized by rules
   */
  async getCategorizationStats(
    organizationId?: string
  ): Promise<
    ApiResponse<{
      totalRules: number;
      transactionsCategorized: number;
      successRate: number;
    }>
  > {
    return apiClient.get(
      `${this.categoryRulesPath}/stats/categorization`,
      organizationId
    );
  }

  // ============================================================================
  // 10. CUSTOM CATEGORIZATION RULES - ADVANCED PATTERN MATCHING
  // ============================================================================

  /**
   * Create a custom categorization rule
   *
   * Supports regex patterns for flexible matching
   * Priority: 0-100 (higher priority matches first)
   */
  async createCategorizationRule(
    data: {
      pattern: string;
      categoryId: string;
      description: string;
      priority: number;
      isEnabled?: boolean;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      priority: number;
      isEnabled: boolean;
    }>
  > {
    return apiClient.post(
      this.categorizationRulesPath,
      data,
      organizationId
    );
  }

  /**
   * List all custom categorization rules
   */
  async listCategorizationRules(
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        pattern: string;
        categoryId: string;
        description: string;
        priority: number;
        isEnabled: boolean;
      }>
    >
  > {
    return apiClient.get(this.categorizationRulesPath, organizationId);
  }

  /**
   * Get a single categorization rule
   */
  async getCategorizationRule(
    ruleId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      description: string;
      priority: number;
      isEnabled: boolean;
    }>
  > {
    return apiClient.get(
      `${this.categorizationRulesPath}/${ruleId}`,
      organizationId
    );
  }

  /**
   * Update a categorization rule
   */
  async updateCategorizationRule(
    ruleId: string,
    data: {
      pattern?: string;
      categoryId?: string;
      description?: string;
      priority?: number;
      isEnabled?: boolean;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      priority: number;
      isEnabled: boolean;
    }>
  > {
    return apiClient.put(
      `${this.categorizationRulesPath}/${ruleId}`,
      data,
      organizationId
    );
  }

  /**
   * Delete a categorization rule
   */
  async deleteCategorizationRule(
    ruleId: string,
    organizationId?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete(
      `${this.categorizationRulesPath}/${ruleId}`,
      organizationId
    );
  }

  /**
   * Test a single rule against a merchant name
   *
   * Returns whether the rule matches and what category it would assign
   */
  async testCategorizationRule(
    ruleId: string,
    data: {
      merchantName: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      matches: boolean;
      categoryId: string;
    }>
  > {
    return apiClient.post(
      `${this.categorizationRulesPath}/${ruleId}/test`,
      data,
      organizationId
    );
  }

  /**
   * Test all rules against a merchant name
   *
   * Returns the first matching rule (by priority)
   */
  async testAllCategorizationRules(
    data: {
      merchantName: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      matches: boolean;
      ruleId: string;
      categoryId: string;
      priority: number;
    }>
  > {
    return apiClient.post(
      `${this.categorizationRulesPath}/test-all`,
      data,
      organizationId
    );
  }

  /**
   * Enable a categorization rule
   */
  async enableCategorizationRule(
    ruleId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; isEnabled: boolean }>> {
    return apiClient.post(
      `${this.categorizationRulesPath}/${ruleId}/enable`,
      {},
      organizationId
    );
  }

  /**
   * Disable a categorization rule
   */
  async disableCategorizationRule(
    ruleId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; isEnabled: boolean }>> {
    return apiClient.post(
      `${this.categorizationRulesPath}/${ruleId}/disable`,
      {},
      organizationId
    );
  }

  /**
   * Set rule priority
   *
   * Priority 0-100, higher priority matches first
   */
  async setCategorizationRulePriority(
    ruleId: string,
    data: {
      priority: number;
    },
    organizationId?: string
  ): Promise<ApiResponse<{ id: string; priority: number }>> {
    return apiClient.post(
      `${this.categorizationRulesPath}/${ruleId}/priority`,
      data,
      organizationId
    );
  }

  /**
   * Get rule statistics
   *
   * Shows how many times a rule has matched and its success rate
   */
  async getCategorizationRuleStats(
    ruleId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      matches: number;
      successRate: number;
      lastUsed: string;
    }>
  > {
    return apiClient.get(
      `${this.categorizationRulesPath}/${ruleId}/stats`,
      organizationId
    );
  }

  /**
   * Duplicate a categorization rule
   *
   * Creates a copy of an existing rule
   */
  async duplicateCategorizationRule(
    ruleId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      id: string;
      pattern: string;
      categoryId: string;
      priority: number;
    }>
  > {
    return apiClient.post(
      `${this.categorizationRulesPath}/${ruleId}/duplicate`,
      {},
      organizationId
    );
  }

  /**
   * Import categorization rules from JSON
   *
   * Bulk import multiple rules at once
   */
  async importCategorizationRules(
    data: {
      rules: Array<{
        pattern: string;
        categoryId: string;
        description: string;
        priority: number;
        isEnabled?: boolean;
      }>;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      imported: number;
      failed: number;
      total: number;
    }>
  > {
    return apiClient.post(
      `${this.categorizationRulesPath}/import`,
      data,
      organizationId
    );
  }

  /**
   * Export all categorization rules
   *
   * Download all user rules as JSON
   */
  async exportCategorizationRules(
    organizationId?: string
  ): Promise<
    ApiResponse<{
      data: Array<{
        id: string;
        pattern: string;
        categoryId: string;
        description: string;
        priority: number;
        isEnabled: boolean;
      }>;
    }>
  > {
    return apiClient.get(
      `${this.categorizationRulesPath}/export`,
      organizationId
    );
  }

  // ============================================================================
  // 11. FINDINGS & ANALYTICS
  // ============================================================================

  /**
   * Auto-categorize uncategorized transactions in an account
   *
   * Uses rules to automatically assign categories
   */
  async autoCategorizeAccount(
    accountId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      categorized: number;
      skipped: number;
      total: number;
    }>
  > {
    return apiClient.post(
      `${this.findingsPath}/accounts/${accountId}/auto-categorize`,
      {},
      organizationId
    );
  }

  /**
   * Detect recurring transaction patterns
   *
   * Identifies subscriptions and regular payments
   */
  async detectRecurringPatterns(
    accountId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      patterns: Array<{
        merchant: string;
        amount: number;
        frequency: string;
        occurrences: number;
        nextExpected: string;
      }>;
    }>
  > {
    return apiClient.get(
      `${this.findingsPath}/accounts/${accountId}/recurring`,
      organizationId
    );
  }

  /**
   * Get expected upcoming transactions
   *
   * Based on recurring patterns, predicts next transactions
   */
  async getExpectedTransactions(
    accountId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        merchant: string;
        amount: number;
        expectedDate: string;
        confidence: number;
      }>
    >
  > {
    return apiClient.get(
      `${this.findingsPath}/accounts/${accountId}/expected-transactions`,
      organizationId
    );
  }

  /**
   * Export account transactions
   *
   * Supports CSV, JSON, and PDF formats
   */
  async exportAccountTransactions(
    accountId: string,
    params: {
      format: 'CSV' | 'JSON' | 'PDF';
      dateFrom: string;
      dateTo: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const searchParams = new URLSearchParams();
    searchParams.set('format', params.format);
    searchParams.set('dateFrom', params.dateFrom);
    searchParams.set('dateTo', params.dateTo);

    return apiClient.get(
      `${this.findingsPath}/accounts/${accountId}/export?${searchParams.toString()}`,
      organizationId
    );
  }

  /**
   * Find matching transactions for reconciliation
   *
   * Finds potential duplicate or matching transactions within a window
   */
  async findMatchingTransactions(
    params: {
      accountId: string;
      transactionId: string;
      windowDays?: number;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<
      Array<{
        id: string;
        amount: number;
        merchant: string;
        date: string;
        matchScore: number;
      }>
    >
  > {
    const searchParams = new URLSearchParams();
    searchParams.set('accountId', params.accountId);
    searchParams.set('transactionId', params.transactionId);
    if (params.windowDays)
      searchParams.set('windowDays', params.windowDays.toString());

    return apiClient.get(
      `${this.findingsPath}/find-matches?${searchParams.toString()}`,
      organizationId
    );
  }

  /**
   * Get reconciliation progress
   *
   * Shows how many transactions have been reconciled
   */
  async getReconciliationProgress(
    accountId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      total: number;
      reconciled: number;
      pending: number;
      percentage: number;
    }>
  > {
    const searchParams = new URLSearchParams();
    searchParams.set('accountId', accountId);

    return apiClient.get(
      `${this.findingsPath}/reconciliation-progress?${searchParams.toString()}`,
      organizationId
    );
  }

  // ============================================================================
  // 12. MERCHANTS
  // ============================================================================

  /**
   * Get unique merchants with statistics
   *
   * Lists all merchants the user has transactions with
   */
  async getMerchants(
    params?: {
      page?: number;
      limit?: number;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      data: Array<{
        id: string;
        name: string;
        transactionCount: number;
        totalAmount: number;
        frequency: string;
        lastTransaction: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
      };
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get(
      `${this.merchantsPath}${query ? `?${query}` : ''}`,
      organizationId
    );
  }
}

export const transactionsApi = new TransactionsApiService();
