import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Integration,
  IntegrationProvider,
  IntegrationStatus,
  ProviderConfig,
  IntegrationSyncLog,
  QuickBooksCompanyInfo,
} from '@/lib/types/integrations';

/**
 * Integrations Store
 *
 * Zustand store for managing integrations state
 * Follows the same patterns as crypto-store and banking-store
 */

interface IntegrationsState {
  // ========================================
  // State
  // ========================================
  integrations: Integration[];
  availableProviders: ProviderConfig[];
  selectedProvider: IntegrationProvider | null;
  syncLogs: Record<string, IntegrationSyncLog[]>; // integrationId -> logs
  quickbooksCompanyInfo: QuickBooksCompanyInfo | null;

  // Loading states
  integrationsLoading: boolean;
  providersLoading: boolean;
  syncLoading: Record<string, boolean>; // integrationId -> loading

  // Filters & Preferences
  filters: {
    status: IntegrationStatus[];
    providers: IntegrationProvider[];
    searchQuery: string;
  };

  viewPreferences: {
    showDisconnected: boolean;
    sortBy: 'name' | 'status' | 'lastSync' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    groupByCategory: boolean;
  };

  // ========================================
  // Actions - Integrations
  // ========================================
  setIntegrations: (integrations: Integration[]) => void;
  addIntegration: (integration: Integration) => void;
  updateIntegration: (integrationId: string, updates: Partial<Integration>) => void;
  removeIntegration: (integrationId: string) => void;
  setIntegrationsLoading: (loading: boolean) => void;

  // ========================================
  // Actions - Providers
  // ========================================
  setAvailableProviders: (providers: ProviderConfig[]) => void;
  setSelectedProvider: (provider: IntegrationProvider | null) => void;
  setProvidersLoading: (loading: boolean) => void;

  // ========================================
  // Actions - Sync
  // ========================================
  setSyncLoading: (integrationId: string, loading: boolean) => void;
  addSyncLog: (integrationId: string, log: IntegrationSyncLog) => void;
  setSyncLogs: (integrationId: string, logs: IntegrationSyncLog[]) => void;
  updateSyncLog: (integrationId: string, logId: string, updates: Partial<IntegrationSyncLog>) => void;

  // ========================================
  // Actions - QuickBooks Specific
  // ========================================
  setQuickBooksCompanyInfo: (info: QuickBooksCompanyInfo | null) => void;

  // ========================================
  // Actions - Filters & Preferences
  // ========================================
  setFilters: (filters: Partial<IntegrationsState['filters']>) => void;
  setViewPreferences: (preferences: Partial<IntegrationsState['viewPreferences']>) => void;
  resetFilters: () => void;

  // ========================================
  // Computed/Helper Methods
  // ========================================
  getIntegrationByProvider: (provider: IntegrationProvider) => Integration | null;
  getConnectedProviders: () => IntegrationProvider[];
  getDisconnectedProviders: () => ProviderConfig[];
  isProviderConnected: (provider: IntegrationProvider) => boolean;
  getIntegrationStatus: (provider: IntegrationProvider) => IntegrationStatus | null;
  getLastSyncTime: (provider: IntegrationProvider) => string | null;

  // ========================================
  // Utility Actions
  // ========================================
  resetStore: () => void;
}

const initialFilters = {
  status: [],
  providers: [],
  searchQuery: '',
};

const initialViewPreferences = {
  showDisconnected: true,
  sortBy: 'lastSync' as const,
  sortOrder: 'desc' as const,
  groupByCategory: false,
};

