"use client";

import React from "react";
import { 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Wifi,
  WifiOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useCryptoStore } from "@/lib/stores/crypto-store";
import { useRealtimeSync } from "@/components/providers/realtime-sync-provider";
import { cn } from "@/lib/utils";
import { useCryptoWallets } from "@/lib/queries";

interface SyncStatusIndicatorProps {
  variant?: "minimal" | "compact" | "detailed";
  showProgress?: boolean;
  showLastSync?: boolean;
  showTrigger?: boolean;
  className?: string;
}

export function SyncStatusIndicator({
  variant = "compact",
  showProgress = true,
  showLastSync = true,
  showTrigger = true,
  className
}: SyncStatusIndicatorProps) {
  const { realtimeSyncStates, realtimeSyncConnected, realtimeSyncError } = useCryptoStore();
  const { data: wallets = [] } = useCryptoWallets();
  const { resetConnection } = useRealtimeSync();
  const [isOnline, setIsOnline] = React.useState(true);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Calculate sync stats from SSE states
  const syncingWallets = Object.values(realtimeSyncStates).filter(
    state => ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(state.status)
  );

  const completedWallets = Object.values(realtimeSyncStates).filter(
    state => state.status === 'completed'
  );

  const failedWallets = Object.values(realtimeSyncStates).filter(
    state => state.status === 'failed'
  );

  const totalWallets = wallets.length;
  const isAnySyncing = syncingWallets.length > 0;
  const hasConnectionError = realtimeSyncError || !realtimeSyncConnected;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: "text-gray-500",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        status: "offline",
        message: "Offline - Sync unavailable",
        description: "Check your internet connection to sync wallets"
      };
    }

    if (hasConnectionError) {
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        status: "connection_error",
        message: "Connection error",
        description: realtimeSyncError || "Not connected to sync service"
      };
    }

    if (isAnySyncing) {
      return {
        icon: RefreshCw,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        status: "syncing",
        message: "Syncing wallets...",
        description: `${syncingWallets.length} wallet${syncingWallets.length !== 1 ? 's' : ''} syncing`
      };
    }

    if (failedWallets.length > 0) {
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        status: "error",
        message: `${failedWallets.length} wallet${failedWallets.length !== 1 ? 's' : ''} failed`,
        description: "Some wallets couldn't be synced. Try manual sync."
      };
    }

    if (totalWallets === 0) {
      return {
        icon: Clock,
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        status: "empty",
        message: "No wallets",
        description: "Add crypto wallets to start syncing"
      };
    }

    if (completedWallets.length === totalWallets && totalWallets > 0) {
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        status: "success",
        message: "All wallets synced",
        description: `${totalWallets} wallet${totalWallets !== 1 ? 's' : ''} up to date`
      };
    }

    return {
      icon: Wifi,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      status: "connected",
      message: "Connected",
      description: "Ready to sync wallets"
    };
  };

  const statusInfo = getStatusInfo();

  // Get latest completion time from any wallet
  const getLastSyncTime = () => {
    const completionTimes = Object.values(realtimeSyncStates)
      .map(state => state.completedAt)
      .filter(Boolean) as Date[];

    if (completionTimes.length === 0) return null;
    return new Date(Math.max(...completionTimes.map(d => d.getTime())));
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const lastSyncTime = getLastSyncTime();

  // Minimal variant - just an icon
  if (variant === "minimal") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center", className)}>
            <statusInfo.icon
              className={cn(
                "size-4",
                statusInfo.color,
                isAnySyncing && "animate-spin"
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{statusInfo.message}</p>
            <p className="text-muted-foreground">{statusInfo.description}</p>
            {showLastSync && lastSyncTime && (
              <p className="text-muted-foreground">Last sync: {formatLastSync(lastSyncTime)}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Compact variant - icon + badge
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md", statusInfo.bgColor)}>
          <statusInfo.icon
            className={cn(
              "size-3",
              statusInfo.color,
              isAnySyncing && "animate-spin"
            )}
          />
          <span className={cn("text-xs font-medium", statusInfo.color)}>
            {totalWallets > 0 ? `${completedWallets.length}/${totalWallets}` : '0'}
          </span>
        </div>

        {showProgress && isAnySyncing && (
          <div className="flex-1 max-w-28">
            <Progress value={Math.round((syncingWallets.reduce((sum, w) => sum + w.progress, 0) / syncingWallets.length) || 0)} className="h-5" />
          </div>
        )}


        {showTrigger && !isAnySyncing && hasConnectionError && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetConnection}
            className="h-6 w-6 p-0"
            title="Reconnect"
          >
            <RefreshCw className="size-3" />
          </Button>
        )}
      </div>
    );
  }

  // Detailed variant - full status display
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1 rounded", statusInfo.bgColor)}>
            <statusInfo.icon
              className={cn(
                "size-4",
                statusInfo.color,
                isAnySyncing && "animate-spin"
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{statusInfo.message}</p>
            <p className="text-xs text-muted-foreground">{statusInfo.description}</p>
          </div>
        </div>

        {showTrigger && hasConnectionError && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetConnection}
            className="h-7"
          >
            <RefreshCw className="size-3 mr-1" />
            Reconnect
          </Button>
        )}
      </div>

      {showProgress && isAnySyncing && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round((syncingWallets.reduce((sum, w) => sum + w.progress, 0) / syncingWallets.length) || 0)}%</span>
          </div>
          <Progress value={Math.round((syncingWallets.reduce((sum, w) => sum + w.progress, 0) / syncingWallets.length) || 0)} className="h-1.5" />
        </div>
      )}

      {showLastSync && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last sync:</span>
          <span>{formatLastSync(lastSyncTime)}</span>
        </div>
      )}

      {/* Status badges */}
      <div className="flex items-center gap-2">
        {!isOnline && (
          <Badge variant="secondary" className="text-xs">
            <WifiOff className="size-2 mr-1" />
            Offline
          </Badge>
        )}
        
        {realtimeSyncConnected && !isAnySyncing && (
          <Badge variant="outline" className="text-xs">
            <CheckCircle2 className="size-2 mr-1" />
            Connected
          </Badge>
        )}

        {isOnline && (
          <Badge variant="outline" className="text-xs">
            <Wifi className="size-2 mr-1" />
            Online
          </Badge>
        )}
      </div>
    </div>
  );
}