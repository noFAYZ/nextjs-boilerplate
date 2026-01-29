'use client';

/**
 * Skeleton List Component
 * Loading state for list and table layouts
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonListProps {
  count?: number;
  hasHeader?: boolean;
  columns?: number;
}

export function SkeletonList({
  count = 5,
  hasHeader = true,
  columns = 3,
}: SkeletonListProps) {
  return (
    <Card>
      {hasHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
      )}

      <CardContent className="space-y-3">
        {/* Table Header */}
        <div className="hidden md:grid gap-4 p-3 border-b border-border bg-secondary/30 rounded-lg"
             style={{
               gridTemplateColumns: `repeat(${columns}, 1fr)`,
             }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>

        {/* List Items */}
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="grid gap-4 p-3 border border-border rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
