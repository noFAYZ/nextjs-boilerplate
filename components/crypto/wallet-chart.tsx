'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, Minus, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
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
}

// Enhanced custom tooltip for better UX
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const change = data.previousValue ? ((value - data.previousValue) / data.previousValue) * 100 : 0;
    
    return (
      <div className="bg-background/95 backdrop-blur-md border rounded-xl p-4 shadow-xl border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-primary/80" />
          <span className="text-sm font-semibold text-foreground">
            ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{data.formattedDate}</p>
        {change !== 0 && (
          <div className="flex items-center gap-1">
            {change > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              "text-xs font-medium",
              change > 0 ? "text-green-500" : "text-red-500"
            )}>
              {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};


export function WalletChart({ walletAddress, className, height = 300, compact = false }: WalletChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7D');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: '1D', label: '1D' },
    { value: '7D', label: '7D' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'ALL' },
  ];

  // Fetch chart data from Zerion service
  useEffect(() => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    
    zerionChartService.getPortfolioTimeline({
      address: walletAddress,
      period: selectedPeriod,
      currency: 'usd'
    })
    .then((data) => {
      setChartData(data);
      console.log('Loaded chart data:', data);
    })
    .catch((error) => {
      console.error('Failed to load chart data:', error);
      // Set empty data on error - the service already handles fallback to mock data
      setChartData([]);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [selectedPeriod, walletAddress]);

  // Calculate performance metrics
  const metrics = useMemo(() => {
    if (!chartData.length) return null;
    
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    const change = lastValue - firstValue;
    const changePercent = (change / firstValue) * 100;
    
    const highest = Math.max(...chartData.map(d => d.value));
    const lowest = Math.min(...chartData.map(d => d.value));
    
    return {
      current: lastValue,
      change,
      changePercent,
      highest,
      lowest,
      isPositive: change >= 0,
      isNeutral: Math.abs(changePercent) < 0.01
    };
  }, [chartData]);

  // Determine chart color based on performance
  const chartColor = useMemo(() => {
    if (!metrics) return '#6b7280'; // gray
    if (metrics.isNeutral) return '#6b7280'; // gray
    return metrics.isPositive ? '#10b981' : '#ef4444'; // green or red
  }, [metrics]);

  if (compact) {
    return (
      <div className={cn("w-full", className)}>
        {/* Minimal Header */}
        <div className="p-2 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Performance</span>
              {metrics && !isLoading && (
                <div className="flex items-center gap-1 text-xs">
                  {metrics.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span 
                    className={cn(
                      "font-semibold",
                      metrics.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {metrics.isPositive ? '+' : ''}{metrics.changePercent.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            {/* Tiny Period Filter */}
            <div className="flex items-center bg-muted p-0.5 ">
              {['1D', '7D', '1M', '6M', '1Y' ,'All'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period as TimePeriod)}
                  className={cn(
                    "h-5 px-1.5 text-xs font-medium rounded-xs",
                    selectedPeriod === period 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-background/80 "
                  )}
                  disabled={isLoading}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Pure Chart Area */}
        <div 
          className="relative"
          style={{ height }}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-5 w-5 mx-auto mb-1 opacity-50" />
                <p className="text-xs">No data</p>
              </div>
            </div>
          ) : (
            <div className=" h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="compactColorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    fill="url(#compactColorValue)"
                    dot={false}
                    activeDot={{ 
                      r: 3, 
                      stroke: chartColor,
                      strokeWidth: 1.5,
                      fill: 'hsl(var(--background))'
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

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Enhanced Header with better spacing and design */}
        <div className="p-6 pb-4 border-b bg-gradient-to-r from-background via-background/50 to-background">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Portfolio Performance</h3>
                </div>
                {metrics && !isLoading && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      {metrics.isNeutral ? (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      ) : metrics.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span 
                        className={cn(
                          "text-sm font-semibold",
                          metrics.isNeutral ? "text-muted-foreground" :
                          metrics.isPositive ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {metrics.isPositive ? '+' : ''}{metrics.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {metrics && !isLoading && (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold tracking-tight">
                    ${metrics.current.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex flex-col">
                    <span 
                      className={cn(
                        "text-sm font-medium",
                        metrics.isNeutral ? "text-muted-foreground" :
                        metrics.isPositive ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {metrics.isPositive ? '+' : ''}${Math.abs(metrics.change).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedPeriod === '1D' ? 'Today' : `${selectedPeriod} change`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Period Filter */}
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                  className={cn(
                    "h-9 px-4 text-xs font-semibold rounded-lg transition-all duration-200",
                    selectedPeriod === period.value 
                      ? "shadow-md bg-primary text-primary-foreground" 
                      : "hover:bg-muted/50"
                  )}
                  disabled={isLoading}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Chart Area */}
        <div className="px-6 py-4">
          <div 
            className="relative bg-gradient-to-br from-muted/20 via-background to-muted/10 rounded-xl border border-border/30"
            style={{ height }}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="absolute inset-0 h-8 w-8 border-2 border-primary/20 rounded-full animate-ping" />
                  </div>
                  <span className="text-sm font-medium">Loading portfolio data...</span>
                  <span className="text-xs">Fetching from Zerion API</span>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No chart data available</p>
                  <p className="text-xs">Try selecting a different time period</p>
                </div>
              </div>
            ) : (
              <div className="p-4 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="hsl(var(--border))" 
                      strokeOpacity={0.2}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="formattedDate"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                      interval="preserveStartEnd"
                      tickMargin={15}
                    />
                    <YAxis 
                      domain={['dataMin * 0.98', 'dataMax * 1.02']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                        return `$${value.toFixed(0)}`;
                      }}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      strokeWidth={3}
                      fill="url(#colorValue)"
                      activeDot={{ 
                        r: 6, 
                        stroke: chartColor,
                        strokeWidth: 3,
                        fill: 'hsl(var(--background))',
                        style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced metrics footer */}
        {metrics && !isLoading && chartData.length > 0 && (
          <div className="px-6 py-4 bg-muted/20 border-t">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Period High</p>
                <p className="text-lg font-bold text-green-600 mt-1">
                  ${metrics.highest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Period Low</p>
                <p className="text-lg font-bold text-red-600 mt-1">
                  ${metrics.lowest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Data Points</p>
                <p className="text-lg font-bold mt-1">{chartData.length}</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Volatility</p>
                <p className="text-lg font-bold mt-1">
                  {((metrics.highest - metrics.lowest) / metrics.current * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}