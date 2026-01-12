# Accounts Module - Implementation Guide

Complete implementation of the accounts management system with all new backend features.

## Quick Start

### Page Routes
- **Main Accounts Page**: `/dashboard/accounts` - Tab-based interface for overview, analytics, and management
- **Account Details**: `/dashboard/accounts/[id]` - Individual account view with balance chart and transactions

### Import Components
```typescript
import {
  NetWorthCard,
  ConnectionHealthBadge,
  ConnectionSyncControls,
  AccountStatusBadge,
  AccountFavoriteToggle,
  AccountGroupingPanel,
  AccountLifecycleActions,
  TransactionNotesEditor,
  TransactionTagsManager,
  TransactionAttachments,
  DuplicateDetectionBanner,
  AccountsOverviewSection,
  AccountsEnhancedPage,
} from "@/app/dashboard/accounts/components";
```

---

## API Layer (100+ Methods)

### Accounts API (`lib/services/accounts-api.ts`)

#### Account Lifecycle Management
```typescript
// Archive/Reopen/Close individual accounts
await accountsApi.archiveAccount(accountId);
await accountsApi.reopenAccount(accountId);
await accountsApi.closeAccount(accountId);

// Bulk lifecycle operations
await accountsApi.bulkArchiveAccounts(accountIds);
await accountsApi.bulkReopenAccounts(accountIds);
await accountsApi.bulkCloseAccounts(accountIds);

// Audit trail
await accountsApi.getAccountLifecycleHistory(accountId);
```

#### Account Grouping & Favorites
```typescript
// Grouping
await accountsApi.getAccountGroups();
await accountsApi.createAccountGroup({ name, description });
await accountsApi.addAccountToGroup(groupId, accountId);
await accountsApi.removeAccountFromGroup(groupId, accountId);
await accountsApi.getGroupSummary(groupId);

// Favorites
await accountsApi.markAccountFavorite(accountId);
await accountsApi.removeAccountFromFavorites(accountId);
await accountsApi.getFavoriteAccounts();
```

#### Multi-Currency Support
```typescript
// Exchange rates
await accountsApi.getExchangeRate(from, to, date);
await accountsApi.convertCurrency(amount, from, to);
await accountsApi.getNetWorthInCurrency(currency);
await accountsApi.getExchangeRateCacheStats();
```

#### Balance History
```typescript
await accountsApi.getBalanceHistory(accountId, { dateFrom, dateTo, limit });
```

### Banking API (`lib/services/banking-api.ts`)

#### Connection Management
```typescript
// Get connections
await bankingApi.getConnections({ provider, status, page, limit });
await bankingApi.getConnection(connectionId);

// Health & Status
await bankingApi.checkConnectionHealth(connectionId);
await bankingApi.getConnectionSyncStatus(connectionId);

// Lifecycle
await bankingApi.disconnectConnection(connectionId, revokeToken);
await bankingApi.reconnectConnection(connectionId);
await bankingApi.deleteConnection(connectionId);

// Sync
await bankingApi.syncConnection(connectionId, { syncType, returnStream });
await bankingApi.batchSync(connectionIds, syncType);
```

### Transactions API (`lib/services/transactions-api.ts`)

#### Notes & Tags
```typescript
// Notes
await transactionsApi.getTransactionNotes(transactionId);
await transactionsApi.updateTransactionNotes(transactionId, notes);
await transactionsApi.deleteTransactionNotes(transactionId);

// Tags
await transactionsApi.addTransactionTags(transactionId, tags);
await transactionsApi.removeTransactionTags(transactionId, tags);
await transactionsApi.replaceTransactionTags(transactionId, tags);
await transactionsApi.getAllUserTags(organizationId, sort);
await transactionsApi.getTransactionsByTag(tag);
```

#### Bulk Operations
```typescript
await transactionsApi.bulkCategorizeTransactions(transactionIds, category);
await transactionsApi.bulkAddTransactionTags(transactionIds, tags);
await transactionsApi.bulkRemoveTransactionTags(transactionIds, tags);
await transactionsApi.bulkReplaceTransactionTags(transactionIds, tags);
await transactionsApi.bulkAddTransactionNotes(transactionIds, notes);
await transactionsApi.bulkDeleteTransactions(transactionIds);
await transactionsApi.bulkRestoreTransactions(transactionIds);
```

