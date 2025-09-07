'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FluentPanelLeftExpand28Filled, GameIconsUpgrade } from '@/components/icons';
import { AccountSelector } from './account-selector';
import { SidebarMenuContent } from './sidebar-menu-content';
import { SidebarQuickActions } from './sidebar-quick-actions';
import { SidebarCollapsedContent } from './sidebar-collapsed-content';
import { MenuItem, QuickAction } from './types';
import { GlobalViewSwitcher } from '../ui/global-view-switcher';

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
      "flex h-full flex-col backdrop-blur-xl transition-all duration-200 ease-out relative bg-sidebar",
      isExpanded ? "w-76" : "w-20"
    )}>
   
      
      {/* Header */}
      <div className="relative flex h-20 items-center px-4 backdrop-blur-sm">
        {isExpanded ? (
          <div className="flex items-center justify-between w-full">
            
           {/*    <AccountSelector collapsed={false} /> */}
              <GlobalViewSwitcher />
      
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 transition-all duration-200 hover:scale-102 active:scale-98 rounded-xl"
              onClick={onToggleExpanded}
              title="Collapse sidebar"
            >
              <FluentPanelLeftExpand28Filled className="h-7 w-7 rotate-180" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 mx-auto transition-all duration-200 hover:scale-102 active:scale-98 rounded-xl" 
            onClick={onToggleExpanded}
            title="Expand sidebar"
          >
            <FluentPanelLeftExpand28Filled className="h-7 w-7" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 py-6 relative">
        {isExpanded ? (
          <div className="px-4 space-y-6">

            {/* Top Section - Search */}
            <div className="space-y-4">
              {/* Search / Command Bar */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quick Search</span>
                </div>
                <div className="relative group">
                  <button
                    onClick={onOpenCommandPalette}
                    className="w-full flex items-center gap-3 pl-10 pr-4 py-2.5 rounded-md bg-background shadow-sm border border-border/40 hover:border-primary/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-200 text-left cursor-pointer"
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-muted-foreground/60 text-[11px]">Search anything...</span>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 ml-auto">
                      <span className="text-xs text-muted-foreground/60 font-mono bg-muted/50 px-1.5 py-0.5 rounded">⌘K</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

          
            {/* Main Navigation */}
            {selectedMenuData?.submenu ? (
              <SidebarMenuContent submenu={selectedMenuData?.submenu} onMobileClose={onMobileClose} />
            ) : (
              <SidebarQuickActions actions={actions} onActionClick={onActionClick} />
            )}
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
      <div className="p-4 space-y-2 w-full ">
 
        {isExpanded ? (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/8 to-primary/4 border border-primary/20 p-4 group hover:shadow-md hover:shadow-primary/10 transition-all duration-200">
             <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
                  <GameIconsUpgrade className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-foreground">Upgrade to Premium</h3>
                  <p className="text-[11px] text-muted-foreground/80">Advanced features</p>
                </div>
              </div>
            <div className="flex items-end justify-between">
             <div className=" text-xs text-muted-foreground/80">
              
              <span>Cancel anytime</span>
            </div>
              <Button 
                size="sm" 
                variant="outline"
                className="border-primary/30 text-primary text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                onClick={() => router.push('/dashboard/subscription')}
              >
                Upgrade
              </Button>
            </div>
            
            
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 relative group transition-all duration-200 hover:scale-110 rounded-lg bg-gradient-to-r from-primary/15 to-primary/8 hover:from-primary/20 hover:to-primary/12 border border-primary/25 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
              title="Upgrade to Premium"
              onClick={() => router.push('/dashboard/subscription')}
            >
              <GameIconsUpgrade className="h-5 w-5 text-primary group-hover:animate-pulse" />
              
              {/* Enhanced tooltip with premium features */}
              <div className="absolute left-full bottom-0 w-full ml-3 px-3 py-2 bg-popover/98 text-popover-foreground text-sm rounded-xl shadow-xl border border-border/60 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 backdrop-blur-md min-w-60">
                <div className="space-y-2">
                  <div className="font-semibold text-xs text-primary flex items-center gap-2">
                    <GameIconsUpgrade className="h-4 w-4" />
                    Upgrade to Premium
                  </div>
                  <div className="space-y-1 text-[11px] text-muted-foreground text-start">
                    <div>• Advanced Analytics</div>
                    <div>• API Access</div>
                    <div>• Priority Support</div>
                  </div>
                  <div className="text-[11px] text-green-600 font-medium border-t border-border/30 pt-2">
                    ✓ 14-day trial
                  </div>
                </div>
              </div>
            </Button>
            
            <div className="text-[10px] text-primary/80 font-medium">
              Premium
            </div>
          </div>
        )}
      </div>
    </div>
  );
}