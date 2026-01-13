'use client';

/**
 * Transaction Display Helper Utilities
 *
 * Visual and formatting utilities for displaying transactions in the UI
 */

import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronUp,
  ChevronDownIcon,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_COLORS, TYPE_COLORS, TYPE_BG_COLORS } from '@/lib/constants/transaction-constants';
import type { UnifiedTransaction } from '@/lib/types';
import { GgArrowsExchange } from '@/components/icons/icons';
import { getLogoUrl } from '@/lib/services/logo-service';

/**
 * Gets the CSS classes for a transaction status badge
 *
 * @param status - Transaction status
 * @returns Tailwind CSS class string for badge styling
 */
export function getStatusColor(status: string): string {
  const statusKey = status.toUpperCase().replace(/-/g, '_') as keyof typeof STATUS_COLORS;

  if (statusKey in STATUS_COLORS) {
    return STATUS_COLORS[statusKey];
  }

  return STATUS_COLORS.DEFAULT;
}

/**
 * Gets the CSS text color classes for a transaction type
 * Indicates money direction with color coding
 *
 * @param type - Transaction type
 * @returns Tailwind CSS class string for text color
 */
export function getTypeColor(type: string): string {
  const normalized = type.toUpperCase().replace(/-/g, '_');

  // Check direct match first
  if (normalized in TYPE_COLORS) {
    return TYPE_COLORS[normalized as keyof typeof TYPE_COLORS];
  }

  // Fallback for partial matches
  switch (normalized) {
    // Money Out
    case 'SEND':
    case 'WITHDRAWAL':
    case 'CARD_PAYMENT':
    case 'ATM':
    case 'PAYMENT':
    case 'DIGITAL_PAYMENT':
    case 'EXPENSE':
      return TYPE_COLORS.SEND;

    // Money In
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':
      return TYPE_COLORS.RECEIVE;

    // Transfers / Neutral
    case 'SWAP':
    case 'TRANSFER':
    case 'ACH':
      return TYPE_COLORS.SWAP;

    default:
      return TYPE_COLORS.DEFAULT;
  }
}

/**
 * Gets the CSS background color classes for a transaction type
 * Used for highlighting with background color
 *
 * @param type - Transaction type
 * @returns Tailwind CSS class string for background color
 */
export function getTypeBgColor(type: string): string {
  const normalized = type.toUpperCase().replace(/-/g, '_');

  // Check direct match first
  if (normalized in TYPE_BG_COLORS) {
    return TYPE_BG_COLORS[normalized as keyof typeof TYPE_BG_COLORS];
  }

  // Fallback for partial matches
  switch (normalized) {
    // Money Out
    case 'SEND':
    case 'WITHDRAWAL':
    case 'CARD_PAYMENT':
    case 'ATM':
    case 'PAYMENT':
    case 'DIGITAL_PAYMENT':
    case 'EXPENSE':
      return TYPE_BG_COLORS.SEND;

    // Money In
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':
      return TYPE_BG_COLORS.RECEIVE;

    // Transfers / Neutral
    case 'SWAP':
    case 'TRANSFER':
    case 'ACH':
      return TYPE_BG_COLORS.SWAP;

    default:
      return TYPE_BG_COLORS.DEFAULT;
  }
}

/**
 * Gets the appropriate icon React element for a transaction type
 * Shows direction of money flow with an arrow or appropriate icon
 *
 * @param type - Transaction type
 * @returns React element representing the transaction type icon
 */
export function getTypeIcon(type: string): React.ReactNode {
  const normalized = type.toUpperCase().replace(/-/g, '_');
  const textColor = getTypeColor(type);

  switch (normalized) {
    // Money Out
    case 'SEND':
    case 'WITHDRAWAL':
    case 'CARD_PAYMENT':
    case 'ATM':
    case 'PAYMENT':
    case 'DIGITAL_PAYMENT':
    case 'EXPENSE':
      return <ChevronUp className={cn('h-5 w-5', textColor)} />;

    // Money In
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':
      return <ChevronDownIcon className={cn('h-5 w-5', textColor)} />;

    // Neutral Transfers
    case 'SWAP':
    case 'TRANSFER':
    case 'ACH':
      return <GgArrowsExchange className={cn('h-5 w-5', textColor)} />;

    // Unknown type → neutral wallet icon
    default:
      return <Wallet className={cn('h-5 w-5 text-muted-foreground')} />;
  }
}

/**
 * Gets the URL for an institution/merchant logo
 * Returns a properly formatted logo URL or undefined if not available
 *
 * @param url - Original logo URL from institution data
 * @returns Formatted logo URL or undefined
 */
export function getInstitutionLogo(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  try {
    return getLogoUrl(url) || undefined;
  } catch (error) {
    console.warn('Failed to get institution logo:', error);
    return undefined;
  }
}

/**
 * Formats merchant information for display
 *
 * @param transaction - Transaction object
 * @returns Object with merchant display properties
 */
export function getMerchantDisplay(transaction: UnifiedTransaction) {
  const merchant = transaction.merchant;

  return {
    name: merchant?.displayName || transaction.description || 'Unknown',
    logo: merchant?.logo || transaction.metadata?.logoUrl,
    website: merchant?.website || transaction.metadata?.website,
    icon: merchant?.icon,
  };
}

/**
 * Determines if transaction should be displayed as income or expense
 *
 * @param transaction - Transaction object
 * @returns 'income' or 'expense'
 */
export function getTransactionDisplayType(transaction: UnifiedTransaction): 'income' | 'expense' {
  switch (transaction.type.toUpperCase()) {
    case 'RECEIVE':
    case 'DEPOSIT':
    case 'INCOME':
      return 'income';

    case 'SEND':
    case 'WITHDRAWAL':
    case 'EXPENSE':
    case 'CARD_PAYMENT':
    case 'ATM':
    case 'PAYMENT':
    case 'DIGITAL_PAYMENT':
      return 'expense';

    default:
      return 'expense';
  }
}

/**
 * Gets a short status label for badge display
 *
 * @param status - Transaction status
 * @returns Short status label
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    FAILED: 'Failed',
  };

  return labels[status.toUpperCase()] || status;
}
