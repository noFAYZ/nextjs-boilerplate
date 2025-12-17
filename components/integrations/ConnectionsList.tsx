'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/hooks/useToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProviderConnections, useReconnectConnection, useDeleteConnection } from '@/lib/queries/banking-queries';
import {
  Loader2,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function ConnectionsList() {
  const { toast } = useToast();
  const { data: connections, isLoading: connectionsLoading } = useProviderConnections();
  const reconnectMutation = useReconnectConnection();
  const deleteMutation = useDeleteConnection();

  const [deleteConfirm, setDeleteConfirm] = useState<{ connectionId: string; connectionName: string } | null>(null);

  const handleReconnect = (connectionId: string) => {
    reconnectMutation.mutate(connectionId, {
      onSuccess: () => {
        toast({
          title: 'Connection Restored',
          description: 'The connection has been successfully reconnected.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Reconnection Failed',
          description: error instanceof Error ? error.message : 'Failed to reconnect',
          variant: 'destructive',
        });
      },
    });
  };

  const handleDelete = (connectionId: string) => {
    deleteMutation.mutate(connectionId, {
      onSuccess: () => {
        toast({
          title: 'Connection Deleted',
          description: 'The connection and all associated data has been permanently deleted.',
        });
        setDeleteConfirm(null);
      },
      onError: (error) => {
        toast({
          title: 'Deletion Failed',
          description: error instanceof Error ? error.message : 'Failed to delete connection',
          variant: 'destructive',
        });
        setDeleteConfirm(null);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </Badge>
        );
      case 'DISCONNECTED':
        return (
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0 gap-1">
            <Clock className="w-3 h-3" />
            Disconnected
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-0 gap-1">
            <AlertCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-200 dark:border-emerald-800">
            Success
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-red-500/10 border-red-200 dark:border-red-800">
            Failed
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-blue-500/10 border-blue-200 dark:border-blue-800">
            Syncing...
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (connectionsLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="h-5 bg-muted rounded-lg w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-10 bg-muted rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
              <LinkIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-md font-semibold">No connections found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Get started by connecting your first banking provider in the Integrations tab
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection: any) => (
          <Card key={connection.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm truncate">
                    {connection.institutionName || connection.provider}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {connection.provider}
                  </p>
                </div>
                {getStatusBadge(connection.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Connection Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Provider ID:</span>
                  <span className="font-mono text-xs truncate ml-2" title={connection.plaidItemId || connection.id}>
                    {connection.plaidItemId?.slice(0, 12) || connection.id.slice(0, 12)}...
                  </span>
                </div>

                {connection.lastSyncAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span>
                      {formatDistanceToNow(new Date(connection.lastSyncAt), { addSuffix: true })}
                    </span>
                  </div>
                )}

                {connection.lastSyncStatus && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Sync Status:</span>
                    <div>
                      {getSyncStatusBadge(connection.lastSyncStatus)}
                    </div>
                  </div>
                )}

                {connection.errorCount > 0 && (
                  <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="font-semibold">{connection.errorCount}</span>
                  </div>
                )}

                {connection.autoSync !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Auto Sync:</span>
                    <span>{connection.autoSync ? 'Enabled' : 'Disabled'}</span>
                  </div>
                )}

                {connection.syncFrequency && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sync Freq:</span>
                    <span>{connection.syncFrequency}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {connection.status === 'DISCONNECTED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => handleReconnect(connection.id)}
                    disabled={reconnectMutation.isPending && reconnectMutation.variables === connection.id}
                  >
                    {reconnectMutation.isPending && reconnectMutation.variables === connection.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Reconnecting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        Reconnect
                      </>
                    )}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => setDeleteConfirm({ connectionId: connection.id, connectionName: connection.institutionName || connection.provider })}
                  disabled={deleteMutation.isPending && deleteMutation.variables === connection.id}
                >
                  {deleteMutation.isPending && deleteMutation.variables === connection.id ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the connection to <strong>{deleteConfirm?.connectionName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">This action will:</p>
              <ul className="list-disc list-inside ml-1 text-xs space-y-1 text-muted-foreground">
                <li>Remove all financial accounts linked to this connection</li>
                <li>Delete all transactions for those accounts</li>
                <li>Clear all sync history and logs</li>
              </ul>
            </div>
            <p className="text-xs text-destructive font-medium">This action cannot be undone.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteConfirm) {
                  handleDelete(deleteConfirm.connectionId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
