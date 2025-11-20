'use client';

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Configuration options for the useSidebar hook
 * @property defaultExpanded - Initial expanded state (default: true)
 * @property persistState - Whether to persist state to localStorage (default: true)
 * @property storageKey - localStorage key for persisting state (default: 'sidebar-state-v1')
 */
interface UseSidebarOptions {
  defaultExpanded?: boolean;
  persistState?: boolean;
  storageKey?: string;
}

/**
 * Return value from the useSidebar hook
 * @property isExpanded - Secondary column expanded state
 * @property mainColumnExpanded - Main sidebar column expanded/collapsed state
 * @property selectedMenuItem - Currently selected menu item ID
 * @property activeMenuItem - Active menu item based on current route
 * @property toggleExpanded - Toggle secondary column expansion
 * @property setExpanded - Set secondary column expansion state
 * @property toggleMainColumn - Toggle main column expansion
 * @property setMainColumnExpanded - Set main column expansion state
 * @property selectMenuItem - Select a specific menu item
 * @property isCollapsed - Alias for !isExpanded (secondary column collapsed)
 */
interface UseSidebarReturn {
  isExpanded: boolean;
  mainColumnExpanded: boolean;
  selectedMenuItem: string | null;
  activeMenuItem: string | null;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  toggleMainColumn: () => void;
  setMainColumnExpanded: (expanded: boolean) => void;
  selectMenuItem: (itemId: string | null) => void;
  isCollapsed: boolean;
}

const STORAGE_KEY = 'sidebar-state-v1';
// Order matters: more specific routes first
const MENU_ROUTES: Record<string, string> = {
  integrations: '/accounts/integrations',
  accounts: '/accounts',
  portfolio: '/portfolio',
  transactions: '/transactions',
  subscriptions: '/subscriptions',
  goals: '/goals',
  insights: '/insights',
  dashboard: '/dashboard'
};

/**
 * Custom hook for managing sidebar state with persistent storage
 *
 * DESIGN PRINCIPLES:
 * 1. Single Source of Truth - All state initialized once from localStorage
 * 2. No Auto-Expansion - Sidebar state only changes on explicit user action
 * 3. Route Sync - Menu item updates on navigation, but sidebar state stays constant
 * 4. Persistent State - User's collapse/expand preference survives page refresh
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Synchronous initialization from localStorage to prevent flashing
 * - Consolidated state object to reduce re-renders
 * - Memoized active menu item calculation based on pathname
 * - useCallback for all callback functions to prevent child re-renders
 *
 * @param options Configuration options for the hook
 * @returns Sidebar state and control functions
 *
 * @example
 * const {
 *   mainColumnExpanded,
 *   toggleMainColumn,
 *   selectedMenuItem,
 *   activeMenuItem,
 *   selectMenuItem
 * } = useSidebar({ defaultExpanded: true });
 */
