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
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { useAllAccounts } from '@/lib/queries';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { getAccountCategoryConfig, getCategoryType } from './account-category-icon';
import { AccountRow } from './account-row';
import { AccountsSummary } from './accounts-summary';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';
import { NetWorthChart } from '../networth/networth-chart';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';
import type { AccountCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface AccountGroup {
  key: string;
  category: AccountCategory | string;
  accounts: UnifiedAccount[];
  totalBalance: number;
}

// Memoized Category Accordion Item
const CategoryAccordionItem = memo(function CategoryAccordionItem({
  group,
  accountOrder,
  balanceVisible,
  onAccountClick,
}: {
  group: AccountGroup;
  accountOrder: Record<string, string[]> | null;
  balanceVisible: boolean;
  onAccountClick: (id: string) => void;
}) {
  const config = getAccountCategoryConfig(group.category);

  // Get accounts for this group (use reordered if available)
  const orderedAccounts = useMemo(() => {
    const accountIds = accountOrder?.[group.key] || group.accounts.map((a) => a.id);
    return accountIds
      .map((id) => group.accounts.find((a) => a.id === id))
      .filter((a): a is UnifiedAccount => a !== undefined);
  }, [group, accountOrder]);

  return (
    <AccordionItem value={group.key} className="  rounded-none overflow-hidden  hover:shadow-sm">
      <AccordionTrigger className=" py-1 px-2 hover:bg-muted   rounded-none [&[data-state=open]]:rounded-b-none [&[data-state=open]]:bg-muted">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="h-9 w-9 flex items-center justify-center flex-shrink-0  ">
              {config.icon}
            </div>
            <span className="font-semibold text-sm truncate text-foreground">{config.label}</span>
          </div>
          <div className="flex-shrink-0">
            {balanceVisible ? (
              <CurrencyDisplay amountUSD={group.totalBalance}  className="text-foreground font-bold" />
            ) : (
              <span className="text-muted-foreground font-semibold text-sm">••••••</span>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-0 py-0  ">
        <SortableContext items={orderedAccounts.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-border/50">
            {orderedAccounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                isDraggable={true}
                balanceVisible={balanceVisible}
                onAccountClick={onAccountClick}
              />
            ))}
          </div>
        </SortableContext>
      </AccordionContent>
    </AccordionItem>
  );
});

// Memoized Account Section
const AccountSection = memo(function AccountSection({
  title,
  color,
  groups,
  accountOrder,
  balanceVisible,
  onAccountClick,
  defaultOpenGroups,
}: {
  title: string;
  color: string;
  groups: AccountGroup[];
  accountOrder: Record<string, string[]> | null;
  balanceVisible: boolean;
  onAccountClick: (id: string) => void;
  defaultOpenGroups: string[];
}) {
  if (groups.length === 0) return null;

  // Calculate total for this section
  const sectionTotal = useMemo(
    () => groups.reduce((sum, group) => sum + group.totalBalance, 0),
    [groups]
  );

  return (
    <div className="space-y-4">
      {/* Header with badge and total */}
      <div className="flex items-center justify-between">
        <Badge className={cn("font-bold tracking-widest rounded-xs  " )} variant={title=='ASSETS' ? 'success' : 'destructive'} size='sm' >
          {title}
        </Badge>
        <div className="flex items-center gap-2">
          {balanceVisible ? (
            <CurrencyDisplay amountUSD={sectionTotal} variant="lg" className="font-bold" style={{ color }} />
          ) : (
            <span className="text-sm font-bold" style={{ color }}>••••••</span>
          )}
        </div>
      </div>

      {/* Accordions */}
      <Accordion type="multiple" defaultValue={defaultOpenGroups} className="  border divide-y">
        {groups.map((group) => (
          <CategoryAccordionItem
            key={group.key}
            group={group}
            accountOrder={accountOrder}
            balanceVisible={balanceVisible}
            onAccountClick={onAccountClick}
          />
        ))}
      </Accordion>
    </div>
  );
});

function OverviewTabComponent() {
  const router = useRouter();
  const { data: accountsData } = useAllAccounts();
  const balanceVisible = useAccountsUIStore((state) => state.viewPreferences.balanceVisible);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [accountOrder, setAccountOrder] = useState<Record<string, string[]> | null>(null);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
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
  }, [accountsData?.groups]);

  // Separate assets and liabilities
  const assetGroups = useMemo(
    () => categoriesWithAccounts.filter((c) => getCategoryType(c.category) === 'ASSET'),
    [categoriesWithAccounts]
  );

  const liabilityGroups = useMemo(
    () => categoriesWithAccounts.filter((c) => getCategoryType(c.category) === 'LIABILITY'),
    [categoriesWithAccounts]
  );

  // Default open groups
  const defaultAssetGroups = useMemo(() => assetGroups.map((c) => c.key), [assetGroups]);
  const defaultLiabilityGroups = useMemo(() => liabilityGroups.map((c) => c.key), [liabilityGroups]);

  // Handle account click - navigate to account details
  const handleAccountClick = useCallback((accountId: string) => {
    router.push(`/accounts/${accountId}`);
  }, [router]);

  // Handle drag end for reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
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
      {/* Net Worth Chart */}
      <div className="flex-1">
        <NetWorthChart mode="demo" height={300} className="pl-4 pt-4" />
      </div>

      {/* Two-column layout: Accordions left, Summary right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Accordions Column */}
        <div className="lg:col-span-8 h-fit">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-10">
              <AccountSection
                title="ASSETS"
                color="rgb(120,150,60)"
                groups={assetGroups}
                accountOrder={accountOrder}
                balanceVisible={balanceVisible}
                onAccountClick={handleAccountClick}
                defaultOpenGroups={defaultAssetGroups}
              />

              <AccountSection
                title="LIABILITIES"
                color="#D4745A"
                groups={liabilityGroups}
                accountOrder={accountOrder}
                balanceVisible={balanceVisible}
                onAccountClick={handleAccountClick}
                defaultOpenGroups={defaultLiabilityGroups}
              />
            </div>
          </DndContext>
        </div>

        {/* Right Sidebar Summary */}
        <div className="lg:col-span-4">
          <AccountsSummary summary={summaryData} />
        </div>
      </div>

      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />
    </div>
  );
}

export const OverviewTab = memo(OverviewTabComponent);