export const useIntegrationsStore = create<IntegrationsState>()(
  persist(
    immer((set, get) => ({
      // ========================================
      // Initial State
      // ========================================
      integrations: [],
      availableProviders: [],
      selectedProvider: null,
      syncLogs: {},
      quickbooksCompanyInfo: null,

      integrationsLoading: false,
      providersLoading: false,
      syncLoading: {},

      filters: initialFilters,
      viewPreferences: initialViewPreferences,

      // ========================================
      // Actions - Integrations
      // ========================================
      setIntegrations: (integrations) =>
        set((state) => {
          state.integrations = integrations;
        }),

      addIntegration: (integration) =>
        set((state) => {
          const existingIndex = state.integrations.findIndex((i) => i.id === integration.id);
          if (existingIndex >= 0) {
            state.integrations[existingIndex] = integration;
          } else {
            state.integrations.push(integration);
          }
        }),

      updateIntegration: (integrationId, updates) =>
        set((state) => {
          const index = state.integrations.findIndex((i) => i.id === integrationId);
          if (index >= 0) {
            state.integrations[index] = {
              ...state.integrations[index],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
        }),

      removeIntegration: (integrationId) =>
        set((state) => {
          state.integrations = state.integrations.filter((i) => i.id !== integrationId);
          delete state.syncLogs[integrationId];
          delete state.syncLoading[integrationId];
        }),

      setIntegrationsLoading: (loading) =>
        set((state) => {
          state.integrationsLoading = loading;
        }),

      // ========================================
      // Actions - Providers
      // ========================================
      setAvailableProviders: (providers) =>
        set((state) => {
          state.availableProviders = providers;
        }),

      setSelectedProvider: (provider) =>
        set((state) => {
          state.selectedProvider = provider;
        }),

      setProvidersLoading: (loading) =>
        set((state) => {
          state.providersLoading = loading;
        }),

      // ========================================
      // Actions - Sync
      // ========================================
      setSyncLoading: (integrationId, loading) =>
        set((state) => {
          state.syncLoading[integrationId] = loading;
        }),

      addSyncLog: (integrationId, log) =>
        set((state) => {
          if (!state.syncLogs[integrationId]) {
            state.syncLogs[integrationId] = [];
          }
          state.syncLogs[integrationId].unshift(log);
          // Keep only last 50 logs
          if (state.syncLogs[integrationId].length > 50) {
            state.syncLogs[integrationId] = state.syncLogs[integrationId].slice(0, 50);
          }
        }),

      setSyncLogs: (integrationId, logs) =>
        set((state) => {
          state.syncLogs[integrationId] = logs;
        }),

      updateSyncLog: (integrationId, logId, updates) =>
        set((state) => {
          if (state.syncLogs[integrationId]) {
            const index = state.syncLogs[integrationId].findIndex((log) => log.id === logId);
            if (index >= 0) {
              state.syncLogs[integrationId][index] = {
                ...state.syncLogs[integrationId][index],
                ...updates,
              };
            }
          }
        }),

      // ========================================
      // Actions - QuickBooks Specific
      // ========================================
      setQuickBooksCompanyInfo: (info) =>
        set((state) => {
          state.quickbooksCompanyInfo = info;
        }),

      // ========================================
      // Actions - Filters & Preferences
      // ========================================
      setFilters: (filters) =>
        set((state) => {
          state.filters = { ...state.filters, ...filters };
        }),

      setViewPreferences: (preferences) =>
        set((state) => {
          state.viewPreferences = { ...state.viewPreferences, ...preferences };
        }),

      resetFilters: () =>
        set((state) => {
          state.filters = initialFilters;
        }),

      // ========================================
      // Computed/Helper Methods
      // ========================================
      getIntegrationByProvider: (provider) => {
        const state = get();
        return state.integrations.find((i) => i.provider === provider) || null;
      },

      getConnectedProviders: () => {
        const state = get();
        return state.integrations
          .filter((i) => i.status === 'CONNECTED')
          .map((i) => i.provider);
      },

      getDisconnectedProviders: () => {
        const state = get();
        const connectedProviders = state.integrations.map((i) => i.provider);
        return state.availableProviders.filter(
          (provider) => !connectedProviders.includes(provider.provider)
        );
      },

      isProviderConnected: (provider) => {
        const state = get();
        const integration = state.integrations.find((i) => i.provider === provider);
        return integration?.status === 'CONNECTED';
      },

      getIntegrationStatus: (provider) => {
        const state = get();
        const integration = state.integrations.find((i) => i.provider === provider);
        return integration?.status || null;
      },

      getLastSyncTime: (provider) => {
        const state = get();
        const integration = state.integrations.find((i) => i.provider === provider);
        return integration?.lastSyncAt || null;
      },

      // ========================================
      // Utility Actions
      // ========================================
      resetStore: () =>
        set((state) => {
          state.integrations = [];
          state.syncLogs = {};
          state.quickbooksCompanyInfo = null;
          state.syncLoading = {};
          state.filters = initialFilters;
          state.selectedProvider = null;
        }),
    })),
    {
      name: 'integrations-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist necessary data
        viewPreferences: state.viewPreferences,
        filters: state.filters,
        // Don't persist loading states or sensitive data
      }),
    }
  )
);

// Selectors for better performance
export const integrationsSelectors = {
  // Get filtered integrations based on current filters
  getFilteredIntegrations: (state: IntegrationsState) => {
    let filtered = state.integrations;

    // Apply status filter
    if (state.filters.status.length > 0) {
      filtered = filtered.filter((i) => state.filters.status.includes(i.status));
    }

    // Apply provider filter
    if (state.filters.providers.length > 0) {
      filtered = filtered.filter((i) => state.filters.providers.includes(i.provider));
    }

    // Apply search filter
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.provider.toLowerCase().includes(query) ||
          i.providerAccountId?.toLowerCase().includes(query)
      );
    }

    // Apply view preferences
    if (!state.viewPreferences.showDisconnected) {
      filtered = filtered.filter((i) => i.status === 'CONNECTED');
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const { sortBy, sortOrder } = state.viewPreferences;
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.provider.localeCompare(b.provider);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'lastSync':
          if (!a.lastSyncAt && !b.lastSyncAt) comparison = 0;
          else if (!a.lastSyncAt) comparison = 1;
          else if (!b.lastSyncAt) comparison = -1;
          else comparison = new Date(a.lastSyncAt).getTime() - new Date(b.lastSyncAt).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  },

  // Get integrations statistics
  getStatistics: (state: IntegrationsState) => {
    return {
      total: state.integrations.length,
      connected: state.integrations.filter((i) => i.status === 'CONNECTED').length,
      disconnected: state.integrations.filter((i) => i.status === 'DISCONNECTED').length,
      error: state.integrations.filter((i) => i.status === 'ERROR' || i.status === 'TOKEN_EXPIRED').length,
      pendingAuth: state.integrations.filter((i) => i.status === 'PENDING_AUTH').length,
      autoSyncEnabled: state.integrations.filter((i) => i.autoSync).length,
    };
  },

  // Get recent sync logs across all integrations
  getAllRecentSyncLogs: (state: IntegrationsState, limit: number = 10) => {
    const allLogs: (IntegrationSyncLog & { integrationId: string })[] = [];

    Object.entries(state.syncLogs).forEach(([integrationId, logs]) => {
      logs.forEach((log) => {
        allLogs.push({ ...log, integrationId });
      });
    });

    return allLogs
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  },
};
