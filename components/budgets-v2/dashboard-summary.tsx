'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, TrendingDown, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface DashboardSummaryProps {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  totalEnvelopes?: number;
  activeEnvelopes?: number;
  envelopesAtRisk?: number;
  envelopesOverBudget?: number;
  isLoading?: boolean;
}

export function DashboardSummary({
  totalAllocated,
  totalSpent,
  totalRemaining,
  totalEnvelopes = 0,
  activeEnvelopes = 0,
  envelopesAtRisk = 0,
  envelopesOverBudget = 0,
  isLoading = false,
}: DashboardSummaryProps) {
  const percentageUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const getHealthStatus = () => {
    if (percentageUsed >= 100) {
      return {
        label: 'Over Budget',
        icon: AlertCircle,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50',
      };
    }
    if (percentageUsed >= 75) {
      return {
        label: 'At Risk',
        icon: AlertTriangle,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50',
      };
    }
    return {
      label: 'On Track',
      icon: Zap,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50',
    };
  };

  const health = getHealthStatus();
  const HealthIcon = health.icon;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2 w-20"></div>
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Summary Card */}
      <Card
        className={`border-border/80 rounded-xs p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Allocated */}
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
              Allocated
            </p>
            <p className="text-2xl font-bold mb-1">
              <CurrencyDisplay value={totalAllocated} showCurrency />
            </p>
            <p className="text-xs text-muted-foreground">
              {totalEnvelopes} envelope{totalEnvelopes !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Spent */}
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
              Spent
            </p>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              <p className="text-2xl font-bold">
                <CurrencyDisplay value={totalSpent} showCurrency />
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {percentageUsed.toFixed(1)}% used
            </p>
          </div>

          {/* Remaining */}
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
              Remaining
            </p>
            <div className="flex items-center gap-2">
              {totalRemaining >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <p
                className={`text-2xl font-bold ${
                  totalRemaining >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                <CurrencyDisplay value={Math.abs(totalRemaining)} showCurrency />
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRemaining >= 0 ? 'Available' : 'Over budget'}
            </p>
          </div>

          {/* Health Status */}
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
              Status
            </p>
            <div className="flex items-center gap-2 mb-3">
              <HealthIcon className={`h-5 w-5 ${health.color}`} />
              <p className={`font-semibold text-sm ${health.color}`}>
                {health.label}
              </p>
            </div>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-muted-foreground">Active:</span>{' '}
                <span className="font-semibold">{activeEnvelopes}</span>
              </p>
              {envelopesAtRisk > 0 && (
                <p className="text-amber-600 dark:text-amber-400">
                  {envelopesAtRisk} at risk
                </p>
              )}
              {envelopesOverBudget > 0 && (
                <p className="text-red-600 dark:text-red-400">
                  {envelopesOverBudget} over budget
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground">
              BUDGET USAGE
            </p>
            <p className="text-sm font-bold">{percentageUsed.toFixed(1)}%</p>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                percentageUsed >= 100
                  ? 'bg-red-500'
                  : percentageUsed >= 75
                  ? 'bg-amber-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      {(envelopesAtRisk > 0 || envelopesOverBudget > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {envelopesAtRisk > 0 && (
            <Card className="p-3 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Envelopes At Risk
                  </p>
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                    {envelopesAtRisk}
                  </p>
                </div>
              </div>
            </Card>
          )}
          {envelopesOverBudget > 0 && (
            <Card className="p-3 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    Over Budget
                  </p>
                  <p className="text-sm font-bold text-red-900 dark:text-red-300">
                    {envelopesOverBudget}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
