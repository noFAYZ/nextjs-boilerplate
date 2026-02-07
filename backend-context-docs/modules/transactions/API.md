# Transactions Module - API Reference

**Current Status**: ✅ Fully Documented (60+ endpoints)

---

## Module Overview

The Transactions module provides comprehensive transaction management with intelligent categorization, rules-based automation, recurring pattern detection, and advanced analytics. Endpoints are organized across multiple base paths.

---

## API Base Paths

| Base Path | Purpose | Endpoints |
|-----------|---------|-----------|
| `/api/v1/transactions` | Core transaction operations | 18 |
| `/api/v1/categories` | Category management | 6 |
| `/api/v1/category-groups` | Category groups | 5 |
| `/api/v1/category-rules` | Auto-categorization rules | 10 |
| `/api/v1/categorization-rules` | Custom categorization rules | 14 |
| `/api/v1/findings` | Analytics & reconciliation | 6 |
| `/api/v1/merchants` | Merchant data | 1 |
| **TOTAL** | | **60+** |

---

## 1. Core Transactions (`/api/v1/transactions`)

### CRUD Operations

#### List Transactions
**Endpoint**: `GET /api/v1/transactions`

**Query Parameters**:
- `accountId` (string) - Filter by account
- `categoryId` (string) - Filter by category
- `type` (string) - INCOME, EXPENSE, TRANSFER
- `dateFrom` (ISO date) - Start date
- `dateTo` (ISO date) - End date
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20) - Items per page

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "accountId": "acc_456",
      "amount": 6.50,
      "date": "2025-01-18T10:30:00Z",
      "description": "Starbucks",
      "type": "EXPENSE",
      "status": "POSTED",
      "categoryId": "cat_food",
      "notes": "Morning coffee",
      "tags": ["daily", "coffee"],
      "createdAt": "2025-01-18T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245
  },
  "timestamp": "2025-01-18T11:00:00Z"
}
```

---

#### Create Transaction
**Endpoint**: `POST /api/v1/transactions`

**Request**:
```json
{
  "accountId": "acc_456",
  "amount": 6.50,
  "date": "2025-01-18T10:30:00Z",
  "description": "Starbucks",
  "type": "EXPENSE",
  "status": "POSTED",
  "categoryId": "cat_food",
  "notes": "Morning coffee",
  "tags": ["daily", "coffee"]
}
```

**Response** (201): Created transaction object

---

#### Get Transaction by ID
**Endpoint**: `GET /api/v1/transactions/{id}`

**Response** (200): Full transaction details

---

#### Update Transaction
**Endpoint**: `PUT /api/v1/transactions/{id}`

**Request**:
```json
{
  "description": "Updated description",
  "categoryId": "cat_food",
  "status": "CLEARED",
  "notes": "Updated notes"
}
```

**Response** (200): Updated transaction

---

#### Delete Transaction
**Endpoint**: `DELETE /api/v1/transactions/{id}`

**Response** (204): No content

---

### Search & Filtering

#### Search Transactions
**Endpoint**: `GET /api/v1/transactions/search`

**Query Parameters**:
- `q` (string) - Search query (merchant/description/notes)
- `accountIds` (string) - Comma-separated account IDs
- `categories` (string) - Comma-separated category IDs
- `merchants` (string) - Comma-separated merchant IDs
- `minAmount` (number) - Minimum amount
- `maxAmount` (number) - Maximum amount
- `dateFrom` (YYYY-MM-DD) - Start date
- `dateTo` (YYYY-MM-DD) - End date
- `isDuplicate` (boolean) - Filter by duplicate status
- `limit` (integer, default: 50, max: 500)
- `offset` (integer, default: 0)

**Example**:
```
GET /api/v1/transactions/search?q=coffee&category=food&limit=50
```

**Response** (200): Array of matching transactions

---

### Bulk Operations

#### Create Multiple Transactions
**Endpoint**: `POST /api/v1/transactions/bulk`

**Request**:
```json
{
  "transactions": [
    { "accountId": "acc_1", "amount": 100, "description": "Txn 1", ... },
    { "accountId": "acc_2", "amount": 200, "description": "Txn 2", ... }
  ]
}
```

**Response** (201): Created transactions

---

#### Validate Bulk Operation
**Endpoint**: `POST /api/v1/transactions/bulk/validate`

**Request**:
```json
{
  "transactionIds": ["txn_123", "txn_124", "txn_125"]
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "valid": 3,
    "invalid": 0,
    "total": 3
  }
}
```

---

### Statistics

#### Get Transaction Stats
**Endpoint**: `GET /api/v1/transactions/stats`

**Query Parameters**:
- `accountId` (string)
- `dateFrom` (ISO date)
- `dateTo` (ISO date)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalTransactions": 127,
    "totalAmount": 3245.50,
    "averageAmount": 25.56,
    "largestTransaction": 450.00,
    "smallestTransaction": 2.50
  }
}
```

