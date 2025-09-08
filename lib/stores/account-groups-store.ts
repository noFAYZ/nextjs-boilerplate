import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AccountGroupsAPI } from '@/lib/api/account-groups';
import type {
  AccountGroup,
  AccountGroupHierarchy,
  CreateAccountGroupRequest,
  UpdateAccountGroupRequest,
  MoveAccountRequest,
  AccountGroupsQueryOptions,
  FinancialAccount,
  CryptoWallet,
} from '@/lib/types/account-groups';

interface AccountGroupsState {
  // Data
  groups: AccountGroup[];
  hierarchy: AccountGroupHierarchy[];
  selectedGroup: AccountGroup | null;
  ungroupedAccounts: {
    financialAccounts: FinancialAccount[];
    cryptoWallets: CryptoWallet[];
  };
  
  // Force re-render counter
  version: number;
  
  // Loading states
  groupsLoading: boolean;
  hierarchyLoading: boolean;
  selectedGroupLoading: boolean;
  ungroupedLoading: boolean;
  operationLoading: boolean; // For create/update/delete operations
  
  // Error states
  groupsError: string | null;
  hierarchyError: string | null;
  selectedGroupError: string | null;
  ungroupedError: string | null;
  operationError: string | null;
  
  // Query options (for refetching with same params)
  lastQueryOptions: AccountGroupsQueryOptions;
  lastHierarchyOptions: AccountGroupsQueryOptions;
  
  // Filters and UI state
  filters: {
    selectedGroupIds: string[];
    showEmptyGroups: boolean;
    searchQuery: string;
  };
  
  // View preferences
  viewPreferences: {
    viewMode: 'list' | 'grid' | 'tree';
    sortBy: 'name' | 'created' | 'updated' | 'sortOrder';
    sortOrder: 'asc' | 'desc';
    showCounts: boolean;
    expandedGroups: string[]; // For tree view
  };
  
  // Statistics (computed from groups)
  stats: {
    totalGroups: number;
    totalAccounts: number;
    totalWallets: number;
    totalValue: number;
    lastUpdated: Date | null;
  };
}

interface AccountGroupsActions {
  // Fetch actions
  fetchGroups: (options?: AccountGroupsQueryOptions) => Promise<void>;
  fetchHierarchy: (options?: AccountGroupsQueryOptions) => Promise<void>;
  fetchGroup: (groupId: string, options?: AccountGroupsQueryOptions) => Promise<void>;
  fetchUngroupedAccounts: () => Promise<void>;
  
  // CRUD actions
  createGroup: (data: CreateAccountGroupRequest) => Promise<AccountGroup | null>;
  updateGroup: (groupId: string, data: UpdateAccountGroupRequest) => Promise<AccountGroup | null>;
  deleteGroup: (groupId: string) => Promise<boolean>;
  createDefaultGroups: () => Promise<AccountGroup[] | null>;
  
  // Account management
  moveAccount: (data: MoveAccountRequest) => Promise<boolean>;
  ungroupAccount: (accountId: string, accountType: 'financial' | 'crypto') => Promise<boolean>;
  bulkMoveAccounts: (
    groupId: string | null,
    accounts: Array<{ id: string; type: 'financial' | 'crypto' }>
  ) => Promise<boolean>;
  
  // Selection and UI actions
  selectGroup: (group: AccountGroup | null) => void;
  setSelectedGroupIds: (groupIds: string[]) => void;
  toggleGroupSelection: (groupId: string) => void;
  clearGroupSelection: () => void;
  setSearchQuery: (query: string) => void;
  toggleShowEmptyGroups: () => void;
  
  // View preferences
  setViewMode: (mode: 'list' | 'grid' | 'tree') => void;
  setSortBy: (sortBy: 'name' | 'created' | 'updated' | 'sortOrder') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  toggleShowCounts: () => void;
  toggleGroupExpanded: (groupId: string) => void;
  setExpandedGroups: (groupIds: string[]) => void;
  
