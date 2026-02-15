# AccountsV2 Implementation Checklist

## Phase 1: Hooks & Store Foundation

### Step 1.1: Expand Transactions UI Store
**File:** `lib/features/transactions/stores/transactions-ui-store.ts`

**Changes Required:**
- [ ] Add `filters` object with:
  - `amountRange: { min: number | null; max: number | null }`
  - `merchants: string[]`
  - `categories: string[]`
  - `types: TransactionType[]`
  - `statuses: TransactionStatus[]`
  - `reconciled: boolean | null`
  - `tagged: boolean | null`
  - `hasMemo: boolean | null`
- [ ] Add `searchQuery: string`
- [ ] Add `viewMode: 'list' | 'card' | 'table'`
- [ ] Add `sortBy: 'date' | 'amount' | 'description' | 'category'`
- [ ] Add `sortOrder: 'asc' | 'desc'`
- [ ] Add `selectedTransactionIds: string[]`
- [ ] Add `isBulkSelectMode: boolean`
- [ ] Create actions for all above state properties
- [ ] Add persist middleware for preferences
- [ ] Export selectors for each property

**Status:** ⬜ Not Started

---

### Step 1.2: Create Account Detail UI Store
**File:** `lib/features/accounts/stores/account-detail-ui-store.ts` (NEW)

**Content Required:**
```typescript
interface AccountDetailUIState {
  activeTab: 'overview' | 'transactions' | 'analytics' | 'categories' | 'reconciliation' | 'settings';
  selectedTransactionId: string | null;
  transactionFilters: {
    dateRange?: { from: string; to: string };
    amountRange?: { min: number | null; max: number | null };
    merchants?: string[];
    categories?: string[];
    types?: TransactionType[];
    statuses?: TransactionStatus[];
    reconciled?: boolean | null;
    tagged?: boolean | null;
    hasMemo?: boolean | null;
    searchQuery?: string;
  };
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
  // ... etc
}
```

**Status:** ⬜ Not Started

---

### Step 1.3: Create Missing Data Hooks
**File:** `lib/features/transactions/queries/use-transactions-data.ts`

**Add Hooks:**

- [ ] `useSearchTransactions(query: string, filters: TransactionSearchFilters, accountId?: string)`
  - Memoize params using JSON.stringify
  - Enable only when query or filters present
  - Use `transactionQueries.search()`

- [ ] `useAccountStats(accountId: string, dateRange?: { from: string; to: string })`
  - Fetch stats using `transactionQueries.stats()`
  - Calculate additional metrics client-side

- [ ] `useDuplicateTransactions(accountId: string)`
  - Use existing or create new API endpoint call
  - Return potential duplicates

- [ ] `useRecurringPatterns(accountId: string)`
  - Use `transactionQueries.recurringPatterns()`
  - Return list of recurring transactions

- [ ] `useExpectedTransactions(accountId: string)`
  - Use `transactionQueries.expectedTransactions()`
  - Return forecasted transactions

- [ ] `useReconciliationProgress(accountId: string)`
  - Use `transactionQueries.reconciliationProgress()`
  - Return reconciliation stats

**Status:** ⬜ Not Started

---

### Step 1.4: Add Account Detail Statistics Hook
**File:** `lib/features/accounts/queries/use-accounts-data.ts`

**Add Hooks:**

- [ ] `useAccountStats(accountId: string, dateRange?: { from: string; to: string })`
  - Calculate stats from transactions
  - Return: totalTransactions, totalAmount, averageAmount, largestTransaction, etc.

**Status:** ⬜ Not Started

---

## Phase 2: Type Definitions

### Step 2.1: Create TransactionSearchFilters Type
**File:** `lib/types/transactions.ts` or `lib/features/transactions/types/transactions.ts`

**Add Types:**
- [ ] `TransactionSearchFilters` interface
- [ ] `TransactionAnalytics` interface
- [ ] `CategorizationRuleTest` interface
- [ ] `AccountDetailPageParams` interface
- [ ] `DuplicateTransactionMatch` interface
- [ ] `RecurringPattern` interface
- [ ] `ExpectedTransaction` interface

**Status:** ⬜ Not Started

---

## Phase 3: Shared Utilities

### Step 3.1: Create Transaction Utilities
**File:** `lib/features/transactions/utils/`

**Files to Create:**
- [ ] `transaction-filters.ts` - Apply/combine filters
- [ ] `transaction-search.ts` - Search logic with fuzzy matching
- [ ] `analytics-calculations.ts` - Calculate analytics from transactions
- [ ] `duplicate-detection.ts` - Detect duplicate transactions
- [ ] `categorization-helpers.ts` - Categorization logic

**Status:** ⬜ Not Started

---

