# PortfolioChart Component - Usage Guide

A flexible, reusable chart component for displaying portfolio and wallet data with support for both area and breakdown visualization modes.

## Features

- **Dual Chart Types**: Area chart (performance) and Breakdown chart (stacked bars with net worth line)
- **Data Fetching**: Automatic data fetching from wallet address or direct data input
- **Responsive Design**: Compact mode for headers and full mode for pages
- **Time Period Selection**: 7 time periods (1D, 7D, 1M, 3M, 6M, 1Y, ALL)
- **Performance Metrics**: Automatic calculation of change % and trend indicators
- **Configurable**: Enable/disable area, breakdown, metrics, period filters
- **Type Safe**: Full TypeScript support with proper interfaces

## Props

```typescript
interface PortfolioChartProps {
  // Display mode
  mode?: 'compact' | 'full';              // default: 'full'

  // Data
  data?: ChartDataPoint[];                // Direct data (if not fetching)
  walletAddress?: string;                 // Wallet address for auto-fetching

  // Chart configuration
  initialChartType?: 'area' | 'breakdown'; // default: 'area'
  enableArea?: boolean;                   // default: true
  enableBreakdown?: boolean;              // default: true

  // UI controls
  height?: number;                        // default: 300
  showPeriodFilter?: boolean;             // default: true
  showMetrics?: boolean;                  // default: true

  // Period management
  selectedPeriod?: TimePeriod;            // '1D' | '7D' | '1M' | '3M' | '6M' | '1Y' | 'ALL'
  onPeriodChange?: (period: TimePeriod) => void;

  // State
  externalIsLoading?: boolean;            // default: false

  // Styling
  className?: string;
  chartColor?: string;                    // default: '#00A632'

  // Data keys (if using custom data format)
  valueKey?: string;                      // default: 'value'
  assetsKey?: string;                     // default: 'totalAssets'
  liabilitiesKey?: string;                // default: 'totalLiabilities'
  netWorthKey?: string;                   // default: 'totalNetWorth'
}
```

## Usage Examples

### Compact Mode (Header - Auto Fetching)
```tsx
import { PortfolioChart } from '@/components/charts/portfolio-chart';

// In wallet details header
<PortfolioChart
  walletAddress={wallet?.walletData?.address}
  mode="compact"
  height={80}
  showPeriodFilter={true}
  enableArea={true}
  enableBreakdown={false}
  className="w-full"
/>
```

### Full Mode (Page - Direct Data)
```tsx
import { PortfolioChart } from '@/components/charts/portfolio-chart';

const chartData = [
  {
    date: '2024-01-01',
    value: 100000,
    totalAssets: 150000,
    totalLiabilities: 50000,
    totalNetWorth: 100000,
    formattedDate: 'Jan 1',
  },
  // ... more data
];

<PortfolioChart
  mode="full"
  data={chartData}
  height={400}
  showMetrics={true}
  enableArea={true}
  enableBreakdown={true}
/>
```

### With Period Change Callback
```tsx
<PortfolioChart
  walletAddress={address}
  mode="compact"
  height={80}
  selectedPeriod="7D"
  onPeriodChange={(period) => {
    console.log('Period changed to:', period);
  }}
/>
```

### Custom Data Keys
```tsx
<PortfolioChart
  data={customData}
  mode="full"
  valueKey="customValue"
  assetsKey="customAssets"
  liabilitiesKey="customLiabilities"
  netWorthKey="customNetWorth"
/>
```

## Data Format

### Standard Format (for auto-fetching from wallet)
```typescript
interface ChartDataPoint {
  timestamp?: number;
  date?: string;
  value?: number;
  totalNetWorth?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  formattedDate?: string;
}
```

### Expected from Zerion API
The component automatically transforms data from `zerionChartService.getPortfolioTimeline()`:
- Adds `formattedDate` in "Mon DD" format
- Maintains original `value` field for area chart

## Modes

### Compact Mode
- Used in headers (like AccountHeader)
- Shows minimal controls
- Period filter shows only 4 options (1D, 7D, 1M, 1Y)
- Shows performance indicator (% change with trend icon)
- Best for limited space

### Full Mode
- Used in full-page views
- Shows all period options
- Chart type toggle (if both enabled)
- Full metrics display
- Better for detailed analysis

## Chart Types

### Area Chart
- Line chart with gradient fill
- Shows performance over time
- Single value line
- Good for trend visualization

### Breakdown Chart
- Stacked bar chart (Assets on top, Liabilities below)
- Net Worth overlay as dashed line
- Shows composition over time
- Good for understanding asset allocation

## Integration with Wallet Details

The wallet details page header has been updated to use PortfolioChart:

```tsx
// OLD (WalletChart)
<WalletChart
  walletAddress={wallet?.walletData?.address}
  className="w-full"
  height={80}
  compact={true}
/>

// NEW (PortfolioChart)
<PortfolioChart
  walletAddress={wallet?.walletData?.address}
  mode="compact"
  height={80}
  showPeriodFilter={true}
  enableArea={true}
  enableBreakdown={false}
  className="w-full"
/>
```

## Performance Optimizations

- Memoized period calculations
- Optimized metrics calculation
- Lazy data transformation
- Custom tooltip for minimal re-renders
- Responsive container for proper sizing

## Type Safety

All exports are TypeScript-first:
```tsx
import {
  PortfolioChart,
  PortfolioChartMode,
  ChartType,
  TimePeriod,
  BreakdownPeriod,
} from '@/components/charts/portfolio-chart';
```

## Files

- **Component**: `components/charts/portfolio-chart.tsx`
- **Usage**: Wallet details header (`app/(protected)/accounts/wallet/[wallet]/page.tsx`)
- **Documentation**: This file
