# Transactions Module - API Reference

**Base Path**: `/api/v1/transactions`

---

## Endpoints Overview

| Method | Endpoint | Purpose | Auth | Rate Limit |
|--------|----------|---------|------|-----------|
| GET | `/` | List transactions with filters | ✅ | 100/15min |
| POST | `/import` | Import transactions | ✅ | 10/min |
| GET | `/{id}` | Get transaction details | ✅ | 100/15min |
| PUT | `/{id}` | Update transaction | ✅ | 10/min |
| POST | `/{id}/categorize` | Categorize transaction | ✅ | 20/min |
| POST | `/{id}/split` | Split transaction | ✅ | 10/min |
| POST | `/merge` | Merge transactions | ✅ | 5/min |
| GET | `/search` | Full-text search | ✅ | 50/15min |
| GET | `/recurring` | List recurring patterns | ✅ | 50/15min |
| POST | `/recurring/confirm` | Confirm recurring pattern | ✅ | 10/min |
| GET | `/categories` | List categories | ✅ | 100/15min |
| POST | `/categories` | Create custom category | ✅ | 10/min |
| GET | `/analytics` | Transaction analytics | ✅ | 50/15min |
| GET | `/analytics/spending` | Spending by category | ✅ | 50/15min |
| GET | `/analytics/trends` | Spending trends | ✅ | 50/15min |
| POST | `/export` | Export transactions | ✅ | 5/min |

---

## Detailed Endpoints

### 1. List Transactions
Get paginated list of transactions with filtering.

**Endpoint**: `GET /`

**Query Parameters**:
```
?page=1&limit=20&category=food&merchant=starbucks&dateFrom=2025-01-01&dateTo=2025-01-31&amountMin=0&amountMax=100&status=completed
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "sourceType": "banking",
      "merchantName": "Starbucks #1234",
      "description": "Coffee",
      "amount": 6.50,
      "currency": "USD",
      "date": "2025-01-18T10:30:00Z",
      "category": "Food & Dining",
      "categoryConfidence": 0.95,
      "status": "completed",
      "tags": ["daily-coffee"],
      "notes": "Usual morning coffee",
      "recurring": true,
      "createdAt": "2025-01-18T10:35:00Z"
    },
    {
      "id": "txn_124",
      "sourceType": "banking",
      "merchantName": "Shell Gas Station",
      "description": "Fuel",
      "amount": 45.00,
      "currency": "USD",
      "date": "2025-01-17T14:15:00Z",
      "category": "Transportation",
      "categoryConfidence": 0.92,
      "status": "completed",
      "tags": ["gas"],
      "notes": null,
      "recurring": false,
      "createdAt": "2025-01-17T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "hasMore": true,
    "cursor": "txn_124"
  },
  "summary": {
    "totalAmount": 51.50,
    "transactionCount": 2,
    "averageAmount": 25.75
  },
  "timestamp": "2025-01-18T11:00:00Z"
}
```

---

### 2. Import Transaction
Import new transaction manually.

**Endpoint**: `POST /import`

**Request**:
```json
{
  "sourceType": "banking",
  "merchantName": "Amazon",
  "description": "Book purchase",
  "amount": 24.99,
  "currency": "USD",
  "date": "2025-01-18",
  "accountId": "acc_123",
  "category": "Shopping",
  "notes": "Python programming book"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "txn_125",
    "sourceType": "banking",
    "merchantName": "Amazon",
    "description": "Book purchase",
    "amount": 24.99,
    "currency": "USD",
    "date": "2025-01-18T00:00:00Z",
    "category": "Shopping",
    "categoryConfidence": 1.0,
    "status": "completed",
    "createdAt": "2025-01-18T11:05:00Z"
  },
  "timestamp": "2025-01-18T11:05:00Z"
}
```

---

### 3. Get Transaction Details
Get full transaction information.