## Phase 4: Shared Components

### Step 4.1: Transaction Search & Filter Components
**Location:** `components/modules/transactions/components/`

- [ ] `advanced-transaction-search.tsx`
  - Search input with debouncing
  - Filter button that opens panel
  - Clear search button

- [ ] `transaction-filter-panel.tsx`
  - Date range picker
  - Amount range slider
  - Merchant multi-select (with API search)
  - Category multi-select
  - Transaction type checkboxes
  - Status checkboxes
  - Special filters (reconciled, has tags, has memo)
  - Apply/Clear buttons

- [ ] `transaction-bulk-operations.tsx`
  - Selection count display
  - Bulk action buttons (categorize, tag, reconcile, delete)
  - Confirmation modals for destructive actions

- [ ] `transaction-statistics-card.tsx`
  - Display key metrics (count, total, average, etc.)
  - Optional mini chart

- [ ] `duplicate-transactions-modal.tsx`
  - Side-by-side comparison view
  - Mark as duplicate button
  - Merge/delete actions

**Status:** ⬜ Not Started

---

### Step 4.2: Analytics Components
**Location:** `components/modules/accounts/components/analytics/`

- [ ] `category-spending-chart.tsx` (Recharts)
  - Pie or Bar chart of spending by category
  - Click to filter transactions by category

- [ ] `spending-trends-chart.tsx` (Recharts)
  - Line chart of monthly spending trends
  - Time range selector

- [ ] `recurring-patterns-list.tsx`
  - List of recurring transactions
  - Frequency, amount, next expected date
  - Mark as expected/forecast button

- [ ] `expected-transactions-list.tsx`
  - List of forecasted transactions
  - Actual vs expected comparison
  - Mark as received when actual matches

- [ ] `transaction-type-breakdown.tsx` (Recharts)
  - Breakdown by transaction type (income, expense, transfer)
  - Donut chart or table view

- [ ] `merchant-spending-chart.tsx` (Recharts)
  - Top merchants/payees by spending
  - Bar or table view

**Status:** ⬜ Not Started

---

### Step 4.3: Category Management Components
**Location:** `components/modules/transactions/components/category-management/`

- [ ] `category-list.tsx`
  - Table/list of categories
  - Edit and delete buttons
  - Set as default/favorite

- [ ] `category-form.tsx`
  - Form to add/edit category
  - Name input
  - Color picker
  - Description textarea
  - Icon selector (optional)
  - Dialog wrapper

- [ ] `categorization-rules-list.tsx`
  - Table of active rules
  - Enable/disable toggles
  - Edit/delete buttons
  - Priority reordering (drag & drop or up/down)
  - View affected transactions count

- [ ] `categorization-rule-form.tsx`
  - Rule name input
  - Pattern/condition builder
  - Target category selector
  - Priority setting
  - Enable/disable toggle
  - Test rule button

- [ ] `rule-tester.tsx`
  - Display rule and test cases
  - Show matching transactions
  - Show non-matching transactions
  - Match count and percentage

- [ ] `auto-categorization-progress.tsx`
  - Progress bar/spinner
  - Uncategorized count
  - Processed count
  - Results summary

**Status:** ⬜ Not Started

---

### Step 4.4: Account Settings Components
**Location:** `components/modules/accounts/components/account-settings/`

- [ ] `account-info-card.tsx`
  - Display account details
  - Read-only display of: name, type, balance, institution, currency
  - Edit button to open form

- [ ] `account-lifecycle-controls.tsx`
  - Status badge (active/inactive)
  - Deactivate button with confirmation
  - Reactivate button
  - Last activity date
  - Deactivation reason input (optional)

- [ ] `account-connection-details.tsx`
  - Connection status (healthy/warning/error)
  - Connection health percentage
  - Last sync time
  - Sync frequency setting
  - Manual sync button with loading state
  - Last error message (if any)
  - View sync logs button

- [ ] `account-sync-logs.tsx`
  - Table of sync history
  - Timestamp, status, transaction count, error message
  - View details modal for each sync

- [ ] `account-notes-editor.tsx`
  - Textarea for account notes/description
  - Save button
  - Character count

**Status:** ⬜ Not Started

---

## Phase 5: Main Pages

### Step 5.1: Accounts V2 List Page
**File:** `app/(protected)/accountsv2/page.tsx`

**Features:**
- [ ] Page header with title
- [ ] View mode toggle (grid/list/grouped)
- [ ] Search input
- [ ] Filter button (opens panel)
- [ ] Sort controls (by name, balance, type, institution, etc.)
- [ ] Balance visibility toggle
- [ ] Bulk select mode toggle
- [ ] Add account button
- [ ] Main accounts list/grid with:
  - [ ] Account card/row with basic info
  - [ ] Balance display (with visibility toggle)
  - [ ] Status badge (active/inactive)
  - [ ] Connection health badge
  - [ ] Quick action buttons (edit, view, favorite, delete)
  - [ ] Last sync time
  - [ ] Sync status indicator
