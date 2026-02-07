# Transaction Data Flow - Complete Architecture

## Overview
This document explains how transactions are fetched and created in the MoneyMappr frontend after the Phase 4 implementation.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│ COMPONENTS (React UI)                                       │
│ - manual-transaction-form.tsx                               │
│ - transaction-list.tsx                                      │
│ - account-detail-page.tsx                                   │
└────────────────────────┬────────────────────────────────────┘
                         │ imports
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ REACT QUERY HOOKS (Server State)                            │
│ - useAddTransaction()          ◄── accounts-queries         │
│ - useCategories()                                            │
│ - useAccountTransactions()                                   │
│ - useTransactions()            ◄── transactions-queries      │
│ - useCreateTransaction()                                     │
│ - useRecurringPatterns()                                     │
│ etc... (50+ hooks total)                                     │
└────────────────────────┬────────────────────────────────────┘
                         │ uses
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ QUERY FACTORIES & MUTATIONS                                 │
│ - accounts-queries.ts      (wrapper layer)                  │
│ - transactions-queries.ts  (core implementation)            │
│                                                              │
│ Features:                                                    │
│ ✓ Query key factories (structured cache keys)              │
│ ✓ Query options (with stale times, error handling)          │
│ ✓ Mutation definitions (CRUD operations)                    │
│ ✓ Automatic cache invalidation                              │
│ ✓ Optimistic updates with rollback                          │
└────────────────────────┬────────────────────────────────────┘
                         │ delegates to
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ API SERVICES                                                │
│ - accounts-api.ts  (wrapper/delegation layer)              │
│ - transactions-api.ts  (actual API methods - 69 endpoints)  │
│                                                              │
│ Methods:                                                     │
│ • listTransactions(params, orgId)                           │
│ • createTransaction(data, orgId)                            │
│ • listCategories(orgId)                                     │
│ • listCategoryGroups(orgId)                                 │
│ • getReconciliationProgress(accountId, orgId)               │
│ etc... (60+ methods)                                         │
└────────────────────────┬────────────────────────────────────┘
                         │ uses
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ HTTP CLIENT                                                  │
│ - lib/api-client.ts                                         │
│                                                              │
│ Handles:                                                     │
│ ✓ Authorization headers                                     │
│ ✓ Base URL configuration                                    │
│ ✓ Error handling                                            │
│ ✓ Response formatting                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND API                                                  │
│ - POST /api/v1/transactions          (create)               │
│ - GET /api/v1/transactions           (list)                 │
│ - GET /api/v1/transactions/{id}      (detail)               │
│ - PUT /api/v1/transactions/{id}      (update)               │
│ - DELETE /api/v1/transactions/{id}   (delete)               │
│ - GET /api/v1/categories             (list categories)      │
│ - GET /api/v1/category-groups        (list groups)          │
│ - POST /api/v1/findings/...          (analytics)            │
│ etc... (69 endpoints total)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. FETCHING TRANSACTIONS FOR AN ACCOUNT

```
Component Usage:
────────────────
const { data: transactions, isLoading, error } = useAccountTransactions(accountId);

Data Flow:
──────────
1. Component calls useAccountTransactions(accountId)
   ↓
2. Hook calls useQuery with accounts-queries.accountTransactions(accountId)
   ↓
3. Query function calls accountsApi.getAccountTransactions(accountId, params)
   ↓
4. accounts-api dynamically imports transactionsApi
   ↓
5. Calls transactionsApi.listTransactions({ accountId, ...params }, orgId)
   ↓
6. Creates URLSearchParams with query string
   ↓
7. Calls apiClient.get('/transactions?accountId=...', orgId)
   ↓
8. HTTP GET request to backend: /api/v1/transactions?accountId=xxx
   ↓
9. Backend returns transaction list with pagination
   ↓
10. TanStack Query caches response with key: ['unified-accounts', 'transactions', accountId, orgId]
    ↓
11. Component receives { data: [...transactions], isLoading: false, error: null }

Cache Stale Time: 5 minutes
```

