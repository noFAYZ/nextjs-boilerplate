'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Loader2,
  ChevronRight,
  Home,
  Car,
  Package,
  Building2,
} from 'lucide-react';
import { useNetWorth } from '@/lib/queries/use-networth-data';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  MageCaretUpFill,
  MageCaretDownFill,
  SolarWallet2Outline,
  FluentBuildingBank28Regular,
} from '@/components/icons/icons';
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
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

export default function PortfolioPage() {
  const router = useRouter();
  const { pageClass } = useViewModeClasses();

  // ✅ UPDATED: Use Net Worth API for comprehensive aggregation
  const { data: netWorth, isLoading, refetch } = useNetWorth();
  const { isRefetching } = useOrganizationRefetchState();

  // Calculate stats from net worth data
  const stats = useMemo(() => {
    if (!netWorth) {
      return {
        totalNetWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        categories: [],
        totalAccounts: 0,
      };
    }

    const { summary, breakdown, performance } = netWorth;

    // Get day performance for change metrics
    const dayPerformance = performance?.day;

    const categories = [
      {
        key: 'crypto',
        name: 'Cryptocurrency',
        icon: <SolarWallet2Outline className="h-5 w-5" />,
        value: breakdown.crypto.value || 0,
        count: breakdown.crypto.walletCount || 0,
        percentage: 0,
        color: 'blue',
        route: '/portfolio/crypto',
      },
      {
        key: 'banking',
        name: 'Banking',
        icon: <FluentBuildingBank28Regular className="h-5 w-5" />,
        value: breakdown.cash.value || 0,
        count: breakdown.cash.accountCount || 0,
        percentage: 0,
        color: 'green',
        route: '/portfolio/banking',
      },
      {
        key: 'investment',
        name: 'Investments',
        icon: <Building2 className="h-5 w-5" />,
        value: breakdown.investment.value || 0,
        count: breakdown.investment.accountCount || 0,
        percentage: 0,
        color: 'purple',
        route: '/portfolio/investments',
      },
      {
        key: 'realEstate',
        name: 'Real Estate',
        icon: <Home className="h-5 w-5" />,
        value: breakdown.realEstate.value || 0,
        count: breakdown.realEstate.assetCount || 0,
        percentage: 0,
        color: 'orange',
        route: '/portfolio/real-estate',
      },
      {
        key: 'vehicle',
        name: 'Vehicles',
        icon: <Car className="h-5 w-5" />,
        value: breakdown.vehicle.value || 0,
        count: breakdown.vehicle.assetCount || 0,
        percentage: 0,
        color: 'cyan',
        route: '/portfolio/vehicles',
      },
      {
        key: 'otherAssets',
        name: 'Other Assets',
        icon: <Package className="h-5 w-5" />,
        value: breakdown.otherAssets.value || 0,
        count: breakdown.otherAssets.assetCount || 0,
        percentage: 0,
        color: 'yellow',
        route: '/portfolio/other-assets',
      },
    ].filter(cat => cat.value > 0); // Only show categories with value

    // Calculate percentages
    const totalValue = summary.totalAssets;
    categories.forEach(cat => {
      cat.percentage = totalValue > 0 ? (cat.value / totalValue) * 100 : 0;
    });

    const totalAccounts = categories.reduce((sum, cat) => sum + cat.count, 0);

    return {
      totalNetWorth: summary.totalNetWorth,
      totalAssets: summary.totalAssets,
      totalLiabilities: summary.totalLiabilities,
      dayChange: dayPerformance?.changeAmount || 0,
      dayChangePct: dayPerformance?.changePercent || 0,
      categories,
      totalAccounts,
    };
  }, [netWorth]);

  const handleRefreshAll = () => {
    // ✅ Refetch net worth data
    refetch();
    toast.success('Refreshing portfolio data...');
  };

  if (isLoading) {
    return (
      <div className={`${pageClass} p-4 lg:p-6 space-y-6`}>
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${pageClass} max-w-3xl mx-auto p-4 lg:p-6 space-y-4 relative`}>
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

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
                <BreadcrumbPage>Portfolio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalAccounts} accounts across all asset types
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={handleRefreshAll}
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

      {/* Total Net Worth */}
      <div className="group border bg-muted/60 rounded-xl p-4 hover:bg-muted transition-colors">
        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Net Worth</p>
        <div className="flex items-baseline gap-3 mb-2">
          <CurrencyDisplay
            amountUSD={stats.totalNetWorth}
            variant="large"
            className="text-3xl font-bold"
          />
          {stats.dayChange !== 0 && (
            <Badge
              className={cn(
                'flex items-center gap-1 h-6 px-2',
                stats.dayChange >= 0
                  ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-400'
              )}
            >
              {stats.dayChange >= 0 ? (
                <MageCaretUpFill className="h-4 w-4" />
              ) : (
                <MageCaretDownFill className="h-4 w-4" />
              )}
              <span className="font-medium text-sm">
                <CurrencyDisplay
                  amountUSD={Math.abs(stats.dayChange)}
                  variant="compact"
                  className="inline"
                />
                {' '}({Math.abs(stats.dayChangePct).toFixed(2)}%)
              </span>
            </Badge>
          )}
        </div>

        {/* Assets vs Liabilities */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
            <CurrencyDisplay
              amountUSD={stats.totalAssets}
              variant="default"
              className="text-sm font-semibold text-green-600 dark:text-green-400"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
            <CurrencyDisplay
              amountUSD={stats.totalLiabilities}
              variant="default"
              className="text-sm font-semibold text-red-600 dark:text-red-400"
            />
          </div>
        </div>
      </div>

      {/* Portfolio Categories */}
      <div className="space-y-2">
        {stats.categories.map((category) => {
          const colorMap: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
            green: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
            orange: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
            cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
            yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
          };

          const colors = colorMap[category.color] || colorMap.blue;

          return (
            <div
              key={category.key}
              className="group border bg-muted/60 rounded-xl hover:bg-muted transition-colors cursor-pointer"
              onClick={() => router.push(category.route)}
            >
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg, colors.text)}>
                    {category.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {category.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {category.count} {category.count === 1 ? 'account' : 'accounts'}
                    </p>
                  </div>

                  <div className="text-right">
                    <CurrencyDisplay
                      amountUSD={category.value}
                      variant="small"
                      className="font-semibold text-sm"
                    />
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {stats.categories.length === 0 && !isLoading && (
          <div className="border border-dashed rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No accounts found. Connect your first account to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
