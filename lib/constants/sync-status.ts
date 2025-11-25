/**
 * Unified Sync Status Constants
 *
 * Centralized definitions for sync statuses across crypto and banking
 * Backend endpoint: GET /api/v1/crypto/user/sync/stream (unified for both)
 */

/** Crypto wallet sync statuses */
export const CRYPTO_SYNC_ACTIVE_STATUSES = [
  'queued',
  'syncing',
  'syncing_assets',
  'syncing_transactions',
  'syncing_nfts',
  'syncing_defi'
] as const;

export const CRYPTO_SYNC_IDLE_STATUSES = [
  'completed',
  'failed',
  'idle'
] as const;

export type CryptoSyncStatus = typeof CRYPTO_SYNC_ACTIVE_STATUSES[number] | typeof CRYPTO_SYNC_IDLE_STATUSES[number];

/** Banking account sync statuses */
export const BANKING_SYNC_ACTIVE_STATUSES = [
  'queued',
  'processing',
  'syncing',
  'syncing_balance',
  'syncing_transactions'
] as const;

export const BANKING_SYNC_IDLE_STATUSES = [
  'completed',
  'failed',
  'idle'
] as const;

export type BankingSyncStatus = typeof BANKING_SYNC_ACTIVE_STATUSES[number] | typeof BANKING_SYNC_IDLE_STATUSES[number];

/**
 * Helper function: Check if crypto wallet is actively syncing
 */
export function isCryptoSyncing(status?: string): boolean {
  return status ? CRYPTO_SYNC_ACTIVE_STATUSES.includes(status as CryptoSyncStatus) : false;
}

/**
 * Helper function: Check if banking account is actively syncing
 */
export function isBankingSyncing(status?: string): boolean {
  return status ? BANKING_SYNC_ACTIVE_STATUSES.includes(status as BankingSyncStatus) : false;
}

/**
 * Helper function: Get display label for sync status
 */
export function getSyncStatusLabel(status?: string): string {
  const labels: Record<string, string> = {
    // Crypto
    'queued': 'Queued',
    'syncing': 'Syncing',
    'syncing_assets': 'Syncing Assets',
    'syncing_transactions': 'Syncing Transactions',
    'syncing_nfts': 'Syncing NFTs',
    'syncing_defi': 'Syncing DeFi',

    // Banking
    'processing': 'Processing',
    'syncing_balance': 'Syncing Balance',

    // Common
    'completed': 'Completed',
    'failed': 'Failed',
    'idle': 'Idle'
  };

  return labels[status || ''] || 'Unknown';
}

/**
 * Count active syncs from sync states
 */
export function countActiveSyncs(
  syncStates: Record<string, { status?: string }>,
  isBanking: boolean = false
): number {
  const isActive = isBanking ? isBankingSyncing : isCryptoSyncing;
  return Object.values(syncStates).filter(state => isActive(state.status)).length;
}

/**
 * Get IDs of actively syncing items
 */
export function getActiveSyncIds(
  syncStates: Record<string, { status?: string }>,
  isBanking: boolean = false
): string[] {
  const isActive = isBanking ? isBankingSyncing : isCryptoSyncing;
  return Object.keys(syncStates).filter(id => isActive(syncStates[id].status));
}

/**
 * Check if any syncs are active in sync states
 */
export function hasActiveSyncs(
  syncStates: Record<string, { status?: string }>,
  isBanking: boolean = false
): boolean {
  return countActiveSyncs(syncStates, isBanking) > 0;
}