#### Reconciliation
```typescript
// Status management
await transactionsApi.getTransactionStatus(transactionId);
await transactionsApi.updateTransactionStatus(transactionId, status, reconciliationStatus);
await transactionsApi.getTransactionStatusHistory(transactionId);

// Category tracking
await transactionsApi.getTransactionCategoryHistory(transactionId);
await transactionsApi.updateTransactionCategory(transactionId, category);
await transactionsApi.revertTransactionCategory(transactionId, steps);
```

#### Attachments
```typescript
// File management
await transactionsApi.uploadTransactionAttachment(transactionId, file, description, isPublic);
await transactionsApi.getTransactionAttachments(transactionId);
await transactionsApi.getAttachmentDownloadUrl(attachmentId);
await transactionsApi.deleteAttachment(attachmentId);

// Permissions
await transactionsApi.makeAttachmentPublic(attachmentId);
await transactionsApi.makeAttachmentPrivate(attachmentId);

// Quota
await transactionsApi.getAttachmentQuotaUsage();
```

#### Duplicates
```typescript
// Detection
await transactionsApi.getDuplicates({ status, accountId, limit, offset });
await transactionsApi.getDuplicateStats();
await transactionsApi.getAccountDuplicates(accountId);

// Resolution
await transactionsApi.resolveDuplicate(duplicateId, keepTransactionId, mergeNotes);
await transactionsApi.ignoreDuplicate(duplicateId, reason);
```

#### Balance History
```typescript
await transactionsApi.getBalanceHistory(accountId, { dateFrom, dateTo, limit });
await transactionsApi.getBalanceTrend(accountId, { days, granularity });
await transactionsApi.importBalanceHistory(accountId, csvFile);
await transactionsApi.exportBalanceHistory(accountId, { dateFrom, dateTo });
```

#### Advanced Search
```typescript
await transactionsApi.advancedSearch(filters, pagination, sort);
await transactionsApi.searchByMerchant(merchant, { limit });
await transactionsApi.searchByCategory(categoryId, { limit });
await transactionsApi.searchBySimilarAmount(amount, tolerance);
await transactionsApi.getMerchantSuggestions(query, limit);
```

---

## UI Components

### Net Worth Components

#### `NetWorthCard`
Displays total net worth with change indicators.

```typescript
<NetWorthCard
  currentNetWorth={250000}
  previousNetWorth={245000}
  currency="USD"
  isLoading={false}
/>
```

**Props:**
- `currentNetWorth: number` - Current total net worth
- `previousNetWorth?: number` - Previous period net worth for comparison
- `currency?: string` - Currency code (default: "USD")
- `isLoading?: boolean` - Loading state
- `className?: string` - Additional CSS classes

---

### Connection Components

#### `ConnectionHealthBadge`
Shows provider connection status with visual indicators.

```typescript
<ConnectionHealthBadge
  status="healthy"
  lastSyncAt="2025-01-09T12:00:00Z"
  isCurrentlySyncing={false}
/>
```

**Props:**
- `status: "healthy" | "warning" | "error" | "syncing"` - Connection status
- `lastSyncAt?: string` - Last sync timestamp
- `isCurrentlySyncing?: boolean` - Currently syncing indicator
- `className?: string` - Additional CSS classes

#### `ConnectionSyncControls`
Provides sync controls and status display for a connection.

```typescript
<ConnectionSyncControls
  connectionId="conn_123"
  provider="PLAID"
  status="ACTIVE"
  lastSyncAt={lastSyncAt}
  isCurrentlySyncing={syncing}
  syncProgress={50}
  onSync={async () => {}}
  onReconnect={async () => {}}
  onDisconnect={async () => {}}
/>
```

**Props:**
- `connectionId: string` - Connection ID
- `provider: string` - Provider name
- `status: "ACTIVE" | "PAUSED" | "DISCONNECTED"` - Connection status
- `lastSyncAt?: string` - Last sync time
- `isCurrentlySyncing?: boolean` - Sync in progress
- `syncProgress?: number` - Sync progress percentage (0-100)
- `onSync: () => Promise<void>` - Sync callback
- `onReconnect?: () => Promise<void>` - Reconnect callback
- `onDisconnect?: () => Promise<void>` - Disconnect callback

---

### Account Components

#### `AccountStatusBadge`
Shows account status (ACTIVE, ARCHIVED, CLOSED).

