/**
 * Sidebar V2 Context
 *
 * Performance-optimized context for sidebar state management.
 * Separated into distinct contexts to prevent unnecessary re-renders:
 * - SidebarStateContext: Expandable state (changes on hover)
 * - SidebarStateDispatchContext: State updaters (stable references)
 */

import { createContext } from 'react';

/**
 * Sidebar state context
 * Holds all readable state values that affect rendering
 */
export interface SidebarStateContextType {
  isHovering: boolean;
  isExpanded: boolean;
}

/**
 * Sidebar dispatch context
 * Holds all state update functions (stable, won't cause re-renders of other consumers)
 */
export interface SidebarStateDispatchContextType {
  setIsHovering: (value: boolean) => void;
}

/**
 * State context - use when you need to read sidebar state
 * Consumers will re-render when any value changes
 */
export const SidebarStateContext = createContext<SidebarStateContextType | undefined>(undefined);

/**
 * Dispatch context - use when you only need to dispatch actions
 * Consumers won't re-render when state changes (stable references)
 */
export const SidebarStateDispatchContext = createContext<SidebarStateDispatchContextType | undefined>(
  undefined
);

// Display names for React DevTools
SidebarStateContext.displayName = 'SidebarStateContext';
SidebarStateDispatchContext.displayName = 'SidebarStateDispatchContext';
