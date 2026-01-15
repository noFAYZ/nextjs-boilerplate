/**
 * Transaction Transformer
 *
 * Transforms backend transaction response format to UnifiedTransaction format
 * Maps fields from the API response to the standardized UnifiedTransaction structure
 */

import type { UnifiedTransaction } from '@/lib/types';

/**
 * Backend transaction response structure from API
 */
export interface BackendTransaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string | null;
  amount: string | number;
  description: string;
  date?: string;
  transactionDate?: string | null;
  authorizedDate?: string;
  createdAt: string;
  updatedAt: string;
  autoCategorizationConfidence?: string;
  autoCategorizationMethod?: string;
  city?: string | null;
  country?: string | null;
  currency: string;
  currentBalance?: number | null;
  isPending: boolean;
  isTransfer: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletionReason?: string | null;
  deletionMetadata?: unknown;
  merchantId?: string | null;
  merchant?: {
    id?: string;
    displayName?: string;
    icon?: string;
    logo?: string;
    website?: string;
  };
  notes?: string | null;
  organizationId: string;
  paymentChannel: string;
  providerSource: string;
  providerTransactionId: string;
  reconciliationStatus: string;
  reconciledAt?: string | null;
  reconciledBy?: string | null;
  bankStatementId?: string | null;
  region?: string | null;
  ruleAppliedId?: string | null;
  runningBalance?: number | null;
  status: string;
  tags: string[];
  transferAccountId?: string | null;
  transferPairId?: string | null;
  type: string;
  duplicateKey?: string | null;
  duplicateOf?: string | null;
  category?: {
    id?: string;
    name?: string;
    displayName?: string;
    emoji?: string;
    groupName?: string;
  } | null;
  account?: {
    id?: string;
    name?: string;
    type?: string;
    institute?: string;
    mask?: string;
  } | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Transform a single backend transaction to UnifiedTransaction format
 * @param tx - Backend transaction response
 * @param relatedData - Optional related data (accounts, merchants, categories)
 * @returns Transformed UnifiedTransaction
 */
export function transformBackendTransaction(
  tx: BackendTransaction,
  relatedData?: {
    accounts?: Record<string, any>;
    merchants?: Record<string, any>;
    categories?: Record<string, any>;
  }
): UnifiedTransaction {
  // Parse amount - handle both string and number types
  const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;

  // Determine transaction timestamp (prefer date, fall back to authorizedDate or createdAt)
  const timestamp = tx.date || tx.authorizedDate || tx.createdAt || new Date().toISOString();

  // Map transaction status
  const status = tx.isPending ? 'PENDING' : mapTransactionStatus(tx.status);

  // Build merchant object from merchant field, merchantId, or description
  const merchant = tx.merchant
    ? {
        id: tx.merchant.id || tx.merchantId,
        displayName: tx.merchant.displayName,
        icon: tx.merchant.icon,
        logo: tx.merchant.logo,
        website: tx.merchant.website,
      }
    : tx.merchantId && relatedData?.merchants?.[tx.merchantId]
      ? relatedData.merchants[tx.merchantId]
      : tx.merchantId || tx.description
        ? {
            id: tx.merchantId,
            displayName: tx.description,
            icon: undefined,
            logo: undefined,
            website: undefined,
          }
        : undefined;

  // Build account object
  const account = tx.account
    ? {
        id: tx.account.id || tx.accountId,
        name: tx.account.name || 'Unknown Account',
        type: (tx.account.type?.toUpperCase() || 'BANKING') as 'CRYPTO' | 'BANKING',
        institute: tx.account.institute || '',
        mask: tx.account.mask || '',
      }
    : tx.accountId && relatedData?.accounts?.[tx.accountId]
      ? {
          id: tx.accountId,
          name: relatedData.accounts[tx.accountId].name,
          type: relatedData.accounts[tx.accountId].type as 'CRYPTO' | 'BANKING',
          institute: relatedData.accounts[tx.accountId].institute || '',
          mask: relatedData.accounts[tx.accountId].mask || '',
        }
      : {
          id: tx.accountId,
          name: 'Unknown Account',
          type: 'BANKING' as const,
          institute: '',
          mask: '',
        };

  // Get category ID and optional category details
  const categoryId = tx.categoryId || tx.category?.id;
  const categoryDetails = categoryId && relatedData?.categories?.[categoryId]
    ? {
        id: categoryId,
        name: relatedData.categories[categoryId].name,
        displayName: relatedData.categories[categoryId].displayName,
        emoji: relatedData.categories[categoryId].emoji,
        groupName: relatedData.categories[categoryId].groupName,
      }
    : undefined;

  // Normalize metadata
  const metadata = tx.metadata || {};

  // Determine transaction source based on providerSource or type
  const source = determineTransactionSource(tx.providerSource, tx.type);

  return {
    id: tx.id,
    type: normalizeTransactionType(tx.type),
    status,
    timestamp,
    date: formatTransactionDate(timestamp),
    amount: Math.abs(amount),
    currency: tx.currency || 'USD',
    description: tx.description || 'Transaction',
    merchant,
    account,
    category: categoryId,
    tags: tx.tags || [],
    source,
    pending: tx.isPending,
    runningBalance: tx.runningBalance,
    metadata: {
      ...metadata,
      pfc: metadata.pfc,
      categoryDetails,
      merchantDetails: merchant,
      logoUrl: merchant?.logo,
      website: merchant?.website,
      location: {
        city: tx.city || undefined,
        region: tx.region || undefined,
        country: tx.country || undefined,
      },
      providerTransactionId: tx.providerTransactionId,
      providerSource: tx.providerSource,
      autoCategorizationConfidence: tx.autoCategorizationConfidence,
      autoCategorizationMethod: tx.autoCategorizationMethod,
      notes: tx.notes,
      paymentChannel: tx.paymentChannel,
      reconciliationStatus: tx.reconciliationStatus,
    },
  };
}

