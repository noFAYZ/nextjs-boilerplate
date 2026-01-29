# MoneyMappr Frontend Refactoring - Migration Guide

**Version:** 1.0
**Date:** January 2025
**Status:** Complete ✅

This guide documents the comprehensive refactoring completed in January 2025 to clean up and organize the MoneyMappr frontend codebase.

## Overview

A multi-phase refactoring was completed to:
- Reduce codebase bloat by ~20-25% (removed unused components & documentation)
- Consolidate 51 query files into organized domain modules
- Reorganize 35+ component directories into feature-based modules
- Maintain zero breaking changes through backward compatibility

**Build Impact:** All changes fully backward compatible - no import changes required.

---

## What Changed?

### Phase 1: Component Cleanup ✅

**Deleted unused component versions:**
- `components/budgets/` (original, unused - 22 files)
- `components/budgets-v2/` (intermediate, barely used - 9 files)
- `components/onboarding/` old version (3 files)
- Old budget pages (`app/(protected)/budgets/*`)

**Kept production versions:**
- `components/budgets-v3/` → now available at `components/features/budgets/`
- All modern UI components preserved

**Archived documentation:**
- Moved `BackendModules/` → `backend-context-docs/modules/`
- Removed outdated docs: `ACCOUNTS.md`, `CONNECTIONS.md`, etc.
- Reference docs still available for backend understanding

**Result:** ~70-100 unused files removed

---

### Phase 2: Query File Consolidation ✅

**Reduced 51 query files to ~35-40 organized files:**

#### Before:
```
lib/queries/
├── use-budget-data.ts
├── use-budget-alerts-data.ts
├── use-budget-analytics-data.ts
├── use-budget-forecasting-data.ts
├── use-budget-reports-data.ts
├── use-budget-templates-data.ts
├── use-envelope-data.ts
├── use-income-allocation-data.ts
├── use-categories-data.ts
├── use-category-groups-data.ts
├── use-categorization-rules-data.ts
├── ... (40+ more files)
```

#### After:
```
lib/queries/
├── budgets/
│   ├── use-budget-data.ts
│   ├── use-budget-alerts-data.ts
│   ├── use-budget-analytics-data.ts
│   ├── budget-queries.ts
│   └── index.ts
├── categories/
│   ├── use-categories-data.ts
│   ├── use-category-groups-data.ts
│   ├── categories-queries.ts
│   └── index.ts
├── organization/
│   ├── use-organization-data.ts
│   └── use-organization-data-context.ts
├── (root re-exports for backward compatibility)
└── query-helpers.ts
```

**Benefits:**
- Clear domain organization (budgets, categories, organization)
- Consolidated query factories by feature
- Extracted shared utilities to `query-helpers.ts`
- All existing imports still work via re-exports

---

### Phase 3: Component Reorganization ✅

**Reorganized ~35 top-level component directories into feature modules:**

#### Before:
```
components/
├── budgets-v3/          (45 files)
├── crypto/              (30+ files)
├── banking/             (20+ files)
├── accounts/            (80+ files)
├── transactions/        (40+ files)
├── goals/               (12 files)
├── networth/            (8 files)
├── subscriptions/       (15 files)
├── settings/            (10 files)
├── analytics/           (2 files)
├── auth/                (8 files)
├── dashboard/           (10 files)
├── dashboard-widgets/   (20 files)
├── onboarding-v2/       (12 files)
├── sidebar/             (old)
├── sidebar-v2/          (9 files)
├── landing/             (26 files)
├── landing-v2/          (7 files)
└── ... (35+ directories total)
```

