/**
 * Transaction Type Definitions
 *
 * Comprehensive type definitions for unified transactions across banking and crypto sources.
 */

/**
 * Merchant information associated with a transaction
 */
export interface TransactionMerchant {
  id?: string;
  displayName?: string;
  icon?: string;
  logo?: string;
  website?: string;
}

/**
 * Account information associated with a transaction
 */
export interface TransactionAccount {
  id: string;
  name: string;
  type: 'CRYPTO' | 'BANKING';
  institute: string;
  mask: string;
}

/**
 * Location metadata for transactions
 */
export interface TransactionLocation {
  city?: string;
  region?: string;
  address?: string;
  country?: string;
}

/**
 * Counterparty information in a transaction
 */
export interface TransactionCounterparty {
  name?: string;
  type?: string;
  website?: string;
  logo_url?: string;
}

/**
 * Primary Funds Classification (PFC) metadata
 */
export interface TransactionPFC {
  iconUrl?: string;
  primary?: string;
  detailed?: string;
}

/**
 * Rich metadata about a transaction
 */
export interface TransactionMetadata {
  pfc?: TransactionPFC;
  logoUrl?: string;
  website?: string;
  location?: TransactionLocation;
  counterparties?: TransactionCounterparty[];
  [key: string]: unknown;
}

/**
 * Unified transaction type that bridges banking and crypto transactions
 * Contains fields from both sources with optional crypto-specific and banking-specific fields
 */
export interface UnifiedTransaction {
  /** Unique transaction identifier */
  id: string;

  /** Transaction type (SEND, RECEIVE, SWAP, DEPOSIT, WITHDRAWAL, TRANSFER, EXPENSE, INCOME, OTHER) */
  type: TransactionType;

  /** Current status of the transaction */
  status: TransactionStatus;

  /** ISO 8601 timestamp when transaction occurred */
  timestamp: string;

  /** Formatted date string (usually generated from timestamp) */
  date?: string;

  /** Transaction amount */
  amount: number;

  /** Currency code (USD, EUR, BTC, ETH, etc.) */
  currency?: string;

  /** Human-readable description of the transaction */
  description: string;

  // Crypto-specific fields
  /** From address (for crypto transactions) */
  fromAddress?: string;

  /** To address (for crypto transactions) */
  toAddress?: string;

  /** Transaction hash (for crypto transactions) */
  hash?: string;

  // Banking-specific fields
  /** Merchant information (for banking transactions) */
  merchant?: TransactionMerchant;

  /** Associated account information */
  account?: TransactionAccount;

  /** Transaction category identifier */
  category?: string;

  /** User-assigned tags for this transaction */
  tags?: string[];

  /** Source of the transaction (CRYPTO or BANKING) */
  source: TransactionSource;

  /** Whether transaction is still pending */
  pending?: boolean;

  /** Running balance after this transaction (for banking) */
  runningBalance?: number;

  /** Rich metadata about the transaction */
  metadata?: TransactionMetadata;

  // Deprecated field (for backwards compatibility)
  /** @deprecated Use merchant instead */
  merchent?: string;
}

/**
 * Transaction type enum - possible transaction types
 * Includes both high-level types (SEND, RECEIVE) and banking-specific types
 */
export enum TransactionType {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  SWAP = 'SWAP',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  OTHER = 'OTHER',

  // Banking-specific types
  CardPayment = 'card_payment',
  Ach = 'ach',
  Atm = 'atm',
  DigitalPayment = 'digital_payment',
  Payment = 'payment',
}

/**
 * Transaction status enum - possible status values
 */
export enum TransactionStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
  PROCESSING = 'PROCESSING',
}

/**
 * Transaction source enum - where the transaction comes from
 */
export enum TransactionSource {
  CRYPTO = 'CRYPTO',
  BANKING = 'BANKING',
}

/**
 * Display labels for transaction types
 * Maps TransactionType enum values to human-readable strings
 */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.SEND]: 'Send',
  [TransactionType.RECEIVE]: 'Receive',
  [TransactionType.SWAP]: 'Swap',
  [TransactionType.DEPOSIT]: 'Deposit',
  [TransactionType.WITHDRAWAL]: 'Withdrawal',
  [TransactionType.TRANSFER]: 'Transfer',
  [TransactionType.EXPENSE]: 'Expense',
  [TransactionType.INCOME]: 'Income',
  [TransactionType.OTHER]: 'Other',
  [TransactionType.CardPayment]: 'Card Payment',
  [TransactionType.Ach]: 'ACH Transfer',
  [TransactionType.Atm]: 'ATM Withdrawal',
  [TransactionType.DigitalPayment]: 'Digital Payment',
  [TransactionType.Payment]: 'Payment',
};

/**
 * Props for TransactionsDataTable component
 */
export interface TransactionsDataTableProps {
  /** Array of transactions to display */
  transactions: UnifiedTransaction[];

  /** Loading state */
  isLoading?: boolean;

  /** Callback when user requests a refresh */
  onRefresh?: () => void;

  /** Callback when user clicks on a transaction row */
  onRowClick?: (transaction: UnifiedTransaction) => void;

  /** Search term for filtering */
  searchTerm?: string;

  /** Type filter (transaction type) */
  typeFilter?: string;

  /** Status filter (transaction status) */
  statusFilter?: string;

  /** Source filter (CRYPTO or BANKING) */
  sourceFilter?: string;

  /** Whether to hide the account column in the table */
  hideAccountColumn?: boolean;

  /** Categories data from parent component */
  categoriesData?: unknown;

  /** Loading state for categories */
  categoriesLoading?: boolean;
}

/**
 * Props for TransactionTableRow component
 */
export interface TransactionTableRowProps {
  transaction: UnifiedTransaction;
  hideAccountColumn?: boolean;
  accountsList: Array<{ id: string; name: string; mask?: string; logo?: string }>;
  merchantsList: Array<{ id: string; name: string; logoUrl?: string; website?: string }>;
  categoriesList: Array<{ id: string; displayName: string; emoji?: string; groupName?: string }>;
  onAccountChange: (txId: string, accountId: string) => void;
  onMerchantChange: (txId: string, merchantId: string) => void;
  onCategoryChange: (txId: string, categoryId: string) => void;
  onAttachmentClick: (tx: UnifiedTransaction) => void;
  onRowClick?: (tx: UnifiedTransaction) => void;
}

/**
 * Props for AttachmentModal component
 */
export interface AttachmentModalProps {
  isOpen: boolean;
  transaction: UnifiedTransaction | null;
  onClose: () => void;
}

/**
 * Sorting option for transactions
 */
export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
