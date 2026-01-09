'use client';

import { useMemo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function AssetsVsLiabilitiesWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { totalAssets, totalLiabilities, assetsPercent, liabilitiesPercent } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { totalAssets: 0, totalLiabilities: 0, assetsPercent: 0, liabilitiesPercent: 0 };
    }

    const assets = typedData.summary.totalAssets || 0;
    const liabilities = Math.abs(typedData.summary.totalLiabilities || 0);
    const total = assets + liabilities;

    const assetsPercent = total > 0 ? Math.round((assets / total) * 100) : 0;
    const liabilitiesPercent = 100 - assetsPercent;

    return { totalAssets: assets, totalLiabilities: liabilities, assetsPercent, liabilitiesPercent };
  }, [accountsData]);

  if (isLoading) {
    return <CardSkeleton className="h-[300px]" />;
  }

  return (
    <Card className="relative border border-border/50 h-[300px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Assets vs Liabilities</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Assets Bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-foreground">Assets</p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{assetsPercent}%</p>
          </div>
          <div className="relative w-full h-10 rounded-lg overflow-hidden bg-secondary/30 border border-secondary/50">
            {/* Animated bar */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out flex items-center justify-end pr-3"
              style={{ width: `${assetsPercent}%` }}
            >
              {assetsPercent > 20 && (
                <p className="text-xs font-bold text-white truncate">
                  <CurrencyDisplay amountUSD={totalAssets} variant="small" />
                </p>
              )}
            </div>
            {assetsPercent <= 20 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs font-bold text-foreground">
                  <CurrencyDisplay amountUSD={totalAssets} variant="small" />
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Liabilities Bar */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-foreground">Liabilities</p>
            <p className="text-xs font-bold text-red-600 dark:text-red-400">{liabilitiesPercent}%</p>
          </div>
          <div className="relative w-full h-10 rounded-lg overflow-hidden bg-secondary/30 border border-secondary/50">
            {/* Animated bar */}
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 ease-out flex items-center justify-end pr-3"
              style={{ width: `${liabilitiesPercent}%` }}
            >
              {liabilitiesPercent > 20 && (
                <p className="text-xs font-bold text-white truncate">
                  <CurrencyDisplay amountUSD={totalLiabilities} variant="small" />
                </p>
              )}
            </div>
            {liabilitiesPercent <= 20 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs font-bold text-foreground">
                  <CurrencyDisplay amountUSD={totalLiabilities} variant="small" />
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/30">
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground">Total Assets</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <CurrencyDisplay amountUSD={totalAssets} variant="small" />
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground">Total Liabilities</p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              <CurrencyDisplay amountUSD={totalLiabilities} variant="small" />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