export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const {
    defaultExpanded = true,
    persistState = true,
    storageKey = STORAGE_KEY
  } = options;

  const pathname = usePathname();

  /**
   * Synchronously initialize sidebar state from localStorage
   * Called once during component mount via useState initializer
   *
   * KEY BENEFITS:
   * - No hydration mismatch (renders correct state from the start)
   * - No flashing (persisted state applied immediately)
   * - Graceful fallback if localStorage unavailable
   *
   * @returns Initial state from localStorage or defaults
   */
  const initializeState = (): { isExpanded: boolean; mainColumnExpanded: boolean; selectedMenuItem: string | null } => {
    if (!persistState || typeof window === 'undefined') {
      return {
        isExpanded: defaultExpanded,
        mainColumnExpanded: true,
        selectedMenuItem: null
      };
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        return {
          isExpanded: defaultExpanded,
          mainColumnExpanded: true,
          selectedMenuItem: null
        };
      }

      const parsed = JSON.parse(stored);
      return {
        isExpanded: typeof parsed.isExpanded === 'boolean' ? parsed.isExpanded : defaultExpanded,
        mainColumnExpanded: typeof parsed.mainColumnExpanded === 'boolean' ? parsed.mainColumnExpanded : true,
        selectedMenuItem: typeof parsed.selectedMenuItem === 'string' ? parsed.selectedMenuItem : null
      };
    } catch (error) {
      console.error('Failed to read sidebar state from localStorage:', error);
      return {
        isExpanded: defaultExpanded,
        mainColumnExpanded: true,
        selectedMenuItem: null
      };
    }
  };

  // Initialize all states at once (called only once on mount)
  const [{ isExpanded, mainColumnExpanded, selectedMenuItem }, setState] = useState(() => {
    return initializeState();
  });

  // Helper functions to update individual pieces of state
  const setIsExpandedState = (value: boolean | ((prev: boolean) => boolean)) => {
    setState((prev) => ({
      ...prev,
      isExpanded: typeof value === 'function' ? value(prev.isExpanded) : value
    }));
  };

  const setMainColumnExpandedState = (value: boolean | ((prev: boolean) => boolean)) => {
    setState((prev) => ({
      ...prev,
      mainColumnExpanded: typeof value === 'function' ? value(prev.mainColumnExpanded) : value
    }));
  };

  const setSelectedMenuItemState = (value: string | null | ((prev: string | null) => string | null)) => {
    setState((prev) => ({
      ...prev,
      selectedMenuItem: typeof value === 'function' ? value(prev.selectedMenuItem) : value
    }));
  };

  // Determine active menu item based on current pathname
  // Match the most specific (longest) route first
  const activeMenuItem = React.useMemo(() => {
    let bestMatch = null;
    let longestMatchLength = 0;

    for (const [key, route] of Object.entries(MENU_ROUTES)) {
      // Check for exact match or if pathname starts with the route
      const isExactMatch = pathname === route;
      const isSubRoute = pathname.startsWith(route + '/') || pathname.startsWith(route + '?');

      if (isExactMatch || isSubRoute) {
        // Prefer the longest matching route (most specific)
        if (route.length > longestMatchLength) {
          longestMatchLength = route.length;
          bestMatch = key;
        }
      }
    }

    return bestMatch;
  }, [pathname]);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          isExpanded,
          mainColumnExpanded,
          selectedMenuItem
        })
      );
    } catch (error) {
      console.error('Failed to persist sidebar state to localStorage:', error);
    }
  }, [isExpanded, mainColumnExpanded, selectedMenuItem, persistState, storageKey]);

  // Sync selectedMenuItem with activeMenuItem when route changes
  // IMPORTANT: Do NOT auto-expand or collapse the sidebar during navigation
  // The sidebar state should only change when the user explicitly toggles it
  useEffect(() => {
    if (!activeMenuItem) return;

    // Only update selectedMenuItem to match current route
    // This allows highlighting the correct menu item without changing sidebar state
    setSelectedMenuItemState(activeMenuItem);
  }, [activeMenuItem]);

  const toggleExpanded = useCallback(() => {
    setIsExpandedState((prev: boolean) => !prev);
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setIsExpandedState(expanded);
  }, []);

  const toggleMainColumn = useCallback(() => {
    setMainColumnExpandedState((prev: boolean) => !prev);
  }, []);

  const setMainColumnExpanded = useCallback((expanded: boolean) => {
    setMainColumnExpandedState(expanded);
  }, []);

  const selectMenuItem = useCallback((itemId: string | null) => {
    // Simply update the selected menu item without changing sidebar state
    // The sidebar state is controlled only by explicit toggle actions
    setSelectedMenuItemState(itemId);
  }, []);

  return {
    isExpanded,
    mainColumnExpanded,
    selectedMenuItem,
    activeMenuItem,
    toggleExpanded,
    setExpanded,
    toggleMainColumn,
    setMainColumnExpanded,
    selectMenuItem,
    isCollapsed: !isExpanded
  };
}