```typescript
<AccountStatusBadge
  status="ACTIVE"
  variant="full"
/>
```

**Props:**
- `status: "ACTIVE" | "ARCHIVED" | "CLOSED"` - Account status
- `variant?: "compact" | "full"` - Display variant
- `className?: string` - Additional CSS classes

#### `AccountFavoriteToggle`
Toggle button to mark account as favorite.

```typescript
<AccountFavoriteToggle
  accountId="acc_123"
  isFavorite={true}
  onToggle={async (isFavorite) => {}}
  size="md"
/>
```

**Props:**
- `accountId: string` - Account ID
- `isFavorite: boolean` - Is marked as favorite
- `onToggle: (isFavorite: boolean) => Promise<void>` - Toggle callback
- `size?: "sm" | "md" | "lg"` - Button size
- `isLoading?: boolean` - Loading state
- `className?: string` - Additional CSS classes

#### `AccountGroupingPanel`
Manage account groups (create, edit, delete).

```typescript
<AccountGroupingPanel
  groups={groups}
  isLoading={false}
  onCreateGroup={async (name, description) => {}}
  onDeleteGroup={async (groupId) => {}}
  onEditGroup={async (groupId, name, description) => {}}
/>
```

**Props:**
- `groups: AccountGroup[]` - List of groups
- `isLoading?: boolean` - Loading state
- `onCreateGroup: (name, description?) => Promise<void>` - Create callback
- `onDeleteGroup: (groupId) => Promise<void>` - Delete callback
- `onEditGroup?: (groupId, name, description?) => Promise<void>` - Edit callback

#### `AccountLifecycleActions`
Dropdown menu for archive, reopen, close actions.

```typescript
<AccountLifecycleActions
  accountId="acc_123"
  accountStatus="ACTIVE"
  onArchive={async () => {}}
  onReopen={async () => {}}
  onClose={async () => {}}
/>
```

**Props:**
- `accountId: string` - Account ID
- `accountStatus: "ACTIVE" | "ARCHIVED" | "CLOSED"` - Current status
- `onArchive?: () => Promise<void>` - Archive callback
- `onReopen?: () => Promise<void>` - Reopen callback
- `onClose?: () => Promise<void>` - Close callback
- `className?: string` - Additional CSS classes

---

### Transaction Components

#### `TransactionNotesEditor`
Inline editor for transaction notes.

```typescript
<TransactionNotesEditor
  transactionId="txn_123"
  initialNotes="Original notes"
  onSave={async (notes) => {}}
  maxLength={2000}
/>
```

**Props:**
- `transactionId: string` - Transaction ID
- `initialNotes?: string` - Initial notes value
- `onSave: (notes) => Promise<void>` - Save callback
- `maxLength?: number` - Max character length (default: 2000)
- `isLoading?: boolean` - Loading state
- `className?: string` - Additional CSS classes

#### `TransactionTagsManager`
Tag management UI (add, remove, suggest).

```typescript
<TransactionTagsManager
  transactionId="txn_123"
  initialTags={["work", "deductible"]}
  onSave={async (tags) => {}}
  suggestedTags={["work", "personal", "business"]}
  maxTags={10}
/>
```

**Props:**
- `transactionId: string` - Transaction ID
- `initialTags?: string[]` - Initial tags
- `onSave: (tags) => Promise<void>` - Save callback
- `suggestedTags?: string[]` - Suggested tags for dropdown
- `maxTags?: number` - Max tags allowed
- `isLoading?: boolean` - Loading state
- `className?: string` - Additional CSS classes

#### `TransactionAttachments`
Upload and manage transaction attachments (receipts, documents).

```typescript
<TransactionAttachments
  transactionId="txn_123"
  attachments={attachments}
  onUpload={async (file, description) => {}}
  onDelete={async (attachmentId) => {}}
  onTogglePublic={async (attachmentId, isPublic) => {}}
  onDownload={async (attachmentId) => "url"}
  maxSize={10 * 1024 * 1024}
  maxFiles={10}
/>
```

**Props:**
- `transactionId: string` - Transaction ID
- `attachments?: Attachment[]` - Current attachments
- `onUpload: (file, description?) => Promise<void>` - Upload callback
- `onDelete: (attachmentId) => Promise<void>` - Delete callback
- `onTogglePublic: (attachmentId, isPublic) => Promise<void>` - Toggle public callback
- `onDownload: (attachmentId) => Promise<string>` - Download callback (returns URL)
- `maxSize?: number` - Max file size in bytes
- `maxFiles?: number` - Max files allowed
- `isLoading?: boolean` - Loading state
- `className?: string` - Additional CSS classes

