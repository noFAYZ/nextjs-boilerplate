# Banking Module - API Reference

**Base Path**: `/api/v1/banking`

---

## Endpoints Overview

### Provider Connections (NEW)
| Method | Endpoint | Purpose | Auth | Rate Limit |
|--------|----------|---------|------|-----------|
| GET | `/connections` | List all connections with accounts | ✅ | 100/15min |
| GET | `/connections?includeAccounts=false` | List connections without accounts (legacy) | ✅ | 100/15min |
| GET | `/connections/{id}` | Get specific connection | ✅ | 100/15min |
| GET | `/connections/{id}/health` | Check connection health | ✅ | 50/15min |
| POST | `/connections/{id}/sync` | Trigger connection sync | ✅ | 3/5min |
| POST | `/connections/{id}/disconnect` | Disconnect connection | ✅ | 10/min |
| POST | `/connections/{id}/reconnect` | Reconnect disconnected connection | ✅ | 10/min |
| DELETE | `/connections/{id}` | Permanently delete connection | ✅ | 10/min |

### Legacy Account Endpoints
| Method | Endpoint | Purpose | Auth | Rate Limit |
|--------|----------|---------|------|-----------|
| POST | `/link-token` | Generate Link token for OAuth | ✅ | 10/min |
| POST | `/link-account` | Exchange public token for account | ✅ | 10/min |
| GET | `/accounts` | List user's linked accounts | ✅ | 100/15min |
| GET | `/accounts/{id}` | Get account details | ✅ | 100/15min |
| PUT | `/accounts/{id}` | Update account preferences | ✅ | 10/min |
| DELETE | `/accounts/{id}` | Unlink account | ✅ | 10/min |
| POST | `/accounts/{id}/sync` | Trigger account sync | ✅ | 3/5min |
| GET | `/accounts/{id}/sync-status` | Get sync status | ✅ | 100/15min |
| GET | `/accounts/{id}/balance-history` | Get balance snapshots | ✅ | 100/15min |
| POST | `/duplicates/check` | Check for duplicate accounts | ✅ | 10/min |
| POST | `/duplicates/merge` | Merge duplicate accounts | ✅ | 5/min |
| GET | `/providers/status` | Check provider health | ✅ | 50/15min |

---

## Provider Connections Endpoints (NEW)

### Overview
The connections endpoints manage provider integrations (Plaid, Teller, MX, Finicity) and return associated financial accounts in a single request. Accounts are included by default for convenience and efficiency.

**Key Features:**
- ✅ Single API call returns connections + all accounts
- ✅ No N+1 query problem (optimized database queries)
- ✅ Backward compatible via `?includeAccounts=false` parameter
- ✅ Auto-filters archived/deleted accounts (only ACTIVE accounts returned)
- ✅ Comprehensive connection health tracking

---

### 1. List Provider Connections with Accounts

**Endpoint**: `GET /connections`

**Description**: Returns all provider connections for the authenticated user, including all associated financial accounts. Accounts are included by default.

**Query Parameters**:
```
?includeAccounts=true|false    # Include/exclude accounts (default: true)
?provider=PLAID|TELLER|MX|FINICITY  # Filter by provider type (optional)
?page=1&limit=20               # Pagination (optional)
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "conn_abc123",
      "userId": "user_xyz789",
      "provider": "PLAID",
      "status": "ACTIVE",
      "institutionName": "Chase Bank",
      "institutionLogo": "https://plaid.com/assets/chase.png",
      "institutionUrl": "https://chase.com",
      "lastSyncAt": "2025-01-26T10:30:00Z",
      "lastSyncStatus": "SUCCESS",
      "autoSync": true,
      "syncFrequency": "DAILY",
      "errorCount": 0,
      "accountCount": 2,
      "accounts": [
        {
          "id": "acc_checking123",
          "name": "Chase Total Checking",
          "displayName": "Primary Checking",
          "type": "CHECKING",
          "subtype": null,
          "status": "ACTIVE",
          "mask": "1234",
          "currentBalance": 5432.10,
          "availableBalance": 5432.10,
          "currency": "USD",
          "isActive": true,
          "lastSyncedAt": "2025-01-26T10:30:00Z",
          "createdAt": "2025-01-15T08:00:00Z"
        },
        {
          "id": "acc_savings456",
          "name": "Chase Savings",
          "displayName": "Emergency Fund",
          "type": "SAVINGS",
          "subtype": "savings",
          "status": "ACTIVE",
          "mask": "5678",
          "currentBalance": 12500.50,
          "availableBalance": 12500.50,
          "currency": "USD",
          "isActive": true,
          "lastSyncedAt": "2025-01-26T10:30:00Z",
          "createdAt": "2025-01-15T08:00:00Z"
        }
      ],
      "createdAt": "2025-01-15T08:00:00Z",
      "updatedAt": "2025-01-26T10:30:00Z"
    }
  ],
  "count": 1,
  "timestamp": "2025-01-26T10:35:00Z"
}
```

