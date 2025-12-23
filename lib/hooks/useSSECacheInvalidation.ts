/**
 * useSSECacheInvalidation Hook
 *
 * Connects SSE events to TanStack Query cache invalidation
 * Ensures frontend cache is cleared immediately when backend data changes
 *
 * Usage:
 * useSSECacheInvalidation() // Add this in your top-level layout
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SSEManager, SSEChannel, SSEMessage } from '@/lib/services/sse-manager';
import { SSECacheHandler } from '@/lib/services/sse-cache-handler';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useSSECacheInvalidation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Only setup if user is authenticated
    if (!user?.id) {
      return;
    }

    // Initialize the cache handler
    const cacheHandler = new SSECacheHandler(queryClient);
    const sseManager = SSEManager.getInstance();

    // Subscribe to banking sync events
    const unsubscribeBankingSync = sseManager.subscribe(
      'banking_sync',
      (message: SSEMessage) => {
        switch (message.type) {
          case 'sync_started':
            cacheHandler.handleSyncProgress(message);
            break;

          case 'sync_in_progress':
          case 'syncing_balance':
          case 'syncing_transactions':
            cacheHandler.handleSyncProgress(message);
            break;

          case 'sync_completed':
          case 'sync_completed':
            // This is the critical one - clear cache immediately
            cacheHandler.handleBankingSyncComplete(message);
            break;

          case 'sync_error':
          case 'sync_failed':
            cacheHandler.handleSyncError(message);
            break;

          case 'balance_updated':
            cacheHandler.handleBalanceUpdate(message);
            break;

          default:
            console.debug('[SSE] Unhandled banking sync message:', message.type);
        }
      }
    );

    // Subscribe to crypto sync events
    const unsubscribeCryptoSync = sseManager.subscribe(
      'crypto_sync',
      (message: SSEMessage) => {
        switch (message.type) {
          case 'wallet_sync_started':
            cacheHandler.handleSyncProgress(message);
            break;

          case 'wallet_sync_in_progress':
          case 'wallet_syncing_balance':
          case 'wallet_syncing_transactions':
            cacheHandler.handleSyncProgress(message);
            break;

          case 'wallet_sync_completed':
            cacheHandler.handleCryptoSyncComplete(message);
            break;

          case 'wallet_sync_error':
            cacheHandler.handleSyncError(message);
            break;

          case 'wallet_balance_updated':
            cacheHandler.handleBalanceUpdate(message);
            break;

          default:
            console.debug('[SSE] Unhandled crypto sync message:', message.type);
        }
      }
    );

    // Log metrics every minute (optional)
    const metricsInterval = setInterval(() => {
      const metrics = cacheHandler.getMetrics();
      if (metrics.totalInvalidations > 0) {
        console.debug('[SSE Cache] Metrics:', metrics);
      }
    }, 60000);

    // Cleanup
    return () => {
      unsubscribeBankingSync();
      unsubscribeCryptoSync();
      clearInterval(metricsInterval);
    };
  }, [user?.id, queryClient]);
}
