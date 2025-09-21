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
import { useSession } from "@/lib/auth-client";
import { useDockContext } from "@/components/providers/dock-provider";
import { useCryptoStore } from "@/lib/stores/crypto-store";
import { SyncProgressIndicator } from "@/components/crypto/SyncProgressIndicator";
import { WalletSyncItem } from "@/components/crypto/WalletSyncItem";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Helper function to determine wallet status based on sync state and wallet data
function getWalletStatus(
  wallet: any,
  syncState?: {
    progress: number;
    status: string;
    message?: string;
    error?: string;
    startedAt?: Date;
  }
): "success" | "loading" | "error" | "warning" | "idle" {
  if (syncState) {
    switch (syncState.status) {
      case 'failed':
        return 'error';
      case 'completed':
        return 'success';
      case 'queued':
      case 'syncing':
      case 'syncing_assets':
      case 'syncing_transactions':
      case 'syncing_nfts':
      case 'syncing_defi':
        return 'loading';
      default:
        return 'idle';
    }
  }

  // Fallback to wallet's own sync status
  if (wallet.syncStatus === 'error') return 'error';
  if (wallet.syncStatus === 'syncing') return 'loading';
  if (wallet.isActive && wallet.lastSyncAt) return 'success';

  return 'idle';
}

export function WalletsDock() {
  const {
    isExpanded,
    toggle,
    expand,
    realtimeSyncStates,
    realtimeSyncConnected,
    resetConnection
  } = useWalletDock();

  const wallets = useCryptoStore((state) => state.wallets);

  // Calculate sync stats based on actual wallets and their sync states
  const walletSyncData = wallets.map(wallet => {
    const syncState = realtimeSyncStates[wallet.id];
    return {
      wallet,
      syncState,
      status: getWalletStatus(wallet, syncState)
    };
  });

  const syncingWallets = walletSyncData.filter(data => data.status === 'loading');
  const completedWallets = walletSyncData.filter(data => data.status === 'success');
  const failedWallets = walletSyncData.filter(data => data.status === 'error');
  const totalWallets = wallets.length;
  const hasActiveSyncs = syncingWallets.length > 0;
  const syncConnected = realtimeSyncConnected;

  // Sync stats for progress indicator - format to match expected structure
  const syncStats = {
    syncingWallets: syncingWallets.map(data => ({
      walletId: data.wallet.id,
      progress: data.syncState?.progress || 0,
      status: data.syncState?.status || 'syncing',
      message: data.syncState?.message,
      startedAt: data.syncState?.startedAt?.toISOString()
    })),
    completedWallets: completedWallets.map(data => data.wallet),
    failedWallets: failedWallets.map(data => data.wallet),
    totalWallets,
    hasActiveSyncs,
    syncConnected
  };

  const { data: session } = useSession();
  const { notifications } = useDockContext();
  const [hasCheckedForOutdated, setHasCheckedForOutdated] = React.useState(false);

  // Auto-expand when sync starts
  React.useEffect(() => {
    if (hasActiveSyncs && !isExpanded) {
      expand();
    }
  }, [hasActiveSyncs, isExpanded, expand]);

  // Show notification when SSE connection is lost
  React.useEffect(() => {
    if (session?.user && !syncConnected && !hasCheckedForOutdated) {
      setHasCheckedForOutdated(true);

      notifications.addItem({
        id: 'sync-connection-lost',
        title: 'Sync Connection Lost',
        subtitle: 'Real-time wallet sync is disconnected',
        status: 'warning',
        timestamp: 'Now',
        icon: <XCircle className="size-4" />,
        onClick: () => {
          resetConnection();
          notifications.removeItem('sync-connection-lost');
        }
      });
    }
  }, [session?.user, syncConnected, hasCheckedForOutdated, notifications, resetConnection]);

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

    // Use actual wallet data
    const totalWallets = wallets.length;

    if (failedWallets.length > 0) {
      return (
        <Badge variant="destructive" className="h-5 px-2 text-xs">
          <XCircle className="size-3 mr-1" />
          {failedWallets.length} Failed
        </Badge>
      );
    }

    if (totalWallets > 0 && completedWallets.length === totalWallets) {
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
        {completedWallets.length}/{totalWallets}
      </Badge>
    );
  };

  const getSyncIcon = () => {
    if (hasActiveSyncs) {
      return <RefreshCw className="size-4 animate-spin text-blue-500" />;
    }

    // Use actual wallet data
    const totalWallets = wallets.length;

    if (failedWallets.length > 0) {
      return <XCircle className="size-4 text-red-500" />;
    }

    if (totalWallets > 0 && completedWallets.length === totalWallets) {
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
          title={`Crypto Wallets (${wallets.length})`}
        >
          {getSyncIcon()}
          {wallets.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
              {wallets.length}
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
              ({wallets.length})
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
            onClick={resetConnection}
            disabled={hasActiveSyncs}
            className="h-7 w-7 p-0"
            title="Reset Connection"
          >
            <RefreshCw className={`size-3 ${hasActiveSyncs ? 'animate-spin' : ''}`} />
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
      maxHeight="400px"
    >
      {/* Sync Status Display */}
      <div className="px-3 pb-3">
        <SyncProgressIndicator
          syncStats={syncStats}
          isAutoSyncing={hasActiveSyncs}
        />
        <Separator className="mt-3" />
      </div>

      {/* Wallet Items */}
      <div className="px-3 pb-3 space-y-2">
        {wallets.map((wallet) => {
          const syncState = realtimeSyncStates[wallet.id];
          const isSyncing = syncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(syncState.status);

          return (
            <WalletSyncItem
              key={wallet.id}
              wallet={{
                id: wallet.id,
                name: wallet.name || wallet.label || `${wallet.type} Wallet`,
                balance: wallet.totalBalance,
                symbol: wallet.network,
                value: `$${parseFloat(wallet.totalBalanceUsd).toLocaleString()}`,
                status: getWalletStatus(wallet, syncState),
                lastSync: wallet.lastSyncAt ? new Date(wallet.lastSyncAt) : undefined
              }}
              realtimeSyncState={syncState ? {
                progress: syncState.progress,
                status: syncState.status,
                message: syncState.message,
                startedAt: syncState.startedAt?.toISOString()
              } : undefined}
              onClick={() => {
                // Navigate to wallet details
                window.location.href = `/dashboard/crypto/wallets/${wallet.id}`;
              }}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {wallets.length === 0 && (
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
      {wallets.length > 0 && (
        <div className="px-3 pt-3 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetConnection}
              disabled={hasActiveSyncs}
              className="text-xs"
            >
              <RefreshCw className={`size-3 mr-1 ${hasActiveSyncs ? 'animate-spin' : ''}`} />
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