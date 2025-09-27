# Banking Integration - Frontend Implementation Guide

This document outlines the frontend implementation required to integrate Teller.io banking functionality into MoneyMappr.

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Type Definitions](#type-definitions)
4. [Banking Store (Zustand)](#banking-store-zustand)
5. [API Service Layer](#api-service-layer)
6. [React Query Integration](#react-query-integration)
7. [UI Components](#ui-components)
8. [Real-time Sync Integration](#real-time-sync-integration)
9. [Page Updates](#page-updates)
10. [Integration with Account Groups](#integration-with-account-groups)
11. [Testing Strategy](#testing-strategy)

---

## Overview

The banking integration follows the same patterns as the existing crypto module, ensuring consistency and maintainability. Key integration points:

- **Zustand store** for banking state management
- **React Query** for server state and caching
- **SSE integration** for real-time sync updates
- **Teller Connect widget** for secure bank authentication
- **Account groups** extension for bank account organization

---

## Environment Setup

### 1. Environment Variables

Add to `.env`:

```env
# Teller.io Configuration
NEXT_PUBLIC_TELLER_APPLICATION_ID=your_teller_app_id
NEXT_PUBLIC_TELLER_ENVIRONMENT=sandbox  # or 'production'
```

### 2. Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "@teller-io/connect": "^1.x.x"
  }
}
```

---

## Type Definitions

### 1. Create Banking Types

**File**: `lib/types/banking.ts`

```typescript
// Teller Integration Types
export interface TellerEnrollment {
  accessToken: string;
  user: {
    id: string;
  };
  enrollment: {
    id: string;
    institution: {
      id: string;
      name: string;
    };
  };
  signatures: string[];
}

export interface TellerConfig {
  applicationId: string;
  environment: 'sandbox' | 'production';
  selectAccount?: 'single' | 'multiple';
  onSuccess: (enrollment: TellerEnrollment) => void;
  onExit?: () => void;
  onEvent?: (eventName: string, metadata: any) => void;
}

// Banking API Types (extend existing FinancialAccount)
export interface BankAccount extends FinancialAccount {
  tellerEnrollmentId?: string;
  tellerAccountId?: string;
  tellerInstitutionId?: string;
  lastTellerSync?: string;
  syncStatus?: 'connected' | 'syncing' | 'error' | 'disconnected';
}

export interface BankTransaction {
  id: string;
  accountId: string;
  tellerTransactionId: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  status: 'pending' | 'posted';
  type: 'debit' | 'credit';
  createdAt: string;
  updatedAt: string;
}

export interface ConnectBankRequest {
  enrollment: TellerEnrollment;
}

export interface SyncBankAccountRequest {
  accountId: string;
  fullSync?: boolean;
}

export interface BankingSyncProgress {
  accountId: string;
  progress: number;
  status: 'queued' | 'syncing' | 'syncing_transactions' | 'syncing_balance' | 'completed' | 'failed';
  message?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  syncedData?: string[];
}
```

### 2. Extend Account Groups Types

**File**: `lib/types/account-groups.ts` (extend existing)

```typescript
// Add to existing FinancialAccount interface
export interface FinancialAccount {
  // ... existing fields
  tellerEnrollmentId?: string;
  tellerAccountId?: string;
  tellerInstitutionId?: string;
  lastTellerSync?: string;
  syncStatus?: 'connected' | 'syncing' | 'error' | 'disconnected';
}
```

---

## Banking Store (Zustand)

### 1. Create Banking Store

**File**: `lib/stores/banking-store.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { BankAccount, BankTransaction, BankingSyncProgress } from '@/lib/types/banking';

interface BankingState {
  // Data
  accounts: BankAccount[];
  selectedAccount: BankAccount | null;
  transactions: BankTransaction[];

  // Loading states
  accountsLoading: boolean;
  transactionsLoading: boolean;
  connectingBank: boolean;

  // Error states
  accountsError: string | null;
  transactionsError: string | null;
  connectionError: string | null;

  // Real-time sync state (following crypto pattern)
  realtimeSyncStates: Record<string, BankingSyncProgress>;
  realtimeSyncConnected: boolean;
  realtimeSyncError: string | null;

  // Connection state
  isConnecting: boolean;
  connectionProgress: string | null;

  // Filters and UI state
  filters: {
    accountTypes: string[];
    dateRange: { start: string; end: string } | null;
    searchQuery: string;
  };

  // View preferences
  viewPreferences: {
    accountsView: 'grid' | 'list';
    transactionsView: 'detailed' | 'compact';
    showInactiveAccounts: boolean;
  };
}

interface BankingActions {
  // Account management
  setAccounts: (accounts: BankAccount[]) => void;
  addAccount: (account: BankAccount) => void;
  updateAccount: (accountId: string, updates: Partial<BankAccount>) => void;
  removeAccount: (accountId: string) => void;
  selectAccount: (account: BankAccount | null) => void;

  // Transaction management
  setTransactions: (transactions: BankTransaction[]) => void;
  addTransactions: (transactions: BankTransaction[]) => void;

  // Loading states
  setAccountsLoading: (loading: boolean) => void;
  setTransactionsLoading: (loading: boolean) => void;
  setConnectingBank: (connecting: boolean) => void;

  // Error states
  setAccountsError: (error: string | null) => void;
  setTransactionsError: (error: string | null) => void;
  setConnectionError: (error: string | null) => void;

  // Connection management
  startConnection: () => void;
  setConnectionProgress: (progress: string | null) => void;
  completeConnection: () => void;
  failConnection: (error: string) => void;

  // Real-time sync (following crypto pattern)
  updateRealtimeSyncProgress: (accountId: string, progress: number, status: string, message?: string) => void;
  completeRealtimeSync: (accountId: string, syncedData?: string[]) => void;
  failRealtimeSync: (accountId: string, error: string) => void;
  setRealtimeSyncConnected: (connected: boolean) => void;
  setRealtimeSyncError: (error: string | null) => void;
  clearRealtimeSyncState: (accountId: string) => void;

  // Filters and preferences
  setAccountTypeFilter: (types: string[]) => void;
  setDateRangeFilter: (range: { start: string; end: string } | null) => void;
  setSearchQuery: (query: string) => void;
  setAccountsView: (view: 'grid' | 'list') => void;
  setTransactionsView: (view: 'detailed' | 'compact') => void;
  toggleShowInactiveAccounts: () => void;

  // Utility actions
  clearErrors: () => void;
  resetFilters: () => void;
  resetState: () => void;
}

type BankingStore = BankingState & BankingActions;

const initialState: BankingState = {
  // Data
  accounts: [],
  selectedAccount: null,
  transactions: [],

  // Loading states
  accountsLoading: false,
  transactionsLoading: false,
  connectingBank: false,

  // Error states
  accountsError: null,
  transactionsError: null,
  connectionError: null,

  // Real-time sync state
  realtimeSyncStates: {},
  realtimeSyncConnected: false,
  realtimeSyncError: null,

  // Connection state
  isConnecting: false,
  connectionProgress: null,

  // Filters and UI state
  filters: {
    accountTypes: [],
    dateRange: null,
    searchQuery: '',
  },

  // View preferences
  viewPreferences: {
    accountsView: 'grid',
    transactionsView: 'detailed',
    showInactiveAccounts: true,
  },
};

export const useBankingStore = create<BankingStore>()(
  devtools(
    immer((set) => ({
      ...initialState,

      // Account management
      setAccounts: (accounts) =>
        set((state) => {
          state.accounts = accounts;
        }, false, 'setAccounts'),

      addAccount: (account) =>
        set((state) => {
          state.accounts.push(account);
        }, false, 'addAccount'),

      updateAccount: (accountId, updates) =>
        set((state) => {
          const index = state.accounts.findIndex(acc => acc.id === accountId);
          if (index !== -1) {
            Object.assign(state.accounts[index], updates);
          }
        }, false, 'updateAccount'),

      removeAccount: (accountId) =>
        set((state) => {
          state.accounts = state.accounts.filter(acc => acc.id !== accountId);
          if (state.selectedAccount?.id === accountId) {
            state.selectedAccount = null;
          }
        }, false, 'removeAccount'),

      selectAccount: (account) =>
        set((state) => {
          state.selectedAccount = account;
        }, false, 'selectAccount'),

      // Transaction management
      setTransactions: (transactions) =>
        set((state) => {
          state.transactions = transactions;
        }, false, 'setTransactions'),

      addTransactions: (transactions) =>
        set((state) => {
          state.transactions.push(...transactions);
        }, false, 'addTransactions'),

      // Loading states
      setAccountsLoading: (loading) =>
        set((state) => {
          state.accountsLoading = loading;
        }, false, 'setAccountsLoading'),

      setTransactionsLoading: (loading) =>
        set((state) => {
          state.transactionsLoading = loading;
        }, false, 'setTransactionsLoading'),

      setConnectingBank: (connecting) =>
        set((state) => {
          state.connectingBank = connecting;
        }, false, 'setConnectingBank'),

      // Error states
      setAccountsError: (error) =>
        set((state) => {
          state.accountsError = error;
        }, false, 'setAccountsError'),

      setTransactionsError: (error) =>
        set((state) => {
          state.transactionsError = error;
        }, false, 'setTransactionsError'),

      setConnectionError: (error) =>
        set((state) => {
          state.connectionError = error;
        }, false, 'setConnectionError'),

      // Connection management
      startConnection: () =>
        set((state) => {
          state.isConnecting = true;
          state.connectionError = null;
          state.connectionProgress = 'Initializing...';
        }, false, 'startConnection'),

      setConnectionProgress: (progress) =>
        set((state) => {
          state.connectionProgress = progress;
        }, false, 'setConnectionProgress'),

      completeConnection: () =>
        set((state) => {
          state.isConnecting = false;
          state.connectionProgress = null;
          state.connectionError = null;
        }, false, 'completeConnection'),

      failConnection: (error) =>
        set((state) => {
          state.isConnecting = false;
          state.connectionProgress = null;
          state.connectionError = error;
        }, false, 'failConnection'),

      // Real-time sync (following crypto pattern)
      updateRealtimeSyncProgress: (accountId, progress, status, message) =>
        set((state) => {
          if (!state.realtimeSyncStates[accountId]) {
            state.realtimeSyncStates[accountId] = {
              accountId,
              progress: 0,
              status: 'queued'
            };
          }
          state.realtimeSyncStates[accountId].progress = progress;
          state.realtimeSyncStates[accountId].status = status as any;
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
            state.realtimeSyncStates[accountId].progress = 0;
            state.realtimeSyncStates[accountId].status = 'failed';
            state.realtimeSyncStates[accountId].error = error;
            state.realtimeSyncStates[accountId].completedAt = new Date();
          }
        }, false, 'failRealtimeSync'),

      setRealtimeSyncConnected: (connected) =>
        set((state) => {
          state.realtimeSyncConnected = connected;
        }, false, 'setRealtimeSyncConnected'),

      setRealtimeSyncError: (error) =>
        set((state) => {
          state.realtimeSyncError = error;
        }, false, 'setRealtimeSyncError'),

      clearRealtimeSyncState: (accountId) =>
        set((state) => {
          delete state.realtimeSyncStates[accountId];
        }, false, 'clearRealtimeSyncState'),

      // Filters and preferences
      setAccountTypeFilter: (types) =>
        set((state) => {
          state.filters.accountTypes = types;
        }, false, 'setAccountTypeFilter'),

      setDateRangeFilter: (range) =>
        set((state) => {
          state.filters.dateRange = range;
        }, false, 'setDateRangeFilter'),

      setSearchQuery: (query) =>
        set((state) => {
          state.filters.searchQuery = query;
        }, false, 'setSearchQuery'),

      setAccountsView: (view) =>
        set((state) => {
          state.viewPreferences.accountsView = view;
        }, false, 'setAccountsView'),

      setTransactionsView: (view) =>
        set((state) => {
          state.viewPreferences.transactionsView = view;
        }, false, 'setTransactionsView'),

      toggleShowInactiveAccounts: () =>
        set((state) => {
          state.viewPreferences.showInactiveAccounts = !state.viewPreferences.showInactiveAccounts;
        }, false, 'toggleShowInactiveAccounts'),

      // Utility actions
      clearErrors: () =>
        set((state) => {
          state.accountsError = null;
          state.transactionsError = null;
          state.connectionError = null;
          state.realtimeSyncError = null;
        }, false, 'clearErrors'),

      resetFilters: () =>
        set((state) => {
          state.filters = {
            accountTypes: [],
            dateRange: null,
            searchQuery: '',
          };
        }, false, 'resetFilters'),

      resetState: () =>
        set(() => ({
          ...initialState,
        }), false, 'resetState'),
    })),
    {
      name: 'banking-store',
    }
  )
);

// Selectors for better performance
export const selectFilteredAccounts = (state: BankingStore) => {
  const { accounts, filters, viewPreferences } = state;

  return accounts.filter((account) => {
    // Filter by account types
    if (filters.accountTypes.length > 0 && !filters.accountTypes.includes(account.type)) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      return (
        account.name.toLowerCase().includes(query) ||
        account.institutionName?.toLowerCase().includes(query) ||
        account.accountNumber?.includes(query)
      );
    }

    // Filter inactive accounts
    if (!viewPreferences.showInactiveAccounts && !account.isActive) {
      return false;
    }

    return true;
  });
};

export const selectAccountById = (accountId: string) => (state: BankingStore) =>
  state.accounts.find(account => account.id === accountId);

export const selectAccountsWithSyncStatus = (state: BankingStore) =>
  state.accounts.map(account => ({
    ...account,
    syncProgress: state.realtimeSyncStates[account.id],
  }));

export const selectIsAnyAccountSyncing = (state: BankingStore) =>
  Object.values(state.realtimeSyncStates).some(
    syncState => ['queued', 'syncing', 'syncing_transactions', 'syncing_balance'].includes(syncState.status)
  );
```

---

## API Service Layer

### 1. Create Banking API Service

**File**: `lib/services/banking-api.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type {
  BankAccount,
  BankTransaction,
  ConnectBankRequest,
  SyncBankAccountRequest,
  ApiResponse
} from '@/lib/types/banking';

class BankingApiService {
  private readonly basePath = '/banking';

  // Account Management
  async getAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get(`${this.basePath}/accounts`);
  }

  async getAccount(accountId: string): Promise<ApiResponse<BankAccount>> {
    return apiClient.get(`${this.basePath}/accounts/${accountId}`);
  }

  async connectBank(data: ConnectBankRequest): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.post(`${this.basePath}/connect`, data);
  }

  async updateAccount(accountId: string, updates: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    return apiClient.put(`${this.basePath}/accounts/${accountId}`, updates);
  }

  async disconnectAccount(accountId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/accounts/${accountId}`);
  }

  // Transaction Management
  async getTransactions(params: {
    accountId?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse<BankTransaction[]>> {
    const searchParams = new URLSearchParams();

    if (params.accountId) searchParams.set('accountId', params.accountId);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/transactions${query ? `?${query}` : ''}`);
  }

  async getAccountTransactions(
    accountId: string,
    params: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<ApiResponse<BankTransaction[]>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}/accounts/${accountId}/transactions${query ? `?${query}` : ''}`);
  }

  // Sync Operations
  async syncAccount(accountId: string, syncData: SyncBankAccountRequest = {}): Promise<ApiResponse<{ jobId: string }>> {
    return apiClient.post(`${this.basePath}/accounts/${accountId}/sync`, syncData);
  }

  async getSyncStatus(accountId: string, jobId?: string): Promise<ApiResponse<any>> {
    const query = jobId ? `?jobId=${jobId}` : '';
    return apiClient.get(`${this.basePath}/accounts/${accountId}/sync/status${query}`);
  }

  // Utility Methods
  async refreshAllAccounts(): Promise<ApiResponse<{ syncJobs: { accountId: string; jobId: string }[] }>> {
    const accountsResponse = await this.getAccounts();

    if (!accountsResponse.success) {
      return accountsResponse as ApiResponse<{ syncJobs: { accountId: string; jobId: string }[] }>;
    }

    const syncJobs = await Promise.allSettled(
      accountsResponse.data.map(async (account) => {
        const syncResponse = await this.syncAccount(account.id, { fullSync: false });
        if (syncResponse.success) {
          return { accountId: account.id, jobId: syncResponse.data.jobId };
        }
        throw new Error(`Failed to sync account ${account.id}`);
      })
    );

    const successfulSyncs = syncJobs
      .filter((result): result is PromiseFulfilledResult<{ accountId: string; jobId: string }> =>
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    return {
      success: true,
      data: { syncJobs: successfulSyncs }
    };
  }
}

export const bankingApi = new BankingApiService();
export default bankingApi;
```

---

## React Query Integration

### 1. Create Banking Queries

**File**: `lib/queries/banking-queries.ts`

```typescript
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData
} from '@tanstack/react-query';
import { bankingApi } from '@/lib/services/banking-api';
import { useBankingStore } from '@/lib/stores/banking-store';
import type {
  BankAccount,
  ConnectBankRequest,
  SyncBankAccountRequest,
  ApiResponse
} from '@/lib/types/banking';

// Query Keys Factory
export const bankingKeys = {
  all: ['banking'] as const,

  // Accounts
  accounts: () => [...bankingKeys.all, 'accounts'] as const,
  account: (id: string) => [...bankingKeys.accounts(), id] as const,

  // Transactions
  transactions: (params?: any) => [...bankingKeys.all, 'transactions', params] as const,
  accountTransactions: (accountId: string, params?: any) =>
    [...bankingKeys.accounts(), accountId, 'transactions', params] as const,

  // Sync
  syncStatus: (accountId: string, jobId?: string) =>
    [...bankingKeys.accounts(), accountId, 'sync', { jobId }] as const,
};

// Query Options Factory
export const bankingQueries = {
  // Accounts
  accounts: () => ({
    queryKey: bankingKeys.accounts(),
    queryFn: () => bankingApi.getAccounts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data: any) => data.success ? data.data : [],
  }),

  account: (id: string) => ({
    queryKey: bankingKeys.account(id),
    queryFn: () => bankingApi.getAccount(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    select: (data: any) => data.success ? data.data : null,
  }),

  // Transactions
  transactions: (params?: any) => ({
    queryKey: bankingKeys.transactions(params),
    queryFn: () => bankingApi.getTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3, // 3 minutes
    select: (data: any) => data.success ? data : { data: [], pagination: null },
  }),

  accountTransactions: (accountId: string, params?: any) => ({
    queryKey: bankingKeys.accountTransactions(accountId, params),
    queryFn: () => bankingApi.getAccountTransactions(accountId, params),
    enabled: !!accountId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3, // 3 minutes
    select: (data: any) => data.success ? data : { data: [], pagination: null },
  }),

  // Sync Status
  syncStatus: (accountId: string, jobId?: string) => ({
    queryKey: bankingKeys.syncStatus(accountId, jobId),
    queryFn: () => bankingApi.getSyncStatus(accountId, jobId),
    enabled: false, // Will be controlled by the hook
    refetchInterval: (data: any) => {
      if (!data || !data.success) {
        return false;
      }

      if (data.data) {
        const syncData = data.data;
        if (syncData.status === 'completed' ||
            syncData.status === 'failed' ||
            syncData.status === 'cancelled') {
          return false;
        }

        if (syncData.status === 'processing' || syncData.status === 'queued') {
          return 2000; // Poll every 2 seconds
        }
      }

      return false;
    },
    retry: 1,
    staleTime: 1000,
    select: (data: any) => data.success ? data.data : null,
  }),
};

// Mutations
export const bankingMutations = {
  // Connect Bank
  useConnectBank: () => {
    const queryClient = useQueryClient();
    const { addAccount, completeConnection, failConnection } = useBankingStore();

    return useMutation({
      mutationFn: async (data: ConnectBankRequest) => {
        const response = await bankingApi.connectBank(data);

        if (!response.success) {
          throw response;
        }

        return response;
      },
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Add accounts to store
          response.data.forEach(account => addAccount(account));

          // Invalidate accounts cache
          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });

          completeConnection();
        }
      },
      onError: (error: any) => {
        const errorMessage = error?.error?.message || 'Failed to connect bank account';
        failConnection(errorMessage);
        console.error('Failed to connect bank:', error);
      },
    });
  },

  // Update Account
  useUpdateAccount: () => {
    const queryClient = useQueryClient();
    const { updateAccount } = useBankingStore();

    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: Partial<BankAccount> }) =>
        bankingApi.updateAccount(id, updates),
      onSuccess: (response, variables) => {
        if (response.success) {
          updateAccount(variables.id, response.data);

          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.account(variables.id) });
        }
      },
      onError: (error) => {
        console.error('Failed to update account:', error);
      },
    });
  },

  // Disconnect Account
  useDisconnectAccount: () => {
    const queryClient = useQueryClient();
    const { removeAccount } = useBankingStore();

    return useMutation({
      mutationFn: (accountId: string) => bankingApi.disconnectAccount(accountId),
      onSuccess: (response, accountId) => {
        if (response.success) {
          removeAccount(accountId);

          queryClient.removeQueries({ queryKey: bankingKeys.account(accountId) });
          queryClient.removeQueries({ queryKey: bankingKeys.accountTransactions(accountId) });
          queryClient.removeQueries({ queryKey: bankingKeys.syncStatus(accountId) });

          queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
          queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
        }
      },
      onError: (error) => {
        console.error('Failed to disconnect account:', error);
      },
    });
  },

  // Sync Account
  useSyncAccount: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ accountId, syncData }: { accountId: string; syncData?: SyncBankAccountRequest }) =>
        bankingApi.syncAccount(accountId, syncData),
      onSuccess: (response, variables) => {
        if (response.success) {
          const { accountId } = variables;
          const { jobId } = response.data;

          queryClient.invalidateQueries({
            queryKey: bankingKeys.syncStatus(accountId, jobId)
          });
        }
      },
      onError: (error) => {
        console.error('Failed to start account sync:', error);
      },
    });
  },

  // Sync All Accounts
  useSyncAllAccounts: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => bankingApi.refreshAllAccounts(),
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: bankingKeys.all });
        }
      },
      onError: (error) => {
        console.error('Failed to sync all accounts:', error);
      },
    });
  },

  // Clear Cache
  useClearAllCache: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => Promise.resolve(),
      onSuccess: () => {
        queryClient.clear();

        if (typeof window !== 'undefined') {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('moneymappr_banking_')) {
              localStorage.removeItem(key);
            }
          });
        }
      }
    });
  },
};

// Custom hook to invalidate banking queries
export const useInvalidateBankingQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.all });
    },
    invalidateAccounts: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.accounts() });
    },
    invalidateAccount: (accountId: string) => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.account(accountId) });
    },
    invalidateTransactions: () => {
      queryClient.invalidateQueries({ queryKey: bankingKeys.transactions() });
    },
  };
};
```

---

## UI Components

### 1. Teller Connect Component

**File**: `components/banking/teller-connect.tsx`

```typescript
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Building2, Plus, Loader2 } from 'lucide-react';
import { useBankingStore } from '@/lib/stores/banking-store';
import { bankingMutations } from '@/lib/queries/banking-queries';
import type { TellerEnrollment, TellerConfig } from '@/lib/types/banking';

interface TellerConnectProps {
  onSuccess?: (accounts: any[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    TellerConnect: {
      setup: (config: TellerConfig) => {
        open: () => void;
        destroy: () => void;
      };
    };
  }
}

export function TellerConnect({ onSuccess, onError, disabled }: TellerConnectProps) {
  const tellerRef = useRef<{ open: () => void; destroy: () => void } | null>(null);
  const {
    startConnection,
    setConnectionProgress,
    setConnectionError,
    isConnecting,
    connectionProgress,
    connectionError
  } = useBankingStore();

  const connectBankMutation = bankingMutations.useConnectBank();

  // Load Teller Connect script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.teller.io/connect/connect.js';
    script.async = true;
    script.onload = () => {
      if (window.TellerConnect) {
        tellerRef.current = window.TellerConnect.setup({
          applicationId: process.env.NEXT_PUBLIC_TELLER_APPLICATION_ID!,
          environment: process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT as 'sandbox' | 'production',
          selectAccount: 'multiple',
          onSuccess: handleSuccess,
          onExit: handleExit,
          onEvent: handleEvent,
        });
      }
    };
    script.onerror = () => {
      setConnectionError('Failed to load Teller Connect');
    };

    document.head.appendChild(script);

    return () => {
      if (tellerRef.current) {
        tellerRef.current.destroy();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [setConnectionError]);

  const handleSuccess = useCallback((enrollment: TellerEnrollment) => {
    console.log('Bank connection successful:', enrollment);

    setConnectionProgress('Processing bank connection...');

    connectBankMutation.mutate(
      { enrollment },
      {
        onSuccess: (response) => {
          if (response.success) {
            onSuccess?.(response.data);
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.error?.message || 'Failed to connect bank account';
          onError?.(errorMessage);
        }
      }
    );
  }, [connectBankMutation, onSuccess, onError, setConnectionProgress]);

  const handleExit = useCallback(() => {
    console.log('User exited bank connection');
  }, []);

  const handleEvent = useCallback((eventName: string, metadata: any) => {
    console.log('Teller event:', eventName, metadata);

    switch (eventName) {
      case 'open':
        startConnection();
        break;
      case 'institution_selected':
        setConnectionProgress(`Connecting to ${metadata.institution?.name || 'bank'}...`);
        break;
      case 'credentials_submitted':
        setConnectionProgress('Verifying credentials...');
        break;
      case 'error':
        setConnectionError(metadata.message || 'Connection failed');
        break;
    }
  }, [startConnection, setConnectionProgress, setConnectionError]);

  const openTellerConnect = useCallback(() => {
    if (tellerRef.current && !isConnecting) {
      tellerRef.current.open();
    }
  }, [isConnecting]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Connect Bank Account</CardTitle>
            <CardDescription>
              Securely connect your bank accounts with bank-level encryption
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Security Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encryption • Read-only access • SOC 2 compliant</span>
          </div>

          {/* Connection Progress */}
          {isConnecting && connectionProgress && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-600">{connectionProgress}</span>
            </div>
          )}

          {/* Connection Error */}
          {connectionError && (
            <div className="p-3 bg-red-50 rounded-md">
              <span className="text-sm text-red-600">{connectionError}</span>
            </div>
          )}

          {/* Connect Button */}
          <Button
            onClick={openTellerConnect}
            disabled={disabled || isConnecting || connectBankMutation.isPending}
            className="w-full"
            size="lg"
          >
            {isConnecting || connectBankMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Connect Bank Account
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Bank Account Card Component

**File**: `components/banking/bank-account-card.tsx`

```typescript
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  RefreshCw,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Loader2,
  CreditCard,
  PiggyBank,
  Landmark
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBankingStore } from '@/lib/stores/banking-store';
import { bankingMutations } from '@/lib/queries/banking-queries';
import type { BankAccount } from '@/lib/types/banking';

interface BankAccountCardProps {
  account: BankAccount;
  onAccountClick?: (account: BankAccount) => void;
  onSync?: (accountId: string) => void;
  onDisconnect?: (accountId: string) => void;
}

const getAccountTypeIcon = (type: string) => {
  switch (type) {
    case 'CHECKING':
    case 'SAVINGS':
      return Landmark;
    case 'CREDIT_CARD':
      return CreditCard;
    case 'INVESTMENT':
      return PiggyBank;
    default:
      return Building2;
  }
};

const getAccountTypeColor = (type: string) => {
  switch (type) {
    case 'CHECKING':
      return 'from-blue-500 to-blue-600';
    case 'SAVINGS':
      return 'from-green-500 to-green-600';
    case 'CREDIT_CARD':
      return 'from-purple-500 to-purple-600';
    case 'INVESTMENT':
      return 'from-orange-500 to-orange-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export function BankAccountCard({
  account,
  onAccountClick,
  onSync,
  onDisconnect
}: BankAccountCardProps) {
  const { realtimeSyncStates } = useBankingStore();
  const syncAccountMutation = bankingMutations.useSyncAccount();
  const disconnectAccountMutation = bankingMutations.useDisconnectAccount();

  const syncState = realtimeSyncStates[account.id];
  const isSyncing = syncState && ['queued', 'syncing', 'syncing_transactions', 'syncing_balance'].includes(syncState.status);

  const AccountIcon = getAccountTypeIcon(account.type);
  const colorClass = getAccountTypeColor(account.type);

  const handleSync = () => {
    if (!isSyncing) {
      syncAccountMutation.mutate({ accountId: account.id });
      onSync?.(account.id);
    }
  };

  const handleDisconnect = () => {
    disconnectAccountMutation.mutate(account.id);
    onDisconnect?.(account.id);
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency || 'USD',
    }).format(balance);
  };

  const formatAccountNumber = (accountNumber?: string) => {
    if (!accountNumber) return '';
    // Show last 4 digits
    return `••••${accountNumber.slice(-4)}`;
  };

  return (
    <Card
      className="hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onAccountClick?.(account)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center`}>
              <AccountIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{account.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{account.institutionName}</span>
                {account.accountNumber && (
                  <>
                    <span>•</span>
                    <span>{formatAccountNumber(account.accountNumber)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {account.syncStatus === 'connected' && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            {account.syncStatus === 'error' && (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            {isSyncing && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}

            {/* Account Type Badge */}
            <Badge variant="outline" className="text-xs">
              {account.type.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Balance */}
          <div>
            <div className="text-2xl font-bold">
              {formatBalance(account.balance)}
            </div>
            <div className="text-sm text-muted-foreground">
              Current Balance
            </div>
          </div>

          {/* Sync Progress */}
          {syncState && isSyncing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {syncState.message || 'Syncing...'}
                </span>
                <span className="text-sm font-medium">
                  {syncState.progress}%
                </span>
              </div>
              <Progress value={syncState.progress} className="h-2" />
            </div>
          )}

          {/* Last Sync */}
          {account.lastTellerSync && !isSyncing && (
            <div className="text-xs text-muted-foreground">
              Last synced: {new Date(account.lastTellerSync).toLocaleDateString()}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSync();
              }}
              disabled={isSyncing || syncAccountMutation.isPending}
            >
              {isSyncing || syncAccountMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Sync
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccountClick?.(account);
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSync();
                  }}
                  disabled={isSyncing}
                >
                  Refresh Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDisconnect();
                  }}
                  className="text-destructive focus:text-destructive"
                  disabled={disconnectAccountMutation.isPending}
                >
                  Disconnect Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Real-time Sync Integration

### 1. Banking Sync Hook

**File**: `lib/hooks/use-banking-sync.tsx`

```typescript
'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { BankingSyncProgress } from '@/lib/types/banking';

// Extend existing MultiWalletSyncTracker for banking
export function useBankingSyncProgress() {
  const bankingStore = useBankingStore();
  const { isAuthenticated } = useAuthStore();

  const handleProgress = useCallback((accountId: string, progress: BankingSyncProgress) => {
    if (progress.status === 'failed' && progress.error) {
      bankingStore.failRealtimeSync(accountId, progress.error);
    } else {
      bankingStore.updateRealtimeSyncProgress(
        accountId,
        progress.progress,
        progress.status,
        progress.message
      );
    }
  }, [bankingStore]);

  const handleComplete = useCallback((accountId: string, result: { syncedData?: string[] }) => {
    bankingStore.completeRealtimeSync(accountId, result.syncedData);
    // Trigger data refresh for account
    // This would integrate with React Query to refetch account data
  }, [bankingStore]);

  const handleError = useCallback((errorMsg: string) => {
    bankingStore.setRealtimeSyncError(errorMsg);
  }, [bankingStore]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    bankingStore.setRealtimeSyncConnected(connected);
  }, [bankingStore]);

  // This would use the existing SSE infrastructure from crypto
  // but listen to /banking/user/sync/stream endpoint
  useEffect(() => {
    if (!isAuthenticated) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
    const eventSource = new EventSource(`${API_BASE}/banking/user/sync/stream`, {
      withCredentials: true
    });

    eventSource.onopen = () => {
      handleConnectionChange(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connection_established':
            break;

          case 'account_sync_progress':
            if (data.accountId && data.progress !== undefined && data.status) {
              const progressData: BankingSyncProgress = {
                accountId: data.accountId,
                progress: data.progress,
                status: data.status,
                message: data.message,
                error: data.error,
                startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
                completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
                syncedData: data.syncedData
              };

              handleProgress(data.accountId, progressData);
            }
            break;

          case 'account_sync_completed':
            if (data.accountId) {
              handleComplete(data.accountId, {
                syncedData: data.syncedData,
              });
            }
            break;

          case 'account_sync_failed':
            if (data.accountId) {
              const errorMsg = data.error || 'Account sync failed';
              handleError(errorMsg);

              handleProgress(data.accountId, {
                accountId: data.accountId,
                progress: 0,
                status: 'failed',
                error: errorMsg,
                completedAt: new Date()
              });
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = () => {
      handleConnectionChange(false);
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, handleProgress, handleComplete, handleError, handleConnectionChange]);

  return {
    accountStates: bankingStore.realtimeSyncStates,
    isConnected: bankingStore.realtimeSyncConnected,
    error: bankingStore.realtimeSyncError,
  };
}
```

---

## Page Updates

### 1. Update Banking Page

**File**: `app/dashboard/accounts/bank/page.tsx` (Replace existing)

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Building2,
  Search,
  Filter,
  RefreshCw,
  Grid3X3,
  List,
  AlertCircle
} from 'lucide-react';
import { TellerConnect } from '@/components/banking/teller-connect';
import { BankAccountCard } from '@/components/banking/bank-account-card';
import { useBankingStore, selectFilteredAccounts } from '@/lib/stores/banking-store';
import { bankingQueries, bankingMutations } from '@/lib/queries/banking-queries';
import { useBankingSyncProgress } from '@/lib/hooks/use-banking-sync';

export default function BankAccountsPage() {
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  const {
    accounts,
    accountsLoading,
    accountsError,
    filters,
    viewPreferences,
    setSearchQuery,
    setAccountsView,
    selectAccount
  } = useBankingStore();

  // Initialize sync tracking
  useBankingSyncProgress();

  // Queries
  const accountsQuery = useQuery(bankingQueries.accounts());
  const syncAllMutation = bankingMutations.useSyncAllAccounts();

  // Get filtered accounts
  const filteredAccounts = useBankingStore(selectFilteredAccounts);

  const handleConnectSuccess = (connectedAccounts: any[]) => {
    setShowConnectDialog(false);
    console.log('Successfully connected accounts:', connectedAccounts);
  };

  const handleConnectError = (error: string) => {
    console.error('Failed to connect bank:', error);
  };

  const handleSyncAll = () => {
    syncAllMutation.mutate();
  };

  const handleAccountClick = (account: any) => {
    selectAccount(account);
    // Navigate to account details or open details modal
  };

  // Show connecting state when no accounts
  if (accounts.length === 0 && !accountsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bank Accounts</h1>
            <p className="text-muted-foreground">
              Connect your bank accounts for complete financial visibility
            </p>
          </div>
        </div>

        {/* Connect Section */}
        <div className="max-w-md mx-auto">
          <TellerConnect
            onSuccess={handleConnectSuccess}
            onError={handleConnectError}
          />
        </div>

        {/* Features Info */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>What You Can Connect</CardTitle>
            <CardDescription>
              Securely link all your financial accounts in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Checking & Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Track balances and transactions from your primary accounts
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Credit Cards</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor spending, balances, and payment due dates
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Investment Accounts</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of your brokerage and retirement accounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Accounts</h1>
          <p className="text-muted-foreground">
            {accounts.length} connected account{accounts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={syncAllMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncAllMutation.isPending ? 'animate-spin' : ''}`} />
            Sync All
          </Button>

          <Button onClick={() => setShowConnectDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Bank
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* Filter Button */}
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewPreferences.accountsView === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setAccountsView('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewPreferences.accountsView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setAccountsView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {accountsError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-600">{accountsError}</span>
        </div>
      )}

      {/* Accounts Grid/List */}
      <div className={
        viewPreferences.accountsView === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {filteredAccounts.map((account) => (
          <BankAccountCard
            key={account.id}
            account={account}
            onAccountClick={handleAccountClick}
            onSync={() => console.log('Sync account:', account.id)}
            onDisconnect={() => console.log('Disconnect account:', account.id)}
          />
        ))}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredAccounts.length === 0 && accounts.length > 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Connect Dialog */}
      {showConnectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Connect Bank Account</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnectDialog(false)}
              >
                ✕
              </Button>
            </div>

            <TellerConnect
              onSuccess={handleConnectSuccess}
              onError={handleConnectError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Integration with Account Groups

### 1. Extend Account Groups Store

**File**: `lib/stores/account-groups-store.ts` (extend existing)

```typescript
// Add to existing fetchUngroupedAccounts action
fetchUngroupedAccounts: async () => {
  set((state) => {
    state.ungroupedLoading = true;
    state.ungroupedError = null;
  }, false, 'fetchUngroupedAccounts/loading');

  try {
    const response = await AccountGroupsAPI.getUngroupedAccounts();

    if (response.success) {
      set((state) => {
        state.ungroupedAccounts = response.data || {
          financialAccounts: [], // This now includes bank accounts
          cryptoWallets: []
        };
        state.ungroupedLoading = false;
      }, false, 'fetchUngroupedAccounts/success');
    } else {
      set((state) => {
        state.ungroupedError = response.error?.message || 'Failed to load ungrouped accounts';
        state.ungroupedLoading = false;
      }, false, 'fetchUngroupedAccounts/error');
    }
  } catch (error) {
    set((state) => {
      state.ungroupedError = 'An unexpected error occurred';
      state.ungroupedLoading = false;
    }, false, 'fetchUngroupedAccounts/error');
    console.error('Error fetching ungrouped accounts:', error);
  }
},

// Add helper to move bank accounts to groups
moveBankAccountToGroup: async (accountId: string, groupId: string | null) => {
  return get().moveAccount({
    accountId,
    groupId,
    accountType: 'financial',
  });
},
```

---

## Testing Strategy

### 1. Component Testing

```typescript
// __tests__/components/banking/teller-connect.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TellerConnect } from '@/components/banking/teller-connect';

// Mock Teller Connect
Object.defineProperty(window, 'TellerConnect', {
  value: {
    setup: jest.fn(() => ({
      open: jest.fn(),
      destroy: jest.fn(),
    })),
  },
});

describe('TellerConnect', () => {
  const queryClient = new QueryClient();

  it('renders connect button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TellerConnect />
      </QueryClientProvider>
    );

    expect(screen.getByText('Connect Bank Account')).toBeInTheDocument();
  });

  it('opens Teller Connect on button click', async () => {
    const mockOpen = jest.fn();
    window.TellerConnect.setup.mockReturnValue({
      open: mockOpen,
      destroy: jest.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TellerConnect />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Connect Bank Account'));

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });
  });
});
```

### 2. Store Testing

```typescript
// __tests__/stores/banking-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useBankingStore } from '@/lib/stores/banking-store';

describe('Banking Store', () => {
  beforeEach(() => {
    useBankingStore.getState().resetState();
  });

  it('should add account correctly', () => {
    const { result } = renderHook(() => useBankingStore());

    const mockAccount = {
      id: '1',
      name: 'Test Account',
      type: 'CHECKING' as const,
      balance: 1000,
      // ... other required fields
    };

    act(() => {
      result.current.addAccount(mockAccount);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(mockAccount);
  });

  it('should handle sync progress updates', () => {
    const { result } = renderHook(() => useBankingStore());

    act(() => {
      result.current.updateRealtimeSyncProgress('account-1', 50, 'syncing', 'Processing transactions...');
    });

    expect(result.current.realtimeSyncStates['account-1']).toEqual({
      accountId: 'account-1',
      progress: 50,
      status: 'syncing',
      message: 'Processing transactions...',
    });
  });
});
```

### 3. Integration Testing

```typescript
// __tests__/integration/banking-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BankAccountsPage from '@/app/dashboard/accounts/bank/page';

// Mock API responses
jest.mock('@/lib/services/banking-api', () => ({
  bankingApi: {
    getAccounts: jest.fn(() => Promise.resolve({
      success: true,
      data: [
        {
          id: '1',
          name: 'Test Checking',
          type: 'CHECKING',
          balance: 1000,
          institutionName: 'Test Bank',
          // ... other fields
        }
      ]
    })),
  },
}));

describe('Banking Integration Flow', () => {
  it('should display connected accounts', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <BankAccountsPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Checking')).toBeInTheDocument();
      expect(screen.getByText('Test Bank')).toBeInTheDocument();
    });
  });
});
```

---

## Summary

This comprehensive frontend implementation provides:

1. **Complete type safety** with TypeScript definitions
2. **Zustand store** following existing patterns from crypto module
3. **React Query integration** with proper caching and mutations
4. **Teller Connect widget** for secure bank authentication
5. **Real-time sync** using existing SSE infrastructure
6. **UI components** consistent with design system
7. **Account groups integration** for organization
8. **Testing strategy** for reliability

The implementation leverages your existing architecture patterns, ensuring consistency and maintainability while adding powerful banking capabilities through Teller.io.