'use client';

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface PlaidErrorResult {
  success: boolean;
  accounts?: Array<Record<string, unknown>>;
  error?: {
    error_message?: string;
    error?: string;
  };
}

interface PlaidErrorScreenProps {
  plaidError: string | null;
  plaidResult: PlaidErrorResult | null;
  onTryAgain: () => void;
  onDone: () => void;
}

export function PlaidErrorScreen({
  plaidError,
  plaidResult,
  onTryAgain,
  onDone,
}: PlaidErrorScreenProps) {
  return (
    <>
      <DialogHeader className="pb-4">
        <DialogTitle>Connection Failed</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
        {/* Error Icon */}
        <div className="relative">
          <AlertCircle className="w-20 h-20 text-red-500/50" />
        </div>

        {/* Error Message */}
        <div className="space-y-2 max-w-xs">
          <h2 className="text-xl font-bold text-foreground">Connection Failed</h2>
          <p className="text-sm text-muted-foreground">
            {plaidError || 'Failed to connect your bank account. Please try again or add manually.'}
          </p>
        </div>

        {/* Error Details */}
        {plaidResult?.error && (
          <div className="w-full max-w-xs bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300 text-left">
              <span className="font-semibold">Error details:</span> {plaidResult.error.error_message || plaidResult.error.error || 'Unknown error'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            onClick={onTryAgain}
            variant="outline"
          >
            Try Again
          </Button>
          <Button onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
