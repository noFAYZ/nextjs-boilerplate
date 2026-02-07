'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { Loader2, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Bar,
} from 'recharts';
import { cn } from '@/lib/utils';
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
import {
  formatCompactCurrency,
  formatCurrency,
  formatYAxisLabel,
  calculateXAxisInterval,
  calculateYAxisDomain,
  calculateMetrics,
} from './portfolio-chart-utils';
import { usePortfolioData, type TimePeriod, type ChartDataPoint } from './use-portfolio-data';

export type PortfolioChartMode = 'compact' | 'full';
export type ChartType = 'area' | 'breakdown';

interface PortfolioChartProps {
  mode?: PortfolioChartMode;
  initialChartType?: ChartType;
  data?: ChartDataPoint[];
  walletAddress?: string;
  height?: number;
  showPeriodFilter?: boolean;
  showMetrics?: boolean;
  showXAxis?: boolean;
  enableArea?: boolean;
  enableBreakdown?: boolean;
  selectedPeriod?: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
  externalIsLoading?: boolean;
  className?: string;
  valueKey?: string;
  assetsKey?: string;
  liabilitiesKey?: string;
  netWorthKey?: string;
}

// ============================================================================
// Custom Tooltip Component
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint; value: number }>;
}

const CustomTooltip = memo(({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const { formattedDate } = payload[0].payload;
  const value = payload[0].value;

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <div className="space-y-0.5">
          {formattedDate && (
            <time className="text-[10px] text-muted-foreground font-medium">
              {formattedDate}
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
});

CustomTooltip.displayName = 'CustomTooltip';

// ============================================================================
// Custom Dot Component
// ============================================================================

interface CustomDotProps {
  cx?: number;
  cy?: number;
}

const CustomDot = memo(({ cx, cy }: CustomDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="white"
      stroke="var(--chart-1)"
      strokeWidth={2}
    />
  );
});

CustomDot.displayName = 'CustomDot';

// ============================================================================
// Loading & Empty States
// ============================================================================

const ChartSkeleton = memo(({ height }: { height: number }) => (
  <div
    className="relative w-full flex items-center justify-center"
    style={{ height }}
  >
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading chart...</p>
    </div>
  </div>
));

ChartSkeleton.displayName = 'ChartSkeleton';

const EmptyState = memo(() => (
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
));

EmptyState.displayName = 'EmptyState';

const ErrorState = memo(({ error }: { error: unknown }) => (
  <div className="absolute inset-0 flex items-center justify-center p-6">
    <div className="text-center max-w-sm space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-destructive/10">
        <Loader2 className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">Failed to Load Chart</h3>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : 'An error occurred. Please try again.'}
        </p>
      </div>
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

// ============================================================================
// Period Filter Component
// ============================================================================

const PERIODS: Array<{ value: TimePeriod; label: string }> = [
  { value: '1D', label: '1D' },
  { value: '7D', label: '7D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'ALL' },
];

interface PeriodFilterProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  size?: 'sm' | 'xs';
  maxItems?: number;
}

const PeriodFilter = memo(
  ({ value, onChange, size = 'xs', maxItems }: PeriodFilterProps) => {
    const periods = maxItems ? PERIODS.slice(0, maxItems) : PERIODS;

    return (
      <Select value={value} onValueChange={(v) => onChange(v as TimePeriod)}>
        <SelectTrigger
          className="gap-1 font-medium rounded-none shadow-none"
          size={size}
          variant="outline2"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-none shadow-none">
          {periods.map((period) => (
            <SelectItem
              key={period.value}
              value={period.value}
              className="rounded-none"
            >
              <span className="font-medium text-xs">{period.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

PeriodFilter.displayName = 'PeriodFilter';

 
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
  showXAxis = true,
  enableArea = true,
  enableBreakdown = true,
  selectedPeriod = '7D',
  onPeriodChange,
  externalIsLoading = false,
  className,
  valueKey = 'value',
  assetsKey = 'totalAssets',
  liabilitiesKey = 'totalLiabilities',
  netWorthKey = 'totalNetWorth',
}: PortfolioChartProps) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [internalPeriod, setInternalPeriod] = useState<TimePeriod>(selectedPeriod);

  // Use custom hook for data fetching
  const { data: fetchedData, isLoading: isFetching, error } = usePortfolioData({
    walletAddress,
    period: internalPeriod,
    enabled: !!walletAddress,
  });

  const data = fetchedData.length > 0 ? fetchedData : externalData || [];
  const isLoading = walletAddress ? isFetching : externalIsLoading;

  const handlePeriodChange = useCallback((newPeriod: TimePeriod) => {
    setInternalPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  }, [onPeriodChange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!data?.length) return null;

    const key = valueKey as keyof ChartDataPoint;
    const firstValue = (data[0][key] as number) || 0;
    const lastValue = (data[data.length - 1][key] as number) || 0;

    return {
      ...calculateMetrics(lastValue, firstValue),
      current: lastValue,
    };
  }, [data, valueKey]);

  // Calculate average value
  const averageValue = useMemo(() => {
    if (!data?.length) return 0;
    const key = valueKey as keyof ChartDataPoint;
    const sum = data.reduce((acc, point) => acc + ((point[key] as number) || 0), 0);
    return sum / data.length;
  }, [data, valueKey]);

  // Calculate X-axis interval
  const xAxisInterval = useMemo(
    () => calculateXAxisInterval(data.length, internalPeriod),
    [data.length, internalPeriod]
  );

  // Calculate Y-axis domain
  const yAxisDomain = useMemo(() => {
    if (!data?.length) return [0, 100000] as const;
    const key = valueKey as keyof ChartDataPoint;
    const values = data
      .map((d) => (d[key] as number) || 0)
      .filter((v) => typeof v === 'number' && isFinite(v));
    return calculateYAxisDomain(values);
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
            <PeriodFilter
              value={internalPeriod}
              onChange={handlePeriodChange}
              size="sm"
              maxItems={4}
            />
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

                  {showXAxis && (
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
                  )}

                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatYAxisLabel(value)}
                    tickCount={4}
                    dx={-5}
                    opacity={0.7}
                    width={50}
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
      className={cn('w-full space-y-2 border border-border/80 rounded-none overflow-hidden bg-card shadow-xs pt-2  ', className)}
      role="region"
      aria-label="Portfolio Chart"
    >
      <div className="flex justify-end gap-2">
        {enableArea && enableBreakdown && (
          <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
            <SelectTrigger
              className="gap-1 font-medium h-7 text-xs rounded-none shadow-none"
              size="xs"
              variant="outline2"
            >
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
          <PeriodFilter
            value={internalPeriod}
            onChange={handlePeriodChange}
            size="xs"
          />
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
                  margin={{  bottom: -5, right: 0 }}
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

                  {showXAxis && (<>
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
                    tickFormatter={(value) => formatYAxisLabel(value)}
                    tickCount={4}
                    width={20}
                    domain={yAxisDomain as [number, number]}
                  />   </> )}

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
                    stroke="var(--chart-1)"
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

                  {showXAxis && (
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
                  )}

                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatYAxisLabel(value)}
                    tickCount={4}
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
                    tickFormatter={(value) => formatYAxisLabel(value)}
                    tickCount={4}
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
