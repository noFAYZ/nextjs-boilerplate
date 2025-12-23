'use client';

import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccountChart } from '@/lib/queries/use-accounts-data';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { ChartConfig, ChartContainer, ChartTooltip } from '../ui/chart';
import { cn, formatCurrency } from '@/lib/utils';

interface AccountBalanceChartProps {
  accountId: string;
  balanceVisible: boolean;
}
interface ChartDataPoint {
  timestamp: string
  value: number
  available?: number
}

type Period = '7d' | '30d' | '90d' | '1y' | 'all';

export function AccountBalanceChart({ accountId, balanceVisible }: AccountBalanceChartProps) {
  const [period, setPeriod] = useState<Period>('30d');

  // Fetch account chart data from query hook
  const { data: chartData, isLoading } = useAccountChart(accountId, period);

  // Transform API data to chart format
  const data = useMemo(() => {
    if (!chartData?.dataPoints) return [];

    return chartData.dataPoints.map((point) => ({
      date: new Date(point.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: point.value,
      available: point.available,
      fullDate: new Date(point.timestamp),
    }));
  }, [chartData]);

  const stats = useMemo(() => {
    if (!chartData || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

    return {
      currentBalance: chartData.summary.currentBalance,
      highestBalance: maxValue,
      lowestBalance: minValue,
      averageBalance: avgValue,
      isPositive: chartData.summary.currentBalance >= minValue,
    };
  }, [chartData, data]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!stats || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No balance history available</div>;
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


  const netWorth = data.value;


  let formattedDate: string;
  try {
    formattedDate = new Date(data.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.warn('[NetWorthChart] Date formatting error:', error);
    formattedDate = data.timestamp;
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        {/* Header */}
        <div className="space-y-0.5">
          <time className="text-[10px] text-muted-foreground font-medium" dateTime={data.timestamp}>
            {formattedDate}
          </time>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold tabular-nums">
              {formatCurrency(netWorth)}
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
      <circle cx={cx} cy={cy} r={2.5} fill="white" stroke="var(--chart-1)" strokeWidth={2} />
    </g>
  );
};


  return (
    <div className="w-full space-y-2 ">
      {/* Header with Metrics and Period Selector */}
      <div className="flex justify-end items-center gap-2 p-4">
        {/* Current Balance Metric 
        {stats && !isLoading && (
          <div className="flex">
            {balanceVisible ? (
              <CurrencyDisplay amountUSD={stats.currentBalance} variant="lg" className="font-medium" />
            ) : (
              <span className="text-lg font-medium">••••</span>
            )}
          </div>
        )}*/}

        {/* Period Selector */}
        <div className="flex items-center gap-1">
          {(['7d', '30d', '90d', '1y', 'all'] as const).map((p) => (
            <Button
              key={p}
              size="xs"
              variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)}
           
            >
              {p === '1y' ? '1Y' : p === '7d' ? '7d' : p === '30d' ? '30d' : p === '90d' ? '90d' : 'All'}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative -m-2" style={{ height: '226px' }}>
   
        <ChartContainer
            config={{
              value: {
                label: 'Net Worth',
                color: 'var(--chart-1)',
              },
            
           
            } satisfies ChartConfig}
            className="h-full w-full "
          >
            <ResponsiveContainer width="100%" height="100%">
          
                <AreaChart
                  data={chartData.dataPoints}
                  margin={{  top:40 }}
                  role="img"
                  aria-label={`Net worth area chart showing ${chartData.dataPoints?.length} data points over ${period}`}
                >
                  <defs>
                    <linearGradient id="networthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="40%" stopColor="var(--chart-1)" stopOpacity={0.33} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                {/* */}  <CartesianGrid vertical={false} /> 

              

                 
             {/*      <ReferenceLine
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
                  /> */}

                  <ChartTooltip content={<CustomTooltip />} cursor={false} />

                  <Area
                    type="linear"
                    dataKey="value"
                    stroke="var(--chart-primary)"
                    strokeWidth={3}
                    fill="url(#networthGradient)"
                    aria-label="Net worth area"
                    isAnimationActive={true}
                    animationDuration={500}
                    dot={<CustomNetWorthDot />}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
           
            </ResponsiveContainer>
          </ChartContainer>
      </div>
    </div>
  );
}
