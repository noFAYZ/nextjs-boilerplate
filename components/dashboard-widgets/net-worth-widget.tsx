'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Wallet, TrendingUp, ArrowRight, TrendingDown, Home, Package } from 'lucide-react';
import { useAllAccounts } from '@/lib/queries';
import { DuoIconsCreditCard, HeroiconsWallet, MdiDollar } from '@/components/icons/icons';
import { CurrencyDisplay } from '../ui/currency-display';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

// Account category configuration - same as /accounts page
const categoryConfig = {
  CASH: { label: 'Cash', icon: <MdiDollar className="h-5 w-5" />, color: 'bg-blue-500' },
  CREDIT: { label: 'Credit', icon: <DuoIconsCreditCard className="h-5 w-5" />, color: 'bg-orange-500' },
  INVESTMENTS: { label: 'Investments', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-green-500' },
  CRYPTO: { label: 'Crypto', icon: <HeroiconsWallet className="h-5 w-5" />, color: 'bg-violet-500' },
  ASSETS: { label: 'Assets', icon: <Home className="h-5 w-5" />, color: 'bg-purple-500' },
  LIABILITIES: { label: 'Liabilities', icon: <TrendingDown className="h-5 w-5" />, color: 'bg-red-500' },
  OTHER: { label: 'Other', icon: <Package className="h-5 w-5" />, color: 'bg-gray-400' },
};

// Main 5 categories to show
const MAIN_CATEGORIES = ['CASH', 'CREDIT', 'INVESTMENTS', 'CRYPTO', 'ASSETS'];
// Categories for "+More"
const MORE_CATEGORIES = ['LIABILITIES', 'OTHER'];

export function NetWorthWidget() {
  // Fetch all accounts grouped by category
  const { data: accountsData, isLoading } = useAllAccounts();

  // Organize accounts by category
  const { netWorth, categoriesData } = useMemo(() => {
    if (!accountsData?.groups) {
      return { netWorth: 0, categoriesData: {} };
    }

    let totalNetWorth = 0;
    const categories: { [key: string]: { accounts: any[]; total: number } } = {};

    // Process all categories
    Object.entries(accountsData.groups).forEach(([categoryKey, group]: [string, any]) => {
      if (group?.accounts && Array.isArray(group.accounts) && group.accounts.length > 0) {
        const categoryTotal = group.totalBalance || 0;
        totalNetWorth += categoryTotal;

        categories[categoryKey.toUpperCase()] = {
          accounts: group.accounts,
          total: categoryTotal,
        };
      }
    });

    return { netWorth: totalNetWorth, categoriesData: categories };
  }, [accountsData]);

  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
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

    return MAIN_CATEGORIES
      .filter((cat) => categoriesData[cat])
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

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-4">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="space-y-2 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className=" border border-border/80 bg-card p-4 shadow-sm   ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
        </div>
        <Link href="/networth">
          <Button variant="outline" className="text-[11px] cursor-pointer hover:bg-muted transition-colors h-7" size="sm">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Main Metric */}
      {netWorth > 0 && (
        <div className="mb-4 border-b border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Total Net Worth</div>
          <div className="flex items-baseline gap-2">
            <CurrencyDisplay
              amountUSD={netWorth}
              variant="large"
              className="text-4xl font-semibold"
            />
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>Diversified</span>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Bar & Legend */}
      {allocationData.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-1 w-full h-3 bg-muted rounded-full overflow-hidden">
            {allocationData.map((item) => (
              <div
                key={item.category}
                className={cn('h-full transition-all', item.color)}
                style={{ width: `${item.percent}%` }}
                title={`${categoryConfig[item.category as keyof typeof categoryConfig].label}: ${item.percent}%`}
              />
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            {allocationData.map((item) => (
              <div key={`legend-${item.category}`} className="flex items-center gap-1.5">
                <div className={cn('w-2 h-2 rounded-full', item.color)} />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {categoryConfig[item.category as keyof typeof categoryConfig].label}
                </span>
                <span className="text-[10px] font-semibold text-foreground">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Accordions - Main 5 + More */}
      {MAIN_CATEGORIES.some((cat) => categoriesData[cat]) || hasMore ? (
        <div className="space-y-1.5">
          {/* Main 5 Categories */}
          {MAIN_CATEGORIES.map((categoryKey) => {
            if (!categoriesData[categoryKey]) return null;

            const categoryInfo = categoryConfig[categoryKey as keyof typeof categoryConfig];
            const accounts = categoriesData[categoryKey].accounts;
            const categoryTotal = categoriesData[categoryKey].total;
            const categoryPercent = netWorth > 0 ? ((categoryTotal / netWorth) * 100).toFixed(1) : '0';
            const isExpanded = expandedGroups[categoryKey];

            return (
              <div key={categoryKey}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleGroup(categoryKey)}
                  className={cn(
                    'group relative border border-border/70 w-full flex items-center gap-2.5 p-2 rounded-xl transition-all duration-75 cursor-pointer bg-muted/50',
                    'hover:bg-muted/50',
                    isExpanded && 'bg-muted/40'
                  )}
                >
                  {/* Icon */}
                  <div className={cn('h-10 w-10 rounded-3xl flex items-center justify-center flex-shrink-0  bg-accent' )}>
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
                      <span>{accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</span>
                 
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
                      const accountPercent = netWorth > 0 ? ((account.balance / netWorth) * 100).toFixed(1) : '0';
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
                  'group relative border border-border/80 w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-75 cursor-pointer',
                  'hover:bg-muted/50',
                  showMore && 'bg-muted/40'
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-gray-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                  +
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-semibold text-sm text-foreground">More</h4>
                  <p className="text-[10px] text-muted-foreground">
                    {MORE_CATEGORIES.filter((cat) => categoriesData[cat]).length} additional {MORE_CATEGORIES.filter((cat) => categoriesData[cat]).length === 1 ? 'category' : 'categories'}
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

                    const categoryInfo = categoryConfig[categoryKey as keyof typeof categoryConfig];
                    const accounts = categoriesData[categoryKey].accounts;
                    const categoryTotal = categoriesData[categoryKey].total;
                    const categoryPercent = netWorth > 0 ? ((categoryTotal / netWorth) * 100).toFixed(1) : '0';
                    const isExpanded = expandedGroups[categoryKey];

                    return (
                      <div key={categoryKey}>
                        <button
                          onClick={() => toggleGroup(categoryKey)}
                          className={cn(
                            'group relative border border-border/60 w-full flex items-center gap-2 p-2.5 rounded-lg transition-all duration-75 cursor-pointer',
                            'hover:bg-muted/40',
                            isExpanded && 'bg-muted/30'
                          )}
                        >
                          <div className={cn('h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0 text-white text-sm', categoryInfo.color)}>
                            {categoryInfo.icon}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="font-semibold text-xs text-foreground">
                              {categoryInfo.label}
                            </h4>
                            <p className="text-[9px] text-muted-foreground">
                              {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
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
                              const accountPercent = netWorth > 0 ? ((account.balance / netWorth) * 100).toFixed(1) : '0';
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
        <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
          <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs font-medium text-foreground mb-0.5">No Accounts Found</p>
          <p className="text-[10px] text-muted-foreground">
            Connect your accounts to see net worth breakdown
          </p>
        </div>
      )}
    </Card>
  );
}
