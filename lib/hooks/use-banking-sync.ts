'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';

export function useBankingSyncStream() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const { user, isInitialized } = useAuthStore();
  const isAuthReady = !!user && isInitialized;

  const {
    setRealtimeSyncConnected,
    setRealtimeSyncError
  } = useBankingStore();

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setRealtimeSyncConnected(false);
  }, [setRealtimeSyncConnected]);

  
  const connect = useCallback(async () => {
    // Only run in browser environment and when auth is ready
    if (typeof window === 'undefined' || typeof EventSource === 'undefined' || !isAuthReady) {
      return;
    }

    try {
      // Don't connect if already connected
      if (eventSourceRef.current?.readyState === EventSource.OPEN) {
        return;
      }

      cleanup();

      console.log('Banking sync stream not yet implemented - using mock connection');

      // Since the banking SSE endpoint is not implemented yet, we'll provide a mock connection
      // This allows the UI to work properly while the backend endpoint is being developed
      setRealtimeSyncConnected(true);
      setRealtimeSyncError(null);
      reconnectAttempts.current = 0;

      // TODO: Remove this mock implementation once the backend SSE endpoint is ready
      console.log('Banking sync: Mock connection established');

    } catch (error) {
      console.error('Failed to setup banking sync mock:', error);
      setRealtimeSyncError('Banking sync service not available');
    }
  }, [cleanup, setRealtimeSyncConnected, setRealtimeSyncError, isAuthReady]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting from banking sync stream');
    cleanup();
  }, [cleanup]);

  const reconnect = useCallback(() => {
    console.log('Manually reconnecting to banking sync stream');
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  // Auto-connect when hook is used
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [connect, cleanup]);

  // Cleanup on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reconnect when page becomes visible
        if (typeof EventSource !== 'undefined' &&
            (!eventSourceRef.current || eventSourceRef.current.readyState !== EventSource.OPEN)) {
          console.log('Page visible, reconnecting banking sync...');
          connect();
        }
      } else {
        // Optional: disconnect when page is hidden to save resources
        // disconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connect]);

  return {
    connect,
    disconnect,
    reconnect,
    isConnected: typeof EventSource !== 'undefined'
      ? eventSourceRef.current?.readyState === EventSource.OPEN
      : false,
    readyState: eventSourceRef.current?.readyState
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