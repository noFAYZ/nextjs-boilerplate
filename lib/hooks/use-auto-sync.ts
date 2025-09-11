"use client";

import { useEffect, useCallback, useState } from "react";
import { useDockContext } from "@/components/providers/dock-provider";
import { useCryptoStore } from "@/lib/stores/crypto-store";
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
  const { wallets: dockWallets } = useDockContext();
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

  // Get wallet statistics from dock
  const getWalletStats = useCallback(() => {
    const total = dockWallets.items.length;
    const active = dockWallets.items.filter(w => w.status === 'success').length;
    const errors = dockWallets.items.filter(w => w.status === 'error').length;
    const syncing = dockWallets.items.filter(w => w.status === 'loading').length;

    return { total, active, errors, syncing };
  }, [dockWallets.items]);

  // Update wallet status in dock
  const updateWalletStatus = useCallback((walletId: string, status: {
    id: string;
    name: string;
    symbol: string;
    balance: string;
    value: string;
    status: "success" | "loading" | "error" | "warning";
    lastSync: Date;
    icon?: React.ReactNode;
  }) => {
    const walletItem = {
      id: walletId,
      title: status.name,
      subtitle: `${status.balance} ${status.symbol} • ${status.value}`,
      status: status.status,
      timestamp: `Last sync: ${getTimeAgo(status.lastSync)}`,
      icon: status.icon,
      onClick: () => {
        window.location.href = `/dashboard/crypto/wallets/${walletId}`;
      }
    };

    const existingWallet = dockWallets.items.find(item => item.id === walletId);
    if (existingWallet) {
      dockWallets.updateItem(walletId, walletItem);
    } else {
      dockWallets.addItem(walletItem);
    }
  }, [dockWallets]);

  // Start wallet sync
  const syncWallet = useCallback((walletId: string) => {
    dockWallets.updateItem(walletId, {
      status: 'loading',
      subtitle: 'Syncing...',
      timestamp: 'Syncing now'
    });
  }, [dockWallets]);

  // Set wallet error
  const setWalletError = useCallback((walletId: string, error: string) => {
    dockWallets.updateItem(walletId, {
      status: 'error',
      subtitle: error,
      timestamp: 'Sync failed'
    });
  }, [dockWallets]);

  // Update sync statistics
  const updateSyncStats = useCallback(() => {
    const dockStats = getWalletStats();
    const lastSyncStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.LAST_SYNC) : null;
    const lastSyncTime = lastSyncStr ? new Date(lastSyncStr) : null;

    // Calculate progress based on sync statuses
    const totalWallets = wallets.length;
    const syncingWallets = Object.values(syncStatuses).filter((status: SyncJobStatus) => 
      status.status === 'processing' || status.status === 'queued'
    ).length;
    
    const syncedWallets = Object.values(syncStatuses).filter((status: SyncJobStatus) => 
      status.status === 'completed'
    ).length;
    
    const failedWallets = Object.values(syncStatuses).filter((status: SyncJobStatus) => 
      status.status === 'failed'
    ).length;

    const progress = totalWallets > 0 ? (syncedWallets + failedWallets) / totalWallets * 100 : 0;

    setSyncStats({
      totalWallets,
      syncedWallets,
      failedWallets,
      syncingWallets,
      lastSyncTime,
      isAutoSyncing: syncingWallets > 0,
      syncProgress: Math.round(progress),
    });
  }, [getWalletStats, wallets.length, syncStatuses]);

  // Perform wallet sync with retry logic
  const syncWalletWithRetry = useCallback(async (
    walletId: string, 
    retryCount = 0
  ): Promise<boolean> => {
    try {
      syncWallet(walletId);
      
      // Simulate sync API call - replace with actual sync logic
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate simulation
          if (Math.random() < 0.9) {
            resolve(void 0);
          } else {
            reject(new Error('Sync failed'));
          }
        }, Math.random() * 3000 + 1000); // 1-4 seconds
      });

      // Update wallet status on success
      const wallet = wallets.find(w => w.id === walletId);
      if (wallet) {
        updateWalletStatus(walletId, {
          id: walletId,
          name: wallet.name || 'Unknown Wallet',
          symbol: 'ETH', // Default or from wallet data
          balance: wallet.totalBalance || '0',
          value: `$${parseFloat(wallet.totalBalanceUsd || '0').toLocaleString()}`,
          status: 'success',
          lastSync: new Date(),
        });
      }

      return true;
    } catch (error) {
      if (retryCount < config.maxRetries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, config.retryDelayMs * (retryCount + 1)));
        return syncWalletWithRetry(walletId, retryCount + 1);
      } else {
        // Final failure
        setWalletError(walletId, `Sync failed after ${config.maxRetries} attempts`);
        return false;
      }
    }
  }, [wallets, syncWallet, updateWalletStatus, setWalletError, config.maxRetries, config.retryDelayMs]);

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

  // Check and trigger auto-sync on component mount
  useEffect(() => {
    updateLoginTimestamp();
    
    if (shouldAutoSync()) {
      // Small delay to allow UI to render first
      const timer = setTimeout(() => {
        startAutoSync();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoSync, startAutoSync, updateLoginTimestamp]);

  // Update stats when sync statuses change
  useEffect(() => {
    updateSyncStats();
  }, [updateSyncStats]);

  return {
    syncStats,
    shouldAutoSync: shouldAutoSync(),
    triggerSync,
    startAutoSync,
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