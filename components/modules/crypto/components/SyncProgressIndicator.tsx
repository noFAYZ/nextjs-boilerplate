"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Zap,
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletSyncStatus {
  walletId: string;
  progress: number;
  status: string;
  message?: string;
  startedAt?: string;
}

interface SyncProgressIndicatorProps {
  syncStats: {
    syncingWallets: WalletSyncStatus[];
    completedWallets: WalletSyncStatus[];
    failedWallets: WalletSyncStatus[];
    totalWallets: number;
    hasActiveSyncs: boolean;
    syncConnected: boolean;
  };
  isAutoSyncing?: boolean;
  className?: string;
}

export function SyncProgressIndicator({
  syncStats,
  isAutoSyncing = false,
  className
}: SyncProgressIndicatorProps) {
  const {
    syncingWallets,
    completedWallets,
    failedWallets,
    totalWallets,
    hasActiveSyncs,
    syncConnected
  } = syncStats;

  const progressPercentage = totalWallets > 0
    ? ((completedWallets.length + failedWallets.length) / totalWallets) * 100
    : 0;

  const getStatusIcon = () => {
    if (!syncConnected) {
      return <XCircle className="size-4 text-red-500" />;
    }
    if (hasActiveSyncs) {
      return <RefreshCw className="size-4 text-blue-500 animate-spin" />;
    }
    if (failedWallets.length > 0) {
      return <XCircle className="size-4 text-red-500" />;
    }
    if (totalWallets > 0 && completedWallets.length === totalWallets) {
      return <CheckCircle2 className="size-4 text-green-500" />;
    }
    return <Clock className="size-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (!syncConnected) {
      return "Connection Lost";
    }
    if (hasActiveSyncs) {
      return `Syncing (${syncingWallets.length})`;
    }
    if (failedWallets.length > 0) {
      return `${failedWallets.length} Failed`;
    }
    if (totalWallets === 0) {
      return "No Wallets";
    }
    if (completedWallets.length === totalWallets) {
      return "All Synced";
    }
    return `${completedWallets.length}/${totalWallets} Synced`;
  };

  const getStatusVariant = () => {
    if (!syncConnected) return "destructive";
    if (hasActiveSyncs) return "default";
    if (failedWallets.length > 0) return "destructive";
    if (completedWallets.length === totalWallets && totalWallets > 0) return "default";
    return "secondary";
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Overall Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        <Badge variant={getStatusVariant() as "default" | "secondary" | "destructive"} className="text-xs">
          {progressPercentage.toFixed(0)}%
        </Badge>
      </div>

      {/* Progress Bar */}
      {totalWallets > 0 && (
        <div className="space-y-1">
          <Progress
            value={progressPercentage}
            className="h-2 w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedWallets.length} completed</span>
            <span>{syncingWallets.length} syncing</span>
            <span>{failedWallets.length} failed</span>
          </div>
        </div>
      )}

      {/* Currently Syncing Wallets */}
      {hasActiveSyncs && syncingWallets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Zap className="size-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Active Syncs
            </span>
          </div>
          <div className="space-y-1.5">
            {syncingWallets.slice(0, 3).map((wallet) => (
              <WalletSyncProgress
                key={wallet.walletId}
                wallet={wallet}
              />
            ))}
            {syncingWallets.length > 3 && (
              <div className="text-xs text-muted-foreground text-center">
                +{syncingWallets.length - 3} more syncing...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <div className={cn(
            "size-2 rounded-full",
            syncConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-xs text-muted-foreground">
            {syncConnected ? "Real-time connected" : "Disconnected"}
          </span>
        </div>
        {isAutoSyncing && (
          <Badge variant="outline" className="text-xs">
            <Activity className="size-3 mr-1" />
            Auto-sync
          </Badge>
        )}
      </div>
    </div>
  );
}

export interface WalletSyncProgressProps {
  wallet: WalletSyncStatus;
}

export function WalletSyncProgress({ wallet }: WalletSyncProgressProps) {
  const getStatusColor = () => {
    switch (wallet.status) {
      case 'queued': return 'text-gray-500';
      case 'syncing':
      case 'syncing_assets':
      case 'syncing_transactions':
      case 'syncing_nfts':
      case 'syncing_defi': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getProgressIcon = () => {
    switch (wallet.status) {
      case 'queued': return <Clock className="size-3" />;
      case 'syncing':
      case 'syncing_assets':
      case 'syncing_transactions':
      case 'syncing_nfts':
      case 'syncing_defi': return <RefreshCw className="size-3 animate-spin" />;
      case 'completed': return <CheckCircle2 className="size-3" />;
      case 'failed': return <XCircle className="size-3" />;
      default: return <Minus className="size-3" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={cn("text-muted-foreground", getStatusColor())}>
          {getProgressIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium truncate">
              {wallet.walletId.slice(0, 8)}...{wallet.walletId.slice(-4)}
            </span>
            <span className="text-xs text-muted-foreground">
              {wallet.progress}%
            </span>
          </div>
          {wallet.message && (
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {wallet.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}