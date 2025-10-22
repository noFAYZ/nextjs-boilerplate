import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
  type InfiniteData
} from '@tanstack/react-query';
import { cryptoApi } from '@/lib/services/crypto-api';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import type {
  CryptoWallet,
  CreateWalletRequest,
  UpdateWalletRequest,
  PortfolioParams,
  TransactionParams,
  NFTParams,
  SyncRequest,
  AnalyticsParams,
  ExportRequest,
  ApiResponse,
  CryptoTransaction,
  CryptoNFT,
  SyncJobStatus
} from '@/lib/types/crypto';

// Query Keys Factory
export const cryptoKeys = {
  all: ['crypto'] as const,
  
  // Wallets
  wallets: () => [...cryptoKeys.all, 'wallets'] as const,
  wallet: (id: string, timeRange?: string) => 
    [...cryptoKeys.wallets(), id, { timeRange }] as const,
  walletSummary: (id: string) => 
    [...cryptoKeys.wallets(), id, 'summary'] as const,
  aggregatedWallet: () => [...cryptoKeys.all, 'aggregated-wallet'] as const,
  
  // Portfolio
  portfolio: (params?: PortfolioParams) => 
    [...cryptoKeys.all, 'portfolio', params] as const,
  
  // Transactions
  transactions: (params?: TransactionParams) => 
    [...cryptoKeys.all, 'transactions', params] as const,
  walletTransactions: (walletId: string, params?: TransactionParams) => 
    [...cryptoKeys.wallets(), walletId, 'transactions', params] as const,
  
  // NFTs
  nfts: (params?: NFTParams) => 
    [...cryptoKeys.all, 'nfts', params] as const,
  walletNfts: (walletId: string, params?: NFTParams) => 
    [...cryptoKeys.wallets(), walletId, 'nfts', params] as const,
  
  // DeFi
  defi: () => [...cryptoKeys.all, 'defi'] as const,
  walletDefi: (walletId: string) => 
    [...cryptoKeys.wallets(), walletId, 'defi'] as const,
  
  // Sync
  syncStatus: (walletId: string, jobId?: string) => 
    [...cryptoKeys.wallets(), walletId, 'sync', { jobId }] as const,
  
  // Analytics
  analytics: (params?: AnalyticsParams) => 
    [...cryptoKeys.all, 'analytics', params] as const,
};

