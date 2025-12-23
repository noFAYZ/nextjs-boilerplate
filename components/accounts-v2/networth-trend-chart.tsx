'use client';

import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

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

    return {
      startValue: trendData.startValue,
      endValue: trendData.endValue,
      change: trendData.change,
      changePercent: trendData.changePercent,
      maxValue,
      minValue,
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
    <div className="bg-card rounded-lg border border-border/50 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Net Worth Trend</h3>
          <div className="flex items-center gap-1 text-sm font-semibold">
            {stats.isPositive ? (
              <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +{stats.changePercent.toFixed(2)}%
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-500">
                {stats.changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Start</p>
            <p className="text-lg font-bold text-foreground">
              {balanceVisible ? `$${(stats.startValue / 1000).toFixed(0)}K` : '••••'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Change</p>
            <p className={cn('text-lg font-bold', stats.isPositive ? 'text-emerald-600' : 'text-red-600')}>
              {balanceVisible ? (
                <>
                  {stats.isPositive ? '+' : '-'}${(Math.abs(stats.change) / 1000).toFixed(0)}K
                </>
              ) : (
                '••••'
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Current</p>
            <p className="text-lg font-bold text-foreground">
              {balanceVisible ? `$${(stats.endValue / 1000).toFixed(0)}K` : '••••'}
            </p>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {(['7', '30', '90', '1Y'] as const).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={period === p ? 'default' : 'outline'}
            onClick={() => setPeriod(p)}
            className="text-xs"
          >
            {p === '1Y' ? '1Y' : p + 'd'}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
            <Line
              type="monotone"
              dataKey="value"
              stroke={stats.isPositive ? 'hsl(var(--primary))' : 'hsl(5, 92%, 54%)'}
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Min/Max Info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">High</p>
          <p className="text-sm font-bold text-foreground">
            {balanceVisible ? `$${(stats.maxValue / 1000).toFixed(0)}K` : '••••'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Low</p>
          <p className="text-sm font-bold text-foreground">
            {balanceVisible ? `$${(stats.minValue / 1000).toFixed(0)}K` : '••••'}
          </p>
        </div>
      </div>
    </div>
  );
}
