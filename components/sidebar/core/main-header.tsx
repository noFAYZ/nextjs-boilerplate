'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { TablerLayoutSidebarLeftExpandFilled } from '@/components/icons/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { OrganizationSwitcher } from '@/components/organization';
import { ActionSearchBar } from '@/components/ui/action-search-bar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import { useCommandPalette } from '@/components/command/command-palette';

interface MainHeaderProps {
  mainColumnExpanded: boolean;
  onToggleMainColumn: () => void;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function MainHeader({
  mainColumnExpanded,
  onToggleMainColumn,
  onMobileMenuToggle,
  isMobileMenuOpen = false
}: MainHeaderProps) {
  const { openCommandPalette } = useCommandPalette();

  return (
    <TooltipProvider delayDuration={200}>
      <header className="h-14 md:h-16 border-b border-border/50 bg-card sticky top-0 z-40">
        <div className="mx-auto h-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Section - Mobile Menu & Desktop Collapse/Expand */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Menu Button - Visible only on mobile */}
            <div className="md:hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onMobileMenuToggle}
                    className="flex-shrink-0"
                  >
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                >
                  Toggle menu
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Desktop Expand/Collapse Icon - Hidden on mobile */}
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onToggleMainColumn}
                    className="flex-shrink-0"
                  >
                    {mainColumnExpanded ? (
                      <TablerLayoutSidebarLeftExpandFilled className="h-6 w-6 transition-all duration-100 text-muted-foreground rotate-180" />
                    ) : (
                      <TablerLayoutSidebarLeftExpandFilled className="h-6 w-6 transition-all duration-100 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                >
                  {mainColumnExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                </TooltipContent>
              </Tooltip>
            </div>

          </div>

          {/* Center Section - Action Search Bar (Responsive Width) */}
          <div className="flex-1 flex items-center justify-center px-2 min-w-0">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette} />
          </div>

          {/* Right Section - Theme & Global Switcher (Responsive) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Hide global switcher on small mobile */}
            <div className="hidden sm:block">
              <GlobalViewSwitcher size="sm" className="items-start justify-start mx-0" />
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
