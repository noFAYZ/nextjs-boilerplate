'use client';

import React, { useState, useMemo } from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Eye, EyeOff, RefreshCw, Plus, TrendingUp, PieChart, Wallet, DollarSign } from 'lucide-react';
import { NetWorthSummary } from '@/components/accounts-v2/networth-summary';
import { AssetLiabilityBreakdown } from '@/components/accounts-v2/asset-liability-breakdown';
import { NetWorthTrendChart } from '@/components/accounts-v2/networth-trend-chart';
import { AccountsGrid } from '@/components/accounts-v2/accounts-grid';
import { NetWorthSnapshots } from '@/components/accounts-v2/networth-snapshots';
import { AccountsStats } from '@/components/accounts-v2/accounts-stats';

type DashboardTab = 'overview' | 'assets' | 'snapshots' | 'stats';

export default function AccountsV2Page() {
  usePostHogPageView('accounts-v2');

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const { data: accountsData, isLoading, refetch } = useAllAccounts();
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const setBalanceVisible = useAccountsUIStore((state) => state.setBalanceVisible);

  // Calculate summary from grouped accounts
  const summary = useMemo(() => {
    if (!accountsData?.summary) {
      return null;
    }
    return accountsData.summary;
  }, [accountsData?.summary]);

  const categories = useMemo(() => {
    if (!accountsData?.groups) return [];
    return Object.entries(accountsData.groups).filter(([, group]) => group.accounts.length > 0);
  }, [accountsData?.groups]);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete view of your financial accounts, net worth, and asset allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="h-8 w-8 p-0"
            title={balanceVisible ? 'Hide balances' : 'Show balances'}
          >
            {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4 mr-1', isLoading && 'animate-spin')} />
            Refresh
          </Button>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Net Worth Hero Section */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Total Net Worth */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Net Worth</p>
                <h2 className="text-4xl font-bold">
                  {balanceVisible ? (
                    <CurrencyDisplay amountUSD={summary.totalNetWorth} variant="xl" className="text-foreground" />
                  ) : (
                    <span className="text-foreground">••••••••</span>
                  )}
                </h2>
              </div>
              <div className="h-16 w-16 rounded-lg bg-primary/20 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Total Assets</p>
                <p className="text-2xl font-bold">
                  {balanceVisible ? (
                    <CurrencyDisplay amountUSD={summary.totalAssets} variant="lg" className="text-emerald-600 dark:text-emerald-500" />
                  ) : (
                    <span>••••</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Total Liabilities</p>
                <p className="text-2xl font-bold">
                  {balanceVisible ? (
                    <CurrencyDisplay amountUSD={summary.totalLiabilities} variant="lg" className="text-red-600 dark:text-red-500" />
                  ) : (
                    <span>••••</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            {/* Account Count */}
            <div className="bg-card rounded-lg border border-border/50 p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Accounts</p>
              <p className="text-3xl font-bold text-foreground">{summary.accountCount}</p>
              <p className="text-xs text-muted-foreground mt-2">{categories.length} categories</p>
            </div>

            {/* Net Worth Ratio */}
            <div className="bg-card rounded-lg border border-border/50 p-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">A/L Ratio</p>
              <p className="text-3xl font-bold text-foreground">
                {summary.totalLiabilities > 0
                  ? ((summary.totalAssets / summary.totalLiabilities) * 100).toFixed(0) + '%'
                  : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Assets to Liabilities</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)}>
        <TabsList className="grid grid-cols-4 gap-0.5" variant="ghost">
          <TabsTrigger value="overview" variant="ghost" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assets" variant="ghost" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="snapshots" variant="ghost" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Snapshots
          </TabsTrigger>
          <TabsTrigger value="stats" variant="ghost" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'overview' && (
          <div className="h-full space-y-6 overflow-y-auto pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NetWorthSummary isLoading={isLoading} balanceVisible={balanceVisible} />
              </div>
              <div>
                <NetWorthTrendChart isLoading={isLoading} balanceVisible={balanceVisible} />
              </div>
            </div>

            {/* Full Width Trend Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Net Worth History</h3>
              <NetWorthTrendChart isLoading={isLoading} balanceVisible={balanceVisible} />
            </div>

            {/* All Accounts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">All Accounts</h3>
              <AccountsGrid accountsData={accountsData} isLoading={isLoading} balanceVisible={balanceVisible} />
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="h-full overflow-y-auto pb-6">
            <AssetLiabilityBreakdown accountsData={accountsData} isLoading={isLoading} balanceVisible={balanceVisible} />
          </div>
        )}

        {activeTab === 'snapshots' && (
          <div className="h-full overflow-y-auto pb-6">
            <NetWorthSnapshots balanceVisible={balanceVisible} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="h-full overflow-y-auto pb-6">
            <AccountsStats balanceVisible={balanceVisible} />
          </div>
        )}
      </div>
    </div>
  );
}
