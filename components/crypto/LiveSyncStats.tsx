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
import { useAutoSync } from "@/lib/hooks/use-auto-sync";
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
  const { syncStats, triggerSync, shouldAutoSync } = useAutoSync();

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
    if (syncStats.isAutoSyncing) return "text-blue-600 dark:text-blue-400";
    if (syncStats.failedWallets > 0) return "text-red-600 dark:text-red-400";
    if (syncStats.syncedWallets === syncStats.totalWallets && syncStats.totalWallets > 0) {
      return "text-green-600 dark:text-green-400";
    }
    return "text-muted-foreground";
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {syncStats.isAutoSyncing ? (
            <RefreshCw className="size-4 animate-spin text-blue-500" />
          ) : (
            <Activity className="size-4 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {syncStats.syncedWallets}/{syncStats.totalWallets}
          </span>
        </div>
        
        {syncStats.isAutoSyncing && (
          <div className="flex-1 max-w-20">
            <Progress value={syncStats.syncProgress} className="h-1" />
          </div>
        )}
        
        <span className="text-xs text-muted-foreground">
          {formatLastSync(syncStats.lastSyncTime)}
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
              onClick={triggerSync}
              disabled={syncStats.isAutoSyncing}
              className="h-6 px-2"
            >
              <RefreshCw className={`size-3 ${syncStats.isAutoSyncing ? 'animate-spin' : ''}`} />
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
              {syncStats.syncedWallets}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <XCircle className="size-3 text-red-500" />
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {syncStats.failedWallets}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {syncStats.isAutoSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Syncing wallets...</span>
              <span className="font-medium">{syncStats.syncProgress}%</span>
            </div>
            <Progress value={syncStats.syncProgress} className="h-2" />
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <RefreshCw className="size-3 animate-spin" />
              <span>{syncStats.syncingWallets} wallet{syncStats.syncingWallets !== 1 ? 's' : ''} syncing</span>
            </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {syncStats.isAutoSyncing ? (
              <Badge variant="secondary" className="text-xs">
                <RefreshCw className="size-3 mr-1 animate-spin" />
                Syncing
              </Badge>
            ) : syncStats.totalWallets === 0 ? (
              <Badge variant="outline" className="text-xs">
                <Clock className="size-3 mr-1" />
                No Wallets
              </Badge>
            ) : syncStats.failedWallets > 0 ? (
              <Badge variant="destructive" className="text-xs">
                <XCircle className="size-3 mr-1" />
                {syncStats.failedWallets} Failed
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="size-3 mr-1" />
                All Synced
              </Badge>
            )}
            
            {shouldAutoSync && !syncStats.isAutoSyncing && (
              <Badge variant="outline" className="text-xs">
                <Zap className="size-3 mr-1" />
                Auto-sync Ready
              </Badge>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground">
            {formatLastSync(syncStats.lastSyncTime)}
          </span>
        </div>

        {/* Total Wallets */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Wallets</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="size-3 text-muted-foreground" />
              <span className="font-medium">{syncStats.totalWallets}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}