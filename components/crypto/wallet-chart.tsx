'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { zerionChartService, ChartDataPoint as ZerionDataPoint } from '@/lib/services/zerion-chart-api';

export type TimePeriod = '1D' | '7D' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface ChartDataPoint {
  timestamp: number;
  value: number;
  date: string;
  formattedDate: string;
}

interface WalletChartProps {
  walletAddress?: string;
  className?: string;
  height?: number;
  compact?: boolean;
  showPeriodFilter?: boolean;
  showMetrics?: boolean;
}

// Minimal custom tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { formattedDate: string } }> }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const data = payload[0].payload;

    return (
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg text-xs">
        <div className="font-medium">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="text-muted-foreground">{data.formattedDate}</div>
      </div>
    );
  }
  return null;
};


export function WalletChart({
  walletAddress,
  className,
  height = 300,
  compact = false,
  showPeriodFilter = true,
  showMetrics = true
}: WalletChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7D');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Memoize periods array to prevent unnecessary re-renders
  const periods = useMemo(() => [
    { value: '1D' as TimePeriod, label: '1D' },
    { value: '7D' as TimePeriod, label: '7D' },
    { value: '1M' as TimePeriod, label: '1M' },

    { value: '6M' as TimePeriod, label: '6M' },
    { value: '1Y' as TimePeriod, label: '1Y' },
    { value: 'ALL' as TimePeriod, label: 'ALL' },
  ], []);

  // Optimized data fetching with error handling
  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchData = async () => {
      try {
        const data = await zerionChartService.getPortfolioTimeline({
          address: walletAddress,
          period: selectedPeriod,
          currency: 'usd'
        });
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, walletAddress]);

  // Optimized performance metrics calculation
  const metrics = useMemo(() => {
    if (!chartData.length) return null;

    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    const change = lastValue - firstValue;
    const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

    // More efficient min/max calculation
    let highest = chartData[0].value;
    let lowest = chartData[0].value;

    for (let i = 1; i < chartData.length; i++) {
      const value = chartData[i].value;
      if (value > highest) highest = value;
      if (value < lowest) lowest = value;
    }

    const isPositive = change >= 0;
    const isNeutral = Math.abs(changePercent) < 0.01;

    return {
      current: lastValue,
      change,
      changePercent,
      highest,
      lowest,
      isPositive,
      isNeutral
    };
  }, [chartData]);

  // Memoized chart color calculation
  const chartColor = useMemo(() => {
    if (!metrics || metrics.isNeutral) return 'hsl(var(--muted-foreground))';
    return metrics.isPositive ? '#00A632' : '#ef4444';
  }, [metrics]);

  if (compact) {
    return (
      <div className={cn("w-full min-w-sm", className)}>
        {/* Minimal Performance Indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {metrics && !isLoading && (
              <>
                {metrics.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  metrics.isPositive ? "text-green-500" : "text-red-500"
                )}>
                  {metrics.isPositive ? '+' : ''}{metrics.changePercent.toFixed(1)}%
                </span>
              </>
            )}
          </div>

          {/* Minimal Period Filter */}
          {showPeriodFilter && (
            <div className="flex items-center gap-0.5">
              {['1D', '7D', '1M', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as TimePeriod)}
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded transition-colors",
                    selectedPeriod === period
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  disabled={isLoading}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clean Chart Area */}
        <div className="relative" style={{ height }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-muted-foreground">No data</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="compactGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={1.5}
                  fill="url(#compactGradient)"
                  dot={false}
                  activeDot={{
                    r: 2,
                    stroke: chartColor,
                    strokeWidth: 1,
                    fill: 'white'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-4">
     

        {/* Clean Period Filter */}
        {showPeriodFilter && (
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  selectedPeriod === period.value
                    ? "bg-background text-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                disabled={isLoading}
              >
                {period.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Value Display */}
      {showMetrics && metrics && !isLoading && (
        <div className="mb-4">
          <div className="text-xl sm:text-2xl font-semibold ">
            ${metrics.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            {metrics && !isLoading && (
            <span className={cn(
              "text-xs font-medium ml-2",
              metrics.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {metrics.isPositive ? '+' : ''}{metrics.changePercent.toFixed(1)}%
            </span>
          )}
          </div>
          <div className="flex items-center gap-1 text-sm">
        
            <span className={cn(
              "font-medium",
              metrics.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {metrics.isPositive ? '+' : ''}${Math.abs(metrics.change).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-muted-foreground">
              {selectedPeriod === '1D' ? 'today' : `${selectedPeriod}`}
            </span>

      
          </div>
        
        </div>
      )}

      {/* Clean Chart Area */}
      <div className="relative bg-muted/20 rounded-lg" style={{ height }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-sm">No data available</div>
              <div className="text-xs">Try a different period</div>
            </div>
          </div>
        ) : (
          <div className="p-2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={1.5}
                  fill="url(#chartGradient)"
                  dot={false}
                  activeDot={{
                    r: 3,
                    stroke: chartColor,
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}