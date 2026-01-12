# Accounts Module API Documentation

## Overview

The Accounts Module manages financial account metadata, organization, analytics, and user-facing account features. It aggregates data from provider connections and displays account-level information to users.

**Module Path:** `src/modules/accounts/`

---

## Responsibility Boundaries

**Accounts Module Owns:**
- Account CRUD operations
- Account metadata (name, color, icon, tags, notes)
- Account lifecycle (ACTIVE, ARCHIVED, CLOSED)
- Account organization (grouping, favorites, primary designation)
- Account-level analytics and balance history
- Net worth tracking and calculation
- Account alerts (balance-based)
- User preferences and settings

**Accounts Module Consumes (Read-Only from Connections):**
- Current account balance (latest snapshot from provider)
- Last sync timestamp and status
- Transaction counts

---

## Supported Account Types (120+)

### Assets (86 types)
**Cash Accounts (14):** CHECKING, SAVINGS, HIGH_YIELD_SAVINGS, MONEY_MARKET, CERTIFICATE_OF_DEPOSIT, CASH_MANAGEMENT, PREPAID_CARD, FOREIGN_CURRENCY_ACCOUNT, DIGITAL_WALLET, MOBILE_WALLET, PAYMENT_PROCESSOR_BALANCE, CASH_ON_HAND, PETTY_CASH, ESCROW_ACCOUNT

**Investments (23):** BROKERAGE_ACCOUNT, RETIREMENT_401K, RETIREMENT_403B, RETIREMENT_457B, RETIREMENT_IRA_TRADITIONAL, RETIREMENT_IRA_ROTH, RETIREMENT_IRA_SEP, RETIREMENT_IRA_SIMPLE, PENSION, ANNUITY, EDUCATION_529_PLAN, MUTUAL_FUNDS, ETF, STOCKS, BONDS, TREASURY_SECURITIES, PRIVATE_EQUITY, HEDGE_FUND, COMMODITIES, REITS, FOREX, CROWDFUNDING_INVESTMENTS, STRUCTURED_PRODUCTS

**Real Estate (9):** PRIMARY_RESIDENCE, SECOND_HOME, RENTAL_PROPERTY, COMMERCIAL_PROPERTY, INDUSTRIAL_PROPERTY, LAND, FARM_RANCH, VACATION_PROPERTY, REAL_ESTATE_FRACTIONAL

**Vehicles (13):** CAR, MOTORCYCLE, TRUCK, SUV, VAN, ELECTRIC_VEHICLE, RV, BOAT, WATERCRAFT, AIRCRAFT, ATV, TRAILER, COMMERCIAL_VEHICLE

**Valuables (11):** JEWELRY, LUXURY_WATCHES, COLLECTIBLES, ARTWORK, ANTIQUES, PRECIOUS_METALS, RARE_COINS, RARE_STAMPS, FIREARMS, DESIGNER_LUXURY_ITEMS, MEMORABILIA

**Cryptocurrency (9):** CRYPTO_EXCHANGE_ACCOUNT, CRYPTO_WALLET_HOT, CRYPTO_WALLET_COLD, CRYPTO_DEFI_WALLET, CRYPTO_STAKING_ACCOUNT, CRYPTO_YIELD_FARMING, CRYPTO_NFT_COLLECTION, CRYPTO_TOKENIZED_ASSETS, CRYPTO_L2_WALLET

**Other Assets (12):** BUSINESS_OWNERSHIP, PRIVATE_SHARES, ROYALTY_RIGHTS, MINERAL_RIGHTS, INTELLECTUAL_PROPERTY, DOMAIN_NAMES, MUSIC_RIGHTS, INVENTORY, EQUIPMENT, LIVESTOCK, SECURITY_DEPOSIT_HELD, PREPAID_EXPENSE

### Liabilities (34 types)
**Credit Cards (7):** PERSONAL_CREDIT_CARD, BUSINESS_CREDIT_CARD, CORPORATE_CARD, STORE_CARD, SECURED_CREDIT_CARD, CHARGE_CARD, VIRTUAL_CREDIT_CARD

**Mortgages (7):** MORTGAGE_PRIMARY, MORTGAGE_SECOND_HOME, MORTGAGE_RENTAL, MORTGAGE_COMMERCIAL, HOME_EQUITY_LOAN, HELOC, REVERSE_MORTGAGE

