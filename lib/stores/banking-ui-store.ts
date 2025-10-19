/**
 * Banking UI Store
 *
 * PURPOSE: Manages UI-only state for banking features
 * - Filters, view preferences, selections
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): filters, selected items, view modes
 * ❌ Server Data (TanStack Query): accounts, transactions, analytics
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// STATE TYPES
// ============================================================================

interface BankingUIState {
  // Selection State
  selectedAccountId: string | null;
  selectedEnrollmentId: string | null;

  // Filter State
  filters: {
    accountTypes: string[]; // 'checking', 'savings', 'credit', etc.
    institutions: string[];
    transactionCategories: string[];
    transactionTypes: string[]; // 'debit', 'credit'
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
    amountRange: {
      min: number | null;
      max: number | null;
    };
    searchQuery: string;
  };

  // View Preferences (persistent)
  viewPreferences: {
    accountsView: 'grid' | 'list' | 'grouped';
    transactionsView: 'detailed' | 'compact';
    dashboardLayout: 'default' | 'compact' | 'expanded';
    chartType: 'area' | 'line' | 'bar';
    timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
    showPendingTransactions: boolean;
    groupByCategory: boolean;
  };

  // UI State (non-persistent)
  ui: {
    // Modal states
    isConnectAccountModalOpen: boolean;
    isEditAccountModalOpen: boolean;
    isDisconnectAccountModalOpen: boolean;
    isSyncModalOpen: boolean;
    isTransactionDetailsModalOpen: boolean;

    // Panel states
    isFiltersPanelOpen: boolean;
    isAnalyticsPanelOpen: boolean;

    // Active tabs
    activeTab: 'overview' | 'transactions' | 'analytics' | 'accounts';

    // Bulk selection
    selectedTransactionIds: string[];
    isBulkSelectMode: boolean;
  };
}

interface BankingUIActions {
  // Selection Actions
  selectAccount: (accountId: string | null) => void;
  selectEnrollment: (enrollmentId: string | null) => void;

  // Filter Actions
  setAccountTypeFilter: (types: string[]) => void;
  setInstitutionFilter: (institutions: string[]) => void;
  setTransactionCategoryFilter: (categories: string[]) => void;
  setTransactionTypeFilter: (types: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  setAmountRangeFilter: (min: number | null, max: number | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // View Preference Actions
  setAccountsView: (view: 'grid' | 'list' | 'grouped') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  setDashboardLayout: (layout: 'default' | 'compact' | 'expanded') => void;
  setChartType: (type: 'area' | 'line' | 'bar') => void;
  setTimeRange: (range: 'week' | 'month' | 'quarter' | 'year' | 'all') => void;
  toggleShowPendingTransactions: () => void;
  toggleGroupByCategory: () => void;

  // UI Actions
  openConnectAccountModal: () => void;
  closeConnectAccountModal: () => void;
  openEditAccountModal: () => void;
  closeEditAccountModal: () => void;
  openDisconnectAccountModal: () => void;
  closeDisconnectAccountModal: () => void;
  openSyncModal: () => void;
  closeSyncModal: () => void;
  openTransactionDetailsModal: () => void;
  closeTransactionDetailsModal: () => void;
  toggleFiltersPanel: () => void;
  toggleAnalyticsPanel: () => void;
  setActiveTab: (tab: BankingUIState['ui']['activeTab']) => void;

  // Bulk Selection Actions
  toggleBulkSelectMode: () => void;
  selectTransaction: (transactionId: string) => void;
  deselectTransaction: (transactionId: string) => void;
  selectAllTransactions: (transactionIds: string[]) => void;
  clearTransactionSelection: () => void;

  // Utility Actions
  resetUIState: () => void;
  resetFilters: () => void;
  resetPreferences: () => void;
}

type BankingUIStore = BankingUIState & BankingUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: BankingUIState = {
  // Selection
  selectedAccountId: null,
  selectedEnrollmentId: null,

  // Filters
  filters: {
    accountTypes: [],
    institutions: [],
    transactionCategories: [],
    transactionTypes: [],
    dateRange: {
      from: null,
      to: null,
    },
    amountRange: {
      min: null,
      max: null,
    },
    searchQuery: '',
  },

  // View Preferences (persistent)
  viewPreferences: {
    accountsView: 'list',
    transactionsView: 'detailed',
    dashboardLayout: 'default',
    chartType: 'area',
    timeRange: 'month',
    showPendingTransactions: true,
    groupByCategory: false,
  },

  // UI State (non-persistent)
  ui: {
    isConnectAccountModalOpen: false,
    isEditAccountModalOpen: false,
    isDisconnectAccountModalOpen: false,
    isSyncModalOpen: false,
    isTransactionDetailsModalOpen: false,
    isFiltersPanelOpen: false,
    isAnalyticsPanelOpen: false,
    activeTab: 'overview',
    selectedTransactionIds: [],
    isBulkSelectMode: false,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useBankingUIStore = create<BankingUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ================================================================
        // SELECTION ACTIONS
        // ================================================================
        selectAccount: (accountId) =>
          set((state) => {
            state.selectedAccountId = accountId;
          }, false, 'banking-ui/selectAccount'),

        selectEnrollment: (enrollmentId) =>
          set((state) => {
            state.selectedEnrollmentId = enrollmentId;
          }, false, 'banking-ui/selectEnrollment'),

        // ================================================================
        // FILTER ACTIONS
        // ================================================================
        setAccountTypeFilter: (types) =>
          set((state) => {
            state.filters.accountTypes = types;
          }, false, 'banking-ui/setAccountTypeFilter'),

        setInstitutionFilter: (institutions) =>
          set((state) => {
            state.filters.institutions = institutions;
          }, false, 'banking-ui/setInstitutionFilter'),

        setTransactionCategoryFilter: (categories) =>
          set((state) => {
            state.filters.transactionCategories = categories;
          }, false, 'banking-ui/setTransactionCategoryFilter'),

        setTransactionTypeFilter: (types) =>
          set((state) => {
            state.filters.transactionTypes = types;
          }, false, 'banking-ui/setTransactionTypeFilter'),

        setDateRangeFilter: (from, to) =>
          set((state) => {
            state.filters.dateRange.from = from;
            state.filters.dateRange.to = to;
          }, false, 'banking-ui/setDateRangeFilter'),

        setAmountRangeFilter: (min, max) =>
          set((state) => {
            state.filters.amountRange.min = min;
            state.filters.amountRange.max = max;
          }, false, 'banking-ui/setAmountRangeFilter'),

        setSearchQuery: (query) =>
          set((state) => {
            state.filters.searchQuery = query;
          }, false, 'banking-ui/setSearchQuery'),

        clearFilters: () =>
          set((state) => {
            state.filters = initialState.filters;
          }, false, 'banking-ui/clearFilters'),

        // ================================================================
        // VIEW PREFERENCE ACTIONS
        // ================================================================
        setAccountsView: (view) =>
          set((state) => {
            state.viewPreferences.accountsView = view;
          }, false, 'banking-ui/setAccountsView'),

        setTransactionsView: (view) =>
          set((state) => {
            state.viewPreferences.transactionsView = view;
          }, false, 'banking-ui/setTransactionsView'),

        setDashboardLayout: (layout) =>
          set((state) => {
            state.viewPreferences.dashboardLayout = layout;
          }, false, 'banking-ui/setDashboardLayout'),

        setChartType: (type) =>
          set((state) => {
            state.viewPreferences.chartType = type;
          }, false, 'banking-ui/setChartType'),

        setTimeRange: (range) =>
          set((state) => {
            state.viewPreferences.timeRange = range;
          }, false, 'banking-ui/setTimeRange'),

        toggleShowPendingTransactions: () =>
          set((state) => {
            state.viewPreferences.showPendingTransactions = !state.viewPreferences.showPendingTransactions;
          }, false, 'banking-ui/toggleShowPendingTransactions'),

        toggleGroupByCategory: () =>
          set((state) => {
            state.viewPreferences.groupByCategory = !state.viewPreferences.groupByCategory;
          }, false, 'banking-ui/toggleGroupByCategory'),

        // ================================================================
        // UI ACTIONS
        // ================================================================
        openConnectAccountModal: () =>
          set((state) => {
            state.ui.isConnectAccountModalOpen = true;
          }, false, 'banking-ui/openConnectAccountModal'),

        closeConnectAccountModal: () =>
          set((state) => {
            state.ui.isConnectAccountModalOpen = false;
          }, false, 'banking-ui/closeConnectAccountModal'),

        openEditAccountModal: () =>
          set((state) => {
            state.ui.isEditAccountModalOpen = true;
          }, false, 'banking-ui/openEditAccountModal'),

        closeEditAccountModal: () =>
          set((state) => {
            state.ui.isEditAccountModalOpen = false;
          }, false, 'banking-ui/closeEditAccountModal'),

        openDisconnectAccountModal: () =>
          set((state) => {
            state.ui.isDisconnectAccountModalOpen = true;
          }, false, 'banking-ui/openDisconnectAccountModal'),

        closeDisconnectAccountModal: () =>
          set((state) => {
            state.ui.isDisconnectAccountModalOpen = false;
          }, false, 'banking-ui/closeDisconnectAccountModal'),

        openSyncModal: () =>
          set((state) => {
            state.ui.isSyncModalOpen = true;
          }, false, 'banking-ui/openSyncModal'),

        closeSyncModal: () =>
          set((state) => {
            state.ui.isSyncModalOpen = false;
          }, false, 'banking-ui/closeSyncModal'),

        openTransactionDetailsModal: () =>
          set((state) => {
            state.ui.isTransactionDetailsModalOpen = true;
          }, false, 'banking-ui/openTransactionDetailsModal'),

        closeTransactionDetailsModal: () =>
          set((state) => {
            state.ui.isTransactionDetailsModalOpen = false;
          }, false, 'banking-ui/closeTransactionDetailsModal'),

        toggleFiltersPanel: () =>
          set((state) => {
            state.ui.isFiltersPanelOpen = !state.ui.isFiltersPanelOpen;
          }, false, 'banking-ui/toggleFiltersPanel'),

        toggleAnalyticsPanel: () =>
          set((state) => {
            state.ui.isAnalyticsPanelOpen = !state.ui.isAnalyticsPanelOpen;
          }, false, 'banking-ui/toggleAnalyticsPanel'),

        setActiveTab: (tab) =>
          set((state) => {
            state.ui.activeTab = tab;
          }, false, 'banking-ui/setActiveTab'),

        // ================================================================
        // BULK SELECTION ACTIONS
        // ================================================================
        toggleBulkSelectMode: () =>
          set((state) => {
            state.ui.isBulkSelectMode = !state.ui.isBulkSelectMode;
            if (!state.ui.isBulkSelectMode) {
              state.ui.selectedTransactionIds = [];
            }
          }, false, 'banking-ui/toggleBulkSelectMode'),

        selectTransaction: (transactionId) =>
          set((state) => {
            if (!state.ui.selectedTransactionIds.includes(transactionId)) {
              state.ui.selectedTransactionIds.push(transactionId);
            }
          }, false, 'banking-ui/selectTransaction'),

        deselectTransaction: (transactionId) =>
          set((state) => {
            state.ui.selectedTransactionIds = state.ui.selectedTransactionIds.filter(
              (id) => id !== transactionId
            );
          }, false, 'banking-ui/deselectTransaction'),

        selectAllTransactions: (transactionIds) =>
          set((state) => {
            state.ui.selectedTransactionIds = transactionIds;
          }, false, 'banking-ui/selectAllTransactions'),

        clearTransactionSelection: () =>
          set((state) => {
            state.ui.selectedTransactionIds = [];
          }, false, 'banking-ui/clearTransactionSelection'),

        // ================================================================
        // UTILITY ACTIONS
        // ================================================================
        resetUIState: () =>
          set((state) => {
            state.ui = initialState.ui;
          }, false, 'banking-ui/resetUIState'),

        resetFilters: () =>
          set((state) => {
            state.filters = initialState.filters;
          }, false, 'banking-ui/resetFilters'),

        resetPreferences: () =>
          set((state) => {
            state.viewPreferences = initialState.viewPreferences;
          }, false, 'banking-ui/resetPreferences'),
      })),
      {
        name: 'moneymappr-banking-ui',
        // Only persist preferences, not UI state or selections
        partialize: (state) => ({
          viewPreferences: state.viewPreferences,
        }),
      }
    ),
    {
      name: 'BankingUIStore',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const bankingUISelectors = {
  selectedAccountId: (state: BankingUIStore) => state.selectedAccountId,
  selectedEnrollmentId: (state: BankingUIStore) => state.selectedEnrollmentId,
  filters: (state: BankingUIStore) => state.filters,
  viewPreferences: (state: BankingUIStore) => state.viewPreferences,
  ui: (state: BankingUIStore) => state.ui,

  // Derived selectors
  hasActiveFilters: (state: BankingUIStore) => {
    const { filters } = state;
    return (
      filters.accountTypes.length > 0 ||
      filters.institutions.length > 0 ||
      filters.transactionCategories.length > 0 ||
      filters.transactionTypes.length > 0 ||
      filters.dateRange.from !== null ||
      filters.dateRange.to !== null ||
      filters.amountRange.min !== null ||
      filters.amountRange.max !== null ||
      filters.searchQuery.length > 0
    );
  },

  isAnyModalOpen: (state: BankingUIStore) => {
    const { ui } = state;
    return (
      ui.isConnectAccountModalOpen ||
      ui.isEditAccountModalOpen ||
      ui.isDisconnectAccountModalOpen ||
      ui.isSyncModalOpen ||
      ui.isTransactionDetailsModalOpen
    );
  },

  selectedTransactionCount: (state: BankingUIStore) => state.ui.selectedTransactionIds.length,
};
