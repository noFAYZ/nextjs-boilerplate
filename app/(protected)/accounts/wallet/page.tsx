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
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

// ✅ Import TanStack Query hook for aggregated wallet
import { useAggregatedCryptoWallet, useCryptoPortfolio, useSyncAllCryptoWallets } from "@/lib/queries";
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
  SolarGalleryOutline,
} from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LetsIconsSettingLineDuotone, LogoLoader } from "@/components/icons";
import { CryptoAllocationWidget, NetworkDistributionWidget } from "@/components/dashboard-widgets";

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

  const {data:portfolioData, isLoading:portfolioLoading,error:portfolioError} = useCryptoPortfolio({includeChart:true,chartTimeRange:'7d'})

  // Memoize stats
  const portfolioStats = useMemo(() => {
    if (!aggregatedData) return null;

    const summary = aggregatedData.summary;

    // Find top 5 best performing assets (highest positive change24h)
    const topPerformingAssets = portfolioData?.topAssets?.length
      ? [...portfolioData.topAssets]
          .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
          .slice(0, 3)
          .map(asset => ({
            symbol: asset.symbol,
            name: asset.name,
            change24h: asset.change24h,
            balanceUsd: asset.balanceUsd,
            logoUrl: asset.logoUrl,
          }))
      : [];

    // Get top 5 networks (already sorted by value)
    const topNetworks = portfolioData?.networkDistribution?.slice(0, 3).map(network => ({
      network: network.network,
      valueUsd: network.valueUsd,
      percentage: network.percentage,
      assetCount: network.assetCount,
    })) || [];

    return {
      totalValue: portfolioData?.totalValueUsd || 0,
      totalAssets: summary?.totalAssets || 0,
      totalNFTs: summary?.totalNfts || 0,
      totalNFTValue: portfolioData?.totalNftValue || 0,
      totalWallets: summary?.totalWallets || 0,
      dayChange: portfolioData?.dayChange || 0,
      dayChangePct: portfolioData?.dayChangePct || 0,
      totalDeFiValue: portfolioData?.totalDeFiValue || 0,
      totalAssetsValue: portfolioData?.totalAssetsValue || 0,
      topPerformingAssets,
      topNetworks,
    };
  }, [aggregatedData, portfolioData]);

  console.log(aggregatedData,portfolioData)



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
   {/* Header Row */}
        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 p-4">
          {/* Left: Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/15 flex items-center justify-center  shadow-sm flex-shrink-0">
              <SolarWalletMoneyBoldDuotone className="h-6 w-6 text-primary" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-md font-bold tracking-tight text-foreground">
                Portfolio Overview
              </h1>
              <p className="text-xs text-muted-foreground ">
                Track your crypto holdings across all wallets
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/accounts/wallet/manage">
              <Button
                variant="outline"
                size="sm"
                className=" font-medium border-border/60 hover:border-border"
              >
                <LetsIconsSettingLineDuotone className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </Link>

            <Button
              onClick={handleSync}
              disabled={isSyncing}
              size="sm"
              className=" font-medium"
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

      {/* Integrated Portfolio Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-muted/30 to-background p-4 shadow-lg">
  

     

        {/* Main Metrics Grid */}
        <div className="relative w-full flex justify-between gap-2">
          {/* Total Value - Spans 8 columns on large screens */}
          <div className="w-full">
            <div className="flex flex-col h-full">
              {/* Value Display */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                      Total Portfolio Value
                    </p>
                    {portfolioStats && portfolioStats.dayChangePct !== undefined && (
                      <Badge
                        variant="soft"
                        className={cn(
                          "flex items-center gap-1",
                          portfolioStats.dayChangePct >= 0
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        )}
                      >
                        {portfolioStats.dayChangePct >= 0 ? (
                          <MageCaretUpFill className="h-3 w-3" />
                        ) : (
                          <MageCaretDownFill className="h-3 w-3" />
                        )}
                        <span className="font-semibold text-xs">
                          {Math.abs(portfolioStats.dayChangePct).toFixed(2)}%
                        </span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3 mb-1">
                    <CurrencyDisplay
                      amountUSD={portfolioStats?.totalValue || 0}
                      variant="large"
                      className="text-5xl font-bold"
                    />
                  </div>

                  {portfolioStats && (
                    <p className="text-sm text-muted-foreground">
                      <span
                        className={cn(
                          "font-semibold",
                          portfolioStats.dayChangePct >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {portfolioStats.dayChangePct >= 0 ? "+" : ""}
                        ${Math.abs(portfolioStats.dayChange || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>{" "}
                      in the last 24 hours
                    </p>
                  )}
                </div>

                {/* Mini Chart */}
                <div className="hidden lg:block">
                  {portfolioData?.chart?.dataPoints && portfolioData.chart.dataPoints.length > 1 ? (
                    <div className="h-24 w-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={portfolioData.chart.dataPoints.map(point => ({
                            timestamp: new Date(point.timestamp).getTime(),
                            value: point.value,
                          }))}
                          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor={portfolioStats?.dayChangePct >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor={portfolioStats?.dayChangePct >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <YAxis domain={['dataMin', 'dataMax']} hide />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={portfolioStats?.dayChangePct >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                            strokeWidth={2.5}
                            fill="url(#portfolioGradient)"
                            isAnimationActive={true}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Portfolio Breakdown Stats */}
              <div className="flex flex-wrap gap-6  mt-4 ">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-foreground">
                      {portfolioStats?.totalWallets || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">Wallets</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <Coins className="h-4 w-4 " />
                  </div>
                  <div className="flex flex-col ">
                    <span className=" text-foreground">
                      
                      <CurrencyDisplay amountUSD={portfolioStats?.totalAssetsValue || 0}  className="text-m font-bold" />
                    </span>
                    <span className="text-xs text-muted-foreground">{portfolioStats?.totalAssets || 0} Assets</span>
                  </div>
                </div>

                {portfolioStats && portfolioStats.totalNFTs > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                      <SolarGalleryOutline className="h-4 w-4 " />
                    </div>
                    <div className="flex flex-col ">
                      <span className=" text-foreground">
                         <CurrencyDisplay amountUSD={portfolioStats.totalNFTValue}  className="text-sm font-bold" />
                      </span>
                      <span className="text-xs text-muted-foreground">{portfolioStats.totalNFTs} NFTs</span>
                    </div>
                  </div>
                )}

                {portfolioStats && portfolioStats.totalDeFiValue > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-foreground">
                        <CurrencyDisplay amountUSD={portfolioStats.totalDeFiValue} variant="compact" />
                      </span>
                      <span className="text-xs text-muted-foreground">DeFi Value</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar - Spans 4 columns on large screens */}
          <div className="w-full flex gap-2 justify-end">
              {/* Crypto Portfolio Section */}
      
        
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {/* Top 5 Performing Assets 
    <div className="rounded-xl border bg-muted/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground">Top Assets</p>
        <Badge variant="soft" className="text-xs">24h</Badge>
      </div>
      {portfolioStats?.topPerformingAssets && portfolioStats.topPerformingAssets.length > 0 ? (
        <div className="space-y-1">
          {portfolioStats.topPerformingAssets.map((asset, index) => (
            <div key={asset.symbol + index} className="flex items-center justify-between group hover:bg-muted/60 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground font-medium w-4">{index + 1}</span>
                {asset.logoUrl && (
                  <img
                    src={asset.logoUrl}
                    alt={asset.symbol}
                    className="h-5 w-5 rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex flex-col min-w-0">
                  <p className="font-medium text-xs truncate">{asset.symbol}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{asset.name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                <p
                  className={cn(
                    "text-xs font-semibold",
                    asset.change24h > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {asset.change24h > 0 ? "+" : ""}
                  {asset.change24h.toFixed(2)}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  <CurrencyDisplay amountUSD={asset.balanceUsd} variant="compact" />
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">No assets data</p>
      )}
    </div>*/}

    {/* Top 5 Networks
    <div className="rounded-xl border bg-muted/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground">Top Networks</p>
        <Badge variant="soft" className="text-xs">By Value</Badge>
      </div>
      {portfolioStats?.topNetworks && portfolioStats.topNetworks.length > 0 ? (
        <div className="space-y-1">
          {portfolioStats.topNetworks.map((network, index) => (
            <div key={network.network + index} className="flex items-center justify-between group hover:bg-muted/60 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground font-medium w-4">{index + 1}</span>
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                  {network.network.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="font-medium text-xs">
                    {network.network.charAt(0) + network.network.slice(1).toLowerCase()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {network.assetCount} asset{network.assetCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0 ml-2">
                <p className="text-xs font-semibold text-foreground">
                  {network.percentage.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  <CurrencyDisplay amountUSD={network.valueUsd} variant="compact" />
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">No network data</p>
      )}
    </div> */}
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
