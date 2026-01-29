# Charts System Documentation

## Overview

Enterprise-grade custom charting system for MoneyMappr built with React, TypeScript, and modern design principles. All components are production-ready with comprehensive error handling, accessibility compliance (WCAG 2.1 AA), and performance optimization.

## Current Components

### 1. NetWorthPerformanceChart

A minimalist area chart showing net worth performance over time with period selection, metrics, and clean YNAB-inspired design.

#### Design Philosophy

- **Minimal & Clean**: Simple area chart with gradient fill
- **YNAB-Inspired**: Focus on the trend, not the noise
- **Theme-Aware**: Uses app's primary chart color (--chart-1)
- **Metrics First**: Shows key performance indicators upfront
- **Responsive**: Works on all screen sizes

#### Features

✅ **Time Period Selection**
- 1 Week, 1 Month, 3 Months, 6 Months, YTD, 1 Year, All Time
- Automatic data aggregation
- Smooth transitions between periods

✅ **Performance Metrics**
- Current net worth (large, prominent display)
- Change amount and percentage
- Trend indicator (up/down with color)
- Date range display

✅ **Interactive Chart**
- Smooth area chart with gradient
- Average reference line
- Interactive tooltip with full details
- Hover effects
- Responsive axes

✅ **States**
- Loading skeleton
- Error handling with retry
- Empty state with messaging
- Demo data with realistic growth

#### Usage

**Basic**
```tsx
import { NetWorthPerformanceChart } from '@/components/charts';

<NetWorthPerformanceChart defaultPeriod="1m" />
```

**With Callbacks**
```tsx
<NetWorthPerformanceChart
  defaultPeriod="3m"
  showMetrics={true}
  showPeriodFilter={true}
  onPeriodChange={(period) => {
    console.log(`Period changed to: ${period}`);
  }}
/>
```

#### Props

```typescript
interface NetWorthPerformanceChartProps {
  className?: string;                      // Additional CSS classes
  height?: number;                         // Chart height (250-1000px, default: 400)
  defaultPeriod?: TimePeriod;             // Initial period (default: '1m')
  showMetrics?: boolean;                  // Show performance metrics (default: true)
  showPeriodFilter?: boolean;             // Show period selector (default: true)
  onPeriodChange?: (period: TimePeriod) => void; // Period change callback
  mode?: 'demo' | 'live';                // Data source (default: 'demo')
}

type TimePeriod = '1w' | '1m' | '3m' | '6m' | 'ytd' | '1y' | 'all';
```

#### Demo Data

Realistic net worth progression:
- Base: $250,000
- Growth: 0.8% per period
- Volatility: ±3%
- Compound growth effect

---

### 2. NetWorthBreakdownChart

A YNAB-style asset breakdown chart displaying net worth by category with clean, minimal design inspired by modern fintech applications.

#### Design Philosophy

- **YNAB-Inspired**: Clean rows with inline percentage bars
- **Theme-Aware**: Uses app's CSS variables for colors (chart-1 through chart-5)
- **Minimal**: No unnecessary visual elements
- **Interactive**: Hover effects, category filtering, trend indicators
- **Responsive**: Works perfectly on all screen sizes

#### Visual Layout

```
Asset Breakdown
Total worth: $243,000

[Color dot] Cryptocurrency          $45k
[▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░] 18.5%
                                    +12.3%

[Color dot] Stocks & ETFs           $95k
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░] 39.1%
                                     +5.2%

[Color dot] Real Estate             $60k
[▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░] 24.7%
                                     +2.1%

...

Total Portfolio: $243,000

[Legend] Crypto  Stocks  Real Estate  Cash  Bonds
```

#### Features

✅ **Per-Category Rows**
- Category name with color indicator
- Compact currency amount (e.g., "$95k", "$1.5M")
- Allocation percentage (e.g., "39.1%")
- Trend indicator (e.g., "+12.3%")
- Smooth mini progress bar

✅ **Interactive Behavior**
- Hover highlights the category
- Click to toggle visibility
- Color bar brightens on hover
- Progress bar animates smoothly

✅ **Legend & Filtering**
- All categories visible in legend below
- Click to show/hide categories
- Filtered categories fade out
- Toggled state persists in UI

