# Progress Dialog System

A standardized progress dialog system for MoneyMappr that provides consistent user experience for all long-running and bulk operations throughout the application.

## Overview

The progress dialog system consists of:
- **Core Components**: Base progress dialog and specialized variants
- **Type System**: TypeScript interfaces for consistent data handling
- **Utility Functions**: Helper functions for common operations
- **Pre-built Dialogs**: Ready-to-use components for common operations

## Core Components

### `ProgressDialog`
The base component that handles all progress dialog functionality.

```tsx
import { ProgressDialog } from '@/components/ui/progress-dialog';
import type { OperationItem } from '@/lib/types/progress';

const items: OperationItem[] = [
  { id: '1', name: 'Item 1', status: 'pending' },
  { id: '2', name: 'Item 2', status: 'pending' }
];

<ProgressDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  items={items}
  onConfirm={handleConfirm}
  title="Custom Operation"
  description="Processing items..."
  confirmButtonText="Start Processing"
  destructive={false}
  icon={CustomIcon}
  iconColor="text-blue-600"
  iconBgColor="bg-blue-100"
/>
```

### `DeleteProgressDialog`
Specialized component for delete operations with destructive styling.

```tsx
import { DeleteProgressDialog } from '@/components/ui/progress-dialog';

<DeleteProgressDialog
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  items={operationItems}
  onConfirm={handleDelete}
  itemType="accounts"
/>
```

### `SyncProgressDialog`
Specialized component for synchronization operations.

```tsx
import { SyncProgressDialog } from '@/components/ui/progress-dialog';

<SyncProgressDialog
  open={isSyncOpen}
  onOpenChange={setIsSyncOpen}
  items={operationItems}
  onConfirm={handleSync}
  title="Sync Wallets"
/>
```

## Pre-built Dialogs

### Account Operations

#### Delete Groups
```tsx
import { DeleteGroupsDialog } from '@/components/accounts/DeleteGroupsDialog';

<DeleteGroupsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  groups={selectedGroups}
  onConfirm={handleDeleteGroups}
/>
```

#### Bulk Account Operations
```tsx
import { 
  DeleteAccountsDialog,
  SyncAccountsDialog,
  MoveAccountsDialog,
  BulkUpdateAccountsDialog
} from '@/components/accounts/BulkAccountOperationsDialog';

// Delete multiple accounts
<DeleteAccountsDialog
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  accounts={selectedAccounts}
  onConfirm={handleDeleteAccounts}
/>

// Sync multiple accounts
<SyncAccountsDialog
  open={isSyncOpen}
  onOpenChange={setIsSyncOpen}
  accounts={selectedAccounts}
  onConfirm={handleSyncAccounts}
/>

// Move accounts to different group
<MoveAccountsDialog
  open={isMoveOpen}
  onOpenChange={setIsMoveOpen}
  accounts={selectedAccounts}
  targetGroupName="New Group"
  onConfirm={handleMoveAccounts}
/>
```

### Crypto Operations

#### Sync Crypto Wallets
```tsx
import { SyncWalletsDialog } from '@/components/crypto/SyncWalletsDialog';

<SyncWalletsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  wallets={selectedWallets}
  onConfirm={handleSyncWallets}
/>
```

### Import/Export Operations

#### Import Data
```tsx
import { 
  ImportProgressDialog,
  ImportTransactionsDialog,
  ImportCSVDialog
} from '@/components/ui/import-progress-dialog';

// General import
<ImportProgressDialog
  open={isImportOpen}
  onOpenChange={setIsImportOpen}
  items={importItems}
  onConfirm={handleImport}
  importType="transactions"
/>

// Transaction file import
<ImportTransactionsDialog
  open={isImportOpen}
  onOpenChange={setIsImportOpen}
  files={selectedFiles}
  onConfirm={handleImportTransactions}
/>

// CSV import
<ImportCSVDialog
  open={isImportOpen}
  onOpenChange={setIsImportOpen}
  csvData={csvFiles}
  onConfirm={handleImportCSV}
/>
```

#### Export Data
```tsx
import { 
  ExportProgressDialog,
  ExportTransactionsDialog,
  ExportPortfolioDialog
} from '@/components/ui/export-progress-dialog';

// General export
<ExportProgressDialog
  open={isExportOpen}
  onOpenChange={setIsExportOpen}
  items={exportItems}
  onConfirm={handleExport}
  exportType="reports"
/>

// Transaction export
<ExportTransactionsDialog
  open={isExportOpen}
  onOpenChange={setIsExportOpen}
  exports={exportConfigs}
  onConfirm={handleExportTransactions}
/>

// Portfolio export
<ExportPortfolioDialog
  open={isExportOpen}
  onOpenChange={setIsExportOpen}
  portfolios={portfolioExports}
  onConfirm={handleExportPortfolios}
/>
```

