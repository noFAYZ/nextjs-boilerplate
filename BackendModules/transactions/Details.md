# Transactions Module - Details

**Path**: `src/modules/transactions/`

## Overview

Comprehensive transaction management across crypto and banking channels with intelligent categorization, full-text search, recurring detection, and advanced analytics. Unified transaction view across all financial data sources.

**Status**: ✅ Production Ready
**Maturity**: High (Core features complete)

---

## Features

### 1. Multi-Source Transaction Aggregation
- **Crypto Transactions**: Blockchain transactions (transfers, swaps, mints, burns)
- **Banking Transactions**: ACH, wire transfers, card purchases, deposits
- **DeFi Transactions**: Protocol interactions (lending, staking, yield farming)
- **Unified View**: Single transaction stream across all sources
- **Deduplication**: Prevent duplicate transaction records

### 2. Intelligent Categorization
- **Rule-Based Engine**: Pre-defined category rules (salary, groceries, gas, etc.)
- **Pattern Matching**: Merchant name matching against merchant database
- **ML Classification**: Machine learning model for unknown transactions
- **Custom Categories**: User-created categories for personal rules
- **Recurring Patterns**: Auto-detection of recurring transactions
- **Category Hierarchy**: Parent/child category structure

### 3. Full-Text Search
- **Merchant Search**: Find by merchant name or partial match
- **Description Search**: Search transaction descriptions
- **Category Filter**: Filter by category hierarchy
- **Date Range**: Range queries on transaction dates
- **Amount Range**: Min/max balance queries
- **Combined Filters**: Complex boolean queries

### 4. Recurring Transaction Detection
- **Automatic Detection**: Identify recurring patterns
- **Frequency Analysis**: Daily, weekly, monthly, quarterly, annual patterns
- **Amount Consistency**: Detect fixed and variable recurring transactions
- **Merchant Matching**: Group by merchant with tolerance
- **User Confirmation**: Present patterns for user review
- **Prediction**: Forecast upcoming recurring transactions

### 5. Transaction Analytics
- **Spending Trends**: Category spending over time
- **Budget vs Actual**: Compare budget limits to actual spending
- **Merchant Analytics**: Top merchants by frequency and amount
- **Time-based Analysis**: Spending by day of week, time of month
- **Cash Flow Analysis**: Income vs expenses, net flow tracking
- **Category Breakdown**: Pie charts and distribution analysis

### 6. Transaction Management
- **Edit Transactions**: Modify category, notes, metadata
- **Split Transactions**: Split single transaction across categories
- **Merge Transactions**: Combine related transactions
- **Tag Transactions**: Custom tags for organization
- **Pin/Favorite**: Mark important transactions
- **Archive**: Hide old transactions from main view

---

## How It Works

### Transaction Import Flow
```
New transaction appears in bank/blockchain
    ↓
Raw transaction data received from provider
    ↓
Normalize to standard transaction format
    ├─ Extract merchant, amount, date
    ├─ Generate transaction ID
    └─ Store raw metadata
    ↓
Run duplicate detection
    ├─ Check txHash (crypto) or similar transactions (banking)
    ├─ If duplicate found: Skip or update
    └─ If new: Continue
    ↓
Queue CATEGORIZE_TRANSACTION job
    ↓
[Background] Run categorization pipeline
    ├─ Step 1: Check rule-based engine
    ├─ Step 2: Pattern match against merchants
    ├─ Step 3: Run ML classifier if uncertain
    └─ Step 4: Store category with confidence score
    ↓
Run recurring detection
    ├─ Check against known recurring patterns
    ├─ If match: Update recurring transaction
    └─ If new: Create new recurring pattern (pending user confirmation)
    ↓
Emit transaction:created event
    ↓
Update analytics/dashboards
    ↓
User sees transaction in unified feed
```

### Categorization Pipeline
```
Transaction enters categorization service
    ↓
Step 1: Rule-Based Engine
    ├─ Check merchant name against rule database
    ├─ Check amount ranges for category
    ├─ Check date patterns (e.g., 1st of month = salary)
    ├─ If match with high confidence: Return category
    └─ If no match: Proceed to Step 2
    ↓
Step 2: Pattern Matching
    ├─ Fuzzy match merchant name
    ├─ Check similar past transactions
    ├─ Calculate match score (0-1)
    ├─ If score > 0.85: Use matched category
    └─ If score < 0.85: Proceed to Step 3
    ↓
Step 3: Machine Learning
    ├─ Extract features (merchant, amount, date, description)
    ├─ Run classification model
    ├─ Get top 3 predictions with scores
    ├─ If top score > 0.75: Use prediction
    └─ If top score < 0.75: Return UNCATEGORIZED
    ↓
Step 4: Store Result
    ├─ Save category with confidence score
    ├─ Store method used (rule/pattern/ml/manual)
    └─ Flag for user review if low confidence
    ↓
User can override category anytime
```

