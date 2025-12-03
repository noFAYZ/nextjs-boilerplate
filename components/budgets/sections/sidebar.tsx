import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { cn } from '@/lib/utils';

interface Totals {
  totalAllocated: number;
  totalSpent: number;
  totalBalance: number;
  exceededCount: number;
}

export function BudgetsSidebar({
  totals,
  showBalances,
  filteredEnvelopesLength,
}: {
  totals: Totals;
  showBalances: boolean;
  filteredEnvelopesLength: number;
}) {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Budget Overview Card */}
      <Card className="border-border/80 p-4">
        <p className="text-sm text-muted-foreground uppercase font-medium mb-4">
          Budget Overview
        </p>

        {/* Metrics Grid */}
        <div className="space-y-3">
          {/* Allocated */}
          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-muted-foreground font-medium mb-1">Allocated</p>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {showBalances ? (
                <CurrencyDisplay amountUSD={totals.totalAllocated} variant="compact" />
              ) : (
                '••••'
              )}
            </div>
          </div>

          {/* Spent */}
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-xs text-muted-foreground font-medium mb-1">Spent</p>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {showBalances ? (
                <CurrencyDisplay amountUSD={totals.totalSpent} variant="compact" />
              ) : (
                '••••'
              )}
            </div>
          </div>

          {/* Unspent/Left to Assign */}
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground font-medium mb-1">Unspent</p>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {showBalances ? (
                <CurrencyDisplay amountUSD={Math.max(0, totals.totalAllocated - totals.totalSpent)} variant="compact" />
              ) : (
                '••••'
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Card */}
      <Card className="border-border/80 p-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground uppercase font-medium">
            Spending Progress
          </p>
          <span className="text-2xl font-bold">
            {totals.totalAllocated > 0
              ? ((totals.totalSpent / totals.totalAllocated) * 100).toFixed(0)
              : 0}%
          </span>
        </div>

        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className={cn(
              'h-full transition-all rounded-full',
              (totals.totalSpent / totals.totalAllocated) * 100 > 100
                ? 'bg-red-500'
                : (totals.totalSpent / totals.totalAllocated) * 100 >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            )}
            style={{
              width: `${Math.min(
                (totals.totalSpent / totals.totalAllocated) * 100,
                100
              )}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2 bg-muted rounded">
            <p className="text-muted-foreground mb-1">Categories</p>
            <p className="font-bold text-foreground">{filteredEnvelopesLength}</p>
          </div>
          <div className={cn(
            'p-2 rounded',
            totals.exceededCount > 0
              ? 'bg-red-500/10 border border-red-200 dark:border-red-800'
              : 'bg-muted'
          )}>
            <p className={cn(
              'text-muted-foreground mb-1',
              totals.exceededCount > 0 && 'text-red-600 dark:text-red-400'
            )}>
              At Risk
            </p>
            <p className={cn(
              'font-bold',
              totals.exceededCount > 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-foreground'
            )}>
              {totals.exceededCount}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
