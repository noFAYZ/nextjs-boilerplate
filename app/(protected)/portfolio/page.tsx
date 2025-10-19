'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useCryptoWallets, useCryptoPortfolio } from '@/lib/queries';
import { useBankingAccounts } from '@/lib/queries/banking-queries';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  MageCaretUpFill,
  MageCaretDownFill,
  SolarWallet2Outline,
  FluentBuildingBank28Regular,
  HugeiconsPieChart09,
} from '@/components/icons/icons';
import { useViewModeClasses } from '@/lib/contexts/view-mode-context';
import { toast } from 'sonner';

export default function PortfolioPage() {
  const router = useRouter();
  const { pageClass } = useViewModeClasses();

  // ✅ NEW: Data from TanStack Query
  const { data: wallets = [], isLoading: walletsLoading, refetch: refetchWallets } = useCryptoWallets();
  const { data: portfolio, isLoading: portfolioLoading, refetch: refetchPortfolio } = useCryptoPortfolio();
  const { data: bankAccounts = [], isLoading: bankLoading, refetch: refetchBanking } = useBankingAccounts();

  const isLoading = walletsLoading || portfolioLoading || bankLoading;

  // Calculate stats
  const stats = useMemo(() => {
    const cryptoTotalValue = portfolio?.totalValueUsd || 0;
    const cryptoChange24h = portfolio?.dayChangePct || 0;
    const cryptoAbsoluteChange = portfolio?.dayChange || 0;

    const bankingTotalValue = bankAccounts?.reduce((sum, account) => {
      return sum + parseFloat(account.availableBalance?.toString() || account.balance.toString() || '0');
    }, 0) || 0;

    const totalValue = cryptoTotalValue + bankingTotalValue;
    const cryptoPercentage = totalValue > 0 ? (cryptoTotalValue / totalValue) * 100 : 0;
    const bankingPercentage = totalValue > 0 ? (bankingTotalValue / totalValue) * 100 : 0;

    return {
      totalValue,
      cryptoTotalValue,
      bankingTotalValue,
      cryptoPercentage,
      bankingPercentage,
      cryptoChange24h,
      cryptoAbsoluteChange,
      cryptoCount: wallets?.length || 0,
      bankCount: bankAccounts?.length || 0,
      totalAccounts: (wallets?.length || 0) + (bankAccounts?.length || 0),
    };
  }, [wallets, portfolio, bankAccounts]);

  const handleRefreshAll = () => {
    // ✅ Refetch all data sources
    refetchWallets();
    refetchPortfolio();
    refetchBanking();
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
    <div className={`${pageClass} max-w-3xl mx-auto p-4 lg:p-6 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
            <HugeiconsPieChart09 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Portfolio Overview</h1>
            <p className="text-xs text-muted-foreground">
              {stats.totalAccounts} accounts across crypto and banking
            </p>
          </div>
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

      {/* Total Value */}
      <div className="group border bg-muted/60 rounded-xl p-4 hover:bg-muted transition-colors">
        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Portfolio Value</p>
        <div className="flex items-baseline gap-3 mb-2">
          <CurrencyDisplay
            amountUSD={stats.totalValue}
            variant="large"
            className="text-3xl font-bold"
          />
          {stats.cryptoAbsoluteChange !== 0 && (
            <Badge
              className={cn(
                'flex items-center gap-1 h-6 px-2',
                stats.cryptoAbsoluteChange >= 0
                  ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-400'
              )}
            >
              {stats.cryptoAbsoluteChange >= 0 ? (
                <MageCaretUpFill className="h-4 w-4" />
              ) : (
                <MageCaretDownFill className="h-4 w-4" />
              )}
              <span className="font-medium text-sm">
                <CurrencyDisplay
                  amountUSD={Math.abs(stats.cryptoAbsoluteChange)}
                  variant="compact"
                  className="inline"
                />
                {' '}({Math.abs(stats.cryptoChange24h).toFixed(2)}%)
              </span>
            </Badge>
          )}
        </div>

        {/* Allocation bars */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${stats.cryptoPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-[120px]">
              <SolarWallet2Outline className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <CurrencyDisplay amountUSD={stats.cryptoTotalValue} variant="compact" className="inline font-medium" />
              <span>({stats.cryptoPercentage.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${stats.bankingPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-[120px]">
              <FluentBuildingBank28Regular className="h-3 w-3 text-green-600 dark:text-green-400" />
              <CurrencyDisplay amountUSD={stats.bankingTotalValue} variant="compact" className="inline font-medium" />
              <span>({stats.bankingPercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Categories */}
      <div className="space-y-2">
        {/* Crypto Portfolio */}
        <div
          className="group border bg-muted/60 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          onClick={() => router.push('/portfolio/crypto')}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <SolarWallet2Outline className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">Cryptocurrency</h3>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {stats.cryptoPercentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{stats.cryptoCount} wallets</p>
              </div>

              <div className="text-right">
                <CurrencyDisplay
                  amountUSD={stats.cryptoTotalValue}
                  variant="small"
                  className="font-semibold text-sm mb-1"
                />
                {stats.cryptoChange24h !== 0 && (
                  <div
                    className={cn(
                      'flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs justify-end',
                      stats.cryptoChange24h >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {Math.abs(stats.cryptoChange24h).toFixed(2)}%
                  </div>
                )}
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Banking Portfolio */}
        <div
          className="group border bg-muted/60 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          onClick={() => router.push('/portfolio/banking')}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FluentBuildingBank28Regular className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">Banking</h3>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {stats.bankingPercentage.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{stats.bankCount} accounts</p>
              </div>

              <div className="text-right">
                <CurrencyDisplay
                  amountUSD={stats.bankingTotalValue}
                  variant="small"
                  className="font-semibold text-sm"
                />
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
