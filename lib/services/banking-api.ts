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

  // ============================================================================
  // PLAID INTEGRATION (Provider Connection via Plaid)
  // ============================================================================

  /**
   * Generate Plaid link token for client-side account linking
   */
  async generatePlaidLinkToken(redirectUrl?: string, organizationId?: string): Promise<ApiResponse<{ linkToken: string; expiration: string; requestId: string }>> {
    return apiClient.post(`${this.basePath}/plaid/link-token`, { redirectUrl }, organizationId);
  }

  /**
   * Exchange Plaid public token for access token and create connection
   */
  async exchangePlaidToken(publicToken: string, metadata?: Record<string, unknown>, organizationId?: string): Promise<ApiResponse<{
    connectionId: string;
    provider: string;
    status: string;
    accountCount: number;
    createdAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/plaid/exchange-token`, { publicToken, metadata }, organizationId);
  }

  // ============================================================================
  // PROVIDER CONNECTIONS
  // ============================================================================

  /**
   * Get all provider connections for authenticated user
   */
  async getConnections(params?: { provider?: string; status?: string; page?: number; limit?: number }, organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      provider: string;
      status: string;
      accountCount: number;
      lastSyncAt: string;
      syncStatus: { progress: number; status: string; message: string };
      createdAt: string;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.provider) searchParams.set('provider', params.provider);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/connections${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get detailed information about a specific connection
   */
  async getConnection(connectionId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    provider: string;
    status: string;
    accountCount: number;
    lastSyncAt: string;
    accounts: Array<{ id: string; name: string; type: string; balance: number; currency: string }>;
    createdAt: string;
  }>> {
    return apiClient.get(`${this.basePath}/connections/${connectionId}`, organizationId);
  }

  /**
   * Verify connection is still valid and accessible
   */
  async checkConnectionHealth(connectionId: string, organizationId?: string): Promise<ApiResponse<{
    status: string;
    isConnected: boolean;
    lastVerified: string;
    message: string;
  }>> {
    return apiClient.get(`${this.basePath}/connections/${connectionId}/health`, organizationId);
  }

  /**
   * Get current synchronization status and progress
   */
  async getConnectionSyncStatus(connectionId: string, organizationId?: string): Promise<ApiResponse<{
    connectionId: string;
    status: string;
    progress: number;
    currentStep: string;
    accountsSynced: number;
    accountsTotal: number;
    transactionsSynced: number;
    startedAt: string;
    estimatedCompletion: string;
    message: string;
  }>> {
    return apiClient.get(`${this.basePath}/connections/${connectionId}/sync-status`, organizationId);
  }

  /**
   * Disconnect provider and revoke access
   */
  async disconnectConnection(connectionId: string, revokeToken?: boolean, organizationId?: string): Promise<ApiResponse<{
    message: string;
    connectionId: string;
    disconnectedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/connections/${connectionId}/disconnect`, { revokeToken }, organizationId);
  }

  /**
   * Manually trigger synchronization for a connection
   */
  async syncConnection(connectionId: string, options?: { syncType?: string; startDate?: string; endDate?: string; returnStream?: boolean }, organizationId?: string): Promise<ApiResponse<{
    syncId: string;
    status: string;
    connectionId: string;
    estimatedDuration: string;
    message: string;
  }>> {
    return apiClient.post(`${this.basePath}/connections/${connectionId}/sync`, options || {}, organizationId);
  }

  /**
   * Synchronize multiple connections in parallel
   */
  async batchSync(connectionIds: string[], syncType?: string, organizationId?: string): Promise<ApiResponse<{
    batchSyncId: string;
    status: string;
    connectionCount: number;
    estimatedDuration: string;
    connections: Array<{ connectionId: string; status: string }>;
  }>> {
    return apiClient.post(`${this.basePath}/sync/batch`, { connectionIds, syncType }, organizationId);
  }

  // ============================================================================
  // LEGACY METHODS (for backward compatibility)
  // ============================================================================

  async connectAccount(enrollmentData: CreateBankAccountRequest, organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.post(`${this.basePath}/plaid/exchange-token`, enrollmentData, organizationId);
  }

  async getAccounts(organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get(`${this.basePath}/connections`, organizationId);
  }

  async getGroupedAccounts(organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get(`${this.basePath}/connections`, organizationId);
  }

  async getAccount(accountId: string, organizationId?: string): Promise<ApiResponse<BankAccount & { bankTransactions: BankTransaction[] }>> {
    return apiClient.get(`${this.basePath}/connections/${accountId}`, organizationId);
  }

  async updateAccount(accountId: string, updates: UpdateBankAccountRequest, organizationId?: string): Promise<ApiResponse<BankAccount>> {
    return apiClient.put(`${this.basePath}/connections/${accountId}`, updates, organizationId);
  }

  async disconnectAccount(accountId: string, organizationId?: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post(`${this.basePath}/connections/${accountId}/disconnect`, {}, organizationId);
  }

  // Banking Overview (removed - use accounts module instead)
  async getOverview(organizationId?: string): Promise<ApiResponse<BankingOverview>> {
    console.warn('getOverview is deprecated. Use accounts module instead.');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use accounts module' } } as ApiResponse<BankingOverview>;
  }

  async getDashboardData(organizationId?: string): Promise<ApiResponse<BankingDashboardData>> {
    console.warn('getDashboardData is deprecated. Use accounts module instead.');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use accounts module' } } as ApiResponse<BankingDashboardData>;
  }

  // Transaction Management (moved to transactions module)
  async getTransactions(params: BankTransactionParams = {}, organizationId?: string): Promise<ApiResponse<BankTransaction[]>> {
    console.warn('getTransactions is deprecated. Use transactions module instead.');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use transactions module' } } as ApiResponse<BankTransaction[]>;
  }

  async getAccountTransactions(
    accountId: string,
    params: Omit<BankTransactionParams, 'accountId'> = {},
    organizationId?: string
  ): Promise<ApiResponse<BankTransaction[]>> {
    console.warn('getAccountTransactions is deprecated. Use transactions module instead.');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use transactions module' } } as ApiResponse<BankTransaction[]>;
  }

  // Sync Operations (updated)
  async syncAccount(connectionId: string, syncData: BankSyncRequest = {}, organizationId?: string): Promise<ApiResponse<{ jobId: string }>> {
    const response = await this.syncConnection(connectionId, { syncType: 'full', ...syncData }, organizationId);
    if (response.success) {
      return { success: true, data: { jobId: response.data.syncId } };
    }
    return response as ApiResponse<{ jobId: string }>;
  }

  async getSyncStatus(connectionId: string, jobId?: string, organizationId?: string): Promise<ApiResponse<BankSyncJob>> {
    const response = await this.getConnectionSyncStatus(connectionId, organizationId);
    if (response.success) {
      return {
        success: true,
        data: {
          status: response.data.status,
          progress: response.data.progress,
          message: response.data.message,
          // Map other fields as needed
        } as BankSyncJob
      };
    }
    return response as ApiResponse<BankSyncJob>;
  }

  // Health Check
  async getHealthStatus(organizationId?: string): Promise<ApiResponse<BankingHealthCheck>> {
    const response = await this.getConnections(undefined, organizationId);
    if (response.success) {
      const connections = response.data.data;
      return {
        success: true,
        data: {
          status: 'healthy',
          totalConnections: connections.length,
          activeConnections: connections.filter((c: any) => c.status === 'active').length,
          lastChecked: new Date().toISOString()
        } as BankingHealthCheck
      };
    }
    return response as ApiResponse<BankingHealthCheck>;
  }

  // Data Export
  async exportBankingData(exportData: BankingExportRequest, organizationId?: string): Promise<ApiResponse<BankingExportResponse>> {
    console.warn('exportBankingData not implemented in new API.');
    return { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Not available in new API' } } as ApiResponse<BankingExportResponse>;
  }

  // Teller Enrollments (deprecated - use connections)
  async getEnrollments(organizationId?: string): Promise<ApiResponse<TellerEnrollment[]>> {
    const response = await this.getConnections({ provider: 'teller' }, organizationId);
    if (response.success) {
      return {
        success: true,
        data: response.data.data as unknown as TellerEnrollment[]
      };
    }
    return response as ApiResponse<TellerEnrollment[]>;
  }

  async getEnrollment(enrollmentId: string, organizationId?: string): Promise<ApiResponse<TellerEnrollment>> {
    const response = await this.getConnection(enrollmentId, organizationId);
    if (response.success) {
      return {
        success: true,
        data: response.data as unknown as TellerEnrollment
      };
    }
    return response as ApiResponse<TellerEnrollment>;
  }

  async deleteEnrollment(enrollmentId: string, organizationId?: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.disconnectConnection(enrollmentId, true, organizationId);
    if (response.success) {
      return { success: true, data: { success: true } };
    }
    return response as ApiResponse<{ success: boolean }>;
  }

  // Stripe Financial Connections (deprecated)
  async createStripeSession(organizationId?: string): Promise<ApiResponse<{ clientSecret: string }>> {
    console.warn('createStripeSession deprecated - use generatePlaidLinkToken instead');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use Plaid instead' } } as ApiResponse<{ clientSecret: string }>;
  }

  async connectStripeAccounts(data: { sessionId: string; selectedAccountIds?: string[] }, organizationId?: string): Promise<ApiResponse<BankAccount[]>> {
    console.warn('connectStripeAccounts deprecated - use exchangePlaidToken instead');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use Plaid instead' } } as ApiResponse<BankAccount[]>;
  }

  async getStripeAccountsPreview(sessionId: string, organizationId?: string): Promise<ApiResponse<{
    sessionId: string;
    accounts: Array<Record<string, unknown>>;
    totalAccounts: number;
  }>> {
    console.warn('getStripeAccountsPreview deprecated');
    return { success: false, error: { code: 'DEPRECATED', message: 'Not available in new API' } } as ApiResponse<any>;
  }

  async syncStripeAccount(accountId: string, organizationId?: string): Promise<ApiResponse<BankSyncJob>> {
    console.warn('syncStripeAccount deprecated');
    return { success: false, error: { code: 'DEPRECATED', message: 'Not available in new API' } } as ApiResponse<BankSyncJob>;
  }

  // Plaid Integration (deprecated - use new methods)
  async getPlaidLinkToken(organizationId?: string): Promise<ApiResponse<{ linkToken: string }>> {
    const response = await this.generatePlaidLinkToken(undefined, organizationId);
    if (response.success) {
      return { success: true, data: { linkToken: response.data.linkToken } };
    }
    return response as ApiResponse<{ linkToken: string }>;
  }

  async addPlaidAccount(publicToken: string, organizationId?: string): Promise<ApiResponse<{ itemId: string; accountsCreated: number; accounts: BankAccount[] }>> {
    const response = await this.exchangePlaidToken(publicToken, undefined, organizationId);
    if (response.success) {
      return {
        success: true,
        data: {
          itemId: response.data.connectionId,
          accountsCreated: response.data.accountCount,
          accounts: [] as BankAccount[]
        }
      };
    }
    return response as ApiResponse<{ itemId: string; accountsCreated: number; accounts: BankAccount[] }>;
  }

  async syncPlaidAccounts(organizationId?: string): Promise<ApiResponse<{ synced: number; errors: number; lastSync: string }>> {
    const response = await this.batchSync([], 'full', organizationId);
    if (response.success) {
      return {
        success: true,
        data: {
          synced: response.data.connectionCount,
          errors: 0,
          lastSync: new Date().toISOString()
        }
      };
    }
    return response as ApiResponse<{ synced: number; errors: number; lastSync: string }>;
  }

  async syncPlaidTransactions(
    startDate: string,
    endDate: string,
    organizationId?: string
  ): Promise<ApiResponse<{ transactionsImported: number; accountsSynced: number; dateRange: { start: string; end: string }; lastSync: string }>> {
    const response = await this.batchSync([], 'partial', organizationId);
    if (response.success) {
      return {
        success: true,
        data: {
          transactionsImported: 0,
          accountsSynced: response.data.connectionCount,
          dateRange: { start: startDate, end: endDate },
          lastSync: new Date().toISOString()
        }
      };
    }
    return response as ApiResponse<any>;
  }

  // Transaction Sync (deprecated - moved to transactions module)
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
    console.warn('syncAccountTransactions is deprecated. Use transactions module instead.');
    return { success: false, error: { code: 'DEPRECATED', message: 'Use transactions module' } } as ApiResponse<any>;
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