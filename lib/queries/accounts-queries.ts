import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { accountsApi } from '@/lib/services/accounts-api';
import { useAuthStore } from '@/lib/stores/auth-store';
import type {
  UnifiedAccountsResponse,
  UnifiedAccountDetails,
  CreateManualAccountRequest,
  UpdateAccountRequest,
} from '@/lib/types/unified-accounts';
import type { ApiResponse } from '@/lib/types/crypto';

// Query Keys Factory
export const accountsKeys = {
  all: ['unified-accounts'] as const,
  list: () => [...accountsKeys.all, 'list'] as const,
  account: (id: string) => [...accountsKeys.all, 'account', id] as const,
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
  allAccounts: () => ({
    queryKey: accountsKeys.list(),
    queryFn: async () => {
      try {
        return await accountsApi.getAllAccounts();
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
  accountDetails: (accountId: string) => ({
    queryKey: accountsKeys.account(accountId),
    queryFn: async () => {
      try {
        return await accountsApi.getAccountDetails(accountId);
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
};

// Mutations Factory
export const accountsMutations = {
  /**
   * Create a manual account
   */
  createManualAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateManualAccountRequest) => {
        return await accountsApi.createManualAccount(data);
      },
      onSuccess: () => {
        // Invalidate and refetch all accounts
        queryClient.invalidateQueries({ queryKey: accountsKeys.list() });
      },
    });
  },

  /**
   * Update an account
   */
  updateAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ accountId, updates }: { accountId: string; updates: UpdateAccountRequest }) => {
        return await accountsApi.updateAccount(accountId, updates);
      },
      onSuccess: (_, variables) => {
        // Invalidate the specific account and the list
        queryClient.invalidateQueries({ queryKey: accountsKeys.account(variables.accountId) });
        queryClient.invalidateQueries({ queryKey: accountsKeys.list() });
      },
    });
  },

  /**
   * Delete an account
   */
  deleteAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (accountId: string) => {
        return await accountsApi.deleteAccount(accountId);
      },
      onSuccess: () => {
        // Invalidate and refetch all accounts
        queryClient.invalidateQueries({ queryKey: accountsKeys.list() });
      },
    });
  },
};

// Pre-configured hooks for common queries
export function useUnifiedAccounts() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    ...accountsQueries.allAccounts(),
    enabled: isAuthReady,
  });
}

export function useAccountDetails(accountId: string | null) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    ...accountsQueries.accountDetails(accountId!),
    enabled: isAuthReady && !!accountId,
  });
}
