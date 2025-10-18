'use client'

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBankingStore, selectAccountSyncState } from '@/lib/stores/banking-store';
import { useRealtimeSync } from '@/components/providers/realtime-sync-provider';
import { Button } from '@/components/ui/button';

interface BankAccountSyncProgressProps {
  accountId: string;
  accountName?: string;
  className?: string;
}

export function BankAccountSyncProgress({ accountId, accountName, className }: BankAccountSyncProgressProps) {
  const syncState = useBankingStore(state => selectAccountSyncState(state, accountId));

  if (!syncState) {
    return null;
  }

  const getStatusColor = (status: typeof syncState.status) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'processing':
      case 'syncing':
      case 'syncing_balance':
      case 'syncing_transactions':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: typeof syncState.status) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-3 w-3" />;
      case 'processing':
      case 'syncing':
      case 'syncing_balance':
      case 'syncing_transactions':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'failed':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: typeof syncState.status) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'processing':
        return 'Processing';
      case 'syncing':
        return 'Syncing';
      case 'syncing_balance':
        return 'Syncing Balance';
      case 'syncing_transactions':
        return 'Syncing Transactions';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const isActive = ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(syncState.status);

  return (
    <Card className={cn('w-full p-3', className)}>
      
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium">
            {accountName ? `${accountName} Sync` : 'Account Sync'}
          </CardTitle>
          <Badge variant="outline" className={cn('text-xs', getStatusColor(syncState.status))}>
            {getStatusIcon(syncState.status)}
            <span className="ml-1">{getStatusText(syncState.status)}</span>
          </Badge>
        </div>
    
      
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{syncState.progress}%</span>
          </div>
          <Progress value={syncState.progress} className="h-2" />

          {syncState.message && (
            <p className="text-xs text-muted-foreground mt-2">
              {syncState.message}
            </p>
          )}

          {syncState.error && (
            <p className="text-xs text-red-600 mt-2">
              Error: {syncState.error}
            </p>
          )}

     {/*      {syncState.startedAt && isActive && (
            <p className="text-xs text-muted-foreground">
              Started: {syncState.startedAt.toLocaleTimeString()}
            </p>
          )}

          {syncState.completedAt && !isActive && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                {syncState.status === 'completed' ? 'Completed' : 'Failed'}: {syncState.completedAt.toLocaleTimeString()}
              </p>
              {syncState.syncedData && syncState.syncedData.length > 0 && (
                <p>
                  Synced: {syncState.syncedData.join(', ')}
                </p>
              )}
            </div>
          )} */}
        </div>
      
    </Card>
  );
}

interface BankSyncProgressBadgeProps {
  accountId: string;
  className?: string;
}

export function BankSyncProgressBadge({ accountId, className }: BankSyncProgressBadgeProps) {
  const syncState = useBankingStore(state => selectAccountSyncState(state, accountId));

  if (!syncState) {
    return null;
  }

  const getStatusColor = (status: typeof syncState.status) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'processing':
      case 'syncing':
      case 'syncing_balance':
      case 'syncing_transactions':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: typeof syncState.status) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-3 w-3" />;
      case 'processing':
      case 'syncing':
      case 'syncing_balance':
      case 'syncing_transactions':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'failed':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const isActive = ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(syncState.status);

  return (
    <Badge variant="outline" className={cn('text-xs', getStatusColor(syncState.status), className)}>
      {getStatusIcon(syncState.status)}
      <span className="ml-1">
        {isActive ? `${syncState.progress}%` : syncState.status === 'completed' ? 'Synced' : 'Failed'}
      </span>
    </Badge>
  );
}

interface BankingGlobalSyncStatusProps {
  className?: string;
}

export function BankingGlobalSyncStatus({ className }: BankingGlobalSyncStatusProps) {
  const { realtimeSyncStates, realtimeSyncConnected, realtimeSyncError } = useBankingStore();
  const { resetConnection } = useRealtimeSync();
  const activeSyncs = Object.values(realtimeSyncStates).filter(
    syncState => ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(syncState.status)
  );

  if (activeSyncs.length === 0 && !realtimeSyncError) {
    return null;
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Banking Sync Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Connection</span>
            <Badge variant="outline" className={cn(
              'text-xs',
              realtimeSyncConnected
                ? 'bg-green-500/10 text-green-700 border-green-500/20'
                : 'bg-red-500/10 text-red-700 border-red-500/20'
            )}>
              {realtimeSyncConnected ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span className="ml-1">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  <span className="ml-1">Disconnected</span>
                </>
              )}
            </Badge>
          </div>

          {realtimeSyncError && (
            <div className="space-y-2">
              <p className="text-xs text-red-600">
                Error: {realtimeSyncError}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetConnection}
                className="h-6 text-xs"
              >
                Retry Connection
              </Button>
            </div>
          )}

          {activeSyncs.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">
                Active Syncs ({activeSyncs.length})
              </span>
              {activeSyncs.map((syncState, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="truncate">{syncState.message || 'Syncing...'}</span>
                  <span className="text-muted-foreground">{syncState.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}