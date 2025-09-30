'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBankingStore, selectAccountSyncState } from '@/lib/stores/banking-store';

interface BankAccountSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountName?: string;
  onSyncComplete?: () => void;
}

export function BankAccountSyncModal({
  isOpen,
  onClose,
  accountId,
  accountName,
  onSyncComplete
}: BankAccountSyncModalProps) {
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoClosing, setIsAutoClosing] = useState(false);
  const syncState = useBankingStore(state => selectAccountSyncState(state, accountId));
  const { realtimeSyncConnected, realtimeSyncError } = useBankingStore();

  // Auto-close modal 3 seconds after completion
  useEffect(() => {
    if (syncState?.status === 'completed' && !isAutoClosing) {
      setIsAutoClosing(true);
      autoCloseTimerRef.current = setTimeout(() => {
        onClose();
        if (onSyncComplete) {
          onSyncComplete();
        }
      }, 3000);
    } else if (syncState?.status !== 'completed' && isAutoClosing) {
      setIsAutoClosing(false);
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    }
  }, [syncState?.status, onClose, onSyncComplete, isAutoClosing]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'processing':
      case 'syncing':
      case 'syncing_balance':
      case 'syncing_transactions':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
      case 'syncing':
      case 'syncing_balance':
      case 'syncing_transactions':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleManualClose = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setIsAutoClosing(false);
    onClose();
  }, [onClose]);

  // Don't show modal if no sync state exists
  if (!syncState && isOpen) {
    return null;
  }

  const progress = syncState?.progress || 0;
  const status = syncState?.status || 'queued';
  const message = syncState?.message || 'Preparing to sync...';
  const error = syncState?.error;
  const isActive = ['queued', 'processing', 'syncing', 'syncing_balance', 'syncing_transactions'].includes(status);
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <Dialog open={isOpen} onOpenChange={handleManualClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(status)}
            Syncing {accountName || 'Bank Account'}
          </DialogTitle>
          <DialogDescription>
            {isCompleted ? 'Bank account sync completed successfully!' :
             isFailed ? 'Bank account sync failed. Please try again.' :
             'Please wait while we sync your bank account data...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          {!realtimeSyncConnected && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Connection to sync server lost. Progress may be delayed.
              </span>
            </div>
          )}

          {realtimeSyncError && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                {realtimeSyncError}
              </span>
            </div>
          )}

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn('text-xs', getStatusColor(status))}>
                {getStatusText(status)}
              </Badge>
              <span className="text-sm font-medium">{progress}%</span>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="text-sm text-muted-foreground">
              {message}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Sync Details */}
            {syncState?.startedAt && isActive && (
              <div className="text-xs text-muted-foreground">
                Started: {syncState.startedAt.toLocaleTimeString()}
              </div>
            )}

            {syncState?.completedAt && (isCompleted || isFailed) && (
              <div className="text-xs text-muted-foreground">
                {isCompleted ? 'Completed' : 'Failed'}: {syncState.completedAt.toLocaleTimeString()}
              </div>
            )}

            {syncState?.syncedData && syncState.syncedData.length > 0 && isCompleted && (
              <div className="text-xs text-muted-foreground">
                <strong>Synced:</strong> {syncState.syncedData.join(', ')}
              </div>
            )}
          </div>

          {/* Auto-close notification for completed sync */}
          {isCompleted && isAutoClosing && (
            <div className="text-center text-xs text-muted-foreground bg-green-50 p-2 rounded border border-green-200">
              ✅ Bank account sync completed! This dialog will close automatically in 3 seconds...
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {isFailed && (
              <Button variant="outline" onClick={handleManualClose}>
                Close
              </Button>
            )}

            {(isCompleted || isFailed) && (
              <Button
                variant={isCompleted ? "default" : "outline"}
                onClick={handleManualClose}
              >
                {isCompleted ? 'Done' : 'Close'}
              </Button>
            )}

            {isActive && (
              <Button variant="outline" onClick={handleManualClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}