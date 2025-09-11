"use client";

import React from "react";
import { useAutoSync } from "@/lib/hooks/use-auto-sync";
import { useDockContext } from "./dock-provider";
import { useWalletDock } from "@/lib/hooks/use-wallet-dock";
import { SyncStatusIndicator } from "@/components/crypto/SyncStatusIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Zap, Clock } from "lucide-react";
import { toast } from "sonner";

interface AutoSyncProviderProps {
  children: React.ReactNode;
}

export function AutoSyncProvider({ children }: AutoSyncProviderProps) {
  const { syncStats, shouldAutoSync, startAutoSync } = useAutoSync();
  const { notifications } = useDockContext();
  const [showAutoSyncPrompt, setShowAutoSyncPrompt] = React.useState(false);
  const [hasShownPrompt, setHasShownPrompt] = React.useState(false);

  // Show auto-sync notification when appropriate
  React.useEffect(() => {
    if (shouldAutoSync && !syncStats.isAutoSyncing && !hasShownPrompt && syncStats.totalWallets > 0) {
      setShowAutoSyncPrompt(true);
      setHasShownPrompt(true);

      // Add notification to dock
      notifications.addItem({
        id: 'auto-sync-ready',
        title: 'Auto-sync Ready',
        subtitle: `${syncStats.totalWallets} wallet${syncStats.totalWallets !== 1 ? 's' : ''} ready to sync`,
        status: 'warning',
        timestamp: 'Now',
        icon: <Zap className="size-4" />,
        onClick: () => {
          startAutoSync().then(({ successful, failed }) => {
            toast.success(`Sync completed: ${successful} successful, ${failed} failed`);
          });
          notifications.removeItem('auto-sync-ready');
        }
      });

      // Auto-dismiss prompt after 10 seconds
      const timer = setTimeout(() => {
        setShowAutoSyncPrompt(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [shouldAutoSync, syncStats.isAutoSyncing, syncStats.totalWallets, hasShownPrompt, notifications, startAutoSync]);

  // Handle sync completion
  React.useEffect(() => {
    if (!syncStats.isAutoSyncing && hasShownPrompt && (syncStats.syncedWallets > 0 || syncStats.failedWallets > 0)) {
      const total = syncStats.syncedWallets + syncStats.failedWallets;
      
      if (syncStats.failedWallets === 0) {
        toast.success(`All ${syncStats.syncedWallets} wallets synced successfully!`);
      } else if (syncStats.syncedWallets === 0) {
        toast.error(`Failed to sync ${syncStats.failedWallets} wallets`);
      } else {
        toast.info(`Sync completed: ${syncStats.syncedWallets} successful, ${syncStats.failedWallets} failed`);
      }

      // Remove auto-sync notification if it exists
      notifications.removeItem('auto-sync-ready');
    }
  }, [syncStats.isAutoSyncing, syncStats.syncedWallets, syncStats.failedWallets, hasShownPrompt, notifications]);

  const handleStartAutoSync = async () => {
    setShowAutoSyncPrompt(false);
    notifications.removeItem('auto-sync-ready');
    
    toast.loading('Starting wallet sync...', { id: 'auto-sync' });
    
    try {
      const { successful, failed } = await startAutoSync();
      toast.success(`Sync completed: ${successful} successful, ${failed} failed`, { id: 'auto-sync' });
    } catch (error) {
      toast.error('Auto-sync failed', { id: 'auto-sync' });
    }
  };

  const handleDismissPrompt = () => {
    setShowAutoSyncPrompt(false);
    notifications.removeItem('auto-sync-ready');
  };

  return (
    <>
      {children}
      
      {/* Auto-sync prompt overlay */}
      {showAutoSyncPrompt && (
        <div className="fixed bottom-4 right-4 z-50 w-80">
          <Card className="shadow-lg border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="size-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Zap className="size-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  Auto-sync Ready
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissPrompt}
                  className="h-6 w-6 p-0"
                >
                  <X className="size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  It's been a while since your last sync. Would you like to sync all {syncStats.totalWallets} wallet{syncStats.totalWallets !== 1 ? 's' : ''} now?
                </p>
                
                <SyncStatusIndicator 
                  variant="compact" 
                  showTrigger={false}
                  className="justify-center"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartAutoSync}
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={syncStats.isAutoSyncing}
                  >
                    <Zap className="size-3 mr-1" />
                    Sync Now
                  </Button>
                  <Button
                    onClick={handleDismissPrompt}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Clock className="size-3 mr-1" />
                    Later
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}