**Loans (10):** PERSONAL_LOAN, AUTO_LOAN, STUDENT_LOAN, BUSINESS_LOAN, EQUIPMENT_LOAN, MEDICAL_LOAN, INSTALLMENT_LOAN, LINE_OF_CREDIT, PEER_TO_PEER_LOAN, CONSOLIDATION_LOAN

**Other Liabilities (10):** TAXES_PAYABLE, ACCOUNTS_PAYABLE, CHILD_SUPPORT, ALIMONY, LEGAL_JUDGMENT, SECURITY_DEPOSIT_OWED, UNPAID_BILLS, OVERDRAFT_BALANCE, INSURANCE_PREMIUM_FINANCING, BUSINESS_PAYABLE

---

## Account Status Lifecycle

```
ACTIVE ──────→ ARCHIVED (soft delete - reversible)
  │                ↓
  │          ACTIVE (reopen)
  │
  └─────────→ CLOSED (permanent - irreversible)
```

---

## API Endpoints

### 1. Account CRUD Operations

#### Create Account
```
POST /api/v1/accounts

Request:
{
  "accountSource": "MANUAL",
  "name": "My Checking Account",
  "displayName": "Primary Checking",
  "type": "CHECKING",
  "institutionName": "Chase Bank",
  "currentBalance": 5000.50,
  "availableBalance": 5000.50,
  "currency": "USD",
  "accountNumber": "****1234",
  "mask": "1234",
  "tags": ["primary", "checking"],
  "notes": "Main account",
  "color": "#4CAF50",
  "icon": "bank"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "acc_123456",
    "userId": "user_123",
    "organizationId": "org_123",
    "accountSource": "MANUAL",
    "name": "My Checking Account",
    "displayName": "Primary Checking",
    "type": "CHECKING",
    "status": "ACTIVE",
    "currentBalance": 5000.50,
    "availableBalance": 5000.50,
    "currency": "USD",
    "institutionName": "Chase Bank",
    "accountNumber": "****1234",
    "mask": "1234",
    "tags": ["primary", "checking"],
    "notes": "Main account",
    "color": "#4CAF50",
    "icon": "bank",
    "providerConnectionId": null,
    "createdAt": "2025-01-09T12:00:00Z",
    "updatedAt": "2025-01-09T12:00:00Z"
  }
}
```

---

#### Get All Accounts (Paginated)
```
GET /api/v1/accounts/d?page=1&limit=20&sortBy=created&status=ACTIVE

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "acc_123456",
      "name": "My Checking Account",
      "displayName": "Primary Checking",
      "type": "CHECKING",
      "status": "ACTIVE",
      "currentBalance": 5000.50,
      "availableBalance": 5000.50,
      "currency": "USD",
      "institutionName": "Chase Bank",
      "createdAt": "2025-01-09T12:00:00Z",
      "lastSyncAt": "2025-01-09T11:00:00Z",
      "lastSyncStatus": "SUCCESS"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - 'name' | 'balance' | 'created' (default: 'created')
- `status` - ACTIVE | ARCHIVED | CLOSED
- `type` - Account type filter
- `search` - Search by name

---

#### Get Grouped Accounts (Dashboard)
```
GET /api/v1/accounts

Response (200):
{
  "success": true,
  "data": {
    "summary": {
      "totalNetWorth": 250000.50,
      "totalAssets": 350000.00,
      "totalLiabilities": 99999.50,
      "accountCount": 15,
      "currency": "USD",
      "lastUpdated": "2025-01-09T12:00:00Z",
      "assetBreakdown": {
        "cash": 25000,
        "investments": 200000,
        "realEstate": 100000,
        "crypto": 15000,
        "vehicles": 10000,
        "other": 500
      },
      "liabilityBreakdown": {
        "creditCard": 15000,
        "mortgage": 75000,
        "loans": 9999.50
      }
    },
    "groups": {
      "cash": {
        "category": "CASH",
        "displayName": "Cash",
        "icon": "💰",
        "totalBalance": 25000,
        "accountCount": 2,
        "accounts": [
          {
            "id": "acc_123456",
            "name": "My Checking Account",
            "type": "CHECKING",
            "balance": 15000,
            "currency": "USD",
            "institutionName": "Chase Bank"
          }
        ]
      },
      "investments": {
        "category": "INVESTMENTS",
        "displayName": "Investments",
        "totalBalance": 200000,
        "accountCount": 3,
        "accounts": []
      }
    }
  }
}
```

**Features:**
- 5-minute Redis cache per user
- Automatic category grouping
- Includes crypto wallets in view

---

#### Get Single Account
```
GET /api/v1/accounts/:id