**Legacy Mode** (without accounts):
```bash
GET /connections?includeAccounts=false
```

**Response** (same structure but `accounts` array omitted and no `accountCount` field)

---

### 2. Get Specific Connection

**Endpoint**: `GET /connections/{connectionId}`

**Description**: Get a specific provider connection with all its accounts.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "conn_abc123",
    "userId": "user_xyz789",
    "provider": "PLAID",
    "status": "ACTIVE",
    "institutionName": "Chase Bank",
    "institutionLogo": "https://plaid.com/assets/chase.png",
    "lastSyncAt": "2025-01-26T10:30:00Z",
    "lastSyncStatus": "SUCCESS",
    "autoSync": true,
    "syncFrequency": "DAILY",
    "errorCount": 0,
    "accountCount": 2,
    "accounts": [
      {
        "id": "acc_checking123",
        "name": "Chase Total Checking",
        "type": "CHECKING",
        "currentBalance": 5432.10,
        "availableBalance": 5432.10,
        "currency": "USD",
        "isActive": true,
        "createdAt": "2025-01-15T08:00:00Z"
      },
      {
        "id": "acc_savings456",
        "name": "Chase Savings",
        "type": "SAVINGS",
        "currentBalance": 12500.50,
        "availableBalance": 12500.50,
        "currency": "USD",
        "isActive": true,
        "createdAt": "2025-01-15T08:00:00Z"
      }
    ],
    "createdAt": "2025-01-15T08:00:00Z",
    "updatedAt": "2025-01-26T10:30:00Z"
  },
  "timestamp": "2025-01-26T10:35:00Z"
}
```

**Error** (404):
```json
{
  "success": false,
  "error": "Connection not found",
  "code": "CONNECTION_NOT_FOUND",
  "timestamp": "2025-01-26T10:35:00Z"
}
```

---

### 3. Check Connection Health

**Endpoint**: `GET /connections/{connectionId}/health`

**Description**: Verify if a connection is still valid and can access accounts.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "connectionId": "conn_abc123",
    "status": "HEALTHY",
    "isValid": true,
    "canAccess": true,
    "lastValidationAt": "2025-01-26T10:32:00Z",
    "validationMessage": "Connection is active and accessible",
    "accountsAccessible": 2,
    "nextValidationAt": "2025-01-26T11:32:00Z"
  },
  "timestamp": "2025-01-26T10:35:00Z"
}
```

**Error** (503):
```json
{
  "success": false,
  "error": "Connection unhealthy",
  "code": "CONNECTION_UNHEALTHY",
  "details": {
    "reason": "Token expired",
    "status": "EXPIRED"
  },
  "timestamp": "2025-01-26T10:35:00Z"
}
```

---

### 4. Trigger Connection Sync

**Endpoint**: `POST /connections/{connectionId}/sync`

**Description**: Manually trigger synchronization of all accounts under a connection.

**Request**:
```json
{
  "priority": "HIGH"
}
```

**Response** (202):
```json
{
  "success": true,
  "data": {
    "connectionId": "conn_abc123",
    "syncJobId": "job_sync_abc123",
    "status": "QUEUED",
    "accountsToSync": 2,
    "estimatedDuration": 60000,
    "queuedAt": "2025-01-26T10:36:00Z"
  },
  "timestamp": "2025-01-26T10:36:00Z"
}
```

---

### 5. Disconnect Connection

**Endpoint**: `POST /connections/{connectionId}/disconnect`

**Description**: Soft disconnect a connection (keeps data for potential reconnection).

**Response** (200):
```json
{
  "success": true,
  "data": {
    "connectionId": "conn_abc123",
    "status": "DISCONNECTED",
    "message": "Connection successfully disconnected",
    "disconnectedAt": "2025-01-26T10:37:00Z",
    "accountsArchived": 2
  },
  "timestamp": "2025-01-26T10:37:00Z"
}
```

