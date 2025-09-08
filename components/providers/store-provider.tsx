'use client';

import { useEffect, ReactNode } from 'react';
import { useStoreInitialization } from '@/lib/hooks/use-store-initialization';

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * Store Provider Component
 * 
 * This component handles the initialization of all Zustand stores
 * and provides a centralized location for store-related setup.
 * 
 * Unlike traditional context providers, Zustand stores are global
 * and don't require provider wrapping, but we still need a place
 * to initialize them on app startup.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Initialize all stores
  useStoreInitialization();

  return <>{children}</>;
}