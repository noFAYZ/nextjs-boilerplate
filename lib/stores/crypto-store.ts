import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  CryptoWallet, 
  PortfolioData, 
  CryptoTransaction, 
  CryptoNFT, 
  DeFiPosition,
  SyncJobStatus,
  NetworkType,
  WalletType 
} from '@/lib/types/crypto';

interface CryptoState {
  // Wallets
  wallets: CryptoWallet[];
  selectedWallet: CryptoWallet | null;
  walletsLoading: boolean;
  walletsError: string | null;

  // Portfolio
  portfolio: PortfolioData | null;
  portfolioLoading: boolean;
  portfolioError: string | null;
  portfolioTimeRange: '1h' | '24h' | '7d' | '30d' | '1y';

  // Transactions
  transactions: CryptoTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  // NFTs
  nfts: CryptoNFT[];
  nftsLoading: boolean;
  nftsError: string | null;
  nftsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  // DeFi
  defiPositions: DeFiPosition[];
  defiLoading: boolean;
  defiError: string | null;

  // Sync status
  syncStatuses: Record<string, SyncJobStatus>;

  // Filters and UI state
  filters: {
    networks: NetworkType[];
    walletTypes: WalletType[];
    transactionTypes: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };

  // View preferences
  viewPreferences: {
    walletsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    portfolioChartType: 'area' | 'line' | 'bar';
    showTestnets: boolean;
    hideDustAssets: boolean;
    dustThreshold: number;
  };
}

interface CryptoActions {
  // Wallet actions
  setWallets: (wallets: CryptoWallet[]) => void;
  addWallet: (wallet: CryptoWallet) => void;
  updateWallet: (id: string, updates: Partial<CryptoWallet>) => void;
  removeWallet: (id: string) => void;
  selectWallet: (wallet: CryptoWallet | null) => void;
  setWalletsLoading: (loading: boolean) => void;
  setWalletsError: (error: string | null) => void;

  // Portfolio actions
  setPortfolio: (portfolio: PortfolioData) => void;
  setPortfolioLoading: (loading: boolean) => void;
  setPortfolioError: (error: string | null) => void;
  setPortfolioTimeRange: (timeRange: '1h' | '24h' | '7d' | '30d' | '1y') => void;

  // Transaction actions
  setTransactions: (transactions: CryptoTransaction[]) => void;
  addTransaction: (transaction: CryptoTransaction) => void;
  updateTransaction: (id: string, updates: Partial<CryptoTransaction>) => void;
  setTransactionsLoading: (loading: boolean) => void;
  setTransactionsError: (error: string | null) => void;
  setTransactionsPagination: (pagination: CryptoState['transactionsPagination']) => void;

  // NFT actions
  setNfts: (nfts: CryptoNFT[]) => void;
  addNft: (nft: CryptoNFT) => void;
  setNftsLoading: (loading: boolean) => void;
  setNftsError: (error: string | null) => void;
  setNftsPagination: (pagination: CryptoState['nftsPagination']) => void;

  // DeFi actions
  setDefiPositions: (positions: DeFiPosition[]) => void;
  addDefiPosition: (position: DeFiPosition) => void;
  updateDefiPosition: (id: string, updates: Partial<DeFiPosition>) => void;
  setDefiLoading: (loading: boolean) => void;
  setDefiError: (error: string | null) => void;

  // Sync actions
  setSyncStatus: (walletId: string, status: SyncJobStatus) => void;
  removeSyncStatus: (walletId: string) => void;

  // Filter actions
  setNetworkFilter: (networks: NetworkType[]) => void;
  setWalletTypeFilter: (types: WalletType[]) => void;
  setTransactionTypeFilter: (types: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  clearFilters: () => void;

  // View preference actions
  setWalletsView: (view: 'grid' | 'list') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  setPortfolioChartType: (type: 'area' | 'line' | 'bar') => void;
  toggleShowTestnets: () => void;
  toggleHideDustAssets: () => void;
  setDustThreshold: (threshold: number) => void;

  // Utility actions
  resetState: () => void;
  clearErrors: () => void;
}

type CryptoStore = CryptoState & CryptoActions;

const initialState: CryptoState = {
  // Wallets
  wallets: [],
  selectedWallet: null,
  walletsLoading: false,
  walletsError: null,

  // Portfolio
  portfolio: null,
  portfolioLoading: false,
  portfolioError: null,
  portfolioTimeRange: '7d',

  // Transactions
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionsPagination: null,

  // NFTs
  nfts: [],
  nftsLoading: false,
  nftsError: null,
  nftsPagination: null,

  // DeFi
  defiPositions: [],
  defiLoading: false,
  defiError: null,

  // Sync status
  syncStatuses: {},

  // Filters
  filters: {
    networks: [],
    walletTypes: [],
    transactionTypes: [],
    dateRange: {
      from: null,
      to: null,
    },
  },

  // View preferences
  viewPreferences: {
    walletsView: 'list',
    transactionsView: 'detailed',
    portfolioChartType: 'area',
    showTestnets: false,
    hideDustAssets: true,
    dustThreshold: 1.0, // $1 USD
  },
};

export const useCryptoStore = create<CryptoStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Wallet actions
      setWallets: (wallets) =>
        set((state) => {
          state.wallets = wallets;
        }, false, 'setWallets'),

