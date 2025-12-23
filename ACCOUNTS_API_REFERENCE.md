# Accounts Module API Reference

Complete API documentation for the Accounts Module with all endpoints, request/response schemas, and usage examples.

**Base URL:** `/api/v1/accounts`
**Authentication:** Bearer JWT token (required for all endpoints)
**Organization Context:** All endpoints require `organizationId` header or middleware extraction

---

## Table of Contents

1. [Account CRUD Operations](#account-crud-operations)
2. [Account Bulk Operations](#account-bulk-operations)
3. [Account Queries](#account-queries)
4. [Net Worth Snapshots](#net-worth-snapshots)
5. [Error Handling](#error-handling)
6. [Event Emissions](#event-emissions)

---

## Account CRUD Operations

### POST /accounts - Create Account

Creates a new financial account for the authenticated user.

**Endpoint:** `POST /api/v1/accounts`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  // Required
  accountSource: "MANUAL" | "LINKED",           // Account source type
  name: string,                                  // Account name (1-100 chars)
  type: AccountType,                             // One of 120+ account types

  // Optional
  displayName?: string,                          // Display name for UI
  subtype?: string,                              // Additional type classification
  institutionName?: string,                      // Bank/provider name
  currentBalance?: number,                       // Current balance
  availableBalance?: number,                     // Available balance
  currency?: string,                             // Currency code (default: USD)
  accountNumber?: string,                        // Account number (masked)
  routingNumber?: string,                        // Routing number (US)
  mask?: string,                                 // Last 4 digits
  status?: "ACTIVE" | "CLOSED" | "ARCHIVED",    // Account status
  isActive?: boolean,                            // Active flag (default: true)
  groupId?: string,                              // Account group ID
  tags?: string[],                               // Custom tags
  notes?: string,                                // User notes
  color?: string,                                // UI color (hex)
  icon?: string,                                 // UI icon emoji/name
  address?: string,                              // Property address
  city?: string,                                 // City
  state?: string,                                // State/province
  postalCode?: string,                           // Postal code
  country?: string                               // Country code
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    id: string,
    userId: string,
    organizationId: string,
    accountSource: "MANUAL" | "LINKED",
    name: string,
    displayName: string | null,
    type: AccountType,
    currentBalance: Decimal,
    availableBalance: Decimal,
    currency: string,
    status: "ACTIVE" | "CLOSED" | "ARCHIVED",
    isActive: boolean,
    tags: string[],
    notes: string | null,
    color: string | null,
    icon: string | null,
    createdAt: Date,
    updatedAt: Date,
    // ... additional fields
  }
}
```

**Error Responses:**
```typescript
// 400 Bad Request - Missing organization
{
  success: false,
  error: "Organization context is required",
  code: "INVALID_INPUT"
}

// 400 Bad Request - Duplicate account
{
  success: false,
  error: "Account with name 'My Checking' already exists",
  code: "ACCOUNT_ALREADY_EXISTS"
}

// 401 Unauthorized
{
  success: false,
  error: "Unauthorized",
  code: "UNAUTHORIZED"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "accountSource": "MANUAL",
    "name": "My Checking Account",
    "type": "CHECKING",
    "currentBalance": 5000,
    "currency": "USD",
    "institutionName": "Bank of America"
  }'
```

---

### GET /accounts/d - List Accounts

Retrieves paginated list of accounts with filtering and sorting options.

**Endpoint:** `GET /api/v1/accounts/d`

**Query Parameters:**
```typescript
{
  page?: number,                    // Page number (default: 1)
  limit?: number,                   // Results per page (default: 20, max: 100)
  sortBy?: "name" | "balance" | "created",  // Sort field (default: name)
  accountSource?: "MANUAL" | "LINKED",      // Filter by source
  type?: AccountType,               // Filter by type
  status?: "ACTIVE" | "CLOSED" | "ARCHIVED",
  isActive?: boolean,               // Filter by active status
  groupId?: string,                 // Filter by group
  search?: string                   // Search by name/displayName/institutionName
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      name: string,
      displayName: string | null,
      type: AccountType,
      currentBalance: Decimal,
      status: "ACTIVE" | "CLOSED" | "ARCHIVED",
      isActive: boolean,
      accountSource: "MANUAL" | "LINKED",
      institutionName: string | null,
      institutionLogo?: string,
      institutionUrl?: string,
      createdAt: Date,
      updatedAt: Date,
      // ... additional fields
    },
    // ... more accounts
  ],
  pagination: {
    total: number,      // Total account count
    page: number,       // Current page
    limit: number,      // Items per page
    pages: number       // Total pages
  }
}
```

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/accounts/d?page=1&limit=20&sortBy=balance&status=ACTIVE" \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### GET /accounts/:id - Get Account by ID

Retrieves a single account by ID.

**Endpoint:** `GET /api/v1/accounts/:id`

**Path Parameters:**
```typescript
{
  id: string  // Account ID (UUID)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    id: string,
    name: string,
    displayName: string | null,
    type: AccountType,
    currentBalance: Decimal,
    availableBalance: Decimal,
    currency: string,
    status: "ACTIVE" | "CLOSED" | "ARCHIVED",
    isActive: boolean,
    accountSource: "MANUAL" | "LINKED",
    institutionName: string | null,
    createdAt: Date,
    updatedAt: Date,
    // ... additional fields
  }
}
```

**Error Response (404 Not Found):**
```typescript
{
  success: false,
  error: "Account not found",
  code: "ACCOUNT_NOT_FOUND"
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/v1/accounts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### PUT /accounts/:id - Update Account

Updates an existing account with new values.

**Endpoint:** `PUT /api/v1/accounts/:id`

**Path Parameters:**
```typescript
{
  id: string  // Account ID (UUID)
}
```

**Request Body:**
```typescript
{
  displayName?: string,
  currentBalance?: number,
  availableBalance?: number,
  status?: "ACTIVE" | "CLOSED" | "ARCHIVED",
  isActive?: boolean,
  groupId?: string,
  tags?: string[],
  notes?: string,
  color?: string,
  icon?: string
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    id: string,
    name: string,
    displayName: string | null,
    currentBalance: Decimal,
    availableBalance: Decimal,
    status: "ACTIVE" | "CLOSED" | "ARCHIVED",
    isActive: boolean,
    tags: string[],
    notes: string | null,
    updatedAt: Date,
    // ... additional fields
  }
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/accounts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Primary Checking",
    "currentBalance": 7500,
    "tags": ["primary", "paycheck"],
    "color": "#2563eb"
  }'
```

---

### DELETE /accounts/:id - Delete Account

Deletes an account permanently. Cannot delete accounts with associated transactions.

**Endpoint:** `DELETE /api/v1/accounts/:id`

**Path Parameters:**
```typescript
{
  id: string  // Account ID (UUID)
}
```

**Response (204 No Content):**
```
(empty response body)
```

**Error Response (400 Bad Request):**
```typescript
{
  success: false,
  error: "Cannot delete account with associated transactions",
  code: "INVALID_INPUT"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/accounts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Account Bulk Operations

### POST /accounts/bulk-delete - Bulk Delete Accounts

Efficiently deletes multiple accounts in a single transaction. Returns detailed results for each account.

**Endpoint:** `POST /api/v1/accounts/bulk-delete`

**Request Body:**
```typescript
{
  accountIds: string[]  // Array of account IDs (1-1000 accounts)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    successCount: number,  // Number of successfully deleted accounts
    failedCount: number,   // Number of failed deletions
    results: [
      {
        id: string,        // Account ID
        success: boolean,  // Deletion success status
        error?: string     // Error message if failed
      },
      // ... one result per account
    ]
  }
}
```

**Request Validation Errors:**
```typescript
// 400 Bad Request - Empty array
{
  success: false,
  error: "accountIds array is required and must not be empty",
  code: "INVALID_INPUT"
}

// 400 Bad Request - Too many accounts
{
  success: false,
  error: "Cannot delete more than 1000 accounts at once",
  code: "INVALID_INPUT"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts/bulk-delete \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "accountIds": [
      "550e8400-e29b-41d4-a716-446655440000",
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002"
    ]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "successCount": 2,
    "failedCount": 1,
    "results": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "success": true
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "success": false,
        "error": "Account has associated transactions"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "success": true
      }
    ]
  }
}
```

---

### POST /accounts/bulk-deactivate - Bulk Deactivate Accounts

Deactivates multiple accounts (sets `isActive: false` and `status: ARCHIVED`). Enables recovery without data loss.

**Endpoint:** `POST /api/v1/accounts/bulk-deactivate`

**Request Body:**
```typescript
{
  accountIds: string[]  // Array of account IDs (1-1000 accounts)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    successCount: number,  // Number of successfully deactivated accounts
    failedCount: number,   // Number of failed deactivations
    results: [
      {
        id: string,        // Account ID
        success: boolean,  // Deactivation success status
        error?: string     // Error message if failed
      },
      // ... one result per account
    ]
  }
}
```

**Possible Error Cases:**
- Account not found
- Account already deactivated
- Authorization failure

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts/bulk-deactivate \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "accountIds": [
      "550e8400-e29b-41d4-a716-446655440000",
      "550e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "successCount": 2,
    "failedCount": 0,
    "results": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "success": true
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "success": true
      }
    ]
  }
}
```

