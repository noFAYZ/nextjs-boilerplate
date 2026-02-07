# Transactions Module - Implementation Details

**Path**: `src/modules/transactions/`

**Status**: ✅ Production Ready

---

## Overview

Comprehensive transaction management system for financial operations including:
- Multi-source transaction aggregation (banking, crypto, DeFi)
- Intelligent auto-categorization with rule engine
- Recurring pattern detection
- Advanced search and filtering
- Transaction reconciliation
- Merchant tracking
- Custom categorization rules
- Attachment management

**Current Endpoints**: 60+
**Controllers**: 8
**Services**: 20+
**Routes**: 7 base paths

---

## Module Structure

```
src/modules/transactions/
├── controllers/           # API request handlers
│   ├── transactionController.ts          # Core CRUD + stats
│   ├── transactionSearchController.ts    # Search operations
│   ├── bulkOperationsController.ts       # Bulk operations
│   ├── notesTagsController.ts           # Notes & tags
│   ├── customCategoryController.ts       # Custom categories
│   ├── categoryInitializationController.ts # Category init
│   ├── customRulesController.ts         # Categorization rules
│   ├── categoryRulesController.ts       # Auto-categorization
│   ├── findingsController.ts            # Analytics & reconciliation
│   └── transactionAttachmentsController.ts # File attachments
├── services/             # Business logic
│   ├── transactionService.ts            # Core transaction ops
│   ├── transactionSearchService.ts      # Search & filtering
│   ├── categorizationService.ts         # Categorization logic
│   ├── categoryService.ts               # Category management
│   ├── customCategorizationRulesService.ts # Rule engine
│   ├── categoryTemplateService.ts       # Template system
│   ├── merchantService.ts               # Merchant tracking
│   ├── recurringDetectionService.ts     # Pattern detection
│   ├── reconciliationService.ts         # Reconciliation logic
│   ├── bulkOperationsService.ts         # Bulk operations
│   ├── transactionNotesTagsService.ts   # Notes & tags
│   ├── transactionAttachmentsService.ts # File handling
│   ├── transactionStatusService.ts      # Status management
│   ├── transactionLifecycleService.ts   # Lifecycle events
│   ├── categoryAuditService.ts          # Audit logging
│   └── merchantStatsService.ts          # Merchant analytics
├── routes/               # API route definitions
│   ├── index.ts                         # Route exports
│   ├── transactionRoutes.ts             # /api/v1/transactions
│   ├── categoriesRoutes.ts              # /api/v1/categories
│   ├── categoryGroupsRoutes.ts          # /api/v1/category-groups
│   ├── categoryRulesRoutes.ts           # /api/v1/category-rules
│   ├── customRulesRoutes.ts             # /api/v1/categorization-rules
│   ├── findingsRoutes.ts                # /api/v1/findings
│   ├── merchantsRoutes.ts               # /api/v1/merchants
│   └── transactionAttachmentsRoutes.ts  # Attachments
├── types/               # TypeScript types
│   └── index.ts                         # Type definitions
├── errors/              # Custom error classes
│   ├── index.ts
│   └── transactionErrors.ts
├── events/              # Event system
│   ├── index.ts
│   └── transactionEvents.ts
├── constants/           # Constants
│   └── categoryTemplates.ts             # Default categories
├── clients/             # External clients
│   └── merchantClient.ts                # Merchant API client
├── jobs/                # Background jobs
│   └── merchantStatsRefreshJob.ts       # Job definitions
├── utils/               # Utilities
│   └── responseFormatter.ts             # Response formatting
└── index.ts             # Module exports
```

---

## Core Features

### 1. Transaction Management (18 endpoints)

**Basic Operations**:
- Create single/bulk transactions
- Read/update/delete transactions
- List with pagination and filters
- Get statistics and summaries

**Enhanced Operations**:
- Full-text search across transactions
- Add notes and tags
- Upload/manage attachments
- Bulk validation
- Transaction reconciliation

**File Attachments**:
- Upload files to transactions
- Download with presigned URLs
- Public/private sharing
- Storage quota management

---

### 2. Category Management (6 endpoints)

**Functionality**:
- List all categories (default + custom)
- Create custom categories
- Update category properties
- Delete unused categories
- Toggle enable/disable status
- Initialize default categories (fallback)

**Default Categories** (from `categoryTemplates.ts`):
- Food & Dining
- Transportation
- Entertainment & Subscriptions
- Utilities & Services
- Shopping
- Health & Fitness
- And 15+ more...

---

### 3. Category Groups (5 endpoints)

**Purpose**: Organize categories into logical groups

**Operations**:
- Create custom category groups
- List all groups with hierarchy
- Update group properties
- Delete groups
- Toggle group status

---

### 4. Category Rules (10 endpoints)

