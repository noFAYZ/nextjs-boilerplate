# Transactions Module API Documentation

## Overview

The Transactions Module manages transaction data, categorization, search, tagging, reconciliation, and attachments. It provides comprehensive transaction lifecycle management with audit trails, duplicate detection, and advanced filtering.

**Module Path:** `src/modules/transactions/`

---

## Responsibility Boundaries

**Transactions Module Owns:**
- Transaction CRUD operations
- Transaction categorization (with audit trail)
- Transaction metadata (notes, tags, attachments)
- Transaction search and filtering
- Bulk transaction operations
- Transaction reconciliation
- Duplicate detection and resolution
- Transaction attachments (receipts, documents)
- Merchant management and enrichment
- Transaction status lifecycle

**Transactions Module Consumes (Read-Only from Connections):**
- Raw transaction data from providers
- Merchant enrichment data
- Provider sync status

---

## Transaction Status Lifecycle

```
SYNCED ─────→ POSTED ─────→ CLEARED ─────→ RECONCILED
  │              │              │              │
  │              │              │              └─ BANK VERIFIED
  │              │              └──────────────── UNRECONCILED
  │              └────────────────────────────── REJECTED
  └──────────────────────────────────────────── ERROR
```

**Status Definitions:**
- `SYNCED` - Transaction imported from provider
- `POSTED` - Transaction confirmed by user/bank
- `CLEARED` - Funds cleared
- `RECONCILED` - Matched to bank statement
- `REJECTED` - User rejected transaction

**Reconciliation Status:**
- `UNMATCHED` - Not matched to bank statement
- `AUTO_MATCHED` - Automatically matched
- `USER_MATCHED` - User manually matched
- `REJECTED` - Match rejected

---

## API Endpoints

### 1. Transaction Search

#### Basic Search
```
GET /api/v1/transactions/search?q=starbucks&limit=20&offset=0

Query Parameters:
- q: string (search query - searches merchant, description, notes)
- limit: number (default: 50, max: 500)
- offset: number (default: 0)
- minAmount: number (optional)
- maxAmount: number (optional)
- category: string (optional)
- merchant: string (optional)
- dateFrom: string (ISO date, optional)
- dateTo: string (ISO date, optional)
- accountId: string (optional)
- isDuplicate: boolean (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123456",
      "accountId": "acc_123",
      "date": "2025-01-09",
      "amount": -50.25,
      "currency": "USD",
      "merchant": "STARBUCKS",
      "description": "STARBUCKS #1234 NYC",
      "category": "FOOD_DINING",
      "status": "POSTED",
      "notes": "Morning coffee",
      "tags": ["coffee", "work"],
      "isDuplicate": false,
      "reconciliationStatus": "AUTO_MATCHED",
      "createdAt": "2025-01-09T09:30:00Z"
    }
  ],
  "pagination": {
    "total": 245,
    "limit": 20,
    "offset": 0,
    "pages": 13
  }
}
```

#### Search by Merchant
```
GET /api/v1/transactions/search/merchant/starbucks?limit=20

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123456",
      "merchant": "STARBUCKS",
      "amount": -50.25,
      "date": "2025-01-09",
      "count": 12  // Number of transactions with this merchant
    }
  ]
}
```

#### Search by Category
```
GET /api/v1/transactions/search/category/:categoryId?limit=50

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123456",
      "category": "FOOD_DINING",
      "amount": -50.25,
      "merchant": "STARBUCKS",
      "date": "2025-01-09"
    }
  ],
  "summary": {
    "totalTransactions": 234,
    "totalAmount": -5432.10,
    "averageAmount": -23.23,
    "categoryName": "Food & Dining"
  }
}
```

#### Search Similar Amount
```
GET /api/v1/transactions/search/similar-amount?amount=50&tolerance=5

Query Parameters:
- amount: number (required)
- tolerance: number (default: 10, ±amount%)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123456",
      "amount": -50.25,
      "merchant": "STARBUCKS",
      "date": "2025-01-09",
      "difference": 0.25
    }
  ]
}
```

#### Merchant Autocomplete
```
GET /api/v1/transactions/search/merchant-suggestions?q=star&limit=10

Response (200):
{
  "success": true,
  "data": [
    {
      "merchant": "STARBUCKS",
      "count": 45,
      "lastUsed": "2025-01-09T09:30:00Z",
      "category": "FOOD_DINING"
    },
    {
      "merchant": "STAR MARKET",
      "count": 12,
      "lastUsed": "2025-01-08T10:00:00Z",
      "category": "SHOPPING"
    }
  ]
}
```

