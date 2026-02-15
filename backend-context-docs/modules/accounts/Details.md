# Accounts Module - Details

**Path**: `src/modules/accounts/`

## Overview

Comprehensive financial account management system with lifecycle tracking, net worth monitoring, multi-currency support, and advanced account organization. Integrates with crypto wallets and traditional banking accounts to provide unified account management across all financial assets.

**Status**: ✅ Production Ready
**Maturity**: High
**Endpoints**: 47 API endpoints
**Key Dependencies**: Prisma ORM, Express.js, Redis (for caching)

---

## Architecture

### Module Structure

```
src/modules/accounts/
├── controllers/
│   ├── accountController.ts              # Main account operations
│   ├── accountGroupingController.ts      # Grouping & favorites
│   ├── accountPreferencesController.ts   # Preferences & ownership
│   └── exchangeRatesController.ts        # Exchange rate handling
├── services/
│   ├── accountService.ts                 # Core business logic
│   ├── accountGroupingService.ts         # Grouping service
│   ├── accountPreferencesService.ts      # Preferences persistence
│   └── networthService.ts                # Net worth calculations
├── jobs/
│   └── netWorthSnapshotJob.ts            # Background job for snapshots
├── types/
│   └── index.ts                          # TypeScript definitions
├── routes/
│   ├── index.ts                          # Router index
│   └── accountRoutes.ts                  # Route definitions
├── errors/
│   └── index.ts                          # Error definitions
├── events.ts                             # Event emitters
├── listeners.ts                          # Event listeners
└── index.ts                              # Module exports
```

---

## Core Features

### 1. Account Lifecycle Management

Complete lifecycle tracking for financial accounts with reversible and permanent options.

**States:**
- **ACTIVE** - Account is active and in use
- **ARCHIVED** - Soft delete (reversible), for temporary deactivation
- **CLOSED** - Permanent closure, cannot be reopened

**Operations:**
- Archive account - Removes from active view but preserves history
- Reopen account - Restore archived account to active state
- Close account - Permanent closure with data retention

**Bulk Operations:**
- Bulk archive up to 1000 accounts
- Bulk reopen up to 1000 accounts
- Bulk close up to 1000 accounts
- Bulk delete up to 1000 accounts

**Use Cases:**
- Archive old accounts no longer in use
- Permanently close accounts after closure notification
- Organize accounts by lifecycle state

### 2. Account Grouping

Organize accounts into logical groups for better management and analysis.

**Features:**
- Create custom groups (e.g., "Emergency Fund", "Trading", "Long-term Savings")
- Add/remove accounts from groups
- Group-level portfolio aggregation
- Track accounts per group
- Organize both crypto and banking accounts together

**API Methods:**
- Create group with name and description
- List all user groups
- Update group metadata
- Delete group (cascades group membership)
- Add/remove accounts to/from groups

**Use Cases:**
- Emergency fund tracking
- Portfolio segmentation by purpose
- Account organization by type
- Multi-purpose account management

### 3. Account Preferences & Ownership

Advanced preference management for individual account customization.

**Preference Types:**
- **Favorites** - Mark accounts for quick access
- **Primary Account** - Designate primary account by category
- **Ownership Information** - Track ownership structure and percentage

**Ownership Types:**
- `SOLE` - Single owner (100%)
- `JOINT` - Shared ownership (specify percentage)
- `TRUST` - Trust-owned accounts
- `BUSINESS` - Business-owned accounts
- `OTHER` - Other ownership structures

**Features:**
- Toggle favorite status for quick access
- Set primary account per category (savings, checking, investment, etc.)
- Track co-owners and ownership percentages
- Retrieve all preferences for account
- Filter accounts by owner type

**Use Cases:**
- Mark important accounts as favorites
- Designate primary checking/savings account
- Track joint account ownership shares
- Filter accounts by ownership type

### 4. Net Worth Tracking

Comprehensive net worth monitoring with historical snapshots and trend analysis.

**Features:**
- Create net worth snapshots at any time
- Automatic background job for scheduled snapshots
- Historical tracking with timestamps
- Net worth trends over time (7 days, 30 days, 90 days, 1 year, all)
- Breakdown by category (crypto, banking, investments)
- Multi-currency support
- Change tracking (absolute and percentage)

**Calculations:**
- Aggregate across all accounts
- Include crypto wallets and banking accounts
- Support for multi-currency consolidation
- Real-time balance updates

