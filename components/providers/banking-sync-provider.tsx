'use client';

import { useEffect } from 'react';
import { useBankingTransactions, useTopSpendingCategories } from '@/lib/queries/banking-queries';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useAuthStore } from '@/lib/stores/auth-store';

/**
 * BankingSyncProvider
 *
 * This provider ensures banking data is fetched and synced to the banking store
 * so that widgets can access the data directly from the store without fetching.
 *
 * Place this high in your component tree (e.g., in RootLayout or DashboardLayout)
 */
export function BankingSyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  // Fetch transactions
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useBankingTransactions();
  const { setTransactions, setTransactionsLoading, setTransactionsError } = useBankingStore();

  // Fetch spending categories (top 6)
  const { data: spendingCategories, isLoading: categoriesLoading, error: categoriesError } = useTopSpendingCategories({ limit: 5 });
  const { setSpendingCategories, setSpendingCategoriesLoading, setSpendingCategoriesError } = useBankingStore();

  // Sync transactions data to store
  useEffect(() => {
    if (transactions) {
      setTransactions(transactions);
      setTransactionsError(null);
    }
  }, [transactions, setTransactions, setTransactionsError]);

  // Sync transactions loading state to store
  useEffect(() => {
    setTransactionsLoading(transactionsLoading);
  }, [transactionsLoading, setTransactionsLoading]);

  // Sync transactions error state to store
  useEffect(() => {
    if (transactionsError) {
      const errorMessage = transactionsError instanceof Error
        ? transactionsError.message
        : 'Failed to fetch transactions';
      setTransactionsError(errorMessage);
    }
  }, [transactionsError, setTransactionsError]);

  // Sync spending categories data to store
  useEffect(() => {
    if (spendingCategories) {
      setSpendingCategories(spendingCategories);
      setSpendingCategoriesError(null);
    }
  }, [spendingCategories, setSpendingCategories, setSpendingCategoriesError]);

  // Sync spending categories loading state to store
  useEffect(() => {
    setSpendingCategoriesLoading(categoriesLoading);
  }, [categoriesLoading, setSpendingCategoriesLoading]);

  // Sync spending categories error state to store
  useEffect(() => {
    if (categoriesError) {
      const errorMessage = categoriesError instanceof Error
        ? categoriesError.message
        : 'Failed to fetch spending categories';
      setSpendingCategoriesError(errorMessage);
    }
  }, [categoriesError, setSpendingCategoriesError]);

  // Log sync status
  useEffect(() => {
    if (user && (transactions || spendingCategories)) {
      console.log('[BankingSync] Data synced to store:', {
        transactionsCount: transactions?.length || 0,
        spendingCategoriesCount: spendingCategories?.length || 0,
      });
    }
  }, [user, transactions, spendingCategories]);

  useEffect(() => {
    if (transactionsError) {
      console.error('[BankingSync] Error fetching transactions:', transactionsError);
    }
    if (categoriesError) {
      console.error('[BankingSync] Error fetching spending categories:', categoriesError);
    }
  }, [transactionsError, categoriesError]);

  return <>{children}</>;
}
