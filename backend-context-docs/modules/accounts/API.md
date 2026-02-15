# Accounts Module - API Reference

**Base Path**: `/api/v1/accounts`

## Endpoints Overview

Total: **47 API Endpoints** organized into 8 categories

| Category | Count | Purpose |
|----------|-------|---------|
| Basic CRUD | 6 | Account creation, retrieval, updates, deletion |
| Statistics & Details | 4 | Account metrics, balance, history, charts |
| Bulk Operations | 3 | Bulk delete, deactivate, reactivate |
| Lifecycle Management | 8 | Archive, reopen, close operations (individual + bulk) |
| Net Worth Tracking | 6 | Snapshots, trends, breakdowns, multi-currency |
| Exchange Rates | 4 | Rate conversion, caching, refresh |
| Account Grouping | 6 | Group creation, management, membership |
| Preferences & Ownership | 10 | Favorites, primary accounts, ownership tracking |

---

## Basic Account CRUD Operations

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/` | Create new account | 10/min |
| GET | `/` | Get grouped accounts | 50/15min |
| GET | `/d` | List accounts with filtering and pagination | 50/15min |
| GET | `/:id` | Get account by ID | 50/15min |
| PUT | `/:id` | Update account details | 10/min |
| DELETE | `/:id` | Delete account | 5/min |

---

## Account Statistics & Details

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/stats` | Get account statistics | 50/15min |
| GET | `/:id/balance` | Get account balance details | 50/15min |
| GET | `/:id/history` | Get account balance history for charts | 50/15min |
| GET | `/:id/chart` | Get account chart data | 50/15min |

---

## Bulk Operations

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/bulk-delete` | Bulk delete multiple accounts (up to 1000) | 10/min |
| POST | `/bulk-deactivate` | Bulk deactivate multiple accounts (up to 1000) | 10/min |
| POST | `/bulk-reactivate` | Bulk reactivate multiple accounts (up to 1000) | 10/min |

---

## Account Lifecycle Management

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/:id/archive` | Archive account (soft delete - reversible) | 10/min |
| POST | `/:id/reopen` | Reopen archived account | 10/min |
| POST | `/:id/close` | Close account (permanent closure) | 5/min |
| GET | `/:id/lifecycle-history` | Get account lifecycle history | 50/15min |
| POST | `/bulk-archive` | Bulk archive accounts | 10/min |
| POST | `/bulk-reopen` | Bulk reopen accounts | 10/min |
| POST | `/bulk-close` | Bulk close accounts | 5/min |

**Note**: Archive is soft delete (reversible), Close is permanent.

---

## Net Worth Tracking

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/networth/snapshot` | Create net worth snapshot | 10/min |
| GET | `/networth/snapshot/:id` | Get net worth snapshot by ID | 50/15min |
| GET | `/networth/latest` | Get latest net worth snapshot | 50/15min |
| GET | `/networth/trend` | Get net worth trend (historical) | 50/15min |
| GET | `/networth/breakdown` | Get net worth breakdown by category | 50/15min |
| GET | `/networth/currency/:currency` | Get net worth in specific currency | 50/15min |

---

## Exchange Rates

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/exchange-rates` | Get exchange rate (query: from, to, date) | 50/15min |
| POST | `/exchange-rates/convert` | Convert amount between currencies | 50/15min |
| POST | `/exchange-rates/refresh` | Refresh exchange rate cache | 10/min |
| GET | `/exchange-rates/cache-stats` | Get exchange rate cache statistics | 50/15min |

---

