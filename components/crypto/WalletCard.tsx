'use client'
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, RefreshCw, ChevronRight, Activity, AlertCircle } from "lucide-react";

import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import { ChainBadge } from "./ui/ChainBadge";
import { CurrencyDisplay } from "../ui/currency-display";
import { CryptoWallet } from "@/lib/types/crypto";
import {  useSyncCryptoWallet } from "@/lib/queries";
import { useCryptoStore } from "@/lib/stores";
import { useRouter } from 'next/navigation';
import { SolarCheckCircleBoldDuotone, SolarClockCircleBoldDuotone } from "../icons/icons";

interface WalletCardProps {
    wallet: CryptoWallet;

  }

const WalletCard: React.FC<WalletCardProps> = ({
  wallet,

}) => {
const router = useRouter();

  const balance = parseFloat(wallet.totalBalanceUsd || "0");
  const avataUrl = createAvatar(botttsNeutral, {
    size: 128,
    seed: wallet.address,
    radius: 20,
  }).toDataUri();

  const { realtimeSyncStates } = useCryptoStore();
  const { mutate: syncWallet } = useSyncCryptoWallet();
  const walletSyncState = realtimeSyncStates[wallet.id];
  const isSyncing = walletSyncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(walletSyncState.status);


  

  const handleWalletClick = (walletId: string) => {
    router.push(`/accounts/wallet/${walletId}`);

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

  return (
    <div
      onClick={() => handleWalletClick(wallet.id)}
      className={cn(
        "group border bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors duration-75 cursor-pointer p-3 min-w-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3 ">
        <div className="flex items-start gap-3 ">
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
            <ChainBadge network={wallet.network} />
          </div>

          {/* Address with Actions */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-mono text-xs">{formatAddress(wallet.address)}</span>
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


          <div className="items-end text-end">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider  ">
              {'Balance'}
            </p>
            <div className="font-bold text-base truncate">
              <CurrencyDisplay amountUSD={balance}  />
            </div>
          </div>
        
      </div>



      {/* Sync Progress Indicator */}
      {isSyncing && walletSyncState && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>{walletSyncState.message || "Syncing..."}</span>
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
};

export default WalletCard;