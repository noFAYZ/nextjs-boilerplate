import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { cryptoQueries, cryptoMutations, useInvalidateCryptoQueries } from '@/lib/queries/crypto-queries';
import { cryptoApi } from '@/lib/services/crypto-api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import type { 
  CreateWalletRequest,
  UpdateWalletRequest,
  PortfolioParams,
  TransactionParams,
  NFTParams,
  SyncRequest,
  AnalyticsParams,
  ExportRequest
} from '@/lib/types/crypto';

// Wallets Hooks
export const useWallets = () => {
  const {
    wallets,
    walletsLoading,
    walletsError,
    setWallets,
    setWalletsLoading,
    setWalletsError,
  } = useCryptoStore();

  const { user, loading: authLoading } = useAuth();
  const isAuthReady = !!user && !authLoading;

  const query = useQuery({
    ...cryptoQueries.wallets(),
    enabled: isAuthReady,
  });

  // Handle success/error manually since onSuccess/onError are deprecated
  useEffect(() => {
    if (query.data) {
      setWallets(query.data);
      setWalletsError(null);
    }
    if (query.error) {
      setWalletsError((query.error as any).message);
    }
  }, [query.data, query.error, setWallets, setWalletsError]);

  // Sync loading state with store
  useEffect(() => {
    setWalletsLoading(query.isLoading);
  }, [query.isLoading, setWalletsLoading]);

  return {
    wallets,
    isLoading: walletsLoading,
    error: walletsError,
    refetch: query.refetch,
  };
};

export const useWallet = (walletId: string, timeRange = '24h') => {
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return useMemo(() => ({
      wallet: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    }), []);
  }

  const { user, loading: authLoading } = useAuth();
  const isAuthReady = !!user && !authLoading;

  // Memoize the query configuration to prevent unnecessary re-renders
  const queryConfig = useMemo(() => ({
    ...cryptoQueries.wallet(walletId, timeRange),
    enabled: isAuthReady && !!walletId,
  }), [walletId, timeRange, isAuthReady]);

  const query = useQuery(queryConfig);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    wallet: query.data,
    isLoading: query.isLoading || authLoading,
    error: query.error,
    refetch: query.refetch,
  }), [query.data, query.isLoading, query.error, query.refetch, authLoading]);
};

