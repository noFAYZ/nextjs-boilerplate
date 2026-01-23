'use client';

import * as React from 'react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  SidebarStateContext,
  SidebarStateDispatchContext,
  SidebarStateContextType,
  SidebarStateDispatchContextType,
} from './context';

interface SidebarV2ProviderProps {
  children: ReactNode;
  defaultExpanded?: boolean;
}

/**
 * SidebarV2Provider Component
 *
 * Performance-optimized provider that:
 * - Separates state and dispatch contexts to prevent unnecessary re-renders
 * - Memoizes context values to prevent object recreation
 * - Uses useCallback for stable dispatch function references
 * - Provides sidebar state management to all descendant components
 *
 * Architecture:
 * - State context: changes when hover state changes
 * - Dispatch context: stable, won't cause re-renders unless accessed
 * - Components can subscribe to only the context they need
 *
 * Example usage:
 * ```
 * <SidebarV2Provider defaultExpanded={false}>
 *   <App />
 * </SidebarV2Provider>
 * ```
 */
const SidebarV2Provider = React.memo(function SidebarV2Provider({
  children,
  defaultExpanded = false,
}: SidebarV2ProviderProps) {
  // State management
  const [isHovering, setIsHoveringState] = useState(false);

  /**
   * Memoized dispatch function
   * - Prevents function recreation on every render
   * - Stable reference for dispatch context consumers
   * - Won't trigger re-renders of dispatch-only consumers
   */
  const setIsHovering = useCallback((value: boolean) => {
    setIsHoveringState(value);
  }, []);

  /**
   * Compute expanded state
   * Memoized to prevent re-computation on every render
   */
  const isExpanded = useMemo(() => isHovering || defaultExpanded, [isHovering, defaultExpanded]);

  /**
   * Memoize state context value
   * - Only recreate when actual values change
   * - Prevents unnecessary re-renders of state consumers
   */
  const stateContextValue = useMemo<SidebarStateContextType>(
    () => ({
      isHovering,
      isExpanded,
    }),
    [isHovering, isExpanded]
  );

  /**
   * Memoize dispatch context value
   * - Stable reference across renders
   * - Only recreate if setIsHovering changes (shouldn't happen)
   */
  const dispatchContextValue = useMemo<SidebarStateDispatchContextType>(
    () => ({
      setIsHovering,
    }),
    [setIsHovering]
  );

  return (
    <SidebarStateContext.Provider value={stateContextValue}>
      <SidebarStateDispatchContext.Provider value={dispatchContextValue}>
        {children}
      </SidebarStateDispatchContext.Provider>
    </SidebarStateContext.Provider>
  );
});

SidebarV2Provider.displayName = 'SidebarV2Provider';

export { SidebarV2Provider };
export type { SidebarV2ProviderProps };
