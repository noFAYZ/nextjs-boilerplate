'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletSyncProgress } from '@/lib/hooks/use-realtime-sync';

interface RealtimeSyncContextValue {
  isConnected: boolean;
  error: string | null;
}

const RealtimeSyncContext = createContext<RealtimeSyncContextValue>({
  isConnected: false,
  error: null
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
  const { isConnected, error } = useWalletSyncProgress();

  return (
    <RealtimeSyncContext.Provider value={{ isConnected, error }}>
      {children}
    </RealtimeSyncContext.Provider>
  );
}