✅ **Data Handling**
- CSV export functionality
- Total portfolio summary
- Trend tracking (YoY)
- Error states and loading states
- Empty state messaging

#### Theme Colors

Uses app's native theme variables:

```
var(--chart-1)  // Primary: Orange/Terracotta
var(--chart-2)  // Teal/Cyan
var(--chart-3)  // Purple
var(--chart-4)  // Yellow/Gold
var(--chart-5)  // Magenta/Pink
```

Auto-responds to light/dark theme and respects user's system preferences.

#### Props Reference

```typescript
interface NetWorthBreakdownChartProps {
  // Styling
  className?: string;              // Additional CSS classes
  height?: number;                 // Wrapper height (min: 250, max: 1000, default: 400)
  compact?: boolean;               // Compact mode for widgets

  // Display
  showLegend?: boolean;            // Show category legend (default: true)
  showPercentages?: boolean;       // Show % on bars (default: true)
  showValues?: boolean;            // Show currency values (default: true)

  // Interactivity
  allowFiltering?: boolean;        // Enable category toggle (default: true)
  defaultVisibleCategories?: string[]; // Initially visible category IDs
  onCategoryToggle?: (categoryId: string, visible: boolean) => void; // Callback

  // Data
  mode?: 'demo' | 'live';         // Data source (default: 'demo')
}
```

#### Demo Data

Default demo categories with realistic values:

| Category | Value | % | Color |
|----------|-------|---|-------|
| Cryptocurrency | $45,000 | 18.5% | var(--chart-1) |
| Stocks & ETFs | $95,000 | 39.1% | var(--chart-2) |
| Real Estate | $60,000 | 24.7% | var(--chart-3) |
| Cash & Savings | $28,000 | 11.5% | var(--chart-4) |
| Bonds | $15,000 | 6.2% | var(--chart-5) |
| **Total** | **$243,000** | **100%** | — |

#### Usage Examples

**Basic Usage**
```tsx
import { NetWorthBreakdownChart } from '@/components/charts';

<NetWorthBreakdownChart
  showLegend={true}
  allowFiltering={true}
/>
```

**With Custom Visible Categories**
```tsx
<NetWorthBreakdownChart
  defaultVisibleCategories={['crypto', 'stocks']}
  onCategoryToggle={(id, visible) => {
    console.log(`${id}: ${visible ? 'shown' : 'hidden'}`);
  }}
/>
```

**Compact Widget**
```tsx
<NetWorthBreakdownChart
  compact={true}
  height={250}
/>
```

#### Styling

- No recharts dependency (removed for simplicity)
- Pure React + Tailwind CSS
- CSS variables for theming
- Responsive padding and sizing
- Smooth transitions (300ms default)

#### Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Color indicators + text labels (not color-dependent)
- Keyboard navigation support
- High contrast color palette (7:1+ WCAG AA)

#### Performance

- Memoized data transformations
- Efficient category filtering
- Minimal DOM updates
- No unnecessary re-renders
- Smooth 60fps animations

## Component Functions

### Core Components
- `NetWorthPerformanceChart()` - Net worth trend area chart with metrics
- `NetWorthBreakdownChart()` - Asset breakdown by category with bars

### Sub-Components
- `CategoryRow()` - Individual category display with bar and stats

### Utility Functions (Shared)
- `sanitizeHeight()` - Validates and clamps height value
- `isValidNumber()` - Type-safe number validation
- `formatCurrency()` - Safe currency formatting
- `formatCompactCurrency()` - K/M suffixed formatting
- `validateCategory()` - Category data validation
- `calculatePercentages()` - Computes allocation percentages

### State Hooks
- `useState` - Category visibility, hovered category, loading/error
- `useCallback` - Memoized event handlers
- `useMemo` - Memoized data processing

### Event Handlers
- `handleCategoryToggle()` - Toggle category visibility
- `handleRefresh()` - Refresh data
- `handleExport()` - Generate CSV export

## Modularity & Extensibility

### Reusable Patterns

1. **CategoryRow Component**
   - Self-contained category display
   - Can be extracted for list views
   - Handles hover state independently

2. **Utility Functions**
   - All formatting/validation functions are pure
   - Can be used in other components
   - No side effects