## Type System

### Core Types

```tsx
import type {
  OperationStatus,
  OperationItem,
  ProgressDialogProps,
  ProgressOperationResult
} from '@/lib/types/progress';

type OperationStatus = 'pending' | 'processing' | 'success' | 'error' | 'cancelled';

interface OperationItem {
  id: string;
  name: string;
  status: OperationStatus;
  error?: string;
  progress?: number; // 0-100 for individual item progress
}

interface ProgressOperationResult {
  success: string[];
  failed: string[];
  cancelled?: string[];
}
```

### Helper Functions

```tsx
import { 
  createOperationItem,
  getStatusIcon,
  getStatusColor,
  getStatusBadgeVariant,
  getStatusText
} from '@/lib/types/progress';

// Create operation item
const item = createOperationItem('id', 'name', 'pending');

// Get status styling
const color = getStatusColor('success'); // 'text-green-600'
const badgeVariant = getStatusBadgeVariant('error'); // 'destructive'
const statusText = getStatusText('processing'); // 'Processing...'
```

## Implementation Pattern

### Basic Implementation

1. **Import the appropriate dialog component**:
```tsx
import { DeleteProgressDialog } from '@/components/ui/progress-dialogs';
```

2. **Create operation items from your data**:
```tsx
const operationItems = selectedItems.map(item => 
  createOperationItem(item.id, item.name)
);
```

3. **Implement the confirm handler**:
```tsx
const handleConfirm = async (itemIds: string[]): Promise<{success: string[], failed: string[]}> => {
  const results = { success: [], failed: [] };
  
  for (const id of itemIds) {
    try {
      await performOperation(id);
      results.success.push(id);
    } catch (error) {
      results.failed.push(id);
    }
  }
  
  return results;
};
```

4. **Use the dialog in your component**:
```tsx
<DeleteProgressDialog
  open={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  items={operationItems}
  onConfirm={handleConfirm}
  itemType="items"
/>
```

### Advanced Implementation

For custom operations, use the base `ProgressDialog`:

```tsx
import { ProgressDialog } from '@/components/ui/progress-dialog';
import { CustomIcon } from 'lucide-react';

<ProgressDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  items={operationItems}
  onConfirm={handleCustomOperation}
  title="Custom Operation"
  description="Performing custom operation on selected items."
  confirmButtonText="Start Operation"
  destructive={false}
  icon={CustomIcon}
  iconColor="text-purple-600"
  iconBgColor="bg-purple-100 dark:bg-purple-900/20"
/>
```

## Features

### Visual Progress Tracking
- **Progress Bar**: Shows overall completion percentage
- **Individual Status**: Each item shows its current status with icons
- **Real-time Updates**: Status updates as operations progress
- **Color Coding**: Different colors for different states (success, error, processing)

### Error Handling
- **Individual Errors**: Each item can fail independently
- **Error Messages**: Specific error messages for each failed item
- **Partial Success**: Operations continue even if some items fail
- **Summary Report**: Final summary showing success/failure counts

### User Experience
- **Consistent Styling**: All dialogs follow the same design patterns
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Clear indication of processing status

### Flexibility
- **Customizable Icons**: Different icons for different operation types
- **Custom Messages**: Tailored messages for specific operations
- **Theming**: Support for light/dark themes
- **Extensible**: Easy to create new specialized dialogs

## Best Practices

1. **Use Appropriate Dialog Types**: Choose the right specialized dialog for your operation
2. **Provide Clear Names**: Use descriptive names for operation items
3. **Handle Errors Gracefully**: Always return proper success/failed arrays
4. **Test Edge Cases**: Test with empty lists, all failures, partial failures
5. **Consistent Naming**: Use consistent terminology across operations

## Integration with Existing Code

Replace existing confirmation dialogs:

```tsx
// Before - Simple confirmation
if (window.confirm('Delete selected items?')) {
  // Perform delete
}

// After - Progress dialog
<DeleteProgressDialog
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  items={operationItems}
  onConfirm={handleDelete}
  itemType="items"
/>
```

## Future Enhancements

- **Progress Streaming**: Real-time progress updates via WebSocket
- **Cancellation Support**: Ability to cancel long-running operations
- **Retry Mechanism**: Automatic retry for failed items
- **Batch Size Control**: Control over how many items to process simultaneously
- **Operation History**: Track and display history of operations