---

### POST /accounts/bulk-reactivate - Bulk Reactivate Accounts

Reactivates multiple deactivated accounts (sets `isActive: true` and `status: ACTIVE`).

**Endpoint:** `POST /api/v1/accounts/bulk-reactivate`

**Request Body:**
```typescript
{
  accountIds: string[]  // Array of account IDs (1-1000 accounts)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    successCount: number,  // Number of successfully reactivated accounts
    failedCount: number,   // Number of failed reactivations
    results: [
      {
        id: string,        // Account ID
        success: boolean,  // Reactivation success status
        error?: string     // Error message if failed
      },
      // ... one result per account
    ]
  }
}
```

**Possible Error Cases:**
- Account not found
- Account already active
- Authorization failure

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts/bulk-reactivate \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "accountIds": [
      "550e8400-e29b-41d4-a716-446655440000"
    ]
  }'
```

---

## Account Queries

### GET /accounts - Get Grouped Accounts

Retrieves all active accounts grouped by category (assets/liabilities) with summary statistics and caching.

**Endpoint:** `GET /api/v1/accounts`

**Query Parameters:** None (caches for 5 minutes per user/organization)

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    summary: {
      totalNetWorth: number,           // Total assets - liabilities
      totalAssets: number,             // Sum of all asset categories
      totalLiabilities: number,        // Sum of all liability categories
      accountCount: number,            // Total active accounts
      currency: string,                // Currency (default: USD)
      lastUpdated: Date,               // Timestamp of last update
      assetBreakdown: {
        [category: string]: number     // Balance by asset category
      },
      liabilityBreakdown: {
        [category: string]: number     // Balance by liability category
      }
    },
    groups: {
      // Asset Categories
      CASH?: {
        category: "CASH",
        displayName: "Cash & Savings",
        icon: "💰",
        totalBalance: number,
        accountCount: number,
        accounts: UnifiedAccount[]
      },
      INVESTMENTS?: {
        category: "INVESTMENTS",
        displayName: "Investments",
        icon: "📈",
        // ... same structure
      },
      REAL_ESTATE?: { /* ... */ },
      VEHICLE?: { /* ... */ },
      VALUABLES?: { /* ... */ },
      CRYPTO?: { /* ... */ },
      OTHER_ASSET?: { /* ... */ },

      // Liability Categories
      CREDIT_CARD?: {
        category: "CREDIT_CARD",
        displayName: "Credit Cards",
        icon: "💳",
        // ... same structure
      },
      MORTGAGE?: { /* ... */ },
      LOAN?: { /* ... */ },
      OTHER_LIABILITY?: { /* ... */ }
    }
  }
}
```

