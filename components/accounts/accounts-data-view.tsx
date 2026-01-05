'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  useAllAccounts,
  useDeleteAccount,
  useBulkDeleteAccounts,
  useBulkDeactivateAccounts,
  useBulkReactivateAccounts,
} from '@/lib/queries/use-accounts-data';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { AccountsToolbar } from './shared/accounts-toolbar';
import { BulkSelectHeader, BulkActionsToolbar } from './shared/bulk-select-header';
import { EmptyState } from './shared/empty-state';
import { AccountsTable } from './table-view/accounts-table';
import { AccountsCardGrid } from './card-view/accounts-card-grid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { UnifiedAccount } from '@/lib/types';

/**
 * Main accounts data view component
 * Handles switching between table and card views with full CRUD operations
 * Features filtering, sorting, selection, and bulk operations
 */
export function AccountsDataView() {
  // Data from TanStack Query
  const { data: allAccounts = [], isLoading, error } = useAllAccounts();

  // UI state from Zustand
  const {
    viewPreferences,
    filters,
    selectedAccountIds,
    toggleAccountSelection,
    clearSelection,
    selectAllVisible,
  } = useAccountsUIStore();

  // Mutations
  const deleteAccountMutation = useDeleteAccount();
  const bulkDeleteMutation = useBulkDeleteAccounts();
  const bulkDeactivateMutation = useBulkDeactivateAccounts();
  const bulkReactivateMutation = useBulkReactivateAccounts();

  // Local state for dialogs and progress
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<UnifiedAccount | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deletingAccountIds, setDeletingAccountIds] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);

  // Apply filters
  const filteredAccounts = useMemo(() => {
    // Flatten accounts if they're grouped
    let result = Array.isArray(allAccounts)
      ? allAccounts
      : Object.values(allAccounts?.groups || {}).flatMap((group: any) => group.accounts || []);

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(query) ||
          account.institutionName?.toLowerCase().includes(query) ||
          account.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters?.categories?.length > 0) {
      result = result.filter((account) => filters.categories.includes(account.category));
    }

    // Account type filter
    if (filters?.accountTypes?.length > 0) {
      result = result.filter((account) => filters.accountTypes.includes(account.type));
    }

    // Source filter
    if (filters?.sources?.length > 0) {
      result = result.filter((account) => filters.sources.includes(account.source));
    }

    return result;
  }, [allAccounts, filters]);

  // Apply sorting
  const sortedAccounts = useMemo(() => {
    const accounts = [...filteredAccounts];

    switch (filters.sortBy) {
      case 'name':
        accounts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'balance':
        accounts.sort((a, b) => a.balance - b.balance);
        break;
      case 'type':
        accounts.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'institution':
        accounts.sort((a, b) =>
          (a.institutionName || '').localeCompare(b.institutionName || '')
        );
        break;
      case 'lastSync':
        accounts.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      default:
        break;
    }

    // Apply sort order
    if (filters.sortOrder === 'desc') {
      accounts.reverse();
    }

    return accounts;
  }, [filteredAccounts, filters.sortBy, filters.sortOrder]);

  // Handle single account delete
  const handleDeleteClick = useCallback((account: UnifiedAccount) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!accountToDelete) return;

    setDeleteDialogOpen(false);
    setDeletingAccountIds([accountToDelete.id]);

    try {
      await deleteAccountMutation.mutateAsync(accountToDelete.id);
    } finally {
      setDeletingAccountIds([]);
      setAccountToDelete(null);
    }
  }, [accountToDelete, deleteAccountMutation]);

  // Handle deactivate
  const handleDeactivate = useCallback(
    async (account: UnifiedAccount) => {
      try {
        await bulkDeactivateMutation.mutateAsync([account.id]);
      } catch (error) {
        console.error('Failed to deactivate account:', error);
      }
    },
    [bulkDeactivateMutation]
  );

  // Handle reactivate
  const handleReactivate = useCallback(
    async (account: UnifiedAccount) => {
      try {
        await bulkReactivateMutation.mutateAsync([account.id]);
      } catch (error) {
        console.error('Failed to reactivate account:', error);
      }
    },
    [bulkReactivateMutation]
  );

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedAccountIds.length === 0) return;

    setBulkDeleteDialogOpen(false);
    setDeletingAccountIds(selectedAccountIds);
    setProcessedCount(0);

    try {
      // Delete accounts one by one to track progress
      for (const id of selectedAccountIds) {
        await deleteAccountMutation.mutateAsync(id);
        setProcessedCount((prev) => prev + 1);
      }
      clearSelection();
    } finally {
      setDeletingAccountIds([]);
      setProcessedCount(0);
    }
  }, [selectedAccountIds, deleteAccountMutation, clearSelection]);

  // Handle bulk deactivate
  const handleBulkDeactivate = useCallback(async () => {
    if (selectedAccountIds.length === 0) return;

    setDeletingAccountIds(selectedAccountIds);
    setProcessedCount(0);

    try {
      // Deactivate all selected accounts at once
      await bulkDeactivateMutation.mutateAsync(selectedAccountIds);
      setProcessedCount(selectedAccountIds.length);
      clearSelection();
    } finally {
      setDeletingAccountIds([]);
      setProcessedCount(0);
    }
  }, [selectedAccountIds, bulkDeactivateMutation, clearSelection]);

  // Handle bulk reactivate
  const handleBulkReactivate = useCallback(async () => {
    if (selectedAccountIds.length === 0) return;

    setDeletingAccountIds(selectedAccountIds);
    setProcessedCount(0);

    try {
      // Reactivate all selected accounts at once
      await bulkReactivateMutation.mutateAsync(selectedAccountIds);
      setProcessedCount(selectedAccountIds.length);
      clearSelection();
    } finally {
      setDeletingAccountIds([]);
      setProcessedCount(0);
    }
  }, [selectedAccountIds, bulkReactivateMutation, clearSelection]);

  // Toggle selection for individual account
  const handleToggleSelect = useCallback(
    (id: string) => {
      toggleAccountSelection(id);
    },
    [toggleAccountSelection]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Failed to load accounts</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // Show empty state if no accounts
  if (!isLoading && sortedAccounts.length === 0) {
    return (
      <div className="space-y-4">
        <AccountsToolbar
          accountCount={allAccounts.length}
          isLoading={isLoading}
        />
        <EmptyState
          hasFilters={
            filters.searchQuery ||
            filters.categories.length > 0 ||
            filters.accountTypes.length > 0 ||
            filters.sources.length > 0
          }
        />
      </div>
    );
  }

  const isProcessing =
    deleteAccountMutation.isPending ||
    bulkDeleteMutation.isPending ||
    bulkDeactivateMutation.isPending ||
    bulkReactivateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <AccountsToolbar
        accountCount={allAccounts.length}
        isLoading={isLoading}
      />

      {/* Bulk select header */}
      {selectedAccountIds.length > 0 && (
        <BulkSelectHeader
          selectedCount={selectedAccountIds.length}
          totalCount={sortedAccounts.length}
          onSelectAll={() => selectAllVisible(sortedAccounts.map((a) => a.id))}
          onClearSelection={clearSelection}
        />
      )}

      {/* Main content */}
      {viewPreferences.accountsView === 'table' ? (
        <AccountsTable
          accounts={sortedAccounts}
          selectedIds={selectedAccountIds}
          onToggleSelect={handleToggleSelect}
          onDelete={handleDeleteClick}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
          balanceVisible={viewPreferences.balanceVisible}
          deletingAccountIds={deletingAccountIds}
          isLoading={isLoading}
        />
      ) : (
        <AccountsCardGrid
          accounts={sortedAccounts}
          selectedIds={selectedAccountIds}
          onToggleSelect={handleToggleSelect}
          onDelete={handleDeleteClick}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
          balanceVisible={viewPreferences.balanceVisible}
          deletingAccountIds={deletingAccountIds}
          isLoading={isLoading}
        />
      )}

      {/* Bulk actions toolbar */}
      {selectedAccountIds.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedAccountIds.length}
          isProcessing={isProcessing}
          processedCount={processedCount}
          onDelete={() => setBulkDeleteDialogOpen(true)}
          onDeactivate={handleBulkDeactivate}
          onReactivate={handleBulkReactivate}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{accountToDelete?.name}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex items-center justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirmation dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete {selectedAccountIds.length} accounts?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {selectedAccountIds.length} selected account
            {selectedAccountIds.length !== 1 ? 's' : ''}. This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex items-center justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete all
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
