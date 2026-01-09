'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  TrendingUp,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RefreshCcw,
  Minus,
  TrendingDown,
  ArrowDownLeft,
  Settings2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import { useNetWorthHistory, useNetWorthPerformance } from '@/lib/queries/use-networth-data';
import type { TimePeriod } from '@/lib/types/networth';
import { SnapshotGranularity } from '@/lib/types/networth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MemoryArrowTopRight, SolarCalendarBoldDuotone } from '../icons/icons';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { MetricCard } from '../ui/metric-card';
import { CurrencyDisplay } from '../ui/currency-display';
import { Card } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { formatBusinessTime, timestampzToReadable } from '@/lib/utils/time';

/**
 * Enterprise-grade NetWorth Chart Component
 *
 * Features:
 * - Real-time data synchronization with TanStack Query
 * - Linear area chart visualization with gradient fill
 * - Responsive design with mobile optimization
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Performance optimized with memoization
 * - Comprehensive error handling
 * - TypeScript strict mode compatible
 *
 * @example
 * ```tsx
 * <NetWorthChart
 *   mode="live"
 *   defaultPeriod="1m"
 *   showMetrics={true}
 *   onPeriodChange={(period) => console.log(period)}
 * />
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

interface NetWorthChartProps {
  /** Additional CSS classes */
  className?: string;
  /** Chart height in pixels (min: 200, max: 1000) */
  height?: number;
  /** Enable compact mode for embedded views */
  compact?: boolean;
  /** Show period selection filter */
  showPeriodFilter?: boolean;
  /** Period filter UI type: button group or dropdown select */
  periodFilterType?: 'buttons' | 'select';
  /** Show net worth display in header */
  showNetWorthDisplay?: boolean;
  /** Show average reference line */
  showComparison?: boolean;
  /** Initial time period */
  defaultPeriod?: TimePeriod;
  /** Callback when period changes */
  onPeriodChange?: (period: TimePeriod) => void;
  /** Data mode: live API or demo data */
  mode?: 'demo' | 'live';
  /** Demo scenario for testing */
  demoScenario?: 'growth' | 'volatile' | 'decline' | 'recovery' | 'steady';
}

interface ChartDataPoint {
  date: string;
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  change: number;
  changePercent: number;
  formattedDate: string;
}

interface PerformanceMetrics {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  isNeutral: boolean;
  peak: number;
  trough: number;
  volatility: number;
}


// ============================================================================
// Constants & Configuration
// ============================================================================

const CHART_CONFIG = {
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 1000,
  DEFAULT_HEIGHT: 400,
  THRESHOLD_PERCENT: 0.02, // 2% threshold for average comparison
} as const;


// Period to granularity mapping
const periodGranularityMap: Record<TimePeriod, SnapshotGranularity> = {
  '1d': SnapshotGranularity.DAILY,
  '1w': SnapshotGranularity.DAILY,
  '1m': SnapshotGranularity.DAILY,
  '3m': SnapshotGranularity.WEEKLY,
  '6m': SnapshotGranularity.WEEKLY,
  'ytd': SnapshotGranularity.WEEKLY,
  '1y': SnapshotGranularity.MONTHLY,
  'all': SnapshotGranularity.MONTHLY,
};

const periods: { value: TimePeriod; label: string; description: string }[] = [
  { value: '1w', label: '1 Week', description: 'Last 7 days' },
  { value: '1m', label: '1 Month', description: 'Last 30 days' },
  { value: '3m', label: '3 Months', description: 'Last 3 months' },
  { value: '6m', label: '6 Months', description: 'Last 6 months' },
  { value: 'ytd', label: 'Year to Date', description: 'Year to date' },
  { value: '1y', label: '1 Year', description: 'Last 12 months' },
  { value: 'all', label: 'All Time', description: 'All time' },
];

// Breakdown chart period options (monthly, quarterly, yearly)
const breakdownPeriods: { value: 'monthly' | 'quarterly' | 'yearly'; label: string; description: string }[] = [
  { value: 'monthly', label: 'Monthly', description: 'Monthly breakdown' },
  { value: 'quarterly', label: 'Quarterly', description: 'Quarterly breakdown' },
  { value: 'yearly', label: 'Yearly', description: 'Yearly breakdown' },
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates and sanitizes chart height value
 */
const sanitizeHeight = (height?: number): number => {
  if (typeof height !== 'number' || isNaN(height)) {
    return CHART_CONFIG.DEFAULT_HEIGHT;
  }
  return Math.max(
    CHART_CONFIG.MIN_HEIGHT,
    Math.min(CHART_CONFIG.MAX_HEIGHT, Math.floor(height))
  );
};

/**
 * Validates numeric data point
 */
const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
};

/**
 * Safely formats currency with fallback
 */
