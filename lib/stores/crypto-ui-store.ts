/**
 * Crypto UI Store
 *
 * PURPOSE: Manages UI-only state for crypto features
 * - Filters, view preferences, selections
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): filters, selected items, view modes
 * ❌ Server Data (TanStack Query): wallets, transactions, portfolio
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { NetworkType, WalletType } from '@/lib/types/crypto';

// ============================================================================
// STATE TYPES
// ============================================================================

interface CryptoUIState {
  // Selection State
  selectedWalletId: string | null;

  // Filter State
  filters: {
    networks: NetworkType[];
    walletTypes: WalletType[];
    transactionTypes: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
    searchQuery: string;
  };

  // View Preferences (persistent)
  viewPreferences: {
    walletsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    portfolioChartType: 'area' | 'line' | 'bar';
    portfolioTimeRange: '1h' | '24h' | '7d' | '30d' | '1y';
    showTestnets: boolean;
    hideDustAssets: boolean;
    dustThreshold: number; // in USD
  };

  // UI State (non-persistent)
  ui: {
    // Modal states
    isCreateWalletModalOpen: boolean;
    isEditWalletModalOpen: boolean;
    isDeleteWalletModalOpen: boolean;
    isSyncModalOpen: boolean;

    // Panel states
    isFiltersPanelOpen: boolean;
    isDetailsPanelOpen: boolean;

    // Active tabs
    activeTab: 'overview' | 'transactions' | 'nfts' | 'defi';
  };
}

interface CryptoUIActions {
  // Selection Actions
  selectWallet: (walletId: string | null) => void;

  // Filter Actions
  setNetworkFilter: (networks: NetworkType[]) => void;
  setWalletTypeFilter: (types: WalletType[]) => void;
  setTransactionTypeFilter: (types: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // View Preference Actions
  setWalletsView: (view: 'grid' | 'list') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  setPortfolioChartType: (type: 'area' | 'line' | 'bar') => void;
  setPortfolioTimeRange: (range: '1h' | '24h' | '7d' | '30d' | '1y') => void;
  toggleShowTestnets: () => void;
  toggleHideDustAssets: () => void;
  setDustThreshold: (threshold: number) => void;

  // UI Actions
  openCreateWalletModal: () => void;
  closeCreateWalletModal: () => void;
  openEditWalletModal: () => void;
  closeEditWalletModal: () => void;
  openDeleteWalletModal: () => void;
  closeDeleteWalletModal: () => void;
  openSyncModal: () => void;
  closeSyncModal: () => void;
  toggleFiltersPanel: () => void;
  toggleDetailsPanel: () => void;
  setActiveTab: (tab: CryptoUIState['ui']['activeTab']) => void;

  // Utility Actions
  resetUIState: () => void;
  resetFilters: () => void;
  resetPreferences: () => void;
}

type CryptoUIStore = CryptoUIState & CryptoUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: CryptoUIState = {
  // Selection
  selectedWalletId: null,

  // Filters
  filters: {
    networks: [],
    walletTypes: [],
    transactionTypes: [],
    dateRange: {
      from: null,
      to: null,
    },
    searchQuery: '',
  },

  // View Preferences (persistent)
  viewPreferences: {
    walletsView: 'list',
    transactionsView: 'detailed',
    portfolioChartType: 'area',
    portfolioTimeRange: '7d',
    showTestnets: false,
    hideDustAssets: true,
    dustThreshold: 1.0, // $1 USD
  },

  // UI State (non-persistent)
  ui: {
    isCreateWalletModalOpen: false,
    isEditWalletModalOpen: false,
    isDeleteWalletModalOpen: false,
    isSyncModalOpen: false,
    isFiltersPanelOpen: false,
    isDetailsPanelOpen: false,
    activeTab: 'overview',
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useCryptoUIStore = create<CryptoUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ================================================================
        // SELECTION ACTIONS
        // ================================================================
        selectWallet: (walletId) =>
          set((state) => {
            state.selectedWalletId = walletId;
          }, false, 'crypto-ui/selectWallet'),

        // ================================================================
        // FILTER ACTIONS
        // ================================================================
        setNetworkFilter: (networks) =>
          set((state) => {
            state.filters.networks = networks;
          }, false, 'crypto-ui/setNetworkFilter'),

        setWalletTypeFilter: (types) =>
          set((state) => {
            state.filters.walletTypes = types;
          }, false, 'crypto-ui/setWalletTypeFilter'),

        setTransactionTypeFilter: (types) =>
          set((state) => {
            state.filters.transactionTypes = types;
          }, false, 'crypto-ui/setTransactionTypeFilter'),

        setDateRangeFilter: (from, to) =>
          set((state) => {
            state.filters.dateRange.from = from;
            state.filters.dateRange.to = to;
          }, false, 'crypto-ui/setDateRangeFilter'),

        setSearchQuery: (query) =>
          set((state) => {
            state.filters.searchQuery = query;
          }, false, 'crypto-ui/setSearchQuery'),

        clearFilters: () =>
          set((state) => {
            state.filters = {
              networks: [],
              walletTypes: [],
              transactionTypes: [],
              dateRange: { from: null, to: null },
              searchQuery: '',
            };
          }, false, 'crypto-ui/clearFilters'),

        // ================================================================
        // VIEW PREFERENCE ACTIONS
        // ================================================================
        setWalletsView: (view) =>
          set((state) => {
            state.viewPreferences.walletsView = view;
          }, false, 'crypto-ui/setWalletsView'),

        setTransactionsView: (view) =>
          set((state) => {
            state.viewPreferences.transactionsView = view;
          }, false, 'crypto-ui/setTransactionsView'),

        setPortfolioChartType: (type) =>
          set((state) => {
            state.viewPreferences.portfolioChartType = type;
          }, false, 'crypto-ui/setPortfolioChartType'),

        setPortfolioTimeRange: (range) =>
          set((state) => {
            state.viewPreferences.portfolioTimeRange = range;
          }, false, 'crypto-ui/setPortfolioTimeRange'),

        toggleShowTestnets: () =>
          set((state) => {
            state.viewPreferences.showTestnets = !state.viewPreferences.showTestnets;
          }, false, 'crypto-ui/toggleShowTestnets'),

        toggleHideDustAssets: () =>
          set((state) => {
            state.viewPreferences.hideDustAssets = !state.viewPreferences.hideDustAssets;
          }, false, 'crypto-ui/toggleHideDustAssets'),

        setDustThreshold: (threshold) =>
          set((state) => {
            state.viewPreferences.dustThreshold = threshold;
          }, false, 'crypto-ui/setDustThreshold'),

        // ================================================================
        // UI ACTIONS
        // ================================================================
        openCreateWalletModal: () =>
          set((state) => {
            state.ui.isCreateWalletModalOpen = true;
          }, false, 'crypto-ui/openCreateWalletModal'),

        closeCreateWalletModal: () =>
          set((state) => {
            state.ui.isCreateWalletModalOpen = false;
          }, false, 'crypto-ui/closeCreateWalletModal'),

        openEditWalletModal: () =>
          set((state) => {
            state.ui.isEditWalletModalOpen = true;
          }, false, 'crypto-ui/openEditWalletModal'),

        closeEditWalletModal: () =>
          set((state) => {
            state.ui.isEditWalletModalOpen = false;
          }, false, 'crypto-ui/closeEditWalletModal'),

        openDeleteWalletModal: () =>
          set((state) => {
            state.ui.isDeleteWalletModalOpen = true;
          }, false, 'crypto-ui/openDeleteWalletModal'),

        closeDeleteWalletModal: () =>
          set((state) => {
            state.ui.isDeleteWalletModalOpen = false;
          }, false, 'crypto-ui/closeDeleteWalletModal'),

        openSyncModal: () =>
          set((state) => {
            state.ui.isSyncModalOpen = true;
          }, false, 'crypto-ui/openSyncModal'),

        closeSyncModal: () =>
          set((state) => {
            state.ui.isSyncModalOpen = false;
          }, false, 'crypto-ui/closeSyncModal'),

        toggleFiltersPanel: () =>
          set((state) => {
            state.ui.isFiltersPanelOpen = !state.ui.isFiltersPanelOpen;
          }, false, 'crypto-ui/toggleFiltersPanel'),

        toggleDetailsPanel: () =>
          set((state) => {
            state.ui.isDetailsPanelOpen = !state.ui.isDetailsPanelOpen;
          }, false, 'crypto-ui/toggleDetailsPanel'),

        setActiveTab: (tab) =>
          set((state) => {
            state.ui.activeTab = tab;
          }, false, 'crypto-ui/setActiveTab'),

        // ================================================================
        // UTILITY ACTIONS
        // ================================================================
        resetUIState: () =>
          set((state) => {
            state.ui = initialState.ui;
          }, false, 'crypto-ui/resetUIState'),

        resetFilters: () =>
          set((state) => {
            state.filters = initialState.filters;
          }, false, 'crypto-ui/resetFilters'),

        resetPreferences: () =>
          set((state) => {
            state.viewPreferences = initialState.viewPreferences;
          }, false, 'crypto-ui/resetPreferences'),
      })),
      {
        name: 'moneymappr-crypto-ui',
        // Only persist preferences, not UI state or selections
        partialize: (state) => ({
          viewPreferences: state.viewPreferences,
        }),
      }
    ),
    {
      name: 'CryptoUIStore',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

// Memoized selectors for performance
export const cryptoUISelectors = {
  selectedWalletId: (state: CryptoUIStore) => state.selectedWalletId,
  filters: (state: CryptoUIStore) => state.filters,
  viewPreferences: (state: CryptoUIStore) => state.viewPreferences,
  ui: (state: CryptoUIStore) => state.ui,

  // Derived selectors
  hasActiveFilters: (state: CryptoUIStore) => {
    const { filters } = state;
    return (
      filters.networks.length > 0 ||
      filters.walletTypes.length > 0 ||
      filters.transactionTypes.length > 0 ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null ||
      filters.searchQuery.length > 0
    );
  },

  isAnyModalOpen: (state: CryptoUIStore) => {
    const { ui } = state;
    return (
      ui.isCreateWalletModalOpen ||
      ui.isEditWalletModalOpen ||
      ui.isDeleteWalletModalOpen ||
      ui.isSyncModalOpen
    );
  },
};
