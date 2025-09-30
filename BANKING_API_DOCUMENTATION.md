# Banking API Documentation for Frontend

## Overview

This document provides comprehensive API documentation for the banking integration using Teller.io. The banking module allows users to securely connect their bank accounts, sync transactions, and manage their financial data alongside their crypto portfolios.

**Important:** Banking sync progress uses the existing unified SSE stream at `/api/v1/crypto/user/sync/stream` with banking-specific event types ending in "_bank" (e.g., `syncing_bank`, `completed_bank`).

## Base URL

All banking API endpoints are prefixed with:
```
/api/v1/banking
```

## Authentication

All banking endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  pagination?: Pagination;
  timestamp: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

## Data Types

### Bank Account
```typescript
interface BankAccount {
  id: string;
  userId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'LOAN' | 'MORTGAGE';
  institutionName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  isActive: boolean;
  tellerEnrollmentId: string;
  tellerAccountId: string;
  tellerInstitutionId: string;
  lastTellerSync: string; // ISO date string
  syncStatus: 'connected' | 'syncing' | 'error' | 'disconnected';
  groupId?: string;
  createdAt: string;
  updatedAt: string;
  tellerEnrollment: TellerEnrollment;
  _count: {
    bankTransactions: number;
  };
}
```

### Bank Transaction
```typescript
interface BankTransaction {
  id: string;
  userId: string;
  accountId: string;
  tellerTransactionId: string;
  amount: number;
  description: string;
  date: string; // ISO date string
  category?: string;
  status: 'pending' | 'posted';
  type: 'debit' | 'credit';
  merchantName?: string;
  tellerRawData?: any;
  createdAt: string;
  updatedAt: string;
  account: {
    name: string;
    institutionName: string;
  };
}
```

