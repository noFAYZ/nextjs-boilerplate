# AccountsV2 - Complete File Structure & Organization

## Directory Tree

```
frontend/
├── app/(protected)/
│   └── accountsv2/
│       ├── page.tsx                           # Main accounts list page
│       ├── layout.tsx                         # Layout for accountsv2 routes
│       ├── [accountId]/
│       │   └── page.tsx                       # Account detail page
│       │
│       └── components/
│           ├── index.ts                       # Component exports
│           ├── accountsv2-header.tsx          # List page header
│           ├── accountsv2-list.tsx            # List view
│           ├── accountsv2-grid.tsx            # Grid view
│           ├── accountsv2-grouped.tsx         # Grouped view
│           ├── account-row-v2.tsx             # Single row in list
│           ├── account-card-v2.tsx            # Single card in grid
│           ├── bulk-operations-toolbar.tsx    # Bulk selection toolbar
│           │
│           ├── account-detail-header.tsx      # Detail page header
│           ├── account-detail-tabs.tsx        # Tab navigation
│           │
│           ├── tabs/
│           │   ├── overview-tab.tsx           # Overview tab content
│           │   ├── transactions-tab.tsx       # Transactions tab
│           │   ├── analytics-tab.tsx          # Analytics tab
│           │   ├── categories-tab.tsx         # Categories tab
│           │   ├── reconciliation-tab.tsx     # Reconciliation tab
│           │   └── settings-tab.tsx           # Settings tab
│           │
│           └── shared/
│               └── (used by tabs)
│
├── components/modules/transactions/
│   └── components/
│       ├── search-and-filter/                 # NEW
│       │   ├── advanced-transaction-search.tsx
│       │   ├── transaction-filter-panel.tsx
│       │   └── index.ts
│       │
│       ├── bulk-operations/                   # NEW
│       │   ├── transaction-bulk-operations.tsx
│       │   ├── transaction-statistics-card.tsx
│       │   └── index.ts
│       │
│       ├── duplicates/                        # NEW
│       │   ├── duplicate-transactions-modal.tsx
│       │   └── index.ts
│       │
│       ├── category-management/               # NEW
│       │   ├── category-list.tsx
│       │   ├── category-form.tsx
│       │   ├── categorization-rules-list.tsx
│       │   ├── categorization-rule-form.tsx
│       │   ├── rule-tester.tsx
│       │   ├── auto-categorization-progress.tsx
│       │   └── index.ts
│       │
│       └── (existing components)
│
├── components/modules/accounts/
│   ├── components/
│   │   ├── analytics/                         # NEW
│   │   │   ├── category-spending-chart.tsx
│   │   │   ├── spending-trends-chart.tsx
│   │   │   ├── recurring-patterns-list.tsx
│   │   │   ├── expected-transactions-list.tsx
│   │   │   ├── transaction-type-breakdown.tsx
│   │   │   ├── merchant-spending-chart.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── account-settings/                  # NEW
│   │   │   ├── account-info-card.tsx
│   │   │   ├── account-lifecycle-controls.tsx
│   │   │   ├── account-connection-details.tsx
│   │   │   ├── account-sync-logs.tsx
│   │   │   ├── account-notes-editor.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── (existing components)
│   │
│   └── analytics/
│       └── (existing analytics code)
│
├── lib/features/
│   ├── transactions/
│   │   ├── queries/
│   │   │   ├── use-transactions-data.ts       # MODIFY: Add new hooks
│   │   │   ├── transactions-queries.ts        # (Already has all endpoints)
│   │   │   └── index.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── transactions-ui-store.ts       # MODIFY: Add filters & bulk ops
│   │   │   └── index.ts
│   │   │
│   │   ├── types/
│   │   │   ├── transactions.ts                # MODIFY: Add new types
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                             # NEW
│   │   │   ├── transaction-filters.ts         # Filter logic
│   │   │   ├── transaction-search.ts          # Search logic
│   │   │   ├── analytics-calculations.ts      # Analytics math
│   │   │   ├── duplicate-detection.ts         # Duplicate logic
│   │   │   ├── categorization-helpers.ts      # Category logic
│   │   │   └── index.ts
│   │   │
│   │   ├── services/
│   │   │   └── (Already has all API endpoints)
│   │   │
│   │   └── index.ts
│   │
│   └── accounts/
│       ├── queries/
│       │   ├── use-accounts-data.ts           # MODIFY: Add useAccountStats
│       │   ├── accounts-queries.ts
│       │   └── index.ts
│       │
│       ├── stores/
│       │   ├── accounts-ui-store.ts
│       │   ├── account-detail-ui-store.ts     # NEW
│       │   └── index.ts
│       │
│       ├── types/
│       │   ├── unified-accounts.ts
│       │   └── index.ts
│       │
│       ├── services/
│       │   └── (Already has all API endpoints)
│       │
│       └── index.ts
│
└── lib/types/
    ├── unified-accounts.ts                    # MODIFY: Add new types
    ├── transactions.ts                        # MODIFY: Add new types
    └── index.ts

```

## Files to Modify

