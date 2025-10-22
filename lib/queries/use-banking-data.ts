/**
 * Banking Data Hooks
 *
 * PURPOSE: Consolidated, production-grade React Query hooks for banking data
 * - Single source of truth for ALL banking server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: accounts, isLoading } = useBankingAccounts();
 * const { mutate: connectAccount } = useConnectBankAccount();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  bankingKeys,
  bankingQueries,
  bankingMutations,
  useBankingAccounts as useBaseBankingAccounts,
  useBankingOverview as useBaseBankingOverview,
  useBankingDashboard as useBaseBankingDashboard,
} from './banking-queries';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBankingUIStore } from '@/lib/stores/banking-ui-store';
import type {
  BankAccount,
  BankTransactionParams,
} from '@/lib/types/banking';

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
 * Get all bank accounts for the authenticated user
 * @returns All accounts with loading/error states
 */
export function useBankingAccounts() {
  return useBaseBankingAccounts();
}

/**
 * Get grouped bank accounts by enrollment
 * @returns Grouped accounts with loading/error states
 */
export function useBankingGroupedAccounts() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.groupedAccounts(),
    enabled: isAuthReady,
  });
}

/**
 * Get a single bank account by ID
 * @param accountId - Account ID to fetch
 * @returns Account data with loading/error states
 */
export function useBankingAccount(accountId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.account(accountId!),
    enabled: isAuthReady && !!accountId,
  });
}

/**
 * Get the currently selected bank account based on UI store
 * @returns Selected account data or null
 */
export function useSelectedBankAccount() {
  const selectedAccountId = useBankingUIStore((state) => state.selectedAccountId);
  return useBankingAccount(selectedAccountId);
}

/**
 * Get account summary with aggregated data
 * @param accountId - Account ID
 * @returns Account summary
 */
export function useBankAccountSummary(accountId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.accountSummary(accountId!),
    enabled: isAuthReady && !!accountId,
  });
}

// ============================================================================
// DASHBOARD QUERIES
// ============================================================================

/**
 * Get banking overview with aggregated metrics
 * @returns Overview data
 */
export function useBankingOverview() {
  return useBaseBankingOverview();
}

/**
 * Get dashboard data for banking section
 * @returns Dashboard data
 */
export function useBankingDashboard() {
  return useBaseBankingDashboard();
}

// ============================================================================
// TRANSACTION QUERIES
// ============================================================================

/**
 * Get all transactions with optional filtering
 * @param params - Transaction filter parameters
 * @returns Transactions with pagination
 */
export function useBankingTransactions(params?: BankTransactionParams) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.transactions(params),
    enabled: isAuthReady,
  });
}

/**
 * Get transactions for a specific account
 * @param accountId - Account ID
 * @param params - Transaction filter parameters
 * @returns Account transactions with pagination
 */
export function useAccountTransactions(
  accountId: string | null,
  params?: Omit<BankTransactionParams, 'accountId'>
) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.accountTransactions(accountId!, params),
    enabled: isAuthReady && !!accountId,
  });
}

/**
 * Get transactions for the currently selected account
 * @param params - Transaction filter parameters
 * @returns Selected account transactions
 */
export function useSelectedAccountTransactions(params?: Omit<BankTransactionParams, 'accountId'>) {
  const selectedAccountId = useBankingUIStore((state) => state.selectedAccountId);
  return useAccountTransactions(selectedAccountId, params);
}

// ============================================================================
// ENROLLMENT QUERIES
// ============================================================================

/**
 * Get all bank enrollments
 * @returns Enrollments with loading/error states
 */
export function useBankingEnrollments() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.enrollments(),
    enabled: isAuthReady,
  });
}

/**
 * Get a single enrollment by ID
 * @param enrollmentId - Enrollment ID
 * @returns Enrollment data
 */
export function useBankingEnrollment(enrollmentId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.enrollment(enrollmentId!),
    enabled: isAuthReady && !!enrollmentId,
  });
}

// ============================================================================
// SYNC QUERIES
// ============================================================================

/**
 * Get sync status for an account
 * @param accountId - Account ID
 * @param jobId - Optional sync job ID
 * @returns Sync status (polls automatically while syncing)
 */
export function useAccountSyncStatus(accountId: string | null, jobId?: string) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.syncStatus(accountId!, jobId),
    enabled: isAuthReady && !!accountId && !!jobId,
  });
}

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

