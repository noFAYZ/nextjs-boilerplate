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
import { Heart, TrendingUp } from 'lucide-react';

interface HealthMetric {
  label: string;
  value: number;
  maxValue: number;
  weight: number;
  icon: string;
}

export function FinancialHealthScoreWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { score, rating, ratingColor, metrics, netWorth } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return {
        score: 0,
        rating: 'No Data',
        ratingColor: 'gray',
        metrics: [],
        netWorth: 0,
      };
    }

    const totalAssets = typedData.summary.totalAssets || 0;
    const totalLiabilities = Math.abs(typedData.summary.totalLiabilities || 0);
    const netWorth = totalAssets - totalLiabilities;
    const cashValue = typedData.summary.cashValue || 0;
    const creditCardDebt = Math.abs(typedData.summary.creditCardDebt || 0);
    const mortgageDebt = Math.abs(typedData.summary.mortgageDebt || 0);

    // Calculate individual metrics
    const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const debtToAssetScore = Math.max(0, Math.min(100, 100 - debtToAssetRatio));

    const emergencyFundScore = totalAssets > 0 ? Math.min(100, (cashValue / (totalAssets * 0.15)) * 100) : 0;

    const creditCardUtilization = creditCardDebt > 0 ? Math.max(0, 100 - creditCardDebt * 2) : 100;

    const netWorthScore = netWorth > 0 ? 100 : Math.max(0, 50 + (netWorth / Math.abs(totalLiabilities)) * 50);

    const diversificationScore = (totalAssets > 0) ? (() => {
      let count = 0;
      if ((typedData.summary.cashValue || 0) > 0) count++;
      if ((typedData.summary.investmentValue || 0) > 0) count++;
      if ((typedData.summary.cryptoValue || 0) > 0) count++;
      if ((typedData.summary.realEstateValue || 0) > 0) count++;
      if ((typedData.summary.vehicleValue || 0) > 0) count++;
      return (count / 5) * 100;
    })() : 0;

    // Weighted metrics
    const metrics: HealthMetric[] = [
      {
        label: 'Debt-to-Asset',
        value: debtToAssetScore,
        maxValue: 100,
        weight: 30,
        icon: '⚖️',
      },
      {
        label: 'Emergency Fund',
        value: emergencyFundScore,
        maxValue: 100,
        weight: 25,
        icon: '🏦',
      },
      {
        label: 'Credit Health',
        value: creditCardUtilization,
        maxValue: 100,
        weight: 25,
        icon: '💳',
      },
      {
        label: 'Diversification',
        value: diversificationScore,
        maxValue: 100,
        weight: 20,
        icon: '📊',
      },
    ];

    // Calculate weighted score
    const totalScore = metrics.reduce(
      (sum, metric) => sum + (metric.value * metric.weight) / 100,
      0
    );

    const finalScore = Math.min(100, Math.max(0, totalScore));

    let rating = 'Fair';
    let ratingColor = 'amber';

    if (finalScore >= 85) {
      rating = 'Excellent';
      ratingColor = 'emerald';
    } else if (finalScore >= 70) {
      rating = 'Good';
      ratingColor = 'blue';
    } else if (finalScore >= 55) {
      rating = 'Fair';
      ratingColor = 'amber';
    } else {
      rating = 'Needs Work';
      ratingColor = 'red';
    }

    return { score: finalScore, rating, ratingColor, metrics, netWorth };
  }, [accountsData]);

  if (isLoading) {
    return <CardSkeleton className="h-[450px]" />;
  }

  const colorClasses = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };

  const bgColorClasses = {
    emerald: 'bg-emerald-500/20 border-emerald-500/30',
    blue: 'bg-blue-500/20 border-blue-500/30',
    amber: 'bg-amber-500/20 border-amber-500/30',
    red: 'bg-red-500/20 border-red-500/30',
    gray: 'bg-gray-500/20 border-gray-500/30',
  };

  return (
    <Card className="relative border border-border/50 h-[450px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
            <Heart className="h-4 w-4 text-pink-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Financial Health</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Score Display */}
        <div className={cn(
          'p-4 rounded-lg border transition-all duration-300',
          bgColorClasses[score > 0 ? ratingColor as keyof typeof bgColorClasses : 'gray']
        )}>
          <div className="flex items-center gap-4">
            {/* Large Score Circle */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center border-2 border-secondary/50">
                <div className={cn(
                  'absolute inset-0 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br opacity-10',
                  ratingColor === 'emerald' && 'from-emerald-500 to-emerald-600',
                  ratingColor === 'blue' && 'from-blue-500 to-blue-600',
                  ratingColor === 'amber' && 'from-amber-500 to-amber-600',
                  ratingColor === 'red' && 'from-red-500 to-red-600',
                )}>
                </div>
                <div className="relative text-center">
                  <p className={cn('text-4xl font-bold', colorClasses[score > 0 ? ratingColor as keyof typeof colorClasses : 'gray'])}>
                    {Math.round(score)}
                  </p>
                  <p className="text-[9px] font-semibold text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>

            {/* Score Info */}
            <div className="flex-1 space-y-2">
              <Badge className={cn(
                'text-[11px] font-bold px-2 py-1',
                ratingColor === 'emerald' && 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-400',
                ratingColor === 'blue' && 'bg-blue-500/30 text-blue-700 dark:text-blue-400',
                ratingColor === 'amber' && 'bg-amber-500/30 text-amber-700 dark:text-amber-400',
                ratingColor === 'red' && 'bg-red-500/30 text-red-700 dark:text-red-400',
              )}>
                {rating}
              </Badge>
              <p className="text-[10px] text-muted-foreground">Overall financial</p>
              <p className="text-[10px] text-muted-foreground">health assessment</p>
              {netWorth > 0 && (
                <div className="pt-2 border-t border-border/20">
                  <p className="text-[10px] font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3" />
                    Net Worth: <CurrencyDisplay amountUSD={netWorth} variant="small" />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Breakdown</p>
          {metrics.map(metric => (
            <div key={metric.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{metric.icon}</span>
                  <span className="text-xs font-medium text-foreground">{metric.label}</span>
                </div>
                <span className="text-xs font-bold text-foreground">{Math.round(metric.value)}%</span>
              </div>
              <div className="w-full h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    metric.value >= 80 && 'bg-emerald-500',
                    metric.value >= 60 && metric.value < 80 && 'bg-blue-500',
                    metric.value >= 40 && metric.value < 60 && 'bg-amber-500',
                    metric.value < 40 && 'bg-red-500',
                  )}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
