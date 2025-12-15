"use client";

import { use, Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Copy,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertCircle,
  Coins,
  ImageIcon,
  ArrowUpDown,
  TrendingUp,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useToast } from '@/lib/hooks/useToast';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
// ✅ Import TanStack Query hooks (organization-aware)
import {
  useOrganizationCryptoWallet,
  useOrganizationWalletTransactions,
  useOrganizationWalletNFTs,
  useOrganizationWalletDeFi,
  useOrganizationSyncCryptoWallet
} from '@/lib/queries/use-organization-data-context';
import { useCryptoStore } from "@/lib/stores/crypto-store";
import { CRYPTO_SYNC_ACTIVE_STATUSES } from "@/lib/constants/sync-status";

// Import new components
import { WalletTokens } from "@/components/crypto/wallet-tokens";
import { WalletNFTs } from "@/components/crypto/wallet-nfts";
import { WalletTransactions } from "@/components/crypto/wallet-transactions";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { WalletDeFi } from "@/components/crypto/wallet-defi";
import {
  BalanceSkeleton,
  WalletNameSkeleton,
  NetworkBadgeSkeleton,
  AddressSkeleton,
  ChangeBadgeSkeleton,
  StatsValueSkeleton,
  WalletChartSkeleton
} from "@/components/crypto/wallet-skeletons";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { useCurrency } from "@/lib/contexts/currency-context";
import StreamlineUltimateAccountingCoins, {
  MageCaretDownFill,
  MageCaretUpFill,
  MynauiActivitySquare,
  SolarGalleryOutline,
  SolarGalleryWideOutline,
  SolarWalletBoldDuotone,
  StreamlineFlexWallet,
  StreamlineFreehandCryptoCurrencyUsdCoin,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchange,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold,
  TablerReportMoney,
  LetsIconsTimeProgressDuotone,
  SolarLockKeyholeBoldDuotone,
} from "@/components/icons/icons";
import { useViewModeClasses } from "@/lib/contexts/view-mode-context";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { timestampzToReadable } from "@/lib/utils/time";
import { Tooltip } from "@/components/ui/tooltip";
import { WalletSyncModal } from "@/components/crypto/wallet-sync-modal";
import { ChainFilters } from "@/components/crypto/chain-filters";

interface WalletPageProps {
  params: Promise<{
    wallet: string;
  }>;
}

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

