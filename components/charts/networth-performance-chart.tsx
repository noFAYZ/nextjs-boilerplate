'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  TrendingUp,
  AlertCircle,
  RefreshCcw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

/**
 * YNAB-Style NetWorth Performance Chart
 *
 * Features:
 * - Minimalist area chart with app theme colors
 * - Period selection (1w, 1m, 3m, 6m, 1y, all)
 * - Performance metrics (current, change, % change)
 * - Interactive tooltip
 * - Responsive design
 * - Dark/light theme support
 *
 * @example
 * ```tsx
 * <NetWorthPerformanceChart
 *   defaultPeriod="1m"
 *   showMetrics={true}
 * />
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface PerformanceMetrics {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  isNeutral?: boolean;
}

export interface ChartDataPoint {
  date: string;
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  change: number;
  changePercent: number;
  formattedDate: string;
}

export interface NetWorthPerformanceChartProps {
  className?: string;
  height?: number;
  defaultPeriod?: TimePeriod;
  showMetrics?: boolean;
  showPeriodFilter?: boolean;
  onPeriodChange?: (period: TimePeriod) => void;
  mode?: 'demo' | 'live';
}

export type TimePeriod = '1w' | '1m' | '3m' | '6m' | 'ytd' | '1y' | 'all';

// ============================================================================
// Constants
// ============================================================================

const CHART_CONFIG = {
  MIN_HEIGHT: 250,
  MAX_HEIGHT: 1000,
  DEFAULT_HEIGHT: 400,
} as const;

const periods: { value: TimePeriod; label: string }[] = [
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: 'ytd', label: 'YTD' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
];

// ============================================================================
// Utility Functions
// ============================================================================

const sanitizeHeight = (height?: number): number => {
  if (typeof height !== 'number' || isNaN(height)) {
    return CHART_CONFIG.DEFAULT_HEIGHT;
  }
  return Math.max(
    CHART_CONFIG.MIN_HEIGHT,
    Math.min(CHART_CONFIG.MAX_HEIGHT, Math.floor(height))
  );
};

const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
};

const formatCurrency = (value: number): string => {
  try {
    if (!isValidNumber(value)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.warn('[NetWorthPerformanceChart] Currency formatting error:', error);
    return `$${value.toFixed(0)}`;
  }
};

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
    console.warn('[NetWorthPerformanceChart] Compact formatting error:', error);
    return '$0';
  }
};

// Demo data generator
function generateDemoData(period: TimePeriod) {
  const now = new Date();
  const dataPoints = [];

  let numPoints = 0;
  let startDate = new Date(now);
  let baseAssets = 350000;

  switch (period) {
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
      const daysSinceYearStart = Math.floor(
        (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      numPoints = Math.ceil(daysSinceYearStart / 7);
      startDate = startOfYear;
      break;
    case '1y':
      numPoints = 52;
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      numPoints = 24;
      startDate.setFullYear(now.getFullYear() - 2);
      break;
  }

  const growthRate = 0.008;
  const volatility = 0.03;

  for (let i = 0; i < numPoints; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i * (period === '1w' ? 1 : period === '1m' ? 1 : 7));

    const progress = i / (numPoints - 1);
    const compoundGrowth = Math.pow(1 + growthRate, i);
    const randomNoise = (Math.random() - 0.5) * volatility;
    const growthFactor = compoundGrowth * (1 + randomNoise);
    const totalAssets = Math.round(baseAssets * growthFactor);
    const totalLiabilities = 100000;
    const totalNetWorth = totalAssets - totalLiabilities;

    dataPoints.push({
      date: date.toISOString(),
      totalNetWorth,
      totalAssets,
      totalLiabilities,
      change: i > 0 ? totalNetWorth - dataPoints[i - 1].totalNetWorth : 0,
      changePercent: 0,
      formattedDate: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    });
  }

  return dataPoints;
}

// Custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

const CustomPerformanceTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ChartDataPoint;

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <time className="text-xs text-muted-foreground font-medium block">
          {data.formattedDate}
        </time>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold tabular-nums">
            {formatCurrency(data.totalNetWorth)}
          </span>
          {data.change !== 0 && (
            <span
              className={cn(
                'text-xs font-semibold tabular-nums',
                data.change >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {data.change >= 0 ? '+' : ''}{formatCurrency(data.change)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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
        <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
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
          {error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
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

/**
 * Main Component
 */