---

### 6. Reconnect Connection

**Endpoint**: `POST /connections/{connectionId}/reconnect`

**Description**: Reactivate a previously disconnected connection without re-linking to provider.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "connectionId": "conn_abc123",
    "status": "ACTIVE",
    "message": "Connection successfully reconnected",
    "accountsReactivated": 2,
    "reconnectedAt": "2025-01-26T10:38:00Z",
    "nextSyncAt": "2025-01-26T10:45:00Z"
  },
  "timestamp": "2025-01-26T10:38:00Z"
}
```

---

### 7. Delete Connection

**Endpoint**: `DELETE /connections/{connectionId}`

**Description**: Permanently delete a connection and all associated accounts (hard delete).

**Response** (204):
```
No content
```

---

## Legacy Account Endpoints

### 1. Generate Link Token
Generate OAuth token for account linking.

**Endpoint**: `POST /link-token`

**Request**:
```json
{
  "provider": "plaid",
  "redirectUrl": "https://app.mappr.com/banking/callback",
  "countryCode": "US",
  "language": "en"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "linkToken": "link-sandbox-abcd1234efgh5678",
    "expiration": "2025-01-25T12:00:00Z",
    "requestId": "req_123456"
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Invalid provider selected",
  "code": "INVALID_PROVIDER",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

### 2. Exchange Public Token
Exchange OAuth public token for account access.

**Endpoint**: `POST /link-account`

**Request**:
```json
{
  "provider": "plaid",
  "publicToken": "public-sandbox-abcd1234efgh5678",
  "metadata": {
    "institution": {
      "name": "Chase Bank",
      "institutionId": "ins_100000"
    },
    "accounts": [
      {
        "id": "acc_123456",
        "name": "Checking Account",
        "mask": "7890",
        "type": "depository",
        "subtype": "checking"
      }
    ]
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "accountId": "acc_user_123",
    "linkedAccounts": [
      {
        "id": "acc_user_123",
        "accountName": "Checking Account",
        "institution": "Chase Bank",
        "accountNumber": "****7890",
        "accountType": "checking",
        "currentBalance": 5432.10,
        "currency": "USD",
        "syncing": true,
        "lastSyncAt": null
      }
    ]
  },
  "timestamp": "2025-01-18T10:35:00Z"
}
```

**Error** (409):
```json
{
  "success": false,
  "error": "This account is already linked to your profile",
  "code": "DUPLICATE_DETECTED",
  "timestamp": "2025-01-18T10:35:00Z"
}
```

---

### 3. List Linked Accounts
Get all accounts linked by user.

**Endpoint**: `GET /accounts`

**Query Parameters**:
```
?page=1&limit=20&provider=plaid&status=linked&sortBy=createdAt
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "acc_user_123",
      "accountName": "Checking Account",
      "institution": "Chase Bank",
      "accountNumber": "****7890",
      "accountType": "checking",
      "currentBalance": 5432.10,
      "availableBalance": 5200.00,
      "currency": "USD",
      "provider": "plaid",
      "status": "linked",
      "syncing": false,
      "lastSyncAt": "2025-01-18T08:00:00Z",
      "syncError": null,
      "createdAt": "2025-01-10T15:30:00Z",
      "updatedAt": "2025-01-18T08:00:00Z"
    },
    {
      "id": "acc_user_124",
      "accountName": "Savings",
      "institution": "Wells Fargo",
      "accountNumber": "****4321",
      "accountType": "savings",
      "currentBalance": 25000.50,
      "availableBalance": 25000.50,
      "currency": "USD",
      "provider": "plaid",
      "status": "linked",
      "syncing": false,
      "lastSyncAt": "2025-01-18T09:15:00Z",
      "syncError": null,
      "createdAt": "2025-01-12T10:20:00Z",
      "updatedAt": "2025-01-18T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "hasMore": false
  },
  "timestamp": "2025-01-18T10:40:00Z"
}
```

---

### 4. Get Account Details
Get specific account with transactions.

**Endpoint**: `GET /accounts/{id}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "acc_user_123",
    "accountName": "Checking Account",
    "institution": "Chase Bank",
    "institutionId": "ins_100000",
    "routingNumber": "021000021",
    "accountNumber": "****7890",
    "accountType": "checking",
    "currentBalance": 5432.10,
    "availableBalance": 5200.00,
    "currency": "USD",
    "provider": "plaid",
    "ownerName": "John Doe",
    "status": "linked",
    "syncing": false,
    "lastSyncAt": "2025-01-18T08:00:00Z",
    "transactionCount": 145,
    "lastTransactionAt": "2025-01-18T07:45:00Z",
    "createdAt": "2025-01-10T15:30:00Z",
    "updatedAt": "2025-01-18T08:00:00Z"
  },
  "timestamp": "2025-01-18T10:45:00Z"
}
```

**Error** (404):
```json
{
  "success": false,
  "error": "Account not found",
  "code": "ACCOUNT_NOT_FOUND",
  "timestamp": "2025-01-18T10:45:00Z"
}
```

---

### 5. Update Account
Update account name or preferences.

**Endpoint**: `PUT /accounts/{id}`

**Request**:
```json
{
  "accountName": "Checking - Primary",
  "groupId": "group_123",
  "preferences": {
    "includeInPortfolio": true,
    "autoSync": true
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "acc_user_123",
    "accountName": "Checking - Primary",
    "institution": "Chase Bank",
    "accountNumber": "****7890",
    "currentBalance": 5432.10,
    "updatedAt": "2025-01-18T10:50:00Z"
  },
  "timestamp": "2025-01-18T10:50:00Z"
}
```

---

### 6. Unlink Account
Remove linked account and revoke access.

**Endpoint**: `DELETE /accounts/{id}`

**Response** (204):
```
No content
```

**Error** (403):
```json
{
  "success": false,
  "error": "Cannot delete primary account",
  "code": "CANNOT_DELETE_PRIMARY",
  "timestamp": "2025-01-18T10:55:00Z"
}
```

---

### 7. Trigger Account Sync
Manually trigger account synchronization.

**Endpoint**: `POST /accounts/{id}/sync`

**Request**:
```json
{
  "priority": "HIGH",
  "syncTypes": ["balance", "transactions", "metadata"]
}
```

**Response** (202):
```json
{
  "success": true,
  "data": {
    "jobId": "job_sync_abc123",
    "accountId": "acc_user_123",
    "syncStatus": "pending",
    "progress": 0,
    "startedAt": "2025-01-18T10:56:00Z"
  },
  "timestamp": "2025-01-18T10:56:00Z"
}
```

**Error** (409):
```json
{
  "success": false,
  "error": "Sync already in progress for this account",
  "code": "SYNC_IN_PROGRESS",
  "timestamp": "2025-01-18T10:56:00Z"
}
```

---

### 8. Get Sync Status
Get current or last sync status.

**Endpoint**: `GET /accounts/{id}/sync-status`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accountId": "acc_user_123",
    "jobId": "job_sync_abc123",
    "syncStatus": "in_progress",
    "progress": 45,
    "startedAt": "2025-01-18T10:56:00Z",
    "estimatedCompletionTime": "2025-01-18T11:01:00Z",
    "stages": {
      "fetching_balance": {
        "status": "completed",
        "progress": 100
      },
      "fetching_transactions": {
        "status": "in_progress",
        "progress": 50
      },
      "categorizing_transactions": {
        "status": "pending",
        "progress": 0
      },
      "checking_duplicates": {
        "status": "pending",
        "progress": 0
      }
    },
    "lastSyncAt": "2025-01-18T08:00:00Z"
  },
  "timestamp": "2025-01-18T10:58:00Z"
}
```

---

### 9. Get Balance History
Get balance snapshots for chart.

**Endpoint**: `GET /accounts/{id}/balance-history`

**Query Parameters**:
```
?days=30&granularity=daily
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accountId": "acc_user_123",
    "balanceHistory": [
      {
        "date": "2025-01-18",
        "balance": 5432.10,
        "change": 150.25,
        "changePercent": 2.85
      },
      {
        "date": "2025-01-17",
        "balance": 5281.85,
        "change": -50.00,
        "changePercent": -0.94
      },
      {
        "date": "2025-01-16",
        "balance": 5331.85,
        "change": 100.50,
        "changePercent": 1.92
      }
    ],
    "averageBalance": 5348.60,
    "minBalance": 5200.00,
    "maxBalance": 5500.00,
    "totalChange": 232.10,
    "changePercent": 4.45,
    "period": "30"
  },
  "timestamp": "2025-01-18T11:00:00Z"
}
```

---

### 10. Check for Duplicates
Manually check if account is duplicate.

**Endpoint**: `POST /duplicates/check`

**Request**:
```json
{
  "provider": "plaid",
  "institutionId": "ins_100000",
  "routingNumber": "021000021",
  "accountNumber": "1234567890"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "isDuplicate": true,
    "duplicateAccounts": [
      {
        "id": "acc_user_125",
        "accountName": "Checking",
        "institution": "Chase Bank",
        "accountNumber": "****7890",
        "matchScore": 0.99,
        "matchReasons": [
          "Same routing number",
          "Same account last 4 digits",
          "Same institution"
        ]
      }
    ]
  },
  "timestamp": "2025-01-18T11:02:00Z"
}
```

---

### 11. Merge Duplicate Accounts
Merge two accounts and consolidate history.

**Endpoint**: `POST /duplicates/merge`

**Request**:
```json
{
  "primaryAccountId": "acc_user_125",
  "duplicateAccountId": "acc_user_126",
  "keepPrimary": true
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "mergedAccountId": "acc_user_125",
    "transactionsMerged": 87,
    "duplicateArchived": true,
    "mergeCompletedAt": "2025-01-18T11:03:00Z",
    "message": "Accounts successfully merged. Duplicate account archived."
  },
  "timestamp": "2025-01-18T11:03:00Z"
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Cannot merge accounts from different institutions",
  "code": "INVALID_MERGE",
  "timestamp": "2025-01-18T11:03:00Z"
}
```

---

### 12. Check Provider Health
Check status of all banking providers.

**Endpoint**: `GET /providers/status`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "plaid": {
      "status": "healthy",
      "responseTime": 145,
      "lastChecked": "2025-01-18T11:03:30Z",
      "requestsPerDay": 8750,
      "circuitBreakerState": "CLOSED"
    },
    "teller": {
      "status": "degraded",
      "responseTime": 892,
      "lastChecked": "2025-01-18T11:03:25Z",
      "requestsPerDay": 2100,
      "circuitBreakerState": "HALF_OPEN",
      "lastError": "Higher than normal latency"
    },
    "mx": {
      "status": "healthy",
      "responseTime": 267,
      "lastChecked": "2025-01-18T11:03:20Z",
      "requestsPerDay": 1250,
      "circuitBreakerState": "CLOSED"
    }
  },
  "timestamp": "2025-01-18T11:04:00Z"
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_PROVIDER | 400 | Provider not supported |
| PROVIDER_ERROR | 502 | External provider error |
| INVALID_TOKEN | 400 | Invalid OAuth token |
| ACCOUNT_NOT_FOUND | 404 | Account does not exist |
| SYNC_FAILED | 503 | Account sync operation failed |
| ACCESS_DENIED | 403 | User not authorized |
| TOKEN_EXPIRED | 401 | Access token expired, refresh needed |
| DUPLICATE_DETECTED | 409 | Account already linked |
| ACCOUNT_LIMIT | 403 | Plan wallet limit exceeded |
| SYNC_IN_PROGRESS | 409 | Sync already running |
| INVALID_MERGE | 400 | Cannot merge accounts (different institutions) |

---

## Rate Limits

- **Link Token Generation**: 10 requests/min
- **Account Linking**: 10 requests/min
- **Account List**: 100 requests/15min
- **Account Details**: 100 requests/15min
- **Account Update**: 10 requests/min
- **Account Delete**: 10 requests/min
- **Manual Sync**: 3 requests/5min
- **Sync Status**: 100 requests/15min
- **Balance History**: 100 requests/15min
- **Duplicate Check**: 10 requests/min
- **Duplicate Merge**: 5 requests/min
- **Provider Status**: 50 requests/15min

All rate limits return `429 Too Many Requests` when exceeded.

---

## Authentication

All banking endpoints require:
- **Header**: `Authorization: Bearer {jwt_token}`
- **Scopes**: `banking:read`, `banking:write`
- **Plan Requirements**: Varies by endpoint

---

## Real-time Updates

Banking module supports Server-Sent Events (SSE) for real-time sync progress:

**Endpoint**: `GET /accounts/{id}/sync-stream`

**Connection**:
```
Authorization: Bearer {jwt_token}
Accept: text/event-stream
```

**Events**:
```
event: progress
data: {"progress": 25, "stage": "fetching_balance"}

event: progress
data: {"progress": 50, "stage": "fetching_transactions"}

event: completed
data: {"status": "completed", "totalTime": 45000}
```
