'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  RefreshCw,
  Wallet,
  Copy,
  ExternalLink,
  Loader2,
  SortAsc,
  ChevronRight,
  Activity,
  Star,
  Layers,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings,
  Trash2,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

// Import TanStack Query hooks and UI store
import {
  useOrganizationCryptoWallets,
  useOrganizationDeleteCryptoWallet,
  useOrganizationSyncCryptoWallet,
} from '@/lib/queries/use-organization-data-context';
import { useSyncAllCryptoWallets } from '@/lib/queries';
import { useCryptoUIStore } from '@/lib/stores/ui-stores';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import type { CryptoWallet } from '@/lib/types/crypto';
import {  SolarCheckCircleBoldDuotone, SolarClockCircleBoldDuotone, StreamlineFlexWallet } from '@/components/icons/icons';
import { AddWalletModal } from '@/components/crypto/AddWalletModal';
import { SyncStatusIndicator } from '@/components/crypto/SyncStatusIndicator';
import { WalletSyncModal } from '@/components/crypto/wallet-sync-modal';
import { LogoLoader } from '@/components/icons';
import { ZERION_CHAINS } from '@/lib/constants/chains';
import { ChainBadge } from '@/components/crypto/ui/ChainBadge';

// PRODUCTION-GRADE: Establish real-time sync connection only on this page
import { useRealtimeSyncConnection } from '@/lib/hooks/use-realtime-sync-connection';

interface WalletCardProps {
  wallet: CryptoWallet;
  onWalletClick: (wallet: CryptoWallet) => void;
  onCopyAddress: (address: string, e: React.MouseEvent) => void;
  getNetworkExplorerUrl: (network: string, address: string) => string;
  isManageMode?: boolean;
  isSelected?: boolean;
  onSelect?: (walletId: string, selected: boolean) => void;
  onSyncStatusClick?: (walletId: string) => void;
}

