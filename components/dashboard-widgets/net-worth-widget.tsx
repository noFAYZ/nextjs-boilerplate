"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Wallet,
  TrendingUp,
  ArrowRight,
  TrendingDown,
  Home,
  Package,
} from "lucide-react";
import { useAllAccounts } from "@/lib/queries";
import { useOrganizationRefetchState } from "@/lib/hooks/use-organization-refetch-state";
import {
  DuoIconsCreditCard,
  HeroiconsWallet,
  HeroiconsWallet16Solid,
  MdiDollar,
  SolarWallet2Outline,
} from "@/components/icons/icons";
import { CurrencyDisplay } from "../ui/currency-display";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { RefetchLoadingOverlay } from "../ui/refetch-loading-overlay";
import { CardSkeleton } from "../ui/card-skeleton";

// Type definitions for accounts API response
interface AccountMetadata {
  assetDescription?: string | null;
  purchaseDate?: string | null;
  plaidAccountId?: string | null;
  plaidMask?: string | null;
  tellerAccountId?: string | null;
  tellerLastFour?: string | null;
  tellerType?: string | null;
  tellerSubtype?: string | null;
  accountSubtype?: string | null;
}

interface AccountItem {
  id: string;
  name: string;
  type: string;
  category: string;
  balance: number;
  currency: string;
  isActive: boolean;
  lastSyncAt?: string | null;
  institutionName?: string | null;
  source: string;
  provider?: string | null;
  providerAccountId?: string | null;
  metadata?: AccountMetadata;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  offset: number;
  limit: number;
  total: number;
  returned: number;
  hasMore: boolean;
}

interface AccountGroup {
  category: string;
  displayName: string;
  icon: string;
  totalBalance: number;
  accountCount: number;
  accounts: AccountItem[];
  pagination?: Pagination;
}

interface AssetBreakdown {
  cash: number;
  investments: number;
  realEstate: number;
  vehicle: number;
  valuables: number;
  crypto: number;
  otherAsset: number;
}

interface LiabilityBreakdown {
  creditCard: number;
  mortgage: number;
  loan: number;
  otherLiability: number;
}

interface SummaryData {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  accountCount: number;
  currency: string;
  lastUpdated: string;
  assetBreakdown: AssetBreakdown;
  liabilityBreakdown: LiabilityBreakdown;
}

interface AccountsResponse {
  summary: SummaryData;
  groups: Record<string, AccountGroup>;
}

/**
 * NetWorthWidget Component
 *
 * Displays financial summary with net worth, asset/liability breakdown, and account hierarchy.
 * Uses pre-calculated values from the API for accuracy and performance.
 *
 * Data Source: useAllAccounts() hook
 * API Response: GET /api/v1/accounts/summary
 * Schema: AccountsResponse with:
 *   - summary: totalNetWorth, totalAssets, totalLiabilities, asset/liability breakdown, lastUpdated
 *   - groups: Accounts grouped by category with pagination support
 *
 * Key Values Used:
 *   - summary.totalNetWorth: Pre-calculated by backend (assets - liabilities)
 *   - summary.assetBreakdown: Breakdown of assets by category
 *   - summary.liabilityBreakdown: Breakdown of liabilities by type
 *   - groups: Account categories for hierarchy and detail display
 */

// Account category configuration - same as /accounts page
const categoryConfig = {
  CASH: {
    label: "Cash",
    icon: <MdiDollar className="h-5 w-5" />,
    color: "bg-blue-500",
  },
  CREDITCARD: {
    label: "Credit",
    icon: <DuoIconsCreditCard className="h-5 w-5" />,
    color: "bg-orange-500",
  },
  INVESTMENTS: {
    label: "Investments",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "bg-green-500",
  },
  CRYPTO: {
    label: "Crypto",
    icon: <HeroiconsWallet className="h-5 w-5" />,
    color: "bg-violet-500",
  },
  ASSETS: {
    label: "Assets",
    icon: <Home className="h-5 w-5" />,
    color: "bg-purple-500",
  },
  LIABILITIES: {
    label: "Liabilities",
    icon: <TrendingDown className="h-5 w-5" />,
    color: "bg-red-500",
  },
  OTHER: {
    label: "Other",
    icon: <Package className="h-5 w-5" />,
    color: "bg-gray-400",
  },
};

// Main 5 categories to show
const MAIN_CATEGORIES = ["CASH", "CREDITCARD", "INVESTMENTS", "CRYPTO", "ASSETS"];
// Categories for "+More"
const MORE_CATEGORIES = ["LIABILITIES", "OTHER"];

