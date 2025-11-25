import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  NetworkType,
  WalletType
} from '@/lib/types/crypto';

interface CryptoState {
  // UI Selection State
  selectedWalletId: string | null;

  // Real-time sync state (UI progress tracking)
  realtimeSyncStates: Record<string, {
    progress: number;
    status: 'queued' | 'syncing' | 'syncing_assets' | 'syncing_transactions' | 'syncing_nfts' | 'syncing_defi' | 'completed' | 'failed';
    message?: string;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
    syncedData?: string[];
  }>;
  realtimeSyncConnected: boolean;
  realtimeSyncError: string | null;

  // Filters (UI state)
  filters: {
    networks: NetworkType[];
    walletTypes: WalletType[];
    transactionTypes: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };

  // View preferences (UI state)
  viewPreferences: {
    walletsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    portfolioChartType: 'area' | 'line' | 'bar';
    portfolioTimeRange: '1h' | '24h' | '7d' | '30d' | '1y';
    showTestnets: boolean;
    hideDustAssets: boolean;
    dustThreshold: number;
  };
}

interface CryptoActions {
  // Selection actions (UI state)
  selectWallet: (walletId: string | null) => void;

  // Real-time sync actions (UI progress tracking)
  setRealtimeSyncState: (walletId: string, state: CryptoState['realtimeSyncStates'][string]) => void;
  updateRealtimeSyncProgress: (walletId: string, progress: number, status: CryptoState['realtimeSyncStates'][string]['status'], message?: string) => void;
  completeRealtimeSync: (walletId: string, syncedData?: string[]) => void;
  failRealtimeSync: (walletId: string, error: string) => void;
  clearRealtimeSyncState: (walletId: string) => void;
  clearAllRealtimeSyncStates: () => void;
  cleanupStuckSyncs: () => void;
  setRealtimeSyncConnected: (connected: boolean) => void;
  setRealtimeSyncError: (error: string | null) => void;

