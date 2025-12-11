/**
 * Budgets V3 UI Store
 * Manages client-side UI state for the budgets-v3 feature
 *
 * IMPORTANT: This store manages UI state ONLY
 * Server data is managed by TanStack Query hooks (lib/queries/)
 *
 * Store covers:
 * - Tab selection
 * - Income allocation wizard state
 * - Forecasting state
 * - View preferences (persisted)
 * - Filters
 * - Modal states
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export type BudgetsV3Tab = 'overview' | 'envelopes' | 'traditional' | 'analytics' | 'forecasting' | 'income-allocation';

export type AllocationStep = 'input' | 'suggestions' | 'review' | 'confirm' | 'complete';

export type TemplateType = '50-30-20' | 'ynab' | 'envelope' | 'custom';

export type HybridView = 'combined' | 'side-by-side' | 'envelopes-only' | 'traditional-only';

export type ChartType = 'bar' | 'line' | 'area' | 'pie';

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export interface AllocationCustomEntry {
  envelopeId: string;
  amount: number;
}

export interface AllocationFeedbackEntry {
  suggestionId: string;
  feedback: 'accepted' | 'modified' | 'rejected';
}

export interface ViewPreferences {
  hybridView: HybridView;
  showEnvelopeDetails: boolean;
  showBudgetDetails: boolean;
  chartType: ChartType;
  timeRange: TimeRange;
}

export interface FilterState {
  envelopeTypes: string[];
  budgetCycles: string[];
  healthScoreRange: [number, number];
  searchQuery: string;
}

export interface ModalState {
  isCreateEnvelopeModalOpen: boolean;
  isCreateBudgetModalOpen: boolean;
  isIncomeAllocationModalOpen: boolean;
  isForecastDetailModalOpen: boolean;
  isHealthScoreModalOpen: boolean;
  isTemplateSelectionModalOpen: boolean;
}

export interface IncomeAllocationState {
  step: AllocationStep;
  incomeAmount: number | null;
  selectedTemplate: TemplateType | null;
  customAllocations: AllocationCustomEntry[];
  suggestionsFeedback: AllocationFeedbackEntry[];
}

export interface ForecastingState {
  selectedEnvelopeId: string | null;
  daysAhead: 30 | 60 | 90;
  showConfidence: boolean;
  showRecommendations: boolean;
}

export interface BudgetsV3UIState {
  // Tab Management
  activeTab: BudgetsV3Tab;
  setActiveTab: (tab: BudgetsV3Tab) => void;

  // Income Allocation Flow State
  incomeAllocation: IncomeAllocationState;
  setIncomeAllocationStep: (step: AllocationStep) => void;
  setIncomeAmount: (amount: number | null) => void;
  setSelectedTemplate: (template: TemplateType | null) => void;
  addCustomAllocation: (allocation: AllocationCustomEntry) => void;
  updateCustomAllocation: (envelopeId: string, amount: number) => void;
  removeCustomAllocation: (envelopeId: string) => void;
  addAllocationFeedback: (feedback: AllocationFeedbackEntry) => void;
  resetIncomeAllocation: () => void;

  // Forecasting State
  forecasting: ForecastingState;
  setSelectedEnvelopeId: (envelopeId: string | null) => void;
  setDaysAhead: (days: 30 | 60 | 90) => void;
  setShowConfidence: (show: boolean) => void;
  setShowRecommendations: (show: boolean) => void;

  // View Preferences (persisted)
  viewPreferences: ViewPreferences;
  setHybridView: (view: HybridView) => void;
  setShowEnvelopeDetails: (show: boolean) => void;
  setShowBudgetDetails: (show: boolean) => void;
  setChartType: (type: ChartType) => void;
  setTimeRange: (range: TimeRange) => void;

  // Filters
  filters: FilterState;
  setEnvelopeTypeFilter: (types: string[]) => void;
  setBudgetCyclesFilter: (cycles: string[]) => void;
  setHealthScoreRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // Modals
  modals: ModalState;
  openCreateEnvelopeModal: () => void;
  closeCreateEnvelopeModal: () => void;
  openCreateBudgetModal: () => void;
  closeCreateBudgetModal: () => void;
  openIncomeAllocationModal: () => void;
  closeIncomeAllocationModal: () => void;
  openForecastDetailModal: () => void;
  closeForecastDetailModal: () => void;
  openHealthScoreModal: () => void;
  closeHealthScoreModal: () => void;
  openTemplateSelectionModal: () => void;
  closeTemplateSelectionModal: () => void;
}

// ============================================================================
// Default States
// ============================================================================

const defaultIncomeAllocation: IncomeAllocationState = {
  step: 'input',
  incomeAmount: null,
  selectedTemplate: null,
  customAllocations: [],
  suggestionsFeedback: [],
};

const defaultForecasting: ForecastingState = {
  selectedEnvelopeId: null,
  daysAhead: 30,
  showConfidence: true,
  showRecommendations: true,
};

const defaultViewPreferences: ViewPreferences = {
  hybridView: 'combined',
  showEnvelopeDetails: true,
  showBudgetDetails: true,
  chartType: 'line',
  timeRange: 'month',
};

const defaultFilters: FilterState = {
  envelopeTypes: [],
  budgetCycles: [],
  healthScoreRange: [0, 100],
  searchQuery: '',
};

const defaultModals: ModalState = {
  isCreateEnvelopeModalOpen: false,
  isCreateBudgetModalOpen: false,
  isIncomeAllocationModalOpen: false,
  isForecastDetailModalOpen: false,
  isHealthScoreModalOpen: false,
  isTemplateSelectionModalOpen: false,
};

// ============================================================================
// Store
// ============================================================================

export const useBudgetsV3UIStore = create<BudgetsV3UIState>()(
  persist(
    (set) => ({
      // Initial state
      activeTab: 'overview',
      incomeAllocation: defaultIncomeAllocation,
      forecasting: defaultForecasting,
      viewPreferences: defaultViewPreferences,
      filters: defaultFilters,
      modals: defaultModals,

      // Tab Management
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Income Allocation Actions
      setIncomeAllocationStep: (step) =>
        set((state) => ({
          incomeAllocation: { ...state.incomeAllocation, step },
        })),

      setIncomeAmount: (incomeAmount) =>
        set((state) => ({
          incomeAllocation: { ...state.incomeAllocation, incomeAmount },
        })),

      setSelectedTemplate: (selectedTemplate) =>
        set((state) => ({
          incomeAllocation: { ...state.incomeAllocation, selectedTemplate },
        })),

      addCustomAllocation: (allocation) =>
        set((state) => ({
          incomeAllocation: {
            ...state.incomeAllocation,
            customAllocations: [...state.incomeAllocation.customAllocations, allocation],
          },
        })),

      updateCustomAllocation: (envelopeId, amount) =>
        set((state) => ({
          incomeAllocation: {
            ...state.incomeAllocation,
            customAllocations: state.incomeAllocation.customAllocations.map((alloc) =>
              alloc.envelopeId === envelopeId ? { ...alloc, amount } : alloc
            ),
          },
        })),

      removeCustomAllocation: (envelopeId) =>
        set((state) => ({
          incomeAllocation: {
            ...state.incomeAllocation,
            customAllocations: state.incomeAllocation.customAllocations.filter(
              (alloc) => alloc.envelopeId !== envelopeId
            ),
          },
        })),

      addAllocationFeedback: (feedback) =>
        set((state) => ({
          incomeAllocation: {
            ...state.incomeAllocation,
            suggestionsFeedback: [...state.incomeAllocation.suggestionsFeedback, feedback],
          },
        })),

      resetIncomeAllocation: () =>
        set({
          incomeAllocation: defaultIncomeAllocation,
        }),

      // Forecasting Actions
      setSelectedEnvelopeId: (selectedEnvelopeId) =>
        set((state) => ({
          forecasting: { ...state.forecasting, selectedEnvelopeId },
        })),

      setDaysAhead: (daysAhead) =>
        set((state) => ({
          forecasting: { ...state.forecasting, daysAhead },
        })),

      setShowConfidence: (showConfidence) =>
        set((state) => ({
          forecasting: { ...state.forecasting, showConfidence },
        })),

      setShowRecommendations: (showRecommendations) =>
        set((state) => ({
          forecasting: { ...state.forecasting, showRecommendations },
        })),

      // View Preferences Actions
      setHybridView: (hybridView) =>
        set((state) => ({
          viewPreferences: { ...state.viewPreferences, hybridView },
        })),

      setShowEnvelopeDetails: (showEnvelopeDetails) =>
        set((state) => ({
          viewPreferences: { ...state.viewPreferences, showEnvelopeDetails },
        })),

      setShowBudgetDetails: (showBudgetDetails) =>
        set((state) => ({
          viewPreferences: { ...state.viewPreferences, showBudgetDetails },
        })),

      setChartType: (chartType) =>
        set((state) => ({
          viewPreferences: { ...state.viewPreferences, chartType },
        })),

      setTimeRange: (timeRange) =>
        set((state) => ({
          viewPreferences: { ...state.viewPreferences, timeRange },
        })),

      // Filter Actions
      setEnvelopeTypeFilter: (envelopeTypes) =>
        set((state) => ({
          filters: { ...state.filters, envelopeTypes },
        })),

      setBudgetCyclesFilter: (budgetCycles) =>
        set((state) => ({
          filters: { ...state.filters, budgetCycles },
        })),

      setHealthScoreRange: (healthScoreRange) =>
        set((state) => ({
          filters: { ...state.filters, healthScoreRange },
        })),

      setSearchQuery: (searchQuery) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery },
        })),

      clearFilters: () =>
        set({
          filters: defaultFilters,
        }),

      // Modal Actions
      openCreateEnvelopeModal: () =>
        set((state) => ({
          modals: { ...state.modals, isCreateEnvelopeModalOpen: true },
        })),

      closeCreateEnvelopeModal: () =>
        set((state) => ({
          modals: { ...state.modals, isCreateEnvelopeModalOpen: false },
        })),

      openCreateBudgetModal: () =>
        set((state) => ({
          modals: { ...state.modals, isCreateBudgetModalOpen: true },
        })),

      closeCreateBudgetModal: () =>
        set((state) => ({
          modals: { ...state.modals, isCreateBudgetModalOpen: false },
        })),

      openIncomeAllocationModal: () =>
        set((state) => ({
          modals: { ...state.modals, isIncomeAllocationModalOpen: true },
        })),

      closeIncomeAllocationModal: () =>
        set((state) => ({
          modals: { ...state.modals, isIncomeAllocationModalOpen: false },
        })),

      openForecastDetailModal: () =>
        set((state) => ({
          modals: { ...state.modals, isForecastDetailModalOpen: true },
        })),

      closeForecastDetailModal: () =>
        set((state) => ({
          modals: { ...state.modals, isForecastDetailModalOpen: false },
        })),

      openHealthScoreModal: () =>
        set((state) => ({
          modals: { ...state.modals, isHealthScoreModalOpen: true },
        })),

      closeHealthScoreModal: () =>
        set((state) => ({
          modals: { ...state.modals, isHealthScoreModalOpen: false },
        })),

      openTemplateSelectionModal: () =>
        set((state) => ({
          modals: { ...state.modals, isTemplateSelectionModalOpen: true },
        })),

      closeTemplateSelectionModal: () =>
        set((state) => ({
          modals: { ...state.modals, isTemplateSelectionModalOpen: false },
        })),
    }),
    {
      name: 'budgets-v3-ui-store',
      // Only persist view preferences and filters
      partialize: (state) => ({
        viewPreferences: state.viewPreferences,
        filters: state.filters,
      }),
    }
  )
);
