'use client';

import { useMemo, useState } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CreditCard, AlertCircle } from 'lucide-react';

// Liability type colors
const LIABILITY_COLORS = {
  creditCard: '#ef4444',      // Red
  loan: '#f97316',             // Orange
  mortgage: '#dc2626',         // Dark Red
};

interface LiabilityData {
  name: string;
  value: number;
  color: string;
}

export function LiabilitiesBreakdownWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();
  const [activeDebt, setActiveDebt] = useState<string>('');

  const liabilityData = useMemo(() => {
    const typedData = accountsData as any;
    if (!typedData?.summary) return [];

    const liabilities: LiabilityData[] = [];

    const creditCard = Math.abs(typedData.summary.creditCardDebt || 0);
    const loan = Math.abs(typedData.summary.loanDebt || 0);
    const mortgage = Math.abs(typedData.summary.mortgageDebt || 0);

    if (creditCard > 0) liabilities.push({ name: 'Credit Card', value: creditCard, color: LIABILITY_COLORS.creditCard });
    if (loan > 0) liabilities.push({ name: 'Loans', value: loan, color: LIABILITY_COLORS.loan });
    if (mortgage > 0) liabilities.push({ name: 'Mortgage', value: mortgage, color: LIABILITY_COLORS.mortgage });

    return liabilities;
  }, [accountsData]);

  const totalLiabilities = useMemo(() => {
    return liabilityData.reduce((sum, liability) => sum + liability.value, 0);
  }, [liabilityData]);

  const activeDebtData = useMemo(() => {
    return liabilityData.find(d => d.name === activeDebt);
  }, [liabilityData, activeDebt]);

  if (isLoading) {
    return <CardSkeleton className="h-[400px]" />;
  }

  return (
    <Card className="relative border border-border/50 h-[400px] flex flex-col p-4">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-4 w-4 text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Liabilities Breakdown</h3>
        </div>
      </div>

      {/* Content */}
      {liabilityData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500/60" />
            <p className="text-xs font-medium text-foreground">No liabilities</p>
            <p className="text-[10px] text-muted-foreground mt-1">Great job!</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Chart */}
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={liabilityData}
                  cx="50%"
                  cy="45%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveDebt(liabilityData[index].name)}
                  onMouseLeave={() => setActiveDebt('')}
                >
                  {liabilityData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={!activeDebt || activeDebt === entry.name ? 1 : 0.3}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend & Stats */}
          <div className="space-y-2 flex-shrink-0">
            {activeDebtData ? (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-[10px] font-medium text-red-700 dark:text-red-400">{activeDebtData.name}</p>
                <p className="text-lg font-bold text-foreground">
                  <CurrencyDisplay amountUSD={activeDebtData.value} variant="small" />
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {((activeDebtData.value / totalLiabilities) * 100).toFixed(1)}% of total
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <p className="text-[10px] font-medium text-muted-foreground">Total Liabilities</p>
                <p className="text-lg font-bold text-foreground">
                  <CurrencyDisplay amountUSD={totalLiabilities} variant="small" />
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {liabilityData.map(liability => (
                <div key={liability.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: liability.color }} />
                  <span className="text-muted-foreground">{liability.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
