import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { integrationsApi } from '@/lib/services/integrations-api';
import { useIntegrationsStore } from '@/lib/stores/integrations-store';
import { useToast } from '@/lib/hooks/use-toast';
import type {
  Integration,
  IntegrationProvider,
  ProviderConfig,
  IntegrationConnectionStatus,
  SyncIntegrationRequest,
  SyncIntegrationResponse,
  IntegrationSyncStatusResponse,
  QuickBooksCompanyInfo,
  QuickBooksAccount,
  QuickBooksTransaction,
  QuickBooksInvoice,
  ApiResponse,
  IntegrationQueryParams,
  TransactionQueryParams,
} from '@/lib/types/integrations';

/**
 * React Query hooks for integrations
 *
 * Provides data fetching, caching, and state synchronization
 * Follows the same patterns as crypto-queries and banking-queries
 */

// Query Keys
export const integrationsQueryKeys = {
  all: ['integrations'] as const,
  lists: () => [...integrationsQueryKeys.all, 'list'] as const,
  list: (params?: IntegrationQueryParams) => [...integrationsQueryKeys.lists(), params] as const,
  details: () => [...integrationsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...integrationsQueryKeys.details(), id] as const,

  providers: {
    all: ['providers'] as const,
    list: () => [...integrationsQueryKeys.providers.all, 'list'] as const,
    detail: (provider: IntegrationProvider) => [...integrationsQueryKeys.providers.all, provider] as const,
    health: () => [...integrationsQueryKeys.providers.all, 'health'] as const,
  },

  quickbooks: {
    all: ['quickbooks'] as const,
    status: () => [...integrationsQueryKeys.quickbooks.all, 'status'] as const,
    company: () => [...integrationsQueryKeys.quickbooks.all, 'company'] as const,
    accounts: () => [...integrationsQueryKeys.quickbooks.all, 'accounts'] as const,
    transactions: (params?: TransactionQueryParams) => [...integrationsQueryKeys.quickbooks.all, 'transactions', params] as const,
    invoices: (params?: TransactionQueryParams) => [...integrationsQueryKeys.quickbooks.all, 'invoices', params] as const,
    bills: (params?: TransactionQueryParams) => [...integrationsQueryKeys.quickbooks.all, 'bills', params] as const,
    syncStatus: () => [...integrationsQueryKeys.quickbooks.all, 'sync-status'] as const,
  },

  stripe: {
    all: ['stripe'] as const,
    status: () => [...integrationsQueryKeys.all, 'stripe', 'status'] as const,
  },

  plaid: {
    all: ['plaid'] as const,
    status: () => [...integrationsQueryKeys.all, 'plaid', 'status'] as const,
  },

  syncLogs: (integrationId: string) => [...integrationsQueryKeys.all, 'sync-logs', integrationId] as const,
};

// ========================================
// Provider Queries
// ========================================

/**
 * Get all available integration providers
 */
