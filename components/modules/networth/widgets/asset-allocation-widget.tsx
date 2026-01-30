'use client';

import { useMemo, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { BarChart3 } from 'lucide-react';

interface AllocationItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function AssetAllocationWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { items, totalValue } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) return { items: [], totalValue: 0 };

    const allItems: AllocationItem[] = [];
    const summary = typedData.summary;

    // Assets
    if (summary.cashValue) allItems.push({ label: 'Cash', value: summary.cashValue, percentage: 0, color: 'bg-blue-500' });
    if (summary.investmentValue) allItems.push({ label: 'Investments', value: summary.investmentValue, percentage: 0, color: 'bg-green-500' });
    if (summary.cryptoValue) allItems.push({ label: 'Crypto', value: summary.cryptoValue, percentage: 0, color: 'bg-violet-500' });
    if (summary.realEstateValue) allItems.push({ label: 'Real Estate', value: summary.realEstateValue, percentage: 0, color: 'bg-purple-500' });
    if (summary.vehicleValue) allItems.push({ label: 'Vehicles', value: summary.vehicleValue, percentage: 0, color: 'bg-orange-500' });
    if (summary.otherAssetValue) allItems.push({ label: 'Other Assets', value: summary.otherAssetValue, percentage: 0, color: 'bg-slate-500' });

    // Liabilities
    const cc = Math.abs(summary.creditCardDebt || 0);
    const loan = Math.abs(summary.loanDebt || 0);
    const mortgage = Math.abs(summary.mortgageDebt || 0);

    if (cc) allItems.push({ label: 'Credit Card', value: cc, percentage: 0, color: 'bg-red-500' });
    if (loan) allItems.push({ label: 'Loans', value: loan, percentage: 0, color: 'bg-orange-600' });
    if (mortgage) allItems.push({ label: 'Mortgage', value: mortgage, percentage: 0, color: 'bg-red-600' });

    const total = allItems.reduce((sum, item) => sum + item.value, 0);
    const itemsWithPercent = allItems.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    })).sort((a, b) => b.value - a.value);

    return { items: itemsWithPercent, totalValue: total };
  }, [accountsData]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Asset allocation</h3>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No allocation data</p>
        ) : (
          items.map(item => (
            <div key={item.label} className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-muted-foreground font-medium truncate">{item.label}</span>
                <span className="text-foreground font-semibold ml-1 flex-shrink-0">
                  <CurrencyDisplay amountUSD={item.value} variant="small" />
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-300`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export const AssetAllocationWidget = memo(AssetAllocationWidgetComponent);
