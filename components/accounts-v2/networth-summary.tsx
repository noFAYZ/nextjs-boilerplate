'use client';

import React from 'react';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

interface NetWorthSummaryProps {
  isLoading: boolean;
  balanceVisible: boolean;
}

export function NetWorthSummary({ isLoading, balanceVisible }: NetWorthSummaryProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Net Worth Summary</h3>
        <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-500">
          <TrendingUp className="h-4 w-4" />
          <span>+2.5% this month</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Current Net Worth</span>
          <span className="text-2xl font-bold">
            {balanceVisible ? <CurrencyDisplay amountUSD={500000} variant="lg" /> : '••••••'}
          </span>
        </div>

        <div className="border-t border-border/50 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Assets</span>
            <span className="text-sm font-semibold">
              {balanceVisible ? <CurrencyDisplay amountUSD={650000} variant="md" /> : '••••••'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Liabilities</span>
            <span className="text-sm font-semibold">
              {balanceVisible ? <CurrencyDisplay amountUSD={150000} variant="md" /> : '••••••'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
