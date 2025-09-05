'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, RefreshCw, TrendingUp, Wallet } from 'lucide-react';

// Import our custom hooks
import {
  useWallets,
  usePortfolio,
  useTransactions,
  useCreateWallet,
  useSyncManager,
  usePortfolioManager,
  useFilterManager,
} from '@/lib/hooks/use-crypto';

// Import types
import type { NetworkType, WalletType } from '@/lib/types/crypto';

export function CryptoDashboardDemo() {
  const [newWalletForm, setNewWalletForm] = useState({
    name: '',
    address: '',
    network: 'ETHEREUM' as NetworkType,
    type: 'HOT_WALLET' as WalletType,
  });

  // Use our custom hooks
  const { wallets, isLoading: walletsLoading, error: walletsError } = useWallets();
  const { portfolio, isLoading: portfolioLoading } = usePortfolio();
  const { transactions, pagination, isLoading: transactionsLoading } = useTransactions({ limit: 10 });
  const { syncAllWallets, hasActiveSyncs, isSyncing } = useSyncManager();
  const { timeRange, changeTimeRange } = usePortfolioManager();
  const { filters, setNetworkFilter, hasActiveFilters, clearFilters } = useFilterManager();

  // Mutations
  const createWalletMutation = useCreateWallet();

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWalletMutation.mutateAsync({
        name: newWalletForm.name,
        address: newWalletForm.address,
        network: newWalletForm.network,
        type: newWalletForm.type,
        label: `${newWalletForm.network} Wallet`,
      });
      setNewWalletForm({
        name: '',
        address: '',
        network: 'ETHEREUM',
        type: 'HOT_WALLET',
      });
    } catch (error) {
      console.error('Failed to add wallet:', error);
    }
  };

  const handleSyncAll = () => {
    syncAllWallets();
  };

  if (walletsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading crypto dashboard...</span>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crypto Portfolio Dashboard</h1>
          <p className="text-muted-foreground">
            Integrated with Zustand state management and TanStack Query
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={isSyncing || hasActiveSyncs()}
            variant="outline"
            size="sm"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync All
          </Button>
          {hasActiveFilters() && (
            <Button onClick={clearFilters} variant="ghost" size="sm">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portfolio Overview
          </CardTitle>
          <div className="flex gap-2">
            {(['24h', '7d', '30d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => changeTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {portfolioLoading ? (
            <div className="h-24 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : portfolio ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${portfolio.totalValueUsd.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Change</p>
                <p className={`text-2xl font-bold ${portfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.dayChangePct >= 0 ? '+' : ''}{portfolio.dayChangePct.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assets</p>
                <p className="text-2xl font-bold">{portfolio.totalAssets}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NFTs</p>
                <p className="text-2xl font-bold">{portfolio.totalNfts}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No portfolio data available</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="wallets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add-wallet">Add Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Your Wallets ({wallets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {walletsError && (
                <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">
                  Error: {walletsError}
                </div>
              )}
              <div className="grid gap-4">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{wallet.name}</h3>
                        <Badge variant="outline">{wallet.network}</Badge>
                        <Badge variant="secondary">{wallet.type.replace('_', ' ')}</Badge>
                        {wallet.syncStatus && (
                          <Badge 
                            variant={wallet.syncStatus === 'SUCCESS' ? 'default' : 'destructive'}
                          >
                            {wallet.syncStatus}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {wallet.address}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-sm">
                          Balance: ${parseFloat(wallet.totalBalanceUsd).toLocaleString()}
                        </span>
                        <span className="text-sm">
                          Assets: {wallet.assetCount}
                        </span>
                        <span className="text-sm">
                          NFTs: {wallet.nftCount}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={!wallet.isActive}>
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </Button>
                    </div>
                  </div>
                ))}
                {wallets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No wallets added yet. Add your first wallet to get started!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNetworkFilter(['ETHEREUM'])}
                >
                  Ethereum Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNetworkFilter(['POLYGON'])}
                >
                  Polygon Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNetworkFilter([])}
                >
                  All Networks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={tx.type === 'RECEIVE' ? 'default' : 'secondary'}>
                            {tx.type}
                          </Badge>
                          <Badge variant="outline">{tx.network}</Badge>
                          <Badge 
                            variant={tx.status === 'CONFIRMED' ? 'default' : 'destructive'}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tx.valueFormatted} {tx.assetSymbol}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {tx.valueUsd && (
                          <p className="text-sm font-medium">
                            ${tx.valueUsd.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </div>
                  )}
                  {pagination && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages} 
                        ({pagination.total} total)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-wallet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddWallet} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-name">Wallet Name</Label>
                  <Input
                    id="wallet-name"
                    value={newWalletForm.name}
                    onChange={(e) =>
                      setNewWalletForm({ ...newWalletForm, name: e.target.value })
                    }
                    placeholder="My Ethereum Wallet"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    value={newWalletForm.address}
                    onChange={(e) =>
                      setNewWalletForm({ ...newWalletForm, address: e.target.value })
                    }
                    placeholder="0x742d35Cc6673C4532E4C6F5d72c4c2E2B9f1e4A7"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <select
                      id="network"
                      className="w-full p-2 border rounded-md"
                      value={newWalletForm.network}
                      onChange={(e) =>
                        setNewWalletForm({
                          ...newWalletForm,
                          network: e.target.value as NetworkType,
                        })
                      }
                    >
                      <option value="ETHEREUM">Ethereum</option>
                      <option value="POLYGON">Polygon</option>
                      <option value="BSC">Binance Smart Chain</option>
                      <option value="ARBITRUM">Arbitrum</option>
                      <option value="OPTIMISM">Optimism</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet-type">Wallet Type</Label>
                    <select
                      id="wallet-type"
                      className="w-full p-2 border rounded-md"
                      value={newWalletForm.type}
                      onChange={(e) =>
                        setNewWalletForm({
                          ...newWalletForm,
                          type: e.target.value as WalletType,
                        })
                      }
                    >
                      <option value="HOT_WALLET">Hot Wallet</option>
                      <option value="COLD_WALLET">Cold Wallet</option>
                      <option value="EXCHANGE">Exchange</option>
                      <option value="MULTI_SIG">Multi-Sig</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={createWalletMutation.isPending}
                  className="w-full"
                >
                  {createWalletMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Wallet
                </Button>

                {createWalletMutation.error && (
                  <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
                    Error: {createWalletMutation.error.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}