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
    <div className={cn("flex h-screen bg-background flex-col md:flex-row", className)}>
      {/* Desktop Sidebar - Hidden on mobile */}
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

      {/* Mobile Sidebar Sheet - Visible on mobile */}
      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            {/* This is handled by the header's mobile menu button */}
          </SheetTrigger>
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

      {/* Main Content Area - Header + Content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Main Header - Width fluid to sidebar */}
        {showHeader && (
          <MainHeader
            mainColumnExpanded={mainColumnExpanded}
            onToggleMainColumn={toggleMainColumn}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            isMobileMenuOpen={mobileMenuOpen}
          />
        )}

        {/* Content Area - Responsive padding and max-width */}
        <div className="flex-1 w-full overflow-y-auto">
          <div className="mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}