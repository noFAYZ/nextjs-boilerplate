'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import type { IntegrationProvider } from '@/lib/types/integrations';

interface IntegrationDisconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: IntegrationProvider;
  providerName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function IntegrationDisconnectDialog({
  open,
  onOpenChange,
  provider,
  providerName,
  onConfirm,
  isLoading = false,
}: IntegrationDisconnectDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle>Disconnect {providerName}?</AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="space-y-3 pt-4">
          <AlertDialogDescription>
            Are you sure you want to disconnect your {providerName} account?
          </AlertDialogDescription>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <strong>Warning:</strong> This will remove all synced data and stop automatic updates.
              {provider === 'QUICKBOOKS' && ' You will need to re-authorize to reconnect.'}
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
