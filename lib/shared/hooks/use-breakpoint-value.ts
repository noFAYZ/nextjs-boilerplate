'use client';

import { useEffect, useState } from 'react';

type BreakpointValue<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Get the current breakpoint name
 */
function getCurrentBreakpoint(): 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  if (typeof window === 'undefined') return 'base';

  const width = window.innerWidth;

  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';

  return 'base';
}

/**
 * Hook to get a value based on current breakpoint
 * Similar to Chakra UI's useBreakpointValue
 *
 * @param values Object with breakpoint keys and values
 * @returns The value for the current breakpoint
 *
 * @example
 * const columns = useBreakpointValue({
 *   base: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 * });
 */
export function useBreakpointValue<T>(values: BreakpointValue<T>): T | undefined {
  const [breakpoint, setBreakpoint] = useState<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('base');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBreakpoint(getCurrentBreakpoint());

    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    // Return base value during SSR
    return values.base;
  }

  // Find the value for current breakpoint, fallback to smaller breakpoints
  const breakpointOrder: Array<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = [
    'base',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
  ];

  const currentIndex = breakpointOrder.indexOf(breakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

/**
 * Hook to check if current breakpoint matches a condition
 *
 * @example
 * const isLargeScreen = useBreakpointUp('lg');
 */
export function useBreakpointUp(breakpoint: keyof BreakpointValue<boolean>): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const breakpointValues = {
      base: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    };

    const targetWidth = breakpointValues[breakpoint as keyof typeof breakpointValues] || 0;

    setMatches(window.innerWidth >= targetWidth);

    const handleResize = () => {
      setMatches(window.innerWidth >= targetWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to check if current breakpoint is below a threshold
 *
 * @example
 * const isSmallScreen = useBreakpointDown('md');
 */
export function useBreakpointDown(breakpoint: keyof BreakpointValue<boolean>): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const breakpointValues = {
      base: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    };

    const targetWidth = breakpointValues[breakpoint as keyof typeof breakpointValues] || 0;

    setMatches(window.innerWidth < targetWidth);

    const handleResize = () => {
      setMatches(window.innerWidth < targetWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return matches;
}