**Use Cases:**
- Monitor overall wealth growth
- Track financial goals progress
- Analyze spending patterns
- Historical net worth reporting
- Multi-currency household wealth tracking

### 5. Multi-Currency Support

Robust exchange rate handling and currency conversion.

**Features:**
- Real-time exchange rate lookups
- Historical exchange rate data
- Intelligent caching (Redis-backed)
- Automatic cache refresh
- Support for 150+ currencies
- Convert amounts between any currencies
- Cache statistics and monitoring

**Exchange Rate Source:**
- Primary: ExchangeRate API / Alpha Vantage
- Caching: Redis with configurable TTL
- Manual refresh capability for accuracy

**Use Cases:**
- Convert international account balances
- Multi-currency net worth calculation
- Transaction conversion for reporting
- Household currency consolidation

### 6. Account Balance Tracking

Detailed balance history and charting support.

**Metrics:**
- Current balance (real-time)
- Available balance (for credit accounts)
- Historical balance snapshots
- Balance changes over time
- Chart-ready data (for frontend visualizations)

**Features:**
- Balance history per account
- Chronological balance snapshots
- Time-series data for charts
- Support for multiple currencies

---

## Database Models

### Core Account Models

**Account**
```typescript
{
  id: string                      // Unique account ID
  userId: string                  // Owner user ID
  name: string                    // Display name
  type: AccountType              // CHECKING, SAVINGS, CREDIT, INVESTMENT, LOAN
  provider?: string              // Banking provider
  status: AccountStatus          // ACTIVE, ARCHIVED, CLOSED
  currentBalance: Decimal        // Current balance
  availableBalance?: Decimal     // Available balance (credit accounts)
  currency: string               // ISO 4217 currency code
  mask?: string                  // Last 4 digits (banking)
  isActive: boolean              // Activity flag
  lastSyncedAt?: DateTime        // Last sync timestamp
  archivedAt?: DateTime          // Archive timestamp
  closedAt?: DateTime            // Close timestamp
  createdAt: DateTime
  updatedAt: DateTime
}
```

**AccountGroup**
```typescript
{
  id: string                      // Unique group ID
  userId: string                  // Owner user ID
  name: string                    // Group name
  description?: string           // Group description
  createdAt: DateTime
  updatedAt: DateTime
}
```

**AccountPreference**
```typescript
{
  id: string                      // Unique preference ID
  accountId: string              // Associated account
  userId: string                 // User ID
  isFavorite: boolean            // Favorite flag
  ownershipType?: OwnershipType  // SOLE, JOINT, TRUST, BUSINESS, OTHER
  ownershipPercentage?: Decimal  // 0-100, for JOINT ownership
  primaryFor?: string            // Category this is primary for
  createdAt: DateTime
  updatedAt: DateTime
}
```

**NetWorthSnapshot**
```typescript
{
  id: string                      // Unique snapshot ID
  userId: string                 // User ID
  totalNetWorth: Decimal         // Total net worth
  currency: string               // Reporting currency
  breakdown: {                   // Net worth by category
    crypto?: Decimal
    banking?: Decimal
    investments?: Decimal
  }
  timestamp: DateTime            // Snapshot time
  createdAt: DateTime
}
```

**ExchangeRate**
```typescript
{
  id: string                      // Unique rate ID
  fromCurrency: string           // Source currency
  toCurrency: string             // Target currency
  rate: Decimal                  // Exchange rate
  date: DateTime                 // Rate effective date
  source: string                 // Data source
  expiresAt: DateTime            // Cache expiration
  createdAt: DateTime
}
```

---

## Key Methods & Services

### AccountService

```typescript
// Account CRUD
async createAccount(userId: string, data: CreateAccountInput): Promise<Account>
async getAccount(userId: string, accountId: string): Promise<Account>
async updateAccount(userId: string, accountId: string, data: UpdateAccountInput): Promise<Account>
async deleteAccount(userId: string, accountId: string): Promise<void>

// Account queries
async getAccounts(userId: string, filters?: FilterOptions): Promise<Account[]>
async getGroupedAccounts(userId: string): Promise<AccountGroup[]>
async getAccountStats(userId: string): Promise<AccountStats>
async getAccountBalance(userId: string, accountId: string): Promise<BalanceInfo>
async getAccountHistory(userId: string, accountId: string): Promise<BalanceSnapshot[]>

// Lifecycle operations
async archiveAccount(userId: string, accountId: string): Promise<Account>
async reopenAccount(userId: string, accountId: string): Promise<Account>
async closeAccount(userId: string, accountId: string): Promise<Account>
async getAccountLifecycleHistory(userId: string, accountId: string): Promise<LifecycleEvent[]>

// Bulk operations
async bulkDelete(userId: string, accountIds: string[]): Promise<BulkResult>
async bulkDeactivate(userId: string, accountIds: string[]): Promise<BulkResult>
async bulkReactivate(userId: string, accountIds: string[]): Promise<BulkResult>
async bulkArchive(userId: string, accountIds: string[]): Promise<BulkResult>
async bulkReopen(userId: string, accountIds: string[]): Promise<BulkResult>
async bulkClose(userId: string, accountIds: string[]): Promise<BulkResult>
```

