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
import { AlertCircle, CreditCard, Home, Banknote } from 'lucide-react';

interface DebtItem {
  label: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

export function DebtSummaryWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  const { debts, totalDebt } = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) {
      return { debts: [], totalDebt: 0 };
    }

    const debtsList: DebtItem[] = [];
    const creditCard = Math.abs(typedData.summary.creditCardDebt || 0);
    const loan = Math.abs(typedData.summary.loanDebt || 0);
    const mortgage = Math.abs(typedData.summary.mortgageDebt || 0);

    const total = creditCard + loan + mortgage;

    if (creditCard > 0) {
      debtsList.push({
        label: 'Credit Card',
        value: creditCard,
        percentage: (creditCard / total) * 100,
        icon: <CreditCard className="h-4 w-4" />,
        color: 'bg-red-500',
      });
    }

    if (loan > 0) {
      debtsList.push({
        label: 'Personal Loans',
        value: loan,
        percentage: (loan / total) * 100,
        icon: <Banknote className="h-4 w-4" />,
        color: 'bg-orange-500',
      });
    }

    if (mortgage > 0) {
      debtsList.push({
        label: 'Mortgage',
        value: mortgage,
        percentage: (mortgage / total) * 100,
        icon: <Home className="h-4 w-4" />,
        color: 'bg-amber-500',
      });
    }

    return {
      debts: debtsList.sort((a, b) => b.value - a.value),
      totalDebt: total,
    };
  }, [accountsData]);

  if (isLoading) {
    return <CardSkeleton className="h-[380px]" />;
  }

  return (
    <Card className="relative border border-border/50 h-[380px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Debt Summary</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {debts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-sm font-semibold text-foreground">Debt Free!</p>
              <p className="text-[10px] text-muted-foreground mt-1">No outstanding debts</p>
            </div>
          </div>
        ) : (
          <>
            {/* Total Debt */}
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-1.5">
              <p className="text-[10px] font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
                Total Debt
              </p>
              <p className="text-2xl font-bold text-foreground">
                <CurrencyDisplay amountUSD={totalDebt} variant="small" />
              </p>
              <div className="text-[10px] text-muted-foreground">
                {debts.length} active debt {debts.length === 1 ? 'account' : 'accounts'}
              </div>
            </div>

            {/* Debt Breakdown */}
            <div className="space-y-3">
              {debts.map(debt => (
                <div key={debt.label} className="space-y-1.5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('p-1.5 rounded-lg text-white', debt.color)}>
                        {debt.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{debt.label}</p>
                        <p className="text-[10px] text-muted-foreground">{debt.percentage.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">
                        <CurrencyDisplay amountUSD={debt.value} variant="small" />
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-secondary/40 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300 ease-out', debt.color)}
                      style={{ width: `${debt.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Tips */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] space-y-1 text-amber-900 dark:text-amber-200">
              <p className="font-semibold">💡 Reduction Tips:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[9px]">
                <li>Pay more than minimum on high-interest debt</li>
                <li>Consider debt consolidation if beneficial</li>
                <li>Build emergency fund alongside debt repayment</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