### 1. `lib/features/transactions/stores/transactions-ui-store.ts`
**Changes:** Add advanced filters, search, view modes, bulk selection

```typescript
// Add to TransactionsUIState:
filters: {
  amountRange?: { min: number | null; max: number | null };
  merchants?: string[];
  categories?: string[];
  types?: TransactionType[];
  statuses?: TransactionStatus[];
  reconciled?: boolean | null;
  tagged?: boolean | null;
  hasMemo?: boolean | null;
};
searchQuery?: string;
viewMode?: 'list' | 'card' | 'table';
sortBy?: 'date' | 'amount' | 'description' | 'category';
sortOrder?: 'asc' | 'desc';
selectedTransactionIds?: string[];
isBulkSelectMode?: boolean;

// Add corresponding action methods
```

---

### 2. `lib/features/transactions/queries/use-transactions-data.ts`
**Changes:** Add new data hooks

```typescript
// Add hooks:
export function useSearchTransactions(
  query: string,
  filters: TransactionSearchFilters,
  accountId?: string
) { ... }

export function useAccountStats(
  accountId: string,
  dateRange?: { from: string; to: string }
) { ... }

export function useDuplicateTransactions(accountId: string) { ... }

export function useRecurringPatterns(accountId: string) { ... }

export function useExpectedTransactions(accountId: string) { ... }

export function useReconciliationProgress(accountId: string) { ... }
```

---

### 3. `lib/features/accounts/queries/use-accounts-data.ts`
**Changes:** Add account stats hook

```typescript
// Add hook:
export function useAccountStats(
  accountId: string,
  dateRange?: { from: string; to: string }
) { ... }
```

---

### 4. `lib/types/unified-accounts.ts`
**Changes:** Add new type definitions

```typescript
// Add types:
interface TransactionSearchFilters { ... }
interface AccountDetailPageParams { ... }
interface TransactionAnalytics { ... }
interface CategorizationRuleTest { ... }
interface DuplicateTransactionMatch { ... }
interface RecurringPattern { ... }
interface ExpectedTransaction { ... }
```

---

### 5. `lib/types/transactions.ts`
**Changes:** Extend existing transaction types

```typescript
// Add or extend:
interface TransactionAnalytics { ... }
type TransactionSearchFilters = { ... }
```

---

## Files to Create

### Phase 1: Stores (2 files)
1. **`lib/features/accounts/stores/account-detail-ui-store.ts`** (NEW)
   - Account detail page UI state
   - Active tab, transaction filters, chart ranges

### Phase 2: Types (1 file)
1. **`lib/features/transactions/utils/index.ts`** (NEW)
   - Export all utility functions

### Phase 3: Utilities (6 files)
1. **`lib/features/transactions/utils/transaction-filters.ts`** (NEW)
2. **`lib/features/transactions/utils/transaction-search.ts`** (NEW)
3. **`lib/features/transactions/utils/analytics-calculations.ts`** (NEW)
4. **`lib/features/transactions/utils/duplicate-detection.ts`** (NEW)
5. **`lib/features/transactions/utils/categorization-helpers.ts`** (NEW)
6. **`lib/features/transactions/utils/index.ts`** (NEW)

### Phase 4: Shared Components (30+ files)

#### Transaction Search & Filter (3 files)
1. **`components/modules/transactions/components/search-and-filter/advanced-transaction-search.tsx`** (NEW)
2. **`components/modules/transactions/components/search-and-filter/transaction-filter-panel.tsx`** (NEW)
3. **`components/modules/transactions/components/search-and-filter/index.ts`** (NEW)

#### Bulk Operations (3 files)
1. **`components/modules/transactions/components/bulk-operations/transaction-bulk-operations.tsx`** (NEW)
2. **`components/modules/transactions/components/bulk-operations/transaction-statistics-card.tsx`** (NEW)
3. **`components/modules/transactions/components/bulk-operations/index.ts`** (NEW)

#### Duplicates (2 files)
1. **`components/modules/transactions/components/duplicates/duplicate-transactions-modal.tsx`** (NEW)
2. **`components/modules/transactions/components/duplicates/index.ts`** (NEW)

#### Category Management (7 files)
1. **`components/modules/transactions/components/category-management/category-list.tsx`** (NEW)
2. **`components/modules/transactions/components/category-management/category-form.tsx`** (NEW)
3. **`components/modules/transactions/components/category-management/categorization-rules-list.tsx`** (NEW)
4. **`components/modules/transactions/components/category-management/categorization-rule-form.tsx`** (NEW)
5. **`components/modules/transactions/components/category-management/rule-tester.tsx`** (NEW)
6. **`components/modules/transactions/components/category-management/auto-categorization-progress.tsx`** (NEW)
7. **`components/modules/transactions/components/category-management/index.ts`** (NEW)

#### Analytics (7 files)
1. **`components/modules/accounts/components/analytics/category-spending-chart.tsx`** (NEW)
2. **`components/modules/accounts/components/analytics/spending-trends-chart.tsx`** (NEW)
3. **`components/modules/accounts/components/analytics/recurring-patterns-list.tsx`** (NEW)
4. **`components/modules/accounts/components/analytics/expected-transactions-list.tsx`** (NEW)
5. **`components/modules/accounts/components/analytics/transaction-type-breakdown.tsx`** (NEW)
6. **`components/modules/accounts/components/analytics/merchant-spending-chart.tsx`** (NEW)
7. **`components/modules/accounts/components/analytics/index.ts`** (NEW)