---

### Duplicate Detection

#### `DuplicateDetectionBanner`
Banner showing duplicate transactions with resolution options.

```typescript
<DuplicateDetectionBanner
  duplicateGroupId="dup_123"
  merchant="STARBUCKS"
  amount={50.25}
  transactions={[
    { id: "txn_1", date: "2025-01-09", amount: -50.25, merchant: "STARBUCKS" },
    { id: "txn_2", date: "2025-01-09", amount: -50.25, merchant: "STARBUCKS" },
  ]}
  onResolve={async (keepId, mergeNotes) => {}}
  onIgnore={async (reason) => {}}
/>
```

**Props:**
- `duplicateGroupId: string` - Duplicate group ID
- `merchant: string` - Merchant name
- `amount: number` - Transaction amount
- `transactions: DuplicateTransaction[]` - Duplicate transactions
- `onResolve: (keepId, mergeNotes) => Promise<void>` - Resolve callback
- `onIgnore: (reason?) => Promise<void>` - Ignore callback
- `className?: string` - Additional CSS classes

---

### Section Components

#### `AccountsOverviewSection`
Displays net worth cards and connection status overview.

```typescript
<AccountsOverviewSection
  netWorth={{
    totalNetWorth: 250000,
    totalAssets: 350000,
    totalLiabilities: 100000,
    previousNetWorth: 245000,
    currency: "USD",
  }}
  connections={connections}
  isLoadingNetWorth={false}
  isLoadingConnections={false}
/>
```

**Props:**
- `netWorth?: NetWorthSnapshot` - Net worth data
- `connections?: Connection[]` - Connection list
- `isLoadingNetWorth?: boolean` - Loading state for net worth
- `isLoadingConnections?: boolean` - Loading state for connections
- `className?: string` - Additional CSS classes

#### `AccountsEnhancedPage`
Complete accounts page with tabs and all features.

```typescript
<AccountsEnhancedPage initialTab="overview" />
```

**Props:**
- `initialTab?: "overview" | "overview-2" | "manage"` - Initial active tab

---

## Integration Patterns

### 1. Using Query Hooks with Components

```typescript
"use client";

import { useAllAccounts } from "@/lib/queries/use-accounts-data";
import { AccountStatusBadge, AccountFavoriteToggle } from "@/app/dashboard/accounts/components";

export function AccountRow({ account }) {
  const { data: accounts } = useAllAccounts();

  return (
    <div>
      <h3>{account.name}</h3>
      <AccountStatusBadge status={account.status} />
      <AccountFavoriteToggle
        accountId={account.id}
        isFavorite={account.isFavorite}
        onToggle={async (isFavorite) => {
          // Call mutation from hook
        }}
      />
    </div>
  );
}
```

### 2. Building Transaction Management UI

```typescript
"use client";

import { useAccountTransactions } from "@/lib/queries/use-accounts-data";
import {
  TransactionNotesEditor,
  TransactionTagsManager,
  TransactionAttachments,
  DuplicateDetectionBanner,
} from "@/app/dashboard/accounts/components";

export function TransactionRow({ transactionId, accountId }) {
  const { data: transactions } = useAccountTransactions(accountId);
  const transaction = transactions?.find((t) => t.id === transactionId);

  return (
    <div className="space-y-4">
      {/* Show duplicate banner if applicable */}
      {transaction?.isDuplicate && (
        <DuplicateDetectionBanner
          duplicateGroupId={transaction.duplicateGroupId}
          merchant={transaction.merchant}
          amount={transaction.amount}
          transactions={relatedDuplicates}
          onResolve={handleResolve}
          onIgnore={handleIgnore}
        />
      )}

      {/* Notes Editor */}
      <TransactionNotesEditor
        transactionId={transactionId}
        initialNotes={transaction?.notes}
        onSave={updateNotes}
      />

      {/* Tags Manager */}
      <TransactionTagsManager
        transactionId={transactionId}
        initialTags={transaction?.tags}
        onSave={updateTags}
        suggestedTags={userTags}
      />

      {/* Attachments */}
      <TransactionAttachments
        transactionId={transactionId}
        attachments={transaction?.attachments}
        onUpload={uploadAttachment}
        onDelete={deleteAttachment}
        onTogglePublic={toggleAttachmentPublic}
        onDownload={downloadAttachment}
      />
    </div>
  );
}
```

