/**
 * Auth Data Hooks
 *
 * PURPOSE: Consolidated, production-grade hooks for authentication
 * - Session validation and user profile management
 * - No useEffect patterns - React Query + Zustand handles everything
 * - Works directly with auth-store for session state
 *
 * USAGE:
 * ```ts
 * const { data: user } = useCurrentUser();
 * const { mutate: updateProfile } = useUpdateUserProfile();
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { userService } from '@/lib/services/user-service';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  stats: () => [...authKeys.all, 'stats'] as const,
};

// ============================================================================
// USER QUERIES
// ============================================================================

/**
 * Get current authenticated user
 * @returns User data from auth store (already managed by Zustand)
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return {
    data: user,
    isLoading: !isInitialized,
    isError: false,
    error: null,
    isSuccess: isAuthenticated && !!user,
  };
}

/**
 * Get current session
 * @returns Session data from auth store (already managed by Zustand)
 */
export function useCurrentSession() {
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return {
    data: session,
    isLoading: !isInitialized,
    isError: false,
    error: null,
    isSuccess: isAuthenticated && !!session,
  };
}

/**
 * Get user profile (extended data)
 * @param options - Query options including enabled flag
 * @returns Extended user profile data from server
 *
 * IMPORTANT: This hook does NOT automatically fetch on mount.
 * You must explicitly enable it where needed (settings, profile pages).
 * For basic user data, use useAuthStore instead.
 */
export function useUserProfile(options: { enabled?: boolean } = {}) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiClient.getUserProfile(),
    enabled: options.enabled === true && !!user && isInitialized,
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (data) => (data.success ? data.data : null),
  });
}

/**
 * Get user stats (dashboard metrics)
 * @param options - Query options including enabled flag
 * @returns User statistics
 *
 * IMPORTANT: This hook does NOT automatically fetch on mount.
 * You must explicitly enable it where needed (dashboard, stats pages).
 * This prevents unnecessary API calls on every page load.
 */
export function useUserStats(options: { enabled?: boolean } = {}) {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return useQuery({
    queryKey: authKeys.stats(),
    queryFn: () => apiClient.getUserStats(),
    enabled: options.enabled === true && !!user && isInitialized,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => (data.success ? data.data : null),
  });
}

// ============================================================================
// AUTH MUTATIONS
// ============================================================================

/**
 * Update user profile
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (updates: Partial<User>) => apiClient.updateUserProfile(updates),
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: authKeys.profile() });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(authKeys.profile());

      // Optimistically update profile
      queryClient.setQueryData(authKeys.profile(), (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        return { ...old, ...updates };
      });

      // Update Zustand store
      updateUser(updates);

      return { previousProfile };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(authKeys.profile(), context.previousProfile);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Update Zustand store with server response
        updateUser(response.data as Partial<User>);

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
  });
}

/**
 * Upload profile picture
 * @returns Mutation hook with optimistic updates
 */
export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (file: File) => userService.uploadProfilePicture(file),
    onSuccess: (response) => {
      if (response.success) {
        // Update Zustand store with new picture URL
        updateUser({ image: response.data.profilePicture });

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
  });
}

/**
 * Delete user account
 * @returns Mutation hook
 */
export function useDeleteUserAccount() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => apiClient.deleteUserAccount(),
    onSuccess: async (response) => {
      if (response.success) {
        // Clear all queries
        queryClient.clear();

        // Logout user
        await logout();
      }
    },
  });
}

/**
 * Resend verification email
 * @returns Mutation hook
 */
export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: (data: { email: string; callbackURL?: string }) =>
      apiClient.resendVerificationEmail(data),
    onError: (error) => {
      // Log error for debugging
      console.error('Failed to resend verification email:', error);
    },
  });
}

// ============================================================================
// SESSION UTILITIES
// ============================================================================

/**
 * Check if session is expired
 * @returns Session expiration status
 */
export function useSessionStatus() {
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);

  const isExpired = isSessionExpired();

  return {
    isAuthenticated,
    isExpired,
    session,
    expiresAt: session?.expiresAt,
  };
}

/**
 * Refresh authentication session
 * @returns Refresh function
 */
export function useRefreshSession() {
  const refreshSession = useAuthStore((state) => state.refreshSession);

  return {
    refresh: refreshSession,
    isRefreshing: useAuthStore((state) => state.refreshLoading),
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all auth-related queries
 * @returns Invalidation functions
 */
export function useInvalidateAuthCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: authKeys.all }),
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: authKeys.user() }),
    invalidateProfile: () => queryClient.invalidateQueries({ queryKey: authKeys.profile() }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: authKeys.stats() }),
  };
}

/**
 * Check authentication status (reactive)
 * @returns Auth status
 */
export function useAuthStatus() {
  return {
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
    isInitialized: useAuthStore((state) => state.isInitialized),
    isLoading: useAuthStore((state) => state.loading),
    user: useAuthStore((state) => state.user),
    session: useAuthStore((state) => state.session),
  };
}
