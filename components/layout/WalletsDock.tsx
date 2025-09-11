"use client";

import React from "react";
import { 
  Wallet,
  RefreshCw,
  Settings,
  Plus,
  Activity,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExpandableDock } from "@/components/ui/dock";
import { useWalletDock } from "@/lib/hooks/use-wallet-dock";
import { LiveSyncStats } from "@/components/crypto/LiveSyncStats";
import { Card, CardContent } from "@/components/ui/card";

export function WalletsDock() {
  const {
    isExpanded,
    items,
    toggle,
    syncStats,
    triggerSync,
    isAutoSyncing
  } = useWalletDock();

  // Format sync status for badge
  const getSyncBadge = () => {
    if (isAutoSyncing) {
      return (
        <Badge variant="secondary" className="h-5 px-2 text-xs animate-pulse">
          <RefreshCw className="size-3 mr-1 animate-spin" />
          Syncing
        </Badge>
      );
    }

    if (syncStats.failedWallets > 0) {
      return (
        <Badge variant="destructive" className="h-5 px-2 text-xs">
          <XCircle className="size-3 mr-1" />
          {syncStats.failedWallets} Failed
        </Badge>
      );
    }

    if (syncStats.totalWallets > 0 && syncStats.syncedWallets === syncStats.totalWallets) {
      return (
        <Badge variant="default" className="h-5 px-2 text-xs bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="size-3 mr-1" />
          All Synced
        </Badge>
      );
    }

    if (syncStats.totalWallets === 0) {
      return (
        <Badge variant="outline" className="h-5 px-2 text-xs">
          <Clock className="size-3 mr-1" />
          No Wallets
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="h-5 px-2 text-xs">
        <Activity className="size-3 mr-1" />
        {syncStats.syncedWallets}/{syncStats.totalWallets}
      </Badge>
    );
  };

  const getSyncIcon = () => {
    if (isAutoSyncing) {
      return <RefreshCw className="size-4 animate-spin text-blue-500" />;
    }
    
    if (syncStats.failedWallets > 0) {
      return <XCircle className="size-4 text-red-500" />;
    }
    
    if (syncStats.totalWallets > 0 && syncStats.syncedWallets === syncStats.totalWallets) {
      return <CheckCircle2 className="size-4 text-green-500" />;
    }
    
    return <Wallet className="size-4" />;
  };

  return (
    <ExpandableDock
      isExpanded={isExpanded}
      onToggle={toggle}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0"
          title={`Crypto Wallets (${syncStats.totalWallets})`}
        >
          {getSyncIcon()}
          {syncStats.totalWallets > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
              {syncStats.totalWallets}
            </span>
          )}
        </Button>
      }
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Wallet className="size-4" />
            <span>Crypto Wallets</span>
            <span className="text-xs text-muted-foreground">
              ({syncStats.totalWallets})
            </span>
          </div>
          {getSyncBadge()}
        </div>
      }
      actions={
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerSync}
            disabled={isAutoSyncing}
            className="h-7 w-7 p-0"
            title="Sync All Wallets"
          >
            <RefreshCw className={`size-3 ${isAutoSyncing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            title="Add Wallet"
          >
            <Plus className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            title="Wallet Settings"
          >
            <Settings className="size-3" />
          </Button>
        </div>
      }
      items={items}
      maxHeight="400px"
    >
      {/* Live Sync Stats Header */}
      <div className="px-3 pb-3">
        <LiveSyncStats compact showHeader={false} />
        <Separator className="mt-3" />
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="mx-3 mb-3">
          <CardContent className="p-4 text-center">
            <Wallet className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">No wallets connected</p>
            <p className="text-xs text-muted-foreground mb-3">
              Add your first crypto wallet to start tracking your portfolio
            </p>
            <Button size="sm" className="w-full">
              <Plus className="size-3 mr-1" />
              Add Wallet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {items.length > 0 && (
        <div className="px-3 pt-3 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerSync}
              disabled={isAutoSyncing}
              className="text-xs"
            >
              <RefreshCw className={`size-3 mr-1 ${isAutoSyncing ? 'animate-spin' : ''}`} />
              Sync All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Plus className="size-3 mr-1" />
              Add Wallet
            </Button>
          </div>
        </div>
      )}
    </ExpandableDock>
  );
}