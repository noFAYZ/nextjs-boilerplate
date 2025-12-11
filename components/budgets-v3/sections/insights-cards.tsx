'use client';

/**
 * Insights Cards
 * Shows spending trends, month comparison, and forecasts
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface InsightCardsProps {
  currentMonthSpent: number;
  previousMonthSpent: number;
  monthlyBudget: number;
  projectedMonthlySpend?: number;
  topCategory?: {
    name: string;
    spent: number;
    allocated: number;
  };
  budgetsAtRisk?: number;
  budgetsOverBudget?: number;
  isLoading?: boolean;
}

export function InsightsCards({
  currentMonthSpent,
  previousMonthSpent,
  monthlyBudget,
  projectedMonthlySpend,
  topCategory,
  budgetsAtRisk = 0,
  budgetsOverBudget = 0,
  isLoading = false,
}: InsightCardsProps) {
  const monthlyTrend = previousMonthSpent > 0
    ? ((currentMonthSpent - previousMonthSpent) / previousMonthSpent) * 100
    : 0;

  const isIncreasing = monthlyTrend > 0;
  const trendColor = isIncreasing ? 'text-red-600' : 'text-green-600';
  const trendIcon = isIncreasing ? TrendingUp : TrendingDown;
  const TrendIcon = trendIcon;

  const projectionPercentage = monthlyBudget > 0
    ? (projectedMonthlySpend || currentMonthSpent) / monthlyBudget * 100
    : 0;

  const willOverspend = (projectedMonthlySpend || currentMonthSpent) > monthlyBudget;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Month Over Month Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Monthly Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">This vs Last Month</p>
            <div className="flex items-baseline gap-2">
              <TrendIcon className={`h-5 w-5 ${trendColor}`} />
              <span className={`text-2xl font-bold ${trendColor}`}>
                {Math.abs(monthlyTrend).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>This month: <CurrencyDisplay value={currentMonthSpent} showCurrency /></p>
            <p>Last month: <CurrencyDisplay value={previousMonthSpent} showCurrency /></p>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            {isIncreasing
              ? 'Your spending is increasing. Check which categories are higher.'
              : 'Great! You\'re spending less than last month.'}
          </p>
        </CardContent>
      </Card>

      {/* Budget Projection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" />
            End-of-Month Projection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Projected Total Spend</p>
            <p className="text-2xl font-bold">
              <CurrencyDisplay value={projectedMonthlySpend || currentMonthSpent} showCurrency />
            </p>
          </div>
          <Progress value={Math.min(projectionPercentage, 100)} className="h-2" />
          <div className="text-xs space-y-1">
            <p className="text-muted-foreground">
              Budget: <CurrencyDisplay value={monthlyBudget} showCurrency />
            </p>
            {willOverspend && (
              <p className="text-red-600 font-medium">
                Projected overspend: <CurrencyDisplay
                  value={Math.abs((projectedMonthlySpend || currentMonthSpent) - monthlyBudget)}
                  showCurrency
                />
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {budgetsAtRisk > 0 && (
              <div className="flex items-center justify-between text-sm p-2 bg-amber-50 rounded border border-amber-200">
                <span className="text-amber-900 font-medium">At Risk</span>
                <span className="text-amber-900 font-bold">{budgetsAtRisk}</span>
              </div>
            )}
            {budgetsOverBudget > 0 && (
              <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded border border-red-200">
                <span className="text-red-900 font-medium">Over Budget</span>
                <span className="text-red-900 font-bold">{budgetsOverBudget}</span>
              </div>
            )}
          </div>
          {budgetsAtRisk === 0 && budgetsOverBudget === 0 && (
            <p className="text-sm text-green-600 font-medium">✓ All budgets on track</p>
          )}
          <p className="text-xs text-muted-foreground">
            {budgetsAtRisk + budgetsOverBudget === 0
              ? 'Great job staying within your budgets!'
              : 'Check categories with alerts'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
