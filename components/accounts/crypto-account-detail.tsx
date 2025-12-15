'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertCircle,
  TrendingUp,
  ArrowDownRight,
} from 'lucide-react';
import { useToast } from "@/lib/hooks/useToast";
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Import crypto hooks
import {
  useOrganizationCryptoWallet,
  useOrganizationSyncCryptoWallet,
} from '@/lib/queries/use-organization-data-context';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { CRYPTO_SYNC_ACTIVE_STATUSES } from '@/lib/constants/sync-status';

// Import crypto components
import { WalletTokens } from '@/components/crypto/wallet-tokens';
import { WalletNFTs } from '@/components/crypto/wallet-nfts';
import { WalletTransactions } from '@/components/crypto/wallet-transactions';
import { PortfolioChart } from '@/components/charts/portfolio-chart';
import { WalletDeFi } from '@/components/crypto/wallet-defi';
import { WalletSyncModal } from '@/components/crypto/wallet-sync-modal';
import { ChainFilters } from '@/components/crypto/chain-filters';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { timestampzToReadable } from '@/lib/utils/time';

// Icons
import {
  MageCaretDownFill,
  MageCaretUpFill,
  StreamlineFreehandCryptoCurrencyUsdCoin,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchange,
  SolarGalleryWideOutline,
  SolarLockKeyholeBoldDuotone,
  MynauiActivitySquare,
} from '@/components/icons/icons';

interface CryptoAccountDetailProps {
  accountId: string;
}

