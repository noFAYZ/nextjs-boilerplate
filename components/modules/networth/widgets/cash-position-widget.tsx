'use client';

import { useMemo, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Banknote } from 'lucide-react';

function CashPositionWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { cashValue, otherAssetsValue, totalAssets, cashPercentage } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { cashValue: 0, otherAssetsValue: 0, totalAssets: 0, cashPercentage: 0 };
    }

    const cash = typedData.summary.cashValue || 0;
    const total = typedData.summary.totalAssets || 0;
    const other = total - cash;
    const percent = total > 0 ? (cash / total) * 100 : 0;

    return {
      cashValue: cash,
      otherAssetsValue: other,
      totalAssets: total,
      cashPercentage: percent,
    };
  }, [accountsData]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Liquid assets</h3>
        <Banknote className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Cash Amount */}
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Cash</p>
          <p className="text-lg font-semibold text-blue-600">
            <CurrencyDisplay amountUSD={cashValue} variant="small" />
          </p>
          <div className="text-[9px] text-muted-foreground mt-0.5">{cashPercentage.toFixed(1)}% of assets</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.min(cashPercentage, 100)}%` }} />
        </div>

        {/* Asset Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[9px]">
          <div>
            <p className="text-muted-foreground">Cash</p>
            <p className="font-semibold text-foreground text-xs">
              <CurrencyDisplay amountUSD={cashValue} variant="small" />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Other</p>
            <p className="font-semibold text-foreground text-xs">
              <CurrencyDisplay amountUSD={otherAssetsValue} variant="small" />
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-1.5 border-t border-border/50 text-[9px]">
          <p className="text-muted-foreground">
            {cashPercentage < 10 ? 'Low cash reserves' : cashPercentage > 30 ? 'High cash position' : 'Balanced position'}
          </p>
        </div>
      </div>
    </Card>
  );
}

export const CashPositionWidget = memo(CashPositionWidgetComponent);
