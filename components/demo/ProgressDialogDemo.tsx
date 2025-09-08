"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload, 
  Move,
  Settings,
  FileText
} from "lucide-react";

// Import all the progress dialogs
import { 
  ProgressDialog,
  DeleteProgressDialog, 
  SyncProgressDialog
} from "@/components/ui/progress-dialog";

import { ImportProgressDialog } from "@/components/ui/import-progress-dialog";
import { ExportProgressDialog } from "@/components/ui/export-progress-dialog";
import { createOperationItem } from "@/lib/types/progress";

import type { OperationItem } from "@/lib/types/progress";

export function ProgressDialogDemo() {
  // Demo states for different dialog types
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  // Sample data for demonstrations
  const sampleItems: OperationItem[] = [
    createOperationItem("1", "Crypto Wallet - 0x1234...5678"),
    createOperationItem("2", "Bank Account - Chase Checking"),
    createOperationItem("3", "Investment Account - Fidelity 401k"),
    createOperationItem("4", "Credit Card - AmEx Platinum"),
    createOperationItem("5", "Savings Account - Capital One 360"),
  ];

  const sampleImportItems = [
    createOperationItem("csv1", "transactions_2024.csv (1,245 rows)"),
    createOperationItem("csv2", "crypto_trades_q1.csv (892 rows)"),
    createOperationItem("pdf1", "bank_statement_march.pdf"),
  ];

  const sampleExportItems = [
    createOperationItem("report1", "Portfolio Summary (PDF)"),
    createOperationItem("report2", "Transaction History (CSV)"),
    createOperationItem("report3", "Tax Report 2024 (Excel)"),
  ];

  // Mock async handlers that simulate real operations
  const mockAsyncHandler = async (itemIds: string[]) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate some failures (last item always fails for demo)
    const success = itemIds.slice(0, -1);
    const failed = itemIds.slice(-1);
    
    return { success, failed };
  };

  const dialogDemos = [
    {
      title: "Delete Operations",
      description: "Standardized delete dialogs with destructive styling",
      badge: "Destructive",
      badgeVariant: "destructive" as const,
      icon: <Trash2 className="h-5 w-5" />,
      action: () => setDeleteOpen(true),
      dialog: (
        <DeleteProgressDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          items={sampleItems}
          onConfirm={mockAsyncHandler}
          itemType="account"
        />
      )
    },
    {
      title: "Sync Operations",
      description: "Synchronization dialogs for data refresh operations",
      badge: "Sync",
      badgeVariant: "outline" as const,
      icon: <RefreshCw className="h-5 w-5" />,
      action: () => setSyncOpen(true),
      dialog: (
        <SyncProgressDialog
          open={syncOpen}
          onOpenChange={setSyncOpen}
          items={sampleItems}
          onConfirm={mockAsyncHandler}
          title="Sync Financial Data"
        />
      )
    },
    {
      title: "Import Operations",
      description: "File import and data processing dialogs",
      badge: "Import",
      badgeVariant: "secondary" as const,
      icon: <Upload className="h-5 w-5" />,
      action: () => setImportOpen(true),
      dialog: (
        <ImportProgressDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          items={sampleImportItems}
          onConfirm={mockAsyncHandler}
          importType="financial data"
        />
      )
    },
    {
      title: "Export Operations",
      description: "Report generation and data export dialogs",
      badge: "Export",
      badgeVariant: "outline" as const,
      icon: <Download className="h-5 w-5" />,
      action: () => setExportOpen(true),
      dialog: (
        <ExportProgressDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          items={sampleExportItems}
          onConfirm={mockAsyncHandler}
          exportType="financial reports"
        />
      )
    },
    {
      title: "Custom Operations",
      description: "Fully customizable progress dialog for any operation",
      badge: "Custom",
      badgeVariant: "secondary" as const,
      icon: <Settings className="h-5 w-5" />,
      action: () => setCustomOpen(true),
      dialog: (
        <ProgressDialog
          open={customOpen}
          onOpenChange={setCustomOpen}
          items={sampleItems}
          onConfirm={mockAsyncHandler}
          title="Custom Bulk Operation"
          description="This is a custom operation that can be configured for any use case."
          confirmButtonText="Start Custom Process"
          destructive={false}
          icon={Settings}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Progress Dialog System Demo</h2>
        <p className="text-muted-foreground">
          Standardized progress dialogs for consistent user experience across all bulk operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dialogDemos.map((demo, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {demo.icon}
                {demo.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={demo.badgeVariant}>{demo.badge}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {demo.description}
              </p>
              <Button 
                onClick={demo.action}
                className="w-full"
                size="sm"
              >
                Try {demo.title}
              </Button>
              {demo.dialog}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Progress Tracking</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Real-time progress bars</li>
                <li>Individual item status indicators</li>
                <li>Visual state transitions</li>
                <li>Completion statistics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Error Handling</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Individual item error tracking</li>
                <li>Partial success handling</li>
                <li>Detailed error messages</li>
                <li>Operation summary reports</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">User Experience</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Consistent visual design</li>
                <li>Responsive layouts</li>
                <li>Theme-aware styling</li>
                <li>Accessibility compliance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Customization</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Custom icons and colors</li>
                <li>Configurable messages</li>
                <li>Operation-specific styling</li>
                <li>Extensible component system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}