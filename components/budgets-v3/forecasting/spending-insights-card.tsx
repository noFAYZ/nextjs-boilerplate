'use client';

/**
 * Spending Insights Card Component
 * Displays analysis of spending patterns and trends
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  CheckCircle,
  Target,
} from 'lucide-react';
import type { SpendingInsights, SpendingTrend } from '@/lib/types/budget-forecasting';

interface SpendingInsightsCardProps {
  insights: SpendingInsights;
}

const getTrendIcon = (trend: SpendingTrend) => {
  if (trend === 'increasing') {
    return <TrendingUp className="h-4 w-4 text-red-500" />;
  }
  if (trend === 'decreasing') {
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  }
  return <Zap className="h-4 w-4 text-blue-500" />;
};

const getTrendLabel = (trend: SpendingTrend): string => {
  if (trend === 'increasing') return 'Increasing';
  if (trend === 'decreasing') return 'Decreasing';
  return 'Stable';
};

const getTrendColor = (trend: SpendingTrend): string => {
  if (trend === 'increasing') return 'bg-red-500';
  if (trend === 'decreasing') return 'bg-green-500';
  return 'bg-blue-500';
};

export function SpendingInsightsCard({ insights }: SpendingInsightsCardProps) {
  return (
    <div className="space-y-4">
      {/* Main Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {getTrendIcon(insights.trend)}
            Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Direction</span>
            <Badge className={getTrendColor(insights.trend)}>
              {getTrendLabel(insights.trend)}
            </Badge>
          </div>

          {insights.trendStrength && (
            <div>
              <span className="text-sm text-muted-foreground">Trend Strength</span>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(insights.trendStrength * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(insights.trendStrength * 100).toFixed(0)}% confidence
              </p>
            </div>
          )}

          {insights.changePercent && (
            <div>
              <p className="text-sm">
                <span className="text-muted-foreground">Month-over-month change: </span>
                <span
                  className={
                    insights.changePercent > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'
                  }
                >
                  {insights.changePercent > 0 ? '+' : ''}
                  {insights.changePercent.toFixed(1)}%
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.keyInsights && insights.keyInsights.length > 0 ? (
            <ul className="space-y-3">
              {insights.keyInsights.map((insight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-secondary rounded-lg"
                >
                  {insight.type === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  )}
                  {insight.type === 'positive' && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  {insight.type === 'info' && (
                    <Zap className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}

                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No significant insights at this time
            </p>
          )}
        </CardContent>
      </Card>

      {/* Budget Recommendation */}
      {insights.recommendedBudget && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommended Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Suggested Budget Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ${insights.recommendedBudget.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on your {insights.trend} trend and historical spending patterns
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