### 3. Account Lifecycle Management

```typescript
"use client";

import { useArchiveAccount, useReopenAccount, useCloseAccount } from "@/lib/queries/use-accounts-data";
import { AccountLifecycleActions } from "@/app/dashboard/accounts/components";

export function AccountCard({ account }) {
  const { mutate: archive } = useArchiveAccount();
  const { mutate: reopen } = useReopenAccount();
  const { mutate: close } = useCloseAccount();

  return (
    <div>
      <h3>{account.name}</h3>
      <AccountLifecycleActions
        accountId={account.id}
        accountStatus={account.status}
        onArchive={() => archive({ accountId: account.id })}
        onReopen={() => reopen({ accountId: account.id })}
        onClose={() => close({ accountId: account.id })}
      />
    </div>
  );
}
```

---

## Query Hook Creation (TBD)

The API services are fully implemented. Query hooks can be created using TanStack Query following the existing pattern in `lib/queries/use-accounts-data.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/lib/services/accounts-api';

export function useArchiveAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId }: { accountId: string }) => {
      return await accountsApi.archiveAccount(accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
```

---

## File Structure

```
app/dashboard/accounts/
├── page.tsx                              # Main accounts page
├── [id]/
│   └── page.tsx                          # Account details page
└── components/
    ├── index.ts                          # Component exports
    ├── net-worth-card.tsx               # Net worth display
    ├── connection-health-badge.tsx      # Connection status
    ├── connection-sync-controls.tsx     # Sync UI
    ├── account-status-badge.tsx         # Account status
    ├── account-favorite-toggle.tsx      # Favorite button
    ├── account-grouping-panel.tsx       # Group management
    ├── account-lifecycle-actions.tsx    # Archive/close actions
    ├── transaction-notes-editor.tsx     # Notes UI
    ├── transaction-tags-manager.tsx     # Tags UI
    ├── transaction-attachments.tsx      # File uploads
    ├── duplicate-detection-banner.tsx   # Duplicate UI
    ├── accounts-overview-section.tsx    # Overview layout
    └── accounts-enhanced-page.tsx       # Complete page component

lib/services/
├── accounts-api.ts                      # Account API methods (COMPLETE)
├── banking-api.ts                       # Banking/connection API (ENHANCED)
└── transactions-api.ts                  # Transaction API (ENHANCED)
```

---

## Next Steps

1. **Create Query Hooks** - Wire TanStack Query hooks using the API services
2. **Implement Real-time Updates** - Add SSE streams for sync progress
3. **Add Charts** - Implement NetWorthTrendChart, AssetBreakdownChart with Recharts
4. **Data Validation** - Add form validation for user inputs
5. **Error Handling** - Add comprehensive error messages and recovery flows
6. **Performance** - Add query prefetching and optimization
7. **Testing** - Add unit and integration tests for components and hooks

---

## API Response Examples

All responses follow this standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

Success (200):
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Error (4xx/5xx):
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_NOT_FOUND",
    "message": "The account does not exist"
  }
}
```

---

## Performance Tips

1. **Caching** - TanStack Query automatically caches queries with configurable `staleTime`
2. **Pagination** - Use limit/offset for large datasets (max 500 items per search)
3. **Bulk Operations** - Max 1000 items per bulk operation request
4. **File Uploads** - Max 10MB per file, 10 attachments per transaction
5. **Query Keys** - Follow the pattern: `['resource', 'action', params]`

---

## Troubleshooting

### Components Not Showing
- Ensure all imports are from the components index
- Check that parent component is marked with `"use client"`
- Verify props are passed correctly

### API Calls Failing
- Check organization ID is passed to API methods
- Verify authentication token is valid
- Check error response in browser console

### State Not Updating
- Ensure mutation includes cache invalidation
- Check query keys match between queries and mutations
- Verify `useQueryClient()` is called in mutation

---

## Support

For questions or issues with this implementation, refer to:
- CLAUDE.md - Architecture guidelines
- ACCOUNTS.md - Backend API documentation
- CONNECTIONS.md - Provider integration docs
- TRANSACTIONS.md - Transaction API docs
