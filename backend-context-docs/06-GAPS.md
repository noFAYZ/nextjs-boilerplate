# 06. Missing Features & Gap Analysis

**Comprehensive gap analysis comparing Mappr to Monarch.com and identifying critical issues**

> **Module Reference**: Many missing features are organized by module. See `modules/{module}/Details.md` for what's implemented vs what's missing in each module.

## Executive Summary

- **Completion Status**: ~60% feature parity with Monarch
- **P0 Critical Issues**: 5 items blocking production
- **P1 High Priority**: 8 items affecting user experience
- **Features vs Monarch**: 40% of advanced features missing
- **Security Gaps**: 3 critical security issues

---

## P0 CRITICAL ISSUES (Must Fix Before Production)

### 1. ⚠️ Zero Test Coverage
**Severity**: CRITICAL
**Impact**: Can't ensure code quality, regression risk
**Current State**: 0% coverage
**Target**: 70%+ coverage for services & controllers

**Required Actions**:
```
Create test structure:
├─ src/__tests__/
│  ├─ auth/
│  ├─ crypto/
│  ├─ banking/
│  ├─ transactions/
│  └─ ... (per module)

Test frameworks needed:
✅ Jest (already in package.json)
✅ Supertest (API testing)
✅ Prisma test utils
✅ Redis mock library

Minimum coverage by type:
- Services: 80% (business logic)
- Controllers: 70% (API endpoints)
- Utilities: 90% (core functions)
- Middleware: 60% (integration points)
```

**Estimated Effort**: 200-300 hours

---

### 2. 🔒 Secrets Stored in Plaintext
**Severity**: CRITICAL (Security)
**Impact**: Data breach, compliance violation
**Affected Models**:
- `TellerEnrollment.accessToken`
- `Integration.accessToken`
- Any future API keys

**Current State**: Direct string storage in PostgreSQL
**Required Solution**:
```
Implement encryption service:
1. Choose encryption backend:
   ✅ AWS KMS (recommended)
   ✅ HashiCorp Vault
   ✅ Sealed Secrets (if K8s)

2. Create encryption service:
   src/shared/services/encryptionService.ts
   ├─ encrypt(plaintext): encrypted
   ├─ decrypt(ciphertext): plaintext
   ├─ key rotation logic
   └─ audit logging

3. Migrate existing secrets:
   - Create migration script
   - Encrypt all existing tokens
   - Update access patterns
   - Test decryption

4. Update models:
   - Use @db.Encrypted() or wrapper
   - Add automated decryption hooks
   - Add encryption on save hooks
```

**Estimated Effort**: 80-120 hours

**Implementation Example**:
```typescript
// encryptionService.ts
class EncryptionService {
  async encrypt(plaintext: string): Promise<string> {
    const kms = new AWS.KMS();
    const result = await kms.encrypt({
      KeyId: process.env.KMS_KEY_ID,
      Plaintext: plaintext
    }).promise();
    return result.CiphertextBlob.toString('base64');
  }

  async decrypt(ciphertext: string): Promise<string> {
    const kms = new AWS.KMS();
    const result = await kms.decrypt({
      CiphertextBlob: Buffer.from(ciphertext, 'base64')
    }).promise();
    return result.Plaintext.toString('utf-8');
  }
}

// Model usage
model TellerEnrollment {
  id String @id
  accessToken String  // Add decrypt hook via middleware

  @@map("teller_enrollment")
}

// Middleware to auto-decrypt
const autoDecryptMiddleware = async (entity: any) => {
  if (entity.accessToken) {
    entity.accessToken = await encryptionService.decrypt(entity.accessToken);
  }
  return entity;
};
```

---

### 3. 💔 Budget Alert Processor Missing
**Severity**: CRITICAL (Feature Broken)
**Impact**: Budget alerts don't work (P1 feature for PRO users)
**Current State**:
- `BudgetAlert` model exists in schema
- No `BudgetAlertProcessor` job handler
- No alert delivery mechanism

**Required Solution**:
```
Create budget alert system:

1. Create processor: src/modules/budgets/jobs/budgetAlertProcessor.ts
   ├─ Check spending vs budget
   ├─ Detect threshold breaches
   ├─ Determine notification type
   └─ Queue notification

2. Notification levels:
   ├─ 50% of budget: info
   ├─ 75% of budget: warning
   ├─ 100% of budget: critical
   └─ Over budget: alert

3. Delivery channels:
   ✅ Email notifications
   ✅ In-app notifications
   ✅ Push notifications (future)

4. Job scheduling:
   - Run daily at midnight
   - Priority: NORMAL
   - Retry: 3 times

5. User settings:
   - Enable/disable alerts
   - Alert frequency
   - Notification channels
```

