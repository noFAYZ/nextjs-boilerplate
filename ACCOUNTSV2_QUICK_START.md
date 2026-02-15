# AccountsV2 - Quick Start Guide

## Overview

This document is a quick reference for the enhanced account detail pages (V2) implementation. For detailed information, see:
- **ANALYSIS_ACCOUNTSV2.md** - Comprehensive analysis of current state and gaps
- **IMPLEMENTATION_CHECKLIST_ACCOUNTSV2.md** - Detailed task checklist with progress tracking
- **ACCOUNTSV2_FILE_STRUCTURE.md** - Complete file organization and structure

---

## What Already Exists

### API & Query Infrastructure ✅
- **60+ transaction endpoints** already implemented in `transactionsApi`
- **Account endpoints** for CRUD and transactions
- **Query factories** with all query keys and options
- **Query hooks** for all major data types
- **Mutation definitions** for all operations
- No new API calls needed!

### Components ✅
- Transaction detail drawer (existing)
- Transaction table and card views (existing)
- Filter drawer (existing)
- Category management (existing)
- Transaction bulk operations (existing)
- Duplicate detection (existing)
- Account components (existing)

### UI Infrastructure ✅
- Zustand stores for UI state
- Proper separation of concerns (TanStack Query + Zustand)
- Form components (shadcn/ui)
- Modal/dialog components
- Chart components (Recharts)

---

## What Needs to be Created

### 1. Hooks (6 new)
```typescript
// lib/features/transactions/queries/use-transactions-data.ts
useSearchTransactions(query, filters, accountId)
useAccountStats(accountId, dateRange)
useDuplicateTransactions(accountId)
useRecurringPatterns(accountId)
useExpectedTransactions(accountId)
useReconciliationProgress(accountId)

// lib/features/accounts/queries/use-accounts-data.ts
useAccountStats(accountId, dateRange)
```

### 2. Stores (1 new + 1 expand)
```typescript
// EXPAND: lib/features/transactions/stores/transactions-ui-store.ts
- Add filters object (amount, merchant, category, types, statuses, etc.)
- Add search, viewMode, sortBy, sortOrder
- Add bulk selection state

// NEW: lib/features/accounts/stores/account-detail-ui-store.ts
- activeTab
- selectedTransactionId
- transactionFilters
- chartTimeRange
- reconciliationMode
```

### 3. Utilities (5 new)
```typescript
// lib/features/transactions/utils/
- transaction-filters.ts (apply/combine filters)
- transaction-search.ts (search with fuzzy matching)
- analytics-calculations.ts (calculate metrics)
- duplicate-detection.ts (find duplicates)
- categorization-helpers.ts (category logic)
```

### 4. Shared Components (30+ new)

**Search & Filter:**
- advanced-transaction-search.tsx
- transaction-filter-panel.tsx

**Bulk Operations:**
- transaction-bulk-operations.tsx
- transaction-statistics-card.tsx

**Category Management:**
- category-list.tsx
- category-form.tsx
- categorization-rules-list.tsx
- categorization-rule-form.tsx
- rule-tester.tsx
- auto-categorization-progress.tsx

**Analytics:**
- category-spending-chart.tsx
- spending-trends-chart.tsx
- recurring-patterns-list.tsx
- expected-transactions-list.tsx
- transaction-type-breakdown.tsx
- merchant-spending-chart.tsx

**Account Settings:**
- account-info-card.tsx
- account-lifecycle-controls.tsx
- account-connection-details.tsx
- account-sync-logs.tsx
- account-notes-editor.tsx

### 5. Pages & Page Components (27 new)

**Main Pages:**
- `app/(protected)/accountsv2/page.tsx` - Accounts list with v2 features
- `app/(protected)/accountsv2/[accountId]/page.tsx` - Account detail

**Account List Components (8):**
- accountsv2-header.tsx
- accountsv2-list.tsx
- accountsv2-grid.tsx
- accountsv2-grouped.tsx
- account-row-v2.tsx
- account-card-v2.tsx
- bulk-operations-toolbar.tsx

**Account Detail Components (11):**
- account-detail-header.tsx
- account-detail-tabs.tsx
- overview-tab.tsx
- transactions-tab.tsx
- analytics-tab.tsx
- categories-tab.tsx
- reconciliation-tab.tsx
- settings-tab.tsx

---

## Step-by-Step Implementation

### Week 1: Foundation
1. Expand `transactions-ui-store.ts` with filters
2. Create `account-detail-ui-store.ts`
3. Add new hooks to `use-transactions-data.ts`
4. Add types for new interfaces

### Week 2: Utilities & Shared Components
1. Create utility functions for filters, search, analytics
2. Create shared search/filter components
3. Create category management components
4. Create analytics components

