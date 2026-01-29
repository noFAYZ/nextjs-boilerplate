'use client';

import { cn } from '@/lib/utils';
import { useBreakpointValue } from '@/lib/hooks/use-breakpoint-value';

/**
 * Skeleton card for loading states in grid view
 * Displays animated placeholder matching AccountCard dimensions
 */
export function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'border border-border/50 shadow-sm',
        'bg-card'
      )}
      style={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Content */}
      <div className="p-5 h-72 flex flex-col gap-4">
        {/* Header: Logo and title */}
        <div className="flex items-start gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Balance section */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded w-1/2" />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/30">
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards for loading states
 * Shows responsive grid matching AccountsCardGrid
 */
export function CardGridSkeleton() {
  const columnCount = useBreakpointValue({
    base: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4,
  });

  const cardCount = columnCount ? columnCount * 3 : 8; // Show 3 rows worth

  return (
    <div className="space-y-4 px-4 py-4">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columnCount || 1}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: cardCount }).map((_, index) => (
          <CardSkeleton key={index} delay={index * 50} />
        ))}
      </div>
    </div>
  );
}
