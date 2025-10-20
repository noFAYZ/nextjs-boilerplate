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
      "flex h-full flex-col transition-[width]  bg-background dark:bg-sidebar-accent border-r border-border shadow-xl ",
      isExpanded ? "w-80" : "w-16"
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

              <button
                onClick={onOpenCommandPalette}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-muted dark:bg-muted/70 border border-border hover:border-foreground/10 hover:bg-muted/60 focus:outline-none focus:ring-0  transition-colors text-left"
              >
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-xs flex-1">Search...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
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

      {/* Premium Upgrade Banner */}
      
      <div className="p-4 space-y-2 ">
        {isExpanded ? (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3.5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Crown className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">Upgrade to Pro</h3>
                  <p className="text-[11px] text-muted-foreground">Unlock advanced features</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-medium">14-day free trial</span>
                <Button
                  size="sm"
                  className="h-7 text-[11px] px-3 font-medium"
                  onClick={() => router.push('/subscription')}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 mx-auto rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 group relative"
            onClick={() => router.push('/subscription')}
          >
            <Crown className="h-4.5 w-4.5 text-primary" />

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-3 py-2.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-[180px]">
              <div className="space-y-2">
                <div className="font-semibold text-xs flex items-center gap-2 pb-2 border-b border-border">
                  <Crown className="h-3.5 w-3.5" />
                  Upgrade to Pro
                </div>
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  <li>• Advanced Analytics</li>
                  <li>• API Access</li>
                  <li>• Priority Support</li>
                </ul>
                <div className="text-[10px] font-medium border-t border-border pt-2">
                  14-day free trial available
                </div>
              </div>
            </div>
          </Button>
        )}
          

      </div>
      <div className="flex items-center justify-between w-full gap-3 p-4">
            <GlobalViewSwitcher size='sm' className='items-start justify-start mx-0' />
            <ThemeSwitcher />
          </div>
    </div>
  );
}