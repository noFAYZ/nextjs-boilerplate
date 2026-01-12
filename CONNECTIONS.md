# Connections Module API Documentation

## Overview

The Connections Module manages provider integrations (Plaid, Teller, MX) for account linking, real-time data synchronization, and transaction management. It handles OAuth flows, webhook processing, and data enrichment.

**Module Path:** `src/modules/banking/`

---

## Responsibility Boundaries

**Connections Module Owns:**
- Provider connections (Plaid, Teller, MX)
- OAuth token management (encrypted)
- Account fetching from providers
- Transaction syncing from providers
- Transaction categorization and enrichment
- Real-time updates (webhooks, SSE)
- Merchant data management
- Duplicate detection and resolution
- Bank reconciliation workflows
- Provider health monitoring
- Balance snapshot tracking

**Connections Module Provides to Accounts (Read-Only):**
- Current account balance (latest snapshot)
- Last sync timestamp and status
- Transaction aggregates

---

## Provider Support Matrix

| Provider | Status | Networks | Account Types | Features |
|----------|--------|----------|---------------|----------|
| **Plaid** | ✅ Active | US, Canada, UK | 50+ | OAuth, Webhooks, Transactions |
| **Teller** | ✅ Active | 130+ institutions | 30+ | OAuth, Webhooks, Real-time |
| **MX** (Finicity) | ✅ Integrated | 15,000+ | 40+ | OAuth, Webhooks, ACH |
| **Manual** | ✅ Available | N/A | All | Manual entry for non-connected |

---

## API Endpoints

### 1. Plaid Link Token Generation

#### Generate Link Token
```
POST /api/v1/banking/plaid/link-token

Request:
{
  "language": "en",
  "countryCode": "US"
}

Response (200):
{
  "success": true,
  "data": {
    "linkToken": "link-sandbox-abc123xyz",
    "expiresAt": "2025-01-10T12:00:00Z"
  }
}

Notes:
- Link token valid for 1 hour
- Use with Plaid Link (client-side)
- Client exchanges public token for access token
```

---

### 2. Token Exchange & Account Creation

#### Exchange Plaid Public Token
```
POST /api/v1/banking/plaid/exchange-token

Request:
{
  "publicToken": "public-sandbox-abc123"
}

Response (201):
{
  "success": true,
  "data": {
    "connectionId": "conn_123456",
    "provider": "PLAID",
    "status": "ACTIVE",
    "institutionName": "Chase Bank",
    "institutionLogo": "https://cdn.plaid.com/...",
    "institutionUrl": "https://chase.com",
    "accountsCreated": 3,
    "accounts": [
      {
        "id": "acc_123",
        "name": "Checking Account",
        "type": "CHECKING",
        "mask": "0000",
        "currentBalance": 5000.50,
        "currency": "USD"
      }
    ],
    "createdAt": "2025-01-09T12:00:00Z"
  }
}

Process:
1. Exchanges public token for access token
2. Fetches accounts from Plaid
3. Creates FinancialAccount records
4. Queues initial sync job
5. Registers webhooks
```

---

### 3. Provider Connection Management

#### Get All Connections
```
GET /api/v1/banking/connections?provider=PLAID&status=ACTIVE&limit=20

Query Parameters:
- provider: PLAID | TELLER | MX (optional)
- status: ACTIVE | PAUSED | DISCONNECTED (optional)
- limit: number (default: 20)
- offset: number (default: 0)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "conn_123456",
      "userId": "user_123",
      "provider": "PLAID",
      "status": "ACTIVE",
      "institutionName": "Chase Bank",
      "institutionLogo": "https://cdn.plaid.com/...",
      "institutionUrl": "https://chase.com",
      "plaidItemId": "item_abc123",
      "lastSyncAt": "2025-01-09T11:00:00Z",
      "lastSyncStatus": "SUCCESS",
      "autoSync": true,
      "syncFrequency": "HOURLY",
      "accountsCount": 3,
      "errorCount": 0,
      "lastError": null,
      "createdAt": "2025-01-08T14:30:00Z",
      "updatedAt": "2025-01-09T11:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### Get Single Connection
```
GET /api/v1/banking/connections/:connectionId

