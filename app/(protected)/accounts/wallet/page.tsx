"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Coins,
  ImageIcon,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";

// ✅ Import TanStack Query hook for aggregated wallet
import { useAggregatedCryptoWallet, useSyncAllCryptoWallets } from "@/lib/queries";
import { useCryptoStore } from "@/lib/stores/crypto-store";

// Import components
import { WalletTokens } from "@/components/crypto/wallet-tokens";
import { WalletNFTs } from "@/components/crypto/wallet-nfts";
import { WalletTransactions } from "@/components/crypto/wallet-transactions";
import { WalletChart } from "@/components/crypto/wallet-chart";
import { WalletDeFi } from "@/components/crypto/wallet-defi";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import {
  StreamlineFlexWallet,
  MageCaretUpFill,
  MageCaretDownFill,
  SolarWalletBoldDuotone,
  SolarWalletMoneyBoldDuotone,
  MynauiActivitySquare,
  SolarGalleryWideOutline,
  StreamlineFreehandCryptoCurrencyUsdCoin,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchange,
  SolarWalletMoneyLinear,
} from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LetsIconsSettingLineDuotone, LogoLoader } from "@/components/icons";

function WalletLoadingState() {
  return (
    <div className="relative h-screen bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
      <Card className="px-5 border-border shadow-none">
        <div className="flex items-center space-x-3">
          <LogoLoader className="w-8 h-8" />
          <span className="text-sm font-medium">Loading your portfolio...</span>
        </div>
      </Card>
    </div>
  );
}

function WalletErrorState({ error }: { error: any }) {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || "Failed to load aggregated wallet data"}
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/accounts/wallet/manage">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Manage Wallets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AggregatedWalletPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tokens");

  // ✅ Use TanStack Query hook for aggregated wallet data
  const { data: aggregatedData, isLoading, error, refetch } = useAggregatedCryptoWallet();
  const { mutate: syncAllWallets, isPending: isSyncing } = useSyncAllCryptoWallets();

  // Memoize stats
  const portfolioStats = useMemo(() => {
    if (!aggregatedData) return null;

    const summary = aggregatedData.summary;
    const portfolio = aggregatedData.portfolio;

    return {
      totalValue: portfolio?.walletValue || 0,
      totalAssets: summary?.totalAssets || 0,
      totalNFTs: summary?.totalNfts || 0,
      totalWallets: summary?.totalWallets || 0,
      dayChange: portfolio?.absolute24hChange || 0,
      dayChangePct: portfolio?.percent24hChange || 0,
      totalDeFiValue: summary?.totalDeFiValue || 0,
    };
  }, [aggregatedData]);

  console.log(aggregatedData)

  const handleSync = () => {
    syncAllWallets(undefined, {
      onSuccess: () => {
        setTimeout(() => {
          refetch();
        }, 2000);
      },
    });
  };

  if (isLoading) {
    return <WalletLoadingState />;
  }

  if (error) {
    return <WalletErrorState error={error} />;
  }

  if (!aggregatedData) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <StreamlineFlexWallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No wallet data available</h2>
            <p className="text-muted-foreground mb-4">
              Connect your first wallet to start tracking your portfolio
            </p>
            <Link href="/accounts/wallet/manage">
              <Button>Manage Wallets</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 lg:p-6 space-y-6">


      {/* Portfolio Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 pb-6 border-b border-border/40">
  {/* Left Section 
  <div className="flex items-center gap-4">
    <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-muted/70 to-muted flex items-center justify-center ring-1 ring-border/50 shadow-sm">
      <SolarWalletMoneyBoldDuotone className="h-6 w-6 text-foreground/80" />

    </div>

    <div className="flex flex-col">
      <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
        Portfolio Overview
        {portfolioStats?.lastUpdated && (
          <span className="text-xs font-normal text-muted-foreground">
            (Updated {new Date(portfolioStats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
          </span>
        )}
      </h1>
      <p className="text-sm text-muted-foreground">
        Unified view of all your crypto holdings across wallets
      </p>
    </div>
  </div>*/}

  {/* Right Section */}
  <div className="flex items-center gap-2">
    <Link href="/accounts/wallet/manage">
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg font-medium "
      >
        <LetsIconsSettingLineDuotone className="h-4 w-4 mr-1" />
        Manage
      </Button>
    </Link>

    <Button
      onClick={handleSync}
      disabled={isSyncing}
      size="sm"
      className="rounded-lg font-medium"
    >
      {isSyncing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 mr-1" />
          Sync All
        </>
      )}
    </Button>
  </div>
