import { apiClient } from '@/lib/api-client';
import type {
  BankAccount,
  BankTransaction,
  BankingOverview,
  TellerEnrollment,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
  BankTransactionParams,
  BankSyncRequest,
  BankSyncJob,
  BankingHealthCheck,
  BankingExportRequest,
  BankingExportResponse,
  BankingDashboardData
} from '@/lib/types/banking';
import type { ApiResponse } from '@/lib/types/crypto';

class BankingApiService {
  private readonly basePath = '/banking';

  // Bank Account Management
  async connectAccount(enrollmentData: CreateBankAccountRequest, organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.post(`${this.basePath}/connect`, enrollmentData, organizationId);
  }

  async getAccounts(organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get(`${this.basePath}/accounts`, organizationId);
  }

  async getGroupedAccounts(organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get(`${this.basePath}/accounts/grouped`, organizationId);
  }

  async getAccount(accountId: string, organizationId?: string): Promise<ApiResponse<BankAccount & { bankTransactions: BankTransaction[] }>> {
    return apiClient.get(`${this.basePath}/accounts/${accountId}`, organizationId);
  }

  async updateAccount(accountId: string, updates: UpdateBankAccountRequest, organizationId?: string): Promise<ApiResponse<BankAccount>> {
    return apiClient.put(`${this.basePath}/accounts/${accountId}`, updates, organizationId);
  }

  async disconnectAccount(accountId: string, organizationId?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete(`${this.basePath}/accounts/${accountId}`, organizationId);
  }

  // Banking Overview
  async getOverview(organizationId?: string): Promise<ApiResponse<BankingOverview>> {
    return apiClient.get(`${this.basePath}/overview`, organizationId);
  }

  async getDashboardData(organizationId?: string): Promise<ApiResponse<BankingDashboardData>> {
    return apiClient.get(`${this.basePath}/dashboard`, organizationId);
  }