### AccountGroupingService

```typescript
async createGroup(userId: string, name: string, description?: string): Promise<AccountGroup>
async getGroups(userId: string): Promise<AccountGroup[]>
async getGroup(userId: string, groupId: string): Promise<AccountGroup>
async updateGroup(userId: string, groupId: string, data: UpdateGroupInput): Promise<AccountGroup>
async deleteGroup(userId: string, groupId: string): Promise<void>

async addAccountToGroup(userId: string, groupId: string, accountId: string): Promise<void>
async removeAccountFromGroup(userId: string, groupId: string, accountId: string): Promise<void>
async getGroupPortfolio(userId: string, groupId: string): Promise<GroupPortfolio>

async getFavorites(userId: string): Promise<Account[]>
async markAsFavorite(userId: string, accountId: string): Promise<void>
async unmarkAsFavorite(userId: string, accountId: string): Promise<void>
```

### AccountPreferencesService

```typescript
async getFavorites(userId: string): Promise<Account[]>
async toggleFavorite(accountId: string, userId: string): Promise<boolean>

async setPrimary(accountId: string, userId: string, category: string): Promise<void>
async getPrimary(userId: string, category: string): Promise<Account | null>

async setOwnership(accountId: string, userId: string, ownership: OwnershipInfo): Promise<void>
async getOwnership(accountId: string, userId: string): Promise<OwnershipInfo>
async getAccountsByOwnerType(userId: string, ownerType: OwnershipType): Promise<Account[]>

async getPreferenceSummary(accountId: string, userId: string): Promise<AccountPreferences>
```

### NetWorthService

```typescript
async createSnapshot(userId: string): Promise<NetWorthSnapshot>
async getSnapshot(userId: string, snapshotId: string): Promise<NetWorthSnapshot>
async getLatestNetWorth(userId: string, currency?: string): Promise<NetWorthSnapshot>
async getNetWorthTrend(userId: string, period?: TimePeriod): Promise<TrendData>
async getNetWorthBreakdown(userId: string, currency?: string): Promise<BreakdownData>
async getNetWorthInCurrency(userId: string, currency: string): Promise<NetWorthSnapshot>
```

### ExchangeRatesController

```typescript
async getExchangeRate(from: string, to?: string, date?: string): Promise<ExchangeRate>
async convertAmount(amount: number, from: string, to: string): Promise<ConversionResult>
async refreshRates(currencies: string[]): Promise<void>
async getCacheStats(): Promise<CacheStatistics>
```

---

## API Endpoint Categories

### 1. Basic Account CRUD (6 endpoints)
- Create, read, update, delete accounts
- List and group accounts
- Account filtering and pagination

### 2. Statistics & Details (4 endpoints)
- Account statistics summary
- Balance details and availability
- Balance history for charting
- Chart-ready data format

### 3. Bulk Operations (3 endpoints)
- Bulk delete (up to 1000)
- Bulk deactivate (up to 1000)
- Bulk reactivate (up to 1000)

### 4. Lifecycle Management (8 endpoints)
- Archive/reopen individual accounts
- Close accounts permanently
- Bulk lifecycle operations
- Lifecycle history tracking

### 5. Net Worth Tracking (6 endpoints)
- Create snapshots on demand
- Retrieve snapshot data
- Trend analysis (7d, 30d, 90d, 1y, all)
- Breakdown by category
- Multi-currency conversions

### 6. Exchange Rates (4 endpoints)
- Look up current rates
- Convert between currencies
- Refresh rate cache
- Cache statistics

### 7. Account Grouping (6 endpoints)
- Create/manage groups
- Add/remove accounts from groups
- List user groups
- Group portfolio aggregation