const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    if (!isValidNumber(value)) return '$0.00';

    // Default format options - allow overrides but ensure max >= min
    const minFractionDigits = options?.minimumFractionDigits ?? 2;
    const maxFractionDigits = options?.maximumFractionDigits ?? 2;

    // Ensure maximumFractionDigits >= minimumFractionDigits
    const safeMaxFractionDigits = Math.max(maxFractionDigits, minFractionDigits);

    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: safeMaxFractionDigits,
      ...options,
      // Override with our validated values to prevent conflicts
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: safeMaxFractionDigits,
    })}`;
  } catch (error) {
    console.warn('[NetWorthChart] Currency formatting error:', error);
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Formats large numbers with K/M suffix
 */
const formatCompactCurrency = (value: number): string => {
  try {
    if (!isValidNumber(value)) return '$0';

    const absValue = Math.abs(value);
    if (absValue >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (absValue >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  } catch (error) {
    console.warn('[NetWorthChart] Compact formatting error:', error);
    return '$0';
  }
};

/**
 * Validates chart data point
 */
const validateDataPoint = (point: unknown): point is ChartDataPoint => {
  if (!point || typeof point !== 'object') return false;

  const p = point as Record<string, unknown>;
  return (
    typeof p.date === 'string' &&
    isValidNumber(p.totalNetWorth) &&
    isValidNumber(p.totalAssets) &&
    isValidNumber(p.totalLiabilities)
  );
};

/**
 * Aggregates chart data by period (monthly, quarterly, yearly)
 */
const aggregateDataByPeriod = (
  data: ChartDataPoint[],
  period: 'monthly' | 'quarterly' | 'yearly'
): ChartDataPoint[] => {
  if (!data.length) return [];

  const grouped: Record<string, ChartDataPoint[]> = {};

  data.forEach((point) => {
    const date = new Date(point.date);
    let key: string;

    if (period === 'monthly') {
      // Group by month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else if (period === 'quarterly') {
      // Group by quarter
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      key = `${date.getFullYear()}-Q${quarter}`;
    } else {
      // Group by year
      key = `${date.getFullYear()}`;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(point);
  });

  // Calculate averages for each group
  return Object.entries(grouped).map(([key, points]) => {
    const avgAssets = points.reduce((sum, p) => sum + p.totalAssets, 0) / points.length;
    const avgLiabilities = points.reduce((sum, p) => sum + p.totalLiabilities, 0) / points.length;
    // Calculate net worth from aggregated assets and liabilities to match stacked bar representation
    const avgNetWorth = avgAssets - avgLiabilities;

    let formattedDate: string;
    if (period === 'monthly') {
      const [year, month] = key.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', {
        month: 'short',
      });
      formattedDate = monthName;
    } else if (period === 'quarterly') {
      formattedDate = key;
    } else {
      formattedDate = key;
    }

    return {
      date: points[points.length - 1].date, // Use last date in group
      totalNetWorth: avgNetWorth,
      totalAssets: avgAssets,
      totalLiabilities: avgLiabilities,
      change: points[points.length - 1].change,
      changePercent: points[points.length - 1].changePercent,
      formattedDate,
    };
  });
};

// Demo data generator
function generateDemoData(
  period: TimePeriod,
  granularity: SnapshotGranularity,
  scenario: 'growth' | 'volatile' | 'decline' | 'recovery' | 'steady' = 'growth'
) {
  const now = new Date();
  const dataPoints = [];

  let numPoints = 0;
  let startDate = new Date(now);

  switch (period) {
    case '1d':
      numPoints = 24;
      startDate.setDate(now.getDate() - 1);
      break;
    case '1w':
      numPoints = 7;
      startDate.setDate(now.getDate() - 7);
      break;
    case '1m':
      numPoints = 30;
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      numPoints = 13;
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      numPoints = 26;
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'ytd':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const daysSinceYearStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      numPoints = Math.ceil(daysSinceYearStart / 7);
      startDate = startOfYear;
      break;
    case '1y':
      numPoints = 12;
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      numPoints = 24;
      startDate.setFullYear(now.getFullYear() - 2);
      break;
  }

  const baseAssets = 350000;
  const baseLiabilities = 100000;

  let volatilityFactor = 0.02;
  let growthRate = 0.005;

  switch (scenario) {
    case 'growth':
      growthRate = 0.01;
      volatilityFactor = 0.015;
      break;
    case 'volatile':
      growthRate = 0.005;
      volatilityFactor = 0.08;
      break;
    case 'decline':
      growthRate = -0.008;
      volatilityFactor = 0.025;
      break;
    case 'recovery':
      growthRate = 0.015;
      volatilityFactor = 0.03;
      break;
    case 'steady':
      growthRate = 0.002;
      volatilityFactor = 0.008;
      break;
  }

  for (let i = 0; i < numPoints; i++) {
    const date = new Date(startDate);

    switch (granularity) {
      case 'DAILY':
        date.setDate(startDate.getDate() + i);
        break;
      case 'WEEKLY':
        date.setDate(startDate.getDate() + (i * 7));
        break;
      case 'MONTHLY':
        date.setMonth(startDate.getMonth() + i);
        break;
    }

    const progress = i / (numPoints - 1);

    let scenarioAdjustment = 1;
    if (scenario === 'recovery') {
      scenarioAdjustment = progress < 0.5
        ? 1 - (progress * 0.3)
        : 0.85 + ((progress - 0.5) * 0.5);
    } else if (scenario === 'volatile') {
      scenarioAdjustment = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
    }

    const compoundGrowth = Math.pow(1 + growthRate, i);
    const randomNoise = (Math.random() - 0.5) * volatilityFactor;

    const growthFactor = compoundGrowth * (1 + randomNoise) * scenarioAdjustment;
    const totalAssets = Math.round(baseAssets * growthFactor);
    const totalLiabilities = Math.round(baseLiabilities * (1 + (growthRate * 0.3 * i)));
    const totalNetWorth = totalAssets - totalLiabilities;

    dataPoints.push({
      date: date.toISOString(),
      totalNetWorth,
      totalAssets,
      totalLiabilities,
    });
  }

  return {
    dataPoints,
    period,
    granularity,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
  };
}

function generateDemoPerformance(dataPoints: Array<{ totalNetWorth: number; totalAssets: number; totalLiabilities: number }>) {
  if (dataPoints.length === 0) return null;

  const first = dataPoints[0];
  const last = dataPoints[dataPoints.length - 1];

  const changeAmount = last.totalNetWorth - first.totalNetWorth;
  const changePercent = (changeAmount / first.totalNetWorth) * 100;

  return {
    overall: {
      startValue: first.totalNetWorth,
      endValue: last.totalNetWorth,
      changeAmount,
      changePercent,
      periodLabel: 'Overall',
    },
    day: {
      startValue: last.totalNetWorth,
      endValue: last.totalNetWorth,
      changeAmount: 0,
      changePercent: 0,
    },
    week: {
      startValue: first.totalNetWorth,
      endValue: last.totalNetWorth,
      changeAmount,
      changePercent,
    },
    month: {
      startValue: first.totalNetWorth,
      endValue: last.totalNetWorth,
      changeAmount,
      changePercent,
    },
    quarter: {
      startValue: first.totalNetWorth,
      endValue: last.totalNetWorth,
      changeAmount,
      changePercent,
    },
    year: {
      startValue: first.totalNetWorth,
      endValue: last.totalNetWorth,
      changeAmount,
      changePercent,
    },
  };
}

// Custom tooltip for shadcn charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {

  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ChartDataPoint;

  // Validate data
  if (!validateDataPoint(data)) {
    console.warn('[NetWorthChart] Invalid tooltip data:', data);
    return null;
  }

  const netWorth = data.totalNetWorth;
  const assets = data.totalAssets;
  const liabilities = data.totalLiabilities;
  const change = data.change || 0;
  const changePercent = data.changePercent || 0;
  const isPositive = change >= 0;

  let formattedDate: string;
  try {
    formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      weekday: 'short'
    });
  } catch (error) {
    console.warn('[NetWorthChart] Date formatting error:', error);
    formattedDate = data.date;
  }

  return (
    <div className="bg-background/95 backdrop-blur-md border border-muted rounded-lg p-4 shadow-xl min-w-72">
      <div className="space-y-3">
        {/* Date Header */}
        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground font-semibold uppercase tracking-wide" dateTime={data.date}>
            {formattedDate}
          </time>
        </div>

        {/* Main Net Worth Value */}
        <div className={cn(
          "px-3 py-2.5 rounded-md ",
          isPositive
            ? "bg-emerald-500/5 "
            : "bg-red-500/5 "
        )}>
          <p className="text-[10px] text-muted-foreground font-semibold mb-1 uppercase tracking-wide">Net Worth</p>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg font-bold tabular-nums tracking-tight">
              {formatCurrency(netWorth)}
            </span>
            {change !== 0 && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-bold tabular-nums",
                  isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {isPositive ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )}
                {isPositive ? '+' : ''}{Math.abs(changePercent).toFixed(2)}%
              </span>
            )}
          </div>
          {change !== 0 && (
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Change: {isPositive ? '+' : ''}{formatCurrency(change, { maximumFractionDigits: 0 })}
            </p>
          )}
        </div>

        {/* Assets & Liabilities Breakdown */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500/70"></div>
              <span className="text-xs font-medium text-muted-foreground">Assets</span>
            </div>
            <span className="font-bold text-sm tabular-nums">
              {formatCurrency(assets, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
              <span className="text-xs font-medium text-muted-foreground">Liabilities</span>
            </div>
            <span className="font-bold text-sm tabular-nums">
              {formatCurrency(liabilities, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom dot component for breakdown line chart
interface CustomDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
  stroke?: string;
}

const CustomNetWorthDot = ({ cx, cy, fill }: CustomDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={1.5} fill="#FFDCD2" stroke="var(--chart-1)" strokeWidth={1} opacity={0.6} />
    </g>
  );
};

// Period filter button group
interface PeriodFilterButtonsProps {
  periods: Array<{ value: TimePeriod; label: string; description: string }>;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  compact?: boolean;
}

const PeriodFilterButtons = ({ periods, selectedPeriod, onPeriodChange, compact = false }: PeriodFilterButtonsProps) => (
  <div className={cn("flex gap-0 flex-wrap inline-flex rounded-md border border-input bg-background", compact ? "justify-end" : "")}>
    {periods.map((period, index) => (
      <Button
        key={period.value}
        size={compact ? "xs" : "sm"}
        variant={selectedPeriod === period.value ? "outline2" : "outlinemuted2"}
        onClick={() => onPeriodChange(period.value)}
        className={cn(
          "rounded-none font-medium transition-all border-0 hover:border-none hover:bg-none flex-1",
          compact && "text-xs",
          selectedPeriod === period.value && "shadow-sm",
          index > 0 && "border-l border-input"
        )}
      >
        {period.value}
      </Button>
    ))}
  </div>
);

// Loading skeleton
const ChartSkeleton = ({ height }: { height: number }) => (
  <div className="relative w-full flex items-center justify-center" style={{ height }}>
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading chart...</p>
    </div>
  </div>
);

// Empty state
const EmptyState = ({ onRefresh }: { onRefresh?: () => void }) => (
  <div className="absolute inset-0 flex items-center justify-center p-6">
    <div className="text-center max-w-sm space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-muted">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold">No Data Available</h3>
        <p className="text-sm text-muted-foreground">
          Connect your accounts to see your net worth history.
        </p>
      </div>

      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      )}
    </div>
  </div>
);

// Error state
const ErrorState = ({ error, onRetry }: { error: unknown; onRetry: () => void }) => (
  <div className="absolute inset-0 flex items-center justify-center p-6">
    <div className="text-center max-w-sm space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold">Failed to Load Chart</h3>
        <p className="text-sm text-muted-foreground">
          {(error && typeof error === 'object' && 'message' in error && typeof error.message === 'string')
            ? error.message
            : 'An error occurred. Please try again.'}
        </p>
      </div>

      <Button onClick={onRetry} size="sm" className="gap-2">
        <RefreshCcw className="h-3.5 w-3.5" />
        Try Again
      </Button>
    </div>
  </div>
);

export function NetWorthChart({
  className,
  height: rawHeight,
  compact = false,
  showPeriodFilter = true,
  periodFilterType = 'buttons',
  showNetWorthDisplay = false,
  showComparison = false,
  defaultPeriod = '1m',
  onPeriodChange,
  mode = 'live',
  demoScenario = 'volatile',
}: NetWorthChartProps) {
  // ============================================================================
  // State Management
  // ============================================================================

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(defaultPeriod);
  const [chartType, setChartType] = useState<'performance' | 'breakdown'>('performance');
  const [breakdownPeriod, setBreakdownPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [showNetWorthLine, setShowNetWorthLine] = useState(true);
  const [showAssets, setShowAssets] = useState(false);
  const [showLiabilities, setShowLiabilities] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Sanitize height input
  const height = useMemo(() => sanitizeHeight(rawHeight), [rawHeight]);

  const granularity = useMemo(
    () => periodGranularityMap[selectedPeriod],
    [selectedPeriod]
  );

  // ============================================================================
  // Cleanup Effects
  // ============================================================================

  // Demo data generation
  const demoHistory = useMemo(() => {
    if (mode !== 'demo') return null;
    return generateDemoData(selectedPeriod, granularity, demoScenario);
  }, [mode, selectedPeriod, granularity, demoScenario]);

  const demoPerformanceData = useMemo(() => {
    if (mode !== 'demo' || !demoHistory) return null;
    return generateDemoPerformance(demoHistory.dataPoints);
  }, [mode, demoHistory]);

  // Live data fetching (only when mode is 'live')
  const shouldFetchLive = mode === 'live';
  const { data: liveHistory, isLoading: liveLoading, error: liveError, refetch: liveRefetch } = useNetWorthHistory({
    period: shouldFetchLive ? selectedPeriod : '1m', // Provide default when disabled
    granularity: shouldFetchLive ? granularity : SnapshotGranularity.DAILY,
  });

  const { data: livePerformance } = useNetWorthPerformance({
    period: shouldFetchLive ? selectedPeriod : '1m',
  });

  // Use demo or live data
  const history = mode === 'demo' ? demoHistory : liveHistory;
  const performance = mode === 'demo' ? demoPerformanceData : livePerformance;
  const isLoading = mode === 'demo' ? false : liveLoading;
  const error = mode === 'demo' ? null : liveError;
  const refetch = mode === 'demo' ? () => {} : liveRefetch;

  // ============================================================================
  // Event Handlers (Memoized for Performance)
  // ============================================================================

  // Handle period change with validation
  const handlePeriodChange = useCallback((period: TimePeriod) => {
    try {
      if (!periodGranularityMap[period]) {
        console.error('[NetWorthChart] Invalid period:', period);
        return;
      }
      setSelectedPeriod(period);
      onPeriodChange?.(period);
    } catch (error) {
      console.error('[NetWorthChart] Period change error:', error);
    }
  }, [onPeriodChange]);

  // ============================================================================
  // Data Transformation & Validation
  // ============================================================================

  // Transform and validate chart data
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!history?.dataPoints || history.dataPoints.length === 0) {
      return [];
    }

    try {
      return history.dataPoints
        .map((point, idx, arr) => {
          // Validate data point
          if (!isValidNumber(point.totalNetWorth) ||
              !isValidNumber(point.totalAssets) ||
              !isValidNumber(point.totalLiabilities)) {
            console.warn('[NetWorthChart] Invalid data point:', point);
            return null;
          }

          const prevPoint = idx > 0 ? arr[idx - 1] : null;
          const change = prevPoint && isValidNumber(prevPoint.totalNetWorth)
            ? point.totalNetWorth - prevPoint.totalNetWorth
            : 0;

          const changePercent = prevPoint &&
            isValidNumber(prevPoint.totalNetWorth) &&
            prevPoint.totalNetWorth !== 0
            ? ((point.totalNetWorth - prevPoint.totalNetWorth) / prevPoint.totalNetWorth) * 100
            : 0;

          let formattedDate: string;
          try {
            formattedDate = new Date(point.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
          } catch (error) {
            console.warn('[NetWorthChart] Date formatting error:', error);
            formattedDate = String(point.date);
          }

          return {
            date: point.date,
            totalNetWorth: point.totalNetWorth,
            totalAssets: point.totalAssets,
            totalLiabilities: point.totalLiabilities,
            change,
            changePercent,
            formattedDate,
          };
        })
        .filter((point): point is ChartDataPoint => point !== null);
    } catch (error) {
      console.error('[NetWorthChart] Data transformation error:', error);
      return [];
    }
  }, [history]);

  // ============================================================================
  // Performance Metrics Calculation
  // ============================================================================

  // Calculate comprehensive metrics with validation
  const metrics = useMemo<PerformanceMetrics | null>(() => {
    if (!chartData.length || !performance?.overall) return null;

    try {
      const validData = chartData.filter(d => isValidNumber(d.totalNetWorth));
      if (validData.length === 0) return null;

      const current = validData[validData.length - 1].totalNetWorth;
      const previous = validData[0].totalNetWorth;
      const change = performance.overall.changeAmount ?? 0;
      const changePercent = performance.overall.changePercent ?? 0;

      const isPositive = change >= 0;
      const isNeutral = Math.abs(changePercent) < 0.01;

      const netWorthValues = validData.map(d => d.totalNetWorth);
      const peak = Math.max(...netWorthValues);
      const trough = Math.min(...netWorthValues);
      const volatility = peak - trough;

      return {
        current,
        previous,
        change,
        changePercent,
        isPositive,
        isNeutral,
        peak,
        trough,
        volatility,
      };
    } catch (error) {
      console.error('[NetWorthChart] Metrics calculation error:', error);
      return null;
    }
  }, [chartData, performance]);

  // Calculate average value with validation
  const averageValue = useMemo(() => {
    if (!chartData.length) return 0;

    try {
      const validData = chartData.filter(d => isValidNumber(d.totalNetWorth));
      if (validData.length === 0) return 0;

      const sum = validData.reduce((acc, d) => acc + d.totalNetWorth, 0);
      return sum / validData.length;
    } catch (error) {
      console.error('[NetWorthChart] Average calculation error:', error);
      return 0;
    }
  }, [chartData]);

  // Calculate Y-axis domain with padding (only for active chart lines)
  const yAxisDomain = useMemo(() => {
    if (!chartData.length) return [0, 100000];

    try {
      const validData = chartData.filter(d =>
        isValidNumber(d.totalNetWorth) &&
        isValidNumber(d.totalAssets) &&
        isValidNumber(d.totalLiabilities)
      );
      if (validData.length === 0) return [0, 100000];

      // Collect values only from active/visible series
      const allValues: number[] = [];
      validData.forEach(d => {
        if (showNetWorthLine) allValues.push(d.totalNetWorth);
        if (showAssets) allValues.push(d.totalAssets);
        if (showLiabilities) allValues.push(d.totalLiabilities);
      });

      // If no active series, return default
      if (allValues.length === 0) return [0, 100000];

      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      const range = max - min;
      const padding = Math.max(range * 0.1, 1000); // 10% padding or minimum 1000

      return [
        Math.max(0, Math.floor((min - padding) / 1000) * 1000), // Round down to nearest 1000
        Math.ceil((max + padding) / 1000) * 1000, // Round up to nearest 1000
      ];
    } catch (error) {
      console.error('[NetWorthChart] Y-axis domain calculation error:', error);
      return [0, 100000];
    }
  }, [chartData, showNetWorthLine, showAssets, showLiabilities]);

  // Aggregate breakdown data based on selected breakdown period
  const breakdownChartData = useMemo(() => {
    if (chartType === 'breakdown') {
      return aggregateDataByPeriod(chartData, breakdownPeriod);
    }
    return chartData;
  }, [chartData, chartType, breakdownPeriod]);

  // Calculate average assets and liabilities for breakdown chart
  const breakdownAverages = useMemo(() => {
    if (!breakdownChartData.length) return { avgAssets: 0, avgLiabilities: 0 };

    try {
      const validData = breakdownChartData.filter(d => isValidNumber(d.totalAssets) && isValidNumber(d.totalLiabilities));
      if (validData.length === 0) return { avgAssets: 0, avgLiabilities: 0 };

      const avgAssets = validData.reduce((sum, d) => sum + d.totalAssets, 0) / validData.length;
      const avgLiabilities = validData.reduce((sum, d) => sum + d.totalLiabilities, 0) / validData.length;

      return { avgAssets, avgLiabilities };
    } catch (error) {
      console.error('[NetWorthChart] Breakdown averages calculation error:', error);
      return { avgAssets: 0, avgLiabilities: 0 };
    }
  }, [breakdownChartData]);

  // ============================================================================
  // Component Render
  // ============================================================================

  // Compact mode with professional styling
  if (compact) {
    return (
      <div
        ref={chartContainerRef}
        className={cn("w-full  -mb-2   space-y-3 shadow-sm border  ", className)}
        role="region"
        aria-label="Net Worth Chart (Compact View)"
      >
        {/* Header with metrics and controls */}
        <div className="flex items-start justify-between gap-4 w-full">
          {/* Left: Net Worth Display */}
          {showNetWorthDisplay && (
            <div className="flex flex-col gap-1 flex-shrink-0">
              {!isLoading && metrics && (
                <>
                  <p className="text-xs text-muted-foreground font-medium">Net Worth</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      {formatCurrency(metrics.current, { maximumFractionDigits: 0 })}
                    </span>
                    {!metrics.isNeutral && (
                      <span
                        className={cn(
                          "text-xs font-semibold flex items-center gap-0.5",
                          metrics.isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {metrics.isPositive ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(metrics.changePercent).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Right: Controls (Period selector + Chart lines toggle) */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {showPeriodFilter && periodFilterType === 'buttons' && (
              <PeriodFilterButtons
                periods={periods.slice(0, 4)}
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                compact={true}
              />
            )}

            {showPeriodFilter && periodFilterType === 'select' && (
              <Select value={selectedPeriod} onValueChange={(v) => handlePeriodChange(v as TimePeriod)}>
                <SelectTrigger size="xs" className="h-8 text-xs rounded-md" variant='outline2'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.slice(0, 4).map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Chart Lines Toggle Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon-xs"
                  variant="outline2"
                  className="  p-0 rounded-none"
                  title="Toggle chart lines"
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="end">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chart Lines</p>
                  <div className="space-y-1.5">
                    {/* Net Worth Checkbox */}
                    <div className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
                      onClick={() => setShowNetWorthLine(!showNetWorthLine)}>
                      <Checkbox
                        checked={showNetWorthLine}
                        onCheckedChange={(checked) => setShowNetWorthLine(checked as boolean)}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }}></div>
                        <label className="text-sm font-medium cursor-pointer flex-1">Net Worth</label>
                      </div>
                    </div>

                    {/* Assets Checkbox */}
                    <div className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
                      onClick={() => setShowAssets(!showAssets)}>
                      <Checkbox
                        checked={showAssets}
                        onCheckedChange={(checked) => setShowAssets(checked as boolean)}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/70"></div>
                        <label className="text-sm font-medium cursor-pointer flex-1">Assets</label>
                      </div>
                    </div>

                    {/* Liabilities Checkbox */}
                    <div className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
                      onClick={() => setShowLiabilities(!showLiabilities)}>
                      <Checkbox
                        checked={showLiabilities}
                        onCheckedChange={(checked) => setShowLiabilities(checked as boolean)}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
                        <label className="text-sm font-medium cursor-pointer flex-1">Liabilities</label>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Chart container */}
        <div className="relative rounded-md overflow-visible bg-muted/30 border border-muted -mr-4" style={{ height }}>
          {isLoading ? (
            <ChartSkeleton height={height} />
          ) : error ? (
            <ErrorState error={error} onRetry={() => refetch()} />
          ) : chartData.length === 0 ? (
            <EmptyState onRefresh={() => refetch()} />
          ) : (
            <ChartContainer
              config={{
                totalNetWorth: {
                  label: 'Net Worth',
                  color: 'var(--chart-1)',
                },
              } satisfies ChartConfig}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="networthGradientCompact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                      <stop offset="40%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="assetsGradientCompact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="liabilitiesGradientCompact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.15}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="formattedDate"
                    stroke="var(--muted-foreground)"
                    tickLine={false}
                    axisLine={false}
                    tick={false}
                  />

                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    opacity={0.65}
                    width={40}
                    domain={yAxisDomain as [number, number]}
                    tickMargin={6}
                    aria-label="Net worth value axis"
                  />

                  <ChartTooltip content={<CustomTooltip />} cursor={false} />

                  {showNetWorthLine && (
                    <Area
                      type="linear"
                      dataKey="totalNetWorth"
                      stroke="var(--chart-1)"
                      opacity={0.7}
                      strokeWidth={2}
                      fill="url(#networthGradientCompact)"
                      aria-label="Net worth area"
                      isAnimationActive={true}
                      animationDuration={500}
                    />
                  )}

                  {showAssets && (
                    <Area
                      type="linear"
                      dataKey="totalAssets"
                      stroke="rgb(34, 197, 94)"
                      opacity={0.6}
                      strokeWidth={2}
                      fill="url(#assetsGradientCompact)"
                      aria-label="Assets area"
                      isAnimationActive={true}
                      animationDuration={500}
                    />
                  )}

                  {showLiabilities && (
                    <Area
                      type="linear"
                      dataKey="totalLiabilities"
                      stroke="rgb(239, 68, 68)"
                      opacity={0.6}
                      strokeWidth={2}
                      fill="url(#liabilitiesGradientCompact)"
                      aria-label="Liabilities area"
                      isAnimationActive={true}
                      animationDuration={500}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </div>
    );
  }
  const chartConfig = {
    date: {
      label: "Date",
      color: "var(--chart-1)",
    },
    totalNetWorth: {
      label: "Networth",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
  // Full mode - enterprise-grade with accessibility

  return (
    <Card
      ref={chartContainerRef}
      className={cn("w-full  p-0 space-y-4 shadow-xs hover:shadow-none rounded-sm flex flex-col justify-between", className)}
      role="region"
      aria-label="Net Worth Chart"
    >


     

<div className='flex justify-end items-center gap-2 pr-4'>

   {/* Compact Metrics Cards
   {  metrics && !isLoading && (
        <div className="flex">
          <CurrencyDisplay amountUSD={metrics.current} variant='xl' className='font-medium' />
       
        </div>
      )} 

      <div className='flex gap-4'>
      <Card className="rounded-none justify-between  w-34 h-14 bg-[hsl(75.79,100%,70.2%)] p-1">
            <div className="flex items-center gap-2  ">
              <ArrowDownLeft className="h-5 w-5 bg-[hsl(76,65%,54%)] text-[hsl(76,47%,27%)]" strokeWidth={2.5} />
              <h3 className="text-gray-800 text-xs upp">Income</h3>
            </div>
            <div className="text-xs font-semibold text-gray-800 text-end ">
              {formatCurrency(4600)}
            </div>
          </Card>

          <Card className="rounded-none justify-between  w-34 h-14 bg-[rgb(255,220,210)] p-1">
            <div className="flex items-center gap-2  ">
              <MemoryArrowTopRight className="h-5 w-5 bg-[rgb(240,185,169)]  text-[rgb(141,62,40)]" strokeWidth={2.5} />
              <h3 className=" text-xs text-gray-700">Expense</h3>
            </div>


            <div className="text-xs text-end font-semibold text-gray-800">
              {formatCurrency(2100)}
            </div>
          </Card>
      </div>*/}

<div className='flex items-center gap-2'>
      {/* Chart Type Selector */}
      <Select value={chartType} onValueChange={(v) => setChartType(v as 'performance' | 'breakdown')}>
        <SelectTrigger className="gap-1 rounded-none font-medium h-7 text-xs  shadow-none w-[120px]" size='xs' variant='outline2'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className=' shadow-none'>
          <SelectItem value="performance" className=''>
            <span className="font-medium text-xs">Performance</span>
          </SelectItem>
          <SelectItem value="breakdown" className=''>
            <span className="font-medium text-xs">Breakdown</span>
          </SelectItem>
        </SelectContent>
      </Select>

      {showPeriodFilter && chartType === 'performance' && periodFilterType === 'buttons' && (
        <PeriodFilterButtons
          periods={periods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          compact={false}
        />
      )}

      {showPeriodFilter && chartType === 'performance' && periodFilterType === 'select' && (
        <Select value={selectedPeriod} onValueChange={(v) => handlePeriodChange(v as TimePeriod)} >
          <SelectTrigger className="gap-1 font-medium h-7 rounded-none text-xs  shadow-none" size='xs' variant='outline2'>
            <SolarCalendarBoldDuotone className="h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className=' shadow-none'>
            {periods.map((period) => (
              <SelectItem key={period.value} value={period.value} className=''>
                <span className="font-medium text-xs">{period.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showPeriodFilter && chartType === 'breakdown' && (
        <Select value={breakdownPeriod} onValueChange={(v) => setBreakdownPeriod(v as 'monthly' | 'quarterly' | 'yearly')} >
          <SelectTrigger className="gap-1 font-medium h-7 text-xs  shadow-none w-[110px] rounded-none" size='xs' variant='outline2'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className=' shadow-none'>
            {breakdownPeriods.map((period) => (
              <SelectItem key={period.value} value={period.value} className=''>
                <span className="font-medium text-xs">{period.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}</div>
</div>

      {/* Chart Container */}
      <div
        className="relative   -x-2"
        style={{ height }}
      >
 
      
        {isLoading ? (
          <ChartSkeleton height={height} />
        ) : error ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : chartData.length === 0 ? (
          <EmptyState onRefresh={() => refetch()} />
        ) : (
          <ChartContainer
            config={{
              totalNetWorth: {
                label: 'Net Worth',
                color: 'var(--chart-1)',
              },
              totalAssets: {
                label: 'Assets',
                color: 'var(--chart-2)',
              },
              totalLiabilities: {
                label: 'Liabilities',
                color: 'var(--chart-3)',
              },
            } satisfies ChartConfig}
            className="h-full w-full "
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'performance' ? (
                <AreaChart
                  data={chartData}
                
                  role="img"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  aria-label={`Net worth area chart showing ${chartData.length} data points over ${selectedPeriod}`}
                >
                  <defs>
                    <linearGradient id="networthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.9} />
                      <stop offset="40%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} />

              
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                  
                  
                    width={40}
                    domain={yAxisDomain as [number, number]}
                    aria-label="Net worth value axis"
                  />

<XAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatDate(value)}
                  
              
              
               
                    aria-label="Net worth value axis"
                  />
                 
                  <ReferenceLine
                    y={averageValue}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeWidth={1 }
                    opacity={0.6}
                    label={{
                      value: 'Avg',
                      position: 'right',
                      fill: 'var(--muted-foreground)',
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  />

                  <ChartTooltip content={<CustomTooltip />} cursor={false} />

                  <Area
                    type="linear"
                    dataKey="totalNetWorth"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    opacity={1}
                    fill="url(#networthGradient)"
                    aria-label="Net worth area"
                    isAnimationActive={true}
                    animationDuration={400}
                /*     dot={<CustomNetWorthDot />} */
                    activeDot={{ r: 1 }}
                  />
                </AreaChart>
              ) : (
                <ComposedChart
                  accessibilityLayer
                  data={breakdownChartData}
                  margin={{ top: 15, right: 20, left: 15, bottom: 15 }}
                  barSize={20}
                  barCategoryGap={1}
                >
                  <CartesianGrid vertical={false} opacity={0.8} />

                  <XAxis
                    dataKey="formattedDate"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                   className='text-foreground'
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={false}
                    width={0}
                  />

                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                {/* */}  <ChartLegend content={<ChartLegendContent />} /> 

                  <Bar
                    dataKey="totalLiabilities"
                    stackId="a"
                    fill="rgb(241,190,175)"
                    name="Liabilities"
                    radius={[0, 0, 4, 4]}
                    isAnimationActive={true}
                    animationDuration={500}
                    activeBar={false}
                  />
                  <Bar
                    dataKey="totalAssets"
                    stackId="a"
                    fill="rgb(188,201,135)"
                    name="Assets"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={500}
                    activeBar={false}
                  />

                  <Line
                    type="linear"
                    dataKey="totalNetWorth"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={<CustomNetWorthDot />}
                    activeDot={{ r: 3 }}
                    name="Net Worth"
                    isAnimationActive={true}
                    animationDuration={400}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        )}
        
      </div>

    </Card>
  );
}
