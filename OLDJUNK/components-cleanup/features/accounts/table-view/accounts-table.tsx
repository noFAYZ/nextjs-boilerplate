'use client';

import { useCallback, useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TableHeader } from './table-header';
import { AccountTableRow } from './account-table-row';
import type { UnifiedAccount } from '@/lib/types';

interface AccountsTableProps {
  accounts: UnifiedAccount[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (account: UnifiedAccount) => void;
  onDeactivate: (account: UnifiedAccount) => void;
  onReactivate: (account: UnifiedAccount) => void;
  onView?: (id: string) => void;
  balanceVisible: boolean;
  deletingAccountIds?: string[];
  isLoading?: boolean;
  visibleColumns?: string[];
  density?: 'compact' | 'comfortable' | 'spacious';
}

/**
 * Accounts table with high performance rendering
 * Note: For virtualization with large datasets (10,000+), use card view instead
 */
export function AccountsTable({
  accounts,
  selectedIds,
  onToggleSelect,
  onDelete,
  onDeactivate,
  onReactivate,
  onView,
  balanceVisible,
  deletingAccountIds = [],
  isLoading = false,
  visibleColumns = ['name', 'type', 'category', 'balance', 'status', 'actions'],
  density = 'comfortable',
}: AccountsTableProps) {

  // Check if all visible accounts are selected
  const allSelected = useMemo(() => {
    if (accounts.length === 0) return false;
    return accounts.every((acc) => selectedIds.includes(acc.id));
  }, [accounts, selectedIds]);

  // Check if some (but not all) accounts are selected
  const partialSelection = useMemo(() => {
    return selectedIds.length > 0 && !allSelected;
  }, [selectedIds, allSelected]);

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      accounts.forEach((account) => {
        const isCurrentlySelected = selectedIds.includes(account.id);
        if (checked && !isCurrentlySelected) {
          onToggleSelect(account.id);
        } else if (!checked && isCurrentlySelected) {
          onToggleSelect(account.id);
        }
      });
    },
    [accounts, selectedIds, onToggleSelect]
  );

  // Handle individual row selection
  const handleRowSelect = useCallback(
    (id: string, selected: boolean) => {
      onToggleSelect(id);
    },
    [onToggleSelect]
  );

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Table Container with border and background */}
      <div className="bg-card border border-border/80 rounded-xl overflow-x-auto shadow-sm flex-1" role="region" aria-label="Accounts data table">
        <Table aria-label="Accounts list">
          {/* Sticky header */}
          <TableHeader
            allSelected={allSelected}
            partialSelection={partialSelection}
            onSelectAll={handleSelectAll}
            visibleColumns={visibleColumns}
          />

          {/* Table body */}
          <TableBody>
            {accounts.map((account) => {
              const isDeletingAccount = deletingAccountIds.includes(account.id);

              return (
                <AccountTableRow
                  key={account.id}
                  account={account}
                  isSelected={selectedIds.includes(account.id)}
                  onSelect={handleRowSelect}
                  onDelete={onDelete}
                  onDeactivate={onDeactivate}
                  onReactivate={onReactivate}
                  onView={onView}
                  balanceVisible={balanceVisible}
                  isDeletingAccount={isDeletingAccount}
                  visibleColumns={visibleColumns}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-2 border-primary border-r-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading accounts…</p>
          </div>
        </div>
      )}
    </div>
  );
}
