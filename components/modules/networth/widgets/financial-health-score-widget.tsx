'use client';

import { useMemo, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { Heart } from 'lucide-react';

function FinancialHealthScoreWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { score, status, statusColor } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { score: 0, status: 'No Data', statusColor: 'text-gray-600' };
    }

    const totalAssets = typedData.summary.totalAssets || 0;
    const totalLiabilities = Math.abs(typedData.summary.totalLiabilities || 0);
    const netWorth = totalAssets - totalLiabilities;

    if (totalAssets === 0) {
      return { score: 0, status: 'No Data', statusColor: 'text-gray-600' };
    }

    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const netWorthScore = netWorth > 0 ? 100 : Math.max(0, 50 + (netWorth / Math.abs(totalAssets)) * 50);
    const diversification = Math.min(100, (Object.values([
      typedData.summary.cashValue,
      typedData.summary.investmentValue,
      typedData.summary.cryptoValue,
      typedData.summary.realEstateValue,
    ]).filter(v => v > 0).length / 4) * 100);

    const score =
      (Math.max(0, 100 - debtRatio) * 0.5 + netWorthScore * 0.3 + diversification * 0.2) / 1;

    let status = 'Fair';
    let statusColor = 'text-amber-600';

    if (score >= 85) {
      status = 'Excellent';
      statusColor = 'text-emerald-600';
    } else if (score >= 70) {
      status = 'Good';
      statusColor = 'text-blue-600';
    } else if (score >= 55) {
      status = 'Fair';
      statusColor = 'text-amber-600';
    } else {
      status = 'Needs Work';
      statusColor = 'text-red-600';
    }

    return { score: Math.min(100, Math.max(0, score)), status, statusColor };
  }, [accountsData]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Financial health</h3>
        <Heart className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {/* Score Circle */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/20" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray="263"
              strokeDashoffset={263 - (score / 100) * 263}
              strokeLinecap="round"
              className={`transition-all duration-500 ${statusColor}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold">{Math.round(score)}</span>
          </div>
        </div>

        {/* Status */}
        <p className={`text-xs font-semibold ${statusColor}`}>{status}</p>
        <p className="text-[10px] text-muted-foreground text-center">Based on debt ratio, net worth & diversification</p>
      </div>
    </Card>
  );
}

export const FinancialHealthScoreWidget = memo(FinancialHealthScoreWidgetComponent);
