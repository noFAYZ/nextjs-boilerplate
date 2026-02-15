# MoneyMappr - Enhanced Account Details Pages Analysis

## Current State Analysis

### Existing Architecture

#### Current Query/Hooks Structure
1. **Account Queries** (`lib/features/accounts/queries/use-accounts-data.ts`)
   - `useAllAccounts()` - Gets all accounts grouped by category
   - `useAccountDetails(accountId)` - Gets single account details
   - `useAccountTransactions(accountId, params)` - Gets account transactions with pagination
   - `useAccountChart(accountId, period)` - Gets balance chart data
   - `useCategories(params)` - Gets flat list of categories
   - `useCategoryGroups(organizationId)` - Gets hierarchical categories
   - `useAllTransactions(params)` - Gets all transactions globally
   - Mutations: `useCreateManualAccount`, `useUpdateAccount`, `useDeleteAccount`, `useAddTransaction`, `useBulkDeactivateAccounts`, `useBulkReactivateAccounts`, `useBulkDeleteAccounts`

2. **Transaction Queries** (`lib/features/transactions/queries/transactions-queries.ts`)
   - **60+ endpoints already defined** in query keys and mutations
   - Query keys factory includes: transactions, notes, attachments, categories, categorization rules, findings, merchants
   - Mutation definitions for: bulk create/update, notes, attachments, categories, rules, categorization, analytics

3. **Transaction Data Hooks** (`lib/features/transactions/queries/use-transactions-data.ts`)
   - Comprehensive hooks for all transaction operations
   - Memoized parameters to prevent unnecessary refetches
   - Proper enabled flags based on parameters

#### Existing Components
1. **Account-specific components** (`app/(protected)/accounts/components/`)
   - `transaction-notes-editor.tsx` - Add/edit transaction notes
   - `transaction-attachments.tsx` - Manage attachments
   - `transaction-tags-manager.tsx` - Tag management
   - `account-lifecycle-actions.tsx` - Deactivate/reactivate account
   - `account-favorite-toggle.tsx` - Favorite toggle
   - `connection-health-badge.tsx` - Connection status
   - `connection-sync-controls.tsx` - Sync controls
   - `duplicate-detection-banner.tsx` - Shows duplicate transactions

2. **Transaction components** (`components/modules/transactions/components/`)
   - `transaction-detail-drawer.tsx` - Shows transaction details
   - `transaction-detail-drawer-enhanced.tsx` - Enhanced version
   - `filter-options-drawer.tsx` - Advanced filters
   - `bulk-edit-transactions-drawer.tsx` - Bulk operations
   - `categories-management.tsx` - Category CRUD
   - `rules-management.tsx` - Category rules
   - `transaction-card.tsx` - Card view
   - `transaction-table.tsx` - Table view

#### Existing UI Stores
1. **Accounts UI Store** (`lib/features/accounts/stores/accounts-ui-store.ts`)
   - Selection state (for bulk operations)
   - Deletion state
   - Filters (types, categories, institutions, search, balance range, etc.)
   - View preferences (table/card, balance visible, grouping, chart type, time range)
   - UI state (active tab, bulk select mode, selected category)

2. **Transactions UI Store** (`lib/features/transactions/stores/transactions-ui-store.ts`)
   - Currently minimal: active tab, date range
   - Needs expansion for transaction-specific filters

#### Current API Services
- **Transactions API** (`lib/features/transactions/services/transactions-api.ts`)
  - 60+ endpoints already implemented
  - Categories management
  - Category rules and groups
  - Categorization rules (custom rules)
  - Findings (recurring patterns, expected transactions, reconciliation)
  - Merchant queries

- **Accounts API** (`lib/features/accounts/services/accounts-api.ts`)
  - Account CRUD
  - Account details
  - Account transactions
  - Chart data

---

## Missing Implementation Gaps

### 1. Hooks That Need to be Created

**In `lib/features/transactions/queries/use-transactions-data.ts`:**
- `useSearchTransactions(query, filters, accountId)` - Advanced transaction search with memoized filters
- `useAccountStats(accountId, dateRange)` - Account-specific statistics and metrics
- `useDuplicateTransactions(accountId)` - Detect potential duplicate transactions
- `useRecurringPatterns(accountId)` - Get recurring transaction patterns
- `useExpectedTransactions(accountId)` - Get forecasted/expected transactions
- `useReconciliationProgress(accountId)` - Get reconciliation status

**In `lib/features/accounts/queries/use-accounts-data.ts`:**
- `useAccountLifecycleStats(accountId)` - Stats for account activation/deactivation
- `useCategoryManagement(accountId)` - Get custom categories for account

**Notes:**
- Transaction notes and attachments hooks likely already exist in `use-transactions-data.ts`
- All backend endpoints already exist in API services

