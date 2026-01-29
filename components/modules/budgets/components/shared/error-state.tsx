'use client';

/**
 * Error State Component
 * Displays error message with recovery options
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  onHome?: () => void;
  showDetails?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  onHome,
  showDetails = false,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <AlertTriangle className="h-12 w-12 text-red-500" />

          {/* Title */}
          <h3 className="text-lg font-semibold text-red-900">{title}</h3>

          {/* Message */}
          <p className="text-sm text-red-800 max-w-md">{message}</p>

          {/* Error Details (optional) */}
          {showDetails && errorMessage && (
            <div className="w-full max-w-md p-3 bg-red-100 border border-red-200 rounded-lg text-left">
              <p className="text-xs font-mono text-red-900 break-words">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}

            {onHome && (
              <Button
                onClick={onHome}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Specific error state for missing data
 */
export function ErrorStateNotFound({
  resourceName = 'Resource',
  onRetry,
}: {
  resourceName?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorState
      title={`${resourceName} not found`}
      message={`The ${resourceName.toLowerCase()} you're looking for doesn't exist or has been deleted.`}
      onRetry={onRetry}
    />
  );
}

/**
 * Specific error state for permission denied
 */
export function ErrorStateUnauthorized({
  onRetry,
  onHome,
}: {
  onRetry?: () => void;
  onHome?: () => void;
}) {
  return (
    <ErrorState
      title="Access Denied"
      message="You don't have permission to access this resource."
      onRetry={onRetry}
      onHome={onHome}
    />
  );
}

/**
 * Specific error state for network errors
 */
export function ErrorStateNetworkError({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}
