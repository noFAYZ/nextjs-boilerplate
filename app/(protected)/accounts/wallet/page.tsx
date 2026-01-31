"use client";

import { useCallback, useMemo, memo } from "react";
import { usePostHogPageView } from '@/lib/shared/hooks';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

// ✅ Import TanStack Query hooks
import { useAggregatedCryptoWallet, useSyncAllCryptoWallets } from "@/lib/features/crypto/queries";
import { useOrganizationCryptoPortfolio } from '@/lib/features/organization/queries';

// ✅ Use centralized utilities
import { getTopPerformingAssets, getTopNetworks } from "@/lib/utils";

// Import components
import { WalletTokens } from "@/components/modules/crypto/components/wallet-tokens";
import { WalletNFTs } from "@/components/modules/crypto/components/wallet-nfts";
import { WalletTransactions } from "@/components/modules/crypto/components/wallet-transactions";
import { WalletDeFi } from "@/components/modules/crypto/components/wallet-defi";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import {
  StreamlineFlexWallet,
  MageCaretUpFill,
  MageCaretDownFill,
  MynauiActivitySquare,
  SolarGalleryWideOutline,
  StreamlineFreehandCryptoCurrencyUsdCoin,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchange,
  SolarWalletMoneyLinear,
  SolarGalleryOutline,
  HeroiconsWallet16Solid,
} from "@/components/icons/icons";
import { cn } from "@/lib/utils";
import { LetsIconsSettingLineDuotone, LogoLoader } from "@/components/icons";

// ============================================
// Constants
// ============================================
const WALLET_TABS = {
  TOKENS: "tokens",
  DEFI: "defi",
  NFTS: "nfts",
  TRANSACTIONS: "transactions",
  WALLETS: "wallets",
} as const;

const CHART_MARGIN = { top: 5, right: 0, left: 0, bottom: 5 };

// ============================================
// Loading State Component
// ============================================
const WalletLoadingState = memo(function WalletLoadingState() {
  return (
    <div className="relative h-[80vh] z-10 flex items-center justify-center">
      <Card className="px-5 border-border shadow-none">
        <div className="flex items-center space-x-3">
          <LogoLoader className="w-8 h-8" />
          <span className="text-sm font-medium">Loading your wallet portfolio....</span>
        </div>
      </Card>
    </div>
  );
});

