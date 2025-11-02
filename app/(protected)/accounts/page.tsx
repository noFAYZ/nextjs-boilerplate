'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Plus,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  Coins,
  TrendingUp,
  ArrowUpRight,
  Filter,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ✅ Import types
import type { CryptoWallet } from '@/lib/types/crypto';
import type { BankAccount } from '@/lib/types/banking';

// ✅ Use consolidated data hooks
import {
  useCryptoWallets,
  useCryptoPortfolio,
  useBankingGroupedAccounts,
  useSyncAllCryptoWallets,
  useSyncAllBankAccounts,
} from '@/lib/queries';

// ✅ Use UI-only stores
import { useCryptoUIStore } from '@/lib/stores/ui-stores';
import { useBankingUIStore } from '@/lib/stores/ui-stores';
import {
  FluentBuildingBank28Regular,
  MynauiGridOne,
  StreamlineFlexWallet,
  SolarWalletMoneyBoldDuotone,
} from '@/components/icons/icons';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import WalletCard from '@/components/crypto/WalletCard';
import BankCard from '@/components/banking/BankCard';
import { BankAccountsDataTable } from '@/components/banking/bank-accounts-data-table';
import { CryptoWalletsDataTable } from '@/components/crypto/crypto-wallets-data-table';
import { LayoutGrid, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ✅ Use centralized utilities
import {
  filterCryptoWallets,
  filterBankAccounts,
  filterDustAssets,
  sortCryptoWallets,
  sortBankAccounts,
  calculateCombinedTotals,
} from '@/lib/utils';

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'crypto' | 'bank'>('all');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [sortBy, setSortBy] = useState<'balance' | 'name' | 'recent'>('balance');

  // Server data from TanStack Query
  const { data: cryptoWalletsRaw = [], isLoading: cryptoLoading, refetch: refetchCrypto } = useCryptoWallets();
  const { data: portfolio } = useCryptoPortfolio();
  const { data: bankAccountsRaw = [], isLoading: bankingLoading, refetch: refetchBank } = useBankingGroupedAccounts();
  const { mutate: syncAllCrypto, isPending: isSyncingCrypto } = useSyncAllCryptoWallets();
  const { mutate: syncAllBank, isPending: isSyncingBank } = useSyncAllBankAccounts();

  // UI state from Zustand
  const cryptoFilters = useCryptoUIStore((state) => state.filters);
  const cryptoViewPreferences = useCryptoUIStore((state) => state.viewPreferences);
  const setCryptoWalletsView = useCryptoUIStore((state) => state.setWalletsView);
  const bankFilters = useBankingUIStore((state) => state.filters);
  const bankViewPreferences = useBankingUIStore((state) => state.viewPreferences);
  const setAccountsView = useBankingUIStore((state) => state.setAccountsView);


  // ✅ Apply filters using centralized utilities
  const cryptoWallets = useMemo(() => {

    let filtered = filterCryptoWallets(cryptoWalletsRaw, {
      networks: cryptoFilters.networks,
      walletTypes: cryptoFilters.walletTypes,
    });


    return filtered;
  }, [cryptoWalletsRaw, cryptoFilters, cryptoViewPreferences]);

  const bankAccounts = useMemo(() => {
    return filterBankAccounts(bankAccountsRaw, {
      accountTypes: bankFilters.accountTypes,
      institutions: bankFilters.institutions,
    });
  }, [bankAccountsRaw, bankFilters]);

  // ✅ Calculate totals using centralized utilities
  const { totalCrypto, totalBank, totalBalance, cryptoChange, cryptoChangePct } = useMemo(() => {
    return calculateCombinedTotals(cryptoWallets, bankAccounts, portfolio as any);
  }, [cryptoWallets, bankAccounts, portfolio]);

  // ✅ Filter accounts by search using centralized utilities
  const filteredData = useMemo(() => {
    const filteredCrypto = filterCryptoWallets(cryptoWallets, {
      searchQuery,
    });

    const filteredBank = filterBankAccounts(bankAccounts, {
      searchQuery,
    });

    return { crypto: filteredCrypto, bank: filteredBank };
  }, [cryptoWallets, bankAccounts, searchQuery]);

  // ✅ Sort accounts using centralized utilities
  const sortedFilteredData = useMemo(() => {
    return {
      crypto: sortCryptoWallets(filteredData.crypto, sortBy),
      bank: sortBankAccounts(filteredData.bank, sortBy),
    };
  }, [filteredData, sortBy]);

  // Get display data based on active tab
  const displayData = useMemo(() => {
    if (activeTab === 'crypto') {
      return { crypto: sortedFilteredData.crypto, bank: [] };
    } else if (activeTab === 'bank') {
      return { crypto: [], bank: sortedFilteredData.bank };
    } else {
      return sortedFilteredData;
    }
  }, [activeTab, sortedFilteredData]);

  const isLoading = cryptoLoading || bankingLoading;

  const handleSyncAll = () => {
    if (activeTab === 'crypto' || activeTab === 'all') {
      syncAllCrypto(undefined, {
        onSuccess: () => {
          setTimeout(() => {
            refetchCrypto();
          }, 2000);
        },
      });
    }
    if (activeTab === 'bank' || activeTab === 'all') {
      syncAllBank(undefined, {
        onSuccess: () => {
          setTimeout(() => {
            refetchBank();
          }, 2000);
        },
      });
    }
  };

  const currentViewMode = activeTab === 'crypto'
    ? cryptoViewPreferences.walletsView
    : activeTab === 'bank'
    ? bankViewPreferences.accountsView
    : activeTab === 'all'
    ? (cryptoViewPreferences.walletsView === bankViewPreferences.accountsView
        ? cryptoViewPreferences.walletsView
        : 'grid') // Show grid if views differ, otherwise show the common view
    : 'grid';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex flex-col gap-4 p-6">
          {/* Top Row: Title + Actions */}
          <div className="flex items-center justify-between">
    
           
         
                <h1 className="text-xl font-bold tracking-tight">Accounts</h1>
           
           
           

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBalanceVisible(!balanceVisible)}
                title={balanceVisible ? "Hide balances" : "Show balances"}
              >
                {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncAll}
                  disabled={isLoading || isSyncingCrypto || isSyncingBank}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-1", (isLoading || isSyncingCrypto || isSyncingBank) && "animate-spin")} />
                  Sync All
                </Button>
                {(isSyncingCrypto || isSyncingBank) && (
                  <Badge variant="secondary" className="text-xs">
                    {isSyncingCrypto && isSyncingBank ? 'Syncing...' : isSyncingCrypto ? 'Syncing crypto...' : 'Syncing bank...'}
                  </Badge>
                )}
              </div>

              <Link href="/accounts/connection">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Balance */}
            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Balance</p>
                    <div className="text-2xl font-bold">
                      {balanceVisible ? (
                        <CurrencyDisplay amountUSD={totalBalance} variant="default" />
                      ) : (
                        "••••••••"
                      )}
                    </div>
                    {portfolio && cryptoChangePct !== 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Badge
                          variant={cryptoChangePct >= 0 ? "success" : "destructive"}
                          className="text-xs"
                        >
                          {cryptoChangePct >= 0 ? "+" : ""}
                          {cryptoChangePct.toFixed(2)}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">24h</span>
                      </div>
                    )}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

    
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-fit">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 " />
              <Input
                placeholder="Search by name, address, or institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Tab Filters */}
            <div className="inline-flex items-center rounded-lg border p-1 bg-background">
              <Button
                variant={activeTab === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('all')}
                className="gap-1.5 h-8"
              >
                <MynauiGridOne className="w-4 h-4" />
                All
              </Button>
              <Button
                variant={activeTab === 'crypto' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('crypto')}
                className="gap-1.5 h-8"
              >
                <StreamlineFlexWallet className="w-4 h-4" />
                Crypto
              </Button>
              <Button
                variant={activeTab === 'bank' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('bank')}
                className="gap-1.5 h-8"
              >
                <Building2 className="w-4 h-4" />
                Banks
              </Button>
            </div>

            {/* Sort 
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balance">By Balance</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>*/}

            {/* View Toggle */}
            <div className="inline-flex items-center rounded-lg border p-1 bg-background">
              <Button
                variant={currentViewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => {
                  if (activeTab === 'crypto') {
                    setCryptoWalletsView('grid');
                  } else if (activeTab === 'bank') {
                    setAccountsView('grid');
                  } else if (activeTab === 'all') {
                    // When on "all" tab, update both
                    setCryptoWalletsView('grid');
                    setAccountsView('grid');
                  }
                }}
                className="h-8 w-8 p-0"
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={currentViewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => {
                  if (activeTab === 'crypto') {
                    setCryptoWalletsView('list');
                  } else if (activeTab === 'bank') {
                    setAccountsView('list');
                  } else if (activeTab === 'all') {
                    // When on "all" tab, update both
                    setCryptoWalletsView('list');
                    setAccountsView('list');
                  }
                }}
                className="h-8 w-8 p-0"
                title="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <AccountsBento
          cryptoWallets={displayData.crypto}
          bankAccounts={displayData.bank}
          balanceVisible={balanceVisible}
          cryptoViewMode={cryptoViewPreferences.walletsView}
          bankViewMode={bankViewPreferences.accountsView}
          totalCryptoBalance={totalCrypto}
          totalBankBalance={totalBank}
          isLoading={isLoading}
          searchQuery={searchQuery}
          activeTab={activeTab}
        />

        {/* Empty State */}
        {displayData.crypto.length === 0 && displayData.bank.length === 0 && !isLoading && (
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
                {!searchQuery && (
                  <Link href="/accounts/connection">
                    <Button className="mt-2 gap-2" size='sm'>
                      <Plus className="w-4 h-4" />
                      Add Account
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const AccountsBento = ({
  cryptoWallets,
  bankAccounts,
  balanceVisible,
  cryptoViewMode,
  bankViewMode,
  totalCryptoBalance,
  totalBankBalance,
  isLoading,
  searchQuery,
  activeTab,
}: {
  cryptoWallets: CryptoWallet[];
  bankAccounts: BankAccount[];
  balanceVisible: boolean;
  cryptoViewMode: 'grid' | 'list';
  bankViewMode: 'grid' | 'list' | 'grouped';
  totalCryptoBalance: number;
  totalBankBalance: number;
  isLoading: boolean;
  searchQuery: string;
  activeTab: 'all' | 'crypto' | 'bank';
}) => {
  return (
    <div className="space-y-6">
      {/* Crypto Accounts Section */}
      {cryptoWallets.length > 0 && (
        <section>
          {activeTab === 'all' && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Crypto Wallets  <span className='text-primary'>[<CurrencyDisplay amountUSD={totalCryptoBalance} variant="default" />]</span></h2>

              </div>
              <Link href="/accounts/wallet">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}

          {/* List View - Data Table */}
          {cryptoViewMode === 'list' && (
            <CryptoWalletsDataTable
              wallets={cryptoWallets}
              totalBalance={totalCryptoBalance}
              isLoading={isLoading}
              hideFilters={true}
            />
          )}

          {/* Grid View - Card Grid */}
          {cryptoViewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cryptoWallets.map((wallet) => {
                return (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Bank Accounts Section */}
      {bankAccounts.length > 0 && (
        <section>
          {activeTab === 'all' && cryptoWallets.length > 0 && <Separator className="my-8" />}

          {activeTab === 'all' && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold">Bank Accounts <span className='text-primary'>[<CurrencyDisplay amountUSD={totalBankBalance} variant="default" />]</span></h2>
                
              </div>
              <Link href="/accounts/bank">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}

          {/* List View - Data Table */}
          {bankViewMode === 'list' && (
            <BankAccountsDataTable
              accounts={bankAccounts}
              totalBalance={totalBankBalance}
              isLoading={isLoading}
              hideFilters={true}
            />
          )}

          {/* Grid View - Card Grid */}
          {bankViewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              {bankAccounts.map((bankAccount) => (
                <BankCard
                  key={bankAccount.id}
                  account={bankAccount as any}
                />
              ))}
            </div>
          )}

          {/* Grouped View - Can be implemented later */}
          {bankViewMode === 'grouped' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              {bankAccounts.map((bankAccount) => (
                <BankCard
                  key={bankAccount.id}
                  account={bankAccount as any}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
