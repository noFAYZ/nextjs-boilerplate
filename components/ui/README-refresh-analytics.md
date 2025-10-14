# Refresh Analytics Button

A reusable button component for refreshing banking analytics data on the widgets page.

## Overview

The `RefreshAnalyticsButton` component triggers a manual refresh of the `spending_by_category` materialized view and invalidates all related analytics queries, causing widgets to refetch data with the latest information.

## Features

- **Automatic Query Invalidation**: Invalidates all analytics-related React Query caches
- **Loading States**: Shows spinner animation during refresh
- **Success Animation**: Brief animation on successful completion
- **Error Handling**: Gracefully handles failures with console logging
- **Customizable**: Supports various button variants, sizes, and styles
- **Optional Text**: Can show/hide button text

## API Integration

The component uses the following endpoint:
- **Endpoint**: `POST /api/v1/banking/analytics/refresh`
- **Response Time**: Typically 1-5 seconds
- **Side Effects**: Refreshes materialized view using PostgreSQL `REFRESH MATERIALIZED VIEW CONCURRENTLY`

## Usage

### Basic Usage

```tsx
import { RefreshAnalyticsButton } from '@/components/ui/refresh-analytics-button';

export function MyWidget() {
  return (
    <div>
      <RefreshAnalyticsButton />
    </div>
  );
}
```

### With Text Label

```tsx
<RefreshAnalyticsButton showText />
```

### Custom Styling

```tsx
<RefreshAnalyticsButton
  variant="outline"
  size="lg"
  className="mt-4"
  showText
/>
```

### With Callback

```tsx
<RefreshAnalyticsButton
  showText
  onRefreshComplete={() => {
    console.log('Analytics refreshed!');
    // Custom logic here
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'ghost' \| 'link' \| 'destructive' \| 'secondary'` | `'ghost'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'sm'` | Button size |
| `className` | `string` | `undefined` | Additional CSS classes |
| `showText` | `boolean` | `false` | Show "Refresh" text label |
| `onRefreshComplete` | `() => void` | `undefined` | Callback after successful refresh |

## Integration in Widgets Page

The button is integrated in the widgets page header:

```tsx
// app/dashboard/widgets/page.tsx
'use client';

import { RefreshAnalyticsButton } from '@/components/ui/refresh-analytics-button';

export default function WidgetsPage() {
  return (
    <div className="mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1>Dashboard Widgets</h1>
          <p>View your financial overview</p>
        </div>
        <RefreshAnalyticsButton showText />
      </div>
      {/* Widgets... */}
    </div>
  );
}
```

## Mutation Hook

The component uses the `useRefreshAnalytics` mutation from `banking-queries.ts`:

```tsx
import { bankingMutations } from '@/lib/queries/banking-queries';

export function MyCustomComponent() {
  const refreshMutation = bankingMutations.useRefreshAnalytics();

  const handleRefresh = () => {
    refreshMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('Refreshed successfully');
      },
    });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

## Affected Widgets

When the button is clicked, the following widgets will automatically refetch data:

- **Spending Categories Widget**: Shows top spending categories
- **Monthly Spending Trend Widget**: Displays spending trends over time
- **Account Spending Comparison Widget**: Compares spending across accounts
- All other widgets using analytics endpoints

## When to Use

Use this button when:
- After bulk importing transactions
- After manual transaction edits
- When you suspect stale data
- After connecting new bank accounts
- When debugging analytics data

## Performance Notes

- Materialized view refresh runs with `CONCURRENTLY` to avoid locking
- Typical refresh time: 1-5 seconds depending on data volume
- All analytics queries use the materialized view for ~100x faster queries
- Button automatically handles loading states and prevents double-clicks

## Related Documentation

- [Spending Analytics API Documentation](../../../SPENDING_ANALYTICS_API.md)
- [Banking Queries](../../lib/queries/banking-queries.ts)
- [Banking API Service](../../lib/services/banking-api.ts)
