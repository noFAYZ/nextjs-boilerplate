'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  RefreshCw, 
  Wallet,
  Copy,
  ExternalLink,
  TrendingUp,
  Loader2,
  Filter,
  SortAsc,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import custom hooks and components
import {
  useWallets,
  useCreateWallet,
  useSyncManager,
  useViewPreferences,
  useFilterManager,
  useDeleteWallet,
  useSyncWallet
} from '@/lib/hooks/use-crypto';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import type { CryptoWallet, NetworkType, WalletType } from '@/lib/types/crypto';
import { SyncWalletsDialog } from '@/components/crypto/SyncWalletsDialog';
import { DeleteProgressDialog } from '@/components/ui/progress-dialog';
import { createOperationItem } from '@/lib/types/progress';

export default function WalletsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'lastSync'>('name');
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Use custom hooks
  const { wallets, isLoading, error, refetch } = useWallets();
  const { syncAllWallets, hasActiveSyncs, isSyncing, getActiveSyncs, syncWallet } = useSyncManager();
  const { preferences, setWalletsView } = useViewPreferences();
  const { filters, setNetworkFilter, setWalletTypeFilter, clearFilters, hasActiveFilters } = useFilterManager();
  const deleteWalletMutation = useDeleteWallet();
  
  // Get data from store with memoized selectors
  const { portfolio, filters: storeFilters, viewPreferences } = useCryptoStore();
  
  // Memoize expensive calculations
  const filteredWallets = useMemo(() => {
    console.log('Filtering wallets with:', wallets);
    return wallets.filter((wallet) => {
      // Filter by networks
      if (storeFilters.networks.length > 0 && !storeFilters.networks.includes(wallet.network)) {
        return false;
      }
      
      // Filter by wallet types
      if (storeFilters.walletTypes.length > 0 && !storeFilters.walletTypes.includes(wallet.type)) {
        return false;
      }
      
      // Hide dust assets if preference is set
   /*    if (viewPreferences.hideDustAssets && 
          parseFloat(wallet.totalBalanceUsd) < viewPreferences.dustThreshold) {
        return false;
      } */
      
      return true;
    });
  }, [wallets, storeFilters.networks, storeFilters.walletTypes, viewPreferences.hideDustAssets, viewPreferences.dustThreshold]);

  const totalPortfolioValue = useMemo(() => {
    return portfolio?.totalValueUsd || 0;
  }, [portfolio?.totalValueUsd]);

  const handleWalletClick = (wallet: CryptoWallet) => {
    router.push(`/dashboard/crypto/wallets/${wallet.id}`);
  };

  const handleCopyAddress = async (address: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent wallet click
    await navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const handleSyncAll = () => {
    if (wallets.length === 0) return;
    setIsSyncDialogOpen(true);
  };

  const handleSyncConfirm = async (walletIds: string[]) => {
    const successWallets: string[] = [];
    const failedWallets: string[] = [];
    
    for (const walletId of walletIds) {
      try {
        await syncWallet(walletId);
        successWallets.push(walletId);
      } catch (error) {
        failedWallets.push(walletId);
      }
    }
    
    return { success: successWallets, failed: failedWallets };
  };

  const handleDeleteConfirm = async (walletIds: string[]) => {
    const successWallets: string[] = [];
    const failedWallets: string[] = [];
    
    for (const walletId of walletIds) {
      try {
        await deleteWalletMutation.mutateAsync(walletId);
        successWallets.push(walletId);
      } catch (error) {
        failedWallets.push(walletId);
      }
    }
    
    return { success: successWallets, failed: failedWallets };
  };

  const toggleWalletSelection = (walletId: string) => {
    setSelectedWallets(prev => 
      prev.includes(walletId) 
        ? prev.filter(id => id !== walletId)
        : [...prev, walletId]
    );
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedWallets([]);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedWallets([]);
  };

  const handleBulkDelete = () => {
    if (selectedWallets.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const getSelectedWalletsData = () => {
    return wallets.filter(wallet => selectedWallets.includes(wallet.id));
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkColor = (network: NetworkType) => {
    const colors = {
      ETHEREUM: 'bg-blue-100 text-blue-800',
      POLYGON: 'bg-purple-100 text-purple-800',
      BSC: 'bg-yellow-100 text-yellow-800',
      ARBITRUM: 'bg-cyan-100 text-cyan-800',
      OPTIMISM: 'bg-red-100 text-red-800',
      AVALANCHE: 'bg-red-100 text-red-800',
      SOLANA: 'bg-green-100 text-green-800',
      BITCOIN: 'bg-orange-100 text-orange-800',
    };
    return colors[network] || 'bg-gray-100 text-gray-800';
  };

  const getNetworkExplorerUrl = (network: string, address: string) => {
    const explorers = {
      ETHEREUM: `https://etherscan.io/address/${address}`,
      POLYGON: `https://polygonscan.com/address/${address}`,
      BSC: `https://bscscan.com/address/${address}`,
      ARBITRUM: `https://arbiscan.io/address/${address}`,
      OPTIMISM: `https://optimistic.etherscan.io/address/${address}`,
    };
    return explorers[network as keyof typeof explorers] || '#';
  };

  // Filter and sort wallets
  const processedWallets = filteredWallets
    .filter(wallet => 
      wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'balance':
          aValue = parseFloat(a.totalBalanceUsd);
          bValue = parseFloat(b.totalBalanceUsd);
          break;
        case 'lastSync':
          aValue = a.lastSyncAt ? new Date(a.lastSyncAt).getTime() : 0;
          bValue = b.lastSyncAt ? new Date(b.lastSyncAt).getTime() : 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

  if (isLoading) {
    return (
      <div className=" mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your wallets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Crypto Wallets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your cryptocurrency wallets
          </p>
        </div>
        <div className="flex gap-2">
          {!isSelectionMode ? (
            <>
              <Button
                onClick={handleSyncAll}
                disabled={isSyncing || hasActiveSyncs() || wallets.length === 0}
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
              <Button
                onClick={enterSelectionMode}
                disabled={wallets.length === 0}
                variant="outline"
                size="sm"
              >
                Select
              </Button>
              <Button asChild>
                <Link href="/dashboard/crypto/wallets/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedWallets.length} selected
              </span>
              <Button
                onClick={handleBulkDelete}
                disabled={selectedWallets.length === 0}
                variant="destructive"
                size="sm"
              >
                Delete Selected
              </Button>
              <Button
                onClick={exitSelectionMode}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                ${totalPortfolioValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{wallets.length}</div>
              <div className="text-sm text-muted-foreground">Total Wallets</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {wallets.reduce((sum, w) => sum + w.assetCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {wallets.reduce((sum, w) => sum + w.nftCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total NFTs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wallets by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'balance' | 'lastSync')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="balance">Sort by Balance</option>
                <option value="lastSync">Sort by Last Sync</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={preferences.walletsView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setWalletsView('grid')}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={preferences.walletsView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setWalletsView('list')}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
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
              onClick={() => setWalletTypeFilter(['HOT_WALLET'])}
            >
              Hot Wallets
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Active Sync Status */}
          {hasActiveSyncs() && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">
                  {getActiveSyncs().length} wallet{getActiveSyncs().length > 1 ? 's' : ''} syncing...
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallets Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            Your Wallets ({processedWallets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">
              Error loading wallets: {error}
            </div>
          )}

          {processedWallets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No wallets found</h3>
              <p className="text-muted-foreground mb-4">
                {wallets.length === 0 
                  ? "Get started by adding your first crypto wallet"
                  : "No wallets match your current search or filter criteria"
                }
              </p>
              {wallets.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard/crypto/wallets/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Wallet
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className={
              preferences.walletsView === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'space-y-3'
            }>
              {processedWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  onClick={() => isSelectionMode ? toggleWalletSelection(wallet.id) : handleWalletClick(wallet)}
                  className={`
                    cursor-pointer border rounded-lg p-4 hover:shadow-md transition-all duration-200
                    ${preferences.walletsView === 'list' ? 'flex items-center justify-between' : ''}
                    ${isSelectionMode && selectedWallets.includes(wallet.id) ? 'ring-2 ring-primary bg-primary/5' : ''}
                  `}
                >
                  {preferences.walletsView === 'grid' ? (
                    // Grid View
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {isSelectionMode && (
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedWallets.includes(wallet.id)
                                ? 'bg-primary border-primary text-white'
                                : 'border-muted-foreground'
                            }`}>
                              {selectedWallets.includes(wallet.id) && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          )}
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold truncate">{wallet.name}</h3>
                            <div className="flex gap-1 mt-1">
                              <Badge className={getNetworkColor(wallet.network)} variant="secondary">
                                {wallet.network}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {wallet.syncStatus && (
                          <Badge 
                            variant={wallet.syncStatus === 'SUCCESS' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {wallet.syncStatus}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Address:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{formatAddress(wallet.address)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleCopyAddress(wallet.address, e)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-6 w-6 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={getNetworkExplorerUrl(wallet.network, wallet.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted p-2 rounded">
                          <div className="text-lg font-bold">
                            ${parseFloat(wallet.totalBalanceUsd).toLocaleString()}
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{wallet.assetCount} assets</span>
                            <span>{wallet.nftCount} NFTs</span>
                          </div>
                        </div>

                        {wallet.lastSyncAt && (
                          <div className="text-xs text-muted-foreground">
                            Last sync: {new Date(wallet.lastSyncAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center gap-4 w-full">
                      {isSelectionMode && (
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedWallets.includes(wallet.id)
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedWallets.includes(wallet.id) && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{wallet.name}</h3>
                          <Badge className={getNetworkColor(wallet.network)} variant="secondary">
                            {wallet.network}
                          </Badge>
                          {wallet.syncStatus && (
                            <Badge 
                              variant={wallet.syncStatus === 'SUCCESS' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {wallet.syncStatus}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">
                            {formatAddress(wallet.address)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleCopyAddress(wallet.address, e)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          ${parseFloat(wallet.totalBalanceUsd).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {wallet.assetCount} assets • {wallet.nftCount} NFTs
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Dialogs */}
      <SyncWalletsDialog
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
        wallets={wallets}
        onConfirm={handleSyncConfirm}
      />
      
      <DeleteProgressDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        items={getSelectedWalletsData().map(wallet => 
          createOperationItem(wallet.id, wallet.name || `${wallet.address.slice(0, 8)}...${wallet.address.slice(-4)}`)
        )}
        onConfirm={handleDeleteConfirm}
        itemType="wallet"
      />
    </div>
  );
}