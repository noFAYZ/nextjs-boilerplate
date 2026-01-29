'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Skeleton } from './skeleton';

interface WidgetSkeletonProps {
  variant?: 'chart' | 'list' | 'grid' | 'metric' | 'table';
  itemsCount?: number;
  className?: string;
}

/**
 * WidgetSkeleton Component
 *
 * Standardized skeleton component for dashboard widgets with uniform sizing
 * and patterns. Provides content-aware loading states that match actual content.
 *
 * Variants:
 * - chart: For chart-based widgets (line charts, bar charts, etc.)
 * - list: For list-based widgets (recent activity, transactions, etc.)
 * - grid: For grid-based widgets (token allocation, portfolio cards, etc.)
 * - metric: For metric/stat widgets (single large value + label)
 * - table: For table-based widgets (headers + data rows)
 *
 * @example
 * <WidgetSkeleton variant="chart" />
 * <WidgetSkeleton variant="list" itemsCount={3} />
 * <WidgetSkeleton variant="grid" itemsCount={4} />
 */
export function WidgetSkeleton({
  variant = 'list',
  itemsCount = 3,
  className,
}: WidgetSkeletonProps) {
  // Chart Widget Skeleton
  if (variant === 'chart') {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-4">
          {/* Widget Title */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" animation="shimmer" />
            <Skeleton className="h-4 w-12" animation="shimmer" />
          </div>

          {/* Chart Placeholder - Large Rectangle */}
          <Skeleton
            className="w-full rounded-lg"
            style={{ height: '280px' }}
            animation="shimmer"
          />

          {/* Chart Legend/Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-10 rounded-lg" animation="shimmer" />
            <Skeleton className="h-10 rounded-lg" animation="shimmer" />
          </div>
        </div>
      </Card>
    );
  }

  // Metric Widget Skeleton
  if (variant === 'metric') {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-4">
          {/* Label */}
          <Skeleton className="h-3 w-24" animation="shimmer" />

          {/* Large Value */}
          <Skeleton className="h-12 w-40" animation="shimmer" />

          {/* Subtitle/Change */}
          <Skeleton className="h-3 w-32" animation="shimmer" />
        </div>
      </Card>
    );
  }

  // Table Widget Skeleton
  if (variant === 'table') {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 pb-3 border-b border-border/50">
            <Skeleton className="h-4 w-20" animation="shimmer" />
            <Skeleton className="h-4 w-20" animation="shimmer" />
            <Skeleton className="h-4 w-16" animation="shimmer" />
          </div>

          {/* Table Rows */}
          {[...Array(itemsCount)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <Skeleton className="h-4 w-32" animation="shimmer" />
              <Skeleton className="h-4 w-24" animation="shimmer" />
              <Skeleton className="h-4 w-16" animation="shimmer" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Grid Widget Skeleton
  if (variant === 'grid') {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-4">
          {/* Title */}
          <Skeleton className="h-4 w-32" animation="shimmer" />

          {/* Grid Items */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[...Array(itemsCount)].map((_, i) => (
              <div key={i} className="space-y-3">
                {/* Card Placeholder */}
                <Skeleton
                  className="w-full rounded-lg"
                  style={{ height: '100px' }}
                  animation="shimmer"
                />
                {/* Label */}
                <Skeleton className="h-3 w-20" animation="shimmer" />
                {/* Value */}
                <Skeleton className="h-4 w-24" animation="shimmer" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // List Widget Skeleton (Default)
  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-4">
        {/* Widget Title and Action */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" animation="shimmer" />
          <Skeleton className="h-8 w-12" animation="shimmer" />
        </div>

        {/* List Items */}
        <div className="space-y-3">
          {[...Array(itemsCount)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Icon Placeholder */}
              <Skeleton
                className="h-10 w-10 rounded-lg flex-shrink-0"
                animation="shimmer"
              />

              {/* Content */}
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 w-32" animation="shimmer" />
                <Skeleton className="h-3 w-24" animation="shimmer" />
              </div>

              {/* Value */}
              <div className="flex-shrink-0">
                <Skeleton className="h-4 w-16" animation="shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Convenience wrapper for common use cases
 */
export const ChartWidgetSkeleton = (props?: Omit<WidgetSkeletonProps, 'variant'>) => (
  <WidgetSkeleton variant="chart" {...props} />
);

export const ListWidgetSkeleton = (props?: Omit<WidgetSkeletonProps, 'variant'>) => (
  <WidgetSkeleton variant="list" {...props} />
);

export const GridWidgetSkeleton = (props?: Omit<WidgetSkeletonProps, 'variant'>) => (
  <WidgetSkeleton variant="grid" {...props} />
);

export const MetricWidgetSkeleton = (props?: Omit<WidgetSkeletonProps, 'variant'>) => (
  <WidgetSkeleton variant="metric" {...props} />
);

export const TableWidgetSkeleton = (props?: Omit<WidgetSkeletonProps, 'variant'>) => (
  <WidgetSkeleton variant="table" {...props} />
);
