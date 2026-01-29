'use client';

import { useContext } from 'react';
import {
  SidebarStateContext,
  SidebarStateDispatchContext,
  SidebarStateContextType,
  SidebarStateDispatchContextType,
} from './context';

/**
 * useSidebarV2State Hook
 *
 * Access sidebar state (read-only)
 * Component will re-render when sidebar state changes
 *
 * Returns:
 * - isHovering: Whether user is hovering over the sidebar
 * - isExpanded: Whether sidebar is expanded (hovering || defaultExpanded)
 *
 * Example:
 * ```
 * const { isExpanded, isHovering } = useSidebarV2State();
 * ```
 *
 * @throws Error if used outside SidebarV2Provider
 */
export function useSidebarV2State(): SidebarStateContextType {
  const context = useContext(SidebarStateContext);

  if (!context) {
    throw new Error(
      'useSidebarV2State must be used within SidebarV2Provider. ' +
        'Wrap your component tree with <SidebarV2Provider>'
    );
  }

  return context;
}

/**
 * useSidebarV2Dispatch Hook
 *
 * Access sidebar dispatch functions (state updaters)
 * Component will NOT re-render when sidebar state changes
 * Useful for components that only need to trigger state updates
 *
 * Returns:
 * - setIsHovering: Function to update hover state
 *
 * Example:
 * ```
 * const { setIsHovering } = useSidebarV2Dispatch();
 *
 * <div
 *   onMouseEnter={() => setIsHovering(true)}
 *   onMouseLeave={() => setIsHovering(false)}
 * />
 * ```
 *
 * @throws Error if used outside SidebarV2Provider
 */
export function useSidebarV2Dispatch(): SidebarStateDispatchContextType {
  const context = useContext(SidebarStateDispatchContext);

  if (!context) {
    throw new Error(
      'useSidebarV2Dispatch must be used within SidebarV2Provider. ' +
        'Wrap your component tree with <SidebarV2Provider>'
    );
  }

  return context;
}

/**
 * useSidebarV2 Hook
 *
 * Access both sidebar state and dispatch
 * Use when component needs both reading and updating sidebar state
 *
 * Note: This will cause re-renders when state changes. For components that only
 * need dispatch, use useSidebarV2Dispatch() instead for better performance.
 *
 * Returns:
 * - state: { isHovering, isExpanded }
 * - dispatch: { setIsHovering }
 *
 * Example:
 * ```
 * const { state, dispatch } = useSidebarV2();
 * ```
 *
 * @throws Error if used outside SidebarV2Provider
 */
export function useSidebarV2() {
  const state = useSidebarV2State();
  const dispatch = useSidebarV2Dispatch();

  return { state, dispatch };
}
