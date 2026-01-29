'use client';

import { useMemo, useState, memo } from 'react';
import {
  ArrowRight,
  Coins,
} from 'lucide-react';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { TopAsset } from '@/lib/types/crypto';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { WidgetSkeleton } from '../ui/widget-skeleton';
import { TokensEmptyState } from '../ui/dashboard-empty-state';

function TokenItem({ token, totalValue }: { token: TopAsset; totalValue: number }) {
  const allocation = totalValue > 0 ? (token.balanceUsd / totalValue) * 100 : 0;
  const isGain = token.change24h >= 0;

  return (
    <Link href={`/crypto/tokens/${token.symbol.toLowerCase()}`}>
      <div className={cn(
        "group relative border border-border/80 flex items-center gap-2.5 p-2 rounded-lg transition-all duration-75",
        "hover:bg-muted/60 cursor-pointer"
      )}>
        <Avatar className="h-10 w-10 rounded-full flex-shrink-0">
          {token.logoUrl ? (
            <AvatarImage
              src={token.logoUrl}
              alt={token.name}
              className="object-contain bg-background rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-muted text-[10px] font-bold">
              {token.symbol.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {token.name}
          </h4>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{parseFloat(token.balance).toFixed(4)} {token.symbol}</span>
            <span>•</span>
            <span className={cn(
              "font-semibold",
              isGain ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {isGain ? '+' : ''}{token.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
          <CurrencyDisplay
            amountUSD={token.balanceUsd}
            variant="small"
            className="font-semibold text-foreground"
          />
          <span className="text-[10px] text-muted-foreground">
            {allocation.toFixed(1)}%
          </span>
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </Link>
  );
}

type TabType = 'top' | 'gainers' | 'losers';

function TokenAllocationWidgetComponent() {
  const { data: portfolioResponse, isLoading: portfolioLoading } = useOrganizationCryptoPortfolio();
  const [activeTab, setActiveTab] = useState<TabType>('top');
  const { isRefetching } = useOrganizationRefetchState();

  const allTokens = useMemo(() => {
    if (!portfolioResponse?.topAssets) return [];
    return portfolioResponse.topAssets as TopAsset[];
  }, [portfolioResponse]);

  const totalValue = useMemo(() => {
    return allTokens.reduce((sum, token) => sum + token.balanceUsd, 0);
  }, [allTokens]);

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

  const tabCounts = useMemo(() => {
    if (!allTokens || allTokens.length === 0) {
      return { top: 0, gainers: 0, losers: 0 };
    }
    return {
      top: allTokens.length,
      gainers: allTokens.filter(token => token.change24h > 0).length,
      losers: allTokens.filter(token => token.change24h < 0).length,
    };
  }, [allTokens]);

  if (portfolioLoading) {
    return <WidgetSkeleton variant="list" itemsCount={4} />;
  }

  if (allTokens.length === 0) {
    return (
      <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-sm bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate">Token Allocation</h3>
            </div>
            <Link href="/crypto" className="flex-shrink-0">
              <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <TokensEmptyState
              icon={<Coins className="h-6 w-6" />}
              showCard={false}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-sm bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Coins className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Token Allocation</h3>
          </div>
          <Link href="/crypto" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mb-4 pb-3 border-b border-border/50">
            <p className="text-[10px] text-muted-foreground mb-1">Portfolio Value</p>
            <CurrencyDisplay
              amountUSD={totalValue}
              variant="default"
              className="text-lg font-bold text-foreground"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="mb-3">
            <TabsList variant="pill" size="sm" className="w-full">
              <TabsTrigger value="top" variant="pill" size="sm" className="flex-1">
                <span>Top</span>
                {tabCounts.top > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.top}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="gainers" variant="pill" size="sm" className="flex-1">
                <span>Gainers</span>
                {tabCounts.gainers > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.gainers}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="losers" variant="pill" size="sm" className="flex-1">
                <span>Losers</span>
                {tabCounts.losers > 0 && (
                  <Badge variant="new" className="h-4 px-1 text-[10px]">{tabCounts.losers}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {tokensToShow.length > 0 ? (
            <div className="space-y-1.5">
              {tokensToShow.map((token) => (
                <TokenItem
                  key={token.symbol}
                  token={token}
                  totalValue={totalValue}
                />
              ))}
            </div>
          ) : (
            <TokensEmptyState
              icon={<Coins className="h-6 w-6" />}
              showCard={false}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

export const TokenAllocationWidget = memo(TokenAllocationWidgetComponent);
