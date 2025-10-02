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

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage all your financial accounts in one place
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="h-6 w-6"
            >
              {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
            </div>
            <p className={cn(
              "text-xs",
              totalChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}>
              {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}% from last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crypto Accounts</CardTitle>
            <Wallet2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cryptoCount}</div>
            <p className="text-xs text-muted-foreground">
              ${totalCrypto.toLocaleString('en-US', { maximumFractionDigits: 0 })} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bankCount}</div>
            <p className="text-xs text-muted-foreground">
              ${totalBank.toLocaleString('en-US', { maximumFractionDigits: 0 })} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, address, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30">
            <Button
              variant={activeTab === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="h-8 px-3"
            >
              All
            </Button>
            <Button
              variant={activeTab === 'crypto' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('crypto')}
              className="h-8 px-3"
            >
              <Wallet2 className="w-4 h-4 mr-1.5" />
              Crypto
            </Button>
            <Button
              variant={activeTab === 'bank' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('bank')}
              className="h-8 px-3"
            >
              <Building2 className="w-4 h-4 mr-1.5" />
              Banks
            </Button>
          </div>

          <Button variant="secondary" size="sm">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {displayAccounts.map((account) => {
          const isCrypto = account._type === 'crypto';

          if (isCrypto) {
            const wallet = account as any;
            const balance = parseFloat(wallet.totalBalanceUsd || '0');
            const networkColor = networkColors[wallet.network] || networkColors.DEFAULT;
            const syncConfig = syncStatusConfig[wallet.syncStatus || 'SUCCESS'];

            return (
              <Card key={wallet.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      networkColor.bg
                    )}>
                      <Wallet2 className={cn("w-5 h-5", networkColor.text)} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{wallet.name}</h3>
                        {syncConfig && (
                          <Badge variant={syncConfig.variant} size="sm" className="shrink-0">
                            {syncConfig.icon}
                            {syncConfig.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <code className="text-xs">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</code>
                        <span>•</span>
                        <span>{wallet.network}</span>
                        {wallet.assetCount > 0 && (
                          <>
                            <span>•</span>
                            <span>{wallet.assetCount} assets</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right shrink-0">
                      <p className="font-semibold">
                        {balanceVisible ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Explorer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          } else {
            const bankAccount = account as any;
            const syncConfig = syncStatusConfig[bankAccount.syncStatus || 'connected'];

            return (
              <Card key={bankAccount.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{bankAccount.name}</h3>
                        {syncConfig && (
                          <Badge variant={syncConfig.variant} size="sm" className="shrink-0">
                            {syncConfig.icon}
                            {syncConfig.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <code className="text-xs">{bankAccount.accountNumber}</code>
                        <span>•</span>
                        <span>{bankAccount.type}</span>
                        <span>•</span>
                        <span className="truncate">{bankAccount.institutionName}</span>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right shrink-0">
                      <p className="font-semibold">
                        {balanceVisible ? `$${bankAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                      </p>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
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
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">No accounts found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first account'}
                </p>
                <Button className="mt-4" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
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
