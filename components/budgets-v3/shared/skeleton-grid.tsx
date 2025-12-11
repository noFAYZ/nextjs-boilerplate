'use client';

/**
 * Skeleton Grid Component
 * Loading state for grid-based layouts
 */

import { SkeletonCard } from './skeleton-card';

interface SkeletonGridProps {
  columns?: 1 | 2 | 3 | 4;
  count?: number;
  variant?: 'card' | 'metric';
}

export function SkeletonGrid({
  columns = 3,
  count = 6,
  variant = 'card',
}: SkeletonGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClass[columns]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard
          key={i}
          variant={variant === 'metric' ? 'metric' : 'default'}
          hasHeader={variant === 'card'}
        />
      ))}
    </div>
  );
}
