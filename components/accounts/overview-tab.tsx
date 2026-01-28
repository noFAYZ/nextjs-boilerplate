'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { getAccountCategoryConfig, getCategoryType } from './account-category-icon';
import { AccountRow } from './account-row';
import { AccountsSummary } from './accounts-summary';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';
import { NetWorthCard, AccountsOverviewSection } from '@/app/(protected)/accounts/components';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';
import type { AccountCategory } from '@/lib/types';
import { NetWorthChart } from '../networth/networth-chart';

interface AccountGroup {
  key: string;
  category: AccountCategory | string;
  accounts: UnifiedAccount[];
  totalBalance: number;
}

function OverviewTabComponent() {
  const router = useRouter();
  const { data: accountsData, isLoading } = useAllAccounts();
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const setBalanceVisible = useAccountsUIStore((state) => state.setBalanceVisible);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  // Reordered accounts state
  const [accountOrder, setAccountOrder] = useState<Record<string, string[]> | null>(null);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Summary data from API response
  const summaryData = useMemo(() => {
    return accountsData?.summary || null;
  }, [accountsData?.summary]);

  // Categories with accounts
  const categoriesWithAccounts = useMemo(() => {
    if (!accountsData?.groups) return [];
    return Object.entries(accountsData.groups)
      .filter(([, group]) => group.accounts.length > 0)
      .map(([key, group]) => ({ key, ...group })) as (AccountGroup & { key: string })[];
  }, [accountsData]);

  // Total for progress calculation
  const totalBalance = useMemo(
    () => categoriesWithAccounts.reduce((sum, g) => sum + g.totalBalance, 0),
    [categoriesWithAccounts]
  );

  // Handle account click - navigate to account details
  const handleAccountClick = useCallback((accountId: string) => {
    router.push(`/accounts/${accountId}`);
  }, [router]);

  // Handle drag end for reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find which accordion contains both items
      const sourceGroup = categoriesWithAccounts.find((group) =>
        group.accounts.some((a) => a.id === active.id)
      );

      if (!sourceGroup) return;

      const accountIds = accountOrder?.[sourceGroup.key] || sourceGroup.accounts.map((a) => a.id);
      const oldIndex = accountIds.indexOf(String(active.id));
      const newIndex = accountIds.indexOf(String(over.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(accountIds, oldIndex, newIndex);
        setAccountOrder({
          ...accountOrder,
          [sourceGroup.key]: newOrder,
        });
      }
    }
  }, [categoriesWithAccounts, accountOrder]);

  return (
    <div className="h-full flex flex-col relative space-y-6">
      {/* Body Layout */}
      <div className="flex items-center justify-between">
       <div className="flex-1">
         <NetWorthChart mode="demo" height={300} className="pl-4 pt-4"  />
       </div>
     
     </div>
      {/* Two-column layout: Accordions left, Summary right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Accordions Column */}
        <div className="lg:col-span-8  h-fit rounded-lg">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {/* Assets Section */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold" style={{ color: 'rgb(120,150,60)' }}>ASSETS</span>
              </div>
              <Accordion type="multiple" defaultValue={categoriesWithAccounts.filter(c => getCategoryType(c.category) === 'ASSET').map((c) => c.key)} className="space-y-2">
                {categoriesWithAccounts.filter(c => getCategoryType(c.category) === 'ASSET').map((group) => {
                  const config = getAccountCategoryConfig(group.category);
                  const progress = totalBalance ? (group.totalBalance / totalBalance) * 100 : 0;

                  // Get accounts for this group (use reordered if available)
                  const accountIds = accountOrder?.[group.key] || group.accounts.map((a) => a.id);
                  const orderedAccounts = accountIds
                    .map((id) => group.accounts.find((a) => a.id === id))
                    .filter((a): a is UnifiedAccount => a !== undefined);

                  return (
                    <AccordionItem
                      key={group.key}
                      value={group.key}
                      className="overflow-hidden   border  rounded"
                    >
                      <AccordionTrigger className="group relative  flex items-center gap-3 p-2 transition-all duration-0   [&[data-state=open]]:rounded-b-none cursor-pointer">
                        {/* Icon */}
                        <div className="h-9 w-9 rounded-full    flex items-center justify-center flex-shrink-0">
                          {config.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-semibold text-[15px] text-foreground truncate">{config.label}</h3>
                        </div>

                        {/* Amount and Chevron */}
                        <div className="flex flex-col items-end flex-shrink-0 gap-1">
                          <div className="text-right">
                            {balanceVisible ? (
                              <CurrencyDisplay amountUSD={group.totalBalance} variant="lg" className=" text-foreground font-semibold" />
                            ) : (
                              <span className="text-muted-foreground font-semibold text-sm">••••••</span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="p-0 relative bg-background">
                        <SortableContext items={orderedAccounts.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                          <div className="relative">
                            {orderedAccounts.map((account) => {
                              const isCrypto =
                                account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';

                              return (
                                <AccountRow
                                  key={account.id}
                                  account={account}
                                  isDraggable={true}
                                  balanceVisible={balanceVisible}
                                  onAccountClick={handleAccountClick}
                                />
                              );
                            })}
                          </div>
                        </SortableContext>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* Liabilities Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold" style={{ color: '#D4745A' }}>LIABILITIES</span>
              </div>
              <Accordion type="multiple" defaultValue={categoriesWithAccounts.filter(c => getCategoryType(c.category) === 'LIABILITY').map((c) => c.key)} className="space-y-2">
                {categoriesWithAccounts.filter(c => getCategoryType(c.category) === 'LIABILITY').map((group) => {
                  const config = getAccountCategoryConfig(group.category);
                  const progress = totalBalance ? (group.totalBalance / totalBalance) * 100 : 0;

                  // Get accounts for this group (use reordered if available)
                  const accountIds = accountOrder?.[group.key] || group.accounts.map((a) => a.id);
                  const orderedAccounts = accountIds
                    .map((id) => group.accounts.find((a) => a.id === id))
                    .filter((a): a is UnifiedAccount => a !== undefined);

                  return (
                    <AccordionItem
                      key={group.key}
                      value={group.key}
                      className="overflow-hidden   border  rounded"
                    >
                      <AccordionTrigger className="group relative  flex items-center gap-3 p-2 transition-all duration-0   [&[data-state=open]]:rounded-b-none cursor-pointer">
                        {/* Icon */}
                        <div className="h-9 w-9 rounded-full    flex items-center justify-center flex-shrink-0">
                          {config.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-semibold text-[15px] text-foreground truncate">{config.label}</h3>
                        </div>

                        {/* Amount and Chevron */}
                        <div className="flex flex-col items-end flex-shrink-0 gap-1">
                          <div className="text-right">
                            {balanceVisible ? (
                              <CurrencyDisplay amountUSD={group.totalBalance} variant="lg" className=" text-foreground font-semibold" />
                            ) : (
                              <span className="text-muted-foreground font-semibold text-sm">••••••</span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="p-0 relative bg-background">
                        <SortableContext items={orderedAccounts.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                          <div className="relative">
                            {orderedAccounts.map((account) => {
                              const isCrypto =
                                account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';

                              return (
                                <AccountRow
                                  key={account.id}
                                  account={account}
                                  isDraggable={true}
                                  balanceVisible={balanceVisible}
                                  onAccountClick={handleAccountClick}
                                />
                              );
                            })}
                          </div>
                        </SortableContext>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </DndContext>
        </div>

        {/* Right Sidebar Summary with Enhanced Overview */}
        <div className="lg:col-span-4 space-y-4">
  

          {/* Traditional Summary Cards */}
          <AccountsSummary summary={summaryData} />
        </div>
      </div>

      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />
    </div>
  );
}

export const OverviewTab = memo(OverviewTabComponent);
