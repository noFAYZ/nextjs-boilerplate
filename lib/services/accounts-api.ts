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
}

export const accountsApi = new AccountsApiService();
