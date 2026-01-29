'use client';

/**
 * Spending Velocity Indicator Component
 * Shows spending rate across different time periods
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import type { SpendingVelocity } from '@/lib/types/budget-analytics';

interface SpendingVelocityIndicatorProps {
  velocity: SpendingVelocity;
}

const getVelocityStatus = (
  current: number,
  average: number | undefined
): { label: string; color: string; icon: React.ReactNode } => {
  if (!average) {
    return { label: 'Unknown', color: 'text-gray-500', icon: <Clock className="h-4 w-4" /> };
  }

  const ratio = current / average;
  if (ratio > 1.5) {
    return {
      label: 'Very High',
      color: 'text-red-500',
      icon: <TrendingUp className="h-4 w-4" />,
    };
  }
  if (ratio > 1.2) {
    return {
      label: 'High',
      color: 'text-orange-500',
      icon: <TrendingUp className="h-4 w-4" />,
    };
  }
  if (ratio < 0.8) {
    return {
      label: 'Low',
      color: 'text-green-500',
      icon: <Clock className="h-4 w-4" />,
    };
  }
  return { label: 'Normal', color: 'text-blue-500', icon: <Clock className="h-4 w-4" /> };
};

export function SpendingVelocityIndicator({
  velocity,
}: SpendingVelocityIndicatorProps) {
  // Provide safe defaults if velocity data is incomplete
  const dailyAverage = velocity?.dailyAverage ?? 0;
  const weeklyAverage = velocity?.weeklyAverage ?? 0;
  const monthlyAverage = velocity?.monthlyAverage ?? 0;

  const dailyStatus = getVelocityStatus(dailyAverage, monthlyAverage > 0 ? monthlyAverage / 30 : undefined);
  const weeklyStatus = getVelocityStatus(
    weeklyAverage,
    monthlyAverage > 0 ? monthlyAverage / 4 : undefined
  );

  return (
    <div className="space-y-4">
      {/* Daily Velocity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Daily Spending Velocity
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Spending</p>
              <p className="text-3xl font-bold text-primary">
                ${dailyAverage.toFixed(2)}
              </p>
            </div>

            <div className={`flex items-center gap-2 ${dailyStatus.color}`}>
              {dailyStatus.icon}
              <span className="font-medium">{dailyStatus.label}</span>
            </div>
          </div>

          {velocity.dailyProjectedMonthly && (
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Projected Monthly (at current rate)
              </p>
              <p className="text-2xl font-bold">${velocity.dailyProjectedMonthly.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Velocity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Weekly Spending Velocity
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week&apos;s Spending</p>
              <p className="text-3xl font-bold text-primary">
                ${weeklyAverage.toFixed(2)}
              </p>
            </div>

            <div className={`flex items-center gap-2 ${weeklyStatus.color}`}>
              {weeklyStatus.icon}
              <span className="font-medium">{weeklyStatus.label}</span>
            </div>
          </div>

          {velocity.weeklyProjectedMonthly && (
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Projected Monthly (at current rate)
              </p>
              <p className="text-2xl font-bold">${velocity.weeklyProjectedMonthly.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Velocity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Monthly Spending Average
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Average</p>
              <p className="text-3xl font-bold text-primary">
                ${monthlyAverage.toFixed(2)}
              </p>
            </div>

            <Badge variant="outline">Baseline</Badge>
          </div>

          {velocity.monthlyTrend && (
            <div className="p-3 bg-secondary rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">3-Month Trend</p>
              <div className="space-y-1">
                {velocity.monthlyTrend.map((month, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Month {idx + 1}</span>
                    <span className="font-medium">${month.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning Alert */}
      {dailyStatus.label === 'Very High' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your spending velocity is very high! At current rate, you&apos;ll exceed your monthly
            budget. Consider reviewing your spending and making adjustments.
          </AlertDescription>
        </Alert>
      )}

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Velocity Comparison</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-sm font-medium mb-2 pb-2 border-b">
              <div>Period</div>
              <div className="text-right">Amount</div>
              <div className="text-right">vs Monthly</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Daily</div>
              <div className="text-right font-medium">${dailyAverage.toFixed(2)}</div>
              <div className="text-right text-muted-foreground">
                {monthlyAverage > 0 ? ((dailyAverage / (monthlyAverage / 30)) * 100).toFixed(0) : '0'}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">Weekly</div>
              <div className="text-right font-medium">${weeklyAverage.toFixed(2)}</div>
              <div className="text-right text-muted-foreground">
                {monthlyAverage > 0 ? ((weeklyAverage / (monthlyAverage / 4)) * 100).toFixed(0) : '0'}%
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm border-t pt-2 mt-2">
              <div className="font-medium">Monthly</div>
              <div className="text-right font-bold">${monthlyAverage.toFixed(2)}</div>
              <div className="text-right font-medium">100%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
