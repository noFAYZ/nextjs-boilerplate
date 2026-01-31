'use client';

import { useMemo, memo } from 'react';
import { useAllAccounts } from '@/lib/features/accounts/queries';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { AlertCircle } from 'lucide-react';

interface DebtItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function DebtSummaryWidgetComponent() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { debts, totalDebt } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) return { debts: [], totalDebt: 0 };

    const debtsList: DebtItem[] = [];
    const cc = Math.abs(typedData.summary.creditCardDebt || 0);
    const loan = Math.abs(typedData.summary.loanDebt || 0);
    const mortgage = Math.abs(typedData.summary.mortgageDebt || 0);
    const total = cc + loan + mortgage;

    if (cc) debtsList.push({ label: 'Credit Card', value: cc, percentage: (cc / total) * 100, color: 'bg-red-500' });
    if (loan) debtsList.push({ label: 'Loans', value: loan, percentage: (loan / total) * 100, color: 'bg-orange-500' });
    if (mortgage) debtsList.push({ label: 'Mortgage', value: mortgage, percentage: (mortgage / total) * 100, color: 'bg-amber-500' });

    return {
      debts: debtsList.sort((a, b) => b.value - a.value),
      totalDebt: total,
    };
  }, [accountsData]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none h-full flex flex-col">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-medium text-muted-foreground">Debt summary</h3>
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {debts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-muted-foreground">No debts</p>
          </div>
        ) : (
          <>
            {debts.map(debt => (
              <div key={debt.label} className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-muted-foreground font-medium">{debt.label}</span>
                  <span className="text-foreground font-semibold">
                    <CurrencyDisplay amountUSD={debt.value} variant="small" />
                  </span>
                </div>
                <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div className={`h-full ${debt.color} transition-all duration-300`} style={{ width: `${debt.percentage}%` }} />
                </div>
              </div>
            ))}

            <div className="pt-1.5 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Total debt</p>
              <p className="text-sm font-semibold text-red-600">
                <CurrencyDisplay amountUSD={totalDebt} variant="small" />
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export const DebtSummaryWidget = memo(DebtSummaryWidgetComponent);