---

### Notes & Attachments

#### Get Transaction Notes
**Endpoint**: `GET /api/v1/transactions/{id}/notes`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123",
    "notes": ["Updated notes", "Initial notes"]
  }
}
```

---

#### Add Transaction Notes
**Endpoint**: `POST /api/v1/transactions/{id}/notes`

**Request**:
```json
{
  "text": "This is a note about the transaction"
}
```

**Response** (201): Note created

---

#### Upload Attachment
**Endpoint**: `POST /api/v1/transactions/{id}/attachments`

**Request**: Multipart form-data with `file` field

**Response** (201): Attachment metadata

---

#### Get Attachments
**Endpoint**: `GET /api/v1/transactions/{id}/attachments`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "att_123",
      "filename": "receipt.pdf",
      "fileSize": 245000,
      "uploadedAt": "2025-01-18T10:35:00Z"
    }
  ]
}
```

---

#### Download Attachment
**Endpoint**: `GET /api/v1/attachments/{attachmentId}/download`

**Response** (200): Presigned download URL

---

#### Delete Attachment
**Endpoint**: `DELETE /api/v1/attachments/{attachmentId}`

**Response** (204): Deleted

---

#### Make Attachment Public
**Endpoint**: `PUT /api/v1/attachments/{attachmentId}/public`

**Response** (200): Attachment is now public

---

#### Make Attachment Private
**Endpoint**: `DELETE /api/v1/attachments/{attachmentId}/public`

**Response** (200): Attachment is now private

---

### Reconciliation

#### Reconcile Transaction
**Endpoint**: `POST /api/v1/transactions/{id}/reconcile`

**Request**:
```json
{
  "matchedTransactionId": "txn_999",
  "notes": "Matched with bank statement"
}
```

**Response** (200): Transaction marked as reconciled

---

## 2. Categories (`/api/v1/categories`)