### Week 3: Account Settings Components & Main Pages
1. Create account settings components
2. Create accounts list page and components
3. Create account detail page structure

### Week 4: Account Detail Tabs
1. Overview tab
2. Transactions tab
3. Analytics tab
4. Categories tab
5. Reconciliation tab
6. Settings tab
7. Testing & optimization

---

## Code Patterns to Follow

### ✅ CORRECT Pattern
```typescript
'use client';

import { useCryptoWallets } from '@/lib/queries';
import { useUIStore } from '@/lib/stores/ui-stores';

export function Component() {
  // 1. Server data from TanStack Query
  const { data: items, isLoading, error } = useCryptoWallets();

  // 2. UI state from Zustand
  const { filters, setFilter } = useUIStore();

  // 3. Mutations (if needed)
  const { mutate: update } = useUpdateItem();

  // 4. Derived state with useMemo
  const filtered = useMemo(() => items?.filter(...), [items, filters]);

  // 5. Handlers with useCallback
  const handleClick = useCallback(() => { setFilter(...); }, []);

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;

  return <div>{/* render */}</div>;
}
```

### ❌ INCORRECT Pattern
```typescript
// ❌ NEVER call API directly
const [data, setData] = useState([]);
useEffect(() => {
  api.getData().then(setData); // WRONG!
}, []);

// ❌ NEVER store server data in Zustand
const store = create((set) => ({
  data: [],
  fetch: async () => {
    const data = await api.get(); // WRONG!
    set({ data });
  }
}));
```

---

## Key Files Reference

### To Modify (5 files)
| File | Changes |
|------|---------|
| `lib/features/transactions/stores/transactions-ui-store.ts` | Add filters, search, bulk selection |
| `lib/features/transactions/queries/use-transactions-data.ts` | Add 6 new hooks |
| `lib/features/accounts/queries/use-accounts-data.ts` | Add useAccountStats |
| `lib/types/unified-accounts.ts` | Add type interfaces |
| `lib/types/transactions.ts` | Add TransactionAnalytics |

### Base Components to Reuse
| Component | Location | Usage |
|-----------|----------|-------|
| TransactionTable | components/modules/transactions | Main transaction list |
| TransactionCardList | components/modules/transactions | Card view |
| TransactionDetailDrawer | components/modules/transactions | Transaction details |
| FilterOptionsDrawer | components/modules/transactions | Filters |
| CategoriesManagement | components/modules/transactions | Category CRUD |
| RulesManagement | components/modules/transactions | Rules CRUD |

---

## Quick Reference: New Routes

### Accounts List V2
```
/accountsv2
- List of all accounts
- Advanced filters (type, balance, institution, etc.)
- Bulk operations (select multiple, bulk actions)
- View modes (grid, list, grouped)
```

### Account Detail V2
```
/accountsv2/[accountId]
├── Overview      (Balance chart, quick stats, recent transactions)
├── Transactions  (Full list with advanced filters & bulk ops)
├── Analytics     (Charts, trends, recurring patterns)
├── Categories    (CRUD categories, manage rules, auto-categorize)
├── Reconciliation (Duplicate detection, matching, progress)
└── Settings      (Account info, connection status, lifecycle)
```

---

## Query Key Pattern (Already Established)

All transaction queries use this pattern:
```typescript
// Query keys factory
transactionKeys.all(orgId)
transactionKeys.list(filters, orgId)
transactionKeys.search(query, orgId)
transactionKeys.stats(orgId)
transactionKeys.notes(orgId)
transactionKeys.attachments(orgId)
// ... and many more

// Query options factory
transactionQueries.list(filters, orgId)
transactionQueries.search(query, orgId)
transactionQueries.stats(filters, orgId)
// ... all configured with staleTime, enabled flag, select

// Usage in components
const { data } = useQuery(transactionQueries.list(filters, orgId));
```

---

## Store Pattern Example

### Account Detail UI Store (to create)
```typescript
interface AccountDetailUIState {
  activeTab: 'overview' | 'transactions' | 'analytics' | 'categories' | 'reconciliation' | 'settings';
  selectedTransactionId: string | null;
  transactionFilters: TransactionSearchFilters;
  chartTimeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  showReconciliationMode: boolean;
  categoryManagementMode: boolean;
}

interface AccountDetailUIActions {
  setActiveTab: (tab: string) => void;
  setSelectedTransaction: (id: string | null) => void;
  setTransactionFilters: (filters: any) => void;
  setChartTimeRange: (range: string) => void;
  toggleReconciliationMode: () => void;
  toggleCategoryManagementMode: () => void;
  resetFilters: () => void;
  resetUIState: () => void;
}

export const useAccountDetailUIStore = create<AccountDetailUIState & AccountDetailUIActions>()(
  devtools(
    persist(
      immer((set) => ({
        // ... all actions
      })),
      { name: 'account-detail-ui', partialize: (state) => ({ /* persist only certain state */ }) }
    )
  )
);
```

