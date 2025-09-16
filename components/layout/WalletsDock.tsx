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
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExpandableDock } from "@/components/ui/dock";
import { useWalletDock } from "@/lib/hooks/use-wallet-dock";
import { useAutoSync } from "@/lib/hooks/use-auto-sync";
import { useSession } from "@/lib/auth-client";
import { useDockContext } from "@/components/providers/dock-provider";
import { SyncProgressIndicator } from "@/components/crypto/SyncProgressIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function WalletsDock() {
  const {
    isExpanded,
    items,
    toggle,
    expand,
    syncStats,
    triggerSync,
    isAutoSyncing
  } = useWalletDock();

  const {
    hasOutdatedWallets,
    getOutdatedWallets,
    startAutoSyncOutdated
  } = useAutoSync();

  // Simplified sync state since realtime sync is removed
  const hasActiveSyncs = false;
  const syncConnected = false;

  const { data: session } = useSession();
  const { notifications } = useDockContext();
  const [hasCheckedForOutdated, setHasCheckedForOutdated] = React.useState(false);

  // Auto-expand when sync starts (real-time or traditional)
  React.useEffect(() => {
    if ((isAutoSyncing || hasActiveSyncs) && !isExpanded) {
      expand();
      
    }
  }, [isAutoSyncing, hasActiveSyncs, isExpanded, expand]);

  // Check for outdated wallets when user is logged in
  React.useEffect(() => {
    if (session?.user && !hasCheckedForOutdated && hasOutdatedWallets) {
      setHasCheckedForOutdated(true);

      const outdatedWalletIds = getOutdatedWallets();

      // Auto-expand dock when outdated wallets detected
      if (!isExpanded) {
        expand();
      }

      // Show notification about outdated wallets
      notifications.addItem({
        id: 'outdated-wallets-detected',
        title: 'Outdated Wallets Detected',
        subtitle: `${outdatedWalletIds.length} wallet${outdatedWalletIds.length !== 1 ? 's' : ''} need syncing (>1hr old)`,
        status: 'warning',
        timestamp: 'Now',
        icon: <Zap className="size-4" />,
        onClick: async () => {
          toast.loading('Starting wallet sync...', { id: 'auto-sync' });
          try {
            const { successful, failed } = await startAutoSyncOutdated();
            toast.success(`Sync completed: ${successful} successful, ${failed} failed`, { id: 'auto-sync' });
          } catch (error) {
            toast.error('Auto-sync failed', { id: 'auto-sync' });
          }
          notifications.removeItem('outdated-wallets-detected');
        }
      });

      // Auto-start sync for outdated wallets
      setTimeout(() => {
        startAutoSyncOutdated().then(({ successful, failed }) => {
          if (failed === 0) {
            toast.success(`All ${successful} outdated wallets synced successfully!`);
          } else if (successful === 0) {
            toast.error(`Failed to sync ${failed} wallets`);
          } else {
            toast.info(`Sync completed: ${successful} successful, ${failed} failed`);
          }
          notifications.removeItem('outdated-wallets-detected');
        }).catch(() => {
          toast.error('Auto-sync failed');
          notifications.removeItem('outdated-wallets-detected');
        });
      }, 2000); // 2 second delay to allow UI to render
    }
  }, [
    session?.user,
    hasCheckedForOutdated,
    hasOutdatedWallets,
    getOutdatedWallets,
    startAutoSyncOutdated,
    isExpanded,
    expand,
    notifications
  ]);

  // Format sync status for badge (using real-time data)
  const getSyncBadge = () => {
    // Show real-time sync connection status
    if (!syncConnected && session?.user) {
      return (
        <Badge variant="outline" className="h-5 px-2 text-xs border-yellow-500 text-yellow-600">
          <RefreshCw className="size-3 mr-1" />
          Connecting...
        </Badge>
      );
    }

    if (hasActiveSyncs) {
      return (
        <Badge variant="secondary" className="h-5 px-2 text-xs animate-pulse">
          <RefreshCw className="size-3 mr-1 animate-spin" />
          Syncing
        </Badge>
      );
    }

    if (isAutoSyncing) {
      return (
        <Badge variant="secondary" className="h-5 px-2 text-xs animate-pulse">
          <RefreshCw className="size-3 mr-1 animate-spin" />
          Syncing
        </Badge>
      );
    }

    // Use local sync stats
    const failedWallets = syncStats.failedWallets;
    const totalWallets = syncStats.totalWallets;
    const completedWallets = syncStats.syncedWallets;

    if (failedWallets > 0) {
      return (
        <Badge variant="destructive" className="h-5 px-2 text-xs">
          <XCircle className="size-3 mr-1" />
          {failedWallets} Failed
        </Badge>
      );
    }

    if (totalWallets > 0 && completedWallets === totalWallets) {
      return (
        <Badge variant="default" className="h-5 px-2 text-xs bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="size-3 mr-1" />
          All Synced
        </Badge>
      );
    }

    if (totalWallets === 0) {
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
        {completedWallets}/{totalWallets}
      </Badge>
    );
  };

  const getSyncIcon = () => {
    if (hasActiveSyncs || isAutoSyncing) {
      return <RefreshCw className="size-4 animate-spin text-blue-500" />;
    }

    // Use local sync stats
    const failedWallets = syncStats.failedWallets;
    const totalWallets = syncStats.totalWallets;
    const completedWallets = syncStats.syncedWallets;

    if (failedWallets > 0) {
      return <XCircle className="size-4 text-red-500" />;
    }

    if (totalWallets > 0 && completedWallets === totalWallets) {
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
      {/* Sync Status Display */}
      <div className="px-3 pb-3">
        <SyncProgressIndicator
          syncStats={syncStats}
          isAutoSyncing={isAutoSyncing}
        />
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