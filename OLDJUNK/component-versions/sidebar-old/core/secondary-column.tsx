'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FluentPanelLeftExpand28Filled, GameIconsUpgrade } from '@/components/icons';
import { SidebarDynamicContent } from '../content/dynamic-content';
import { SidebarCollapsedContent } from '../content/collapsed-content';
import { MenuItem, QuickAction } from '../types';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { OrganizationSwitcher } from '@/components/organization';
import { Card } from '@/components/ui/card';
import UpgradeBanner from '../widgets/upgrade-banner';

interface SidebarSecondaryColumnProps {
  isExpanded: boolean;
  selectedMenuItem: string | null;
  selectedMenuData: MenuItem | null;
  actions: QuickAction[];
  onToggleExpanded: () => void;
  onMobileClose: () => void;
  onOpenCommandPalette: () => void;
  onActionClick: (actionId: string) => void;
}

export function SidebarSecondaryColumn({
  isExpanded,
  selectedMenuItem,
  selectedMenuData,
  actions,
  onToggleExpanded,
  onMobileClose,
  onOpenCommandPalette,
  onActionClick
}: SidebarSecondaryColumnProps) {
  const router = useRouter();

  return (
    <div className={cn(
      "flex h-full flex-col transition-[width] bg-background dark:bg-sidebar border-r border-border/80 shadow-sm space-y-2",
      isExpanded ? "w-76" : "w-16"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center px-4">
        {!isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 mx-auto rounded-lg hover:bg-accent transition-colors"
            onClick={onToggleExpanded}
            title="Expand sidebar"
          >
            <FluentPanelLeftExpand28Filled className="h-4 w-4" />
          </Button>
        )}
                    <div className="w-full ">

              {/*   <button
                onClick={onOpenCommandPalette}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-muted dark:bg-muted/70 border border-border hover:border-foreground/10 hover:bg-muted/60 focus:outline-none focus:ring-0  transition-colors text-left"
              >
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-xs flex-1">Search...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button> */}
            <OrganizationSwitcher />
</div>
      </div>

      {/* Content Area */}
      <div className="flex-1 py-4 ">
        {isExpanded ? (
          <div className="px-4 space-y-6 h-full flex flex-col ">
            {/* Main Navigation - Dynamic Content */}
            <SidebarDynamicContent
              selectedMenuItem={selectedMenuItem}
              selectedMenuData={selectedMenuData}
              actions={actions}
              onMobileClose={onMobileClose}
              onActionClick={onActionClick}
            />
          </div>
          
        ) : (
          <SidebarCollapsedContent
            submenu={selectedMenuData?.submenu}
            actions={actions}
            onMobileClose={onMobileClose}
            onActionClick={onActionClick}
          />
        )}
      </div>

      {/* Premium Upgr>ade Banner
       <ThemeSwitcher /> <GlobalViewSwitcher size='sm' className='items-start justify-start mx-0' />
      */}
      <div className="flex items-center justify-between w-full mt-auto px-3 pb-3 space-y-4">
            
           <UpgradeBanner isExpanded={isExpanded} />
          </div>
    </div>
  );
}