/**
 * Transform multiple backend transactions to UnifiedTransaction array
 * @param transactions - Array of backend transactions
 * @param relatedData - Optional related data (accounts, merchants, categories)
 * @returns Array of transformed UnifiedTransactions
 */
export function transformBackendTransactions(
  transactions: BackendTransaction[],
  relatedData?: {
    accounts?: Record<string, any>;
    merchants?: Record<string, any>;
    categories?: Record<string, any>;
  }
): UnifiedTransaction[] {
  return transactions.map((tx) => transformBackendTransaction(tx, relatedData));
}

/**
 * Normalize transaction type from backend format to UnifiedTransaction format
 */
function normalizeTransactionType(
  type: string
): 'SEND' | 'RECEIVE' | 'SWAP' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'EXPENSE' | 'INCOME' | 'OTHER' {
  const upperType = type?.toUpperCase();

  // Map common types
  const typeMap: Record<string, any> = {
    SEND: 'SEND',
    RECEIVE: 'RECEIVE',
    SWAP: 'SWAP',
    DEPOSIT: 'DEPOSIT',
    WITHDRAWAL: 'WITHDRAWAL',
    TRANSFER: 'TRANSFER',
    EXPENSE: 'EXPENSE',
    INCOME: 'INCOME',
    CARD_PAYMENT: 'EXPENSE',
    ACH: 'TRANSFER',
    ATM: 'WITHDRAWAL',
    DIGITAL_PAYMENT: 'EXPENSE',
    PAYMENT: 'EXPENSE',
  };

  return typeMap[upperType] || 'OTHER';
}

/**
 * Map backend transaction status to UnifiedTransaction status
 */
function mapTransactionStatus(
  status: string
): 'CONFIRMED' | 'PENDING' | 'FAILED' | 'COMPLETED' | 'PROCESSING' {
  const upperStatus = status?.toUpperCase();

  const statusMap: Record<string, any> = {
    POSTED: 'COMPLETED',
    PENDING: 'PENDING',
    FAILED: 'FAILED',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    PROCESSING: 'PROCESSING',
    BOOKED: 'COMPLETED',
    AUTHORISED: 'PENDING',
    AUTHORIZED: 'PENDING',
  };

  return statusMap[upperStatus] || 'COMPLETED';
}

/**
 * Determine transaction source based on provider source or type
 */
function determineTransactionSource(
  providerSource: string,
  type: string
): 'CRYPTO' | 'BANKING' {
  const upperProvider = providerSource?.toUpperCase();
  const upperType = type?.toUpperCase();

  // If explicitly marked as crypto
  if (upperProvider === 'CRYPTO' || upperProvider === 'ZERION' || upperProvider === 'BLOCKCHAIN') {
    return 'CRYPTO';
  }

  // If crypto-specific type
  if (upperType === 'SEND' || upperType === 'RECEIVE' || upperType === 'SWAP') {
    return 'CRYPTO';
  }

  return 'BANKING';
}

/**
 * Format transaction timestamp to display date string
 */
function formatTransactionDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return timestamp;
  }
}

/**
 * Batch transform transactions from API response
 * Handles both array responses and paginated responses
 */
export function transformTransactionResponse(
  response: any,
  relatedData?: {
    accounts?: Record<string, any>;
    merchants?: Record<string, any>;
    categories?: Record<string, any>;
  }
): UnifiedTransaction[] {
  // Handle different response structures
  let transactions: BackendTransaction[] = [];

  if (Array.isArray(response)) {
    transactions = response;
  } else if (response?.data && Array.isArray(response.data)) {
    transactions = response.data;
  } else if (response?.transactions && Array.isArray(response.transactions)) {
    transactions = response.transactions;
  }

  return transformBackendTransactions(transactions, relatedData);
}
