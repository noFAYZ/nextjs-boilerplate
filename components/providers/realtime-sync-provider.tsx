'use client'

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useWalletSyncProgress, useUnifiedSyncProgress, WalletSyncProgress } from '@/lib/hooks/use-realtime-sync';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { toast } from 'sonner';

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
    accountStates: Record<string, any>;
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
  const bankingStore = useBankingStore();

  // Banking sync handlers
  const handleBankingProgress = useCallback((accountId: string, progress: { progress: number; status: string; message?: string }) => {
    try {
      bankingStore.updateRealtimeSyncProgress(
        accountId,
        progress.progress,
        progress.status as any,
        progress.message
      );
    } catch (error) {
      console.error('Error in banking handleProgress:', error);
    }
  }, [bankingStore]);

  const handleBankingComplete = useCallback((accountId: string, result: { syncedData?: string[] }) => {
    try {
      bankingStore.completeRealtimeSync(accountId, result.syncedData);
      toast.success('Bank account sync completed successfully');
    } catch (error) {
      console.error('Error in banking handleComplete:', error);
    }
  }, [bankingStore]);

  const handleBankingError = useCallback((accountId: string, errorMsg: string) => {
    try {
      bankingStore.failRealtimeSync(accountId, errorMsg);
      toast.error(`Bank account sync failed: ${errorMsg}`);
    } catch (error) {
      console.error('Error in banking handleError:', error);
    }
  }, [bankingStore]);

  // Use a custom hook that includes banking callbacks
  const { isConnected, error, walletStates, resetConnection } = useUnifiedSyncProgress(
    handleBankingProgress,
    handleBankingComplete,
    handleBankingError
  );

  // Set banking connection state based on crypto connection state
  React.useEffect(() => {
    bankingStore.setRealtimeSyncConnected(isConnected);
    if (error) {
      bankingStore.setRealtimeSyncError(error);
    }
  }, [isConnected, error, bankingStore]);

  const contextValue: RealtimeSyncContextValue = {
    // Crypto sync (unchanged)
    isConnected,
    error,
    walletStates,
    resetConnection,

    // Banking sync (now using shared connection)
    banking: {
      isConnected: bankingStore.realtimeSyncConnected,
      error: bankingStore.realtimeSyncError,
      accountStates: bankingStore.realtimeSyncStates,
      resetConnection: resetConnection // Use same connection reset
    }
  };

  return (
    <RealtimeSyncContext.Provider value={contextValue}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}