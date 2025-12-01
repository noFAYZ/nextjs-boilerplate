'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface MonthlyBudgetSummaryProps {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
}

export function MonthlyBudgetSummary({
  totalAllocated,
  totalSpent,
  totalRemaining,
}: MonthlyBudgetSummaryProps) {
  const percentageUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  const isHealthy = percentageUsed <= 75;
  const isAtRisk = percentageUsed > 75 && percentageUsed < 100;
  const isExceeded = percentageUsed >= 100;

  const getHealthColor = () => {
    if (isExceeded) return 'from-red-50 to-red-50/50 dark:from-red-950/30 dark:to-red-950/10 border-red-200 dark:border-red-900/50';
    if (isAtRisk) return 'from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10 border-amber-200 dark:border-amber-900/50';
    return 'from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 border-green-200 dark:border-green-900/50';
  };

  const getHealthIndicator = () => {
    if (isExceeded) {
      return {
        icon: AlertCircle,
        label: 'Budget Exceeded',
        color: 'text-red-600 dark:text-red-400',
      };
    }
    if (isAtRisk) {
      return {
        icon: AlertCircle,
        label: 'At Risk',
        color: 'text-amber-600 dark:text-amber-400',
      };
    }
    return {
      icon: Zap,
      label: 'On Track',
      color: 'text-green-600 dark:text-green-400',
    };
  };

  const health = getHealthIndicator();
  const HealthIcon = health.icon;

  return (
    <Card className={`bg-gradient-to-br ${getHealthColor()} border-border/80 rounded-xs p-4`}>
      {/* Header with Health Status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-md font-semibold">Current Month Budget</h2>
        {/* Health Status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/20 ${health.color}`}>
          <HealthIcon className="h-4 w-4" />
          <span className="text-xs font-semibold">{health.label}</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {/* Allocated */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-medium mb-2">ALLOCATED</p>
          <div className="text-2xl font-bold">
            <CurrencyDisplay value={totalAllocated} showCurrency className="text-lg" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total allocation</p>
          </div>

          {/* Spent */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-2">SPENT</p>
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <CurrencyDisplay value={totalSpent} showCurrency className="text-lg" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>

          {/* Remaining */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-2">REMAINING</p>
            <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
              totalRemaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {totalRemaining >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <CurrencyDisplay value={Math.abs(totalRemaining)} showCurrency className="text-lg" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRemaining >= 0 ? 'Available' : 'Over budget'}
            </p>
          </div>

          {/* Percentage */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-2">USAGE</p>
            <p className="text-2xl font-bold">{percentageUsed.toFixed(0)}%</p>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isExceeded ? 'bg-red-500' : isAtRisk ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>
          </div>
        </div>
     
    </Card>
  );
}
