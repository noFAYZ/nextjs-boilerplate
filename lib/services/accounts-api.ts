import { apiClient } from '@/lib/api-client';
import type {
  UnifiedAccountsResponse,
  UnifiedAccountDetails,
  CreateManualAccountRequest,
  UpdateAccountRequest,
  AddTransactionRequest,
  GetAccountTransactionsParams,
  AccountTransactionsResponse,
  Transaction,
  CategoriesResponse,
  CategoryGroupsResponse,
  TransactionCategoryGroup,
} from '@/lib/types/unified-accounts';
import type { ApiResponse } from '@/lib/types/crypto';

class AccountsApiService {
  private readonly basePath = '/accounts';

  /**
   * Get all accounts grouped by category
   * @returns All accounts organized by category with summary statistics
   */
  async getAllAccounts(): Promise<ApiResponse<UnifiedAccountsResponse>> {
    return apiClient.get(this.basePath);
  }

  /**
   * Get detailed information about a specific account
   * @param accountId - The account ID
   * @returns Account details with performance data and transaction stats
   */
  async getAccountDetails(accountId: string): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.get(`${this.basePath}/${accountId}`);
  }

  /**
   * Create a new manual account
   * @param data - Account creation data
   * @returns Created account details
   */
  async createManualAccount(data: CreateManualAccountRequest): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.post(`${this.basePath}/manual`, data);
  }

  /**
   * Update an existing account
   * @param accountId - The account ID
   * @param updates - Fields to update
   * @returns Updated account details
   */
  async updateAccount(accountId: string, updates: UpdateAccountRequest): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.put(`${this.basePath}/${accountId}`, updates);
  }

  /**
   * Delete/deactivate an account (soft delete)
   * @param accountId - The account ID
   * @returns Success response
   */
  async deleteAccount(accountId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(`${this.basePath}/${accountId}`);
  }

  /**
   * Get transactions for a specific account
   * @param accountId - The account ID
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of transactions
   */
  async getAccountTransactions(
    accountId: string,
    params?: GetAccountTransactionsParams
  ): Promise<ApiResponse<AccountTransactionsResponse>> {
    return apiClient.get(`${this.basePath}/${accountId}/transactions`, { params });
  }

  /**
   * Add a new transaction to an account (manual transaction)
   * @param accountId - The account ID
   * @param data - Transaction data
   * @returns Created transaction details
   */
  async addTransaction(
    accountId: string,
    data: AddTransactionRequest
  ): Promise<ApiResponse<Transaction>> {
    return apiClient.post(`${this.basePath}/${accountId}/transactions`, data);
  }

  /**
   * Get all transaction category groups with categories (for envelope budgeting and transaction forms)
   * @param organizationId - Optional organization ID filter
   * @returns Hierarchical list of category groups with categories
   */
  async getCategoryGroups(organizationId?: string): Promise<ApiResponse<CategoryGroupsResponse>> {
    const queryParams = new URLSearchParams();
    queryParams.append('includeCategories', 'true');
    queryParams.append('hierarchy', 'false');
    if (organizationId) {
      queryParams.append('organizationId', organizationId);
    }
    const queryString = queryParams.toString();
    const endpoint = `/accounts/transactions/category-groups${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<CategoryGroupsResponse>(endpoint);
  }

  /**
   * Get flat list of all transaction categories
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of all available categories
   */
  async getCategories(params?: { groupId?: string; page?: number; limit?: number; activeOnly?: boolean; search?: string }): Promise<ApiResponse<CategoriesResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.groupId) queryParams.append('groupId', params.groupId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.activeOnly !== undefined) queryParams.append('activeOnly', params.activeOnly.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/accounts/transactions/categories${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<CategoriesResponse>(endpoint);
  }

  /**
   * Search categories by name
   * @param query - Search query string
   * @returns List of matching categories
   */
  async searchCategories(query: string): Promise<ApiResponse<{ data: Array<{ id: string; name: string; displayName?: string; emoji?: string; color?: string; groupId: string }> }>> {
    const endpoint = `/accounts/transactions/categories/search?q=${encodeURIComponent(query)}`;
    return apiClient.get<{ data: Array<{ id: string; name: string; displayName?: string; emoji?: string; color?: string; groupId: string }> }>(endpoint);
  }

  /**
   * Get all transactions across all accounts (global transactions)
   * @param params - Query parameters for filtering, pagination, and date range
   * @returns Paginated list of all transactions from all accounts
   */
  async getAllTransactions(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    merchantId?: string;
    categoryId?: string;
    type?: string;
    source?: string;
    search?: string;
  }): Promise<ApiResponse<AccountTransactionsResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.merchantId) queryParams.append('merchantId', params.merchantId);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.source) queryParams.append('source', params.source);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/accounts/transactions${queryString ? `?${queryString}` : ''}`;
    return apiClient.get<AccountTransactionsResponse>(endpoint);
  }
}

export const accountsApi = new AccountsApiService();
