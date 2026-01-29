'use client'

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useBankingStore, selectActiveRealtimeSyncCount } from '@/lib/stores/banking-store';
import { cryptoApi } from '@/lib/services/crypto-api';
import { bankingApi } from '@/lib/services/banking-api';

// Global flag to prevent multiple auto-sync hooks from running
let globalAutoSyncInstance: string | null = null;

/**
 * Hook that automatically triggers both wallet and bank account sync on first daily login
 */
export function useUnifiedAutoSync() {
  const { isAuthenticated, isInitialized, isFirstLoginToday } = useAuthStore();
  const { realtimeSyncStates: cryptoSyncStates } = useCryptoStore();
  const { realtimeSyncStates: bankingSyncStates } = useBankingStore();

  // Generate unique instance ID for this hook
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Track if auto-sync has already been triggered today
  const [autoSyncTriggered, setAutoSyncTriggered] = useState(false);
  const autoSyncInProgress = useRef(false);
  const lastSyncTrigger = useRef<string | null>(null);
  const hookInitialized = useRef(false);

  // Check if any syncs are currently active
  const hasCryptoActiveSyncs = Object.values(cryptoSyncStates).some(state =>
    ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
  );

  const hasBankingActiveSyncs = Object.values(bankingSyncStates).some(state =>
    ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(state.status)
  );

  const hasActiveSyncs = hasCryptoActiveSyncs || hasBankingActiveSyncs;

  // Initialize and reset auto-sync trigger state when date changes
  useEffect(() => {
    if (hookInitialized.current) return;
    hookInitialized.current = true;

    const currentInstanceId = instanceId.current;

    // Set this instance as the global auto-sync handler
    if (!globalAutoSyncInstance) {
      globalAutoSyncInstance = currentInstanceId;
      console.log(`🔧 Unified auto-sync instance ${currentInstanceId} taking control`);
    }

    const today = new Date().toISOString().split('T')[0];
    const lastAutoSync = localStorage.getItem('lastUnifiedAutoSync');

    // Reset if it's a new day or first time
    if (lastAutoSync !== today) {
      setAutoSyncTriggered(false);
      lastSyncTrigger.current = today;
      localStorage.removeItem('lastUnifiedAutoSync');
    } else {
      // Auto-sync already happened today
      setAutoSyncTriggered(true);
      lastSyncTrigger.current = today;
    }

    // Cleanup function
    return () => {
      if (globalAutoSyncInstance === currentInstanceId) {
        globalAutoSyncInstance = null;
        console.log(`🔧 Unified auto-sync instance ${currentInstanceId} releasing control`);
      }
    };
  }, []);

  // Trigger unified auto-sync on first daily login
  const triggerAutoSync = useCallback(async () => {
    // Only allow the controlling instance to trigger auto-sync
    if (globalAutoSyncInstance !== instanceId.current) {
      console.log(`⏸️ Instance ${instanceId.current} is not the controller, skipping auto-sync`);
      return;
    }

    // Global rate limiter - prevent any auto-sync within 30 seconds
    const now = Date.now();
    const lastTrigger = localStorage.getItem('lastUnifiedAutoSyncTrigger');
    if (lastTrigger && (now - parseInt(lastTrigger)) < 30000) {
      console.log('⏸️ Unified auto-sync rate limited (30s cooldown), skipping...');
      return;
    }

    // Prevent multiple simultaneous calls
    if (autoSyncInProgress.current) {
      console.log('⏸️ Unified auto-sync already in progress, skipping...');
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
      localStorage.setItem('lastUnifiedAutoSyncTrigger', now.toString());

      console.log(`🔄 Instance ${instanceId.current}: Triggering unified auto-sync for first daily login...`);

      // Trigger sync for both crypto wallets and bank accounts in parallel
      const [cryptoResult, bankingResult] = await Promise.allSettled([
        cryptoApi.refreshAllWallets(),
        bankingApi.refreshAllAccounts()
      ]);

      let cryptoSuccess = false;
      let bankingSuccess = false;
      let cryptoJobsCount = 0;
      let bankingJobsCount = 0;

      // Handle crypto sync result
      if (cryptoResult.status === 'fulfilled' && cryptoResult.value.success) {
        cryptoSuccess = true;
        cryptoJobsCount = cryptoResult.value.data.syncJobs.length;

        // Initialize sync states for crypto wallets
        cryptoResult.value.data.syncJobs.forEach(job => {
          useCryptoStore.setState((state) => {
            state.realtimeSyncStates[job.walletId] = {
              progress: 0,
              status: 'queued',
              message: 'Starting wallet sync...'
            };
          });
        });

        console.log(`✅ Crypto auto-sync initiated for ${cryptoJobsCount} wallets`);
      } else {
        const error = cryptoResult.status === 'rejected'
          ? cryptoResult.reason
          : cryptoResult.value.error?.message;
        console.error('❌ Crypto auto-sync failed:', error);
      }

      // Handle banking sync result
      if (bankingResult.status === 'fulfilled' && bankingResult.value.success) {
        bankingSuccess = true;
        bankingJobsCount = bankingResult.value.data.syncJobs.length;

  /*       // Initialize sync states for bank accounts
        bankingResult.value.data.syncJobs.forEach(job => {
          useBankingStore.setState((state) => {
            state.realtimeSyncStates[job.accountId] = {
              progress: 0,
              status: 'processing',
              message: 'Starting account sync...'
            };
          });
        }); */

        console.log(`✅ Banking auto-sync initiated for ${bankingJobsCount} accounts`);
      } else {
        const error = bankingResult.status === 'rejected'
          ? bankingResult.reason
          : bankingResult.value.error?.message;
        console.error('❌ Banking auto-sync failed:', error);
      }

      // Mark auto-sync as completed for today if at least one succeeded
      if (cryptoSuccess || bankingSuccess) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastUnifiedAutoSync', today);
        console.log(`✨ Unified auto-sync completed: ${cryptoJobsCount} wallets + ${bankingJobsCount} bank accounts`);
      } else {
        // Reset trigger state on complete failure so it can retry
        console.warn('⚠️ Both crypto and banking auto-sync failed, will retry');
        setAutoSyncTriggered(false);
      }
    } catch (error) {
      console.error('❌ Unified auto-sync error:', error);
      // Reset trigger state on error so it can retry
      setAutoSyncTriggered(false);
    } finally {
      autoSyncInProgress.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isInitialized, autoSyncTriggered]);

  // Run auto-sync when authentication state changes
  useEffect(() => {
    if (isAuthenticated && isInitialized && !autoSyncTriggered && globalAutoSyncInstance === instanceId.current) {
      // Debounce with longer delay to prevent multiple triggers
      const timeoutId = setTimeout(triggerAutoSync, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isInitialized, autoSyncTriggered, triggerAutoSync]);

  return {
    hasActiveSyncs,
    hasCryptoActiveSyncs,
    hasBankingActiveSyncs,
    triggerAutoSync,
    isFirstLoginToday: isFirstLoginToday(),
    autoSyncTriggered
  };
}