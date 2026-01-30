'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { TrendingDown } from 'lucide-react';

interface LiabilityItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const LIABILITY_COLORS = [
  'bg-red-500',       // credit card
  'bg-orange-500',    // loans
  'bg-amber-500',     // mortgage
];

function LiabilitiesBreakdownWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();
  const [hoveredLiability, setHoveredLiability] = useState<string>('');

  const liabilityData = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) return [];

    const items: LiabilityItem[] = [];
    const creditCard = Math.abs(typedData.summary.creditCardDebt || 0);
    const loan = Math.abs(typedData.summary.loanDebt || 0);
    const mortgage = Math.abs(typedData.summary.mortgageDebt || 0);
    const total = creditCard + loan + mortgage;

    if (creditCard > 0) items.push({ label: 'Credit Card', value: creditCard, percentage: (creditCard / total) * 100, color: LIABILITY_COLORS[0] });
    if (loan > 0) items.push({ label: 'Loans', value: loan, percentage: (loan / total) * 100, color: LIABILITY_COLORS[1] });
    if (mortgage > 0) items.push({ label: 'Mortgage', value: mortgage, percentage: (mortgage / total) * 100, color: LIABILITY_COLORS[2] });

    return items.sort((a, b) => b.value - a.value);
  }, [accountsData]);

  const totalValue = useMemo(() => {
    return liabilityData.reduce((sum, item) => sum + item.value, 0);
  }, [liabilityData]);

  const activeLiability = useMemo(() => {
    return liabilityData.find(l => l.label === hoveredLiability);
  }, [liabilityData, hoveredLiability]);

  const handleLiabilityMouseEnter = useCallback((label: string) => {
    setHoveredLiability(label);
  }, []);

  const handleLiabilityMouseLeave = useCallback(() => {
    setHoveredLiability('');
  }, []);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Liabilities breakdown</h3>
        <TrendingDown className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      {liabilityData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">No liabilities</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {/* Progress Bars */}
          <div className="space-y-2">
            {liabilityData.map(item => (
              <div
                key={item.label}
                onMouseEnter={() => handleLiabilityMouseEnter(item.label)}
                onMouseLeave={handleLiabilityMouseLeave}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span className="text-foreground font-semibold">
                    <CurrencyDisplay amountUSD={item.value} variant="small" />
                  </span>
                </div>
                <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${item.color}`}
                    style={{
                      width: `${item.percentage}%`,
                      opacity: !hoveredLiability || hoveredLiability === item.label ? 1 : 0.3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-border/50 space-y-1">
            <p className="text-[10px] text-muted-foreground">Total liabilities</p>
            <p className="text-sm font-semibold text-foreground">
              <CurrencyDisplay amountUSD={totalValue} variant="small" />
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

export const LiabilitiesBreakdownWidget = memo(LiabilitiesBreakdownWidgetComponent);
