'use client';

import { useCallback } from 'react';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';

// This hook is now simplified since banking events are handled by the unified SSE connection
export function useBankingSyncStream() {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  const { setRealtimeSyncConnected } = useBankingStore();

  const connect = useCallback(async () => {
    // Banking sync is now handled by the unified crypto SSE connection
    // This is just a placeholder for compatibility
    console.log('Banking sync: Using unified SSE connection via crypto endpoint');
    if (isAuthReady) {
      setRealtimeSyncConnected(true);
    }
  }, [isAuthReady, setRealtimeSyncConnected]);

  const disconnect = useCallback(() => {
    console.log('Banking sync: Disconnect handled by unified SSE connection');
  }, []);

  const reconnect = useCallback(() => {
    console.log('Banking sync: Reconnect handled by unified SSE connection');
  }, []);

  return {
    connect,
    disconnect,
    reconnect,
    isConnected: true, // Always true since handled by unified connection
    readyState: 1 // OPEN state
  };
}

// Hook for account-specific sync operations
export function useBankingAccountSync(accountId?: string) {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  const { realtimeSyncStates } = useBankingStore();

  const syncState = accountId ? realtimeSyncStates[accountId] : undefined;

  const startSync = useCallback(async (fullSync = false) => {
    if (!accountId) {
      throw new Error('Account ID is required for sync');
    }

    if (!isAuthReady) {
      throw new Error('User must be authenticated to start sync');
    }

    try {
      // TODO: Replace with actual API call once backend sync endpoint is implemented
      console.log(`Mock banking sync started for account ${accountId} (fullSync: ${fullSync})`);

      // When real backend is ready, uncomment this:
      // await syncAccount.mutateAsync({
      //   accountId,
      //   syncData: { fullSync }
      // });

      toast.success('Account sync started (mock)');
    } catch (error) {
      console.error('Failed to start account sync:', error);
      throw error;
    }
  }, [accountId, isAuthReady]);

  const isCurrentlySyncing = syncState?.status === 'syncing' ||
                            syncState?.status === 'processing' ||
                            syncState?.status === 'queued';

  return {
    startSync,
    syncState,
    isCurrentlySyncing,
    isSyncPending: false,
    syncError: null
  };
}

// Hook for bulk sync operations
export function useBankingBulkSync() {
  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;
  const { realtimeSyncStates } = useBankingStore();

  const activeSyncCount = Object.values(realtimeSyncStates).filter(
    state => state.status === 'syncing' ||
             state.status === 'processing' ||
             state.status === 'queued'
  ).length;

  const startSyncAll = useCallback(async () => {
    if (!isAuthReady) {
      throw new Error('User must be authenticated to start sync');
    }

    try {
      // TODO: Replace with actual API call once backend sync endpoint is implemented
      console.log('Mock banking bulk sync started');
      toast.success('Started syncing all accounts (mock)');
    } catch (error) {
      console.error('Failed to start bulk sync:', error);
      toast.error('Failed to start syncing accounts');
      throw error;
    }
  }, [isAuthReady]);

  return {
    startSyncAll,
    activeSyncCount,
    isBulkSyncPending: false,
    bulkSyncError: null
  };
}