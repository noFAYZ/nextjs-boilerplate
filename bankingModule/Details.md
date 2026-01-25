# Banking Module - Details

**Path**: `src/modules/banking/`

## Overview

Bank account integration and management across multiple financial institutions. Supports real-time account synchronization, duplicate detection, transaction categorization, and balance tracking through three primary providers (Plaid, Teller, MX).

**Status**: ✅ Production Ready
**Maturity**: High (Core features complete)

---

## Features

### 1. Multi-Provider Support
- **Plaid**: Largest network, 14,000+ institutions
- **Teller**: Real-time data, developer-friendly API
- **MX**: Alternative coverage, predictive analytics
- **Fallback Chain**: Automatic provider rotation on failure
- **Account Types**: Checking, savings, money market, credit, investment

### 2. Account Management
- **Account Linking**: OAuth-based secure linking via provider
- **Account Details**: Institution, routing number, account type
- **Balance Tracking**: Current balance with timestamp
- **Account Health**: Sync status, last update, error tracking
- **Bulk Import**: Add multiple accounts from single institution

### 3. Duplicate Detection
- **Algorithmic Detection**: Compares account metadata
- **Criteria Matched**: Institution + routing number + account number (last 4)
- **User Review**: Flagged duplicates sent to user for approval
- **Merge Operation**: Combine transaction histories
- **Data Preservation**: No data loss during merge

### 4. Account Synchronization
- **On-Demand**: Manual sync trigger
- **Background Jobs**: Async processing with progress tracking
- **Historical Data**: Transaction history up to 24 months
- **Real-Time Updates**: Daily automatic sync
- **Retry Logic**: Exponential backoff with circuit breaker

### 5. Financial Account Grouping
- **Custom Groups**: User-created account collections
- **Smart Groups**: Auto-grouped by type/institution
- **Group Analytics**: Aggregate balance, transactions
- **Group Preferences**: Settings per group

### 6. Balance History & Analytics
- **Balance Snapshots**: Daily balance history
- **Trend Analysis**: Balance changes over time
- **Available Balance**: Real-time liquidity tracking
- **Multi-Currency**: Support for foreign accounts

### 7. Provider Connections Management (NEW)
- **Unified Connection View**: Single endpoint returns connections + accounts
- **Multi-Provider Support**: Plaid, Teller, MX, Finicity
- **Account Inclusion**: Accounts nested in connection response
- **Connection Status Tracking**: Health checks, sync status, error monitoring
- **Efficient Queries**: Optimized single query (no N+1 problem)
- **Account Filtering**: Auto-excludes archived/deleted accounts
- **Backward Compatible**: Optional `?includeAccounts=false` parameter for legacy mode

**Performance**:
- Single database query fetches all connections + accounts
- Selective field loading reduces data transfer
- Existing database indexes ensure fast lookups
- Typical response time: <200ms for 5 connections, 15 accounts

---

## How It Works

### Account Link Flow
```
User clicks "Link Bank Account" (UI)
    ↓
User selects provider (Plaid/Teller/MX)
    ↓
Backend generates Link Token for OAuth
    ↓
User completes OAuth flow in provider UI
    ↓
Provider returns public token + account info
    ↓
Backend exchanges public token for access token
    ↓
Store access token in database (encrypted)
    ↓
Queue SYNC_BANKING_ACCOUNT job (HIGH priority)
    ↓
Return linked account to user immediately
    ↓
[Background] Job fetches account details + transactions
    ↓
[Background] Check for duplicate accounts
    ↓
If duplicates found: User gets notification for review
    ↓
User sees account in portfolio
```

