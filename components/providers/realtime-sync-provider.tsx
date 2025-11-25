'use client'

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WalletSyncProgress } from '@/lib/hooks/use-realtime-sync';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { sseManager, SSEMessage } from '@/lib/services/sse-manager';
import { cryptoKeys, clearInitializationTimeout as clearCryptoInitTimeout } from '@/lib/queries/crypto-queries';
import { bankingKeys, clearInitializationTimeout as clearBankingInitTimeout } from '@/lib/queries/banking-queries';

interface BankingSyncState {
  progress: number;
  status: string;
  message?: string;
  error?: string;
}

interface RealtimeSyncContextValue {
  // Crypto sync
  isConnected: boolean;
  error: string | null;
  walletStates: Record<string, WalletSyncProgress>;
  resetConnection: () => void;

  // Banking sync (now using shared connection)
  banking: {
    isConnected: boolean;
    error: string | null;
    accountStates: Record<string, BankingSyncState>;
    resetConnection: () => void;
  };
}

const RealtimeSyncContext = createContext<RealtimeSyncContextValue>({
  isConnected: false,
  error: null,
  walletStates: {},
  resetConnection: () => {},
  banking: {
    isConnected: false,
    error: null,
    accountStates: {},
    resetConnection: () => {}
  }
});

export const useRealtimeSync = () => {
  const context = useContext(RealtimeSyncContext);
  if (context === undefined) {
    throw new Error('useRealtimeSync must be used within a RealtimeSyncProvider');
  }
  return context;
};

interface RealtimeSyncProviderProps {
  children: ReactNode;
}