**Cache Behavior:**
- Results cached for 5 minutes per user/organization combination
- Cache invalidated on account create/update/delete/bulk operations
- Includes both financial accounts and crypto wallets

**Example Request:**
```bash
curl http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### GET /accounts/:id/balance - Get Account Balance

Retrieves current balance information for a specific account.

**Endpoint:** `GET /api/v1/accounts/:id/balance`

**Path Parameters:**
```typescript
{
  id: string  // Account ID (UUID)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    accountId: string,
    currentBalance: number,
    availableBalance: number,
    currency: string
  }
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/v1/accounts/550e8400-e29b-41d4-a716-446655440000/balance \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### GET /accounts/stats - Get Account Statistics

Returns aggregate statistics across all user accounts.

**Endpoint:** `GET /api/v1/accounts/stats`

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    totalAccounts: number,        // Total account count
    activeAccounts: number,       // Active account count
    totalBalance: number,         // Sum of all current balances
    accountsByType: {
      [accountType: string]: number  // Count by type
    },
    accountsByStatus: {
      "ACTIVE": number,
      "CLOSED": number,
      "ARCHIVED": number
    }
  }
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/v1/accounts/stats \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Net Worth Snapshots

### POST /accounts/networth/snapshot - Create Snapshot

Creates a net worth snapshot at current moment or specified date.

