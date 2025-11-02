/**
 * Balance Calculation Utilities
 * Centralized balance and total calculations
 */

import type { CryptoWallet } from '@/lib/types/crypto';
import type { BankAccount } from '@/lib/types/banking';

export interface BalanceItem {
  balance?: number | string;
  totalBalanceUsd?: number | string;
  amount?: number | string;
}

export interface PortfolioStats {
  totalValueUsd?: number;
  dayChange?: number;
  dayChangePct?: number;
}

/**
 * Calculate total from array of items with balance field
 */
export function calculateTotal<T extends BalanceItem>(
  items: T[],
  balanceField: keyof T = 'balance'
): number {
  return items.reduce((sum, item) => {
    const value = item[balanceField];
    return sum + parseFloat(String(value || '0'));
  }, 0);
}

/**
 * Calculate total crypto wallet balance
 */
export function calculateCryptoTotal(wallets: CryptoWallet[]): number {
  return wallets.reduce((sum, wallet) => {
    return sum + parseFloat(String(wallet.totalBalanceUsd || '0'));
  }, 0);
}

/**
 * Calculate total bank account balance
 */
export function calculateBankTotal(accounts: BankAccount[]): number {
  return accounts.reduce((sum, account) => {
    return sum + parseFloat(String(account.balance));
  }, 0);
}

/**
 * Calculate combined totals for crypto and bank accounts
 */
export function calculateCombinedTotals(
  cryptoWallets: CryptoWallet[],
  bankAccounts: BankAccount[],
  portfolio?: PortfolioStats
) {
  const totalCrypto = calculateCryptoTotal(cryptoWallets);
  const totalBank = calculateBankTotal(bankAccounts);
  const totalBalance = totalCrypto + totalBank;
  const cryptoChange = portfolio?.dayChange || 0;
  const cryptoChangePct = portfolio?.dayChangePct || 0;

  return {
    totalCrypto,
    totalBank,
    totalBalance,
    cryptoChange,
    cryptoChangePct,
  };
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Calculate credit card utilization
 */
export function calculateCreditUtilization(
  balance: number,
  availableCredit: number
): number {
  const totalLimit = Math.abs(balance) + availableCredit;
  if (totalLimit === 0) return 0;
  return Math.round((Math.abs(balance) / totalLimit) * 100);
}

/**
 * Get balance color class based on value
 */
export function getBalanceColor(balance: number): string {
  if (balance > 0) return 'text-green-600 dark:text-green-400';
  if (balance < 0) return 'text-red-600 dark:text-red-400';
  return 'text-foreground';
}