**Estimated Effort**: 40-60 hours

---

### 4. 📈 Missing Database Indexes (Performance)
**Severity**: CRITICAL (Performance)
**Impact**: Slow queries, scalability issues
**Current State**: Basic indexes exist, composite indexes missing

**Required Indexes**:
```sql
-- User & Auth
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);

-- Crypto critical paths
CREATE INDEX idx_crypto_wallets_user_sync ON crypto_wallets(userId, lastSyncAt DESC);
CREATE INDEX idx_crypto_positions_wallet_symbol ON crypto_positions(walletId, symbol);
CREATE INDEX idx_crypto_transactions_wallet_time ON crypto_transactions(walletId, timestamp DESC);

-- Banking critical paths
CREATE INDEX idx_financial_accounts_user_sync ON financial_accounts(userId, lastSyncAt DESC);
CREATE INDEX idx_account_balance_account_date ON account_balance_snapshot(accountId, date DESC);

-- Transaction critical paths
CREATE INDEX idx_transactions_user_date_cat ON transactions(userId, date DESC, categoryId);
CREATE INDEX idx_transactions_account_date ON transactions(accountId, date DESC);
CREATE INDEX idx_transactions_reconciled ON transactions(userId, reconciled, date DESC);

-- Search optimization
CREATE INDEX idx_transactions_description ON transactions USING GIN(to_tsvector('english', description));
CREATE INDEX idx_merchant_name ON merchant(name) WHERE custom = true;

-- Sync state
CREATE UNIQUE INDEX idx_sync_state_user_module ON sync_state(userId, module);

-- Provider connections
CREATE UNIQUE INDEX idx_provider_connection_unique ON provider_connection(provider, provider_item_id);
```

**Estimated Effort**: 20-40 hours

---

### 5. 📊 Production Monitoring Missing (Observability)
**Severity**: CRITICAL (Operational)
**Impact**: Can't diagnose production issues, performance blind
**Current State**: Winston logging only (no APM)

**Required Solution**:
```
Implement APM:
1. Choose APM platform:
   ✅ Datadog (recommended)
   ✅ New Relic
   ✅ Elastic APM
   ✅ Sentry (errors)

2. Metrics to track:
   ├─ API response times (p50, p95, p99)
   ├─ Error rates & types
   ├─ External API performance
   ├─ Database query performance
   ├─ Job queue metrics
   ├─ Memory usage & GC
   └─ Business metrics (wallets synced, txns processed)

3. Alerting:
   ├─ Error rate > 5%
   ├─ Response time p95 > 1s
   ├─ Job failure rate > 10%
   ├─ Memory usage > 80%
   └─ Database connections > 15/20

4. Dashboards:
   ├─ System health overview
   ├─ API performance
   ├─ External services health
   ├─ Queue metrics
   └─ User activity

5. Tracing:
   - Distributed tracing (end-to-end)
   - Request correlation IDs
   - Dependency map
   - Latency breakdown
```

**Implementation**:
```typescript
// Datadog SDK setup
import { trace, context } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({
  traceExporter: new DatadogSpanExporter(),
  instrumentations: [
    new HttpInstrumentation(),
    new PrismaInstrumentation(),
    new RedisInstrumentation(),
  ],
});

// Custom metrics
const successCounter = metrics.createCounter('api_requests_success', {
  description: 'Successful API requests'
});

const responseTimeHistogram = metrics.createHistogram('api_response_time', {
  description: 'API response time in ms'
});
```

**Estimated Effort**: 120-160 hours

---

## P1 HIGH PRIORITY ISSUES (Major Features Missing)

### 1. 🔄 Recurring Transaction Alerts
**Status**: Not implemented
**Priority**: HIGH
**Impact**: Users can't be alerted about subscription charges
**Feature**: Detect & alert on recurring transactions

```
Required Features:
✅ Detect recurring patterns from transaction history
✅ Identify subscription charges
✅ Alert on pattern changes (price increase, frequency change)
✅ Allow user to manage subscriptions
✅ Link to SaaS tracking module

Supported Patterns:
- Weekly (e.g., gym membership)
- Bi-weekly (e.g., paycheck)
- Monthly (e.g., Netflix)
- Quarterly (e.g., insurance)
- Annual (e.g., subscription)
- Variable intervals

ML Model Input:
- Transaction amount
- Description/merchant
- Date/frequency
- Account type
- Historical data

Output:
- Confidence score (0-100%)
- Next predicted date
- Confidence in next date
- Likely category
```

