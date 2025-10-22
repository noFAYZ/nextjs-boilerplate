'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  RefreshCw,
  Wallet,
  ExternalLink,
  Trash2,
  Edit3,
  Coins,
  TrendingUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ✅ Use consolidated data hooks
import {
  useCryptoWallets,
  useCryptoPortfolio,
  useBankingGroupedAccounts,
} from '@/lib/queries';

// ✅ Use UI-only stores
import { useCryptoUIStore } from '@/lib/stores/ui-stores';
import { useBankingUIStore } from '@/lib/stores/ui-stores';
import {
  FluentBuildingBank28Regular,
  MynauiGridOne,
  StreamlineFlexWallet,
  MageCaretUpFill,
  MageCaretDownFill,
  SolarWalletMoneyBoldDuotone,
  SolarWalletMoneyLinear,
} from '@/components/icons/icons';
import { ChainBadge } from '@/components/crypto/ui/ChainBadge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import WalletCard from '@/components/crypto/WalletCard';
import BankCard from '@/components/banking/BankCard';
import { BankAccountsDataTable } from '@/components/banking/bank-accounts-data-table';
import { LayoutGrid, List } from 'lucide-react';

// Network colors
const networkColors: Record<string, string> = {
  ETHEREUM: 'from-blue-500/20 to-blue-600/5',
  BITCOIN: 'from-orange-500/20 to-orange-600/5',
  POLYGON: 'from-purple-500/20 to-purple-600/5',
  BSC: 'from-yellow-500/20 to-yellow-600/5',
  SOLANA: 'from-cyan-500/20 to-cyan-600/5',
  DEFAULT: 'from-slate-500/20 to-slate-600/5',
};

