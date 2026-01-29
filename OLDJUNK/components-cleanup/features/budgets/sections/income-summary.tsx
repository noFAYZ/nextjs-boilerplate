'use client';

/**
 * Income Summary Component
 * Shows total income, allocated, spent, and remaining
 * Core to YNAB/Monarch hybrid approach
 */

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface IncomeSummaryProps {
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
  isLoading?: boolean;
}

export function IncomeSummary({
  totalIncome,
  totalAllocated,
  totalSpent,
  isLoading = false,
}: IncomeSummaryProps) {
  const remaining = totalIncome - totalAllocated;
  const allocationPercentage = totalIncome > 0 ? (totalAllocated / totalIncome) * 100 : 0;
  const spentPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="pt-6 space-y-6">
        {/* Main Income Display */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Income This Month</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              <CurrencyDisplay value={totalIncome} showCurrency />
            </span>
          </div>
        </div>

        {/* Allocation Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Allocation Status</span>
            <span className="text-sm font-semibold text-primary">
              {allocationPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={Math.min(allocationPercentage, 100)} className="h-2" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Allocated</p>
              <p className="font-semibold">
                <CurrencyDisplay value={totalAllocated} showCurrency />
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Spent</p>
              <p className="font-semibold">
                <CurrencyDisplay value={totalSpent} showCurrency />
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                {remaining >= 0 ? 'Available' : 'Overspent'}
              </p>
              <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <CurrencyDisplay value={Math.abs(remaining)} showCurrency />
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 p-3 bg-white/50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="text-sm">
            <p className="text-muted-foreground">You've spent</p>
            <p className="font-semibold">
              {spentPercentage.toFixed(0)}% of allocated budgets
            </p>
          </div>
        </div>

        {/* Warning if overspent */}
        {remaining < 0 && (
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-900">You've overspent!</p>
              <p className="text-red-700 text-xs mt-1">
                Your spending exceeds allocated budgets by{' '}
                <CurrencyDisplay value={Math.abs(remaining)} showCurrency />
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