### 2. UI Store Enhancements

**Expand `lib/features/transactions/stores/transactions-ui-store.ts`:**
- Advanced filters state:
  - `amountRange: { min: number | null; max: number | null }`
  - `merchants: string[]`
  - `categories: string[]`
  - `types: TransactionType[]`
  - `statuses: TransactionStatus[]`
  - `reconciled: boolean | null`
  - `tagged: boolean | null`
  - `hasMemo: boolean | null`
- `searchQuery: string`
- `viewMode: 'list' | 'card' | 'table'`
- `sortBy: 'date' | 'amount' | 'description' | 'category'`
- `sortOrder: 'asc' | 'desc'`
- Bulk selection state: `selectedTransactionIds: string[]`
- `isBulkSelectMode: boolean`

**Create new `lib/features/accounts/stores/account-detail-ui-store.ts`:**
- `activeTab: 'overview' | 'transactions' | 'analytics' | 'categories' | 'reconciliation' | 'settings'`
- `selectedTransactionId: string | null` (for detail drawer)
- `transactionFilters: { ... }` (account-scoped transaction filters)
- `chartTimeRange: '7d' | '30d' | '90d' | '1y' | 'all'`
- `showReconciliationMode: boolean`
- `categoryManagementMode: boolean`

### 3. Pages to Create

#### Page 1: `app/(protected)/accountsv2/page.tsx`
**Purpose:** Enhanced accounts listing with v2 improvements

**Features:**
- All filters from accounts-ui-store
- Bulk operations support (select multiple, bulk deactivate/reactivate/delete)
- Advanced view modes (grid, list, grouped by type/institution)
- Connection health indicators per account
- Sync status indicators
- Quick action buttons per account
- Balance visibility toggle
- Search functionality
- Sort controls

**Tabs/Views:**
- Overview tab with account summary cards
- Manage tab with table/grid view and bulk operations
- Analytics tab with net worth trends

#### Page 2: `app/(protected)/accountsv2/[accountId]/page.tsx`
**Purpose:** Comprehensive account details with full feature set

**Tabs:**

1. **Overview Tab**
   - Account summary card (name, type, balance, institution)
   - Account metadata (creation date, last sync, connection health)
   - Balance chart with time range selector (7d, 30d, 90d, 1y, all)
   - Quick statistics (average balance, highest balance, lowest balance)
   - Quick actions (edit, favorite, deactivate, sync)

2. **Transactions Tab**
   - Transaction list/table with pagination
   - Advanced filter panel:
     - Date range picker
     - Amount range slider
     - Merchant search
     - Category filter
     - Status filter (pending, posted, cleared, reconciled)
     - Transaction type filter
     - Search by description
   - View mode toggle (list/card/table)
   - Sort controls
   - Bulk operations:
     - Select multiple transactions
     - Bulk categorize
     - Bulk tag
     - Bulk add notes
     - Bulk reconcile
   - Transaction detail drawer (with notes, tags, attachments)
   - Inline actions (edit, delete, reconcile)

3. **Analytics Tab**
   - Category spending breakdown (pie/bar chart)
   - Monthly spending trends chart
   - Spending by transaction type
   - Top merchants/payees
   - Recurring transaction list
   - Expected transactions (forecasted payments)
   - Cash flow visualization
   - Statistics summary

4. **Categories Tab**
   - List of transaction categories
   - Category CRUD operations:
     - Create new category
     - Edit category name/color
     - Delete category
     - Set as favorite
   - Categorization rules management:
     - View active rules
     - Create rule (keyword/pattern matching)
     - Edit rule
     - Delete rule
     - Test rule against transactions
     - Enable/disable rule
     - Rule priority ordering
   - Auto-categorization UI:
     - Run auto-categorization on uncategorized transactions
     - Progress indicator
     - Results summary

5. **Reconciliation Tab**
   - Reconciliation progress indicator
   - Duplicate transaction detection:
     - List of potential duplicates
     - Comparison view (side-by-side)
     - Mark as duplicate
     - Merge/delete actions
   - Transaction matching helper
   - Reconciliation history

6. **Settings Tab**
   - Account lifecycle:
     - Current status (active/inactive)
     - Deactivate button
     - Reactivate button
   - Favorite toggle
   - Account notes/description editor
   - Connection details:
     - Connection health status
     - Last sync time
     - Sync frequency
     - Manual sync button
     - Last error (if any)
   - Account metadata (creation date, type, category, institution)

### 4. Components to Create

