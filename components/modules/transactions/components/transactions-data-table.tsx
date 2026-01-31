'use client';

/**
 * Transactions Data Table Component
 *
 * Main orchestrator component for displaying transactions with:
 * - Filtering (search, type, status, source)
 * - Sorting (date, amount)
 * - Pagination
 * - Inline editing (merchant, category, account)
 * - Attachments modal
 * - Bulk selection and editing
 *
 * This component is a clean orchestrator that delegates:
 * - Business logic to useTransactionTable hook
 * - Rendering to focused sub-components (Table, Row, Skeleton, Empty, Pagination, Modal)
 * - Bulk state to banking-ui-store
 *
 * PERFORMANCE CHARACTERISTICS:
 * - Pure orchestrator: No useState, no filtering logic, no mutations
 * - All business logic in hook: Enables testability and reusability
 * - All sub-components memoized: Prevents cascading re-renders
 * - Optimistic mutations: Instant UI feedback on inline edits
 * - Lazy data loading: Attachments modal loads on demand
 *
 * RENDERING OPTIMIZATION:
 * - TransactionTable is memoized: Only re-renders if data actually changes
 * - Each TransactionTableRow is memoized: Prevents row-level re-renders
 * - Callbacks are stable: useCallback in hook prevents child re-renders
 * - Conditional rendering: Skeleton, Empty, and Table are mutually exclusive
 *
 * For large datasets (1000+ transactions), consider:
 * - Virtualization: Use react-window to render only visible rows
 * - Prefetching: Prefetch next page before user navigates
 * - Server-side filtering: Move filtering logic to backend if needed
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { useBankingUIStore } from '@/lib/features/banking/stores';
import { useTransactionTable } from '@/lib/features/transactions/hooks';
import { TransactionTable } from './table/transaction-table';
import { TransactionTableSkeleton } from './table/transaction-table-skeleton';
import { TransactionTableEmpty } from './table/transaction-table-empty';
import { TransactionPagination } from './pagination/transaction-pagination';
import { AttachmentModal } from './modals/attachment-modal';
import { BulkTransactionHeader } from './bulk/bulk-transaction-header';
import { BulkEditTransactionsDrawer } from './bulk/bulk-edit-transactions-drawer';
import { ITEMS_PER_PAGE } from '@/lib/constants/transaction-constants';
import type { TransactionsDataTableProps } from '@/lib/types';

/**
 * Main Transactions Data Table Component
 *
 * @param transactions - Array of transactions to display
 * @param isLoading - Whether data is loading
 * @param onRefresh - Optional callback for refresh button
 * @param onRowClick - Optional callback when row is clicked
 * @param searchTerm - Search filter term
 * @param typeFilter - Transaction type filter
 * @param statusFilter - Transaction status filter
 * @param sourceFilter - Transaction source filter (CRYPTO/BANKING)
 * @param hideAccountColumn - Whether to hide account column on smaller screens
 */