export function NetWorthPerformanceChart({
  className,
  height: rawHeight,
  defaultPeriod = '1m',
  showMetrics = true,
  showPeriodFilter = true,
  onPeriodChange,
  mode = 'demo',
}: NetWorthPerformanceChartProps) {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(defaultPeriod);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const height = useMemo(() => sanitizeHeight(rawHeight), [rawHeight]);

  // Generate demo data
  const chartData = useMemo(() => {
    if (mode !== 'demo') return [];
    return generateDemoData(selectedPeriod);
  }, [mode, selectedPeriod]);

  // Calculate metrics
  const metrics = useMemo<PerformanceMetrics | null>(() => {
    if (chartData.length < 2) return null;

    try {
      const current = chartData[chartData.length - 1].totalNetWorth;
      const previous = chartData[0].totalNetWorth;
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      const isNeutral = Math.abs(changePercent) < 0.01;

      return {
        current,
        previous,
        change,
        changePercent,
        isPositive: change >= 0,
        isNeutral,
      };
    } catch (err) {
      console.error('[NetWorthPerformanceChart] Metrics error:', err);
      return null;
    }
  }, [chartData]);

  // Calculate average for reference line
  const averageValue = useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, d) => acc + d.totalNetWorth, 0);
    return sum / chartData.length;
  }, [chartData]);

  // Event handlers
  const handlePeriodChange = useCallback((period: TimePeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  }, [onPeriodChange]);

  const handleRefresh = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  // Render
  return (
    <Card
      ref={chartContainerRef}
      className={cn(
        'w-full p-4 sm:p-5 md:p-6 space-y-4 shadow-xs hover:shadow-none border-border/70',
        className
      )}
      role="region"
      aria-label="Net Worth Performance Chart"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-semibold">Net Worth Trend</h3>

          {/* Metrics */}
          {showMetrics && metrics && (
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold tabular-nums">
                {formatCurrency(metrics.current)}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                    metrics.isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  )}
                >
                  {metrics.isPositive ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span>
                    {metrics.isPositive ? '+' : ''}{metrics.changePercent.toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(Math.abs(metrics.change))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {showPeriodFilter && (
          <Select value={selectedPeriod} onValueChange={(v) => handlePeriodChange(v as TimePeriod)}>
            <SelectTrigger className="gap-1 font-medium h-8 text-xs shadow-none w-fit" size="xs" variant="outline2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-none">
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  <span className="font-medium text-xs">{period.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Chart */}
      <div className="relative border rounded-lg bg-muted/20 overflow-hidden" style={{ height }}>
        {isLoading ? (
          <ChartSkeleton height={height} />
        ) : error ? (
          <ErrorState error={error} onRetry={handleRefresh} />
        ) : chartData.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
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
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                accessibilityLayer
              >
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="40%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.2}
                  vertical={false}
                />

                <XAxis
                  dataKey="formattedDate"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={5}
                  opacity={0.7}
                  interval="preserveStartEnd"
                />

                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactCurrency(value)}
                  dx={-5}
                  opacity={0.7}
                  width={50}
                  aria-label="Net worth value"
                />

                {/* Average reference line */}
                {metrics && !metrics.isNeutral && (
                  <ReferenceLine
                    y={averageValue}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    opacity={0.3}
                    label={{
                      value: 'Avg',
                      position: 'right',
                      fill: 'var(--muted-foreground)',
                      fontSize: 10,
                      offset: 10,
                    }}
                  />
                )}

                <ChartTooltip
                  content={<CustomPerformanceTooltip />}
                  cursor={{ stroke: 'var(--muted-foreground)', opacity: 0.2 }}
                />

                <Area
                  type="monotone"
                  dataKey="totalNetWorth"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#performanceGradient)"
                  isAnimationActive={true}
                  animationDuration={400}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>

      {/* Period label */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {chartData.length > 0 &&
            `${chartData[0].formattedDate} → ${chartData[chartData.length - 1].formattedDate}`}
        </span>
        {mode === 'demo' && (
          <span className="px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded font-medium">
            DEMO DATA
          </span>
        )}
      </div>
    </Card>
  );
}
