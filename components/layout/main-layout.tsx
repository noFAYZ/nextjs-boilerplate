'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './header';
import { SidebarLayout } from '@/components/sidebar';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { useUnifiedAutoSync } from '@/lib/hooks/use-unified-auto-sync';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
}

export function MainLayout({
  children,
  className,
  showHeader = true,
  showSidebar = true
}: MainLayoutProps) {
  const { isProMode, isBeginnerMode } = useViewMode();
  // Trigger unified auto-sync on authentication
  useUnifiedAutoSync();
  
  // In pro mode, we hide the sidebar and show header
  // In beginner mode, we show sidebar and hide header
  const shouldShowSidebar = showSidebar && !isProMode;
  const shouldShowHeader = showHeader && !isBeginnerMode;

  if (!shouldShowSidebar) {
    // Pro mode layout - no sidebar, full width with header
    return (
      <div className={cn("min-h-screen ", className)}>
        {shouldShowHeader && <Header />}
     
          <div className={cn(
            "h-full",
            isProMode ? "max-w-7xl mx-auto" : "max-w-3xl mx-auto"
          )}>
            {children}
          </div>
       
      </div>
    );
  }

  // Standard layout with sidebar (beginner mode - no header)
  return (
    <div className={cn("min-h-screen ", className)}>
      {shouldShowHeader && <Header />}

      <div className={shouldShowHeader ? "h-[calc(100vh-theme(spacing.16))]" : "h-screen"}>
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </div>
    </div>
  );
}