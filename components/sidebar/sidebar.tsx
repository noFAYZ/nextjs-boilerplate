'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MobileFloatingMenu } from './mobile-floating-menu';
import { SidebarMainColumn } from './sidebar-main-column';
import { SidebarSecondaryColumn } from './sidebar-secondary-column';
import { MENU_ITEMS, QUICK_ACTIONS } from './menu-constants';
import { useCommandPalette } from '../command/command-palette';

export interface SidebarProps {
  className?: string;
  defaultExpanded?: boolean;
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openCommandPalette, CommandPalette } = useCommandPalette();
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<string | null>(null);

  // Determine which menu item is active based on pathname
  React.useEffect(() => {
    console.log('Current pathname:', pathname);

    // Exact match for dashboard
    if (pathname === '/dashboard') {
      console.log('Setting selectedMenuItem to: dashboard');
      setSelectedMenuItem('dashboard');
      return;
    }

    // Find the best matching menu item (longest match wins)
    const matchingItems = MENU_ITEMS.filter(item => {
      if (item.href === '/dashboard') return false;
      // Check if pathname starts with item.href and has a / or is exact match
      return pathname === item.href || pathname.startsWith(item.href + '/');
    });

    // Sort by href length to get the most specific match
    matchingItems.sort((a, b) => b.href.length - a.href.length);

    if (matchingItems.length > 0) {
      console.log('Setting selectedMenuItem to:', matchingItems[0].id);
      setSelectedMenuItem(matchingItems[0].id);
    } else {
      // Default to dashboard if no match
      console.log('No match found, defaulting to: dashboard');
      setSelectedMenuItem('dashboard');
    }
  }, [pathname]);

  const selectedMenuData = selectedMenuItem
    ? MENU_ITEMS.find(item => item.id === selectedMenuItem)
    : null;

  const handleActionClick = (actionId: string) => {
    if (actionId === 'search') {
      openCommandPalette();
    }
    // Handle other actions
  };

  return (
    <>
      {/* Command Palette */}
      <CommandPalette />

      {/* Mobile Floating Menu */}
      <div className="md:hidden">
        <MobileFloatingMenu />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-full", className)}>
        <SidebarMainColumn
          menuItems={MENU_ITEMS}
          activeMenuItem={selectedMenuItem}
          selectedMenuItem={selectedMenuItem}
          onMenuItemClick={setSelectedMenuItem}
        />
        <SidebarSecondaryColumn
          isExpanded={true}
          selectedMenuItem={selectedMenuItem}
          selectedMenuData={selectedMenuData}
          actions={QUICK_ACTIONS}
          onToggleExpanded={() => {}}
          onMobileClose={() => {}}
          onOpenCommandPalette={openCommandPalette}
          onActionClick={handleActionClick}
        />
      </div>
    </>
  );
}