Response (200):
{
  "success": true,
  "data": {
    "id": "conn_123456",
    "userId": "user_123",
    "provider": "PLAID",
    "status": "ACTIVE",
    "institutionName": "Chase Bank",
    "institutionLogo": "https://cdn.plaid.com/...",
    "plaidItemId": "item_abc123",
    "lastSyncAt": "2025-01-09T11:00:00Z",
    "lastSyncStatus": "SUCCESS",
    "autoSync": true,
    "syncFrequency": "HOURLY",
    "accountsCount": 3,
    "errorCount": 0,
    "lastError": null,
    "linkedAccounts": [
      {
        "id": "acc_123",
        "name": "Checking Account",
        "type": "CHECKING",
        "status": "ACTIVE",
        "currentBalance": 5000.50,
        "lastSyncAt": "2025-01-09T11:00:00Z"
      }
    ],
    "createdAt": "2025-01-08T14:30:00Z",
    "updatedAt": "2025-01-09T11:00:00Z"
  }
}
```

---

#### Check Connection Health
```
GET /api/v1/banking/connections/:connectionId/health

Response (200):
{
  "success": true,
  "data": {
    "connectionId": "conn_123456",
    "isHealthy": true,
    "status": "ACTIVE",
    "lastSyncAt": "2025-01-09T11:00:00Z",
    "lastSyncStatus": "SUCCESS",
    "lastError": null,
    "requiresUpdate": false,
    "accountsCount": 3,
    "lastTransactionDate": "2025-01-09T09:30:00Z",
    "diagnostics": {
      "tokenExpired": false,
      "webhookHealthy": true,
      "syncErrorRate": 0,
      "lastHealthCheck": "2025-01-09T12:00:00Z"
    }
  }
}

Health Indicators:
- isHealthy: Overall connection status
- requiresUpdate: Token expired or re-auth needed
- tokenExpired: OAuth token needs refresh
- webhookHealthy: Webhook connectivity
- syncErrorRate: Recent sync failure percentage
```

---

#### Get Sync Status
```
GET /api/v1/banking/connections/:connectionId/sync-status

Response (200):
{
  "success": true,
  "data": {
    "connectionId": "conn_123456",
    "isCurrentlySyncing": false,
    "lastSyncAt": "2025-01-09T11:00:00Z",
    "lastSyncStatus": "SUCCESS",
    "lastSyncDuration": 2500,
    "lastError": null,
    "nextScheduledSync": "2025-01-09T12:00:00Z",
    "syncHistory": [
      {
        "syncId": "sync_123",
        "startedAt": "2025-01-09T11:00:00Z",
        "completedAt": "2025-01-09T11:02:30Z",
        "status": "SUCCESS",
        "accountsFetched": 3,
        "transactionsFetched": 45,
        "newTransactions": 5,
        "updatedTransactions": 2,
        "duration": 2500
      }
    ]
  }
}
```

---

### 4. Connection Operations

#### Disconnect Connection
```
POST /api/v1/banking/connections/:connectionId/disconnect

Response (200):
{
  "success": true,
  "message": "Connection disconnected successfully",
  "data": {
    "id": "conn_123456",
    "status": "DISCONNECTED",
    "disconnectedAt": "2025-01-09T12:00:00Z"
  }
}

Effects:
- Sets status to DISCONNECTED
- Stops auto-sync
- Invalidates Plaid item
- Linked accounts marked inactive
- Historical data preserved
- Can be reconnected
```

---

#### Reconnect Connection
```
POST /api/v1/banking/connections/:connectionId/reconnect

Response (200):
{
  "success": true,
  "message": "Connection reconnected successfully",
  "data": {
    "id": "conn_123456",
    "status": "ACTIVE",
    "reconnectedAt": "2025-01-09T12:00:00Z",
    "syncJobQueued": true
  }
}

Process:
- Reactivates without re-linking
- Triggers full re-sync immediately
- Refreshes OAuth token
- Marks accounts as active
```

---

#### Delete Connection (Permanent)
```
DELETE /api/v1/banking/connections/:connectionId