#### List Categories
**Endpoint**: `GET /api/v1/categories`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "default": [
      {
        "id": "cat_food",
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B",
        "groupId": "group_1"
      }
    ],
    "custom": [
      {
        "id": "cat_custom_1",
        "name": "Side Projects",
        "icon": "💼",
        "color": "#96CEB4"
      }
    ]
  }
}
```

---

#### Create Custom Category
**Endpoint**: `POST /api/v1/categories`

**Request**:
```json
{
  "name": "Fitness",
  "categoryGroupId": "group_1",
  "icon": "💪",
  "color": "#FF6B9D"
}
```

**Response** (201): Created category

---

#### Initialize Default Categories
**Endpoint**: `POST /api/v1/categories/initialize`

**Response** (200): Categories initialized

---

#### Update Category
**Endpoint**: `PUT /api/v1/categories/{id}`

**Request**:
```json
{
  "name": "Updated Name",
  "icon": "🆕",
  "color": "#XXXXXX"
}
```

**Response** (200): Updated category

---

#### Delete Category
**Endpoint**: `DELETE /api/v1/categories/{id}`

**Response** (204): Deleted

---

#### Toggle Category Status
**Endpoint**: `PATCH /api/v1/categories/{id}/status`

**Request**:
```json
{
  "isEnabled": false
}
```

**Response** (200): Status updated

---

## 3. Category Groups (`/api/v1/category-groups`)

#### List Category Groups
**Endpoint**: `GET /api/v1/category-groups`

**Response** (200): Array of category groups

---

#### Create Category Group
**Endpoint**: `POST /api/v1/category-groups`

**Request**:
```json
{
  "name": "Personal",
  "icon": "👤",
  "color": "#4ECDC4"
}
```

**Response** (201): Created group

---

#### Update Category Group
**Endpoint**: `PUT /api/v1/category-groups/{id}`

**Response** (200): Updated group

---

#### Delete Category Group
**Endpoint**: `DELETE /api/v1/category-groups/{id}`

**Response** (204): Deleted

---

#### Toggle Group Status
**Endpoint**: `PATCH /api/v1/category-groups/{id}/status`

**Request**:
```json
{
  "isEnabled": false
}
```

**Response** (200): Status updated

---

## 4. Category Rules (`/api/v1/category-rules`)

#### Create Rule
**Endpoint**: `POST /api/v1/category-rules`

**Request**:
```json
{
  "pattern": "starbucks",
  "categoryId": "cat_food",
  "description": "Starbucks coffee purchases",
  "priority": 50
}
```

**Response** (201): Created rule

---

#### List Rules
**Endpoint**: `GET /api/v1/category-rules`

**Response** (200): Array of rules

---

#### Get Rule
**Endpoint**: `GET /api/v1/category-rules/{id}`

**Response** (200): Rule details

---

#### Update Rule
**Endpoint**: `PUT /api/v1/category-rules/{id}`

**Response** (200): Updated rule

---

#### Delete Rule
**Endpoint**: `DELETE /api/v1/category-rules/{id}`

**Response** (204): Deleted

---

#### Create Merchant Rule
**Endpoint**: `POST /api/v1/category-rules/merchant-rules`

**Request**:
```json
{
  "merchantName": "Starbucks",
  "categoryId": "cat_food"
}
```

**Response** (201): Created merchant rule

---

#### List Merchant Rules
**Endpoint**: `GET /api/v1/category-rules/merchant-rules`

**Response** (200): Array of merchant rules

---

#### Delete Merchant Rule
**Endpoint**: `DELETE /api/v1/category-rules/merchant-rules/{id}`

**Response** (204): Deleted

---

#### Bulk Recategorize
**Endpoint**: `POST /api/v1/category-rules/bulk-recategorize`

**Request**:
```json
{
  "transactionIds": ["txn_1", "txn_2", "txn_3"],
  "categoryId": "cat_food"
}
```

**Response** (200): Transactions recategorized

---

#### Get Categorization Stats
**Endpoint**: `GET /api/v1/category-rules/stats/categorization`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "totalRules": 25,
    "transactionsCategorized": 1250,
    "successRate": 0.92
  }
}
```

---

## 5. Custom Categorization Rules (`/api/v1/categorization-rules`)

#### Create Rule
**Endpoint**: `POST /api/v1/categorization-rules`

**Request**:
```json
{
  "pattern": "^(netflix|hulu|disney)",
  "categoryId": "cat_entertainment",
  "description": "Streaming subscriptions",
  "priority": 80,
  "isEnabled": true
}
```

**Response** (201): Created rule

---

#### List Rules
**Endpoint**: `GET /api/v1/categorization-rules`

**Response** (200): User's custom rules

---

#### Get Rule
**Endpoint**: `GET /api/v1/categorization-rules/{ruleId}`

**Response** (200): Rule details

---

#### Update Rule
**Endpoint**: `PUT /api/v1/categorization-rules/{ruleId}`

**Response** (200): Updated rule

---

#### Delete Rule
**Endpoint**: `DELETE /api/v1/categorization-rules/{ruleId}`

**Response** (204): Deleted

---

#### Test Single Rule
**Endpoint**: `POST /api/v1/categorization-rules/{ruleId}/test`

**Request**:
```json
{
  "merchantName": "Netflix"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "matches": true,
    "categoryId": "cat_entertainment"
  }
}
```

---

#### Test All Rules
**Endpoint**: `POST /api/v1/categorization-rules/test-all`

**Request**:
```json
{
  "merchantName": "Netflix"
}
```

**Response** (200): First matching rule (highest priority)

---

#### Enable Rule
**Endpoint**: `POST /api/v1/categorization-rules/{ruleId}/enable`

**Response** (200): Rule enabled

---

#### Disable Rule
**Endpoint**: `POST /api/v1/categorization-rules/{ruleId}/disable`

**Response** (200): Rule disabled

---

#### Set Rule Priority
**Endpoint**: `POST /api/v1/categorization-rules/{ruleId}/priority`

