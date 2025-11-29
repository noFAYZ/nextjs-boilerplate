import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { bankingApi } from '@/lib/services/banking-api';
import { useAuthStore } from '@/lib/stores/auth-store';
import { bankingKeys } from './banking-queries';
import type { BankAccount } from '@/lib/types/banking';
import type { ApiResponse } from '@/lib/types/crypto';

// ============================================================================
// PLAID QUERY KEYS
// ============================================================================

export const plaidKeys = {
  all: ['plaid'] as const,
  linkToken: () => [...plaidKeys.all, 'linkToken'] as const,
  syncStatus: () => [...plaidKeys.all, 'syncStatus'] as const,
};

// ============================================================================
// PLAID QUERIES
// ============================================================================

export const plaidQueries = {
  linkToken: () => ({
    queryKey: plaidKeys.linkToken(),
    queryFn: async () => {
      return await bankingApi.getPlaidLinkToken();
    },
    staleTime: 1000 * 60 * 25, // Link token is valid for 30 minutes, refresh at 25
    retry: 1,
    select: (data: ApiResponse<{ linkToken: string }>) => {
      if (data.success && data.data?.linkToken) {
        return data.data.linkToken;
      }
      return null;
    },
  }),
};

// ============================================================================
// PLAID MUTATIONS
// ============================================================================

export const plaidMutations = {
  useAddPlaidAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (publicToken: string) => {
        const response = await bankingApi.addPlaidAccount(publicToken);
        if (!response.success) {
          throw response;
        }
        return response;
      },
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate banking queries to refresh account list
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.enrollments() });
        }
      },
      onError: (error) => {
        console.error('Failed to add Plaid account:', error);
      },
    });
  },

  useSyncPlaidAccounts: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => {
        return await bankingApi.syncPlaidAccounts();
      },
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate account queries to refresh balances
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.dashboard() });
        }
      },
      onError: (error) => {
        console.error('Failed to sync Plaid accounts:', error);
      },
    });
  },

  useSyncPlaidTransactions: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (params: { startDate: string; endDate: string }) => {
        return await bankingApi.syncPlaidTransactions(params.startDate, params.endDate);
      },
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate transaction queries to refresh
          queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.overview() });
        }
      },
      onError: (error) => {
        console.error('Failed to sync Plaid transactions:', error);
      },
    });
  },
};

// ============================================================================
// AUTH-READY HOOKS
// ============================================================================

export const usePlaidLinkToken = () => {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;

  return useQuery({
    ...plaidQueries.linkToken(),
    enabled: isAuthReady,
  });
};

export const useAddPlaidAccount = () => {
  return plaidMutations.useAddPlaidAccount();
};

export const useSyncPlaidAccounts = () => {
  return plaidMutations.useSyncPlaidAccounts();
};

export const useSyncPlaidTransactions = () => {
  return plaidMutations.useSyncPlaidTransactions();
};
