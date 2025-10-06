# Dashboard Widgets

This directory contains reusable dashboard widgets for the MoneyMappr application.

## Available Widgets

### NetWorthWidget

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