### Duplicate Detection Flow
```
Account A linked: Bank A, routing 123456, account ends in 7890
    ↓
Account B linked: Bank A, routing 123456, account ends in 7890
    ↓
Duplicate detection algorithm runs
    ↓
Identifies exact match (same institution + routing + last 4 digits)
    ↓
Send duplicate notification to user
    ↓
User reviews: "These are the same account" or "Different accounts"
    ↓
If confirmed duplicate:
    ├─ Merge transaction histories
    ├─ Keep older account as primary
    ├─ Archive newer account
    └─ Update references to merged account
    ↓
Balance and transaction history consolidated
```

### Sync Flow
```
Background Job Started (SYNC_BANKING_ACCOUNT)
    ↓
Validate access token with provider
    ├─ If expired: Refresh token
    ├─ If invalid: Mark account error
    └─ If valid: Continue
    ↓
Fetch latest account balance from provider
    ├─ Get current balance
    ├─ Get available balance
    └─ Store balance snapshot
    ↓
[Progress Update: 20% - fetching_account_details]
    ↓
Fetch transaction history from provider
    ├─ Get last 90 days (or since last sync)
    ├─ Transform to standard format
    ├─ Store in database
    └─ Update transaction count
    ↓
[Progress Update: 50% - fetching_transactions]
    ↓
Categorize transactions
    ├─ Match against category rules
    ├─ Use ML model for uncategorized
    └─ Store category assignments
    ↓
[Progress Update: 75% - categorizing_transactions]
    ↓
Check for duplicates with other user accounts
    ├─ Compare account metadata
    ├─ Flag potential duplicates
    └─ Send notification if found
    ↓
[Progress Update: 90% - checking_duplicates]
    ↓
Update account sync status
    ├─ Set lastSyncAt = now
    ├─ Clear lastSyncError
    └─ Mark syncing = false
    ↓
[Progress Update: 100% - completed]
    ↓
Emit account:synced event
    ↓
Update user dashboard
```

### Provider Connections Retrieval Flow (NEW)
```
User requests: GET /api/v1/banking/connections
    ↓
Check for includeAccounts query parameter
    ├─ Default: true (include accounts)
    └─ Can be: false (legacy mode, no accounts)
    ↓
If includeAccounts = true:
    │
    ├─ Query ProviderConnection with accounts included
    │   ├─ Select connection fields
    │   └─ Select related FinancialAccount fields
    │
    ├─ Filter to only ACTIVE accounts (exclude ARCHIVED, CLOSED)
    │
    ├─ Map results to ProviderConnectionWithAccounts type
    │   ├─ Each connection includes accounts array
    │   └─ Add accountCount convenience field
    │
    └─ Return single response with all data
    │
Else (includeAccounts = false):
    │
    ├─ Query ProviderConnection without accounts
    │
    ├─ Map results to ProviderConnectionData type
    │
    └─ Return legacy response format
    ↓
Return to client (single API call, optimized query)
```

**Key Benefits**:
- ✅ **Single Query**: All connections + accounts fetched in one database roundtrip
- ✅ **No N+1**: Fixed overhead regardless of connection count
- ✅ **Selective Fields**: Only necessary fields loaded
- ✅ **Auto-Filtering**: Archived/deleted accounts automatically excluded
- ✅ **Backward Compatible**: Legacy mode available via query parameter
- ✅ **Type Safe**: Proper TypeScript types for both modes

### Data Retrieval Flow
```
User requests: GET /banking/accounts
    ↓
Check cache (5 minute TTL)
    ├─ If cached: return immediately
    └─ If expired: continue
    ↓
Query all linked accounts for user
    ├─ Include balance snapshots
    ├─ Include provider info
    ├─ Sort by lastSyncAt DESC
    └─ Filter by account type if specified
    ↓
Return account list with:
    ├─ Account details
    ├─ Current balance
    ├─ Last sync time
    └─ Institution information
    ↓
Cache result for 5 minutes
    ↓
Return to user
```

---

## Architecture Components

### Controllers (2 files)
- `bankingController.ts` - Main account operations (12+ endpoints)
- `accountController.ts` - Account-specific operations

