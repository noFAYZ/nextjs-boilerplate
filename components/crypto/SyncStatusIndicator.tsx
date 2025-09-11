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
import { useAutoSync } from "@/lib/hooks/use-auto-sync";
import { cn } from "@/lib/utils";

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
  const { syncStats, triggerSync, shouldAutoSync } = useAutoSync();
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

    if (syncStats.isAutoSyncing) {
      return {
        icon: RefreshCw,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        status: "syncing",
        message: "Syncing wallets...",
        description: `${syncStats.syncingWallets} wallet${syncStats.syncingWallets !== 1 ? 's' : ''} syncing`
      };
    }

    if (syncStats.failedWallets > 0) {
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        status: "error",
        message: `${syncStats.failedWallets} wallet${syncStats.failedWallets !== 1 ? 's' : ''} failed`,
        description: "Some wallets couldn't be synced. Try manual sync."
      };
    }

    if (syncStats.totalWallets === 0) {
      return {
        icon: Clock,
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        status: "empty",
        message: "No wallets",
        description: "Add crypto wallets to start syncing"
      };
    }

    if (syncStats.syncedWallets === syncStats.totalWallets) {
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        status: "success",
        message: "All wallets synced",
        description: `${syncStats.totalWallets} wallet${syncStats.totalWallets !== 1 ? 's' : ''} up to date`
      };
    }

    return {
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      status: "partial",
      message: "Sync incomplete",
      description: `${syncStats.syncedWallets}/${syncStats.totalWallets} wallets synced`
    };
  };

  const statusInfo = getStatusInfo();
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
                syncStats.isAutoSyncing && "animate-spin"
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{statusInfo.message}</p>
            <p className="text-muted-foreground">{statusInfo.description}</p>
            {showLastSync && syncStats.lastSyncTime && (
              <p className="text-muted-foreground">Last sync: {formatLastSync(syncStats.lastSyncTime)}</p>
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
              syncStats.isAutoSyncing && "animate-spin"
            )}
          />
          <span className={cn("text-xs font-medium", statusInfo.color)}>
            {syncStats.totalWallets > 0 ? `${syncStats.syncedWallets}/${syncStats.totalWallets}` : '0'}
          </span>
        </div>

        {showProgress && syncStats.isAutoSyncing && (
          <div className="flex-1 max-w-20">
            <Progress value={syncStats.syncProgress} className="h-1" />
          </div>
        )}

        {shouldAutoSync && !syncStats.isAutoSyncing && (
          <Badge variant="outline" className="text-xs h-5 px-1">
            <Zap className="size-2 mr-0.5" />
            Auto
          </Badge>
        )}

        {showTrigger && !syncStats.isAutoSyncing && isOnline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerSync}
            className="h-6 w-6 p-0"
            title="Sync now"
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
                syncStats.isAutoSyncing && "animate-spin"
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{statusInfo.message}</p>
            <p className="text-xs text-muted-foreground">{statusInfo.description}</p>
          </div>
        </div>

        {showTrigger && !syncStats.isAutoSyncing && isOnline && (
          <Button
            variant="outline"
            size="sm"
            onClick={triggerSync}
            className="h-7"
          >
            <RefreshCw className="size-3 mr-1" />
            Sync
          </Button>
        )}
      </div>

      {showProgress && syncStats.isAutoSyncing && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{syncStats.syncProgress}%</span>
          </div>
          <Progress value={syncStats.syncProgress} className="h-1.5" />
        </div>
      )}

      {showLastSync && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last sync:</span>
          <span>{formatLastSync(syncStats.lastSyncTime)}</span>
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
        
        {shouldAutoSync && !syncStats.isAutoSyncing && (
          <Badge variant="outline" className="text-xs">
            <Zap className="size-2 mr-1" />
            Auto-sync Ready
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