- [ ] Bulk operations toolbar (when in bulk mode):
  - [ ] Select all / Select none
  - [ ] Bulk deactivate button
  - [ ] Bulk reactivate button
  - [ ] Bulk delete button with confirmation
  - [ ] Selected count display
- [ ] Pagination or infinite scroll
- [ ] Empty state when no accounts
- [ ] Loading state with skeletons

**Components to Create:**
- [ ] `accountsv2-header.tsx` - Header with filters and controls
- [ ] `accountsv2-list.tsx` - Main list component
- [ ] `accountsv2-grid.tsx` - Grid view component
- [ ] `account-row-v2.tsx` - Single account row
- [ ] `account-card-v2.tsx` - Single account card
- [ ] `bulk-operations-toolbar.tsx` - Bulk select toolbar

**Status:** ⬜ Not Started

---

### Step 5.2: Account Detail Page - Structure
**File:** `app/(protected)/accountsv2/[accountId]/page.tsx`

**Structure:**
- [ ] Layout with:
  - [ ] Back button
  - [ ] Account header with:
    - [ ] Account name and type
    - [ ] Current balance
    - [ ] Connection status
    - [ ] Favorite toggle
    - [ ] More actions menu (edit, deactivate, delete)
  - [ ] Tab navigation:
    - [ ] Overview
    - [ ] Transactions
    - [ ] Analytics
    - [ ] Categories
    - [ ] Reconciliation
    - [ ] Settings
  - [ ] Tab content area

**Status:** ⬜ Not Started

---

### Step 5.3: Account Detail Page - Overview Tab
**Location:** `app/(protected)/accountsv2/[accountId]/components/overview-tab.tsx`

**Content:**
- [ ] Account summary card:
  - [ ] Account details (type, category, balance, currency)
  - [ ] Status (active/inactive)
  - [ ] Last sync time
  - [ ] Edit button
- [ ] Balance history chart:
  - [ ] Display chart using account balance data
  - [ ] Time range selector (7d, 30d, 90d, 1y, all)
  - [ ] Chart statistics (current, high, low, average)
- [ ] Quick stats:
  - [ ] Total transactions (month)
  - [ ] Average transaction
  - [ ] Largest transaction
  - [ ] Total spending/income (period)
- [ ] Recent transactions list:
  - [ ] Last 5-10 transactions
  - [ ] View all link to transactions tab
- [ ] Quick actions:
  - [ ] Add transaction button
  - [ ] Sync button
  - [ ] View all transactions button

**Status:** ⬜ Not Started

---

### Step 5.4: Account Detail Page - Transactions Tab
**Location:** `app/(protected)/accountsv2/[accountId]/components/transactions-tab.tsx`

**Content:**
- [ ] Search and filter section:
  - [ ] `advanced-transaction-search.tsx`
  - [ ] `transaction-filter-panel.tsx`
- [ ] View mode selector (list/card/table)
- [ ] Sort controls
- [ ] Transaction list/table:
  - [ ] Reuse `TransactionTable` or `TransactionCardList`
  - [ ] Checkbox for bulk select (if bulk mode enabled)
  - [ ] Pagination/infinite scroll
- [ ] Bulk operations toolbar (when items selected):
  - [ ] `transaction-bulk-operations.tsx`
- [ ] Transaction detail drawer:
  - [ ] Opens on transaction click
  - [ ] Use existing `TransactionDetailDrawer`
  - [ ] Show notes, tags, attachments
- [ ] Empty state for no transactions
- [ ] Loading state with skeletons

**Status:** ⬜ Not Started

---

### Step 5.5: Account Detail Page - Analytics Tab
**Location:** `app/(protected)/accountsv2/[accountId]/components/analytics-tab.tsx`

**Content:**
- [ ] Summary statistics:
  - [ ] Total transactions
  - [ ] Total amount
  - [ ] Average per transaction
  - [ ] Largest transaction
- [ ] Charts section (2-3 columns):
  - [ ] `category-spending-chart.tsx`
  - [ ] `spending-trends-chart.tsx`
  - [ ] `transaction-type-breakdown.tsx`
- [ ] Recurring patterns section:
  - [ ] `recurring-patterns-list.tsx`
- [ ] Expected transactions section:
  - [ ] `expected-transactions-list.tsx`
- [ ] Merchant/payee breakdown:
  - [ ] `merchant-spending-chart.tsx`
