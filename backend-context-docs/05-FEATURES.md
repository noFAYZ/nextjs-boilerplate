# 05. Available Features & Capabilities

**User-perspective feature breakdown and plan-based limitations**

> **Detailed Information**: Each feature has detailed documentation. For example:
> - Crypto features: `modules/crypto/Details.md`
> - Banking features: `modules/banking/Details.md`
> - Transaction features: `modules/transactions/Details.md`

## Feature Overview by User Type

### FREE Plan Users ($0/month)
- **Crypto Wallets**: 3 wallets maximum
- **Bank Accounts**: 2 connected accounts
- **API Requests**: 10,000 per month
- **Portfolio Tracking**: Basic holdings & balances
- **Features**:
  - ✅ Add & view cryptocurrency wallets (5 networks max)
  - ✅ View portfolio balances and allocations
  - ✅ Connect 2 bank accounts
  - ✅ View transaction history (30 days)
  - ✅ Basic transaction categorization
  - ✅ Email support

**Rate Limits**: 100 requests per 15 minutes

---

### PRO Plan Users ($99/month)
- **Crypto Wallets**: 50 wallets maximum
- **Bank Accounts**: 10 connected accounts
- **API Requests**: 100,000 per month
- **Portfolio Tracking**: Advanced with analytics
- **Features**:
  - ✅ All FREE features
  - ✅ Sync 50 cryptocurrency wallets (15+ networks)
  - ✅ Real-time portfolio tracking
  - ✅ 10 bank/brokerage accounts
  - ✅ Advanced transaction search & filtering
  - ✅ Custom transaction categories
  - ✅ Recurring transaction detection
  - ✅ Budget tracking & alerts
  - ✅ Transaction attachments (receipts, docs)
  - ✅ DeFi position monitoring
  - ✅ NFT collection tracking
  - ✅ Tax-ready reports (beta)
  - ✅ Priority support

**Rate Limits**: 200 requests per 15 minutes

---

### ULTIMATE Plan Users ($299/month)
- **Crypto Wallets**: Unlimited
- **Bank Accounts**: Unlimited
- **API Requests**: Unlimited
- **All advanced features**
- **Features**:
  - ✅ All PRO features
  - ✅ Unlimited wallets & accounts
  - ✅ Advanced API access
  - ✅ Dedicated support
  - ✅ Custom integrations
  - ✅ Webhooks for real-time updates
  - ✅ Data export (CSV, JSON, PDF)
  - ✅ Multi-user organizations (5 members)
  - ✅ Advanced reconciliation tools
  - ✅ Portfolio performance analytics

**Rate Limits**: 500 requests per 15 minutes

---

## Feature Matrix

| Feature | FREE | PRO | ULTIMATE |
|---------|------|-----|----------|
| Crypto Wallets | 3 | 50 | ∞ |
| Networks Supported | 5 | 15+ | 15+ |
| Bank Accounts | 2 | 10 | ∞ |
| Transaction History | 30 days | Full | Full |
| Portfolio Tracking | Basic | Advanced | Advanced |
| Budget Tracking | ❌ | ✅ | ✅ |
| DeFi Monitoring | ❌ | ✅ | ✅ |
| NFT Tracking | ❌ | ✅ | ✅ |
| Custom Categories | ❌ | ✅ | ✅ |
| Recurring Detection | ❌ | ✅ | ✅ |
| Tax Reports | ❌ | ✅ | ✅ |
| API Access | Limited | Advanced | Full |
| Webhooks | ❌ | ❌ | ✅ |
| Custom Integrations | ❌ | ❌ | ✅ |
| Organizations | ❌ | ❌ | ✅ (5 members) |
| Data Export | ❌ | ❌ | ✅ |

---

## Available Features in Detail

### 1. Cryptocurrency Portfolio Management ✅

#### Supported Networks (15+)
- Ethereum (mainnet)
- Polygon
- Arbitrum
- Optimism
- Base
- Avalanche
- Solana
- Fantom
- Gnosis (xDAI)
- Celo
- Harmony (ONE)
- Moonbeam
- zkSync
- Linea
- Scroll

#### Wallet Types
- **EOA** (Externally Owned Account)
- **Contract** (Smart Contracts)
- **Safe** (Multisig)
- **Gnosis Safe**
- **Hardware Wallets** (read-only via address)

