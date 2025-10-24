/**
 * Budget UI Store
 *
 * PURPOSE: Manages UI-only state for budget features
 * - Filters, view preferences, selections
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): filters, selected items, view modes
 * ❌ Server Data (TanStack Query): budgets, analytics, transactions
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { BudgetCycle, BudgetStatus, BudgetSourceType } from '@/lib/types/budget';

// ============================================================================
// STATE TYPES
// ============================================================================

interface BudgetUIState {
  // Selection State
  selectedBudgetId: string | null;

  // Filter State
  filters: {
    cycles: BudgetCycle[];
    statuses: BudgetStatus[];
    sourceTypes: BudgetSourceType[];
    isExceeded: boolean | null; // null = show all
    isOnTrack: boolean | null; // null = show all
    categoryIds: string[];
    accountIds: string[];
    searchQuery: string;
    tags: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };

  // View Preferences (persistent)
  viewPreferences: {
    budgetsView: 'grid' | 'list' | 'compact';
    sortBy: 'name' | 'amount' | 'spent' | 'remaining' | 'percentageUsed' | 'currentPeriodEnd' | 'priority';
    sortOrder: 'asc' | 'desc';
    showArchived: boolean;
    chartType: 'pie' | 'bar' | 'donut';
    analyticsTimeRange: 'week' | 'month' | 'quarter' | 'year';
    groupBy: 'none' | 'cycle' | 'source' | 'category' | 'status';
    showPercentages: boolean;
    highlightExceeded: boolean;
  };

  // UI State (non-persistent)
  ui: {
    // Modal states
    isCreateBudgetModalOpen: boolean;
    isEditBudgetModalOpen: boolean;
    isDeleteBudgetModalOpen: boolean;
    isAddTransactionModalOpen: boolean;

    // Panel states
    isFiltersPanelOpen: boolean;
    isAnalyticsPanelOpen: boolean;

    // Active tabs
    activeTab: 'overview' | 'budgets' | 'analytics' | 'alerts';

    // Bulk operations
    bulkSelectMode: boolean;
    selectedBudgetIds: string[];
  };
}

interface BudgetUIActions {
  // Selection Actions
  selectBudget: (budgetId: string | null) => void;

  // Filter Actions
  setCycleFilter: (cycles: BudgetCycle[]) => void;
  setStatusFilter: (statuses: BudgetStatus[]) => void;
  setSourceTypeFilter: (types: BudgetSourceType[]) => void;
  setExceededFilter: (isExceeded: boolean | null) => void;
  setOnTrackFilter: (isOnTrack: boolean | null) => void;
  setCategoryFilter: (categoryIds: string[]) => void;
  setAccountFilter: (accountIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setTagsFilter: (tags: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  clearFilters: () => void;

  // View Preference Actions
  setBudgetsView: (view: 'grid' | 'list' | 'compact') => void;
  setSortBy: (sortBy: BudgetUIState['viewPreferences']['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  toggleSortOrder: () => void;
  toggleShowArchived: () => void;
  setChartType: (type: 'pie' | 'bar' | 'donut') => void;
  setAnalyticsTimeRange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
  setGroupBy: (groupBy: BudgetUIState['viewPreferences']['groupBy']) => void;
  toggleShowPercentages: () => void;
  toggleHighlightExceeded: () => void;

  // UI Actions
  openCreateBudgetModal: () => void;
  closeCreateBudgetModal: () => void;
  openEditBudgetModal: () => void;
  closeEditBudgetModal: () => void;
  openDeleteBudgetModal: () => void;
  closeDeleteBudgetModal: () => void;
  openAddTransactionModal: () => void;
  closeAddTransactionModal: () => void;
  toggleFiltersPanel: () => void;
  toggleAnalyticsPanel: () => void;
  setActiveTab: (tab: BudgetUIState['ui']['activeTab']) => void;

  // Bulk Operations
  toggleBulkSelectMode: () => void;
  toggleBudgetSelection: (budgetId: string) => void;
  selectAllBudgets: (budgetIds: string[]) => void;
  clearBudgetSelection: () => void;

  // Utility Actions
  resetUIState: () => void;
  resetFilters: () => void;
  resetPreferences: () => void;
}

type BudgetUIStore = BudgetUIState & BudgetUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: BudgetUIState = {
  // Selection
  selectedBudgetId: null,

  // Filters
  filters: {
    cycles: [],
    statuses: [],
    sourceTypes: [],
    isExceeded: null,
    isOnTrack: null,
    categoryIds: [],
    accountIds: [],
    searchQuery: '',
    tags: [],
    dateRange: {
      from: null,
      to: null,
    },
  },

  // View Preferences (persistent)
  viewPreferences: {
    budgetsView: 'grid',
    sortBy: 'percentageUsed',
    sortOrder: 'desc',
    showArchived: false,
    chartType: 'donut',
    analyticsTimeRange: 'month',
    groupBy: 'none',
    showPercentages: true,
    highlightExceeded: true,
  },

  // UI State (non-persistent)
  ui: {
    isCreateBudgetModalOpen: false,
    isEditBudgetModalOpen: false,
    isDeleteBudgetModalOpen: false,
    isAddTransactionModalOpen: false,
    isFiltersPanelOpen: false,
    isAnalyticsPanelOpen: false,
    activeTab: 'overview',
    bulkSelectMode: false,
    selectedBudgetIds: [],
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useBudgetUIStore = create<BudgetUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ================================================================
        // SELECTION ACTIONS
        // ================================================================
        selectBudget: (budgetId) =>
          set((state) => {
            state.selectedBudgetId = budgetId;
          }, false, 'budget-ui/selectBudget'),

        // ================================================================
        // FILTER ACTIONS
        // ================================================================
        setCycleFilter: (cycles) =>
          set((state) => {
            state.filters.cycles = cycles;
          }, false, 'budget-ui/setCycleFilter'),

        setStatusFilter: (statuses) =>
          set((state) => {
            state.filters.statuses = statuses;
          }, false, 'budget-ui/setStatusFilter'),

        setSourceTypeFilter: (types) =>
          set((state) => {
            state.filters.sourceTypes = types;
          }, false, 'budget-ui/setSourceTypeFilter'),

        setExceededFilter: (isExceeded) =>
          set((state) => {
            state.filters.isExceeded = isExceeded;
          }, false, 'budget-ui/setExceededFilter'),

        setOnTrackFilter: (isOnTrack) =>
          set((state) => {
            state.filters.isOnTrack = isOnTrack;
          }, false, 'budget-ui/setOnTrackFilter'),

        setCategoryFilter: (categoryIds) =>
          set((state) => {
            state.filters.categoryIds = categoryIds;
          }, false, 'budget-ui/setCategoryFilter'),

        setAccountFilter: (accountIds) =>
          set((state) => {
            state.filters.accountIds = accountIds;
          }, false, 'budget-ui/setAccountFilter'),

        setSearchQuery: (query) =>
          set((state) => {
            state.filters.searchQuery = query;
          }, false, 'budget-ui/setSearchQuery'),

        setTagsFilter: (tags) =>
          set((state) => {
            state.filters.tags = tags;
          }, false, 'budget-ui/setTagsFilter'),

        setDateRangeFilter: (from, to) =>
          set((state) => {
            state.filters.dateRange.from = from;
            state.filters.dateRange.to = to;
          }, false, 'budget-ui/setDateRangeFilter'),

        clearFilters: () =>
          set((state) => {
            state.filters = {
              cycles: [],
              statuses: [],
              sourceTypes: [],
              isExceeded: null,
              isOnTrack: null,
              categoryIds: [],
              accountIds: [],
              searchQuery: '',
              tags: [],
              dateRange: { from: null, to: null },
            };
          }, false, 'budget-ui/clearFilters'),

        // ================================================================
        // VIEW PREFERENCE ACTIONS
        // ================================================================
        setBudgetsView: (view) =>
          set((state) => {
            state.viewPreferences.budgetsView = view;
          }, false, 'budget-ui/setBudgetsView'),

        setSortBy: (sortBy) =>
          set((state) => {
            state.viewPreferences.sortBy = sortBy;
          }, false, 'budget-ui/setSortBy'),

        setSortOrder: (order) =>
          set((state) => {
            state.viewPreferences.sortOrder = order;
          }, false, 'budget-ui/setSortOrder'),

        toggleSortOrder: () =>
          set((state) => {
            state.viewPreferences.sortOrder =
              state.viewPreferences.sortOrder === 'asc' ? 'desc' : 'asc';
          }, false, 'budget-ui/toggleSortOrder'),

        toggleShowArchived: () =>
          set((state) => {
            state.viewPreferences.showArchived = !state.viewPreferences.showArchived;
          }, false, 'budget-ui/toggleShowArchived'),

        setChartType: (type) =>
          set((state) => {
            state.viewPreferences.chartType = type;
          }, false, 'budget-ui/setChartType'),

        setAnalyticsTimeRange: (range) =>
          set((state) => {
            state.viewPreferences.analyticsTimeRange = range;
          }, false, 'budget-ui/setAnalyticsTimeRange'),

        setGroupBy: (groupBy) =>
          set((state) => {
            state.viewPreferences.groupBy = groupBy;
          }, false, 'budget-ui/setGroupBy'),

        toggleShowPercentages: () =>
          set((state) => {
            state.viewPreferences.showPercentages = !state.viewPreferences.showPercentages;
          }, false, 'budget-ui/toggleShowPercentages'),

        toggleHighlightExceeded: () =>
          set((state) => {
            state.viewPreferences.highlightExceeded = !state.viewPreferences.highlightExceeded;
          }, false, 'budget-ui/toggleHighlightExceeded'),

        // ================================================================
        // UI ACTIONS
        // ================================================================
        openCreateBudgetModal: () =>
          set((state) => {
            state.ui.isCreateBudgetModalOpen = true;
          }, false, 'budget-ui/openCreateBudgetModal'),

        closeCreateBudgetModal: () =>
          set((state) => {
            state.ui.isCreateBudgetModalOpen = false;
          }, false, 'budget-ui/closeCreateBudgetModal'),

        openEditBudgetModal: () =>
          set((state) => {
            state.ui.isEditBudgetModalOpen = true;
          }, false, 'budget-ui/openEditBudgetModal'),

        closeEditBudgetModal: () =>
          set((state) => {
            state.ui.isEditBudgetModalOpen = false;
          }, false, 'budget-ui/closeEditBudgetModal'),

        openDeleteBudgetModal: () =>
          set((state) => {
            state.ui.isDeleteBudgetModalOpen = true;
          }, false, 'budget-ui/openDeleteBudgetModal'),

        closeDeleteBudgetModal: () =>
          set((state) => {
            state.ui.isDeleteBudgetModalOpen = false;
          }, false, 'budget-ui/closeDeleteBudgetModal'),

        openAddTransactionModal: () =>
          set((state) => {
            state.ui.isAddTransactionModalOpen = true;
          }, false, 'budget-ui/openAddTransactionModal'),

        closeAddTransactionModal: () =>
          set((state) => {
            state.ui.isAddTransactionModalOpen = false;
          }, false, 'budget-ui/closeAddTransactionModal'),

        toggleFiltersPanel: () =>
          set((state) => {
            state.ui.isFiltersPanelOpen = !state.ui.isFiltersPanelOpen;
          }, false, 'budget-ui/toggleFiltersPanel'),

        toggleAnalyticsPanel: () =>
          set((state) => {
            state.ui.isAnalyticsPanelOpen = !state.ui.isAnalyticsPanelOpen;
          }, false, 'budget-ui/toggleAnalyticsPanel'),

        setActiveTab: (tab) =>
          set((state) => {
            state.ui.activeTab = tab;
          }, false, 'budget-ui/setActiveTab'),

        // ================================================================
        // BULK OPERATIONS
        // ================================================================
        toggleBulkSelectMode: () =>
          set((state) => {
            state.ui.bulkSelectMode = !state.ui.bulkSelectMode;
            if (!state.ui.bulkSelectMode) {
              state.ui.selectedBudgetIds = [];
            }
          }, false, 'budget-ui/toggleBulkSelectMode'),

        toggleBudgetSelection: (budgetId) =>
          set((state) => {
            const index = state.ui.selectedBudgetIds.indexOf(budgetId);
            if (index > -1) {
              state.ui.selectedBudgetIds.splice(index, 1);
            } else {
              state.ui.selectedBudgetIds.push(budgetId);
            }
          }, false, 'budget-ui/toggleBudgetSelection'),

        selectAllBudgets: (budgetIds) =>
          set((state) => {
            state.ui.selectedBudgetIds = budgetIds;
          }, false, 'budget-ui/selectAllBudgets'),

        clearBudgetSelection: () =>
          set((state) => {
            state.ui.selectedBudgetIds = [];
          }, false, 'budget-ui/clearBudgetSelection'),

        // ================================================================
        // UTILITY ACTIONS
        // ================================================================
        resetUIState: () =>
          set((state) => {
            state.ui = { ...initialState.ui };
          }, false, 'budget-ui/resetUIState'),

        resetFilters: () =>
          set((state) => {
            state.filters = { ...initialState.filters };
          }, false, 'budget-ui/resetFilters'),

        resetPreferences: () =>
          set((state) => {
            state.viewPreferences = { ...initialState.viewPreferences };
          }, false, 'budget-ui/resetPreferences'),
      })),
      {
        name: 'budget-ui-store',
        // Only persist view preferences and selected budget
        partialize: (state) => ({
          selectedBudgetId: state.selectedBudgetId,
          viewPreferences: state.viewPreferences,
        }),
      }
    ),
    { name: 'BudgetUIStore' }
  )
);