**Estimated Effort**: 60-80 hours

---

### 2. 🏦 Bank Reconciliation
**Status**: Partial (model exists, logic incomplete)
**Priority**: HIGH
**Impact**: Users can't reconcile accounts
**Feature**: Match bank transactions to cleared items

```
Reconciliation Features:
✅ Compare bank statement to cleared items
✅ Identify outstanding transactions
✅ Calculate reconciling items
✅ Generate reconciliation report
✅ Mark items as cleared
✅ Handle bank fees & adjustments
✅ Multi-currency support

Process:
1. Input bank statement:
   - Statement date
   - Opening balance
   - Closing balance
   - Cleared amount

2. System calculates:
   - Uncleared deposits
   - Uncleared withdrawals
   - Outstanding checks
   - Pending transactions

3. Generates report:
   - Reconciliation status
   - Discrepancies
   - Resolution steps
   - Audit trail

4. User actions:
   - Mark transactions as cleared
   - Adjust for bank fees
   - Add reconciling items
   - Finalize reconciliation
```

**Estimated Effort**: 80-120 hours

---

### 3. 💰 Traditional Investment Tracking
**Status**: Not implemented
**Priority**: HIGH
**Impact**: Only 40% of users' assets tracked (crypto only)
**Feature**: Track stocks, bonds, mutual funds, ETFs

```
Investment Types to Support:
├─ Individual stocks (US, international)
├─ ETFs (US, international)
├─ Mutual funds
├─ Bonds (corporate, government)
├─ Options (calls, puts)
├─ Futures contracts
├─ Crypto (already supported)
├─ REITs
├─ Commodities (precious metals, etc)
└─ Real estate (manual entry)

Data Needed:
✅ Holdings (quantity, acquisition price)
✅ Current prices & market values
✅ Unrealized P&L
✅ Realized gains/losses (tax)
✅ Dividends & interest
✅ Corporate actions (splits, etc)
✅ Tax lot tracking
✅ Performance metrics

Data Sources:
- Broker APIs (TD Ameritrade, Fidelity, E*TRADE)
- Yahoo Finance API
- Alpha Vantage
- IEX Cloud

Broker Integration:
- OAuth for top brokers
- CSV import as fallback
- Manual entry support
```

**Estimated Effort**: 200-300 hours

---

### 4. 💱 Multi-Currency Support
**Status**: Partial (USD-focused)
**Priority**: HIGH
**Impact**: International users can't use app
**Feature**: Support multiple base currencies

```
Required Features:
✅ Set user's base currency
✅ Real-time exchange rates
✅ Automatic conversion for display
✅ Historical exchange rates (for P&L)
✅ Multi-currency wallets
✅ Multi-currency transactions
✅ Currency conversion tracking

Supported Currencies (50+):
- Major: USD, EUR, GBP, JPY, CHF, CAD, AUD
- Crypto: BTC, ETH, USDC, USDT, etc
- Fiat: All major world currencies

Exchange Rate Sources:
- ECB API (free, reliable)
- OANDA (currency specialist)
- CoinGecko (crypto rates)
- Fixer.io (global coverage)

Caching:
- Daily rates in Redis
- Update once per day
- Historical rate retention (5+ years)
```

**Estimated Effort**: 60-100 hours

---

### 5. 📄 Tax Reporting
**Status**: Not implemented
**Priority**: HIGH
**Impact**: Can't file taxes efficiently
**Feature**: Generate tax reports (capital gains, income, deductions)

```
Tax Report Types:
✅ Capital gains (short-term & long-term)
✅ Income report (interest, dividends, wages)
✅ Deduction categories (charitable, business, etc)
✅ Investment loss harvesting
✅ Quarterly estimated taxes
✅ Tax-loss carryforward
✅ Crypto tax report (Form 8949)

Data Needed:
- All transactions with dates
- Acquisition prices & dates
- Disposal prices & dates
- Holding periods
- Fees & commissions
- Dividends & interest
- Charitable donations
- Business expenses

Export Formats:
✅ PDF report (formatted)
✅ CSV for tax software (TurboTax, H&R Block)
✅ TXF format (for tax software)
✅ IIF format (for QuickBooks)
✅ Direct integration with TaxJar (future)

Calculation Methods:
- FIFO (First In, First Out)
- LIFO (Last In, First Out)
- Average cost basis
- Specific identification

Compliance:
- US tax law compliance (IRS Form 8949)
- UK tax compliance (Capital Gains Tax)
- EU tax compliance (crypto regulations)
- Country-specific rules
```

