import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData
} from '@tanstack/react-query';
import { bankingApi } from '@/lib/services/banking-api';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';

// Module-level map to track initialization timeouts (30s "no SSE response" timeouts)
// Keyed by accountId, stores the timeout ID so it can be cleared when SSE messages arrive
const initializationTimeouts = new Map<string, NodeJS.Timeout>();

// Utility function to clear initialization timeout for an account
export function clearInitializationTimeout(accountId: string) {
  const timeoutId = initializationTimeouts.get(accountId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    initializationTimeouts.delete(accountId);
  }
}
import type {
  BankAccount,
  BankTransaction,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
  BankTransactionParams,
  BankSyncRequest,
  BankingExportRequest,
  TellerEnrollment,
  BankSyncJob,
  BankingOverview
} from '@/lib/types/banking';
import type { ApiResponse, PaginationInfo } from '@/lib/types/crypto';

// Query Keys Factory
export const bankingKeys = {
  all: ['banking'] as const,

  // Accounts
  accounts: (orgId?: string) => [...bankingKeys.all, 'accounts', orgId] as const,
  groupedAccounts: (orgId?: string) => [...bankingKeys.all, 'groupedAccounts', orgId] as const,

  account: (id: string, orgId?: string) => [...bankingKeys.accounts(orgId), id] as const,
  accountSummary: (id: string, orgId?: string) => [...bankingKeys.accounts(orgId), id, 'summary'] as const,

  // Overview & Dashboard
  overview: (orgId?: string) => [...bankingKeys.all, 'overview', orgId] as const,
  dashboard: (orgId?: string) => [...bankingKeys.all, 'dashboard', orgId] as const,

  // Transactions
  transactions: (params?: BankTransactionParams, orgId?: string) =>
    [...bankingKeys.all, 'transactions', params, orgId] as const,
  accountTransactions: (accountId: string, params?: Omit<BankTransactionParams, 'accountId'>, orgId?: string) =>
    [...bankingKeys.accounts(orgId), accountId, 'transactions', params] as const,

  // Enrollments
  enrollments: (orgId?: string) => [...bankingKeys.all, 'enrollments', orgId] as const,
  enrollment: (id: string, orgId?: string) => [...bankingKeys.enrollments(orgId), id] as const,

  // Sync
  syncStatus: (accountId: string, jobId?: string, orgId?: string) =>
    [...bankingKeys.accounts(orgId), accountId, 'sync', { jobId }] as const,

  // Health & Analytics
  health: (orgId?: string) => [...bankingKeys.all, 'health', orgId] as const,
  spendingCategories: (timeRange?: string, accountIds?: string[], orgId?: string) =>
    [...bankingKeys.all, 'spending-categories', { timeRange, accountIds }, orgId] as const,
  monthlyTrend: (months?: number, accountIds?: string[], orgId?: string) =>
    [...bankingKeys.all, 'monthly-trend', { months, accountIds }, orgId] as const,
};

// Helper function for error handling
interface ApiErrorResponse {
  response?: {
    status: number;
  };
}

// Interface for grouped banking data
interface BankAccountGroup {
  enrollment: TellerEnrollment;
  accounts: BankAccount[];
}

interface GroupedBankAccounts {
  [enrollmentId: string]: BankAccountGroup;
}

const handleApiError = (error: unknown, mockData: unknown) => {
  if (error && typeof error === 'object' && 'response' in error &&
      ((error as ApiErrorResponse).response?.status === 401 || (error as ApiErrorResponse).response?.status === 404)) {
    console.log('Banking endpoint not available, using mock data');
    return { success: true, data: mockData };
  }
  throw error;
};

// Mock data for development
const mockBankAccounts: BankAccount[] = [];

const mockBankingOverview = {
  totalAccounts: 0,
  totalBalance: 0,
  accountsByType: {},
  recentTransactions: [],
  lastSyncAt: null
};

const mockTransactions: BankTransaction[] = [];

