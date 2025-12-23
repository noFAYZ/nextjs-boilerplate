'use client';

import React from 'react';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetWorthTrendProps {
  isLoading: boolean;
  balanceVisible: boolean;
}

export function NetWorthTrend({ isLoading, balanceVisible }: NetWorthTrendProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const change = 12500;
  const changePercent = 2.5;
  const isPositive = change >= 0;

  return (
    <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">30-Day Change</h3>
        <p className="text-xs text-muted-foreground">Month-over-month</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-end gap-2">
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-500" />
          )}
          <div>
            <p className={cn('text-2xl font-bold', isPositive ? 'text-emerald-600' : 'text-red-600')}>
              {balanceVisible ? (
                <>
                  {isPositive ? '+' : '-'}
                  <CurrencyDisplay amountUSD={Math.abs(change)} variant="lg" />
                </>
              ) : (
                '••••'
              )}
            </p>
            <p className={cn('text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-red-600')}>
              {isPositive ? '+' : '-'}{changePercent}%
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-medium">Period Comparison</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last 7 Days</span>
              <span className="font-semibold">+$3,250</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last 30 Days</span>
              <span className="font-semibold">+$12,500</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">YTD</span>
              <span className="font-semibold">+$45,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
