import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query';
import { accountsApi } from '@/lib/services/accounts-api';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
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
  TransactionCategory,
} from '@/lib/types/unified-accounts';
import type { ApiResponse } from '@/lib/types/crypto';

/**
 * Helper to get current organization ID from store
 * Uses .getState() to access state outside of React components
 */
function getCurrentOrganizationId(explicitOrgId?: string): string | undefined {
  if (explicitOrgId) return explicitOrgId;
  try {
    const orgId = useOrganizationStore.getState().selectedOrganizationId;
    return orgId || undefined;
  } catch {
    return undefined;
  }
}

// Query Keys Factory
export const accountsKeys = {
  all: ['unified-accounts'] as const,
  list: (orgId?: string) => [...accountsKeys.all, 'list', orgId] as const,
  account: (id: string, orgId?: string) => [...accountsKeys.all, 'account', id, orgId] as const,
  transactions: (accountId: string, orgId?: string) => [...accountsKeys.all, 'transactions', accountId, orgId] as const,
  transaction: (accountId: string, transactionId: string, orgId?: string) => [...accountsKeys.transactions(accountId, orgId), transactionId] as const,
  allTransactions: (orgId?: string) => [...accountsKeys.all, 'all-transactions', orgId] as const,
  categories: (orgId?: string) => [...accountsKeys.all, 'categories', orgId] as const,
  categoryGroups: (organizationId?: string) => [...accountsKeys.all, 'category-groups', organizationId || 'default'] as const,
};

// Helper function for error handling
interface ApiErrorResponse {
  response?: {
    status: number;
  };
}

const handleApiError = (error: unknown, mockData: unknown) => {
  if (error && typeof error === 'object' && 'response' in error &&
      ((error as ApiErrorResponse).response?.status === 401 || (error as ApiErrorResponse).response?.status === 404)) {
    console.log('Unified accounts endpoint not available, using mock data');
    return { success: true, data: mockData };
  }
  throw error;
};

