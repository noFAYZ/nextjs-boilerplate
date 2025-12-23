/**
 * SSE Cache Invalidation Handler
 *
 * Handles real-time cache invalidation when sync jobs complete
 * CRITICAL: Ensures frontend cache is invalidated IMMEDIATELY
 * when backend data changes, preventing stale financial data
 */

import { QueryClient } from '@tanstack/react-query';
import { bankingKeys } from '@/lib/queries/banking-queries';
import { cryptoKeys } from '@/lib/queries/crypto-queries';
import type { SSEMessage } from './sse-manager';

export class SSECacheHandler {
  private queryClient: QueryClient;
  private invalidationLog: Array<{
    timestamp: number;
    type: string;
    duration: number;
    affectedQueries: string[];
  }> = [];

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Handle banking sync completion
   * CRITICAL: This runs synchronously, no delays
   */
  public handleBankingSyncComplete(message: SSEMessage) {
    const startTime = performance.now();
    const affectedQueries: string[] = [];

    // Get the connection/account ID from the message
    const accountId = message.accountId;
    const connectionId = message.accountId; // Adjust based on your message structure

    if (!accountId) return;

    try {
      // TIER 1: Clear transaction cache (Most Critical - User Trust)
      // Remove from cache entirely to force fresh fetch
      this.queryClient.removeQueries({
        queryKey: bankingKeys.accountTransactions(accountId),
        exact: false, // Remove all variations (with different params)
      });
      affectedQueries.push('accountTransactions');

      // TIER 2: Clear account/balance cache
      this.queryClient.removeQueries({
        queryKey: bankingKeys.account(accountId),
        exact: true,
      });
      affectedQueries.push('account');

      // TIER 3: Invalidate accounts list (will refetch stale)
      this.queryClient.invalidateQueries({
        queryKey: bankingKeys.accounts(),
        refetchType: 'stale', // Only if stale
      });
      affectedQueries.push('accounts');

      // TIER 4: Invalidate overview/dashboard (less urgent)
      this.queryClient.invalidateQueries({
        queryKey: bankingKeys.overview(),
        refetchType: 'stale',
      });
      affectedQueries.push('overview');

      // Now trigger immediate refetch of critical data
      // This will fetch fresh data from backend
      void this.queryClient.refetchQueries({
        queryKey: bankingKeys.accountTransactions(accountId),
        type: 'active', // Only refetch if in use
      });

      void this.queryClient.refetchQueries({
        queryKey: bankingKeys.account(accountId),
        type: 'active',
      });

      // Success logging
      const duration = performance.now() - startTime;
      this.logInvalidation('banking_sync_complete', duration, affectedQueries);

      console.log(
        `[SSE Cache] Banking sync invalidation completed in ${duration.toFixed(1)}ms`,
        { accountId, affectedQueries }
      );
    } catch (error) {
      console.error('[SSE Cache] Banking sync invalidation failed:', error);
    }
  }

  /**
   * Handle crypto sync completion
   */
  public handleCryptoSyncComplete(message: SSEMessage) {
    const startTime = performance.now();
    const affectedQueries: string[] = [];
    const walletId = message.walletId;

    if (!walletId) return;

    try {
      // Clear wallet transaction cache
      this.queryClient.removeQueries({
        queryKey: cryptoKeys.walletTransactions(walletId),
        exact: false,
      });
      affectedQueries.push('walletTransactions');

      // Clear individual wallet cache
      this.queryClient.removeQueries({
        queryKey: cryptoKeys.wallet(walletId),
        exact: false,
      });
      affectedQueries.push('wallet');

      // Invalidate wallets list
      this.queryClient.invalidateQueries({
        queryKey: cryptoKeys.wallets(),
        refetchType: 'stale',
      });
      affectedQueries.push('wallets');

      // Invalidate portfolio
      this.queryClient.invalidateQueries({
        queryKey: cryptoKeys.portfolio(),
        refetchType: 'stale',
      });
      affectedQueries.push('portfolio');

      // Refetch critical data
      void this.queryClient.refetchQueries({
        queryKey: cryptoKeys.wallet(walletId),
        type: 'active',
      });

      const duration = performance.now() - startTime;
      this.logInvalidation('crypto_sync_complete', duration, affectedQueries);

      console.log(
        `[SSE Cache] Crypto sync invalidation completed in ${duration.toFixed(1)}ms`,
        { walletId, affectedQueries }
      );
    } catch (error) {
      console.error('[SSE Cache] Crypto sync invalidation failed:', error);
    }
  }