export function NetWorthWidget() {
  // Fetch all accounts grouped by category with summary data
  const { data: accountsData, isLoading, refetch } = useAllAccounts();

  // Check if organization data is being refetched
  const { isRefetching } = useOrganizationRefetchState();

  /**
   * Get net worth from API summary (pre-calculated by backend)
   * Summary includes:
   * - totalNetWorth: assets - liabilities
   * - totalAssets, totalLiabilities
   * - assetBreakdown, liabilityBreakdown
   * - lastUpdated timestamp
   */
  const netWorth = useMemo(() => {
    const typedData = accountsData as AccountsResponse | undefined;
    return typedData?.summary?.totalNetWorth ?? 0;
  }, [accountsData?.summary?.totalNetWorth]);

  // Organize accounts by category for accordion display
  const categoriesData = useMemo(() => {
    const typedData = accountsData as AccountsResponse | undefined;

    if (!typedData?.groups) {
      return {};
    }

    const categories: { [key: string]: { accounts: Array<Record<string, unknown>>; total: number } } =
      {};

    // Process all categories from groups
    Object.entries(typedData.groups).forEach(
      ([categoryKey, group]: [string, AccountGroup]) => {
        if (
          group?.accounts &&
          Array.isArray(group.accounts) &&
          group.accounts.length > 0
        ) {
          const categoryTotal = group.totalBalance || 0;

          categories[categoryKey.toUpperCase()] = {
            accounts: group.accounts,
            total: categoryTotal,
          };
        }
      }
    );

    return categories;
  }, [accountsData?.groups]);

  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [showMore, setShowMore] = useState(false);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };
 
  

  /**
   * Get summary data with asset and liability breakdown
   * This provides the same calculation as the sidebar
   */
  const summaryData = useMemo(() => {
    const typedData = accountsData as AccountsResponse | undefined;
    return typedData?.summary || null;
  }, [accountsData?.summary]);

  // Calculate assets and liabilities percentages (same as sidebar)
  const { assetsPercent, liabilitiesPercent } = useMemo(() => {
    if (!summaryData) return { assetsPercent: 0, liabilitiesPercent: 0 };

    const totalAssets = summaryData.totalAssets || 0;
    const totalLiabilities = Math.abs(summaryData.totalLiabilities || 0);
    const total = totalAssets + totalLiabilities;

    const assetsPercent = total > 0 ? Math.round((totalAssets / total) * 100) : 0;
    const liabilitiesPercent = 100 - assetsPercent;

    return { assetsPercent, liabilitiesPercent };
  }, [summaryData]);

  // Check if there are more categories
  const hasMore = useMemo(() => {
    return MORE_CATEGORIES.some((cat) => categoriesData[cat]);
  }, [categoriesData]);

  // Show skeleton when initially loading
  if (isLoading) {
    return <CardSkeleton lines={4} />;
  }
  // Color palette for allocation bar segments
  const colorMap: Record<string, { bar: string; dot: string; rgbBar: string }> = {
    CASH: {
      bar: "bg-green-600/70",
      dot: "bg-green-600",
      rgbBar: "rgb(22, 163, 74)", // green-600
    },
    CREDITCARD: {
      bar: "bg-orange-600/70",
      dot: "bg-orange-600",
      rgbBar: "rgb(234, 88, 12)", // orange-600
    },
    INVESTMENTS: {
      bar: "bg-lime-600/60",
      dot: "bg-lime-600",
      rgbBar: "rgb(101, 163, 13)", // lime-600
    },
    CRYPTO: {
      bar: "bg-violet-600/70",
      dot: "bg-violet-600",
      rgbBar: "rgb(139, 92, 246)", // violet-600
    },
    ASSETS: {
      bar: "bg-purple-600/70",
      dot: "bg-purple-600",
      rgbBar: "rgb(147, 51, 234)", // purple-600
    },
  };

  return (
    <Card className="relative border   shadow-xs gap-4 h-[450px] w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between  ">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-[rgb(251,146,60)] shadow-inner flex items-center justify-center">
            <HeroiconsWallet16Solid className="h-5 w-5 text-[rgb(124,45,18)]" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Accounts</h3>
        </div>
        <Link href="/networth">
          <Button
            variant="link"
            className="text-[11px] cursor-pointer transition-colors h-7"
            size="sm"
          >
            View All
            <ArrowRight className="h-3 w-3 " />
          </Button>
        </Link>
      </div>

     
     



      {/* Category Accordions - Main 5 + More */}
      {MAIN_CATEGORIES.some((cat) => categoriesData[cat]) || hasMore ? (
        <div className=" -mx-2">
          {/* Main 5 Categories */}
          {MAIN_CATEGORIES.map((categoryKey) => {
            if (!categoriesData[categoryKey]) return null;

            const categoryInfo =
              categoryConfig[categoryKey as keyof typeof categoryConfig];
            const accounts = categoriesData[categoryKey].accounts;
            const categoryTotal = categoriesData[categoryKey].total;
            const categoryPercent =
              netWorth > 0
                ? ((categoryTotal / netWorth) * 100).toFixed(1)
                : "0";
            const isExpanded = expandedGroups[categoryKey];

            return (
              <div key={categoryKey}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleGroup(categoryKey)}
                  className={cn(
                    "group relative  w-full flex items-center gap-2.5  p-1 transition-all duration-75 cursor-pointer  ",
                    "hover:bg-muted/80",
                    isExpanded && "bg-muted"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full shadow border border-border/80 flex items-center justify-center flex-shrink-0  bg-muted"
                    )}
                  >
                    {categoryInfo.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-semibold text-sm truncate text-foreground">
                        {categoryInfo.label}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                      <span>
                        {accounts.length}{" "}
                        {accounts.length === 1 ? "account" : "accounts"}
                      </span>
                    </div>
                  </div>

                  {/* Amount and Chevron */}
                  <div className="flex flex-col items-end flex-shrink-0 gap-1">
                    <CurrencyDisplay
                      amountUSD={categoryTotal}
                      variant="small"
                      className="text-foreground"
                    />
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </button>

                {/* Expanded Accounts */}
                {isExpanded && (
                  <div className="space-y-1 mt-1.5 ml-2.5">
                    {accounts.map((account) => {
                      const accountPercent =
                        netWorth > 0
                          ? ((account.balance / netWorth) * 100).toFixed(1)
                          : "0";
                      return (
                        <div
                          key={account.id}
                          className="group relative  flex items-center gap-2 p-1  transition-all hover:bg-muted/40 cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0 text-xs">
                            📊
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {account.name}
                            </p>
                            <p className="text-[9px] text-muted-foreground truncate">
                              {accountPercent}% allocated
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <CurrencyDisplay
                              amountUSD={account.balance}
                              variant="compact"
                              className="text-xs font-semibold text-foreground"
                            />
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* +More Accordion */}
          {hasMore && (
            <div>
              <button
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  "group relative border border-border/80 w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-75 cursor-pointer",
                  "hover:bg-muted/50",
                  showMore && "bg-muted/40"
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-gray-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                  +
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-semibold text-sm text-foreground">
                    More
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {
                      MORE_CATEGORIES.filter((cat) => categoriesData[cat])
                        .length
                    }{" "}
                    additional{" "}
                    {MORE_CATEGORIES.filter((cat) => categoriesData[cat])
                      .length === 1
                      ? "category"
                      : "categories"}
                  </p>
                </div>
                {showMore ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                )}
              </button>

              {/* More Categories */}
              {showMore && (
                <div className="space-y-1.5 mt-1.5 ml-2.5">
                  {MORE_CATEGORIES.map((categoryKey) => {
                    if (!categoriesData[categoryKey]) return null;

                    const categoryInfo =
                      categoryConfig[
                        categoryKey as keyof typeof categoryConfig
                      ];
                    const accounts = categoriesData[categoryKey].accounts;
                    const categoryTotal = categoriesData[categoryKey].total;
                    const categoryPercent =
                      netWorth > 0
                        ? ((categoryTotal / netWorth) * 100).toFixed(1)
                        : "0";
                    const isExpanded = expandedGroups[categoryKey];

                    return (
                      <div key={categoryKey}>
                        <button
                          onClick={() => toggleGroup(categoryKey)}
                          className={cn(
                            "group relative border border-border/60 w-full flex items-center gap-2 p-2.5 rounded-lg transition-all duration-75 cursor-pointer",
                            "hover:bg-muted/40",
                            isExpanded && "bg-muted/30"
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0 text-white text-sm",
                              categoryInfo.color
                            )}
                          >
                            {categoryInfo.icon}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="font-semibold text-xs text-foreground">
                              {categoryInfo.label}
                            </h4>
                            <p className="text-[9px] text-muted-foreground">
                              {accounts.length}{" "}
                              {accounts.length === 1 ? "account" : "accounts"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0 gap-1">
                            <CurrencyDisplay
                              amountUSD={categoryTotal}
                              variant="compact"
                              className="font-semibold text-xs text-foreground"
                            />
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="space-y-1 mt-1 ml-2">
                            {accounts.map((account) => {
                              const accountPercent =
                                netWorth > 0
                                  ? (
                                      (account.balance / netWorth) *
                                      100
                                    ).toFixed(1)
                                  : "0";
                              return (
                                <div
                                  key={account.id}
                                  className="group relative border border-border/40 flex items-center gap-1.5 p-1.5 rounded-md transition-all hover:bg-muted/30 cursor-pointer"
                                >
                                  <div className="h-6 w-6 rounded bg-muted/40 flex items-center justify-center flex-shrink-0 text-xs">
                                    📊
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">
                                      {account.name}
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <CurrencyDisplay
                                      amountUSD={account.balance}
                                      variant="compact"
                                      className="text-xs font-semibold text-foreground"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative p-4 rounded-lg bg-muted/30 border border-border text-center">
          <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs font-medium text-foreground mb-0.5">
            No Accounts Found
          </p>
          <p className="text-[10px] text-muted-foreground">
            Connect your accounts to see net worth breakdown
          </p>
          <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        </div>
      )}
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </Card>
  );
}