export function useAvailableProviders() {
  const setAvailableProviders = useIntegrationsStore((state) => state.setAvailableProviders);
  const setProvidersLoading = useIntegrationsStore((state) => state.setProvidersLoading);

  return useQuery({
    queryKey: integrationsQueryKeys.providers.list(),
    queryFn: async () => {
      setProvidersLoading(true);
      try {
        const response = await integrationsApi.getAvailableProviders();
        if (response.success) {
          setAvailableProviders(response.data.providers);
          return response.data.providers;
        }
        throw new Error(response.error?.message || 'Failed to fetch providers');
      } finally {
        setProvidersLoading(false);
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour - providers don't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Get provider health status
 */
export function useProvidersHealth() {
  return useQuery({
    queryKey: integrationsQueryKeys.providers.health(),
    queryFn: async () => {
      const response = await integrationsApi.getProvidersHealth();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch provider health');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

// ========================================
// User Integrations Queries
// ========================================

/**
 * Get all user integrations
 */
export function useUserIntegrations(params?: IntegrationQueryParams) {
  const setIntegrations = useIntegrationsStore((state) => state.setIntegrations);
  const setIntegrationsLoading = useIntegrationsStore((state) => state.setIntegrationsLoading);

  return useQuery({
    queryKey: integrationsQueryKeys.list(params),
    queryFn: async () => {
      setIntegrationsLoading(true);
      try {
        const response = await integrationsApi.getUserIntegrations(params);
        if (response.success) {
          setIntegrations(response.data.integrations);
          return response.data.integrations;
        }
        throw new Error(response.error?.message || 'Failed to fetch integrations');
      } finally {
        setIntegrationsLoading(false);
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get integrations summary
 */
export function useIntegrationsSummary() {
  return useQuery({
    queryKey: [...integrationsQueryKeys.all, 'summary'],
    queryFn: async () => {
      const response = await integrationsApi.getIntegrationsSummary();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch summary');
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ========================================
// QuickBooks Queries
// ========================================

/**
 * Get QuickBooks connection status
 */
export function useQuickBooksStatus() {
  return useQuery({
    queryKey: integrationsQueryKeys.quickbooks.status(),
    queryFn: async () => {
      const response = await integrationsApi.getQuickBooksStatus();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch QuickBooks status');
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}

/**
 * Get QuickBooks company information
 */
export function useQuickBooksCompany() {
  const setQuickBooksCompanyInfo = useIntegrationsStore((state) => state.setQuickBooksCompanyInfo);

  return useQuery({
    queryKey: integrationsQueryKeys.quickbooks.company(),
    queryFn: async () => {
      const response = await integrationsApi.getQuickBooksCompany();
      if (response.success) {
        setQuickBooksCompanyInfo(response.data);
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch company info');
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  });
}

/**
 * Get QuickBooks accounts
 */
export function useQuickBooksAccounts() {
  return useQuery({
    queryKey: integrationsQueryKeys.quickbooks.accounts(),
    queryFn: async () => {
      const response = await integrationsApi.getQuickBooksAccounts();

      if (response.success) {
        return response.data.accounts;
      }
      throw new Error(response.error?.message || 'Failed to fetch QuickBooks accounts');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Get QuickBooks transactions
 */
export function useQuickBooksTransactions(params?: TransactionQueryParams) {
  return useQuery({
    queryKey: integrationsQueryKeys.quickbooks.transactions(params),
    queryFn: async () => {
      const response = await integrationsApi.getQuickBooksTransactions(params);
      if (response.success) {
        return response.data.transactions;
      }
      throw new Error(response.error?.message || 'Failed to fetch transactions');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Get QuickBooks invoices
 */
export function useQuickBooksInvoices(params?: TransactionQueryParams) {
  return useQuery({
    queryKey: integrationsQueryKeys.quickbooks.invoices(params),
    queryFn: async () => {
      const response = await integrationsApi.getQuickBooksInvoices(params);
      if (response.success) {
        return response.data.invoices;
      }
      throw new Error(response.error?.message || 'Failed to fetch invoices');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Get QuickBooks sync status
 */
export function useQuickBooksSyncStatus() {
  return useQuery({
    queryKey: integrationsQueryKeys.quickbooks.syncStatus(),
    queryFn: async () => {
      const response = await integrationsApi.getQuickBooksSyncStatus();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch sync status');
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds when active
  });
}

// ========================================
// Mutations
// ========================================

/**
 * Connect QuickBooks
 */
export function useConnectQuickBooks() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await integrationsApi.connectQuickBooks();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to connect QuickBooks');
    },
    onSuccess: (data) => {
      // Open authorization URL in popup window
      if (typeof window !== 'undefined' && data.authorizationUrl) {
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        window.open(
          data.authorizationUrl,
          'integration_auth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Disconnect QuickBooks
 */
export function useDisconnectQuickBooks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const removeIntegration = useIntegrationsStore((state) => state.removeIntegration);

  return useMutation({
    mutationFn: async () => {
      const response = await integrationsApi.disconnectQuickBooks();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to disconnect QuickBooks');
    },
    onSuccess: () => {
      // Invalidate all QuickBooks queries
      queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.quickbooks.all });
      queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.lists() });

      toast({
        title: 'QuickBooks Disconnected',
        description: 'Your QuickBooks account has been disconnected successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Disconnection Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Sync QuickBooks
 */
export function useSyncQuickBooks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (syncData?: SyncIntegrationRequest) => {
      const response = await integrationsApi.syncQuickBooks(syncData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to start sync');
    },
    onSuccess: (data) => {
      // Invalidate queries to show updated data after sync completes
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.quickbooks.all });
        queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.lists() });
      }, 5000);

      toast({
        title: 'Sync Started',
        description: `QuickBooks sync initiated. Job ID: ${data.jobId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Generic connect provider
 */
export function useConnectProvider() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (provider: IntegrationProvider) => {
      const response = await integrationsApi.connectProvider(provider);
      if (response.success) {
        return { provider, data: response.data };
      }
      throw new Error(response.error?.message || `Failed to connect ${provider}`);
    },
    onSuccess: ({ provider, data }) => {
      if (typeof window !== 'undefined' && data.authorizationUrl) {
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        window.open(
          data.authorizationUrl,
          'integration_auth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Generic disconnect provider
 */
export function useDisconnectProvider() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (provider: IntegrationProvider) => {
      const response = await integrationsApi.disconnectProvider(provider);
      if (response.success) {
        return { provider, data: response.data };
      }
      throw new Error(response.error?.message || `Failed to disconnect ${provider}`);
    },
    onSuccess: ({ provider }) => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.lists() });

      toast({
        title: `${provider} Disconnected`,
        description: `Your ${provider} account has been disconnected successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Disconnection Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Generic sync provider
 */
export function useSyncProvider() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const setIntegrationsLoading = useIntegrationsStore((state) => state.setIntegrationsLoading);

  return useMutation({
    mutationFn: async ({ provider, syncData }: { provider: IntegrationProvider; syncData?: SyncIntegrationRequest }) => {
      const response = await integrationsApi.syncProvider(provider, syncData);
      if (response.success) {
        return { provider, data: response.data };
      }
      throw new Error(response.error?.message || `Failed to sync ${provider}`);
    },
    onSuccess: async ({ provider, data }) => {
      toast({
        title: 'Sync Started',
        description: `${provider} sync initiated. Fetching latest data...`,
      });

      // Poll for sync completion
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts = ~60 seconds
      const pollInterval = 2000; // 2 seconds

      const pollStatus = async () => {
        try {
          const statusResponse = await integrationsApi.getProviderSyncStatus(provider);

          if (statusResponse.success) {
            const latestSync = statusResponse.data.recentSyncs[0];

            if (latestSync?.status === 'SUCCESS') {
              // Sync completed successfully - refetch all data
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.all }),
              ]);

              toast({
                title: 'Sync Complete',
                description: `${provider} data has been updated successfully.`,
              });

              setIntegrationsLoading(false);
              return;
            } else if (latestSync?.status === 'FAILED') {
              toast({
                title: 'Sync Failed',
                description: latestSync.errorMessage || 'Failed to sync data',
                variant: 'destructive',
              });
              setIntegrationsLoading(false);
              return;
            }
          }

          // Continue polling if still in progress
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(pollStatus, pollInterval);
          } else {
            // Timeout - still refresh data
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.lists() }),
              queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.all }),
            ]);

            toast({
              title: 'Sync In Progress',
              description: `${provider} sync is taking longer than expected. Data will update when complete.`,
            });
            setIntegrationsLoading(false);
          }
        } catch (error) {
          console.error('Error polling sync status:', error);
          setIntegrationsLoading(false);
        }
      };

      // Start polling after a brief delay
      setIntegrationsLoading(true);
      setTimeout(pollStatus, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIntegrationsLoading(false);
    },
  });
}

/**
 * Refresh all integrations
 */
export function useRefreshAllIntegrations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const setIntegrationsLoading = useIntegrationsStore((state) => state.setIntegrationsLoading);

  return useMutation({
    mutationFn: async () => {
      const response = await integrationsApi.refreshAllIntegrations();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to refresh integrations');
    },
    onSuccess: async (data) => {
      if (data.syncJobs.length === 0) {
        toast({
          title: 'No Active Integrations',
          description: 'No connected integrations to sync',
        });
        return;
      }

      toast({
        title: 'Sync Started',
        description: `Syncing ${data.syncJobs.length} integration(s)...`,
      });

      setIntegrationsLoading(true);

      // Poll all sync jobs
      const pollPromises = data.syncJobs.map(async (job) => {
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = 2000;

        while (attempts < maxAttempts) {
          try {
            const statusResponse = await integrationsApi.getProviderSyncStatus(job.provider);

            if (statusResponse.success) {
              const latestSync = statusResponse.data.recentSyncs[0];

              if (latestSync?.status === 'SUCCESS' || latestSync?.status === 'FAILED') {
                return { provider: job.provider, status: latestSync.status };
              }
            }

            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            attempts++;
          } catch (error) {
            console.error(`Error polling ${job.provider}:`, error);
            break;
          }
        }

        return { provider: job.provider, status: 'TIMEOUT' };
      });

      // Wait for all syncs to complete or timeout
      const results = await Promise.all(pollPromises);

      // Refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: integrationsQueryKeys.lists() }),
      ]);

      setIntegrationsLoading(false);

      // Show completion summary
      const successful = results.filter((r) => r.status === 'SUCCESS').length;
      const failed = results.filter((r) => r.status === 'FAILED').length;
      const timeout = results.filter((r) => r.status === 'TIMEOUT').length;

      if (successful === data.syncJobs.length) {
        toast({
          title: 'All Syncs Complete',
          description: `Successfully synced ${successful} integration(s)`,
        });
      } else if (failed > 0) {
        toast({
          title: 'Sync Completed with Errors',
          description: `${successful} succeeded, ${failed} failed${timeout > 0 ? `, ${timeout} timed out` : ''}`,
          variant: 'destructive',
        });
      } else if (timeout > 0) {
        toast({
          title: 'Sync In Progress',
          description: `${successful} completed, ${timeout} still syncing. Data will update when complete.`,
        });
      }
    },
    onError: (error: Error) => {
      setIntegrationsLoading(false);
      toast({
        title: 'Refresh Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
