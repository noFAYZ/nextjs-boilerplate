'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, TrendingUp, Plus } from 'lucide-react';
import { useNetWorth } from '@/lib/queries/use-networth-data';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MageCaretUpFill, MageCaretDownFill } from '@/components/icons/icons';
import { useViewModeClasses } from '@/lib/contexts/view-mode-context';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NetWorthChart } from '@/components/networth/networth-chart';
import { NetWorthBreakdown } from '@/components/networth/networth-breakdown';
import { AssetList } from '@/components/assets/asset-list';
import { AssetFormModal } from '@/components/assets/asset-form-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AssetAccount } from '@/lib/types/networth';

export default function NetWorthPage() {
  const { pageClass } = useViewModeClasses();
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetAccount | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // ✅ Use Net Worth API
  const { data: netWorth, isLoading, refetch } = useNetWorth();

  const handleRefresh = () => {
    refetch();
    toast.success('Refreshing net worth data...');
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleEditAsset = (asset: AssetAccount) => {
    setSelectedAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleDeleteAsset = (asset: AssetAccount) => {
    // TODO: Implement delete confirmation dialog
    toast.info('Delete functionality coming soon');
  };

  const handleViewAsset = (asset: AssetAccount) => {
    // Navigate to asset detail page or show detail modal
    toast.info('Asset details coming soon');
  };

  if (isLoading) {
    return (
      <div className={`${pageClass} p-4 lg:p-6 space-y-6`}>
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const summary = netWorth?.summary;
  const performance = netWorth?.performance;
  const dayPerformance = performance?.day;

  return (
    <div className={`${pageClass} max-w-7xl mx-auto p-4 lg:p-6 space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Net Worth</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground mt-1">
            Track your complete financial picture
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Net Worth Summary */}
      <div className="border bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase font-medium mb-2">
              Total Net Worth
            </p>
            <div className="flex items-baseline gap-3">
              <CurrencyDisplay
                amountUSD={summary?.totalNetWorth || 0}
                variant="large"
                className="text-4xl font-bold"
              />
              {dayPerformance && dayPerformance.changeAmount !== 0 && (
                <Badge
                  className={cn(
                    'flex items-center gap-1 h-7 px-2.5',
                    dayPerformance.changeAmount >= 0
                      ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-400'
                      : 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-400'
                  )}
                >
                  {dayPerformance.changeAmount >= 0 ? (
                    <MageCaretUpFill className="h-4 w-4" />
                  ) : (
                    <MageCaretDownFill className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    <CurrencyDisplay
                      amountUSD={Math.abs(dayPerformance.changeAmount)}
                      variant="compact"
                      className="inline"
                    />
                    {' '}({Math.abs(dayPerformance.changePercent).toFixed(2)}%)
                  </span>
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dayPerformance && dayPerformance.changeAmount !== 0
                ? 'Change in last 24 hours'
                : `As of ${new Date(summary?.asOfDate || Date.now()).toLocaleDateString()}`}
            </p>
          </div>

          <Button onClick={handleCreateAsset} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </div>

        {/* Assets vs Liabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-200 dark:border-green-800">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
              <CurrencyDisplay
                amountUSD={summary?.totalAssets || 0}
                variant="default"
                className="text-2xl font-bold text-green-600 dark:text-green-400"
              />
            </div>
            <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
              <CurrencyDisplay
                amountUSD={summary?.totalLiabilities || 0}
                variant="default"
                className="text-2xl font-bold text-red-600 dark:text-red-400"
              />
            </div>
            <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400 rotate-180" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Chart */}
          <div className="border rounded-xl p-6 bg-card">
            <NetWorthChart
              height={400}
              showPeriodFilter
              showMetrics
              defaultPeriod="1m"
            />
          </div>

          {/* Quick Stats */}
          <div className="border rounded-xl p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'This Week', key: 'week' },
                { label: 'This Month', key: 'month' },
                { label: 'This Quarter', key: 'quarter' },
                { label: 'This Year', key: 'year' },
              ].map((period) => {
                const perf = performance?.[period.key as keyof typeof performance] as any;
                const change = perf?.changeAmount || 0;
                const changePct = perf?.changePercent || 0;

                return (
                  <div key={period.key} className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">{period.label}</p>
                    <div className={cn(
                      'text-lg font-bold',
                      change >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {change >= 0 ? '+' : ''}
                      <CurrencyDisplay
                        amountUSD={Math.abs(change)}
                        variant="compact"
                        className="inline"
                      />
                    </div>
                    <p className={cn(
                      'text-xs',
                      change >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {change >= 0 ? '+' : ''}{changePct.toFixed(2)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6 mt-6">
          <div className="border rounded-xl p-6 bg-card">
            <NetWorthBreakdown />
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6 mt-6">
          <div className="border rounded-xl p-6 bg-card">
            <AssetList
              onCreateAsset={handleCreateAsset}
              onEditAsset={handleEditAsset}
              onDeleteAsset={handleDeleteAsset}
              onViewAsset={handleViewAsset}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Asset Form Modal */}
      <AssetFormModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
      />
    </div>
  );
}
