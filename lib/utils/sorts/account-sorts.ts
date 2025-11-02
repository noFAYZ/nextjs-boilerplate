/**
 * Account Sorting Utilities
 * Centralized sorting logic for accounts and wallets
 */

import type { CryptoWallet } from '@/lib/types/crypto';
import type { BankAccount } from '@/lib/types/banking';

export type SortField = 'balance' | 'name' | 'recent' | 'value' | 'change';
export type SortOrder = 'asc' | 'desc';

export interface Sortable {
  [key: string]: unknown;
}

/**
 * Generic sort function with field accessor
 */
export function sortByField<T extends Sortable>(
  items: T[],
  getField: (item: T) => number | string | Date,
  order: SortOrder = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const fieldA = getField(a);
    const fieldB = getField(b);

    let comparison = 0;

    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      comparison = fieldB - fieldA;
    } else if (fieldA instanceof Date && fieldB instanceof Date) {
      comparison = fieldB.getTime() - fieldA.getTime();
    } else {
      comparison = String(fieldA).localeCompare(String(fieldB));
    }

    return order === 'desc' ? comparison : -comparison;
  });
}

/**
 * Sort by balance/value
 */
export function sortByBalance<T extends Sortable>(
  items: T[],
  getBalance: (item: T) => number,
  order: SortOrder = 'desc'
): T[] {
  return sortByField(items, getBalance, order);
}

/**
 * Sort by name
 */
export function sortByName<T extends Sortable>(
  items: T[],
  getName: (item: T) => string,
  order: SortOrder = 'asc'
): T[] {
  return sortByField(items, getName, order);
}

/**
 * Sort by date (most recent first by default)
 */
export function sortByDate<T extends Sortable>(
  items: T[],
  getDate: (item: T) => string | Date,
  order: SortOrder = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(getDate(a)).getTime();
    const dateB = new Date(getDate(b)).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Sort accounts with multiple criteria
 */
export function sortAccounts<T extends Sortable>(
  accounts: T[],
  sortBy: SortField,
  getBalance: (item: T) => number,
  getName: (item: T) => string,
  getDate: (item: T) => string,
  order: SortOrder = 'desc'
): T[] {
  switch (sortBy) {
    case 'balance':
    case 'value':
      return sortByBalance(accounts, getBalance, order);
    case 'name':
      return sortByName(accounts, getName, order);
    case 'recent':
      return sortByDate(accounts, getDate, order);
    default:
      return accounts;
  }
}

/**
 * Sort crypto wallets
 */
export function sortCryptoWallets(
  wallets: CryptoWallet[],
  sortBy: SortField = 'balance',
  order: SortOrder = 'desc'
): CryptoWallet[] {
  return sortAccounts(
    wallets,
    sortBy,
    (w) => parseFloat(String(w.totalBalanceUsd)),
    (w) => w.name,
    (w) => w.lastSyncAt || w.createdAt,
    order
  );
}

/**
 * Sort bank accounts
 */
export function sortBankAccounts(
  accounts: BankAccount[],
  sortBy: SortField = 'balance',
  order: SortOrder = 'desc'
): BankAccount[] {
  return sortAccounts(
    accounts,
    sortBy,
    (a) => parseFloat(String(a.balance)),
    (a) => a.name,
    (a) => a.lastTellerSync || a.createdAt,
    order
  );
}

/**
 * Sort transactions by date
 */
export function sortTransactions<T extends { date: string | Date; amount: number | string }>(
  transactions: T[],
  order: SortOrder = 'desc'
): T[] {
  return sortByDate(transactions, (t) => t.date, order);
}
