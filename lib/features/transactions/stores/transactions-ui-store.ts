'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface TransactionFilters {
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

interface TransactionsUIState {
  // Tab selection
  activeTab: 'transactions' | 'categories' | 'rules';
  setActiveTab: (tab: 'transactions' | 'categories' | 'rules') => void;

  // Filters
  filters: TransactionFilters;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  clearFilters: () => void;
  resetFilters: () => void;

  // View preferences
  viewMode: 'list' | 'table' | 'card';
  setViewMode: (mode: 'list' | 'table' | 'card') => void;

  // Sorting
  sortBy: 'date' | 'amount' | 'merchant' | 'category';
  sortOrder: 'asc' | 'desc';
  setSortBy: (field: 'date' | 'amount' | 'merchant' | 'category') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Bulk operations
  selectedTransactionIds: string[];
  toggleTransactionSelection: (id: string) => void;
  setSelectedTransactions: (ids: string[]) => void;
  clearSelectedTransactions: () => void;
  selectAllTransactions: (ids: string[]) => void;

  // Pagination
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  // Date filter (legacy, kept for compatibility)
  dateRange: { from: Date | null; to: Date | null } | null;
  setDateRange: (range: { from: Date | null; to: Date | null } | null) => void;
  clearDateRange: () => void;
}

const defaultFilters: TransactionFilters = {
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

export const useTransactionsUIStore = create<TransactionsUIState>()(
  devtools(
    persist(
      immer((set) => ({
        // Tab selection
        activeTab: 'transactions',
        setActiveTab: (tab) => set({ activeTab: tab }),

        // Filters
        filters: defaultFilters,
        setFilters: (newFilters) =>
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
          }),
        clearFilters: () =>
          set((state) => {
            state.filters = defaultFilters;
          }),
        resetFilters: () =>
          set((state) => {
            state.filters = defaultFilters;
            state.selectedTransactionIds = [];
            state.page = 1;
          }),

        // View preferences
        viewMode: 'table',
        setViewMode: (mode) => set({ viewMode: mode }),

        // Sorting
        sortBy: 'date',
        sortOrder: 'desc',
        setSortBy: (field) => set({ sortBy: field }),
        setSortOrder: (order) => set({ sortOrder: order }),

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
        setSelectedTransactions: (ids) => set({ selectedTransactionIds: ids }),
        clearSelectedTransactions: () =>
          set({ selectedTransactionIds: [] }),
        selectAllTransactions: (ids) => set({ selectedTransactionIds: ids }),

        // Pagination
        page: 1,
        limit: 50,
        setPage: (page) => set({ page }),
        setLimit: (limit) => set({ limit }),

        // Date filter (legacy)
        dateRange: null,
        setDateRange: (range) => set({ dateRange: range }),
        clearDateRange: () => set({ dateRange: null }),
      })),
      {
        name: 'transactions-ui-store',
        partialize: (state) => ({
          filters: state.filters,
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          limit: state.limit,
        }),
      }
    )
  )
);
