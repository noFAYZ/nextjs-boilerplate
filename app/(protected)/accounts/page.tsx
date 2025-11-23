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
  StreamlineFreehandMoneyCashBill,
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
  CASH: { label: 'Cash', icon: <StreamlineFreehandMoneyCashBill className="h-6 w-6" /> },
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
      <Card className="relative border border-border/50 shadow-xs gap-4 h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-xl bg-[rgb(251,146,60)] shadow-inner flex items-center justify-center">
              <Wallet className="h-5 w-5 text-[rgb(124,45,18)]" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
          </div>
          <Link href="/networth">
            <Button variant="link" className="text-[11px] cursor-pointer transition-colors h-7" size="sm">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Glassmorphic Main Card */}
        <div className="relative">
          <Card className="p-3 bg-gradient-to-br from-accent/50 via-accent/60 to-accent/50 dark:from-accent/80 dark:via-accent/50 dark:to-accent/80 border-dashed border-2 border-accent/80">
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
                    {summary.totalNetWorth > 0 ? (
                      <CurrencyDisplay
                        amountUSD={summary.totalNetWorth}
                        variant="large"
                        className="text-4xl font-semibold"
                      />
                    ) : (
                      "—"
                    )}
                  </h2>
                </div>

                {/* Subtle positive trend */}
                {summary.totalNetWorth > 0 && (
                  <div className={cn(
                    "flex items-center gap-2",
                    netWorthStatus === 'positive' 
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  )}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {netWorthStatus === 'positive' ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5 5 5" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 13l5 5 5-5" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l5 5 5-5" />
                        </>
                      )}
                    </svg>
                    <span className="text-sm font-medium">{netWorthStatus === 'positive' ? 'Positive' : 'Negative'}</span>
                  </div>
                )}
              </div>

              {/* Allocation Section with SVG Patterns */}
              {(summary.totalAssets > 0 || summary.totalLiabilities > 0) && (
                <div className="space-y-3">
                  {/* Allocation bar with SVG pattern overlays */}
                  <div className="relative w-full h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

                    {/* SVG Patterns Definition */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                      <defs>
                        {/* Assets: Diagonal lines pattern */}
                        <pattern id="pattern-ASSETS" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                          <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
                        </pattern>

                        {/* Liabilities: Dots pattern */}
                        <pattern id="pattern-LIABILITIES" width="6" height="6" patternUnits="userSpaceOnUse">
                          <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
                        </pattern>
                      </defs>
                    </svg>

                    {/* Allocation bars with patterns */}
                    {assetsPercent > 0 && (
                      <div
                        style={{ width: `${assetsPercent}%` }}
                        className="h-full relative inline-block transition-all duration-500 ease-out group"
                      >
                        {/* Base color */}
                        <div className="h-full w-full bg-green-600/70" />

                        {/* Pattern overlay */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 100"
                        >
                          <rect width="100" height="100" fill="url(#pattern-ASSETS)" />
                        </svg>

                        {/* Hover highlight */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </div>
                    )}
                    {liabilitiesPercent > 0 && (
                      <div
                        style={{ width: `${liabilitiesPercent}%` }}
                        className="h-full relative inline-block transition-all duration-500 ease-out group"
                      >
                        {/* Base color */}
                        <div className="h-full w-full bg-orange-600/70" />

                        {/* Pattern overlay */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          preserveAspectRatio="none"
                          viewBox="0 0 100 100"
                        >
                          <rect width="100" height="100" fill="url(#pattern-LIABILITIES)" />
                        </svg>

                        {/* Hover highlight */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {assetsPercent > 0 && (
                      <div className="flex items-center gap-2">
                        {/* Color dot */}
                        <div className="w-3 h-3 rounded-full shadow-sm bg-emerald-600" />

                        {/* Text */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
                            Assets
                          </span>
                          <span className="text-[12px] font-semibold text-black dark:text-white">
                            {assetsPercent}%
                          </span>
                        </div>
                      </div>
                    )}
                    {liabilitiesPercent > 0 && (
                      <div className="flex items-center gap-2">
                        {/* Color dot */}
                        <div className="w-3 h-3 rounded-full shadow-sm bg-orange-600" />

                        {/* Text */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
                            Liabilities
                          </span>
                          <span className="text-[12px] font-semibold text-black dark:text-white">
                            {liabilitiesPercent}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Optional ultra-subtle outer glow */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/5 blur-xl -z-10" />
        </div>

        {/* Stats Grid - Simplified */}
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
