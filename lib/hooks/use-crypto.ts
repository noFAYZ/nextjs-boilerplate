import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { cryptoQueries, cryptoMutations, useInvalidateCryptoQueries } from '@/lib/queries/crypto-queries';
import { cryptoApi } from '@/lib/services/crypto-api';
import { useEffect } from 'react';
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

  const query = useQuery(cryptoQueries.wallets());

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
    return {
      wallet: null,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  const query = useQuery(cryptoQueries.wallet(walletId, timeRange));

  return {
    wallet: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
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
  const { setSyncStatus, removeSyncStatus, syncStatuses } = useCryptoStore();
  
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      syncStatus: null,
      isLoading: false,
      error: null,
    };
  }
  
  // Check if we have an active sync in the store
  const hasActiveSyncInStore = syncStatuses[walletId] && 
    (syncStatuses[walletId].status === 'processing' || syncStatuses[walletId].status === 'queued');

  // Only enable the query if we have an active sync or if we're specifically checking a job
  // Also check that we're on a wallet-specific page (not add page or main wallets page)
  const isOnWalletPage = typeof window !== 'undefined' && 
    window.location.pathname.includes('/wallet/') && 
    !window.location.pathname.includes('/add');
  
  const shouldQuery = (!!jobId || hasActiveSyncInStore) && isOnWalletPage;

  const query = useQuery({
    ...cryptoQueries.syncStatus(walletId, jobId),
    enabled: !!walletId && shouldQuery,
  });

  // Handle success manually since onSuccess is deprecated
  useEffect(() => {
    if (query.data) {
      setSyncStatus(walletId, query.data);
      
      // Remove from store when completed or failed
      if (query.data.status === 'completed' || query.data.status === 'failed') {
        setTimeout(() => {
          removeSyncStatus(walletId);
        }, 5000); // Keep for 5 seconds for user feedback
      }
    }
  }, [query.data, walletId, setSyncStatus, removeSyncStatus]);

  // Cleanup effect - remove sync status when component unmounts or page changes
  useEffect(() => {
    return () => {
      if (!isOnWalletPage) {
        removeSyncStatus(walletId);
      }
    };
  }, [isOnWalletPage, walletId, removeSyncStatus]);

  return {
    syncStatus: query.data || syncStatuses[walletId],
    isLoading: query.isLoading,
    error: query.error,
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

export const useWalletFullData = (walletId: string) => {
  // Don't run if walletId is "add" (from the add wallet route)
  if (walletId === 'add' || !walletId) {
    return {
      wallet: null,
      transactions: [],
      nfts: [],
      defiPositions: [],
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }
  
  const walletQuery = useWallet(walletId);
  const transactionsQuery = useWalletTransactions(walletId, { limit: 10 });
  const nftsQuery = useWalletNFTs(walletId, { limit: 10 });
  const defiQuery = useWalletDeFiPositions(walletId);

  console.log('useWalletFullData', nftsQuery.nfts);

  return {
    wallet: walletQuery.wallet,
    transactions: transactionsQuery.transactions,
    nfts: nftsQuery.nfts,
    defiPositions: defiQuery.positions,
    isLoading: walletQuery.isLoading || transactionsQuery.isLoading || 
               nftsQuery.isLoading || defiQuery.isLoading,
    error: walletQuery.error || transactionsQuery.error || 
           nftsQuery.error || defiQuery.error,
    refetch: () => {
      walletQuery.refetch();
      transactionsQuery.refetch();
      nftsQuery.refetch();
      defiQuery.refetch();
    },
  };
};

// Sync Management Hook
export const useSyncManager = () => {
  const { syncStatuses } = useCryptoStore();
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
    return Object.entries(syncStatuses).filter(([_, status]) => 
      status.status === 'processing' || status.status === 'queued'
    );
  };

  const hasActiveSyncs = () => {
    return getActiveSyncs().length > 0;
  };

  return {
    syncStatuses,
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