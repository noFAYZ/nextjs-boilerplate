'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Wallet2,
  ExternalLink,
  Trash2,
  Edit3,
  ArrowUpRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useBankingStore } from '@/lib/stores/banking-store';
import { useBankingGroupedAccounts } from '@/lib/queries/banking-queries';
import Link from 'next/link';
import { MynauiGridOne, SolarWalletMoneyLinear, StreamlineFlexWallet } from '@/components/icons/icons';

// Network icon colors mapping
const networkColors: Record<string, { bg: string; text: string; border: string }> = {
  ETHEREUM: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  BITCOIN: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20' },
  POLYGON: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
  BSC: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20' },
  SOLANA: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20' },
  DEFAULT: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20' },
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

  // Fetch banking accounts from API
  const { data: bankAccountsFromAPI, isLoading: bankingLoading } = useBankingGroupedAccounts();
  const setAccounts = useBankingStore(state => state.setAccounts);

  // Update store when data is fetched
  useEffect(() => {
    if (bankAccountsFromAPI && Array.isArray(bankAccountsFromAPI)) {
      setAccounts(bankAccountsFromAPI);
    }
  }, [bankAccountsFromAPI, setAccounts]);

  // Get data from stores
  const cryptoWalletsRaw = useCryptoStore(state => state.wallets);
  const cryptoFilters = useCryptoStore(state => state.filters);
  const cryptoViewPreferences = useCryptoStore(state => state.viewPreferences);
  const bankAccountsRaw = useBankingStore(state => state.accounts);
  const bankFilters = useBankingStore(state => state.filters);
  const bankViewPreferences = useBankingStore(state => state.viewPreferences);
  const cryptoLoading = useCryptoStore(state => state.walletsLoading);

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
      if (!bankViewPreferences.showInactiveAccounts && !account.isActive) {
        return false;
      }
      if (bankViewPreferences.hideSmallAmounts &&
          Math.abs(account.balance) < bankViewPreferences.smallAmountThreshold) {
        return false;
      }
      return true;
    });
  }, [bankAccountsRaw, bankFilters, bankViewPreferences]);

  // Get portfolio data
  const portfolio = useCryptoStore(state => state.portfolio);

  // Calculate totals
  const { totalCrypto, totalBank, totalBalance, totalChange, cryptoCount, bankCount } = useMemo(() => {
    const totalCrypto = cryptoWallets.reduce((sum, w) => sum + parseFloat(w.totalBalanceUsd || '0'), 0);
    const totalBank = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
    const total = totalCrypto + totalBank;

    let change = 0;
    if (portfolio && portfolio.dayChangePct !== undefined) {
      change = portfolio.dayChangePct;
    } else if (total > 0) {
      const cryptoChange = portfolio?.dayChange || 0;
      change = (cryptoChange / total) * 100;
    }

    return {
      totalCrypto,
      totalBank,
      totalBalance: total,
      totalChange: change,
      cryptoCount: cryptoWallets.length,
      bankCount: bankAccounts.length,
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-20">
        <div>
          <h1 className="text-xl font-semibold">Accounts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your crypto wallets and bank accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="xs">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Link href="/dashboard/accounts/connection">
            <Button size="xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Balance */}
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">Total Balance</p>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="h-6 w-6 p-0"
              >
                {balanceVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </Button>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
            </h2>
            <div className="flex items-center gap-1.5">
              <Badge
                variant={totalChange >= 0 ? 'success' : 'destructive'}
                size="sm"
                className="font-semibold"
              >
                {totalChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
              </Badge>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </CardContent>
        </Card>

        {/* Crypto */}
        <Card className="border-2 hover:border-purple-500/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Wallet2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Crypto Wallets</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{cryptoCount}</h3>
              <span className="text-xs text-muted-foreground">wallets</span>
            </div>
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
              ${totalCrypto.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        {/* Bank */}
        <Card className="border-2 hover:border-green-500/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Bank Accounts</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{bankCount}</h3>
              <span className="text-xs text-muted-foreground">accounts</span>
            </div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
              ${totalBank.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border shadow-none hover:border-foreground/30 hover:bg-muted/60 focus:outline-none focus:ring-0 transition-colors pl-9 h-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1  p-1">
            <Button
              variant={activeTab === 'all' ? 'secondary' : 'outline'}
              size="xs"
              onClick={() => setActiveTab('all')}
            >
               <MynauiGridOne className="w-3 h-3 mr-1" />
              All
            </Button>
            <Button
              variant={activeTab === 'crypto' ? 'secondary' : 'outline'}
              size="xs"
              onClick={() => setActiveTab('crypto')}
            >
              <StreamlineFlexWallet className="w-3 h-3 mr-1" />
              Crypto
            </Button>
            <Button
              variant={activeTab === 'bank' ? 'secondary' : 'outline'}
              size="xs"
              onClick={() => setActiveTab('bank')}
            >
              <Building2 className="w-3 h-3 mr-1" />
              Banks
            </Button>
          </div>

          <Button
            variant="outline"
            size="xs"
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {displayAccounts.map((account) => {
          const isCrypto = account._type === 'crypto';

          if (isCrypto) {
            const wallet = account;
            const balance = parseFloat(wallet.totalBalanceUsd || '0');
            const networkColor = networkColors[wallet.network] || networkColors.DEFAULT;
            const syncConfig = syncStatusConfig[wallet.syncStatus || 'SUCCESS'];

            return (
              <Card
                key={wallet.id}
                className={cn(
                  "group relative overflow-hidden hover:bg-muted/20 transition-colors ",
                  "border-border bg-background ",
                  "shadow-xs ",
                  "cursor-pointer"
                )}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px] pointer-events-none" />

                <CardContent className="px-5 relative">
                  {/* Header with icon and status */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative",
                          networkColor.bg,
                     
                        )}
                      >
                        <SolarWalletMoneyLinear className={cn("w-5 h-5", networkColor.text)} />
                        {/* Small network indicator */}
                  
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate leading-tight" title={wallet.name}>
                          {wallet.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {wallet.network}
                        </p>
                      </div>
                    </div>
                    {syncConfig && (
                      <Badge variant={syncConfig.variant} size="sm" className="shrink-0 shadow-sm">
                        {syncConfig.icon}
                      </Badge>
                    )}
                  </div>

                  {/* Address with copy indicator */}
                  <div className="relative group/address mb-2">
                    <code className="block text-xs font-mono text-muted-foreground px-3 py-1 bg-muted/30 rounded-lg border border-border/50 truncate" title={wallet.address}>
                      {wallet.address.slice(0, 12)}...{wallet.address.slice(-7)}
                    </code>
                  </div>

                  {/* Assets info with visual indicator */}
                  {wallet.assetCount > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", networkColor.bg)} style={{ width: `${Math.min((wallet.assetCount / 10) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                        {wallet.assetCount} {wallet.assetCount === 1 ? 'asset' : 'assets'}
                      </span>
                    </div>
                  )}

                  {/* Balance section */}
                  <div className="flex items-end justify-between pt-2 ">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground  font-medium uppercase ">Balance</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-bold truncate" title={balanceVisible ? balance.toFixed(2) : ''}>
                          {balanceVisible
                            ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '••••••'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-lg"
                          aria-label="Account actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" /> Explorer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          } else {
            const bankAccount = account;
            const syncConfig = syncStatusConfig[bankAccount.syncStatus || 'connected'];

            return (
              <Card
                key={bankAccount.id}
                className={cn(
                  "group relative overflow-hidden ",
                  "border-border bg-background",
                  "shadow-xs ",
                  "cursor-pointer"
                )}
              >
                {/* Decorative stripes pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
                    backgroundSize: '10px 10px'
                  }} />
                </div>

                <CardContent className="px-5 relative">
                  {/* Institution badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 ring-1 ring-green-500/20">
                          <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-sm flex flex-col font-semibold truncate" title={bankAccount.name}>
                        {bankAccount.name}  <Badge variant="outline" size="sm" className="font-medium ">
                          {bankAccount.type}
                        </Badge>
                      </h3>
                      
                      </div>
                   {/*    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1" title={bankAccount.institutionName}>
                        {bankAccount.institutionName}
                      </p> */}
                     
                    </div>
                    {syncConfig && (
                      <Badge variant={syncConfig.variant} size="sm" className="shrink-0 shadow-sm">
                        {syncConfig.icon}
                      </Badge>
                    )}
                  </div>

                  {/* Account number with card-like styling */}
                  <div className="mb-2 px-3  bg-muted/20 rounded-lg border border-border/50">
                   
                    <code className="text-xs font-mono font-semibold tracking-wider">
                      {bankAccount.accountNumber}
                    </code>
                  </div>

                  {/* Balance display */}
                  <div className="flex items-end justify-between pt-2 border-t-2 border-dashed border-border/30">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground  font-medium uppercase ">Current Balance</p>
                      <p className="text-lg font-bold truncate">
                        {balanceVisible
                          ? `$${bankAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : '••••••'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-lg"
                          aria-label="Account actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          }
        })}

        {/* Empty State */}
        {displayAccounts.length === 0 && !isLoading && (
          <Card className="col-span-full border-dashed border-2">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">No accounts found</h3>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : 'Get started by adding your first account'}
                  </p>
                </div>
                <Link href="/dashboard/accounts/connection">
                  <Button size="sm" className="mt-2">
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
