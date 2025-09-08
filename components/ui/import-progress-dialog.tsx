"use client";

import React from "react";
import { Upload, FileText } from "lucide-react";
import { ProgressDialog } from "@/components/ui/progress-dialog";
import type { OperationItem } from "@/lib/types/progress";
import { createOperationItem } from "@/lib/types/progress";

interface ImportItem {
  id: string;
  name: string;
  type: string;
  size?: number;
}

interface ImportProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ImportItem[];
  onConfirm: (itemIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
  importType?: string;
}

export function ImportProgressDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
  importType = "files"
}: ImportProgressDialogProps) {
  // Convert ImportItem[] to OperationItem[]
  const operationItems: OperationItem[] = items.map(item => 
    createOperationItem(item.id, `${item.name} (${item.type})`)
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title={`Import ${importType}`}
      description={`Importing ${items.length} ${importType}${items.length > 1 ? 's' : ''}. This may take some time depending on the size and complexity of your data.`}
      confirmButtonText={`Import ${items.length} ${importType}${items.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={Upload}
      iconColor="text-green-600"
      iconBgColor="bg-green-100 dark:bg-green-900/20"
    />
  );
}

// Specialized version for transaction imports
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
  const importItems: ImportItem[] = files.map(file => ({
    id: file.name,
    name: file.name,
    type: file.type || 'unknown',
    size: file.size
  }));

  return (
    <ImportProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={importItems}
      onConfirm={onConfirm}
      importType="transaction file"
    />
  );
}

// Specialized version for CSV imports
export function ImportCSVDialog({
  open,
  onOpenChange,
  csvData,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  csvData: { id: string; name: string; rowCount: number }[];
  onConfirm: (csvIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}) {
  const importItems: ImportItem[] = csvData.map(csv => ({
    id: csv.id,
    name: csv.name,
    type: `${csv.rowCount} rows`
  }));

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={importItems}
      onConfirm={onConfirm}
      title="Import CSV Data"
      description={`Processing ${csvData.length} CSV file${csvData.length > 1 ? 's' : ''} and importing data.`}
      confirmButtonText={`Import CSV Data`}
      destructive={false}
      icon={FileText}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-100 dark:bg-purple-900/20"
    />
  );
}