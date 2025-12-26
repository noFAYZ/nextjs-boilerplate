'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TransactionsUIState {
  activeTab: 'transactions' | 'categories' | 'rules';
  setActiveTab: (tab: 'transactions' | 'categories' | 'rules') => void;

  // Date filter state
  dateRange: {
    from: Date | null;
    to: Date | null;
  } | null;
  setDateRange: (range: { from: Date | null; to: Date | null } | null) => void;
  clearDateRange: () => void;
}

export const useTransactionsUIStore = create<TransactionsUIState>()(
  persist(
    (set) => ({
      activeTab: 'transactions',
      setActiveTab: (tab) => set({ activeTab: tab }),

      dateRange: null,
      setDateRange: (range) => set({ dateRange: range }),
      clearDateRange: () => set({ dateRange: null }),
    }),
    {
      name: 'transactions-ui-store',
    }
  )
);
