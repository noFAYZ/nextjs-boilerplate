import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserAccountGroups,
  getAccountGroupById,
  getRootAccountGroups,
  getAccountGroupHierarchy,
  getAccountGroupsWithSummaries,
  searchAccountGroups,
  getChildAccountGroups,
  getAccountGroupsWithPaths,
  createAccountGroup,
  updateAccountGroup,
  deleteAccountGroup,
} from '@/lib/actions/account-group-actions';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'sonner';

// Query Keys
export const accountGroupQueryKeys = {
  // Account Groups
  accountGroups: ['accountGroups'] as const,
  accountGroup: (groupId: string) => ['accountGroups', 'group', groupId] as const,
  rootGroups: ['accountGroups', 'root'] as const,
  hierarchy: ['accountGroups', 'hierarchy'] as const,
  summaries: ['accountGroups', 'summaries'] as const,
  withPaths: ['accountGroups', 'paths'] as const,

  // Search & Filtering
  search: (query: string) => ['accountGroups', 'search', query] as const,
  children: (parentId: string) => ['accountGroups', 'children', parentId] as const,
};

// ===============================
// ACCOUNT GROUP HOOKS
// ===============================

/**
 * Hook to get all user account groups
 */
export function useAccountGroupsNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.accountGroups,
    queryFn: getUserAccountGroups,
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get single account group by ID with all details
 */
export function useAccountGroupNew(groupId: string | undefined | null) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.accountGroup(groupId!),
    queryFn: () => getAccountGroupById(groupId!),
    enabled: !!user && !authLoading && !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get root account groups (groups without parent)
 */
export function useRootAccountGroupsNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.rootGroups,
    queryFn: getRootAccountGroups,
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get account group hierarchy (nested structure)
 */
export function useAccountGroupHierarchyNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.hierarchy,
    queryFn: getAccountGroupHierarchy,
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get account groups with account summaries
 */
export function useAccountGroupsWithSummariesNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.summaries,
    queryFn: getAccountGroupsWithSummaries,
    enabled: !!user && !authLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get account groups with breadcrumb paths
 */
export function useAccountGroupsWithPathsNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.withPaths,
    queryFn: getAccountGroupsWithPaths,
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ===============================
// SEARCH & FILTERING HOOKS
// ===============================

/**
 * Hook to search account groups by name or description
 */
export function useSearchAccountGroupsNew(searchQuery: string, enabled = true) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.search(searchQuery),
    queryFn: () => searchAccountGroups(searchQuery),
    enabled: !!user && !authLoading && !!searchQuery && searchQuery.length > 0 && enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

/**
 * Hook to get child account groups by parent ID
 */
export function useChildAccountGroupsNew(parentId: string | undefined | null) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: accountGroupQueryKeys.children(parentId!),
    queryFn: () => getChildAccountGroups(parentId!),
    enabled: !!user && !authLoading && !!parentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ===============================
// MUTATION HOOKS
// ===============================

/**
 * Hook to create a new account group
 */
export function useCreateAccountGroupNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      parentId?: string;
      sortOrder?: number;
    }) => createAccountGroup(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch account group queries
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.accountGroups });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.rootGroups });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.hierarchy });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.summaries });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.withPaths });

        // If parent exists, invalidate children queries
        if (result.data?.parentId) {
          queryClient.invalidateQueries({
            queryKey: accountGroupQueryKeys.children(result.data.parentId)
          });
        }

        toast.success('Account group created successfully');
      } else {
        toast.error(result.error || 'Failed to create account group');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account group');
    },
  });
}

/**
 * Hook to update an account group
 */
export function useUpdateAccountGroupNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data
    }: {
      groupId: string;
      data: {
        name?: string;
        description?: string;
        icon?: string;
        color?: string;
        parentId?: string;
        sortOrder?: number;
      }
    }) => updateAccountGroup(groupId, data),
    onSuccess: (result, { groupId, data }) => {
      if (result.success) {
        // Invalidate specific group and related queries
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.accountGroup(groupId) });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.accountGroups });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.rootGroups });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.hierarchy });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.summaries });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.withPaths });

        // If parent changed, invalidate children queries for both old and new parent
        if (data.parentId !== undefined) {
          queryClient.invalidateQueries({
            queryKey: accountGroupQueryKeys.children(data.parentId)
          });
          // Note: We don't know the old parentId here, so we invalidate all children queries
          queryClient.invalidateQueries({
            queryKey: ['accountGroups', 'children']
          });
        }

        toast.success('Account group updated successfully');
      } else {
        toast.error(result.error || 'Failed to update account group');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update account group');
    },
  });
}

