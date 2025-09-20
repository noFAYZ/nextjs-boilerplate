'use client'

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useDockContext } from '@/components/providers/dock-provider';
import { cryptoApi } from '@/lib/services/crypto-api';

// Global flag to prevent multiple auto-sync hooks from running
let globalAutoSyncInstance: string | null = null;

/**
 * Hook that automatically triggers wallet sync on first daily login
 * and manages the wallet dock expansion during sync operations
 */
export function useAutoWalletSync() {
  const { isAuthenticated, isInitialized, isFirstLoginToday } = useAuthStore();
  const { wallets: walletsStore } = useDockContext();
  const { realtimeSyncStates } = useCryptoStore();

  // Generate unique instance ID for this hook
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Track if auto-sync has already been triggered today
  const [autoSyncTriggered, setAutoSyncTriggered] = useState(false);
  const autoSyncInProgress = useRef(false);
  const lastSyncTrigger = useRef<string | null>(null);
  const hookInitialized = useRef(false);

  // Check if any wallets are currently syncing
  const hasActiveSyncs = Object.values(realtimeSyncStates).some(state =>
    ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
  );

  // Auto-expand wallet dock when syncing
  useEffect(() => {
    if (hasActiveSyncs && !walletsStore.isExpanded) {
      walletsStore.expand();
    }
  }, [hasActiveSyncs, walletsStore]);

  // Initialize and reset auto-sync trigger state when date changes
  useEffect(() => {
    if (hookInitialized.current) return;
    hookInitialized.current = true;

    const currentInstanceId = instanceId.current;

    // Set this instance as the global auto-sync handler
    if (!globalAutoSyncInstance) {
      globalAutoSyncInstance = currentInstanceId;
      console.log(`🔧 Auto-sync instance ${currentInstanceId} taking control`);
    }

    const today = new Date().toISOString().split('T')[0];
    const lastAutoSync = localStorage.getItem('lastAutoWalletSync');

    // Reset if it's a new day or first time
    if (lastAutoSync !== today) {
      setAutoSyncTriggered(false);
      lastSyncTrigger.current = today;
      localStorage.removeItem('lastAutoWalletSync');
    } else {
      // Auto-sync already happened today
      setAutoSyncTriggered(true);
      lastSyncTrigger.current = today;
    }

    // Cleanup function
    return () => {
      if (globalAutoSyncInstance === currentInstanceId) {
        globalAutoSyncInstance = null;
        console.log(`🔧 Auto-sync instance ${currentInstanceId} releasing control`);
      }
    };
  }, []);

  // Trigger auto-sync on first daily login (memoized to prevent re-creation)
  const triggerAutoSync = useCallback(async () => {
    // Only allow the controlling instance to trigger auto-sync
    if (globalAutoSyncInstance !== instanceId.current) {
      console.log(`⏸️ Instance ${instanceId.current} is not the controller, skipping auto-sync`);
      return;
    }

    // Global rate limiter - prevent any auto-sync within 30 seconds
    const now = Date.now();
    const lastTrigger = localStorage.getItem('lastAutoSyncTrigger');
    if (lastTrigger && (now - parseInt(lastTrigger)) < 30000) {
      console.log('⏸️ Auto-sync rate limited (30s cooldown), skipping...');
      return;
    }

    // Prevent multiple simultaneous calls
    if (autoSyncInProgress.current) {
      console.log('⏸️ Auto-sync already in progress, skipping...');
      return;
    }

    if (!isAuthenticated || !isInitialized) {
      return;
    }

    // Check if auto-sync has already been triggered today
    if (autoSyncTriggered) {
      return;
    }

    // Check if this is the first login today
    if (!isFirstLoginToday()) {
      return;
    }

    try {
      autoSyncInProgress.current = true;
      setAutoSyncTriggered(true);

      // Set rate limit timestamp
      localStorage.setItem('lastAutoSyncTrigger', now.toString());

      console.log(`🔄 Instance ${instanceId.current}: Triggering auto wallet sync for first daily login...`);

      // Expand wallet dock to show progress
      walletsStore.expand();

      // Trigger sync for all wallets
      const result = await cryptoApi.refreshAllWallets();

      if (result.success) {
        console.log(`✅ Auto-sync initiated for ${result.data.syncJobs.length} wallets`);
        // Mark auto-sync as completed for today
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastAutoWalletSync', today);
      } else {
        console.error('❌ Auto-sync failed:', result.error?.message);
        // Reset trigger state on failure so it can retry
        setAutoSyncTriggered(false);
      }
    } catch (error) {
      console.error('❌ Auto-sync error:', error);
      // Reset trigger state on error so it can retry
      setAutoSyncTriggered(false);
    } finally {
      autoSyncInProgress.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isInitialized, autoSyncTriggered, walletsStore]);

  // Run auto-sync when authentication state changes - removed isFirstLoginToday from dependency
  useEffect(() => {
    if (isAuthenticated && isInitialized && !autoSyncTriggered && globalAutoSyncInstance === instanceId.current) {
      // Debounce with longer delay to prevent multiple triggers
      const timeoutId = setTimeout(triggerAutoSync, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isInitialized, autoSyncTriggered, triggerAutoSync]);

  return {
    hasActiveSyncs,
    triggerAutoSync,
    isFirstLoginToday: isFirstLoginToday(),
    autoSyncTriggered
  };
}