// ============================================================================
// HELPER: Get current organization ID from store (not from closure)
// ============================================================================
function getCurrentOrganizationId(explicitOrgId?: string): string | undefined {
  // Explicit orgId takes precedence
  if (explicitOrgId) return explicitOrgId;

  // Otherwise get from store (gets current org at execution time, not creation time)
  try {
    const orgId = useOrganizationStore.getState().selectedOrganizationId;
    return orgId || undefined;
  } catch {
    return undefined;
  }
}

// Query Options Factory
export const bankingQueries = {
  // Accounts
  accounts: (orgId?: string) => ({
    queryKey: bankingKeys.accounts(orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getAccounts(currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, mockBankAccounts);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 401/404 errors
    select: (data: ApiResponse<BankAccount[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

    // Accounts
    groupedAccounts: (orgId?: string) => ({
      queryKey: bankingKeys.groupedAccounts(orgId),
      queryFn: async () => {
        try {
          const currentOrgId = getCurrentOrganizationId(orgId);
          return await bankingApi.getGroupedAccounts(currentOrgId);
        } catch (error: unknown) {
          return handleApiError(error, mockBankAccounts);
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false, // Don't retry on 401/404 errors
      select: (data: ApiResponse<BankAccount[]>) => {
        if (!data.success) {
          return [];
        }

        // The API returns grouped data by enrollment ID
        // Structure: { enrollmentId: { enrollment: {...}, accounts: [...] } }
        const groupedData = data.data as unknown as GroupedBankAccounts;

        if (!groupedData || typeof groupedData !== 'object') {
          return [];
        }

        // Extract all accounts from all enrollment groups into a flat array
        const allAccounts: BankAccount[] = [];

        Object.values(groupedData).forEach((group: BankAccountGroup) => {
          if (group && group.accounts && Array.isArray(group.accounts)) {
            allAccounts.push(...group.accounts);
          }
        });

        console.log('Extracted accounts count:', allAccounts.length);
        return allAccounts;
      },
    }),

  account: (id: string, orgId?: string) => ({
    queryKey: bankingKeys.account(id, orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getAccount(id, currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, null);
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: false,
    select: (data: ApiResponse<BankAccount & { bankTransactions: BankTransaction[] }>) => data.success ? data.data : null,
  }),

  accountSummary: (id: string, orgId?: string) => ({
    queryKey: bankingKeys.accountSummary(id, orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getAccountSummary(id, currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, null);
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<unknown>) => data.success ? data.data : null,
  }),

  // Overview & Dashboard
  overview: (orgId?: string) => ({
    queryKey: bankingKeys.overview(orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getOverview(currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, mockBankingOverview);
      }
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: false,
    select: (data: ApiResponse<unknown>): BankingOverview | null => {
      return data.success ? (data.data as BankingOverview) : null;
    },
  }),

  dashboard: (orgId?: string) => ({
    queryKey: bankingKeys.dashboard(orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getDashboardData(currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, null);
      }
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: false,
    select: (data: ApiResponse<unknown>) => data.success ? data.data : null,
  }),

  // Transactions
  transactions: (params?: BankTransactionParams, orgId?: string) => ({
    queryKey: bankingKeys.transactions(params, orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getTransactions(params, currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, { data: mockTransactions, pagination: null });
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
    select: (data: ApiResponse<{ data: BankTransaction[]; pagination: PaginationInfo | null }>) => {
      if (data.success && data.data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  accountTransactions: (accountId: string, params?: Omit<BankTransactionParams, 'accountId'>, orgId?: string) => ({
    queryKey: bankingKeys.accountTransactions(accountId, params, orgId),
    queryFn: async () => {
      try {
        const currentOrgId = getCurrentOrganizationId(orgId);
        return await bankingApi.getAccountTransactions(accountId, params, currentOrgId);
      } catch (error: unknown) {
        return handleApiError(error, { data: mockTransactions, pagination: null });
      }
    },
    enabled: !!accountId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
    select: (data: ApiResponse<{ data: BankTransaction[]; pagination: PaginationInfo | null }>) => {

      if (data.success && data.data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  // Infinite query for transactions
  infiniteTransactions: (params?: Omit<BankTransactionParams, 'page'>) => ({
    queryKey: [...bankingKeys.transactions(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      bankingApi.getTransactions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiResponse<{ data: BankTransaction[]; pagination: PaginationInfo }>) => {
      if (lastPage.success && lastPage.data?.pagination?.hasNext) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
    select: (data: { pages: ApiResponse<{ data: BankTransaction[] }>[]; pageParams: unknown[] }) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      transactions: data.pages.flatMap((page: ApiResponse<{ data: BankTransaction[] }>) =>
        page.success && page.data && Array.isArray(page.data.data) ? page.data.data : []
      ),
    }),
  }),

  // Enrollments
  enrollments: () => ({
    queryKey: bankingKeys.enrollments(),
    queryFn: () => bankingApi.getEnrollments(),
    staleTime: 1000 * 60 * 10, // 10 minutes (enrollments change less frequently)
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  enrollment: (id: string) => ({
    queryKey: bankingKeys.enrollment(id),
    queryFn: () => bankingApi.getEnrollment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    select: (data: ApiResponse<unknown>) => data.success ? data.data : null,
  }),

  // Sync Status
  syncStatus: (accountId: string, jobId?: string) => ({
    queryKey: bankingKeys.syncStatus(accountId, jobId),
    queryFn: () => bankingApi.getSyncStatus(accountId, jobId),
    enabled: false, // Will be overridden by the hook with proper shouldQuery logic
    refetchInterval: (query) => {
      const data = query.state.data as ApiResponse<BankSyncJob> | undefined;
      // If the API returned an error (like 404 for no sync job), stop polling
      if (!data || !data.success) {
        return false;
      }

      // If we have sync data, check the status
      if (data.data) {
        const syncData = data.data;
        // Stop polling when sync is completed or failed
        if (syncData.status === 'completed' ||
            syncData.status === 'failed') {
          return false;
        }
        console.log("data.data: ",data.data)

        // Continue polling if sync is actively processing or queued
        if (syncData.status === 'processing' ||
            syncData.status === 'queued' ||
            syncData.status === 'syncing' ||
            syncData.status === 'syncing_balance' ||
            syncData.status === 'syncing_transactions') {
          return 3000; // Poll every 3 seconds (banking might be slower)
        }
      }

      return false;
    },
    retry: 1, // Only retry once for 404s
    staleTime: 1000, // Consider data stale after 1 second during active sync
    select: (data: ApiResponse<unknown>) => data.success ? data.data : null,
  }),

  // Health Check
  health: () => ({
    queryKey: bankingKeys.health(),
    queryFn: () => bankingApi.getHealthStatus(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Check every 5 minutes
    select: (data: ApiResponse<unknown>) => data.success ? data.data : null,
  }),

  // Analytics - New high-performance endpoints
  topSpendingCategories: (params?: {
    period?: string;
    fromDate?: string;
    toDate?: string;
    fromMonth?: string;
    toMonth?: string;
    limit?: number;
  }) => ({
    queryKey: [...bankingKeys.all, 'analytics', 'top-categories', params] as const,
    queryFn: async () => {
      try {
        return await bankingApi.getTopSpendingCategories(params);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  monthlySpendingTrend: (params?: {
    period?: string;
    fromDate?: string;
    toDate?: string;
    months?: number;
    accountId?: string;
  }) => ({
    queryKey: [...bankingKeys.all, 'analytics', 'monthly-trend', params] as const,
    queryFn: async () => {
      try {
        return await bankingApi.getMonthlyTrend(params);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  accountSpendingComparison: (params?: {
    period?: string;
    fromDate?: string;
    toDate?: string;
    month?: string;
  }) => ({
    queryKey: [...bankingKeys.all, 'analytics', 'account-comparison', params] as const,
    queryFn: async () => {
      try {
        return await bankingApi.getAccountSpendingComparison(params);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),
  spendingByCategory: (params?: {
    accountId?: string;
    category?: string;
    accountType?: string;
    fromMonth?: string;
    toMonth?: string;
    limit?: number;
  }) => ({
    queryKey: [...bankingKeys.all, 'analytics', 'spending-by-category', params] as const,
    queryFn: async () => {
      try {
        return await bankingApi.getSpendingByCategory(params);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  // Analytics - Legacy (for backward compatibility)
  spendingCategories: (timeRange = 'month', accountIds?: string[]) => ({
    queryKey: bankingKeys.spendingCategories(timeRange, accountIds),
    queryFn: async () => {
      try {
        return await bankingApi.getSpendingCategories(timeRange as 'week' | 'month' | 'quarter' | 'year', accountIds);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),

  monthlyTrend: (months = 12, accountIds?: string[]) => ({
    queryKey: bankingKeys.monthlyTrend(months, accountIds),
    queryFn: async () => {
      try {
        return await bankingApi.getMonthlySpendingTrend(months, accountIds);
      } catch (error: unknown) {
        return handleApiError(error, []);
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: false,
    select: (data: ApiResponse<unknown[]>) => {
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
  }),
};

// Mutations
export const bankingMutations = {
  // Account mutations
  useConnectAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateBankAccountRequest) => {
        const response = await bankingApi.connectAccount(data);

        if (!response.success) {
          throw response;
        }

        return response;
      },
      onSuccess: (response) => {
        if (response.success) {
          // Comprehensive cache invalidation for account connection
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.enrollments() });
        }
      },
      onError: (error) => {
        console.error('Failed to connect bank account:', error);
      },
    });
  },

  useConnectStripeAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: { sessionId: string; selectedAccountIds?: string[] }) => {
        const response = await bankingApi.connectStripeAccounts(data);

        if (!response.success) {
          throw response;
        }

        return response;
      },
      onSuccess: (response) => {
        if (response.success) {
          // Comprehensive cache invalidation for account connection
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
        }
      },
      onError: (error) => {
        console.error('Failed to connect Stripe bank account:', error);
      },
    });
  },

  useUpdateAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: UpdateBankAccountRequest }) =>
        bankingApi.updateAccount(id, updates),
      onSuccess: (response, variables) => {
        if (response.success) {
          // Cache invalidation for account update
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.account(variables.id) });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
        }
      },
      onError: (error) => {
        console.error('Failed to update bank account:', error);
      },
    });
  },

  useDisconnectAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (accountId: string) => bankingApi.disconnectAccount(accountId),
      onSuccess: (response, accountId) => {
        if (response.success) {
          // Remove all account-specific queries from cache
          queryClient.removeQueries({ queryKey: bankingKeys.account(accountId) });
          queryClient.removeQueries({ queryKey: bankingKeys.accountTransactions(accountId) });
          queryClient.removeQueries({ queryKey: bankingKeys.syncStatus(accountId) });

          // Invalidate global queries that depend on account list
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
        }
      },
      onError: (error) => {
        console.error('Failed to disconnect bank account:', error);
      },
    });
  },

  // Sync mutations
  useSyncAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ accountId, syncData }: { accountId: string; syncData?: BankSyncRequest }) =>
        bankingApi.syncAccount(accountId, syncData)

        ,
      onSuccess: (response, variables) => {
        if (response.success) {
          const { accountId } = variables;
          const { jobId } = response.data;

          console.log(`[Banking Sync] Mutation succeeded for account ${accountId}, jobId: ${jobId}`);

          queryClient.invalidateQueries({ queryKey: bankingKeys.account(accountId) });
        }
      },
      onError: (error) => {
        console.error('Failed to start account sync:', error);
      },
    });
  },

  useSyncAllAccounts: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => bankingApi.refreshAllAccounts(),

      onSuccess: (response) => {
        if (response.success && response.data.syncJobs) {
          console.log(`[Banking Sync] Sync all mutation succeeded, initializing ${response.data.syncJobs.length} syncs`);

          // Comprehensive cache invalidation for all account sync
          queryClient.invalidateQueries({ queryKey: bankingKeys.all });
        }
      },
      onError: (error) => {
        console.error('Failed to sync all accounts:', error);
      },
    });
  },

  // Sync completion handler - call this after successful sync
  useSyncComplete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (accountId: string) => {
        // This is called internally after sync tracking completes
        return Promise.resolve(accountId);
      },
      onSuccess: (accountId) => {
        // Comprehensive cache refresh after successful sync
        queryClient.invalidateQueries({ queryKey: bankingKeys.account(accountId) });
        queryClient.invalidateQueries({ queryKey: bankingKeys.accountTransactions(accountId) });
        queryClient.invalidateQueries({ queryKey: bankingKeys.accountSummary(accountId) });

        // Update global data that depends on account data
        queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
        queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
        queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
        queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
        queryClient.invalidateQueries({ queryKey: bankingKeys.spendingCategories() });
        queryClient.invalidateQueries({ queryKey: bankingKeys.monthlyTrend() });
      }
    });
  },

  // Export mutation
  useExportBankingData: () => {
    return useMutation({
      mutationFn: (exportData: BankingExportRequest) => bankingApi.exportBankingData(exportData),
      onSuccess: (response) => {
        if (response.success) {
          // Trigger download or show success message
          const { downloadUrl } = response.data;
          window.open(downloadUrl, '_blank');
        }
      },
      onError: (error) => {
        console.error('Failed to export banking data:', error);
      },
    });
  },

  // Clear all banking cache - useful for logout or major operations
  useClearBankingCache: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => Promise.resolve(),
      onSuccess: () => {
        // Clear all banking queries from cache
        queryClient.removeQueries({ queryKey: bankingKeys.all });
      }
    });
  },

  // Enrollment mutations
  useDeleteEnrollment: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (enrollmentId: string) => bankingApi.deleteEnrollment(enrollmentId),
      onSuccess: (response, enrollmentId) => {
        if (response.success) {
          // Remove enrollment-specific queries from cache
          queryClient.removeQueries({ queryKey: bankingKeys.enrollment(enrollmentId) });

          // Invalidate global queries that depend on enrollment data
          queryClient.invalidateQueries({ queryKey: bankingKeys.enrollments() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.groupedAccounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });

          // Force refetch to get updated data immediately
          queryClient.refetchQueries({ queryKey: bankingKeys.accounts() });
        }
      },
      onError: (error) => {
        console.error('Failed to delete enrollment:', error);
      },
    });
  },

  // Transaction sync mutations
  useSyncAccountTransactions: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ accountId, options }: {
        accountId: string;
        options?: {
          startDate?: string;
          endDate?: string;
          limit?: number;
          force?: boolean;
        }
      }) => bankingApi.syncAccountTransactions(accountId, options),
      onSuccess: (response, variables) => {
        if (response.success) {
          const { accountId } = variables;

          // Invalidate transaction-related queries to refresh data
          queryClient.invalidateQueries({ queryKey: bankingKeys.accountTransactions(accountId) });
          queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.account(accountId) });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.spendingCategories() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.monthlyTrend() });
        }
      },
      onError: (error) => {
        console.error('Failed to sync account transactions:', error);
      },
    });
  },

  // Refresh analytics materialized view
  useRefreshAnalytics: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => bankingApi.refreshAnalytics(),
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate all analytics queries to refetch with new data
          queryClient.invalidateQueries({ queryKey: [...bankingKeys.all, 'analytics'] });

          // Invalidate legacy analytics queries
          queryClient.invalidateQueries({ queryKey: bankingKeys.spendingCategories() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.monthlyTrend() });
        }
      },
      onError: (error) => {
        console.error('Failed to refresh analytics:', error);
      },
    });
  },
};

