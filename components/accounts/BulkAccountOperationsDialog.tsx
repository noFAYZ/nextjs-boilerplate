"use client";

import React from "react";
import { Settings, Trash2, RefreshCw, Move } from "lucide-react";
import { ProgressDialog, DeleteProgressDialog } from "@/components/ui/progress-dialog";
import type { OperationItem } from "@/lib/types/progress";
import { createOperationItem } from "@/lib/types/progress";

interface Account {
  id: string;
  name: string;
  type: string;
}

interface BulkOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
  onConfirm: (accountIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}

// Delete multiple accounts
export function DeleteAccountsDialog({
  open,
  onOpenChange,
  accounts,
  onConfirm,
}: BulkOperationDialogProps) {
  const operationItems: OperationItem[] = accounts.map(account => 
    createOperationItem(account.id, `${account.name} (${account.type})`)
  );

  return (
    <DeleteProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      itemType="account"
    />
  );
}

// Sync multiple accounts
export function SyncAccountsDialog({
  open,
  onOpenChange,
  accounts,
  onConfirm,
}: BulkOperationDialogProps) {
  const operationItems: OperationItem[] = accounts.map(account => 
    createOperationItem(account.id, `${account.name} (${account.type})`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title="Sync Accounts"
      description={`Synchronizing ${accounts.length} account${accounts.length > 1 ? 's' : ''} to fetch the latest balances and transactions.`}
      confirmButtonText={`Sync ${accounts.length} Account${accounts.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={RefreshCw}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100 dark:bg-blue-900/20"
    />
  );
}

// Move accounts to different groups
export function MoveAccountsDialog({
  open,
  onOpenChange,
  accounts,
  onConfirm,
  targetGroupName,
}: BulkOperationDialogProps & {
  targetGroupName: string;
}) {
  const operationItems: OperationItem[] = accounts.map(account => 
    createOperationItem(account.id, `${account.name} → ${targetGroupName}`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title="Move Accounts"
      description={`Moving ${accounts.length} account${accounts.length > 1 ? 's' : ''} to "${targetGroupName}" group.`}
      confirmButtonText={`Move Account${accounts.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={Move}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-100 dark:bg-purple-900/20"
    />
  );
}

// Update account settings in bulk
export function BulkUpdateAccountsDialog({
  open,
  onOpenChange,
  accounts,
  onConfirm,
  updateType,
}: BulkOperationDialogProps & {
  updateType: string;
}) {
  const operationItems: OperationItem[] = accounts.map(account => 
    createOperationItem(account.id, `${account.name} (${account.type})`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title={`Update Account ${updateType}`}
      description={`Applying ${updateType} updates to ${accounts.length} account${accounts.length > 1 ? 's' : ''}.`}
      confirmButtonText={`Update Account${accounts.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={Settings}
      iconColor="text-gray-600"
      iconBgColor="bg-gray-100 dark:bg-gray-900/20"
    />
  );
}