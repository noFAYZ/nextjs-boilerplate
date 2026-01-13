/**
 * Transaction Constants
 *
 * Centralized constants used throughout transaction components
 */

/**
 * Number of transactions displayed per page in the data table
 */
export const ITEMS_PER_PAGE = 25;

/**
 * CSS classes for transaction status badge colors
 * Maps transaction status values to Tailwind CSS classes
 */
export const STATUS_COLORS = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  PENDING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  DEFAULT: 'bg-muted text-muted-foreground',
} as const;

/**
 * CSS classes for transaction type text colors
 * Indicates money direction (in/out/neutral) with color
 */
export const TYPE_COLORS = {
  // Money Out
  SEND: 'text-red-800 dark:text-red-700',
  WITHDRAWAL: 'text-red-800 dark:text-red-700',
  CARD_PAYMENT: 'text-red-800 dark:text-red-700',
  ATM: 'text-red-800 dark:text-red-700',
  PAYMENT: 'text-red-800 dark:text-red-700',
  DIGITAL_PAYMENT: 'text-red-800 dark:text-red-700',
  EXPENSE: 'text-red-800 dark:text-red-700',

  // Money In
  RECEIVE: 'text-emerald-800 dark:text-emerald-700',
  DEPOSIT: 'text-emerald-800 dark:text-emerald-700',
  INCOME: 'text-emerald-800 dark:text-emerald-700',

  // Transfers / Neutral
  SWAP: 'text-blue-800 dark:text-blue-700',
  TRANSFER: 'text-blue-800 dark:text-blue-700',
  ACH: 'text-blue-800 dark:text-blue-700',

  // Default
  DEFAULT: 'text-muted-foreground',
} as const;

/**
 * CSS classes for transaction type background colors
 * Used for highlighting transaction type with background color
 */
export const TYPE_BG_COLORS = {
  // Money Out
  SEND: 'bg-rose-400 dark:bg-red-300',
  WITHDRAWAL: 'bg-rose-400 dark:bg-red-300',
  CARD_PAYMENT: 'bg-rose-400 dark:bg-red-300',
  ATM: 'bg-rose-400 dark:bg-red-300',
  PAYMENT: 'bg-rose-400 dark:bg-red-300',
  DIGITAL_PAYMENT: 'bg-rose-400 dark:bg-red-300',
  EXPENSE: 'bg-rose-400 dark:bg-red-300',

  // Money In
  RECEIVE: 'bg-lime-300 dark:bg-lime-300',
  DEPOSIT: 'bg-lime-300 dark:bg-lime-300',
  INCOME: 'bg-lime-300 dark:bg-lime-300',

  // Transfers / Neutral
  SWAP: 'bg-blue-300 dark:bg-blue-300',
  TRANSFER: 'bg-blue-300 dark:bg-blue-300',
  ACH: 'bg-blue-300 dark:bg-blue-300',

  // Default
  DEFAULT: 'bg-muted',
} as const;

/**
 * File type restrictions for attachment uploads
 * Restricts which file types users can upload
 */
export const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

/**
 * File extension restrictions for attachment uploads
 */
export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'doc',
  'docx',
  'xls',
  'xlsx',
] as const;

/**
 * Maximum file size for attachment uploads (in bytes)
 * 10MB = 10 * 1024 * 1024
 */
export const MAX_ATTACHMENT_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Maximum number of attachments per transaction
 */
export const MAX_ATTACHMENTS_PER_TRANSACTION = 10;

/**
 * Transaction filter options
 */
export const TRANSACTION_FILTER_OPTIONS = {
  TYPE: {
    ALL: 'all',
    SEND: 'SEND',
    RECEIVE: 'RECEIVE',
    SWAP: 'SWAP',
    DEPOSIT: 'DEPOSIT',
    WITHDRAWAL: 'WITHDRAWAL',
    TRANSFER: 'TRANSFER',
    EXPENSE: 'EXPENSE',
    INCOME: 'INCOME',
  },
  STATUS: {
    ALL: 'all',
    CONFIRMED: 'CONFIRMED',
    PENDING: 'PENDING',
    FAILED: 'FAILED',
    COMPLETED: 'COMPLETED',
    PROCESSING: 'PROCESSING',
  },
  SOURCE: {
    ALL: 'all',
    CRYPTO: 'CRYPTO',
    BANKING: 'BANKING',
  },
} as const;