      addWallet: (wallet) =>
        set((state) => {
          state.wallets.push(wallet);
        }, false, 'addWallet'),

      updateWallet: (id, updates) =>
        set((state) => {
          const index = state.wallets.findIndex((w) => w.id === id);
          if (index !== -1) {
            Object.assign(state.wallets[index], updates);
          }
        }, false, 'updateWallet'),

      removeWallet: (id) =>
        set((state) => {
          state.wallets = state.wallets.filter((w) => w.id !== id);
          if (state.selectedWallet?.id === id) {
            state.selectedWallet = null;
          }
        }, false, 'removeWallet'),

      selectWallet: (wallet) =>
        set((state) => {
          state.selectedWallet = wallet;
        }, false, 'selectWallet'),

      setWalletsLoading: (loading) =>
        set((state) => {
          state.walletsLoading = loading;
        }, false, 'setWalletsLoading'),

      setWalletsError: (error) =>
        set((state) => {
          state.walletsError = error;
        }, false, 'setWalletsError'),

      // Portfolio actions
      setPortfolio: (portfolio) =>
        set((state) => {
          state.portfolio = portfolio;
        }, false, 'setPortfolio'),

      setPortfolioLoading: (loading) =>
        set((state) => {
          state.portfolioLoading = loading;
        }, false, 'setPortfolioLoading'),

      setPortfolioError: (error) =>
        set((state) => {
          state.portfolioError = error;
        }, false, 'setPortfolioError'),

      setPortfolioTimeRange: (timeRange) =>
        set((state) => {
          state.portfolioTimeRange = timeRange;
        }, false, 'setPortfolioTimeRange'),

      // Transaction actions
      setTransactions: (transactions) =>
        set((state) => {
          state.transactions = transactions;
        }, false, 'setTransactions'),

      addTransaction: (transaction) =>
        set((state) => {
          state.transactions.unshift(transaction);
        }, false, 'addTransaction'),

      updateTransaction: (id, updates) =>
        set((state) => {
          const index = state.transactions.findIndex((t) => t.id === id);
          if (index !== -1) {
            Object.assign(state.transactions[index], updates);
          }
        }, false, 'updateTransaction'),

      setTransactionsLoading: (loading) =>
        set((state) => {
          state.transactionsLoading = loading;
        }, false, 'setTransactionsLoading'),

      setTransactionsError: (error) =>
        set((state) => {
          state.transactionsError = error;
        }, false, 'setTransactionsError'),

      setTransactionsPagination: (pagination) =>
        set((state) => {
          state.transactionsPagination = pagination;
        }, false, 'setTransactionsPagination'),

      // NFT actions
      setNfts: (nfts) =>
        set((state) => {
          state.nfts = nfts;
        }, false, 'setNfts'),

      addNft: (nft) =>
        set((state) => {
          state.nfts.push(nft);
        }, false, 'addNft'),

      setNftsLoading: (loading) =>
        set((state) => {
          state.nftsLoading = loading;
        }, false, 'setNftsLoading'),

      setNftsError: (error) =>
        set((state) => {
          state.nftsError = error;
        }, false, 'setNftsError'),

      setNftsPagination: (pagination) =>
        set((state) => {
          state.nftsPagination = pagination;
        }, false, 'setNftsPagination'),

      // DeFi actions
      setDefiPositions: (positions) =>
        set((state) => {
          state.defiPositions = positions;
        }, false, 'setDefiPositions'),

      addDefiPosition: (position) =>
        set((state) => {
          state.defiPositions.push(position);
        }, false, 'addDefiPosition'),

