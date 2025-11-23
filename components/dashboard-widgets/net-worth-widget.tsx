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

// Account category configuration - same as /accounts page
const categoryConfig = {
  CASH: {
    label: "Cash",
    icon: <MdiDollar className="h-5 w-5" />,
    color: "bg-blue-500",
  },
  CREDIT: {
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
const MAIN_CATEGORIES = ["CASH", "CREDIT", "INVESTMENTS", "CRYPTO", "ASSETS"];
// Categories for "+More"
const MORE_CATEGORIES = ["LIABILITIES", "OTHER"];

export function NetWorthWidget() {
  // Fetch all accounts grouped by category
  const { data: accountsData, isLoading } = useAllAccounts();

  // Check if organization data is being refetched
  const { isRefetching } = useOrganizationRefetchState();

  // Organize accounts by category
  const { netWorth, categoriesData } = useMemo(() => {
    if (!accountsData?.groups) {
      return { netWorth: 0, categoriesData: {} };
    }

    let totalNetWorth = 0;
    const categories: { [key: string]: { accounts: any[]; total: number } } =
      {};

    // Process all categories
    Object.entries(accountsData.groups).forEach(
      ([categoryKey, group]: [string, any]) => {
        if (
          group?.accounts &&
          Array.isArray(group.accounts) &&
          group.accounts.length > 0
        ) {
          const categoryTotal = group.totalBalance || 0;
          totalNetWorth += categoryTotal;

          categories[categoryKey.toUpperCase()] = {
            accounts: group.accounts,
            total: categoryTotal,
          };
        }
      }
    );

    return { netWorth: totalNetWorth, categoriesData: categories };
  }, [accountsData]);

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
 
  

  // Calculate allocation percentages
  const allocationData = useMemo(() => {
    if (netWorth <= 0) return [];

    return MAIN_CATEGORIES.filter((cat) => categoriesData[cat])
      .map((cat) => ({
        category: cat,
        total: categoriesData[cat].total,
        percent: Math.round((categoriesData[cat].total / netWorth) * 100),
        color: categoryConfig[cat as keyof typeof categoryConfig].color,
      }))
      .sort((a, b) => b.total - a.total);
  }, [categoriesData, netWorth]);

  // Check if there are more categories
  const hasMore = useMemo(() => {
    return MORE_CATEGORIES.some((cat) => categoriesData[cat]);
  }, [categoriesData]);

  // Show skeleton when initially loading
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-4">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="space-y-2 pt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-muted/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  // Orange monotone color palette for all allocation types
  const colorMap: Record<string, { bar: string; dot: string; rgbBar: string }> = {
    CASH: {
      bar: "bg-green-600/70",
      dot: "bg-orange-600",
      rgbBar: "rgb(194, 65, 12)", // orange-700
    },
    CREDIT: {
      bar: "bg-orange-600/70",
      dot: "bg-orange-500",
      rgbBar: "rgb(234, 88, 12)", // orange-600
    },
    INVESTMENTS: {
      bar: "bg-lime-600/60",
      dot: "bg-orange-400",
      rgbBar: "rgb(251, 146, 60)", // orange-400
    },
    CRYPTO: {
      bar: "bg-orange-50",
      dot: "bg-orange-300",
      rgbBar: "rgb(253, 186, 116)", // orange-300
    },
    ASSETS: {
      bar: "bg-l-200/85",
      dot: "bg-orange-200",
      rgbBar: "rgb(254, 215, 170)", // orange-200
    },
  };
  
  return (
    <Card className="relative border border-border/50 shadow-xs gap-4 h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between  ">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-[rgb(251,146,60)] shadow-inner flex items-center justify-center">
            <HeroiconsWallet16Solid className="h-5 w-5 text-[rgb(124,45,18)]" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
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

     
     
      <div className="relative">
  {/* Main Card – Pure Apple Glass */}
  <Card className="p-3  bg-gradient-to-br from-accent/50 via-accent/60 to-accent/50 dark:from-accent/80 dark:via-accent/50 dark:to-accent/80 border-dashed border-2 border-accent/80" >
    {/* Subtle inner glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5" />
    </div>

    {/* Content */}
    <div className="relative space-y-6">

      {/* Header – Clean & Hierarchical */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-black/50 dark:text-white/50 tracking-wider uppercase">
            Total Net Worth
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-black dark:text-white tracking-tight">
            {netWorth > 0 ? (
              <CurrencyDisplay
                amountUSD={netWorth}
                variant="large"
                className="text-4xl font-semibold"
              />
            ) : (
              "—"
            )}
          </h2>
        </div>

        {/* Subtle positive trend */}
        {netWorth > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5 5 5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5" />
            </svg>
            <span className="text-sm font-medium">+12.4%</span>
          </div>
        )}
      </div>

 {/* Allocation Section with SVG Patterns */}
{allocationData.length > 0 && (
  <div className="space-y-3">
    {/* Allocation bar with SVG pattern overlays */}
    <div className="relative w-full h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
      {/* Glossy overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

      {/* SVG Patterns Definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          {/* CASH: Diagonal lines pattern */}
          <pattern id="pattern-CASH" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
          </pattern>

          {/* CREDIT: Dots pattern */}
          <pattern id="pattern-CREDIT" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
          </pattern>

          {/* INVESTMENTS: Horizontal lines pattern */}
          <pattern id="pattern-INVESTMENTS" width="8" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="2" x2="8" y2="2" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
          </pattern>

          {/* CRYPTO: Checkerboard pattern */}
          <pattern id="pattern-CRYPTO" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="3" height="3" fill="white" fillOpacity="0.12" />
            <rect x="3" y="3" width="3" height="3" fill="white" fillOpacity="0.12" />
          </pattern>

          {/* ASSETS: Cross-hatch pattern */}
          <pattern id="pattern-ASSETS" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="0.8" strokeOpacity="0.1" />
          </pattern>
        </defs>
      </svg>

      {/* Allocation bars with patterns */}
      {allocationData.map((item) => {
        const cfg = colorMap[item.category];
        if (!cfg) return null;

        return (
          <div
            key={item.category}
            style={{ width: `${item.percent}%` }}
            className="h-full relative inline-block transition-all duration-500 ease-out group"
          >
            {/* Base color */}
            <div className={cn("h-full w-full", cfg.bar)} />

            {/* Pattern overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <rect width="100" height="100" fill={`url(#pattern-${item.category})`} />
            </svg>

            {/* Hover highlight */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>

    {/* Legend */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {allocationData.map((item) => {
        const cfg = colorMap[item.category];
        if (!cfg) return null;

        return (
          <div key={item.category} className="flex items-center gap-2">
            {/* Color dot */}
            <div className={cn("w-3 h-3 rounded-full shadow-sm", cfg.dot)} />

            {/* Text */}
            <div className="flex items-baseline gap-1">
              <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
                {categoryConfig[item.category]?.label || item.category}
              </span>
              <span className="text-[12px] font-semibold text-black dark:text-white">
                {item.percent}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


  
    </div>
  </Card>

  {/* Optional ultra-subtle outer glow (visible only on dark mode) */}
  <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 blur-xl -z-10" />
</div>


      {/* Category Accordions - Main 5 + More */}
      {MAIN_CATEGORIES.some((cat) => categoriesData[cat]) || hasMore ? (
        <div className="space-y-1.5">
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
                    "group relative border border-border/70 w-full flex items-center gap-2.5 p-2 rounded-lg transition-all duration-75 cursor-pointer bg-muted/50",
                    "hover:bg-muted/50",
                    isExpanded && "bg-muted/40"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "h-10 w-10 rounded-3xl flex items-center justify-center flex-shrink-0  bg-accent"
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
                      variant="compact"
                      className="font-semibold text-sm text-foreground"
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
                          className="group relative border border-border/60 flex items-center gap-2 p-2 rounded-lg transition-all hover:bg-muted/40 cursor-pointer"
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