#### Data Tracked
```
Per Wallet:
├─ Assets & Balances
│  ├─ Token symbol & name
│  ├─ Balance quantity
│  ├─ USD value
│  ├─ Price change (24h, 7d, 30d)
│  └─ Holdings allocation %
├─ Transactions
│  ├─ Type (transfer, swap, mint, burn)
│  ├─ From/to addresses
│  ├─ Value & gas costs
│  ├─ Status (pending, completed, failed)
│  └─ Full history (configurable retention)
├─ NFTs
│  ├─ Collection name & image
│  ├─ Token ID
│  ├─ Floor price
│  ├─ Estimated value
│  └─ Full collection details
└─ DeFi Positions
   ├─ Protocol (Aave, Compound, Uniswap, etc)
   ├─ Position type (lending, liquidity, staking)
   ├─ Underlying token breakdown (3+ levels)
   ├─ APY/Yield
   └─ Total value

Portfolio Aggregation:
├─ Total balance across all wallets
├─ Change % (24h, 7d, 30d)
├─ Portfolio chart (30-90 days)
├─ Top assets breakdown
├─ By-network breakdown
└─ Allocation pie chart
```

#### Sync Capabilities
- **Real-time**: On-demand sync via API
- **Speed**: Typically 2-5 minutes per wallet
- **Progress Tracking**: Live updates via Server-Sent Events (SSE)
- **Retry Logic**: Automatic retry with exponential backoff
- **Fallback**: Automatic failover between data providers (Zerion ↔ Zapper)

**Example Sync Response:**
```json
{
  "jobId": "job_abc123",
  "status": "in_progress",
  "progress": {
    "syncing_assets": 20,
    "syncing_transactions": 50,
    "syncing_defi": 75,
    "syncing_nfts": 90,
    "completed": 100
  },
  "totalTime": 5234,
  "startedAt": "2025-01-18T10:00:00Z"
}
```

---

### 2. Banking & Checking Account Integration ✅

#### Supported Providers
- **Plaid** (Primary) - 11,000+ US institutions
- **Teller** (Alternative) - 10,000+ US institutions
- **MX Platform** (Alternative) - 13,000+ worldwide

#### Account Types
- **Depository**: Checking, Savings, Money Market
- **Credit**: Credit Card, Line of Credit
- **Investment**: Brokerage, IRA
- **Loan**: Auto, Personal, Mortgage
- **Other**: Rewards, HSA, Education Savings

#### Features
```
Account Linking:
✅ OAuth-based secure connection (no credentials stored)
✅ Instant account discovery
✅ Real-time balance verification
✅ Institution metadata (logos, colors)

Transaction Sync:
✅ Historical transactions (typically 2+ years)
✅ Daily incremental sync
✅ Duplicate detection & reconciliation
✅ Merchant enrichment (name, category, logo)
✅ ATM/fee identification

Balance Tracking:
✅ Daily balance snapshots
✅ Balance history timeline
✅ Multi-currency support
✅ Real-time balance verification

Reconciliation:
✅ Bank reconciliation reports
✅ Discrepancy detection
✅ Pending transaction handling
✅ Cleared balance tracking
```

---

### 3. Transaction Management & Categorization ✅

#### Transaction Operations
```
CRUD Operations:
✅ Create manual transactions
✅ Read/view transactions (with filters)
✅ Update transaction details
✅ Delete/archive transactions
✅ Restore deleted transactions
✅ Split transactions (e.g., shared dinner)
✅ Merge transactions

Advanced Operations:
✅ Bulk categorize
✅ Bulk tag
✅ Bulk update
✅ Bulk delete/restore
✅ Batch import (CSV)
✅ Data export (CSV, JSON, PDF)
```

#### Categorization
```
Default Categories (30+):
├─ Food & Dining
├─ Shopping
├─ Transportation
├─ Utilities
├─ Entertainment
├─ Healthcare
├─ Education
├─ Personal Care
├─ Finance Charges
├─ Gifts & Donations
├─ Taxes
└─ Business Services

Custom Categories:
✅ Create unlimited custom categories
✅ Custom category groups
✅ Set category color/icon
✅ Reorder categories
✅ Hide/archive categories

Categorization Methods:
✅ Manual categorization
✅ Automatic via rules
✅ ML-based suggestions
✅ Batch categorization
✅ Rule-based recategorization
```

