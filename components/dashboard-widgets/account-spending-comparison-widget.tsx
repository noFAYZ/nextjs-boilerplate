'use client';

import { useMemo, useState } from 'react';
import { CreditCard, TrendingUp, ArrowUpRight, Wallet, Minus } from 'lucide-react';
import { useAccountSpendingComparison, useBankingGroupedAccountsRaw } from '@/lib/queries/banking-queries';
import { TimePeriodSelector, TimePeriod } from '../ui/time-period-selector';
import { CurrencyDisplay } from '../ui/currency-display';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { CardSkeleton } from '../ui/card-skeleton';

export function AccountSpendingComparisonWidget() {
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

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  if (isLoading) {
    return <CardSkeleton variant="chart" />;
  }

  if (sortedAccounts.length === 0) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-muted-foreground">Account spendings</h3>
          <TimePeriodSelector
            value={period}
            onChange={setPeriod}
            size="xs"
            variant="ghost"
          />
        </div>
        <div className="py-12 text-center">
          <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">
            No account data available.
          </p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
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
    <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-muted-foreground">Account spendings</h3>
        <TimePeriodSelector
          value={period}
          onChange={setPeriod}
          size="xs"
          variant="ghost"
        />
      </div>

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
              onMouseEnter={() => setHoveredAccount(account.accountId)}
              onMouseLeave={() => setHoveredAccount(null)}
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
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </div>
  );
}
