'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletSyncProgress, WalletSyncProgress } from '@/lib/hooks/use-realtime-sync';

interface RealtimeSyncContextValue {
  isConnected: boolean;
  error: string | null;
  walletStates: Record<string, WalletSyncProgress>;
  resetConnection: () => void;
}

const RealtimeSyncContext = createContext<RealtimeSyncContextValue>({
  isConnected: false,
  error: null,
  walletStates: {},
  resetConnection: () => {}
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
  const { isConnected, error, walletStates, resetConnection } = useWalletSyncProgress();

  return (
    <RealtimeSyncContext.Provider value={{ isConnected, error, walletStates, resetConnection }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}