# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MoneyMappr is a comprehensive financial management platform built with Next.js 15 that combines traditional banking, cryptocurrency portfolios, and investment tracking. The application uses a modern stack with React Server Components, TypeScript, and Tailwind CSS.

## Available Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Architecture & Key Technologies

### Core Framework
- **Next.js 15** with App Router, Turbopack, and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **React 19** with latest features

### State Management - **PRODUCTION ARCHITECTURE** ⭐

**CRITICAL: Clear State Boundaries**

```
┌─────────────────────────────────────────────────────────────┐
│                        COMPONENTS                            │
│         (NO direct API calls, NO useEffect for data)        │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   UI STATE   │  │   SERVER STATE   │
│   (Zustand)  │  │ (TanStack Query) │
└──────────────┘  └──────────────────┘
```

#### **TanStack Query** - SERVER STATE (Single Source of Truth)
- **Purpose**: ALL server data (wallets, accounts, transactions, portfolios, analytics)
- **Location**: `lib/queries/use-*-data.ts`
- **Features**:
  - Automatic caching with configurable stale times
  - Optimistic updates built-in
  - Automatic cache invalidation
  - Polling and real-time sync
  - Loading/error states
- **Never**: Store server data in Zustand, use useEffect for data fetching

#### **Zustand** - UI STATE ONLY (Client State)
- **Purpose**: UI preferences, filters, view modes, modal states, selections
- **Location**: `lib/stores/*-ui-store.ts`
- **Examples**:
  - ✅ Filters (date ranges, categories, search queries)
  - ✅ View preferences (grid/list, chart types, time ranges)
  - ✅ Modal states (open/closed)
  - ✅ Selected items (selected wallet ID, selected account ID)
  - ❌ Wallets, accounts, transactions (use TanStack Query)
  - ❌ Portfolio data, analytics (use TanStack Query)

### Data Fetching Pattern - **REQUIRED APPROACH**

#### ✅ **CORRECT Pattern**
```typescript
// Component: WalletList.tsx
import { useCryptoWallets, useCreateCryptoWallet } from '@/lib/queries';
import { useCryptoUIStore } from '@/lib/stores/ui-stores';

function WalletList() {
  // ✅ Server data from TanStack Query
  const { data: wallets, isLoading, error } = useCryptoWallets();

  // ✅ UI state from Zustand
  const { filters, viewPreferences } = useCryptoUIStore();

  // ✅ Mutations with automatic cache updates
  const { mutate: createWallet } = useCreateCryptoWallet();

  // ✅ NO useEffect for data fetching
  // ✅ NO manual API calls

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* render wallets */}</div>;
}
```

#### ❌ **WRONG Patterns**
```typescript
// ❌ NEVER DO THIS - Direct API call in component
import { cryptoApi } from '@/lib/services/crypto-api';

function WalletList() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    // ❌ WRONG: Manual data fetching
    cryptoApi.getWallets().then(data => setWallets(data));
  }, []);

  // ❌ WRONG: No caching, no optimistic updates, no error handling
}

// ❌ NEVER DO THIS - Storing server data in Zustand
const cryptoStore = create((set) => ({
  wallets: [],
  fetchWallets: async () => {
    // ❌ WRONG: Server data in Zustand
    const wallets = await cryptoApi.getWallets();
    set({ wallets });
  }
}));
```

### Available Data Hooks

#### Crypto Data (`lib/queries/use-crypto-data.ts`)
```typescript
// Wallet Queries
useCryptoWallets()                    // All wallets
useCryptoWallet(id)                   // Single wallet
useSelectedCryptoWallet()             // Currently selected wallet

// Portfolio Queries
useCryptoPortfolio(params)            // Portfolio overview

// Transaction Queries
useCryptoTransactions(params)         // All transactions
useWalletTransactions(id, params)     // Wallet transactions

// NFT & DeFi Queries
useCryptoNFTs(params)                 // All NFTs
useWalletNFTs(id, params)             // Wallet NFTs
useCryptoDeFi()                       // All DeFi positions
useWalletDeFi(id)                     // Wallet DeFi

// Mutations (with optimistic updates)
useCreateCryptoWallet()               // Create wallet
useUpdateCryptoWallet()               // Update wallet
useDeleteCryptoWallet()               // Delete wallet
useSyncCryptoWallet()                 // Sync wallet
```