- [ ] Cash flow analysis (optional):
  - [ ] Income vs Expense chart

**Status:** ⬜ Not Started

---

### Step 5.6: Account Detail Page - Categories Tab
**Location:** `app/(protected)/accountsv2/[accountId]/components/categories-tab.tsx`

**Content:**
- [ ] Tab switcher:
  - [ ] Categories subtab
  - [ ] Categorization Rules subtab
  - [ ] Auto-Categorize subtab
- [ ] Categories subtab:
  - [ ] `category-list.tsx`
  - [ ] Create category button (opens `category-form.tsx`)
  - [ ] Edit/delete actions per category
- [ ] Categorization Rules subtab:
  - [ ] `categorization-rules-list.tsx`
  - [ ] Create rule button (opens `categorization-rule-form.tsx`)
  - [ ] Edit/delete/test actions per rule
  - [ ] Priority reordering
  - [ ] Enable/disable toggles
- [ ] Auto-Categorize subtab:
  - [ ] Show uncategorized transactions count
  - [ ] Run auto-categorization button
  - [ ] `auto-categorization-progress.tsx`
  - [ ] Results summary after completion

**Status:** ⬜ Not Started

---

### Step 5.7: Account Detail Page - Reconciliation Tab
**Location:** `app/(protected)/accountsv2/[accountId]/components/reconciliation-tab.tsx`

**Content:**
- [ ] Reconciliation progress:
  - [ ] Progress bar showing % reconciled
  - [ ] Counts: total, reconciled, pending
  - [ ] Last reconciliation date
- [ ] Duplicate transactions section:
  - [ ] `duplicate-transactions-modal.tsx` or list
  - [ ] Auto-detect duplicates button
  - [ ] Show potential duplicates with match confidence
  - [ ] Mark as duplicate / merge / ignore actions
- [ ] Transaction matching helper:
  - [ ] Filter to unreconciled transactions
  - [ ] Manual matching UI
  - [ ] Mark as reconciled button
- [ ] Reconciliation history:
  - [ ] Table of past reconciliations
  - [ ] Date, count, status
  - [ ] Notes/comments field

**Status:** ⬜ Not Started

---

### Step 5.8: Account Detail Page - Settings Tab
**Location:** `app/(protected)/accountsv2/[accountId]/components/settings-tab.tsx`

**Content:**
- [ ] Account information section:
  - [ ] `account-info-card.tsx`
  - [ ] Edit button opens form
- [ ] Account status section:
  - [ ] `account-lifecycle-controls.tsx`
  - [ ] Deactivate/reactivate buttons
- [ ] Account connection section:
  - [ ] `account-connection-details.tsx`
  - [ ] Manual sync button
  - [ ] View sync logs button
- [ ] Account notes section:
  - [ ] `account-notes-editor.tsx`
- [ ] Danger zone section:
  - [ ] Delete account button with confirmation
  - [ ] Export account data (optional)

**Status:** ⬜ Not Started

---

## Phase 6: Testing & Optimization

### Step 6.1: Component Testing
- [ ] Test all hooks with proper parameters
- [ ] Test filter application and clearing
- [ ] Test bulk operations
- [ ] Test pagination/infinite scroll
- [ ] Test error states
- [ ] Test loading states
- [ ] Test empty states

**Status:** ⬜ Not Started

---

### Step 6.2: Performance Optimization
- [ ] Add proper memoization with useMemo
- [ ] Add useCallback for event handlers
- [ ] Profile with React DevTools
- [ ] Check for unnecessary re-renders
- [ ] Implement virtual scrolling for large lists (if needed)
- [ ] Lazy load analytics components (if heavy)

**Status:** ⬜ Not Started

---

### Step 6.3: Accessibility
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Check color contrast
- [ ] Test with accessibility tools

**Status:** ⬜ Not Started

---

### Step 6.4: Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] Adjust layouts for smaller screens
- [ ] Test touch interactions

**Status:** ⬜ Not Started

---

## Summary Statistics

**Total Items:** ~120 tasks
**Estimated Phases:** 6
**Recommended Timeline:** 3-4 weeks for full implementation

### Breakdown by Category:
- **Hooks & Stores:** 8 items
- **Type Definitions:** 6 items
- **Utilities:** 5 items
- **Shared Components:** 28 items
- **Main Page 1 (List):** 12 items
- **Main Page 2 (Detail):** 48 items
- **Testing & Optimization:** 8 items

### Dependencies:
1. Phase 1 → Phase 2 (types depend on hooks)
2. Phase 2 → Phase 3 (utils depend on types)
3. Phase 3 → Phase 4 (components depend on utils)
4. Phase 4 → Phase 5 (pages depend on components)
5. Phase 5 → Phase 6 (testing after pages complete)

