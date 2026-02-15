'use client';

/**
 * Transaction Table Component
 *
 * Pure table rendering component that displays transactions grouped by date
 * Orchestrates TransactionDateSeparator and TransactionTableRow components
 * Memoized to prevent unnecessary re-renders when callbacks change
 */

import { Fragment, memo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TransactionDateSeparator } from './transaction-date-separator';
import { TransactionTableRow } from './transaction-table-row';
import type { UnifiedTransaction } from '@/lib/types';

interface TransactionTableProps {
  /** Transactions grouped by date */
  groupedTransactions: Record<string, UnifiedTransaction[]>;

  /** Transactions for current page (for filtering rows by pagination) */
  paginatedTransactions: UnifiedTransaction[];

  /** Whether to hide the account column */
  hideAccountColumn?: boolean;

  /** List of accounts for combobox */
  accountsList: Array<{ id: string; name: string; mask?: string; logo?: string }>;

  /** List of merchants for combobox */
  merchantsList: Array<{ id: string; name: string; logoUrl?: string; website?: string }>;

  /** List of categories for combobox */
  categoriesList: Array<{ id: string; displayName: string; emoji?: string; groupName?: string }>;

  /** Callback when account is changed */
  onAccountChange: (txId: string, accountId: string) => void;

  /** Callback when merchant is changed */
  onMerchantChange: (txId: string, merchantId: string) => void;

  /** Callback when category is changed */
  onCategoryChange: (txId: string, categoryId: string) => void;

  /** Callback when attachment button is clicked */
  onAttachmentClick: (tx: UnifiedTransaction) => void;

  /** Callback when row is clicked (chevron button) */
  onRowClick?: (tx: UnifiedTransaction) => void;

  /** Whether bulk select mode is active (shows checkboxes) */
  isBulkSelectMode?: boolean;

  /** IDs of selected transactions */
  selectedTransactionIds?: string[];

  /** Callback when transaction checkbox is toggled */
  onToggleSelect?: (id: string) => void;

  /** Whether a transaction is being updated */
  isUpdatingTransaction?: boolean;
}

/**
 * Memoized table with custom equality check
 * Prevents re-renders when callbacks change but data is the same
 */
export const TransactionTable = memo(
  function TransactionTable({
    groupedTransactions,
    paginatedTransactions,
    hideAccountColumn = false,
    accountsList,
    merchantsList,
    categoriesList,
    onAccountChange,
    onMerchantChange,
    onCategoryChange,
    onAttachmentClick,
    onRowClick,
    isBulkSelectMode = false,
    selectedTransactionIds = [],
    onToggleSelect,
    isUpdatingTransaction = false,
  }: TransactionTableProps) {
    return (
          <Table className="w-full border border-border overflow-x-auto bg-card ">
            <TableBody>
              {Object.entries(groupedTransactions).map(([date, txs]) => {
                // Filter transactions for current page
                const txsInPage = txs.filter((tx) => paginatedTransactions.includes(tx));
                if (txsInPage.length === 0) return null;

                return (
                  <Fragment key={date}>
                    {/* Date Separator */}
                    <TransactionDateSeparator date={date} hideAccountColumn={hideAccountColumn} />

                    {/* Transactions for this date */}
                    {txsInPage.map((tx) => (
                      <TransactionTableRow
                        key={tx.id}
                        transaction={tx}
                        hideAccountColumn={hideAccountColumn}
                        accountsList={accountsList}
                        merchantsList={merchantsList}
                        categoriesList={categoriesList}
                        onAccountChange={onAccountChange}
                        onMerchantChange={onMerchantChange}
                        onCategoryChange={onCategoryChange}
                        onAttachmentClick={onAttachmentClick}
                        onRowClick={onRowClick}
                        isBulkSelectMode={isBulkSelectMode}
                        isSelected={selectedTransactionIds.includes(tx.id)}
                        onToggleSelect={onToggleSelect}
                        isUpdatingTransaction={isUpdatingTransaction}
                      />
                    ))}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props changed (do re-render)
    return (
      Object.keys(prevProps.groupedTransactions).length ===
        Object.keys(nextProps.groupedTransactions).length &&
      prevProps.paginatedTransactions.length === nextProps.paginatedTransactions.length &&
      prevProps.hideAccountColumn === nextProps.hideAccountColumn &&
      prevProps.isBulkSelectMode === nextProps.isBulkSelectMode &&
      prevProps.selectedTransactionIds?.length === nextProps.selectedTransactionIds?.length &&
      prevProps.accountsList.length === nextProps.accountsList.length &&
      prevProps.merchantsList.length === nextProps.merchantsList.length &&
      prevProps.categoriesList.length === nextProps.categoriesList.length
    );
  }
);
