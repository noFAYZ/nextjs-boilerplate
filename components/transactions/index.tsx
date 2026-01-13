/**
 * Transactions Component Exports
 *
 * Public API for the transactions module
 * Exports main component and sub-components for advanced usage
 */

// Main Component (primary export)
export { TransactionsDataTable } from './transactions-data-table';

// Table Sub-Components (for advanced usage)
export { TransactionTable } from './table/transaction-table';
export { TransactionTableRow } from './table/transaction-table-row';
export { TransactionDateSeparator } from './table/transaction-date-separator';
export { TransactionTableSkeleton } from './table/transaction-table-skeleton';
export { TransactionTableEmpty } from './table/transaction-table-empty';

// Pagination Component
export { TransactionPagination } from './pagination/transaction-pagination';

// Modal Components
export { AttachmentModal } from './modals/attachment-modal';

// Hooks (for building custom implementations)
export { useTransactionTable } from '@/lib/hooks/use-transaction-table';

// Types (re-exported for convenience)
export type {
  UnifiedTransaction,
  TransactionsDataTableProps,
  TransactionTableRowProps,
  AttachmentModalProps,
} from '@/lib/types';