export const useWalletSummary = (walletId: string) => {
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      summary: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  const query = useQuery(cryptoQueries.walletSummary(walletId));

  return {
    summary: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useCreateWallet = () => {
  return cryptoMutations.useCreateWallet();
};

export const useUpdateWallet = () => {
  return cryptoMutations.useUpdateWallet();
};

export const useDeleteWallet = () => {
  return cryptoMutations.useDeleteWallet();
};

// Portfolio Hooks
export const usePortfolio = (params?: PortfolioParams) => {
  const { 
    portfolio, 
    portfolioLoading, 
    portfolioError,
    setPortfolio,
    setPortfolioLoading,
    setPortfolioError,
  } = useCryptoStore();

  const query = useQuery(cryptoQueries.portfolio(params));

  // Handle success/error manually since onSuccess/onError are deprecated
  useEffect(() => {
    if (query.data) {
      setPortfolio(query.data);
      setPortfolioError(null);
    }
    if (query.error) {
      setPortfolioError((query.error as any).message);
    }
  }, [query.data, query.error, setPortfolio, setPortfolioError]);

  // Sync loading state with store
  useEffect(() => {
    setPortfolioLoading(query.isLoading);
  }, [query.isLoading, setPortfolioLoading]);

  return {
    portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
    refetch: query.refetch,
  };
};

// Transactions Hooks
export const useTransactions = (params?: TransactionParams) => {
  const { 
    transactions, 
    transactionsLoading, 
    transactionsError,
    transactionsPagination,
    setTransactions,
    setTransactionsLoading,
    setTransactionsError,
    setTransactionsPagination,
  } = useCryptoStore();

  const query = useQuery(cryptoQueries.transactions(params));

  // Handle success/error manually since onSuccess/onError are deprecated
  useEffect(() => {
    if (query.data) {
      setTransactions(query.data.data);
      setTransactionsPagination(query.data.pagination);
      setTransactionsError(null);
    }
    if (query.error) {
      setTransactionsError((query.error as any).message);
    }
  }, [query.data, query.error, setTransactions, setTransactionsPagination, setTransactionsError]);

  // Sync loading state with store
  useEffect(() => {
    setTransactionsLoading(query.isLoading);
  }, [query.isLoading, setTransactionsLoading]);

  return {
    transactions,
    pagination: transactionsPagination,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: query.refetch,
  };
};

export const useWalletTransactions = (walletId: string, params?: TransactionParams) => {
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      transactions: [],
      pagination: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  const query = useQuery(cryptoQueries.walletTransactions(walletId, params));

  return {
    transactions: query.data?.data || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useInfiniteTransactions = (params?: Omit<TransactionParams, 'page'>) => {
  const query = useInfiniteQuery(cryptoQueries.infiniteTransactions(params));

  return {
    transactions: query.data?.transactions || [],
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// NFTs Hooks
export const useNFTs = (params?: NFTParams) => {
  const { 
    nfts, 
    nftsLoading, 
    nftsError,
    nftsPagination,
    setNfts,
    setNftsLoading,
    setNftsError,
    setNftsPagination,
  } = useCryptoStore();

  const query = useQuery(cryptoQueries.nfts(params));

  // Handle success/error manually since onSuccess/onError are deprecated
  useEffect(() => {
    if (query.data) {
      setNfts(query.data.data);
      setNftsPagination(query.data.pagination);
      setNftsError(null);
    }
    if (query.error) {
      setNftsError((query.error as any).message);
    }
  }, [query.data, query.error, setNfts, setNftsPagination, setNftsError]);

  // Sync loading state with store
  useEffect(() => {
    setNftsLoading(query.isLoading);
  }, [query.isLoading, setNftsLoading]);

  return {
    nfts,
    pagination: nftsPagination,
    isLoading: nftsLoading,
    error: nftsError,
    refetch: query.refetch,
  };
};

export const useWalletNFTs = (walletId: string, params?: NFTParams) => {
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      nfts: [],
      pagination: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  const query = useQuery(cryptoQueries.walletNfts(walletId, params));

  return {
    nfts: query.data?.data || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// DeFi Hooks
export const useDeFiPositions = () => {
  const { 
    defiPositions, 
    defiLoading, 
    defiError,
    setDefiPositions,
    setDefiLoading,
    setDefiError,
  } = useCryptoStore();

  const query = useQuery(cryptoQueries.defi());

  // Handle success/error manually since onSuccess/onError are deprecated
  useEffect(() => {
    if (query.data) {
      setDefiPositions(query.data);
      setDefiError(null);
    }
    if (query.error) {
      setDefiError((query.error as any).message);
    }
  }, [query.data, query.error, setDefiPositions, setDefiError]);

  // Sync loading state with store
  useEffect(() => {
    setDefiLoading(query.isLoading);
  }, [query.isLoading, setDefiLoading]);

  return {
    positions: defiPositions,
    isLoading: defiLoading,
    error: defiError,
    refetch: query.refetch,
  };
};

export const useWalletDeFiPositions = (walletId: string) => {
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      positions: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  const query = useQuery(cryptoQueries.walletDefi(walletId));

  return {
    positions: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// Sync Hooks
export const useSyncWallet = () => {
  return cryptoMutations.useSyncWallet();
};

export const useSyncAllWallets = () => {
  return cryptoMutations.useSyncAllWallets();
};

export const useSyncStatus = (walletId: string, jobId?: string) => {
  const { realtimeSyncStates } = useCryptoStore();

  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      syncStatus: null,
      isLoading: false,
      error: null,
    };
  }

  // Get sync status from SSE states
  const syncState = realtimeSyncStates[walletId];

  // Convert SSE sync state to legacy format for backward compatibility
  const legacySyncStatus = syncState ? {
    walletId,
    status: syncState.status === 'syncing' ||
            syncState.status === 'syncing_assets' ||
            syncState.status === 'syncing_transactions' ||
            syncState.status === 'syncing_nfts' ||
            syncState.status === 'syncing_defi' ? 'processing' :
            syncState.status === 'queued' ? 'queued' :
            syncState.status === 'completed' ? 'completed' :
            syncState.status === 'failed' ? 'failed' : 'idle',
    progress: syncState.progress,
    message: syncState.message,
    error: syncState.error,
    startedAt: syncState.startedAt,
    completedAt: syncState.completedAt,
    syncedData: syncState.syncedData
  } : null;

  return {
    syncStatus: legacySyncStatus,
    isLoading: syncState?.status === 'syncing' ||
               syncState?.status === 'syncing_assets' ||
               syncState?.status === 'syncing_transactions' ||
               syncState?.status === 'syncing_nfts' ||
               syncState?.status === 'syncing_defi' ||
               syncState?.status === 'queued',
    error: syncState?.error || null,
  };
};

// Analytics Hooks
export const useAnalytics = (params?: AnalyticsParams) => {
  const query = useQuery(cryptoQueries.analytics(params));

  return {
    analytics: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

// Export Hook
export const useExportPortfolio = () => {
  return cryptoMutations.useExportPortfolio();
};

// Combined Hooks for Complex Operations
export const useWalletWithTransactions = (walletId: string, transactionParams?: TransactionParams) => {
  const walletQuery = useWallet(walletId);
  const transactionsQuery = useWalletTransactions(walletId, transactionParams);

  return {
    wallet: walletQuery.wallet,
    transactions: transactionsQuery.transactions,
    pagination: transactionsQuery.pagination,
    isLoading: walletQuery.isLoading || transactionsQuery.isLoading,
    error: walletQuery.error || transactionsQuery.error,
    refetch: () => {
      walletQuery.refetch();
      transactionsQuery.refetch();
    },
  };
};

// Create a stable hook that minimizes re-renders using direct React Query
export const useWalletFullDataStable = (walletId: string) => {
  const { user, loading: authLoading } = useAuth();
  const hasLoggedRef = useRef(false);

  // Early returns for invalid wallet IDs
  const emptyResult = useMemo(() => ({
    wallet: null,
    transactions: null,
    nfts: null,
    defiPositions: null,
    isLoading: false,
    error: null,
    refetch: () => {},
  }), []);

  if (walletId === 'add' || !walletId) {
    return emptyResult;
  }

  // Loading result for auth not ready
  const loadingResult = useMemo(() => ({
    wallet: null,
    transactions: null,
    nfts: null,
    defiPositions: null,
    isLoading: authLoading,
    error: null,
    refetch: () => {},
  }), [authLoading]);

  if (!user || authLoading) {
    return loadingResult;
  }

  // Direct React Query call with maximum stability
  const queryConfig = useMemo(() => ({
    ...cryptoQueries.wallet(walletId),
    enabled: !!user && !authLoading && !!walletId,
  }), [walletId, user, authLoading]);

  const query = useQuery(queryConfig);


  // Stable return with memoized derived data
  return useMemo(() => {
    const wallet = query.data;
    return {
      wallet,
      transactions: wallet?.transactions?.length > 0 ? wallet.transactions : null,
      nfts: wallet?.nfts?.length > 0 ? wallet.nfts : null,
      defiPositions: wallet?.defiPositions?.length > 0 ? wallet.defiPositions : null,
      isLoading: query.isLoading || authLoading,
      error: query.error,
      refetch: query.refetch,
    };
  }, [query.data, query.isLoading, query.error, query.refetch, authLoading]);
};

let renderCount = 0;

export const useWalletFullData = (walletId: string) => {
  renderCount++;
  const currentRender = renderCount;
  const hasExecutedRef = useRef(false);

  const { user, loading: authLoading } = useAuth();

  // Create stable auth state to prevent unnecessary re-renders
  const isAuthReady = useMemo(() => !!user && !authLoading, [user, authLoading]);


  // Memoize the early return conditions to prevent unnecessary re-renders
  const shouldSkip = useMemo(() => {
    return walletId === 'add' || !walletId || !user || authLoading;
  }, [walletId, user, authLoading]);

  // Early returns with memoized objects
  if (walletId === 'add' || !walletId) {
    return useMemo(() => ({
      wallet: null,
      transactions: [],
      nfts: [],
      defiPositions: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    }), []);
  }

  if (!user || authLoading) {
    return useMemo(() => ({
      wallet: null,
      transactions: [],
      nfts: [],
      defiPositions: [],
      isLoading: authLoading,
      error: null,
      refetch: () => {},
    }), [authLoading]);
  }

  const walletQuery = useWallet(walletId);

  // Memoize derived data to prevent recalculations
  const derivedData = useMemo(() => ({
    transactions: walletQuery?.wallet?.transactions?.length > 0 ? walletQuery.wallet.transactions : null,
    nfts: walletQuery?.wallet?.nfts?.length > 0 ? walletQuery.wallet.nfts : null,
    defiPositions: walletQuery?.wallet?.defiPositions?.length > 0 ? walletQuery.wallet.defiPositions : null,
  }), [walletQuery?.wallet]);


  // Memoize the refetch function
  const refetch = useCallback(() => {
    walletQuery.refetch();
  }, [walletQuery.refetch]);

  // Memoize the final return object
  return useMemo(() => ({
    wallet: walletQuery.wallet,
    transactions: derivedData.transactions,
    nfts: derivedData.nfts,
    defiPositions: derivedData.defiPositions,
    isLoading: walletQuery.isLoading,
    error: walletQuery.error,
    refetch,
  }), [walletQuery.wallet, walletQuery.isLoading, walletQuery.error, derivedData, refetch]);
};

// Sync Management Hook
export const useSyncManager = () => {
  const { realtimeSyncStates } = useCryptoStore();
  const syncMutation = useSyncWallet();
  const syncAllMutation = useSyncAllWallets();
  const { invalidateAll } = useInvalidateCryptoQueries();

  const syncWallet = (walletId: string, syncData?: SyncRequest) => {
    return syncMutation.mutate({ walletId, syncData });
  };

  const syncAllWallets = () => {
    return syncAllMutation.mutate();
  };

  const getActiveSyncs = () => {
    return Object.entries(realtimeSyncStates).filter(([_, state]) =>
      ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
    );
  };

  const hasActiveSyncs = () => {
    return getActiveSyncs().length > 0;
  };

  return {
    realtimeSyncStates,
    syncWallet,
    syncAllWallets,
    getActiveSyncs,
    hasActiveSyncs,
    isSyncing: syncMutation.isPending || syncAllMutation.isPending,
    error: syncMutation.error || syncAllMutation.error,
    refreshAll: invalidateAll,
  };
};

// Portfolio Management Hook
export const usePortfolioManager = () => {
  const { 
    portfolioTimeRange, 
    setPortfolioTimeRange,
    viewPreferences,
    setPortfolioChartType 
  } = useCryptoStore();
  
  const portfolio = usePortfolio({ timeRange: portfolioTimeRange });
  const analytics = useAnalytics({ timeRange: portfolioTimeRange });

  const changeTimeRange = (timeRange: typeof portfolioTimeRange) => {
    setPortfolioTimeRange(timeRange);
  };

  const changeChartType = (chartType: typeof viewPreferences.portfolioChartType) => {
    setPortfolioChartType(chartType);
  };

  return {
    ...portfolio,
    analytics: analytics.analytics,
    timeRange: portfolioTimeRange,
    chartType: viewPreferences.portfolioChartType,
    changeTimeRange,
    changeChartType,
  };
};

// Filter Management Hook
export const useFilterManager = () => {
  const {
    filters,
    setNetworkFilter,
    setWalletTypeFilter,
    setTransactionTypeFilter,
    setDateRangeFilter,
    clearFilters,
  } = useCryptoStore();

  return {
    filters,
    setNetworkFilter,
    setWalletTypeFilter,
    setTransactionTypeFilter,
    setDateRangeFilter,
    clearFilters,
    hasActiveFilters: () => {
      return filters.networks.length > 0 ||
             filters.walletTypes.length > 0 ||
             filters.transactionTypes.length > 0 ||
             filters.dateRange.from !== null ||
             filters.dateRange.to !== null;
    },
  };
};

// View Preferences Hook
export const useViewPreferences = () => {
  const {
    viewPreferences,
    setWalletsView,
    setTransactionsView,
    toggleShowTestnets,
    toggleHideDustAssets,
    setDustThreshold,
  } = useCryptoStore();

  return {
    preferences: viewPreferences,
    setWalletsView,
    setTransactionsView,
    toggleShowTestnets,
    toggleHideDustAssets,
    setDustThreshold,
  };
};