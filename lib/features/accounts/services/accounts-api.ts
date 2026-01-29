import { apiClient } from '@/lib/core/api';
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
    const transactionApi = await import('@/lib/features/transactions/services/transactions-api').then(m => m.transactionsApi);
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
    const transactionApi = await import('@/lib/features/transactions/services/transactions-api').then(m => m.transactionsApi);
    return transactionApi.createTransaction({ accountId, ...data }, organizationId) as Promise<ApiResponse<Transaction>>;
  }

  /**
   * Get all transaction category groups with categories
   */
  async getCategoryGroups(organizationId?: string): Promise<ApiResponse<CategoryGroupsResponse>> {
    const transactionApi = await import('@/lib/features/transactions/services/transactions-api').then(m => m.transactionsApi);
    return transactionApi.getCategoryGroups(organizationId) as Promise<ApiResponse<CategoryGroupsResponse>>;
  }

  /**
   * Get flat list of all transaction categories
   */
  async getCategories(params?: { groupId?: string; page?: number; limit?: number; activeOnly?: boolean; search?: string }, organizationId?: string): Promise<ApiResponse<CategoriesResponse>> {
    const transactionApi = await import('@/lib/features/transactions/services/transactions-api').then(m => m.transactionsApi);
    return transactionApi.getCategories(params, organizationId) as Promise<ApiResponse<CategoriesResponse>>;
  }

  /**
   * Search categories by name
   */
  async searchCategories(query: string, organizationId?: string): Promise<ApiResponse<{ data: Array<{ id: string; name: string; displayName?: string; emoji?: string; color?: string; groupId: string }> }>> {
    const transactionApi = await import('@/lib/features/transactions/services/transactions-api').then(m => m.transactionsApi);
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
    const transactionApi = await import('@/lib/features/transactions/services/transactions-api').then(m => m.transactionsApi);
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

  // ============================================================================
  // ACCOUNT LIFECYCLE MANAGEMENT
  // ============================================================================

  /**
   * Archive a single account (soft delete, reversible)
   */
  async archiveAccount(accountId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    status: string;
    archivedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${accountId}/archive`, {}, organizationId);
  }

  /**
   * Reopen an archived account
   */
  async reopenAccount(accountId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    status: string;
    archivedAt: null;
  }>> {
    return apiClient.post(`${this.basePath}/${accountId}/reopen`, {}, organizationId);
  }

  /**
   * Close an account permanently (irreversible)
   */
  async closeAccount(accountId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    status: string;
    closedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${accountId}/close`, {}, organizationId);
  }

  /**
   * Bulk archive multiple accounts
   */
  async bulkArchiveAccounts(accountIds: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalProcessed: number;
    failed: string[];
    processedIds: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk-archive`, { accountIds }, organizationId);
  }

  /**
   * Bulk reopen multiple accounts
   */
  async bulkReopenAccounts(accountIds: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalProcessed: number;
    failed: string[];
    processedIds: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk-reopen`, { accountIds }, organizationId);
  }

  /**
   * Bulk close multiple accounts
   */
  async bulkCloseAccounts(accountIds: string[], organizationId?: string): Promise<ApiResponse<{
    totalRequested: number;
    totalProcessed: number;
    failed: string[];
    processedIds: string[];
  }>> {
    return apiClient.post(`${this.basePath}/bulk-close`, { accountIds }, organizationId);
  }

  /**
   * Get account lifecycle history (audit trail)
   */
  async getAccountLifecycleHistory(accountId: string, organizationId?: string): Promise<ApiResponse<Array<{
    id: string;
    accountId: string;
    eventType: string;
    fromStatus: string | null;
    toStatus: string;
    timestamp: string;
  }>>> {
    return apiClient.get(`${this.basePath}/${accountId}/lifecycle-history`, organizationId);
  }

  // ============================================================================
  // ACCOUNT GROUPING & FAVORITES
  // ============================================================================

  /**
   * Get all account groups
   */
  async getAccountGroups(organizationId?: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description?: string;
    accountCount: number;
    totalBalance: number;
    createdAt: string;
  }>>> {
    return apiClient.get(`${this.basePath}/groups`, organizationId);
  }

  /**
   * Create a new account group
   */
  async createAccountGroup(data: {
    name: string;
    description?: string;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    name: string;
    description?: string;
    accountCount: number;
    createdAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/groups`, data, organizationId);
  }

  /**
   * Add account to group
   */
  async addAccountToGroup(groupId: string, accountId: string, organizationId?: string): Promise<ApiResponse<{
    groupId: string;
    accountId: string;
    addedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/groups/${groupId}/members`, { accountId }, organizationId);
  }

  /**
   * Remove account from group
   */
  async removeAccountFromGroup(groupId: string, accountId: string, organizationId?: string): Promise<ApiResponse<{
    success: boolean;
    message: string;
  }>> {
    return apiClient.delete(`${this.basePath}/groups/${groupId}/members/${accountId}`, organizationId);
  }

  /**
   * Get group summary with accounts
   */
  async getGroupSummary(groupId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    name: string;
    accountCount: number;
    totalBalance: number;
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      balance: number;
    }>;
  }>> {
    return apiClient.get(`${this.basePath}/groups/${groupId}/summary`, organizationId);
  }

  /**
   * Mark account as favorite
   */
  async markAccountFavorite(accountId: string, organizationId?: string): Promise<ApiResponse<{
    accountId: string;
    isFavorite: boolean;
    markedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${accountId}/favorite`, {}, organizationId);
  }

  /**
   * Remove account from favorites
   */
  async removeAccountFromFavorites(accountId: string, organizationId?: string): Promise<ApiResponse<{
    success: boolean;
    message: string;
  }>> {
    return apiClient.delete(`${this.basePath}/${accountId}/favorite`, organizationId);
  }

  /**
   * Get all favorite accounts
   */
  async getFavoriteAccounts(organizationId?: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    markedAt: string;
  }>>> {
    return apiClient.get(`${this.basePath}/favorites`, organizationId);
  }

  // ============================================================================
  // EXCHANGE RATES & MULTI-CURRENCY
  // ============================================================================

  /**
   * Get exchange rate between two currencies
   */
  async getExchangeRate(from: string, to: string, date?: string, organizationId?: string): Promise<ApiResponse<{
    from: string;
    to: string;
    rate: number;
    date: string;
    source: string;
  }>> {
    const searchParams = new URLSearchParams();
    searchParams.set('from', from);
    searchParams.set('to', to);
    if (date) searchParams.set('date', date);
    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/exchange-rates?${query}`, organizationId);
  }

  /**
   * Convert currency amount
   */
  async convertCurrency(amount: number, from: string, to: string, date?: string, organizationId?: string): Promise<ApiResponse<{
    originalAmount: number;
    originalCurrency: string;
    convertedAmount: number;
    targetCurrency: string;
    rate: number;
    timestamp: string;
  }>> {
    return apiClient.post(`${this.basePath}/exchange-rates/convert`, {
      amount,
      from,
      to,
      date,
    }, organizationId);
  }

  /**
   * Get net worth in a specific currency
   */
  async getNetWorthInCurrency(currency: string, organizationId?: string): Promise<ApiResponse<{
    currency: string;
    totalNetWorth: number;
    totalAssets: number;
    totalLiabilities: number;
    conversionRate: number;
    baseCurrency: string;
    timestamp: string;
  }>> {
    return apiClient.get(`${this.basePath}/networth/currency/${currency}`, organizationId);
  }

  /**
   * Refresh exchange rate cache
   */
  async refreshExchangeRateCache(organizationId?: string): Promise<ApiResponse<{
    success: boolean;
    message: string;
  }>> {
    return apiClient.post(`${this.basePath}/exchange-rates/refresh`, {}, organizationId);
  }

  /**
   * Get exchange rate cache statistics
   */
  async getExchangeRateCacheStats(organizationId?: string): Promise<ApiResponse<{
    cachedRates: number;
    oldestCacheAge: string;
    newestCacheAge: string;
    cacheSize: string;
  }>> {
    return apiClient.get(`${this.basePath}/exchange-rates/cache-stats`, organizationId);
  }

  // ============================================================================
  // BALANCE HISTORY
  // ============================================================================

  /**
   * Get account balance history
   */
  async getBalanceHistory(accountId: string, params?: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      date: string;
      balance: number;
      availableBalance: number;
      currency: string;
    }>;
    metadata: {
      total: number;
      limit: number;
      offset: number;
    };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/${accountId}/history${query ? `?${query}` : ''}`, organizationId);
  }
}

export const accountsApi = new AccountsApiService();
