# MoneyMappr Frontend Architecture

**Last Updated:** January 2025
**Framework:** Next.js 15 with Turbopack
**Language:** TypeScript

---

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Module Organization](#module-organization)
5. [State Management](#state-management)
6. [Styling System](#styling-system)
7. [Development Patterns](#development-patterns)

---

## Overview

MoneyMappr is a comprehensive financial management platform built with modern React patterns and Next.js 15. The architecture prioritizes:

- **Clear separation of concerns** - UI, data, state, and logic are cleanly separated
- **Feature-based organization** - Related components grouped by domain
- **Scalability** - Easy to add new features without breaking existing code
- **Performance** - Server-side rendering, automatic caching, request deduplication
- **Developer experience** - Intuitive folder structure and clear conventions

---

## Directory Structure

### Root Level

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Authentication pages
│   ├── (protected)/             # Protected routes (require login)
│   ├── dashboard/               # Main dashboard area
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── features/                # Feature-based modules (PRIMARY)
│   ├── layout/                  # Layout components
│   ├── marketing/               # Marketing/landing page components
│   ├── ui/                      # Design system components
│   ├── icons/                   # Icon components
│   ├── providers/               # Context providers
│   └── [original-dirs]/         # Backward compatibility re-exports
├── lib/                          # Core libraries & utilities
│   ├── queries/                 # TanStack Query hooks (data fetching)
│   ├── stores/                  # Zustand stores (UI state)
│   ├── services/                # API services
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   └── contexts/                # React contexts
├── public/                       # Static assets
├── styles/                       # Global styles
├── MIGRATION_GUIDE.md            # This file
└── package.json                 # Dependencies
```

---

## Feature Modules Structure

Each feature in `components/features/` follows a consistent pattern:

### `components/features/budgets/`

```
budgets/
├── README.md                    # Feature documentation
├── index.ts                     # Public API (re-exports)
├── shared/                      # Reusable components within feature
│   ├── budget-card.tsx
│   ├── envelope-card.tsx
│   ├── skeleton-card.tsx
│   └── error-state.tsx
├── modals/                      # Modal dialogs
│   ├── create-budget-modal.tsx
│   └── create-envelope-modal.tsx
├── sections/                    # Page sections (groups of components)
│   ├── income-summary.tsx
│   ├── insights-cards.tsx
│   └── quick-allocate.tsx
├── tabs/                        # Tab-based views
│   ├── overview-tab.tsx
│   ├── analytics-tab.tsx
│   ├── forecasting-tab.tsx
│   ├── envelopes-tab.tsx
│   └── income-allocation-tab.tsx
├── analytics/                   # Analytics-specific components
│   ├── spending-chart.tsx
│   ├── trends.tsx
│   └── recommendations.tsx
├── forecasting/                 # Forecasting-specific components
│   ├── forecast-chart.tsx
│   └── confidence-bands-info.tsx
├── income-allocation/           # Income allocation flow
│   ├── income-input-form.tsx
│   ├── allocation-suggestions-list.tsx
│   └── allocation-confirmation-summary.tsx
└── layout/                      # Layout wrappers
    ├── budgets-v3-header.tsx
    └── budgets-v3-tab-navigation.tsx
```

### Available Features

| Feature | Location | Purpose |
|---------|----------|---------|
| **Accounts** | `features/accounts/` | Account management, grouping, details |
| **Banking** | `features/banking/` | Bank connections, transactions, categories |
| **Budgets** | `features/budgets/` | Budget creation, envelopes, forecasting |
| **Crypto** | `features/crypto/` | Wallet management, portfolio, DeFi |
| **Dashboard** | `features/dashboard/` | Dashboard widgets, overview |
| **Goals** | `features/goals/` | Goal tracking, milestones, progress |
| **Transactions** | `features/transactions/` | Transaction views, categorization, bulk ops |
| **Subscriptions** | `features/subscriptions/` | Subscription tracking, analysis |
| **Settings** | `features/settings/` | User preferences, security, notifications |
| **Onboarding** | `features/onboarding/` | New user setup flow |
| **Auth** | `features/auth/` | Login, signup, session management |
| **Analytics** | `features/analytics/` | Analytics integration (GA, GTM) |
| **Networth** | `features/networth/` | Net worth tracking and analysis |

---

## Data Flow Architecture

### Query Data Flow (TanStack Query)

```
┌─────────────────────────────────────────────────────────────┐
│                        COMPONENT                             │
│    (React Server or Client Component)                        │
└────────────────┬────────────────────────────────────────────┘
                 │ (1) useQuery hook
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              lib/queries/[module]/use-*.ts                   │
│        (e.g., lib/queries/budgets/use-budget-data.ts)       │
│                                                               │
│  Features:                                                   │
│  • Automatic caching with configurable stale times          │
│  • Request deduplication (same query = single request)      │
│  • Loading/error states built-in                            │
│  • Optimistic updates for mutations                         │
└────────────────┬────────────────────────────────────────────┘
                 │ (2) Creates query options
                 ▼
┌─────────────────────────────────────────────────────────────┐
│         lib/queries/[module]/[module]-queries.ts             │
│       (e.g., lib/queries/budgets/budget-queries.ts)         │
│                                                               │
│  Contains:                                                   │
│  • Query key factories (budgetKeys, categoriesKeys, etc.)   │
│  • Query options (endpoints, parameters, config)            │
│  • Mutation options                                         │
└────────────────┬────────────────────────────────────────────┘
                 │ (3) Makes API request
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            lib/api-client.ts                                 │
│                                                               │
│  • Centralized HTTP client                                  │
│  • Error handling and interceptors                          │
│  • Request/response transformation                          │
└────────────────┬────────────────────────────────────────────┘
                 │ (4) HTTP request
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                               │
│              (Next.js API routes or REST)                    │
└─────────────────────────────────────────────────────────────┘
                 │ (5) Response
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            TanStack Query Cache                              │
│                                                               │
│  • Stores response data                                     │
│  • Manages cache lifecycle                                  │
│  • Triggers re-renders when data changes                    │
└────────────────┬────────────────────────────────────────────┘
                 │ (6) Cached data
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT                                 │
│              (Updated with latest data)                      │
└─────────────────────────────────────────────────────────────┘
```

### State Management

```
┌──────────────────────────────────────────────────────────────┐
│                     COMPONENT                                 │
└──────────────┬──────────────────────────────────┬─────────────┘
               │                                  │
        (Server Data)                      (UI State)
               │                                  │
               ▼                                  ▼
    ┌──────────────────┐           ┌──────────────────────┐
    │  TanStack Query  │           │     Zustand Store    │
    │  (Source of Truth)           │                      │
    │                  │           │  Features:           │
    │  • Wallets       │           │  • Filters           │
    │  • Accounts      │           │  • View preferences  │
    │  • Transactions  │           │  • Modal states      │
    │  • Balances      │           │  • User selections   │
    │  • Portfolio     │           │  • Theme preference  │
    │  • Crypto data   │           │  • Sort order        │
    │                  │           │  • Search queries    │
    └──────────────────┘           └──────────────────────┘
```

**Key Rule:** Server data (from API) → TanStack Query. UI data → Zustand.

---

## Module Organization

### Query Modules

**Location:** `lib/queries/[module]/`

Each module contains:

```typescript
// 1. Data hooks (lib/queries/budgets/use-budget-data.ts)
export function useBudgets(params) { /* ... */ }
export function useBudget(id) { /* ... */ }
export function useBudgetAlerts(budgetId) { /* ... */ }

// 2. Query factories (lib/queries/budgets/budget-queries.ts)
export const budgetKeys = {
  all: ['budgets'],
  lists: () => ['budgets', 'list'],
  details: (id) => ['budgets', 'list', id],
  // ...
};

export const budgetQueries = {
  all: () => ({ queryKey: budgetKeys.all, queryFn: ... }),
  lists: (params) => ({ ... }),
  // ...
};

// 3. Mutations
export const budgetMutations = {
  createBudget: () => ({ mutationFn: ... }),
  updateBudget: () => ({ mutationFn: ... }),
  // ...
};
```

### Component Modules

**Location:** `components/features/[feature]/`

Each module exports public components from `index.ts`:

```typescript
// components/features/budgets/index.ts
export { BudgetCard } from './shared/budget-card';
export { BudgetAnalyticsDashboard } from './tabs/analytics-tab';
export { CreateBudgetModal } from './modals/create-budget-modal';
```

---

## State Management

### TanStack Query (Server State)

**Use for:** Data from the backend API

```typescript
import { useBudgets } from '@/lib/queries';

function BudgetList() {
  // ✅ Automatic caching, loading, error states
  const { data: budgets, isLoading, error } = useBudgets();

  // NO useEffect needed - Query handles fetching
  // Data automatically re-fetches when needed
  // Cache automatically invalidates on mutations
}
```

### Zustand (UI State)

**Use for:** UI preferences, filters, modal states, selections

```typescript
import { useBudgetUIStore } from '@/lib/stores';

function BudgetFilter() {
  // ✅ UI-specific state (not from API)
  const { filters, setDateFilter } = useBudgetUIStore();

  return <DatePicker onChange={setDateFilter} />;
}
```

### When to Use Each

| State Type | Tool | Example |
|------------|------|---------|
| API Data | TanStack Query | Wallets, accounts, transactions |
| API Mutations | TanStack Query | Create, update, delete operations |
| UI Filters | Zustand | Date range, category filter, search |
| View Preferences | Zustand | Grid vs list, chart type, sort order |
| Modal State | Zustand | Is modal open, which tab is active |
| User Selection | Zustand | Selected wallet ID, selected account |
| Theme | Zustand | Dark/light mode preference |

---

## Styling System

### Tailwind CSS 4

Primary utility-first framework with custom configuration.

**Location:** `app/globals.css`

```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component classes */
@layer components {
  .btn-primary { /* ... */ }
  .card { /* ... */ }
}

/* Custom utilities */
@layer utilities {
  .text-balance { /* ... */ }
}
```

### Class Variance Authority (CVA)

Used for component variants:

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'px-4 py-2 font-semibold rounded',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-900',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
  }
);

// Usage
<button className={buttonVariants({ variant: 'primary', size: 'md' })} />
```

---

## Development Patterns

### Component Patterns

#### Feature Component (Best Practice)

```typescript
'use client';

import { useBudgets } from '@/lib/queries';
import { useBudgetUIStore } from '@/lib/stores';

export function BudgetList() {
  // 1. Query hooks (server data)
  const { data: budgets, isLoading, error } = useBudgets();

  // 2. UI store hooks (UI state)
  const { filters, dateRange } = useBudgetUIStore();

  // 3. Filter/compute data
  const filtered = budgets?.filter(b =>
    dateRange ? b.createdAt >= dateRange.from : true
  );

  // 4. Conditional rendering
  if (isLoading) return <LoadingSkeletons />;
  if (error) return <ErrorState error={error} />;
  if (!budgets?.length) return <EmptyState />;

  // 5. Main render
  return (
    <div className="space-y-4">
      {filtered.map(budget => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
```

#### Modal Component Pattern

```typescript
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBudgetModal({ isOpen, onClose }: CreateBudgetModalProps) {
  const { mutate: createBudget, isPending } = useCreateBudget();

  const handleCreate = (data) => {
    createBudget(data, {
      onSuccess: () => onClose(), // Close on success
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>Create Budget</DialogHeader>
        {/* Form here */}
      </DialogContent>
    </Dialog>
  );
}
```

### Import Conventions

```typescript
// 1. React & third-party imports
import React from 'react';
import { useCallback } from 'react';
import Link from 'next/link';

// 2. Data hooks (queries & stores)
import { useBudgets } from '@/lib/queries';
import { useBudgetUIStore } from '@/lib/stores';

// 3. Components
import { BudgetCard } from '@/components/features/budgets/shared/budget-card';
import { Button } from '@/components/ui/button';

// 4. Types
import type { Budget } from '@/lib/types';

// 5. Utils
import { cn } from '@/lib/utils';
```

### Error Handling

```typescript
function BudgetDashboard() {
  const { data, error, isLoading } = useBudgets();

  // Handle different error states
  if (error instanceof ApiError) {
    if (error.status === 401) return <AuthError />;
    if (error.status === 403) return <ForbiddenError />;
    if (error.status >= 500) return <ServerError />;
  }

  return error ? <GenericError error={error} /> : null;
}
```

---

## Key Files Reference

### Configuration

- **`tsconfig.json`** - TypeScript configuration
- **`next.config.js`** - Next.js configuration (Turbopack, etc.)
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`package.json`** - Dependencies and scripts

### Core Files

- **`lib/api-client.ts`** - Centralized API client with interceptors
- **`lib/query-dependencies.ts`** - Query cache invalidation rules
- **`app/layout.tsx`** - Root layout with providers
- **`components/providers/providers.tsx`** - Global context providers

### Stores

- **`lib/stores/crypto-ui-store.ts`** - Crypto feature UI state
- **`lib/stores/banking-ui-store.ts`** - Banking feature UI state
- **`lib/stores/auth-store.ts`** - Authentication state
- **`lib/stores/ui-stores.ts`** - Main stores export

---

## Build & Performance

### Build Command
```bash
npm run build
```

Uses **Next.js 15 with Turbopack** for fast compilation (~10s).

### Performance Optimizations

1. **Automatic request deduplication** via TanStack Query
2. **Intelligent cache invalidation** based on query dependencies
3. **Server-side rendering** for fast first paint
4. **Code splitting** at route boundaries
5. **Image optimization** via next/image
6. **Bundle analysis** available via `npm run analyze`

### Caching Strategy

- **API responses:** Cached via TanStack Query (configurable stale times)
- **Static assets:** Browser cache + CDN
- **Images:** Optimized and cached by Next.js
- **Components:** Code split by route

---

## Common Tasks

### Adding a New Feature

1. Create feature module: `mkdir components/features/my-feature`
2. Create query module: `mkdir lib/queries/my-feature`
3. Add data hooks in `lib/queries/my-feature/use-*.ts`
4. Add query factories in `lib/queries/my-feature/my-feature-queries.ts`
5. Add components in `components/features/my-feature/`
6. Export public API from index.ts files

### Adding a New Query

1. Create in appropriate module: `lib/queries/[feature]/use-*.ts`
2. Add query keys in `[feature]-queries.ts`
3. Add to query dependencies if needed: `lib/query-dependencies.ts`
4. Export from module's `index.ts`

### Styling a Component

1. Use Tailwind classes for styling
2. Use CVA for complex variants
3. Keep component-specific styles in the component file
4. Global styles in `app/globals.css`

---

## Conventions & Best Practices

✅ **DO:**
- Use feature modules for organization
- Keep server data in TanStack Query
- Keep UI data in Zustand stores
- Name files with `.tsx` for components, `.ts` for logic
- Use `index.ts` for public exports
- Create `README.md` in major modules
- Add TypeScript types to everything

❌ **DON'T:**
- Store server data in Zustand
- Use `useEffect` for data fetching
- Call APIs directly from components
- Mix server & UI state in same hook
- Create deeply nested component directories
- Leave code comments when self-documenting names work
- Ignore TypeScript errors

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **TanStack Query:** https://tanstack.com/query
- **Zustand:** https://github.com/pmndrs/zustand
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org

---

## Contact & Questions

For architecture questions or concerns, refer to:
- This document (ARCHITECTURE.md)
- Migration guide (MIGRATION_GUIDE.md)
- Feature-specific READMEs in component modules