Response (200):
{
  "success": true,
  "message": "Connection deleted permanently",
  "data": {
    "id": "conn_123456",
    "deletedAt": "2025-01-09T12:00:00Z",
    "accountsDeleted": 3,
    "transactionsDeleted": 145
  }
}

Cascade Effects:
- Deletes connected accounts
- Deletes associated transactions
- Deletes sync states
- Removes webhooks
- PERMANENT - cannot be recovered
```

---

### 5. Synchronization

#### Trigger Single Connection Sync
```
POST /api/v1/banking/connections/:connectionId/sync

Request:
{
  "syncType": "full"
}

Response (202):
{
  "success": true,
  "message": "Sync job queued",
  "data": {
    "syncJobId": "job_123456",
    "connectionId": "conn_123456",
    "syncType": "full",
    "status": "QUEUED",
    "estimatedDuration": 5000,
    "statusCheckUrl": "/api/v1/banking/connections/:connectionId/sync-status"
  }
}

Sync Types:
- accounts: Fetch account details only (fast)
- transactions: Fetch transactions only (medium)
- full: Accounts + transactions + balances (comprehensive)
```

---

#### Batch Sync Multiple Connections
```
POST /api/v1/banking/sync/batch

Request:
{
  "connectionIds": ["conn_123", "conn_456"],
  "syncType": "full"
}

Response (202):
{
  "success": true,
  "message": "Batch sync initiated",
  "data": {
    "batchId": "batch_123456",
    "totalConnections": 2,
    "queuedConnections": 2,
    "failedConnections": 0,
    "syncType": "full",
    "status": "INITIATED",
    "estimatedDuration": 15000,
    "statusCheckUrl": "/api/v1/banking/sync/batch/batch_123456"
  }
}

Features:
- Parallel syncing
- Incremental data only
- Automatic retry with backoff
- Circuit breaker for failures
```

---

### 6. Transactions

#### Get Transactions
```
GET /api/v1/banking/transactions?accountId=acc_123&limit=50&offset=0