#### After:
```
components/
├── features/                    (NEW - organized modules)
│   ├── accounts/        (moved from accounts/)
│   ├── analytics/       (moved from analytics/)
│   ├── auth/            (moved from auth/)
│   ├── banking/         (moved from banking/)
│   ├── budgets/         (moved from budgets-v3/)
│   ├── crypto/          (moved from crypto/)
│   ├── dashboard/       (moved from dashboard/ + dashboard-widgets/)
│   ├── goals/           (moved from goals/)
│   ├── networth/        (moved from networth/)
│   ├── onboarding/      (moved from onboarding-v2/)
│   ├── settings/        (moved from settings/)
│   ├── subscriptions/   (moved from subscriptions/)
│   ├── transactions/    (moved from transactions/)
│   └── categories/      (new - for future use)
├── layout/
│   ├── sidebar/         (moved from sidebar-v2/)
│   ├── ... (other layout components)
│   └── (old dashboard-layout files archived)
├── marketing/           (consolidated from landing/ + landing-v2/)
├── ui/                  (unchanged - design system)
├── icons/               (unchanged)
├── providers/           (unchanged)
├── (original dirs with re-export index.ts for backward compat)
└── ... (utilities)
```

**Backward Compatibility:**
- Original directories preserved as re-export wrappers
- `components/budgets-v3/index.ts` → re-exports from `features/budgets`
- `components/crypto/index.ts` → re-exports from `features/crypto`
- All existing imports continue to work

---

## How to Use the New Structure

### Importing from Features (New Way - Recommended)

```typescript
// ✅ NEW - Direct import from features (recommended for new code)
import { BudgetCard } from '@/components/features/budgets/shared/budget-card';
import { CryptoWalletCard } from '@/components/features/crypto/WalletCard';
import { AccountsDataTable } from '@/components/features/accounts/table-view/accounts-data-table';
```

### Importing from Original Locations (Old Way - Still Works)

```typescript
// ✅ OLD - Still works via re-exports (for backward compatibility)
import { BudgetCard } from '@/components/budgets-v3/shared/budget-card';
import { CryptoWalletCard } from '@/components/crypto/WalletCard';
import { AccountsDataTable } from '@/components/accounts/table-view/accounts-data-table';
```

Both work the same way - the original directories re-export from features.

### Query Imports (Similar Pattern)

```typescript
// ✅ NEW - Direct import from module (recommended)
import { useBudgets, useBudgetAlerts } from '@/lib/queries/budgets';

// ✅ OLD - Still works via re-exports
import { useBudgets } from '@/lib/queries/use-budget-data';
import { useBudgetAlerts } from '@/lib/queries/use-budget-alerts-data';
```

---

## Migration Path

### ✅ ZERO BREAKING CHANGES - All existing code continues to work

The refactoring is fully backward compatible through re-export wrappers. You can continue working with existing imports without any changes.

### Recommended Approach: Opt-In Gradual Migration

Rather than bulk-migrating (which breaks internal dependencies), use this safer approach:

**For NEW code:**
```typescript
// ✅ NEW - Use features/ structure for new components
import { BudgetCard } from '@/components/features/budgets/shared/budget-card';
import { useBudgets } from '@/lib/queries/budgets';
```

**For EXISTING code:**
```typescript
// ✅ OLD - Continue using existing paths (still works via re-exports)
import { BudgetCard } from '@/components/budgets-v3/shared/budget-card';
import { useBudgets } from '@/lib/queries/use-budget-data';
```

**When editing existing components:**
- If making major changes, consider migrating imports
- If making minor fixes, keep existing imports
- No need to rush - gradual migration is fine

**Why not bulk migrate?**
- Internal component imports use relative paths
- Bulk-migrating breaks these internal dependencies
- Safer to migrate component-by-component when editing
- Re-export wrappers ensure no import breaks

---

## Query File Organization

### Budget Queries

**Location:** `lib/queries/budgets/`

```typescript
// Main budget hooks
import { useBudgets, useBudget } from '@/lib/queries/budgets';

// Specialized hooks
import { useBudgetAlerts } from '@/lib/queries/budgets';
import { useBudgetAnalytics } from '@/lib/queries/budgets';
import { useBudgetForecasts } from '@/lib/queries/budgets';
import { useBudgetReports } from '@/lib/queries/budgets';
import { useBudgetTemplates } from '@/lib/queries/budgets';

// Envelope & Income allocation
import { useEnvelopes, useAllocateIncome } from '@/lib/queries/budgets';

// Query factories & keys
import { budgetKeys } from '@/lib/queries/budgets/budget-queries';
```

### Category Queries

**Location:** `lib/queries/categories/`