**Endpoint**: `GET /{id}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "txn_123",
    "sourceType": "banking",
    "merchantName": "Starbucks #1234",
    "description": "Coffee",
    "amount": 6.50,
    "currency": "USD",
    "date": "2025-01-18T10:30:00Z",
    "category": "Food & Dining",
    "subcategory": "Coffee Shops",
    "categoryConfidence": 0.95,
    "categoryMethod": "pattern_match",
    "status": "completed",
    "tags": ["daily-coffee", "favorite"],
    "notes": "Usual morning coffee",
    "recurring": true,
    "recurringId": "rec_456",
    "accountId": "acc_123",
    "transactionHash": "0x789abc...",
    "metadata": {
      "merchantId": "m_starbucks_1234",
      "merchantCategory": "5814",
      "transactionType": "purchase",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "createdAt": "2025-01-18T10:35:00Z",
    "updatedAt": "2025-01-18T10:35:00Z"
  },
  "timestamp": "2025-01-18T11:10:00Z"
}
```

---

### 4. Update Transaction
Update transaction details.

**Endpoint**: `PUT /{id}`

**Request**:
```json
{
  "category": "Subscriptions",
  "notes": "Monthly coffee membership",
  "tags": ["monthly-subscription", "favorite"]
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "txn_123",
    "category": "Subscriptions",
    "notes": "Monthly coffee membership",
    "tags": ["monthly-subscription", "favorite"],
    "updatedAt": "2025-01-18T11:15:00Z"
  },
  "timestamp": "2025-01-18T11:15:00Z"
}
```

---

### 5. Categorize Transaction
Assign category to transaction.

**Endpoint**: `POST /{id}/categorize`

**Request**:
```json
{
  "category": "Food & Dining",
  "subcategory": "Restaurants",
  "confidence": 0.95,
  "method": "manual"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "txn_123",
    "category": "Food & Dining",
    "subcategory": "Restaurants",
    "categoryConfidence": 0.95,
    "categorizedAt": "2025-01-18T11:20:00Z"
  },
  "timestamp": "2025-01-18T11:20:00Z"
}
```

---

### 6. Split Transaction
Split transaction across multiple categories.

**Endpoint**: `POST /{id}/split`

**Request**:
```json
{
  "splits": [
    {
      "category": "Food & Dining",
      "amount": 12.50,
      "percentage": 50
    },
    {
      "category": "Entertainment",
      "amount": 12.50,
      "percentage": 50
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "originalTransactionId": "txn_123",
    "splits": [
      {
        "id": "split_123_1",
        "transactionId": "txn_123",
        "category": "Food & Dining",
        "amount": 12.50,
        "percentage": 50
      },
      {
        "id": "split_123_2",
        "transactionId": "txn_123",
        "category": "Entertainment",
        "amount": 12.50,
        "percentage": 50
      }
    ],
    "createdAt": "2025-01-18T11:25:00Z"
  },
  "timestamp": "2025-01-18T11:25:00Z"
}
```

---

### 7. Merge Transactions
Combine multiple transactions into one.

**Endpoint**: `POST /merge`

**Request**:
```json
{
  "transactionIds": ["txn_100", "txn_101"],
  "mergedCategory": "Travel",
  "notes": "Combined trip expenses"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "mergedTransactionId": "txn_merged_123",
    "originalTransactions": ["txn_100", "txn_101"],
    "totalAmount": 150.00,
    "category": "Travel",
    "notes": "Combined trip expenses",
    "createdAt": "2025-01-18T11:30:00Z"
  },
  "timestamp": "2025-01-18T11:30:00Z"
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Cannot merge transactions from different accounts",
  "code": "INVALID_MERGE",
  "timestamp": "2025-01-18T11:30:00Z"
}
```

---

### 8. Full-Text Search
Search transactions by merchant, description, category.

**Endpoint**: `GET /search`

**Query Parameters**:
```
?q=coffee&category=food&dateFrom=2025-01-01&dateTo=2025-01-31&limit=50
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "merchantName": "Starbucks #1234",
      "amount": 6.50,
      "category": "Food & Dining",
      "date": "2025-01-18T10:30:00Z",
      "relevanceScore": 0.98
    },
    {
      "id": "txn_456",
      "merchantName": "Coffee Bean & Tea Leaf",
      "amount": 5.75,
      "category": "Food & Dining",
      "date": "2025-01-17T09:15:00Z",
      "relevanceScore": 0.92
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50
  },
  "timestamp": "2025-01-18T11:35:00Z"
}
```