// Query Options Factory
export const cryptoQueries = {
  // Wallets
  wallets: () => ({
    queryKey: cryptoKeys.wallets(),
    queryFn: () => cryptoApi.getWallets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data: ApiResponse<CryptoWallet[]>) => data.success ? data.data : [],
  }),

  wallet: (id: string, timeRange = '24h') => ({
    queryKey: cryptoKeys.wallet(id, timeRange),
    queryFn: () => cryptoApi.getWallet(id, timeRange),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes - keep in cache longer
    refetchOnMount: true, // Refetch if stale when component mounts
    refetchOnReconnect: true, // Refetch on reconnect
    refetchOnWindowFocus: false, // Don't refetch on window focus (keep this off for performance)
    select: (data: ApiResponse<CryptoWallet>) => data.success ? data.data : null,
  }),

  walletSummary: (id: string) => ({
    queryKey: cryptoKeys.walletSummary(id),
    queryFn: () => cryptoApi.getWalletSummary(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3 minutes
    select: (data: ApiResponse<CryptoWallet>) => data.success ? data.data : null,
  }),
  aggregatedWallet: () => ({
    queryKey: cryptoKeys.aggregatedWallet(),
    queryFn: () => cryptoApi.getAggregatedWallet(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    select: (data: ApiResponse<CryptoWallet>) => data.success ? data.data : null,
  }),

  // Portfolio
  portfolio: (params?: PortfolioParams) => ({
    queryKey: cryptoKeys.portfolio(params),
    queryFn: () => cryptoApi.getPortfolio(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    select: (data: ApiResponse<CryptoWallet>) => data.success ? data.data : null,
  }),

  // Transactions
  transactions: (params?: TransactionParams) => ({
    queryKey: cryptoKeys.transactions(params),
    queryFn: () => cryptoApi.getTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3, // 3 minutes
    select: (data: ApiResponse<CryptoTransaction[]>) => data.success ? data : { data: [], pagination: null },
  }),

  walletTransactions: (walletId: string, params?: TransactionParams) => ({
    queryKey: cryptoKeys.walletTransactions(walletId, params),
    queryFn: () => cryptoApi.getWalletTransactions(walletId, params),
    enabled: !!walletId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3, // 3 minutes
    select: (data: ApiResponse<CryptoTransaction[]>) => data.success ? data : { data: [], pagination: null },
  }),

  // Infinite query for transactions
  infiniteTransactions: (params?: Omit<TransactionParams, 'page'>) => ({
    queryKey: [...cryptoKeys.transactions(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      cryptoApi.getTransactions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiResponse<CryptoTransaction[]>) => {
      if (lastPage.success && lastPage.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 3,
    select: (data: InfiniteData<ApiResponse<CryptoTransaction[]>>) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      transactions: data.pages.flatMap((page: ApiResponse<CryptoTransaction[]>) =>
        page.success ? page.data : []
      ),
    }),
  }),

  // NFTs
  nfts: (params?: NFTParams) => ({
    queryKey: cryptoKeys.nfts(params),
    queryFn: () => cryptoApi.getNFTs(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10, // 10 minutes (NFTs change less frequently)
    select: (data: ApiResponse<CryptoTransaction[]>) => data.success ? data : { data: [], pagination: null },
  }),

  walletNfts: (walletId: string, params?: NFTParams) => ({
    queryKey: cryptoKeys.walletNfts(walletId, params),
    queryFn: () => cryptoApi.getWalletNFTs(walletId, params),
    enabled: !!walletId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
    select: (data: ApiResponse<CryptoTransaction[]>) => data.success ? data : { data: [], pagination: null },
  }),

  // DeFi
  defi: () => ({
    queryKey: cryptoKeys.defi(),
    queryFn: () => cryptoApi.getDeFiPositions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data: ApiResponse<CryptoNFT[]>) => data.success ? data.data : [],
  }),

  walletDefi: (walletId: string) => ({
    queryKey: cryptoKeys.walletDefi(walletId),
    queryFn: () => cryptoApi.getWalletDeFiPositions(walletId),
    enabled: !!walletId,
    staleTime: 1000 * 60 * 5,
    select: (data: ApiResponse<CryptoNFT[]>) => data.success ? data.data : [],
  }),

  // Sync Status
  syncStatus: (walletId: string, jobId?: string) => ({
    queryKey: cryptoKeys.syncStatus(walletId, jobId),
    queryFn: () => cryptoApi.getSyncStatus(walletId, jobId),
    enabled: false, // Will be overridden by the hook with proper shouldQuery logic
    refetchInterval: (data: ApiResponse<SyncJobStatus>) => {
      // If the API returned an error (like 404 for no sync job), stop polling
      if (!data || !data.success) {
        return false;
      }
      
      // If we have sync data, check the status
      if (data.data) {
        const syncData = data.data;
        // Stop polling when sync is completed, failed, or doesn't exist
        if (syncData.status === 'completed' || 
            syncData.status === 'failed' || 
            syncData.status === 'cancelled') {
          return false;
        }
        
        // Only continue polling if sync is actively processing or queued
        if (syncData.status === 'processing' || syncData.status === 'queued') {
          return 2000; // Poll every 2 seconds
        }
      }
      
      // Default: don't poll if we don't know the status
      return false;
    },
    retry: 1, // Only retry once for 404s
    staleTime: 1000, // Consider data stale after 1 second during active sync
    select: (data: ApiResponse<CryptoWallet>) => data.success ? data.data : null,
  }),

  // Analytics
  analytics: (params?: AnalyticsParams) => ({
    queryKey: cryptoKeys.analytics(params),
    queryFn: () => cryptoApi.getAnalytics(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (data: ApiResponse<CryptoWallet>) => data.success ? data.data : null,
  }),
};

// Mutations
export const cryptoMutations = {
  // Wallet mutations
  useCreateWallet: () => {
    const queryClient = useQueryClient();
    const { addWallet } = useCryptoStore();

    return useMutation({
      mutationFn: async (data: CreateWalletRequest) => {
        const response = await cryptoApi.createWallet(data);

        // If the API call succeeded but the response indicates failure, throw the full response
        if (!response.success) {
          // Preserve the full error structure for plan limit handling
          throw response;
        }

        return response;
      },
      onSuccess: (response) => {
        if (response.success) {
          // Update Zustand store
          addWallet(response.data);

          // Comprehensive cache invalidation for wallet creation
          queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.transactions() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.nfts() });
        }
      },
      onError: (error) => {
        console.error('Failed to create wallet:', error);
      },
    });
  },

  useUpdateWallet: () => {
    const queryClient = useQueryClient();
    const { updateWallet } = useCryptoStore();

    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: UpdateWalletRequest }) =>
        cryptoApi.updateWallet(id, updates),
      onSuccess: (response, variables) => {
        if (response.success) {
          // Update Zustand store
          updateWallet(variables.id, response.data);

          // Comprehensive cache invalidation for wallet update
          queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.wallet(variables.id) });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.walletTransactions(variables.id) });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.walletNfts(variables.id) });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.walletDefi(variables.id) });
        }
      },
      onError: (error) => {
        console.error('Failed to update wallet:', error);
      },
    });
  },

  useDeleteWallet: () => {
    const queryClient = useQueryClient();
    const { removeWallet } = useCryptoStore();

    return useMutation({
      mutationFn: (walletId: string) => cryptoApi.deleteWallet(walletId),
      onSuccess: (response, walletId) => {
        if (response.success) {
          // Update Zustand store
          removeWallet(walletId);
          
          // Remove all wallet-specific queries from cache
          queryClient.removeQueries({ queryKey: cryptoKeys.wallet(walletId) });
          queryClient.removeQueries({ queryKey: cryptoKeys.walletTransactions(walletId) });
          queryClient.removeQueries({ queryKey: cryptoKeys.walletNfts(walletId) });
          queryClient.removeQueries({ queryKey: cryptoKeys.walletDefi(walletId) });
          queryClient.removeQueries({ queryKey: cryptoKeys.syncStatus(walletId) });

          // Invalidate global queries that depend on wallet list
          queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.analytics() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.transactions() });
          queryClient.invalidateQueries({ queryKey: cryptoKeys.nfts() });
        }
      },
      onError: (error) => {
        console.error('Failed to delete wallet:', error);
      },
    });
  },

  // Sync mutations
  useSyncWallet: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ walletId, syncData }: { walletId: string; syncData?: SyncRequest }) =>
        cryptoApi.syncWallet(walletId, syncData),
      onSuccess: (response, variables) => {
        if (response.success) {
          const { walletId } = variables;
          const { jobId } = response.data;

          // SSE will handle sync status updates automatically
          // Just invalidate queries to refresh UI data when sync completes
          queryClient.invalidateQueries({
            queryKey: cryptoKeys.syncStatus(walletId, jobId)
          });
        }
      },
      onError: (error) => {
        console.error('Failed to start wallet sync:', error);
      },
    });
  },

  useSyncAllWallets: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => cryptoApi.refreshAllWallets(),
      onSuccess: (response) => {
        if (response.success) {
          // Comprehensive cache invalidation for all wallet sync
          queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
        }
      },
      onError: (error) => {
        console.error('Failed to sync all wallets:', error);
      },
    });
  },

  // Sync completion handler - call this after successful sync
  useSyncComplete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (walletId: string) => {
        // This is called internally after sync tracking completes
        return Promise.resolve(walletId);
      },
      onSuccess: (walletId) => {
        // Comprehensive cache refresh after successful sync
        queryClient.invalidateQueries({ queryKey: cryptoKeys.wallet(walletId) });
        queryClient.invalidateQueries({ queryKey: cryptoKeys.walletTransactions(walletId) });
        queryClient.invalidateQueries({ queryKey: cryptoKeys.walletNfts(walletId) });
        queryClient.invalidateQueries({ queryKey: cryptoKeys.walletDefi(walletId) });

        // Update global data that depends on wallet data
        queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
        queryClient.invalidateQueries({ queryKey: cryptoKeys.analytics() });
        queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });

        
      }
    });
  },

  // Clear all cache - useful for logout or major operations
  useClearAllCache: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => Promise.resolve(),
      onSuccess: () => {
        // Clear all TanStack Query cache
        queryClient.clear();

        // Clear localStorage cache (if using persistent cache)
        if (typeof window !== 'undefined') {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('moneymappr_')) {
              localStorage.removeItem(key);
            }
          });
        }

        
      }
    });
  },

  // Export mutation
  useExportPortfolio: () => {
    return useMutation({
      mutationFn: (exportData: ExportRequest) => cryptoApi.exportPortfolioData(exportData),
      onSuccess: (response) => {
        if (response.success) {
          // Trigger download or show success message
          const { downloadUrl } = response.data;
          window.open(downloadUrl, '_blank');
        }
      },
      onError: (error) => {
        console.error('Failed to export portfolio:', error);
      },
    });
  },
};

// Custom hook to invalidate all crypto queries
export const useInvalidateCryptoQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: cryptoKeys.all });
    },
    invalidateWallets: () => {
      queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
    },
    invalidatePortfolio: () => {
      queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
    },
    invalidateWallet: (walletId: string) => {
      queryClient.invalidateQueries({ queryKey: cryptoKeys.wallet(walletId) });
    },
    invalidateTransactions: () => {
      queryClient.invalidateQueries({ queryKey: cryptoKeys.transactions() });
    },
  };
};