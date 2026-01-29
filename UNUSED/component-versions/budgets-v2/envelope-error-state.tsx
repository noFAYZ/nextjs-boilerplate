'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface EnvelopeErrorStateProps {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function EnvelopeErrorState({
  error,
  onRetry,
  title = 'Unable to load envelopes',
  description = 'There was a problem loading your envelopes. Please try again.',
}: EnvelopeErrorStateProps) {
  return (
    <Card className="border-dashed border-red-200 dark:border-red-900/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500/50 mb-4" />
        <p className="text-lg font-semibold mb-2">{title}</p>
        <p className="text-xs text-muted-foreground mb-6 max-w-sm text-center">
          {description}
        </p>
        {error && (
          <p className="text-xs text-muted-foreground mb-6 max-w-sm text-center bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-900/50">
            <span className="font-semibold">Error: </span>
            {typeof error === 'string' ? error : error.message}
          </p>
        )}
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface EnvelopesEmptyStateProps {
  onCreateClick?: () => void;
  hasFilters?: boolean;
}

export function EnvelopesEmptyState({
  onCreateClick,
  hasFilters = false,
}: EnvelopesEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <p className="text-lg font-semibold mb-2">
          {hasFilters ? 'No envelopes found' : 'No envelopes yet'}
        </p>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
          {hasFilters
            ? 'Try adjusting your filters or create a new envelope.'
            : 'Create your first envelope to start managing your budget. Allocate funds to different spending categories.'}
        </p>
        {!hasFilters && onCreateClick && (
          <Button onClick={onCreateClick}>
            <span className="mr-2">➕</span>
            Create First Envelope
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
