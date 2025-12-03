'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Coins,
} from 'lucide-react';
import { useCryptoPortfolio } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { TopAsset } from '@/lib/types/crypto';
import { SolarInboxInBoldDuotone } from '../icons/icons';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { CardSkeleton } from '../ui/card-skeleton';

// Token List Item
function TokenItem({ token, totalValue }: { token: TopAsset; totalValue: number }) {
  const allocation = totalValue > 0 ? (token.balanceUsd / totalValue) * 100 : 0;
  const isGain = token.change24h >= 0;

  return (
    <Link href={`/crypto/tokens/${token.symbol.toLowerCase()}`}>
      <div className={cn(
        "group relative border border-border/80 flex items-center gap-2.5 p-2 rounded-xl transition-all duration-75",
        "hover:bg-muted/60 cursor-pointer"
      )}>
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-11 w-11 rounded-full">
            {token.logoUrl ? (
              <AvatarImage
                src={token.logoUrl}
                alt={token.name}
                className="object-contain bg-background rounded-full"
              />
            ) : (
              <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                {token.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-semibold text-sm truncate text-foreground">
              {token.name}
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {token.symbol.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">
              {parseFloat(token.balance).toFixed(4)} {token.symbol.toUpperCase()}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className={cn(
              "font-semibold flex items-center gap-0.5",
              isGain ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {isGain ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
              {Math.abs(token.change24h).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Allocation Info */}
        <div className="flex flex-col items-end flex-shrink-0">
          <CurrencyDisplay
            amountUSD={token.balanceUsd}
            variant="small"
            className="font-semibold text-foreground"
          />
          <span className={cn(
            "text-[10px] font-medium",
            allocation > 0 ? "text-muted-foreground" : "text-muted-foreground/50"
          )}>
            {allocation.toFixed(1)}%
          </span>
        </div>

        {/* Hover Indicator */}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'top' | 'gainers' | 'losers';

export function TokenAllocationWidget() {
  const { data: portfolioResponse, isLoading: portfolioLoading } = useCryptoPortfolio();
  const [activeTab, setActiveTab] = useState<TabType>('top');
  const { isRefetching } = useOrganizationRefetchState();

  // Get portfolio data
  const portfolioData = useMemo(() => {
    if (!portfolioResponse) return null;
    if (portfolioResponse.data) return portfolioResponse.data;
    return portfolioResponse as any;
  }, [portfolioResponse]);

  // Get tokens array
  const allTokens = useMemo(() => {
    if (!portfolioData?.topAssets) return [];
    return portfolioData.topAssets as TopAsset[];
  }, [portfolioData]);

  // Calculate total value
  const totalValue = useMemo(() => {
    return allTokens.reduce((sum, token) => sum + token.balanceUsd, 0);
  }, [allTokens]);

  // Get tokens to display based on active tab
  const tokensToShow = useMemo(() => {
    if (!allTokens || allTokens.length === 0) return [];

    if (activeTab === 'top') {
      return allTokens.slice(0, 5);
    }

    if (activeTab === 'gainers') {
      return allTokens
        .sort((a, b) => b.change24h - a.change24h)
        .filter(token => token.change24h > 0)
        .slice(0, 5);
    }

    if (activeTab === 'losers') {
      return allTokens
        .sort((a, b) => a.change24h - b.change24h)
        .filter(token => token.change24h < 0)
        .slice(0, 5);
    }

    return [];
  }, [allTokens, activeTab]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    if (!allTokens || allTokens.length === 0) {
      return { top: 0, gainers: 0, losers: 0 };
    }

    const gainersCount = allTokens.filter(token => token.change24h > 0).length;
    const losersCount = allTokens.filter(token => token.change24h < 0).length;

    return {
      top: allTokens.length,
      gainers: gainersCount,
      losers: losersCount,
    };
  }, [allTokens]);

  // Calculate portfolio change
  const portfolioChange24h = useMemo(() => {
    if (!allTokens || allTokens.length === 0) return 0;
    return allTokens.reduce((sum, token) => sum + ((token.balanceUsd * token.change24h) / 100), 0);
  }, [allTokens]);

  // Loading State
  if (portfolioLoading) {
    return <CardSkeleton variant="list" itemsCount={4} />;
  }

  // Empty State
  if (allTokens.length === 0) {
    return (
      <Card className="relative rounded-xl border border-border">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-xl bg-blue-300 flex items-center justify-center">
              <Coins className="h-4 w-4 text-blue-900" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Token Allocation</h3>
          </div>
          <Link href="/crypto">
            <Button variant="outline" className="text-[11px] cursor-pointer transition-colors h-7" size='sm'>
              Add Wallets
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="py-6 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-muted/50 flex items-center justify-center">
            <Coins className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium text-foreground mb-1">No tokens yet</p>
          <p className="text-[10px] text-muted-foreground mb-3">
            Add crypto wallets to track your token allocation
          </p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </Card>
    );
  }

  return (
    <Card className="relative h-full w-full flex flex-col border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-blue-300 flex items-center justify-center">
            <Coins className="h-4 w-4 text-blue-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Token Allocation</h3>
        </div>
        <Link href="/crypto">
          <Button variant="link" className="text-[11px] cursor-pointer transition-colors h-7" size='sm'>
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-4 border-b border-border/50">
        <div className="text-xs text-muted-foreground mb-1">Total Portfolio Value</div>
        <div className="flex items-baseline gap-2">
          <CurrencyDisplay
            amountUSD={totalValue}
            variant="xl"
            className="font-semibold"
          />
          <div className={cn(
            "flex items-center gap-1 text-xs",
            portfolioChange24h >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}>
            {portfolioChange24h >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {portfolioChange24h >= 0 ? '+' : ''}
              {portfolioChange24h.toFixed(2)} (24h)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-4">
        <TabsList variant="pill" size="sm">
          <TabsTrigger value="top" variant="pill" size="sm" className="flex-1">
            <Coins className="h-4 w-4" />
            <span>Top Tokens</span>
            {tabCounts.top > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.top}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="gainers" variant="pill" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4" />
            <span>Gainers</span>
            {tabCounts.gainers > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.gainers}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="losers" variant="pill" size="sm" className="flex-1">
            <TrendingDown className="h-4 w-4" />
            <span>Losers</span>
            {tabCounts.losers > 0 && (
              <Badge variant="new" className="h-4 px-1 text-[10px]">
                {tabCounts.losers}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tokens List */}
      {tokensToShow.length > 0 ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              {activeTab === 'top' && <Coins className="h-4 w-4 text-muted-foreground" />}
              {activeTab === 'gainers' && <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              {activeTab === 'losers' && <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />}
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                {activeTab === 'top' && 'Top Holdings'}
                {activeTab === 'gainers' && '24h Gainers'}
                {activeTab === 'losers' && '24h Losers'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {tokensToShow.length} of {
                activeTab === 'top' ? tabCounts.top :
                activeTab === 'gainers' ? tabCounts.gainers :
                tabCounts.losers
              }
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            {tokensToShow.map((token) => (
              <TokenItem
                key={token.symbol}
                token={token}
                totalValue={totalValue}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
          {activeTab === 'top' && (
            <>
              <Coins className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No tokens</p>
              <p className="text-[9px] text-muted-foreground">
                Your holdings will appear here
              </p>
            </>
          )}
          {activeTab === 'gainers' && (
            <>
              <TrendingUp className="h-5 w-5 mx-auto mb-1.5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No gainers</p>
              <p className="text-[9px] text-muted-foreground">
                No tokens are gaining in value (24h)
              </p>
            </>
          )}
          {activeTab === 'losers' && (
            <>
              <TrendingDown className="h-5 w-5 mx-auto mb-1.5 text-red-600 dark:text-red-400" />
              <p className="text-[10px] font-medium text-foreground mb-0.5">No losers</p>
              <p className="text-[9px] text-muted-foreground">
                No tokens are losing in value (24h)
              </p>
            </>
          )}
        </div>
      )}
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </Card>
  );
}