**Auto-Categorization System**:
- Pattern-based rules (regex matching)
- Merchant-specific rules
- Priority-based rule execution
- Bulk recategorization
- Rule statistics

**Rule Properties**:
- Pattern (regex)
- Target category
- Priority (0-100)
- Description
- Active/inactive status

---

### 5. Custom Categorization Rules (14 endpoints)

**Advanced Rule Engine**:
- User-defined categorization rules
- Test individual or all rules
- Rule priority management
- Enable/disable rules
- Duplicate existing rules
- Rule statistics and performance
- Import/export rules as JSON

**Features**:
- Regex pattern matching
- Priority-based execution (higher = applies first)
- Enable/disable without deletion
- Performance tracking
- Bulk import/export

---

### 6. Findings & Analytics (6 endpoints)

**Auto-Categorization**:
- Bulk auto-categorize uncategorized transactions
- Category statistics

**Recurring Detection**:
- Detect recurring transaction patterns
- Get expected upcoming transactions
- Pattern analysis

**Transaction Export**:
- Export to CSV/JSON/PDF
- Date range selection
- Format customization

**Reconciliation**:
- Find potential transaction matches
- Match scoring
- Reconciliation progress tracking

---

### 7. Merchant Tracking (1 endpoint)

**Purpose**: View unique merchants with aggregated data

**Data Provided**:
- Merchant name
- Transaction count
- Total amount spent
- Frequency analysis
- Last transaction date

---

## Database Models