Response (200):
{
  "success": true,
  "data": {
    "id": "acc_123456",
    "userId": "user_123",
    "organizationId": "org_123",
    "accountSource": "MANUAL",
    "name": "My Checking Account",
    "displayName": "Primary Checking",
    "type": "CHECKING",
    "status": "ACTIVE",
    "isActive": true,
    "currentBalance": 5000.50,
    "availableBalance": 5000.50,
    "currency": "USD",
    "institutionName": "Chase Bank",
    "accountNumber": "****1234",
    "mask": "1234",
    "tags": ["primary", "checking"],
    "notes": "Main account",
    "color": "#4CAF50",
    "icon": "bank",
    "providerConnectionId": "conn_123",
    "providerAccountId": "plaid_acc_123",
    "lastSyncAt": "2025-01-09T11:00:00Z",
    "lastSyncStatus": "SUCCESS",
    "createdAt": "2025-01-09T12:00:00Z",
    "updatedAt": "2025-01-09T12:00:00Z"
  }
}
```

---

#### Update Account
```
PUT /api/v1/accounts/:id

Request:
{
  "displayName": "Updated Checking",
  "currentBalance": 6000.75,
  "availableBalance": 6000.75,
  "tags": ["primary", "updated"],
  "notes": "Recently updated",
  "color": "#2196F3"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "acc_123456",
    "displayName": "Updated Checking",
    "currentBalance": 6000.75,
    "tags": ["primary", "updated"],
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

---

#### Delete Account
```
DELETE /api/v1/accounts/:id

Response (200):
{
  "success": true,
  "message": "Account deleted successfully"
}

Restrictions:
- Cannot delete if account has transactions
- Use archive/close for accounts with data
```

---

### 2. Bulk Operations

#### Bulk Delete
```
POST /api/v1/accounts/bulk-delete

Request:
{
  "accountIds": ["acc_1", "acc_2", "acc_3"]
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 3,
    "totalDeleted": 3,
    "failed": [],
    "deletedIds": ["acc_1", "acc_2", "acc_3"]
  }
}

Limits: Max 1000 accounts, single transaction
```

---

#### Bulk Deactivate/Reactivate
```
POST /api/v1/accounts/bulk-deactivate
POST /api/v1/accounts/bulk-reactivate

Request:
{
  "accountIds": ["acc_1", "acc_2"]
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 2,
    "totalProcessed": 2,
    "failed": [],
    "processedIds": ["acc_1", "acc_2"]
  }
}
```

---

### 3. Account Lifecycle

#### Archive Account (Soft Delete)
```
POST /api/v1/accounts/:id/archive

Response (200):
{
  "success": true,
  "data": {
    "id": "acc_123456",
    "status": "ARCHIVED",
    "archivedAt": "2025-01-09T13:00:00Z"
  }
}

Features:
- Reversible (can reopen)
- Transactions preserved
- Hidden from default queries
```

---

#### Reopen Archived Account
```
POST /api/v1/accounts/:id/reopen

Response (200):
{
  "success": true,
  "data": {
    "id": "acc_123456",
    "status": "ACTIVE",
    "archivedAt": null
  }
}
```

---

#### Close Account (Permanent)
```
POST /api/v1/accounts/:id/close

Response (200):
{
  "success": true,
  "data": {
    "id": "acc_123456",
    "status": "CLOSED",
    "closedAt": "2025-01-09T13:00:00Z"
  }
}

Warning: PERMANENT - Cannot be reopened
```

---

#### Bulk Archive/Reopen/Close
```
POST /api/v1/accounts/bulk-archive
POST /api/v1/accounts/bulk-reopen
POST /api/v1/accounts/bulk-close

Request:
{
  "accountIds": ["acc_1", "acc_2", "acc_3"]
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 3,
    "totalProcessed": 3,
    "failed": [],
    "processedIds": ["acc_1", "acc_2", "acc_3"]
  }
}
```

---

#### Get Account Lifecycle History
```
GET /api/v1/accounts/:id/lifecycle-history

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "event_1",
      "accountId": "acc_123456",
      "eventType": "CREATED",
      "fromStatus": null,
      "toStatus": "ACTIVE",
      "timestamp": "2025-01-01T10:00:00Z"
    },
    {
      "id": "event_2",
      "eventType": "ARCHIVED",
      "fromStatus": "ACTIVE",
      "toStatus": "ARCHIVED",
      "timestamp": "2025-01-08T15:30:00Z"
    }
  ]
}
```

---

### 4. Account Balance & History

#### Get Account Balance
```
GET /api/v1/accounts/:id/balance

Response (200):
{
  "success": true,
  "data": {
    "accountId": "acc_123456",
    "currentBalance": 5000.50,
    "availableBalance": 5000.50,
    "currency": "USD",
    "lastUpdated": "2025-01-09T12:00:00Z"
  }
}
```

---

#### Get Balance History
```
GET /api/v1/accounts/:id/history?dateFrom=2025-01-01&dateTo=2025-01-09&limit=100

Response (200):
{
  "success": true,
  "data": [
    {
      "date": "2025-01-09",
      "balance": 5000.50,
      "availableBalance": 5000.50,
      "currency": "USD"
    },
    {
      "date": "2025-01-08",
      "balance": 4950.25,
      "availableBalance": 4950.25,
      "currency": "USD"
    }
  ],
  "metadata": {
    "total": 45,
    "limit": 100,
    "offset": 0
  }
}
```

---

#### Get Account Chart Data
```
GET /api/v1/accounts/:id/chart?period=MONTH

Response (200):
{
  "success": true,
  "data": {
    "accountId": "acc_123456",
    "period": "MONTH",
    "startDate": "2024-12-09",
    "endDate": "2025-01-09",
    "dataPoints": [
      {
        "date": "2024-12-09",
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
      "averageBalance": 4750.25
    }
  }
}
```

---

#### Get Account Statistics
```
GET /api/v1/accounts/stats

Response (200):
{
  "success": true,
  "data": {
    "totalAccounts": 15,
    "activeAccounts": 12,
    "archivedAccounts": 2,
    "closedAccounts": 1,
    "totalBalance": 250000.50,
    "accountsByType": {
      "CHECKING": 2,
      "SAVINGS": 1,
      "RETIREMENT_401K": 2,
      "MORTGAGE_PRIMARY": 1
    },
    "accountsByStatus": {
      "ACTIVE": 12,
      "ARCHIVED": 2,
      "CLOSED": 1
    },
    "accountsByCategory": {
      "CASH": 3,
      "INVESTMENTS": 8,
      "MORTGAGE": 1,
      "CRYPTO": 2,
      "REAL_ESTATE": 1
    }
  }
}
```

---

### 5. Net Worth Management

#### Create Net Worth Snapshot
```
POST /api/v1/accounts/networth/snapshot

Request:
{
  "snapshotDate": "2025-01-09T12:00:00Z",
  "granularity": "DAILY",
  "currency": "USD",
  "metadata": {
    "source": "manual",
    "notes": "End of month snapshot"
  }
}

Response (201):
{
  "success": true,
  "data": {
    "id": "snapshot_123456",
    "userId": "user_123",
    "snapshotDate": "2025-01-09",
    "granularity": "DAILY",
    "totalNetWorth": 250000.50,
    "totalAssets": 350000.00,
    "totalLiabilities": 99999.50,
    "cashValue": 25000,
    "creditCardDebt": 15000,
    "investmentValue": 200000,
    "cryptoValue": 15000,
    "realEstateValue": 100000,
    "vehicleValue": 10000,
    "otherAssetValue": 500,
    "loanDebt": 9999.50,
    "mortgageDebt": 75000,
    "dayChange": 500.50,
    "weekChange": 1500.00,
    "monthChange": 5000.00,
    "dayChangePct": 0.2,
    "weekChangePct": 0.6,
    "monthChangePct": 2.04,
    "currency": "USD",
    "createdAt": "2025-01-09T12:00:00Z"
  }
}
```

---

#### Get Latest Net Worth Snapshot
```
GET /api/v1/accounts/networth/latest

Response (200):
{
  "success": true,
  "data": {
    "id": "snapshot_123456",
    "snapshotDate": "2025-01-09",
    "totalNetWorth": 250000.50,
    "totalAssets": 350000.00,
    "totalLiabilities": 99999.50,
    "currency": "USD"
  }
}
```

---

#### Get Net Worth Snapshot by ID
```
GET /api/v1/accounts/networth/snapshot/:id

Response (200):
{
  "success": true,
  "data": {
    "id": "snapshot_123456",
    "totalNetWorth": 250000.50,
    "totalAssets": 350000.00,
    "totalLiabilities": 99999.50,
    // ... full snapshot data
  }
}
```

---

#### Get Net Worth Trend
```
GET /api/v1/accounts/networth/trend?period=MONTH

Response (200):
{
  "success": true,
  "data": {
    "period": "MONTH",
    "snapshots": [
      {
        "id": "snapshot_1",
        "snapshotDate": "2024-12-09",
        "totalNetWorth": 245000.00,
        "totalAssets": 345000.00,
        "totalLiabilities": 100000.00
      },
      {
        "id": "snapshot_3",
        "snapshotDate": "2025-01-09",
        "totalNetWorth": 250000.50,
        "totalAssets": 350000.00,
        "totalLiabilities": 99999.50
      }
    ],
    "startValue": 245000.00,
    "endValue": 250000.50,
    "change": 5000.50,
    "changePercent": 2.04
  }
}
```

---

#### Get Net Worth Breakdown
```
GET /api/v1/accounts/networth/breakdown

Response (200):
{
  "success": true,
  "data": {
    "totalNetWorth": 250000.50,
    "totalAssets": 350000.00,
    "totalLiabilities": 99999.50,
    "assetBreakdown": {
      "cash": 25000,
      "investments": 200000,
      "crypto": 15000,
      "realEstate": 100000,
      "vehicles": 10000,
      "other": 500
    },
    "liabilityBreakdown": {
      "creditCard": 15000,
      "loans": 9999.50,
      "mortgage": 75000
    }
  }
}
```

---

## Data Types

### AccountStatus
```typescript
enum AccountStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  CLOSED = 'CLOSED'
}
```

### CreateAccountInput
```typescript
{
  accountSource: 'MANUAL' | 'PLAID' | 'TELLER' | 'MX'
  name: string                  // Required
  displayName?: string
  type: AccountType            // One of 120+ types
  institutionName?: string
  currentBalance?: number
  availableBalance?: number
  currency?: string            // Default: USD
  accountNumber?: string       // Masked
  mask?: string               // Last 4 digits
  tags?: string[]
  notes?: string
  color?: string              // Hex color
  icon?: string               // Icon name
}
```

### AccountData
```typescript
{
  id: string
  userId: string
  organizationId?: string
  accountSource: string
  name: string
  displayName?: string
  type: AccountType
  status: AccountStatus
  currentBalance: number
  availableBalance: number
  currency: string
  institutionName?: string
  accountNumber?: string
  mask?: string
  tags: string[]
  notes?: string
  color?: string
  icon?: string
  providerConnectionId?: string      // From Connections module
  providerAccountId?: string
  lastSyncAt?: DateTime              // From Connections module
  lastSyncStatus?: string            // From Connections module
  archivedAt?: DateTime
  closedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Features

### Account Grouping
- Automatic category-based grouping
- 5-minute cache per user
- Includes crypto wallets
- Parallel data fetching

### Event-Driven Architecture
- Event bus for all operations
- Bulk operation event support
- Downstream processing

### Performance
- Bulk operations with transaction support
- Batch queries (no N+1)
- Redis caching for grouped accounts
- Indexed queries

### Multi-Tenancy
- Organization-based isolation
- User-organization relationships
- Proper authorization checks

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_ACCOUNT_TYPE | 400 | Account type not supported |
| INVALID_INPUT | 400 | Validation failed |
| ACCOUNT_NOT_FOUND | 404 | Account doesn't exist |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Insufficient permissions |
| PLAN_LIMIT_EXCEEDED | 403 | Too many accounts for plan |
| DATABASE_ERROR | 500 | Database operation failed |

---

## Authentication

All endpoints require:
- **JWT Bearer Token** in `Authorization` header
- **Organization ID** from Better Auth session
- **User ID** from JWT payload

---

### 6. Exchange Rates & Multi-Currency

#### Get Exchange Rate
```
GET /api/v1/accounts/exchange-rates?from=USD&to=EUR

Query Parameters:
- from: Base currency code (required)
- to: Target currency code (required)
- date: Historical date (optional, ISO format)

Response (200):
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "EUR",
    "rate": 0.92,
    "date": "2025-01-09T12:00:00Z",
    "source": "zapper"
  }
}
```

#### Convert Currency Amount
```
POST /api/v1/accounts/exchange-rates/convert

