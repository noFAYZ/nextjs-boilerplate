"use client";

import React from "react";
import { FileText, Download, Upload, Tag, Trash2 } from "lucide-react";
import { ProgressDialog, DeleteProgressDialog } from "@/components/ui/progress-dialog";
import { ExportProgressDialog, ImportProgressDialog } from "@/components/ui/import-progress-dialog";
import type { OperationItem } from "@/lib/types/progress";
import { createOperationItem } from "@/lib/types/progress";

interface Transaction {
  id: string;
  hash: string;
  type: string;
  amount: string;
  token?: string;
}

interface TransactionOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: Transaction[];
  onConfirm: (transactionIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}

// Bulk transaction categorization dialog
export function CategorizeTransactionsDialog({
  open,
  onOpenChange,
  transactions,
  onConfirm,
}: TransactionOperationDialogProps) {
  const operationItems: OperationItem[] = transactions.map(tx => 
    createOperationItem(tx.id, `${tx.hash.slice(0, 10)}... (${tx.type})`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title="Categorize Transactions"
      description={`Automatically categorizing ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} based on patterns and rules.`}
      confirmButtonText="Categorize Transactions"
      destructive={false}
      icon={Tag}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100 dark:bg-blue-900/20"
    />
  );
}

// Delete transactions dialog
export function DeleteTransactionsDialog({
  open,
  onOpenChange,
  transactions,
  onConfirm,
}: TransactionOperationDialogProps) {
  const operationItems: OperationItem[] = transactions.map(tx => 
    createOperationItem(tx.id, `${tx.hash.slice(0, 10)}... (${tx.amount} ${tx.token || 'ETH'})`)
  );

  return (
    <DeleteProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      itemType="transaction"
    />
  );
}

// Export transactions dialog
export function ExportTransactionsDialog({
  open,
  onOpenChange,
  transactions,
  onConfirm,
  exportFormat = "CSV"
}: TransactionOperationDialogProps & {
  exportFormat?: "CSV" | "PDF" | "JSON";
}) {
  const operationItems: OperationItem[] = transactions.map(tx => 
    createOperationItem(tx.id, `${tx.hash.slice(0, 10)}... → ${exportFormat}`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title="Export Transactions"
      description={`Exporting ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} to ${exportFormat} format. This may take a moment for large datasets.`}
      confirmButtonText={`Export as ${exportFormat}`}
      destructive={false}
      icon={Download}
      iconColor="text-green-600"
      iconBgColor="bg-green-100 dark:bg-green-900/20"
    />
  );
}

// Import transactions dialog (for CSV/file imports)
export function ImportTransactionsDialog({
  open,
  onOpenChange,
  files,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
  onConfirm: (fileNames: string[]) => Promise<{ success: string[]; failed: string[] }>;
}) {
  const operationItems: OperationItem[] = files.map(file => 
    createOperationItem(file.name, `${file.name} (${(file.size / 1024).toFixed(1)} KB)`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title="Import Transactions"
      description={`Processing ${files.length} file${files.length > 1 ? 's' : ''} and importing transaction data. This may take several minutes.`}
      confirmButtonText="Import Files"
      destructive={false}
      icon={Upload}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-100 dark:bg-purple-900/20"
    />
  );
}

// Bulk transaction update dialog (for updating transaction metadata)
export function UpdateTransactionsDialog({
  open,
  onOpenChange,
  transactions,
  onConfirm,
  updateType = "metadata"
}: TransactionOperationDialogProps & {
  updateType?: string;
}) {
  const operationItems: OperationItem[] = transactions.map(tx => 
    createOperationItem(tx.id, `Update ${tx.hash.slice(0, 10)}...`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title={`Update Transaction ${updateType}`}
      description={`Updating ${updateType} for ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}.`}
      confirmButtonText={`Update ${transactions.length} Transaction${transactions.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={FileText}
      iconColor="text-orange-600"
      iconBgColor="bg-orange-100 dark:bg-orange-900/20"
    />
  );
}