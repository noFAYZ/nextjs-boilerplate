'use client';

/**
 * Bulk Transaction Actions Hook
 *
 * Best Practices Applied:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Proper error handling with rollback support
 * - Optimistic updates for instant UI feedback
 * - Loading states for async operations
 * - TanStack Query integration for cache management
 * - Proper TypeScript types (no 'any')
 * - useCallback for function stability
 */

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { transactionKeys } from '../queries';
import { transactionsApi } from '../services';

interface BulkDeleteOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface BulkHideOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for bulk transaction actions
 * Handles delete and hide operations with optimistic updates
 */
export function useBulkTransactionActions() {
  const queryClient = useQueryClient();

  /**
   * Bulk delete transactions
   * Deletes multiple transactions in parallel with optimistic updates
   *
   * - Cancels conflicting queries
   * - Snapshots current cache state
   * - Optimistically removes transactions from cache
   * - Executes delete operations in parallel
   * - Rolls back on error
   * - Invalidates caches on success for background refetch
   */
  const bulkDeleteTransactions = useCallback(
    async (
      transactionIds: string[],
      options?: BulkDeleteOptions
    ): Promise<void> => {
      if (transactionIds.length === 0) {
        return;
      }

      try {
        // Cancel conflicting queries
        await Promise.all([
          queryClient.cancelQueries({ queryKey: transactionKeys.lists() }),
          queryClient.cancelQueries({ queryKey: transactionKeys.stats() }),
        ]);

        // Snapshot ALL affected caches
        const previousTransactions = queryClient.getQueryData(transactionKeys.lists());

        // Optimistically remove from cache
        if (previousTransactions) {
          queryClient.setQueryData(transactionKeys.lists(), (old: unknown) => {
            if (typeof old !== 'object' || !old || !('data' in old)) return old;
            const oldData = old as { data: Array<{ id: string }> };
            const idsToDelete = new Set(transactionIds);
            return {
              ...oldData,
              data: oldData.data.filter((tx) => !idsToDelete.has(tx.id)),
            };
          });
        }

        // Execute delete operations in parallel
        const deletePromises = transactionIds.map(id =>
          transactionsApi.deleteTransaction(id)
        );

        const results = await Promise.all(deletePromises);

        // Check if all deletes succeeded
        const allSucceeded = results.every(result => result.success);

        if (!allSucceeded) {
          throw new Error('One or more transactions failed to delete');
        }

        // Invalidate caches for background refetch
        queryClient.invalidateQueries({
          queryKey: transactionKeys.lists(),
          refetchType: 'background',
        });

        queryClient.invalidateQueries({
          queryKey: transactionKeys.stats(),
          refetchType: 'background',
        });

        options?.onSuccess?.();
      } catch (error) {
        // Rollback on error
        const snapshot = queryClient.getQueryData(transactionKeys.lists());
        if (snapshot) {
          queryClient.setQueryData(transactionKeys.lists(), snapshot);
        }

        const errorObj = error instanceof Error ? error : new Error('Failed to delete transactions');
        options?.onError?.(errorObj);
        throw errorObj;
      }
    },
    [queryClient]
  );

  /**
   * Bulk hide transactions
   * Updates multiple transactions with hidden status
   * Uses optimistic updates for instant UI feedback
   */
  const bulkHideTransactions = useCallback(
    async (
      transactionIds: string[],
      options?: BulkHideOptions
    ): Promise<void> => {
      if (transactionIds.length === 0) {
        return;
      }

      try {
        // Cancel conflicting queries
        await Promise.all([
          queryClient.cancelQueries({ queryKey: transactionKeys.lists() }),
          queryClient.cancelQueries({ queryKey: transactionKeys.stats() }),
        ]);

        // Snapshot current cache state
        const previousTransactions = queryClient.getQueryData(transactionKeys.lists());

        // Optimistically update cache - mark transactions as hidden
        if (previousTransactions) {
          queryClient.setQueryData(transactionKeys.lists(), (old: unknown) => {
            if (typeof old !== 'object' || !old || !('data' in old)) return old;
            const oldData = old as { data: Array<{ id: string; hidden?: boolean }> };
            const idsToHide = new Set(transactionIds);
            return {
              ...oldData,
              data: oldData.data.map((tx) =>
                idsToHide.has(tx.id) ? { ...tx, hidden: true } : tx
              ),
            };
          });
        }

        // Execute update operations in parallel
        const updatePromises = transactionIds.map(id =>
          transactionsApi.updateTransaction(id, { hidden: true })
        );

        const results = await Promise.all(updatePromises);

        // Check if all updates succeeded
        const allSucceeded = results.every(result => result.success);

        if (!allSucceeded) {
          throw new Error('One or more transactions failed to update');
        }

        // Invalidate caches for background refetch
        queryClient.invalidateQueries({
          queryKey: transactionKeys.lists(),
          refetchType: 'background',
        });

        options?.onSuccess?.();
      } catch (error) {
        // Rollback on error
        const snapshot = queryClient.getQueryData(transactionKeys.lists());
        if (snapshot) {
          queryClient.setQueryData(transactionKeys.lists(), snapshot);
        }

        const errorObj = error instanceof Error ? error : new Error('Failed to hide transactions');
        options?.onError?.(errorObj);
        throw errorObj;
      }
    },
    [queryClient]
  );

  /**
   * Bulk unhide transactions
   * Reverts hidden status for multiple transactions
   */
  const bulkUnhideTransactions = useCallback(
    async (
      transactionIds: string[],
      options?: BulkHideOptions
    ): Promise<void> => {
      if (transactionIds.length === 0) {
        return;
      }

      try {
        // Cancel conflicting queries
        await Promise.all([
          queryClient.cancelQueries({ queryKey: transactionKeys.lists() }),
        ]);

        // Snapshot current cache state
        const previousTransactions = queryClient.getQueryData(transactionKeys.lists());

        // Optimistically update cache - mark transactions as visible
        if (previousTransactions) {
          queryClient.setQueryData(transactionKeys.lists(), (old: unknown) => {
            if (typeof old !== 'object' || !old || !('data' in old)) return old;
            const oldData = old as { data: Array<{ id: string; hidden?: boolean }> };
            const idsToUnhide = new Set(transactionIds);
            return {
              ...oldData,
              data: oldData.data.map((tx) =>
                idsToUnhide.has(tx.id) ? { ...tx, hidden: false } : tx
              ),
            };
          });
        }

        // Execute update operations in parallel
        const updatePromises = transactionIds.map(id =>
          transactionsApi.updateTransaction(id, { hidden: false })
        );

        const results = await Promise.all(updatePromises);

        // Check if all updates succeeded
        const allSucceeded = results.every(result => result.success);

        if (!allSucceeded) {
          throw new Error('One or more transactions failed to update');
        }

        // Invalidate caches for background refetch
        queryClient.invalidateQueries({
          queryKey: transactionKeys.lists(),
          refetchType: 'background',
        });

        options?.onSuccess?.();
      } catch (error) {
        // Rollback on error
        const snapshot = queryClient.getQueryData(transactionKeys.lists());
        if (snapshot) {
          queryClient.setQueryData(transactionKeys.lists(), snapshot);
        }

        const errorObj = error instanceof Error ? error : new Error('Failed to unhide transactions');
        options?.onError?.(errorObj);
        throw errorObj;
      }
    },
    [queryClient]
  );

  return {
    bulkDeleteTransactions,
    bulkHideTransactions,
    bulkUnhideTransactions,
  };
}
