/**
 * Transaction Helper Utilities
 *
 * Core business logic utilities for transaction operations
 */

import { format, parseISO } from 'date-fns';
import type { UnifiedTransaction } from '@/lib/types';

/**
 * Determines if a transaction is an income/incoming money transaction
 *
 * @param type - Transaction type
 * @returns True if transaction is incoming money
 */
export function isIncomeTransaction(type: string): boolean {
  return ['RECEIVE', 'DEPOSIT', 'INCOME'].includes(type.toUpperCase());
}

/**
 * Determines if a transaction is an expense/outgoing money transaction
 *
 * @param type - Transaction type
 * @returns True if transaction is outgoing money
 */
export function isExpenseTransaction(type: string): boolean {
  return ['SEND', 'WITHDRAWAL', 'EXPENSE', 'CARD_PAYMENT', 'ATM', 'PAYMENT', 'DIGITAL_PAYMENT'].includes(
    type.toUpperCase()
  );
}

/**
 * Determines if a transaction is a transfer/neutral transaction
 *
 * @param type - Transaction type
 * @returns True if transaction is a transfer
 */
export function isTransferTransaction(type: string): boolean {
  return ['SWAP', 'TRANSFER', 'ACH'].includes(type.toUpperCase());
}

/**
 * Gets the actual amount for a transaction (handles negative amounts)
 *
 * @param transaction - The transaction object
 * @returns Absolute amount of the transaction
 */
export function getTransactionAmount(transaction: UnifiedTransaction): number {
  return Math.abs(transaction.amount);
}

/**
 * Formats a transaction amount with appropriate sign based on transaction type
 *
 * @param amount - The transaction amount
 * @param type - Transaction type (to determine direction)
 * @returns Formatted string with + or - prefix
 */
export function formatTransactionAmount(amount: number, type: string): string {
  const absAmount = Math.abs(amount);
  const prefix = isIncomeTransaction(type) ? '+' : isExpenseTransaction(type) ? '-' : '';
  return `${prefix}$${absAmount.toFixed(2)}`;
}

/**
 * Groups transactions by date
 *
 * @param transactions - Array of transactions to group
 * @returns Object with date strings as keys and transaction arrays as values
 */
export function groupTransactionsByDate(transactions: UnifiedTransaction[]): Record<string, UnifiedTransaction[]> {
  const groups: Record<string, UnifiedTransaction[]> = {};

  transactions.forEach((tx) => {
    const date = formatTransactionDate(tx.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
  });

  return groups;
}

/**
 * Extracts and returns the Date object from a transaction
 *
 * @param transaction - Transaction object
 * @returns Date object
 */
export function getTransactionDate(transaction: UnifiedTransaction): Date {
  try {
    return parseISO(transaction.timestamp);
  } catch (_error) {
    console.warn('Failed to parse transaction timestamp:', transaction.timestamp);
    return new Date();
  }
}

/**
 * Formats a transaction date string for display
 * Converts ISO timestamp to "MMMM dd, yyyy" format
 *
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatTransactionDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM dd, yyyy');
  } catch (_error) {
    console.warn('Failed to format transaction date:', date);
    return 'Invalid Date';
  }
}

/**
 * Formats a transaction time for display
 * Converts ISO timestamp to "h:mm a" format (e.g., "2:30 PM")
 *
 * @param date - ISO date string or Date object
 * @returns Formatted time string
 */
export function formatTransactionTime(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'h:mm a');
  } catch (_error) {
    console.warn('Failed to format transaction time:', date);
    return 'Invalid Time';
  }
}

/**
 * Gets the display label for a transaction status
 *
 * @param status - Transaction status
 * @returns Human-readable status label
 */
export function getTransactionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    FAILED: 'Failed',
  };

  return labels[status] || status;
}

/**
 * Determines if a transaction is still pending (not finalized)
 *
 * @param transaction - Transaction object
 * @returns True if transaction is pending
 */
export function isPendingTransaction(transaction: UnifiedTransaction): boolean {
  return (
    transaction.status === 'PENDING' ||
    transaction.status === 'PROCESSING' ||
    transaction.pending === true
  );
}

/**
 * Determines if a transaction failed
 *
 * @param transaction - Transaction object
 * @returns True if transaction failed
 */
export function isFailedTransaction(transaction: UnifiedTransaction): boolean {
  return transaction.status === 'FAILED';
}

/**
 * Determines if a transaction is confirmed/completed
 *
 * @param transaction - Transaction object
 * @returns True if transaction is finalized
 */
export function isFinalizedTransaction(transaction: UnifiedTransaction): boolean {
  return transaction.status === 'CONFIRMED' || transaction.status === 'COMPLETED';
}

/**
 * Gets the direction of money flow for a transaction
 *
 * @param type - Transaction type
 * @returns 'IN' for incoming, 'OUT' for outgoing, 'NEUTRAL' for transfers
 */
export function getTransactionDirection(type: string): 'IN' | 'OUT' | 'NEUTRAL' {
  if (isIncomeTransaction(type)) return 'IN';
  if (isExpenseTransaction(type)) return 'OUT';
  return 'NEUTRAL';
}
