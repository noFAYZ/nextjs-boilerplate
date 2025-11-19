'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { CurrencyDisplay } from '../ui/currency-display';

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

  if (portfolioLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Token allocation</h3>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 bg-muted/50 ${i === 0 ? 'row-span-2' : ''}`}
              style={{ minHeight: i === 0 ? '140px' : '68px' }}
            >
              <div className="h-3 w-10 bg-muted rounded mb-2" />
              <div className="h-5 w-16 bg-muted rounded mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topTokens.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Token allocation</h3>
        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            No crypto assets found. Add wallets to see your allocation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
      <h3 className="text-xs font-medium text-muted-foreground mb-3">Token allocation</h3>

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
    </div>
  );
}