## Account Grouping

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/groups` | Create account group | 10/min |
| GET | `/groups` | Get all account groups for user | 50/15min |
| PUT | `/groups/:groupId` | Update account group | 10/min |
| DELETE | `/groups/:groupId` | Delete account group | 5/min |
| PUT | `/:accountId/group/:groupId` | Add account to group | 10/min |
| DELETE | `/:accountId/group` | Remove account from group | 10/min |

---

## Account Preferences & Ownership

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/favorites` | Get all favorite accounts | 50/15min |
| PUT | `/:accountId/favorite` | Mark account as favorite | 10/min |
| DELETE | `/:accountId/favorite` | Unmark account as favorite | 10/min |
| GET | `/preferences/favorites` | Get favorite accounts (preferences endpoint) | 50/15min |
| PUT | `/:accountId/primary` | Set as primary account for category | 10/min |
| GET | `/primary/:category` | Get primary account for category | 50/15min |
| PUT | `/:accountId/ownership` | Update account ownership information | 10/min |
| GET | `/:accountId/ownership` | Get account ownership information | 50/15min |
| GET | `/by-owner-type/:ownerType` | Get accounts by owner type | 50/15min |
| GET | `/:accountId/preferences` | Get all preferences for account | 50/15min |

---

## Sample Responses

### POST / - Create Account (201)
```json
{
  "success": true,
  "data": {
    "id": "acc_123",
    "name": "My Savings Account",
    "type": "SAVINGS",
    "currentBalance": 50000.00,
    "currency": "USD",
    "createdAt": "2025-01-18T15:00:00Z"
  }
}
```

### GET /:id - Get Account Details (200)
```json
{
  "success": true,
  "data": {
    "id": "acc_123",
    "name": "My Savings Account",
    "type": "SAVINGS",
    "currentBalance": 50000.00,
    "availableBalance": 45000.00,
    "currency": "USD",
    "isActive": true,
    "lastSyncedAt": "2025-01-18T14:30:00Z",
    "createdAt": "2025-01-10T12:00:00Z",
    "updatedAt": "2025-01-18T14:30:00Z"
  }
}
```

### GET /stats - Account Statistics (200)
```json
{
  "success": true,
  "data": {
    "totalAccounts": 5,
    "activeAccounts": 4,
    "archivedAccounts": 1,
    "totalBalance": 150000.00,
    "balanceByType": {
      "CHECKING": 50000.00,
      "SAVINGS": 80000.00,
      "CREDIT": -5000.00,
      "INVESTMENT": 25000.00
    },
    "accountsByGroup": [
      {
        "groupId": "grp_123",
        "groupName": "Emergency Fund",
        "count": 2,
        "totalBalance": 50000.00
      }
    ]
  }
}
```

### POST /networth/snapshot - Create Snapshot (201)
```json
{
  "success": true,
  "data": {
    "id": "snap_456",
    "userId": "user_123",
    "totalNetWorth": 150000.00,
    "currency": "USD",
    "breakdown": {
      "crypto": 45000.00,
      "banking": 100000.00,
      "investments": 5000.00
    },
    "timestamp": "2025-01-18T15:00:00Z"
  }
}
```

### GET /networth/latest - Latest Net Worth (200)
```json
{
  "success": true,
  "data": {
    "id": "snap_456",
    "totalNetWorth": 150000.00,
    "currency": "USD",
    "breakdown": {
      "crypto": 45000.00,
      "banking": 100000.00,
      "investments": 5000.00
    },
    "timestamp": "2025-01-18T15:00:00Z",
    "changeFromLastDay": {
      "absolute": 5000.00,
      "percentage": 3.45
    }
  }
}
```

### GET /networth/trend - Net Worth Trend (200)
```json
{
  "success": true,
  "data": {
    "snapshots": [
      {
        "timestamp": "2025-01-10T15:00:00Z",
        "netWorth": 140000.00
      },
      {
        "timestamp": "2025-01-15T15:00:00Z",
        "netWorth": 145000.00
      },
      {
        "timestamp": "2025-01-18T15:00:00Z",
        "netWorth": 150000.00
      }
    ],
    "period": "30_days",
    "highestValue": 150000.00,
    "lowestValue": 140000.00,
    "averageValue": 145000.00
  }
}
```

