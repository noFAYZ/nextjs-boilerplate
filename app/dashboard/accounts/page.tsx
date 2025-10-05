'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ChevronRight,
  Wallet2,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Trash2,
  Edit3,
  Link as LinkIcon,
  Sparkles,
  LayoutGrid,
  List,
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
import { StreamlineFlexWallet } from '@/components/icons/icons';

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
  SUCCESS: { label: 'Synced', variant: 'dot-success' },
  SYNCING: { label: 'Syncing', variant: 'warning-soft', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
  ERROR: { label: 'Error', variant: 'error-soft' },
  connected: { label: 'Connected', variant: 'dot-success' },
  syncing: { label: 'Syncing', variant: 'warning-soft', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
  error: { label: 'Error', variant: 'error-soft' },
  disconnected: { label: 'Disconnected', variant: 'muted' },
};

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'crypto' | 'bank'>('all');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Fetch banking accounts from API
  const { data: bankAccountsFromAPI, isLoading: bankingLoading } = useBankingGroupedAccounts();
  const setAccounts = useBankingStore(state => state.setAccounts);

  // Update store when data is fetched
  useEffect(() => {
    if (bankAccountsFromAPI && Array.isArray(bankAccountsFromAPI)) {
      setAccounts(bankAccountsFromAPI);
    }
  }, [bankAccountsFromAPI, setAccounts]);

  // Get data from stores - use inline selectors
  const cryptoWalletsRaw = useCryptoStore(state => state.wallets);
  const cryptoFilters = useCryptoStore(state => state.filters);
  const cryptoViewPreferences = useCryptoStore(state => state.viewPreferences);
  const bankAccountsRaw = useBankingStore(state => state.accounts);
  const bankFilters = useBankingStore(state => state.filters);
  const bankViewPreferences = useBankingStore(state => state.viewPreferences);
  const cryptoLoading = useCryptoStore(state => state.walletsLoading);

  // Apply filters manually
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

  // Get portfolio data for 24h change
  const portfolio = useCryptoStore(state => state.portfolio);
  const bankingOverview = useBankingStore(state => state.overview);

  // Calculate totals
  const { totalCrypto, totalBank, totalBalance, totalChange, cryptoCount, bankCount } = useMemo(() => {
    const totalCrypto = cryptoWallets.reduce((sum, w) => sum + parseFloat(w.totalBalanceUsd || '0'), 0);
    const totalBank = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
    const total = totalCrypto + totalBank;

    // Calculate 24h change from portfolio data if available
    let change = 0;
    if (portfolio && portfolio.dayChangePct !== undefined) {
      // Use crypto portfolio change percentage
      change = portfolio.dayChangePct;
    } else if (total > 0) {
      // Fallback: estimate based on available data
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
  const brandColor = '#FF6900';

  return (

      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden p-4">

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted" >
                <StreamlineFlexWallet className="w-4 h-4 " />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Accounts</h1>
               
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="xs" className="gap-1">
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button size="xs" className="gap-1" >
                <Plus className="w-3 h-3" />
                Add Account
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 lg:grid-cols-4">
          {/* Total Net Worth */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 rounded-xl border-0 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, transparent 100%)` }} />
              <CardContent className="p-3 relative">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
               
              
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">Net Worth</p>
                  
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="h-6 w-6 p-0"
                  >
                    {balanceVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                  </h2>

                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold",
                      totalChange >= 0
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : "bg-red-500/15 text-red-600 dark:text-red-400"
                    )}>
                      {totalChange >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
                    </div>
                    <span className="text-[10px] text-muted-foreground">Last 24h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crypto & Bank Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {/* Crypto */}
            <Card className="bg-white dark:bg-zinc-900 rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-3">
          
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground">Crypto Wallets</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold">{cryptoCount}</p>
                    <span className="text-[10px] text-muted-foreground">wallets</span>
                  </div>
                  <div className="pt-1 border-t border-border/50">
                    <p className="text-xs font-semibold" style={{ color: brandColor }}>
                      ${totalCrypto.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Total value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank */}
            <Card className="bg-white dark:bg-zinc-900 rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-3">
          
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground">Bank Accounts</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold">{bankCount}</p>
                    <span className="text-[10px] text-muted-foreground">accounts</span>
                  </div>
                  <div className="pt-1 border-t border-border/50">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                      ${totalBank.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Total balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1  w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-lg text-sm max-w-sm justify-end "
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              >
                ✕
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={activeTab === 'all' ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setActiveTab('all')}
                className={cn(
                  "gap-1 text-xs font-medium transition-all",
                )}
       
              >
                All
              </Button>
              <Button
                variant={activeTab === 'crypto' ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setActiveTab('crypto')}
                className={cn(
                  "gap-1 text-xs font-medium transition-all",
                )}
           
              >
                <Wallet2 className="w-3 h-3" />
                Crypto 
              </Button>
              <Button
                variant={activeTab === 'bank' ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setActiveTab('bank')}
                className={cn(
                  "  gap-1 text-xs font-medium transition-all",
                )}
            
              >
                <Building2 className="w-3 h-3" />
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
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
  {displayAccounts.map((account) => {
    const isCrypto = account._type === "crypto";

    if (isCrypto) {
      const wallet = account;
      const balance = parseFloat(wallet.totalBalanceUsd || "0");
      const networkColor = networkColors[wallet.network] || networkColors.DEFAULT;
      const syncConfig = syncStatusConfig[wallet.syncStatus || "SUCCESS"];

      return (
        <Card
          key={wallet.id}
          className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl bg-gradient-to-br from-white/70 to-purple-50/40 dark:from-zinc-900/70 dark:to-purple-950/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
   

          <CardContent className="px-5 relative">
            <div className="flex items-start justify-between mb-4">
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                  networkColor.bg
                )}
              >
                <Wallet2 className={cn("w-5 h-5", networkColor.text)} />
              </div>

              {syncConfig && (
                <Badge variant={syncConfig.variant} size="xs" className="rounded-full px-2 py-0.5 text-[10px] font-medium">
                  {syncConfig.icon}
                  {syncConfig.label}
                </Badge>
              )}
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-semibold mb-1.5 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {wallet.name}
              </h3>
              <div className="space-y-1">
                <code className="block px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono truncate">
                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                </code>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted/50 font-medium">{wallet.network}</span>
                  {wallet.assetCount > 0 && (
                    <>
                      <span>•</span>
                      <span>{wallet.assetCount} assets</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Total Balance</p>
                <p className="text-lg font-bold" style={{ color: brandColor }}>
                  {balanceVisible
                    ? `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "••••••"}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 shadow-md">
                  <DropdownMenuItem className="text-xs rounded-md">
                    <Eye className="w-3 h-3 mr-2" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs rounded-md">
                    <RefreshCw className="w-3 h-3 mr-2" /> Sync Now
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs rounded-md">
                    <Edit3 className="w-3 h-3 mr-2" /> Edit Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs rounded-md">
                    <ExternalLink className="w-3 h-3 mr-2" /> View on Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive text-xs rounded-md">
                    <Trash2 className="w-3 h-3 mr-2" /> Remove Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      const bankAccount = account;
      const syncConfig = syncStatusConfig[bankAccount.syncStatus || "connected"];

      return (
        <Card
          key={bankAccount.id}
          className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl bg-gradient-to-br from-white/70 to-green-50/40 dark:from-zinc-900/70 dark:to-green-950/30 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >

          <CardContent className="px-5 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              {syncConfig && (
                <Badge variant={syncConfig.variant} size="xs" className="rounded-full px-2 py-0.5 text-[10px] font-medium">
                  {syncConfig.icon}
                  {syncConfig.label}
                </Badge>
              )}
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-semibold mb-1.5 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {bankAccount.name}
              </h3>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground truncate">{bankAccount.institutionName}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <code className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">{bankAccount.accountNumber}</code>
                  <span>•</span>
                  <span className="font-medium">{bankAccount.type}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5">Current Balance</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {balanceVisible
                    ? `$${bankAccount.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "••••••"}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 shadow-md">
                  <DropdownMenuItem className="text-xs rounded-md">
                    <Eye className="w-3 h-3 mr-2" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs rounded-md">
                    <RefreshCw className="w-3 h-3 mr-2" /> Sync Now
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs rounded-md">
                    <Edit3 className="w-3 h-3 mr-2" /> Edit Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive text-xs rounded-md">
                    <Trash2 className="w-3 h-3 mr-2" /> Remove Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      );
    }
  })}

  {displayAccounts.length === 0 && !isLoading && (
    <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 rounded-2xl border-2 border-dashed border-border">
      <CardContent className="py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
            <Search className="w-6 h-6" style={{ color: brandColor }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">No accounts found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by adding your first account to track your finances"}
            </p>
          </div>
          <Button className="mt-2 text-xs font-semibold" size="sm" style={{ backgroundColor: brandColor, color: "white" }}>
            <Plus className="w-3 h-3 mr-1.5" />
            Add Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
</div>

      </div>

  );
}