### Services (13+ files)
- `providerConnectionService.ts` - Provider connection lifecycle and account querying (NEW)
- `bankingService.ts` - Core business logic for account management
- `plaidService.ts` - Plaid SDK integration (link tokens, exchanges)
- `tellerService.ts` - Teller API integration
- `mxService.ts` - MX API integration
- `bankingAccountSyncService.ts` - Account synchronization logic
- `duplicateDetectionService.ts` - Duplicate account detection algorithm
- `accountMergeService.ts` - Account merge operations
- `balanceHistoryService.ts` - Balance snapshot and trend tracking
- `bankingTransactionService.ts` - Transaction retrieval and caching
- `accountGroupService.ts` - Account grouping and preferences
- `bankingAuthService.ts` - Access token management and encryption
- `institutionService.ts` - Institution metadata and routing numbers

### Background Jobs
- `bankingJobs.ts` - Job definitions and worker initialization
- `sync/accountSyncProcessor.ts` - Account synchronization processor
- `duplicates/duplicateDetectionProcessor.ts` - Duplicate detection processor
- `balance/balanceSnapshotProcessor.ts` - Balance history tracking

### External Integrations
- **Plaid SDK**: Account linking, balance fetching, transaction history
- **Teller API**: Real-time balance updates, transaction streaming
- **MX Platform**: Account aggregation, data enrichment

---

## Key Methods

### ProviderConnectionService (NEW)
```
getUserConnections(userId)
  → Get all connections without accounts (legacy)

getUserConnectionsWithAccounts(userId)
  → Get all connections WITH nested accounts (single query, optimized)
  → Only returns ACTIVE accounts, excludes archived/closed
  → Maps Decimal types to numbers for JSON

getConnection(connectionId)
  → Get single connection by ID

createConnection(input)
  → Create new provider connection
  → Prevents duplicate item connections

updateConnectionStatus(connectionId, status)
  → Update connection status (ACTIVE/DISCONNECTED/EXPIRED)

recordSync(connectionId, syncStatus, data)
  → Record sync operation results with metrics

disconnectConnection(connectionId)
  → Soft disconnect (keeps data for reconnection)

reconnectConnection(connectionId)
  → Reactivate disconnected connection

deleteConnection(connectionId)
  → Hard delete connection and all accounts

checkConnectionHealth(connectionId)
  → Validate connection still works
```

### BankingService
```
linkAccount(userId, provider, publicToken)
  → Exchange token, validate account, queue sync

unlinkAccount(userId, accountId)
  → Delete account, revoke access token, cleanup data

getAccountDetails(userId, accountId)
  → Get account info with current balance

listUserAccounts(userId, filters)
  → Get all linked accounts with pagination

syncAccount(userId, accountId, priority)
  → Queue manual sync with specified priority

getAccountBalance(userId, accountId)
  → Get current balance with timestamp

getBalanceHistory(userId, accountId, days)
  → Get balance snapshots for chart

getAccountTransactions(userId, accountId, filters)
  → Get transactions with pagination and filters

mergeAccounts(userId, primaryAccountId, duplicateAccountId)
  → Merge transaction histories, archive duplicate

getProviderStatus()
  → Check Plaid, Teller, MX health status
```

---

## Database Models

### FinancialAccount
- `id`, `userId`, `provider` (plaid/teller/mx)
- `accessToken` (encrypted), `refreshToken` (encrypted)
- `institutionId`, `institutionName`, `routingNumber`
- `accountType` (checking/savings/credit/investment)
- `accountNumber` (last 4 digits visible)
- `accountName`, `ownerName`
- `currentBalance`, `availableBalance`
- `currency`, `status` (linked/syncing/error)
- `lastSyncAt`, `lastSyncError`, `syncing`
- `createdAt`, `updatedAt`

### AccountBalanceSnapshot
- `id`, `accountId`, `balance`
- `availableBalance`, `timestamp`
- `createdAt`

