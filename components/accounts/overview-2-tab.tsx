'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { getAccountCategoryConfig } from './account-category-icon';
import { AccountRow } from './account-row';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Badge } from '@/components/ui/badge';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';
import type { AccountCategory } from '@/lib/types';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, TrendingUp, Wallet, PieChart, Dot, ArrowRight } from 'lucide-react';
import { SolarCheckCircleBoldDuotone } from '../icons/icons';

interface AccountGroup {
  key: string;
  category: AccountCategory | string;
  accounts: UnifiedAccount[];
  totalBalance: number;
}

export function Overview2Tab() {
  const router = useRouter();
  const { data: accountsData, isLoading } = useAllAccounts();
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const selectedCategory = useAccountsUIStore((state) => state.ui.selectedCategory);
  const setSelectedCategory = useAccountsUIStore((state) => state.setSelectedCategory);

  // Get categories with accounts
  const categoriesWithAccounts = useMemo(() => {
    if (!accountsData?.groups) return [];
    return Object.entries(accountsData.groups)
      .filter(([, group]) => group.accounts.length > 0)
      .map(([key, group]) => ({ key, ...group })) as (AccountGroup & { key: string })[];
  }, [accountsData]);

  // Set first category as default if none selected
  const activeCategory = selectedCategory || categoriesWithAccounts[0]?.key;

  // Get selected category group
  const selectedGroup = categoriesWithAccounts.find((g) => g.key === activeCategory);
  const selectedAccounts = selectedGroup?.accounts || [];

  // Calculate total balance
  const totalBalance = useMemo(
    () => categoriesWithAccounts.reduce((sum, g) => sum + g.totalBalance, 0),
    [categoriesWithAccounts]
  );

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    if (!selectedGroup) return null;

    const accounts = selectedGroup.accounts;
    if (accounts.length === 0) return null;

    const total = selectedGroup.totalBalance;
    const average = total / accounts.length;
    const highest = Math.max(...accounts.map((a) => a.balance));
    const lowest = Math.min(...accounts.map((a) => a.balance));
    const percentageOfTotal = totalBalance ? (total / totalBalance) * 100 : 0;

    return {
      total,
      average,
      highest,
      lowest,
      percentageOfTotal,
      count: accounts.length,
    };
  }, [selectedGroup, totalBalance]);

  // Handle account click - navigate to account details
  const handleAccountClick = (accountId: string) => {
    router.push(`/accounts/${accountId}`);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading accounts...</div>
      </div>
    );
  }

  if (!categoriesWithAccounts.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">No account groups found</div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-4">
      {/* Sidebar: Category Tabs */}
      <div className="w-[20%] flex flex-col gap-2   h-fit rounded-lg">


        {/* Tab List */}
        <div className=" flex-1 overflow-y-auto rounded-lg ">
          {categoriesWithAccounts.map((group) => {
            const config = getAccountCategoryConfig(group.category);
            const isActive = group.key === activeCategory;
            const progress = totalBalance ? (group.totalBalance / totalBalance) * 100 : 0;

            return (
              <Button
                key={group.key}
                onClick={() => setSelectedCategory(group.key)}
                variant={isActive ? 'outlinebrand' : 'ghost'}
                size='xl'
                className={cn(
                  'w-full flex gap-3 px-3 py-2    rounded-lg transition-all text-left',
                  'hover:bg-muted/50  ',

                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0 flex items-center justify-center h-5 w-5">
                  {config.icon}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate items-center flex gap-1">{config.label}

                      {/* Percentage Badge 
                <Badge
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 text-xs font-semibold px-1 rounded-full"
                >
                  {progress.toFixed(0)}%
                </Badge>*/}
                  </div>
                  
                </div>



              
                <CurrencyDisplay amountUSD={group.totalBalance || 0} />

              {isActive && <ChevronRight className='w-4.5 h-4.5'/>    }
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Account Rows and Right Widget Wrapper */}
      <div className="flex-1 flex gap-4 min-w-0">
        {/* Center: Account Rows */}
        <div className="flex-1 flex flex-col  min-w-0 h-fit bg-card  rounded-2xl border overflow-hidden">
          {/* Header with Selected Category Info 
          {selectedGroup && (
            <div className="flex items-center justify-between p-2 px-4 bg-primary/5 border-b ">
              <div className="flex items-center gap-3">
               
                  {getAccountCategoryConfig(selectedGroup.category).icon}
            
                <div>
                  <h2 className="text-lg font-semibold">
                    {getAccountCategoryConfig(selectedGroup.category).label}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedGroup.accounts.length} {selectedGroup.accounts.length === 1 ? 'account' : 'accounts'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div>
                  {balanceVisible ? (
                    <CurrencyDisplay
                      amountUSD={selectedGroup.totalBalance}
                      variant="lg"
                      className="text-foreground font-semibold"
                    />
                  ) : (
                    <span className="text-muted-foreground font-semibold text-sm">••••••</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Total Balance</p>
              </div>
            </div>
          )}
*/}
          {/* Accounts List */}
          <div className="flex-1 overflow-y-auto  ">
            {selectedAccounts.length > 0 ? (
              <div className="divide-y divide-border/90">
                {selectedAccounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    isDraggable={false}
                    balanceVisible={balanceVisible}
                    onAccountClick={handleAccountClick}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-muted-foreground">No accounts in this category</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary Widget */}
        {selectedGroup && categoryStats && (
          <div className="w-74 flex flex-col gap-3 overflow-y-auto">
            {/* Main Summary Card */}
            <div className="bg-card rounded-lg border border-border/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Summary</h3>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Total Balance */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Category Total</p>
                <p className="text-2xl font-bold">
                  {balanceVisible ? (
                    <CurrencyDisplay amountUSD={categoryStats.total} variant="lg" className="text-foreground" />
                  ) : (
                    <span>••••••</span>
                  )}
                </p>
              </div>

              {/* Percentage Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Portfolio Share</span>
                  <span className="text-xs font-bold text-foreground">{categoryStats.percentageOfTotal.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${categoryStats.percentageOfTotal}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-border/50 pt-4" />

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Account Count */}
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Accounts</p>
                  <p className="text-lg font-bold text-foreground">{categoryStats.count}</p>
                </div>

                {/* Average Balance */}
                <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Avg Balance</p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {balanceVisible ? (
                      categoryStats.average < 1000000 ? (
                        `$${categoryStats.average.toFixed(0)}`
                      ) : (
                        `$${(categoryStats.average / 1000000).toFixed(2)}M`
                      )
                    ) : (
                      '••••'
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4" />

              {/* Highest & Lowest */}
              <div className="space-y-3">
                {/* Highest */}
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Highest
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {balanceVisible ? (
                      categoryStats.highest < 1000000 ? (
                        `$${categoryStats.highest.toFixed(0)}`
                      ) : (
                        `$${(categoryStats.highest / 1000000).toFixed(2)}M`
                      )
                    ) : (
                      '••••'
                    )}
                  </p>
                </div>

                {/* Lowest */}
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Lowest
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {balanceVisible ? (
                      categoryStats.lowest < 1000000 ? (
                        `$${categoryStats.lowest.toFixed(0)}`
                      ) : (
                        `$${(categoryStats.lowest / 1000000).toFixed(2)}M`
                      )
                    ) : (
                      '••••'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
