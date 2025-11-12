'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Activity, AlertCircle } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import { ChainBadge } from "./ui/ChainBadge";
import { CurrencyDisplay } from "../ui/currency-display";
import { CryptoWallet } from "@/lib/types/crypto";
import { useSyncCryptoWallet } from "@/lib/queries";
import { useCryptoStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import {
  SolarCheckCircleBoldDuotone,
  SolarClockCircleBoldDuotone,
} from "../icons/icons";
import { useState } from "react";
import { Card } from "../ui/card";

interface WalletCardProps {
  wallet: CryptoWallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const router = useRouter();
  const { realtimeSyncStates } = useCryptoStore();
  const { mutate: syncWallet } = useSyncCryptoWallet();
  const [copied, setCopied] = useState(false);

  const balance = parseFloat(wallet.totalBalanceUsd || "0");
  const avatarUrl = createAvatar(botttsNeutral, {
    size: 128,
    seed: wallet.address,
    radius: 20,
  }).toDataUri();

  const walletSyncState = realtimeSyncStates[wallet.id];
  const isSyncing =
    walletSyncState &&
    [
      "queued",
      "syncing",
      "syncing_assets",
      "syncing_transactions",
      "syncing_nfts",
      "syncing_defi",
    ].includes(walletSyncState.status);

  const handleWalletClick = () => router.push(`/accounts/wallet/${wallet.id}`);

  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    return explorers[network] || "#";
  };

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getSyncStatusIcon = (walletId: string) => {
    const syncState = realtimeSyncStates[walletId];
    const isSyncing =
      syncState &&
      [
        "queued",
        "syncing",
        "syncing_assets",
        "syncing_transactions",
        "syncing_nfts",
        "syncing_defi",
      ].includes(syncState.status);

    if (isSyncing) {
      return <Activity className="h-3.5 w-3.5 text-primary animate-spin" />;
    }

    switch (syncState?.status) {
      case "completed":
        return (
          <SolarCheckCircleBoldDuotone className="h-4 w-4 text-lime-600 dark:text-green-400" />
        );
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return (
          <SolarClockCircleBoldDuotone className="h-4 w-4 text-yellow-600" />
        );
    }
  };

  return (
    <Card
      onClick={handleWalletClick}

      className={cn(
        "group relative flex flex-col gap-3  border-border/60 bg-card backdrop-blur-sm",
        "shadow-sm transition-all duration-75 cursor-pointer p-3"
      )}
    >
      {/* Header: Wallet Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-11 w-11 rounded-full overflow-hidden bg-muted relative">
              <Image
                src={avatarUrl}
                alt="Wallet Avatar"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center shadow-sm"
              title="Sync Status"
            >
              {getSyncStatusIcon(wallet.id)}
            </div>
          </div>

          {/* Wallet Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3
                className="font-semibold text-sm leading-tight truncate"
                title={wallet.name}
              >
                {wallet.name}
              </h3>
              <ChainBadge network={wallet.network} />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-mono tracking-tight">
                {formatAddress(wallet.address)}
              </span>

              {/* Copy Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleCopyAddress(wallet.address, e)}
                className={cn(
                  "h-4 w-4 hover:bg-accent/50 transition",
                  copied && "text-green-600"
                )}
                title={copied ? "Copied!" : "Copy Address"}
              >
                <Copy className="h-2.5 w-2.5" />
              </Button>

              {/* Explorer Link */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-accent/50 transition"
                title="View on Explorer"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={getNetworkExplorerUrl(wallet.network, wallet.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Balance
          </p>
          <CurrencyDisplay
            amountUSD={balance}
            className="font-bold text-base sm:text-lg"
          />
        </div>
      </div>

      {/* Sync Progress */}
      {isSyncing && walletSyncState && (
        <div className="border-t border-border/40 pt-2 mt-1 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{walletSyncState.message || "Syncing..."}</span>
            {walletSyncState.progress !== undefined && (
              <span className="font-semibold">{walletSyncState.progress}%</span>
            )}
          </div>
          {walletSyncState.progress !== undefined && (
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/80 to-primary transition-[width] duration-200"
                style={{ width: `${walletSyncState.progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default WalletCard;