---

## Component Size Guidelines

- **Pages:** 300-500 lines (use sub-components for tabs)
- **Tab Components:** 200-400 lines
- **Shared Components:** 100-300 lines
- **Utility Functions:** 50-200 lines each
- **Hooks:** 30-100 lines each

---

## Checklist for First Commit

When you start implementation, create these in order:

Phase 1 (Commit 1):
- [ ] Expand `transactions-ui-store.ts`
- [ ] Create `account-detail-ui-store.ts`
- [ ] Update type definitions

Phase 1 (Commit 2):
- [ ] Add new hooks to `use-transactions-data.ts`
- [ ] Add `useAccountStats` to `use-accounts-data.ts`

Phase 2 (Commit 3):
- [ ] Create utility files in `lib/features/transactions/utils/`

Phase 3 (Commit 4):
- [ ] Create search & filter components
- [ ] Create bulk operations components
- [ ] Create category management components

Phase 4 (Commit 5):
- [ ] Create analytics components
- [ ] Create account settings components

Phase 5 (Commit 6):
- [ ] Create accounts list page and components
- [ ] Create accounts list page layout

Phase 5 (Commit 7):
- [ ] Create account detail page structure
- [ ] Create overview tab
- [ ] Create transactions tab

Phase 5 (Commit 8):
- [ ] Create analytics tab
- [ ] Create categories tab

Phase 5 (Commit 9):
- [ ] Create reconciliation tab
- [ ] Create settings tab

Phase 6 (Final):
- [ ] Testing and optimization
- [ ] Performance profiling
- [ ] Accessibility checks
- [ ] Responsive design verification

---

## Common Questions

**Q: Do I need to create new API endpoints?**
A: No! All 60+ endpoints already exist in `transactionsApi`.

**Q: Should components call the API directly?**
A: No! Always use hooks from `lib/queries/`.

**Q: Where should UI state go?**
A: Always in Zustand stores from `lib/stores/`.

**Q: Can I use useEffect for data fetching?**
A: No! TanStack Query handles all data fetching.

**Q: Should I store server data in Zustand?**
A: No! Zustand is for UI state only (filters, selections, modals, etc.).

**Q: How do I prevent unnecessary refetches?**
A: Use memoized parameters with `useMemo` when passing to hooks.

**Q: Can I reuse existing components?**
A: Yes! Reuse TransactionTable, TransactionDetailDrawer, FilterDrawer, etc.

---

## Performance Tips

1. **Memoize parameters** before passing to hooks
2. **Use `enabled` flag** to conditionally fetch
3. **Use `useMemo`** for expensive calculations
4. **Use `useCallback`** for event handlers
5. **Lazy load** heavy components if needed
6. **Use virtual scrolling** for large lists

---

## Testing Strategy

1. **Unit test** utility functions (filters, search, calculations)
2. **Component test** shared components with mock data
3. **Integration test** pages with actual hooks
4. **E2E test** full workflows (search → filter → bulk ops)
5. **Performance test** with large datasets

---

## Git Commit Strategy

Use meaningful commits following the codebase pattern:
```bash
# Phase 1: Foundation
git commit -m "refactor: Expand UI stores and add data hooks for accountsv2"

# Phase 2: Utilities
git commit -m "feat: Add transaction utilities (filters, search, analytics)"

# Phase 3: Components
git commit -m "feat: Add shared components for accountsv2 (search, filters, analytics)"

# Phase 4: Pages
git commit -m "feat: Create accountsv2 pages with full feature set"

# Phase 5: Polish
git commit -m "perf: Optimize accountsv2 components and add accessibility"
```

---

## Next Steps

1. Start with Phase 1 (stores and hooks)
2. Follow the implementation checklist
3. Reference the three detailed documents:
   - ANALYSIS_ACCOUNTSV2.md (understanding)
   - IMPLEMENTATION_CHECKLIST_ACCOUNTSV2.md (tracking)
   - ACCOUNTSV2_FILE_STRUCTURE.md (organization)
4. Test thoroughly at each phase
5. Commit frequently with meaningful messages

---

## Support Resources

- **CLAUDE.md** - Project guidelines and patterns
- **TypeScript** - lib/types/ for type definitions
- **shadcn/ui** - UI component library
- **Recharts** - Charting library
- **TanStack Query** - Data fetching patterns
- **Zustand** - State management patterns

