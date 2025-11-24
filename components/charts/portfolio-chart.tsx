'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Loader2, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { zerionChartService } from '@/lib/services/zerion-chart-api';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type PortfolioChartMode = 'compact' | 'full';
export type ChartType = 'area' | 'breakdown';
export type TimePeriod = '1D' | '7D' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
export type BreakdownPeriod = 'monthly' | 'quarterly' | 'yearly';

interface ChartDataPoint {
  timestamp?: number;
  date?: string;
  value?: number;
  totalNetWorth?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  formattedDate?: string;
}

interface PortfolioChartProps {
  mode?: PortfolioChartMode;
  initialChartType?: ChartType;
  data?: ChartDataPoint[];
  walletAddress?: string;
  height?: number;
  showPeriodFilter?: boolean;
  showMetrics?: boolean;
  enableArea?: boolean;
  enableBreakdown?: boolean;
  selectedPeriod?: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
  externalIsLoading?: boolean;
  className?: string;
  chartColor?: string;
  valueKey?: string;
  assetsKey?: string;
  liabilitiesKey?: string;
  netWorthKey?: string;
}

// ============================================================================
// Utilities
// ============================================================================

const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
};

const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    })}`;
  } catch (error) {
    console.warn('[PortfolioChart] Currency formatting error:', error);
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Format date based on time period for optimal readability
 */
const formatDateByPeriod = (date: Date, period: TimePeriod): string => {
  try {
    switch (period) {
      case '1D':
        // Show timestamps (HH:MM)
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      case '7D':
        // Show month and date (Jan 15)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      case '1M':
        // Show month and date (Jan 15)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      case '3M':
        // Show month and date (Jan 15)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      case '6M':
        // Show month only (Jan)
        return date.toLocaleDateString('en-US', {
          month: 'short',
        });
      case '1Y':
        // Show month only (Jan)
        return date.toLocaleDateString('en-US', {
          month: 'short',
        });
      case 'ALL':
        // Show month and year (Jan 2024)
        return date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        });
      default:
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
    }
  } catch (error) {
    console.warn('[PortfolioChart] Date formatting error:', error);
    return '';
  }
};

// ============================================================================
// Custom Tooltip
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint; value: number }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ChartDataPoint;
  const value = payload[0].value;

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <div className="space-y-0.5">
          {data.formattedDate && (
            <time className="text-[10px] text-muted-foreground font-medium">
              {data.formattedDate}
            </time>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold tabular-nums">
              {formatCurrency(value)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Custom Dot
// ============================================================================

interface CustomDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
}

const CustomDot = ({ cx, cy }: CustomDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={3} fill="white" stroke="var(--chart-1)" strokeWidth={2} />
    </g>
  );
};

// ============================================================================
// Loading & Empty States
// ============================================================================

const ChartSkeleton = ({ height }: { height: number }) => (
  <div className="relative w-full flex items-center justify-center" style={{ height }}>
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading chart...</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="absolute inset-0 flex items-center justify-center p-6">
    <div className="text-center max-w-sm space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-muted">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">No Data Available</h3>
        <p className="text-sm text-muted-foreground">
          Unable to load chart data at this time.
        </p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: unknown }) => (
  <div className="absolute inset-0 flex items-center justify-center p-6">
    <div className="text-center max-w-sm space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-destructive/10">
        <Loader2 className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">Failed to Load Chart</h3>
        <p className="text-sm text-muted-foreground">
          {error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'An error occurred. Please try again.'}
        </p>
      </div>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export function PortfolioChart({
  mode = 'full',
  initialChartType = 'area',
  data: externalData,
  walletAddress,
  height = 300,
  showPeriodFilter = true,
  showMetrics = true,
  enableArea = true,
  enableBreakdown = true,
  selectedPeriod = '7D',
  onPeriodChange,
  externalIsLoading = false,
  className,
  chartColor = '#00A632',
  valueKey = 'value',
  assetsKey = 'totalAssets',
  liabilitiesKey = 'totalLiabilities',
  netWorthKey = 'totalNetWorth',
}: PortfolioChartProps) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [internalPeriod, setInternalPeriod] = useState<TimePeriod>(selectedPeriod);
  const [fetchedData, setFetchedData] = useState<ChartDataPoint[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data from wallet address if provided
  useEffect(() => {
    if (!walletAddress) return;

    setIsFetching(true);
    setError(null);

    const fetchData = async () => {
      try {
        const chartData = await zerionChartService.getPortfolioTimeline({
          address: walletAddress,
          period: internalPeriod,
          currency: 'usd',
        });
        console.log(chartData)
        const transformed = chartData.map((point: any) => {
          const date = new Date(point.date);
          return {
            ...point,
            value: point.value,
            formattedDate: formatDateByPeriod(date, internalPeriod),
          };
        });
        setFetchedData(transformed);
      } catch (err) {
        console.error('Failed to load chart data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load chart data'));
        setFetchedData([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [walletAddress, internalPeriod]);

  const data = fetchedData.length > 0 ? fetchedData : externalData || [];
  const isLoading = walletAddress ? isFetching : externalIsLoading;

  const periods = useMemo(
    () => [
      { value: '1D' as TimePeriod, label: '1D' },
      { value: '7D' as TimePeriod, label: '7D' },
      { value: '1M' as TimePeriod, label: '1M' },
      { value: '3M' as TimePeriod, label: '3M' },
      { value: '6M' as TimePeriod, label: '6M' },
      { value: '1Y' as TimePeriod, label: '1Y' },
      { value: 'ALL' as TimePeriod, label: 'ALL' },
    ],
    []
  );

  const handlePeriodChange = useCallback(
    (newPeriod: TimePeriod) => {
      setInternalPeriod(newPeriod);
      onPeriodChange?.(newPeriod);
    },
    [onPeriodChange]
  );

  const metrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    const key = valueKey as keyof ChartDataPoint;
    const firstValue = (data[0][key] as number) || 0;
    const lastValue = (data[data.length - 1][key] as number) || 0;
    const change = lastValue - firstValue;
    const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

    return {
      current: lastValue,
      change,
      changePercent,
      isPositive: change >= 0,
      isNeutral: Math.abs(changePercent) < 0.01,
    };
  }, [data, valueKey]);

  const averageValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const key = valueKey as keyof ChartDataPoint;
    const sum = data.reduce((acc, point) => acc + ((point[key] as number) || 0), 0);
    return sum / data.length;
  }, [data, valueKey]);

  // Calculate smart X-axis interval based on period and data length
  const xAxisInterval = useMemo(() => {
    const dataLen = data.length;

    switch (internalPeriod) {
      case '1D':
        // For 1 day, show ~8-12 labels (every 2-3 hours roughly)
        return Math.max(0, Math.floor(dataLen / 10) - 1);
      case '7D':
        // For 7 days, show ~7-8 labels (roughly daily)
        return Math.max(0, Math.floor(dataLen / 7) - 1);
      case '1M':
        // For 1 month, show ~4-5 labels (weekly)
        return Math.max(0, Math.floor(dataLen / 5) - 1);
      case '3M':
        // For 3 months, show ~4-5 labels
        return Math.max(0, Math.floor(dataLen / 5) - 1);
      case '6M':
        // For 6 months, show ~6 labels
        return Math.max(0, Math.floor(dataLen / 6) - 1);
      case '1Y':
        // For 1 year, show ~12 labels (monthly)
        return Math.max(0, Math.floor(dataLen / 12) - 1);
      case 'ALL':
        // For all time, show ~8-10 labels
        return Math.max(0, Math.floor(dataLen / 10) - 1);
      default:
        return Math.max(0, Math.floor(dataLen / 8) - 1);
    }
  }, [data.length, internalPeriod]);

  // Calculate Y-axis domain with padding
  const yAxisDomain = useMemo(() => {
    if (!data || data.length === 0) return [0, 100000];

    const key = valueKey as keyof ChartDataPoint;
    const values = data
      .map((d) => (d[key] as number) || 0)
      .filter((v) => typeof v === 'number' && isFinite(v));

    if (values.length === 0) return [0, 100000];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = Math.max(range * 0.1, 1000); // 10% padding or minimum 1000

    return [
      Math.max(0, Math.floor((min - padding) / 1000) * 1000), // Round down to nearest 1000
      Math.ceil((max + padding) / 1000) * 1000, // Round up to nearest 1000
    ];
  }, [data, valueKey]);

 

  // Compact mode
  if (mode === 'compact') {
    return (
      <section
        className={cn('w-full', className)}
        role="region"
        aria-label="Portfolio Chart (Compact View)"
      >
        <div className="flex items-center justify-between mb-2.5 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {metrics && !isLoading && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full font-extrabold text-[10px] shadow-sm',
                  metrics.isPositive
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20'
                )}
              >
                {metrics.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {metrics.isPositive ? '+' : ''}
                {metrics.changePercent.toFixed(1)}%
              </div>
            )}
          </div>

          {showPeriodFilter && (
            <Select value={internalPeriod} onValueChange={(v) => handlePeriodChange(v as TimePeriod)}>
              <SelectTrigger size="sm" className="w-[100px] h-7 text-[11px] font-medium">
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
        </div>

        <div className="relative rounded-none overflow-hidden border bg-muted/30 shadow-sm" style={{ height }}>
          {isLoading ? (
            <ChartSkeleton height={height} />
          ) : error ? (
            <ErrorState error={error} />
          ) : data.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer
              config={{
                [valueKey]: {
                  label: 'Value',
                  color: 'var(--chart-primary)',
                },
              } satisfies ChartConfig}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="portfolioGradientCompact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.5} />
                      <stop offset="40%" stopColor="var(--chart-primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0.02} />
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
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={5}
                    opacity={0.7}
                    interval={xAxisInterval}
                    tick={{ fontSize: 9 }}
                    height={40}
                  />

                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    dx={-5}
                    opacity={0.7}
                    width={40}
                    domain={yAxisDomain as [number, number]}
                  />

                  <ChartTooltip content={<CustomTooltip />} cursor={false} />

                  <Area
                    type="linear"
                    dataKey={valueKey}
                    stroke="var(--chart-primary)"
                    strokeWidth={3}
                    fill="url(#portfolioGradientCompact)"
                    isAnimationActive={true}
                    animationDuration={100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </section>
    );
  }

  // Full mode
  const chartConfig = {
    [valueKey]: {
      label: 'Value',
      color: 'var(--chart-1)',
    },
    [assetsKey]: {
      label: 'Assets',
      color: 'var(--chart-2)',
    },
    [liabilitiesKey]: {
      label: 'Liabilities',
      color: 'var(--chart-3)',
    },
  } satisfies ChartConfig;

  return (
    <section
      className={cn('w-full space-y-2 border border-border/80 rounded-none overflow-hidden bg-card shadow-xs pt-2 pr-2', className)}
      role="region"
      aria-label="Portfolio Chart"
    >
      <div className="flex justify-end gap-2">
        {enableArea && enableBreakdown && (
          <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)} >
            <SelectTrigger className="gap-1 font-medium h-7 text-xs rounded-none shadow-none " size="xs" variant='outline2'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none shadow-none">
              <SelectItem value="area" className="rounded-none">
                <span className="font-medium text-xs">Area</span>
              </SelectItem>
              <SelectItem value="breakdown" className="rounded-none">
                <span className="font-medium text-xs">Breakdown</span>
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {showPeriodFilter && (
          <Select value={internalPeriod} onValueChange={(v) => handlePeriodChange(v as TimePeriod)}>
            <SelectTrigger className="gap-1 font-medium h-7 text-xs rounded-none shadow-none" size="xs" variant='outline2'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none shadow-none">
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value} className="rounded-none">
                  <span className="font-medium text-xs">{period.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="relative" style={{ height }}>
        {isLoading ? (
          <ChartSkeleton height={height} />
        ) : error ? (
          <ErrorState error={error} />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' && enableArea ? (
                <AreaChart
                  data={data}
                  margin={{  bottom: -5, right: 25 }}
                  role="img"
                >
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="40%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="formattedDate"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    interval={xAxisInterval}
                    tick={{ fontSize: 11 }}
                    height={50}
                  />

                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    dx={-8}
                    width={50}
                    domain={yAxisDomain as [number, number]}
                  />

                  <ReferenceLine
                    y={averageValue}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    opacity={0.4}
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
                    dataKey={valueKey}
                    stroke="var(--chart-primary)"
                    strokeWidth={3}
                    fill="url(#portfolioGradient)"
                    isAnimationActive={true}
                    animationDuration={500}
                   
                  />
                </AreaChart>
              ) : chartType === 'breakdown' && enableBreakdown ? (
                <ComposedChart
                  accessibilityLayer
                  data={data}
                  margin={{ top: 15, right: 20, left: 15, bottom: 15 }}
                  barSize={45}
                  barCategoryGap={20}
                >
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="formattedDate"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                    interval={xAxisInterval}
                    tick={{ fontSize: 11 }}
                    height={50}
                  />

                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    dx={-8}
                    width={50}
                    domain={yAxisDomain as [number, number]}
                  />

                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                  <Bar
                    dataKey={liabilitiesKey}
                    stackId="a"
                    fill="rgb(246,115,49)"
                    name="Liabilities"
                    radius={[0, 0, 8, 8]}
                    isAnimationActive={true}
                    animationDuration={500}
                    activeBar={false}
                  />
                  <Bar
                    dataKey={assetsKey}
                    stackId="a"
                    fill="rgb(246,193,152)"
                    name="Assets"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={500}
                    activeBar={false}
                  />

                  <Line
                    type="linear"
                    dataKey={netWorthKey}
                    stroke="var(--muted-foreground)"
                    strokeWidth={3.5}
                    strokeDasharray="5 5"
                    dot={<CustomDot />}
                    activeDot={{ r: 5 }}
                    name="Net Worth"
                    isAnimationActive={true}
                    animationDuration={500}
                    yAxisId="right"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    dx={8}
                    width={50}
                    domain={yAxisDomain as [number, number]}
                  />
                </ComposedChart>
              ) : null}
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </section>
  );
}
