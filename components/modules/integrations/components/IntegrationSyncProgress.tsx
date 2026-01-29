'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntegrationSync } from '@/lib/hooks/useIntegrationSync';
import { useToast } from "@/lib/hooks/useToast";
import type {
  IntegrationProvider,
  IntegrationSyncProgressEvent,
  IntegrationSyncCompletedEvent,
  IntegrationSyncFailedEvent,
} from '@/lib/types/integrations';

interface IntegrationSyncProgressProps {
  provider: IntegrationProvider;
  onSyncComplete?: () => void;
  onSyncFailed?: () => void;
  showCard?: boolean;
  className?: string;
}

export function IntegrationSyncProgress({
  provider,
  onSyncComplete,
  onSyncFailed,
  showCard = true,
  className,
}: IntegrationSyncProgressProps) {
  const { toast } = useToast();
  const [syncHistory, setSyncHistory] = useState<{
    progress: number;
    status: string;
    message?: string;
    itemsSynced?: number;
    error?: string;
    completedAt?: string;
  }>({
    progress: 0,
    status: 'idle',
  });

  const { isConnected, isConnecting, error, activeSyncs, reconnect } = useIntegrationSync({
    enabled: true,
    onProgress: (event: IntegrationSyncProgressEvent) => {
      if (event.provider === provider) {
        setSyncHistory({
          progress: event.progress,
          status: event.status,
          message: event.message || event.currentStep,
          itemsSynced: event.itemsSynced,
        });
      }
    },
    onCompleted: (event: IntegrationSyncCompletedEvent) => {
      if (event.provider === provider) {
        setSyncHistory({
          progress: 100,
          status: 'completed',
          itemsSynced: event.itemsSynced,
          completedAt: event.completedAt,
        });

        toast({
          title: `${provider} Sync Complete`,
          description: `Successfully synced ${event.itemsSynced || 0} items${event.duration ? ` in ${(event.duration / 1000).toFixed(1)}s` : ''}`,
        });

        if (onSyncComplete) {
          onSyncComplete();
        }
      }
    },
    onFailed: (event: IntegrationSyncFailedEvent) => {
      if (event.provider === provider) {
        setSyncHistory({
          progress: 0,
          status: 'failed',
          error: event.error,
        });

        toast({
          title: `${provider} Sync Failed`,
          description: event.error,
          variant: 'destructive',
        });

        if (onSyncFailed) {
          onSyncFailed();
        }
      }
    },
    onError: (err) => {
      console.error('Integration sync stream error:', err);
    },
  });

  // Find active sync for this provider
  const activeSync = activeSyncs.find((sync) => sync.provider === provider);
  const isSyncing = !!activeSync;

  // Render different states
  const renderContent = () => {
    // Connection status
    if (!isConnected && !isConnecting) {
      return (
        <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">Sync stream disconnected</span>
          </div>
          <Button onClick={reconnect} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reconnect
          </Button>
        </div>
      );
    }

    if (isConnecting) {
      return (
        <div className="flex items-center gap-2 p-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Connecting to sync stream...</span>
        </div>
      );
    }

    // Idle state (connected but not syncing)
    if (!isSyncing && syncHistory.status === 'idle') {
      return (
        <div className="flex items-center gap-2 p-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-muted-foreground">Ready for sync</span>
        </div>
      );
    }

    // Syncing state
    if (isSyncing && activeSync) {
      return (
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Syncing {provider}...</span>
            </div>
            <Badge variant="warning" size="sm">
              {activeSync.progress}%
            </Badge>
          </div>

          <Progress value={activeSync.progress} className="h-2" />

          {activeSync.currentStep && (
            <p className="text-xs text-muted-foreground">{activeSync.currentStep}</p>
          )}

          {activeSync.itemsSynced !== undefined && activeSync.itemsSynced > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Items synced: {activeSync.itemsSynced}</span>
              {activeSync.itemsFailed !== undefined && activeSync.itemsFailed > 0 && (
                <span className="text-destructive">Failed: {activeSync.itemsFailed}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    // Completed state
    if (syncHistory.status === 'completed') {
      return (
        <div className="space-y-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Sync completed successfully</span>
          </div>
          {syncHistory.itemsSynced !== undefined && (
            <p className="text-xs text-muted-foreground">Synced {syncHistory.itemsSynced} items</p>
          )}
        </div>
      );
    }

    // Failed state
    if (syncHistory.status === 'failed') {
      return (
        <div className="space-y-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Sync failed</span>
          </div>
          {syncHistory.error && <p className="text-xs text-red-600 dark:text-red-400">{syncHistory.error}</p>}
        </div>
      );
    }

    // Recent sync info
    if (syncHistory.progress > 0) {
      return (
        <div className="space-y-2 p-4">
          <Progress value={syncHistory.progress} className="h-2" />
          {syncHistory.message && <p className="text-xs text-muted-foreground">{syncHistory.message}</p>}
        </div>
      );
    }

    return null;
  };

  if (!showCard) {
    return <div className={className}>{renderContent()}</div>;
  }

  return (
  renderContent()
  );
}
