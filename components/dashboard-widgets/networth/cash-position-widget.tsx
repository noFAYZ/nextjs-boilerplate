'use client';

import { useMemo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Banknote, TrendingUp, AlertCircle } from 'lucide-react';

export function CashPositionWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { cashValue, otherAssetsValue, totalAssets, cashPercentage, liquidityScore, liquidityStatus } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return {
        cashValue: 0,
        otherAssetsValue: 0,
        totalAssets: 0,
        cashPercentage: 0,
        liquidityScore: 0,
        liquidityStatus: 'Low',
      };
    }

    const cash = typedData.summary.cashValue || 0;
    const totalAssetsVal = typedData.summary.totalAssets || 0;
    const otherAssets = totalAssetsVal - cash;
    const cashPercent = totalAssetsVal > 0 ? (cash / totalAssetsVal) * 100 : 0;

    // Liquidity score: ideal is 15-25% in cash
    let liquidityScore = 0;
    let liquidityStatus = 'Low';

    if (cashPercent >= 15 && cashPercent <= 25) {
      liquidityScore = 100;
      liquidityStatus = 'Optimal';
    } else if (cashPercent >= 10 && cashPercent < 15) {
      liquidityScore = 80;
      liquidityStatus = 'Good';
    } else if (cashPercent >= 25 && cashPercent <= 35) {
      liquidityScore = 80;
      liquidityStatus = 'Good';
    } else if (cashPercent >= 5 && cashPercent < 10) {
      liquidityScore = 60;
      liquidityStatus = 'Fair';
    } else if (cashPercent > 35) {
      liquidityScore = 70;
      liquidityStatus = 'Moderate';
    } else if (cashPercent > 0) {
      liquidityScore = 40;
      liquidityStatus = 'Low';
    } else {
      liquidityScore = 20;
      liquidityStatus = 'Critical';
    }

    return {
      cashValue: cash,
      otherAssetsValue: otherAssets,
      totalAssets: totalAssetsVal,
      cashPercentage: cashPercent,
      liquidityScore,
      liquidityStatus,
    };
  }, [accountsData]);

  if (isLoading) {
    return <CardSkeleton className="h-[360px]" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal':
        return 'emerald';
      case 'Good':
        return 'blue';
      case 'Moderate':
        return 'blue';
      case 'Fair':
        return 'amber';
      case 'Low':
        return 'orange';
      case 'Critical':
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusColor = getStatusColor(liquidityStatus);
  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    amber: 'text-amber-600 dark:text-amber-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  const bgColorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20',
    orange: 'bg-orange-500/10 border-orange-500/20',
    red: 'bg-red-500/10 border-red-500/20',
    gray: 'bg-gray-500/10 border-gray-500/20',
  };

  return (
    <Card className="relative border border-border/50 h-[360px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Banknote className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Liquid Assets</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Cash Display */}
        <div className={cn(
          'p-3.5 rounded-lg border transition-all duration-300',
          bgColorClasses[statusColor as keyof typeof bgColorClasses]
        )}>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Cash on Hand
          </p>
          <p className="text-3xl font-bold text-foreground">
            <CurrencyDisplay amountUSD={cashValue} variant="small" />
          </p>
          <p className={cn(
            'text-xs font-semibold mt-2',
            colorClasses[statusColor as keyof typeof colorClasses]
          )}>
            {cashPercentage.toFixed(1)}% of total assets
          </p>
        </div>

        {/* Liquidity Score Card */}
        <div className="p-3 rounded-lg bg-secondary/40 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-muted-foreground">Liquidity Score</p>
            <Badge className={cn(
              'text-[10px] font-bold px-2 py-0.5',
              statusColor === 'emerald' && 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-400',
              statusColor === 'blue' && 'bg-blue-500/30 text-blue-700 dark:text-blue-400',
              statusColor === 'amber' && 'bg-amber-500/30 text-amber-700 dark:text-amber-400',
              statusColor === 'orange' && 'bg-orange-500/30 text-orange-700 dark:text-orange-400',
              statusColor === 'red' && 'bg-red-500/30 text-red-700 dark:text-red-400',
            )}>
              {liquidityStatus}
            </Badge>
          </div>

          {/* Score Bar */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-secondary/60 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  liquidityScore >= 85 && 'bg-emerald-500',
                  liquidityScore >= 70 && liquidityScore < 85 && 'bg-blue-500',
                  liquidityScore >= 55 && liquidityScore < 70 && 'bg-amber-500',
                  liquidityScore >= 40 && liquidityScore < 55 && 'bg-orange-500',
                  liquidityScore < 40 && 'bg-red-500',
                )}
                style={{ width: `${liquidityScore}%` }}
              />
            </div>
            <p className="text-[9px] text-muted-foreground">Score: {liquidityScore}/100</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-2">
          {/* Cash Card */}
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
            <p className="text-[9px] font-semibold text-muted-foreground">Liquid Cash</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              <CurrencyDisplay amountUSD={cashValue} variant="small" />
            </p>
          </div>

          {/* Other Assets Card */}
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 space-y-1">
            <p className="text-[9px] font-semibold text-muted-foreground">Other Assets</p>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
              <CurrencyDisplay amountUSD={otherAssetsValue} variant="small" />
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="pt-2 border-t border-border/30 space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" />
            Ideal Range: 15-25% cash
          </p>
          {cashPercentage > 0 && cashPercentage < 15 && (
            <p className="text-[10px] text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              Consider increasing emergency fund
            </p>
          )}
          {cashPercentage > 35 && (
            <p className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Opportunity to invest surplus cash
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