### 2. CREATING A TRANSACTION

```
Component Usage:
────────────────
const { mutate: addTransaction } = useAddTransaction();

addTransaction(
  { accountId: 'acc-123', data: {
    description: 'Coffee',
    date: '2025-02-07',
    amount: 5.50,
    categoryId: 'cat-food',
    type: 'EXPENSE',
    notes: 'Morning coffee at Starbucks'
  }},
  {
    onSuccess: () => console.log('Success'),
    onError: (err) => console.error(err)
  }
);

Data Flow:
──────────
1. Component calls mutate with { accountId, data }
   ↓
2. Mutation onMutate handler runs (optimistic updates):
   - Cancels any pending refetches
   - Snapshots current cache data
   - Optimistically updates list with temp ID
   ↓
3. MutationFn runs: accountsApi.addTransaction(accountId, data)
   ↓
4. accounts-api imports transactionsApi
   ↓
5. Calls transactionsApi.createTransaction({ accountId, ...data }, orgId)
   ↓
6. POST /api/v1/transactions with JSON body:
   {
     "accountId": "acc-123",
     "amount": 5.50,
     "date": "2025-02-07",
     "description": "Coffee",
     "categoryId": "cat-food",
     "type": "EXPENSE",
     "notes": "Morning coffee at Starbucks"
   }
   ↓
7. Backend creates transaction, returns response with ID
   ↓
8. Mutation onSuccess handler:
   - Invalidates ['unified-accounts'] query
   - Causes automatic refetch in background
   ↓
9. Component toast shows: "Transaction added successfully"
   ↓
10. Form resets and dialog closes

Optimistic Update: Visible immediately
Actual Update: Synced in background
Rollback: If mutation fails, cache restored to snapshot
```

### 3. FETCHING CATEGORIES

```
Component Usage:
────────────────
const { data: categories } = useCategories();

Data Flow:
──────────
1. useCategories() calls useQuery with accounts-queries.categories()
   ↓
2. Query function calls accountsApi.getCategories(params)
   ↓
3. accounts-api calls transactionsApi.listCategories(orgId)
   ↓
4. Creates GET request to /api/v1/categories
   ↓
5. Backend returns:
   {
     "success": true,
     "data": {
       "default": [{id, name, icon, color, groupId}, ...],
       "custom": [{id, name, icon, color}, ...]
     }
   }
   ↓
6. TanStack Query caches with key: ['unified-accounts', 'categories', orgId]
   ↓
7. Component renders categories

Cache Stale Time: 30 minutes
Refetch: On component mount, when stale, or manual invalidation
```

## Key Improvements (Phase 4)

### Before
- ❌ Minimal API endpoints (6-10)
- ❌ Incomplete transaction features
- ❌ Limited categorization
- ❌ No analytics/forecasting
- ❌ Method naming inconsistencies

### After
- ✅ **60+ API endpoints** fully implemented
- ✅ Complete transaction CRUD operations
- ✅ Notes, attachments, reconciliation
- ✅ Advanced categorization rules
- ✅ Analytics: patterns, forecasts, reconciliation
- ✅ 50+ React Query hooks
- ✅ Consistent method naming (`list*`, `create*`, `update*`, etc.)

## Cache Management

### Stale Times by Data Type
```
Transaction Lists      → 5 minutes   (frequently updated)
Transaction Details    → 10 minutes  (viewed less often)
Categories             → 30 minutes  (rarely change)
Category Rules         → 30 minutes  (configuration)
Merchants              → 30 minutes  (aggregated data)
Analytics/Patterns     → 60 minutes  (computed data)
```

### Automatic Invalidation
```
When mutation succeeds → Query with matching key invalidated
Background refetch    → New data fetched while showing old data
Optimistic update     → Immediate UI feedback
Rollback on error     → Cache restored if mutation fails
```