**Endpoint:** `POST /api/v1/accounts/networth/snapshot`

**Request Body:**
```typescript
{
  snapshotDate?: Date,                              // Snapshot date (default: now)
  granularity?: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY",  // Granularity (default: DAILY)
  currency?: string,                                // Currency (default: USD)
  metadata?: Record<string, any>                    // Custom metadata
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    id: string,
    userId: string,
    organizationId: string,
    snapshotDate: Date,
    granularity: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY",
    totalNetWorth: number,
    totalAssets: number,
    totalLiabilities: number,
    cashValue: number,
    investmentValue: number,
    cryptoValue: number,
    realEstateValue: number,
    vehicleValue: number,
    otherAssetValue: number,
    creditCardDebt: number,
    loanDebt: number,
    mortgageDebt: number,
    dayChange?: number,
    weekChange?: number,
    monthChange?: number,
    quarterChange?: number,
    ytdChange?: number,
    yearChange?: number,
    dayChangePct?: number,
    weekChangePct?: number,
    monthChangePct?: number,
    quarterChangePct?: number,
    ytdChangePct?: number,
    yearChangePct?: number,
    currency: string,
    metadata?: Record<string, any>,
    createdAt: Date
  }
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/accounts/networth/snapshot \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "snapshotDate": "2025-01-22T00:00:00Z",
    "granularity": "MONTHLY",
    "metadata": {
      "notes": "Month-end review"
    }
  }'
```

---

### GET /accounts/networth/snapshot/:id - Get Snapshot by ID

Retrieves a specific net worth snapshot.

