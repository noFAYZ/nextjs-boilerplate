'use client';

import React, { useMemo, useState } from 'react';
import { useAllAccounts, useDeleteUnifiedAccount, useBulkDeactivateAccounts, useBulkReactivateAccounts, useBulkDeleteAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { useToast } from '@/lib/hooks/useToast';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';
import { AccountsDataTable } from './accounts-data-table';
import { ConfirmationDialog } from './confirmation-dialog';
import { AccountsFloatingToolbar } from './accounts-floating-toolbar';

interface PendingAction {
  type: 'delete' | 'deactivate' | 'reactivate';
  isBulk: boolean;
  accountIds?: string[];
  accountName?: string;
  count?: number;
}

export function ManageTab() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteUnifiedAccount();
  const { mutate: bulkDelete, isPending: isBulkDeleting } = useBulkDeleteAccounts();
  const { mutate: bulkDeactivate, isPending: isDeactivating } = useBulkDeactivateAccounts();
  const { mutate: bulkReactivate, isPending: isReactivating } = useBulkReactivateAccounts();
  const { toast, update: updateToast } = useToast();

  // Confirmation dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // Get selection and balance visibility from UI store
  const selectedAccountIds = useAccountsUIStore((state) => state.selectedAccountIds);
  const setDeletingAccount = useAccountsUIStore((state) => state.setDeletingAccount);
  const clearDeletingAccount = useAccountsUIStore((state) => state.clearDeletingAccount);
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const clearSelection = useAccountsUIStore((state) => state.clearSelection);
  const toggleAccountSelection = useAccountsUIStore((state) => state.toggleAccountSelection);

  // Flatten all accounts from groups
  const allAccounts = useMemo(() => {
    if (!accountsData?.groups) return [];
    const accounts: UnifiedAccount[] = [];
    Object.values(accountsData.groups).forEach((group) => {
      if (group.accounts) {
        accounts.push(...group.accounts);
      }
    });
    return accounts;
  }, [accountsData?.groups]);

  // Handle delete single account
  const handleDeleteAccount = (accountId: string) => {
    setPendingAction({
      type: 'delete',
      isBulk: false,
      accountIds: [accountId],
    });
    setIsConfirmDialogOpen(true);
  };

  // Handle delete selected accounts
  const handleDeleteSelected = () => {
    if (selectedAccountIds.length === 0) {
      toast({
        variant: 'info',
        title: 'No accounts selected',
        description: 'Please select accounts to delete',
      });
      return;
    }

    setPendingAction({
      type: 'delete',
      isBulk: true,
      accountIds: selectedAccountIds,
      count: selectedAccountIds.length,
    });
    setIsConfirmDialogOpen(true);
  };

  // Handle deactivate selected accounts
  const handleDeactivateSelected = () => {
    if (selectedAccountIds.length === 0) {
      toast({
        variant: 'info',
        title: 'No accounts selected',
        description: 'Please select accounts to deactivate',
      });
      return;
    }

    setPendingAction({
      type: 'deactivate',
      isBulk: true,
      accountIds: selectedAccountIds,
      count: selectedAccountIds.length,
    });
    setIsConfirmDialogOpen(true);
  };

  // Handle reactivate selected accounts
  const handleReactivateSelected = () => {
    if (selectedAccountIds.length === 0) {
      toast({
        variant: 'info',
        title: 'No accounts selected',
        description: 'Please select accounts to reactivate',
      });
      return;
    }

    setPendingAction({
      type: 'reactivate',
      isBulk: true,
      accountIds: selectedAccountIds,
      count: selectedAccountIds.length,
    });
    setIsConfirmDialogOpen(true);
  };

  // Execute confirmed action
  const executeConfirmedAction = async () => {
    if (!pendingAction) return;

    const { type, isBulk, accountIds = [] } = pendingAction;

    if (type === 'delete') {
      if (isBulk) {
        // Delete multiple accounts using bulk endpoint
        const toastId = toast({
          variant: 'loading',
          title: 'Deleting accounts...',
          description: `Deleting ${accountIds.length} account(s)`,
        });

        bulkDelete(accountIds, {
          onSuccess: () => {
            clearSelection();
            updateToast(toastId, {
              variant: 'success',
              title: 'Deletion complete',
              description: `Successfully deleted ${accountIds.length} account(s)`,
              duration: 4000,
            });
          },
          onError: (error: any) => {
            updateToast(toastId, {
              title: 'Error',
              description: error?.message || 'Failed to delete accounts',
              variant: 'destructive',
              duration: 5000,
            });
          },
        });
      } else {
        // Delete single account
        const accountId = accountIds[0];
        setDeletingAccount(accountId);
        const toastId = toast({
          variant: 'loading',
          title: 'Deleting account...',
          description: 'Please wait while we delete your account',
        });

        deleteAccount(accountId, {
          onSuccess: () => {
            clearDeletingAccount(accountId);
            updateToast(toastId, {
              variant: 'success',
              title: 'Success',
              description: 'Account deleted successfully',
              duration: 4000,
            });
          },
          onError: (error: any) => {
            clearDeletingAccount(accountId);
            updateToast(toastId, {
              title: 'Error',
              description: error?.message || 'Failed to delete account',
              variant: 'destructive',
              duration: 5000,
            });
          },
        });
      }
    } else if (type === 'deactivate') {
      const title = isBulk
        ? 'Deactivating accounts...'
        : `Deactivating ${pendingAction.accountName}...`;
      const count = isBulk ? accountIds.length : 1;

      const toastId = toast({
        variant: 'loading',
        title,
        description: isBulk ? `Deactivating ${count} account(s)` : undefined,
      });

      bulkDeactivate(accountIds, {
        onSuccess: () => {
          if (isBulk) clearSelection();
          updateToast(toastId, {
            variant: 'success',
            title: 'Success',
            description: isBulk
              ? `Successfully deactivated ${count} account(s)`
              : `${pendingAction.accountName} has been deactivated`,
            duration: 4000,
          });
        },
        onError: (error: any) => {
          updateToast(toastId, {
            title: 'Error',
            description: error?.message || 'Failed to deactivate accounts',
            variant: 'destructive',
            duration: 5000,
          });
        },
      });
    } else if (type === 'reactivate') {
      const title = isBulk
        ? 'Reactivating accounts...'
        : `Reactivating ${pendingAction.accountName}...`;
      const count = isBulk ? accountIds.length : 1;

      const toastId = toast({
        variant: 'loading',
        title,
        description: isBulk ? `Reactivating ${count} account(s)` : undefined,
      });

      bulkReactivate(accountIds, {
        onSuccess: () => {
          if (isBulk) clearSelection();
          updateToast(toastId, {
            variant: 'success',
            title: 'Success',
            description: isBulk
              ? `Successfully reactivated ${count} account(s)`
              : `${pendingAction.accountName} has been reactivated`,
            duration: 4000,
          });
        },
        onError: (error: any) => {
          updateToast(toastId, {
            title: 'Error',
            description: error?.message || 'Failed to reactivate accounts',
            variant: 'destructive',
            duration: 5000,
          });
        },
      });
    }

    setPendingAction(null);
  };

  // Handle individual account actions
  const handleEdit = (account: UnifiedAccount) => {
    // Navigate to account detail page
    window.location.href = `/accounts/${account.id}`;
  };

  return (
    <div className="space-y-4 flex flex-col h-full max-w-7xl mx-auto">
      {/* Data Table */}
 
          <AccountsDataTable
            accounts={allAccounts}
            isLoading={isLoading}
            selectedIds={selectedAccountIds}
            onSelectionChange={(ids) => {
              // Selection is managed via UI store in the table component
            }}
            onDelete={(account) => handleDeleteAccount(account.id)}
            onDeactivate={(account) => {
              setPendingAction({
                type: 'deactivate',
                isBulk: false,
                accountIds: [account.id],
                accountName: account.name,
              });
              setIsConfirmDialogOpen(true);
            }}
            onReactivate={(account) => {
              setPendingAction({
                type: 'reactivate',
                isBulk: false,
                accountIds: [account.id],
                accountName: account.name,
              });
              setIsConfirmDialogOpen(true);
            }}
            balanceVisible={balanceVisible}
          />
     

      {/* Floating Toolbar */}
      <AccountsFloatingToolbar
        selectedCount={selectedAccountIds.length}
        onClearSelection={clearSelection}
        onDeactivate={handleDeactivateSelected}
        onReactivate={handleReactivateSelected}
        onDelete={handleDeleteSelected}
        isLoading={isDeleting || isBulkDeleting || isDeactivating || isReactivating}
      />

      {/* Confirmation Dialog */}
      {pendingAction && (
        <ConfirmationDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
          action={pendingAction.type}
          title={
            pendingAction.isBulk
              ? `${pendingAction.type.charAt(0).toUpperCase() + pendingAction.type.slice(1)} ${pendingAction.count} Account(s)?`
              : `${pendingAction.type.charAt(0).toUpperCase() + pendingAction.type.slice(1)} ${pendingAction.accountName}?`
          }
          description={
            pendingAction.type === 'delete'
              ? 'This action cannot be undone. All associated data will be permanently removed.'
              : pendingAction.type === 'deactivate'
                ? 'You will still be able to reactivate this account later.'
                : 'The account will be restored to your active accounts.'
          }
          isLoading={isDeleting || isBulkDeleting || isDeactivating || isReactivating}
          onConfirm={executeConfirmedAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}