// Custom hook to invalidate all banking queries
export const useInvalidateBankingQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.all });
    },
    invalidateAccounts: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
    },
    invalidateOverview: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
    },
    invalidateAccount: (accountId: string) => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.account(accountId) });
    },
    invalidateTransactions: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
    },
    invalidateDashboard: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
    },
    invalidateAnalytics: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.spendingCategories() });
      queryClient.invalidateQueries({ queryKey: bankingKeys.monthlyTrend() });
    },
  };
};


// Auth-ready hooks that wait for user initialization
export const useBankingAccounts = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    ...bankingQueries.accounts(),
    enabled: isAuthReady,
  });
};

export const useBankingGroupedAccounts = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    ...bankingQueries.groupedAccounts(),
    enabled: isAuthReady,
  });
};

export const useBankingGroupedAccountsRaw = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    queryKey: bankingKeys.accounts(),
    queryFn: async () => {
      try {
        return await bankingApi.getGroupedAccounts();
      } catch (error: unknown) {
        return handleApiError(error, {});
      }
    },
    enabled: isAuthReady,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    select: (data: ApiResponse<GroupedBankAccounts>) => {
      if (!data.success) {
        return {};
      }
      return data.data || {};
    },
  });
};

export const useBankingOverview = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.overview(), enabled: isAuthReady });
};