#### Advanced Features
```
Rules Engine:
✅ Merchant name rules
✅ Amount range rules
✅ Description contains rules
✅ Regular expression rules
✅ Composite rules (AND/OR logic)
✅ Rule priority & ordering
✅ Rule testing & preview

Search & Filtering:
✅ Full-text search
✅ Date range filtering
✅ Amount range filtering
✅ Category filtering
✅ Merchant filtering
✅ Tag-based search
✅ Saved searches
✅ Advanced search UI

Notes & Attachments:
✅ Transaction notes
✅ Photo/document attachments (receipts)
✅ Tag system
✅ Multi-tag support
✅ Tag-based organization

Recurring Detection:
✅ Auto-detect recurring charges
✅ Identify subscription pattern
✅ Predict next occurrence
✅ Track subscription changes
✅ Alert on pattern changes
```

---

### 4. Budget Tracking & Alerts ⚠️ (Partial)

#### Budget Features
```
✅ Create budgets per category
✅ Set monthly/annual budgets
✅ Track spending vs budget
✅ Visual progress indicators
✅ Rollover unused amounts (optional)
✅ Multiple budget templates

Alerts:
❌ Budget threshold alerts (BROKEN - P0 issue)
❌ Spending trend alerts
❌ Category overrun alerts
⚠️ Feature exists but processor not implemented
```

**Status**: Budget model exists but BudgetAlertProcessor is not implemented. This is a **P0 Critical** issue.

---

### 5. Financial Accounts & Grouping ✅

#### Account Organization
```
✅ Create account groups (e.g., "All Checking", "Investment Accounts")
✅ Group accounts by type/institution
✅ Set primary account per category
✅ Mark accounts as favorites
✅ Set account ownership type
✅ Account preferences (visibility, order)

Account Types Trackable:
✅ Checking accounts
✅ Savings accounts
✅ Credit cards
✅ Investment accounts
✅ Loan accounts
✅ Cryptocurrency wallets
✅ Manual accounts (net worth)
```

---

### 6. Multi-Tenancy & Organizations ✅

#### Organization Features
```
✅ Create multiple organizations/workspaces
✅ Invite team members
✅ Role-based access (OWNER, ADMIN, MEMBER)
✅ Organization data isolation
✅ Shared dashboards (PRO+)
✅ Activity audit logs

Collaboration:
✅ Member management
✅ Role assignment
✅ Invitation system
✅ Pending invitations
✅ Remove members
```

---

### 7. Real-Time Capabilities ✅

#### Server-Sent Events (SSE)
```
✅ Real-time sync progress updates
✅ Persistent connection management
✅ Heartbeat for connection keep-alive
✅ Auto-reconnect logic (client-side)
✅ Multi-wallet progress tracking

Supported Events:
✅ sync_progress - Updates during sync
✅ sync_complete - Sync finished
✅ sync_error - Sync failed
✅ portfolio_updated - Portfolio changed
✅ transaction_received - New transaction
```

**Example Usage:**
```javascript
const eventSource = new EventSource(
  '/api/v1/crypto/user/sync/stream',
  { headers: { Authorization: 'Bearer ' + token } }
);

eventSource.addEventListener('sync_progress', (e) => {
  const { walletId, progress, status } = JSON.parse(e.data);
  updateUI(walletId, progress, status);
});

eventSource.addEventListener('sync_complete', (e) => {
  const { walletId } = JSON.parse(e.data);
  showNotification(`${walletId} sync complete!`);
});
```

---

### 8. Data Export ✅ (ULTIMATE Plan)

#### Export Formats
```
✅ CSV
✅ JSON
✅ PDF (with formatting)

Exportable Data:
✅ Portfolio snapshots
✅ Transactions
✅ Categories & merchants
✅ Budgets & spending
✅ Tax reports (year-end)
```

---

### 9. API & Developer Access ✅

#### API Features
```
Free Tier:
✅ 10,000 requests/month
✅ Read-only endpoints
✅ Standard rate limits

PRO Tier:
✅ 100,000 requests/month
✅ Write endpoints
✅ Advanced filters & search
✅ Batch operations

ULTIMATE Tier:
✅ Unlimited requests
✅ Full API access
✅ Webhooks
✅ Custom integrations
✅ SDKs provided
```