#### Account Settings (6 files)
1. **`components/modules/accounts/components/account-settings/account-info-card.tsx`** (NEW)
2. **`components/modules/accounts/components/account-settings/account-lifecycle-controls.tsx`** (NEW)
3. **`components/modules/accounts/components/account-settings/account-connection-details.tsx`** (NEW)
4. **`components/modules/accounts/components/account-settings/account-sync-logs.tsx`** (NEW)
5. **`components/modules/accounts/components/account-settings/account-notes-editor.tsx`** (NEW)
6. **`components/modules/accounts/components/account-settings/index.ts`** (NEW)

### Phase 5: Main Pages & Page Components (27 files)

#### Main Pages (2 files)
1. **`app/(protected)/accountsv2/page.tsx`** (NEW)
2. **`app/(protected)/accountsv2/[accountId]/page.tsx`** (NEW)

#### Page Layout (1 file)
1. **`app/(protected)/accountsv2/layout.tsx`** (NEW)

#### Accounts List Components (8 files)
1. **`app/(protected)/accountsv2/components/index.ts`** (NEW)
2. **`app/(protected)/accountsv2/components/accountsv2-header.tsx`** (NEW)
3. **`app/(protected)/accountsv2/components/accountsv2-list.tsx`** (NEW)
4. **`app/(protected)/accountsv2/components/accountsv2-grid.tsx`** (NEW)
5. **`app/(protected)/accountsv2/components/accountsv2-grouped.tsx`** (NEW)
6. **`app/(protected)/accountsv2/components/account-row-v2.tsx`** (NEW)
7. **`app/(protected)/accountsv2/components/account-card-v2.tsx`** (NEW)
8. **`app/(protected)/accountsv2/components/bulk-operations-toolbar.tsx`** (NEW)

#### Account Detail Components (7 files)
1. **`app/(protected)/accountsv2/components/account-detail-header.tsx`** (NEW)
2. **`app/(protected)/accountsv2/components/account-detail-tabs.tsx`** (NEW)
3. **`app/(protected)/accountsv2/components/tabs/index.ts`** (NEW)
4. **`app/(protected)/accountsv2/components/tabs/overview-tab.tsx`** (NEW)
5. **`app/(protected)/accountsv2/components/tabs/transactions-tab.tsx`** (NEW)
6. **`app/(protected)/accountsv2/components/tabs/analytics-tab.tsx`** (NEW)
7. **`app/(protected)/accountsv2/components/tabs/categories-tab.tsx`** (NEW)

#### Account Detail Tabs (continued) (3 files)
8. **`app/(protected)/accountsv2/components/tabs/reconciliation-tab.tsx`** (NEW)
9. **`app/(protected)/accountsv2/components/tabs/settings-tab.tsx`** (NEW)

---

## Summary

### Files to Modify: 5
- `lib/features/transactions/stores/transactions-ui-store.ts`
- `lib/features/transactions/queries/use-transactions-data.ts`
- `lib/features/accounts/queries/use-accounts-data.ts`
- `lib/types/unified-accounts.ts`
- `lib/types/transactions.ts`

### Files to Create: 70+
- **Stores:** 2
- **Utils:** 6
- **Components (Shared):** 30
- **Components (Page):** 25
- **Pages:** 3

### Total New Files: ~70

### Estimated Lines of Code:
- **Hooks:** ~500 lines
- **Stores:** ~400 lines
- **Utils:** ~800 lines
- **Shared Components:** ~4,000 lines
- **Page Components:** ~6,000 lines
- **Main Pages:** ~1,500 lines
- **Total:** ~13,200 lines

### Dependencies:
```
Modify Existing Files (Phase 1)
    ↓
Create Stores (Phase 1)
    ↓
Create Utils (Phase 2)
    ↓
Create Shared Components (Phase 3)
    ↓
Create Page Components (Phase 4)
    ↓
Create Main Pages (Phase 5)
```

---

## Implementation Notes

1. **Component Organization:**
   - Shared components go in `components/modules/{feature}/components/`
   - Page-specific components go in `app/(protected)/accountsv2/components/`
   - Each folder has an `index.ts` for clean exports

2. **Import Paths:**
   - Always use absolute paths: `@/lib/...`, `@/components/...`
   - Create barrel exports in `index.ts` files for cleaner imports

3. **TypeScript:**
   - All files should have `.tsx` extension for components
   - All files should have `.ts` extension for utilities/types/stores
   - No `any` types - always be specific

4. **Code Quality:**
   - Follow CLAUDE.md patterns strictly
   - Use memoization for expensive computations
   - Implement proper error boundaries
   - Add loading states and skeletons

5. **File Size Guidelines:**
   - Keep components under 500 lines
   - Split large components into smaller ones
   - Each utility file: ~100-300 lines
   - Each page: ~300-500 lines