</div>
{/* Portfolio Metrics */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
  {/* Hero Metric: Total Portfolio Value */}
  <div className="relative col-span-1 lg:col-span-2 rounded-2xl border bg-gradient-to-r from-muted/70 to-muted/40 p-4 shadow hover:shadow-md transition-all">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground ">
          Total Portfolio Value
        </h3>
        <div className="flex items-baseline gap-3">
          <span className="">
            <CurrencyDisplay
              amountUSD={portfolioStats?.totalValue || 0}
              variant="large"
          className="text-4xl"
            />
          </span>
 

{portfolioStats && portfolioStats.dayChangePct !== undefined ? (
                      <Badge
                        className={cn(
                          "flex items-center justify-end gap-1 rounded-xs",
                          portfolioStats.dayChangePct >= 0
                            ? "bg-green-500/20 rounded-xs text-green-700 hover:bg-green-500/30"
                            : "bg-red-500/20 rounded-xs 0 hover:bg-red-500/30 text-red-700"
                        )}
                      >
                        {portfolioStats.dayChangePct >= 0 ? (
                          <MageCaretUpFill className="h-4 w-4" />
                        ) : (
                          <MageCaretDownFill className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {Math.abs(portfolioStats.dayChangePct).toFixed(2)}%
                        </span>
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <span className={cn(
                          portfolioStats && portfolioStats.dayChangePct >= 0
                            ? "bg-green-500/20 rounded-xs text-green-700 hover:bg-green-500/30"
                            : "bg-red-500/20 rounded-xs 0 hover:bg-red-500/30 text-red-700"
                        )}>+${Math.abs(portfolioStats?.dayChange || 0).toLocaleString()}</span> in the last 24h
        </p>
      </div> 

      {/* Optional mini trend line (placeholder for chart) */}
      <div className="hidden md:block">
        <div className="h-14 w-36 flex items-end justify-end">
          <div className="h-full w-full opacity-60">
            {/* Placeholder for micro chart */}
            <svg viewBox="0 0 100 40" className="h-full w-full text-primary/60">
              <path
                d="M0 25 Q25 10, 50 25 T100 15"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* Insight Footer */}
    <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-blue-500/70" />
        {portfolioStats?.totalWallets || 0} Wallets Linked
      </div>
    
    </div>
  </div>

  {/* Secondary Stats */}
  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-xl border bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground mb-1">Best Performing Asset</p>
      <p className="font-medium text-sm">
        {portfolioStats?.topAsset?.name || "—"}
      </p>
      {portfolioStats?.topAsset?.changePct && (
        <p
          className={cn(
            "text-xs font-semibold mt-1",
            portfolioStats.topAsset.changePct > 0
              ? "text-green-500"
              : "text-red-500"
          )}
        >
          {portfolioStats.topAsset.changePct > 0 ? "+" : ""}
          {portfolioStats.topAsset.changePct.toFixed(2)}%
        </p>
      )}
    </div>

    <div className="rounded-xl border  bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground mb-1">Top Network</p>
      <div className="flex items-center gap-2">
        <img
          src={portfolioStats?.topNetwork?.logoUrl || "/networks/eth.svg"}
          alt="network"
          className="h-4 w-4 rounded-full"
        />
        <p className="font-medium text-sm">
          {portfolioStats?.topNetwork?.name || "Ethereum"}
        </p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {portfolioStats?.topNetwork?.sharePct || 0}% of portfolio
      </p>
    </div>
  </div>
</div>


      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
     

        <TabsList className="  mt-2 " variant="card" size={'sm'}>
          <TabsTrigger
            value="tokens"
            className="flex px-2 items-center gap-1.5 cursor-pointer  "
                size={'sm'}
            variant="card"
          >
           
             <StreamlineFreehandCryptoCurrencyUsdCoin className="w-5 h-5" />
            <span className="inline">Tokens</span>
          </TabsTrigger>
          <TabsTrigger
            value="defi"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
             size={'sm'}
            variant="card"
          >
            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchange className="w-5 h-5" />
            
            <span className="inline">Defi</span>
          </TabsTrigger>
          <TabsTrigger
            value="nfts"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
             size={'sm'}
            variant="card"
          >
             <SolarGalleryWideOutline className="w-5 h-5" />
            <span className="inline">NFTs</span>
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size={'sm'}
            variant="card"
          >
            <MynauiActivitySquare className="w-5.5 h-5.5" />
            
            <span className="inline">Transactions</span>
          </TabsTrigger>
          <TabsTrigger
            value="wallets"
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size={'sm'}
            variant="card"
          >
            <SolarWalletMoneyLinear className="w-5.5 h-5.5" stroke="1.7" />
            
            <span className="inline">Wallets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-6">
        
              {aggregatedData.assets && aggregatedData.assets.length > 0 ? (
                <WalletTokens
                  tokens={aggregatedData.assets}
                  isAggregated={true}
                
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No assets found
                </div>
              )}
           
        </TabsContent>

        <TabsContent value="nfts" className="mt-6">
      
              {aggregatedData.nfts && aggregatedData.nfts.length > 0 ? (
                <WalletNFTs nfts={aggregatedData.nfts} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No NFTs found
                </div>
              )}
      
        </TabsContent>

        <TabsContent value="defi" className="mt-6">
      
              {aggregatedData.defiApps && aggregatedData.defiApps.length > 0 ? (
                <WalletDeFi defiApps={aggregatedData.defiApps} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No DeFi positions found
                </div>
              )}
         
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
     
              {aggregatedData.transactions && aggregatedData.transactions.length > 0 ? (
                <WalletTransactions transactions={aggregatedData.transactions} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found
                </div>
              )}
           
        </TabsContent>
        <TabsContent value="wallets" className="mt-6">
     
     {aggregatedData.wallets && aggregatedData.wallets.length > 0 ? (
           <>SD</>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          )}
        
      </TabsContent>


      </Tabs>


    </div>
  );
}
