'use client';

/**
 * Forecast Chart Component
 * Displays spending forecast with historical data and confidence bands
 */

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectedDataPoint } from '@/lib/types/budget-forecasting';

interface ForecastChartProps {
  historicalData: ProjectedDataPoint[];
  projectedData: ProjectedDataPoint[];
  envelopeName: string;
  showConfidenceBands?: boolean;
  chartType?: 'line' | 'area' | 'composed';
}

interface ChartDataPoint extends ProjectedDataPoint {
  date: string;
  isProjected: boolean;
}

export function ForecastChart({
  historicalData,
  projectedData,
  envelopeName,
  showConfidenceBands = true,
  chartType = 'area',
}: ForecastChartProps) {
  // Combine historical and projected data with date labels
  const chartData: ChartDataPoint[] = [
    ...historicalData.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isProjected: false,
    })),
    ...projectedData.map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isProjected: true,
    })),
  ];

  interface TooltipPayload {
    payload: ChartDataPoint;
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.date}</p>
          <p className="text-sm text-primary">
            Amount: ${data.amount?.toFixed(2) || '0'}
          </p>
          {data.upperBound && (
            <p className="text-xs text-muted-foreground">
              Range: ${data.lowerBound?.toFixed(2) || '0'} - ${data.upperBound.toFixed(2)}
            </p>
          )}
          {data.confidence && (
            <p className="text-xs text-muted-foreground">
              Confidence: {(data.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const historicalEnd = historicalData.length;
  const projectionStartIndex = historicalEnd;

  if (chartType === 'line') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{envelopeName} Spending Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Historical data */}
              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                name="Historical Spending"
                isAnimationActive={false}
                data={chartData.slice(0, historicalEnd)}
              />

              {/* Projected data */}
              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Forecast"
                isAnimationActive={false}
                data={chartData.slice(projectionStartIndex)}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (chartType === 'composed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{envelopeName} Spending Forecast with Confidence Bands</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Confidence band area */}
              {showConfidenceBands && (
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  fill="var(--primary)"
                  stroke="none"
                  fillOpacity={0.1}
                  name="Upper Bound"
                  isAnimationActive={false}
                />
              )}

              {/* Actual forecast line */}
              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                name="Forecast"
                isAnimationActive={false}
              />

              {/* Lower bound */}
              {showConfidenceBands && (
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  fill="var(--background)"
                  stroke="none"
                  name="Lower Bound"
                  isAnimationActive={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{envelopeName} Spending Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Area
              type="monotone"
              dataKey="amount"
              fill="var(--primary)"
              stroke="var(--primary)"
              fillOpacity={0.2}
              name="Spending"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
