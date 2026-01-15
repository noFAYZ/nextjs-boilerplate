/**
 * Transactions Component Exports
 *
 * Public API for the transactions module
 * Exports main component and sub-components for advanced usage
 */

// Main Components
export { TransactionsDataTable } from './transactions-data-table';

// Drawer Components
export { TransactionDetailDrawerEnhanced } from './transaction-detail-drawer-enhanced';

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

// Bulk Edit Components
export { BulkTransactionHeader } from './bulk/bulk-transaction-header';
export { BulkEditTransactionsDrawer } from './bulk/bulk-edit-transactions-drawer';

// Hooks (for building custom implementations)
export { useTransactionTable } from '@/lib/hooks/use-transaction-table';

// Types (re-exported for convenience)
export type {
  UnifiedTransaction,
  TransactionsDataTableProps,
  TransactionTableRowProps,
  AttachmentModalProps,
} from '@/lib/types';
