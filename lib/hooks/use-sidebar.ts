'use client';

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface UseSidebarOptions {
  defaultExpanded?: boolean;
  persistState?: boolean;
  storageKey?: string;
}

interface UseSidebarReturn {
  isExpanded: boolean;
  selectedMenuItem: string | null;
  activeMenuItem: string | null;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  selectMenuItem: (itemId: string | null) => void;
  isCollapsed: boolean;
}

const STORAGE_KEY = 'sidebar-state';
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

export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const {
    defaultExpanded = true,
    persistState = true,
    storageKey = STORAGE_KEY
  } = options;

  const pathname = usePathname();
  
  // Initialize state from localStorage if available
  const [isExpanded, setIsExpandedState] = useState(() => {
    if (!persistState || typeof window === 'undefined') {
      return defaultExpanded;
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored).isExpanded : defaultExpanded;
    } catch {
      return defaultExpanded;
    }
  });

  const [selectedMenuItem, setSelectedMenuItemState] = useState<string | null>(() => {
    if (!persistState || typeof window === 'undefined') {
      return null;
    }
    
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored).selectedMenuItem : null;
    } catch {
      return null;
    }
  });

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

  // Persist state to localStorage
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          isExpanded,
          selectedMenuItem
        })
      );
    } catch (error) {
      console.warn('Failed to persist sidebar state:', error);
    }
  }, [isExpanded, selectedMenuItem, persistState, storageKey]);

  // Sync selectedMenuItem with activeMenuItem when route changes
  useEffect(() => {
    if (activeMenuItem) {
      // Always update selectedMenuItem to match the current route
      setSelectedMenuItemState(activeMenuItem);
      if (!isExpanded) {
        setIsExpandedState(true);
      }
    }
  }, [activeMenuItem, isExpanded]);

  const toggleExpanded = useCallback(() => {
    setIsExpandedState((prev: boolean) => !prev);
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setIsExpandedState(expanded);
  }, []);

  const selectMenuItem = useCallback((itemId: string | null) => {
    setSelectedMenuItemState(itemId);
    if (itemId && !isExpanded) {
      setIsExpandedState(true);
    }
  }, [isExpanded]);

  return {
    isExpanded,
    selectedMenuItem,
    activeMenuItem,
    toggleExpanded,
    setExpanded,
    selectMenuItem,
    isCollapsed: !isExpanded
  };
}