**Estimated Effort**: 150-250 hours

---

### 6. 🎯 Spending Insights & Analytics
**Status**: Partial (basic tracking exists)
**Priority**: HIGH
**Impact**: Limited insight into spending patterns
**Feature**: Advanced analytics & trend analysis

```
Analytics Features:
✅ Spending by category (over time)
✅ Merchant analysis (top spending)
✅ Peer comparison (vs. similar users - anonymized)
✅ Spending trends (month-over-month)
✅ Forecast (spending prediction)
✅ Anomaly detection (unusual spending)
✅ Cash flow analysis
✅ Savings rate calculation
✅ Financial health score

Insights to Generate:
- "You spent 15% more on dining this month"
- "Typical spending in Food: $400/mo, you spent $520"
- "Your subscription costs $127/month"
- "You saved $340 this month vs last month"
- "Predicted savings rate: 18%"
- "Unusual transaction: $2,400 at electronics store"

ML/AI Features:
- Anomaly detection (Isolation Forest)
- Clustering (similar transactions)
- Forecasting (ARIMA, Prophet)
- Classification (unclassified → category)

Visualizations:
- Pie charts (category breakdown)
- Line charts (spending over time)
- Bar charts (month comparisons)
- Heatmaps (spending patterns)
- Waterfall (income to savings)
```

**Estimated Effort**: 100-150 hours

---

### 7. 📱 Mobile App (iOS/Android)
**Status**: Not implemented
**Priority**: HIGH
**Impact**: Users can only access via web
**Feature**: Native mobile applications

```
Platform Support:
✅ iOS (Swift)
✅ Android (Kotlin)

Core Features on Mobile:
- Portfolio overview & tracking
- Account balances
- Recent transactions
- Quick balance check
- Notifications
- Biometric auth
- Offline mode (limited)

Tech Stack:
- React Native (code sharing)
- Flutter (separate native)
- SwiftUI (iOS only)
- Jetpack Compose (Android only)

App Store Requirements:
- Privacy policy
- Data handling disclosure
- Security best practices
- Regular updates

Estimated Users:
- 60% of traffic from mobile (post-launch)
- 40% on desktop
```

**Estimated Effort**: 600-800 hours (for both platforms)

---

### 8. 🔐 Enhanced Security Features
**Status**: Not implemented
**Priority**: HIGH
**Impact**: Not enterprise-grade security
**Features**: CSRF, audit logging, enhanced auth

```
Security Gaps:
❌ CSRF token protection
❌ Comprehensive audit logging
❌ API key authentication
❌ IP whitelisting
❌ Device fingerprinting
❌ Suspicious login detection
❌ Session invalidation on security events

Required Implementations:
1. CSRF Protection:
   - Generate per-session tokens
   - Validate on state-changing requests
   - Use double-submit cookie pattern

2. Audit Logging:
   - Log all sensitive operations
   - User authentication events
   - Permission changes
   - Data access patterns
   - System changes
   - Duration: 7-year retention

3. API Keys:
   - Support API key auth (in addition to JWT)
   - Rate limiting per key
   - Scoped permissions
   - Key rotation alerts
   - Revocation support

4. Advanced Auth:
   - WebAuthn/FIDO2 support
   - Passwordless auth
   - Conditional MFA (risk-based)
   - Session timeout policies
```

**Estimated Effort**: 80-120 hours

---

## P2 MEDIUM PRIORITY FEATURES

### Missing in Current Implementation
1. **Cashflow Forecasting** - Predict cash needs
2. **Net Worth Tracking** - Historical net worth trends
3. **Financial Goals** - Goal setting & tracking
4. **Debt Payoff Calculator** - Optimization suggestions
5. **Investment Allocation** - Portfolio rebalancing suggestions
6. **Bank Feed Webhooks** - Real-time updates (Plaid webhooks)
7. **Custom Reports** - User-defined report builder
8. **API Rate Increase** - Higher limits for enterprise
9. **SSO/SAML** - Enterprise single sign-on
10. **Audit Trail UI** - User-visible audit logs

---

## Comparison Matrix: Mappr vs Monarch vs Competitors

