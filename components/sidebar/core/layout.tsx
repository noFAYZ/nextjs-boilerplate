'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { MainHeader } from './main-header';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

interface SidebarLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  defaultSidebarExpanded?: boolean;
  showHeader?: boolean;
}

export function SidebarLayout({
  children,
  className,
  sidebarClassName,
  defaultSidebarExpanded = true,
  showHeader = true
}: SidebarLayoutProps) {
  const {
    mainColumnExpanded,
    toggleMainColumn,
    selectedMenuItem,
    activeMenuItem,
    selectMenuItem
  } = useSidebar({ defaultExpanded: defaultSidebarExpanded });

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu when a menu item is clicked
  const handleMenuItemClick = React.useCallback((itemId: string | null) => {
    selectMenuItem(itemId);
    setMobileMenuOpen(false);
  }, [selectMenuItem]);

  return (
    <div className={cn("flex h-screen bg-background", className)}>
    {/* Desktop Sidebar */}
    <div className="hidden md:flex md:flex-col">
      <Sidebar
        className={sidebarClassName}
        defaultExpanded={defaultSidebarExpanded}
        mainColumnExpanded={mainColumnExpanded}
        onToggleMainColumn={toggleMainColumn}
        selectedMenuItem={selectedMenuItem}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={selectMenuItem}
      />
    </div>

    {/* Mobile Sidebar */}
    <div className="md:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild />
        <SheetContent side="left" className="w-70 p-0 border-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar
            className={sidebarClassName}
            defaultExpanded={true}
            mainColumnExpanded={true}
            onToggleMainColumn={() => {}}
            selectedMenuItem={selectedMenuItem}
            activeMenuItem={activeMenuItem}
            onMenuItemClick={handleMenuItemClick}
          />
        </SheetContent>
      </Sheet>
    </div>

    {/* Main Column */}
    <div className="flex flex-col flex-1 h-full w-full">
      {showHeader && (
        <MainHeader
          mainColumnExpanded={mainColumnExpanded}
          onToggleMainColumn={toggleMainColumn}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />
      )}

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto container p-3 md:p-6">
          {children}
        </div>
      </div>
    </div>
  </div>

  );
}