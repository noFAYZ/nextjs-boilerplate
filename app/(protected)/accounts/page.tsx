'use client';

import React, { useState, useMemo } from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
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
  Dot,
  PenIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

// Unified accounts API
import { useAllAccounts } from '@/lib/queries';

// Components
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { NetWorthChart } from '@/components/networth/networth-chart';
import {
  DuoIconsCreditCard,
  FluentPlugConnectedCheckmark20Filled,
  FluentPlugDisconnected20Filled,
  HeroiconsWallet,
  HeroiconsWallet16Solid,
  MdiDollar,
  MdiDragVertical,
  MdiPen,
  SolarPenNewSquareBoldDuotone,
  StreamlineFreehandMoneyCashBill,
  StreamlineUltimatePaperWrite,
} from '@/components/icons/icons';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';
import { getAccountTypeDisplayName } from '@/lib/types/unified-accounts';
import { AccountType } from '@/lib/types';

/* -------------------------------------------------------------------------- */
/*                        TYPE DEFINITIONS                                    */
/* -------------------------------------------------------------------------- */
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
    category: string; // e.g., "CASH"
    type: string; // e.g., "CHECKING"
    source: string; // e.g., "financial"
  
    currency: string; // e.g., "USD"
    provider: string; // e.g., "PLAID"
    providerAccountId: string; // e.g., plaid account ID
  
    institutionName: string | null; // nullable
    isActive: boolean;
  
    createdAt: string; // ISO date
    lastSyncAt: string; // ISO date
  
    metadata: {
      assetDescription: string | null;
      purchaseDate: string | null;
      plaidAccountId?: string | null;
      plaidMask?: string | null;
      tellerAccountId?: string | null;
      [key: string]: unknown;
    };
  
    // Optional — only if present from other data sources
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
      <div className=" relative h-10 w-10 rounded-full bg-muted flex items-center border justify-center flex-shrink-0">
        {isCrypto ? (
          <HeroiconsWallet className="h-6 w-6" />
        ) : (
          <MdiDollar className="h-6 w-6" />
        )}