Request:
{
  "amount": 1000,
  "from": "USD",
  "to": "EUR",
  "date": "2025-01-09"
}

Response (200):
{
  "success": true,
  "data": {
    "originalAmount": 1000,
    "originalCurrency": "USD",
    "convertedAmount": 920.00,
    "targetCurrency": "EUR",
    "rate": 0.92,
    "timestamp": "2025-01-09T12:00:00Z"
  }
}
```

#### Get Net Worth in Specific Currency
```
GET /api/v1/accounts/networth/currency/:currency

Response (200):
{
  "success": true,
  "data": {
    "currency": "EUR",
    "totalNetWorth": 230000.46,
    "totalAssets": 322000.00,
    "totalLiabilities": 91999.54,
    "conversionRate": 0.92,
    "baseCurrency": "USD",
    "timestamp": "2025-01-09T12:00:00Z"
  }
}
```

#### Refresh Exchange Rate Cache
```
POST /api/v1/accounts/exchange-rates/refresh

Response (200):
{
  "success": true,
  "message": "Cache cleared, rates will be refreshed on next request"
}
```

#### Get Cache Statistics
```
GET /api/v1/accounts/exchange-rates/cache-stats

Response (200):
{
  "success": true,
  "data": {
    "cachedRates": 45,
    "oldestCacheAge": "1800000ms",
    "newestCacheAge": "5000ms",
    "cacheSize": "45 entries"
  }
}
```

**Features:**
- Zapper public API (free, 130+ currencies)
- 3-tier caching: memory (1-hour TTL) → database → API
- Historical rate retrieval with fallback
- Decimal.js for precision
- Real-time multi-currency net worth

---

### 7. Account Grouping & Favorites

#### List User Groups
```
GET /api/v1/accounts/groups

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "grp_123456",
      "name": "Investment Accounts",
      "description": "All investment portfolios",
      "accountCount": 5,
      "totalBalance": 200000.00,
      "createdAt": "2025-01-09T12:00:00Z"
    }
  ]
}
```

#### Create Account Group
```
POST /api/v1/accounts/groups

