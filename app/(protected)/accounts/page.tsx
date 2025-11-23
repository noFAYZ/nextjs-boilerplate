'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  Home,
  Package,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

// Unified accounts API
import { useAllAccounts } from '@/lib/queries';

// Components
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { NetWorthChart } from '@/components/networth/networth-chart';
import {
  DuoIconsCreditCard,
  HeroiconsWallet,
  MdiDollar,
  MdiDragVertical,
} from '@/components/icons/icons';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';

/* -------------------------------------------------------------------------- */
/*                         CATEGORY CONFIGURATION                             */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                      DRAGGABLE ACCOUNT ITEM                                */
/* -------------------------------------------------------------------------- */
interface DraggableAccountItemProps {
  account: {
    id: string;
    name: string;
    balance: number;
    status?: string;
    category?: string;
    type?: string;
    source?: string;
    metadata?: Record<string, string>;
    institution?: string;
    accountNumber?: string;
  };
  isCrypto: boolean;
  balanceVisible: boolean;
  onAccountClick: (accountId: string) => void;
}

function DraggableAccountItem({
  account,
  isCrypto,
  balanceVisible,
  onAccountClick,
}: DraggableAccountItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: account.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onAccountClick(account.id)}
      className={cn(
        "group relative flex items-center gap-2.5 p-3 transition-all border-b border-border/30 last:border-b-0 hover:bg-muted/20 cursor-pointer",
        isSortableDragging && "bg-primary/10"
      )}
    >
      {/* Drag Handle Icon */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center flex-shrink-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <MdiDragVertical className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Icon */}
      <div className="h-10 w-10 rounded-full bg-muted flex items-center border justify-center flex-shrink-0">
        {isCrypto ? (
          <HeroiconsWallet className="h-6 w-6" />
        ) : (
          <MdiDollar className="h-6 w-6" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-md font-medium text-foreground truncate transition-colors group-hover:text-primary">
          {account.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[11px] text-muted-foreground truncate">
            {isCrypto ? `${account.metadata?.network || 'Crypto'} Wallet` : account.institution || 'Bank Account'}
          </p>
          {account.accountNumber && (
            <>
              <span className="text-muted-foreground">•</span>
              <p className="text-[10px] text-muted-foreground">••{account.accountNumber?.slice(-4)}</p>
            </>
          )}
        </div>
      </div>

      {/* Amount & Status */}
      <div className="flex flex-col items-end flex-shrink-0 gap-1">
        <div className="text-right">
          {balanceVisible ? (
            <CurrencyDisplay amountUSD={account.balance} className="text-sm font-medium text-foreground/90" />
          ) : (
            <span className="text-muted-foreground font-bold text-xs">••••••</span>
          )}
        </div>
        {account.status && (
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] font-medium flex-shrink-0",
              account.status === 'ACTIVE'
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                : "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30"
            )}
          >
            {account.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </Badge>
        )}
      </div>

      {/* Hover Indicator */}
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}

const categoryConfig = {
  CASH: { label: 'Cash', icon: <MdiDollar className="h-6 w-6" /> },
  CREDIT: { label: 'Credit Cards', icon: <DuoIconsCreditCard className="h-6 w-6" /> },
  INVESTMENTS: { label: 'Investments', icon: <TrendingUp className="h-6 w-6" /> },
  CRYPTO: { label: 'Crypto', icon: <HeroiconsWallet className="h-6 w-6" /> },
  ASSETS: { label: 'Assets', icon: <Home className="h-6 w-6" /> },
  LIABILITIES: { label: 'Liabilities', icon: <TrendingDown className="h-6 w-6" /> },
  OTHER: { label: 'Other Accounts', icon: <Package className="h-6 w-6" /> },
};

