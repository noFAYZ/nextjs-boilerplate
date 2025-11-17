import { apiClient } from '@/lib/api-client';
import type {
  UnifiedAccountsResponse,
  UnifiedAccountDetails,
  CreateManualAccountRequest,
  UpdateAccountRequest,
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
}

export const accountsApi = new AccountsApiService();