### ProviderConnection
- `id`, `userId`, `provider` (plaid/teller/mx)
- `status` (active/expired/revoked)
- `connectedAt`, `expiredAt`

### BankingSyncLog
- `id`, `accountId`, `syncStatus` (pending/in_progress/completed/failed)
- `transactionCount`, `newTransactions`
- `startedAt`, `completedAt`, `errorMessage`

### AccountReconciliation
- `id`, `accountId`, `reconciliationDate`
- `expectedBalance`, `actualBalance`, `discrepancy`
- `reconciliationStatus` (pending/verified/disputed)

---

## Performance Optimizations

### Caching
- Account list: 5 minute TTL (Redis + Memory)
- Balance data: 1 minute TTL (real-time updates)
- Institution metadata: 24 hour TTL
- Provider status: 5 minute TTL

### Database Indexing
- `financial_accounts(userId, provider)`
- `financial_accounts(userId, lastSyncAt DESC)`
- `balance_snapshots(accountId, timestamp DESC)`
- `banking_sync_logs(accountId, createdAt DESC)`

### Pagination
- Accounts: default 20 per page
- Transactions: limit 100, cursor-based
- Balance history: limit 365 days (yearly)

---

## Error Handling

| Error | Code | Status | Reason |
|-------|------|--------|--------|
| Provider error | PROVIDER_ERROR | 502 | Link/Plaid/Teller/MX error |
| Invalid token | INVALID_TOKEN | 400 | OAuth token invalid |
| Account not found | ACCOUNT_NOT_FOUND | 404 | Account ID invalid |
| Sync failed | SYNC_FAILED | 503 | External provider error |
| Access denied | ACCESS_DENIED | 403 | User not authorized |
| Token expired | TOKEN_EXPIRED | 401 | Refresh token needed |
| Duplicate detected | DUPLICATE_DETECTED | 409 | Account already linked |
| Account limit | ACCOUNT_LIMIT | 403 | Plan limit exceeded |

---

## Common Use Cases

### UC1: Link Multiple Bank Accounts
```
User has checking at Bank A and savings at Bank B
    ↓
Clicks "Link Bank" twice
    ↓
Each account linked through Plaid OAuth
    ↓
Both accounts appear in dashboard
    ↓
See combined balance across all accounts
```

### UC2: Handle Duplicate Detection
```
User accidentally links same account twice
    ↓
System detects duplicate (same routing + account number)
    ↓
User gets notification: "We found a duplicate account"
    ↓
User confirms: "Yes, merge these"
    ↓
Accounts merged, transactions consolidated
    ↓
Older duplicate archived
```

### UC3: Monitor Account Balance Trends
```
User wants to see savings growth over time
    ↓
Sync captures daily balance snapshots
    ↓
30-day chart shows upward trend
    ↓
User views balance history for budgeting
```

---

## Limits by Plan

| Feature | FREE | PRO | ULTIMATE |
|---------|------|-----|----------|
| Accounts | 1 | 5 | Unlimited |
| Sync frequency | 1/day | 4/day | Unlimited |
| Transaction history | 90 days | 90 days | 24 months |
| Providers | Plaid only | 2 providers | 3 providers |
| Duplicate detection | ❌ | ✅ | ✅ |
| Balance history | 30 days | 90 days | 24 months |

---

## Future Enhancements

- **Predictive Categorization**: ML model for transaction categorization
- **Anomaly Detection**: Flag unusual account activity
- **Transaction Reconciliation**: Auto-match transferred funds between accounts
- **Account Statements**: PDF export and archival
- **Multi-Account Rules**: Automation rules across accounts
- **Income Estimation**: Calculate recurring income
- **Spending Patterns**: Behavioral spending analytics
- **Bill Pay Integration**: Automated bill tracking and payment
- **Account Linking Verification**: Micro-deposit verification method
- **Enhanced Fraud Detection**: Real-time anomaly scoring
