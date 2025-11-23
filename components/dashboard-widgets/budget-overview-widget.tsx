'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useActiveBudgets, useBudgetSummary } from '@/lib/queries/use-budget-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Card } from '../ui/card';
import { SolarCalculatorBoldDuotone } from '../icons/icons';

// Budget Item Component
function BudgetItem({ budget }: { budget: any }) {
  // Calculate progress
  const spent = budget.spent || 0;
  const limit = budget.limit || 0;
  const progress = limit > 0 ? (spent / limit) * 100 : 0;

  const isExceeded = spent > limit;
  const percentageUsed = Math.min(progress, 100);
  const remainingAmount = Math.max(limit - spent, 0);

  const getStatusBgColor = () => {
    if (isExceeded) return 'bg-red-500/5 hover:bg-red-500/10';
    if (percentageUsed >= 80) return 'bg-orange-500/5 hover:bg-orange-500/10';
    return 'hover:bg-muted/60';
  };

  const getProgressColor = () => {
    if (isExceeded) return 'bg-red-600 dark:bg-red-400';
    if (percentageUsed >= 80) return 'bg-orange-600 dark:bg-orange-400';
    return 'bg-green-600 dark:bg-green-400';
  };

  const getProgressTextColor = () => {
    if (isExceeded) return 'text-red-600 dark:text-red-400';
    if (percentageUsed >= 80) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <Link href="/budgets">
      <div
        className={cn(
          'group relative border border-border/80 flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-75',
          'cursor-pointer',
          getStatusBgColor()
        )}
      >
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="h-11 w-11 rounded-lg bg-muted/50 flex items-center justify-center">
            {budget.icon && budget.icon !== 'null' ? (
              <span className="text-lg">{budget.icon}</span>
            ) : (
              <SolarCalculatorBoldDuotone className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          {isExceeded && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-[4px] bg-red-500 ring-1 ring-background">
              <AlertTriangle className="h-2.5 w-2.5 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {budget.name}
            </h4>
          </div>

          {/* Progress Bar and Info */}
          <div className="space-y-1.5 w-full">
            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-muted rounded-full overflow-hidden"
              data-progress={`${percentageUsed.toFixed(1)}%`}
            >
              <div
                className={cn('h-full rounded-full transition-all duration-300 ease-out', getProgressColor())}
                style={{
                  width: `${Math.max(percentageUsed, 0)}%`,
                  minWidth: percentageUsed > 2 ? '0px' : '2px'
                }}
                data-spent={spent}
                data-limit={limit}
              />
            </div>
            {/* Progress Info */}
            <div className="flex items-center justify-between text-[10px] gap-1">
              <div className="flex items-center gap-1">
                <span className={cn('font-semibold', getProgressTextColor())}>
                  {Math.max(percentageUsed, 0).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">•</span>
                <CurrencyDisplay
                  amountUSD={spent}
                  variant="compact"
                  className="font-medium text-foreground"
                />
              </div>
              <span className="text-muted-foreground">
                <CurrencyDisplay
                  amountUSD={limit}
                  variant="compact"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="flex flex-col items-end flex-shrink-0 gap-1">
          {isExceeded ? (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
              <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                Over
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground">
                {budget.cycle || 'Monthly'}
              </span>
            </div>
          )}
          <Badge
            variant="outline"
            className={cn(
              'text-[8px] h-4 px-1 font-medium',
              budget.status === 'ACTIVE' && 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
              budget.status === 'PAUSED' && 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
              budget.status === 'ARCHIVED' && 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
            )}
          >
            {budget.status}
          </Badge>
        </div>

        {/* Hover Indicator */}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'all' | 'active' | 'exceeded' | 'paused';

export function BudgetOverviewWidget() {
  const { data: budgetsResponse, isLoading: budgetsLoading } = useActiveBudgets();
  const summary = useBudgetSummary();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { isRefetching } = useOrganizationRefetchState();

  // Get budgets to display based on active tab
  const budgetsToShow = useMemo(() => {
    if (!budgetsResponse?.data) return [];

    const budgets = budgetsResponse.data;

    switch (activeTab) {
      case 'all':
        return budgets.slice(0, 5);
      case 'active':
        return budgets.filter(b => b.status === 'ACTIVE').slice(0, 5);
      case 'exceeded':
        return budgets.filter(b => (b.spent || 0) > (b.limit || 0)).slice(0, 5);
      case 'paused':
        return budgets.filter(b => b.status === 'PAUSED').slice(0, 5);
      default:
        return [];
    }
  }, [budgetsResponse, activeTab]);

  // Calculate tab counts
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

  // Loading State
  if (budgetsLoading) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-4">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
          <div className="space-y-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }

  // Empty State
  if (tabCounts.all === 0) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center">
              <SolarCalculatorBoldDuotone className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Budgets</h3>
          </div>
          <Link href="/budgets">
            <Button variant="outline" className="text-[11px] cursor-pointer hover:bg-muted transition-colors h-7" size="sm">
              Create Budget
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="py-8 text-center">
          <SolarCalculatorBoldDuotone className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs font-medium text-foreground mb-0.5">
            No budgets yet
          </p>
          <p className="text-[10px] text-muted-foreground">
            Create a budget to start tracking your spending
          </p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }

  return (
    <Card className="relative border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-blue-500 flex items-center justify-center">
            <SolarCalculatorBoldDuotone className="h-5 w-5 text-blue-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Budgets</h3>
        </div>

        <Link href="/budgets">
          <Button variant="link" className="text-[11px] cursor-pointer transition-colors h-7" size="sm">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Main Metric */}
      {summary.totalBudgeted > 0 && (
        <div className="my-4">
          <div className="text-xs text-muted-foreground mb-1">Total Budgeted</div>
          <div className="flex items-baseline gap-2">
            <CurrencyDisplay
              amountUSD={summary.totalBudgeted}
              variant="large"
              className="text-3xl font-semibold"
            />
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>{summary.averageUtilization.toFixed(0)}% avg used</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-4">
        <TabsList variant="pill" size="sm">
          <TabsTrigger value="all" variant="pill" size="sm" className="flex-1">
            <span>All</span>
            {tabCounts.all > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" variant="pill" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4" />
            <span>Active</span>
            {tabCounts.active > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.active}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="exceeded" variant="pill" size="sm" className="flex-1">
            <AlertCircle className="h-4 w-4" />
            <span>Exceeded</span>
            {tabCounts.exceeded > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.exceeded}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paused" variant="pill" size="sm" className="flex-1">
            <Clock className="h-4 w-4" />
            <span>Paused</span>
            {tabCounts.paused > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.paused}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Budgets List */}
      {budgetsToShow.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              {activeTab === 'all' && <SolarCalculatorBoldDuotone className="h-4 w-4 text-muted-foreground" />}
              {activeTab === 'active' && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
              {activeTab === 'exceeded' && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
              {activeTab === 'paused' && <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {activeTab === 'all' && 'All Budgets'}
                {activeTab === 'active' && 'Active Budgets'}
                {activeTab === 'exceeded' && 'Over Budget'}
                {activeTab === 'paused' && 'Paused Budgets'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {budgetsToShow.length} of {
                activeTab === 'all' ? tabCounts.all :
                activeTab === 'active' ? tabCounts.active :
                activeTab === 'exceeded' ? tabCounts.exceeded :
                tabCounts.paused
              }
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            {budgetsToShow.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
          {activeTab === 'all' && (
            <>
              <SolarCalculatorBoldDuotone className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No budgets</p>
              <p className="text-[9px] text-muted-foreground">
                Create a budget to get started
              </p>
            </>
          )}
          {activeTab === 'active' && (
            <>
              <TrendingUp className="h-5 w-5 mx-auto mb-1.5 text-green-600 dark:text-green-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No active budgets</p>
              <p className="text-[9px] text-muted-foreground">
                You have no active budgets
              </p>
            </>
          )}
          {activeTab === 'exceeded' && (
            <>
              <AlertCircle className="h-5 w-5 mx-auto mb-1.5 text-red-600 dark:text-red-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">Great job!</p>
              <p className="text-[9px] text-muted-foreground">
                No budgets exceeded
              </p>
            </>
          )}
          {activeTab === 'paused' && (
            <>
              <Clock className="h-5 w-5 mx-auto mb-1.5 text-orange-600 dark:text-orange-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No paused budgets</p>
              <p className="text-[9px] text-muted-foreground">
                All your budgets are active
              </p>
            </>
          )}
        </div>
      )}
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </Card>
  );
}
