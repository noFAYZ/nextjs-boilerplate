'use client';

import { useMemo, useState } from 'react';
import { useAllAccounts } from '@/lib/queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { getAccountCategoryConfig, getCategoryType } from '@/components/accounts/account-category-icon';
import { CurrencyDisplay } from '../ui/currency-display';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import { CardSkeleton } from '../ui/card-skeleton';
import { SolarLibraryBoldDuotone } from '../icons/icons';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccountCategory } from '@/lib/types';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';

interface AccountGroup {
  key: string;
  category: AccountCategory | string;
  accountCount: number;
  totalBalance: number;
  accounts: UnifiedAccount[];
}

export function AccountsWidget() {
  const { data: accountsData, isLoading } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categoriesWithAccounts = useMemo(() => {
    if (!accountsData?.groups) return [];
    return Object.entries(accountsData.groups)
      .filter(([, group]) => group.accountCount > 0)
      .map(([key, group]) => ({
        key,
        category: key as AccountCategory | string,
        accountCount: group.accountCount || 0,
        totalBalance: group.totalBalance || 0,
        accounts: group.accounts || [],
      })) as AccountGroup[];
  }, [accountsData?.groups]);

  const { assetCategories, liabilityCategories, totalAssets, totalLiabilities } = useMemo(() => {
    const assets = categoriesWithAccounts.filter((g) => getCategoryType(g.category) === 'ASSET');
    const liabilities = categoriesWithAccounts.filter((g) => getCategoryType(g.category) === 'LIABILITY');

    return {
      assetCategories: assets,
      liabilityCategories: liabilities,
      totalAssets: assets.reduce((sum, g) => sum + g.totalBalance, 0),
      totalLiabilities: liabilities.reduce((sum, g) => sum + g.totalBalance, 0),
    };
  }, [categoriesWithAccounts]);

  if (isLoading) {
    return <CardSkeleton className="h-96" />;
  }

  const renderCategoryButton = (group: AccountGroup) => {
    const config = getAccountCategoryConfig(group.category);
    const isExpanded = expandedCategory === group.key;

    return (
      <div key={group.key} className="space-y-1.5">
        {/* Category Header Button */}
        <button
          onClick={() => setExpandedCategory(isExpanded ? null : group.key)}
          className={cn(
            'w-full flex gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left',
            'hover:bg-secondary/60 active:bg-secondary',
            isExpanded && 'bg-secondary/40'
          )}
        >
          {/* Left: Icon + Label */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
              {config.icon}
            </div>
            <div className="text-sm font-medium truncate text-foreground">{config.label}</div>
          </div>

          {/* Right: Count + Amount + Chevron */}
          <div className="flex-shrink-0 flex items-center gap-2.5 ml-auto">
            <Badge variant="subtle" size="sm" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-[9px] font-semibold">
              {group.accountCount}
            </Badge>
            <div className="text-xs font-semibold text-muted-foreground min-w-max">
              <CurrencyDisplay amountUSD={group.totalBalance} variant="small" />
            </div>
            <ChevronDown
              className={cn('h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300', isExpanded && 'rotate-180')}
            />
          </div>
        </button>

        {/* Accounts List with Tree Lines */}
        {isExpanded && group.accounts.length > 0 && (
          <div className="space-y-1 pl-3 relative animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Tree line SVG - Reddit style with rounded corners */}
            <svg
              className="absolute left-0 top-0 w-4 pointer-events-none text-gray-700/30 opacity-100"
              style={{
                height: `${group.accounts.length * 32}px`,
                overflow: 'visible'
              }}
              viewBox={`0 0 8 ${group.accounts.length * 32}`}
              preserveAspectRatio="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Vertical line - only up to last item */}
              <line
                x1="4"
                y1="0"
                x2="4"
                y2={group.accounts.length * 32 - 16}
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Horizontal lines with rounded corners for each account except the last */}
              {group.accounts.map((_, index) => {
                if (index === group.accounts.length - 1) return null;

                const lineY = index * 32 + 16;

                return (
                  <path
                    key={`line-${index}`}
                    d={`M 4 ${lineY} Q 6 ${lineY} 8 ${lineY}`}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                );
              })}
              {/* Last account - curved line from vertical to horizontal */}
              {group.accounts.length > 0 && (
                <path
                  d={`M 4 ${(group.accounts.length - 1) * 32 + 16} Q 6 ${(group.accounts.length - 1) * 32 + 16} 8 ${(group.accounts.length - 1) * 32 + 16}`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              )}
            </svg>

            {/* Accounts Container */}
            <div className="space-y-1">
              {group.accounts.map((account) => (
                <Link key={account.id} href={`/accounts/${account.id}`}>
                  <button className={cn(
                    'w-full flex gap-2.5 px-3 py-2 rounded-md text-left text-xs transition-all duration-150',
                    'hover:bg-secondary/50 active:bg-secondary',
                    'text-foreground hover:text-foreground relative z-10'
                  )}>
                    <div className="w-3 h-3 rounded-full border border-muted-foreground/40 flex-shrink-0 mt-0.5 transition-colors duration-150" />
                    <span className="font-medium truncate flex-1 text-muted-foreground group-hover:text-foreground">
                      {account.name}
                    </span>
                    <div className="text-muted-foreground flex-shrink-0 min-w-max">
                      <CurrencyDisplay amountUSD={account.balance} variant="small" />
                    </div>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="relative w-full flex flex-col border-border h-[450px] overflow-hidden">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2  pb-3  ">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-6 w-6 rounded-lg bg-blue-400/20 flex items-center justify-center flex-shrink-0">
              <SolarLibraryBoldDuotone className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-foreground truncate">Account Categories</h3>
          </div>
          <Link href="/accounts" className="flex-shrink-0">
            <Button variant="link" className="text-xs cursor-pointer transition-colors h-7 px-1.5 hover:text-primary" size="sm">
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden ">
          {categoriesWithAccounts.length === 0 ? (
            <div className="flex items-center justify-center h-full px-4">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-xl bg-muted/40 flex items-center justify-center">
                  <SolarLibraryBoldDuotone className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No accounts yet</p>
                <p className="text-xs text-muted-foreground">Add your first account to get started</p>
                <Link href="/accounts" className="inline-block mt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Add Account
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Assets Section */}
              {assetCategories.length > 0 && (
                <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Assets</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold px-2 py-0.5">+</Badge>
                      <span className="text-xs font-semibold text-foreground min-w-max">
                        <CurrencyDisplay amountUSD={totalAssets || 0} />
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">{assetCategories.map(renderCategoryButton)}</div>
                </div>
              )}

              {/* Divider */}
              {assetCategories.length > 0 && liabilityCategories.length > 0 && (
                <div className="h-px bg-border/40" />
              )}

              {/* Liabilities Section */}
              {liabilityCategories.length > 0 && (
                <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Liabilities</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 text-[9px] font-semibold px-2 py-0.5">−</Badge>
                      <span className="text-xs font-semibold text-foreground min-w-max">
                        <CurrencyDisplay amountUSD={totalLiabilities || 0} />
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">{liabilityCategories.map(renderCategoryButton)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
