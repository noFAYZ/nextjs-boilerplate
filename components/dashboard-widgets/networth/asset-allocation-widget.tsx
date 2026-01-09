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
import { BarChart3 } from 'lucide-react';

interface AllocationItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
}

const ALLOCATION_CONFIG = {
  cash: { label: 'Cash', color: 'bg-blue-500', icon: '💵' },
  investments: { label: 'Investments', color: 'bg-purple-500', icon: '📈' },
  crypto: { label: 'Crypto', color: 'bg-amber-500', icon: '₿' },
  realEstate: { label: 'Real Estate', color: 'bg-green-500', icon: '🏠' },
  vehicles: { label: 'Vehicles', color: 'bg-red-500', icon: '🚗' },
  other: { label: 'Other', color: 'bg-pink-500', icon: '📦' },
  creditCard: { label: 'Credit Card', color: 'bg-red-600', icon: '💳' },
  loans: { label: 'Loans', color: 'bg-orange-500', icon: '📋' },
  mortgage: { label: 'Mortgage', color: 'bg-red-700', icon: '🏦' },
};

export function AssetAllocationWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { assets, liabilities, allItems, total } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { assets: [], liabilities: [], allItems: [], total: 0 };
    }

    const assetsList: AllocationItem[] = [];
    const liabilitiesList: AllocationItem[] = [];

    const items = [
      { key: 'cash', value: typedData.summary.cashValue || 0 },
      { key: 'investments', value: typedData.summary.investmentValue || 0 },
      { key: 'crypto', value: typedData.summary.cryptoValue || 0 },
      { key: 'realEstate', value: typedData.summary.realEstateValue || 0 },
      { key: 'vehicles', value: typedData.summary.vehicleValue || 0 },
      { key: 'other', value: typedData.summary.otherAssetValue || 0 },
      { key: 'creditCard', value: Math.abs(typedData.summary.creditCardDebt || 0), isLiability: true },
      { key: 'loans', value: Math.abs(typedData.summary.loanDebt || 0), isLiability: true },
      { key: 'mortgage', value: Math.abs(typedData.summary.mortgageDebt || 0), isLiability: true },
    ];

    const totalValue = items.reduce((sum, item) => sum + item.value, 0);

    items.forEach(item => {
      if (item.value > 0) {
        const config = ALLOCATION_CONFIG[item.key as keyof typeof ALLOCATION_CONFIG];
        const allocationItem: AllocationItem = {
          label: config.label,
          value: item.value,
          percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
          color: config.color,
          icon: config.icon,
        };

        if (item.isLiability) {
          liabilitiesList.push(allocationItem);
        } else {
          assetsList.push(allocationItem);
        }
      }
    });

    return {
      assets: assetsList.sort((a, b) => b.value - a.value),
      liabilities: liabilitiesList.sort((a, b) => b.value - a.value),
      allItems: [...assetsList, ...liabilitiesList].sort((a, b) => b.value - a.value),
      total: totalValue,
    };
  }, [accountsData]);

  if (isLoading) {
    return <CardSkeleton className="h-[450px]" />;
  }

  const AllocationBar = ({ item }: { item: AllocationItem }) => (
    <div key={item.label} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">{item.icon}</span>
          <span className="text-xs font-medium text-foreground truncate">{item.label}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold text-foreground">
            {item.percentage.toFixed(1)}%
          </span>
          <Badge variant="outline" className="text-[9px] h-5 px-1">
            <CurrencyDisplay amountUSD={item.value} variant="small" />
          </Badge>
        </div>
      </div>
      <div className="w-full h-2 bg-secondary/40 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-out', item.color)}
          style={{ width: `${item.percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <Card className="relative border border-border/50 h-[450px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Asset Allocation</h3>
        </div>
      </div>

      {/* Content */}
      {allItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-xs font-medium text-foreground">No assets or liabilities</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Assets Section */}
          {assets.length > 0 && (
            <div className="space-y-2.5">
              <div className="px-1 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Assets
                </p>
              </div>
              <div className="space-y-3">
                {assets.map(item => (
                  <AllocationBar key={item.label} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {assets.length > 0 && liabilities.length > 0 && (
            <div className="h-px bg-border/30 my-2" />
          )}

          {/* Liabilities Section */}
          {liabilities.length > 0 && (
            <div className="space-y-2.5">
              <div className="px-1 py-1.5 rounded-md bg-red-500/10 border border-red-500/20">
                <p className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                  Liabilities
                </p>
              </div>
              <div className="space-y-3">
                {liabilities.map(item => (
                  <AllocationBar key={item.label} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