### Recurring Detection Flow
```
Transaction arrives after categorization
    ↓
Extract key features:
    ├─ Merchant name
    ├─ Amount (with tolerance ±20%)
    ├─ Day of week/month
    └─ Category
    ↓
Check against known recurring patterns
    ├─ Exact merchant match
    ├─ Amount within tolerance
    ├─ Interval matches historical pattern
    ↓
If high confidence match:
    ├─ Add to existing recurring pattern
    ├─ Update frequency analysis
    └─ Update forecast
    ↓
If no match OR low confidence:
    ├─ Check if pattern exists with transactions < 3 occurrences
    ├─ If yes: Add transaction, increment count
    ├─ If no: Don't flag yet (need 3+ occurrences)
    ↓
If pattern reaches 3+ occurrences:
    ├─ Calculate frequency (daily/weekly/monthly/etc)
    ├─ Calculate average amount
    ├─ Calculate next expected date
    ├─ Notify user: "Recurring transaction detected"
    └─ User can accept/reject/edit
    ↓
User confirms recurring transaction
    ├─ Store as confirmed recurring
    ├─ Enable forecasting
    └─ Track budget against recurring total
```

### Search & Filter Flow
```
User performs search: GET /transactions?merchant=coffee&category=food
    ↓
Parse and validate filters:
    ├─ merchant: "coffee"
    ├─ category: "food"
    ├─ dateFrom: (if specified)
    ├─ dateTo: (if specified)
    └─ amountMin/Max: (if specified)
    ↓
Check full-text search index
    ├─ If merchant index exists: Use indexed search
    └─ If not: Use database LIKE query
    ↓
Apply category hierarchy
    ├─ If category "food": Include all subcategories
    └─ Include exact category only if terminal
    ↓
Execute composite query
    ├─ (merchant ILIKE '%coffee%' OR description ILIKE '%coffee%')
    ├─ AND category IN (food, food.coffee)
    ├─ AND date BETWEEN dateFrom AND dateTo
    └─ ORDER BY date DESC
    ↓
Return paginated results
    ├─ Default 20 per page
    ├─ Include cursor for next page
    └─ Total count for UI
```

---

## Architecture Components

### Controllers (3 files)
- `transactionController.ts` - Main transaction operations (30+ endpoints)
- `categoryController.ts` - Category management
- `recurringController.ts` - Recurring transaction management

### Services (17+ files)
- `transactionService.ts` - Core business logic (20+ methods)
- `transactionCategoryService.ts` - Categorization logic
- `transactionSearchService.ts` - Full-text search and filtering
- `recurringTransactionService.ts` - Recurring pattern detection
- `transactionAnalyticsService.ts` - Analytics and reporting
- `ruleBasedCategoryService.ts` - Rule engine for categorization
- `merchantMatchingService.ts` - Merchant name matching
- `mlCategoryClassifierService.ts` - ML-based categorization
- `transactionImportService.ts` - Import and normalization
- `transactionDeduplicationService.ts` - Duplicate detection
- `transactionSplitService.ts` - Transaction splitting
- `transactionMergeService.ts` - Transaction merging
- `budgetService.ts` - Budget tracking and alerts
- `cashFlowService.ts` - Cash flow analysis
- `spendingTrendService.ts` - Spending analytics
- `transactionTagService.ts` - Tag management
- `transactionExportService.ts` - Export functionality

### Background Jobs
- `transactionJobs.ts` - Job definitions
- `categorization/categorizationProcessor.ts` - Categorization jobs
- `recurring/recurringDetectionProcessor.ts` - Recurring detection
- `analytics/analyticsProcessor.ts` - Analytics calculations
- `import/importProcessor.ts` - Transaction import

### External Integrations
- **Merchant Database**: Merchant name standardization
- **ML Model API**: Category classification service
- **Plaid/Banking Providers**: Transaction data source
- **Blockchain Explorers**: Crypto transaction source

---

## Key Methods

### TransactionService
```
importTransaction(userId, sourceType, transactionData)
  → Import and normalize transaction

listUserTransactions(userId, filters, pagination)
  → Get transactions with filtering and pagination

getTransactionDetails(userId, transactionId)
  → Get single transaction with full metadata

categorizeTransaction(userId, transactionId, category)
  → Manually categorize or recategorize

searchTransactions(userId, query, filters)
  → Full-text search across transactions

splitTransaction(userId, transactionId, splits)
  → Split transaction across categories

mergeTransactions(userId, transactionIds)
  → Merge multiple transactions

tagTransaction(userId, transactionId, tags)
  → Add/remove tags

getTransactionAnalytics(userId, filters)
  → Get analytics dashboard data

getSpendingByCategory(userId, dateRange)
  → Get category breakdown

getRecurringTransactions(userId)
  → Get identified recurring patterns

predictRecurringTransactions(userId, days)
  → Forecast upcoming recurring transactions
```

---