```typescript
import { useCategories, useCategoryGroups } from '@/lib/queries/categories';
import { useCategorizationRules } from '@/lib/queries/categories';
import { categoriesKeys } from '@/lib/queries/categories/categories-queries';
```

### Organization Queries

**Location:** `lib/queries/organization/`

```typescript
import { useOrganizationData } from '@/lib/queries/organization';
import { useOrganizationCryptoWallets } from '@/lib/queries/organization';
```

---

## Component Organization

### Feature-Based Modules

Each feature module in `components/features/` follows this pattern:

```
components/features/budgets/
├── shared/              (Shared components within budgets)
│   ├── budget-card.tsx
│   ├── envelope-card.tsx
│   └── skeleton-card.tsx
├── modals/              (Modal dialogs)
│   ├── create-budget-modal.tsx
│   └── create-envelope-modal.tsx
├── sections/            (Page sections)
│   ├── income-summary.tsx
│   └── insights-cards.tsx
├── analytics/           (Analytics-specific)
│   ├── spending-chart.tsx
│   └── trends.tsx
├── forecasting/         (Forecasting-specific)
│   ├── forecast-chart.tsx
│   └── recommendations.tsx
├── tabs/                (Tab components)
│   ├── overview-tab.tsx
│   ├── analytics-tab.tsx
│   └── income-allocation-tab.tsx
├── README.md            (Module documentation)
└── index.ts             (Public exports)
```

### Accessing Components

```typescript
// Import from feature directly
import { BudgetCard } from '@/components/features/budgets/shared/budget-card';

// Or from index if exported there
import { BudgetCard } from '@/components/features/budgets';
```

---

## Best Practices

### For New Features

1. **Create feature module in features/**
   ```bash
   mkdir components/features/my-feature/
   ```

2. **Organize by sub-domain**
   ```
   components/features/my-feature/
   ├── shared/         (Reusable components)
   ├── sections/       (Page sections)
   ├── modals/         (Dialog components)
   └── index.ts        (Public exports)
   ```

3. **Create matching query module**
   ```bash
   mkdir lib/queries/my-feature/
   ```

4. **Export from index files**
   ```typescript
   // components/features/my-feature/index.ts
   export { MyFeatureCard } from './shared/card';
   export { MyFeatureModal } from './modals/modal';
   ```

### For Existing Features

- Keep original directory structure as-is (backward compat)
- New components go to `components/features/`
- Gradually migrate old components as they're edited

---

## File Size Reduction

**Overall Impact:**

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Query files | 51 files | ~35-40 files | 15-25% |
| Component dirs | 35+ | 15 modules | Cleaner org |
| Unused files | ~70-100 | 0 | Removed |
| Build time | ~10s | ~10s | Same |
| Total reduction | -- | ~20-25% | Overall |

---

## Troubleshooting

### Import not found after refactoring?

**Check:**
1. Is the component in `components/features/`?
2. Does `components/original-dir/index.ts` re-export it?
3. Are relative paths correct?

**Solution:**
```typescript
// Try importing from features directly
import { Component } from '@/components/features/[module]/path';

// Or check if it's exported from index
import { Component } from '@/components/[original-dir]';
```

### Query not found?

**Check:**
1. Is it in `lib/queries/[module]/`?
2. Is it re-exported from root `lib/queries/`?

**Solution:**
```typescript
// Try module import
import { useQuery } from '@/lib/queries/[module]';

// Or root re-export
import { useQuery } from '@/lib/queries';
```

### Build errors after changes?

```bash
# Clear build cache
rm -rf .next

# Rebuild
npm run build
```

---

## Summary

This refactoring provides:

✅ **Better Code Organization** - Features clearly separated
✅ **Easier Navigation** - Find related code faster
✅ **Scalability** - Foundation for future growth
✅ **Zero Breaking Changes** - All imports still work
✅ **Developer Experience** - Clearer structure and conventions

**No action required** - continue working as usual. Migrate imports gradually when convenient.

---

## Questions?

Refer to:
- **Architecture:** See `ARCHITECTURE.md`
- **Component examples:** Check `components/features/*/README.md`
- **Query patterns:** See `lib/queries/*/README.md` (to be created)
