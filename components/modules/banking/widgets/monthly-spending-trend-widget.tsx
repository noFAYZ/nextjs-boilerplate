'use client';

import { useMemo, memo } from 'react';
import { TrendingUp, TrendingDown, Calendar, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMonthlySpendingTrendNew } from '@/lib/queries/banking-queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import SpendingIncomeChart from './SpendingIncomeChart';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Utility functions at module level (no dependencies)
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

function MonthlySpendingTrendWidgetComponent() {
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

  // Show skeleton when initially loading
  if (monthlyTrendLoading) {
    return <WidgetSkeleton variant="chart" />;
  }

  if (!trendSummary) {
    return (
      <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-sm bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate">Monthly Trend</h3>
            </div>
            <Link href="/accounts" className="flex-shrink-0">
              <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-center justify-center">
            <div className="py-12 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                No trend data available.
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }


  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Monthly Trend</h3>
          </div>
          <Link href="/accounts" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex items-center justify-end gap-1 px-2 py-1.5 mb-2 rounded-full w-fit ml-auto">
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
        </div>
      </div>
    </Card>
  );
}

export const MonthlySpendingTrendWidget = memo(MonthlySpendingTrendWidgetComponent);
