'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User, Crown, ChevronsUpDownIcon, LucideMenu, Menu, SquareMenu, MenuIcon, ChevronLeft, ChevronRight, Search, RefreshCcw, RefreshCwIcon, SidebarClose, SidebarOpen } from 'lucide-react';
import { useQueryClient, useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useToast } from "@/lib/hooks/useToast";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import { LetsIconsSettingLineDuotone } from '@/components/icons';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authClient } from '@/lib/auth-client';
import { MenuItem } from '../types';
import Image from 'next/image';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { UserOrgSwitcher } from '@/components/organization/user-org-switcher';
import {  GameIconsFairyWings,  } from '@/components/icons/icons';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import { useCommandPalette } from '@/components/command/command-palette';

interface SidebarMainColumnProps {
  menuItems: MenuItem[];
  activeMenuItem: string | null;
  selectedMenuItem: string | null;
  onMenuItemClick: (itemId: string) => void;
  onToggleMainColumn?: () => void;
  mainColumnExpanded?: boolean;
}

export function SidebarMainColumn({
  menuItems,
  activeMenuItem,
  selectedMenuItem,
  onMenuItemClick,
  onToggleMainColumn,
  mainColumnExpanded = true
}: SidebarMainColumnProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  // PRODUCTION-GRADE: Use AuthStore instead of fetching profile
  const user = useAuthStore((state) => state.user);

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSignOut = React.useCallback(async () => {
    try {
      // Navigate to logout loading screen
      router.push('/auth/logout-loading');

      // Perform logout
      await authClient.signOut();

      // Navigate directly to login (no success screen)
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      // On error, redirect to login
      router.push('/auth/login');
    }
  }, [router]);

  const handleRefresh = React.useCallback(async () => {
    try {
      // Detect current page and refetch appropriate data
      if (pathname.includes('/subscriptions')) {
        await queryClient.refetchQueries({ queryKey: ['subscriptions'] });
      } else {
        // Generic refetch for other pages
        await queryClient.refetchQueries();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [pathname, queryClient, toast]);

  const avatar = createAvatar(avataaarsNeutral, {
    size: 128,
    seed: user.name,
    radius: 20,
  }).toDataUri();

  const { openCommandPalette } = useCommandPalette();

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex h-full flex-col bg-sidebar border-r border-border/40 inset-shadow-2xs ring-  inset-shadow-white/20 text-shadow-2xs text-shadow-white/25 transition-all duration-100", mainColumnExpanded ? "w-70" : "w-16")}>

   
{/* Sidebar Header - Logo + Toggle */}
<div
  className={cn(
    "relative flex h-14 md:h-16 items-center justify-between px-3 md:px-4",
    !mainColumnExpanded && "group" // activates hover behavior
  )}
>
  {!mainColumnExpanded ? (
    <>
      {/* Logo — visible normally, but disabled when hovered */}
      <Link
        href="/"
        className="flex items-center gap-2  text-[40px] font-bold text-[hsl(29.65,100%,50%)]
                   transition-opacity duration-150 
                   group-hover:opacity-0 
                   group-hover:pointer-events-none"    // <— prevents link click on hover
      >
       
        <GameIconsFairyWings className="w-9 h-9" />
      </Link>

      {/* Toggle — only visible and clickable on hover  𒀭*/}
      <Button
        onClick={onToggleMainColumn}
        variant='ghost'
        size='icon'
        className="absolute left-3 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-150 
                   pointer-events-none group-hover:pointer-events-auto cursor-pointer rounded-full " // <— clickable only on hover
      >
        <SidebarOpen className="h-5 w-5  " />
      </Button>
    </>
  ) : (
    <>
      {/* Expanded State — logo + label */}
      <Link href="/" className="flex items-center gap-1">
        <span className="text-[42px] font-bold text-[hsl(29.65,100%,50%)] group "><GameIconsFairyWings className="w-9 h-9" /></span>
 
        {/* */}<div className="flex flex-col">
          <span className="text-base font-bold"> Mappr</span>
          <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
            Intelligence
          </span>
        </div> 
      </Link>

      {/* Toggle always visible in expanded mode */}
      <div className='flex items-center gap-3'>


        <Button
        variant="outlinemuted"
        size="icon-sm"
        onClick={() => setSettingsOpen(true)}
        className="ml-auto rounded-full hover:rotate-30 transition duration-100"
      >
        <Settings
          className="h-5 w-5  "
        />
      </Button>
        <Button
        variant="outlinemuted"
        size="icon-sm"
        onClick={handleRefresh}
        disabled={isLoading}
        className={cn(
          "ml-auto rounded-full transition-colors hover:rotate-30 transition duration-100",
          isLoading && "bg-amber-100 text-amber-900 hover:bg-amber-300 "
        )}
      >
        <RefreshCwIcon
          className={cn(
            "h-4.5 w-4.5",
            isLoading && "animate-spin"
          )}
        />
      </Button>
{/* */}   <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleMainColumn}
        className="ml-auto rounded-full"
      >
        <SidebarClose
          className="h-5 w-5 "
        />
      </Button> 
      </div>
   
    </>
  )}
</div>


    {/* <OrganizationSwitcher />
    
    */}
      {/* Main Menu */}
      <div className="flex-1 py-2 md:py-3 overflow-visible">

          {/*   */} 

        <nav className={cn("flex flex-col", mainColumnExpanded ? "space-y-0.5 px-3 " : "space-y-0.5 px-3 ")}>

      {/*    <ActionSearchBar onOpenCommandPalette={openCommandPalette} />*/}


          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if this item should be highlighted
            // Priority: selectedMenuItem (user click) > activeMenuItem (route-based)
            const isHighlighted = selectedMenuItem === item.id || (!selectedMenuItem && activeMenuItem === item.id);

            const handleClick = (e: React.MouseEvent) => {
              if (item.href === '#') {
                e.preventDefault();
              }
              onMenuItemClick(item.id);
            };

            const content = (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size="lg"
                    className={cn(
                      "w-full h-auto   overflow-visible",
                      mainColumnExpanded ? "justify-start gap-2 md:gap-3 p-1.5  " : "justify-center p-1.5   border-r border-border/50  ",
                      isHighlighted
                        ? "dark:bg-muted/60 bg-accent  hover:bg-muted/80 text-foreground/90"
                        : "text-muted-foreground border-transparent hover:bg-muted/50"
                    )}
                    icon={<Icon className={cn(" antialiased flex-shrink-0", mainColumnExpanded ? "h-4 md:h-5 w-4 md:w-5" : "h-5  w-5  ")}  />}
                  >


                    {mainColumnExpanded && (
                      <span className={cn(
                        "font-semibold text-[13px] truncate",
                        isHighlighted ? "text-foreground " : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    )}
            

                    {/* Active indicator */}
                    {isHighlighted && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-muted-foreground rounded-r-full" />
                    )}

                    {/* Badge */}
                    {  item.badge && (
                      <span className="absolute top-0.5 -right-6 flex h-4 w-fit px-1 items-center justify-center rounded-full bg-red-500 z-40 text-[9px] font-bold text-white border border-[#1a1a1a]">
                        {item.badge}
                      </span>
                    )}


                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={12}
                  className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );

            return item.href === '#' ? (
              <div key={item.id} onClick={handleClick}>
                {content}
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleClick}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className={cn("pb-2 md:pb-3 space-y-6", mainColumnExpanded ? "px-2 md:px-2" : "px-1 md:px-1")}>

       {/*  {mainColumnExpanded && (
          <div className="px-2">
            <div className="space-y-2 rounded-lg bg-gradient-to-br from-muted/90 via-muted/30 to-muted border border-border/80 p-2 shadow-sm">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 md:h-9 w-8 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-accent border border-border/80 shadow-sm flex-shrink-0">
                  <Crown className="h-4 md:h-5 w-4 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs md:text-sm text-foreground">Upgrade to Pro</h3>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground">Unlock advanced features</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground font-medium">14-day free trial</span>
                <Button
                  size="xs"
                  className=" h-6  md:text-[11px]  font-semibold"
                  onClick={() => router.push("/subscription")}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        )} */}


        {/* Profile Dropdown */}
        <div className={cn("px-2  space-y-4", !mainColumnExpanded && "flex justify-center")}>
 

          {mainColumnExpanded ? <UserOrgSwitcher /> : <UserOrgSwitcher compact /> }


        {/*   <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  {mainColumnExpanded ? (
                    <Button
                      variant="outline2"
                      size="xl"
                      className="flex items-center justify-between gap-2 md:gap-3 w-full px-2 md:px-3"
                    >
                      <div className="flex items-center text-start gap-2 flex-1 min-w-0">
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarImage
                            src={avatar}
                            alt={`${user?.name || "User"}'s avatar`}
                          />
                          <AvatarFallback className="text-xs md:text-sm bg-muted text-muted-foreground">
                            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-xs font-medium truncate">{user?.name}</p>
                          <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                      <MenuIcon
                        size={14}
                        className="flex-shrink-0 text-muted-foreground hidden sm:block"
                      />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon-lg"
                      className=" rounded-full flex-shrink-0"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={avatar}
                          alt={`${user?.name || "User"}'s avatar`}
                        />
                        <AvatarFallback className="text-xs md:text-sm bg-muted text-muted-foreground">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  )}
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {mainColumnExpanded && (
                <TooltipContent
                  side="right"
                  sideOffset={12}
                  className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                >
                  {user?.name || 'Profile'}
                </TooltipContent>
              )}
              <DropdownMenuContent align="end" side="right" className="w-56 bg-[#2a2a2a] border-white/10 text-white">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/60 truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild className="text-white/80 focus:text-white focus:bg-white/10">
                  <Link href="/profile" className="flex items-center gap-3 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white/80 focus:text-white focus:bg-white/10">
                  <Link href="/subscription" className="flex items-center gap-3 cursor-pointer">
                    <Crown className="h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="flex items-center gap-3 text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Tooltip> */}
        </div>
      </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </TooltipProvider>
  );
}