/**
 * Hook to delete an account group
 */
export function useDeleteAccountGroupNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => deleteAccountGroup(groupId),
    onSuccess: (result, groupId) => {
      if (result.success) {
        // Remove specific group queries from cache
        queryClient.removeQueries({ queryKey: accountGroupQueryKeys.accountGroup(groupId) });
        queryClient.removeQueries({ queryKey: accountGroupQueryKeys.children(groupId) });

        // Invalidate account group queries
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.accountGroups });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.rootGroups });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.hierarchy });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.summaries });
        queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.withPaths });

        toast.success('Account group deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete account group');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account group');
    },
  });
}

// ===============================
// COMBINED HOOKS FOR COMPLEX OPERATIONS
// ===============================

/**
 * Hook that provides grouped accounts organized by account groups
 */
export function useGroupedAccountsNew() {
  const accountGroups = useAccountGroupsWithSummariesNew();

  return {
    groups: accountGroups.data?.data || [],
    isLoading: accountGroups.isLoading,
    error: accountGroups.error,
    refetch: accountGroups.refetch,
  };
}

/**
 * Hook for account group management dashboard with hierarchy and summaries
 */
export function useAccountGroupDashboardNew() {
  const hierarchy = useAccountGroupHierarchyNew();
  const summaries = useAccountGroupsWithSummariesNew();
  const withPaths = useAccountGroupsWithPathsNew();

  return {
    hierarchy: hierarchy.data?.data || [],
    summaries: summaries.data?.data || [],
    withPaths: withPaths.data?.data || [],
    isLoading: hierarchy.isLoading || summaries.isLoading || withPaths.isLoading,
    error: hierarchy.error || summaries.error || withPaths.error,
    refetch: () => {
      hierarchy.refetch();
      summaries.refetch();
      withPaths.refetch();
    },
  };
}

// ===============================
// CACHE MANAGEMENT UTILITIES
// ===============================

/**
 * Hook to invalidate all account group-related queries
 */
export function useInvalidateAccountGroupQueriesNew() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['accountGroups'] });
    },
    invalidateAccountGroups: () => {
      queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.accountGroups });
    },
    invalidateAccountGroup: (groupId: string) => {
      queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.accountGroup(groupId) });
    },
    invalidateHierarchy: () => {
      queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.hierarchy });
    },
    invalidateSummaries: () => {
      queryClient.invalidateQueries({ queryKey: accountGroupQueryKeys.summaries });
    },
  };
}

// ===============================
// UTILITY HOOKS
// ===============================

/**
 * Hook to get account group statistics and metrics
 */
export function useAccountGroupStatsNew() {
  const summaries = useAccountGroupsWithSummariesNew();

  // Calculate stats from summaries data
  const stats = {
    totalGroups: summaries.data?.data?.length || 0,
    totalAccounts: summaries.data?.data?.reduce((sum: number, group: any) =>
      sum + (group.summary?.accountCount || 0), 0) || 0,
    totalWallets: summaries.data?.data?.reduce((sum: number, group: any) =>
      sum + (group.summary?.walletCount || 0), 0) || 0,
    totalValue: summaries.data?.data?.reduce((sum: number, group: any) =>
      sum + (group.summary?.totalBalance || 0), 0) || 0,
  };

  return {
    stats,
    isLoading: summaries.isLoading,
    error: summaries.error,
    refetch: summaries.refetch,
  };
}

/**
 * Hook to get account group tree for navigation components
 */
export function useAccountGroupTreeNew() {
  const hierarchy = useAccountGroupHierarchyNew();

  // Transform hierarchy data into tree structure for UI components
  const transformToTree = (groups: any[]): any[] => {
    return groups.map(group => ({
      id: group.id,
      label: group.name,
      icon: group.icon,
      color: group.color,
      children: group.children ? transformToTree(group.children) : [],
      accountCount: group._count?.financial_accounts || 0,
      walletCount: group._count?.crypto_wallets || 0,
      childCount: group._count?.children || 0,
    }));
  };

  return {
    tree: hierarchy.data?.data ? transformToTree(hierarchy.data.data) : [],
    isLoading: hierarchy.isLoading,
    error: hierarchy.error,
    refetch: hierarchy.refetch,
  };
}