// ============================================
// Error State Component
// ============================================
const WalletErrorState = memo(function WalletErrorState({ error }: { error: unknown }) {
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
              <Button variant="outline">Manage Wallets</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

// ============================================
// Empty State Component
// ============================================
const WalletEmptyState = memo(function WalletEmptyState() {
  return (
    <div className="max-w-7xl mx-auto">
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
});

// ============================================
// Portfolio Stats Card Component
// ============================================
interface PortfolioStats {
  totalValue: number;
  totalAssets: number;
  totalNFTs: number;
  totalNFTValue: number;
  totalWallets: number;
  dayChange: number;
  dayChangePct: number;
  totalDeFiValue: number;
  totalAssetsValue: number;
}

interface PortfolioHeroProps {
  portfolioStats: PortfolioStats | null;
  portfolioData: any;
  isSyncing: boolean;
  onSync: () => void;
}

const PortfolioHero = memo(function PortfolioHero({
  portfolioStats,
  portfolioData,
  isSyncing,
  onSync,
}: PortfolioHeroProps) {
  if (!portfolioStats) return null;

  const isGainPositive = portfolioStats.dayChangePct >= 0;
  const changeColor = isGainPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-end gap-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/accounts/wallet/manage">
            <Button
              variant="outline"
              size="xs"
              className="font-medium border-border/60 hover:border-border"
            >
              <LetsIconsSettingLineDuotone className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </Link>

          <Button onClick={onSync} disabled={isSyncing} size="xs" className="font-medium">
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

      {/* Portfolio Card */}
      <Card className="relative overflow-hidden rounded-lg p-4 border-border/80 hover:shadow-xs">
        <div className="relative w-full flex justify-between gap-2">
          <div className="w-full">
            <div className="flex flex-col h-full">
              {/* Value Display */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                      Total Portfolio Value
                    </p>
                    {portfolioStats.dayChangePct !== undefined && (
                      <Badge
                        variant="soft"
                        className={cn(
                          "flex items-center gap-1",
                          isGainPositive
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        )}
                      >
                        {isGainPositive ? (
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
                      amountUSD={portfolioStats.totalValue}
                      variant="large"
                      className="text-5xl font-bold"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    <span className={cn("font-semibold", changeColor)}>
                      {isGainPositive ? "+" : ""}
                      ${Math.abs(portfolioStats.dayChange).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>{" "}
                    in the last 24 hours
                  </p>
                </div>

                {/* Mini Chart */}
                <PortfolioChart portfolioData={portfolioData} isGainPositive={isGainPositive} />
              </div>

              {/* Portfolio Breakdown Stats */}
              <PortfolioStats stats={portfolioStats} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

// ============================================
// Portfolio Chart Component
// ============================================
interface PortfolioChartProps {
  portfolioData: any;
  isGainPositive: boolean;
}

const PortfolioChart = memo(function PortfolioChart({
  portfolioData,
  isGainPositive,
}: PortfolioChartProps) {
  if (!portfolioData?.chart?.dataPoints || portfolioData.chart.dataPoints.length <= 1) {
    return null;
  }

  const chartData = useMemo(
    () =>
      portfolioData.chart.dataPoints.map((point: any) => ({
        timestamp: new Date(point.timestamp).getTime(),
        value: point.value,
      })),
    [portfolioData.chart.dataPoints]
  );

  const strokeColor = isGainPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)";

  return (
    <div className="hidden lg:block h-24 w-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2.5}
            fill="url(#portfolioGradient)"
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

// ============================================
// Portfolio Stats Component
// ============================================
const PortfolioStats = memo(function PortfolioStats({ stats }: { stats: PortfolioStats }) {
  return (
    <div className="flex flex-wrap gap-6 mt-4">
      {/* Wallets */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-blue-400/90 flex items-center justify-center">
          <HeroiconsWallet16Solid className="h-5 w-5 text-blue-900" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">{stats.totalWallets}</span>
          <span className="text-xs text-muted-foreground">Wallets</span>
        </div>
      </div>

      {/* Assets */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-orange-400 flex items-center justify-center">
          <StreamlineFreehandCryptoCurrencyUsdCoin className="h-5 w-5 text-orange-900" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground">
            <CurrencyDisplay amountUSD={stats.totalAssetsValue} className="text-m font-bold" />
          </span>
          <span className="text-xs text-muted-foreground">{stats.totalAssets} Assets</span>
        </div>
      </div>

      {/* NFTs */}
      {stats.totalNFTs > 0 && (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <SolarGalleryOutline className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground">
              <CurrencyDisplay amountUSD={stats.totalNFTValue} className="text-sm font-bold" />
            </span>
            <span className="text-xs text-muted-foreground">{stats.totalNFTs} NFTs</span>
          </div>
        </div>
      )}

      {/* DeFi */}
      {stats.totalDeFiValue > 0 && (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">
              <CurrencyDisplay amountUSD={stats.totalDeFiValue} variant="compact" />
            </span>
            <span className="text-xs text-muted-foreground">DeFi Value</span>
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================
// Tab Content Component
// ============================================
interface TabContentProps {
  activeTab: string;
  aggregatedData: any;
}

const TabContentRenderer = memo(function TabContentRenderer({
  activeTab,
  aggregatedData,
}: TabContentProps) {
  switch (activeTab) {
    case WALLET_TABS.TOKENS:
      return aggregatedData.assets && aggregatedData.assets.length > 0 ? (
        <WalletTokens tokens={aggregatedData.assets} isAggregated />
      ) : (
        <div className="text-center py-8 text-muted-foreground">No assets found</div>
      );

    case WALLET_TABS.NFTS:
      return aggregatedData.nfts && aggregatedData.nfts.length > 0 ? (
        <WalletNFTs nfts={aggregatedData.nfts} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">No NFTs found</div>
      );

    case WALLET_TABS.DEFI:
      return aggregatedData.defiApps && aggregatedData.defiApps.length > 0 ? (
        <WalletDeFi defiApps={aggregatedData.defiApps} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">No DeFi positions found</div>
      );

    case WALLET_TABS.TRANSACTIONS:
      return aggregatedData.transactions && aggregatedData.transactions.length > 0 ? (
        <WalletTransactions transactions={aggregatedData.transactions} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">No transactions found</div>
      );

    case WALLET_TABS.WALLETS:
      return aggregatedData.wallets && aggregatedData.wallets.length > 0 ? (
        <div className="text-center py-8 text-muted-foreground">Wallets view</div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No wallets found</div>
      );

    default:
      return null;
  }
});

// ============================================
// Main Page Component
// ============================================
export default function AggregatedWalletPage() {
  usePostHogPageView("wallet");

  // ✅ Use TanStack Query hooks
  const { data: aggregatedData, isLoading, error, refetch } = useAggregatedCryptoWallet();
  const { mutate: syncAllWallets, isPending: isSyncing } = useSyncAllCryptoWallets();
  const { data: portfolioData } = useOrganizationCryptoPortfolio({
    includeChart: true,
    chartTimeRange: "7d",
  });

  // ✅ Memoize portfolio stats
  const portfolioStats = useMemo(() => {
    if (!aggregatedData) return null;

    const summary = aggregatedData.summary;
    const topPerformingAssets = portfolioData?.topAssets
      ? getTopPerformingAssets(portfolioData.topAssets, 3)
      : [];
    const topNetworks = portfolioData?.networkDistribution
      ? getTopNetworks(portfolioData.networkDistribution, 3)
      : [];

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

  // ✅ Memoize sync handler
  const handleSync = useCallback(() => {
    syncAllWallets(undefined, {
      onSuccess: () => {
        setTimeout(() => {
          refetch();
        }, 2000);
      },
    });
  }, [syncAllWallets, refetch]);

  // Loading state
  if (isLoading) {
    return <WalletLoadingState />;
  }

  // Error state
  if (error) {
    return <WalletErrorState error={error} />;
  }

  // Empty state
  if (!aggregatedData) {
    return <WalletEmptyState />;
  }

  return (
    <div className="mx-auto space-y-6">
      {/* Portfolio Hero Section */}
      <PortfolioHero
        portfolioStats={portfolioStats}
        portfolioData={portfolioData}
        isSyncing={isSyncing}
        onSync={handleSync}
      />

      {/* Content Tabs */}
      <Tabs defaultValue={WALLET_TABS.TOKENS} className="w-full">
        <TabsList className="mt-2" variant="pill" size="sm">
          <TabsTrigger
            value={WALLET_TABS.TOKENS}
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size="sm"
            variant="pill"
          >
            <StreamlineFreehandCryptoCurrencyUsdCoin className="w-5 h-5" />
            <span className="inline">Tokens</span>
          </TabsTrigger>

          <TabsTrigger
            value={WALLET_TABS.DEFI}
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size="sm"
            variant="pill"
          >
            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchange className="w-5 h-5" />
            <span className="inline">Defi</span>
          </TabsTrigger>

          <TabsTrigger
            value={WALLET_TABS.NFTS}
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size="sm"
            variant="pill"
          >
            <SolarGalleryWideOutline className="w-5 h-5" />
            <span className="inline">NFTs</span>
          </TabsTrigger>

          <TabsTrigger
            value={WALLET_TABS.TRANSACTIONS}
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size="sm"
            variant="pill"
          >
            <MynauiActivitySquare className="w-5.5 h-5.5" />
            <span className="inline">Transactions</span>
          </TabsTrigger>

          <TabsTrigger
            value={WALLET_TABS.WALLETS}
            className="flex px-2 items-center gap-1.5 cursor-pointer"
            size="sm"
            variant="pill"
          >
            <SolarWalletMoneyLinear className="w-5.5 h-5.5" stroke="1.7" />
            <span className="inline">Wallets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={WALLET_TABS.TOKENS} className="mt-6">
          <TabContentRenderer activeTab={WALLET_TABS.TOKENS} aggregatedData={aggregatedData} />
        </TabsContent>

        <TabsContent value={WALLET_TABS.NFTS} className="mt-6">
          <TabContentRenderer activeTab={WALLET_TABS.NFTS} aggregatedData={aggregatedData} />
        </TabsContent>

        <TabsContent value={WALLET_TABS.DEFI} className="mt-6">
          <TabContentRenderer activeTab={WALLET_TABS.DEFI} aggregatedData={aggregatedData} />
        </TabsContent>

        <TabsContent value={WALLET_TABS.TRANSACTIONS} className="mt-6">
          <TabContentRenderer
            activeTab={WALLET_TABS.TRANSACTIONS}
            aggregatedData={aggregatedData}
          />
        </TabsContent>

        <TabsContent value={WALLET_TABS.WALLETS} className="mt-6">
          <TabContentRenderer activeTab={WALLET_TABS.WALLETS} aggregatedData={aggregatedData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
