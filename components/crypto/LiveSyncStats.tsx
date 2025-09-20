"use client";

import React from "react";
import { 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Activity,
  Zap,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCryptoStore } from "@/lib/stores/crypto-store";
import { useRealtimeSync } from "@/components/providers/realtime-sync-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveSyncStatsProps {
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function LiveSyncStats({
  compact = false,
  showHeader = true,
  className = ""
}: LiveSyncStatsProps) {
  const { realtimeSyncStates, realtimeSyncConnected, wallets } = useCryptoStore();
  const { resetConnection } = useRealtimeSync();

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
  const averageProgress = isAnySyncing ? Math.round(syncingWallets.reduce((sum, w) => sum + w.progress, 0) / syncingWallets.length) : 0;

  // Get latest completion time
  const getLastSyncTime = () => {
    const completionTimes = Object.values(realtimeSyncStates)
      .map(state => state.completedAt)
      .filter(Boolean) as Date[];

    if (completionTimes.length === 0) return null;
    return new Date(Math.max(...completionTimes.map(d => d.getTime())));
  };

  const lastSyncTime = getLastSyncTime();

  const formatLastSync = (date: Date | null) => {
    if (!date) return "Never";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getSyncStatusColor = () => {
    if (isAnySyncing) return "text-blue-600 dark:text-blue-400";
    if (failedWallets.length > 0) return "text-red-600 dark:text-red-400";
    if (completedWallets.length === totalWallets && totalWallets > 0) {
      return "text-green-600 dark:text-green-400";
    }
    return "text-muted-foreground";
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {isAnySyncing ? (
            <RefreshCw className="size-4 animate-spin text-blue-500" />
          ) : (
            <Activity className="size-4 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {completedWallets.length}/{totalWallets}
          </span>
        </div>

        {isAnySyncing && (
          <div className="flex-1 max-w-20">
            <Progress value={averageProgress} className="h-1" />
          </div>
        )}

        <span className="text-xs text-muted-foreground">
          {formatLastSync(lastSyncTime)}
        </span>
      </div>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="size-4" />
              Sync Status
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetConnection}
              disabled={isAnySyncing}
              className="h-6 px-2"
            >
              <RefreshCw className={`size-3 ${isAnySyncing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Synced</span>
            </div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {completedWallets.length}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <XCircle className="size-3 text-red-500" />
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {failedWallets.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isAnySyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Syncing wallets...</span>
              <span className="font-medium">{averageProgress}%</span>
            </div>
            <Progress value={averageProgress} className="h-2" />
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <RefreshCw className="size-3 animate-spin" />
              <span>{syncingWallets.length} wallet{syncingWallets.length !== 1 ? 's' : ''} syncing</span>
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {isAnySyncing ? (
              <Badge variant="secondary" className="text-xs">
                <RefreshCw className="size-3 mr-1 animate-spin" />
                Syncing
              </Badge>
            ) : totalWallets === 0 ? (
              <Badge variant="outline" className="text-xs">
                <Clock className="size-3 mr-1" />
                No Wallets
              </Badge>
            ) : failedWallets.length > 0 ? (
              <Badge variant="destructive" className="text-xs">
                <XCircle className="size-3 mr-1" />
                {failedWallets.length} Failed
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="size-3 mr-1" />
                All Synced
              </Badge>
            )}

            {realtimeSyncConnected && !isAnySyncing && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="size-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground">
            {formatLastSync(lastSyncTime)}
          </span>
        </div>

        {/* Total Wallets */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Wallets</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="size-3 text-muted-foreground" />
              <span className="font-medium">{totalWallets}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}