#### Advanced Search
```
POST /api/v1/transactions/search/advanced

Request:
{
  "filters": {
    "merchants": ["STARBUCKS", "UBER"],
    "categories": ["FOOD_DINING", "TRANSPORTATION"],
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    },
    "amountRange": {
      "min": -100,
      "max": -10
    },
    "statuses": ["POSTED", "CLEARED"],
    "reconciliationStatus": "UNMATCHED",
    "accounts": ["acc_123", "acc_456"],
    "isDuplicate": false,
    "tags": ["work"]
  },
  "pagination": {
    "limit": 50,
    "offset": 0
  },
  "sort": "date_desc"
}

Response (200):
{
  "success": true,
  "data": [ /* transaction objects */ ],
  "pagination": {
    "total": 156,
    "limit": 50,
    "offset": 0,
    "pages": 4
  }
}
```

---

### 2. Transaction Notes & Tags

#### Add/Update Notes
```
PUT /api/v1/transactions/:id/notes

Request:
{
  "notes": "Team dinner with marketing dept"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "notes": "Team dinner with marketing dept",
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}

Limits: Max 2000 characters
```

#### Get Transaction Notes
```
GET /api/v1/transactions/:id/notes

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "notes": "Team dinner with marketing dept",
    "createdAt": "2025-01-09T12:00:00Z",
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Delete Notes
```
DELETE /api/v1/transactions/:id/notes

Response (200):
{
  "success": true,
  "message": "Notes deleted"
}
```

#### Add Tags
```
POST /api/v1/transactions/:id/tags/add

Request:
{
  "tags": ["work", "team-lunch"]
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "tags": ["work", "team-lunch"],
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}

Features:
- Tags normalized (lowercase, trimmed)
- Duplicates removed
- Max 50 chars per tag
```

#### Remove Tag
```
POST /api/v1/transactions/:id/tags/remove

Request:
{
  "tags": ["work"]
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "tags": ["team-lunch"],
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Replace All Tags
```
PUT /api/v1/transactions/:id/tags

Request:
{
  "tags": ["business", "deductible"]
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "tags": ["business", "deductible"],
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Get All Tags for User
```
GET /api/v1/transactions/user/tags?sort=count_desc

Query Parameters:
- sort: 'name' | 'count' | 'count_desc' (default: 'count_desc')

Response (200):
{
  "success": true,
  "data": [
    {
      "tag": "work",
      "count": 156,
      "lastUsed": "2025-01-09T13:00:00Z"
    },
    {
      "tag": "personal",
      "count": 89,
      "lastUsed": "2025-01-08T10:00:00Z"
    }
  ]
}
```

#### Get Transactions by Tag
```
GET /api/v1/transactions/tags/:tag?limit=50

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123456",
      "merchant": "STARBUCKS",
      "amount": -50.25,
      "date": "2025-01-09"
    }
  ],
  "metadata": {
    "tag": "work",
    "totalTransactions": 156,
    "totalAmount": -5432.10
  }
}
```

#### Get Tag Statistics
```
GET /api/v1/transactions/tags/stats

Response (200):
{
  "success": true,
  "data": {
    "totalTags": 24,
    "mostUsedTag": "work",
    "mostUsedCount": 156,
    "tags": [
      {
        "tag": "work",
        "count": 156,
        "averageAmount": -34.78
      }
    ]
  }
}
```

#### Search by Notes Content
```
POST /api/v1/transactions/search/notes

Request:
{
  "query": "team",
  "limit": 20
}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "txn_123456",
      "notes": "Team dinner with marketing dept",
      "merchant": "RESTAURANT",
      "amount": -85.50
    }
  ]
}
```

---

### 3. Bulk Operations

#### Bulk Categorize
```
POST /api/v1/transactions/bulk/categorize

Request:
{
  "transactionIds": ["txn_1", "txn_2", "txn_3"],
  "category": "FOOD_DINING"
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 3,
    "totalUpdated": 3,
    "failed": [],
    "updatedIds": ["txn_1", "txn_2", "txn_3"]
  }
}

Limits: Max 1000 transactions per request
```

#### Bulk Tag
```
POST /api/v1/transactions/bulk/tag

