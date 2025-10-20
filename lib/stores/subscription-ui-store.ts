/**
 * Subscription UI Store
 *
 * PURPOSE: Manages UI-only state for subscription features
 * - Filters, view preferences, selections
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): filters, selected items, view modes
 * ❌ Server Data (TanStack Query): subscriptions, analytics
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  SubscriptionCategory,
  SubscriptionStatus,
  BillingCycle,
} from '@/lib/types/subscription';

// ============================================================================
// STATE TYPES
// ============================================================================

interface SubscriptionUIState {
  // Selection State
  selectedSubscriptionId: string | null;

  // Filter State
  filters: {
    categories: SubscriptionCategory[];
    statuses: SubscriptionStatus[];
    billingCycles: BillingCycle[];
    searchQuery: string;
    minAmount: number | null;
    maxAmount: number | null;
    showInactive: boolean;
    tags: string[];
    sortBy: 'name' | 'amount' | 'nextBillingDate' | 'startDate' | 'createdAt' | 'totalSpent';
    sortOrder: 'asc' | 'desc';
  };

  // View Preferences (persistent)
  viewPreferences: {
    subscriptionsView: 'grid' | 'list' | 'compact';
    groupBy: 'none' | 'category' | 'billingCycle' | 'status';
    showCancelled: boolean;
    hideTrials: boolean;
    currencyDisplay: 'symbol' | 'code' | 'name';
  };

  // UI State (non-persistent)
  ui: {
    // Modal states
    isCreateModalOpen: boolean;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isDetectionModalOpen: boolean;

    // Panel states
    isFiltersPanelOpen: boolean;
    isAnalyticsPanelOpen: boolean;

    // Active tabs
    activeTab: 'all' | 'active' | 'trial' | 'cancelled';
  };
}

interface SubscriptionUIActions {
  // Selection Actions
  selectSubscription: (subscriptionId: string | null) => void;

  // Filter Actions
  setCategoryFilter: (categories: SubscriptionCategory[]) => void;
  setStatusFilter: (statuses: SubscriptionStatus[]) => void;
  setBillingCycleFilter: (cycles: BillingCycle[]) => void;
  setSearchQuery: (query: string) => void;
  setAmountRange: (min: number | null, max: number | null) => void;
  toggleShowInactive: () => void;
  setTagsFilter: (tags: string[]) => void;
  setSortBy: (
    sortBy: 'name' | 'amount' | 'nextBillingDate' | 'startDate' | 'createdAt' | 'totalSpent'
  ) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  clearFilters: () => void;

  // View Preference Actions
  setSubscriptionsView: (view: 'grid' | 'list' | 'compact') => void;
  setGroupBy: (groupBy: 'none' | 'category' | 'billingCycle' | 'status') => void;
  toggleShowCancelled: () => void;
  toggleHideTrials: () => void;
  setCurrencyDisplay: (display: 'symbol' | 'code' | 'name') => void;

  // UI Actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  openDetectionModal: () => void;
  closeDetectionModal: () => void;
  toggleFiltersPanel: () => void;
  toggleAnalyticsPanel: () => void;
  setActiveTab: (tab: SubscriptionUIState['ui']['activeTab']) => void;

  // Utility Actions
  resetUIState: () => void;
  resetFilters: () => void;
  resetPreferences: () => void;
}

type SubscriptionUIStore = SubscriptionUIState & SubscriptionUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: SubscriptionUIState = {
  // Selection
  selectedSubscriptionId: null,

  // Filters
  filters: {
    categories: [],
    statuses: [],
    billingCycles: [],
    searchQuery: '',
    minAmount: null,
    maxAmount: null,
    showInactive: false,
    tags: [],
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
  },

  // View Preferences (persistent)
  viewPreferences: {
    subscriptionsView: 'grid',
    groupBy: 'none',
    showCancelled: false,
    hideTrials: false,
    currencyDisplay: 'symbol',
  },

  // UI State (non-persistent)
  ui: {
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isDetectionModalOpen: false,
    isFiltersPanelOpen: false,
    isAnalyticsPanelOpen: true,
    activeTab: 'all',
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useSubscriptionUIStore = create<SubscriptionUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // ================================================================
        // SELECTION ACTIONS
        // ================================================================
        selectSubscription: (subscriptionId) =>
          set(
            (state) => {
              state.selectedSubscriptionId = subscriptionId;
            },
            false,
            'subscription-ui/selectSubscription'
          ),

        // ================================================================
        // FILTER ACTIONS
        // ================================================================
        setCategoryFilter: (categories) =>
          set(
            (state) => {
              state.filters.categories = categories;
            },
            false,
            'subscription-ui/setCategoryFilter'
          ),

        setStatusFilter: (statuses) =>
          set(
            (state) => {
              state.filters.statuses = statuses;
            },
            false,
            'subscription-ui/setStatusFilter'
          ),

        setBillingCycleFilter: (cycles) =>
          set(
            (state) => {
              state.filters.billingCycles = cycles;
            },
            false,
            'subscription-ui/setBillingCycleFilter'
          ),

        setSearchQuery: (query) =>
          set(
            (state) => {
              state.filters.searchQuery = query;
            },
            false,
            'subscription-ui/setSearchQuery'
          ),

        setAmountRange: (min, max) =>
          set(
            (state) => {
              state.filters.minAmount = min;
              state.filters.maxAmount = max;
            },
            false,
            'subscription-ui/setAmountRange'
          ),

        toggleShowInactive: () =>
          set(
            (state) => {
              state.filters.showInactive = !state.filters.showInactive;
            },
            false,
            'subscription-ui/toggleShowInactive'
          ),

        setTagsFilter: (tags) =>
          set(
            (state) => {
              state.filters.tags = tags;
            },
            false,
            'subscription-ui/setTagsFilter'
          ),

        setSortBy: (sortBy) =>
          set(
            (state) => {
              state.filters.sortBy = sortBy;
            },
            false,
            'subscription-ui/setSortBy'
          ),

        setSortOrder: (order) =>
          set(
            (state) => {
              state.filters.sortOrder = order;
            },
            false,
            'subscription-ui/setSortOrder'
          ),

        clearFilters: () =>
          set(
            (state) => {
              state.filters = {
                categories: [],
                statuses: [],
                billingCycles: [],
                searchQuery: '',
                minAmount: null,
                maxAmount: null,
                showInactive: false,
                tags: [],
                sortBy: 'nextBillingDate',
                sortOrder: 'asc',
              };
            },
            false,
            'subscription-ui/clearFilters'
          ),

        // ================================================================
        // VIEW PREFERENCE ACTIONS
        // ================================================================
        setSubscriptionsView: (view) =>
          set(
            (state) => {
              state.viewPreferences.subscriptionsView = view;
            },
            false,
            'subscription-ui/setSubscriptionsView'
          ),

        setGroupBy: (groupBy) =>
          set(
            (state) => {
              state.viewPreferences.groupBy = groupBy;
            },
            false,
            'subscription-ui/setGroupBy'
          ),

        toggleShowCancelled: () =>
          set(
            (state) => {
              state.viewPreferences.showCancelled =
                !state.viewPreferences.showCancelled;
            },
            false,
            'subscription-ui/toggleShowCancelled'
          ),

        toggleHideTrials: () =>
          set(
            (state) => {
              state.viewPreferences.hideTrials = !state.viewPreferences.hideTrials;
            },
            false,
            'subscription-ui/toggleHideTrials'
          ),

        setCurrencyDisplay: (display) =>
          set(
            (state) => {
              state.viewPreferences.currencyDisplay = display;
            },
            false,
            'subscription-ui/setCurrencyDisplay'
          ),

        // ================================================================
        // UI ACTIONS
        // ================================================================
        openCreateModal: () =>
          set(
            (state) => {
              state.ui.isCreateModalOpen = true;
            },
            false,
            'subscription-ui/openCreateModal'
          ),

        closeCreateModal: () =>
          set(
            (state) => {
              state.ui.isCreateModalOpen = false;
            },
            false,
            'subscription-ui/closeCreateModal'
          ),

        openEditModal: () =>
          set(
            (state) => {
              state.ui.isEditModalOpen = true;
            },
            false,
            'subscription-ui/openEditModal'
          ),

        closeEditModal: () =>
          set(
            (state) => {
              state.ui.isEditModalOpen = false;
            },
            false,
            'subscription-ui/closeEditModal'
          ),

        openDeleteModal: () =>
          set(
            (state) => {
              state.ui.isDeleteModalOpen = true;
            },
            false,
            'subscription-ui/openDeleteModal'
          ),

        closeDeleteModal: () =>
          set(
            (state) => {
              state.ui.isDeleteModalOpen = false;
            },
            false,
            'subscription-ui/closeDeleteModal'
          ),

        openDetectionModal: () =>
          set(
            (state) => {
              state.ui.isDetectionModalOpen = true;
            },
            false,
            'subscription-ui/openDetectionModal'
          ),

        closeDetectionModal: () =>
          set(
            (state) => {
              state.ui.isDetectionModalOpen = false;
            },
            false,
            'subscription-ui/closeDetectionModal'
          ),

        toggleFiltersPanel: () =>
          set(
            (state) => {
              state.ui.isFiltersPanelOpen = !state.ui.isFiltersPanelOpen;
            },
            false,
            'subscription-ui/toggleFiltersPanel'
          ),

        toggleAnalyticsPanel: () =>
          set(
            (state) => {
              state.ui.isAnalyticsPanelOpen = !state.ui.isAnalyticsPanelOpen;
            },
            false,
            'subscription-ui/toggleAnalyticsPanel'
          ),

        setActiveTab: (tab) =>
          set(
            (state) => {
              state.ui.activeTab = tab;
            },
            false,
            'subscription-ui/setActiveTab'
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
            'subscription-ui/resetUIState'
          ),

        resetFilters: () =>
          set(
            (state) => {
              state.filters = initialState.filters;
            },
            false,
            'subscription-ui/resetFilters'
          ),

        resetPreferences: () =>
          set(
            (state) => {
              state.viewPreferences = initialState.viewPreferences;
            },
            false,
            'subscription-ui/resetPreferences'
          ),
      })),
      {
        name: 'moneymappr-subscription-ui',
        // Only persist preferences, not UI state or selections
        partialize: (state) => ({
          viewPreferences: state.viewPreferences,
          filters: {
            sortBy: state.filters.sortBy,
            sortOrder: state.filters.sortOrder,
          },
        }),
      }
    ),
    {
      name: 'SubscriptionUIStore',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const subscriptionUISelectors = {
  selectedSubscriptionId: (state: SubscriptionUIStore) =>
    state.selectedSubscriptionId,
  filters: (state: SubscriptionUIStore) => state.filters,
  viewPreferences: (state: SubscriptionUIStore) => state.viewPreferences,
  ui: (state: SubscriptionUIStore) => state.ui,

  // Derived selectors
  hasActiveFilters: (state: SubscriptionUIStore) => {
    const { filters } = state;
    return (
      filters.categories.length > 0 ||
      filters.statuses.length > 0 ||
      filters.billingCycles.length > 0 ||
      filters.searchQuery.length > 0 ||
      filters.minAmount !== null ||
      filters.maxAmount !== null ||
      filters.tags.length > 0
    );
  },

  isAnyModalOpen: (state: SubscriptionUIStore) => {
    const { ui } = state;
    return (
      ui.isCreateModalOpen ||
      ui.isEditModalOpen ||
      ui.isDeleteModalOpen ||
      ui.isDetectionModalOpen
    );
  },
};
