'use client';

import { useMemo, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Scale } from 'lucide-react';

function DebtToAssetRatioWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { ratio, status, statusColor } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { ratio: 0, status: 'Excellent', statusColor: 'text-emerald-600' };
    }

    const assets = typedData.summary.totalAssets || 0;
    const liabilities = Math.abs(typedData.summary.totalLiabilities || 0);

    if (assets === 0) {
      return { ratio: 0, status: 'Excellent', statusColor: 'text-emerald-600' };
    }

    const ratio = (liabilities / assets) * 100;

    let status = 'Excellent';
    let statusColor = 'text-emerald-600';

    if (ratio <= 20) {
      status = 'Excellent';
      statusColor = 'text-emerald-600';
    } else if (ratio <= 50) {
      status = 'Good';
      statusColor = 'text-blue-600';
    } else if (ratio <= 80) {
      status = 'Fair';
      statusColor = 'text-amber-600';
    } else {
      status = 'High';
      statusColor = 'text-red-600';
    }

    return { ratio, status, statusColor };
  }, [accountsData]);

  if (isLoading) return <CardSkeleton />;

  const offset = 263 - (ratio / 100) * 263;
  const strokeColor =
    ratio <= 20 ? '#10b981' : ratio <= 50 ? '#3b82f6' : ratio <= 80 ? '#f59e0b' : '#ef4444';

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Debt-to-asset ratio</h3>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        {/* Circular Gauge */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeDasharray="263"
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{ratio.toFixed(0)}%</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center space-y-1">
          <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
          <p className="text-[10px] text-muted-foreground">Financial health</p>
        </div>

        {/* Info */}
        <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50 w-full">
          Lower is better
        </p>
      </div>
    </Card>
  );
}

export const DebtToAssetRatioWidget = memo(DebtToAssetRatioWidgetComponent);
