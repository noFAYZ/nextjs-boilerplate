import { useState, useCallback } from 'react';
import { bankingMutations } from '@/lib/queries/banking-queries';
import {
  tellerTransactionProcessor,
  type TellerTransaction
} from '@/lib/services/banking-transaction-processor';
import type { BankAccount } from '@/lib/types/banking';

interface TransactionSyncOptions {
  startDate?: string;
  endDate?: string;
  limit?: number;
  force?: boolean;
}

interface SyncProgress {
  status: 'idle' | 'syncing' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  processed?: number;
  skipped?: number;
  total?: number;
  error?: string;
}

interface UseBankingTransactionSyncReturn {
  syncProgress: SyncProgress;
  isLoading: boolean;
  syncAccountTransactions: (
    account: BankAccount,
    options?: TransactionSyncOptions
  ) => Promise<void>;
  resetSync: () => void;
}

export function useBankingTransactionSync(): UseBankingTransactionSyncReturn {
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({
    status: 'idle',
    progress: 0,
    message: 'Ready to sync'
  });

  const syncTransactionsMutation = bankingMutations.useSyncAccountTransactions();

  const syncAccountTransactions = useCallback(async (
    account: BankAccount,
    options: TransactionSyncOptions = {}
  ) => {
    try {
      setSyncProgress({
        status: 'syncing',
        progress: 10,
        message: `Starting transaction sync for ${account.name}...`
      });

      // Validate account
      if (!account.id || !account.tellerAccountId) {
        throw new Error('Invalid account: missing required IDs');
      }

      // Set default options
      const syncOptions = {
        limit: 100,
        ...options
      };

      setSyncProgress({
        status: 'syncing',
        progress: 30,
        message: 'Requesting transactions from Teller...'
      });

      // Call the backend to sync transactions
      const response = await syncTransactionsMutation.mutateAsync({
        accountId: account.id,
        options: syncOptions
      });

      setSyncProgress({
        status: 'processing',
        progress: 60,
        message: 'Processing transaction data...'
      });

      if (response.success) {
        const { processed, skipped, totalFromTeller } = response.data;

        setSyncProgress({
          status: 'completed',
          progress: 100,
          message: `Sync completed successfully!`,
          processed,
          skipped,
          total: totalFromTeller
        });
      } else {
        throw new Error('Transaction sync failed');
      }

    } catch (error) {
      console.error('Transaction sync error:', error);

      setSyncProgress({
        status: 'error',
        progress: 0,
        message: 'Transaction sync failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, [syncTransactionsMutation]);

  const resetSync = useCallback(() => {
    setSyncProgress({
      status: 'idle',
      progress: 0,
      message: 'Ready to sync'
    });
  }, []);

  const isLoading = syncProgress.status === 'syncing' || syncProgress.status === 'processing';

  return {
    syncProgress,
    isLoading,
    syncAccountTransactions,
    resetSync
  };
}

// Additional utility hooks for transaction processing

/**
 * Hook for processing raw Teller transaction data (client-side processing)
 */
export function useTransactionProcessor() {
  const processTellerTransactions = useCallback((
    tellerTransactions: TellerTransaction[],
    userId: string,
    accountId: string,
    accountName?: string,
    institutionName?: string
  ) => {
    // Validate transactions
    const validTransactions = tellerTransactions.filter(
      tellerTransactionProcessor.validateTellerTransaction
    );

    if (validTransactions.length !== tellerTransactions.length) {
      console.warn(
        `${tellerTransactions.length - validTransactions.length} invalid transactions filtered out`
      );
    }

    // Process valid transactions
    const processedTransactions = tellerTransactionProcessor.processTellerTransactions(
      validTransactions,
      userId,
      accountId,
      accountName,
      institutionName
    );

    // Sort by date (newest first)
    const sortedTransactions = tellerTransactionProcessor.sortTransactionsByDate(
      processedTransactions
    );

    // Create sync summary
    const syncSummary = tellerTransactionProcessor.createSyncSummary(
      sortedTransactions,
      tellerTransactions.length
    );

    return {
      processedTransactions: sortedTransactions,
      validTransactions,
      invalidTransactions: tellerTransactions.filter(
        t => !tellerTransactionProcessor.validateTellerTransaction(t)
      ),
      syncSummary
    };
  }, []);

  return {
    processTellerTransactions,
    validateTransaction: tellerTransactionProcessor.validateTellerTransaction,
    sortTransactionsByDate: tellerTransactionProcessor.sortTransactionsByDate,
    deduplicateTransactions: tellerTransactionProcessor.deduplicateTransactions
  };
}

/**
 * Hook for bulk transaction operations
 */
export function useBulkTransactionSync() {
  const [bulkProgress, setBulkProgress] = useState<{
    total: number;
    completed: number;
    failed: number;
    currentAccount?: string;
    status: 'idle' | 'processing' | 'completed' | 'error';
  }>({
    total: 0,
    completed: 0,
    failed: 0,
    status: 'idle'
  });

  const singleAccountSync = useBankingTransactionSync();

  const syncMultipleAccounts = useCallback(async (
    accounts: BankAccount[],
    options?: TransactionSyncOptions
  ) => {
    setBulkProgress({
      total: accounts.length,
      completed: 0,
      failed: 0,
      status: 'processing'
    });

    let completed = 0;
    let failed = 0;

    for (const account of accounts) {
      try {
        setBulkProgress(prev => ({
          ...prev,
          currentAccount: account.name
        }));

        await singleAccountSync.syncAccountTransactions(account, options);
        completed++;
      } catch (error) {
        console.error(`Failed to sync account ${account.name}:`, error);
        failed++;
      }

      setBulkProgress(prev => ({
        ...prev,
        completed: completed,
        failed: failed
      }));
    }

    setBulkProgress(prev => ({
      ...prev,
      status: failed === 0 ? 'completed' : 'error',
      currentAccount: undefined
    }));
  }, [singleAccountSync]);

  const resetBulkSync = useCallback(() => {
    setBulkProgress({
      total: 0,
      completed: 0,
      failed: 0,
      status: 'idle'
    });
  }, []);

  return {
    bulkProgress,
    syncMultipleAccounts,
    resetBulkSync,
    isProcessing: bulkProgress.status === 'processing'
  };
}