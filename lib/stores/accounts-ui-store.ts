/**
 * Accounts UI Store
 *
 * PURPOSE: Manages UI-only state for accounts features
 * - Filters, view preferences, selections, bulk operations
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): filters, selected items, view modes, balance visibility
 * ❌ Server Data (TanStack Query): accounts, summary data, transactions
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AccountType, AccountCategory } from '@/lib/types';

// ============================================================================
// STATE TYPES
// ============================================================================

interface AccountsUIState {
  // Selection State (for bulk operations)
  selectedAccountIds: string[];

  // Deletion State
  deletingAccountIds: string[];

  // Filter State
  filters: {
    accountTypes: AccountType[];
    categories: AccountCategory[];
    institutions: string[];
    searchQuery: string;
    minBalance: number | null;
    maxBalance: number | null;
    showInactive: boolean;
    sources: ('MANUAL' | 'LINK' | 'PLAID' | 'TELLER' | 'ZERION')[];
    sortBy: 'name' | 'balance' | 'type' | 'institution' | 'lastSync';
    sortOrder: 'asc' | 'desc';
  };

  // View Preferences (persistent)
  viewPreferences: {
    accountsView: 'grid' | 'list' | 'grouped';
    balanceVisible: boolean;
    groupBy: 'category' | 'institution' | 'type' | 'none';
    chartType: 'area' | 'bar' | 'line';
    timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
    defaultOverview: 'overview' | 'overview-2';
  };

  // UI State (non-persistent)
  ui: {
    activeTab: 'overview' | 'manage' | 'overview-2';
    isBulkSelectMode: boolean;
    selectedCategory: string | null;
  };
}

interface AccountsUIActions {
  // Selection Actions
  toggleAccountSelection: (accountId: string) => void;
  selectAccount: (accountId: string) => void;
  clearSelection: () => void;

  // Deletion Actions
  setDeletingAccount: (accountId: string) => void;
  clearDeletingAccount: (accountId: string) => void;

  // Filter Actions
  setAccountTypeFilter: (types: AccountType[]) => void;
  setCategoryFilter: (categories: AccountCategory[]) => void;
  setInstitutionFilter: (institutions: string[]) => void;
  setSearchQuery: (query: string) => void;
  setBalanceRange: (min: number | null, max: number | null) => void;
  toggleShowInactive: () => void;
  setSourceFilter: (sources: ('MANUAL' | 'LINK' | 'PLAID' | 'TELLER' | 'ZERION')[]) => void;
  setSortBy: (sortBy: 'name' | 'balance' | 'type' | 'institution' | 'lastSync') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  clearFilters: () => void;

  // View Preference Actions
  setAccountsView: (view: 'grid' | 'list' | 'grouped') => void;
  setBalanceVisible: (visible: boolean) => void;
  setGroupBy: (groupBy: 'category' | 'institution' | 'type' | 'none') => void;
  setChartType: (type: 'area' | 'bar' | 'line') => void;
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y' | 'all') => void;

  // UI Actions
  setActiveTab: (tab: 'overview' | 'manage' | 'overview-2') => void;
  toggleBulkSelectMode: () => void;
  setSelectedCategory: (category: string | null) => void;
  setDefaultOverview: (overview: 'overview' | 'overview-2') => void;

  // Utility Actions
  resetUIState: () => void;
  resetFilters: () => void;
  resetPreferences: () => void;
}

type AccountsUIStore = AccountsUIState & AccountsUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AccountsUIState = {
  // Selection
  selectedAccountIds: [],

  // Deletion
  deletingAccountIds: [],

  // Filters
  filters: {
    accountTypes: [],
    categories: [],
    institutions: [],
    searchQuery: '',
    minBalance: null,
    maxBalance: null,
    showInactive: false,
    sources: [],
    sortBy: 'name',
    sortOrder: 'asc',
  },

  // View Preferences (persistent)
  viewPreferences: {
    accountsView: 'grouped',
    balanceVisible: true,
    groupBy: 'category',
    chartType: 'area',
    timeRange: '30d',
    defaultOverview: 'overview',
  },

  // UI State (non-persistent)
  ui: {
    activeTab: 'overview',
    isBulkSelectMode: false,
    selectedCategory: null,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAccountsUIStore = create<AccountsUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ================================================================
        // SELECTION ACTIONS
        // ================================================================
        toggleAccountSelection: (accountId) =>
          set(
            (state) => {
              const index = state.selectedAccountIds.indexOf(accountId);
              if (index > -1) {
                state.selectedAccountIds.splice(index, 1);
              } else {
                state.selectedAccountIds.push(accountId);
              }
            },
            false,
            'accounts-ui/toggleAccountSelection'
          ),

        selectAccount: (accountId) =>
          set(
            (state) => {
              state.selectedAccountIds = [accountId];
            },
            false,
            'accounts-ui/selectAccount'
          ),

        clearSelection: () =>
          set(
            (state) => {
              state.selectedAccountIds = [];
            },
            false,
            'accounts-ui/clearSelection'
          ),

        // ================================================================
        // DELETION ACTIONS
        // ================================================================
        setDeletingAccount: (accountId) =>
          set(
            (state) => {
              if (!state.deletingAccountIds.includes(accountId)) {
                state.deletingAccountIds.push(accountId);
              }
            },
            false,
            'accounts-ui/setDeletingAccount'
          ),

        clearDeletingAccount: (accountId) =>
          set(
            (state) => {
              state.deletingAccountIds = state.deletingAccountIds.filter(
                (id) => id !== accountId
              );
            },
            false,
            'accounts-ui/clearDeletingAccount'
          ),

        // ================================================================
        // FILTER ACTIONS
        // ================================================================
        setAccountTypeFilter: (types) =>
          set(
            (state) => {
              state.filters.accountTypes = types;
            },
            false,
            'accounts-ui/setAccountTypeFilter'
          ),

        setCategoryFilter: (categories) =>
          set(
            (state) => {
              state.filters.categories = categories;
            },
            false,
            'accounts-ui/setCategoryFilter'
          ),

        setInstitutionFilter: (institutions) =>
          set(
            (state) => {
              state.filters.institutions = institutions;
            },
            false,
            'accounts-ui/setInstitutionFilter'
          ),

        setSearchQuery: (query) =>
          set(
            (state) => {
              state.filters.searchQuery = query;
            },
            false,
            'accounts-ui/setSearchQuery'
          ),

        setBalanceRange: (min, max) =>
          set(
            (state) => {
              state.filters.minBalance = min;
              state.filters.maxBalance = max;
            },
            false,
            'accounts-ui/setBalanceRange'
          ),

        toggleShowInactive: () =>
          set(
            (state) => {
              state.filters.showInactive = !state.filters.showInactive;
            },
            false,
            'accounts-ui/toggleShowInactive'
          ),

        setSourceFilter: (sources) =>
          set(
            (state) => {
              state.filters.sources = sources;
            },
            false,
            'accounts-ui/setSourceFilter'
          ),

        setSortBy: (sortBy) =>
          set(
            (state) => {
              state.filters.sortBy = sortBy;
            },
            false,
            'accounts-ui/setSortBy'
          ),

        setSortOrder: (order) =>
          set(
            (state) => {
              state.filters.sortOrder = order;
            },
            false,
            'accounts-ui/setSortOrder'
          ),

        clearFilters: () =>
          set(
            (state) => {
              state.filters = {
                accountTypes: [],
                categories: [],
                institutions: [],
                searchQuery: '',
                minBalance: null,
                maxBalance: null,
                showInactive: false,
                sources: [],
                sortBy: 'name',
                sortOrder: 'asc',
              };
            },
            false,
            'accounts-ui/clearFilters'
          ),

        // ================================================================
        // VIEW PREFERENCE ACTIONS
        // ================================================================
        setAccountsView: (view) =>
          set(
            (state) => {
              state.viewPreferences.accountsView = view;
            },
            false,
            'accounts-ui/setAccountsView'
          ),

        setBalanceVisible: (visible) =>
          set(
            (state) => {
              state.viewPreferences.balanceVisible = visible;
            },
            false,
            'accounts-ui/setBalanceVisible'
          ),

        setGroupBy: (groupBy) =>
          set(
            (state) => {
              state.viewPreferences.groupBy = groupBy;
            },
            false,
            'accounts-ui/setGroupBy'
          ),

        setChartType: (type) =>
          set(
            (state) => {
              state.viewPreferences.chartType = type;
            },
            false,
            'accounts-ui/setChartType'
          ),

        setTimeRange: (range) =>
          set(
            (state) => {
              state.viewPreferences.timeRange = range;
            },
            false,
            'accounts-ui/setTimeRange'
          ),

        // ================================================================
        // UI ACTIONS
        // ================================================================
        setActiveTab: (tab) =>
          set(
            (state) => {
              state.ui.activeTab = tab;
            },
            false,
            'accounts-ui/setActiveTab'
          ),

        toggleBulkSelectMode: () =>
          set(
            (state) => {
              state.ui.isBulkSelectMode = !state.ui.isBulkSelectMode;
              // Clear selection when exiting bulk mode
              if (!state.ui.isBulkSelectMode) {
                state.selectedAccountIds = [];
              }
            },
            false,
            'accounts-ui/toggleBulkSelectMode'
          ),

        setSelectedCategory: (category) =>
          set(
            (state) => {
              state.ui.selectedCategory = category;
            },
            false,
            'accounts-ui/setSelectedCategory'
          ),

        setDefaultOverview: (overview) =>
          set(
            (state) => {
              state.viewPreferences.defaultOverview = overview;
            },
            false,
            'accounts-ui/setDefaultOverview'
          ),

        // ================================================================
        // UTILITY ACTIONS
        // ================================================================
        resetUIState: () =>
          set(
            (state) => {
              state.ui = initialState.ui;
            },
            false,
            'accounts-ui/resetUIState'
          ),

        resetFilters: () =>
          set(
            (state) => {
              state.filters = initialState.filters;
            },
            false,
            'accounts-ui/resetFilters'
          ),

        resetPreferences: () =>
          set(
            (state) => {
              state.viewPreferences = initialState.viewPreferences;
            },
            false,
            'accounts-ui/resetPreferences'
          ),
      })),
      {
        name: 'moneymappr-accounts-ui',
        // Only persist preferences and sort settings
        partialize: (state) => ({
          viewPreferences: {
            ...state.viewPreferences,
          },
          filters: {
            sortBy: state.filters.sortBy,
            sortOrder: state.filters.sortOrder,
          },
        }),
      }
    ),
    {
      name: 'AccountsUIStore',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const accountsUISelectors = {
  selectedAccountIds: (state: AccountsUIStore) => state.selectedAccountIds,
  deletingAccountIds: (state: AccountsUIStore) => state.deletingAccountIds,
  filters: (state: AccountsUIStore) => state.filters,
  viewPreferences: (state: AccountsUIStore) => state.viewPreferences,
  ui: (state: AccountsUIStore) => state.ui,
  balanceVisible: (state: AccountsUIStore) => state.viewPreferences.balanceVisible,
  activeTab: (state: AccountsUIStore) => state.ui.activeTab,

  // Derived selectors
  hasActiveFilters: (state: AccountsUIStore) => {
    const { filters } = state;
    return (
      filters.accountTypes.length > 0 ||
      filters.categories.length > 0 ||
      filters.institutions.length > 0 ||
      filters.searchQuery.length > 0 ||
      filters.minBalance !== null ||
      filters.maxBalance !== null ||
      filters.sources.length > 0 ||
      filters.showInactive
    );
  },

  hasSelection: (state: AccountsUIStore) => state.selectedAccountIds.length > 0,

  selectionCount: (state: AccountsUIStore) => state.selectedAccountIds.length,
};