Request:
{
  "transactionIds": ["txn_1", "txn_2"],
  "tags": ["work", "deductible"],
  "operation": "add"  // or 'remove' or 'replace'
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 2,
    "totalUpdated": 2,
    "failed": []
  }
}
```

#### Bulk Add Notes
```
POST /api/v1/transactions/bulk/notes

Request:
{
  "transactionIds": ["txn_1", "txn_2"],
  "notes": "Q1 business expenses",
  "operation": "add"  // or 'replace'
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 2,
    "totalUpdated": 2,
    "failed": []
  }
}
```

#### Bulk Delete
```
POST /api/v1/transactions/bulk/delete

Request:
{
  "transactionIds": ["txn_1", "txn_2", "txn_3"]
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 3,
    "totalDeleted": 3,
    "failed": []
  }
}
```

#### Bulk Restore
```
POST /api/v1/transactions/bulk/restore

Request:
{
  "transactionIds": ["txn_1", "txn_2"]
}

Response (200):
{
  "success": true,
  "data": {
    "totalRequested": 2,
    "totalRestored": 2,
    "failed": []
  }
}
```

#### Validate Bulk Operations
```
POST /api/v1/transactions/bulk/validate

Request:
{
  "transactionIds": ["txn_1", "txn_2", "txn_invalid"]
}

Response (200):
{
  "success": true,
  "data": {
    "valid": ["txn_1", "txn_2"],
    "invalid": ["txn_invalid"],
    "validCount": 2,
    "invalidCount": 1
  }
}
```

---

### 4. Transaction Reconciliation

#### Get Transaction Status
```
GET /api/v1/transactions/:id/status

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "status": "CLEARED",
    "reconciliationStatus": "AUTO_MATCHED",
    "statusHistory": [
      {
        "status": "SYNCED",
        "timestamp": "2025-01-09T09:30:00Z"
      },
      {
        "status": "POSTED",
        "timestamp": "2025-01-09T11:00:00Z"
      }
    ]
  }
}
```

#### Update Transaction Status
```
PUT /api/v1/transactions/:id/status