### Teller Enrollment
```typescript
interface TellerEnrollment {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  enrollmentId: string;
  status: 'active' | 'expired' | 'error';
  expiresAt?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Banking Overview
```typescript
interface BankingOverview {
  totalAccounts: number;
  totalBalance: number;
  accountsByType: Record<string, number>;
  recentTransactions: BankTransaction[];
  lastSyncAt: string | null;
}
```

### Sync Job
```typescript
interface SyncJob {
  id: string;
  userId: string;
  accountId?: string;
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  errorMessage?: string;
  syncType: 'full' | 'incremental' | 'transactions_only';
  startedAt?: string;
  completedAt?: string;
  syncedData?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

**Summary of Available Endpoints:**
- **POST** `/connect` - Connect new bank accounts via Teller
- **DELETE** `/enrollments/:enrollmentId` - Delete enrollment and all associated data
- **GET** `/accounts` - List all connected accounts
- **GET/PUT/DELETE** `/accounts/:accountId` - Manage individual accounts
- **GET** `/transactions` - Query transactions across accounts
- **POST** `/accounts/:accountId/sync` - Sync individual accounts
- **POST** `/sync-all` - Sync all accounts
- **GET** `/overview` - Banking dashboard data
- **GET** `/health` - Service health status

### 1. Connect Bank Account

**POST** `/api/v1/banking/connect`

Connect a bank account using Teller Connect token.

#### Request Body
```typescript
{
  enrollment: {
    accessToken: string; // From Teller Connect
    enrollment: {
      id: string;
      institution: {
        id: string;
        name: string;
      };
    };
  };
}
```

#### Response
```typescript
{
  success: true,
  data: BankAccount[],
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch('/api/v1/banking/connect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    enrollment: {
      accessToken: 'teller_connect_token',
      enrollment: {
        id: 'enr_12345',
        institution: {
          id: 'chase',
          name: 'Chase Bank'
        }
      }
    }
  })
});
```

#### Error Codes
- `PLAN_LIMIT_EXCEEDED` (403): User has reached their plan's bank account limit
- `TELLER_UNAUTHORIZED` (401): Invalid Teller token or bank authorization expired
- `TELLER_RATE_LIMITED` (429): Rate limit exceeded for Teller API
- `SERVICE_UNAVAILABLE` (503): Banking service temporarily unavailable (circuit breaker open)
- `INTERNAL_ERROR` (500): Server error

---

### 2. Get Bank Accounts

**GET** `/api/v1/banking/accounts`

Get all connected bank accounts for the authenticated user.

#### Response
```typescript
{
  success: true,
  data: BankAccount[],
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch('/api/v1/banking/accounts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 3. Get Specific Bank Account

**GET** `/api/v1/banking/accounts/:accountId`

Get details for a specific bank account.

#### Parameters
- `accountId` (string): The bank account ID

#### Response
```typescript
{
  success: true,
  data: BankAccount & {
    bankTransactions: BankTransaction[]; // Last 50 transactions
  },
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/accounts/${accountId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 4. Update Bank Account

**PUT** `/api/v1/banking/accounts/:accountId`

Update bank account information.

#### Parameters
- `accountId` (string): The bank account ID

#### Request Body
```typescript
{
  name?: string;
  isActive?: boolean;
  groupId?: string | null;
}
```

#### Response
```typescript
{
  success: true,
  data: BankAccount,
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/accounts/${accountId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Updated Account Name',
    groupId: 'group_123'
  })
});
```

---

### 5. Disconnect Bank Account

**DELETE** `/api/v1/banking/accounts/:accountId`

Disconnect a bank account.

#### Parameters
- `accountId` (string): The bank account ID

#### Response
```typescript
{
  success: true,
  data: {
    success: true
  },
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/accounts/${accountId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 6. Delete Bank Enrollment

**DELETE** `/api/v1/banking/enrollments/:enrollmentId`

Delete a Teller enrollment and all associated bank accounts and transactions. This is a destructive operation that permanently removes all banking data connected to the enrollment.

#### Parameters
- `enrollmentId` (string): The enrollment ID to delete

#### Response
```typescript
{
  success: true,
  data: {
    success: true,
    enrollmentId: string;
    tellerEnrollmentId: string;
    institutionName: string;
    deletedAccounts: number;
    deletedTransactions: number;
    accountDetails: Array<{
      accountId: string;
      accountName: string;
      transactionsDeleted: number;
    }>;
    deletedAt: string; // ISO timestamp
  },
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/enrollments/${enrollmentId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
if (result.success) {
  console.log(`Deleted enrollment for ${result.data.institutionName}`);
  console.log(`Removed ${result.data.deletedAccounts} accounts and ${result.data.deletedTransactions} transactions`);
}
```

#### Error Codes
- `UNAUTHORIZED` (401): Missing or invalid authentication token
- `ENROLLMENT_NOT_FOUND` (404): Enrollment not found or doesn't belong to user
- `INTERNAL_ERROR` (500): Server error during deletion

#### Important Notes
- **This is a destructive operation** - all data associated with the enrollment will be permanently deleted
- Deletes all financial accounts connected to the enrollment
- Deletes all bank transactions associated with those accounts
- Cannot be undone - users would need to reconnect their bank account through Teller Connect
- The operation is performed in a database transaction to ensure consistency

---

### 7. Get All Transactions

**GET** `/api/v1/banking/transactions`

Get transactions across all bank accounts with filtering and pagination.

#### Query Parameters
- `page` (number, default: 1): Page number
- `limit` (number, default: 50, max: 100): Items per page
- `accountId` (string, optional): Filter by specific account
- `startDate` (string, optional): Filter from date (ISO format)
- `endDate` (string, optional): Filter to date (ISO format)
- `category` (string, optional): Filter by category
- `type` ('debit' | 'credit', optional): Filter by transaction type

#### Response
```typescript
{
  success: true,
  data: BankTransaction[],
  pagination: Pagination,
  timestamp: string
}
```

#### Example
```javascript
const params = new URLSearchParams({
  page: '1',
  limit: '25',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  type: 'debit'
});

const response = await fetch(`/api/v1/banking/transactions?${params}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 7. Get Account Transactions

**GET** `/api/v1/banking/accounts/:accountId/transactions`

Get transactions for a specific bank account.

#### Parameters
- `accountId` (string): The bank account ID

#### Query Parameters
Same as "Get All Transactions" endpoint, except `accountId` is not needed.

#### Response
```typescript
{
  success: true,
  data: BankTransaction[],
  pagination: Pagination,
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/accounts/${accountId}/transactions`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 8. Sync Account

**POST** `/api/v1/banking/accounts/:accountId/sync`

Trigger synchronization for a specific bank account.

#### Parameters
- `accountId` (string): The bank account ID

#### Request Body
```typescript
{
  fullSync?: boolean; // Default: false (incremental sync)
}
```

#### Response
```typescript
{
  success: true,
  data: {
    jobId: string
  },
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/accounts/${accountId}/sync`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    fullSync: true
  })
});
```

---

### 9. Get Sync Status

**GET** `/api/v1/banking/accounts/:accountId/sync/status`

Get the status of the latest sync job for an account.

#### Parameters
- `accountId` (string): The bank account ID

#### Query Parameters
- `jobId` (string, optional): Specific job ID to check

#### Response
```typescript
{
  success: true,
  data: SyncJob,
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch(`/api/v1/banking/accounts/${accountId}/sync/status`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 10. Banking Overview

**GET** `/api/v1/banking/overview`

Get banking overview/dashboard data for the user.

#### Response
```typescript
{
  success: true,
  data: BankingOverview,
  timestamp: string
}
```

#### Example
```javascript
const response = await fetch('/api/v1/banking/overview', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 11. Health Check

**GET** `/api/v1/banking/health`

Check the health status of the banking service.

#### Response
```typescript
{
  status: 'OK' | 'ERROR',
  timestamp: string,
  checks: {
    teller: 'connected' | 'disconnected';
    circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    requestCount: number;
    uptime: number; // milliseconds since service start
  },
  error?: string
}
```

#### Example
```javascript
const response = await fetch('/api/v1/banking/health');
```

---

## Real-time Sync Updates (Server-Sent Events)

### Unified Sync Stream

**GET** `/api/v1/crypto/user/sync/stream`

Banking integrates with the existing unified SSE stream for real-time sync updates. This endpoint handles both crypto and banking sync progress through a single connection.

#### Headers
```http
Authorization: Bearer <your-jwt-token>
Accept: text/event-stream
Cache-Control: no-cache
```

#### Event Types

1. **Connection Established**
```typescript
{
  type: 'connection_established',
  userId: string,
  connectionId: string,
  timestamp: string,
  message: string,
  totalConnections: number
}
```

2. **Sync Progress** (Crypto & Banking)
```typescript
{
  type: 'sync_progress',
  userId: string,
  progress: number, // 0-100
  status: 'queued' | 'syncing' | 'syncing_assets' | 'syncing_transactions' | 'syncing_nfts' | 'syncing_defi' |
          'syncing_bank' | 'syncing_balance_bank' | 'syncing_transactions_bank' | 'completed' | 'failed' |
          'completed_bank' | 'failed_bank',
  timestamp: string,
  accountId?: string, // Present for banking events
  message?: string,
  data?: {
    accountId?: string,
    syncedData?: string[],
    error?: string,
    duration?: number
  }
}
```

3. **Sync Completed** (Crypto & Banking)
```typescript
{
  type: 'sync_completed',
  userId: string,
  progress: 100,
  status: 'completed' | 'completed_bank',
  timestamp: string,
  message: string,
  accountId?: string, // Present for banking events
  data?: {
    accountId?: string,
    syncedData?: string[],
    duration?: number
  }
}
```

4. **Sync Failed** (Crypto & Banking)
```typescript
{
  type: 'sync_failed',
  userId: string,
  progress: 0,
  status: 'failed' | 'failed_bank',
  error: string,
  message: string,
  timestamp: string,
  accountId?: string, // Present for banking events
  data?: {
    accountId?: string,
    error?: string
  }
}
```

5. **Heartbeat**
```typescript
{
  type: 'heartbeat',
  timestamp: string,
  totalConnections: number
}
```

#### Banking-Specific Event Types

All banking events use the same event structure as crypto events but with status values ending in `_bank`:

- `syncing_bank` - Banking sync has started
- `syncing_balance_bank` - Syncing account balance
- `syncing_transactions_bank` - Syncing transaction history
- `completed_bank` - Banking sync completed successfully
- `failed_bank` - Banking sync failed

#### Frontend Implementation Example

```javascript
function establishSyncStream(token) {
  const eventSource = new EventSource(`/api/v1/crypto/user/sync/stream`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'connection_established':
        console.log('Unified sync stream connected');
        break;

      case 'sync_progress':
        // Handle both crypto and banking progress
        if (data.status.endsWith('_bank')) {
          updateBankingSyncProgress(data.progress, data.status, data.accountId, data.message);
        } else {
          updateCryptoSyncProgress(data.progress, data.status, data.walletId);
        }
        break;

      case 'sync_completed':
        if (data.status === 'completed_bank') {
          handleBankingSyncCompleted(data.accountId, data.data);
        } else {
          handleCryptoSyncCompleted(data.walletId);
        }
        break;

      case 'sync_failed':
        if (data.status === 'failed_bank') {
          handleBankingSyncError(data.accountId, data.error);
        } else {
          handleCryptoSyncError(data.walletId, data.error);
        }
        break;

      case 'heartbeat':
        // Keep connection alive
        break;
    }
  };

  eventSource.onerror = (error) => {
    console.error('Sync stream error:', error);
  };

  return eventSource;
}

// Example banking-specific event handlers
function updateBankingSyncProgress(progress, status, accountId, message) {
  console.log(`Banking sync progress: ${progress}% - ${status}`, { accountId, message });

  // Update UI based on banking sync status
  switch (status) {
    case 'syncing_bank':
      showBankingSyncIndicator(accountId, 'Starting sync...');
      break;
    case 'syncing_balance_bank':
      showBankingSyncIndicator(accountId, 'Syncing balance...');
      break;
    case 'syncing_transactions_bank':
      showBankingSyncIndicator(accountId, 'Syncing transactions...');
      break;
  }
}

function handleBankingSyncCompleted(accountId, data) {
  console.log('Banking sync completed', { accountId, data });
  hideBankingSyncIndicator(accountId);
  refreshAccountData(accountId);

  // Show success notification with synced data info
  if (data.syncedData) {
    showNotification(`Synced: ${data.syncedData.join(', ')} for account ${accountId}`);
  }
}

function handleBankingSyncError(accountId, error) {
  console.error('Banking sync failed', { accountId, error });
  hideBankingSyncIndicator(accountId);
  showErrorNotification(`Failed to sync account ${accountId}: ${error}`);
}

// Usage
const syncStream = establishSyncStream(userToken);

// Close when component unmounts
// syncStream.close();
```

## Error Handling

### Common Error Codes

- `UNAUTHORIZED` (401): Missing or invalid authentication token
- `PLAN_LIMIT_EXCEEDED` (403): User has exceeded their plan limits
- `TELLER_UNAUTHORIZED` (401): Bank authorization has expired or invalid Teller token
- `TELLER_RATE_LIMITED` (429): Rate limit exceeded for Teller API calls
- `SERVICE_UNAVAILABLE` (503): Banking service is temporarily unavailable (circuit breaker protection)
- `INTERNAL_ERROR` (500): Server error

### Error Response Format

```typescript
{
  success: false,
  error: string, // Human-readable error message
  code: string,  // Machine-readable error code
  timestamp: string
}
```

### Frontend Error Handling Example

```javascript
async function connectBank(enrollmentData) {
  try {
    const response = await fetch('/api/v1/banking/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(enrollmentData)
    });

    const data = await response.json();

    if (!data.success) {
      switch (data.code) {
        case 'PLAN_LIMIT_EXCEEDED':
          showUpgradeModal();
          break;
        case 'TELLER_UNAUTHORIZED':
          showReconnectModal();
          break;
        case 'TELLER_RATE_LIMITED':
          showErrorMessage('Rate limit exceeded. Please try again later.');
          break;
        case 'SERVICE_UNAVAILABLE':
          showErrorMessage('Banking service is temporarily unavailable. Please try again in a few minutes.');
          break;
        default:
          showErrorMessage(data.error);
      }
      return;
    }

    // Handle successful connection
    return data.data;
  } catch (error) {
    console.error('Network error:', error);
    showErrorMessage('Network error occurred');
  }
}
```

## Integration with Teller Connect

### Frontend Integration Steps

1. **Include Teller Connect SDK**
```html
<script src="https://cdn.teller.io/connect/connect.js"></script>
```

2. **Initialize Teller Connect**
```javascript
const tellerConnect = TellerConnect.setup({
  applicationId: 'your_teller_app_id',
  environment: 'sandbox', // or 'production'
  onSuccess: (enrollment) => {
    // Send enrollment data to your backend
    connectBank({
      enrollment: {
        accessToken: enrollment.accessToken,
        enrollment: {
          id: enrollment.enrollment.id,
          institution: {
            id: enrollment.enrollment.institution.id,
            name: enrollment.enrollment.institution.name
          }
        }
      }
    });
  },
  onExit: () => {
    console.log('User exited Teller Connect');
  }
});

// Open Teller Connect
tellerConnect.open();
```

## Rate Limiting

The banking API implements rate limiting to ensure fair usage:

- **General endpoints**: 100 requests per 15 minutes per user
- **Sync operations**: 3 requests per 5 minutes per user
- **Health check**: No rate limiting

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Fault Tolerance & Reliability

### Circuit Breaker Protection
The banking service includes a circuit breaker pattern that:
- Monitors Teller API failures (threshold: 5 failures)
- Opens the circuit for 60 seconds when threshold is reached
- Returns `SERVICE_UNAVAILABLE` errors when circuit is open
- Automatically attempts to recover after timeout

### Retry Logic
- Automatic retry for failed Teller API calls (up to 3 attempts)
- Exponential backoff with jitter to prevent thundering herd
- Different retry strategies for different error types

### Health Monitoring
- Real-time circuit breaker status via `/health` endpoint
- Request counting and performance metrics
- Automatic recovery mechanisms

## Background Processing & Jobs

### Banking Sync Jobs

The banking system uses a sophisticated background job processing system built on BullMQ for reliable data synchronization:

#### Job Types

1. **Account Sync Jobs** (`syncAccount`)
   - Syncs account metadata, balance, and transactions
   - Supports different sync types: `full`, `incremental`, `balance_only`
   - Automatic retry with exponential backoff
   - Real-time progress updates via SSE

2. **Transaction Sync Jobs** (`syncTransactions`)
   - Dedicated transaction history synchronization
   - Date range filtering support
   - Batch processing for optimal performance

#### Job Processing Features

- **Circuit Breaker Protection**: Automatically stops processing when external API failures exceed threshold
- **Rate Limiting**: Respects Teller API rate limits (max 5 jobs per second)
- **Concurrency Control**: Processes up to 3 banking jobs concurrently
- **Memory Management**: Monitors and reports memory usage per job
- **Progress Tracking**: Real-time progress updates via unified SSE stream
- **Automatic Cleanup**: Retains last 100 completed jobs and 50 failed jobs

#### Job Status Lifecycle

```
queued → processing → completed/failed
```

Each job emits the following SSE events:
- `syncing_bank` - Job started
- `syncing_balance_bank` - Syncing account balance
- `syncing_transactions_bank` - Syncing transactions
- `completed_bank` - Job completed successfully
- `failed_bank` - Job failed with error

#### Monitoring Jobs

Use the sync status endpoint to monitor job progress:

```javascript
// Poll job status
async function monitorSyncJob(accountId, jobId) {
  const response = await fetch(`/api/v1/banking/accounts/${accountId}/sync/status?jobId=${jobId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const { data: job } = await response.json();

  console.log(`Job ${jobId} status: ${job.status} (${job.progress}%)`);

  if (job.status === 'completed') {
    console.log('Synced data:', job.syncedData);
  } else if (job.status === 'failed') {
    console.error('Job failed:', job.errorMessage);
  }
}
```

#### Best Practices for Jobs

- **Use SSE for real-time updates** instead of polling job status
- **Handle job failures gracefully** with user-friendly error messages
- **Implement exponential backoff** for manual job retries
- **Monitor job queue health** using the admin endpoints (if available)

## Best Practices

### 1. Caching
- Cache account and transaction data locally to reduce API calls
- Use the unified sync stream for real-time updates instead of polling
- Implement proper cache invalidation strategies

### 2. Error Handling
- Always check the `success` field in responses
- Handle specific error codes appropriately
- Implement retry logic with exponential backoff for network errors

### 3. Performance
- Use pagination for large transaction lists
- Implement virtual scrolling for better UX with many transactions
- Debounce user actions that trigger API calls

### 4. Security
- Store JWT tokens securely (HttpOnly cookies recommended)
- Never expose Teller tokens in client-side code
- Implement proper logout to clear sensitive data
- All Teller access tokens are encrypted at rest using AES-256
- Webhook signatures are automatically verified for security

### 5. User Experience
- Show loading states during sync operations
- Provide clear error messages and recovery options
- Use the unified SSE stream for real-time sync progress updates
- Differentiate between crypto and banking sync events using status suffixes

### 6. Plan-Based Limitations

The banking system enforces plan-based limitations on account connections:

```javascript
// Example plan limits (configured server-side)
const PLAN_LIMITS = {
  FREE: 3,      // 3 bank accounts
  PRO: 50,      // 50 bank accounts
  ULTIMATE: -1  // Unlimited
};

// Handle plan limit errors
async function connectBankAccount(enrollmentData) {
  try {
    const response = await fetch('/api/v1/banking/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(enrollmentData)
    });

    const data = await response.json();

    if (!data.success && data.code === 'PLAN_LIMIT_EXCEEDED') {
      // Show upgrade modal or error message
      showUpgradeModal('You have reached the maximum number of bank accounts for your plan.');
      return;
    }

    return data.data;
  } catch (error) {
    console.error('Failed to connect bank account:', error);
  }
}
```

## Testing

### Development Environment
- Use Teller's sandbox environment for testing
- Test with various bank types and transaction scenarios
- Verify proper error handling and edge cases

### Required Environment Variables
```bash
# Teller.io Configuration
TELLER_API_BASE_URL=https://api.teller.io
TELLER_APPLICATION_ID=your_teller_app_id
TELLER_SIGNING_SECRET=your_teller_signing_secret
TELLER_ENVIRONMENT=sandbox  # or 'production'

# Encryption (32-character key required)
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

### Mock Data
For development without connecting real banks, you can use mock data that follows the same structure as the API responses.

## Complete Integration Workflow

### Complete Frontend Integration

Here's a complete React example showing how to integrate banking with the unified SSE system:

```typescript
import React, { useState, useEffect, useCallback } from 'react';

interface BankingIntegrationProps {
  userToken: string;
}

export const BankingIntegration: React.FC<BankingIntegrationProps> = ({ userToken }) => {
  const [accounts, setAccounts] = useState([]);
  const [syncProgress, setSyncProgress] = useState<Record<string, any>>({});
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Establish unified SSE connection
  useEffect(() => {
    const es = new EventSource(`/api/v1/crypto/user/sync/stream`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle banking-specific events
      if (data.status?.endsWith('_bank')) {
        setSyncProgress(prev => ({
          ...prev,
          [data.accountId]: {
            progress: data.progress,
            status: data.status,
            message: data.message,
            error: data.data?.error
          }
        }));

        // Handle completion
        if (data.status === 'completed_bank') {
          fetchAccounts(); // Refresh account data

          setTimeout(() => {
            setSyncProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[data.accountId];
              return newProgress;
            });
          }, 3000);
        }
      }
    };

    es.onerror = (error) => console.error('SSE connection error:', error);
    setEventSource(es);
    return () => es.close();
  }, [userToken]);

  // Connect bank account using Teller Connect
  const connectBankAccount = useCallback(async (enrollmentData: any) => {
    try {
      const response = await fetch('/api/v1/banking/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ enrollment: enrollmentData })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      await fetchAccounts();
      return data.data;
    } catch (error) {
      console.error('Failed to connect bank account:', error);
      throw error;
    }
  }, [userToken]);

  // Fetch accounts and trigger sync
  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/banking/accounts', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await response.json();
      if (data.success) setAccounts(data.data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  }, [userToken]);

  const syncAccount = useCallback(async (accountId: string, fullSync = false) => {
    try {
      const response = await fetch(`/api/v1/banking/accounts/${accountId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ fullSync })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Failed to sync account:', error);
      throw error;
    }
  }, [userToken]);

  // Initialize Teller Connect
  const initializeTellerConnect = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).TellerConnect) {
      const tellerConnect = (window as any).TellerConnect.setup({
        applicationId: process.env.REACT_APP_TELLER_APPLICATION_ID,
        environment: process.env.REACT_APP_TELLER_ENVIRONMENT || 'sandbox',
        onSuccess: async (enrollment: any) => {
          try {
            await connectBankAccount(enrollment);
            console.log('Bank account connected successfully');
          } catch (error) {
            console.error('Failed to connect bank account:', error);
          }
        },
        onExit: () => console.log('Teller Connect closed')
      });

      tellerConnect.open();
    }
  }, [connectBankAccount]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  return (
    <div className="banking-integration">
      <h2>Banking Integration</h2>
      <button onClick={initializeTellerConnect}>Connect Bank Account</button>

      <div className="accounts-list">
        {accounts.map((account: any) => (
          <div key={account.id} className="account-card">
            <h3>{account.name}</h3>
            <p>{account.institutionName}</p>
            <p>Balance: ${account.balance.toFixed(2)}</p>

            {syncProgress[account.id] && (
              <div className="sync-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${syncProgress[account.id].progress}%` }}
                  />
                </div>
                <p>{syncProgress[account.id].message}</p>
                {syncProgress[account.id].error && (
                  <p className="error">{syncProgress[account.id].error}</p>
                )}
              </div>
            )}

            <button
              onClick={() => syncAccount(account.id)}
              disabled={!!syncProgress[account.id]}
            >
              {syncProgress[account.id] ? 'Syncing...' : 'Sync Account'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Complete Banking Integration Checklist

✅ **Backend Setup**
- [ ] Environment variables configured (TELLER_API_BASE_URL, TELLER_APPLICATION_ID, etc.)
- [ ] Database schema migrated (`npx prisma db push`)
- [ ] Redis connection established for background jobs
- [ ] Teller.io credentials configured and tested

✅ **Frontend Setup**
- [ ] Teller Connect SDK included (`<script src="https://cdn.teller.io/connect/connect.js"></script>`)
- [ ] SSE connection established to `/api/v1/crypto/user/sync/stream`
- [ ] Banking event handlers implemented (status ending with `_bank`)
- [ ] Error handling for plan limits and API failures
- [ ] UI components for sync progress and account management

✅ **Testing**
- [ ] Test bank account connection flow with Teller Connect
- [ ] Test sync progress via unified SSE stream
- [ ] Test error scenarios (rate limits, plan limits, network failures)
- [ ] Test account disconnection and reconnection
- [ ] Verify transaction syncing and categorization

✅ **Production Deployment**
- [ ] Switch to Teller production environment
- [ ] Configure production encryption keys (32-character ENCRYPTION_KEY)
- [ ] Set up monitoring and alerting for banking jobs
- [ ] Test with real bank accounts in sandbox first
- [ ] Configure rate limiting and circuit breaker thresholds

### Integration Summary

The banking integration is now complete with:
- **Unified SSE Stream**: Single connection for both crypto and banking sync updates
- **Background Jobs**: Reliable sync processing with BullMQ
- **Circuit Breaker**: Fault tolerance for external API failures
- **Plan Limits**: Subscription-based account limits
- **Real-time Progress**: Live sync updates via SSE with banking-specific event types
- **Comprehensive Error Handling**: Graceful handling of all error scenarios

All banking events use the `_bank` suffix to distinguish them from crypto events in the unified stream.

---

This documentation covers all the banking API endpoints and provides comprehensive examples for frontend integration. The banking module integrates seamlessly with the existing crypto portfolio system and follows the same architectural patterns.