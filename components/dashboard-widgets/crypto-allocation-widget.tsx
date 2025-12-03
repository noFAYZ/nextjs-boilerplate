'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { CurrencyDisplay } from '../ui/currency-display';
import { CardSkeleton } from '../ui/card-skeleton';
import { Card } from '../ui/card';
import { SolarPieChart2BoldDuotone } from '../icons/icons';

interface TokenAllocation {
  symbol: string;
  name: string;
  value: number;
  change24h: number;
  color: string;
  logoUrl?: string | null;
}

const TOKEN_COLORS = [
  'bg-orange-100 dark:bg-orange-600/5',
  'bg-purple-100 dark:bg-purple-600/5',
  'bg-cyan-100 dark:bg-cyan-600/25',
  'bg-yellow-100 dark:bg-yellow-600/25',
  'bg-emerald-100 dark:bg-emerald-600/25',
  'bg-pink-100 dark:bg-pink-600/25',
  'bg-blue-100 dark:bg-blue-600/25',
  'bg-indigo-100 dark:bg-indigo-600/70',
];

export function CryptoAllocationWidget() {
  const { data: portfolio, isLoading: portfolioLoading } = useOrganizationCryptoPortfolio();
  const { isRefetching } = useOrganizationRefetchState();

  const topTokens = useMemo(() => {
    if (!portfolio?.topAssets || portfolio.topAssets.length === 0) {
      return [];
    }

    return portfolio.topAssets
      .slice(0, 5) // Get top 6 tokens
      .map((asset, index) => ({
        symbol: asset.symbol,
        name: asset.name,
        value: asset.balanceUsd,
        change24h: asset.change24h || 0,
        logoUrl: asset.logoUrl,
        color: TOKEN_COLORS[index % TOKEN_COLORS.length],
      }));
  }, [portfolio]);

  // Show skeleton when initially loading
  if (portfolioLoading) {
    return <CardSkeleton variant="grid" itemsCount={6} />;
  }

  if (topTokens.length === 0) {
    return (
      <div className="relative rounded-xl border border-border bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Token allocation</h3>
        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            No crypto assets found. Add wallets to see your allocation.
          </p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }

  return (
    <Card className="relative rounded-xl border border-border/50 gap-4 flex flex-col">
    
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-amber-400 flex items-center justify-center">
            <SolarPieChart2BoldDuotone className="h-4.5 w-4.5 text-amber-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
          Token allocation
          </h3>
        </div>
        
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topTokens.map((token, index) => {
          const isPositive = token.change24h >= 0;
          const isFirstToken = index === 0;

          return (
            <div
              key={token.symbol}
              className={`rounded-lg p-3 ${token.color} cursor-pointer ${isFirstToken ? 'row-span-2' : ''}`}
              style={{
                minHeight: isFirstToken ? '140px' : '68px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  {token.logoUrl ? (
                    <Image
                      src={token.logoUrl}
                      alt={token.symbol}
                      width={16}
                      height={16}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <Coins className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold text-foreground">
                    {token.symbol}
                  </span>
                </div>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                )}
              </div>

              <div className="mt-auto">
                <CurrencyDisplay
                  amountUSD={token.value}
                  variant={isFirstToken ? 'default' : 'small'}
                  className={`${isFirstToken ? 'text-base' : 'text-sm'} font-bold text-foreground`}
                  formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </Card>
  );
}
