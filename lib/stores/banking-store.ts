import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  BankAccount,
  BankTransaction,
  BankingOverview,
  BankAccountType,
  BankingSyncStatus,
  BankTransactionParams,
  BankSyncJob,
  TellerEnrollment,
  BankingDashboardData
} from '@/lib/types/banking';
import type { PaginationInfo } from '@/lib/types/crypto';

interface BankingState {
  // Bank Accounts
  accounts: BankAccount[];
  selectedAccount: BankAccount | null;
  accountsLoading: boolean;
  accountsError: string | null;

  // Banking Overview
  overview: BankingOverview | null;
  overviewLoading: boolean;
  overviewError: string | null;

  // Transactions
  transactions: BankTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsPagination: PaginationInfo | null;

  // Teller Enrollments
  enrollments: TellerEnrollment[];
  enrollmentsLoading: boolean;
  enrollmentsError: string | null;

  // Real-time sync state
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

  // Filters and UI state
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

  // View preferences
  viewPreferences: {
    accountsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    dashboardChartType: 'area' | 'line' | 'bar' | 'pie';
    showInactiveAccounts: boolean;
    hideSmallAmounts: boolean;
    smallAmountThreshold: number;
    defaultCurrency: string;
  };

  // Teller Connect state
  tellerConnect: {
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

interface BankingActions {
  // Account actions
  setAccounts: (accounts: BankAccount[]) => void;
  addAccount: (account: BankAccount) => void;
  updateAccount: (id: string, updates: Partial<BankAccount>) => void;
  removeAccount: (id: string) => void;
  selectAccount: (account: BankAccount | null) => void;
  setAccountsLoading: (loading: boolean) => void;
  setAccountsError: (error: string | null) => void;

  // Overview actions
  setOverview: (overview: BankingOverview) => void;
  setOverviewLoading: (loading: boolean) => void;
  setOverviewError: (error: string | null) => void;

  // Transaction actions
  setTransactions: (transactions: BankTransaction[]) => void;
  addTransaction: (transaction: BankTransaction) => void;
  updateTransaction: (id: string, updates: Partial<BankTransaction>) => void;
  setTransactionsLoading: (loading: boolean) => void;
  setTransactionsError: (error: string | null) => void;
  setTransactionsPagination: (pagination: PaginationInfo | null) => void;

  // Enrollment actions
  setEnrollments: (enrollments: TellerEnrollment[]) => void;
  addEnrollment: (enrollment: TellerEnrollment) => void;
  updateEnrollment: (id: string, updates: Partial<TellerEnrollment>) => void;
  setEnrollmentsLoading: (loading: boolean) => void;
  setEnrollmentsError: (error: string | null) => void;

  // Real-time sync actions
  setRealtimeSyncState: (accountId: string, state: BankingState['realtimeSyncStates'][string]) => void;
  updateRealtimeSyncProgress: (accountId: string, progress: number, status: BankingState['realtimeSyncStates'][string]['status'], message?: string) => void;
  completeRealtimeSync: (accountId: string, syncedData?: string[]) => void;
  failRealtimeSync: (accountId: string, error: string) => void;
  clearRealtimeSyncState: (accountId: string) => void;
  setRealtimeSyncConnected: (connected: boolean) => void;
  setRealtimeSyncError: (error: string | null) => void;

  // Filter actions
  setAccountTypeFilter: (types: BankAccountType[]) => void;
  setInstitutionFilter: (institutions: string[]) => void;
  setTransactionTypeFilter: (types: ('debit' | 'credit')[]) => void;
  setCategoryFilter: (categories: string[]) => void;
  setDateRangeFilter: (from: Date | null, to: Date | null) => void;
  setAmountRangeFilter: (min: number | null, max: number | null) => void;
  clearFilters: () => void;

  // View preference actions
  setAccountsView: (view: 'grid' | 'list') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  setDashboardChartType: (type: 'area' | 'line' | 'bar' | 'pie') => void;
  toggleShowInactiveAccounts: () => void;
  toggleHideSmallAmounts: () => void;
  setSmallAmountThreshold: (threshold: number) => void;
  setDefaultCurrency: (currency: string) => void;

  // Teller Connect actions
  setTellerConnectOpen: (isOpen: boolean) => void;
  setTellerConnectLoading: (isLoading: boolean) => void;
  setTellerConnectError: (error: string | null) => void;

  // Utility actions
  resetState: () => void;
  clearErrors: () => void;
  clearAllData: () => void;
}

type BankingStore = BankingState & BankingActions;

const initialState: BankingState = {
  // Bank Accounts
  accounts: [],
  selectedAccount: null,
  accountsLoading: false,
  accountsError: null,

  // Banking Overview
  overview: null,
  overviewLoading: false,
  overviewError: null,

  // Transactions
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionsPagination: null,

  // Teller Enrollments
  enrollments: [],
  enrollmentsLoading: false,
  enrollmentsError: null,

  // Real-time sync state
  realtimeSyncStates: {},
  realtimeSyncConnected: false,
  realtimeSyncError: null,

  // Filters
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

  // View preferences
  viewPreferences: {
    accountsView: 'list',
    transactionsView: 'detailed',
    dashboardChartType: 'area',
    showInactiveAccounts: false,
    hideSmallAmounts: true,
    smallAmountThreshold: 1.0, // $1 USD
    defaultCurrency: 'USD',
  },

  // Teller Connect state
  tellerConnect: {
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

        // Account actions
        setAccounts: (accounts) =>
          set((state) => {
            state.accounts = accounts;
          }, false, 'setAccounts'),

        addAccount: (account) =>
          set((state) => {
            state.accounts.push(account);
          }, false, 'addAccount'),

        updateAccount: (id, updates) =>
          set((state) => {
            const index = state.accounts.findIndex((a) => a.id === id);
            if (index !== -1) {
              Object.assign(state.accounts[index], updates);
            }
          }, false, 'updateAccount'),

        removeAccount: (id) =>
          set((state) => {
            state.accounts = state.accounts.filter((a) => a.id !== id);
            if (state.selectedAccount?.id === id) {
              state.selectedAccount = null;
            }
            // Clear sync state for removed account
            delete state.realtimeSyncStates[id];
          }, false, 'removeAccount'),

        selectAccount: (account) =>
          set((state) => {
            state.selectedAccount = account;
          }, false, 'selectAccount'),

        setAccountsLoading: (loading) =>
          set((state) => {
            state.accountsLoading = loading;
          }, false, 'setAccountsLoading'),

        setAccountsError: (error) =>
          set((state) => {
            state.accountsError = error;
          }, false, 'setAccountsError'),

        // Overview actions
        setOverview: (overview) =>
          set((state) => {
            state.overview = overview;
          }, false, 'setOverview'),

        setOverviewLoading: (loading) =>
          set((state) => {
            state.overviewLoading = loading;
          }, false, 'setOverviewLoading'),

        setOverviewError: (error) =>
          set((state) => {
            state.overviewError = error;
          }, false, 'setOverviewError'),

        // Transaction actions
        setTransactions: (transactions) =>
          set((state) => {
            state.transactions = transactions;
          }, false, 'setTransactions'),

        addTransaction: (transaction) =>
          set((state) => {
            state.transactions.unshift(transaction);
          }, false, 'addTransaction'),

        updateTransaction: (id, updates) =>
          set((state) => {
            const index = state.transactions.findIndex((t) => t.id === id);
            if (index !== -1) {
              Object.assign(state.transactions[index], updates);
            }
          }, false, 'updateTransaction'),

        setTransactionsLoading: (loading) =>
          set((state) => {
            state.transactionsLoading = loading;
          }, false, 'setTransactionsLoading'),

        setTransactionsError: (error) =>
          set((state) => {
            state.transactionsError = error;
          }, false, 'setTransactionsError'),

        setTransactionsPagination: (pagination) =>
          set((state) => {
            state.transactionsPagination = pagination;
          }, false, 'setTransactionsPagination'),

        // Enrollment actions
        setEnrollments: (enrollments) =>
          set((state) => {
            state.enrollments = enrollments;
          }, false, 'setEnrollments'),

        addEnrollment: (enrollment) =>
          set((state) => {
            state.enrollments.push(enrollment);
          }, false, 'addEnrollment'),

        updateEnrollment: (id, updates) =>
          set((state) => {
            const index = state.enrollments.findIndex((e) => e.id === id);
            if (index !== -1) {
              Object.assign(state.enrollments[index], updates);
            }
          }, false, 'updateEnrollment'),

        setEnrollmentsLoading: (loading) =>
          set((state) => {
            state.enrollmentsLoading = loading;
          }, false, 'setEnrollmentsLoading'),

        setEnrollmentsError: (error) =>
          set((state) => {
            state.enrollmentsError = error;
          }, false, 'setEnrollmentsError'),

        // Real-time sync actions
        setRealtimeSyncState: (accountId, syncState) =>
          set((state) => {
            state.realtimeSyncStates[accountId] = syncState;
          }, false, 'setRealtimeSyncState'),

        updateRealtimeSyncProgress: (accountId, progress, status, message) =>
          set((state) => {
            if (!state.realtimeSyncStates[accountId]) {
              state.realtimeSyncStates[accountId] = {
                progress: 0,
                status: 'queued'
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

        // Filter actions
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

        // View preference actions
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

        // Teller Connect actions
        setTellerConnectOpen: (isOpen) =>
          set((state) => {
            state.tellerConnect.isOpen = isOpen;
            if (!isOpen) {
              state.tellerConnect.error = null;
            }
          }, false, 'setTellerConnectOpen'),

        setTellerConnectLoading: (isLoading) =>
          set((state) => {
            state.tellerConnect.isLoading = isLoading;
          }, false, 'setTellerConnectLoading'),

        setTellerConnectError: (error) =>
          set((state) => {
            state.tellerConnect.error = error;
            if (error) {
              state.tellerConnect.isLoading = false;
            }
          }, false, 'setTellerConnectError'),

        // Utility actions
        resetState: () =>
          set((state) => {
            Object.assign(state, initialState);
          }, false, 'resetState'),

        clearErrors: () =>
          set((state) => {
            state.accountsError = null;
            state.overviewError = null;
            state.transactionsError = null;
            state.enrollmentsError = null;
            state.realtimeSyncError = null;
            state.tellerConnect.error = null;
          }, false, 'clearErrors'),

        clearAllData: () =>
          set((state) => {
            Object.assign(state, initialState);
          }, false, 'clearAllData'),
      })),
      {
        name: 'banking-store',
        partialize: (state) => ({
          // Persist only view preferences and filters
          viewPreferences: state.viewPreferences,
          filters: state.filters,
        }),
      }
    ),
    {
      name: 'banking-store',
    }
  )
);

// Selectors for filtered data
export const selectFilteredAccounts = (state: BankingStore) => {
  const { accounts, filters, viewPreferences } = state;

  return accounts.filter((account) => {
    // Filter by account types
    if (filters.accountTypes.length > 0 && !filters.accountTypes.includes(account.type)) {
      return false;
    }

    // Filter by institutions
    if (filters.institutions.length > 0 && !filters.institutions.includes(account.institutionName)) {
      return false;
    }

    // Hide inactive accounts if preference is set
    if (!viewPreferences.showInactiveAccounts && !account.isActive) {
      return false;
    }

    // Hide small amounts if preference is set
    if (viewPreferences.hideSmallAmounts &&
        Math.abs(account.balance) < viewPreferences.smallAmountThreshold) {
      return false;
    }

    return true;
  });
};

export const selectFilteredTransactions = (state: BankingStore) => {
  const { transactions, filters } = state;

  return transactions.filter((transaction) => {
    // Filter by transaction type
    if (filters.transactionTypes.length > 0 && !filters.transactionTypes.includes(transaction.type)) {
      return false;
    }

    // Filter by categories
    if (filters.categories.length > 0 && transaction.category &&
        !filters.categories.includes(transaction.category)) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (filters.dateRange.from && transactionDate < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && transactionDate > filters.dateRange.to) {
        return false;
      }
    }

    // Filter by amount range
    if (filters.amountRange.min !== null && Math.abs(transaction.amount) < filters.amountRange.min) {
      return false;
    }
    if (filters.amountRange.max !== null && Math.abs(transaction.amount) > filters.amountRange.max) {
      return false;
    }

    return true;
  });
};

export const selectTotalBankingValue = (state: BankingStore) => {
  return state.overview?.totalBalance || 0;
};

export const selectActiveRealtimeSyncCount = (state: BankingStore) => {
  return Object.values(state.realtimeSyncStates).filter(
    (syncState) => syncState.status === 'processing' ||
                   syncState.status === 'syncing' ||
                   syncState.status === 'syncing_balance' ||
                   syncState.status === 'syncing_transactions' ||
                   syncState.status === 'queued'
  ).length;
};

export const selectAccountSyncState = (state: BankingStore, accountId: string) => {
  return state.realtimeSyncStates[accountId];
};

export const selectAccountsByInstitution = (state: BankingStore) => {
  const accounts = selectFilteredAccounts(state);

  return accounts.reduce((acc, account) => {
    const institution = account.institutionName;
    if (!acc[institution]) {
      acc[institution] = [];
    }
    acc[institution].push(account);
    return acc;
  }, {} as Record<string, BankAccount[]>);
};

export const selectAccountsByType = (state: BankingStore) => {
  const accounts = selectFilteredAccounts(state);

  return accounts.reduce((acc, account) => {
    const type = account.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {} as Record<BankAccountType, BankAccount[]>);
};