**Endpoint:** `GET /api/v1/accounts/networth/snapshot/:id`

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    id: string,
    snapshotDate: Date,
    totalNetWorth: number,
    totalAssets: number,
    totalLiabilities: number,
    // ... all fields from creation response
  }
}
```

---

### GET /accounts/networth/latest - Get Latest Snapshot

Retrieves the most recent net worth snapshot.

**Endpoint:** `GET /api/v1/accounts/networth/latest`

**Query Parameters:**
```typescript
{
  granularity?: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"  // Filter by granularity
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    // ... net worth snapshot data
  }
}
```

---

### GET /accounts/networth/trend - Get Net Worth Trend

Analyzes net worth changes over a specified period.

**Endpoint:** `GET /api/v1/accounts/networth/trend`

**Query Parameters:**
```typescript
{
  period?: "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR"  // Analysis period (default: MONTH)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    period: "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR",
    snapshots: NetWorthSnapshotData[],
    startValue: number,      // Starting net worth
    endValue: number,        // Ending net worth
    change: number,          // Absolute change
    changePercent: number    // Percentage change
  }
}
```

---

### GET /accounts/networth/breakdown - Get Net Worth Breakdown

Calculates asset and liability breakdown by category.

**Endpoint:** `GET /api/v1/accounts/networth/breakdown`

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    totalNetWorth: number,
    totalAssets: number,
    totalLiabilities: number,
    assetBreakdown: {
      cash: number,
      investments: number,
      crypto: number,
      realEstate: number,
      vehicles: number,
      valuables: number,
      other: number
    },
    liabilityBreakdown: {
      creditCard: number,
      loans: number,
      mortgage: number,
      other: number
    }
  }
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow a consistent response format:

```typescript
{
  success: false,
  error: string,           // User-friendly error message
  code: string,            // Machine-readable error code
  statusCode?: number,     // HTTP status code
  details?: Record<string, any>  // Optional context
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | User lacks permission for action |
| `INVALID_INPUT` | 400 | Invalid request parameters |
| `ACCOUNT_NOT_FOUND` | 404 | Account does not exist |
| `ACCOUNT_ALREADY_EXISTS` | 409 | Account with same name already exists |
| `ACCOUNT_INVALID_TYPE` | 400 | Invalid account type provided |
| `ACCOUNT_ARCHIVED` | 400 | Operation not allowed on archived account |
| `SNAPSHOT_NOT_FOUND` | 404 | Snapshot does not exist |
| `SNAPSHOT_CALCULATION_FAILED` | 500 | Failed to calculate snapshot |

---

## Event Emissions

The accounts module emits events for various operations. These can be subscribed to by other modules.

### Account Events

```typescript
// Single account operations
interface AccountCreatedEvent {
  type: 'account_created',
  accountId: string,
  userId: string,
  organizationId: string,
  accountType: string,
  timestamp: Date
}

interface AccountUpdatedEvent {
  type: 'account_updated',
  accountId: string,
  userId: string,
  organizationId: string,
  changes: Record<string, any>,
  timestamp: Date
}

interface AccountDeletedEvent {
  type: 'account_deleted',
  accountId: string,
  userId: string,
  organizationId: string,
  timestamp: Date
}

// Bulk operations
interface BulkAccountsDeletedEvent {
  type: 'bulk_accounts_deleted',
  accountIds: string[],
  userId: string,
  organizationId: string,
  successCount: number,
  failedCount: number,
  timestamp: Date
}

interface BulkAccountsDeactivatedEvent {
  type: 'bulk_accounts_deactivated',
  accountIds: string[],
  userId: string,
  organizationId: string,
  successCount: number,
  failedCount: number,
  timestamp: Date
}

interface BulkAccountsReactivatedEvent {
  type: 'bulk_accounts_reactivated',
  accountIds: string[],
  userId: string,
  organizationId: string,
  successCount: number,
  failedCount: number,
  timestamp: Date
}
```

### Event Subscription Example

```typescript
import { accountEventBus } from '@/modules/accounts';

// Listen for bulk delete events
accountEventBus.onBulkAccountsDeleted((event) => {
  console.log(`${event.successCount} accounts deleted for user ${event.userId}`);
  // Trigger cleanup, update dashboards, etc.
});

// Listen for bulk deactivation events
accountEventBus.onBulkAccountsDeactivated((event) => {
  console.log(`${event.successCount} accounts deactivated`);
});
```

---

## Performance Considerations

### Bulk Operations

- **Max Batch Size:** 1000 accounts per request
- **Execution:** Uses database transactions for consistency
- **Cache Invalidation:** Automatic for user/organization
- **Event Emission:** After transaction completion
- **Recommended:** Process 100-500 accounts per request for optimal performance

### Grouped Accounts Query

- **Caching:** 5-minute TTL per user/organization
- **Query Optimization:** Parallel fetching of financial accounts and crypto wallets
- **Data Included:** All active accounts only
- **Performance:** ~100-200ms for typical user (100-500 accounts)

### Net Worth Snapshots

- **Storage:** One record per unique combination of granularity and date
- **Calculation:** On-demand or automatic via transaction sync event
- **Precision:** Decimal type (15,2) for financial accuracy
- **Historical:** Supports trend analysis over any period

---

## Account Types Reference

The module supports 120+ account types organized by category:

### Asset Categories

**Cash:** CHECKING, SAVINGS, HIGH_YIELD_SAVINGS, MONEY_MARKET, CERTIFICATE_OF_DEPOSIT, CASH_MANAGEMENT, PREPAID_CARD, FOREIGN_CURRENCY_ACCOUNT, DIGITAL_WALLET, MOBILE_WALLET, PAYMENT_PROCESSOR_BALANCE, CASH_ON_HAND, PETTY_CASH, ESCROW_ACCOUNT

**Investments:** BROKERAGE_ACCOUNT, RETIREMENT_401K, RETIREMENT_403B, RETIREMENT_457B, RETIREMENT_IRA_TRADITIONAL, RETIREMENT_IRA_ROTH, RETIREMENT_IRA_SEP, RETIREMENT_IRA_SIMPLE, PENSION, ANNUITY, EDUCATION_529_PLAN, MUTUAL_FUNDS, ETF, STOCKS, BONDS, TREASURY_SECURITIES, PRIVATE_EQUITY, HEDGE_FUND, COMMODITIES, REITS, FOREX, CROWDFUNDING_INVESTMENTS, STRUCTURED_PRODUCTS

**Real Estate:** PRIMARY_RESIDENCE, SECOND_HOME, RENTAL_PROPERTY, COMMERCIAL_PROPERTY, INDUSTRIAL_PROPERTY, LAND, FARM_RANCH, VACATION_PROPERTY, REAL_ESTATE_FRACTIONAL

**Vehicles:** CAR, MOTORCYCLE, TRUCK, SUV, VAN, ELECTRIC_VEHICLE, RV, BOAT, WATERCRAFT, AIRCRAFT, ATV, TRAILER, COMMERCIAL_VEHICLE

**Valuables:** JEWELRY, LUXURY_WATCHES, COLLECTIBLES, ARTWORK, ANTIQUES, PRECIOUS_METALS, RARE_COINS, RARE_STAMPS, FIREARMS, DESIGNER_LUXURY_ITEMS, MEMORABILIA

**Crypto:** CRYPTO_EXCHANGE_ACCOUNT, CRYPTO_WALLET_HOT, CRYPTO_WALLET_COLD, CRYPTO_DEFI_WALLET, CRYPTO_STAKING_ACCOUNT, CRYPTO_YIELD_FARMING, CRYPTO_NFT_COLLECTION, CRYPTO_TOKENIZED_ASSETS, CRYPTO_L2_WALLET

**Other Assets:** BUSINESS_OWNERSHIP, PRIVATE_SHARES, ROYALTY_RIGHTS, MINERAL_RIGHTS, INTELLECTUAL_PROPERTY, DOMAIN_NAMES, MUSIC_RIGHTS, INVENTORY, EQUIPMENT, LIVESTOCK, SECURITY_DEPOSIT_HELD, PREPAID_EXPENSE

### Liability Categories

**Credit Cards:** PERSONAL_CREDIT_CARD, BUSINESS_CREDIT_CARD, CORPORATE_CARD, STORE_CARD, SECURED_CREDIT_CARD, CHARGE_CARD, VIRTUAL_CREDIT_CARD

**Mortgages:** MORTGAGE_PRIMARY, MORTGAGE_SECOND_HOME, MORTGAGE_RENTAL, MORTGAGE_COMMERCIAL, HOME_EQUITY_LOAN, HELOC, REVERSE_MORTGAGE

**Loans:** PERSONAL_LOAN, AUTO_LOAN, STUDENT_LOAN, BUSINESS_LOAN, EQUIPMENT_LOAN, MEDICAL_LOAN, INSTALLMENT_LOAN, LINE_OF_CREDIT, PEER_TO_PEER_LOAN, CONSOLIDATION_LOAN

**Other Liabilities:** TAXES_PAYABLE, ACCOUNTS_PAYABLE, CHILD_SUPPORT, ALIMONY, LEGAL_JUDGMENT, SECURITY_DEPOSIT_OWED, UNPAID_BILLS, OVERDRAFT_BALANCE, INSURANCE_PREMIUM_FINANCING, BUSINESS_PAYABLE

---

## Rate Limiting

The accounts module follows these rate limits:

- **General Endpoints:** 100 requests per 15 minutes
- **Bulk Operations:** 10 requests per minute (each bulk request counts as 1)
- **Net Worth Queries:** 50 requests per minute
- **List Operations:** 200 requests per hour

Exceeding limits returns HTTP 429 (Too Many Requests).

---

## Best Practices

### Bulk Operations

1. **Batch Processing:** Process accounts in batches of 100-500 for optimal performance
2. **Error Handling:** Always check `results` array for individual account failures
3. **Deactivation First:** Prefer deactivation over deletion when transaction data exists
4. **Event Monitoring:** Subscribe to bulk operation events for async processing

### Account Management

1. **Validation:** Validate account IDs before bulk operations
2. **Transaction Checks:** Remember accounts with transactions cannot be deleted
3. **Cache Awareness:** Group accounts queries are cached for 5 minutes
4. **Organization Context:** Always ensure correct organization context in requests

### Net Worth Tracking

1. **Snapshot Frequency:** Create daily snapshots for trend analysis
2. **Granularity Selection:** Use appropriate granularity for your use case
3. **Metadata Usage:** Store context in metadata for analysis
4. **Trend Analysis:** Always fetch latest snapshot before manual creation

---

## Migration Guide

If migrating from single-account to bulk operations:

```typescript
// Old approach - 100 individual DELETE requests
for (const accountId of accountIds) {
  await fetch(`/api/v1/accounts/${accountId}`, { method: 'DELETE' })
}

// New approach - 1 bulk request
await fetch('/api/v1/accounts/bulk-delete', {
  method: 'POST',
  body: JSON.stringify({ accountIds })
})
```

Benefits: **99% faster**, more reliable, better error handling, atomic transaction.

---

**Last Updated:** 2025-01-22
**Module Version:** 1.0.0
**API Version:** v1