### Transactions Table
```
- id (UUID)
- userId (UUID) - FK to users
- accountId (UUID) - FK to financial_accounts
- amount (DECIMAL)
- description (TEXT)
- date (TIMESTAMP)
- type (ENUM: INCOME, EXPENSE, TRANSFER)
- status (ENUM: PENDING, POSTED, CLEARED, RECONCILED)
- categoryId (UUID) - FK to categories (nullable)
- notes (TEXT, nullable)
- tags (TEXT[], nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Categories Table
```
- id (UUID)
- userId (UUID) - FK to users
- name (VARCHAR)
- icon (VARCHAR, nullable)
- color (VARCHAR, nullable)
- isCustom (BOOLEAN)
- groupId (UUID) - FK to category_groups
- isEnabled (BOOLEAN, default: true)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Category Groups Table
```
- id (UUID)
- userId (UUID) - FK to users
- name (VARCHAR)
- icon (VARCHAR, nullable)
- color (VARCHAR, nullable)
- isEnabled (BOOLEAN, default: true)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Categorization Rules Table
```
- id (UUID)
- userId (UUID) - FK to users
- pattern (VARCHAR) - Regex pattern
- categoryId (UUID) - FK to categories
- priority (INTEGER, 0-100)
- isEnabled (BOOLEAN, default: true)
- description (TEXT, nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Category Rules Table (Auto-categorization)
```
- id (UUID)
- userId (UUID) - FK to users
- pattern (VARCHAR)
- categoryId (UUID) - FK to categories
- priority (INTEGER)
- description (TEXT, nullable)
- createdAt (TIMESTAMP)
```

### Merchant Rules Table
```
- id (UUID)
- userId (UUID) - FK to users
- merchantName (VARCHAR)
- categoryId (UUID) - FK to categories
- createdAt (TIMESTAMP)
```

### Transaction Attachments Table
```
- id (UUID)
- transactionId (UUID) - FK to transactions
- fileName (VARCHAR)
- fileSize (INTEGER)
- fileUrl (VARCHAR)
- isPublic (BOOLEAN, default: false)
- createdAt (TIMESTAMP)
```

---

## Service Methods

### TransactionService
```typescript
// CRUD
createTransaction(userId, data): Promise<Transaction>
getTransactions(userId, filters): Promise<Transaction[]>
getTransactionById(userId, transactionId): Promise<Transaction>
updateTransaction(userId, transactionId, data): Promise<Transaction>
deleteTransaction(userId, transactionId): Promise<void>

// Bulk
bulkCreateTransactions(userId, transactions): Promise<Transaction[]>
bulkUpdateTransactions(userId, updates): Promise<void>

// Search
searchTransactions(userId, query, filters): Promise<Transaction[]>

// Statistics
getTransactionStats(userId, filters): Promise<Stats>
```

### CategoryService
```typescript
// Categories
getCategories(userId, includeCustom): Promise<Category[]>
createCategory(userId, data): Promise<Category>
updateCategory(userId, categoryId, data): Promise<Category>
deleteCategory(userId, categoryId): Promise<void>
toggleCategoryStatus(userId, categoryId, enabled): Promise<Category>

// Initialization
initializeDefaultCategories(userId): Promise<Category[]>
```

### CustomCategorizationRulesService
```typescript
// CRUD
createRule(userId, data): Promise<Rule>
getRules(userId): Promise<Rule[]>
getRule(userId, ruleId): Promise<Rule>
updateRule(userId, ruleId, data): Promise<Rule>
deleteRule(userId, ruleId): Promise<void>

// Testing
testRule(userId, ruleId, merchantName): Promise<boolean>
testAllRules(userId, merchantName): Promise<Rule | null>

// Management
enableRule(userId, ruleId): Promise<Rule>
disableRule(userId, ruleId): Promise<Rule>
setPriority(userId, ruleId, priority): Promise<Rule>
getRuleStats(userId, ruleId): Promise<RuleStats>
duplicateRule(userId, ruleId): Promise<Rule>

// Import/Export
importRules(userId, rules): Promise<Rule[]>
exportRules(userId): Promise<Rule[]>
```

### RecurringDetectionService
```typescript
detectRecurringPatterns(userId, accountId): Promise<RecurringPattern[]>
getExpectedTransactions(userId, accountId): Promise<ExpectedTransaction[]>
confirmRecurringPattern(userId, patternId, confirmed): Promise<void>
```

### ReconciliationService
```typescript
findMatches(userId, accountId, transactionId, windowDays): Promise<Match[]>
reconcileTransaction(userId, transactionId, matchedId): Promise<void>
getReconciliationProgress(userId, accountId): Promise<Progress>
```

---

## API Route Registration

Routes are registered in `src/app.ts`:

```typescript
app.use(`/api/v1/transactions`, transactionRoutes);
app.use(`/api/v1/categories`, categoriesRoutes);
app.use(`/api/v1/category-groups`, categoryGroupsRoutes);
app.use(`/api/v1/category-rules`, categoryRulesRoutes);
app.use(`/api/v1/categorization-rules`, customRulesRoutes);
app.use(`/api/v1/findings`, findingsRoutes);
app.use(`/api/v1/merchants`, merchantsRoutes);
```

---

## Request/Response Patterns

### Request Validation
```typescript
// All endpoints validate input before processing
ValidateRequest → CheckAuth → ProcessBusiness → ReturnResponse
```

### Response Format
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional message",
  "timestamp": "ISO-8601 timestamp"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "ISO-8601 timestamp"
}
```

---

## Security & Access Control

### Authentication
- All endpoints require Bearer JWT token
- Token verified in middleware
- User context extracted from token

### Authorization
- Users can only access their own transactions
- userId enforced in all queries
- organizationId support for team access

### Data Protection
- Sensitive data not logged
- Secure file uploads with virus scanning
- Rate limiting on all endpoints

---

## Performance Considerations

### Caching
- Category definitions: 24h TTL
- Search results: 5m TTL
- Transaction lists: 2m TTL (user-specific)

### Database Indexes
```
- transactions(userId, date DESC)
- transactions(userId, categoryId)
- categories(userId, name)
- categorization_rules(userId, priority DESC)
- merchant_rules(userId, merchantName)
```

### Pagination
- Default limit: 20 items
- Maximum limit: 500 items
- Cursor-based pagination for large datasets

---

## Error Handling

Custom error classes in `errors/transactionErrors.ts`:
```typescript
class TransactionError extends Error
class CategoryError extends Error
class RuleError extends Error
class ReconciliationError extends Error
```

Common error codes:
- `TRANSACTION_NOT_FOUND` - 404
- `CATEGORY_NOT_FOUND` - 404
- `INVALID_RULE_PATTERN` - 400
- `UNAUTHORIZED_ACCESS` - 403
- `RATE_LIMIT_EXCEEDED` - 429

---

## Integration Points

### Event System
Emits events from `events/transactionEvents.ts`:
```
transaction:created
transaction:updated
transaction:deleted
transaction:categorized
transaction:reconciled
rule:created
rule:updated
rule:deleted
```

### Merchant Client
`clients/merchantClient.ts` - Integration with merchant database API:
- Merchant name standardization
- Merchant categorization suggestions
- Merchant metadata enrichment

---

## Testing Coverage

Current test files:
- `__tests__/transactionService.test.ts` (core logic)
- `__tests__/searchService.test.ts` (search operations)
- `__tests__/categorizationRulesService.test.ts` (rule engine)

**Coverage Goal**: 70%+ for services and controllers

---

## Future Enhancements

- [ ] Receipt OCR for automatic data extraction
- [ ] Semantic search with NLP
- [ ] AI-powered spending insights
- [ ] Budget forecasting
- [ ] Multi-currency support
- [ ] Tax category tracking
- [ ] Scheduled transactions
- [ ] Transaction duplication detection
- [ ] Mobile receipt capture
- [ ] Real-time transaction alerts

---

## Monitoring & Debugging

### Logging
- Structured JSON logging with Winston
- Correlation IDs for request tracing
- Error context capture

### Health Checks
- Service health endpoints
- Database connectivity checks
- External API status monitoring

### Metrics
- Transaction throughput
- Categorization success rate
- Search performance
- Rule matching statistics