/**
 * Get top spending categories
 * @param params - Analytics parameters
 * @returns Top spending categories
 */
export function useTopSpendingCategories(params?: Record<string, unknown>) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.topSpendingCategories(params),
    enabled: isAuthReady,
  });
}

/**
 * Get monthly spending trend
 * @param params - Analytics parameters
 * @returns Monthly spending trend data
 */
export function useMonthlySpendingTrend(params?: Record<string, unknown>) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.monthlySpendingTrend(params),
    enabled: isAuthReady,
  });
}

/**
 * Get account spending comparison
 * @param params - Analytics parameters
 * @returns Account comparison data
 */
export function useAccountSpendingComparison(params?: Record<string, unknown>) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.accountSpendingComparison(params),
    enabled: isAuthReady,
  });
}

/**
 * Get spending by category
 * @param params - Analytics parameters
 * @returns Category spending data
 */
export function useSpendingByCategory(params?: Record<string, unknown>) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...bankingQueries.spendingByCategory(params),
    enabled: isAuthReady,
  });
}

// ============================================================================
// ACCOUNT MUTATIONS
// ============================================================================

/**
 * Connect a new bank account
 * @returns Mutation hook with optimistic updates
 */
export function useConnectBankAccount() {
  const queryClient = useQueryClient();
  const mutation = bankingMutations.useConnectAccount();
  const { closeConnectAccountModal } = useBankingUIStore();

  return useMutation({
    ...mutation,
    onSuccess: (response) => {
      if (response.success) {
        closeConnectAccountModal();

        // Optimistic UI update
        queryClient.setQueryData(bankingKeys.accounts(), (old: unknown) => {
          if (!old || typeof old !== 'object' || !('data' in old)) return old;
          return {
            ...old,
            data: [...(old.data as BankAccount[]), ...response.data],
          };
        });
      }
      mutation.onSuccess?.(response, {} as CreateBankAccountRequest, undefined);
    },
  });
}

/**
 * Update an existing bank account
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateBankAccount() {
  const queryClient = useQueryClient();
  const mutation = bankingMutations.useUpdateAccount();
  const { closeEditAccountModal } = useBankingUIStore();

  return useMutation({
    ...mutation,
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bankingKeys.account(id) });
      await queryClient.cancelQueries({ queryKey: bankingKeys.accounts() });

      // Snapshot previous values
      const previousAccount = queryClient.getQueryData(bankingKeys.account(id));
      const previousAccounts = queryClient.getQueryData(bankingKeys.accounts());

      // Optimistically update account
      queryClient.setQueryData(bankingKeys.account(id), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: { ...(old.data as BankAccount), ...updates },
        };
      });

      // Optimistically update account list
      queryClient.setQueryData(bankingKeys.accounts(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: (old.data as BankAccount[]).map((acc: BankAccount) =>
            acc.id === id ? { ...acc, ...updates } : acc
          ),
        };
      });

      return { previousAccount, previousAccounts };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousAccount) {
        queryClient.setQueryData(bankingKeys.account(_variables.id), context.previousAccount);
      }
      if (context?.previousAccounts) {
        queryClient.setQueryData(bankingKeys.accounts(), context.previousAccounts);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        closeEditAccountModal();
      }
      mutation.onSuccess?.(response, { id: '', updates: {} as UpdateBankAccountRequest }, undefined);
    },
  });
}

/**
 * Disconnect a bank account
 * @returns Mutation hook with optimistic updates
 */
export function useDisconnectBankAccount() {
  const queryClient = useQueryClient();
  const mutation = bankingMutations.useDisconnectAccount();
  const { closeDisconnectAccountModal, selectAccount } = useBankingUIStore();

  return useMutation({
    ...mutation,
    onMutate: async (accountId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bankingKeys.accounts() });

      // Snapshot previous value
      const previousAccounts = queryClient.getQueryData(bankingKeys.accounts());

      // Optimistically remove account
      queryClient.setQueryData(bankingKeys.accounts(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: (old.data as BankAccount[]).filter((acc: BankAccount) => acc.id !== accountId),
        };
      });

      return { previousAccounts };
    },
    onError: (_error, _accountId, context) => {
      // Rollback on error
      if (context?.previousAccounts) {
        queryClient.setQueryData(bankingKeys.accounts(), context.previousAccounts);
      }
    },
    onSuccess: (response, accountId) => {
      if (response.success) {
        closeDisconnectAccountModal();
        selectAccount(null); // Deselect if disconnected
      }
      mutation.onSuccess?.(response, accountId, undefined);
    },
  });
}

