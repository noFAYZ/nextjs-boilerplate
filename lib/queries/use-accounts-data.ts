/**
 * Unified Accounts Data Hooks
 *
 * PURPOSE: Consolidated, production-grade React Query hooks for unified accounts data
 * - Single source of truth for ALL account server state (banking, crypto, assets, liabilities)
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: accounts, isLoading } = useAllAccounts();
 * const { mutate: createAccount } = useCreateManualAccount();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  accountsKeys,
  accountsQueries,
  accountsMutations,
  useUnifiedAccounts as useBaseUnifiedAccounts,
  useAccountDetails as useBaseAccountDetails,
  useAccountTransactions as useBaseAccountTransactions,
  useCategories as useBaseCategoriesQuery,
  useCategoryGroups as useBaseCategoryGroupsQuery,
} from './accounts-queries';
import { useAuthStore } from '@/lib/stores/auth-store';
import type {
  CreateManualAccountRequest,
  UpdateAccountRequest,
  AddTransactionRequest,
  GetAccountTransactionsParams,
} from '@/lib/types/unified-accounts';

// ============================================================================
// AUTH-READY WRAPPER
// ============================================================================

function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

// ============================================================================
// ACCOUNT QUERIES
// ============================================================================

/**
 * Get all accounts grouped by category (cash, credit, investments, assets, liabilities, other)
 * @returns All accounts organized by category with summary statistics
 */
export function useAllAccounts() {
  
  return useBaseUnifiedAccounts();
}

/**
 * Get detailed information about a specific account
 * @param accountId - Account ID to fetch
 * @returns Account details with performance data and transaction stats
 */
export function useAccountDetails(accountId: string | null) {
  return useBaseAccountDetails(accountId);
}

/**
 * Get transactions for a specific account
 * @param accountId - Account ID to fetch transactions for
 * @param params - Optional query parameters for filtering and pagination
 * @returns Paginated list of transactions
 */
export function useAccountTransactions(accountId: string | null, params?: GetAccountTransactionsParams) {
  return useBaseAccountTransactions(accountId, params);
}

/**
 * Get flat list of all transaction categories
 * @param params - Query parameters for filtering and pagination
 * @returns List of available transaction categories
 */
export function useCategories(params?: { groupId?: string; page?: number; limit?: number; activeOnly?: boolean; search?: string }) {
  return useBaseCategoriesQuery(params);
}

/**
 * Get category groups with nested categories (for envelope budgeting and better organization)
 * @param organizationId - Optional organization ID to filter category groups by
 * @returns Hierarchical list of category groups with categories
 */
export function useCategoryGroups(organizationId?: string) {
  return useBaseCategoryGroupsQuery(organizationId);
}

/**
 * Get all transactions across all accounts (global transactions)
 * @param params - Query parameters for filtering, pagination, and date range
 * @returns Paginated list of all transactions from all accounts
 */
export function useAllTransactions(params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  merchantId?: string;
  categoryId?: string;
  type?: string;
  source?: string;
  search?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    ...accountsQueries.allTransactions(params),
    enabled: isAuthReady,
  });
}

// ============================================================================
// ACCOUNT MUTATIONS
// ============================================================================

/**
 * Create a new manual account
 * Supports all account types: checking, savings, credit cards, investments,
 * crypto wallets, real estate, vehicles, loans, mortgages, etc.
 *
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: createAccount } = useCreateManualAccount();
 *
 * createAccount({
 *   name: 'Emergency Fund',
 *   type: 'SAVINGS',
 *   balance: 10000,
 *   currency: 'USD',
 *   institutionName: 'Ally Bank'
 * });
 * ```
 */
export function useCreateManualAccount() {
  return accountsMutations.createManualAccount();
}

/**
 * Update an existing account
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: updateAccount } = useUpdateAccount();
 *
 * updateAccount({
 *   accountId: 'abc123',
 *   updates: {
 *     name: 'Updated Account Name',
 *     balance: 10500
 *   }
 * });
 * ```
 */
export function useUpdateAccount() {
  return accountsMutations.updateAccount();
}

/**
 * Delete/deactivate an account (soft delete)
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: deleteAccount } = useDeleteAccount();
 *
 * deleteAccount('account-id-here');
 * ```
 */
export function useDeleteAccount() {
  return accountsMutations.deleteAccount();
}

/**
 * Add a manual transaction to an account
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: addTransaction } = useAddTransaction();
 *
 * addTransaction({
 *   accountId: 'acc-123',
 *   data: {
 *     amount: -50.00,
 *     description: 'Coffee',
 *     date: '2024-01-15'
 *   }
 * });
 * ```
 */
export function useAddTransaction() {
  return accountsMutations.addTransaction();
}

/**
 * Bulk deactivate multiple accounts
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: deactivateAccounts } = useBulkDeactivateAccounts();
 *
 * deactivateAccounts(['id1', 'id2']);
 * ```
 */
export function useBulkDeactivateAccounts() {
  return accountsMutations.bulkDeactivateAccounts();
}

/**
 * Bulk reactivate multiple accounts
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: reactivateAccounts } = useBulkReactivateAccounts();
 *
 * reactivateAccounts(['id1', 'id2']);
 * ```
 */
export function useBulkReactivateAccounts() {
  return accountsMutations.bulkReactivateAccounts();
}

/**
 * Bulk delete multiple accounts
 * @returns Mutation hook with automatic cache invalidation
 * @example
 * ```ts
 * const { mutate: deleteAccounts } = useBulkDeleteAccounts();
 *
 * deleteAccounts(['id1', 'id2']);
 * ```
 */
export function useBulkDeleteAccounts() {
  return accountsMutations.bulkDeleteAccounts();
}

// ============================================================================
// COMPUTED QUERIES (derived from unified accounts)
// ============================================================================

/**
 * Get accounts of a specific category
 * @param category - Category to filter by
 * @returns Accounts in the specified category
 */
export function useAccountsByCategory(category: 'cash' | 'credit' | 'investments' | 'assets' | 'liabilities' | 'other') {
  const { data: allAccounts, ...rest } = useAllAccounts();

  return {
    data: allAccounts?.groups[category]?.accounts || [],
    totalBalance: allAccounts?.groups[category]?.totalBalance || 0,
    accountCount: allAccounts?.groups[category]?.accountCount || 0,
    ...rest,
  };
}

/**
 * Get summary statistics for all accounts
 * @returns Net worth, total assets, total liabilities, etc.
 */
export function useAccountsSummary() {
  const { data: allAccounts, ...rest } = useAllAccounts();

  return {
    data: allAccounts?.summary,
    ...rest,
  };
}