## Database Models

### Transaction
- `id`, `userId`, `sourceType` (banking/crypto/defi)
- `transactionHash`, `merchantName`, `description`
- `amount`, `currency`, `date`
- `category`, `categoryConfidence`
- `tags`, `notes`, `metadata`
- `status` (pending/completed/failed)
- `imported_at`, `updated_at`

### TransactionCategory
- `id`, `userId`, `name`, `icon`
- `parentCategory`, `color`
- `description`, `isCustom`
- `created_at`, `updated_at`

### RecurringTransaction
- `id`, `userId`, `transactionId` (first occurrence)
- `merchant`, `amount`, `category`
- `frequency` (daily/weekly/monthly/yearly)
- `nextExpectedDate`, `lastOccurredAt`
- `status` (pending_confirmation/confirmed/paused)
- `metadata`, `created_at`

### TransactionTag
- `id`, `userId`, `name`, `color`
- `transactionCount`, `created_at`

### Budget
- `id`, `userId`, `category`, `amount`
- `period` (monthly/yearly), `alerts`
- `created_at`, `updated_at`

### TransactionAnalytics
- `id`, `userId`, `period`
- `totalSpending`, `totalIncome`
- `netCashFlow`, `categoryBreakdown`
- `topMerchants`, `spendingTrends`
- `generated_at`

---

## Performance Optimizations

### Caching
- Transaction list: 2 minute TTL (user-specific)
- Category definitions: 24 hour TTL
- Recurring patterns: 5 minute TTL
- Analytics dashboard: 1 hour TTL
- Search results: 5 minute TTL

### Database Indexing
- `transactions(userId, date DESC)`
- `transactions(userId, category)`
- `transactions(userId, merchant)`
- `recurring_transactions(userId, status)`
- `transaction_categories(userId, name)`

### Search Optimization
- Full-text search index on merchant, description
- Elasticsearch integration for complex queries
- Query result caching

### Pagination
- Transactions: limit 50, cursor-based
- Categories: limit 100
- Recurring: limit 50
- Analytics: pre-computed, no pagination

---

## Error Handling

| Error | Code | Status | Reason |
|-------|------|--------|--------|
| Transaction not found | TRANSACTION_NOT_FOUND | 404 | Invalid transaction ID |
| Category not found | CATEGORY_NOT_FOUND | 404 | Invalid category |
| Invalid category | INVALID_CATEGORY | 400 | Cannot assign category |
| Search error | SEARCH_ERROR | 500 | Search indexing error |
| Import failed | IMPORT_FAILED | 503 | Transaction import failed |
| Recurring error | RECURRING_ERROR | 500 | Recurring detection error |
| Split invalid | INVALID_SPLIT | 400 | Invalid split amounts |
| Merge invalid | INVALID_MERGE | 400 | Cannot merge transactions |

---

## Common Use Cases

### UC1: View Spending by Category
```
User opens Analytics dashboard
    ↓
System queries last 30 days of transactions
    ↓
Groups by category (Food, Transport, Entertainment, etc)
    ↓
Pie chart shows: Food 35%, Transport 20%, Other 45%
    ↓
User clicks on Food category
    ↓
See all food transactions with merchants and amounts
```

### UC2: Identify Recurring Transactions
```
Multiple similar transactions appear
    ↓
System detects pattern (monthly Netflix charge)
    ↓
Notification: "Netflix appears to be recurring monthly"
    ↓
User confirms recurring
    ↓
System tracks against budget
    ↓
User gets alert if amount varies significantly
```

### UC3: Search Transactions
```
User searches: "coffee" in merchant field
    ↓
System returns all coffee-related transactions
    ↓
User refines: category=food AND amount < $10
    ↓
See list of small food purchases that are coffee shops
    ↓
User can batch tag or categorize
```

---

## Limits by Plan

| Feature | FREE | PRO | ULTIMATE |
|---------|------|-----|----------|
| Transaction history | 90 days | 24 months | Unlimited |
| Categories | 10 | 50 | Unlimited |
| Custom rules | 0 | 10 | Unlimited |
| Analytics | Basic | Advanced | Advanced + AI |
| Recurring detection | Manual | Auto | Auto + Predictive |
| Data export | CSV | CSV/PDF | CSV/PDF/API |
| Search | Basic | Full-text | Full-text + Semantic |

---

## Future Enhancements

- **Receipt OCR**: Automatic receipt scanning for transactions
- **Semantic Search**: Natural language transaction queries
- **AI Insights**: Spending pattern analysis and recommendations
- **Budget Forecasting**: Predict future spending
- **Automated Rules**: Complex custom categorization rules
- **Receipt Storage**: Archive receipts with transactions
- **Transaction Matching**: Auto-match credit card to bank
- **Tax Categories**: Special tax tracking categories
- **Scheduled Transactions**: Pre-plan future transactions
- **Multi-Currency**: Support and convert foreign currencies
