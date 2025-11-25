'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface GoalCardSkeletonProps {
  className?: string;
}

export function GoalCardSkeleton({ className }: GoalCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col justify-between rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted/30 p-4 space-y-3',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>

      {/* Progress and Amount */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Status and Actions */}
      <Skeleton className="h-8 w-full" />
    </Card>
  );
}
