import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  BankAccountType,
} from '@/lib/types/banking';

interface BankingState {
  // UI Selection State
  selectedAccountId: string | null;

  // Real-time sync state (UI progress tracking)
  realtimeSyncStates: Record<string, {
    progress: number;
    status: 'queued' | 'processing' | 'syncing' | 'syncing_balance' | 'syncing_transactions' | 'completed' | 'failed';
    message?: string;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
    syncedData?: string[];
    jobId?: string;
  }>;
  realtimeSyncConnected: boolean;
  realtimeSyncError: string | null;

  // Filters (UI state)
  filters: {
    accountTypes: BankAccountType[];
    institutions: string[];
    transactionTypes: ('debit' | 'credit')[];
    categories: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
    amountRange: {
      min: number | null;
      max: number | null;
    };
  };

  // View preferences (UI state)
  viewPreferences: {
    accountsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    dashboardChartType: 'area' | 'line' | 'bar' | 'pie';
    showInactiveAccounts: boolean;
    hideSmallAmounts: boolean;
    smallAmountThreshold: number;
    defaultCurrency: string;
  };

  // Teller Connect modal state (UI)
  tellerConnect: {
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
  };

  // Stripe Connect modal state (UI)
  stripeConnect: {
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

interface BankingActions {
  // Selection actions (UI state)
  selectAccount: (accountId: string | null) => void;

  // Real-time sync actions (UI progress tracking)
  setRealtimeSyncState: (accountId: string, state: BankingState['realtimeSyncStates'][string]) => void;
  updateRealtimeSyncProgress: (accountId: string, progress: number, status: BankingState['realtimeSyncStates'][string]['status'], message?: string) => void;
  completeRealtimeSync: (accountId: string, syncedData?: string[]) => void;
  failRealtimeSync: (accountId: string, error: string) => void;
  clearRealtimeSyncState: (accountId: string) => void;
  setRealtimeSyncConnected: (connected: boolean) => void;
  setRealtimeSyncError: (error: string | null) => void;

  // Filter actions (UI state)
  setAccountTypeFilter: (types: BankAccountType[]) => void;
  setInstitutionFilter: (institutions: string[]) => void;
  setTransactionTypeFilter: (types: ('debit' | 'credit')[]) => void;
  setCategoryFilter: (categories: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  setAmountRangeFilter: (min: number | null, max: number | null) => void;
  clearFilters: () => void;

  // View preference actions (UI state)
  setAccountsView: (view: 'grid' | 'list') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  setDashboardChartType: (type: 'area' | 'line' | 'bar' | 'pie') => void;
  toggleShowInactiveAccounts: () => void;
  toggleHideSmallAmounts: () => void;
  setSmallAmountThreshold: (threshold: number) => void;
  setDefaultCurrency: (currency: string) => void;

  // Teller Connect modal actions (UI)
  setTellerConnectOpen: (isOpen: boolean) => void;
  setTellerConnectLoading: (isLoading: boolean) => void;
  setTellerConnectError: (error: string | null) => void;

  // Stripe Connect modal actions (UI)
  setStripeConnectOpen: (isOpen: boolean) => void;
  setStripeConnectLoading: (isLoading: boolean) => void;
  setStripeConnectError: (error: string | null) => void;

  // Utility actions
  resetState: () => void;
}

type BankingStore = BankingState & BankingActions;

const initialState: BankingState = {
  // UI Selection State
  selectedAccountId: null,

  // Real-time sync state (UI progress tracking)
  realtimeSyncStates: {},
  realtimeSyncConnected: false,
  realtimeSyncError: null,

  // Filters (UI state)
  filters: {
    accountTypes: [],
    institutions: [],
    transactionTypes: [],
    categories: [],
    dateRange: {
      from: null,
      to: null,
    },
    amountRange: {
      min: null,
      max: null,
    },
  },

  // View preferences (UI state)
  viewPreferences: {
    accountsView: 'list',
    transactionsView: 'detailed',
    dashboardChartType: 'area',
    showInactiveAccounts: false,
    hideSmallAmounts: true,
    smallAmountThreshold: 1.0, // $1 USD
    defaultCurrency: 'USD',
  },

  // Teller Connect modal state (UI)
  tellerConnect: {
    isOpen: false,
    isLoading: false,
    error: null,
  },

  // Stripe Connect modal state (UI)
  stripeConnect: {
    isOpen: false,
    isLoading: false,
    error: null,
  },
};

export const useBankingStore = create<BankingStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // Selection actions (UI state)
        selectAccount: (accountId) =>
          set((state) => {
            state.selectedAccountId = accountId;
          }, false, 'selectAccount'),

        // Real-time sync actions (UI progress tracking)
        setRealtimeSyncState: (accountId, syncState) =>
          set((state) => {
            state.realtimeSyncStates[accountId] = syncState;
          }, false, 'setRealtimeSyncState'),

        updateRealtimeSyncProgress: (accountId, progress, status, message) =>
          set((state) => {
            if (!state.realtimeSyncStates[accountId]) {
              state.realtimeSyncStates[accountId] = {
                progress: 0,
                status: 'queued',
              };
            }
            state.realtimeSyncStates[accountId].progress = progress;
            state.realtimeSyncStates[accountId].status = status;
            if (message) {
              state.realtimeSyncStates[accountId].message = message;
            }
            if (status === 'syncing' && !state.realtimeSyncStates[accountId].startedAt) {
              state.realtimeSyncStates[accountId].startedAt = new Date();
            }
          }, false, 'updateRealtimeSyncProgress'),

        completeRealtimeSync: (accountId, syncedData) =>
          set((state) => {
            if (state.realtimeSyncStates[accountId]) {
              state.realtimeSyncStates[accountId].progress = 100;
              state.realtimeSyncStates[accountId].status = 'completed';
              state.realtimeSyncStates[accountId].completedAt = new Date();
              if (syncedData) {
                state.realtimeSyncStates[accountId].syncedData = syncedData;
              }
            }
          }, false, 'completeRealtimeSync'),

        failRealtimeSync: (accountId, error) =>
          set((state) => {
            if (state.realtimeSyncStates[accountId]) {
              state.realtimeSyncStates[accountId].status = 'failed';
              state.realtimeSyncStates[accountId].error = error;
              state.realtimeSyncStates[accountId].completedAt = new Date();
            }
          }, false, 'failRealtimeSync'),

        clearRealtimeSyncState: (accountId) =>
          set((state) => {
            delete state.realtimeSyncStates[accountId];
          }, false, 'clearRealtimeSyncState'),

        setRealtimeSyncConnected: (connected) =>
          set((state) => {
            state.realtimeSyncConnected = connected;
            if (connected) {
              state.realtimeSyncError = null;
            }
          }, false, 'setRealtimeSyncConnected'),

        setRealtimeSyncError: (error) =>
          set((state) => {
            state.realtimeSyncError = error;
            if (error) {
              state.realtimeSyncConnected = false;
            }
          }, false, 'setRealtimeSyncError'),

        // Filter actions (UI state)
        setAccountTypeFilter: (types) =>
          set((state) => {
            state.filters.accountTypes = types;
          }, false, 'setAccountTypeFilter'),

        setInstitutionFilter: (institutions) =>
          set((state) => {
            state.filters.institutions = institutions;
          }, false, 'setInstitutionFilter'),

        setTransactionTypeFilter: (types) =>
          set((state) => {
            state.filters.transactionTypes = types;
          }, false, 'setTransactionTypeFilter'),

        setCategoryFilter: (categories) =>
          set((state) => {
            state.filters.categories = categories;
          }, false, 'setCategoryFilter'),

        setDateRangeFilter: (from, to) =>
          set((state) => {
            state.filters.dateRange.from = from;
            state.filters.dateRange.to = to;
          }, false, 'setDateRangeFilter'),

        setAmountRangeFilter: (min, max) =>
          set((state) => {
            state.filters.amountRange.min = min;
            state.filters.amountRange.max = max;
          }, false, 'setAmountRangeFilter'),

        clearFilters: () =>
          set((state) => {
            state.filters = {
              accountTypes: [],
              institutions: [],
              transactionTypes: [],
              categories: [],
              dateRange: { from: null, to: null },
              amountRange: { min: null, max: null },
            };
          }, false, 'clearFilters'),

        // View preference actions (UI state)
        setAccountsView: (view) =>
          set((state) => {
            state.viewPreferences.accountsView = view;
          }, false, 'setAccountsView'),

        setTransactionsView: (view) =>
          set((state) => {
            state.viewPreferences.transactionsView = view;
          }, false, 'setTransactionsView'),

        setDashboardChartType: (type) =>
          set((state) => {
            state.viewPreferences.dashboardChartType = type;
          }, false, 'setDashboardChartType'),

        toggleShowInactiveAccounts: () =>
          set((state) => {
            state.viewPreferences.showInactiveAccounts = !state.viewPreferences.showInactiveAccounts;
          }, false, 'toggleShowInactiveAccounts'),

        toggleHideSmallAmounts: () =>
          set((state) => {
            state.viewPreferences.hideSmallAmounts = !state.viewPreferences.hideSmallAmounts;
          }, false, 'toggleHideSmallAmounts'),

        setSmallAmountThreshold: (threshold) =>
          set((state) => {
            state.viewPreferences.smallAmountThreshold = threshold;
          }, false, 'setSmallAmountThreshold'),

        setDefaultCurrency: (currency) =>
          set((state) => {
            state.viewPreferences.defaultCurrency = currency;
          }, false, 'setDefaultCurrency'),

        // Teller Connect modal actions (UI)
        setTellerConnectOpen: (isOpen) =>
          set((state) => {
            state.tellerConnect.isOpen = isOpen;
          }, false, 'setTellerConnectOpen'),

        setTellerConnectLoading: (isLoading) =>
          set((state) => {
            state.tellerConnect.isLoading = isLoading;
          }, false, 'setTellerConnectLoading'),

        setTellerConnectError: (error) =>
          set((state) => {
            state.tellerConnect.error = error;
          }, false, 'setTellerConnectError'),

        // Stripe Connect modal actions (UI)
        setStripeConnectOpen: (isOpen) =>
          set((state) => {
            state.stripeConnect.isOpen = isOpen;
          }, false, 'setStripeConnectOpen'),

        setStripeConnectLoading: (isLoading) =>
          set((state) => {
            state.stripeConnect.isLoading = isLoading;
          }, false, 'setStripeConnectLoading'),

        setStripeConnectError: (error) =>
          set((state) => {
            state.stripeConnect.error = error;
          }, false, 'setStripeConnectError'),

        // Utility actions
        resetState: () =>
          set((state) => {
            Object.assign(state, initialState);
          }, false, 'resetState'),
      })),
      {
        name: 'banking-ui-store',
      }
    ),
    {
      name: 'banking-store',
    }
  )
);

// Selectors
export const selectActiveRealtimeSyncCount = (state: BankingStore) => {
  return Object.values(state.realtimeSyncStates).filter(
    (syncState) =>
      syncState.status === 'syncing' ||
      syncState.status === 'syncing_balance' ||
      syncState.status === 'syncing_transactions' ||
      syncState.status === 'processing' ||
      syncState.status === 'queued'
  ).length;
};

export const selectAccountSyncState = (state: BankingStore, accountId: string) => {
  return state.realtimeSyncStates[accountId];
};