Request:
{
  "name": "Investment Accounts",
  "description": "All investment portfolios"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "grp_123456",
    "name": "Investment Accounts",
    "description": "All investment portfolios",
    "accountCount": 0,
    "createdAt": "2025-01-09T12:00:00Z"
  }
}
```

#### Add Account to Group
```
POST /api/v1/accounts/groups/:groupId/members

Request:
{
  "accountId": "acc_123456"
}

Response (200):
{
  "success": true,
  "data": {
    "groupId": "grp_123456",
    "accountId": "acc_123456",
    "addedAt": "2025-01-09T12:00:00Z"
  }
}
```

#### Remove Account from Group
```
DELETE /api/v1/accounts/groups/:groupId/members/:accountId

Response (200):
{
  "success": true,
  "message": "Account removed from group"
}
```

#### Get Group Summary
```
GET /api/v1/accounts/groups/:groupId/summary

Response (200):
{
  "success": true,
  "data": {
    "id": "grp_123456",
    "name": "Investment Accounts",
    "accountCount": 5,
    "totalBalance": 200000.00,
    "accounts": [
      {
        "id": "acc_123",
        "name": "401k",
        "type": "RETIREMENT_401K",
        "balance": 100000.00
      }
    ]
  }
}
```

#### Mark Account as Favorite
```
PUT /api/v1/accounts/:accountId/favorite

Response (200):
{
  "success": true,
  "data": {
    "accountId": "acc_123456",
    "isFavorite": true,
    "markedAt": "2025-01-09T12:00:00Z"
  }
}
```

#### Remove Account from Favorites
```
DELETE /api/v1/accounts/:accountId/favorite

Response (200):
{
  "success": true,
  "message": "Account removed from favorites"
}
```

#### Get All Favorite Accounts
```
GET /api/v1/accounts/favorites

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "acc_123456",
      "name": "Primary Checking",
      "type": "CHECKING",
      "balance": 5000.50,
      "markedAt": "2025-01-09T12:00:00Z"
    }
  ]
}
```

**Features:**
- Custom user-defined groups
- Favorites for quick access
- Group balance calculations
- Hierarchical support with circular reference prevention
- Full CRUD operations

---

## See Also

- [CONNECTIONS.md](./CONNECTIONS.md) - Provider integration API & Real-time updates
- [TRANSACTIONS.md](./TRANSACTIONS.md) - Transaction management & attachments
