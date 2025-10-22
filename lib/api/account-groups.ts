import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/lib/types';
import type {
  AccountGroup,
  AccountGroupHierarchy,
  CreateAccountGroupRequest,
  UpdateAccountGroupRequest,
  MoveAccountRequest,
  AccountGroupsQueryOptions,
  FinancialAccount,
  CryptoWallet,
} from '@/lib/types/account-groups';

/**
 * Account Groups API functions
 * 
 * These functions integrate with the MoneyMappr backend API for managing
 * account groups - allowing users to organize financial accounts and crypto 
 * wallets into custom hierarchical categories.
 */
export class AccountGroupsAPI {
  private static readonly BASE_PATH = '/account-groups';

  /**
   * Get all account groups for the current user
   */
  static async getAccountGroups(
    options: AccountGroupsQueryOptions = {}
  ): Promise<ApiResponse<AccountGroup[]>> {
    const searchParams = new URLSearchParams();
    
    if (options.details) searchParams.set('details', 'true');
    if (options.includeAccounts) searchParams.set('includeAccounts', 'true');
    if (options.includeWallets) searchParams.set('includeWallets', 'true');
    if (options.includeChildren) searchParams.set('includeChildren', 'true');
    if (options.includeCounts) searchParams.set('includeCounts', 'true');

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `${this.BASE_PATH}?${queryString}` 
      : this.BASE_PATH;

    return apiClient.get<AccountGroup[]>(endpoint);
  }

  /**
   * Get account groups in hierarchical structure
   */
  static async getAccountGroupsHierarchy(
    options: AccountGroupsQueryOptions = {}
  ): Promise<ApiResponse<AccountGroupHierarchy[]>> {
    const searchParams = new URLSearchParams();
    
    if (options.details) searchParams.set('details', 'true');
    if (options.includeAccounts) searchParams.set('includeAccounts', 'true');
    if (options.includeWallets) searchParams.set('includeWallets', 'true');
    if (options.includeCounts) searchParams.set('includeCounts', 'true');

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `${this.BASE_PATH}/hierarchy?${queryString}` 
      : `${this.BASE_PATH}/hierarchy`;

    return apiClient.get<AccountGroupHierarchy[]>(endpoint);
  }

  /**
   * Get a specific account group by ID
   */
  static async getAccountGroup(
    groupId: string,
    options: AccountGroupsQueryOptions = {}
  ): Promise<ApiResponse<AccountGroup>> {
    const searchParams = new URLSearchParams();
    
    if (options.details) searchParams.set('details', 'true');
    if (options.includeAccounts) searchParams.set('includeAccounts', 'true');
    if (options.includeWallets) searchParams.set('includeWallets', 'true');
    if (options.includeChildren) searchParams.set('includeChildren', 'true');
    if (options.includeCounts) searchParams.set('includeCounts', 'true');

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `${this.BASE_PATH}/${groupId}?${queryString}` 
      : `${this.BASE_PATH}/${groupId}`;

    return apiClient.get<AccountGroup>(endpoint);
  }

  /**
   * Create a new account group
   */
  static async createAccountGroup(
    data: CreateAccountGroupRequest
  ): Promise<ApiResponse<AccountGroup>> {
    return apiClient.post<AccountGroup>(this.BASE_PATH, data);
  }

  /**
   * Update an existing account group
   */
  static async updateAccountGroup(
    groupId: string,
    data: UpdateAccountGroupRequest
  ): Promise<ApiResponse<AccountGroup>> {
    return apiClient.put<AccountGroup>(`${this.BASE_PATH}/${groupId}`, data);
  }

  /**
   * Delete an account group
   * Note: Groups must be empty (no accounts or child groups)
   */
  static async deleteAccountGroup(
    groupId: string
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_PATH}/${groupId}`);
  }

  /**
   * Create default account groups (Primary, Savings, Crypto)
   */
  static async createDefaultGroups(): Promise<ApiResponse<AccountGroup[]>> {
    return apiClient.post<AccountGroup[]>(`${this.BASE_PATH}/defaults`);
  }

  /**
   * Move an account (financial or crypto) to a different group
   */
  static async moveAccount(
    data: MoveAccountRequest
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/move-account`, data);
  }

  /**
   * Remove an account from its current group (ungroup it)
   */
  static async ungroupAccount(
    accountId: string,
    accountType: 'financial' | 'crypto'
  ): Promise<ApiResponse<void>> {
    return this.moveAccount({
      accountId,
      groupId: null,
      accountType,
    });
  }

  /**
   * Get all ungrouped accounts (both financial and crypto)
   */
  static async getUngroupedAccounts(): Promise<ApiResponse<{
    financialAccounts: FinancialAccount[];
    cryptoWallets: CryptoWallet[];
  }>> {
    return apiClient.get<{
      financialAccounts: FinancialAccount[];
      cryptoWallets: CryptoWallet[];
    }>(`${this.BASE_PATH}/ungrouped`);
  }

  /**
   * Bulk move multiple accounts to a group
   */
  static async bulkMoveAccounts(
    groupId: string | null,
    accounts: Array<{ id: string; type: 'financial' | 'crypto' }>
  ): Promise<ApiResponse<void>> {
    const promises = accounts.map(account =>
      this.moveAccount({
        accountId: account.id,
        groupId,
        accountType: account.type,
      })
    );

    try {
      await Promise.all(promises);
      return {
        success: true,
        message: `Successfully moved ${accounts.length} accounts`,
      } as ApiResponse<void>;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BULK_MOVE_ERROR',
          message: 'Some accounts failed to move',
          details: error,
        },
      } as ApiResponse<void>;
    }
  }
}

// Export convenient functions for easier imports
export const {
  getAccountGroups,
  getAccountGroupsHierarchy,
  getAccountGroup,
  createAccountGroup,
  updateAccountGroup,
  deleteAccountGroup,
  createDefaultGroups,
  moveAccount,
  ungroupAccount,
  getUngroupedAccounts,
  bulkMoveAccounts,
} = AccountGroupsAPI;