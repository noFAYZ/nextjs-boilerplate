'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EnvelopeUIState {
  // Selection
  selectedEnvelopeId: string | null;
  selectEnvelope: (id: string | null) => void;

  // Modal states
  isCreateEnvelopeModalOpen: boolean;
  openCreateEnvelopeModal: () => void;
  closeCreateEnvelopeModal: () => void;

  isAllocateModalOpen: boolean;
  openAllocateModal: () => void;
  closeAllocateModal: () => void;

  isRuleModalOpen: boolean;
  openRuleModal: () => void;
  closeRuleModal: () => void;

  // View preferences
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;

  activeTab: 'dashboard' | 'categories' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'categories' | 'analytics') => void;

  showBalances: boolean;
  setShowBalances: (show: boolean) => void;

  // Filters
  filters: {
    status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'CLOSED';
    envelopeType?: 'SPENDING' | 'SAVINGS_GOAL' | 'SINKING_FUND' | 'FLEXIBLE';
    cycle?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    searchQuery?: string;
    periodType?: 'MONTHLY' | 'WEEKLY' | 'QUARTERLY' | 'CUSTOM';
    periodStart?: Date;
    periodEnd?: Date;
  };
  setStatusFilter: (status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'CLOSED' | undefined) => void;
  setEnvelopeTypeFilter: (type: 'SPENDING' | 'SAVINGS_GOAL' | 'SINKING_FUND' | 'FLEXIBLE' | undefined) => void;
  setCycleFilter: (cycle: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | undefined) => void;
  setSearchQuery: (query: string) => void;
  setPeriodTypeFilter: (type: 'MONTHLY' | 'WEEKLY' | 'QUARTERLY' | 'CUSTOM' | undefined) => void;
  setPeriodFilter: (start: Date | undefined, end: Date | undefined) => void;
  clearFilters: () => void;

  // Sort preferences
  sortBy: 'name' | 'allocatedAmount' | 'spentAmount' | 'createdAt';
  setSortBy: (sort: 'name' | 'allocatedAmount' | 'spentAmount' | 'createdAt') => void;

  // Expanded envelopes (for detailed view)
  expandedEnvelopeIds: Set<string>;
  toggleExpandedEnvelope: (id: string) => void;
  clearExpandedEnvelopes: () => void;

  // Analytics view
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;

  // Period view (deprecated - use filters.periodType instead)
  selectedPeriodOffset: number;
  setSelectedPeriodOffset: (offset: number) => void;
}

export const useEnvelopeUIStore = create<EnvelopeUIState>()(
  persist(
    (set) => ({
      // Selection
      selectedEnvelopeId: null,
      selectEnvelope: (id) => set({ selectedEnvelopeId: id }),

      // Modal states
      isCreateEnvelopeModalOpen: false,
      openCreateEnvelopeModal: () => set({ isCreateEnvelopeModalOpen: true }),
      closeCreateEnvelopeModal: () => set({ isCreateEnvelopeModalOpen: false }),

      isAllocateModalOpen: false,
      openAllocateModal: () => set({ isAllocateModalOpen: true }),
      closeAllocateModal: () => set({ isAllocateModalOpen: false }),

      isRuleModalOpen: false,
      openRuleModal: () => set({ isRuleModalOpen: true }),
      closeRuleModal: () => set({ isRuleModalOpen: false }),

      // View preferences
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),

      activeTab: 'dashboard',
      setActiveTab: (activeTab) => set({ activeTab }),

      showBalances: true,
      setShowBalances: (showBalances) => set({ showBalances }),

      // Filters
      filters: { periodType: 'MONTHLY' },
      setStatusFilter: (status) =>
        set((state) => ({
          filters: { ...state.filters, status },
        })),
      setEnvelopeTypeFilter: (envelopeType) =>
        set((state) => ({
          filters: { ...state.filters, envelopeType },
        })),
      setCycleFilter: (cycle) =>
        set((state) => ({
          filters: { ...state.filters, cycle },
        })),
      setSearchQuery: (searchQuery) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: searchQuery || undefined },
        })),
      setPeriodTypeFilter: (periodType) =>
        set((state) => ({
          filters: { ...state.filters, periodType },
        })),
      setPeriodFilter: (periodStart, periodEnd) =>
        set((state) => ({
          filters: { ...state.filters, periodStart, periodEnd },
        })),
      clearFilters: () =>
        set({
          filters: { periodType: 'MONTHLY' },
        }),

      // Sort preferences
      sortBy: 'createdAt',
      setSortBy: (sortBy) => set({ sortBy }),

      // Expanded envelopes
      expandedEnvelopeIds: new Set<string>(),
      toggleExpandedEnvelope: (id) =>
        set((state) => {
          const expanded = new Set(state.expandedEnvelopeIds);
          if (expanded.has(id)) {
            expanded.delete(id);
          } else {
            expanded.add(id);
          }
          return { expandedEnvelopeIds: expanded };
        }),
      clearExpandedEnvelopes: () => set({ expandedEnvelopeIds: new Set<string>() }),

      // Analytics view
      showAnalytics: false,
      setShowAnalytics: (show) => set({ showAnalytics: show }),

      // Period view (deprecated - use filters.periodType instead)
      selectedPeriodOffset: 0,
      setSelectedPeriodOffset: (offset) => set({ selectedPeriodOffset: offset }),
    }),
    {
      name: 'envelope-ui-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        showAnalytics: state.showAnalytics,
        activeTab: state.activeTab,
        showBalances: state.showBalances,
        filters: {
          periodType: state.filters.periodType,
          periodStart: state.filters.periodStart,
          periodEnd: state.filters.periodEnd,
          searchQuery: state.filters.searchQuery,
          status: state.filters.status,
          cycle: state.filters.cycle,
        },
      }),
    }
  )
);
