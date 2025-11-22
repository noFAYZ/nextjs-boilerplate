'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Network } from 'lucide-react';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { ZERION_CHAINS } from '@/lib/constants/chains';
import { CurrencyDisplay } from '../ui/currency-display';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';

const NETWORK_COLORS: Record<string, string> = {
  ETHEREUM: 'bg-blue-100 dark:bg-blue-950/40',
  BSC: 'bg-yellow-100 dark:bg-yellow-950/40',
  POLYGON: 'bg-purple-100 dark:bg-purple-950/40',
  AVALANCHE: 'bg-red-100 dark:bg-red-950/40',
  ARBITRUM: 'bg-cyan-100 dark:bg-cyan-950/40',
  OPTIMISM: 'bg-pink-100 dark:bg-pink-950/40',
  BASE: 'bg-indigo-100 dark:bg-indigo-950/40',
  SOLANA: 'bg-emerald-100 dark:bg-emerald-950/40',
  BITCOIN: 'bg-orange-100 dark:bg-orange-950/40',
};

const NETWORK_ID_MAP: Record<string, string> = {
  ETHEREUM: 'ethereum',
  BSC: 'binance-smart-chain',
  POLYGON: 'polygon',
  AVALANCHE: 'avalanche',
  ARBITRUM: 'arbitrum',
  OPTIMISM: 'optimism',
  BASE: 'base',
  SOLANA: 'solana',
  BITCOIN: 'bitcoin',
};

const getChainIcon = (network: string): string | null => {
  const chainId = NETWORK_ID_MAP[network];
  if (!chainId) return null;

  const chain = ZERION_CHAINS.find(c => c.id === chainId);
  return chain?.attributes?.icon?.url || null;
};

export function NetworkDistributionWidget() {
  const { data: portfolio, isLoading: portfolioLoading } = useOrganizationCryptoPortfolio();
  const { isRefetching } = useOrganizationRefetchState();

  const networkData = useMemo(() => {
    if (!portfolio?.networkDistribution || portfolio.networkDistribution.length === 0) {
      return [];
    }

    return portfolio.networkDistribution
      .slice(0, 6) // Show top 6 networks
      .map((network) => {
        const chainId = NETWORK_ID_MAP[network.network];
        const chain = chainId ? ZERION_CHAINS.find(c => c.id === chainId) : null;

        return {
          network: network.network,
          label: chain?.attributes?.name || network.network,
          valueUsd: network.valueUsd,
          percentage: network.percentage,
          assetCount: network.assetCount,
          color: NETWORK_COLORS[network.network] || 'bg-gray-100 dark:bg-gray-950/40',
          iconUrl: chain?.attributes?.icon?.url || null,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [portfolio]);

  const formatPercentage = (percentage: number) => {
    return percentage.toFixed(1) + '%';
  };

  // Show skeleton when initially loading
  if (portfolioLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Network distribution</h3>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 bg-muted/50 ${i === 0 ? 'row-span-2' : ''}`}
              style={{ minHeight: i === 0 ? '140px' : '68px' }}
            >
              <div className="h-3 w-10 bg-muted rounded mb-2 animate-pulse" />
              <div className="h-5 w-16 bg-muted rounded mt-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (networkData.length === 0) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Network distribution</h3>
        <div className="relative py-8 text-center">
          <p className="text-xs text-muted-foreground">
            No network data available.
          </p>
          <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3 h-full w-full flex flex-col">
      <h3 className="text-xs font-medium text-muted-foreground mb-3">Network distribution</h3>

      <div className="grid grid-cols-2 gap-2 ">
        {networkData.map((network, index) => {
          const isFirstNetwork = index === 0;

          return (
            <div
              key={network.network}
              className={`rounded-lg p-3 ${network.color} cursor-pointer ${isFirstNetwork ? 'row-span-2' : ''}`}
              style={{
                minHeight: isFirstNetwork ? '140px' : '68px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  {network.iconUrl ? (
                    <Image
                      src={network.iconUrl}
                      alt={network.label}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  ) : (
                    <Network className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold text-foreground">
                    {network.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {network.assetCount}
                </span>
              </div>

              <div className="mt-auto">
                <CurrencyDisplay
                  amountUSD={network.valueUsd}
                  variant={isFirstNetwork ? 'default' : 'small'}
                  className={`${isFirstNetwork ? 'text-base' : 'text-sm'} font-bold text-foreground`}
                  formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                />
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(network.percentage)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </div>
  );
}
