'use client';

import * as React from 'react';
import { ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
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
  const [isPinned, setIsPinnedState] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar-v2-pinned');
      return stored === 'true';
    }
    return false;
  });

  /**
   * Persist pin state to localStorage
   * - Survives page navigation and browser refresh
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-v2-pinned', isPinned.toString());
    }
  }, [isPinned]);

  /**
   * Memoized dispatch functions
   * - Prevents function recreation on every render
   * - Stable reference for dispatch context consumers
   * - Won't trigger re-renders of dispatch-only consumers
   */
  const setIsHovering = useCallback((value: boolean) => {
    setIsHoveringState(value);
  }, []);

  const setIsPinned = useCallback((value: boolean) => {
    setIsPinnedState(value);
  }, []);

  /**
   * Compute expanded state
   * Memoized to prevent re-computation on every render
   * Sidebar is expanded if: hovering OR pinned OR defaultExpanded
   */
  const isExpanded = useMemo(() => isHovering || isPinned || defaultExpanded, [isHovering, isPinned, defaultExpanded]);

  /**
   * Memoize state context value
   * - Only recreate when actual values change
   * - Prevents unnecessary re-renders of state consumers
   */
  const stateContextValue = useMemo<SidebarStateContextType>(
    () => ({
      isHovering,
      isExpanded,
      isPinned,
    }),
    [isHovering, isExpanded, isPinned]
  );

  /**
   * Memoize dispatch context value
   * - Stable reference across renders
   * - Only recreate if dispatch functions change (shouldn't happen)
   */
  const dispatchContextValue = useMemo<SidebarStateDispatchContextType>(
    () => ({
      setIsHovering,
      setIsPinned,
    }),
    [setIsHovering, setIsPinned]
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
