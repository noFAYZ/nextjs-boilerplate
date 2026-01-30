'use client';

import { useState, useMemo, memo } from 'react';
import {
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useActiveBudgets } from '@/lib/queries/use-budget-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/features/organization/hooks';
import { Card } from '@/components/ui/card';
import { SolarCalculatorBoldDuotone } from '@/components/icons/icons';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { BudgetsEmptyState } from '@/components/ui/dashboard-empty-state';

function BudgetItem({ budget }: { budget: { spent?: number; limit?: number; name?: string } }) {
  const spent = budget.spent || 0;
  const limit = budget.limit || 0;
  const progress = limit > 0 ? (spent / limit) * 100 : 0;
  const isExceeded = spent > limit;

  const getProgressColor = () => {
    if (isExceeded) return 'bg-red-600 dark:bg-red-400';
    if (progress >= 80) return 'bg-orange-600 dark:bg-orange-400';
    return 'bg-green-600 dark:bg-green-400';
  };

  return (
    <Link href="/budgets">
      <div className={cn(
        'group relative flex items-center gap-2.5 p-2 rounded-lg transition-all duration-75',
        'hover:bg-muted/60 cursor-pointer'
      )}>
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {budget.icon && budget.icon !== 'null' ? (
            <span className="text-lg">{budget.icon}</span>
          ) : (
            <SolarCalculatorBoldDuotone className="h-5 w-5 text-muted-foreground" />
          )}
          {isExceeded && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-[3px] bg-red-500 ring-1 ring-background">
              <AlertTriangle className="h-2 w-2 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {budget.name}
          </h4>
          <div className="w-full h-2 bg-muted rounded-xs overflow-hidden mt-1">
            <div
              className={cn('h-full transition-all', getProgressColor())}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
          <CurrencyDisplay
            amountUSD={spent}
            variant="compact"
            className="text-xs font-semibold text-foreground"
          />
          <span className="text-[10px] text-muted-foreground">
            of <CurrencyDisplay amountUSD={limit} variant="compact" />
          </span>
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'all' | 'active' | 'exceeded' | 'paused';

function BudgetOverviewWidgetComponent() {
  const { data: budgetsResponse, isLoading: budgetsLoading } = useActiveBudgets();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { isRefetching } = useOrganizationRefetchState();

  const budgetsToShow = useMemo(() => {
    if (!budgetsResponse?.data) return [];

    const budgets = budgetsResponse.data;

    switch (activeTab) {
      case 'all':
        return budgets.slice(0, 4);
      case 'active':
        return budgets.filter(b => b.status === 'ACTIVE').slice(0, 4);
      case 'exceeded':
        return budgets.filter(b => (b.spent || 0) > (b.limit || 0)).slice(0, 4);
      case 'paused':
        return budgets.filter(b => b.status === 'PAUSED').slice(0, 4);
      default:
        return [];
    }
  }, [budgetsResponse, activeTab]);

  const tabCounts = useMemo(() => {
    if (!budgetsResponse?.data) return { all: 0, active: 0, exceeded: 0, paused: 0 };

    const data = budgetsResponse.data;
    return {
      all: data.length,
      active: data.filter(b => b.status === 'ACTIVE').length,
      exceeded: data.filter(b => (b.spent || 0) > (b.limit || 0)).length,
      paused: data.filter(b => b.status === 'PAUSED').length,
    };
  }, [budgetsResponse]);

  if (budgetsLoading) {
    return <WidgetSkeleton variant="list" itemsCount={3} />;
  }

  if (tabCounts.all === 0) {
    return (
      <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-sm bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <SolarCalculatorBoldDuotone className="h-5 w-5 text-teal-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate">Budgets</h3>
            </div>
            <Link href="/budgets" className="flex-shrink-0">
              <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <BudgetsEmptyState
              icon={<SolarCalculatorBoldDuotone className="h-6 w-6" />}
              showCard={false}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <SolarCalculatorBoldDuotone className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Budgets</h3>
          </div>
          <Link href="/budgets" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-3">
            <TabsList variant="pill" size="sm" className="w-full">
              <TabsTrigger value="all" variant="pill" size="sm" className="flex-1">
                <span>All</span>
                {tabCounts.all > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.all}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active" variant="pill" size="sm" className="flex-1">
                <span>Active</span>
                {tabCounts.active > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.active}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="exceeded" variant="pill" size="sm" className="flex-1">
                <span>Exceeded</span>
                {tabCounts.exceeded > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.exceeded}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {budgetsToShow.length > 0 ? (
            <div className="space-y-1.5">
              {budgetsToShow.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} />
              ))}
            </div>
          ) : (
            <BudgetsEmptyState
              icon={<SolarCalculatorBoldDuotone className="h-6 w-6" />}
              showCard={false}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

export const BudgetOverviewWidget = memo(BudgetOverviewWidgetComponent);
