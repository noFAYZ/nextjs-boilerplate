/**
 * Analytics Calculation Utilities
 * Centralized analytics and statistics calculations
 */

import { format, subMonths, startOfMonth } from 'date-fns';

export interface Transaction {
  id: string;
  amount: number | string;
  date: string | Date;
  category?: string;
  [key: string]: unknown;
}

export interface CategoryData {
  name: string;
  category: string;
  value: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  transactionCount: number;
}

export interface TransactionAnalytics {
  monthlyIncome: number;
  monthlySpending: number;
  transactionCount: number;
  categoryData: CategoryData[];
  monthlyTrends: MonthlyTrend[];
  spendingTrend: 'up' | 'down' | 'stable';
  netAmount: number;
}

/**
 * Calculate total income from transactions
 */
export function calculateIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => parseFloat(String(t.amount)) > 0)
    .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);
}

/**
 * Calculate total expenses from transactions
 */
export function calculateExpenses(transactions: Transaction[]): number {
  return Math.abs(
    transactions
      .filter((t) => parseFloat(String(t.amount)) < 0)
      .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0)
  );
}

/**
 * Calculate category breakdown for expenses
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  topN: number = 5
): CategoryData[] {
  const totalSpending = calculateExpenses(transactions);

  const categoryMap = transactions
    .filter((t) => t.category && parseFloat(String(t.amount)) < 0)
    .reduce((acc, t) => {
      const category = t.category || 'general';
      if (!acc[category]) {
        acc[category] = { value: 0, count: 0 };
      }
      acc[category].value += Math.abs(parseFloat(String(t.amount)));
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { value: number; count: number }>);

  return Object.entries(categoryMap)
    .map(([category, data]) => ({
      name: category,
      category: category,
      value: data.value,
      count: data.count,
      percentage: totalSpending > 0 ? (data.value / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

/**
 * Calculate monthly trends for the past N months
 */
export function calculateMonthlyTrends(
  transactions: Transaction[],
  months: number = 6
): MonthlyTrend[] {
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    });

    const income = calculateIncome(monthTransactions);
    const expenses = calculateExpenses(monthTransactions);

    return {
      month: format(date, 'MMM'),
      income,
      expenses,
      transactionCount: monthTransactions.length,
    };
  }).reverse();
}

/**
 * Determine spending trend
 */
export function calculateSpendingTrend(monthlyTrends: MonthlyTrend[]): 'up' | 'down' | 'stable' {
  if (monthlyTrends.length < 2) return 'stable';

  const current = monthlyTrends[monthlyTrends.length - 1].expenses;
  const previous = monthlyTrends[monthlyTrends.length - 2].expenses;

  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
}

/**
 * Calculate complete transaction analytics
 */
export function calculateTransactionAnalytics(
  transactions: Transaction[],
  topCategories: number = 5,
  trendMonths: number = 6
): TransactionAnalytics {
  const monthlyIncome = calculateIncome(transactions);
  const monthlySpending = calculateExpenses(transactions);
  const transactionCount = transactions.length;
  const categoryData = calculateCategoryBreakdown(transactions, topCategories);
  const monthlyTrends = calculateMonthlyTrends(transactions, trendMonths);
  const spendingTrend = calculateSpendingTrend(monthlyTrends);
  const netAmount = monthlyIncome - monthlySpending;

  return {
    monthlyIncome,
    monthlySpending,
    transactionCount,
    categoryData,
    monthlyTrends,
    spendingTrend,
    netAmount,
  };
}

/**
 * Calculate average transaction amount
 */
export function calculateAverageTransaction(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  const total = transactions.reduce((sum, t) => sum + Math.abs(parseFloat(String(t.amount))), 0);
  return total / transactions.length;
}

/**
 * Calculate transaction frequency (transactions per day)
 */
export function calculateTransactionFrequency(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;

  const dates = transactions.map((t) => new Date(t.date).getTime());
  const oldestDate = Math.min(...dates);
  const newestDate = Math.max(...dates);
  const daysDiff = (newestDate - oldestDate) / (1000 * 60 * 60 * 24);

  if (daysDiff === 0) return transactions.length;
  return transactions.length / daysDiff;
}