| Feature | Mappr | Monarch | Rocket Money | Feature Score |
|---------|-------|---------|-------------|----------------|
| Crypto Tracking | ✅✅✅ | ✅ | ❌ | Mappr wins |
| Bank Sync | ✅✅ | ✅✅✅ | ✅✅✅ | Tied/Monarch |
| Categorization | ✅✅ | ✅✅✅ | ✅✅✅ | Monarch |
| Budgeting | ⚠️ (broken) | ✅✅ | ✅✅ | Monarch |
| Recurring Detect | ❌ | ✅✅ | ✅✅ | Monarch |
| Investments | ❌ | ✅✅ | ✅✅ | Monarch |
| Tax Reports | ❌ | ✅ | ✅ | Monarch |
| Analytics | ⚠️ (basic) | ✅✅ | ✅✅ | Monarch |
| Mobile App | ❌ | ✅✅ | ✅✅ | Monarch |
| Multi-Org | ✅✅ | ❌ | ❌ | **Mappr wins** |
| API Access | ✅ | ❌ | ❌ | **Mappr wins** |
| Real-time Sync | ✅✅ | ✅ | ✅ | Tied |
| **Overall** | 60% | 85% | 85% | Gap: -25% |

---

## Implementation Roadmap

### Phase 1: Production Readiness (Weeks 1-6)
**Priority**: Fix all P0 issues before going live

```
Week 1-2: Testing Infrastructure
├─ Jest setup & config
├─ Test utilities & helpers
├─ Coverage reporting
└─ CI/CD integration

Week 2-3: Critical Fixes
├─ Database indexes
├─ Secrets encryption
├─ Monitoring setup
└─ Budget alert processor

Week 4-6: Security Hardening
├─ CSRF protection
├─ Audit logging
├─ API rate limits review
└─ Penetration testing
```

### Phase 2: Core Features (Weeks 7-14)
**Priority**: Add high-impact missing features

```
Week 7-10: Traditional Investments
├─ Broker API integration (3 major brokers)
├─ Portfolio aggregation
├─ Performance tracking
└─ Tax lot tracking

Week 11-14: Advanced Analytics
├─ Spending trends & forecasting
├─ Recurring transaction detection
├─ Subscription tracking
└─ Insights engine
```

### Phase 3: Enhancement (Weeks 15-24)
**Priority**: Reach feature parity with Monarch

```
Week 15-18: Tax & Reporting
├─ Tax report generation
├─ Export to tax software
├─ Capital gains tracking
└─ Deduction categorization

Week 19-24: Mobile Apps
├─ React Native setup
├─ Core mobile features
├─ iOS/Android builds
└─ App store launch
```

---

## Resource Requirements

### Team Composition
```
Total Budget: $500K - $750K

Full-time Contributors:
├─ 2x Senior Backend Engineers (testing, security, performance)
├─ 1x DevOps Engineer (monitoring, infrastructure)
├─ 1x QA Engineer (test strategy, automation)
├─ 1x Product Manager (prioritization, roadmap)
└─ 1x Tech Lead (architecture, code review)

Contractors:
├─ Mobile developers (iOS/Android) - 3 months
├─ Security consultant - 2 weeks (audit)
└─ Tax/compliance advisor - 1 month
```

### Technology Stack Additions
```
New Dependencies:
├─ aws-sdk (KMS encryption)
├─ datadog-api-client (APM)
├─ react-native (mobile)
├─ react-native-swift (iOS bridge)
└─ various tax calculation libraries
```

---

## Risk Assessment

### High Risk
1. **Test Coverage** - Large codebase, many untested paths
2. **Migration** - Secrets encryption is breaking change
3. **Performance** - Missing indexes will cause slowdown during migration
4. **Mobile Launch** - Large project, potential 3-month delay

### Medium Risk
1. **Tax Compliance** - Complex requirements, regulatory changes
2. **Broker Integration** - API changes, custom handling per broker
3. **Multi-Currency** - Rounding errors, exchange rate delays

### Low Risk
1. **Monitoring** - Standard tools, well-documented
2. **Additional APIs** - Complementary to existing integrations

---

## Success Criteria

### Production Ready
- [ ] 70%+ test coverage
- [ ] 0 high-severity security issues (pentest)
- [ ] <100ms p99 response time
- [ ] Budget alerts working
- [ ] APM dashboard live
- [ ] Secrets encrypted

### Feature Parity with Monarch (75%+)
- [ ] Investment tracking
- [ ] Tax reports
- [ ] Advanced analytics
- [ ] Mobile apps
- [ ] Recurring detection
- [ ] Bank reconciliation

### Scale Targets
- [ ] 10,000+ DAU
- [ ] 100+ crypto wallets synced daily
- [ ] 50+ financial accounts connected
- [ ] <1% error rate
- [ ] 99.9% uptime

---

See [05-FEATURES.md](./05-FEATURES.md) for available features and [07-GETTING-STARTED.md](./07-GETTING-STARTED.md) for development setup.