  /**
   * Handle real-time balance update (optimistic)
   * Doesn't invalidate - just updates the cached value immediately
   */
  public handleBalanceUpdate(message: SSEMessage) {
    if (!message.accountId || message.data?.balance === undefined) {
      return;
    }

    try {
      // Update cache with new balance (optimistic)
      this.queryClient.setQueryData(
        bankingKeys.account(message.accountId),
        (oldData: any) => {
          if (!oldData) return null;
          return {
            ...oldData,
            balance: message.data.balance,
            updatedAt: new Date().toISOString(),
          };
        }
      );

      // Trigger background refetch to verify
      void this.queryClient.refetchQueries({
        queryKey: bankingKeys.account(message.accountId),
        type: 'inactive', // Refetch in background
      });

      console.log('[SSE Cache] Balance updated optimistically', {
        accountId: message.accountId,
        balance: message.data.balance,
      });
    } catch (error) {
      console.error('[SSE Cache] Balance update failed:', error);
    }
  }

  /**
   * Handle sync progress updates
   * Just for logging/UI, don't invalidate cache
   */
  public handleSyncProgress(message: SSEMessage) {
    console.log('[SSE Cache] Sync in progress', {
      accountId: message.accountId,
      progress: message.progress,
      status: message.status,
    });
    // No cache invalidation needed - sync is ongoing
  }

  /**
   * Handle sync errors
   * Invalidate to ensure fresh retry
   */
  public handleSyncError(message: SSEMessage) {
    const startTime = performance.now();
    const affectedQueries: string[] = [];

    try {
      // On error, invalidate sync status but keep data
      // User should retry manually
      if (message.accountId) {
        this.queryClient.invalidateQueries({
          queryKey: bankingKeys.syncStatus(message.accountId),
          refetchType: 'active',
        });
        affectedQueries.push('syncStatus');
      }

      const duration = performance.now() - startTime;
      this.logInvalidation('sync_error', duration, affectedQueries);

      console.error('[SSE Cache] Sync error handled', {
        accountId: message.accountId,
        error: message.error,
        duration: duration.toFixed(1) + 'ms',
      });
    } catch (error) {
      console.error('[SSE Cache] Error handling failed:', error);
    }
  }

  /**
   * Clear all financial data cache (nuclear option)
   * Use only on logout or account switch
   */
  public clearAllFinancialCache() {
    try {
      this.queryClient.removeQueries({
        queryKey: bankingKeys.all,
      });
      this.queryClient.removeQueries({
        queryKey: cryptoKeys.all,
      });
      console.log('[SSE Cache] All financial cache cleared');
    } catch (error) {
      console.error('[SSE Cache] Cache clear failed:', error);
    }
  }

  /**
   * Get invalidation metrics
   */
  public getMetrics() {
    const totalInvalidations = this.invalidationLog.length;
    const avgDuration =
      this.invalidationLog.length > 0
        ? this.invalidationLog.reduce((sum, log) => sum + log.duration, 0) /
          this.invalidationLog.length
        : 0;

    const slowInvalidations = this.invalidationLog.filter(
      (log) => log.duration > 100 // > 100ms = slow
    );

    return {
      totalInvalidations,
      avgDuration: avgDuration.toFixed(1) + 'ms',
      slowInvalidations: slowInvalidations.length,
      slowThreshold: '100ms',
      recentInvalidations: this.invalidationLog.slice(-10),
    };
  }

  /**
   * Log invalidation for monitoring
   */
  private logInvalidation(type: string, duration: number, affectedQueries: string[]) {
    this.invalidationLog.push({
      timestamp: Date.now(),
      type,
      duration,
      affectedQueries,
    });

    // Keep only last 100 logs
    if (this.invalidationLog.length > 100) {
      this.invalidationLog.shift();
    }

    // Warn if invalidation took too long (> 100ms)
    if (duration > 100) {
      console.warn(`[SSE Cache] Slow invalidation: ${type} took ${duration.toFixed(1)}ms`);
    }
  }
}