#### Banking Data (`lib/queries/use-banking-data.ts`)
```typescript
// Account Queries
useBankingAccounts()                  // All accounts
useBankingAccount(id)                 // Single account
useSelectedBankAccount()              // Currently selected

// Dashboard Queries
useBankingOverview()                  // Overview metrics
useBankingDashboard()                 // Dashboard data

// Transaction Queries
useBankingTransactions(params)        // All transactions
useAccountTransactions(id, params)    // Account transactions

// Analytics Queries
useTopSpendingCategories(params)      // Top categories
useMonthlySpendingTrend(params)       // Monthly trend

// Mutations (with optimistic updates)
useConnectBankAccount()               // Connect account
useUpdateBankAccount()                // Update account
useDisconnectBankAccount()            // Disconnect account
useSyncBankAccount()                  // Sync account
```

#### Auth Data (`lib/queries/use-auth-data.ts`)
```typescript
useCurrentUser()                      // Current user
useCurrentSession()                   // Current session
useUserProfile()                      // Extended profile
useUpdateUserProfile()                // Update profile
```

### UI Stores

#### Crypto UI Store (`lib/stores/crypto-ui-store.ts`)
```typescript
import { useCryptoUIStore } from '@/lib/stores/ui-stores';

// Selection
selectWallet(id)
selectedWalletId

// Filters
filters: { networks, walletTypes, transactionTypes, dateRange, searchQuery }
setNetworkFilter(networks)
setDateRangeFilter(from, to)
clearFilters()

// View Preferences (persisted)
viewPreferences: { walletsView, portfolioChartType, portfolioTimeRange, ... }
setWalletsView('grid' | 'list')
setPortfolioTimeRange('24h' | '7d' | '30d')

// Modals
isCreateWalletModalOpen
openCreateWalletModal()
closeCreateWalletModal()
```

#### Banking UI Store (`lib/stores/banking-ui-store.ts`)
```typescript
import { useBankingUIStore } from '@/lib/stores/ui-stores';

// Selection
selectAccount(id)
selectedAccountId

// Filters
filters: { accountTypes, institutions, categories, dateRange, amountRange }
setAccountTypeFilter(types)
setDateRangeFilter(from, to)

// View Preferences (persisted)
viewPreferences: { accountsView, transactionsView, chartType, timeRange }
setAccountsView('grid' | 'list' | 'grouped')
setTimeRange('week' | 'month' | 'quarter')

// Modals & Bulk Operations
isConnectAccountModalOpen
toggleBulkSelectMode()
selectedTransactionIds
```

### Authentication
- **Better Auth** for authentication management
- **auth-store.ts** for session management (Zustand)
- **use-auth-data.ts** for user profile queries (TanStack Query)
- Session management with automatic timeout and refresh

### Data & API
- **Custom API client** (`lib/api-client.ts`) with error handling
- **Zerion SDK** for cryptocurrency data integration
- **Server-Sent Events (SSE)** for real-time updates
- Persistent caching via TanStack Query

### UI Components
- **Radix UI** components for accessible primitives
- **Shadcn/ui** inspired custom components
- **Recharts** for data visualization
- **Lucide React** for icons

## Project Structure

### App Directory (Next.js 15 App Router)
- `app/` - Page routes with React Server Components
- `app/dashboard/` - Main dashboard area
  - `accounts/` - Account management (banks, exchanges, wallets)
  - `crypto/` - Cryptocurrency portfolio management
  - `settings/` - User preferences and configuration
- `app/auth/` - Authentication pages (login, signup, verification)
- `app/onboarding/` - User onboarding flow

### Core Components
- `components/providers/` - Global providers (Theme, Query, Store, Auth, etc.)
- `components/layout/` - Layout components (header, docks, sidebar)
- `components/crypto/` - Cryptocurrency-specific components
- `components/ui/` - Reusable UI components (forms, tables, charts)
- `components/auth/` - Authentication-related components