---

### 9. List Recurring Transactions
Get detected recurring patterns.

**Endpoint**: `GET /recurring`

**Query Parameters**:
```
?status=confirmed&limit=20&sortBy=nextExpectedDate
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "rec_456",
      "merchant": "Netflix",
      "amount": 15.99,
      "category": "Entertainment & Subscriptions",
      "frequency": "monthly",
      "nextExpectedDate": "2025-02-18",
      "lastOccurredAt": "2025-01-18",
      "occurrences": 12,
      "status": "confirmed",
      "budgetedAmount": 15.99,
      "yearlyTotal": 191.88,
      "createdAt": "2024-12-18"
    },
    {
      "id": "rec_789",
      "merchant": "Starbucks",
      "amount": 6.50,
      "category": "Food & Dining",
      "frequency": "daily",
      "nextExpectedDate": "2025-01-19",
      "lastOccurredAt": "2025-01-18",
      "occurrences": 42,
      "status": "confirmed",
      "budgetedAmount": 6.50,
      "yearlyTotal": 2372.50,
      "createdAt": "2024-11-07"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 20
  },
  "timestamp": "2025-01-18T11:40:00Z"
}
```

---

### 10. Confirm Recurring Pattern
Confirm or reject detected recurring transaction.

**Endpoint**: `POST /recurring/confirm`

**Request**:
```json
{
  "recurringId": "rec_pending_123",
  "confirmed": true,
  "frequency": "weekly",
  "budgetCategory": "groceries"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "rec_pending_123",
    "merchant": "Whole Foods",
    "status": "confirmed",
    "frequency": "weekly",
    "nextExpectedDate": "2025-01-25",
    "confirmedAt": "2025-01-18T11:42:00Z"
  },
  "timestamp": "2025-01-18T11:42:00Z"
}
```

---

### 11. List Categories
Get all available categories.