  // Utility actions
  refreshAll: () => Promise<void>;
  clearErrors: () => void;
  resetFilters: () => void;
  resetState: () => void;
  
  // Computed getters (these will be used with selectors)
  getFilteredGroups: () => AccountGroup[];
  getGroupById: (groupId: string) => AccountGroup | undefined;
  getGroupsWithCounts: () => AccountGroup[];
  calculateStats: () => void;
}

type AccountGroupsStore = AccountGroupsState & AccountGroupsActions;

const initialState: AccountGroupsState = {
  // Data
  groups: [],
  hierarchy: [],
  selectedGroup: null,
  ungroupedAccounts: {
    financialAccounts: [],
    cryptoWallets: [],
  },
  
  // Force re-render counter
  version: 0,
  
  // Loading states
  groupsLoading: false,
  hierarchyLoading: false,
  selectedGroupLoading: false,
  ungroupedLoading: false,
  operationLoading: false,
  
  // Error states
  groupsError: null,
  hierarchyError: null,
  selectedGroupError: null,
  ungroupedError: null,
  operationError: null,
  
  // Query options
  lastQueryOptions: {},
  lastHierarchyOptions: {},
  
  // Filters and UI state
  filters: {
    selectedGroupIds: [],
    showEmptyGroups: true,
    searchQuery: '',
  },
  
  // View preferences
  viewPreferences: {
    viewMode: 'list',
    sortBy: 'name',
    sortOrder: 'asc',
    showCounts: true,
    expandedGroups: [],
  },
  
  // Statistics
  stats: {
    totalGroups: 0,
    totalAccounts: 0,
    totalWallets: 0,
    totalValue: 0,
    lastUpdated: null,
  },
};