function WalletCard({ wallet, onWalletClick, onCopyAddress, getNetworkExplorerUrl, isManageMode = false, isSelected = false, onSelect, onSyncStatusClick }: WalletCardProps) {
  const { realtimeSyncStates } = useCryptoStore();
  const avataUrl = createAvatar(botttsNeutral, {
    size: 128,
    seed: wallet.address,
    radius: 20,
  }).toDataUri();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getNetworkColor = () => {
    // Use theme-compliant colors only
    return 'bg-secondary text-secondary-foreground';
  };

  // Get SSE-based sync status for this wallet
  const walletSyncState = realtimeSyncStates[wallet.id];
  const isSyncing = walletSyncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(walletSyncState.status);

  const getSyncStatusIcon = () => {
    if (isSyncing) {
      return <Activity className="h-3 w-3 text-primary animate-pulse" />;
    }

    switch (walletSyncState?.status) {
      case 'completed':
        return <SolarCheckCircleBoldDuotone className="h-5 w-5 text-lime-700 dark:text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <SolarClockCircleBoldDuotone className="h-5 w-5 text-yellow-700" />;
    }
  };

  

  const handleCardClick = () => {
    if (isManageMode && onSelect) {
      onSelect(wallet.id, !isSelected);
    } else {
      onWalletClick(wallet);
    }
  };

  return (
    <div
      className={cn(
        "group border bg-muted/60 rounded-xl hover:bg-muted transition-colors duration-75 cursor-pointer",
        isSelected && " border-primary/55 "
      )}
      onClick={handleCardClick}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Selection Checkbox in Manage Mode */}
          {isManageMode && (
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect?.(wallet.id, e.target.checked);
                }}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
          )}

          {/* Compact Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
              <Image src={avataUrl} fill alt="Wallet Avatar" className="rounded-lg" unoptimized />
            </div>
            <button
              className="absolute -top-1 -right-1 h-5 w-5 bg-background rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSyncStatusClick?.(wallet.id);
              }}
              title="View sync status"
            >
              {getSyncStatusIcon()}
            </button>
          </div>

          {/* Wallet Name & Network */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{wallet.name}</h3>
            
      <ChainBadge network={wallet.network} size={16}  />
      
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">
                {formatAddress(wallet.address)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onCopyAddress(wallet.address, e)}
                className="h-5 w-5 p-0 hover:bg-muted"
                title="Copy Address"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-5 w-5 p-0 hover:bg-muted"
                title="View on Explorer"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={getNetworkExplorerUrl(wallet.network, wallet.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* Compact Stats */}
          <div className="hidden md:flex items-center gap-6 text-right">
            <div>
              <div className="font-semibold text-sm">
                <CurrencyDisplay
                  amountUSD={parseFloat(wallet.totalBalanceUsd)}
                  variant="small"
                />
              </div>
              <div className="text-xs text-muted-foreground">Portfolio</div>
            </div>

         {/*    <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {wallet.assetCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {wallet.nftCount || 0}
              </span>
            </div> */}
          </div>

          {/* Mobile Portfolio Value */}
          <div className="md:hidden text-right">
            <div className="font-semibold text-sm">
              <CurrencyDisplay
                amountUSD={parseFloat(wallet.totalBalanceUsd)}
                variant="small"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {wallet.assetCount || 0} assets
            </div>
          </div>

          {/* Subtle Arrow */}
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function WalletsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'lastSync'>('balance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncingWalletId, setSyncingWalletId] = useState<string | null>(null);

  // PRODUCTION-GRADE: Establish SSE connection ONLY on this page (not globally)
  const { isConnected: isRealtimeConnected } = useRealtimeSyncConnection({
    enableCrypto: true,
    enableBanking: false,
  });

  // ✅ NEW: Data from TanStack Query (organization-aware)
  const { data: wallets = [], isLoading, error } = useOrganizationCryptoWallets();
  const { mutate: deleteWallet, isPending: isDeleting } = useOrganizationDeleteCryptoWallet();
  const { mutate: syncWallet } = useOrganizationSyncCryptoWallet();
  const { mutate: syncAllWallets, isPending: isSyncingAll } = useSyncAllCryptoWallets();

  // ✅ NEW: UI state from UI store
  const { filters, setNetworkFilter, clearFilters, hasActiveFilters } = useCryptoUIStore();

  // Get SSE sync states from crypto store (only for real-time sync progress)
  const { realtimeSyncStates } = useCryptoStore();

  // Check if any wallets are actively syncing via SSE
  const hasActiveSyncs = () => {
    return Object.values(realtimeSyncStates).some(state =>
      ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
    );
  };

  const getActiveSyncs = () => {
    return Object.keys(realtimeSyncStates).filter(walletId =>
      ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(realtimeSyncStates[walletId].status)
    );
  };

  // Memoize expensive calculations
  const filteredWallets = useMemo(() => {
    return wallets.filter((wallet) => {
      // Filter by networks
      if (filters.networks.length > 0 && !filters.networks.includes(wallet.network)) {
        return false;
      }

      // Filter by wallet types
      if (filters.walletTypes.length > 0 && !filters.walletTypes.includes(wallet.type)) {
        return false;
      }

      return true;
    });
  }, [wallets, filters.networks, filters.walletTypes]);

  const portfolioStats = useMemo(() => {
    const totalValue = filteredWallets.reduce((sum, wallet) => sum + parseFloat(wallet.totalBalanceUsd), 0);
    const totalAssets = filteredWallets.reduce((sum, wallet) => sum + (wallet.assetCount || 0), 0);
    const totalNFTs = filteredWallets.reduce((sum, wallet) => sum + (wallet.nftCount || 0), 0);
    const activeWallets = filteredWallets.filter(w => parseFloat(w.totalBalanceUsd) > 0).length;

    return {
      totalValue,
      totalAssets,
      totalNFTs,
      activeWallets,
      totalWallets: filteredWallets.length
    };
  }, [filteredWallets]);

  const handleWalletClick = (wallet: CryptoWallet) => {
    router.push(`/accounts/wallet/${wallet.id}`);
  };

  const handleCopyAddress = async (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleSyncAll = () => {
    syncAllWallets();
  };

  const handleSyncComplete = () => {
    setSyncingWalletId(null);
  };

  const handleSyncStatusClick = (walletId: string) => {
    setSyncingWalletId(walletId);
  };

  const handleManageMode = () => {
    setIsManageMode(!isManageMode);
    setSelectedWallets(new Set()); // Clear selections when toggling mode
  };

  const handleWalletSelect = (walletId: string, selected: boolean) => {
    const newSelected = new Set(selectedWallets);
    if (selected) {
      newSelected.add(walletId);
    } else {
      newSelected.delete(walletId);
    }
    setSelectedWallets(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedWallets.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedWallets.size} wallet${selectedWallets.size > 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // ✅ Delete all selected wallets using mutation
      for (const walletId of Array.from(selectedWallets)) {
        await new Promise((resolve, reject) => {
          deleteWallet(walletId, {
            onSuccess: resolve,
            onError: reject
          });
        });
      }

      // Clear selections and exit manage mode
      setSelectedWallets(new Set());
      setIsManageMode(false);
    } catch (error) {
      console.error('Failed to delete wallets:', error);
    }
  };

  const getNetworkExplorerUrl = (network: string, address: string) => {
    const explorers = {
      ETHEREUM: `https://etherscan.io/address/${address}`,
      POLYGON: `https://polygonscan.com/address/${address}`,
      BSC: `https://bscscan.com/address/${address}`,
      ARBITRUM: `https://arbiscan.io/address/${address}`,
      OPTIMISM: `https://optimistic.etherscan.io/address/${address}`,
      AVALANCHE: `https://snowtrace.io/address/${address}`,
    };
    return explorers[network as keyof typeof explorers] || '#';
  };

  // Filter and sort wallets
  const processedWallets = filteredWallets
    .filter(wallet =>
      wallet?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      wallet?.address?.toLowerCase()?.includes(searchQuery?.toLowerCase())
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


<div className=" relative h-screen  bg-background/50 backdrop-blur-sm  z-10 flex items-center justify-center">
<Card className="px-5 border-border shadow-none " >
  <div className="flex items-center space-x-3">
    <LogoLoader className="w-8 h-8" />
    <span className="text-sm font-medium">Loading your wallets....</span>
  </div>
</Card>
</div>
    );
  }

  return (
    <>



      <div className="max-w-3xl mx-auto p-4 lg:p-6 space-y-4">
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                <StreamlineFlexWallet className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Crypto Wallets</h1>
                <p className="text-xs text-muted-foreground">
                  Monitor and manage your cryptocurrency portfolio
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isManageMode && selectedWallets.size > 0 && (
              <Button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                variant="destructive"
                size="xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete ({selectedWallets.size})
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={handleSyncAll}
              disabled={isSyncingAll || hasActiveSyncs() || isManageMode}
              variant="outline"
              size="xs"
            >
              {isSyncingAll || hasActiveSyncs() ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Syncing ({getActiveSyncs().length})
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync All
                </>
              )}
            </Button>

            <Button
              onClick={handleManageMode}
              variant={isManageMode ? "default" : "outline"}
              size="xs"
              disabled={isSyncingAll || hasActiveSyncs()}
            >
              {isManageMode ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </>
              )}
            </Button>

            {!isManageMode && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                size="xs"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Portfolio Overview Dashboard */}
    

        {/* Controls Section */}
      
            <div className="flex flex-col lg:flex-row justify-end gap-3 mt-20">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  placeholder="Search wallets by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-border"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'balance' | 'lastSync')}
                  className="px-3 py-2 border rounded-lg text-xs bg-background min-w-[140px]"
                >
                  <option value="balance">Sort by Balance</option>
                  <option value="name">Sort by Name</option>
                  <option value="lastSync">Sort by Last Sync</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                >
                  <SortAsc className={cn("h-4 w-4 transition-transform", sortOrder === 'desc' && 'rotate-180')} />
                </Button>
              </div>

            </div>

            {/* Network Filters 
            <div className="flex flex-wrap gap-2  mb-7 justify-end items-center">
              <span className="text-xs font-medium text-muted-foreground mr-2">Quick Filters:</span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setNetworkFilter(['ETHEREUM'])}
              
              >
                Ethereum
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setNetworkFilter(['POLYGON'])}
           
              >
                Polygon
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setNetworkFilter(['BSC'])}
            
              >
                BSC
              </Button>
              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground h-7"
                >
                  Clear Filters
                </Button>
              )}
            </div>*/}
      


            <SyncStatusIndicator
              variant="compact"
              showProgress={true}
              showLastSync={true}
              showTrigger={true}
            />
    

        {/* Wallets Display */}
   
            {error && (
              <Card variant="outlined" className="mb-6 border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Failed to load wallets</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {processedWallets.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-18 w-18 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <StreamlineFlexWallet className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {wallets.length === 0 ? 'No wallets connected' : 'No wallets match your filters'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                  {wallets.length === 0
                    ? 'Connect your first crypto wallet to start tracking your portfolio and managing your digital assets'
                    : 'Try adjusting your search terms or filters to find the wallets you\'re looking for'
                  }
                </p>
                {wallets.length === 0 && (
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    size="xs"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Connect Your First Wallet
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-1  gap-4">
                {processedWallets.map((wallet) => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    onWalletClick={handleWalletClick}
                    onCopyAddress={handleCopyAddress}
                    getNetworkExplorerUrl={getNetworkExplorerUrl}
                    isManageMode={isManageMode}
                    isSelected={selectedWallets.has(wallet.id)}
                    onSelect={handleWalletSelect}
                    onSyncStatusClick={handleSyncStatusClick}
                  />
                ))}
              </div>
            )}

      </div>

      {/* Add Wallet Modal */}
      <AddWalletModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Sync Progress Modal 
      {syncingWalletId && (
        <WalletSyncModal
          isOpen={true}
          onClose={() => setSyncingWalletId(null)}
          walletId={syncingWalletId}
          walletName={wallets.find(w => w.id === syncingWalletId)?.name}
          onSyncComplete={handleSyncComplete}
        />
      )}*/}

   
    </> 
  );
}