**Request**:
```json
{
  "priority": 95
}
```

**Response** (200): Priority updated (0-100, higher applies first)

---

#### Get Rule Stats
**Endpoint**: `GET /api/v1/categorization-rules/{ruleId}/stats`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "matches": 125,
    "successRate": 0.98,
    "lastUsed": "2025-01-18T10:30:00Z"
  }
}
```

---

#### Duplicate Rule
**Endpoint**: `POST /api/v1/categorization-rules/{ruleId}/duplicate`

**Response** (201): New rule created as copy

---

#### Import Rules
**Endpoint**: `POST /api/v1/categorization-rules/import`

**Request**:
```json
{
  "rules": [
    { "pattern": "amazon", "categoryId": "cat_shopping", ... },
    { "pattern": "uber", "categoryId": "cat_transport", ... }
  ]
}
```

**Response** (201): Rules imported

---

#### Export Rules
**Endpoint**: `GET /api/v1/categorization-rules/export`

**Response** (200): JSON file of all rules

---

## 6. Findings/Analytics (`/api/v1/findings`)

#### Auto-Categorize Account
**Endpoint**: `POST /api/v1/findings/accounts/{accountId}/auto-categorize`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "categorized": 125,
    "skipped": 5,
    "total": 130
  }
}
```

---

#### Detect Recurring Patterns
**Endpoint**: `GET /api/v1/findings/accounts/{accountId}/recurring`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "patterns": [
      {
        "merchant": "Netflix",
        "amount": 15.99,
        "frequency": "monthly",
        "occurrences": 12,
        "nextExpected": "2025-02-18"
      }
    ]
  }
}
```

---

#### Get Expected Transactions
**Endpoint**: `GET /api/v1/findings/accounts/{accountId}/expected-transactions`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "merchant": "Netflix",
      "amount": 15.99,
      "expectedDate": "2025-02-18",
      "confidence": 0.99
    }
  ]
}
```

---

#### Export Transactions
**Endpoint**: `GET /api/v1/findings/accounts/{accountId}/export`

**Query Parameters**:
- `format` (CSV/JSON/PDF, default: CSV)
- `dateFrom` (required, ISO date)
- `dateTo` (required, ISO date)

**Example**:
```
GET /api/v1/findings/accounts/acc_123/export?format=CSV&dateFrom=2025-01-01&dateTo=2025-01-31
```

**Response** (200): Exported file

---

#### Find Matches (Reconciliation)
**Endpoint**: `GET /api/v1/findings/find-matches`

**Query Parameters**:
- `accountId` (required)
- `transactionId` (required)
- `windowDays` (default: 2)

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_456",
      "amount": 6.50,
      "merchant": "Starbucks",
      "date": "2025-01-18T10:35:00Z",
      "matchScore": 0.98
    }
  ]
}
```

---

#### Get Reconciliation Progress
**Endpoint**: `GET /api/v1/findings/reconciliation-progress`

**Query Parameters**:
- `accountId` (required)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total": 450,
    "reconciled": 380,
    "pending": 70,
    "percentage": 84.4
  }
}
```

---

## 7. Merchants (`/api/v1/merchants`)

#### Get Unique Merchants
**Endpoint**: `GET /api/v1/merchants`

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "m_123",
      "name": "Starbucks",
      "transactionCount": 45,
      "totalAmount": 292.50,
      "frequency": "daily",
      "lastTransaction": "2025-01-18T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| TRANSACTION_NOT_FOUND | 404 | Transaction doesn't exist |
| CATEGORY_NOT_FOUND | 404 | Category not found |
| INVALID_MERGE | 400 | Cannot merge those transactions |
| INVALID_SPLIT | 400 | Invalid split amounts |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | No access to this resource |
| VALIDATION_ERROR | 400 | Invalid request data |

---

## Rate Limits

- **Transactions**: 100 req/15min
- **Search**: 50 req/15min
- **Create/Update**: 10 req/min
- **Bulk Operations**: 5 req/min
- **Export**: 3 req/15min
- **Rules**: 10 req/min

All rate limit errors return `429 Too Many Requests`.

---

## Authentication

All endpoints require Bearer JWT token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

---

## Response Format

All responses follow standard format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2025-01-18T11:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-18T11:00:00Z"
}
```