// Mock data for development
const mockUnifiedAccounts: UnifiedAccountsResponse = {
  summary: {
    totalNetWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    accountCount: 0,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  groups: {
    cash: { category: 'CASH', totalBalance: 0, accountCount: 0, accounts: [] },
    credit: { category: 'CREDIT', totalBalance: 0, accountCount: 0, accounts: [] },
    investments: { category: 'INVESTMENTS', totalBalance: 0, accountCount: 0, accounts: [] },
    assets: { category: 'ASSETS', totalBalance: 0, accountCount: 0, accounts: [] },
    liabilities: { category: 'LIABILITIES', totalBalance: 0, accountCount: 0, accounts: [] },
    other: { category: 'OTHER', totalBalance: 0, accountCount: 0, accounts: [] },
  },
};

// Query Options Factory
export const accountsQueries = {
  /**
   * Get all accounts grouped by category
   */
  allAccounts: (orgId?: string) =>
    queryOptions({
      queryKey: accountsKeys.list(orgId),
      queryFn: async () => {
        try {
          return await accountsApi.getAllAccounts(getCurrentOrganizationId(orgId));
        } catch (error: unknown) {
          return handleApiError(error, mockUnifiedAccounts);
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false, // Don't retry on 401/404 errors
      select: (data: ApiResponse<UnifiedAccountsResponse>) => {
        if (data.success && data.data) {
         

          return data.data;
        }
        return mockUnifiedAccounts;
      },
    }),

  /**
   * Get account details by ID
   */
  accountDetails: (accountId: string, orgId?: string) =>
    queryOptions({
      queryKey: accountsKeys.account(accountId, orgId),
      queryFn: async () => {
        try {
          return await accountsApi.getAccountDetails(accountId, getCurrentOrganizationId(orgId));
        } catch (error: unknown) {
          throw error;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!accountId,
      select: (data: ApiResponse<UnifiedAccountDetails>) => {
        if (data.success && data.data) {
          return data.data;
        }
        return null;
      },
    }),

  /**
   * Get transactions for a specific account
   */
  accountTransactions: (accountId: string, params?: GetAccountTransactionsParams, orgId?: string) =>
    queryOptions({
      queryKey: accountsKeys.transactions(accountId, orgId),
      queryFn: async () => {
        try {
          return await accountsApi.getAccountTransactions(accountId, params, getCurrentOrganizationId(orgId));
        } catch (error: unknown) {
          throw error;
        }
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
      enabled: !!accountId,
      select: (data: ApiResponse<AccountTransactionsResponse>) => {
        if (data.success && data.data) {
          return data.data;
        }
        return {
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: 50,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
          timestamp: new Date().toISOString(),
        };
      },
    }),

  /**
   * Get all transaction categories (flat list)
   */
  categories: (params?: { groupId?: string; page?: number; limit?: number; activeOnly?: boolean; search?: string }, orgId?: string) =>
    queryOptions({
      queryKey: accountsKeys.categories(orgId),
      queryFn: async () => {
        try {
          return await accountsApi.getCategories(params, getCurrentOrganizationId(orgId));
        } catch (error: unknown) {
          throw error;
        }
      },
      staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
      select: (data: ApiResponse<CategoriesResponse>) => {
        if (data.success && data.data?.data) {
          return data.data.data;
        }
        return [];
      },
    }),

  /**
   * Get category groups with nested categories (for envelope budgeting and better organization)
   */
  categoryGroups: (organizationId?: string) =>
    queryOptions({
      queryKey: accountsKeys.categoryGroups(organizationId),
      queryFn: async () => {
        try {
          return await accountsApi.getCategoryGroups(getCurrentOrganizationId(organizationId));
        } catch (error: unknown) {
          throw error;
        }
      },
      staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
      select: (data: ApiResponse<CategoryGroupsResponse>) => {
        if (data.success && data.data) {
          return data.data;
        }
        return { data: [] };
      },
    }),

  /**
   * Get all transactions across all accounts (global transactions)
   */
  allTransactions: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    merchantId?: string;
    categoryId?: string;
    type?: string;
    source?: string;
    search?: string;
  }, orgId?: string) =>
    queryOptions({
      queryKey: accountsKeys.allTransactions(orgId),
      queryFn: async () => {
        try {
          return await accountsApi.getAllTransactions(params, getCurrentOrganizationId(orgId));
        } catch (error: unknown) {
          throw error;
        }
      },
      staleTime: 1000 * 60 * 2, // 2 minutes - transactions change frequently
      select: (data: ApiResponse<AccountTransactionsResponse>) => {
        // Handle different response structures
        if (data.success && data.data) {
          const responseData = data.data;
          // If data.data is already the full response with pagination
          if (responseData.data && Array.isArray(responseData.data)) {
            return responseData;
          }
          // If data.data is just the array
          if (Array.isArray(responseData)) {
            return {
              data: responseData,
              pagination: {
                page: 1,
                limit: 50,
                total: responseData.length,
                totalPages: 1,
                hasNext: false,
                hasPrev: false,
              },
            };
          }
          return responseData;
        }

        // Default empty response
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 50,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      },
    }),
};

// Mutations Factory
export const accountsMutations = {
  /**
   * Create a manual account
   * Strategy 1: Optimistic updates with rollback
   * Strategy 2: Direct cache updates from server response
   */
  createManualAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateManualAccountRequest) => {
        return await accountsApi.createManualAccount(data);
      },
      onSuccess: (response) => {
        // Invalidate all account-related queries to force a refetch
        // This ensures the UI updates immediately with the new account
        queryClient.invalidateQueries({
          queryKey: accountsKeys.list(),
        });

        // Also invalidate transactions as balance might have changed
        queryClient.invalidateQueries({
          queryKey: accountsKeys.allTransactions(),
        });
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },

  /**
   * Update an account
   * Strategy 1: Optimistic updates with rollback
   * Strategy 2: Direct cache updates from server response
   */
  updateAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ accountId, updates }: { accountId: string; updates: UpdateAccountRequest }) => {
        return await accountsApi.updateAccount(accountId, updates);
      },
      onSuccess: (response, { accountId }) => {
        if (response.success) {
          // Invalidate all unified-accounts queries (use exact: false to match any orgId)
          queryClient.invalidateQueries({
            queryKey: ['unified-accounts'],
            exact: false,
          });
        }
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },

  /**
   * Delete an account
   * Strategy 1: Optimistic removal with rollback
   * Strategy 2: Direct cache removal from server response
   */
  deleteAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (accountId: string) => {
        return await accountsApi.deleteAccount(accountId);
      },
      onSuccess: (response, accountId) => {
        if (response.success) {
          // Invalidate all unified-accounts queries (use exact: false to match any orgId)
          queryClient.invalidateQueries({
            queryKey: ['unified-accounts'],
            exact: false,
          });
        }
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },

  /**
   * Add a transaction to an account
   * Strategy 1: Optimistic updates with rollback
   * Strategy 2: Direct cache updates from server response
   */
  addTransaction: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ accountId, data }: { accountId: string; data: AddTransactionRequest }) => {
        return await accountsApi.addTransaction(accountId, data);
      },
      onSuccess: (response, { accountId }) => {
        if (response.success) {
          // Invalidate all unified-accounts queries (use exact: false to match any orgId)
          queryClient.invalidateQueries({
            queryKey: ['unified-accounts'],
            exact: false,
          });
        }
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },

  /**
   * Bulk deactivate accounts
   */
  bulkDeactivateAccounts: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (accountIds: string[]) => {
        return await accountsApi.bulkDeactivateAccounts(accountIds);
      },
      onSuccess: () => {
        // Invalidate all account queries (use exact: false to match any orgId)
        queryClient.invalidateQueries({
          queryKey: ['unified-accounts'],
          exact: false,
        });
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },

  /**
   * Bulk reactivate accounts
   */
  bulkReactivateAccounts: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (accountIds: string[]) => {
        return await accountsApi.bulkReactivateAccounts(accountIds);
      },
      onSuccess: () => {
        // Invalidate all account queries (use exact: false to match any orgId)
        queryClient.invalidateQueries({
          queryKey: ['unified-accounts'],
          exact: false,
        });
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },

  /**
   * Bulk delete accounts
   */
  bulkDeleteAccounts: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (accountIds: string[]) => {
        return await accountsApi.bulkDeleteAccounts(accountIds);
      },
      onSuccess: () => {
        // Invalidate all account queries (use exact: false to match any orgId)
        queryClient.invalidateQueries({
          queryKey: ['unified-accounts'],
          exact: false,
        });
      },
      onError: (error) => {
        // Error will be handled by the component
      },
    });
  },
};

/**
 * Helper to get organization ID from context store or explicit parameter
 */
function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}

// Pre-configured hooks for common queries
export function useUnifiedAccounts(organizationId?: string) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...accountsQueries.allAccounts(orgId),
    enabled: isAuthReady,
  });
}

export function useAccountDetails(accountId: string | null, organizationId?: string) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...accountsQueries.accountDetails(accountId!, orgId),
    enabled: isAuthReady && !!accountId,
  });
}

export function useAccountTransactions(accountId: string | null, params?: GetAccountTransactionsParams, organizationId?: string) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...accountsQueries.accountTransactions(accountId!, params, orgId),
    enabled: isAuthReady && !!accountId,
  });
}

export function useCategories(params?: { groupId?: string; page?: number; limit?: number; activeOnly?: boolean; search?: string }, organizationId?: string) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...accountsQueries.categories(params, orgId),
    enabled: isAuthReady,
  });
}

export function useCategoryGroups(organizationId?: string) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...accountsQueries.categoryGroups(orgId),
    enabled: isAuthReady,
  });
}

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
}, organizationId?: string) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...accountsQueries.allTransactions(params, orgId),
    enabled: isAuthReady,
  });
}