### Libraries & Utilities
- `lib/stores/` - Zustand UI stores (crypto-ui, banking-ui, auth)
- `lib/queries/` - TanStack Query hooks (use-crypto-data, use-banking-data, use-auth-data)
- `lib/services/` - API services (crypto-api, banking-api, currency-api)
- `lib/hooks/` - Custom React hooks (non-data hooks only)
- `lib/contexts/` - React contexts (currency, view mode, loading)
- `lib/types/` - TypeScript type definitions

### Data Flow Architecture ⭐

```
COMPONENT
   ↓ (1) Use query hook
lib/queries/use-crypto-data.ts
   ↓ (2) TanStack Query calls
lib/queries/crypto-queries.ts (query factory)
   ↓ (3) Calls API service
lib/services/crypto-api.ts
   ↓ (4) Uses centralized client
lib/api-client.ts
   ↓ (5) HTTP request
BACKEND API
   ↓ (6) Response
TanStack Query Cache
   ↓ (7) Automatic re-render
COMPONENT (updated data)
```

**Key Principles:**
1. Components ONLY use hooks from `lib/queries/`
2. NO direct API calls in components
3. NO useEffect for data fetching
4. TanStack Query handles caching, loading, errors automatically
5. Mutations include optimistic updates
6. Cache invalidation happens automatically

## Key Features

### Authentication System
- Complete auth flow with email/password
- Session management with automatic timeout
- Role-based access control
- Persistent user preferences

### Cryptocurrency Integration
- Multi-chain wallet tracking via Zerion SDK
- Real-time price data and portfolio valuation
- Transaction history and NFT tracking
- DeFi position monitoring
- Background sync with progress tracking

### Account Management
- Multiple account types (banks, exchanges, wallets)
- Account grouping and categorization
- Bulk operations and import/export
- Transaction categorization

### UI/UX Features
- Responsive design with mobile support
- Theme switching (light/dark modes)
- Global docks for quick access
- Loading states and error handling
- Real-time sync indicators

## Development Guidelines

### Component Patterns ⭐
```typescript
// ✅ CORRECT: Production-grade component pattern
import { useCryptoWallets } from '@/lib/queries';
import { useCryptoUIStore } from '@/lib/stores/ui-stores';

export function WalletList() {
  // 1. Server data from TanStack Query
  const { data: wallets, isLoading, error } = useCryptoWallets();

  // 2. UI state from Zustand
  const { filters, viewPreferences, selectWallet } = useCryptoUIStore();

  // 3. Mutations (if needed)
  const { mutate: deleteWallet } = useDeleteCryptoWallet();

  // 4. Derived/computed state (useMemo if expensive)
  const filteredWallets = wallets?.filter(w =>
    !filters.networks.length || filters.networks.includes(w.network)
  );

  // 5. Event handlers (useCallback if passed to children)
  const handleWalletClick = (id: string) => {
    selectWallet(id);
  };

  // 6. Conditional rendering
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!wallets?.length) return <EmptyState />;

  // 7. Main render
  return (
    <div>
      {filteredWallets.map(wallet => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          onClick={() => handleWalletClick(wallet.id)}
        />
      ))}
    </div>
  );
}
```

### State Management Rules ⭐

1. **Server Data (TanStack Query)**
   - ✅ Use: `lib/queries/use-*-data.ts` hooks
   - ✅ Automatic: caching, loading, error, refetching
   - ✅ Optimistic updates built-in
   - ❌ Never: store in Zustand, use useEffect

2. **UI State (Zustand)**
   - ✅ Use: `lib/stores/*-ui-store.ts`
   - ✅ Examples: filters, preferences, modals, selections
   - ❌ Never: server data, API responses

3. **NO useEffect for Data Fetching**
   - ✅ TanStack Query handles fetching automatically
   - ✅ Use `enabled` flag to control when queries run
   - ❌ Never: `useEffect(() => { fetchData(); }, [])`

### Styling
- Use Tailwind CSS classes
- Follow the established design system
- Use the custom theme provider for consistent theming
- Implement responsive design patterns

### Modal & Dialog Design Standards ⭐

