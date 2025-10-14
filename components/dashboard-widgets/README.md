# Dashboard Widgets

This directory contains reusable dashboard widgets for the MoneyMappr application.

## Available Widgets

### 1. NetWorthWidget

A comprehensive net worth overview widget that displays:
- Total net worth across all accounts
- Grouped account balances (by institution for banking, by type for crypto)
- Expandable/collapsible groups
- Individual account balances with proper currency formatting

**Features:**
- Real-time data from banking and crypto stores
- Responsive design with clean, modern UI
- Loading states with skeleton UI
- Empty state handling
- Production-ready with no mock data dependencies

**Usage:**
```tsx
import { NetWorthWidget } from '@/components/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <NetWorthWidget />
    </div>
  );
}
```

**Data Sources:**
- Banking: `useBankingGroupedAccountsRaw()` from `@/lib/queries/banking-queries`
- Crypto: `useCryptoStore()` from `@/lib/stores/crypto-store`

**Styling:**
- Uses Tailwind CSS utility classes
- Follows the project's design system
- Fully responsive (mobile, tablet, desktop)
- Clean, minimal color palette

---

### 2. CryptoAllocationWidget

A compact, production-ready token allocation widget that displays your top crypto holdings:
- Top 6 cryptocurrency tokens by value
- Token logos with fallback icons
- Dollar value for each token
- 24-hour price change indicators (up/down arrows)
- Color-coded cards with pastel backgrounds
- Responsive grid layout with larger card for top asset

**Features:**
- Real-time data from crypto portfolio
- Token logos using Next.js Image optimization
- Fallback coin icon when logo unavailable
- Compact, space-efficient design
- Beautiful pastel color scheme with dark mode support
- Trend indicators with micro-icons
- Fast loading states with minimal skeleton UI
- Empty state handling
- No slow animations - instant, snappy interactions

**Usage:**
```tsx
import { CryptoAllocationWidget } from '@/components/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <CryptoAllocationWidget />
    </div>
  );
}
```

**Data Sources:**
- Crypto Portfolio: `useCryptoStore()` from `@/lib/stores/crypto-store`
- Uses `portfolio.topAssets` for token data
- Data is automatically synced via `PortfolioSyncProvider` in root providers

**Styling:**
- 8 pastel color options with dark mode variants (bg-orange-100, bg-purple-100, etc.)
- Automatic color rotation for visual variety
- Compact 2-column grid layout with 2px gaps
- First token: 140px height (row-span-2), larger text
- Other tokens: 68px height, compact text
- Reduced padding (p-3) for space efficiency
- Smaller text sizes (xs/sm/base) for density
- Token logos (16x16px) with fallback Coins icon
- No animations - instant, snappy interactions

**Technical Details:**
- Uses Next.js Image component for logo optimization
- Supports multiple CDN sources (Zerion, Zapper, AWS S3)
- Rounded logo display with proper alt text
- Fallback icon when logoUrl unavailable
- Optimized dark mode with 40% opacity backgrounds

---

### 3. NetworkDistributionWidget

A unique card-based network distribution widget showing crypto portfolio breakdown by blockchain:
- Top 6 networks by percentage
- Network logos from Zerion chains
- Color-coded cards matching network identity
- Asset count and percentage display
- Dollar value for each network
- Card-based layout similar to token allocation

**Features:**
- Real-time data from crypto portfolio
- Zerion chain logos with fallback Network icon
- 9 predefined network colors (Ethereum, BSC, Polygon, etc.)
- Card-based grid layout (2 columns)
- First network gets larger card (row-span-2)
- Asset count displayed in top-right
- Loading states with skeleton UI matching layout
- Empty state handling
- Compact, space-efficient design

**Usage:**
```tsx
import { NetworkDistributionWidget } from '@/components/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <NetworkDistributionWidget />
    </div>
  );
}
```

**Data Sources:**
- Crypto Portfolio: `useCryptoStore()` from `@/lib/stores/crypto-store`
- Chain Icons: `ZERION_CHAINS` from `@/lib/constants/chains`
- Uses `portfolio.networkDistribution` for network data
- Data is automatically synced via `PortfolioSyncProvider` in root providers

