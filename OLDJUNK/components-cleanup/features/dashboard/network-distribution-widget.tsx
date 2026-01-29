'use client';

import { useMemo, memo } from 'react';
import Image from 'next/image';
import { Network, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { ZERION_CHAINS } from '@/lib/constants/chains';
import { CurrencyDisplay } from '../ui/currency-display';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { WidgetSkeleton } from '../ui/widget-skeleton';
import { NetworkDistributionEmptyState } from '../ui/dashboard-empty-state';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

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

const formatPercentage = (percentage: number) => {
  return percentage.toFixed(1) + '%';
};

function NetworkDistributionWidgetComponent() {
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

  // Show skeleton when initially loading
  if (portfolioLoading) {
    return <WidgetSkeleton variant="grid" itemsCount={6} />;
  }

  if (networkData.length === 0) {
    return (
      <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-sm bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Network className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xs font-semibold text-foreground truncate">Network Distribution</h3>
            </div>
            <Link href="/crypto" className="flex-shrink-0">
              <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <NetworkDistributionEmptyState
              icon={<Network className="h-6 w-6" />}
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
            <div className="h-7 w-7 rounded-sm bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Network className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xs font-semibold text-foreground truncate">Network Distribution</h3>
          </div>
          <Link href="/crypto" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
        </div>
      </div>
    </Card>
  );
}

export const NetworkDistributionWidget = memo(NetworkDistributionWidgetComponent);
