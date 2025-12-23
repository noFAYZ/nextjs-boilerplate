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

  // ============================================================================
  // ACCOUNT MANAGEMENT
  // ============================================================================

  /**
   * Create a new account
   */
  async createAccount(data: CreateManualAccountRequest, organizationId?: string): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.post(`${this.basePath}`, data, organizationId);
  }

  /**
   * Get all accounts with filtering
   */
  async getAccounts(params?: {
    accountSource?: string;
    type?: string;
    status?: string;
    isActive?: boolean;
    groupId?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }, organizationId?: string): Promise<ApiResponse<{
    data: UnifiedAccountDetails[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.accountSource) searchParams.set('accountSource', params.accountSource);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    if (params?.groupId) searchParams.set('groupId', params.groupId);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get account statistics
   */
  async getAccountStats(organizationId?: string): Promise<ApiResponse<{
    totalAccounts: number;
    activeAccounts: number;
    totalBalance: number;
    byType: Record<string, { count: number; totalBalance: number }>;
    bySource: Record<string, { count: number; totalBalance: number }>;
  }>> {
    return apiClient.get(`${this.basePath}/stats`, organizationId);
  }

  /**
   * Get detailed information about a specific account
   */
  async getAccountDetails(accountId: string, organizationId?: string): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.get(`${this.basePath}/${accountId}`, organizationId);
  }

  /**
   * Update an existing account
   */
  async updateAccount(accountId: string, updates: UpdateAccountRequest, organizationId?: string): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.put(`${this.basePath}/${accountId}`, updates, organizationId);
  }

  /**
   * Delete/deactivate an account (soft delete)
   */
  async deleteAccount(accountId: string, organizationId?: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(`${this.basePath}/${accountId}`, organizationId);
  }

  /**
   * Get account balance
   */
  async getAccountBalance(accountId: string, organizationId?: string): Promise<ApiResponse<{
    accountId: string;
    currentBalance: number;
    availableBalance: number;
    currency: string;
    lastUpdated: string;
    pending: { count: number; amount: number };
  }>> {
    return apiClient.get(`${this.basePath}/${accountId}/balance`, organizationId);
  }

  // ============================================================================
  // ACCOUNT CHARTS
  // ============================================================================

  /**
   * Get account balance chart data
   */
  async getAccountChart(accountId: string, period: string = '30d', organizationId?: string): Promise<ApiResponse<{
    period: string;
    dataPoints: Array<{
      timestamp: string;
      value: number;
      available: number;
    }>;
    summary: {
      currentBalance: number;
      highestBalance: number;
      lowestBalance: number;
      averageBalance: number;
      startDate: string;
      endDate: string;
    };
  }>> {
    const query = `?period=${period}`;
    return apiClient.get(`${this.basePath}/${accountId}/chart${query}`, organizationId);
  }

  // ============================================================================
  // NET WORTH MANAGEMENT
  // ============================================================================

  /**
   * Create a net worth snapshot
   */
  async createNetWorthSnapshot(data?: { date?: string; includeAllAccounts?: boolean }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    date: string;
    totalNetWorth: number;
    assets: Record<string, { total: number; accountCount?: number; walletCount?: number; propertyCount?: number; vehicleCount?: number }>;
    liabilities: Record<string, { total: number; accountCount?: number; loanCount?: number; mortgageCount?: number }>;
    createdAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/networth/snapshot`, data || {}, organizationId);
  }

  /**
   * Get specific net worth snapshot
   */
  async getNetWorthSnapshot(snapshotId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    date: string;
    totalNetWorth: number;
    assets: Record<string, any>;
    liabilities: Record<string, any>;
    createdAt: string;
  }>> {
    return apiClient.get(`${this.basePath}/networth/snapshot/${snapshotId}`, organizationId);
  }

  /**
   * Get latest net worth snapshot
   */
  async getLatestNetWorthSnapshot(granularity?: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    date: string;
    totalNetWorth: number;
    createdAt: string;
  }>> {
    const query = granularity ? `?granularity=${granularity}` : '';
    return apiClient.get(`${this.basePath}/networth/latest${query}`, organizationId);
  }

  /**
   * Get net worth trend over a period
   */
  async getNetWorthTrend(period?: string, organizationId?: string): Promise<ApiResponse<{
    period: string;
    startDate: string;
    endDate: string;
    data: Array<{ date: string; totalNetWorth: number }>;
    summary: {
      startNetWorth: number;
      endNetWorth: number;
      change: number;
      percentChange: number;
      trend: string;
    };
  }>> {
    const query = period ? `?period=${period}` : '';
    return apiClient.get(`${this.basePath}/networth/trend${query}`, organizationId);
  }

  /**
   * Get net worth breakdown by asset type
   */
  async getNetWorthBreakdown(organizationId?: string): Promise<ApiResponse<{
    date: string;
    totalNetWorth: number;
    assets: Record<string, any>;
    liabilities: Record<string, any>;
  }>> {
    return apiClient.get(`${this.basePath}/networth/breakdown`, organizationId);
  }

  // ============================================================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================================================

  /**
   * Get all accounts grouped by category (legacy)
   */
  async getAllAccounts(organizationId?: string): Promise<ApiResponse<UnifiedAccountsResponse>> {
    const response = await this.getAccounts(undefined, organizationId);
    if (response.success && response.data.data) {
      const accounts = response.data.data;

      // Group accounts by category (lowercase keys)
      const groups: Record<string, any> = {
        cash: { category: 'CASH', totalBalance: 0, accountCount: 0, accounts: [] },
        credit: { category: 'CREDIT', totalBalance: 0, accountCount: 0, accounts: [] },
        investments: { category: 'INVESTMENTS', totalBalance: 0, accountCount: 0, accounts: [] },
        assets: { category: 'ASSETS', totalBalance: 0, accountCount: 0, accounts: [] },
        liabilities: { category: 'LIABILITIES', totalBalance: 0, accountCount: 0, accounts: [] },
        other: { category: 'OTHER', totalBalance: 0, accountCount: 0, accounts: [] },
      };

      // Categorize each account
      accounts.forEach((account: UnifiedAccountDetails) => {
        const category = (account.category || 'OTHER').toLowerCase();
        const key = category;

        if (groups[key]) {
          groups[key].accounts.push(account);
          groups[key].totalBalance += account.balance || 0;
          groups[key].accountCount += 1;
        } else {
          // Fallback for unmapped categories
          groups.other.accounts.push(account);
          groups.other.totalBalance += account.balance || 0;
          groups.other.accountCount += 1;
        }
      });

      // Calculate summary
      const totalAssets = (groups.cash.totalBalance || 0) +
                         (groups.investments.totalBalance || 0) +
                         (groups.assets.totalBalance || 0);
      const totalLiabilities = (groups.credit.totalBalance || 0) +
                              (groups.liabilities.totalBalance || 0);

      return {
        success: true,
        data: {
          summary: {
            totalNetWorth: totalAssets - totalLiabilities,
            totalAssets,
            totalLiabilities,
            accountCount: accounts.length,
            currency: 'USD',
            lastUpdated: new Date().toISOString(),
          },
          groups,
        } as unknown as UnifiedAccountsResponse
      };
    }
    return response as ApiResponse<UnifiedAccountsResponse>;
  }

  /**
   * Create a new manual account (legacy)
   */
  async createManualAccount(data: CreateManualAccountRequest, organizationId?: string): Promise<ApiResponse<UnifiedAccountDetails>> {
    return this.createAccount(data, organizationId);
  }

  /**
   * Get transactions for a specific account
   */
  async getAccountTransactions(
    accountId: string,
    params?: GetAccountTransactionsParams,
    organizationId?: string
  ): Promise<ApiResponse<AccountTransactionsResponse>> {
    const transactionApi = await import('./transactions-api').then(m => m.transactionsApi);
    return transactionApi.getTransactions({ accountId, ...params }, organizationId) as Promise<ApiResponse<AccountTransactionsResponse>>;
  }

  /**
   * Add a new transaction to an account (manual transaction)
   */
  async addTransaction(
    accountId: string,
    data: AddTransactionRequest,
    organizationId?: string
  ): Promise<ApiResponse<Transaction>> {
    const transactionApi = await import('./transactions-api').then(m => m.transactionsApi);
    return transactionApi.createTransaction({ accountId, ...data }, organizationId) as Promise<ApiResponse<Transaction>>;
  }

  /**
   * Get all transaction category groups with categories
   */
  async getCategoryGroups(organizationId?: string): Promise<ApiResponse<CategoryGroupsResponse>> {
    const transactionApi = await import('./transactions-api').then(m => m.transactionsApi);
    return transactionApi.getCategoryGroups(organizationId) as Promise<ApiResponse<CategoryGroupsResponse>>;
  }

  /**
   * Get flat list of all transaction categories
   */
  async getCategories(params?: { groupId?: string; page?: number; limit?: number; activeOnly?: boolean; search?: string }, organizationId?: string): Promise<ApiResponse<CategoriesResponse>> {
    const transactionApi = await import('./transactions-api').then(m => m.transactionsApi);
    return transactionApi.getCategories(params, organizationId) as Promise<ApiResponse<CategoriesResponse>>;
  }

  /**
   * Search categories by name
   */
  async searchCategories(query: string, organizationId?: string): Promise<ApiResponse<{ data: Array<{ id: string; name: string; displayName?: string; emoji?: string; color?: string; groupId: string }> }>> {
    const transactionApi = await import('./transactions-api').then(m => m.transactionsApi);
    return transactionApi.searchCategories(query, organizationId) as Promise<ApiResponse<any>>;
  }

  /**
   * Get all transactions across all accounts (global transactions)
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
  }, organizationId?: string): Promise<ApiResponse<AccountTransactionsResponse>> {
    const transactionApi = await import('./transactions-api').then(m => m.transactionsApi);
    return transactionApi.getTransactions(params, organizationId) as Promise<ApiResponse<AccountTransactionsResponse>>;
  }

  /**
   * Bulk deactivate multiple accounts
   */
  async bulkDeactivateAccounts(accountIds: string[], organizationId?: string): Promise<ApiResponse<{
    successCount: number;
    failedCount: number;
    results: Array<{ id: string; success: boolean; error?: string }>;
  }>> {
    return apiClient.post(`${this.basePath}/bulk-deactivate`, { accountIds }, organizationId);
  }

  /**
   * Bulk reactivate multiple accounts
   */
  async bulkReactivateAccounts(accountIds: string[], organizationId?: string): Promise<ApiResponse<{
    successCount: number;
    failedCount: number;
    results: Array<{ id: string; success: boolean; error?: string }>;
  }>> {
    return apiClient.post(`${this.basePath}/bulk-reactivate`, { accountIds }, organizationId);
  }

  /**
   * Bulk delete multiple accounts
   */
  async bulkDeleteAccounts(accountIds: string[], organizationId?: string): Promise<ApiResponse<{
    successCount: number;
    failedCount: number;
    results: Array<{ id: string; success: boolean; error?: string }>;
  }>> {
    return apiClient.post(`${this.basePath}/bulk-delete`, { accountIds }, organizationId);
  }
}

export const accountsApi = new AccountsApiService();
