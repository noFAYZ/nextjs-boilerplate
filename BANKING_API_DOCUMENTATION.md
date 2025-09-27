# Banking API Documentation for Frontend

## Overview

This document provides comprehensive API documentation for the banking integration using Teller.io. The banking module allows users to securely connect their bank accounts, sync transactions, and manage their financial data alongside their crypto portfolios.

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

### 6. Get All Transactions

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

### Banking Sync Stream

**GET** `/api/v1/banking/user/sync/stream`

Establish a Server-Sent Events connection to receive real-time sync updates.

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

2. **Sync Progress**
```typescript
{
  type: 'sync_progress',
  userId: string,
  progress: number, // 0-100
  status: 'queued' | 'syncing' | 'syncing_balance' | 'syncing_transactions' | 'completed' | 'failed',
  timestamp: string
}
```

3. **Sync Completed**
```typescript
{
  type: 'sync_completed',
  userId: string,
  progress: 100,
  status: 'completed',
  timestamp: string,
  message: string
}
```

4. **Sync Failed**
```typescript
{
  type: 'sync_failed',
  userId: string,
  progress: 0,
  status: 'failed',
  error: string,
  message: string,
  timestamp: string
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

#### Frontend Implementation Example

```javascript
function establishSyncStream(token) {
  const eventSource = new EventSource(`/api/v1/banking/user/sync/stream`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'connection_established':
        console.log('Banking sync stream connected');
        break;

      case 'sync_progress':
        updateSyncProgress(data.progress, data.status);
        break;

      case 'sync_completed':
        handleSyncCompleted();
        break;

      case 'sync_failed':
        handleSyncError(data.error);
        break;

      case 'heartbeat':
        // Keep connection alive
        break;
    }
  };

  eventSource.onerror = (error) => {
    console.error('Banking sync stream error:', error);
  };

  return eventSource;
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

## Best Practices

### 1. Caching
- Cache account and transaction data locally to reduce API calls
- Use sync streams for real-time updates instead of polling
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
- Use SSE for real-time sync progress updates

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

---

This documentation covers all the banking API endpoints and provides comprehensive examples for frontend integration. The banking module integrates seamlessly with the existing crypto portfolio system and follows the same architectural patterns.