### POST /groups - Create Group (201)
```json
{
  "success": true,
  "data": {
    "id": "grp_123",
    "name": "Emergency Fund",
    "description": "Emergency savings accounts",
    "accountCount": 0,
    "createdAt": "2025-01-18T15:00:00Z"
  }
}
```

### GET /groups - List Groups (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "grp_123",
      "name": "Emergency Fund",
      "description": "Emergency savings accounts",
      "accountCount": 2,
      "totalBalance": 50000.00,
      "createdAt": "2025-01-18T15:00:00Z"
    },
    {
      "id": "grp_124",
      "name": "Trading Accounts",
      "description": "Crypto trading wallets",
      "accountCount": 3,
      "totalBalance": 45000.00,
      "createdAt": "2025-01-16T10:30:00Z"
    }
  ],
  "count": 2
}
```

### PUT /:accountId/ownership - Update Ownership (200)
```json
{
  "success": true,
  "message": "Ownership information updated",
  "data": {
    "accountId": "acc_123",
    "ownerType": "JOINT",
    "ownershipPercentage": 50
  }
}
```

### GET /:accountId/ownership - Get Ownership (200)
```json
{
  "success": true,
  "data": {
    "accountId": "acc_123",
    "ownerType": "JOINT",
    "ownershipPercentage": 50,
    "updatedAt": "2025-01-18T15:00:00Z"
  }
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| ACCOUNT_NOT_FOUND | 404 | Account ID doesn't exist |
| GROUP_NOT_FOUND | 404 | Group ID doesn't exist |
| INVALID_ACCOUNT | 400 | Invalid account data |
| INVALID_GROUP | 400 | Invalid group data |
| PERMISSION_DENIED | 403 | User doesn't have access to account |
| INVALID_CURRENCY | 400 | Currency code not supported |
| EXCHANGE_RATE_ERROR | 503 | Exchange rate service unavailable |
| OWNERSHIP_INVALID | 400 | Invalid ownership type or percentage |

---

## Query Parameters

### List Accounts (GET /d)
- `skip`: Number of records to skip (default: 0)
- `take`: Number of records to return (default: 20, max: 100)
- `type`: Filter by account type (CHECKING, SAVINGS, CREDIT, INVESTMENT, LOAN)
- `status`: Filter by status (ACTIVE, ARCHIVED, CLOSED)
- `sortBy`: Sort field (name, balance, createdAt)
- `sortOrder`: Sort direction (asc, desc)

### Get Exchange Rate (GET /exchange-rates)
- `from`: Source currency code (required)
- `to`: Target currency code (default: USD)
- `date`: Historical date (optional, YYYY-MM-DD format)

### Get Net Worth Trend (GET /networth/trend)
- `period`: Time period (7_days, 30_days, 90_days, 1_year, all)
- `currency`: Display currency (default: USD)

---

## Owner Types

Valid values for `ownerType`:
- `SOLE` - Single owner
- `JOINT` - Joint ownership (2 or more)
- `TRUST` - Trust-owned account
- `BUSINESS` - Business-owned
- `OTHER` - Other ownership structure

For `JOINT` ownership, `ownershipPercentage` should be provided (0-100).

---

## Account Types

Valid values for `type`:
- `CHECKING` - Checking account
- `SAVINGS` - Savings account
- `CREDIT` - Credit card
- `INVESTMENT` - Investment/Brokerage
- `LOAN` - Loan account (mortgage, personal, etc.)

---

## Account Lifecycle States

- **ACTIVE** - Account is active and in use
- **ARCHIVED** - Account is archived (soft delete, can be reopened)
- **CLOSED** - Account is permanently closed

---

## Rate Limiting

- **Standard Endpoints**: 50 requests per 15 minutes
- **Write Operations**: 10 requests per minute
- **Delete/Close Operations**: 5 requests per minute

Global rate limit header: `X-RateLimit-Remaining`