  // Filter actions (UI state)
  setNetworkFilter: (networks: NetworkType[]) => void;
  setWalletTypeFilter: (types: WalletType[]) => void;
  setTransactionTypeFilter: (types: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  clearFilters: () => void;

  // View preference actions (UI state)
  setWalletsView: (view: 'grid' | 'list') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  setPortfolioChartType: (type: 'area' | 'line' | 'bar') => void;
  setPortfolioTimeRange: (timeRange: '1h' | '24h' | '7d' | '30d' | '1y') => void;
  toggleShowTestnets: () => void;
  toggleHideDustAssets: () => void;
  setDustThreshold: (threshold: number) => void;

  // Utility actions
  resetState: () => void;
}

type CryptoStore = CryptoState & CryptoActions;

const initialState: CryptoState = {
  // UI Selection State
  selectedWalletId: null,

  // Real-time sync state (UI progress tracking)
  realtimeSyncStates: {},
  realtimeSyncConnected: false,
  realtimeSyncError: null,

  // Filters (UI state)
  filters: {
    networks: [],
    walletTypes: [],
    transactionTypes: [],
    dateRange: {
      from: null,
      to: null,
    },
  },

  // View preferences (UI state)
  viewPreferences: {
    walletsView: 'list',
    transactionsView: 'detailed',
    portfolioChartType: 'area',
    portfolioTimeRange: '7d',
    showTestnets: false,
    hideDustAssets: true,
    dustThreshold: 1.0, // $1 USD
  },
};

export const useCryptoStore = create<CryptoStore>()(
  devtools(
    immer((set) => ({
      ...initialState,

      // Selection actions (UI state)
      selectWallet: (walletId) =>
        set((state) => {
          state.selectedWalletId = walletId;
        }, false, 'selectWallet'),


      // Real-time sync actions
      setRealtimeSyncState: (walletId, syncState) =>
        set((state) => {
          state.realtimeSyncStates[walletId] = syncState;
        }, false, 'setRealtimeSyncState'),

      updateRealtimeSyncProgress: (walletId, progress, status, message) =>
        set((state) => {
          if (!state.realtimeSyncStates[walletId]) {
            state.realtimeSyncStates[walletId] = {
              progress: 0,
              status: 'queued'
            };
          }
          state.realtimeSyncStates[walletId].progress = progress;
          state.realtimeSyncStates[walletId].status = status;
          if (message) {
            state.realtimeSyncStates[walletId].message = message;
          }
          if (status === 'syncing' && !state.realtimeSyncStates[walletId].startedAt) {
            state.realtimeSyncStates[walletId].startedAt = new Date();
          }
        }, false, 'updateRealtimeSyncProgress'),

      completeRealtimeSync: (walletId, syncedData) =>
        set((state) => {
          if (state.realtimeSyncStates[walletId]) {
            state.realtimeSyncStates[walletId].progress = 100;
            state.realtimeSyncStates[walletId].status = 'completed';
            state.realtimeSyncStates[walletId].completedAt = new Date();
            if (syncedData) {
              state.realtimeSyncStates[walletId].syncedData = syncedData;
            }
          }

          // Auto-cleanup completed sync state after 5 seconds
          // This prevents the UI from showing "completed" as still active
          setTimeout(() => {
            useCryptoStore.setState((s) => {
              if (s.realtimeSyncStates[walletId]?.status === 'completed') {
                delete s.realtimeSyncStates[walletId];
              }
            });
          }, 5000);
        }, false, 'completeRealtimeSync'),

      failRealtimeSync: (walletId, error) =>
        set((state) => {
          if (state.realtimeSyncStates[walletId]) {
            state.realtimeSyncStates[walletId].status = 'failed';
            state.realtimeSyncStates[walletId].error = error;
            state.realtimeSyncStates[walletId].completedAt = new Date();
          }

          // Auto-cleanup failed sync state after 5 seconds
          // This prevents the UI from showing "failed" as still active
          setTimeout(() => {
            useCryptoStore.setState((s) => {
              if (s.realtimeSyncStates[walletId]?.status === 'failed') {
                delete s.realtimeSyncStates[walletId];
              }
            });
          }, 5000);
        }, false, 'failRealtimeSync'),

      clearRealtimeSyncState: (walletId) =>
        set((state) => {
          delete state.realtimeSyncStates[walletId];
        }, false, 'clearRealtimeSyncState'),

      clearAllRealtimeSyncStates: () =>
        set((state) => {
          state.realtimeSyncStates = {};
        }, false, 'clearAllRealtimeSyncStates'),

      cleanupStuckSyncs: () =>
        set((state) => {
          const now = Date.now();
          const twoMinutesMs = 2 * 60 * 1000;

          Object.keys(state.realtimeSyncStates).forEach(walletId => {
            const syncState = state.realtimeSyncStates[walletId];
            if (syncState.startedAt) {
              const elapsedMs = now - new Date(syncState.startedAt).getTime();
              // Remove any sync stuck for more than 2 minutes in active status
              if (
                elapsedMs > twoMinutesMs &&
                ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(syncState.status as any)
              ) {
                console.warn(`[Crypto Store] Removing stuck sync for ${walletId} (${Math.round(elapsedMs / 1000)}s old, status: ${syncState.status})`);
                delete state.realtimeSyncStates[walletId];
              }
            }
          });
        }, false, 'cleanupStuckSyncs'),

      setRealtimeSyncConnected: (connected) =>
        set((state) => {
          state.realtimeSyncConnected = connected;
          if (connected) {
            state.realtimeSyncError = null;
          }
        }, false, 'setRealtimeSyncConnected'),

      setRealtimeSyncError: (error) =>
        set((state) => {
          state.realtimeSyncError = error;
          if (error) {
            state.realtimeSyncConnected = false;
          }
        }, false, 'setRealtimeSyncError'),

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

      setPortfolioTimeRange: (timeRange) =>
        set((state) => {
          state.viewPreferences.portfolioTimeRange = timeRange;
        }, false, 'setPortfolioTimeRange'),

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
    })),
    {
      name: 'crypto-store',
    }
  )
);

// Selectors
export const selectActiveRealtimeSyncCount = (state: CryptoStore) => {
  return Object.values(state.realtimeSyncStates).filter(
    (syncState) => syncState.status === 'syncing' ||
                   syncState.status === 'syncing_assets' ||
                   syncState.status === 'syncing_transactions' ||
                   syncState.status === 'syncing_nfts' ||
                   syncState.status === 'syncing_defi' ||
                   syncState.status === 'queued'
  ).length;
};

export const selectWalletSyncState = (state: CryptoStore, walletId: string) => {
  return state.realtimeSyncStates[walletId];
};