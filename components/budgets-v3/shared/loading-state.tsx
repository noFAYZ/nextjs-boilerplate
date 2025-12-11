'use client';

/**
 * Loading State Component
 * Shows loading message and spinner
 */

import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
  variant?: 'spinner' | 'skeleton';
}

export function LoadingState({
  message = 'Loading...',
  fullHeight = true,
  variant = 'spinner',
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    // Use skeleton for better perceived performance
    return null; // Will use SkeletonCard/SkeletonGrid instead
  }

  return (
    <Card className={fullHeight ? '' : ''}>
      <CardContent className={`flex flex-col items-center justify-center gap-4 ${
        fullHeight ? 'py-24' : 'py-12'
      }`}>
        <Loader className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Loading Overlay Component
 * Shows loading overlay over existing content
 */
export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
}: {
  isLoading: boolean;
  message?: string;
}) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-background rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
        <Loader className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/**
 * Inline Loading Component
 * Shows loading indicator inline with text
 */
export function InlineLoading({
  message = 'Loading',
  size = 'sm',
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex items-center gap-2">
      <Loader className={`${sizeClass[size]} text-primary animate-spin`} />
      <span className="text-muted-foreground text-sm">{message}</span>
    </div>
  );
}