### 8. Preferences & Ownership (10 endpoints)
- Manage favorites
- Set primary accounts by category
- Track ownership information
- Filter by owner type
- Retrieve preference summaries

---

## Background Jobs

### NetWorthSnapshotJob

Automatically creates net worth snapshots at regular intervals.

**Configuration:**
- Schedule: Daily at 00:00 UTC (configurable)
- Recurrence: Once per day
- Retry: 3 attempts with exponential backoff
- Timeout: 5 minutes

**Process:**
1. Fetch all active accounts for user
2. Aggregate balances from all sources
3. Apply exchange rate conversions
4. Create snapshot record
5. Update cache
6. Emit completion event

**Error Handling:**
- Logs failures with context
- Automatic retry on transient failures
- Falls back to cached net worth if API fails

---

## Database Indexes

Critical indexes for performance:

```sql
-- Account lookups
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_user_status ON accounts(user_id, status);
CREATE INDEX idx_accounts_user_type ON accounts(user_id, type);

-- Group operations
CREATE INDEX idx_account_groups_user_id ON account_groups(user_id);

-- Preferences
CREATE INDEX idx_account_preferences_account_id ON account_preferences(account_id);
CREATE INDEX idx_account_preferences_user_id ON account_preferences(user_id);

-- Net worth queries
CREATE INDEX idx_networth_snapshots_user_id ON networth_snapshots(user_id);
CREATE INDEX idx_networth_snapshots_user_timestamp ON networth_snapshots(user_id, timestamp DESC);

-- Exchange rate lookups
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
```

---

## Error Handling

Custom error classes:

- `AccountNotFoundError` (404) - Account doesn't exist
- `GroupNotFoundError` (404) - Group doesn't exist
- `PermissionDeniedError` (403) - User lacks access
- `InvalidAccountError` (400) - Invalid account data
- `InvalidGroupError` (400) - Invalid group data
- `ExchangeRateError` (503) - Rate service unavailable
- `InvalidOwnershipError` (400) - Invalid ownership type/percentage

---

## Integration Points

### External Integrations
- **Exchange Rate Services**: Real-time currency conversion
- **Crypto Wallets Module**: Integration for net worth aggregation
- **Banking Connections**: Bank account balance syncing
- **Transactions Module**: Transaction categorization by account

### Events Emitted
- `account.created` - New account created
- `account.updated` - Account modified
- `account.archived` - Account archived
- `account.reopened` - Account reopened
- `account.closed` - Account closed permanently
- `networth.snapshot.created` - Net worth snapshot generated
- `group.created` - Account group created
- `group.deleted` - Account group deleted
- `preference.updated` - Account preference changed

### Event Listeners
- Listens to crypto wallet updates for net worth recalculation
- Listens to bank sync completion for balance updates
- Listens to transaction changes for account categorization

---

## Rate Limiting

- **Standard Reads**: 50 requests per 15 minutes
- **Writes**: 10 requests per minute
- **Deletes/Closes**: 5 requests per minute
- **Bulk Operations**: 10 requests per minute
- **Global Limit**: 1000 requests per hour per user

---

## Caching Strategy

- **Exchange Rates**: 24-hour TTL, Redis-backed
- **Account Data**: 5-minute TTL for reads
- **Net Worth**: 1-hour TTL for snapshots
- **Preferences**: 30-minute TTL

Manual refresh available via API endpoints.

---

## Performance Considerations

- Bulk operations optimized for 1000+ items
- Pagination support with cursor-based approach
- Efficient aggregation queries with proper indexing
- Exchange rate caching minimizes external API calls
- Net worth calculations use pre-computed snapshots
- Group portfolio queries use single aggregation query

---

## Security

- User isolation enforced at all endpoints
- Account access verified before operations
- Sensitive data (ownership info) properly encrypted
- All write operations logged for audit
- Rate limiting prevents abuse
- Validation of all input data
- CORS configured appropriately

---

## Testing

- Unit tests for services (Jest)
- Integration tests for API endpoints
- Database transaction tests for consistency
- Exchange rate mock for reliable tests
- Test fixtures for common scenarios

---

## Future Enhancements

- Account reconciliation features
- Advanced spending analysis
- Budget allocation by group
- Account health scoring
- Predictive analytics (forecasting)
- Mobile app deep linking support
- Export functionality (CSV, PDF)
- Account-level notification preferences
