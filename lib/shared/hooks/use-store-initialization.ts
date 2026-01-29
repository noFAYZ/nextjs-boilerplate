import { useEffect } from 'react';
import { useAuthStore, useAccountGroupsStore, useCryptoStore } from '@/lib/stores';
import { useAuth } from '@/lib/contexts/AuthContext';

/**
 * Custom hook to initialize all Zustand stores on app startup
 * This ensures consistent state initialization across the application
 */
export function useStoreInitialization() {
  const { user, loading: authLoading } = useAuth();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const fetchAccountGroups = useAccountGroupsStore((state) => state.fetchGroups);
  const fetchCryptoWallets = useCryptoStore((state) => state.setWalletsLoading); // Placeholder for crypto init

  useEffect(() => {
    // Only initialize once
    if (isInitialized) {
      return;
    }


    // Initialize auth store (check for existing session)
    initializeAuth();

    // Initialize other stores after auth is ready - only for authenticated users
    const initializeOtherStores = async () => {
      // Don't initialize if user is not authenticated or auth is still loading
      if (!user || authLoading) {
        return;
      }

      try {
        // Initialize account groups store for authenticated users
        await fetchAccountGroups({
          details: true,
          includeAccounts: true,
          includeWallets: true,
          includeCounts: true,
        });

        // Initialize crypto store if needed
        // This would typically happen after user is authenticated
        // fetchCryptoWallets(false); // Example initialization
      } catch (error) {
      }
    };

    // Initialize other stores when user changes
    initializeOtherStores();

    return () => {}; // No cleanup needed
  }, [isInitialized, authLoading, fetchAccountGroups, initializeAuth, user]); // Include all dependencies
}

/**
 * Hook to check if all critical stores are initialized
 */
export function useStoresReady() {
  const authInitialized = useAuthStore((state) => state.isInitialized);
  const authLoading = useAuthStore((state) => state.loading);
  const groupsLoading = useAccountGroupsStore((state) => state.groupsLoading);
  
  // Consider stores ready when:
  // 1. Auth is initialized (regardless of authentication status)
  // 2. No critical loading states are active
  const isReady = authInitialized && !authLoading && !groupsLoading;

  return {
    isReady,
    authInitialized,
    authLoading,
    groupsLoading,
  };
}