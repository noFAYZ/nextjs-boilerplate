'use client';

import { Loader2 } from 'lucide-react';

interface RefetchLoadingOverlayProps {
  isLoading: boolean;
  label?: string;
  fullScreen?: boolean;
}

/**
 * RefetchLoadingOverlay
 *
 * Shows a loading indicator overlay when organization data is being refetched
 * Place this component inside a relative-positioned container for proper positioning
 *
 * Usage:
 * ```tsx
 * <div className="relative">
 *   <YourContent />
 *   <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
 * </div>
 * ```
 */
export function RefetchLoadingOverlay({
  isLoading,
  label = 'Updating data...',
  fullScreen = false,
}: RefetchLoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-40'
      } bg-background/50 backdrop-blur-sm flex items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