function TransactionsDataTableComponent({
  transactions,
  isLoading,
  onRefresh,
  onRowClick,
  searchTerm = '',
  typeFilter = 'all',
  statusFilter = 'all',
  sourceFilter = 'all',
  hideAccountColumn = false,
}: TransactionsDataTableProps) {
  // ============================================
  // State: Bulk Edit Drawer
  // ============================================

  const [isBulkEditDrawerOpen, setIsBulkEditDrawerOpen] = useState(false);

  // ============================================
  // State: Bulk Selection (from Zustand)
  // ============================================

  const isBulkSelectMode = useBankingUIStore(state => state.ui.isBulkSelectMode);
  const selectedTransactionIds = useBankingUIStore(state => state.ui.selectedTransactionIds);
  const toggleBulkSelectMode = useBankingUIStore(state => state.toggleBulkSelectMode);
  const selectTransaction = useBankingUIStore(state => state.selectTransaction);
  const deselectTransaction = useBankingUIStore(state => state.deselectTransaction);
  const selectAllTransactions = useBankingUIStore(state => state.selectAllTransactions);
  const clearTransactionSelection = useBankingUIStore(state => state.clearTransactionSelection);

  // ============================================
  // Hook: Business Logic
  // ============================================

  const {
    // Pagination
    currentPage,
    totalPages,
    paginatedTransactions,
    handlePageChange,

    // Sorting
    sortBy,
    setSortBy,

    // Filtering
    filteredTransactions,
    groupedTransactions,

    // Data Lists
    accountsList,
    merchantsList,
    categoriesList,

    // Mutations
    handleAccountChange,
    handleMerchantChange,
    handleCategoryChange,

    // Attachment Modal
    attachmentModalOpen,
    selectedTransactionForAttachment,
    openAttachmentModal,
    closeAttachmentModal,
  } = useTransactionTable({
    transactions,
    searchTerm,
    typeFilter,
    statusFilter,
    sourceFilter,
    onRowClick,
  });

  // ============================================
  // Callbacks: Bulk Selection
  // ============================================

  const handleToggleSelect = useCallback((id: string) => {
    if (selectedTransactionIds.includes(id)) {
      deselectTransaction(id);
    } else {
      selectTransaction(id);
    }
  }, [selectedTransactionIds, selectTransaction, deselectTransaction]);

  const handleSelectAll = useCallback(() => {
    const allIds = paginatedTransactions.map(tx => tx.id);
    selectAllTransactions(allIds);
  }, [paginatedTransactions, selectAllTransactions]);

  // Get selected transaction objects for drawer
  const selectedTransactions = useMemo(() => {
    return paginatedTransactions.filter(tx => selectedTransactionIds.includes(tx.id));
  }, [paginatedTransactions, selectedTransactionIds]);

  // ============================================
  // Conditional Rendering
  // ============================================

  // Loading State
  if (isLoading) {
    return <TransactionTableSkeleton hideAccountColumn={hideAccountColumn} />;
  }

  // No Data State
  if (transactions.length === 0) {
    return <TransactionTableEmpty variant="no-data" onRefresh={onRefresh} />;
  }

  // No Results State (filters applied but no matches)
  if (paginatedTransactions.length === 0 && filteredTransactions.length === 0) {
    return <TransactionTableEmpty variant="no-results" />;
  }

  // ============================================
  // Main Render
  // ============================================

  return (
    <>
      {/* Bulk Selection Header */}
      {isBulkSelectMode && selectedTransactionIds.length > 0 && (
        <BulkTransactionHeader
          selectedCount={selectedTransactionIds.length}
          totalCount={paginatedTransactions.length}
          onSelectAll={handleSelectAll}
          onClearSelection={clearTransactionSelection}
          onOpenBulkEdit={() => setIsBulkEditDrawerOpen(true)}
        />
      )}

      {/* Transaction Table */}
      <TransactionTable
        groupedTransactions={groupedTransactions}
        paginatedTransactions={paginatedTransactions}
        hideAccountColumn={hideAccountColumn}
        accountsList={accountsList}
        merchantsList={merchantsList}
        categoriesList={categoriesList}
        onAccountChange={handleAccountChange}
        onMerchantChange={handleMerchantChange}
        onCategoryChange={handleCategoryChange}
        onAttachmentClick={openAttachmentModal}
        onRowClick={onRowClick}
        isBulkSelectMode={isBulkSelectMode}
        selectedTransactionIds={selectedTransactionIds}
        onToggleSelect={handleToggleSelect}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <TransactionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTransactions.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {/* Bulk Edit Drawer */}
      <BulkEditTransactionsDrawer
        isOpen={isBulkEditDrawerOpen}
        onClose={() => {
          setIsBulkEditDrawerOpen(false);
        }}
        selectedTransactionIds={selectedTransactionIds}
        selectedTransactions={selectedTransactions}
      />

      {/* Attachment Modal */}
      <AttachmentModal
        isOpen={attachmentModalOpen}
        transaction={selectedTransactionForAttachment}
        onClose={closeAttachmentModal}
      />
    </>
  );
}

export const TransactionsDataTable = memo(TransactionsDataTableComponent);
