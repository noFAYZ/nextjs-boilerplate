/**
 * Transaction Filtering Utilities
 * Centralized filtering logic for banking and crypto transactions
 */

import { subDays, startOfMonth, subMonths } from 'date-fns';

export interface Transaction {
  id: string;
  description?: string;
  merchantName?: string;
  category?: string;
  amount: number | string;
  date: string | Date;
  [key: string]: unknown;
}

export interface TransactionFilters {
  searchQuery?: string;
  category?: string;
  dateRange?: 'all' | '7_days' | '30_days' | 'this_month' | 'last_month' | 'custom';
  customStartDate?: Date;
  customEndDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  type?: 'income' | 'expense' | 'all';
}

/**
 * Filter transactions based on search query
 */
export function filterTransactionsBySearch(
  transactions: Transaction[],
  searchQuery: string
): Transaction[] {
  if (!searchQuery) return transactions;

  const query = searchQuery.toLowerCase();
  return transactions.filter((t) =>
    t.description?.toLowerCase().includes(query) ||
    t.merchantName?.toLowerCase().includes(query) ||
    t.category?.toLowerCase().includes(query)
  );
}

/**
 * Filter transactions by category
 */
export function filterTransactionsByCategory(
  transactions: Transaction[],
  category: string
): Transaction[] {
  if (!category || category === 'all') return transactions;
  return transactions.filter((t) => t.category === category);
}

/**
 * Filter transactions by date range
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange: TransactionFilters['dateRange'],
  customStartDate?: Date,
  customEndDate?: Date
): Transaction[] {
  if (!dateRange || dateRange === 'all') return transactions;

  const now = new Date();
  let startDate: Date;

  switch (dateRange) {
    case '7_days':
      startDate = subDays(now, 7);
      break;
    case '30_days':
      startDate = subDays(now, 30);
      break;
    case 'this_month':
      startDate = startOfMonth(now);
      break;
    case 'last_month':
      startDate = subMonths(startOfMonth(now), 1);
      break;
    case 'custom':
      if (!customStartDate) return transactions;
      startDate = customStartDate;
      break;
    default:
      startDate = new Date(0);
  }

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const afterStart = transactionDate >= startDate;
    const beforeEnd = customEndDate ? transactionDate <= customEndDate : true;
    return afterStart && beforeEnd;
  });
}

/**
 * Filter transactions by amount range
 */
export function filterTransactionsByAmount(
  transactions: Transaction[],
  minAmount?: number,
  maxAmount?: number
): Transaction[] {
  return transactions.filter((t) => {
    const amount = Math.abs(parseFloat(String(t.amount)));
    const meetsMin = minAmount === undefined || amount >= minAmount;
    const meetsMax = maxAmount === undefined || amount <= maxAmount;
    return meetsMin && meetsMax;
  });
}

/**
 * Filter transactions by type (income/expense)
 */
export function filterTransactionsByType(
  transactions: Transaction[],
  type: 'income' | 'expense' | 'all'
): Transaction[] {
  if (type === 'all') return transactions;

  return transactions.filter((t) => {
    const amount = parseFloat(String(t.amount));
    return type === 'income' ? amount > 0 : amount < 0;
  });
}

/**
 * Apply all transaction filters
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  let filtered = transactions;

  if (filters.searchQuery) {
    filtered = filterTransactionsBySearch(filtered, filters.searchQuery);
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filterTransactionsByCategory(filtered, filters.category);
  }

  if (filters.dateRange) {
    filtered = filterTransactionsByDateRange(
      filtered,
      filters.dateRange,
      filters.customStartDate,
      filters.customEndDate
    );
  }

  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    filtered = filterTransactionsByAmount(filtered, filters.minAmount, filters.maxAmount);
  }

  if (filters.type) {
    filtered = filterTransactionsByType(filtered, filters.type);
  }

  return filtered;
}
