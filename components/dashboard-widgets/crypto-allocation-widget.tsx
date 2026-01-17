'use client';

import { useMemo, memo } from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Coins, ArrowRight } from 'lucide-react';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { CurrencyDisplay } from '../ui/currency-display';
import { WidgetSkeleton } from '../ui/widget-skeleton';
import { Card } from '../ui/card';
import { SolarPieChart2BoldDuotone } from '../icons/icons';
import { CryptoEmptyState } from '../ui/dashboard-empty-state';
import { Button } from '../ui/button';
import Link from 'next/link';

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

function CryptoAllocationWidgetComponent() {
  const { data: portfolio, isLoading: portfolioLoading } = useOrganizationCryptoPortfolio();
  const { isRefetching } = useOrganizationRefetchState();

  const topTokens = useMemo(() => {
    if (!portfolio?.topAssets || portfolio.topAssets.length === 0) {
      return [];
    }

    return portfolio.topAssets
      .slice(0, 5)
      .map((asset, index) => ({
        symbol: asset.symbol,
        name: asset.name,
        value: asset.balanceUsd,
        change24h: asset.change24h || 0,
        logoUrl: asset.logoUrl,
        color: TOKEN_COLORS[index % TOKEN_COLORS.length],
      }));
  }, [portfolio]);

  if (portfolioLoading) {
    return <WidgetSkeleton variant="grid" itemsCount={6} />;
  }

  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <SolarPieChart2BoldDuotone className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Token allocation</h3>
          </div>
          <Link href="/crypto" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {topTokens.length === 0 ? (
            <CryptoEmptyState
              icon={<SolarPieChart2BoldDuotone className="h-6 w-6" />}
              showCard={false}
            />
          ) : (
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
          )}
        </div>
      </div>
    </Card>
  );
}

export const CryptoAllocationWidget = memo(CryptoAllocationWidgetComponent);