#### Transaction Management Components
**Location:** `components/modules/transactions/components/`
- `advanced-transaction-search.tsx` - Search box with filter button
- `transaction-filter-panel.tsx` - Comprehensive filter drawer/panel
- `transaction-bulk-operations.tsx` - Bulk action toolbar
- `transaction-statistics-card.tsx` - Quick stats display
- `duplicate-transactions-modal.tsx` - Duplicate detection and resolution

#### Analytics Components
**Location:** `components/modules/accounts/components/analytics/`
- `category-spending-chart.tsx` - Category breakdown (pie/bar)
- `spending-trends-chart.tsx` - Monthly trends line chart
- `recurring-patterns-list.tsx` - List of recurring transactions
- `expected-transactions-list.tsx` - Forecasted transactions
- `transaction-type-breakdown.tsx` - By transaction type
- `merchant-spending-chart.tsx` - Top merchants

#### Category Management Components
**Location:** `components/modules/transactions/components/category-management/`
- `category-list.tsx` - View/manage categories
- `category-form.tsx` - Add/edit category dialog
- `categorization-rules-list.tsx` - View/manage rules
- `categorization-rule-form.tsx` - Add/edit rule
- `rule-tester.tsx` - Test rule against sample transactions
- `auto-categorization-progress.tsx` - Progress indicator

#### Account Settings Components
**Location:** `components/modules/accounts/components/account-settings/`
- `account-info-card.tsx` - Account metadata display
- `account-lifecycle-controls.tsx` - Deactivate/reactivate UI
- `account-connection-details.tsx` - Connection status and sync info
- `account-sync-logs.tsx` - Sync history display
- `account-notes-editor.tsx` - Notes/description editor

#### Page Components
**Location:** `app/(protected)/accountsv2/components/`
- `accountsv2-header.tsx` - Page header with filters and actions
- `accountsv2-list.tsx` - Main list/grid view
- `account-detail-header.tsx` - Account detail page header
- `account-detail-tabs.tsx` - Tab navigation and content

### 5. Type Definitions to Create

**Location:** `lib/types/` or `lib/features/accounts/types/`
```typescript
// accountsv2.ts or extend unified-accounts.ts
interface TransactionSearchFilters {
  dateRange?: { from: string; to: string };
  amountRange?: { min: number; max: number };
  merchants?: string[];
  categories?: string[];
  types?: TransactionType[];
  statuses?: TransactionStatus[];
  reconciled?: boolean | null;
  tagged?: boolean | null;
  hasMemo?: boolean | null;
  searchQuery?: string;
}

interface AccountDetailPageParams {
  accountId: string;
}

interface TransactionAnalytics {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  largestTransaction: number;
  smallestTransaction: number;
  byCategory: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  byType: Array<{
    type: TransactionType;
    amount: number;
    count: number;
  }>;
  byMerchant: Array<{
    merchant: string;
    amount: number;
    count: number;
  }>;
}

interface CategorizationRuleTest {
  rule: CategorizationRule;
  testTransactions: UnifiedTransaction[];
  matchCount: number;
  results: Array<{
    transaction: UnifiedTransaction;
    matches: boolean;
    appliedCategory?: string;
  }>;
}
```

### 6. Utilities to Create

**Location:** `lib/utils/transactions/` or `lib/features/transactions/utils/`
- `transaction-filters.ts` - Apply filters to transactions
- `transaction-search.ts` - Perform search with fuzzy matching
- `analytics-calculations.ts` - Calculate analytics metrics
- `duplicate-detection.ts` - Identify duplicate transactions
- `categorization-helpers.ts` - Categorization logic

---

## Implementation Priority & Phases

### Phase 1: Foundation (Hooks & Store)
**Deliverable:** Enhanced query/mutation hooks and UI state management
1. Expand `transactions-ui-store.ts` with advanced filters
2. Create new `account-detail-ui-store.ts`
3. Create missing data hooks:
   - `useSearchTransactions()`
   - `useAccountStats()`
   - `useDuplicateTransactions()`
   - `useRecurringPatterns()`
   - `useReconciliationProgress()`

### Phase 2: Shared Reusable Components
**Deliverable:** Components that can be used across both pages
1. Transaction search and filter components
2. Analytics chart components (recharts)
3. Category management components
4. Reconciliation components
5. Account settings components

### Phase 3: Main Pages
**Deliverable:** Full-featured pages
1. Create `accountsv2/page.tsx` with enhanced list
2. Create `accountsv2/[accountId]/page.tsx` with tab structure
3. Create page-level layout components
4. Integrate all shared components

### Phase 4: Polish & Optimization
**Deliverable:** Performance and UX improvements
1. Implement proper loading states and skeletons
2. Add error boundaries
3. Optimize re-renders with useMemo/useCallback
4. Implement proper accessibility (ARIA)
5. Add proper keyboard navigation
6. Performance profiling and optimization

---

