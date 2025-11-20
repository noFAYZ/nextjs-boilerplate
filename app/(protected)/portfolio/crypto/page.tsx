'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import {
  Search,
  RefreshCw,
  Loader2,
  Copy,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  SortAsc,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganizationCryptoWallets, useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MageCaretUpFill,
  MageCaretDownFill,
  SolarWallet2Outline,
  StreamlineFlexWallet,
} from '@/components/icons/icons';
import { useViewModeClasses } from '@/lib/contexts/view-mode-context';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
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

// ✅ Use centralized utilities
import {
  filterCryptoWallets,
  sortByField,
  truncateAddress,
  getAddressExplorerUrl,
} from '@/lib/utils';

type SortField = 'value' | 'name' | 'change';

interface CryptoAsset {
  id: string;
  name: string;
  value: number;
  address: string;
  network: string;
  change24h: number;
}

export default function CryptoPortfolioPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { pageClass } = useViewModeClasses();

  // ✅ NEW: Data from TanStack Query (organization-aware)
  const { data: wallets = [], isLoading: walletsLoading } = useOrganizationCryptoWallets();
  const { data: portfolio, isLoading: portfolioLoading } = useOrganizationCryptoPortfolio();
  const { isRefetching } = useOrganizationRefetchState();

  const isLoading = walletsLoading || portfolioLoading;

  // Aggregate crypto assets
  const { assets, stats } = useMemo(() => {
    const cryptoAssets: CryptoAsset[] = [];

    wallets?.forEach(wallet => {
      const value = parseFloat(wallet.totalBalanceUsd || '0');
      if (value > 0) {
        cryptoAssets.push({
          id: wallet.id,
          name: wallet.name,
          value,
          address: wallet.address,
          network: wallet.network,
          change24h: 0, // Individual wallet change not stored, using portfolio aggregate
        });
      }
    });

    const totalValue = portfolio?.totalValueUsd || 0;
    const totalChange = portfolio?.dayChange || 0;
    const changePercent = portfolio?.dayChangePct || 0;

    return {
      assets: cryptoAssets,
      stats: {
        totalValue,
        totalChange,
        changePercent,
        totalWallets: cryptoAssets.length,
      },
    };
  }, [wallets, portfolio]);

  // ✅ Filter and sort using centralized utilities
  const displayedAssets = useMemo(() => {
    // Filter by search query
    const filtered = filterCryptoWallets(assets, { searchQuery });

    // Sort by selected field
    const getField = (asset: CryptoAsset) => {
      switch (sortBy) {
        case 'value':
          return asset.value;
        case 'name':
          return asset.name;
        case 'change':
          return asset.change24h;
        default:
          return asset.value;
      }
    };

    return sortByField(filtered, getField, sortOrder);
  }, [assets, searchQuery, sortBy, sortOrder]);

  const handleRefreshAll = () => {
    toast.success('Refreshing crypto portfolio...');
  };

  // ✅ Event handlers using centralized utilities
  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    } catch {
      toast.error('Failed to copy address');
    }
  };

  const handleAssetClick = (asset: CryptoAsset) => {
    router.push(`/accounts/wallet/${asset.id}`);
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
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating portfolio..." />
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
                <BreadcrumbLink asChild>
                  <Link href="/portfolio">Portfolio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Crypto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalWallets} wallets
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

      {/* Total Value */}
      <div className="group border bg-muted/60 rounded-xl p-4 hover:bg-muted transition-colors">
        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Crypto Value</p>
        <div className="flex items-baseline gap-3">
          <CurrencyDisplay
            amountUSD={stats.totalValue}
            variant="large"
            className="text-3xl font-bold"
          />
          {stats.totalChange !== 0 && (
            <Badge
              className={cn(
                'flex items-center gap-1 h-6 px-2',
                stats.totalChange >= 0
                  ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:text-red-400'
              )}
            >
              {stats.totalChange >= 0 ? (
                <MageCaretUpFill className="h-4 w-4" />
              ) : (
                <MageCaretDownFill className="h-4 w-4" />
              )}
              <span className="font-medium text-sm">
                <CurrencyDisplay
                  amountUSD={Math.abs(stats.totalChange)}
                  variant="compact"
                  className="inline"
                />
                {' '}({Math.abs(stats.changePercent).toFixed(2)}%)
              </span>
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">24h change</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search wallets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="px-2 py-1 border rounded-lg text-xs bg-background h-8"
          >
            <option value="value">Value</option>
            <option value="name">Name</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-8 w-8 p-0"
          >
            <SortAsc className={cn('h-4 w-4 transition-transform', sortOrder === 'desc' && 'rotate-180')} />
          </Button>
        </div>
      </div>

      {/* Wallets List */}
      <div className="space-y-2">
        {displayedAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <StreamlineFlexWallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">No wallets found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Connect crypto wallets to see your portfolio'}
            </p>
          </div>
        ) : (
          displayedAssets.map(asset => {
            const avatarUrl = createAvatar(botttsNeutral, { size: 128, seed: asset.address, radius: 20 }).toDataUri();

            return (
              <div
                key={asset.id}
                className="group border bg-muted/60 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleAssetClick(asset)}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                        <Image src={avatarUrl} fill alt="Wallet Avatar" className="rounded-lg" unoptimized />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{asset.name}</h3>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {asset.network}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono truncate">
                          {truncateAddress(asset.address)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyAddress(asset.address);
                          }}
                          className="h-5 w-5 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-5 w-5 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={getAddressExplorerUrl(asset.network, asset.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-right">
                      <CurrencyDisplay
                        amountUSD={asset.value}
                        variant="small"
                        className="font-semibold text-sm"
                      />
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