const syncStatusConfig: Record<string, { label: string; variant: any; icon?: React.ReactNode }> = {
  SUCCESS: { label: 'Synced', variant: 'success' },
  SYNCING: { label: 'Syncing', variant: 'warning', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
  ERROR: { label: 'Error', variant: 'destructive' },
  connected: { label: 'Connected', variant: 'success' },
  syncing: { label: 'Syncing', variant: 'warning', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
  error: { label: 'Error', variant: 'destructive' },
  disconnected: { label: 'Disconnected', variant: 'muted' },
};

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'crypto' | 'bank'>('all');
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Server data from TanStack Query
  const { data: cryptoWalletsRaw = [], isLoading: cryptoLoading } = useCryptoWallets();
  const { data: portfolio } = useCryptoPortfolio();
  const { data: bankAccountsRaw = [], isLoading: bankingLoading } = useBankingGroupedAccounts();

  // UI state from Zustand
  const cryptoFilters = useCryptoUIStore((state) => state.filters);
  const cryptoViewPreferences = useCryptoUIStore((state) => state.viewPreferences);
  const bankFilters = useBankingUIStore((state) => state.filters);
  const bankViewPreferences = useBankingUIStore((state) => state.viewPreferences);
  const setAccountsView = useBankingUIStore((state) => state.setAccountsView);

  // Apply filters
  const cryptoWallets = useMemo(() => {
    return cryptoWalletsRaw.filter((wallet) => {
      if (cryptoFilters.networks.length > 0 && !cryptoFilters.networks.includes(wallet.network)) {
        return false;
      }
      if (cryptoFilters.walletTypes.length > 0 && !cryptoFilters.walletTypes.includes(wallet.type)) {
        return false;
      }
      if (cryptoViewPreferences.hideDustAssets &&
          parseFloat(wallet.totalBalanceUsd) < cryptoViewPreferences.dustThreshold) {
        return false;
      }
      return true;
    });
  }, [cryptoWalletsRaw, cryptoFilters, cryptoViewPreferences]);

  const bankAccounts = useMemo(() => {
    return bankAccountsRaw.filter((account) => {
      if (bankFilters.accountTypes.length > 0 && !bankFilters.accountTypes.includes(account.type)) {
        return false;
      }
      if (bankFilters.institutions.length > 0 && !bankFilters.institutions.includes(account.institutionName)) {
        return false;
      }
      return true;
    });
  }, [bankAccountsRaw, bankFilters]);

  // Calculate totals
  const { totalCrypto, totalBank, totalBalance, cryptoChange } = useMemo(() => {
    const totalCrypto = cryptoWallets.reduce((sum, w) => sum + parseFloat(w.totalBalanceUsd || '0'), 0);
    const totalBank = bankAccounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
    const cryptoChange = portfolio?.dayChange || 0;

    return {
      totalCrypto,
      totalBank,
      totalBalance: totalCrypto + totalBank,
      cryptoChange,
    };
  }, [cryptoWallets, bankAccounts, portfolio]);

  // Filter accounts by search
  const filteredData = useMemo(() => {
    const filteredCrypto = cryptoWallets.filter(w =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.network.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBank = bankAccounts.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { crypto: filteredCrypto, bank: filteredBank };
  }, [cryptoWallets, bankAccounts, searchQuery]);

  const displayAccounts = activeTab === 'all'
    ? [...filteredData.crypto.map(w => ({ ...w, _type: 'crypto' as const })), ...filteredData.bank.map(b => ({ ...b, _type: 'bank' as const }))]
    : activeTab === 'crypto'
    ? filteredData.crypto.map(w => ({ ...w, _type: 'crypto' as const }))
    : filteredData.bank.map(b => ({ ...b, _type: 'bank' as const }));

  const isLoading = cryptoLoading || bankingLoading;

  return (
    <div className="mx-auto p-4 lg:p-6 space-y-6">
      {/* Header - Matching wallet page style */}
      <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 p-4">
        {/* Left: Title */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/15 flex items-center justify-center shadow-sm flex-shrink-0">
            <SolarWalletMoneyBoldDuotone className="h-6 w-6 text-primary" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-md font-bold tracking-tight text-foreground">
              Accounts Overview
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your crypto wallets and bank accounts
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="h-9 w-9"
          >
            {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="font-medium border-border/60 hover:border-border"
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Sync
          </Button>

          <Link href="/accounts/connection">
            <Button size="sm" className="font-medium">
              <Plus className="h-4 w-4 mr-1" />
              Add Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section - Matching wallet page style */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-muted/30 to-background p-4 shadow-sm">
        <div className="flex justify-between items-center">
          {/* Main Balance */}
          <div className="w-full">
            <div className="flex flex-col h-full">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight mb-2">
                    Total Balance
                  </p>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-5xl font-bold">
                      {balanceVisible ? (
                        <CurrencyDisplay amountUSD={totalBalance} variant="large" />
                      ) : (
                        "••••••••"
                      )}
                    </span>
                  </div>
             
                </div>
              </div>

              {/* Breakdown */}
              <div className="flex flex-wrap gap-3 mt-4">
  

                <div className="flex items-center gap-2 border px-2 p-1 rounded-xl bg-muted/60">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground">
                      <CurrencyDisplay amountUSD={totalCrypto} className="text-sm font-bold" />
                    </span>
                    <span className="text-xs text-muted-foreground"> {cryptoWallets.length} Crypto Wallets</span>
                  </div>
                </div>


                <div className="flex items-center gap-2 border px-2 p-1 rounded-xl bg-muted/60">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <FluentBuildingBank28Regular className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground">
                      <CurrencyDisplay amountUSD={totalBank} className="text-sm font-bold" />
                    </span>
                    <span className="text-xs text-muted-foreground"> {bankAccounts.length} Bank Accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
         
            <div className="h-full flex gap-2">
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider ">
                  Quick Actions
                </p>
                <div className="space-y-1">
                  <Link href="/accounts/wallet">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <SolarWalletMoneyLinear className="h-4 w-4" stroke='2' />
                      View Crypto Portfolio
                    </Button>
                  </Link>
                  <Link href="/accounts/bank">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <FluentBuildingBank28Regular className="h-4 w-4" />
                      View Bank Accounts
                    </Button>
                  </Link>
                  <Link href="/accounts/connection">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      Connect New Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          {/* Tab Filters */}
          <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={activeTab === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="gap-1.5"
            >
              <MynauiGridOne className="w-3.5 h-3.5" />
              All
            </Button>
            <Button
              variant={activeTab === 'crypto' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('crypto')}
              className="gap-1.5"
            >
              <StreamlineFlexWallet className="w-3.5 h-3.5" />
              Crypto
            </Button>
            <Button
              variant={activeTab === 'bank' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('bank')}
              className="gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Banks
            </Button>
          </div>

          {/* View Toggle (only for bank accounts) */}
          {activeTab !== 'crypto' && (
            <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              <Button
                variant={bankViewPreferences.accountsView === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setAccountsView('grid')}
                className="gap-1.5"
                title="Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={bankViewPreferences.accountsView === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setAccountsView('list')}
                className="gap-1.5"
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>



      <AccountsBento
        displayAccounts={displayAccounts}
        balanceVisible={balanceVisible}
        viewMode={bankViewPreferences.accountsView}
        totalBankBalance={totalBank}
        isLoading={isLoading}
      />

      {/* Empty State */}
      {displayAccounts.length === 0 && !isLoading && (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No accounts found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Get started by connecting your first account'}
                </p>
              </div>
              <Link href="/accounts/connection">
                <Button className="mt-2 gap-2">
                  <Plus className="w-4 h-4" />
                  Add Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


const AccountsBento = ({
  displayAccounts,
  balanceVisible,
  viewMode,
  totalBankBalance,
  isLoading,
}: {
  displayAccounts: any[];
  balanceVisible: boolean;
  viewMode: 'grid' | 'list' | 'grouped';
  totalBankBalance: number;
  isLoading: boolean;
}) => {
  // Separate accounts into crypto and bank
  const cryptoAccounts = displayAccounts.filter(account => account._type === 'crypto');
  const bankAccounts = displayAccounts.filter(account => account._type !== 'crypto');

  return (
    <div className="space-y-8">
      {/* Crypto Accounts Section */}
      {cryptoAccounts.length > 0 && (
        <section>
          <h2 className="text-md font-semibold mb-4">Crypto Wallets</h2>
          <div className="flex flex-wrap gap-4">
            {cryptoAccounts.map((wallet) => {
              return (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Bank Accounts Section */}
      {bankAccounts.length > 0 && (
        <section>
          <h2 className="text-md font-semibold mb-4">Bank Accounts</h2>

          {/* List View - Data Table */}
          {viewMode === 'list' && (
            <BankAccountsDataTable
              accounts={bankAccounts}
              totalBalance={totalBankBalance}
              isLoading={isLoading}
            />
          )}

          {/* Grid View - Card Grid */}
          {viewMode === 'grid' && (
            <div className="flex flex-wrap gap-4">
              {bankAccounts.map((bankAccount) => (
                <BankCard
                  key={bankAccount.id}
                  account={bankAccount}
                />
              ))}
            </div>
          )}

          {/* Grouped View - Can be implemented later */}
          {viewMode === 'grouped' && (
            <div className="flex flex-wrap gap-4">
              {bankAccounts.map((bankAccount) => (
                <BankCard
                  key={bankAccount.id}
                  account={bankAccount}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
