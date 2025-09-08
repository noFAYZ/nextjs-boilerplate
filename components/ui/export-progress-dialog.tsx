"use client";

import React from "react";
import { Download, FileDown } from "lucide-react";
import { ProgressDialog } from "@/components/ui/progress-dialog";
import type { OperationItem } from "@/lib/types/progress";
import { createOperationItem } from "@/lib/types/progress";

interface ExportItem {
  id: string;
  name: string;
  format: string;
  estimatedSize?: string;
}

interface ExportProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ExportItem[];
  onConfirm: (itemIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
  exportType?: string;
}

export function ExportProgressDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
  exportType = "data"
}: ExportProgressDialogProps) {
  // Convert ExportItem[] to OperationItem[]
  const operationItems: OperationItem[] = items.map(item => 
    createOperationItem(
      item.id, 
      `${item.name} (${item.format}${item.estimatedSize ? ` - ${item.estimatedSize}` : ''})`
    )
  );

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title={`Export ${exportType}`}
      description={`Generating ${items.length} export${items.length > 1 ? 's' : ''} in the requested format${items.length > 1 ? 's' : ''}. Large datasets may take longer to process.`}
      confirmButtonText={`Generate Export${items.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={Download}
      iconColor="text-indigo-600"
      iconBgColor="bg-indigo-100 dark:bg-indigo-900/20"
    />
  );
}

// Specialized version for transaction exports
export function ExportTransactionsDialog({
  open,
  onOpenChange,
  exports,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exports: { id: string; name: string; format: 'CSV' | 'PDF' | 'JSON'; dateRange: string }[];
  onConfirm: (exportIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}) {
  const exportItems: ExportItem[] = exports.map(exp => ({
    id: exp.id,
    name: `${exp.name} - ${exp.dateRange}`,
    format: exp.format
  }));

  return (
    <ExportProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={exportItems}
      onConfirm={onConfirm}
      exportType="transaction reports"
    />
  );
}

// Specialized version for portfolio exports
export function ExportPortfolioDialog({
  open,
  onOpenChange,
  portfolios,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolios: { id: string; name: string; format: 'PDF' | 'XLSX'; includeCharts: boolean }[];
  onConfirm: (portfolioIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}) {
  const exportItems: ExportItem[] = portfolios.map(portfolio => ({
    id: portfolio.id,
    name: portfolio.name,
    format: `${portfolio.format}${portfolio.includeCharts ? ' with charts' : ''}`
  }));

  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={exportItems}
      onConfirm={onConfirm}
      title="Export Portfolio Reports"
      description={`Generating comprehensive portfolio reports. Charts and detailed analytics will be included where specified.`}
      confirmButtonText="Generate Reports"
      destructive={false}
      icon={FileDown}
      iconColor="text-emerald-600"
      iconBgColor="bg-emerald-100 dark:bg-emerald-900/20"
    />
  );
}