Query Parameters:
- accountId: string (optional)
- connectionId: string (optional)
- dateFrom: string (YYYY-MM-DD)
- dateTo: string (YYYY-MM-DD)
- limit: number (default: 50)
- offset: number (default: 0)
- category: string (optional)
- merchant: string (optional)
- search: string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "accountId": "acc_123",
      "date": "2025-01-09",
      "amount": -50.25,
      "merchant": "STARBUCKS",
      "merchantNormalized": "Starbucks",
      "category": "FOOD_DINING",
      "description": "STARBUCKS #1234 NYC",
      "status": "POSTED",
      "tags": ["coffee"],
      "notes": "Morning coffee",
      "isPending": false,
      "createdAt": "2025-01-09T09:30:00Z"
    }
  ],
  "pagination": {
    "total": 1245,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### Get Transaction Details
```
GET /api/v1/banking/transactions/:transactionId

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123",
    "accountId": "acc_123",
    "connectionId": "conn_123",
    "providerTransactionId": "plaid_txn_abc123",
    "date": "2025-01-09",
    "authorizedDate": "2025-01-09",
    "amount": -50.25,
    "isoCurrencyCode": "USD",
    "merchant": "STARBUCKS",
    "merchantNormalized": "Starbucks",
    "merchantLogo": "https://...",
    "merchantWebsite": "https://starbucks.com",
    "category": "FOOD_DINING",
    "categoryConfidence": 0.95,
    "description": "STARBUCKS #1234 NYC",
    "status": "POSTED",
    "isPending": false,
    "paymentChannel": "in_store",
    "tags": ["coffee"],
    "notes": "Morning coffee",
    "city": "New York",
    "region": "NY",
    "country": "US",
    "createdAt": "2025-01-09T09:30:00Z"
  }
}
```

---

#### Categorize Transaction
```
POST /api/v1/banking/transactions/:transactionId/categorize

Request:
{
  "category": "FOOD_DINING",
  "tags": ["coffee", "work"],
  "notes": "Team meeting coffee run"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123",
    "category": "FOOD_DINING",
    "tags": ["coffee", "work"],
    "notes": "Team meeting coffee run",
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

---

#### Search Transactions
```
GET /api/v1/banking/transactions/search?q=starbucks&minAmount=10&maxAmount=20&limit=20

Query Parameters:
- q: string (search query)
- minAmount: number (optional)
- maxAmount: number (optional)
- category: string (optional)
- merchant: string (optional)
- dateFrom: string (optional)
- dateTo: string (optional)
- limit: number (default: 50)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "merchant": "STARBUCKS",
      "amount": -15.50,
      "date": "2025-01-09",
      "category": "FOOD_DINING"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 7. Balance History

#### Get Balance History
```
GET /api/v1/banking/accounts/:accountId/balance-history?dateFrom=2025-01-01&dateTo=2025-01-09&limit=100

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "snapshot_1",
      "accountId": "acc_123456",
      "date": "2025-01-09",
      "currentBalance": 5000.50,
      "availableBalance": 5000.50,
      "limitBalance": 10000.00,
      "currency": "USD",
      "source": "PLAID",
      "createdAt": "2025-01-09T12:00:00Z"
    }
  ],
  "metadata": {
    "total": 45,
    "limit": 100,
    "offset": 0,
    "dateRange": {
      "from": "2024-12-10",
      "to": "2025-01-09"
    }
  }
}
```

---

#### Get Balance Trend
```
GET /api/v1/banking/accounts/:accountId/balance-trend?days=30&granularity=DAILY

Response (200):
{
  "success": true,
  "data": {
    "accountId": "acc_123456",
    "period": "30 days",
    "startDate": "2024-12-10",
    "endDate": "2025-01-09",
    "trend": [
      {
        "date": "2024-12-10",
        "balance": 4500.00,
        "change": 0,
        "changePercent": 0
      },
      {
        "date": "2025-01-09",
        "balance": 5000.50,
        "change": 500.50,
        "changePercent": 11.12
      }
    ],
    "summary": {
      "startBalance": 4500.00,
      "endBalance": 5000.50,
      "totalChange": 500.50,
      "totalChangePercent": 11.12,
      "highBalance": 5000.50,
      "lowBalance": 4500.00,
      "averageBalance": 4750.25,
      "volatility": 0.03
    }
  }
}
```

---

#### Import Balance History (CSV)
```
POST /api/v1/banking/accounts/:accountId/balance-history/import

Form Data:
- file: CSV file

CSV Format:
Date,Balance,AvailableBalance,LimitBalance
2025-01-01,5000.00,5000.00,10000.00
2025-01-02,5100.50,5100.50,10000.00

Response (200 or 207):
{
  "success": true,
  "statusCode": 200,
  "message": "All records imported successfully",
  "data": {
    "accountId": "acc_123456",
    "totalRecords": 10,
    "importedRecords": 10,
    "skippedRecords": 0,
    "duplicateRecords": 0,
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-10"
    },
    "importedAt": "2025-01-09T12:00:00Z"
  }
}
```

---

#### Export Balance History (CSV)
```
GET /api/v1/banking/accounts/:accountId/balance-history/export?dateFrom=2025-01-01&dateTo=2025-01-09

Response (200):
Content-Type: text/csv
Content-Disposition: attachment; filename="account_balance_history.csv"

Date,Balance,AvailableBalance,LimitBalance
2025-01-01,5000.00,5000.00,10000.00
2025-01-02,5100.50,5100.50,10000.00
...
```

---

## Data Types

### ProviderConnectionData
```typescript
{
  id: string
  userId: string
  organizationId?: string
  provider: 'PLAID' | 'TELLER' | 'MX'
  status: 'ACTIVE' | 'PAUSED' | 'DISCONNECTED'
  plaidItemId?: string
  plaidInstitutionId?: string
  institutionName: string
  institutionLogo?: string
  institutionUrl?: string
  lastSyncAt?: DateTime
  lastSyncStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  autoSync: boolean
  syncFrequency: string
  lastError?: string
  errorCount: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

### TransactionData
```typescript
{
  id: string
  accountId: string
  connectionId: string
  providerTransactionId: string
  date: DateTime
  authorizedDate?: DateTime
  amount: number
  isoCurrencyCode: string
  description: string
  merchant: string
  merchantNormalized?: string
  merchantLogo?: string
  category: string
  categoryConfidence?: number
  tags: string[]
  notes?: string
  status: 'POSTED' | 'PENDING'
  isPending: boolean
  paymentChannel?: string
  city?: string
  region?: string
  country?: string
  createdAt: DateTime
}
```

### SyncOperationResult
```typescript
{
  connectionId: string
  syncType: string
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  accountsFetched: number
  transactionsFetched: number
  newTransactions: number
  updatedTransactions: number
  errors: string[]
  startedAt: DateTime
  completedAt: DateTime
  duration: number  // milliseconds
}
```

---

## Features

### Provider Integration
- Plaid, Teller, MX support
- OAuth 2.0 token management
- Encrypted token storage
- Automatic token refresh

### Real-Time Synchronization
- Webhook processing from Plaid/Teller
- Real-time balance updates
- Transaction notifications
- Provider health monitoring

### Data Quality
- Duplicate transaction detection
- Merchant normalization
- Transaction deduplication
- Balance reconciliation

### Performance
- Batch sync operations
- Incremental sync support
- Parallel processing
- Circuit breaker pattern
- Automatic retry with backoff

### Multi-Provider Support
- Seamless provider abstraction
- Provider-specific features
- Fallback mechanisms

---

## Real-Time Updates (Server-Sent Events)

### Stream Sync Progress
```
GET /api/v1/banking/sync/stream

Upgrade: text/event-stream
Authorization: Bearer {token}

Response (200):
Server-Sent Events stream:

event: connection_established
data: {"type":"connection_established","connectionId":"conn_123","timestamp":"2025-01-09T12:00:00Z"}

event: sync_started
data: {"type":"sync_started","connectionId":"conn_123","syncType":"full","timestamp":"2025-01-09T12:00:01Z"}

event: progress_update
data: {"type":"progress_update","progress":25,"status":"fetching_accounts","connectionId":"conn_123","timestamp":"2025-01-09T12:00:05Z"}

event: accounts_synced
data: {"type":"accounts_synced","accountCount":5,"progress":50,"timestamp":"2025-01-09T12:00:10Z"}

event: transactions_synced
data: {"type":"transactions_synced","transactionCount":152,"progress":75,"timestamp":"2025-01-09T12:00:20Z"}

event: sync_completed
data: {"type":"sync_completed","status":"success","progress":100,"duration":25000,"timestamp":"2025-01-09T12:00:25Z"}

event: heartbeat
data: {"type":"heartbeat","timestamp":"2025-01-09T12:00:35Z"}
```

**Features:**
- Real-time sync progress updates
- Event batching and deduplication
- 30-second heartbeat for connection health
- Automatic backpressure handling
- Connection cleanup on disconnect

**Event Types:**
- `connection_established` - SSE connection active
- `sync_started` - Sync operation beginning
- `progress_update` - General progress update
- `accounts_synced` - Accounts fetched from provider
- `transactions_synced` - Transactions synced
- `sync_completed` - Sync finished (success/error)
- `heartbeat` - Keep-alive signal (30s interval)

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_INPUT | 400 | Missing/invalid parameters |
| INVALID_TOKEN | 400 | Token validation failed |
| CONNECTION_NOT_FOUND | 404 | Connection doesn't exist |
| ACCOUNT_NOT_FOUND | 404 | Account doesn't exist |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Insufficient permissions |
| PROVIDER_ERROR | 503 | External provider error |
| TOKEN_EXPIRED | 401 | OAuth token expired |
| SYNC_IN_PROGRESS | 409 | Sync already running |
| DATABASE_ERROR | 500 | Database operation failed |

---

## Authentication

All endpoints require:
- **JWT Bearer Token** in `Authorization` header
- **Organization ID** from Better Auth session
- **User ID** from JWT payload

---

## See Also

- [ACCOUNTS.md](./ACCOUNTS.md) - Account management API (exchange rates, grouping, favorites)
- [TRANSACTIONS.md](./TRANSACTIONS.md) - Transaction management & attachments
- [MISSING.md](./MISSING.md) - Feature gaps and interoperability
