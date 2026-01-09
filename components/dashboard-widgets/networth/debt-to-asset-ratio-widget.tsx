'use client';

import { useMemo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Badge } from '@/components/ui/badge';
import { Scale, AlertTriangle, CheckCircle } from 'lucide-react';

export function DebtToAssetRatioWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { ratio, status, message, color, icon: statusIcon } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { ratio: 0, status: 'Excellent', message: 'No debts', color: 'emerald', icon: CheckCircle };
    }

    const assets = typedData.summary.totalAssets || 0;
    const liabilities = Math.abs(typedData.summary.totalLiabilities || 0);

    if (assets === 0) {
      return { ratio: 0, status: 'Excellent', message: 'No assets or debts', color: 'blue', icon: CheckCircle };
    }

    const debtToAssetRatio = (liabilities / assets) * 100;

    let status = 'Excellent';
    let message = 'Your debt is very low';
    let color = 'emerald';
    let icon = CheckCircle;

    if (debtToAssetRatio <= 20) {
      status = 'Excellent';
      message = 'Low debt-to-asset ratio';
      color = 'emerald';
      icon = CheckCircle;
    } else if (debtToAssetRatio <= 50) {
      status = 'Good';
      message = 'Moderate debt level';
      color = 'blue';
      icon = CheckCircle;
    } else if (debtToAssetRatio <= 80) {
      status = 'Fair';
      message = 'Consider reducing debt';
      color = 'amber';
      icon = AlertTriangle;
    } else {
      status = 'High';
      message = 'Debt exceeds assets';
      color = 'red';
      icon = AlertTriangle;
    }

    return { ratio: debtToAssetRatio, status, message, color, icon: icon };
  }, [accountsData]);

  if (isLoading) {
    return <CardSkeleton className="h-[320px]" />;
  }

  const strokeDashoffset = 263 - (ratio / 100) * 263;
  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <Card className="relative border border-border/50 h-[320px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Scale className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Debt-to-Asset Ratio</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Circular Gauge */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary/40" />

            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="263"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-500 ease-out',
                colorClasses[color as keyof typeof colorClasses]
              )}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={cn('text-3xl font-bold', colorClasses[color as keyof typeof colorClasses])}>
              {ratio.toFixed(0)}%
            </p>
            <p className="text-[10px] text-muted-foreground">Ratio</p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center space-y-2 w-full">
          <div className="flex items-center justify-center gap-2">
            <statusIcon className={cn('h-4 w-4', colorClasses[color as keyof typeof colorClasses])} />
            <Badge className={cn(
              'text-[11px] font-semibold',
              color === 'emerald' && 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
              color === 'blue' && 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
              color === 'amber' && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
              color === 'red' && 'bg-red-500/20 text-red-700 dark:text-red-400'
            )}>
              {status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>

        {/* Info */}
        <div className="text-center text-[10px] text-muted-foreground pt-2 border-t border-border/30 w-full">
          <p>Lower ratio = Better financial health</p>
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