<div className='absolute -bottom-2 bg-muted  rounded-full -right-1 flex p-0.5 items-center ring-1 ring-background'>
          {account.source && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild >
                  {account.source === 'manual' ? (
                    <div className='cursor-help'>
                      <MdiPen className='text-yellow-700 w-4 h-4' />
                    </div>
                  ) : (
                    <div className='cursor-help'>
                      {account.isActive ? (
                        <FluentPlugConnectedCheckmark20Filled className='text-lime-700 w-4.5 h-4.5' />
                      ) : (
                        <FluentPlugDisconnected20Filled className='text-amber-700 w-4.5 h-4.5' />
                      )}
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {account.source === 'manual' ? (
                    'Manual Account'
                  ) : account.isActive ? (
                    'Connected (Active)'
                  ) : (
                    'Connected (Inactive)'
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-md font-medium text-foreground truncate transition-colors group-hover:text-primary flex items-center gap-2">
          {account.name} 
       
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[11px] text-muted-foreground truncate">
            {isCrypto ? 
            `${account.metadata?.network || 'Crypto'} ${getAccountTypeDisplayName(account.metadata.walletType as AccountType )}` 
            : 
            account.institution || getAccountTypeDisplayName(account.type as AccountType ) || 'Bank Account'}
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
            <CurrencyDisplay amountUSD={account.balance} variant='small' className="text-foreground/90" />
          ) : (
            <span className="text-muted-foreground font-bold text-xs">••••••</span>
          )}
        </div>

      
         
      </div>

      {/* Hover Indicator */}
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}

const categoryConfig = {
  // Assets
  CASH: { label: 'Cash & Equivalents', icon: <StreamlineFreehandMoneyCashBill className="h-6 w-6" /> },
  INVESTMENTS: { label: 'Investments', icon: <TrendingUp className="h-6 w-6" /> },
  REAL_ESTATE: { label: 'Real Estate', icon: <Home className="h-6 w-6" /> },
  VEHICLE: { label: 'Vehicles', icon: <Wallet className="h-6 w-6" /> },
  VALUABLES: { label: 'Valuables', icon: <Package className="h-6 w-6" /> },
  CRYPTO: { label: 'Cryptocurrency', icon: <HeroiconsWallet className="h-6 w-6" /> },
  OTHER_ASSET: { label: 'Other Assets', icon: <Package className="h-6 w-6" /> },

  // Liabilities
  CREDIT_CARD: { label: 'Credit Cards', icon: <DuoIconsCreditCard className="h-6 w-6" /> },
  MORTGAGE: { label: 'Mortgages', icon: <Home className="h-6 w-6" /> },
  LOAN: { label: 'Loans', icon: <TrendingDown className="h-6 w-6" /> },
  OTHER_LIABILITY: { label: 'Other Liabilities', icon: <Package className="h-6 w-6" /> },

  // Legacy/Fallback
  CREDIT: { label: 'Credit Cards', icon: <DuoIconsCreditCard className="h-6 w-6" /> },
  ASSETS: { label: 'Assets', icon: <Home className="h-6 w-6" /> },
  LIABILITIES: { label: 'Liabilities', icon: <TrendingDown className="h-6 w-6" /> },
  OTHER: { label: 'Other Accounts', icon: <Package className="h-6 w-6" /> },
};

/* -------------------------------------------------------------------------- */
/*                     RIGHT SIDEBAR SUMMARY WIDGET                           */
/* -------------------------------------------------------------------------- */
interface SummarySidebarProps {
  summary?: SummaryData | null;
}

function SummarySidebar({ summary }: SummarySidebarProps) {
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
                        variant="2xl"   />
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
          <div className="group relative border border-border/80 flex bg-sidebar items-center gap-3  rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default pr-4">
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
              variant="small"
              className=" text-lime-700 dark:text-lime-400 flex-shrink-0"
            />
          </div>

          {/* Total Liabilities */}
          <div className="group relative border border-border/80 flex items-center gap-3   rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default pr-4">
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
              variant="small"
              className=" text-rose-700 dark:text-red-400 flex-shrink-0"
            />
          </div>

          {/* Account Count */}
          <div className="group relative border border-border/80 flex items-center gap-3   rounded-xl transition-all hover:bg-muted/50 hover:border-border/60 cursor-default pr-4">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/15 transition-colors">
              <HeroiconsWallet16Solid className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Total Accounts</p>
              <p className="text-[10px] text-muted-foreground">
                {summary.accountCount} {summary.accountCount === 1 ? 'account' : 'accounts'} connected
              </p>
            </div>
            <span className="text-sm  font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">{summary.accountCount}</span>
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
  usePostHogPageView('accounts');
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

  /**
   * Use summary data from API response
   * The backend pre-calculates:
   * - totalNetWorth: assets - liabilities
   * - totalAssets: sum of all assets
   * - totalLiabilities: sum of all liabilities
   * - assetBreakdown: breakdown by category (cash, investments, etc.)
   * - liabilityBreakdown: breakdown by type (creditCard, mortgage, loan, etc.)
   * - lastUpdated: timestamp of last calculation
   */
  const summaryData = useMemo(() => {
    return accountsData?.summary || null;
  }, [accountsData?.summary]);

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
    router.push(`/accounts/${accountId}`);
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

      {/* Header
   
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
  */}

      {/* Body Layout */}
      <div className="">

    



        {/* Two-column layout: Accordions left, Summary right */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">

          {/* Accordions Column */}
          <div className="lg:col-span-6">
         {/* Full-width Chart*/}
        {showNetWorth && (
          <div className="mb-4">
            <NetWorthChart mode="demo"   height={300}  />
          </div>
        )} 

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
                      className="overflow-hidden rounded-xl "
                    >
                      <AccordionTrigger className="group relative flex items-center gap-3 p-2 bg-card transition-all duration-0 [&[data-state=open]]:bg-card rounded-b-none cursor-pointer hover:bg-muted/50">
                        {/* Icon */}
                        <div className="h-11 w-11 rounded-full border shadow-sm group-hover:shadow-lg bg-muted flex items-center justify-center flex-shrink-0">
                          {config.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center">
                            <h3 className="font-medium text-[15px] text-foreground truncate">
                              {config.label}
                            </h3>
                          </div>
                        {/*   <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <span>{group.accounts.length} {group.accounts.length === 1 ? 'account' : 'accounts'}</span>
                            <span>•</span>
                            <span>{Math.round(progress)}% of total</span>
                          </div> */}
                        </div>

                        {/* Amount and Chevron */}
                        <div className="flex flex-col items-end flex-shrink-0 gap-1">
                          <div className="text-right">
                            {balanceVisible ? (
                              <CurrencyDisplay amountUSD={group.totalBalance}
                              variant='lg' className=" text-foreground" />
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
          <div className="lg:col-span-2">
      
            <SummarySidebar summary={summaryData} />
          </div>
        </div>
      </div>

      <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />
    </div>
  );
}