Request:
{
  "status": "CLEARED",
  "reconciliationStatus": "USER_MATCHED"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "status": "CLEARED",
    "reconciliationStatus": "USER_MATCHED",
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Get Status History
```
GET /api/v1/transactions/:id/status-history

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "event_1",
      "status": "SYNCED",
      "fromStatus": null,
      "toStatus": "SYNCED",
      "timestamp": "2025-01-09T09:30:00Z"
    },
    {
      "id": "event_2",
      "status": "POSTED",
      "fromStatus": "SYNCED",
      "toStatus": "POSTED",
      "timestamp": "2025-01-09T11:00:00Z"
    }
  ]
}
```

#### Get Category History
```
GET /api/v1/transactions/:id/category-history

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "event_1",
      "timestamp": "2025-01-09T09:30:00Z",
      "previousCategory": null,
      "newCategory": "UNCATEGORIZED",
      "changedBy": "SYSTEM",
      "changeMethod": "PROVIDER",
      "confidence": 0.0
    },
    {
      "id": "event_2",
      "timestamp": "2025-01-09T13:00:00Z",
      "previousCategory": "UNCATEGORIZED",
      "newCategory": "FOOD_DINING",
      "changedBy": "USER",
      "changeMethod": "MANUAL",
      "confidence": 1.0
    }
  ]
}
```

#### Update Transaction Category
```
PUT /api/v1/transactions/:id/category

Request:
{
  "category": "FOOD_DINING",
  "notes": "Reclassified from food to business"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "category": "FOOD_DINING",
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Revert Category
```
POST /api/v1/transactions/:id/category/revert

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "previousCategory": "FOOD_DINING",
    "newCategory": "UNCATEGORIZED",
    "revertedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Revert Multiple Steps
```
POST /api/v1/transactions/:id/category/revert/:steps

Path Parameters:
- steps: number (number of steps to revert, default: 1)

Response (200):
{
  "success": true,
  "data": {
    "id": "txn_123456",
    "previousCategory": "FOOD_DINING",
    "newCategory": "UNCATEGORIZED",
    "stepsReverted": 2,
    "revertedAt": "2025-01-09T13:00:00Z"
  }
}
```

---

### 5. Transaction Attachments

#### Upload Attachment
```
POST /api/v1/transactions/:id/attachments

Content-Type: multipart/form-data

Parameters:
- file: File (required, max 10MB)
- description: string (optional)
- isPublic: boolean (optional, default: false)

Response (201):
{
  "success": true,
  "data": {
    "id": "att_123456",
    "transactionId": "txn_123",
    "fileName": "receipt.pdf",
    "fileSize": 245632,
    "fileType": "application/pdf",
    "uploadedAt": "2025-01-09T13:00:00Z",
    "description": "Coffee receipt",
    "isPublic": false
  }
}

Limits:
- Max 10MB per file
- Max 10 attachments per transaction
- Allowed types: PDF, JPEG, PNG, DOCX, XLSX
```

#### Get Transaction Attachments
```
GET /api/v1/transactions/:id/attachments

Response (200):
{
  "success": true,
  "data": {
    "attachments": [
      {
        "id": "att_123456",
        "fileName": "receipt.pdf",
        "fileSize": 245632,
        "fileType": "application/pdf",
        "uploadedAt": "2025-01-09T13:00:00Z",
        "description": "Coffee receipt",
        "isPublic": false
      }
    ],
    "total": 1
  }
}
```

#### Download Attachment (Get Presigned URL)
```
GET /api/v1/attachments/:attachmentId/download

Response (200):
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.amazonaws.com/...",
    "expiresIn": 900  // 15 minutes in seconds
  }
}

Features:
- Presigned URL valid for 15 minutes
- Only owner can download private attachments
- Public attachments downloadable by anyone
```

#### Delete Attachment
```
DELETE /api/v1/attachments/:attachmentId

Response (200):
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

#### Make Attachment Public
```
PUT /api/v1/attachments/:attachmentId/public

Response (200):
{
  "success": true,
  "data": {
    "attachmentId": "att_123456",
    "isPublic": true,
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Make Attachment Private
```
DELETE /api/v1/attachments/:attachmentId/public

Response (200):
{
  "success": true,
  "data": {
    "attachmentId": "att_123456",
    "isPublic": false,
    "updatedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Get Attachment Quota Usage
```
GET /api/v1/accounts/attachment-quota

Response (200):
{
  "success": true,
  "data": {
    "used": 1245632,
    "quota": 5368709120,  // 5GB in bytes
    "remaining": 5367463488,
    "percentageUsed": "0.02"
  }
}

Features:
- Per-user quota: 5GB
- Includes all attachments
- Real-time usage tracking
```

---

### 6. Duplicate Detection & Resolution

#### Get All Duplicates
```
GET /api/v1/banking/duplicates?status=PENDING&limit=50

Query Parameters:
- status: PENDING | RESOLVED | IGNORED (optional)
- accountId: string (optional)
- limit: number (default: 50)
- offset: number (default: 0)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "dup_123456",
      "transactionIds": ["txn_1", "txn_2"],
      "merchant": "STARBUCKS",
      "amount": 50.25,
      "status": "PENDING",
      "detectedAt": "2025-01-09T12:00:00Z",
      "transactions": [
        {
          "id": "txn_1",
          "date": "2025-01-09",
          "amount": -50.25
        }
      ]
    }
  ]
}
```

#### Get Duplicate Statistics
```
GET /api/v1/banking/duplicates/stats

Response (200):
{
  "success": true,
  "data": {
    "totalDuplicates": 45,
    "pendingDuplicates": 12,
    "resolvedDuplicates": 30,
    "ignoredDuplicates": 3,
    "totalDuplicateAmount": 2345.67,
    "averageDuplicateAmount": 52.12
  }
}
```

#### Resolve Duplicate
```
POST /api/v1/banking/duplicates/resolve

Request:
{
  "duplicateId": "dup_123456",
  "keepTransactionId": "txn_1",
  "mergeNotes": true
}

