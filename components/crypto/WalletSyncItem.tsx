"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Zap,
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WalletSyncItemProps {
  wallet: {
    id: string;
    name?: string;
    balance?: string;
    value?: string;
    symbol?: string;
    status?: "success" | "loading" | "error" | "warning" | "idle";
    lastSync?: Date;
  };
  realtimeSyncState?: {
    progress: number;
    status: string;
    message?: string;
    startedAt?: string;
  };
  onClick?: () => void;
  className?: string;
}

export function WalletSyncItem({
  wallet,
  realtimeSyncState,
  onClick,
  className
}: WalletSyncItemProps) {
  const isSyncing = realtimeSyncState && [
    'queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'
  ].includes(realtimeSyncState.status);

  const getStatusIcon = () => {
    if (isSyncing) {
      return <RefreshCw className="size-3 text-blue-500 animate-spin" />;
    }
    if (realtimeSyncState?.status === 'failed') {
      return <XCircle className="size-3 text-red-500" />;
    }
    if (realtimeSyncState?.status === 'completed') {
      return <CheckCircle2 className="size-3 text-green-500" />;
    }

    switch (wallet.status) {
      case 'success': return <CheckCircle2 className="size-3 text-green-500" />;
      case 'loading': return <RefreshCw className="size-3 text-blue-500 animate-spin" />;
      case 'error': return <XCircle className="size-3 text-red-500" />;
      case 'warning': return <Clock className="size-3 text-yellow-500" />;
      default: return <Clock className="size-3 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    if (isSyncing) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    if (realtimeSyncState?.status === 'failed') return "text-red-600 bg-red-100 dark:bg-red-900/20";
    if (realtimeSyncState?.status === 'completed') return "text-green-600 bg-green-100 dark:bg-green-900/20";

    switch (wallet.status) {
      case 'success': return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case 'loading': return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case 'error': return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case 'warning': return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getSubtitle = () => {
    if (isSyncing) {
      return `Syncing... ${realtimeSyncState.progress}%`;
    }
    if (realtimeSyncState?.status === 'failed') {
      return realtimeSyncState.message || 'Sync failed';
    }
    if (wallet.balance && wallet.symbol && wallet.value) {
      return `${wallet.balance} ${wallet.symbol} • ${wallet.value}`;
    }
    return wallet.balance || wallet.value || 'No data';
  };

  const getTimestamp = () => {
    if (isSyncing) {
      return 'Syncing now';
    }
    if (realtimeSyncState?.status === 'failed') {
      return 'Sync failed';
    }
    if (wallet.lastSync) {
      return `Last sync: ${getTimeAgo(wallet.lastSync)}`;
    }
    return 'Never synced';
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Status Icon */}
        <div className={cn(
          "p-1.5 rounded-full text-xs font-medium",
          getStatusColor()
        )}>
          {getStatusIcon()}
        </div>

        {/* Wallet Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">
              {wallet.name || `${wallet.id.slice(0, 8)}...${wallet.id.slice(-4)}`}
            </h4>
            {wallet.symbol && (
              <Badge variant="outline" className="text-xs">
                {wallet.symbol}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate mb-1">
            {getSubtitle()}
          </p>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="space-y-1">
              <Progress
                value={realtimeSyncState.progress}
                className="h-1 w-full"
              />
              {realtimeSyncState.message && (
                <p className="text-[10px] text-muted-foreground truncate">
                  {realtimeSyncState.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* External Link Icon */}
        <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}