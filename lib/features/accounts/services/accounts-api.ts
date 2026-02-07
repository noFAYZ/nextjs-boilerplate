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
} from '@/lib/types/unified-accounts';
import type { ApiResponse } from '@/lib/types/crypto';

class AccountsApiService {
  private readonly basePath = '/accounts';

  // ============================================================================
  // ACCOUNT MANAGEMENT - Core Operations
  // ============================================================================

  /**
   * Create a new account
   * @param data Account creation data
   * @param organizationId Optional organization ID
   */
  async createAccount(
    data: CreateManualAccountRequest,
    organizationId?: string
  ): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.post(`${this.basePath}`, data, organizationId);
  }

  /**
   * Get all accounts with optional filtering
   * Supported backend filters: accountSource, type, status, isActive, search, page, limit, sortBy
   */
  async getAccounts(
    params?: {
      accountSource?: string;
      type?: string;
      status?: string;
      isActive?: boolean;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
    },
    organizationId?: string
  ): Promise<
    ApiResponse<{
      data: UnifiedAccountDetails[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params?.accountSource)
      searchParams.set('accountSource', params.accountSource);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.isActive !== undefined)
      searchParams.set('isActive', params.isActive.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);

    const query = searchParams.toString();
    return apiClient.get(
      `${this.basePath}${query ? `?${query}` : ''}`,
      organizationId
    );
  }

  /**
   * Get detailed information about a specific account
   */
  async getAccountDetails(
    accountId: string,
    organizationId?: string
  ): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.get(`${this.basePath}/${accountId}`, organizationId);
  }

  /**
   * Update an existing account
   */
  async updateAccount(
    accountId: string,
    updates: UpdateAccountRequest,
    organizationId?: string
  ): Promise<ApiResponse<UnifiedAccountDetails>> {
    return apiClient.put(`${this.basePath}/${accountId}`, updates, organizationId);
  }

  /**
   * Delete/deactivate an account (soft delete)
   */
  async deleteAccount(
    accountId: string,
    organizationId?: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.delete(`${this.basePath}/${accountId}`, organizationId);
  }

  // ============================================================================
  // ACCOUNT BALANCE & CHART DATA
  // ============================================================================

  /**
   * Get current account balance
   */
  async getAccountBalance(
    accountId: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      accountId: string;
      currentBalance: number;
      availableBalance: number;
      currency: string;
      lastUpdated: string;
      pending: { count: number; amount: number };
    }>
  > {
    return apiClient.get(
      `${this.basePath}/${accountId}/balance`,
      organizationId
    );
  }

  /**
   * Get account balance chart data for a specific period
   * Period format: '7d', '30d', '90d', '1y', etc.
   */
  async getAccountChart(
    accountId: string,
    period: string = '30d',
    organizationId?: string
  ): Promise<
    ApiResponse<{
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
    }>
  > {
    const query = `?period=${period}`;
    return apiClient.get(
      `${this.basePath}/${accountId}/chart${query}`,
      organizationId
    );
  }

  // ============================================================================
  // LEGACY/ADAPTER METHODS - For backward compatibility
  // ============================================================================

  /**
   * Get all accounts grouped by category (legacy method)
   * Transforms the flat accounts list into grouped response
   */
  async getAllAccounts(
    organizationId?: string
  ): Promise<ApiResponse<UnifiedAccountsResponse>> {
    const response = await this.getAccounts(undefined, organizationId);
    if (response.success && response.data.data) {
      const accounts = response.data.data;

      // Group accounts by category
      const groups: Record<string, any> = {
        cash: {
          category: 'CASH',
          totalBalance: 0,
          accountCount: 0,
          accounts: [],
        },
        credit: {
          category: 'CREDIT',
          totalBalance: 0,
          accountCount: 0,
          accounts: [],
        },
        investments: {
          category: 'INVESTMENTS',
          totalBalance: 0,
          accountCount: 0,
          accounts: [],
        },
        assets: {
          category: 'ASSETS',
          totalBalance: 0,
          accountCount: 0,
          accounts: [],
        },
        liabilities: {
          category: 'LIABILITIES',
          totalBalance: 0,
          accountCount: 0,
          accounts: [],
        },
        other: {
          category: 'OTHER',
          totalBalance: 0,
          accountCount: 0,
          accounts: [],
        },
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
      const totalAssets =
        (groups.cash.totalBalance || 0) +
        (groups.investments.totalBalance || 0) +
        (groups.assets.totalBalance || 0);
      const totalLiabilities =
        (groups.credit.totalBalance || 0) +
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
        } as unknown as UnifiedAccountsResponse,
      };
    }
    return response as ApiResponse<UnifiedAccountsResponse>;
  }

  /**
   * Create a new manual account (legacy alias)
   */
  async createManualAccount(
    data: CreateManualAccountRequest,
    organizationId?: string
  ): Promise<ApiResponse<UnifiedAccountDetails>> {
    return this.createAccount(data, organizationId);
  }

  // ============================================================================
  // TRANSACTION OPERATIONS - Delegate to Transactions Service
  // ============================================================================

  /**
   * Get transactions for a specific account
   * Delegates to transactions API service
   */
  async getAccountTransactions(
    accountId: string,
    params?: GetAccountTransactionsParams,
    organizationId?: string
  ): Promise<ApiResponse<AccountTransactionsResponse>> {
    const transactionApi = await import(
      '@/lib/features/transactions/services/transactions-api'
    ).then((m) => m.transactionsApi);
    return transactionApi.listTransactions(
      { accountId, ...params },
      organizationId
    ) as Promise<ApiResponse<AccountTransactionsResponse>>;
  }

  /**
   * Add a new transaction to an account (manual transaction)
   * Delegates to transactions API service
   *
   * Supported fields:
   * - description (required)
   * - date (required)
   * - amount (required)
   * - category (required - category name)
   * - merchantName (optional - merchant name string)
   * - notes (optional)
   *
   * Note: Backend does NOT support:
   * - type field (use sourceType instead)
   * - merchantId (use merchantName)
   * - categoryId (use category name)
   * - pending status
   * - attachments
   * - splits (requires separate POST /{id}/split endpoint)
   */
  async addTransaction(
    accountId: string,
    data: AddTransactionRequest,
    organizationId?: string
  ): Promise<ApiResponse<Transaction>> {
    const transactionApi = await import(
      '@/lib/features/transactions/services/transactions-api'
    ).then((m) => m.transactionsApi);
    return transactionApi.createTransaction(
      { accountId, ...data },
      organizationId
    ) as Promise<ApiResponse<Transaction>>;
  }

  /**
   * Get all transaction category groups with categories
   * Delegates to transactions API service
   */
  async getCategoryGroups(
    organizationId?: string
  ): Promise<ApiResponse<CategoryGroupsResponse>> {
    const transactionApi = await import(
      '@/lib/features/transactions/services/transactions-api'
    ).then((m) => m.transactionsApi);
    return transactionApi.listCategoryGroups(
      organizationId
    ) as Promise<ApiResponse<CategoryGroupsResponse>>;
  }

  /**
   * Get flat list of all transaction categories
   * Delegates to transactions API service
   *
   * Note: Backend does NOT support groupId filtering
   * Categories are user-level, not account/group-specific
   */
  async getCategories(
    params?: {
      page?: number;
      limit?: number;
      activeOnly?: boolean;
      search?: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<CategoriesResponse>> {
    const transactionApi = await import(
      '@/lib/features/transactions/services/transactions-api'
    ).then((m) => m.transactionsApi);
    return transactionApi.listCategories(
      organizationId
    ) as Promise<ApiResponse<CategoriesResponse>>;
  }

  /**
   * Search categories by name
   * Delegates to transactions API service
   */
  async searchCategories(
    query: string,
    organizationId?: string
  ): Promise<
    ApiResponse<{
      data: Array<{
        id: string;
        name: string;
        displayName?: string;
        emoji?: string;
        color?: string;
        groupId: string;
      }>;
    }>
  > {
    const transactionApi = await import(
      '@/lib/features/transactions/services/transactions-api'
    ).then((m) => m.transactionsApi);
    return transactionApi.searchCategories(
      query,
      organizationId
    ) as Promise<ApiResponse<any>>;
  }

  /**
   * Get all transactions across all accounts (global transactions)
   * Delegates to transactions API service
   */
  async getAllTransactions(
    params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
      categoryId?: string;
      source?: string;
      search?: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<AccountTransactionsResponse>> {
    const transactionApi = await import(
      '@/lib/features/transactions/services/transactions-api'
    ).then((m) => m.transactionsApi);
    return transactionApi.listTransactions(
      params,
      organizationId
    ) as Promise<ApiResponse<AccountTransactionsResponse>>;
  }
}

export const accountsApi = new AccountsApiService();