## Troubleshooting

### Transactions Not Fetching?

1. **Check Organization ID**
   ```typescript
   // Verify orgId is being passed
   const orgId = useOrganizationStore((state) => state.selectedOrganizationId);
   console.log('Organization ID:', orgId);
   ```

2. **Check Component Mounting**
   ```typescript
   // Verify query is enabled
   const { data, isLoading, error, isEnabled } = useAccountTransactions(accountId);
   if (!isLoading && !data) {
     console.log('Query enabled?', isEnabled);
     console.log('Error:', error);
   }
   ```

3. **Check Network Tab**
   - Verify request to `/api/v1/transactions?accountId=...`
   - Check response status (200 OK)
   - Check response body for data

4. **Check Query Cache**
   ```typescript
   // In React DevTools, check TanStack Query tab
   // Look for 'unified-accounts' > 'transactions' keys
   // Verify data is cached
   ```

5. **Check Form Submission**
   - Verify createTransaction is called
   - Check error callback for error messages
   - Verify accountId is passed correctly

## Component Integration Checklist

- ✅ Manual transaction form uses correct field names
  - `categoryId` (not `category` or category name)
  - `type` (INCOME/EXPENSE/TRANSFER)
  - `description`, `date`, `amount`, `notes`

- ✅ Categories combobox uses category IDs
  - Maps from API response `id` field
  - Sends `categoryId` to backend

- ✅ Accounts API delegates correctly
  - `listTransactions()` instead of `getTransactions()`
  - `listCategories()` instead of `getCategories()`
  - `listCategoryGroups()` instead of `getCategoryGroups()`

- ✅ Query hooks invalidate properly
  - Transaction create → invalidates ['unified-accounts']
  - Category create → invalidates category keys
  - Rules changes → invalidates rule keys

## Testing

### Manual Testing Steps

1. **Test Transaction Creation**
   ```
   1. Navigate to account page
   2. Click "Add Transaction" button
   3. Fill form with:
      - Description: "Test transaction"
      - Date: Today
      - Amount: 10.00
      - Type: Expense
      - Category: Select from dropdown
      - Notes: "Test"
   4. Submit
   5. Verify success toast appears
   6. Verify transaction appears in list
   ```

2. **Test Transaction Fetch**
   ```
   1. Navigate to account page
   2. Verify transactions load in list
   3. Open browser DevTools > Network
   4. Check for GET /api/v1/transactions request
   5. Verify response contains transaction data
   ```

3. **Test Category Fetch**
   ```
   1. Open any form with category selector
   2. Verify categories load in dropdown
   3. Check Network > GET /api/v1/categories
   4. Verify response contains category list
   ```

## File Structure Summary

```
lib/features/
├── accounts/
│   ├── services/
│   │   └── accounts-api.ts          (API wrapper layer)
│   └── queries/
│       ├── accounts-queries.ts      (Query keys & options)
│       └── use-accounts-data.ts    (React hooks)
│
├── transactions/
│   ├── services/
│   │   └── transactions-api.ts     (60+ API endpoints)
│   └── queries/
│       ├── transactions-queries.ts (Query keys, options, mutations)
│       └── use-transactions-data.ts (50+ React hooks)
│
└── organization/
    └── stores/
        └── ...                      (Organization context)

components/modules/
└── accounts/components/
    └── manual-transaction-form.tsx  (Uses useAddTransaction hook)
```

## Summary

The transaction system is now **fully integrated** with:
- ✅ 60+ backend endpoints
- ✅ 50+ React Query hooks
- ✅ Automatic caching and invalidation
- ✅ Optimistic updates with rollback
- ✅ Comprehensive error handling
- ✅ Proper organization ID propagation
- ✅ TypeScript type safety throughout

Transactions should fetch and create successfully when all environment variables are configured and the backend API is running.
