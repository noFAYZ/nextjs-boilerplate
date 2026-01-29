'use client';

/**
 * Responsive Container Component
 * Manages responsive grid layouts
 */

import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const gapMap = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const columnMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ResponsiveContainer({
  children,
  columns = 3,
  gap = 'md',
}: ResponsiveContainerProps) {
  return (
    <div className={`grid ${columnMap[columns]} ${gapMap[gap]}`}>
      {children}
    </div>
  );
}

/**
 * Responsive Flex Container
 */
interface ResponsiveFlexProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'between' | 'around' | 'end';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  end: 'justify-end',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export function ResponsiveFlex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'center',
  gap = 'md',
  wrap = false,
}: ResponsiveFlexProps) {
  const directionClass = direction === 'col' ? 'flex-col' : 'flex-row';
  const wrapClass = wrap ? 'flex-wrap' : '';

  return (
    <div
      className={`flex ${directionClass} ${justifyMap[justify]} ${alignMap[align]} ${gapMap[gap]} ${wrapClass}`}
    >
      {children}
    </div>
  );
}