  // Transaction Management
  async getTransactions(params: BankTransactionParams = {}, organizationId?: string): Promise<ApiResponse<BankTransaction[]>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.category) searchParams.set('category', params.category);
    if (params.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/transactions${query ? `?${query}` : ''}`, organizationId);
  }

  async getAccountTransactions(
    accountId: string,
    params: Omit<BankTransactionParams, 'accountId'> = {},
    organizationId?: string
  ): Promise<ApiResponse<BankTransaction[]>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.category) searchParams.set('category', params.category);
    if (params.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/accounts/${accountId}/transactions${query ? `?${query}` : ''}`, organizationId);
  }

  // Sync Operations
  async syncAccount(accountId: string, syncData: BankSyncRequest = {}, organizationId?: string): Promise<ApiResponse<{ jobId: string }>> {
    return apiClient.post(`${this.basePath}/accounts/${accountId}/sync`, syncData, organizationId);
  }

  async getSyncStatus(accountId: string, jobId?: string, organizationId?: string): Promise<ApiResponse<BankSyncJob>> {
    const query = jobId ? `?jobId=${jobId}` : '';
    return apiClient.get(`${this.basePath}/accounts/${accountId}/sync/status${query}`, organizationId);
  }

  // Health Check
  async getHealthStatus(organizationId?: string): Promise<ApiResponse<BankingHealthCheck>> {
    return apiClient.get(`${this.basePath}/health`, organizationId);
  }

  // Data Export
  async exportBankingData(exportData: BankingExportRequest, organizationId?: string): Promise<ApiResponse<BankingExportResponse>> {
    return apiClient.post(`${this.basePath}/export`, exportData, organizationId);
  }

  // Teller Enrollments
  async getEnrollments(organizationId?: string): Promise<ApiResponse<TellerEnrollment[]>> {
    return apiClient.get(`${this.basePath}/enrollments`, organizationId);
  }

  async getEnrollment(enrollmentId: string, organizationId?: string): Promise<ApiResponse<TellerEnrollment>> {
    return apiClient.get(`${this.basePath}/enrollments/${enrollmentId}`, organizationId);
  }

  async deleteEnrollment(enrollmentId: string, organizationId?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete(`${this.basePath}/enrollments/${enrollmentId}`, organizationId);
  }

  // Stripe Financial Connections
  async createStripeSession(organizationId?: string): Promise<ApiResponse<{ clientSecret: string }>> {
    return apiClient.post(`${this.basePath}/stripe/create-session`, {}, organizationId);
  }

  async connectStripeAccounts(data: { sessionId: string; selectedAccountIds?: string[] }, organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.post(`${this.basePath}/stripe/connect`, data, organizationId);
  }

  async getStripeAccountsPreview(sessionId: string, organizationId?: string): Promise<ApiResponse<{
    sessionId: string;
    accounts: Array<Record<string, unknown>>;
    totalAccounts: number;
  }>> {
    return apiClient.post(`${this.basePath}/stripe/preview`, { sessionId }, organizationId);
  }

  async syncStripeAccount(accountId: string, organizationId?: string): Promise<ApiResponse<BankSyncJob>> {
    return apiClient.post(`${this.basePath}/stripe/accounts/${accountId}/sync`, {}, organizationId);
  }

  // Plaid Integration
  async getPlaidLinkToken(organizationId?: string): Promise<ApiResponse<{ linkToken: string }>> {
    return apiClient.get(`${this.basePath}/plaid/link-token`, organizationId);
  }

  async addPlaidAccount(publicToken: string, organizationId?: string): Promise<ApiResponse<{ itemId: string; accountsCreated: number; accounts: BankAccount[] }>> {
    return apiClient.post(`${this.basePath}/plaid/add-account`, { publicToken }, organizationId);
  }

  async syncPlaidAccounts(organizationId?: string): Promise<ApiResponse<{ synced: number; errors: number; lastSync: string }>> {
    return apiClient.post(`${this.basePath}/plaid/sync-accounts`, {}, organizationId);
  }

  async syncPlaidTransactions(
    startDate: string,
    endDate: string,
    organizationId?: string
  ): Promise<ApiResponse<{ transactionsImported: number; accountsSynced: number; dateRange: { start: string; end: string }; lastSync: string }>> {
    return apiClient.post(
      `${this.basePath}/plaid/sync-transactions`,
      { startDate, endDate },
      organizationId
    );
  }

  // Transaction Sync
  async syncAccountTransactions(
    accountId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      force?: boolean;
    },
    organizationId?: string
  ): Promise<ApiResponse<{
    syncJobId: string;
    processed: number;
    skipped: number;
    totalFromTeller: number;
  }>> {
    return apiClient.post(`${this.basePath}/accounts/${accountId}/sync/transactions`, options || {}, organizationId);
  }

  // Utility methods for common operations
  async refreshAllAccounts(organizationId?: string): Promise<ApiResponse<{ syncJobs: { accountId: string; jobId: string }[] }>> {
    const accountsResponse = await this.getAccounts(organizationId);

    if (!accountsResponse.success) {
      return accountsResponse as ApiResponse<{ syncJobs: { accountId: string; jobId: string }[] }>;
    }

    const syncJobs = await Promise.allSettled(
      accountsResponse.data
        .filter(account => account.isActive) // Only sync active accounts
        .map(async (account) => {
          const syncResponse = await this.syncAccount(account.id, { fullSync: false }, organizationId);
          if (syncResponse.success) {
            return { accountId: account.id, jobId: syncResponse.data.jobId };
          }
          throw new Error(`Failed to sync account ${account.id}`);
        })
    );

    const successfulSyncs = syncJobs
      .filter((result): result is PromiseFulfilledResult<{ accountId: string; jobId: string }> =>
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    return {
      success: true,
      data: { syncJobs: successfulSyncs }
    };
  }

  async getAccountSummary(accountId: string, organizationId?: string): Promise<ApiResponse<{
    account: BankAccount;
    transactions: BankTransaction[];
    recentActivity: BankTransaction[];
  }>> {
    try {
      const [accountResponse, transactionsResponse, recentResponse] = await Promise.all([
        this.getAccount(accountId, organizationId),
        this.getAccountTransactions(accountId, { limit: 50 }, organizationId),
        this.getAccountTransactions(accountId, {
          limit: 10,
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
        }, organizationId)
      ]);

      if (!accountResponse.success) {
        return accountResponse as ApiResponse<BankAccountDetails>;
      }

      return {
        success: true,
        data: {
          account: accountResponse.data,
          transactions: transactionsResponse.success ? transactionsResponse.data : [],
          recentActivity: recentResponse.success ? recentResponse.data : []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: 'Failed to fetch account summary',
          details: error
        }
      };
    }
  }

  // Polling helper for sync status
  async pollSyncStatus(
    accountId: string,
    jobId: string,
    onProgress?: (status: BankSyncJob) => void,
    maxAttempts: number = 30,
    interval: number = 3000, // Banking sync might be slower than crypto
    organizationId?: string
  ): Promise<BankSyncJob> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await this.getSyncStatus(accountId, jobId, organizationId);

      if (!response.success) {
        throw new Error(response.error.message);
      }

      const status = response.data;

      if (onProgress) {
        onProgress(status);
      }

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('Banking sync polling timeout');
  }

  // Batch operations
  async bulkUpdateAccounts(
    updates: { accountId: string; updates: UpdateBankAccountRequest }[],
    organizationId?: string
  ): Promise<ApiResponse<BankAccount[]>> {
    try {
      const results = await Promise.allSettled(
        updates.map(({ accountId, updates }) =>
          this.updateAccount(accountId, updates, organizationId)
        )
      );

      const successful = results
        .filter((result): result is PromiseFulfilledResult<ApiResponse<BankAccount>> =>
          result.status === 'fulfilled' && result.value.success
        )
        .map(result => (result.value as { data: BankTransactionSyncResult }).data);

      const failed = results.filter(result =>
        result.status === 'rejected' ||
        (result.status === 'fulfilled' && !result.value.success)
      );

      if (failed.length > 0) {
        console.warn(`${failed.length} account updates failed`);
      }

      return {
        success: true,
        data: successful
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BULK_UPDATE_ERROR',
          message: 'Failed to update accounts',
          details: error
        }
      };
    }
  }

  // Analytics API - New high-performance endpoints
  async getTopSpendingCategories(params?: {
    period?: string;
    fromDate?: string;
    toDate?: string;
    fromMonth?: string;
    toMonth?: string;
    limit?: number;
  }, organizationId?: string): Promise<ApiResponse<Array<{
    category: string;
    totalSpending: number;
    transactionCount: number;
    avgTransaction: number;
    percentOfTotal: number;
  }>>> {
    const searchParams = new URLSearchParams();

    // V2 parameters
    if (params?.period) searchParams.set('period', params.period);
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);

    // V1 parameters (backward compatibility)
    if (params?.fromMonth) searchParams.set('fromMonth', params.fromMonth);
    if (params?.toMonth) searchParams.set('toMonth', params.toMonth);

    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/analytics/spending/categories${query ? `?${query}` : ''}`, organizationId);
  }

  async getMonthlyTrend(params?: {
    period?: string;
    fromDate?: string;
    toDate?: string;
    months?: number;
    accountId?: string;
  }, organizationId?: string): Promise<ApiResponse<Array<{
    month: string;
    totalSpending: number;
    totalIncome: number;
    netAmount: number;
    transactionCount: number;
    categories: Record<string, number>;
  }>>> {
    const searchParams = new URLSearchParams();

    // V2 parameters
    if (params?.period) searchParams.set('period', params.period);
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);

    // V1 parameters (backward compatibility)
    if (params?.months) searchParams.set('months', params.months.toString());

    if (params?.accountId) searchParams.set('accountId', params.accountId);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/analytics/spending/trend${query ? `?${query}` : ''}`, organizationId);
  }

  async getAccountSpendingComparison(params?: {
    period?: string;
    fromDate?: string;
    toDate?: string;
    month?: string;
  }, organizationId?: string): Promise<ApiResponse<Array<{
    accountId: string;
    totalSpending: number;
    totalIncome: number;
    transactionCount: number;
    topCategory: string | null;
  }>>> {
    const searchParams = new URLSearchParams();

    // V2 parameters
    if (params?.period) searchParams.set('period', params.period);
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);

    // V1 parameters (backward compatibility)
    if (params?.month) searchParams.set('month', params.month);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/analytics/spending/accounts${query ? `?${query}` : ''}`, organizationId);
  }

  async getSpendingByCategory(params?: {
    accountId?: string;
    category?: string;
    accountType?: string;
    fromMonth?: string;
    toMonth?: string;
    limit?: number;
  }, organizationId?: string): Promise<ApiResponse<Array<{
    userId: string;
    accountId: string;
    category: string | null;
    accountTellerType: string | null;
    transactionMonth: string;
    transaction_count: number;
    total_amount: number;
    avg_amount: number;
    min_amount: number;
    max_amount: number;
    debit_count: number;
    total_spending: number | null;
    avg_spending: number | null;
    credit_count: number;
    total_income: number | null;
    avg_income: number | null;
    credit_account_txns: number;
    depository_account_txns: number;
    first_transaction_date: string;
    last_transaction_date: string;
    last_updated: string;
  }>>> {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.accountType) searchParams.set('accountType', params.accountType);
    if (params?.fromMonth) searchParams.set('fromMonth', params.fromMonth);
    if (params?.toMonth) searchParams.set('toMonth', params.toMonth);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/analytics/spending${query ? `?${query}` : ''}`, organizationId);
  }

  async refreshAnalytics(organizationId?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.basePath}/analytics/refresh`, {}, organizationId);
  }

  // Analytics helpers (legacy - for backward compatibility)
  async getSpendingCategories(
    timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month',
    accountIds?: string[],
    organizationId?: string
  ): Promise<ApiResponse<Array<{ category: string; amount: number; count: number }>>> {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const params: BankTransactionParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type: 'debit', // Only look at outgoing transactions for spending
      limit: 1000 // Large limit to get all transactions
    };

    if (accountIds?.length) {
      // If specific accounts are requested, we'd need to make multiple requests
      // For now, we'll use the general endpoint and filter client-side
    }

    const response = await this.getTransactions(params, organizationId);

    if (!response.success) {
      return response as ApiResponse<BankTransactionSyncResult>;
    }

    // Group transactions by category
    const categoryMap = new Map<string, { amount: number; count: number }>();

    response.data.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      const current = categoryMap.get(category) || { amount: 0, count: 0 };

      categoryMap.set(category, {
        amount: current.amount + Math.abs(transaction.amount),
        count: current.count + 1
      });
    });

    const categories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      data: categories
    };
  }

  async getMonthlySpendingTrend(
    months: number = 12,
    _accountIds?: string[],
    organizationId?: string
  ): Promise<ApiResponse<Array<{ month: string; spending: number; income: number; net: number }>>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const params: BankTransactionParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 5000 // Large limit to get all transactions
    };

    const response = await this.getTransactions(params, organizationId);

    if (!response.success) {
      return response as ApiResponse<BankTransactionSyncResult>;
    }

    // Group transactions by month
    const monthlyData = new Map<string, { spending: number; income: number }>();

    response.data.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const current = monthlyData.get(monthKey) || { spending: 0, income: 0 };

      if (transaction.type === 'debit') {
        current.spending += Math.abs(transaction.amount);
      } else {
        current.income += transaction.amount;
      }

      monthlyData.set(monthKey, current);
    });

    const trends = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        spending: data.spending,
        income: data.income,
        net: data.income - data.spending
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      success: true,
      data: trends
    };
  }

  // Real-time sync connection helper
  // Banking sync now uses the unified crypto SSE stream
  async createSyncEventSource(): Promise<EventSource> {
    console.log('Banking sync: Using unified crypto SSE stream instead of separate banking stream');
    // Banking events are now handled by the unified crypto SSE connection
    // This method is kept for compatibility but doesn't create actual connections
    throw new Error('Banking sync now uses unified crypto SSE stream. Use the crypto sync stream instead.');
  }

  // ============================================================================
  // ACCOUNT CATEGORY MAPPING
  // ============================================================================

  /**
   * Map a bank account to a custom category
   */
  async mapAccountToCategory(
    accountId: string,
    categoryId: string,
    priority: number = 1,
    organizationId?: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post(
      `${this.basePath}/accounts/${accountId}/categories/${categoryId}`,
      { priority },
      organizationId
    );
  }

  /**
   * Unmap a bank account from a custom category
   */
  async unmapAccountFromCategory(
    accountId: string,
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(
      `${this.basePath}/accounts/${accountId}/categories/${categoryId}`,
      organizationId
    );
  }

  /**
   * Get accounts in a category (including nested categories)
   */
  async getAccountsByCategory(
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get(
      `/accounts/categories/${categoryId}/accounts`,
      organizationId
    );
  }

  // Account status helpers
  async checkAccountsHealth(organizationId?: string): Promise<ApiResponse<{
    totalAccounts: number;
    activeAccounts: number;
    syncingAccounts: number;
    errorAccounts: number;
    lastSyncTimes: Record<string, string>;
  }>> {
    const accountsResponse = await this.getAccounts(organizationId);

    if (!accountsResponse.success) {
      return accountsResponse as ApiResponse<BankAccountDetails[]>;
    }

    const accounts = accountsResponse.data;
    const health = {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(a => a.isActive).length,
      syncingAccounts: accounts.filter(a => a.syncStatus === 'syncing').length,
      errorAccounts: accounts.filter(a => a.syncStatus === 'error').length,
      lastSyncTimes: accounts.reduce((acc, account) => {
        acc[account.id] = account.lastTellerSync;
        return acc;
      }, {} as Record<string, string>)
    };

    return {
      success: true,
      data: health
    };
  }
}

export const bankingApi = new BankingApiService();
export default bankingApi;