/**
 * Realtime Sync Connection Hook
 *
 * PURPOSE: Opt-in hook for pages that need real-time sync via SSE
 * - Only establishes connection when explicitly used
 * - Prevents unnecessary SSE connections on every page
 * - Production-grade: No global connections, only where needed
 *
 * USAGE:
 * ```tsx
 * // In a page/component that needs real-time sync
 * function WalletPage() {
 *   // Establish SSE connection only on this page
 *   const { isConnected, error } = useRealtimeSyncConnection({
 *     enableCrypto: true,  // Enable crypto sync events
 *     enableBanking: false, // Disable banking sync events
 *   });
 *
 *   // Rest of your component...
 * }
 * ```
 *
 * WHERE TO USE:
 * - Crypto wallet pages (when user is actively viewing/managing wallets)
 * - Banking account pages (when user is actively viewing/managing accounts)
 * - Dashboard pages (when real-time updates are needed)
 *
 * WHERE NOT TO USE:
 * - Auth pages
 * - Settings pages
 * - Profile pages
 * - Static content pages
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { sseManager, SSEMessage } from '@/lib/services/sse-manager';
import { cryptoKeys } from '@/lib/queries/crypto-queries';
import { bankingKeys } from '@/lib/queries/banking-queries';
import { WalletSyncProgress } from '@/lib/hooks/use-realtime-sync';
import { toast } from 'sonner';

interface RealtimeSyncConnectionOptions {
  enableCrypto?: boolean;
  enableBanking?: boolean;
  autoReconnect?: boolean;
}

interface BankingSyncState {
  progress: number;
  status: string;
  message?: string;
  error?: string;
}

export function useRealtimeSyncConnection(options: RealtimeSyncConnectionOptions = {}) {
  const {
    enableCrypto = true,
    enableBanking = true,
    autoReconnect = true,
  } = options;

  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const bankingStore = useBankingStore();
  const cryptoStore = useCryptoStore();

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to avoid recreating handlers
  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // Handle crypto sync messages
  const handleCryptoMessage = useCallback(
    (data: SSEMessage) => {
      try {
        switch (data.type) {
          case 'wallet_sync_progress':
            if (data.walletId && data.progress !== undefined && data.status) {
              const progressData: WalletSyncProgress = {
                walletId: data.walletId,
                progress: data.progress,
                status: data.status as WalletSyncProgress['status'],
                message: data.message,
                error: data.error,
                startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
                completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
                syncedData: data.syncedData,
              };

              if (progressData.status === 'failed' && progressData.error) {
                cryptoStore.failRealtimeSync(data.walletId, progressData.error);
              } else {
                cryptoStore.updateRealtimeSyncProgress(
                  data.walletId,
                  progressData.progress,
                  progressData.status,
                  progressData.message
                );
              }
            }
            break;

          case 'wallet_sync_completed':
            if (data.walletId) {
              cryptoStore.completeRealtimeSync(data.walletId, data.syncedData);

              // Invalidate and refetch crypto queries
              queryClient.invalidateQueries({ queryKey: cryptoKeys.all });
              queryClient.refetchQueries({
                queryKey: cryptoKeys.all,
                type: 'active',
                exact: false,
              });
              queryClient.refetchQueries({ queryKey: cryptoKeys.wallets() });
              queryClient.refetchQueries({ queryKey: cryptoKeys.portfolio() });
            }
            break;

          case 'wallet_sync_failed':
            if (data.walletId) {
              const errorMsg = data.error || 'Unknown error';
              cryptoStore.failRealtimeSync(data.walletId, errorMsg);
            }
            break;
        }
      } catch (error) {
        console.error('[RealtimeSync] Error handling crypto message:', error);
      }
    },
    [cryptoStore, queryClient]
  );

  // Handle banking sync messages
  const handleBankingMessage = useCallback(
    (data: SSEMessage) => {
  
      try {
        const statusMap: Record<string, string> = {
          syncing_bank: 'syncing',
          syncing_balance: 'syncing_balance',
          syncing_transactions: 'syncing_transactions',  
          sync_completed: 'completed',
          failed_bank: 'failed',
        };

        switch (data.type) {
          case 'sync_progress':
            if (data.accountId && data.status) {
              const mappedStatus = statusMap[data.status] || data.status;

              if (data.status === 'completed_bank') {
                bankingStore.completeRealtimeSync(data.accountId, data.syncedData);

                // Invalidate and refetch banking queries
                queryClient.invalidateQueries({ queryKey: bankingKeys.all });
                queryClient.refetchQueries({
                  queryKey: bankingKeys.all,
                  type: 'active',
                  exact: false,
                });
                queryClient.refetchQueries({ queryKey: bankingKeys.accounts() });
                queryClient.refetchQueries({ queryKey: bankingKeys.overview() });

                toast.success('Bank account sync completed successfully');
              } else if (data.status === 'failed_bank') {
                bankingStore.failRealtimeSync(
                  data.accountId,
                  data.message || 'Bank sync failed'
                );
                toast.error(`Bank account sync failed: ${data.message || 'Unknown error'}`);
              } else {
                bankingStore.updateRealtimeSyncProgress(
                  data.accountId,
                  data.progress || 0,
                  mappedStatus as
                    | 'syncing'
                    | 'syncing_balance'
                    | 'syncing_transactions'
                    | 'completed'
                    | 'failed',
                  data.message || 'Syncing bank account...'
                );
              }
            }
            break;

          case 'syncing_bank':
          case 'syncing_transactions_bank':
            if (data.accountId) {
              const mappedStatus =
                data.type === 'syncing_bank' ? 'syncing' : 'syncing_transactions';
              bankingStore.updateRealtimeSyncProgress(
                data.accountId,
                data.progress || (data.type === 'syncing_bank' ? 10 : 50),
                mappedStatus as
                  | 'syncing'
                  | 'syncing_balance'
                  | 'syncing_transactions'
                  | 'completed'
                  | 'failed',
                data.message
              );
            }
            break;

          case 'sync_completed':
            if (data.accountId) {
              bankingStore.completeRealtimeSync(data.accountId, data.syncedData);

              // Invalidate and refetch banking queries
              queryClient.invalidateQueries({ queryKey: bankingKeys.all });
              queryClient.refetchQueries({
                queryKey: bankingKeys.all,
                type: 'active',
                exact: false,
              });
              queryClient.refetchQueries({ queryKey: bankingKeys.accounts() });
              queryClient.refetchQueries({ queryKey: bankingKeys.overview() });

       
            }
            break;

          case 'failed_bank':
            if (data.accountId) {
              const errorMsg = data.error || 'Unknown error occurred';
              bankingStore.failRealtimeSync(data.accountId, errorMsg);
              toast.error(`Bank account sync failed: ${errorMsg}`);
            }
            break;
        }
      } catch (error) {
        console.error('[RealtimeSync] Error handling banking message:', error);
      }
    },
    [bankingStore, queryClient]
  );

  // Handle connection status messages
  const handleConnectionMessage = useCallback(
    (data: SSEMessage) => {

      switch (data.type) {
        case 'connection_established':
          setIsConnected(true);
          setError(null);
          if (enableCrypto) cryptoStore.setRealtimeSyncConnected(true);
          if (enableBanking) bankingStore.setRealtimeSyncConnected(true);
          break;

        case 'connection_closed':
          setIsConnected(false);
          if (enableCrypto) cryptoStore.setRealtimeSyncConnected(false);
          if (enableBanking) bankingStore.setRealtimeSyncConnected(false);
          break;
      }

    },
    [enableCrypto, enableBanking, cryptoStore, bankingStore]
  );

  // Handle error messages
  const handleErrorMessage = useCallback(
    (data: SSEMessage) => {
      const errorMsg = data.error || 'Connection error';
      setError(errorMsg);
      setIsConnected(false);

      if (enableCrypto) {
        cryptoStore.setRealtimeSyncError(errorMsg);
        cryptoStore.setRealtimeSyncConnected(false);
      }

      if (enableBanking) {
        bankingStore.setRealtimeSyncError(errorMsg);
        bankingStore.setRealtimeSyncConnected(false);
      }
    },
    [enableCrypto, enableBanking, cryptoStore, bankingStore]
  );

  // Subscribe to SSE channels when authenticated and enabled
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Clear previous unsubscribe functions
    unsubscribeRefs.current.forEach((unsub) => unsub());
    unsubscribeRefs.current = [];

    // Subscribe to relevant channels based on options
    if (enableCrypto) {
      const unsubCrypto = sseManager.subscribe('crypto_sync', handleCryptoMessage);
      unsubscribeRefs.current.push(unsubCrypto);
    }

    if (enableBanking) {
      const unsubBanking = sseManager.subscribe('banking_sync', handleBankingMessage);
      unsubscribeRefs.current.push(unsubBanking);
  

    }
  
    // Always subscribe to connection and error events
    const unsubConnection = sseManager.subscribe('connection', handleConnectionMessage);
    const unsubError = sseManager.subscribe('error', handleErrorMessage);
    unsubscribeRefs.current.push(unsubConnection, unsubError);

    // Cleanup on unmount
    return () => {
      unsubscribeRefs.current.forEach((unsub) => unsub());
      unsubscribeRefs.current = [];
    };
  }, [
    isAuthenticated,
    enableCrypto,
    enableBanking,
    handleCryptoMessage,
    handleBankingMessage,
    handleConnectionMessage,
    handleErrorMessage,
  ]);

  // Reset connection manually
  const resetConnection = useCallback(() => {
    sseManager.resetConnection();
  }, []);

  return {
    isConnected,
    error,
    resetConnection,
    walletStates: enableCrypto ? cryptoStore.realtimeSyncStates : {},
    accountStates: enableBanking ? bankingStore.realtimeSyncStates : {},
  };
}