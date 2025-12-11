import { apiClient } from '@/lib/api-client';
import type {
  CreateBudgetRequest,
  UpdateBudgetRequest,
  GetBudgetsParams,
  GetBudgetParams,
  AddBudgetTransactionRequest,
  BudgetsResponse,
  BudgetResponse,
  BudgetAnalyticsResponse,
  BudgetSummaryResponse,
  BudgetTransactionResponse,
  BudgetRefreshApiResponse,
  DeleteBudgetResponse,
} from '@/lib/types';

class BudgetApiService {
  private readonly basePath = '/budgets';

  // ============================================================================
  // BUDGET CRUD
  // ============================================================================

  /**
   * Get all budgets with filtering, sorting, and pagination
   */
  async getBudgets(params: GetBudgetsParams = {}, organizationId?: string): Promise<BudgetsResponse> {
    const searchParams = new URLSearchParams();

    // Pagination
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    // Filters
    if (params.cycle) searchParams.set('cycle', params.cycle);
    if (params.status) searchParams.set('status', params.status);
    if (params.sourceType) searchParams.set('sourceType', params.sourceType);
    if (params.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    if (params.isExceeded !== undefined) searchParams.set('isExceeded', params.isExceeded.toString());
    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.subscriptionId) searchParams.set('subscriptionId', params.subscriptionId);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.search) searchParams.set('search', params.search);
    if (params.tags) searchParams.set('tags', params.tags);

    // Sorting
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    // Includes
    if (params.includeArchived !== undefined) {
      searchParams.set('includeArchived', params.includeArchived.toString());
    }
    if (params.includePeriods !== undefined) {
      searchParams.set('includePeriods', params.includePeriods.toString());
    }
    if (params.includeAlerts !== undefined) {
      searchParams.set('includeAlerts', params.includeAlerts.toString());
    }
    if (params.includeTransactions !== undefined) {
      searchParams.set('includeTransactions', params.includeTransactions.toString());
    }

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}${query ? `?${query}` : ''}`, organizationId) as Promise<BudgetsResponse>;
  }

  /**
   * Get a single budget by ID
   */
  async getBudget(budgetId: string, params: GetBudgetParams = {}, organizationId?: string): Promise<BudgetResponse> {
    const searchParams = new URLSearchParams();

    if (params.includePeriods !== undefined) {
      searchParams.set('includePeriods', params.includePeriods.toString());
    }
    if (params.includeAlerts !== undefined) {
      searchParams.set('includeAlerts', params.includeAlerts.toString());
    }
    if (params.includeTransactions !== undefined) {
      searchParams.set('includeTransactions', params.includeTransactions.toString());
    }

    const query = searchParams.toString();
    return apiClient.get(
      `${this.basePath}/${budgetId}${query ? `?${query}` : ''}`, organizationId
    ) as Promise<BudgetResponse>;
  }

  /**
   * Create a new budget
   */
  async createBudget(budgetData: CreateBudgetRequest, organizationId?: string): Promise<BudgetResponse> {
    return apiClient.post(`${this.basePath}`, budgetData, organizationId) as Promise<BudgetResponse>;
  }

  /**
   * Update an existing budget
   */
  async updateBudget(budgetId: string, updates: UpdateBudgetRequest, organizationId?: string): Promise<BudgetResponse> {
    return apiClient.put(`${this.basePath}/${budgetId}`, updates, organizationId) as Promise<BudgetResponse>;
  }

  /**
   * Delete a budget permanently
   */
  async deleteBudget(budgetId: string, organizationId?: string): Promise<DeleteBudgetResponse> {
    return apiClient.delete(`${this.basePath}/${budgetId}`, organizationId) as Promise<DeleteBudgetResponse>;
  }

  // ============================================================================
  // BUDGET OPERATIONS
  // ============================================================================

  /**
   * Refresh budget spending from transactions
   */
  async refreshBudget(budgetId: string, organizationId?: string): Promise<BudgetRefreshApiResponse> {
    return apiClient.post(`${this.basePath}/${budgetId}/refresh`, undefined, organizationId) as Promise<BudgetRefreshApiResponse>;
  }

  /**
   * Archive a budget
   */
  async archiveBudget(budgetId: string, organizationId?: string): Promise<BudgetResponse> {
    return apiClient.post(`${this.basePath}/${budgetId}/archive`, undefined, organizationId) as Promise<BudgetResponse>;
  }

  /**
   * Unarchive a budget
   */
  async unarchiveBudget(budgetId: string, organizationId?: string): Promise<BudgetResponse> {
    return apiClient.post(`${this.basePath}/${budgetId}/unarchive`, undefined, organizationId) as Promise<BudgetResponse>;
  }

  /**
   * Pause a budget
   */
  async pauseBudget(budgetId: string, organizationId?: string): Promise<BudgetResponse> {
    return apiClient.post(`${this.basePath}/${budgetId}/pause`, undefined, organizationId) as Promise<BudgetResponse>;
  }

  /**
   * Resume a paused budget
   */
  async resumeBudget(budgetId: string, organizationId?: string): Promise<BudgetResponse> {
    return apiClient.post(`${this.basePath}/${budgetId}/resume`, undefined, organizationId) as Promise<BudgetResponse>;
  }

  // ============================================================================
  // BUDGET TRANSACTIONS
  // ============================================================================

  /**
   * Add a manual transaction to a budget
   */
  async addBudgetTransaction(
    budgetId: string,
    transaction: AddBudgetTransactionRequest,
    organizationId?: string
  ): Promise<BudgetTransactionResponse> {
    return apiClient.post(
      `${this.basePath}/${budgetId}/transactions`,
      transaction,
      organizationId
    ) as Promise<BudgetTransactionResponse>;
  }

  // ============================================================================
  // ANALYTICS & SUMMARY
  // ============================================================================

  /**
   * Get comprehensive budget analytics
   */
  async getBudgetAnalytics(organizationId?: string): Promise<BudgetAnalyticsResponse> {
    return apiClient.get(`${this.basePath}/analytics`, organizationId) as Promise<BudgetAnalyticsResponse>;
  }

  /**
   * Get budget summary
   */
  async getBudgetSummary(organizationId?: string): Promise<BudgetSummaryResponse> {
    return apiClient.get(`${this.basePath}/summary`, organizationId) as Promise<BudgetSummaryResponse>;
  }
}

export const budgetApi = new BudgetApiService();