Response (200):
{
  "success": true,
  "data": {
    "duplicateId": "dup_123456",
    "status": "RESOLVED",
    "keptTransaction": "txn_1",
    "deletedTransactions": ["txn_2"],
    "resolvedAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Ignore Duplicate
```
POST /api/v1/banking/duplicates/:id/ignore

Request:
{
  "reason": "Not actually a duplicate"
}

Response (200):
{
  "success": true,
  "data": {
    "duplicateId": "dup_123456",
    "status": "IGNORED",
    "reason": "Not actually a duplicate",
    "ignoredAt": "2025-01-09T13:00:00Z"
  }
}
```

#### Get Account Duplicates
```
GET /api/v1/banking/accounts/:accountId/duplicates

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "dup_123456",
      "transactionIds": ["txn_1", "txn_2"],
      "amount": 50.25,
      "status": "PENDING"
    }
  ],
  "statistics": {
    "totalDuplicates": 12,
    "pendingDuplicates": 3,
    "totalDuplicateAmount": 1234.56
  }
}
```

---

## Data Types

### Transaction
```typescript
{
  id: string
  accountId: string
  date: string              // ISO date
  authorizedDate: string    // When authorized
  amount: number            // Signed: negative for debits
  currency: string          // ISO currency code
  merchant: string          // Raw merchant name
  merchantNormalized: string // Normalized name
  category: string          // Transaction category
  description: string       // Full description
  status: TransactionStatus // SYNCED | POSTED | CLEARED | RECONCILED
  reconciliationStatus: string // UNMATCHED | AUTO_MATCHED | USER_MATCHED | REJECTED
  isPending: boolean        // Still pending
  paymentChannel: string    // in_store | online | other
  tags: string[]           // User-defined tags
  notes: string            // User notes (max 2000 chars)
  duplicateKey: string     // SHA-256 hash for duplicate detection
  duplicateOf: string      // ID of original if duplicate
  isDuplicate: boolean     // Is this a duplicate
  createdAt: DateTime      // When synced
  updatedAt: DateTime      // Last update
}
```

### TransactionStatus
```typescript
enum TransactionStatus {
  SYNCED = 'SYNCED',
  POSTED = 'POSTED',
  CLEARED = 'CLEARED',
  RECONCILED = 'RECONCILED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR'
}
```

### ReconciliationStatus
```typescript
enum ReconciliationStatus {
  UNMATCHED = 'UNMATCHED',
  AUTO_MATCHED = 'AUTO_MATCHED',
  USER_MATCHED = 'USER_MATCHED',
  REJECTED = 'REJECTED'
}
```

---

## Features

### Advanced Search
- Full-text search (merchant, description, notes)
- Amount range filtering
- Date range filtering
- Category and merchant filtering
- Status filtering
- Duplicate detection filtering
- Tag-based filtering
- Account-scoped searches
- Pagination with max 500 results

### Audit Trail
- Category change history with timestamps
- Who changed (USER, SYSTEM, PROVIDER)
- How it was changed (MANUAL, RULE, TEMPLATE, PROVIDER)
- Confidence scores for automated changes
- Revert capability with rollback

### Bulk Operations
- Categorize 1000+ transactions at once
- Add/remove/replace tags in bulk
- Add notes in bulk
- Soft delete/restore in bulk
- Validation before operations
- Partial success with error reporting

### Duplicate Detection
- SHA-256 hash-based detection
- Amount, date, and merchant matching
- Automatic flagging
- User resolution workflow
- Merge with note consolidation
- False positive handling

### Real-Time Attachments
- AWS S3 file storage
- Presigned URL downloads (15-min expiry)
- File validation and size limits
- Per-user quota (5GB)
- Public/private access control
- Attachment count limits (10 per transaction)

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_INPUT | 400 | Validation failed |
| TRANSACTION_NOT_FOUND | 404 | Transaction doesn't exist |
| ATTACHMENT_NOT_FOUND | 404 | Attachment doesn't exist |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Insufficient permissions |
| FILE_TOO_LARGE | 413 | File exceeds 10MB |
| INVALID_FILE_TYPE | 400 | File type not supported |
| QUOTA_EXCEEDED | 403 | Attachment quota exceeded |
| ATTACHMENT_LIMIT_EXCEEDED | 403 | Too many attachments per transaction |
| DUPLICATE_NOT_FOUND | 404 | Duplicate record doesn't exist |
| DATABASE_ERROR | 500 | Database operation failed |

---

## Authentication

All endpoints require:
- **JWT Bearer Token** in `Authorization` header
- **Organization ID** from Better Auth session
- **User ID** from JWT payload

---

## Performance Considerations

- Search results limited to 500 items max
- Bulk operations max 1000 items per request
- Attachment upload max 10MB per file
- Notes max 2000 characters
- Tags normalized and deduplicated
- Indexes on: date, merchant, category, accountId, duplicateKey
- Full-text search indexed for fast queries

---

## See Also

- [ACCOUNTS.md](./ACCOUNTS.md) - Account management API
- [CONNECTIONS.md](./CONNECTIONS.md) - Provider integration & real-time updates
