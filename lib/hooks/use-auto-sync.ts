"use client";

import { useEffect, useCallback, useState } from "react";
import { useCryptoStore } from "@/lib/stores/crypto-store";
import { cryptoApi } from "@/lib/services/crypto-api";
import type { SyncJobStatus } from "@/lib/types/crypto";

interface AutoSyncOptions {
  dailySyncEnabled?: boolean;
  longAbsenceThresholdHours?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

interface SyncStats {
  totalWallets: number;
  syncedWallets: number;
  failedWallets: number;
  syncingWallets: number;
  lastSyncTime: Date | null;
  isAutoSyncing: boolean;
  syncProgress: number;
}

const DEFAULT_OPTIONS: Required<AutoSyncOptions> = {
  dailySyncEnabled: true,
  longAbsenceThresholdHours: 6,
  maxRetries: 3,
  retryDelayMs: 2000,
};

const STORAGE_KEYS = {
  LAST_SYNC: 'moneymappr_last_wallet_sync',
  LAST_LOGIN: 'moneymappr_last_login',
  AUTO_SYNC_SETTINGS: 'moneymappr_auto_sync_settings',
};

export function useAutoSync(options: AutoSyncOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { wallets, syncStatuses } = useCryptoStore();
  
  const [syncStats, setSyncStats] = useState<SyncStats>({
    totalWallets: 0,
    syncedWallets: 0,
    failedWallets: 0,
    syncingWallets: 0,
    lastSyncTime: null,
    isAutoSyncing: false,
    syncProgress: 0,
  });

  // Check if auto-sync should trigger
  const shouldAutoSync = useCallback((): boolean => {
    if (!config.dailySyncEnabled || typeof window === 'undefined') return false;

    const now = new Date();
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);

    // First time user or no previous sync
    if (!lastSync || !lastLogin) {
      return true;
    }

    const lastSyncDate = new Date(lastSync);
    const lastLoginDate = new Date(lastLogin);

    // Check if it's the first login of the day
    const isFirstLoginToday = !isSameDay(lastLoginDate, now);

    // Check if user has been away for a long time
    const hoursSinceLastLogin = (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60);
    const isLongAbsence = hoursSinceLastLogin >= config.longAbsenceThresholdHours;

    return isFirstLoginToday || isLongAbsence;
  }, [config.dailySyncEnabled, config.longAbsenceThresholdHours]);

  // Check for outdated wallets (last sync > 1 hour)
  const getOutdatedWallets = useCallback((): string[] => {
    if (!wallets || wallets.length === 0) return [];

    const now = new Date();
    const oneHourAgo = now.getTime() - (60 * 60 * 1000); // 1 hour in milliseconds

    return wallets.filter(wallet => {
      // If wallet has never been synced, it's considered outdated
      if (!wallet.lastSyncAt) {
        return true;
      }

      const lastSync = new Date(wallet.lastSyncAt);
      return lastSync.getTime() < oneHourAgo;
    }).map(wallet => wallet.id);
  }, [wallets]);

  // Check if there are outdated wallets that need syncing
  const hasOutdatedWallets = useCallback((): boolean => {
    const outdatedWallets = getOutdatedWallets();
    return outdatedWallets.length > 0;
  }, [getOutdatedWallets]);

  // Simplified wallet operations without dock dependencies

  // Simple sync statistics update without problematic dependencies
  useEffect(() => {
    const lastSyncStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.LAST_SYNC) : null;
    const lastSyncTime = lastSyncStr ? new Date(lastSyncStr) : null;

    setSyncStats(prev => ({
      ...prev,
      totalWallets: wallets.length,
      lastSyncTime,
      isAutoSyncing: false, // Simplified for stability
    }));
  }, [wallets.length]);

  // Real-time wallet sync with progress tracking
  const syncWalletWithRetry = useCallback(async (
    walletId: string,
    retryCount = 0
  ): Promise<boolean> => {
    try {
      console.log(`🚀 Starting real-time sync for wallet ${walletId}`);

      // Use crypto API to trigger wallet sync (will be tracked via SSE/polling)
      const response = await cryptoApi.syncWallet(walletId, {
        syncAssets: true,
        syncTransactions: true,
        syncNFTs: true,
        syncDeFi: false
      });

      if (response.success) {
        console.log(`✅ Real-time sync started for wallet ${walletId}, job ID: ${response.data.jobId}`);
        return true;
      } else {
        throw new Error(response.error.message || 'Failed to start sync');
      }

    } catch (error) {
      if (retryCount < config.maxRetries) {
        console.log(`Retrying sync for wallet ${walletId} (attempt ${retryCount + 1}/${config.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelayMs * (retryCount + 1)));
        return syncWalletWithRetry(walletId, retryCount + 1);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Sync failed for wallet ${walletId}: ${errorMessage}`);
        return false;
      }
    }
  }, [config]);

  // Start auto-sync for outdated wallets only
  const startAutoSyncOutdated = useCallback(async (): Promise<{ successful: number; failed: number }> => {
    const outdatedWalletIds = getOutdatedWallets();

    if (outdatedWalletIds.length === 0) {
      return { successful: 0, failed: 0 };
    }

    setSyncStats(prev => ({ ...prev, isAutoSyncing: true }));

    const results = await Promise.allSettled(
      outdatedWalletIds.map(walletId => syncWalletWithRetry(walletId))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value === false)).length;

    // Update last sync time
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }

    setSyncStats(prev => ({
      ...prev,
      isAutoSyncing: false,
      lastSyncTime: new Date(),
    }));

    return { successful, failed };
  }, [getOutdatedWallets, syncWalletWithRetry]);

  // Start auto-sync for all wallets
  const startAutoSync = useCallback(async (): Promise<{ successful: number; failed: number }> => {
    if (wallets.length === 0) {
      return { successful: 0, failed: 0 };
    }

    setSyncStats(prev => ({ ...prev, isAutoSyncing: true }));

    const results = await Promise.allSettled(
      wallets.map(wallet => syncWalletWithRetry(wallet.id))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value === false)).length;

    // Update last sync time
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }

    setSyncStats(prev => ({
      ...prev,
      isAutoSyncing: false,
      lastSyncTime: new Date(),
    }));

    return { successful, failed };
  }, [wallets, syncWalletWithRetry]);

  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    return await startAutoSync();
  }, [startAutoSync]);

  // Update login timestamp
  const updateLoginTimestamp = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    }
  }, []);

  // Update login timestamp on hook initialization
  useEffect(() => {
    updateLoginTimestamp();
  }, [updateLoginTimestamp]);

  // Stats are now updated directly in the useEffect above

  // Dock integration removed to prevent infinite re-renders
  // The dock should handle its own wallet state management independently

  return {
    syncStats,
    shouldAutoSync: shouldAutoSync(),
    hasOutdatedWallets: hasOutdatedWallets(),
    getOutdatedWallets,
    triggerSync,
    startAutoSync,
    startAutoSyncOutdated,
    updateLoginTimestamp,
  };
}

// Helper function to check if two dates are on the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / 1440)}d ago`;
}