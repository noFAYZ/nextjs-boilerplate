'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface TransactionSearchFilters {
  searchQuery: string;
  amountRange: { min: number | null; max: number | null };
  dateRange: { from: Date | null; to: Date | null } | null;
  categoryIds: string[];
  merchantIds: string[];
  transactionTypes: ('INCOME' | 'EXPENSE' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL')[];
  statuses: ('POSTED' | 'PENDING' | 'CLEARED')[];
  isDuplicate: boolean | null;
  tags: string[];
}

interface AccountDetailUIState {
  // Active tab
  activeTab: 'overview' | 'transactions' | 'analytics' | 'categories' | 'reconciliation' | 'settings';
  setActiveTab: (tab: AccountDetailUIState['activeTab']) => void;

  // Transaction selection and filters
  selectedTransactionId: string | null;
  setSelectedTransactionId: (id: string | null) => void;

  transactionFilters: TransactionSearchFilters;
  setTransactionFilters: (filters: Partial<TransactionSearchFilters>) => void;
  clearTransactionFilters: () => void;

  // View preferences
  chartTimeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  setChartTimeRange: (range: '7d' | '30d' | '90d' | '1y' | 'all') => void;

  transactionViewMode: 'list' | 'table' | 'card';
  setTransactionViewMode: (mode: 'list' | 'table' | 'card') => void;

  // Reconciliation mode
  reconciliationMode: boolean;
  toggleReconciliationMode: () => void;

  // Category management
  categoryManagementMode: boolean;
  toggleCategoryManagementMode: () => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Bulk operations for transactions
  selectedTransactionIds: string[];
  toggleTransactionSelection: (id: string) => void;
  setSelectedTransactions: (ids: string[]) => void;
  clearSelectedTransactions: () => void;

  // Advanced filtering
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;

  // Pagination for account transactions
  transactionPage: number;
  transactionLimit: number;
  setTransactionPage: (page: number) => void;
  setTransactionLimit: (limit: number) => void;

  // Analytics period
  analyticsPeriod: '7d' | '30d' | '90d' | '1y' | 'all';
  setAnalyticsPeriod: (period: '7d' | '30d' | '90d' | '1y' | 'all') => void;

  // Duplicate reconciliation
  duplicateReconciliationOpen: boolean;
  setDuplicateReconciliationOpen: (open: boolean) => void;

  // Account lifecycle
  accountLifecycleDialogOpen: boolean;
  setAccountLifecycleDialogOpen: (open: boolean) => void;

  // Connection details
  showConnectionDetails: boolean;
  toggleConnectionDetails: () => void;

  // Notes editor
  notesEditorOpen: boolean;
  editingNoteId: string | null;
  setNotesEditorOpen: (open: boolean, noteId?: string | null) => void;

  // Reset all UI state
  resetUIState: () => void;
}

const defaultTransactionFilters: TransactionSearchFilters = {
  searchQuery: '',
  amountRange: { min: null, max: null },
  dateRange: null,
  categoryIds: [],
  merchantIds: [],
  transactionTypes: [],
  statuses: [],
  isDuplicate: null,
  tags: [],
};

export const useAccountDetailUIStore = create<AccountDetailUIState>()(
  devtools(
    persist(
      immer((set) => ({
        // Active tab
        activeTab: 'overview',
        setActiveTab: (tab) => set({ activeTab: tab }),

        // Transaction selection
        selectedTransactionId: null,
        setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),

        // Transaction filters
        transactionFilters: defaultTransactionFilters,
        setTransactionFilters: (newFilters) =>
          set((state) => {
            state.transactionFilters = {
              ...state.transactionFilters,
              ...newFilters,
            };
          }),
        clearTransactionFilters: () =>
          set((state) => {
            state.transactionFilters = defaultTransactionFilters;
          }),

        // View preferences
        chartTimeRange: '30d',
        setChartTimeRange: (range) => set({ chartTimeRange: range }),

        transactionViewMode: 'table',
        setTransactionViewMode: (mode) => set({ transactionViewMode: mode }),

        // Reconciliation mode
        reconciliationMode: false,
        toggleReconciliationMode: () =>
          set((state) => {
            state.reconciliationMode = !state.reconciliationMode;
          }),

        // Category management
        categoryManagementMode: false,
        toggleCategoryManagementMode: () =>
          set((state) => {
            state.categoryManagementMode = !state.categoryManagementMode;
          }),
        selectedCategoryId: null,
        setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

        // Bulk operations
        selectedTransactionIds: [],
        toggleTransactionSelection: (id) =>
          set((state) => {
            const index = state.selectedTransactionIds.indexOf(id);
            if (index > -1) {
              state.selectedTransactionIds.splice(index, 1);
            } else {
              state.selectedTransactionIds.push(id);
            }
          }),
        setSelectedTransactions: (ids) =>
          set({ selectedTransactionIds: ids }),
        clearSelectedTransactions: () =>
          set({ selectedTransactionIds: [] }),

        // Advanced filtering
        showAdvancedFilters: false,
        toggleAdvancedFilters: () =>
          set((state) => {
            state.showAdvancedFilters = !state.showAdvancedFilters;
          }),

        // Pagination
        transactionPage: 1,
        transactionLimit: 50,
        setTransactionPage: (page) => set({ transactionPage: page }),
        setTransactionLimit: (limit) => set({ transactionLimit: limit }),

        // Analytics
        analyticsPeriod: '30d',
        setAnalyticsPeriod: (period) => set({ analyticsPeriod: period }),

        // Duplicate reconciliation
        duplicateReconciliationOpen: false,
        setDuplicateReconciliationOpen: (open) =>
          set({ duplicateReconciliationOpen: open }),

        // Account lifecycle
        accountLifecycleDialogOpen: false,
        setAccountLifecycleDialogOpen: (open) =>
          set({ accountLifecycleDialogOpen: open }),

        // Connection details
        showConnectionDetails: false,
        toggleConnectionDetails: () =>
          set((state) => {
            state.showConnectionDetails = !state.showConnectionDetails;
          }),

        // Notes editor
        notesEditorOpen: false,
        editingNoteId: null,
        setNotesEditorOpen: (open, noteId = null) =>
          set({ notesEditorOpen: open, editingNoteId: noteId }),

        // Reset UI state
        resetUIState: () =>
          set((state) => {
            state.activeTab = 'overview';
            state.selectedTransactionId = null;
            state.transactionFilters = defaultTransactionFilters;
            state.chartTimeRange = '30d';
            state.transactionViewMode = 'table';
            state.reconciliationMode = false;
            state.categoryManagementMode = false;
            state.selectedCategoryId = null;
            state.selectedTransactionIds = [];
            state.showAdvancedFilters = false;
            state.transactionPage = 1;
            state.analyticsPeriod = '30d';
            state.duplicateReconciliationOpen = false;
            state.accountLifecycleDialogOpen = false;
            state.showConnectionDetails = false;
            state.notesEditorOpen = false;
            state.editingNoteId = null;
          }),
      })),
      {
        name: 'account-detail-ui-store',
        partialize: (state) => ({
          activeTab: state.activeTab,
          chartTimeRange: state.chartTimeRange,
          transactionViewMode: state.transactionViewMode,
          analyticsPeriod: state.analyticsPeriod,
          transactionLimit: state.transactionLimit,
        }),
      }
    )
  )
);
