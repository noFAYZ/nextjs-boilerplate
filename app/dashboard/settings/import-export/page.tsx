"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Database,
  Settings2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  ImportFilesDialog,
  ExportFilesDialog,
  ImportCSVDialog,
  ExportPDFDialog,
  ExportSpreadsheetDialog,
  ImportBackupDialog,
  ExportBackupDialog
} from '@/components/ui/file-operations-dialog';

export default function ImportExportPage() {
  // File operation states
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [isPDFExportOpen, setIsPDFExportOpen] = useState(false);
  const [isSpreadsheetExportOpen, setIsSpreadsheetExportOpen] = useState(false);
  const [isBackupImportOpen, setIsBackupImportOpen] = useState(false);
  const [isBackupExportOpen, setIsBackupExportOpen] = useState(false);
  
  // Selected files state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Sample data for demonstrations
  const sampleImportFiles = [
    { id: '1', name: 'transactions_2024.csv', size: 125000, type: 'CSV' },
    { id: '2', name: 'wallet_data.json', size: 89000, type: 'JSON' },
    { id: '3', name: 'portfolio_backup.zip', size: 456000, type: 'Archive' },
  ];
  
  const sampleExportFiles = [
    { id: '1', name: 'Portfolio Summary Q4 2024', format: 'PDF' },
    { id: '2', name: 'Transaction History Complete', format: 'CSV' },
    { id: '3', name: 'Asset Performance Report', format: 'XLSX' },
  ];
  
  const sampleCSVFiles = [
    {
      id: '1',
      name: 'coinbase_transactions.csv',
      rowCount: 1245,
      columns: ['Date', 'Type', 'Asset', 'Amount', 'Price', 'Total']
    },
    {
      id: '2',
      name: 'binance_trades.csv',
      rowCount: 892,
      columns: ['Time', 'Pair', 'Side', 'Amount', 'Price', 'Fee']
    }
  ];
  
  const samplePDFReports = [
    { id: '1', name: 'Annual Portfolio Report', pageCount: 15, includeCharts: true },
    { id: '2', name: 'Tax Summary 2024', pageCount: 8, includeCharts: false },
  ];
  
  const sampleSpreadsheets = [
    { id: '1', name: 'Complete Transaction Log', sheets: ['Trades', 'Transfers', 'Summary'], format: 'XLSX' as const },
    { id: '2', name: 'Asset Performance', sheets: ['Holdings', 'Performance', 'Charts'], format: 'XLSX' as const },
  ];
  
  const sampleBackupFile = {
    name: 'moneymappr_backup_2024.json',
    size: 15 * 1024 * 1024, // 15 MB
    dataTypes: ['Wallets', 'Transactions', 'Groups', 'Settings']
  };
  
  const sampleBackupData = {
    dataTypes: ['Wallets', 'Transactions', 'Account Groups', 'User Preferences'],
    estimatedSize: '12.5 MB',
    includeSettings: true
  };
  
  // Mock handlers for file operations
  const handleGenericImport = async (fileIds: string[]) => {
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = fileIds.filter(() => Math.random() > 0.1);
    const failed = fileIds.filter(id => !success.includes(id));
    return { success, failed };
  };
  
  const handleGenericExport = async (fileIds: string[]) => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = fileIds.filter(() => Math.random() > 0.05);
    const failed = fileIds.filter(id => !success.includes(id));
    return { success, failed };
  };
  
  const handleCSVImport = async (csvIds: string[]) => {
    // Simulate CSV processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    const success = csvIds.filter(() => Math.random() > 0.15);
    const failed = csvIds.filter(id => !success.includes(id));
    return { success, failed };
  };
  
  const handlePDFExport = async (reportIds: string[]) => {
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 4000));
    const success = reportIds.filter(() => Math.random() > 0.1);
    const failed = reportIds.filter(id => !success.includes(id));
    return { success, failed };
  };
  
  const handleSpreadsheetExport = async (sheetIds: string[]) => {
    // Simulate spreadsheet generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    const success = sheetIds.filter(() => Math.random() > 0.08);
    const failed = sheetIds.filter(id => !success.includes(id));
    return { success, failed };
  };
  
  const handleBackupImport = async (fileName: string) => {
    // Simulate backup restore
    await new Promise(resolve => setTimeout(resolve, 5000));
    const success = Math.random() > 0.1;
    return { success: success ? [fileName] : [], failed: success ? [] : [fileName] };
  };
  
  const handleBackupExport = async () => {
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 4000));
    const success = Math.random() > 0.05;
    return { success: success ? ['backup'] : [], failed: success ? [] : ['backup'] };
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Import & Export</h1>
        <p className="text-muted-foreground">
          Import data from other platforms or export your MoneyMappr data in various formats
        </p>
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Generic File Import */}
            <div className="space-y-2">
              <Label>Upload Files</Label>
              <Input
                type="file"
                multiple
                accept=".csv,.json,.xlsx,.zip"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <Button
                onClick={() => setIsImportDialogOpen(true)}
                disabled={selectedFiles.length === 0}
                className="w-full"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </Button>
            </div>
            
            {/* CSV Import */}
            <div className="space-y-2">
              <Label>Transaction CSV</Label>
              <p className="text-xs text-muted-foreground">
                Import transaction data from exchanges
              </p>
              <Button
                onClick={() => setIsCSVImportOpen(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Import CSV Data
              </Button>
            </div>
            
            {/* Backup Import */}
            <div className="space-y-2">
              <Label>Backup Restore</Label>
              <p className="text-xs text-muted-foreground">
                Restore from MoneyMappr backup
              </p>
              <Button
                onClick={() => setIsBackupImportOpen(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Database className="h-4 w-4 mr-2" />
                Import Backup
              </Button>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Import Guidelines:</p>
                <ul className="mt-1 space-y-1 text-xs list-disc list-inside">
                  <li>CSV files should include headers with Date, Amount, Asset columns</li>
                  <li>Large files will be processed in batches to ensure stability</li>
                  <li>Duplicate transactions will be automatically detected and skipped</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PDF Reports */}
            <div className="space-y-2">
              <Label>PDF Reports</Label>
              <p className="text-xs text-muted-foreground">
                Generate comprehensive PDF reports
              </p>
              <Button
                onClick={() => setIsPDFExportOpen(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF Reports
              </Button>
            </div>
            
            {/* Spreadsheet Export */}
            <div className="space-y-2">
              <Label>Excel/CSV Export</Label>
              <p className="text-xs text-muted-foreground">
                Export data in spreadsheet format
              </p>
              <Button
                onClick={() => setIsSpreadsheetExportOpen(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Spreadsheets
              </Button>
            </div>
            
            {/* Backup Export */}
            <div className="space-y-2">
              <Label>Complete Backup</Label>
              <p className="text-xs text-muted-foreground">
                Create a full backup of your data
              </p>
              <Button
                onClick={() => setIsBackupExportOpen(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Database className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-medium">Export Features:</p>
                <ul className="mt-1 space-y-1 text-xs list-disc list-inside">
                  <li>All exports include metadata and timestamps</li>
                  <li>PDF reports can include charts and visualizations</li>
                  <li>Spreadsheet exports support multiple sheets and formatting</li>
                  <li>Backups are encrypted and include all user data</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Dialogs */}
      <ImportFilesDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        files={selectedFiles.map((file, index) => ({
          id: index.toString(),
          name: file.name,
          size: file.size,
          type: file.type
        }))}
        onConfirm={handleGenericImport}
        title="Import Files"
        importType="file"
      />
      
      <ImportCSVDialog
        open={isCSVImportOpen}
        onOpenChange={setIsCSVImportOpen}
        csvFiles={sampleCSVFiles}
        onConfirm={handleCSVImport}
      />
      
      <ExportPDFDialog
        open={isPDFExportOpen}
        onOpenChange={setIsPDFExportOpen}
        reports={samplePDFReports}
        onConfirm={handlePDFExport}
      />
      
      <ExportSpreadsheetDialog
        open={isSpreadsheetExportOpen}
        onOpenChange={setIsSpreadsheetExportOpen}
        spreadsheets={sampleSpreadsheets}
        onConfirm={handleSpreadsheetExport}
      />
      
      <ImportBackupDialog
        open={isBackupImportOpen}
        onOpenChange={setIsBackupImportOpen}
        backupFile={sampleBackupFile}
        onConfirm={handleBackupImport}
      />
      
      <ExportBackupDialog
        open={isBackupExportOpen}
        onOpenChange={setIsBackupExportOpen}
        backupData={sampleBackupData}
        onConfirm={handleBackupExport}
      />
    </div>
  );
}