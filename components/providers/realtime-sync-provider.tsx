'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletSyncProgress, WalletSyncProgress } from '@/lib/hooks/use-realtime-sync';
import { useBankingSyncStream } from '@/lib/hooks/use-banking-sync';
import { useBankingStore } from '@/lib/stores/banking-store';

interface RealtimeSyncContextValue {
  // Crypto sync
  isConnected: boolean;
  error: string | null;
  walletStates: Record<string, WalletSyncProgress>;
  resetConnection: () => void;

  // Banking sync
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
  // Crypto sync (existing)
  const { isConnected, error, walletStates, resetConnection } = useWalletSyncProgress();

  // Banking sync (new)
  const bankingSync = useBankingSyncStream();
  const { realtimeSyncStates: accountStates, realtimeSyncConnected, realtimeSyncError } = useBankingStore();

  const contextValue: RealtimeSyncContextValue = {
    // Crypto sync
    isConnected,
    error,
    walletStates,
    resetConnection,

    // Banking sync
    banking: {
      isConnected: realtimeSyncConnected,
      error: realtimeSyncError,
      accountStates,
      resetConnection: bankingSync.reconnect
    }
  };

  return (
    <RealtimeSyncContext.Provider value={contextValue}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}