      updateDefiPosition: (id, updates) =>
        set((state) => {
          const index = state.defiPositions.findIndex((p) => p.id === id);
          if (index !== -1) {
            Object.assign(state.defiPositions[index], updates);
          }
        }, false, 'updateDefiPosition'),

      setDefiLoading: (loading) =>
        set((state) => {
          state.defiLoading = loading;
        }, false, 'setDefiLoading'),

      setDefiError: (error) =>
        set((state) => {
          state.defiError = error;
        }, false, 'setDefiError'),

      // Sync actions
      setSyncStatus: (walletId, status) =>
        set((state) => {
          state.syncStatuses[walletId] = status;
        }, false, 'setSyncStatus'),

      removeSyncStatus: (walletId) =>
        set((state) => {
          delete state.syncStatuses[walletId];
        }, false, 'removeSyncStatus'),

      // Filter actions
      setNetworkFilter: (networks) =>
        set((state) => {
          state.filters.networks = networks;
        }, false, 'setNetworkFilter'),

      setWalletTypeFilter: (types) =>
        set((state) => {
          state.filters.walletTypes = types;
        }, false, 'setWalletTypeFilter'),

      setTransactionTypeFilter: (types) =>
        set((state) => {
          state.filters.transactionTypes = types;
        }, false, 'setTransactionTypeFilter'),

      setDateRangeFilter: (from, to) =>
        set((state) => {
          state.filters.dateRange.from = from;
          state.filters.dateRange.to = to;
        }, false, 'setDateRangeFilter'),

      clearFilters: () =>
        set((state) => {
          state.filters = {
            networks: [],
            walletTypes: [],
            transactionTypes: [],
            dateRange: { from: null, to: null },
          };
        }, false, 'clearFilters'),

      // View preference actions
      setWalletsView: (view) =>
        set((state) => {
          state.viewPreferences.walletsView = view;
        }, false, 'setWalletsView'),

      setTransactionsView: (view) =>
        set((state) => {
          state.viewPreferences.transactionsView = view;
        }, false, 'setTransactionsView'),

      setPortfolioChartType: (type) =>
        set((state) => {
          state.viewPreferences.portfolioChartType = type;
        }, false, 'setPortfolioChartType'),

      toggleShowTestnets: () =>
        set((state) => {
          state.viewPreferences.showTestnets = !state.viewPreferences.showTestnets;
        }, false, 'toggleShowTestnets'),

      toggleHideDustAssets: () =>
        set((state) => {
          state.viewPreferences.hideDustAssets = !state.viewPreferences.hideDustAssets;
        }, false, 'toggleHideDustAssets'),

      setDustThreshold: (threshold) =>
        set((state) => {
          state.viewPreferences.dustThreshold = threshold;
        }, false, 'setDustThreshold'),

      // Utility actions
      resetState: () =>
        set((state) => {
          Object.assign(state, initialState);
        }, false, 'resetState'),

      clearErrors: () =>
        set((state) => {
          state.walletsError = null;
          state.portfolioError = null;
          state.transactionsError = null;
          state.nftsError = null;
          state.defiError = null;
        }, false, 'clearErrors'),
    })),
    {
      name: 'crypto-store',
    }
  )
);

// Simple selectors - use with useMemo in components for better performance
export const selectFilteredWallets = (state: CryptoStore) => {
  const { wallets, filters, viewPreferences } = state;
  
  return wallets.filter((wallet) => {
    // Filter by networks
    if (filters.networks.length > 0 && !filters.networks.includes(wallet.network)) {
      return false;
    }
    
    // Filter by wallet types
    if (filters.walletTypes.length > 0 && !filters.walletTypes.includes(wallet.type)) {
      return false;
    }
    
    // Hide testnets if preference is set
    if (!viewPreferences.showTestnets && isTestnet(wallet.network)) {
      return false;
    }
    
    // Hide dust assets if preference is set
    if (viewPreferences.hideDustAssets && 
        parseFloat(wallet.totalBalanceUsd) < viewPreferences.dustThreshold) {
      return false;
    }
    
    return true;
  });
};

export const selectTotalPortfolioValue = (state: CryptoStore) => {
  return state.portfolio?.totalValueUsd || 0;
};

export const selectActiveSyncCount = (state: CryptoStore) => {
  return Object.values(state.syncStatuses).filter(
    (status) => status.status === 'processing' || status.status === 'queued'
  ).length;
};

// Helper function to check if network is testnet
function isTestnet(network: NetworkType): boolean {
  const testnets: NetworkType[] = []; // Add testnet networks as they're added to the API
  return testnets.includes(network);
}