/* -------------------------------------------------------------------------- */
/*                     RIGHT SIDEBAR SUMMARY WIDGET                           */
/* -------------------------------------------------------------------------- */
function SummarySidebar({ summary }) {
  if (!summary) return null;

  const netWorthStatus = summary.totalAssets > summary.totalLiabilities ? 'positive' : 'negative';
  const assetsPercent = summary.totalAssets > 0
    ? Math.round((summary.totalAssets / (summary.totalAssets + Math.abs(summary.totalLiabilities))) * 100)
    : 0;
  const liabilitiesPercent = 100 - assetsPercent;

  return (
    <div className="sticky top-4">
      <Card className="relative" variant='outlined'>
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
          </div>
          <Link href="/accounts">
            <Button variant="outline" className="text-[11px] cursor-pointer hover:bg-muted transition-colors h-7" size="sm">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Main Metric */}
        <div className="mb-4 pb-4 border-b border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Total Net Worth</div>
          <div className="flex items-baseline gap-2">
            <CurrencyDisplay
              amountUSD={summary.totalNetWorth}
              variant="large"
              className="text-4xl font-semibold"
            />
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              netWorthStatus === 'positive'
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}>
              {netWorthStatus === 'positive' ? (
                <>
                  <TrendingUp className="h-3 w-3" />
                  <span>Positive</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3" />
                  <span>Negative</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Allocation Bar */}
        {(summary.totalAssets > 0 || summary.totalLiabilities > 0) && (
          <div className="mb-4 pb-4 border-b border-border/50 space-y-2.5">
            <div className="flex items-center gap-1 w-full h-3 bg-muted rounded-full overflow-hidden border border-border/40">
              {assetsPercent > 0 && (
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                  style={{ width: `${assetsPercent}%` }}
                  title={`Assets: ${assetsPercent}%`}
                />
              )}
              {liabilitiesPercent > 0 && (
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                  style={{ width: `${liabilitiesPercent}%` }}
                  title={`Liabilities: ${liabilitiesPercent}%`}
                />
              )}
            </div>
            <div className="flex gap-4 flex-wrap">
              {assetsPercent > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-emerald-500/30" />
                  <span className="text-[10px] font-medium text-muted-foreground">Assets</span>
                  <span className="text-[10px] font-semibold text-foreground">{assetsPercent}%</span>
                </div>
              )}
              {liabilitiesPercent > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-1 ring-red-500/30" />
                  <span className="text-[10px] font-medium text-muted-foreground">Liabilities</span>
                  <span className="text-[10px] font-semibold text-foreground">{liabilitiesPercent}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="space-y-1.5">
          {/* Total Assets */}
          <div className="group relative border border-border/80 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Assets</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.totalAssets > 0 ? `${Math.round((summary.totalAssets / (summary.totalAssets + Math.abs(summary.totalLiabilities))) * 100)}% of portfolio` : 'No assets'}
              </p>
            </div>
            <CurrencyDisplay
              amountUSD={summary.totalAssets}
              variant="compact"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0"
            />
          </div>

          {/* Total Liabilities */}
          <div className="group relative border border-border/80 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default">
            <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/15 transition-colors">
              <TrendingDown className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Liabilities</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.totalLiabilities > 0 ? `${Math.round((Math.abs(summary.totalLiabilities) / (summary.totalAssets + Math.abs(summary.totalLiabilities))) * 100)}% of portfolio` : 'No liabilities'}
              </p>
            </div>
            <CurrencyDisplay
              amountUSD={summary.totalLiabilities}
              variant="compact"
              className="text-xs font-bold text-red-600 dark:text-red-400 flex-shrink-0"
            />
          </div>

          {/* Account Count */}
          <div className="group relative border border-border/80 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/15 transition-colors">
              <Wallet className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Accounts</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.accountCount} {summary.accountCount === 1 ? 'account' : 'accounts'} connected
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">{summary.accountCount}</span>
          </div>

          {/* Last Updated */}
          <div className="group relative border border-border/80 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default">
            <div className="h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0 group-hover:bg-muted/60 transition-colors">
              <RefreshCw className="h-4.5 w-4.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Last Updated</p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(summary.lastUpdated).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */
export default function AccountsPage() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const showNetWorth = true;

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

  const { data: accountsData, isLoading, refetch } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  // Calculate summary data from actual accounts
  const summaryData = useMemo(() => {
    if (!accountsData?.groups) {
      return {
        totalNetWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        accountCount: 0,
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
      };
    }

    let totalAssets = 0;
    let totalLiabilities = 0;
    let accountCount = 0;

    // Sum all accounts by category
    Object.entries(accountsData.groups).forEach(([, group]) => {
      group.accounts.forEach(account => {
        accountCount++;
        const balance = account.balance || 0;
        if (account.category === 'LIABILITIES') {
          totalLiabilities += Math.abs(balance);
        } else {
          totalAssets += balance;
        }
      });
    });

    return {
      totalNetWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities,
      accountCount,
      currency: 'USD',
      lastUpdated: new Date().toISOString(),
    };
  }, [accountsData]);

  // Categories with accounts
  const categoriesWithAccounts = useMemo(() => {
    if (!accountsData?.groups) return [];
    return Object.entries(accountsData.groups)
      .filter(([, group]) => group.accounts.length > 0)
      .map(([key, group]) => ({ key, ...group }));
  }, [accountsData]);

  // Total for progress calculation
  const totalBalance = useMemo(() => categoriesWithAccounts.reduce((sum, g) => sum + g.totalBalance, 0), [categoriesWithAccounts]);

  // Handle account click - navigate to account details
  const handleAccountClick = (accountId: string) => {
    router.push(`/accounts/bank/${accountId}`);
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find which accordion contains both items
      const sourceGroup = categoriesWithAccounts.find(group =>
        group.accounts.some(a => a.id === active.id)
      );

      if (!sourceGroup) return;

      const accountIds = accountOrder?.[sourceGroup.key] || sourceGroup.accounts.map(a => a.id);
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
  };

  return (
    <div className="h-full flex flex-col relative space-y-6">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
   
        <div className="flex items-center justify-end ">
        <div className="flex items-center gap-2">
      

      <Button variant="outline" size="xs" onClick={refetch} disabled={isLoading}>
        <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
        Refresh
      </Button>

      <Button size="xs" onClick={() => setIsAddAccountDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        Add Account
      </Button>
    </div>
         
        </div>
 

      {/* Body Layout */}
      <div className="flex-1 overflow-auto  ">

        {/* Full-width Chart */}
        {showNetWorth && (
          <div className="mb-8">
            <NetWorthChart mode="demo"   height={250}  />
          </div>
        )}



        {/* Two-column layout: Accordions left, Summary right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Accordions Column */}
          <div className="lg:col-span-8">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Accordion type="multiple" defaultValue={categoriesWithAccounts.map(c => c.key)} className='space-y-2'>
                {categoriesWithAccounts.map(group => {
                  const config = categoryConfig[group.category] || categoryConfig.OTHER;
                  const progress = totalBalance ? (group.totalBalance / totalBalance) * 100 : 0;

                  // Get accounts for this group (use reordered if available)
                  const accountIds = accountOrder?.[group.key] || group.accounts.map(a => a.id);
                  const orderedAccounts = accountIds
                    .map(id => group.accounts.find(a => a.id === id))
                    .filter((a): a is DraggableAccountItemProps['account'] => a !== undefined);

                  return (
                    <AccordionItem
                      key={group.key}
                      value={group.key}
                      className="overflow-hidden border border-border/50   "
                    >
                      <AccordionTrigger className="group relative flex items-center gap-3 p-2 bg-card transition-all duration-0 [&[data-state=open]]:bg-card rounded-lg cursor-pointer ">
                        {/* Icon */}
                        <div className="h-11 w-11 rounded-full border shadow-sm group-hover:shadow-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {config.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-base text-foreground truncate">
                              {config.label}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <span>{group.accounts.length} {group.accounts.length === 1 ? 'account' : 'accounts'}</span>
                            <span>•</span>
                            <span>{Math.round(progress)}% of total</span>
                          </div>
                        </div>

                        {/* Amount and Chevron */}
                        <div className="flex flex-col items-end flex-shrink-0 gap-1">
                          <div className="text-right">
                            {balanceVisible ? (
                              <CurrencyDisplay amountUSD={group.totalBalance} className="font-medium text-lg text-foreground" />
                            ) : (
                              <span className="text-muted-foreground font-bold text-sm">••••••</span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="bg-card p-0">
                        <SortableContext items={orderedAccounts.map(a => a.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-0">
                            {orderedAccounts.map((account) => {
                              const isCrypto = account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';

                              return (
                                <DraggableAccountItem
                                  key={account.id}
                                  account={account}
                                  isCrypto={isCrypto}
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
            </DndContext>
          </div>

          {/* Right Sidebar Summary */}
          <div className="lg:col-span-4">
            <SummarySidebar summary={summaryData} />
          </div>
        </div>
      </div>

      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />
    </div>
  );
}