function WalletErrorFallback({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {error.message ||
              "An unexpected error occurred while loading the wallet details."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
            <Link href="/accounts/wallet">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wallets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}

function WalletSkeleton() {
  return (
    <div className="max-w-7xl mx-auto  space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-muted animate-pulse rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WalletPageContent({ walletIdentifier }: { walletIdentifier: string }) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("tokens");
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const { pageClass } = useViewModeClasses();

  const avataUrl = createAvatar(botttsNeutral, {
      size: 128,
      seed: walletIdentifier,
      radius: 20,
    }).toDataUri();

  // ✅ NEW: Use TanStack Query hooks for parallel data fetching (organization-aware)
  const walletQuery = useOrganizationCryptoWallet(walletIdentifier);

  // Combine data and states
  const wallet = walletQuery.data;

  const isLoading = walletQuery.isLoading;
  const error = walletQuery.error ;
  const refetch = () => {
    walletQuery.refetch();

  };

  const { mutate: syncWallet } = useOrganizationSyncCryptoWallet();
  const { realtimeSyncStates } = useCryptoStore();
  const prevSyncStatusRef = useRef<string>();

  
 

  // Get SSE-based sync status for this wallet
  const walletSyncState = realtimeSyncStates[walletIdentifier];
  const isSyncingSSE = walletSyncState && CRYPTO_SYNC_ACTIVE_STATUSES.includes(walletSyncState.status);
  const syncProgress = walletSyncState?.progress || 0;
  const syncMessage = walletSyncState?.message || '';
  const lastSyncAt = walletSyncState?.completedAt;

  // Track if we're currently syncing
  const isSyncing = syncWallet.isPending || isSyncingSSE;

  // Auto-refresh data when sync completes
  useEffect(() => {
    const currentStatus = walletSyncState?.status;
    const prevStatus = prevSyncStatusRef.current;

    // If sync status changed from syncing to completed, refetch data
    if (prevStatus && ['syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(prevStatus) && currentStatus === "completed") {
      setTimeout(() => {
        refetch();
        toast.toast({ title: 'Success', description: "Wallet data updated!", variant: 'success' });
      }, 1000); // Small delay to ensure backend has processed the sync
    }

    // Update the previous status
    prevSyncStatusRef.current = currentStatus;
  }, [walletSyncState?.status, refetch]);

  // Memoize expensive calculations
  const walletStats = useMemo(() => {
    if (!wallet) return null;
    return {
      totalBalance: parseFloat(wallet?.portfolio?.totalPositionsValue || "0"),
      assetCount: wallet?.assets?.length || 0,
      nftCount: wallet.nfts?.length || 0,
      lastSyncFormatted: wallet.lastSyncAt
        ? new Date(wallet.lastSyncAt).toLocaleDateString()
        : "Never",
    };
  }, [wallet]);

  const handleCopyAddress = useCallback(async () => {
    if (!wallet?.walletData?.address) return;

    try {
      await navigator.clipboard.writeText(wallet.walletData.address);
      toast.toast({ title: 'Success', description: "Address copied to clipboard", variant: 'success' });
    } catch (error) {
      toast.toast({ title: 'Error', description: "Failed to copy address", variant: 'destructive' });
    }
  }, [wallet?.walletData?.address]);

  const handleSync = useCallback(() => {
    if (!walletIdentifier || syncWallet.isPending) return;

    syncWallet.mutate(
      {
        walletId: walletIdentifier,
        syncData: {
          syncAssets: true,
          syncNFTs: true,
          syncDeFi: true,
          syncTypes: ["assets", "transactions", "nfts"],
        },
      },
      {
        onSuccess: () => {
          toast.toast({ title: 'Success', description: "Wallet sync started", variant: 'success' });
          // Show the sync progress modal
          setShowSyncModal(true);
        },
        onError: (error: Error) => {
          toast.toast({ title: 'Error', description: error.message || "Failed to start sync", variant: 'destructive' });
        },
      }
    );
  }, [walletIdentifier, syncWallet]);

  const handleSyncComplete = useCallback(() => {

    toast.toast({ title: 'Success', description: 'Wallet sync completed successfully!', variant: 'success' });

    // Refresh wallet data after completion
    refetch();
  }, [walletIdentifier, refetch]);

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
      return explorers[network] || "#";
    },
    []
  );

  if (isLoading) {
    return <WalletSkeleton />;
  }

  if (error) {
    return <WalletErrorFallback error={error} reset={refetch} />;
  }

  if (!wallet) {
    return (
      <div className="max-w-7xl mx-auto ">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Could not find wallet with identifier: {walletIdentifier}
            </p>
            <Link href="/accounts/wallet">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wallets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className={`max-w-3xl mx-auto  space-y-3`}>
      {/* Back Navigation */}
      <div className="flex items-center justify-end">
  
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
   {/*     <Tooltip content={
         isSyncingSSE ? `Syncing... ${syncProgress}% ${syncMessage ? `- ${syncMessage}` : ''}` :
         walletSyncState?.status === "completed" ? `Last synced: ${lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'N/A'}` :
         walletSyncState?.status === "failed" ? `Sync failed: ${walletSyncState?.error || 'Unknown error'}` :
         'Sync status unknown'
       }>
            {isSyncingSSE ? (
              <Activity className="h-4 w-4 text-blue-500 animate-spin" />
            ) : walletSyncState?.status === "completed" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : walletSyncState?.status === "failed" ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span>
              {isSyncingSSE
                ? `Syncing... ${syncProgress}%`
                : walletSyncState?.status === "completed"
                ? `Last synced: ${lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'N/A'}`
                : walletSyncState?.status === "failed"
                ? `Sync failed`
                : "Not synced"}
            </span>
          </Tooltip> */}

           {wallet?.walletData?.lastSyncAt && !isSyncing ? (
              <span className="ml-2 text-xs text-muted-foreground">
                {timestampzToReadable(wallet?.walletData?.lastSyncAt)}
              </span>
            ) : null}
          <Button
         
            size="xs"
            onClick={handleSync}
            disabled={syncWallet.isPending || isSyncingSSE}
           
          >
            {syncWallet.isPending || isSyncingSSE ? (
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
                  <Image src={avataUrl} fill alt="wallet" className="rounded-full object-cover" unoptimized />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
                      {isSyncing ? (
                        <WalletNameSkeleton />
                      ) : (
                        wallet?.walletData?.name
                      )}
                    </h1>
                    {isSyncing ? (
                      <NetworkBadgeSkeleton />
                    ) : (
                      <Badge variant="new" className="text-[10px] px-1.5 py-0 h-4.5 font-normal flex-shrink-0">
                        {wallet?.walletData?.network}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isSyncing ? (
                      <AddressSkeleton />
                    ) : (
                      <>
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
                              href={isSyncing ? "#" : getNetworkExplorerUrl(
                                wallet?.walletData?.network,
                                wallet?.walletData?.address
                              )}
                              target={isSyncing ? undefined : "_blank"}
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center"
                              onClick={isSyncing ? (e) => e.preventDefault() : undefined}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Balance & 24h Change */}
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Total Balance
                  </span>
                  {isSyncing ? (
                    <BalanceSkeleton />
                  ) : (
                    <CurrencyDisplay
                      amountUSD={walletStats?.totalBalance || 0}
                      className="text-2xl font-bold text-foreground"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">24h Change:</span>
                  {isSyncing ? (
                    <ChangeBadgeSkeleton />
                  ) : wallet?.portfolio?.percent24hChange !== undefined ? (
                    <Badge className={cn(
                      "flex items-center h-5 gap-1 rounded-xs px-1.5 font-medium",
                      wallet?.portfolio?.percent24hChange >= 0
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-red-500/20 text-red-700 dark:text-red-400'
                    )}>
                      {wallet?.portfolio?.percent24hChange >= 0 ? (
                        <MageCaretUpFill className="h-3.5 w-3.5" />
                      ) : (
                        <MageCaretDownFill className="h-3.5 w-3.5" />
                      )}
                      <span className="text-xs">
                        {Math.abs(wallet?.portfolio?.percent24hChange).toFixed(2)}%
                      </span>
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: Stats Group & Chart */}
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
                    {isSyncing ? (
                      <StatsValueSkeleton />
                    ) : (
                      <CurrencyDisplay
                        amountUSD={wallet?.portfolio?.stakedValue || 0}
                        className="text-sm font-semibold text-foreground"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    )}
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
                    {isSyncing ? (
                      <StatsValueSkeleton />
                    ) : (
                      <CurrencyDisplay
                        amountUSD={wallet?.portfolio?.lockedValue || 0}
                        className="text-sm font-semibold text-foreground"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    )}
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
                    {isSyncing ? (
                      <StatsValueSkeleton />
                    ) : (
                      <CurrencyDisplay
                        amountUSD={wallet?.portfolio?.borrowedValue || 0}
                        className="text-sm font-semibold text-foreground"
                        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      />
                    )}
                  </div>
                </div>
              </div>

         

         


            </div>
         

          </div>
        </div>
        <Separator className="bg-border/50" />
 {/* Chart */}
             
                {isSyncing ? (
                  <WalletChartSkeleton height={80} compact={true} />
                ) : (
                  <PortfolioChart
                    walletAddress={wallet?.walletData?.address}
                 
                    height={200}
                    showPeriodFilter={true}
                    enableArea={true}
                    enableBreakdown={false}
                    className="w-full border-none *:shadow-none"
                  />
                )}
          

      </Card>


<Card className="">
      {/* Chain Filters */}
      <ChainFilters
        portfolio={wallet?.portfolio || {}}
        selectedChain={selectedChain}
        onChainSelect={setSelectedChain}
        isLoading={isLoading || isSyncing}
      /></Card>

      {/* Wallet Details Tabs */}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="  mt-2 " variant="pill" >
          <TabsTrigger
            value="tokens"
            className="flex px-2 items-center gap-1.5 cursor-pointer  "
          
            variant="pill"
          >
           
             <StreamlineFreehandCryptoCurrencyUsdCoin className="w-5 h-5" />
            <span className="inline">Tokens</span>
          </TabsTrigger>
          <TabsTrigger
            value="defi"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
         
            variant="pill"
          >
            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchange className="w-5 h-5" />
            
            <span className="inline">Defi</span>
          </TabsTrigger>
          <TabsTrigger
            value="nfts"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
         
            variant="pill"
          >
             <SolarGalleryWideOutline className="w-5 h-5" />
            <span className="inline">NFTs</span>
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
         
            variant="pill"
          >
            <MynauiActivitySquare className="w-5.5 h-5.5" />
            
            <span className="inline">Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className=" " key={`tokens-${selectedChain || 'all'}`}>
          <WalletTokens
            tokens={wallet?.assets || []}
            isLoading={isLoading || isSyncing}
            selectedChain={selectedChain}
          />
        </TabsContent>

        <TabsContent value="defi" className=" " key={`defi-${selectedChain || 'all'}`}>
          <WalletDeFi
            defiApps={wallet?.defiApps || []}
            isLoading={isLoading || isSyncing}
            selectedChain={selectedChain}
          />
        </TabsContent>

        <TabsContent value="nfts" className=" " key={`nfts-${selectedChain || 'all'}`}>
          <WalletNFTs
            nfts={wallet?.nfts || []}
            isLoading={isLoading || isSyncing}
            selectedChain={selectedChain}
          />
        </TabsContent>

        <TabsContent value="transactions" className=" " key={`transactions-${selectedChain || 'all'}`}>
          <WalletTransactions
            transactions={wallet?.transactions || []}
            isLoading={isLoading || isSyncing}
            walletAddress={wallet?.walletData?.address}
            selectedChain={selectedChain}
          />
        </TabsContent>
      </Tabs>

      {/* Sync Progress Modal */}
      <WalletSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        walletId={walletIdentifier}
        walletName={wallet?.walletData?.name}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  );
}

export default function WalletPage({ params }: WalletPageProps) {
  const resolvedParams = use(params);
  const walletIdentifier = resolvedParams?.wallet;

  return (
    <Suspense >
      <WalletPageContent walletIdentifier={walletIdentifier} />
    </Suspense>
  );
}