export const useAccountGroupsStore = create<AccountGroupsStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,
      
      // Fetch actions
      fetchGroups: async (options = {}) => {
        set((state) => {
          state.groupsLoading = true;
          state.groupsError = null;
          state.lastQueryOptions = options;
        }, false, 'fetchGroups/loading');
        
        try {
          const response = await AccountGroupsAPI.getAccountGroups(options);
          
          if (response.success) {
            set((state) => {
              state.groups = response.data || [];
              state.groupsLoading = false;
              state.version += 1; // Force re-render
            }, false, 'fetchGroups/success');
            
            // Calculate stats after state update
            get().calculateStats();
          } else {
            set((state) => {
              state.groupsError = response.error?.message || 'Failed to load account groups';
              state.groupsLoading = false;
            }, false, 'fetchGroups/error');
          }
        } catch (error) {
          set((state) => {
            state.groupsError = 'An unexpected error occurred';
            state.groupsLoading = false;
          }, false, 'fetchGroups/error');
          console.error('Error fetching account groups:', error);
        }
      },
      
      fetchHierarchy: async (options = {}) => {
        set((state) => {
          state.hierarchyLoading = true;
          state.hierarchyError = null;
          state.lastHierarchyOptions = options;
        }, false, 'fetchHierarchy/loading');
        
        try {
          const response = await AccountGroupsAPI.getAccountGroupsHierarchy(options);
          
          if (response.success) {
            set((state) => {
              state.hierarchy = response.data || [];
              state.hierarchyLoading = false;
            }, false, 'fetchHierarchy/success');
          } else {
            set((state) => {
              state.hierarchyError = response.error?.message || 'Failed to load hierarchy';
              state.hierarchyLoading = false;
            }, false, 'fetchHierarchy/error');
          }
        } catch (error) {
          set((state) => {
            state.hierarchyError = 'An unexpected error occurred';
            state.hierarchyLoading = false;
          }, false, 'fetchHierarchy/error');
          console.error('Error fetching hierarchy:', error);
        }
      },
      
      fetchGroup: async (groupId, options = {}) => {
        set((state) => {
          state.selectedGroupLoading = true;
          state.selectedGroupError = null;
        }, false, 'fetchGroup/loading');
        
        try {
          const response = await AccountGroupsAPI.getAccountGroup(groupId, options);
          
          if (response.success) {
            set((state) => {
              state.selectedGroup = response.data || null;
              state.selectedGroupLoading = false;
            }, false, 'fetchGroup/success');
          } else {
            set((state) => {
              state.selectedGroupError = response.error?.message || 'Failed to load group';
              state.selectedGroupLoading = false;
            }, false, 'fetchGroup/error');
          }
        } catch (error) {
          set((state) => {
            state.selectedGroupError = 'An unexpected error occurred';
            state.selectedGroupLoading = false;
          }, false, 'fetchGroup/error');
          console.error('Error fetching group:', error);
        }
      },
      
      fetchUngroupedAccounts: async () => {
        set((state) => {
          state.ungroupedLoading = true;
          state.ungroupedError = null;
        }, false, 'fetchUngroupedAccounts/loading');
        
        try {
          const response = await AccountGroupsAPI.getUngroupedAccounts();
          
          if (response.success) {
            set((state) => {
              state.ungroupedAccounts = response.data || { financialAccounts: [], cryptoWallets: [] };
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
      
      // CRUD actions
      createGroup: async (data) => {
        set((state) => {
          state.operationLoading = true;
          state.operationError = null;
        }, false, 'createGroup/loading');
        
        try {
          console.log('AccountGroupsStore: Creating group with data:', data);
          const response = await AccountGroupsAPI.createAccountGroup(data);
          console.log('AccountGroupsStore: API response:', response);
          
          if (response.success && response.data) {
            console.log('AccountGroupsStore: Adding group to store:', response.data);
            set((state) => {
              state.groups.push(response.data!);
              state.operationLoading = false;
              state.version += 1; // Force re-render
            }, false, 'createGroup/success');
            
            // Calculate stats after state update (outside of immer)
            get().calculateStats();
            console.log('AccountGroupsStore: Groups after adding:', get().groups.length);
            
            // Refresh hierarchy if it was loaded
            if (get().hierarchy.length > 0) {
              get().fetchHierarchy(get().lastHierarchyOptions);
            }
            
            return response.data;
          } else {
            console.log('AccountGroupsStore: Failed to create group:', response.error);
            set((state) => {
              state.operationError = response.error?.message || 'Failed to create group';
              state.operationLoading = false;
            }, false, 'createGroup/error');
            return null;
          }
        } catch (error) {
          set((state) => {
            state.operationError = 'An unexpected error occurred';
            state.operationLoading = false;
          }, false, 'createGroup/error');
          console.error('Error creating group:', error);
          return null;
        }
      },
      
      updateGroup: async (groupId, data) => {
        set((state) => {
          state.operationLoading = true;
          state.operationError = null;
        }, false, 'updateGroup/loading');
        
        try {
          const response = await AccountGroupsAPI.updateAccountGroup(groupId, data);
          
          if (response.success && response.data) {
            set((state) => {
              const index = state.groups.findIndex(g => g.id === groupId);
              if (index !== -1) {
                state.groups[index] = response.data!;
              }
              
              // Update selected group if it's the one being updated
              if (state.selectedGroup?.id === groupId) {
                state.selectedGroup = response.data!;
              }
              
              state.operationLoading = false;
            }, false, 'updateGroup/success');
            
            // Calculate stats after state update
            get().calculateStats();
            
            // Refresh hierarchy if it was loaded
            if (get().hierarchy.length > 0) {
              get().fetchHierarchy(get().lastHierarchyOptions);
            }
            
            return response.data;
          } else {
            set((state) => {
              state.operationError = response.error?.message || 'Failed to update group';
              state.operationLoading = false;
            }, false, 'updateGroup/error');
            return null;
          }
        } catch (error) {
          set((state) => {
            state.operationError = 'An unexpected error occurred';
            state.operationLoading = false;
          }, false, 'updateGroup/error');
          console.error('Error updating group:', error);
          return null;
        }
      },
      
      deleteGroup: async (groupId) => {
        set((state) => {
          state.operationLoading = true;
          state.operationError = null;
        }, false, 'deleteGroup/loading');
        
        try {
          const response = await AccountGroupsAPI.deleteAccountGroup(groupId);
          
          if (response.success) {
            set((state) => {
              state.groups = state.groups.filter(g => g.id !== groupId);
              
              // Clear selected group if it was deleted
              if (state.selectedGroup?.id === groupId) {
                state.selectedGroup = null;
              }
              
              // Remove from selected group IDs
              state.filters.selectedGroupIds = state.filters.selectedGroupIds.filter(id => id !== groupId);
              
              // Remove from expanded groups
              state.viewPreferences.expandedGroups = state.viewPreferences.expandedGroups.filter(id => id !== groupId);
              
              state.operationLoading = false;
              state.version += 1; // Force re-render
            }, false, 'deleteGroup/success');
            
            // Calculate stats after state update
            get().calculateStats();
            
            // Refresh hierarchy if it was loaded
            if (get().hierarchy.length > 0) {
              get().fetchHierarchy(get().lastHierarchyOptions);
            }
            
            return true;
          } else {
            set((state) => {
              state.operationError = response.error?.message || 'Failed to delete group';
              state.operationLoading = false;
            }, false, 'deleteGroup/error');
            return false;
          }
        } catch (error) {
          set((state) => {
            state.operationError = 'An unexpected error occurred';
            state.operationLoading = false;
          }, false, 'deleteGroup/error');
          console.error('Error deleting group:', error);
          return false;
        }
      },
      
      createDefaultGroups: async () => {
        set((state) => {
          state.operationLoading = true;
          state.operationError = null;
        }, false, 'createDefaultGroups/loading');
        
        try {
          const response = await AccountGroupsAPI.createDefaultGroups();
          
          if (response.success && response.data) {
            set((state) => {
              // Add new groups to existing array
              response.data!.forEach(group => {
                const exists = state.groups.some(g => g.id === group.id);
                if (!exists) {
                  state.groups.push(group);
                }
              });
              state.operationLoading = false;
            }, false, 'createDefaultGroups/success');
            
            // Calculate stats after state update
            get().calculateStats();
            
            // Refresh hierarchy if it was loaded
            if (get().hierarchy.length > 0) {
              get().fetchHierarchy(get().lastHierarchyOptions);
            }
            
            return response.data;
          } else {
            set((state) => {
              state.operationError = response.error?.message || 'Failed to create default groups';
              state.operationLoading = false;
            }, false, 'createDefaultGroups/error');
            return null;
          }
        } catch (error) {
          set((state) => {
            state.operationError = 'An unexpected error occurred';
            state.operationLoading = false;
          }, false, 'createDefaultGroups/error');
          console.error('Error creating default groups:', error);
          return null;
        }
      },
      
      // Account management
      moveAccount: async (data) => {
        set((state) => {
          state.operationLoading = true;
          state.operationError = null;
        }, false, 'moveAccount/loading');
        
        try {
          const response = await AccountGroupsAPI.moveAccount(data);
          
          if (response.success) {
            set((state) => {
              state.operationLoading = false;
            }, false, 'moveAccount/success');
            
            // Refresh groups to get updated accounts
            await get().fetchGroups(get().lastQueryOptions);
            
            // Also refresh ungrouped accounts
            await get().fetchUngroupedAccounts();
            
            return true;
          } else {
            set((state) => {
              state.operationError = response.error?.message || 'Failed to move account';
              state.operationLoading = false;
            }, false, 'moveAccount/error');
            return false;
          }
        } catch (error) {
          set((state) => {
            state.operationError = 'An unexpected error occurred';
            state.operationLoading = false;
          }, false, 'moveAccount/error');
          console.error('Error moving account:', error);
          return false;
        }
      },
      
      ungroupAccount: async (accountId, accountType) => {
        return get().moveAccount({
          accountId,
          groupId: null,
          accountType,
        });
      },
      
      bulkMoveAccounts: async (groupId, accounts) => {
        set((state) => {
          state.operationLoading = true;
          state.operationError = null;
        }, false, 'bulkMoveAccounts/loading');
        
        try {
          const response = await AccountGroupsAPI.bulkMoveAccounts(groupId, accounts);
          
          if (response.success) {
            set((state) => {
              state.operationLoading = false;
            }, false, 'bulkMoveAccounts/success');
            
            // Refresh groups and ungrouped accounts
            await Promise.all([
              get().fetchGroups(get().lastQueryOptions),
              get().fetchUngroupedAccounts(),
            ]);
            
            return true;
          } else {
            set((state) => {
              state.operationError = response.error?.message || 'Failed to move accounts';
              state.operationLoading = false;
            }, false, 'bulkMoveAccounts/error');
            return false;
          }
        } catch (error) {
          set((state) => {
            state.operationError = 'An unexpected error occurred';
            state.operationLoading = false;
          }, false, 'bulkMoveAccounts/error');
          console.error('Error bulk moving accounts:', error);
          return false;
        }
      },
      
      // Selection and UI actions
      selectGroup: (group) =>
        set((state) => {
          state.selectedGroup = group;
        }, false, 'selectGroup'),
      
      setSelectedGroupIds: (groupIds) =>
        set((state) => {
          state.filters.selectedGroupIds = groupIds;
        }, false, 'setSelectedGroupIds'),
      
      toggleGroupSelection: (groupId) =>
        set((state) => {
          const { selectedGroupIds } = state.filters;
          if (selectedGroupIds.includes(groupId)) {
            state.filters.selectedGroupIds = selectedGroupIds.filter(id => id !== groupId);
          } else {
            state.filters.selectedGroupIds.push(groupId);
          }
        }, false, 'toggleGroupSelection'),
      
      clearGroupSelection: () =>
        set((state) => {
          state.filters.selectedGroupIds = [];
        }, false, 'clearGroupSelection'),
      
      setSearchQuery: (query) =>
        set((state) => {
          state.filters.searchQuery = query;
        }, false, 'setSearchQuery'),
      
      toggleShowEmptyGroups: () =>
        set((state) => {
          state.filters.showEmptyGroups = !state.filters.showEmptyGroups;
        }, false, 'toggleShowEmptyGroups'),
      
      // View preferences
      setViewMode: (mode) =>
        set((state) => {
          state.viewPreferences.viewMode = mode;
        }, false, 'setViewMode'),
      
      setSortBy: (sortBy) =>
        set((state) => {
          state.viewPreferences.sortBy = sortBy;
        }, false, 'setSortBy'),
      
      setSortOrder: (order) =>
        set((state) => {
          state.viewPreferences.sortOrder = order;
        }, false, 'setSortOrder'),
      
      toggleShowCounts: () =>
        set((state) => {
          state.viewPreferences.showCounts = !state.viewPreferences.showCounts;
        }, false, 'toggleShowCounts'),
      
      toggleGroupExpanded: (groupId) =>
        set((state) => {
          const { expandedGroups } = state.viewPreferences;
          if (expandedGroups.includes(groupId)) {
            state.viewPreferences.expandedGroups = expandedGroups.filter(id => id !== groupId);
          } else {
            state.viewPreferences.expandedGroups.push(groupId);
          }
        }, false, 'toggleGroupExpanded'),
      
      setExpandedGroups: (groupIds) =>
        set((state) => {
          state.viewPreferences.expandedGroups = groupIds;
        }, false, 'setExpandedGroups'),
      
      // Utility actions
      refreshAll: async () => {
        const promises = [];
        
        if (get().groups.length > 0) {
          promises.push(get().fetchGroups(get().lastQueryOptions));
        }
        
        if (get().hierarchy.length > 0) {
          promises.push(get().fetchHierarchy(get().lastHierarchyOptions));
        }
        
        if (get().ungroupedAccounts.financialAccounts.length > 0 || get().ungroupedAccounts.cryptoWallets.length > 0) {
          promises.push(get().fetchUngroupedAccounts());
        }
        
        await Promise.all(promises);
      },
      
      clearErrors: () =>
        set((state) => {
          state.groupsError = null;
          state.hierarchyError = null;
          state.selectedGroupError = null;
          state.ungroupedError = null;
          state.operationError = null;
        }, false, 'clearErrors'),
      
      resetFilters: () =>
        set((state) => {
          state.filters = {
            selectedGroupIds: [],
            showEmptyGroups: true,
            searchQuery: '',
          };
        }, false, 'resetFilters'),
      
      resetState: () =>
        set(() => ({
          ...initialState,
        }), false, 'resetState'),
      
      // Computed getters
      getFilteredGroups: () => {
        const { groups, filters, viewPreferences } = get();
        let filteredGroups = [...groups];
        
        // Search filter
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          filteredGroups = filteredGroups.filter(group =>
            group.name.toLowerCase().includes(query) ||
            group.description?.toLowerCase().includes(query)
          );
        }
        
        // Empty groups filter
        if (!filters.showEmptyGroups) {
          filteredGroups = filteredGroups.filter(group =>
            (group._count?.financialAccounts || 0) > 0 ||
            (group._count?.cryptoWallets || 0) > 0 ||
            (group._count?.children || 0) > 0
          );
        }
        
        // Sort
        filteredGroups.sort((a, b) => {
          let comparison = 0;
          
          switch (viewPreferences.sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'created':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'updated':
              comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
              break;
            case 'sortOrder':
              comparison = a.sortOrder - b.sortOrder;
              break;
          }
          
          return viewPreferences.sortOrder === 'desc' ? -comparison : comparison;
        });
        
        return filteredGroups;
      },
      
      getGroupById: (groupId) => {
        return get().groups.find(group => group.id === groupId);
      },
      
      getGroupsWithCounts: () => {
        return get().groups.filter(group => group._count);
      },
      
      calculateStats: () => {
        const { groups } = get();
        
        const stats = {
          totalGroups: groups.length,
          totalAccounts: 0,
          totalWallets: 0,
          totalValue: 0,
          lastUpdated: new Date(),
        };
        
        groups.forEach(group => {
          stats.totalAccounts += group._count?.financialAccounts || 0;
          stats.totalWallets += group._count?.cryptoWallets || 0;
          
          // Calculate total value from accounts and wallets
          (group.financialAccounts || []).forEach(account => {
            stats.totalValue += account.balance || 0;
          });
          
          (group.cryptoWallets || []).forEach(wallet => {
            stats.totalValue += wallet.totalBalanceUsd || 0;
          });
        });
        
        set((state) => {
          state.stats = stats;
        }, false, 'calculateStats');
      },
    })),
    {
      name: 'account-groups-store',
    }
  )
);

// Selectors for better performance
export const selectFilteredGroups = (state: AccountGroupsStore) => state.getFilteredGroups();
export const selectGroupById = (groupId: string) => (state: AccountGroupsStore) => state.getGroupById(groupId);
export const selectGroupsWithCounts = (state: AccountGroupsStore) => state.getGroupsWithCounts();
export const selectTotalValue = (state: AccountGroupsStore) => state.stats.totalValue;
export const selectIsLoading = (state: AccountGroupsStore) => 
  state.groupsLoading || state.hierarchyLoading || state.operationLoading;
export const selectHasError = (state: AccountGroupsStore) => 
  !!(state.groupsError || state.hierarchyError || state.operationError);