---

### 10. Authentication & Security ✅

#### Authentication
```
✅ Email/password registration
✅ OAuth 2.0 login (via Better Auth)
✅ JWT token-based sessions
✅ Automatic token refresh
✅ Password reset via email
✅ Email verification
✅ 2FA support (backup codes)
```

#### Security Features
```
✅ HTTPS everywhere
✅ CORS configured
✅ Rate limiting per user
✅ Plan-based access control
✅ Organization data isolation
✅ Audit logging for admin actions
✅ API key support (future)

Missing (P0):
❌ Secrets encryption (stored in plaintext)
❌ CSRF protection
❌ Comprehensive audit logging
```

---

### 11. Subscription Management ✅

#### Subscription Features
```
✅ Subscribe to plans (FREE → PRO → ULTIMATE)
✅ Change plan (upgrade/downgrade)
✅ Cancel subscription
✅ View current plan & usage
✅ Payment history
✅ Billing portal
✅ Auto-renewal management
✅ Invoice generation

Payment Providers:
✅ Stripe integration
✅ Polar integration
✅ Invoice generation
✅ Automatic retries
✅ Failed payment notifications
```

---

### 12. External Integrations ✅

#### Zerion Integration (Blockchain Data)
```
✅ Multi-network portfolio (15+ networks)
✅ Asset balances & prices
✅ Transaction history
✅ DeFi position breakdown
✅ Circuit breaker pattern
✅ Automatic retry logic
✅ Rate limiting aware
✅ Real-time data
```

#### Zapper Integration (DeFi & NFT)
```
✅ Advanced DeFi positions
✅ Multi-level token breakdown
✅ NFT floor prices
✅ Collection metadata
✅ Farcaster social integration
✅ Complex protocol parsing
✅ Rate limiting with queuing
```

#### Plaid, Teller, MX (Banking)
```
✅ Account discovery
✅ Transaction sync
✅ Balance updates
✅ Merchant data
✅ Multiple provider support
✅ Automatic fallback
```

---

### 13. Analytics & Monitoring 🔄 (Partial)

#### User Analytics
```
✅ Spending by category
✅ Merchant breakdown
✅ Monthly trends
✅ Portfolio performance
✅ Top transactions
✅ Recurring subscriptions

Missing:
❌ Custom date ranges
❌ Comparative analysis
❌ Trend predictions
❌ Cashflow forecasting
```

#### System Analytics
```
✅ API request tracking
✅ External API performance
✅ User behavior metrics
✅ Feature usage tracking
✅ Error rate monitoring

Missing:
❌ APM integration (Datadog, New Relic)
❌ Performance alerts
❌ Automated reporting
```

---

## Feature Availability Summary

### Fully Implemented ✅ (13 features)
1. Cryptocurrency portfolio tracking
2. Bank account integration
3. Transaction management
4. Multi-tenancy/organizations
5. Real-time sync progress (SSE)
6. Categorization & rules
7. Subscription management
8. Authentication & JWT
9. Data export
10. Account grouping
11. External API integrations
12. Basic analytics
13. Rate limiting & plan enforcement

### Partial Implementation 🔄 (3 features)
1. Budget tracking (alerts broken)
2. Analytics (limited features)
3. Admin monitoring (no APM)

### Not Implemented ❌ (7 features)
1. Encryption of sensitive data
2. CSRF protection
3. Comprehensive audit logging
4. Recurring transaction alerts
5. Tax report generation
6. Webhooks (ULTIMATE plan promised)
7. Custodian integration

---

## Performance Metrics

### API Response Times
```
Typical Response Times:
- Get wallet list: 50-150ms
- Get portfolio: 200-500ms (cached)
- Get transactions: 100-300ms
- Advanced search: 200-800ms (complex queries)
- Live data: 500-1000ms (external API)
- Create wallet: 50-100ms
- Sync wallet: 2-5 minutes (background job)
```

### Concurrency
```
Simultaneous Operations:
- API requests: 50+ concurrent (per server)
- Background jobs: 5 concurrent (per queue)
- SSE connections: 1000+ per server
- Database connections: 20 pool size
```

---

See [06-GAPS.md](./06-GAPS.md) for features that are missing compared to competitors like Monarch.
