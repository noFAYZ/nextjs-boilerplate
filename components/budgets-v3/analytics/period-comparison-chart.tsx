'use client';

/**
 * Period Comparison Chart Component
 * Compares spending between current and previous periods
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PeriodComparison } from '@/lib/types/budget-analytics';

interface PeriodComparisonChartProps {
  data: PeriodComparison[];
}

const getChangeColor = (change: number): string => {
  if (change > 0) return '#ef4444'; // red for increase
  if (change < 0) return '#10b981'; // green for decrease
  return '#6b7280'; // gray for no change
};

export function PeriodComparisonChart({ data }: PeriodComparisonChartProps) {
  interface TooltipPayload {
    payload: PeriodComparison;
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload?.length) {
      const item = payload[0].payload;
      const item2 = payload[1]?.payload;

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg space-y-1">
          <p className="font-medium">{item.period}</p>
          <p className="text-sm text-primary">Current: ${item.current.toFixed(2)}</p>
          {item2 && (
            <p className="text-sm text-muted-foreground">Previous: ${item.previous.toFixed(2)}</p>
          )}
          {item.change !== undefined && (
            <p
              className="text-xs font-medium"
              style={{ color: getChangeColor(item.change) }}
            >
              {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
              {' '}({item.changePercent?.toFixed(1) || '0'}%)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate overall stats
  const totalCurrentSpending = data.reduce((sum, d) => sum + d.current, 0);
  const totalPreviousSpending = data.reduce((sum, d) => sum + d.previous, 0);
  const overallChange = totalCurrentSpending - totalPreviousSpending;
  const overallChangePercent = ((overallChange / totalPreviousSpending) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Current Period</p>
            <p className="text-2xl font-bold">${totalCurrentSpending.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Previous Period</p>
            <p className="text-2xl font-bold">${totalPreviousSpending.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Change</p>
            <p
              className="text-2xl font-bold"
              style={{ color: getChangeColor(overallChange) }}
            >
              {overallChange > 0 ? '+' : ''}{overallChange.toFixed(2)}
            </p>
            <p
              className="text-xs font-medium mt-1"
              style={{ color: getChangeColor(overallChange) }}
            >
              ({overallChangePercent > 0 ? '+' : ''}{overallChangePercent.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Bar dataKey="current" fill="#3b82f6" name="Current Period" radius={[8, 8, 0, 0]} />
              <Bar dataKey="previous" fill="#9ca3af" name="Previous Period" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((item, index) => {
              const change = item.current - item.previous;
              const changePercent = item.changePercent || ((change / item.previous) * 100);

              return (
                <div key={index} className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-medium text-sm">{item.period}</span>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: getChangeColor(change),
                        color: getChangeColor(change),
                      }}
                    >
                      {change > 0 ? '📈' : '📉'} {changePercent.toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Current: ${item.current.toFixed(2)}</span>
                    <span className="text-muted-foreground">Previous: ${item.previous.toFixed(2)}</span>
                  </div>

                  {/* Change bar */}
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min((item.current / item.previous) * 100, 100)}%`,
                        backgroundColor: getChangeColor(change),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
