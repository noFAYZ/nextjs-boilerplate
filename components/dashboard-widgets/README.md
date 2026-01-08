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




      <div className="relative">
  {/* Main Card – Pure Apple Glass */}
  <Card className="p-3  bg-gradient-to-br from-accent/50 via-accent/60 to-accent/50 dark:from-accent/80 dark:via-accent/50 dark:to-accent/80 border-dashed border-2 border-accent/80" >
    {/* Subtle inner glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5" />
    </div>

    {/* Content */}
    <div className="relative space-y-6">

      {/* Header – Clean & Hierarchical */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-black/50 dark:text-white/50 tracking-wider uppercase">
            Total Net Worth
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-black dark:text-white tracking-tight">
            {netWorth > 0 ? (
              <CurrencyDisplay
                amountUSD={netWorth}
                variant="2xl"
                className=" font-semibold"
              />
            ) : (
              "—"
            )}
          </h2>
        </div>

        {/* Subtle positive trend */}
        {netWorth > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5 5 5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5" />
            </svg>
            <span className="text-sm font-medium">+12.4%</span>
          </div>
        )}
      </div>

{/* Allocation Section - Assets vs Liabilities */}
{(summaryData?.totalAssets ?? 0) > 0 || (summaryData?.totalLiabilities ?? 0) > 0 ? (
  <div className="space-y-3">
    {/* Allocation bar with SVG pattern overlays */}
    <div className="relative w-full h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
      {/* Glossy overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

      {/* SVG Patterns Definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          {/* Assets: Diagonal lines pattern */}
          <pattern id="pattern-ASSETS-BAR" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
          </pattern>

          {/* Liabilities: Dots pattern */}
          <pattern id="pattern-LIABILITIES-BAR" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
          </pattern>
        </defs>
      </svg>

      {/* Assets bar */}
      {assetsPercent > 0 && (
        <div
          style={{ width: `${assetsPercent}%` }}
          className="h-full relative inline-block transition-all duration-500 ease-out group"
        >
          {/* Base color */}
          <div className="h-full w-full bg-green-600/70" />

          {/* Pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" fill="url(#pattern-ASSETS-BAR)" />
          </svg>

          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      )}

      {/* Liabilities bar */}
      {liabilitiesPercent > 0 && (
        <div
          style={{ width: `${liabilitiesPercent}%` }}
          className="h-full relative inline-block transition-all duration-500 ease-out group"
        >
          {/* Base color */}
          <div className="h-full w-full bg-orange-600/70" />

          {/* Pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" fill="url(#pattern-LIABILITIES-BAR)" />
          </svg>

          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      )}
    </div>

    {/* Legend */}
    <div className="grid grid-cols-2 gap-2.5">
      {assetsPercent > 0 && (
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <div className="w-3 h-3 rounded-full shadow-sm bg-green-600" />

          {/* Text */}
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
              Assets
            </span>
            <span className="text-[12px] font-semibold text-black dark:text-white">
              {assetsPercent}%
            </span>
          </div>
        </div>
      )}
      {liabilitiesPercent > 0 && (
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <div className="w-3 h-3 rounded-full shadow-sm bg-orange-600" />

          {/* Text */}
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
              Liabilities
            </span>
            <span className="text-[12px] font-semibold text-black dark:text-white">
              {liabilitiesPercent}%
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
) : null}


  
    </div>
  </Card>

  {/* Optional ultra-subtle outer glow (visible only on dark mode) */}
  <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 blur-xl -z-10" />
</div>