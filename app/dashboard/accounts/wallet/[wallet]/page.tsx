"use client";

import { use, Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ArrowLeft,
  Copy,
  ExternalLink,
  RefreshCw,
  Wallet,
  Coins,
  Image as ImageIcon,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
// Import custom hooks
import {
  useWalletFullData,
  useSyncWallet,
  useSyncStatus,
} from "@/lib/hooks/use-crypto";
import { useCryptoStore } from "@/lib/stores/crypto-store";

// Import new components
import { WalletTokens } from "@/components/crypto/wallet-tokens";
import { WalletNFTs } from "@/components/crypto/wallet-nfts";
import { WalletTransactions } from "@/components/crypto/wallet-transactions";
import { WalletChart } from "@/components/crypto/wallet-chart";
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
  SolarGalleryOutline,
  SolarGalleryWideOutline,
  SolarWalletBoldDuotone,
  StreamlineFlexWallet,
  StreamlineFreehandCryptoCurrencyUsdCoin,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold,
  TablerReportMoney,
} from "@/components/icons/icons";
import { useViewModeClasses } from "@/lib/contexts/view-mode-context";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { timestampzToReadable } from "@/lib/utils/time";
import { Tooltip } from "@/components/ui/tooltip";
import { WalletSyncModal } from "@/components/crypto/wallet-sync-modal";

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
            <Link href="/dashboard/accounts/wallet">
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
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
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
  const [activeTab, setActiveTab] = useState("tokens");
  const [showSyncModal, setShowSyncModal] = useState(false);
  const { pageClass } = useViewModeClasses();


  const avataUrl = createAvatar(botttsNeutral, {
      size: 128,
      seed: walletIdentifier,
      radius: 20,
    }).toDataUri();

  // Use the optimized hook that fetches all data efficiently
  const { wallet, transactions, nfts, isLoading, error, refetch } =
    useWalletFullData(walletIdentifier);

  const syncWallet = useSyncWallet();
  const { realtimeSyncStates } = useCryptoStore();
  const prevSyncStatusRef = useRef<string>();

  // Get SSE-based sync status for this wallet
  const walletSyncState = realtimeSyncStates[walletIdentifier];
  const isSyncingSSE = walletSyncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(walletSyncState.status);
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
        toast.success("Wallet data updated!");
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
      toast.success("Address copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy address");
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
          syncTypes: ["assets", "transactions", "nfts"],
        },
      },
      {
        onSuccess: () => {
          toast.success("Wallet sync started");
          // Show the sync progress modal
          setShowSyncModal(true);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to start sync");
        },
      }
    );
  }, [walletIdentifier, syncWallet]);

  const handleSyncComplete = useCallback(() => {
    
    toast.success('Wallet sync completed successfully!');

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
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Could not find wallet with identifier: {walletIdentifier}
            </p>
            <Link href="/dashboard/accounts/wallet">
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
    <div className={`${pageClass} p-4 lg:p-6 space-y-6`}>
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
       <Tooltip content={
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
          </Tooltip>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncWallet.isPending || isSyncingSSE}
            className="min-w-[80px]"
          >
            {syncWallet.isPending || isSyncingSSE ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isSyncingSSE ? `${syncProgress}%` : 'Sync'}
          
          </Button>
            {wallet?.walletData?.lastSyncAt && !isSyncing ? (
              <span className="ml-2 text-xs text-muted-foreground">
                {timestampzToReadable(wallet?.walletData?.lastSyncAt)}
              </span>
            ) : null}
         
        </div>
      </div>

      {/*    
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="p-3 sm:p-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
 
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
                <StreamlineFlexWallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-base sm:text-lg font-semibold truncate">
                    {wallet?.walletData?.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary flex-shrink-0"
                  >
                    {wallet?.walletData?.network}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="font-mono text-xs">
                    {wallet?.walletData?.address?.slice(0, 6)}...
                    {wallet?.walletData?.address?.slice(-4)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="h-5 w-5 p-0"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-5 w-5 p-0"
                      title="Explorer"
                    >
                      <a
                        href={getNetworkExplorerUrl(
                          wallet?.walletData?.network,
                          wallet?.walletData?.address
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-4">
              <div className="flex gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Tokens</div>
                  <div className="text-sm font-semibold">
                    {walletStats?.assetCount || 0}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">NFTs</div>
                  <div className="text-sm font-semibold">
                    {walletStats?.nftCount || 0}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Total Balance
                </div>
                <div className="text-base sm:text-lg font-bold">
                  ${walletStats?.totalBalance.toLocaleString() || "0"}
                </div>
              </div>
            </div>
          </div>

    
          <div className="mt-4 -mx-3 sm:-mx-4 -mb-3 sm:-mb-4">
            <WalletChart
              walletAddress={wallet?.walletData?.address}
              className="w-full"
              height={100}
              compact={true}
            />
          </div>
        </Card>


        <Card className="p-3 sm:p-4 lg:col-span-1">
          <div className="space-y-3 sm:space-y-4">
          
            <div className="space-y-1.5 sm:space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={() => setActiveTab("tokens")}
              >
                <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                View All Tokens
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={() => setActiveTab("nfts")}
              >
                <ImageIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                Browse NFTs
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={() => setActiveTab("transactions")}
              >
                <ArrowUpDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                Transaction History
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={handleSync}
                disabled={syncWallet.isPending}
              >
                {syncWallet.isPending ? (
                  <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                )}
                Sync Wallet
              </Button>
            </div>

         
            <div className="pt-2 border-t space-y-1.5 sm:space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Quick Stats
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="font-medium">
                    {walletStats?.lastSyncFormatted || "Never"}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">
                    {wallet?.walletData?.network}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      walletSyncState?.status === "completed"
                        ? "default"
                        : walletSyncState?.status === "failed"
                        ? "destructive"
                        : isSyncingSSE
                        ? "secondary"
                        : "outline"
                    }
                    className="text-[10px] py-0 px-1.5 h-4"
                  >
                    {walletSyncState?.status === "completed" ? "Synced" :
                     walletSyncState?.status === "failed" ? "Failed" :
                     isSyncingSSE ? "Syncing" : "Unknown"}
                  </Badge>
                </div>
              </div>
            </div>

     
            <div className="pt-2 border-t">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                External
              </div>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 h-6 sm:h-7 text-xs"
                >
                  <a
                    href={getNetworkExplorerUrl(
                      wallet?.walletData?.network,
                      wallet?.walletData?.address
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Explorer
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-6 sm:h-7 px-2"
                  title="Copy Address"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
 */}

      {/* Main Wallet Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-8 w-8 sm:h-20 sm:w-20 bg-muted rounded-3xl flex items-center justify-center flex-shrink-0 relative">
              <Image src={avataUrl} fill alt="ja" className="rounded-3xl" unoptimized />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-sm font-semibold truncate">
                  {isSyncing ? (
                    <WalletNameSkeleton />
                  ) : (
                    wallet?.walletData?.name
                  )}
                </h1>

                {isSyncing ? (
                  <NetworkBadgeSkeleton />
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary flex-shrink-0"
                  >
                    {wallet?.walletData?.network}
                  </Badge>
                )}
              </div>
              <div className="text-left">
                <div className="flex items-baseline text-base sm:text-4xl font-medium gap-2">
                  {isSyncing ? (
                    <BalanceSkeleton />
                  ) : (
                    <CurrencyDisplay
                      amountUSD={walletStats?.totalBalance || 0}
                      variant="large"
                      isLoading={isSyncing}
                    />
                  )}

                  {isSyncing ? (
                    <ChangeBadgeSkeleton />
                  ) : wallet?.portfolio?.percent24hChange !== undefined ? (
                    <Badge  className={cn(
                      "flex items-center h-6  gap-1 rounded-sm px-1",
                      wallet?.portfolio?.percent24hChange >= 0 ? 'bg-green-500/20 rounded-xs text-green-700 hover:bg-green-500/30' : 'bg-red-500/20 rounded-xs 0 hover:bg-red-500/30 text-red-700'
                    )}>
                      {wallet?.portfolio?.percent24hChange >= 0 ? (
                        <MageCaretUpFill className="h-4 w-4" />
                      ) : (
                        <MageCaretDownFill className="h-4 w-4" />
                      )}
                      <span className="font-medium text-xs">
                        {Math.abs(wallet?.portfolio?.percent24hChange).toFixed(2)}%
                      </span>
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span className="font-mono text-sm">
                  {isSyncing ? (
                    <AddressSkeleton />
                  ) : (
                    `${wallet?.walletData?.address?.slice(0, 6)}...${wallet?.walletData?.address?.slice(-4)}`
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-5 w-5 p-0"
                    title="Copy"
                    disabled={isSyncing}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-5 w-5 p-0"
                    title="Explorer"
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
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-4 pl-2">
            <div className="text-left uppercase">
              <div className="text-[10px] font-medium text-muted-foreground">
                Staked
              </div>
              <div className="text-sm font-semibold">
                {isSyncing ? (
                  <StatsValueSkeleton />
                ) : (
                  <CurrencyDisplay
                    amountUSD={wallet.portfolio?.stakedValue || 0}
                    variant="small"
                    isLoading={isSyncing}
                  />
                )}
              </div>
            </div>
            <div className="text-left uppercase">
              <div className="text-[10px] font-medium text-muted-foreground">
                Locked
              </div>
              <div className="text-sm font-semibold">
                {isSyncing ? (
                  <StatsValueSkeleton />
                ) : (
                  <CurrencyDisplay
                    amountUSD={wallet.portfolio?.lockedValue || 0}
                    variant="small"
                    isLoading={isSyncing}
                  />
                )}
              </div>
            </div>
            <div className="text-center uppercase">
              <div className="text-[10px] font-medium text-muted-foreground">
                Borrowed
              </div>
              <div className="text-sm font-semibold">
                {isSyncing ? (
                  <StatsValueSkeleton />
                ) : (
                  <CurrencyDisplay
                    amountUSD={wallet.portfolio?.borrowedValue || 0}
                    variant="small"
                    isLoading={isSyncing}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Fluid Chart */}

        {isSyncing ? (
          <WalletChartSkeleton height={100} compact={true} />
        ) : (
          <WalletChart
            walletAddress={wallet?.walletData?.address}
            className="w-fit"
            height={100}
            compact={true}
          />
        )}
      </div>

      {/* Wallet Details Tabs */}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="  mt-8 " variant="ghost">
          <TabsTrigger
            value="tokens"
            className="flex px-2 items-center gap-1.5 cursor-pointer  "
            variant="ghost"
          >
           
             <StreamlineFreehandCryptoCurrencyUsdCoin className="w-4 h-4" />
            <span className="inline">Tokens</span>
          </TabsTrigger>
          <TabsTrigger
            value="defi"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            variant="ghost"
          >
            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold className="w-4 h-4" />
            
            <span className="inline">Defi</span>
          </TabsTrigger>
          <TabsTrigger
            value="nfts"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            variant="ghost"
          >
             <SolarGalleryWideOutline className="w-4 h-4" />
            <span className="inline">NFTs</span>
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            variant="ghost"
          >
            <TablerReportMoney className="w-4.5 h-4.5" />
            
            <span className="inline">Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className=" ">
          <WalletTokens tokens={wallet?.assets || []} isLoading={isLoading || isSyncing} />
        </TabsContent>

        <TabsContent value="nfts" className=" ">
          <WalletNFTs nfts={nfts || []} isLoading={isLoading || isSyncing} />
        </TabsContent>

        <TabsContent value="transactions" className=" ">
          <WalletTransactions
            transactions={transactions || []}
            isLoading={isLoading || isSyncing}
            walletAddress={wallet?.walletData?.address}
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
