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
const MENU_ROUTES = {
  dashboard: '/dashboard',
  wallets: '/dashboard/wallets',
  portfolio: '/dashboard/portfolio', 
  transactions: '/dashboard/transactions',
  goals: '/dashboard/goals',
  insights: '/dashboard/insights'
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
  const activeMenuItem = React.useMemo(() => {
    for (const [key, route] of Object.entries(MENU_ROUTES)) {
      if (pathname.startsWith(route)) {
        return key;
      }
    }
    return null;
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

  // Only auto-select menu item on initial load or when no item is selected
  useEffect(() => {
    if (activeMenuItem && !selectedMenuItem) {
      setSelectedMenuItemState(activeMenuItem);
      if (!isExpanded) {
        setIsExpandedState(true);
      }
    }
  }, [activeMenuItem, selectedMenuItem, isExpanded]);

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