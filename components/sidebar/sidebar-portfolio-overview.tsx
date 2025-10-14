'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useBankingAccounts } from '@/lib/queries/banking-queries';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  SolarWallet2Outline,
  FluentBuildingBank28Regular,
  MageCaretUpFill,
  MageCaretDownFill,
} from '@/components/icons/icons';
import { ChevronRight } from 'lucide-react';

interface SidebarPortfolioOverviewProps {
  onMobileClose: () => void;
}

export function SidebarPortfolioOverview({ onMobileClose }: SidebarPortfolioOverviewProps) {
  const router = useRouter();

  // Get data from crypto store
  const wallets = useCryptoStore((state) => state.wallets);
  const cryptoPortfolio = useCryptoStore((state) => state.portfolio);
  const walletsLoading = useCryptoStore((state) => state.walletsLoading);
  const portfolioLoading = useCryptoStore((state) => state.portfolioLoading);

  // Fetch banking data
  const { data: bankAccounts, isLoading: bankLoading } = useBankingAccounts();

  const isLoading = walletsLoading || portfolioLoading || bankLoading;

  // Calculate totals
  const stats = React.useMemo(() => {
    const cryptoTotalValue = cryptoPortfolio?.totalValueUsd || 0;
    const cryptoChange24h = cryptoPortfolio?.dayChangePct || 0;
    const cryptoAbsoluteChange = cryptoPortfolio?.dayChange || 0;

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
  }, [wallets, cryptoPortfolio, bankAccounts]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onMobileClose();
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Total Value */}
      <div
        className="border bg-muted/60 rounded-xl p-3 hover:bg-muted cursor-pointer transition-colors"
        onClick={() => handleNavigate('/dashboard/portfolio')}
      >
        <p className="text-[9px] text-muted-foreground uppercase font-medium mb-1">Total Portfolio</p>
        <CurrencyDisplay
          amountUSD={stats.totalValue}
          variant="large"
          className="text-xl font-bold mb-1"
        />
        {stats.cryptoChange24h !== 0 && (
          <div className="flex items-center gap-1">
            <Badge
              className={cn(
                'flex items-center gap-0.5 h-5 px-1.5',
                stats.cryptoChange24h >= 0
                  ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-400'
              )}
            >
              {stats.cryptoChange24h >= 0 ? (
                <MageCaretUpFill className="h-3 w-3" />
              ) : (
                <MageCaretDownFill className="h-3 w-3" />
              )}
              <span className="font-medium text-[10px]">
                {Math.abs(stats.cryptoChange24h).toFixed(2)}%
              </span>
            </Badge>
            <span className="text-[9px] text-muted-foreground">24h</span>
          </div>
        )}
        <p className="text-[9px] text-muted-foreground mt-1">{stats.totalAccounts} total accounts</p>
      </div>

      {/* Crypto Assets */}
      <div
        className="group border bg-muted/60 rounded-xl hover:bg-muted cursor-pointer transition-colors"
        onClick={() => handleNavigate('/dashboard/portfolio/crypto')}
      >
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <SolarWallet2Outline className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-semibold">Crypto</p>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1">
                    {stats.cryptoPercentage.toFixed(0)}%
                  </Badge>
                </div>
                <CurrencyDisplay
                  amountUSD={stats.cryptoTotalValue}
                  variant="compact"
                  className="text-sm font-bold"
                />
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">{stats.cryptoCount} wallets</p>
        </div>
      </div>

      {/* Banking Assets */}
      <div
        className="group border bg-muted/60 rounded-xl hover:bg-muted cursor-pointer transition-colors"
        onClick={() => handleNavigate('/dashboard/portfolio/banking')}
      >
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <FluentBuildingBank28Regular className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-semibold">Banking</p>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1">
                    {stats.bankingPercentage.toFixed(0)}%
                  </Badge>
                </div>
                <CurrencyDisplay
                  amountUSD={stats.bankingTotalValue}
                  variant="compact"
                  className="text-sm font-bold"
                />
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">{stats.bankCount} accounts</p>
        </div>
      </div>

      {/* Allocation Bars */}
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${stats.cryptoPercentage}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground min-w-[32px] text-right">
            {stats.cryptoPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${stats.bankingPercentage}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground min-w-[32px] text-right">
            {stats.bankingPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
