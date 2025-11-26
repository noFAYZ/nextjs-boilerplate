'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { useMonthlySpendingTrendNew } from '@/lib/queries/banking-queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { CurrencyDisplay } from '../ui/currency-display';
import SpendingIncomeChart from './SpendingIncomeChart';
import { CardSkeleton } from '../ui/card-skeleton';

export function MonthlySpendingTrendWidget() {
  // Fetch monthly trend data (last 6 months)
  const { data: monthlyTrend = [], isLoading: monthlyTrendLoading } = useMonthlySpendingTrendNew({ months: 6 });
  const { isRefetching } = useOrganizationRefetchState();

  const trendSummary = useMemo(() => {
    if (!monthlyTrend || monthlyTrend.length === 0) return null;

    const sortedMonths = [...monthlyTrend].sort((a, b) =>
      new Date(b.month).getTime() - new Date(a.month).getTime()
    );

    const currentMonth = sortedMonths[0];
    const previousMonth = sortedMonths[1];

    if (!currentMonth || !previousMonth) return null;

    const spendingChange = currentMonth.totalSpending - previousMonth.totalSpending;
    const spendingChangePercent = (spendingChange / previousMonth.totalSpending) * 100;
    const avgSpending = sortedMonths.reduce((sum, m) => sum + m.totalSpending, 0) / sortedMonths.length;
    const maxValue = Math.max(
      ...sortedMonths.map(m => Math.max(m.totalSpending, m.totalIncome))
    );

    return {
      currentMonth,
      previousMonth,
      spendingChange,
      spendingChangePercent,
      isIncreasing: spendingChange > 0,
      avgSpending,
      maxValue,
      sortedMonths: sortedMonths.reverse(), // Oldest to newest for display
    };
  }, [monthlyTrend]);

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
  };

  // Show skeleton when initially loading
  if (monthlyTrendLoading) {
    return <CardSkeleton variant="chart" />;
  }

  if (!trendSummary) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-4">Monthly trend</h3>
        <div className="py-12 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">
            No trend data available.
          </p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }


  return (
    <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between ">
      <h3 className="text-xs font-medium text-muted-foreground mb-1">Monthly trend</h3>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${trendSummary.isIncreasing ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          {trendSummary.isIncreasing ? (
            <ArrowUp className="h-3 w-3 text-red-600 dark:text-red-400" />
          ) : (
            <ArrowDown className="h-3 w-3 text-green-600 dark:text-green-400" />
          )}
          <span className={`text-[10px] font-bold ${trendSummary.isIncreasing ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {Math.abs(trendSummary.spendingChangePercent).toFixed(1)}%
          </span>
        </div>
      </div>


{/* Chart Area with Vertical Bars */}
<SpendingIncomeChart trendSummary={trendSummary}  />





    {/* Current Month Summary */}
<div className="grid grid-cols-2 gap-3 mt-4">
  {/* Spending Card */}
  <div className="p-3 rounded-xl border border-border bg-muted/40 hover:bg-muted/60 transition-all duration-300">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
        <span className="text-xs text-muted-foreground font-medium">Spent</span>
      </div>
      <span
        className={`text-[10px] font-semibold ${
          trendSummary.isIncreasing
            ? "text-red-600 dark:text-red-400"
            : "text-green-600 dark:text-green-400"
        }`}
      >
        {trendSummary.isIncreasing ? "+" : ""}
        {formatCurrencyCompact(Math.abs(trendSummary.spendingChange))}
      </span>
    </div>

    <CurrencyDisplay
      amountUSD={trendSummary.currentMonth.totalSpending}
      variant="default"
      className="text-base font-semibold text-foreground tracking-tight"
      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
    />

    <p className="text-[10px] text-muted-foreground mt-0.5">
      vs last month
    </p>
  </div>

  {/* Net Card */}
  <div className="p-3 rounded-xl border border-border bg-muted/40 hover:bg-muted/60 transition-all duration-300">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        {trendSummary.currentMonth.netAmount >= 0 ? (
          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
        )}
        <span className="text-xs text-muted-foreground font-medium">Net</span>
      </div>
      <span className="text-[10px] text-muted-foreground/80">
        {formatMonth(trendSummary.currentMonth.month)}
      </span>
    </div>

    <CurrencyDisplay
      amountUSD={trendSummary.currentMonth.netAmount}
      variant="default"
      colorCoded={true}
      className={`text-base font-semibold tracking-tight`}
      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
    />

    <p className="text-[10px] text-muted-foreground mt-0.5">balance</p>
  </div>
</div>

      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </div>
  );
}