**Modern, Compact, Functional Design Pattern**

All modals, dialogs, and setting panels follow this design standard:

```typescript
// ✅ CORRECT: Modern modal design pattern
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-5">

    {/* Header: Icon badge + Title + Description */}
    <DialogHeader className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Settings2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription className="text-xs mt-1">
            Concise description
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    {/* Content Area: Clean, compact spacing */}
    <div className="space-y-5">
      {/* Items/Cards without borders - use subtle background colors */}
      <div
        className={cn(
          'flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer',
          isActive ? 'bg-primary/5 hover:bg-primary/8' : 'bg-muted/40 hover:bg-muted/50'
        )}
      >
        <span className="text-sm font-medium">Item Label</span>
        <Switch checked={isActive} onCheckedChange={handleToggle} />
      </div>

      {/* Nested/Expanded sections: subtle background, no borders */}
      {isExpanded && (
        <div className="ml-3 p-3 bg-muted/30 rounded-lg space-y-2">
          <p className="text-xs font-medium text-foreground">Subsection</p>
          {/* Content with icon-based buttons for better UX */}
        </div>
      )}
    </div>

    {/* Footer: Minimal, clean actions */}
    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
      <Button variant="outline" size="sm">Action</Button>
      <Button size="sm">Primary</Button>
    </div>
  </DialogContent>
</Dialog>
```

**Design Principles:**
1. **No Border Colors** - Use `bg-primary/5`, `bg-muted/40` instead of `border-primary/30`
2. **Icon Badges in Headers** - `h-8 w-8 rounded-lg bg-primary/10` with icon inside
3. **Compact Layout** - `p-3` to `p-5` padding, `space-y-2` to `space-y-5` gaps
4. **Semantic Icons** - Use icons for size selection (Square, Maximize, Maximize2, Minimize)
5. **Subtle Hover States** - Use opacity changes: `hover:bg-primary/8` instead of border changes
6. **Clean Typography** - Clear hierarchy with font weights and sizes
7. **No Unnecessary Elements** - Remove separators unless truly needed
8. **Theme-Based Colors** - Use `primary/10`, `muted/40` etc. instead of hardcoded colors

**Benefits:**
- ✅ Modern, professional appearance
- ✅ Better visual hierarchy
- ✅ Consistent across app
- ✅ Responsive and compact
- ✅ Accessible with clear focus states
- ✅ Easy to maintain and extend

### API Integration ⭐

**NEVER call API services directly from components**

```typescript
// ❌ WRONG
import { cryptoApi } from '@/lib/services/crypto-api';

function Component() {
  useEffect(() => {
    cryptoApi.getWallets().then(setWallets); // ❌ NEVER DO THIS
  }, []);
}

// ✅ CORRECT
import { useCryptoWallets } from '@/lib/queries';

function Component() {
  const { data: wallets } = useCryptoWallets(); // ✅ Always use query hooks
}
```

## Performance Optimizations

### Built-in with TanStack Query
- **Automatic caching**: Data cached with configurable `staleTime`
- **Request deduplication**: Same queries merge into single request
- **Background refetching**: Updates data without blocking UI
- **Optimistic updates**: Instant UI feedback on mutations
- **Prefetching**: Preload data before navigation

### Best Practices
1. Use appropriate `staleTime` (already configured in query factories)
2. Use `enabled` flag to prevent unnecessary requests
3. Leverage optimistic updates for instant feedback
4. Use query prefetching for predictable navigation
5. Avoid unnecessary re-renders with proper selectors

## Environment Configuration

The application requires proper environment setup:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint
- Better Auth configuration
- Zerion SDK API keys

## Important Notes

- The app uses React Server Components by default
- Authentication is handled through Better Auth with custom state management
- Cryptocurrency data is fetched via Zerion SDK with custom caching
- The UI uses a combination of Radix UI primitives and custom components
- Real-time features are implemented using Server-Sent Events
- **ALL components must follow the TanStack Query + Zustand UI pattern**
- **NEVER use useEffect for data fetching**
- **NEVER store server data in Zustand**
- **This is in windows so when Updating and writing files use actual windows file paths to avoid errors**