**Styling:**
- Pastel backgrounds matching network: Ethereum (blue-100), BSC (yellow-100), etc.
- Network-specific colors with dark mode variants (40% opacity)
- Compact 2-column grid layout with 2px gaps
- First network: 140px height (row-span-2), larger text
- Other networks: 68px height, compact text
- 16x16px network logos with fallback icon
- Reduced padding (p-3) for space efficiency
- Percentage and value display in bottom section

**Network Colors:**
- Ethereum: Blue (bg-blue-100)
- BSC: Yellow (bg-yellow-100)
- Polygon: Purple (bg-purple-100)
- Avalanche: Red (bg-red-100)
- Arbitrum: Cyan (bg-cyan-100)
- Optimism: Pink (bg-pink-100)
- Base: Indigo (bg-indigo-100)
- Solana: Emerald (bg-emerald-100)
- Bitcoin: Orange (bg-orange-100)

---

### 4. SpendingCategoriesWidget

A card-based spending categories widget showing expense breakdown:
- Top 6 spending categories from banking analytics
- Category-specific icons (Shopping, Dining, Transport, etc.)
- Color-coded cards with pastel backgrounds
- Dollar amount and percentage for each category
- Sorted by spending amount (highest first)
- Card-based layout matching other widgets

**Features:**
- Real-time data from high-performance analytics API
- Category icons from Lucide (ShoppingBag, Utensils, Car, Home, etc.)
- Pre-calculated spending data from materialized view
- Card-based grid layout (2 columns)
- First category gets larger card (row-span-2)
- Loading states with skeleton UI matching layout
- Empty state handling
- Compact, space-efficient design

**Usage:**
```tsx
import { SpendingCategoriesWidget } from '@/components/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <SpendingCategoriesWidget />
    </div>
  );
}
```

**Data Sources:**
- Analytics API: `useTopSpendingCategories()` from `@/lib/queries/banking-queries`
- Data synced to `useBankingStore()` from `@/lib/stores/banking-store`
- Uses materialized view `spending_by_category` for high performance (~5ms queries)

**Styling:**
- 6 pastel color options rotating (rose, blue, green, purple, orange, teal)
- Dark mode variants with 40% opacity backgrounds
- Compact 2-column grid layout with 2px gaps
- First category: 140px height (row-span-2), larger text
- Other categories: 68px height, compact text
- Category icons (16x16px) with foreground/70 opacity
- Reduced padding (p-3) for space efficiency
- Percentage and amount display in bottom section

**Category Icons:**
- Groceries/Shopping: ShoppingBag
- Dining/Entertainment: Utensils
- Transport/Fuel: Car
- Home/Health: Home
- Utilities: Zap
- General: Wallet

---

### 5. MonthlySpendingTrendWidget

A comprehensive monthly spending trend widget with visual insights:
- Spending trends over the last 6 months
- Month-over-month comparison with percentage change
- Mini bar chart showing spending by month
- Income vs spending breakdown
- Net amount calculation (savings)
- Trend indicators (up/down arrows)

**Features:**
- Real-time data from analytics API
- Month-over-month growth indicators
- Visual bar chart with gradient colors
- Current month summary with comparison
- Income and net amount display
- Loading states with skeleton UI
- Empty state handling
- Compact, space-efficient design

**Usage:**
```tsx
import { MonthlySpendingTrendWidget } from '@/components/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <MonthlySpendingTrendWidget />
    </div>
  );
}
```

**Data Sources:**
- Analytics API: `useMonthlySpendingTrendNew()` from `@/lib/queries/banking-queries`
- Uses materialized view `spending_by_category` for high performance
- Fetches last 6 months of data automatically

**Styling:**
- Gradient progress bars (blue-purple)
- Trend indicators with colors (red for increase, green for decrease)
- Compact text sizes (xs/sm/2xl) for density
- Border separator for summary section
- Responsive grid for income/net display

**Key Features:**
- Shows spending change percentage vs previous month
- Visual bar chart with relative widths
- Income, spending, and net amount summary
- Color-coded trend indicators
- Sorted by month (oldest to newest)

---

### 6. AccountSpendingComparisonWidget

A detailed account spending comparison widget showing spending across bank accounts:
- Top 4 accounts by spending amount
- Spending bars with gradient colors
- Transaction count for each account
- Top spending category per account
- Net amount (income - spending)
- Total spending summary

