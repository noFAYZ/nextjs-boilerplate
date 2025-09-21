import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AccountGroupsAPI } from '@/lib/api/account-groups';
import { useAuth } from '@/lib/contexts/AuthContext';
import type {
  AccountGroup,
  AccountGroupHierarchy,
  CreateAccountGroupRequest,
  UpdateAccountGroupRequest,
  MoveAccountRequest,
  AccountGroupsQueryOptions,
} from '@/lib/types/account-groups';

// Helper function to create stable options key
function createOptionsKey(options: AccountGroupsQueryOptions): string {
  return JSON.stringify({
    details: options.details || false,
    includeAccounts: options.includeAccounts || false,
    includeWallets: options.includeWallets || false,
    includeChildren: options.includeChildren || false,
    includeCounts: options.includeCounts || false,
  });
}

/**
 * Hook for managing account groups
 */
export function useAccountGroups(options: AccountGroupsQueryOptions = {}) {
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use ref to store the latest options to avoid infinite re-renders
  const optionsRef = useRef<AccountGroupsQueryOptions>(options);
  const optionsKey = useMemo(() => createOptionsKey(options), [options.details, options.includeAccounts, options.includeWallets, options.includeChildren, options.includeCounts]);
  const lastOptionsKeyRef = useRef<string>('');
  
  // Update options ref when options change
  optionsRef.current = options;

  const fetchGroups = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AccountGroupsAPI.getAccountGroups(optionsRef.current);
      
      if (response.success) {
        setGroups(response.data || []);
      } else {
        setError(response.error?.message || 'Failed to load account groups');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching account groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);



  const refetch = useCallback(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for managing account groups in hierarchical structure
 */
export function useAccountGroupsHierarchy(options: AccountGroupsQueryOptions = {}) {
  const [hierarchy, setHierarchy] = useState<AccountGroupHierarchy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use ref to store the latest options to avoid infinite re-renders
  const optionsRef = useRef<AccountGroupsQueryOptions>(options);
  const optionsKey = useMemo(() => createOptionsKey(options), [options.details, options.includeAccounts, options.includeWallets, options.includeChildren, options.includeCounts]);
  const lastOptionsKeyRef = useRef<string>('');
  
  // Update options ref when options change
  optionsRef.current = options;

  const fetchHierarchy = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AccountGroupsAPI.getAccountGroupsHierarchy(optionsRef.current);
      
      if (response.success) {
        setHierarchy(response.data || []);
      } else {
        setError(response.error?.message || 'Failed to load account groups hierarchy');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching account groups hierarchy:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Only fetch if options have actually changed
    if (lastOptionsKeyRef.current !== optionsKey) {
      lastOptionsKeyRef.current = optionsKey;
      fetchHierarchy();
    }
  }, [optionsKey, fetchHierarchy]);

  const refetch = useCallback(() => {
    fetchHierarchy();
  }, [fetchHierarchy]);

  return {
    hierarchy,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for managing a single account group
 */
export function useAccountGroup(
  groupId: string | null,
  options: AccountGroupsQueryOptions = {}
) {
  const [group, setGroup] = useState<AccountGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use ref to store the latest options and groupId to avoid infinite re-renders
  const optionsRef = useRef<AccountGroupsQueryOptions>(options);
  const groupIdRef = useRef<string | null>(groupId);
  const optionsKey = useMemo(() => createOptionsKey(options), [options.details, options.includeAccounts, options.includeWallets, options.includeChildren, options.includeCounts]);
  const lastFetchKeyRef = useRef<string>('');
  
  // Update refs when values change
  optionsRef.current = options;
  groupIdRef.current = groupId;

  const fetchGroup = useCallback(async () => {
    const currentGroupId = groupIdRef.current;
    
    if (!currentGroupId) {
      setGroup(null);
      setIsLoading(false);
      return;
    }

    // Don't fetch if user is not authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AccountGroupsAPI.getAccountGroup(currentGroupId, optionsRef.current);
      
      if (response.success) {
        setGroup(response.data || null);
      } else {
        setError(response.error?.message || 'Failed to load account group');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching account group:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchKey = `${groupId}-${optionsKey}`;
    // Only fetch if groupId or options have actually changed
    if (lastFetchKeyRef.current !== fetchKey) {
      lastFetchKeyRef.current = fetchKey;
      fetchGroup();
    }
  }, [groupId, optionsKey, fetchGroup]);

  const refetch = useCallback(() => {
    fetchGroup();
  }, [fetchGroup]);

  return {
    group,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for account group mutations (create, update, delete)
 */
export function useAccountGroupMutations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const createGroup = useCallback(async (data: CreateAccountGroupRequest) => {
    setIsCreating(true);
    try {
      const response = await AccountGroupsAPI.createAccountGroup(data);
      return response;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateGroup = useCallback(async (
    groupId: string,
    data: UpdateAccountGroupRequest
  ) => {
    setIsUpdating(true);
    try {
      const response = await AccountGroupsAPI.updateAccountGroup(groupId, data);
      return response;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteGroup = useCallback(async (groupId: string) => {
    setIsDeleting(true);
    try {
      const response = await AccountGroupsAPI.deleteAccountGroup(groupId);
      return response;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const moveAccount = useCallback(async (data: MoveAccountRequest) => {
    setIsMoving(true);
    try {
      const response = await AccountGroupsAPI.moveAccount(data);
      return response;
    } finally {
      setIsMoving(false);
    }
  }, []);

  const createDefaults = useCallback(async () => {
    setIsCreating(true);
    try {
      const response = await AccountGroupsAPI.createDefaultGroups();
      return response;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createGroup,
    updateGroup,
    deleteGroup,
    moveAccount,
    createDefaults,
    isCreating,
    isUpdating,
    isDeleting,
    isMoving,
  };
}

/**
 * Hook for organizing accounts by groups
 */
export function useGroupedAccounts() {
  // Use stable options object to prevent infinite re-renders
  const staticOptions = useMemo(() => ({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  }), []);

  const { groups, isLoading, error, refetch } = useAccountGroups(staticOptions);

  // Organize accounts by groups
  const groupedAccounts = useMemo(() => {
    const grouped: Record<string, {
      group: AccountGroup;
      financialAccounts: any[];
      cryptoWallets: any[];
    }> = {};

    const ungrouped = {
      financialAccounts: [] as any[],
      cryptoWallets: [] as any[],
    };

    groups.forEach(group => {
      grouped[group.id] = {
        group,
        financialAccounts: group.financialAccounts || [],
        cryptoWallets: group.cryptoWallets || [],
      };
    });

    return {
      grouped,
      ungrouped,
    };
  }, [groups]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalGroups = groups.length;
    let totalAccounts = 0;
    let totalWallets = 0;
    let totalValue = 0;

    groups.forEach(group => {
      totalAccounts += group._count?.financialAccounts || 0;
      totalWallets += group._count?.cryptoWallets || 0;
      
      // Calculate total value from accounts and wallets
      (group.financialAccounts || []).forEach(account => {
        totalValue += account.balance || 0;
      });
      
      (group.cryptoWallets || []).forEach(wallet => {
        totalValue += parseFloat(wallet.totalBalanceUsd) || 0;
      });
    });

    return {
      totalGroups,
      totalAccounts,
      totalWallets,
      totalValue,
    };
  }, [groups]);

  return {
    groups,
    groupedAccounts,
    stats,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for managing group filters and preferences
 */
export function useAccountGroupFilters() {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [showEmptyGroups, setShowEmptyGroups] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tree'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleGroupSelection = useCallback((groupId: string) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedGroupIds([]);
  }, []);

  const selectAll = useCallback((groupIds: string[]) => {
    setSelectedGroupIds(groupIds);
  }, []);

  return {
    selectedGroupIds,
    showEmptyGroups,
    viewMode,
    sortBy,
    sortOrder,
    toggleGroupSelection,
    clearSelection,
    selectAll,
    setShowEmptyGroups,
    setViewMode,
    setSortBy,
    setSortOrder,
  };
}