'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import { CreditCard, TrendingUp, ArrowUpRight, Wallet, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAccountSpendingComparison, useBankingGroupedAccountsRaw } from '@/lib/features/banking/queries';
import { TimePeriodSelector, TimePeriod } from '@/components/ui/time-period-selector';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function AccountSpendingComparisonWidgetComponent() {
  const [period, setPeriod] = useState<TimePeriod>('this_month');
  const [hoveredAccount, setHoveredAccount] = useState<string | null>(null);
  const { isRefetching } = useOrganizationRefetchState();

  // Fetch account spending comparison data with selected period
  const { data: comparisonData, isLoading } = useAccountSpendingComparison({ period });
  const { data: groupedAccounts } = useBankingGroupedAccountsRaw();

  // Get account names from grouped accounts
  const accountNames = useMemo(() => {
    if (!groupedAccounts) return {};

    const names: Record<string, string> = {};
    Object.values(groupedAccounts).forEach((group: { accounts?: { id: string; name?: string; accountNumber?: string }[] }) => {
      group.accounts?.forEach((account) => {
        names[account.id] = account.name || account.accountNumber || 'Unknown Account';
      });
    });
    return names;
  }, [groupedAccounts]);

  const sortedAccounts = useMemo(() => {
    if (!comparisonData || comparisonData.length === 0) return [];

    return [...comparisonData]
      .sort((a, b) => b.totalSpending - a.totalSpending)
      .slice(0, 4); // Show top 4 accounts
  }, [comparisonData]);

  const handleAccountMouseEnter = useCallback((accountId: string) => {
    setHoveredAccount(accountId);
  }, []);

  const handleAccountMouseLeave = useCallback(() => {
    setHoveredAccount(null);
  }, []);

  if (isLoading) {
    return <WidgetSkeleton variant="chart" />;
  }

  if (sortedAccounts.length === 0) {
    return (
      <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-sm bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-cyan-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate">Account Spendings</h3>
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
              <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                No account data available.
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const totalSpending = sortedAccounts.reduce((sum, acc) => sum + acc.totalSpending, 0);
  const totalIncome = sortedAccounts.reduce((sum, acc) => sum + acc.totalIncome, 0);
  const totalNet = totalIncome - totalSpending;

  const ACCOUNT_COLORS = [
    { bg: 'bg-purple-500 dark:bg-purple-600', light: 'bg-purple-500/10 dark:bg-purple-600/10', border: 'border-purple-200 dark:border-purple-800', ring: 'ring-purple-500/20' },
    { bg: 'bg-blue-500 dark:bg-blue-600', light: 'bg-blue-500/10 dark:bg-blue-600/10', border: 'border-blue-200 dark:border-blue-800', ring: 'ring-blue-500/20' },
    { bg: 'bg-teal-500 dark:bg-teal-600', light: 'bg-teal-500/10 dark:bg-teal-600/10', border: 'border-teal-200 dark:border-teal-800', ring: 'ring-teal-500/20' },
    { bg: 'bg-orange-500 dark:bg-orange-600', light: 'bg-orange-500/10 dark:bg-orange-600/10', border: 'border-orange-200 dark:border-orange-800', ring: 'ring-orange-500/20' },
  ];



  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5 text-cyan-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Account Spendings</h3>
          </div>
          <Link href="/accounts" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">

      {/* Radial Comparison Chart */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-full max-w-[90px] aspect-square">
       

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-muted-foreground/90 mb-0.5">Total Spending</p>
            <CurrencyDisplay
              amountUSD={totalSpending}
              className="text-4xl font-bold text-foreground"
              formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            />
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {sortedAccounts.length} accounts
            </p>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {sortedAccounts.map((account, index) => {
          const accountName = accountNames[account.accountId] || 'Unknown';
          const percentage = (account.totalSpending / totalSpending) * 100;
          const netAmount = account.totalIncome - account.totalSpending;
          const color = ACCOUNT_COLORS[index % ACCOUNT_COLORS.length];
          const isHovered = hoveredAccount === account.accountId;

          return (
            <div
              key={account.accountId}
              className={`relative p-3 rounded-lg border cursor-pointer ${
                isHovered
                  ? ` ring-1 ${color.ring}`
                  : 'border-border bg-muted/20 hover:bg-muted/30'
              }`}
              onMouseEnter={() => handleAccountMouseEnter(account.accountId)}
              onMouseLeave={handleAccountMouseLeave}
            >
              <div className='flex gap-2 items-center'> 
              {/* Color indicator */}
              <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${color.bg}`} />

              {/* Account Icon */}
              <div className={`w-8 h-8 rounded-md ${color.bg} flex items-center justify-center mb-2`}>
                <CreditCard className="h-4 w-4 text-white" />
              </div>

              {/* Account Info */}
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-foreground truncate mb-0.5">
                  {accountName}
                </p>
                {account.topCategory && (
                  <p className="text-[8px] text-muted-foreground capitalize truncate">
                    {account.topCategory}
                  </p>
                )}
              </div>
</div>
              {/* Amount */}
              <CurrencyDisplay
                amountUSD={account.totalSpending}
                variant="small"
                className="text-sm font-bold text-foreground mb-1"
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />

              {/* Percentage Badge */}
              <div className="flex items-center justify-between">
                <div className={`px-1.5 py-0.5 rounded ${color.light}`}>
                  <span className="text-[8px] font-semibold text-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[8px] text-muted-foreground">
                    {account.transactionCount} txns
                  </span>
                </div>
              </div>

              {/* Mini stats on hover */}
              {isHovered && (
                <div className="mt-2 pt-2 border-t border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-muted-foreground">Income</span>
                    <CurrencyDisplay
                      amountUSD={account.totalIncome}
                      variant="compact"
                      className="text-[9px] font-semibold text-green-700 dark:text-green-400"
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-muted-foreground">Net</span>
                    <CurrencyDisplay
                      amountUSD={netAmount}
                      variant="compact"
                      colorCoded={true}
                      className="text-[9px] font-semibold"
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
            <div className="p-2 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />
                <p className="text-[8px] text-muted-foreground/70">Spent</p>
              </div>
              <CurrencyDisplay
                amountUSD={totalSpending}
                variant="compact"
                className="text-xs font-bold text-red-700 dark:text-red-400"
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center gap-1 mb-1">
                <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                <p className="text-[8px] text-muted-foreground/70">Income</p>
              </div>
              <CurrencyDisplay
                amountUSD={totalIncome}
                variant="compact"
                className="text-xs font-bold text-green-700 dark:text-green-400"
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
            </div>
            <div className="p-2 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center gap-1 mb-1">
                <Minus className="h-3 w-3 text-muted-foreground/50" />
                <p className="text-[8px] text-muted-foreground/70">Net</p>
              </div>
              <CurrencyDisplay
                amountUSD={totalNet}
                variant="compact"
                colorCoded={true}
                className="text-xs font-bold"
                formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const AccountSpendingComparisonWidget = memo(AccountSpendingComparisonWidgetComponent);
