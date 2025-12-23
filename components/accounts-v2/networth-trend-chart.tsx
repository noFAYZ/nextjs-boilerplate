'use client';

import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface NetWorthSnapshot {
  snapshotDate: Date;
  totalNetWorth: number;
}

interface NetWorthTrendResponse {
  success: boolean;
  data: {
    period: string;
    snapshots: NetWorthSnapshot[];
    startValue: number;
    endValue: number;
    change: number;
    changePercent: number;
  };
}

interface NetWorthTrendChartProps {
  isLoading: boolean;
  balanceVisible: boolean;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';

const periodMap: Record<string, Period> = {
  '7': 'WEEK',
  '30': 'MONTH',
  '90': 'QUARTER',
  '1Y': 'YEAR',
};

export function NetWorthTrendChart({ isLoading: parentLoading, balanceVisible }: NetWorthTrendChartProps) {
  const [period, setPeriod] = useState<string>('30');

  // Fetch real trend data from API
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['networth-trend', periodMap[period]],
    queryFn: async () => {
      const response = await apiClient.get<NetWorthTrendResponse>('/api/v1/accounts/networth/trend', {
        params: { period: periodMap[period] },
      });

      // Handle the response structure - apiClient may return data directly or wrapped
      const apiResponse = response as NetWorthTrendResponse | { data: NetWorthTrendResponse };
      const trendResponse = ('data' in apiResponse && apiResponse.data.data)
        ? apiResponse.data
        : apiResponse;

      if ('data' in trendResponse && trendResponse.data) {
        return trendResponse.data;
      }

      // Fallback: return empty trend data structure if response is invalid
      return {
        period: periodMap[period],
        snapshots: [],
        startValue: 0,
        endValue: 0,
        change: 0,
        changePercent: 0,
      };
    },
    enabled: !parentLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform API data to chart format
  const data = useMemo(() => {
    if (!trendData?.snapshots) return [];

    return trendData.snapshots.map((snapshot) => ({
      date: new Date(snapshot.snapshotDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: snapshot.totalNetWorth,
      fullDate: new Date(snapshot.snapshotDate),
    }));
  }, [trendData]);

  const stats = useMemo(() => {
    if (!trendData || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

    return {
      endValue: trendData.endValue,
      changePercent: trendData.changePercent,
      maxValue,
      minValue,
      avgValue,
      isPositive: trendData.change >= 0,
    };
  }, [trendData, data]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-muted-foreground">No trend data available</div>;
  }

  return (
    <div className="w-full space-y-2 bg-card rounded-lg border border-border/50 shadow-xs">
      {/* Header with Metrics and Period Selector */}
      <div className="flex justify-between items-center gap-2 p-4">
        {/* Current Balance Metric */}
        {stats && !isLoading && (
          <div className="flex">
            {balanceVisible ? (
              <CurrencyDisplay amountUSD={stats.endValue} variant="lg" className="font-medium" />
            ) : (
              <span className="text-lg font-medium">••••</span>
            )}
          </div>
        )}

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          {(['7', '30', '90', '1Y'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)}
              className="text-xs h-7"
            >
              {p === '1Y' ? '1Y' : p + 'd'}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative -m-2" style={{ height: '256px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 40, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="networthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity={0.33} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={70}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              domain={['dataMin - 10%', 'dataMax + 10%']}
              tickCount={5}
            />

            {/* Average line */}
            <ReferenceLine
              y={stats.avgValue}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              opacity={0.4}
              label={{
                value: 'Avg',
                position: 'right',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 10,
                fontWeight: 500,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => {
                if (!balanceVisible) return ['••••', 'Net Worth'];
                return [`$${(value / 1000).toFixed(0)}K`, 'Net Worth'];
              }}
              labelFormatter={(label) => label}
            />

            <Area
              type="linear"
              dataKey="value"
              stroke={stats.isPositive ? 'hsl(var(--primary))' : 'hsl(5, 92%, 54%)'}
              strokeWidth={2.5}
              fill="url(#networthGradient)"
              isAnimationActive={true}
              animationDuration={500}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
