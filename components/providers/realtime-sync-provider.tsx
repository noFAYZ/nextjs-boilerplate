'use client'

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WalletSyncProgress } from '@/lib/hooks/use-realtime-sync';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { sseManager, SSEMessage } from '@/lib/services/sse-manager';
import { cryptoKeys } from '@/lib/queries/crypto-queries';
import { bankingKeys } from '@/lib/queries/banking-queries';

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

  // Handle crypto sync messages
  const handleCryptoMessage = useCallback((data: SSEMessage) => {
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
              syncedData: data.syncedData
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

            // Invalidate all crypto queries to mark them as stale
            queryClient.invalidateQueries({
              queryKey: cryptoKeys.all
            });

            // Force refetch of active queries
            queryClient.refetchQueries({
              queryKey: cryptoKeys.all,
              type: 'active',
              exact: false
            });

            // Specifically refetch wallet queries for immediate update
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
            const errorMsg = data.error || 'Unknown error';
            cryptoStore.failRealtimeSync(data.walletId, errorMsg);
          }
          break;
      }
    } catch (error) {
      console.error('[RealtimeSync] Error handling crypto message:', error);
    }
  }, [cryptoStore, queryClient]);

  // Handle banking sync messages
  const handleBankingMessage = useCallback((data: SSEMessage) => {
    try {
      const statusMap: Record<string, string> = {
        'syncing_bank': 'syncing',
        'syncing_balance': 'syncing_balance',
        'syncing_transactions': 'syncing_transactions',
        'completed_bank': 'completed',
        'failed_bank': 'failed'
      };

      switch (data.type) {
        case 'sync_progress':
          if (data.accountId && data.status) {
            const mappedStatus = statusMap[data.status] || data.status;

            if (data.status === 'completed_bank') {
              bankingStore.completeRealtimeSync(data.accountId, data.syncedData);

              // Invalidate all banking queries to mark them as stale
              queryClient.invalidateQueries({
                queryKey: bankingKeys.all
              });

              // Force refetch of active queries
              queryClient.refetchQueries({
                queryKey: bankingKeys.all,
                type: 'active',
                exact: false
              });

              // Specifically refetch account queries for immediate update
              queryClient.refetchQueries({
                queryKey: bankingKeys.accounts()
              });

              // Refetch dashboard data
              queryClient.refetchQueries({
                queryKey: bankingKeys.overview()
              });

              toast.success('Bank account sync completed successfully');
            } else if (data.status === 'failed_bank') {
              bankingStore.failRealtimeSync(data.accountId, data.message || 'Bank sync failed');
              toast.error(`Bank account sync failed: ${data.message || 'Unknown error'}`);
            } else {
              bankingStore.updateRealtimeSyncProgress(
                data.accountId,
                data.progress || 0,
                mappedStatus as 'syncing' | 'syncing_balance' | 'syncing_transactions' | 'completed' | 'failed',
                data.message || 'Syncing bank account...'
              );
            }
          }
          break;

        case 'syncing_bank':
        case 'syncing_transactions_bank':
          if (data.accountId) {
            const mappedStatus = data.type === 'syncing_bank' ? 'syncing' : 'syncing_transactions';
            bankingStore.updateRealtimeSyncProgress(
              data.accountId,
              data.progress || (data.type === 'syncing_bank' ? 10 : 50),
              mappedStatus as 'syncing' | 'syncing_balance' | 'syncing_transactions' | 'completed' | 'failed',
              data.message
            );
          }
          break;

        case 'completed_bank':
          if (data.accountId) {
            bankingStore.completeRealtimeSync(data.accountId, data.syncedData);

            // Invalidate all banking queries to mark them as stale
            queryClient.invalidateQueries({
              queryKey: bankingKeys.all
            });

            // Force refetch of active queries
            queryClient.refetchQueries({
              queryKey: bankingKeys.all,
              type: 'active',
              exact: false
            });

            // Specifically refetch account queries for immediate update
            queryClient.refetchQueries({
              queryKey: bankingKeys.accounts()
            });

            // Refetch dashboard data
            queryClient.refetchQueries({
              queryKey: bankingKeys.overview()
            });

            toast.success('Bank account sync completed successfully');
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
  }, [bankingStore, queryClient]);

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

  // Subscribe to SSE channels when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Subscribe to all relevant channels
    const unsubCrypto = sseManager.subscribe('crypto_sync', handleCryptoMessage);
    const unsubBanking = sseManager.subscribe('banking_sync', handleBankingMessage);
    const unsubConnection = sseManager.subscribe('connection', handleConnectionMessage);
    const unsubError = sseManager.subscribe('error', handleErrorMessage);

    // Cleanup on unmount
    return () => {
      unsubCrypto();
      unsubBanking();
      unsubConnection();
      unsubError();
    };
  }, [isAuthenticated, handleCryptoMessage, handleBankingMessage, handleConnectionMessage, handleErrorMessage]);

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