**Endpoint**: `GET /categories`

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
        "subcategories": [
          "Restaurants",
          "Coffee Shops",
          "Groceries",
          "Fast Food",
          "Delivery"
        ]
      },
      {
        "id": "cat_transport",
        "name": "Transportation",
        "icon": "🚗",
        "color": "#4ECDC4",
        "subcategories": [
          "Gas",
          "Parking",
          "Public Transit",
          "Taxi/Rideshare",
          "Car Maintenance"
        ]
      },
      {
        "id": "cat_entertainment",
        "name": "Entertainment",
        "icon": "🎬",
        "color": "#45B7D1",
        "subcategories": [
          "Movies",
          "Games",
          "Subscriptions",
          "Events",
          "Hobbies"
        ]
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
  },
  "timestamp": "2025-01-18T11:45:00Z"
}
```

---

### 12. Create Custom Category
Create user-defined category.

**Endpoint**: `POST /categories`

**Request**:
```json
{
  "name": "Fitness",
  "icon": "💪",
  "color": "#FF6B9D",
  "description": "Gym and fitness-related expenses"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "cat_custom_2",
    "name": "Fitness",
    "icon": "💪",
    "color": "#FF6B9D",
    "isCustom": true,
    "createdAt": "2025-01-18T11:47:00Z"
  },
  "timestamp": "2025-01-18T11:47:00Z"
}
```

---

### 13. Get Transaction Analytics
Get analytics dashboard data.

**Endpoint**: `GET /analytics`

**Query Parameters**:
```
?period=monthly&dateFrom=2025-01-01&dateTo=2025-01-31
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "totalTransactions": 127,
    "totalSpending": 3245.50,
    "totalIncome": 5000.00,
    "netCashFlow": 1754.50,
    "averageTransaction": 25.56,
    "largestTransaction": 450.00,
    "smallestTransaction": 2.50,
    "percentageChange": -5.3,
    "comparison": {
      "previous_period": 3425.00,
      "change": -179.50,
      "changePercent": -5.3
    }
  },
  "timestamp": "2025-01-18T11:50:00Z"
}
```

---

### 14. Get Spending by Category
Get category breakdown.

**Endpoint**: `GET /analytics/spending`

**Query Parameters**:
```
?period=monthly&dateFrom=2025-01-01&dateTo=2025-01-31
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "byCategory": [
      {
        "category": "Food & Dining",
        "amount": 687.50,
        "percentage": 21.2,
        "transactions": 42,
        "trend": "up"
      },
      {
        "category": "Transportation",
        "amount": 425.00,
        "percentage": 13.1,
        "transactions": 8,
        "trend": "stable"
      },
      {
        "category": "Entertainment & Subscriptions",
        "amount": 892.30,
        "percentage": 27.5,
        "transactions": 15,
        "trend": "up"
      },
      {
        "category": "Utilities & Services",
        "amount": 340.70,
        "percentage": 10.5,
        "transactions": 5,
        "trend": "down"
      },
      {
        "category": "Other",
        "amount": 900.00,
        "percentage": 27.7,
        "transactions": 57,
        "trend": "stable"
      }
    ],
    "topMerchants": [
      {
        "merchant": "Amazon",
        "amount": 245.50,
        "transactions": 3,
        "category": "Shopping"
      },
      {
        "merchant": "Netflix",
        "amount": 15.99,
        "transactions": 1,
        "category": "Entertainment"
      }
    ]
  },
  "timestamp": "2025-01-18T11:52:00Z"
}
```

---

### 15. Get Spending Trends
Get trends over time.

**Endpoint**: `GET /analytics/trends`

**Query Parameters**:
```
?days=90&granularity=weekly
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "date": "2025-01-12",
        "spending": 2100.00,
        "income": 5000.00,
        "netCashFlow": 2900.00,
        "transactionCount": 35
      },
      {
        "date": "2025-01-19",
        "spending": 2245.50,
        "income": 2500.00,
        "netCashFlow": 254.50,
        "transactionCount": 42
      }
    ],
    "averageSpending": 2172.75,
    "highestSpendingWeek": "2025-01-19",
    "lowestSpendingWeek": "2025-01-12",
    "trend": "slightly_up"
  },
  "timestamp": "2025-01-18T11:55:00Z"
}
```

---

### 16. Export Transactions
Export transactions to file.

**Endpoint**: `POST /export`

**Request**:
```json
{
  "format": "csv",
  "dateFrom": "2025-01-01",
  "dateTo": "2025-01-31",
  "includeCategories": true,
  "includeNotes": true
}
```

**Response** (202):
```json
{
  "success": true,
  "data": {
    "exportId": "exp_123",
    "format": "csv",
    "status": "processing",
    "estimatedCompletionTime": "2025-01-18T12:05:00Z",
    "downloadUrl": "https://api.mappr.com/exports/exp_123/download"
  },
  "timestamp": "2025-01-18T11:57:00Z"
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| TRANSACTION_NOT_FOUND | 404 | Transaction does not exist |
| CATEGORY_NOT_FOUND | 404 | Category not found |
| INVALID_CATEGORY | 400 | Cannot assign category |
| SEARCH_ERROR | 500 | Search indexing error |
| IMPORT_FAILED | 503 | Transaction import failed |
| RECURRING_ERROR | 500 | Recurring detection failed |
| INVALID_SPLIT | 400 | Invalid split amounts |
| INVALID_MERGE | 400 | Cannot merge transactions |
| EXPORT_FAILED | 503 | Export generation failed |
| UNAUTHORIZED | 403 | Access denied |

---

## Rate Limits

- **List Transactions**: 100 requests/15min
- **Import**: 10 requests/min
- **Update**: 10 requests/min
- **Categorize**: 20 requests/min
- **Search**: 50 requests/15min
- **Analytics**: 50 requests/15min
- **Export**: 5 requests/min

All rate limits return `429 Too Many Requests` when exceeded.