export const useBankingDashboard = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.dashboard(), enabled: isAuthReady });
};

export const useBankingTransactions = (params?: BankTransactionParams) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.transactions(params), enabled: isAuthReady });
};

export const useAccountTransactions = (accountId: string, params?: Omit<BankTransactionParams, 'accountId'>) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.accountTransactions(accountId, params), enabled: isAuthReady && !!accountId });
};

export const useBankAccount = (id: string) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.account(id), enabled: isAuthReady && !!id });
};

export const useBankAccountSummary = (id: string) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.accountSummary(id), enabled: isAuthReady && !!id });
};

export const useBankingEnrollments = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.enrollments(), enabled: isAuthReady });
};

export const useBankingEnrollment = (id: string) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.enrollment(id), enabled: isAuthReady && !!id });
};

export const useBankingSyncStatus = (accountId: string, jobId?: string) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.syncStatus(accountId, jobId), enabled: isAuthReady && !!accountId });
};

export const useBankingHealth = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.health(), enabled: isAuthReady });
};

export const useSpendingCategories = (timeRange = 'month', accountIds?: string[]) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.spendingCategories(timeRange, accountIds), enabled: isAuthReady });
};

export const useMonthlySpendingTrend = (months = 12, accountIds?: string[]) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.monthlyTrend(months, accountIds), enabled: isAuthReady });
};

// New Analytics Hooks
export const useTopSpendingCategories = (params?: {
  period?: string;
  fromDate?: string;
  toDate?: string;
  fromMonth?: string;
  toMonth?: string;
  limit?: number;
}) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.topSpendingCategories(params), enabled: isAuthReady });
};

export const useMonthlySpendingTrendNew = (params?: {
  period?: string;
  fromDate?: string;
  toDate?: string;
  months?: number;
  accountId?: string;
}) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.monthlySpendingTrend(params), enabled: isAuthReady });
};

export const useAccountSpendingComparison = (params?: {
  period?: string;
  fromDate?: string;
  toDate?: string;
  month?: string;
}) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.accountSpendingComparison(params), enabled: isAuthReady });
};

export const useSpendingByCategory = (params?: {
  accountId?: string;
  category?: string;
  accountType?: string;
  fromMonth?: string;
  toMonth?: string;
  limit?: number;
}) => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  return useQuery({ ...bankingQueries.spendingByCategory(params), enabled: isAuthReady });
};