**Features:**
- Real-time data from analytics API
- Account names from grouped accounts data
- Visual spending bars with unique gradients
- Top category display for each account
- Net amount calculation
- Loading states with skeleton UI
- Empty state handling
- Hover effects for interactivity

**Usage:**
```tsx
import { AccountSpendingComparisonWidget } from '@/components/dashboard-widgets';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <AccountSpendingComparisonWidget />
    </div>
  );
}
```

**Data Sources:**
- Analytics API: `useAccountSpendingComparison()` from `@/lib/queries/banking-queries`
- Account names: `useBankingGroupedAccountsRaw()` from `@/lib/queries/banking-queries`
- Uses materialized view `spending_by_category` for high performance

**Styling:**
- Unique gradient colors for each account (orange-red, blue-purple, green-emerald, pink-rose)
- Muted background with hover effect (muted/30 → muted/50)
- Compact card layout with padding (p-2.5)
- Icons for accounts (CreditCard) and metrics (Building2, TrendingUp)
- Color-coded net amounts (green for saved, red for spent)

**Key Features:**
- Sorted by spending amount (highest first)
- Shows top spending category per account
- Net amount display with savings/spending indicator
- Transaction count display
- Relative spending bars
- Total spending summary footer

---

## Data Sync Architecture

### PortfolioSyncProvider (Crypto Data)

All crypto widgets use data from the Zustand store, which is automatically populated by the `PortfolioSyncProvider`:

```tsx
// In components/providers/providers.tsx
<StoreProvider>
  <PortfolioSyncProvider>
    {/* Portfolio data is fetched once and synced to store */}
    {children}
  </PortfolioSyncProvider>
</StoreProvider>
```

**How it works:**
1. `PortfolioSyncProvider` calls `usePortfolio()` hook at the root level
2. The hook fetches data via React Query
3. Data is automatically synced to `useCryptoStore()`
4. Widgets read from the store directly - no refetching needed!

**Benefits:**
- ✅ Data fetched once globally
- ✅ Widgets access cached data from store
- ✅ No redundant API calls
- ✅ Consistent data across all widgets
- ✅ Automatic updates when portfolio changes

### BankingSyncProvider (Banking Data)

All banking widgets use data from the Zustand store, which is automatically populated by the `BankingSyncProvider`:

```tsx
// In components/providers/providers.tsx
<StoreProvider>
  <PortfolioSyncProvider>
    <BankingSyncProvider>
      {/* Transaction and analytics data fetched once and synced to store */}
      {children}
    </BankingSyncProvider>
  </PortfolioSyncProvider>
</StoreProvider>
```

**How it works:**
1. `BankingSyncProvider` calls data hooks at the root level:
   - `useBankingTransactions()` - fetches all transactions
   - `useTopSpendingCategories({ limit: 6 })` - fetches top 6 spending categories
2. The hooks fetch data via React Query from high-performance analytics endpoints
3. Data is automatically synced to `useBankingStore()`
4. Widgets read from the store directly - no refetching needed!

**Analytics Integration:**
- Uses materialized view `spending_by_category` for ~100x faster queries
- Pre-aggregated spending data by category, month, and account
- Queries return in ~5ms vs ~500ms for raw transaction queries
- Automatic materialized view refresh on transaction updates

**Benefits:**
- ✅ Data fetched once globally
- ✅ Widgets access cached data from store
- ✅ No redundant API calls
- ✅ Consistent data across all widgets
- ✅ Automatic updates when transactions change
- ✅ High-performance queries via materialized views

## Design Principles

All widgets in this directory follow these principles:

1. **Production-Ready**: No mock data, fully functional with real APIs
2. **Responsive**: Works seamlessly across all device sizes
3. **Clean Design**: Modern, minimal UI following SaaS best practices
4. **Performance**: Optimized with proper memoization and loading states
5. **Reusable**: Can be easily imported and used anywhere in the app
6. **Type-Safe**: Full TypeScript support with proper type definitions

## Adding New Widgets

When creating new widgets:

1. Create a new file in this directory (e.g., `my-widget.tsx`)
2. Use the 'use client' directive for client components
3. Implement proper loading and error states
4. Follow the existing naming conventions
5. Export the widget in `index.ts`
6. Document the widget in this README

## Page Usage

The widgets page is available at `/dashboard/widgets` and showcases all available widgets.
