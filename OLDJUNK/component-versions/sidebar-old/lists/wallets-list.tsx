'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCryptoStore } from '@/lib/stores/crypto-store';
import { useOrganizationSyncCryptoWallet, useOrganizationCryptoWallets } from '@/lib/queries/use-organization-data-context';
import { Wallet2, Plus, Copy, ExternalLink, RefreshCw, Activity, AlertCircle, Loader2, ChevronRight, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { SolarCheckCircleBoldDuotone, SolarClockCircleBoldDuotone, SolarWalletMoneyLinear, StreamlineFlexWallet } from '@/components/icons/icons';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import type { CryptoWallet } from '@/lib/types/crypto';
import { ChainBadge } from '@/components/crypto/ui/ChainBadge';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';

interface SidebarWalletsListProps {
  onMobileClose: () => void;
}

export function SidebarWalletsList({ onMobileClose }: SidebarWalletsListProps) {
  const router = useRouter();
  const { data: wallets = [], isLoading: walletsLoading } = useOrganizationCryptoWallets();
  const { realtimeSyncStates } = useCryptoStore();
  const { mutate: syncWallet } = useOrganizationSyncCryptoWallet();
  const { isRefetching } = useOrganizationRefetchState();

  const handleWalletClick = (walletId: string) => {
    router.push(`/accounts/wallet/${walletId}`);
    onMobileClose();
  };

  const handleAddWallet = () => {
    router.push('/accounts/wallet/add');
    onMobileClose();
  };

  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
  };

  const handleSync = (walletId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    syncWallet(walletId);
  };

  const getNetworkExplorerUrl = (network: string, address: string) => {
    const explorers: Record<string, string> = {
      ETHEREUM: `https://etherscan.io/address/${address}`,
      POLYGON: `https://polygonscan.com/address/${address}`,
      BSC: `https://bscscan.com/address/${address}`,
      ARBITRUM: `https://arbiscan.io/address/${address}`,
      OPTIMISM: `https://optimistic.etherscan.io/address/${address}`,
      AVALANCHE: `https://snowtrace.io/address/${address}`,
      SOLANA: `https://solscan.io/account/${address}`,
      BITCOIN: `https://blockchair.com/bitcoin/address/${address}`,
    };
    return explorers[network] || '#';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getSyncStatusIcon = (walletId: string) => {
    const syncState = realtimeSyncStates[walletId];
    const isSyncing = syncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(syncState.status);

    if (isSyncing) {
      return <Activity className="h-3 w-3 text-primary animate-pulse" />;
    }

    switch (syncState?.status) {
      case 'completed':
        return <SolarCheckCircleBoldDuotone className="h-3.5 w-3.5 text-lime-700 dark:text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      default:
        return <SolarClockCircleBoldDuotone className="h-3.5 w-3.5 text-yellow-700" />;
    }
  };

  if (walletsLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-muted/50 rounded-lg h-24"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
          <SolarWalletMoneyLinear className="h-6 w-6 text-muted-foreground" stroke='2' />
        </div>
        <p className="text-xs text-muted-foreground mb-4">No wallets connected</p>
        <Button size="xs" onClick={handleAddWallet} className="w-fit">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />

      {/* Add Wallet Button */}
   
      <div className='flex gap-2 justify-end'> 
      <Button
        size="xs"
        onClick={handleAddWallet}
        className=" justify-start text-xs "
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Wallet
      </Button>
      </div>

      {/* Wallets List */}
      <div className="space-y-2">
        {wallets.map((wallet: CryptoWallet) => {
          const balance = parseFloat(wallet.totalBalanceUsd || '0');
          const avataUrl = createAvatar(botttsNeutral, {
            size: 128,
            seed: wallet.address,
            radius: 20,
          }).toDataUri();

          const walletSyncState = realtimeSyncStates[wallet.id];
          const isSyncing = walletSyncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(walletSyncState.status);

          return (
            <div
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id)}
              className={cn(
                "group border bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors duration-75 cursor-pointer p-3"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar with Sync Status */}
                <div className="relative flex-shrink-0">
                  <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                    <Image src={avataUrl} fill alt="Wallet Avatar" className="rounded-lg" unoptimized />
                  </div>
                  <div
                    className="absolute -top-1 -right-1 h-5 w-5 bg-background rounded-full flex items-center justify-center border border-border"
                    title="Sync status"
                  >
                    {getSyncStatusIcon(wallet.id)}
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{wallet.name}</h3>
                  
                    <ChainBadge network={wallet.network}   />
                  </div>

                  {/* Address with Actions */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-mono text-xs">
                      {formatAddress(wallet.address)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleCopyAddress(wallet.address, e)}
                      className="h-4 w-4 p-0 hover:bg-muted"
                      title="Copy Address"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-4 w-4 p-0 hover:bg-muted"
                      title="View on Explorer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={getNetworkExplorerUrl(wallet.network, wallet.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Balance and Sync Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-xs">
                    <CurrencyDisplay
                      amountUSD={balance}
                      variant="small"
                    />
                  </div>
                
                </div>

                {/* Sync Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleSync(wallet.id, e)}
                  disabled={isSyncing}
                  className="h-7 w-7 p-0"
                  title={isSyncing ? 'Syncing...' : 'Sync wallet'}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
                </Button>

                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>

              {/* Sync Progress Indicator */}
              {isSyncing && walletSyncState && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{walletSyncState.message || 'Syncing...'}</span>
                    {walletSyncState.progress !== undefined && (
                      <span>{walletSyncState.progress}%</span>
                    )}
                  </div>
                  {walletSyncState.progress !== undefined && (
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${walletSyncState.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
