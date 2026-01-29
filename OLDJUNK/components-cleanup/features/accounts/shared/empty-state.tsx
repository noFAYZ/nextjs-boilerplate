'use client';

import { AlertCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

/**
 * Empty state component for accounts table/card view
 * Shows different messages based on whether filters are applied
 */
export function EmptyState({ hasFilters = false, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-3 mb-4">
        {hasFilters ? (
          <Filter className="h-6 w-6 text-muted-foreground" />
        ) : (
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {hasFilters ? 'No accounts match your filters' : 'No accounts yet'}
      </h3>

      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {hasFilters
          ? 'Try adjusting your search or filter criteria to find what you are looking for.'
          : 'Connect your bank accounts, manual accounts, or cryptocurrency wallets to get started.'}
      </p>

      {hasFilters && onClearFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Clear filters
        </Button>
      )}

      {!hasFilters && (
        <div className="text-xs text-muted-foreground">
          Go to the <span className="font-semibold">Connect</span> tab to add your first account.
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton loader for table view while loading
 */
export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="h-12 bg-muted rounded-lg animate-pulse" />

      {/* Table rows skeleton */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="h-12 bg-muted border-b border-border/30 animate-pulse" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-muted/50 border-b border-border/30 animate-pulse last:border-b-0"
            style={{
              animationDelay: `${i * 50}ms`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for card grid view while loading
 */
export function CardGridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-56 bg-muted rounded-xl animate-pulse"
          style={{
            animationDelay: `${i * 50}ms`,
            animationDuration: '2s',
          }}
        />
      ))}
    </div>
  );
}