export function CryptoAccountDetail({ accountId }: CryptoAccountDetailProps) {
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('tokens');
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Fetch wallet data
  const walletQuery = useOrganizationCryptoWallet(accountId);
  const { data: wallet, isLoading, error, refetch } = walletQuery;

  const syncWalletMutation = useOrganizationSyncCryptoWallet();
  const { realtimeSyncStates } = useCryptoStore();
  const prevSyncStatusRef = useRef<string>();

  // Get SSE-based sync status
  const walletSyncState = realtimeSyncStates[accountId];
  const isSyncingSSE =
    walletSyncState &&
    CRYPTO_SYNC_ACTIVE_STATUSES.includes(walletSyncState.status);
  const syncProgress = walletSyncState?.progress || 0;
  const lastSyncAt = walletSyncState?.completedAt;

  const isSyncing = syncWalletMutation.isPending || isSyncingSSE;

  // Avatar for wallet
  const avataUrl = createAvatar(botttsNeutral, {
    size: 128,
    seed: accountId,
    radius: 20,
  }).toDataUri();

  // Auto-refresh data when sync completes
  useEffect(() => {
    const currentStatus = walletSyncState?.status;
    const prevStatus = prevSyncStatusRef.current;

    if (
      prevStatus &&
      [
        'syncing',
        'syncing_assets',
        'syncing_transactions',
        'syncing_nfts',
        'syncing_defi',
      ].includes(prevStatus) &&
      currentStatus === 'completed'
    ) {
      setTimeout(() => {
        refetch();
        success('Wallet data updated!');
      }, 1000);
    }

    prevSyncStatusRef.current = currentStatus;
  }, [walletSyncState?.status, refetch]);

  // Memoize stats
  const walletStats = useMemo(() => {
    if (!wallet) return null;
    return {
      totalBalance: parseFloat(wallet?.portfolio?.totalPositionsValue || '0'),
      assetCount: wallet?.assets?.length || 0,
      nftCount: wallet.nfts?.length || 0,
      lastSyncFormatted: wallet.lastSyncAt
        ? new Date(wallet.lastSyncAt).toLocaleDateString()
        : 'Never',
    };
  }, [wallet]);

  const handleCopyAddress = useCallback(async () => {
    if (!wallet?.walletData?.address) return;

    try {
      await navigator.clipboard.writeText(wallet.walletData.address);
      success('Address copied to clipboard');
    } catch (error) {
      showError('Failed to copy address');
    }
  }, [wallet?.walletData?.address]);

  const handleSync = useCallback(() => {
    if (!accountId || syncWalletMutation.isPending) return;

    syncWalletMutation.mutate(
      {
        walletId: accountId,
        syncData: {
          syncAssets: true,
          syncNFTs: true,
          syncDeFi: true,
          syncTypes: ['assets', 'transactions', 'nfts'],
        },
      },
      {
        onSuccess: () => {
          success('Wallet sync started');
          setShowSyncModal(true);
        },
        onError: (error: Error) => {
          showError(error.message || 'Failed to start sync');
        },
      }
    );
  }, [accountId, syncWalletMutation]);

  const handleSyncComplete = useCallback(() => {
    success('Wallet sync completed successfully!');
    refetch();
  }, [refetch]);

  const getNetworkExplorerUrl = useCallback(
    (network: string, address: string) => {
      const explorers: Record<string, string> = {
        ETHEREUM: `https://etherscan.io/address/${address}`,
        POLYGON: `https://polygonscan.com/address/${address}`,
        BSC: `https://bscscan.com/address/${address}`,
        ARBITRUM: `https://arbiscan.io/address/${address}`,
        OPTIMISM: `https://optimistic.etherscan.io/address/${address}`,
        AVALANCHE: `https://snowtrace.io/address/${address}`,
        SOLANA: `https://explorer.solana.com/address/${address}`,
      };
      return explorers[network] || '#';
    },
    []
  );

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-16 bg-muted animate-pulse rounded-lg" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Wallet not found</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message ||
              'Could not load wallet details. Please try again.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {/* Sync Button */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {wallet?.walletData?.lastSyncAt && !isSyncing ? (
            <span className="ml-2 text-xs text-muted-foreground">
              {timestampzToReadable(wallet?.walletData?.lastSyncAt)}
            </span>
          ) : null}
          <Button
            size="xs"
            onClick={handleSync}
            disabled={syncWalletMutation.isPending || isSyncingSSE}
          >
            {syncWalletMutation.isPending || isSyncingSSE ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {isSyncingSSE ? `${syncProgress}%` : 'Sync'}
          </Button>
        </div>
      </div>

      {/* Header */}
      <Card className="border-border/80 border-b-0 rounded-none hover:shadow-xs p-0">
        <div className="p-3">
          <div className="flex flex-col gap-4">
            {/* TOP ROW: Identity & Balance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border shadow-sm bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  <Image
                    src={avataUrl}
                    fill
                    alt="wallet"
                    className="rounded-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
                      {wallet?.walletData?.name}
                    </h1>
                    <Badge
                      variant="new"
                      className="text-[10px] px-1.5 py-0 h-4.5 font-normal flex-shrink-0"
                    >
                      {wallet?.walletData?.network}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono truncate">
                      {`${wallet?.walletData?.address?.slice(0, 6)}...${wallet?.walletData?.address?.slice(-4)}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleCopyAddress}
                        className="h-4 w-4 p-0"
                        title="Copy address"
                        disabled={isSyncing}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        asChild
                        className="h-4 w-4 p-0"
                        title="View in explorer"
                      >
                        <a
                          href={
                            isSyncing
                              ? '#'
                              : getNetworkExplorerUrl(
                                  wallet?.walletData?.network,
                                  wallet?.walletData?.address
                                )
                          }
                          target={isSyncing ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center"
                          onClick={
                            isSyncing
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Balance & 24h Change */}
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Total Balance
                  </span>
                  <CurrencyDisplay
                    amountUSD={walletStats?.totalBalance || 0}
                    className="text-2xl font-bold text-foreground"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">24h Change:</span>
                  {wallet?.portfolio?.percent24hChange !== undefined ? (
                    <Badge
                      className={cn(
                        'flex items-center h-5 gap-1 rounded-xs px-1.5 font-medium',
                        wallet?.portfolio?.percent24hChange >= 0
                          ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                          : 'bg-red-500/20 text-red-700 dark:text-red-400'
                      )}
                    >
                      {wallet?.portfolio?.percent24hChange >= 0 ? (
                        <MageCaretUpFill className="h-3.5 w-3.5" />
                      ) : (
                        <MageCaretDownFill className="h-3.5 w-3.5" />
                      )}
                      <span className="text-xs">
                        {Math.abs(wallet?.portfolio?.percent24hChange).toFixed(
                          2
                        )}
                        %
                      </span>
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: Stats Group */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              {/* Stats Group */}
              <div className="flex items-center gap-6 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {/* Staked */}
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">
                      Staked
                    </p>
                    <CurrencyDisplay
                      amountUSD={wallet?.portfolio?.stakedValue || 0}
                      className="text-sm font-semibold text-foreground"
                      formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Locked */}
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <SolarLockKeyholeBoldDuotone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">
                      Locked
                    </p>
                    <CurrencyDisplay
                      amountUSD={wallet?.portfolio?.lockedValue || 0}
                      className="text-sm font-semibold text-foreground"
                      formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Borrowed */}
                <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                  <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">
                      Borrowed
                    </p>
                    <CurrencyDisplay
                      amountUSD={wallet?.portfolio?.borrowedValue || 0}
                      className="text-sm font-semibold text-foreground"
                      formatOptions={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-border/50 mt-4" />

          {/* Chart */}
          <PortfolioChart
            walletAddress={wallet?.walletData?.address}
            height={200}
            showPeriodFilter={true}
            enableArea={true}
            enableBreakdown={false}
            className="w-full border-none *:shadow-none"
          />
        </div>
      </Card>

      {/* Chain Filters */}
      <Card className="">
        <ChainFilters
          portfolio={wallet?.portfolio || {}}
          selectedChain={selectedChain}
          onChainSelect={setSelectedChain}
          isLoading={isLoading || isSyncing}
        />
      </Card>

      {/* Wallet Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mt-2" variant="pill">
          <TabsTrigger value="tokens" className="flex px-2 items-center gap-1.5 cursor-pointer" variant="pill">
            <StreamlineFreehandCryptoCurrencyUsdCoin className="w-5 h-5" />
            <span className="inline">Tokens</span>
          </TabsTrigger>
          <TabsTrigger value="defi" className="flex px-2 items-center gap-1.5 cursor-pointer" variant="pill">
            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchange className="w-5 h-5" />
            <span className="inline">Defi</span>
          </TabsTrigger>
          <TabsTrigger value="nfts" className="flex px-2 items-center gap-1.5 cursor-pointer" variant="pill">
            <SolarGalleryWideOutline className="w-5 h-5" />
            <span className="inline">NFTs</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex px-2 items-center gap-1.5 cursor-pointer" variant="pill">
            <MynauiActivitySquare className="w-5.5 h-5.5" />
            <span className="inline">Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" key={`tokens-${selectedChain || 'all'}`}>
          <WalletTokens
            tokens={wallet?.assets || []}
            isLoading={isLoading || isSyncing}
            selectedChain={selectedChain}
          />
        </TabsContent>

        <TabsContent value="defi" key={`defi-${selectedChain || 'all'}`}>
          <WalletDeFi
            defiApps={wallet?.defiApps || []}
            isLoading={isLoading || isSyncing}
            selectedChain={selectedChain}
          />
        </TabsContent>

        <TabsContent value="nfts" key={`nfts-${selectedChain || 'all'}`}>
          <WalletNFTs
            nfts={wallet?.nfts || []}
            isLoading={isLoading || isSyncing}
            selectedChain={selectedChain}
          />
        </TabsContent>

        <TabsContent value="transactions" key={`transactions-${selectedChain || 'all'}`}>
          <WalletTransactions
            transactions={wallet?.transactions || []}
            isLoading={isLoading || isSyncing}
            walletAddress={wallet?.walletData?.address}
            selectedChain={selectedChain}
          />
        </TabsContent>
      </Tabs>

      {/* Sync Modal */}
      <WalletSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        walletId={accountId}
        walletName={wallet?.walletData?.name}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  );
}