// ============================================================================
// SYNC MUTATIONS
// ============================================================================

/**
 * Trigger sync for an account
 * @returns Mutation hook
 */
export function useSyncBankAccount() {
  const { closeSyncModal } = useBankingUIStore();
  const mutation = bankingMutations.useSyncAccount();

  return useMutation({
    ...mutation,
    onSuccess: (response) => {
      if (response.success) {
        closeSyncModal();
      }
      mutation.onSuccess?.(response, {} as BankSyncRequest, undefined);
    },
  });
}

/**
 * Sync all bank accounts
 * @returns Mutation hook
 */
export function useSyncAllBankAccounts() {
  return bankingMutations.useSyncAllAccounts();
}

/**
 * Sync account transactions
 * @returns Mutation hook
 */
export function useSyncAccountTransactions() {
  return bankingMutations.useSyncAccountTransactions();
}

// ============================================================================
// ENROLLMENT MUTATIONS
// ============================================================================

/**
 * Delete a bank enrollment (disconnects all associated accounts)
 * @returns Mutation hook with optimistic updates
 */
export function useDeleteBankEnrollment() {
  const queryClient = useQueryClient();
  const mutation = bankingMutations.useDeleteEnrollment();
  const { selectEnrollment } = useBankingUIStore();

  return useMutation({
    ...mutation,
    onMutate: async (enrollmentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bankingKeys.enrollments() });
      await queryClient.cancelQueries({ queryKey: bankingKeys.accounts() });

      // Snapshot previous values
      const previousEnrollments = queryClient.getQueryData(bankingKeys.enrollments());
      const previousAccounts = queryClient.getQueryData(bankingKeys.accounts());

      // Optimistically remove enrollment
      queryClient.setQueryData(bankingKeys.enrollments(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: (old.data as Array<{ id: string }>).filter((enr) => enr.id !== enrollmentId),
        };
      });

      // Optimistically remove associated accounts
      queryClient.setQueryData(bankingKeys.accounts(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: (old.data as BankAccount[]).filter((acc: BankAccount) => acc.tellerEnrollmentId !== enrollmentId),
        };
      });

      return { previousEnrollments, previousAccounts };
    },
    onError: (_error, _enrollmentId, context) => {
      // Rollback on error
      if (context?.previousEnrollments) {
        queryClient.setQueryData(bankingKeys.enrollments(), context.previousEnrollments);
      }
      if (context?.previousAccounts) {
        queryClient.setQueryData(bankingKeys.accounts(), context.previousAccounts);
      }
    },
    onSuccess: (response, enrollmentId) => {
      if (response.success) {
        selectEnrollment(null); // Deselect if deleted
      }
      mutation.onSuccess?.(response, enrollmentId, undefined);
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all banking-related queries
 * @returns Invalidation functions
 */
export function useInvalidateBankingCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: bankingKeys.all }),
    invalidateAccounts: () => queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() }),
    invalidateAccount: (id: string) => queryClient.invalidateQueries({ queryKey: bankingKeys.account(id) }),
    invalidateOverview: () => queryClient.invalidateQueries({ queryKey: bankingKeys.overview() }),
    invalidateDashboard: () => queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() }),
    invalidateTransactions: () => queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() }),
    invalidateAnalytics: () => queryClient.invalidateQueries({ queryKey: [...bankingKeys.all, 'analytics'] }),
  };
}

/**
 * Prefetch banking data for performance
 * @returns Prefetch functions
 */
export function usePrefetchBankingData() {
  const queryClient = useQueryClient();
  const { isAuthReady } = useAuthReady();

  return {
    prefetchAccounts: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(bankingQueries.accounts());
      }
    },
    prefetchAccount: (accountId: string) => {
      if (isAuthReady) {
        queryClient.prefetchQuery(bankingQueries.account(accountId));
      }
    },
    prefetchOverview: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(bankingQueries.overview());
      }
    },
    prefetchDashboard: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(bankingQueries.dashboard());
      }
    },
  };
}
