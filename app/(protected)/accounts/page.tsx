'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
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
import type { UnifiedAccount } from '@/lib/types/unified-accounts';

// Components
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { NetWorthChart } from '@/components/networth/networth-chart';
import WalletCard from '@/components/crypto/WalletCard';
import BankCard from '@/components/banking/BankCard';
import {
  DuoIconsCreditCard,
  HeroiconsWallet,
  MdiDollar,
} from '@/components/icons/icons';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';
import { ChartAreaLinear } from '@/components/networth/chart';

/* -------------------------------------------------------------------------- */
/*                         CATEGORY CONFIGURATION                             */
/* -------------------------------------------------------------------------- */
const categoryConfig = {
  CASH: { label: 'Cash', icon: <MdiDollar className="h-5 w-5" />, color: 'bg-blue-500' },
  CREDIT: { label: 'Credit', icon: <DuoIconsCreditCard className="h-5 w-5" />, color: 'bg-orange-500' },
  INVESTMENTS: { label: 'Investments', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-green-500' },
  CRYPTO: { label: 'Crypto', icon: <HeroiconsWallet className="h-5 w-5" />, color: 'bg-violet-500' },
  ASSETS: { label: 'Assets', icon: <Home className="h-5 w-5" />, color: 'bg-purple-500' },
  LIABILITIES: { label: 'Liabilities', icon: <TrendingDown className="h-5 w-5" />, color: 'bg-red-500' },
  OTHER: { label: 'Other Accounts', icon: <Package className="h-5 w-5" />, color: 'bg-gray-400' },
};

/* -------------------------------------------------------------------------- */
/*                     RIGHT SIDEBAR SUMMARY WIDGET                           */
/* -------------------------------------------------------------------------- */
function SummarySidebar({ summary }) {
  if (!summary) return null;

  return (
    <Card className="sticky top-4 shadow-lg border border-border/50 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {[
          { label: 'Net Worth', value: summary.totalNetWorth },
          { label: 'Total Assets', value: summary.totalAssets },
          { label: 'Liabilities', value: summary.totalLiabilities },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <CurrencyDisplay amountUSD={item.value} className="font-semibold" />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Accounts</span>
          <span className="font-medium">{summary.accountCount}</span>
        </div>

        <div className="pt-4 text-xs text-muted-foreground">
          Last updated:{' '}
          {new Date(summary.lastUpdated).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */
export default function AccountsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showNetWorth, setShowNetWorth] = useState(true);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  const { data: accountsData, isLoading, refetch } = useAllAccounts();
  const { isRefetching } = useOrganizationRefetchState();

  // Summary data
  const summaryData = {
    totalNetWorth: 66733.49,
    totalAssets: 74733.49,
    totalLiabilities: 8000,
    accountCount: 8,
    currency: 'USD',
    lastUpdated: '2025-11-17T11:02:16.143Z',
  };

  // Categories with accounts
  const categoriesWithAccounts = useMemo(() => {
    if (!accountsData?.groups) return [];
    return Object.entries(accountsData.groups)
      .filter(([_, group]) => group.accounts.length > 0)
      .map(([key, group]) => ({ key, ...group }));
  }, [accountsData]);

  // Total for progress calculation
  const totalBalance = useMemo(() => categoriesWithAccounts.reduce((sum, g) => sum + g.totalBalance, 0), [categoriesWithAccounts]);

  return (
    <div className="h-full flex flex-col relative">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Header */}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Accounts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBalanceVisible(!balanceVisible)}
              title={balanceVisible ? "Hide balances" : "Show balances"}
            >
              {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>

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
      </div>

      {/* Body Layout */}
      <div className="flex-1 overflow-auto px-6 pb-10">

        {/* Full-width Chart */}
        {showNetWorth && (
          <div className="mb-8">
            <NetWorthChart mode="live"  height={280}  />
          </div>
        )}



        {/* Two-column layout: Accordions left, Summary right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Accordions Column */}
          <div className="lg:col-span-8 space-y-4 gap-4">
            <Accordion type="multiple" defaultValue={categoriesWithAccounts.map(c => c.key)} className='space-y-2'>
              {categoriesWithAccounts.map(group => {
                const config = categoryConfig[group.category] || categoryConfig.OTHER;
                const progress = totalBalance ? (group.totalBalance / totalBalance) * 100 : 0;

                return (
                  <AccordionItem key={group.key} value={group.key} className=" shadow-xs  overflow-hidden  rounded-xl">
                    <AccordionTrigger className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 cursor-pointer ">
                      <div className="flex items-center gap-3">
                    
                        <div className={cn(
                          "flex items-center justify-center h-8 w-8 rounded-lg",
                          "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent text-foreground/80"
                        )}
                      > {config.icon}
                      </div>
                        <div className="flex flex-col">
                          <h2 className="font-semibold text-base">{config.label}</h2> 
                          
                    
                          
                         
                        </div>
                      </div>

                      <div className="ml-auto text-right">
                        {balanceVisible ? (
                          <CurrencyDisplay amountUSD={group.totalBalance} className="font-semibold text-base" />
                        ) : (
                          <span className="text-muted-foreground font-bold">••••••</span>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="p-4 rounded-b-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.accounts.map(account => {
                          const isCrypto = account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';
                          return isCrypto ? (
                            <WalletCard key={account.id} wallet={{
                              id: account.id,
                              name: account.name,
                              address: account.metadata?.address,
                              network: account.metadata?.network,
                              balance: account.balance,
                              totalBalanceUsd: account.balance,
                            }} />
                          ) : (
                            <BankCard key={account.id} account={account} />
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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