3. **Data Structure**
   - Simple, flat structure (NetWorthCategory)
   - Easy to generate from APIs
   - Extensible with additional fields

### Adding Custom Categories

```typescript
// Modify DEFAULT_DEMO_CATEGORIES
const DEFAULT_DEMO_CATEGORIES: NetWorthCategory[] = [
  {
    id: 'custom-id',
    name: 'Custom Asset',
    value: 12345,
    color: 'var(--chart-1)',
    percentage: 5.0,
    trend: 3.2,
  },
  // ... more categories
];
```

### Extending for Live Data

When API is ready:

```typescript
// lib/queries/use-networth-breakdown.ts
export function useNetWorthBreakdown() {
  return useQuery({
    queryKey: ['networth-breakdown'],
    queryFn: async () => {
      const response = await fetch('/api/networth/breakdown');
      return response.json() as Promise<NetWorthBreakdownData>;
    },
  });
}

// In component
const { data } = useNetWorthBreakdown();
<NetWorthBreakdownChart mode={data ? 'live' : 'demo'} />
```

## Data Structures

```typescript
interface NetWorthCategory {
  id: string;              // Unique identifier
  name: string;            // Display name
  value: number;           // Amount in USD
  color: string;           // CSS color variable or hex
  percentage: number;      // Allocation % (auto-calculated)
  trend?: number;          // YoY change percentage
  icon?: React.ReactNode;  // Optional icon
}

interface NetWorthBreakdownData {
  categories: NetWorthCategory[];
  total: number;
  date: string;            // ISO date
  currency: string;        // 'USD'
}

interface NetWorthBreakdownChartProps {
  // ... all props
}
```

## Configuration

```typescript
const CHART_CONFIG = {
  MIN_HEIGHT: 250,
  MAX_HEIGHT: 1000,
  DEFAULT_HEIGHT: 400,
};

const THEME_COLORS = [
  'var(--chart-1)',  // Primary
  'var(--chart-2)',  // Secondary
  'var(--chart-3)',  // Tertiary
  'var(--chart-4)',  // Quaternary
  'var(--chart-5)',  // Quinary
];
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+
- Mobile browsers (iOS Safari 15+, Chrome Mobile)

## Dependencies

```json
{
  "react": "^19.0.0",
  "lucide-react": "^0.263.0",
  "tailwindcss": "^3.3.0"
}
```

## Best Practices

1. **Use theme colors** instead of hardcoding hex values
2. **Validate external data** before rendering
3. **Handle edge cases** (empty data, extreme values)
4. **Memoize callbacks** passed as props
5. **Test with real data** before production
6. **Follow existing patterns** when extending
7. **Document public interfaces** with JSDoc
8. **Ensure accessibility** in any modifications

## Future Components

Planned additions:
- Portfolio Allocation Pie Chart
- Category Comparison Chart
- Performance Timeline Chart
- Asset Growth Waterfall Chart
- Risk vs Return Scatter Plot

## File Exports

```typescript
// index.ts
export { NetWorthPerformanceChart } from './networth-performance-chart';
export type {
  PerformanceMetrics,
  ChartDataPoint,
  NetWorthPerformanceChartProps,
  TimePeriod,
} from './networth-performance-chart';

export { NetWorthBreakdownChart } from './networth-breakdown-chart';
export type {
  NetWorthCategory,
  NetWorthBreakdownData,
  NetWorthBreakdownChartProps,
} from './networth-breakdown-chart';
```

## Production Status

### NetWorthPerformanceChart
✅ **Status**: Production Ready
✅ **Design**: YNAB-Inspired Area Chart
✅ **Colors**: App Theme (--chart-1)
✅ **Features**: Metrics, Period Selection, Interactive
✅ **Responsive**: Mobile Optimized
✅ **Accessibility**: WCAG 2.1 AA

### NetWorthBreakdownChart
✅ **Status**: Production Ready
✅ **Design**: YNAB-Inspired Category Rows
✅ **Colors**: App Theme (--chart-1 through --chart-5)
✅ **Features**: Filtering, Export, Trends
✅ **Responsive**: Mobile Optimized
✅ **Accessibility**: WCAG 2.1 AA

---

**Last Updated**: January 2026
**System Version**: 1.0.0
**Components**: 2 (Performance + Breakdown)
