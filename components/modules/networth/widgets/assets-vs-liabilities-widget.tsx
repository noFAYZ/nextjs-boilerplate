'use client';

import { useMemo, memo } from 'react';
import { useAllAccounts } from '@/lib/features/accounts/queries';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Scale } from 'lucide-react';

function AssetsVsLiabilitiesWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { totalAssets, totalLiabilities, assetsPercent, liabilitiesPercent } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { totalAssets: 0, totalLiabilities: 0, assetsPercent: 50, liabilitiesPercent: 50 };
    }

    const assets = typedData.summary.totalAssets || 0;
    const liabilities = Math.abs(typedData.summary.totalLiabilities || 0);
    const total = assets + liabilities || 1;

    return {
      totalAssets: assets,
      totalLiabilities: liabilities,
      assetsPercent: (assets / total) * 100,
      liabilitiesPercent: (liabilities / total) * 100,
    };
  }, [accountsData]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Assets vs liabilities</h3>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Comparison Bars */}
        <div className="space-y-2">
          {/* Assets */}
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-muted-foreground font-medium">Assets</span>
              <span className="text-green-600 font-semibold">{assetsPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${assetsPercent}%` }}
              />
            </div>
          </div>

          {/* Liabilities */}
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-muted-foreground font-medium">Liabilities</span>
              <span className="text-red-600 font-semibold">{liabilitiesPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${liabilitiesPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Assets</p>
            <p className="text-sm font-semibold text-green-600">
              <CurrencyDisplay amountUSD={totalAssets} variant="small" />
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Liabilities</p>
            <p className="text-sm font-semibold text-red-600">
              <CurrencyDisplay amountUSD={totalLiabilities} variant="small" />
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const AssetsVsLiabilitiesWidget = memo(AssetsVsLiabilitiesWidgetComponent);
