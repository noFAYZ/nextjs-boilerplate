'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export type ViewMode = 'beginner' | 'pro';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  isProMode: boolean;
  isBeginnerMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

interface ViewModeProviderProps {
  children: React.ReactNode;
}

export function ViewModeProvider({ children }: ViewModeProviderProps) {
  const [viewMode, setViewModeState] = useState<ViewMode>('beginner');
  const [isHydrated, setIsHydrated] = useState(false);
  const { theme, setTheme } = useTheme();

  // Load saved view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('wallet-view-mode') as ViewMode;
    if (savedViewMode && (savedViewMode === 'beginner' || savedViewMode === 'pro')) {
      setViewModeState(savedViewMode);
    }
    setIsHydrated(true);
  }, []);


  // Save view mode to localStorage whenever it changes
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (isHydrated) {
      localStorage.setItem('wallet-view-mode', mode);
    }
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'beginner' ? 'pro' : 'beginner';
    
    // Auto-sync theme when switching view modes
    if (newMode === 'pro') {
      // Switch to pro theme variant
      if (theme === 'light' || !theme) {
        setTheme('light-pro');
      } else if (theme === 'dark') {
        setTheme('dark-pro');
      }
    } else {
      // Switch to standard theme variant
      if (theme === 'light-pro') {
        setTheme('light');
      } else if (theme === 'dark-pro') {
        setTheme('dark');
      }
    }
    
    setViewMode(newMode);
  };

  const value: ViewModeContextType = {
    viewMode,
    setViewMode,
    toggleViewMode,
    isProMode: viewMode === 'pro',
    isBeginnerMode: viewMode === 'beginner'
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return (
      <ViewModeContext.Provider value={{ ...value, viewMode: 'beginner' }}>
        {children}
      </ViewModeContext.Provider>
    );
  }

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextType {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

// Hook for conditional classes based on view mode
export function useViewModeClasses() {
  const { viewMode, isProMode, isBeginnerMode } = useViewMode();
  
  return {
    containerClass: isProMode ? 'max-w-7xl' : 'max-w-3xl mx-auto',
    pageClass: isProMode ? 'max-w-7xl mx-auto' : 'max-w-3xl mx-auto',
    cardSpacing: isProMode ? 'space-y-4' : 'space-y-6',
    padding: isProMode ? 'p-4 lg:p-6' : 'p-6',
    viewMode,
    isProMode,
    isBeginnerMode
  };
}