## Code Standards & Patterns to Follow

### TanStack Query + Zustand Pattern (from CLAUDE.md)
✅ DO:
- Fetch data exclusively via TanStack Query hooks from `lib/queries/`
- Manage UI state exclusively via Zustand stores from `lib/stores/`
- Use memoized parameters to prevent unnecessary refetches
- Use `enabled` flag to conditionally run queries
- Implement optimistic updates for mutations
- Handle loading, error, and success states
- Use proper TypeScript types (no `any`)

❌ DON'T:
- Call API services directly from components
- Use `useEffect()` for data fetching
- Store server data in Zustand
- Use state for data that comes from the server
- Skip error handling or loading states

### Component Structure Pattern
```typescript
'use client';

import { useCallback, useMemo } from 'react';
import { useQuery hooks from lib/queries };
import { useZustandStore } from 'lib/stores';

export function MyComponent({ accountId }: { accountId: string }) {
  // 1. Fetch server data
  const { data: transactions, isLoading, error } = useTransactions(accountId);

  // 2. UI state from Zustand
  const { filters, setFilter } = useMyUIStore();

  // 3. Mutations (if needed)
  const { mutate: updateTransaction } = useUpdateTransaction();

  // 4. Derived/computed state with useMemo
  const filteredData = useMemo(() => {
    return transactions?.filter(...);
  }, [transactions, filters]);

  // 5. Event handlers with useCallback
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // 6. Conditional rendering
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  if (!data?.length) return <EmptyState />;

  // 7. Render
  return <div>{/* content */}</div>;
}
```

### Modal/Dialog Design Standards (from CLAUDE.md)
- Modern design with icon badges (`h-8 w-8 rounded-lg bg-primary/10`)
- No border colors: use `bg-primary/5`, `bg-muted/40` instead
- Compact layouts: `p-3` to `p-5` padding
- Semantic icons for size/view selection
- Subtle hover states with opacity: `hover:bg-primary/8`
- Clear typography hierarchy
- No unnecessary elements or separators

### File Organization
- Pages: `app/(protected)/accountsv2/`
- Page components: `app/(protected)/accountsv2/components/`
- Feature components: `components/modules/accounts/`, `components/modules/transactions/`
- Hooks: `lib/features/{feature}/queries/`
- Stores: `lib/features/{feature}/stores/`
- Types: `lib/types/`, `lib/features/{feature}/types/`
- Utils: `lib/utils/`, `lib/features/{feature}/utils/`

---

## Integration Points & Existing Assets to Leverage

### Hooks to Use
- ✅ `useAllAccounts()` - Account list
- ✅ `useAccountDetails(id)` - Account details
- ✅ `useAccountTransactions(id, params)` - Account transactions
- ✅ `useAccountChart(id, period)` - Balance history
- ✅ All transaction hooks from `lib/features/transactions/queries/use-transactions-data.ts`
- ✅ `useCategoryGroups()` - Category hierarchy

### Components to Reuse/Extend
- ✅ `TransactionCardList` - Card view
- ✅ `TransactionTable` - Table view
- ✅ `TransactionDetailDrawer` - Details panel
- ✅ `FilterOptionsDrawer` - Filters
- ✅ `BulkEditTransactionsDrawer` - Bulk ops
- ✅ `CategoriesManagement` - Category management
- ✅ `RulesManagement` - Rules management
- ✅ Account components from `/accounts/components/`

### API Endpoints (Already Exist)
- ✅ All transaction endpoints (list, search, bulk ops)
- ✅ All category endpoints (CRUD)
- ✅ All categorization rules endpoints
- ✅ All findings endpoints (recurring, expected, reconciliation)
- ✅ Duplicate detection
- ✅ Auto-categorization

### UI Components from shadcn/ui
- Tabs, Dialogs, Drawers, Dropdowns
- DatePicker, Select, Input, Textarea
- Charts (Recharts integration)
- Progress, Skeleton, Alert, Badge
- Tables with sorting/filtering

---

## Success Criteria

1. ✅ All 60+ backend endpoints are utilized in UI
2. ✅ Follow TanStack Query + Zustand pattern from CLAUDE.md
3. ✅ No direct API calls from components
4. ✅ Proper error handling and loading states on all pages
5. ✅ Advanced filtering works on all filterable data
6. ✅ Bulk operations function correctly
7. ✅ All modals/dialogs follow design standards
8. ✅ Responsive design (mobile, tablet, desktop)
9. ✅ Proper TypeScript types throughout
10. ✅ Performance optimized (memoization, proper dependencies)
11. ✅ Accessibility features (ARIA, keyboard nav)
12. ✅ No console warnings or errors
13. ✅ All UI state persists correctly (localStorage via Zustand persist)

