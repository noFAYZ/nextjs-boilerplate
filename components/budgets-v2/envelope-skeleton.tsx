'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export function EnvelopeSkeleton() {
  return (
    <Card className="p-4 space-y-3 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-8 w-8 rounded bg-muted" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
        <div className="h-8 w-8 rounded bg-muted" />
      </div>

      {/* Budget Info */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
        <div className="h-2 bg-muted rounded-full" />
      </div>

      {/* Spent */}
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>

      {/* Available */}
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>

      {/* Status */}
      <div className="pt-3 border-t flex justify-between">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-3 w-16 bg-muted rounded" />
      </div>
    </Card>
  );
}

interface EnvelopeSkeletonsProps {
  count?: number;
  variant?: 'grid' | 'list';
}

export function EnvelopeSkeletons({
  count = 6,
  variant = 'grid',
}: EnvelopeSkeletonsProps) {
  return (
    <div
      className={
        variant === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      }
    >
      {[...Array(count)].map((_, i) => (
        <EnvelopeSkeleton key={i} />
      ))}
    </div>
  );
}