export function RealtimeSyncProvider({ children }: RealtimeSyncProviderProps) {
  const queryClient = useQueryClient();
  const bankingStore = useBankingStore();
  const cryptoStore = useCryptoStore();
  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to store current handlers so they're always up-to-date
  // without causing useEffect to re-run
  const cryptoMessageRef = useRef<(data: SSEMessage) => void>();
  const bankingMessageRef = useRef<(data: SSEMessage) => void>();
  const connectionMessageRef = useRef<(data: SSEMessage) => void>();
  const errorMessageRef = useRef<(data: SSEMessage) => void>();

  // Track last update time for syncs to detect stuck syncs
  const syncTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const syncLastUpdateRef = useRef<Map<string, number>>(new Map());
  const stallTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const SYNC_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

  // Handle crypto sync messages
  const handleCryptoMessage = useCallback((data: SSEMessage) => {
    try {
      switch (data.type) {
        case 'wallet_sync_progress':
          if (data.walletId && data.progress !== undefined && data.status) {
            // Clear the "no SSE response" timeout from mutation since we got a message
            clearCryptoInitTimeout(data.walletId);

            // Check if this is a completion message - require explicit status or message indicator
            const isCryptoCompletion =
              data.message?.toLowerCase().includes('completed') ||
              data.status === 'completed';

            const progressData: WalletSyncProgress = {
              walletId: data.walletId,
              progress: data.progress,
              status: data.status as WalletSyncProgress['status'],
              message: data.message,
              error: data.error,
              startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
              completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
              syncedData: data.syncedData
            };

            if (isCryptoCompletion) {
              // Handle as completion
              console.log(`[RealtimeSync] 💯 Crypto sync completion detected for ${data.walletId}: ${data.message}`);
              cryptoStore.completeRealtimeSync(data.walletId, data.syncedData);

              // Clear all timeouts for this wallet
              clearCryptoInitTimeout(data.walletId);

              const cryptoStallTimeout = stallTimeoutRef.current.get(`crypto_${data.walletId}`);
              if (cryptoStallTimeout) {
                clearTimeout(cryptoStallTimeout);
                stallTimeoutRef.current.delete(`crypto_${data.walletId}`);
              }

              // Refetch queries
              queryClient.refetchQueries({ queryKey: cryptoKeys.wallets() });
              queryClient.refetchQueries({ queryKey: cryptoKeys.portfolio() });
            } else if (progressData.status === 'failed' && progressData.error) {
              cryptoStore.failRealtimeSync(data.walletId, progressData.error);
            } else {
              cryptoStore.updateRealtimeSyncProgress(
                data.walletId,
                progressData.progress,
                progressData.status,
                progressData.message
              );

              // Update timeout tracking
              syncLastUpdateRef.current.set(`crypto_${data.walletId}`, Date.now());

              // AGGRESSIVE: Set 90-second stall timeout - if no new progress message arrives, auto-fail
              const existingCryptoStallTimeout = stallTimeoutRef.current.get(`crypto_${data.walletId}`);
              if (existingCryptoStallTimeout) {
                clearTimeout(existingCryptoStallTimeout);
              }

              const stallTimeoutId = setTimeout(() => {
                const currentState = useCryptoStore.getState().realtimeSyncStates[data.walletId];
                const timeSinceLastUpdate = Date.now() - (syncLastUpdateRef.current.get(`crypto_${data.walletId}`) || Date.now());

                if (currentState && timeSinceLastUpdate > 90000) {
                  console.warn(`[RealtimeSync] 🚨 Crypto sync STALLED for ${data.walletId}: No progress for 90s, auto-failing`);
                  useCryptoStore.getState().failRealtimeSync(data.walletId, 'Sync stalled - no progress updates for 90 seconds');
                }
              }, 90000); // 90 seconds

              stallTimeoutRef.current.set(`crypto_${data.walletId}`, stallTimeoutId);
            }
          }
          break;

        case 'wallet_sync_completed':
          if (data.walletId) {
            console.log(`[RealtimeSync] ✅ Crypto sync COMPLETED for ${data.walletId}`);

            // Clear all timeouts for this wallet
            clearCryptoInitTimeout(data.walletId);

            // Clear stall timeout
            const cryptoStallTimeout = stallTimeoutRef.current.get(`crypto_${data.walletId}`);
            if (cryptoStallTimeout) {
              clearTimeout(cryptoStallTimeout);
              stallTimeoutRef.current.delete(`crypto_${data.walletId}`);
            }

            cryptoStore.completeRealtimeSync(data.walletId, data.syncedData);

            // Refetch specific queries only
            queryClient.refetchQueries({
              queryKey: cryptoKeys.wallets()
            });

            // Refetch portfolio as wallet data affects it
            queryClient.refetchQueries({
              queryKey: cryptoKeys.portfolio()
            });
          }
          break;

        case 'wallet_sync_failed':
          if (data.walletId) {
            // Clear all timeouts for this wallet
            clearCryptoInitTimeout(data.walletId);

            // Clear stall timeout
            const cryptoStallTimeoutFail = stallTimeoutRef.current.get(`crypto_${data.walletId}`);
            if (cryptoStallTimeoutFail) {
              clearTimeout(cryptoStallTimeoutFail);
              stallTimeoutRef.current.delete(`crypto_${data.walletId}`);
            }

            const errorMsg = data.error || 'Unknown error';
            cryptoStore.failRealtimeSync(data.walletId, errorMsg);
          }
          break;
      }
    } catch (error) {
      console.error('[RealtimeSync] Error handling crypto message:', error);
    }
  }, [cryptoStore, queryClient]);

  // Helper to complete banking sync and refresh queries
  const completeBankingSync = useCallback((accountId: string, syncedData?: string[]) => {
    bankingStore.completeRealtimeSync(accountId, syncedData);
    // Only invalidate specific queries, not all
    queryClient.refetchQueries({ queryKey: bankingKeys.accounts() });
    queryClient.refetchQueries({ queryKey: bankingKeys.overview() });
    console.log(`[RealtimeSync] ✅ Bank sync completed for ${accountId}`);
    toast.success('Bank account sync completed successfully');
  }, [bankingStore, queryClient]);

  // Helper to fail banking sync
  const failBankingSync = useCallback((accountId: string, errorMsg: string) => {
    bankingStore.failRealtimeSync(accountId, errorMsg);
    // Clear timeout
    const timeout = syncTimeoutRef.current.get(`bank_${accountId}`);
    if (timeout) {
      clearTimeout(timeout);
      syncTimeoutRef.current.delete(`bank_${accountId}`);
    }
    console.log(`[RealtimeSync] ❌ Bank sync failed for ${accountId}: ${errorMsg}`);
    toast.error(`Bank account sync failed: ${errorMsg}`);
  }, [bankingStore]);

  // Helper to set up sync timeout
  const setupSyncTimeout = useCallback((syncKey: string, store: any, id: string, completeHandler: () => void) => {
    // Clear existing timeout if any
    const existingTimeout = syncTimeoutRef.current.get(syncKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      const state = store.getState?.() || {};
      const syncStates = syncKey.startsWith('bank_') ? state.realtimeSyncStates : state.realtimeSyncStates;
      const syncState = syncStates?.[id];

      // Only force complete if still syncing (not already completed/failed)
      if (syncState && ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(syncState.status)) {
        console.warn(`[RealtimeSync] ⏱️ Sync timeout for ${syncKey} - forcing completion`);
        completeHandler();
      }

      syncTimeoutRef.current.delete(syncKey);
    }, SYNC_TIMEOUT_MS);

    syncTimeoutRef.current.set(syncKey, timeout);
    syncLastUpdateRef.current.set(syncKey, Date.now());
  }, [SYNC_TIMEOUT_MS]);

  // Handle banking sync messages
  const handleBankingMessage = useCallback((data: SSEMessage) => {
    try {
      // Log incoming message for debugging
      if (data.accountId) {
        console.log(`[RealtimeSync] Banking message: type=${data.type}, status=${data.status}, accountId=${data.accountId}, progress=${data.progress}, error=${data.error}, message=${data.message}`);
      }

      if (!data.accountId) {
        console.log(`[RealtimeSync] Banking message missing accountId, ignoring: ${JSON.stringify(data)}`);
        return;
      }

      // Check completion - require explicit status or message indicator, not just progress === 100
      // Progress can be unreliable due to backend timing issues
      const isCompletion =
        data.type === 'completed_bank' ||
        data.status === 'completed_bank' ||
        data.type === 'sync_completed' ||
        data.status === 'sync_completed' ||
        (data.message && data.message.toLowerCase().includes('completed'));

      if (isCompletion) {
        console.log(`[RealtimeSync] ✅ Banking sync COMPLETED for ${data.accountId}: ${data.message}`);

        // First update the store to completed status
        useBankingStore.getState().completeRealtimeSync(data.accountId, data.syncedData);

        // Clear all timeouts for this account
        clearBankingInitTimeout(data.accountId);

        const timeout = syncTimeoutRef.current.get(`bank_${data.accountId}`);
        if (timeout) {
          clearTimeout(timeout);
          syncTimeoutRef.current.delete(`bank_${data.accountId}`);
        }
        // Clear stall timeout
        const stallTimeout = stallTimeoutRef.current.get(`bank_${data.accountId}`);
        if (stallTimeout) {
          clearTimeout(stallTimeout);
          stallTimeoutRef.current.delete(`bank_${data.accountId}`);
        }

        // Refetch queries
        queryClient.refetchQueries({ queryKey: bankingKeys.accounts() });
        queryClient.refetchQueries({ queryKey: bankingKeys.overview() });
        toast.success('Bank account sync completed successfully');
        return;
      }

      // Check failure (all possible failure message types)
      const isFailure =
        data.type === 'failed_bank' ||
        data.status === 'failed_bank' ||
        data.type === 'sync_failed' ||
        data.status === 'sync_failed';

      if (isFailure) {
        console.log(`[RealtimeSync] ❌ Banking sync FAILED for ${data.accountId}: ${data.error || data.message}`);
        // Clear all timeouts
        clearBankingInitTimeout(data.accountId);

        const timeout = syncTimeoutRef.current.get(`bank_${data.accountId}`);
        if (timeout) {
          clearTimeout(timeout);
          syncTimeoutRef.current.delete(`bank_${data.accountId}`);
        }
        // Clear stall timeout
        const stallTimeoutFail = stallTimeoutRef.current.get(`bank_${data.accountId}`);
        if (stallTimeoutFail) {
          clearTimeout(stallTimeoutFail);
          stallTimeoutRef.current.delete(`bank_${data.accountId}`);
        }
        const errorMsg = data.error || data.message || 'Bank sync failed';
        failBankingSync(data.accountId, errorMsg);
        return;
      }

      // Handle progress updates
      const statusMap: Record<string, string> = {
        'syncing_bank': 'syncing',
        'syncing_balance': 'syncing_balance',
        'syncing_transactions': 'syncing_transactions',
        'sync_progress': 'syncing',
      };

      let status = data.status || data.type;
      let mappedStatus = statusMap[status] || status;
      let progress = data.progress || 0;
      let message = data.message || 'Syncing bank account...';

      // Handle type-based progress estimation
      if (data.type === 'syncing_bank' && !data.progress) {
        progress = 25;
      } else if (data.type === 'syncing_transactions_bank' && !data.progress) {
        progress = 75;
      }

      if (data.type === 'sync_progress' || data.type === 'syncing_bank' || data.type === 'syncing_transactions_bank') {
        console.log(`[RealtimeSync] Banking sync PROGRESS for ${data.accountId}: progress=${progress}%, status=${mappedStatus}`);
        // Clear the "no SSE response" timeout from mutation since we got a message
        clearBankingInitTimeout(data.accountId);

        bankingStore.updateRealtimeSyncProgress(
          data.accountId,
          progress,
          mappedStatus as 'queued' | 'processing' | 'syncing' | 'syncing_balance' | 'syncing_transactions' | 'completed' | 'failed',
          message
        );

        // Update timeout tracking
        syncLastUpdateRef.current.set(`bank_${data.accountId}`, Date.now());

        // Set up timeout for ongoing sync (5 minute timeout)
        setupSyncTimeout(
          `bank_${data.accountId}`,
          bankingStore,
          data.accountId,
          () => completeBankingSync(data.accountId)
        );

        // AGGRESSIVE: Set 90-second stall timeout - if no new progress message arrives, auto-fail
        const existingStallTimeout = stallTimeoutRef.current.get(`bank_${data.accountId}`);
        if (existingStallTimeout) {
          clearTimeout(existingStallTimeout);
        }

        const stallTimeoutId = setTimeout(() => {
          const currentState = useBankingStore.getState().realtimeSyncStates[data.accountId];
          const timeSinceLastUpdate = Date.now() - (syncLastUpdateRef.current.get(`bank_${data.accountId}`) || Date.now());

          if (currentState && timeSinceLastUpdate > 90000) {
            console.warn(`[RealtimeSync] 🚨 Banking sync STALLED for ${data.accountId}: No progress for 90s, auto-failing`);
            useBankingStore.getState().failRealtimeSync(data.accountId, 'Sync stalled - no progress updates for 90 seconds');
          }
        }, 90000); // 90 seconds

        stallTimeoutRef.current.set(`bank_${data.accountId}`, stallTimeoutId);
      }
    } catch (error) {
      console.error('[RealtimeSync] Error handling banking message:', error, data);
    }
  }, [bankingStore, queryClient, completeBankingSync, failBankingSync, setupSyncTimeout]);

  // Handle connection status messages
  const handleConnectionMessage = useCallback((data: SSEMessage) => {
    switch (data.type) {
      case 'connection_established':
        setIsConnected(true);
        setError(null);
        cryptoStore.setRealtimeSyncConnected(true);
        bankingStore.setRealtimeSyncConnected(true);
        break;

      case 'connection_closed':
        setIsConnected(false);
        cryptoStore.setRealtimeSyncConnected(false);
        bankingStore.setRealtimeSyncConnected(false);
        break;
    }
  }, [cryptoStore, bankingStore]);

  // Handle error messages
  const handleErrorMessage = useCallback((data: SSEMessage) => {
    const errorMsg = data.error || 'Connection error';
    setError(errorMsg);
    setIsConnected(false);
    cryptoStore.setRealtimeSyncError(errorMsg);
    bankingStore.setRealtimeSyncError(errorMsg);
    cryptoStore.setRealtimeSyncConnected(false);
    bankingStore.setRealtimeSyncConnected(false);
  }, [cryptoStore, bankingStore]);

  // Update handler refs whenever handlers change
  // This ensures subscriptions always use the latest handlers
  useEffect(() => {
    cryptoMessageRef.current = handleCryptoMessage;
    bankingMessageRef.current = handleBankingMessage;
    connectionMessageRef.current = handleConnectionMessage;
    errorMessageRef.current = handleErrorMessage;
  }, [handleCryptoMessage, handleBankingMessage, handleConnectionMessage, handleErrorMessage]);

  // Subscribe to SSE channels when authenticated
  // Only re-run when authentication status changes
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Create wrapper functions that delegate to refs
    // This allows handlers to update without re-subscribing
    const wrappedCryptoHandler = (data: SSEMessage) => {
      cryptoMessageRef.current?.(data);
    };
    const wrappedBankingHandler = (data: SSEMessage) => {
      bankingMessageRef.current?.(data);
    };
    const wrappedConnectionHandler = (data: SSEMessage) => {
      connectionMessageRef.current?.(data);
    };
    const wrappedErrorHandler = (data: SSEMessage) => {
      errorMessageRef.current?.(data);
    };

    // Subscribe to all relevant channels with wrapped handlers
    const unsubCrypto = sseManager.subscribe('crypto_sync', wrappedCryptoHandler);
    const unsubBanking = sseManager.subscribe('banking_sync', wrappedBankingHandler);
    const unsubConnection = sseManager.subscribe('connection', wrappedConnectionHandler);
    const unsubError = sseManager.subscribe('error', wrappedErrorHandler);

    // Cleanup on unmount ONLY
    return () => {
      unsubCrypto();
      unsubBanking();
      unsubConnection();
      unsubError();
    };
  }, [isAuthenticated]);

  const resetConnection = useCallback(() => {
    sseManager.resetConnection();
  }, []);

  const contextValue: RealtimeSyncContextValue = {
    // Crypto sync
    isConnected,
    error,
    walletStates: cryptoStore.realtimeSyncStates,
    resetConnection,

    // Banking sync (using shared connection)
    banking: {
      isConnected: bankingStore.realtimeSyncConnected,
      error: bankingStore.realtimeSyncError,
      accountStates: bankingStore.realtimeSyncStates,
      resetConnection
    }
  };

  return (
    <RealtimeSyncContext.Provider value={contextValue}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}