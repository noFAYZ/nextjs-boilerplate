'use client';

import * as React from 'react';
import { LogoLoader } from '@/components/icons';
import { cn } from '@/lib/utils';

interface AnimatedLogoLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spin' | 'pulse' | 'breathe';
  message?: string;
  className?: string;
}

const sizeMap = {
  xs: { logo: 16, container: 'w-8 h-8' },
  sm: { logo: 24, container: 'w-10 h-10' },
  md: { logo: 32, container: 'w-12 h-12' },
  lg: { logo: 48, container: 'w-16 h-16' },
  xl: { logo: 64, container: 'w-20 h-20' },
};

const animationMap = {
  spin: 'animate-spin-smooth',
  pulse: 'animate-pulse-scale',
  breathe: 'animate-breathe',
};

/**
 * AnimatedLogoLoader Component
 *
 * A pure CSS-animated logo loader using the existing LogoLoader SVG.
 * Provides smooth, performant loading animations without external libraries.
 *
 * @example
 * <AnimatedLogoLoader size="md" variant="spin" message="Loading..." />
 */
export const AnimatedLogoLoader = React.memo(function AnimatedLogoLoader({
  size = 'md',
  variant = 'spin',
  message,
  className,
}: AnimatedLogoLoaderProps) {
  const sizeConfig = sizeMap[size];
  const animationClass = animationMap[variant];

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Animated Logo Container */}
      <div
        className={cn(
          sizeConfig.container,
          'flex items-center justify-center',
          'will-change-transform', // GPU acceleration hint
          animationClass,
        )}
        aria-hidden="true"
      >
        <LogoLoader
          size={sizeConfig.logo}
          className="w-full h-full"
        />
      </div>

      {/* Optional Message */}
      {message && (
        <p
          className="text-sm font-medium text-muted-foreground text-center"
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
});

AnimatedLogoLoader.displayName = 'AnimatedLogoLoader';
