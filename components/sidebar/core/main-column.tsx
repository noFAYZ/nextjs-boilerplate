'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User, Crown, ChevronsUpDownIcon, LucideMenu, Menu, SquareMenu, MenuIcon } from 'lucide-react';
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
import { LetsIconsSettingLineDuotone, LogoMappr } from '@/components/icons';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authClient } from '@/lib/auth-client';
import { MenuItem } from '../types';
import Image from 'next/image';
import { OrganizationSwitcher } from '@/components/organization';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';


interface SidebarMainColumnProps {
  menuItems: MenuItem[];
  activeMenuItem: string | null;
  selectedMenuItem: string | null;
  onMenuItemClick: (itemId: string) => void;
}

export function SidebarMainColumn({
  menuItems,
  activeMenuItem,
  selectedMenuItem,
  onMenuItemClick
}: SidebarMainColumnProps) {
  const router = useRouter();
  const pathname = usePathname();

  // PRODUCTION-GRADE: Use AuthStore instead of fetching profile
  const user = useAuthStore((state) => state.user);

  const handleSignOut = React.useCallback(async () => {
    try {
      await authClient.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [router]);

  const avatar = createAvatar(avataaarsNeutral, {
    size: 128,
    seed: user.name,
    radius: 20,
  }).toDataUri();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full w-70 flex-col bg-card border-r border-border/50">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center px-4">
      {/*   <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-14 h-14 hover:opacity-90 transition-opacity"
            >
                <Image
                  src="/logo/mappr.svg"
                  alt="MoneyMappr logo"
                  width={56}
                  height={56}
                  className="object-contain w-10 h-10  "
                  priority
                /> 
       
            
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
          >
            MoneyMappr
          </TooltipContent>
        </Tooltip> */}    <OrganizationSwitcher />
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-3 overflow-visible">


        <nav className="flex flex-col space-y-1 px-4">
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
                    variant="ghost"
                    size="lg"
                    className={cn(
                      " w-full justify-start gap-3 h-auto py-2 px-2 ",
                      isHighlighted
                        ? "bg-muted hover:bg-muted/80 text-foreground/90  "
                        : "text-muted-foreground border-transparent hover:bg-muted/50"
                    )}
                    icon={<Icon className="h-5 w-5 antialiased" stroke={'1.9'} />}
                    
                  >
                    

                    <span className={cn(
                    'font-medium text-sm truncate',
                    isHighlighted ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {item.label}
                  </span>
            

                    {/* Active indicator */}
                    {isHighlighted && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-muted-foreground rounded-r-full" />
                    )}

                    {/* Badge */}
                    {item.badge && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-[#1a1a1a]">
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
      <div className="px-2 pb-3 space-y-2">

      <div className="px-2">
            <div className="space-y-2 rounded-lg bg-muted   p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border/80 shadow-sm">
                  <Crown className="h-5 w-5 " />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">Upgrade to Pro</h3>
                  <p className="text-[11px] text-muted-foreground">Unlock advanced features</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 ">
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

        <div className="flex items-center justify-between w-full gap-3 p-2">
          
            <ThemeSwitcher />
            <GlobalViewSwitcher size='sm' className='items-start justify-start mx-0' />
              {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className=" rounded-full shadow-transparent"
              onClick={() => router.push('/settings')}
            >
              <LetsIconsSettingLineDuotone className="h-4.5 w-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-[#2a2a2a] text-xs font-medium rounded-lg shadow-xl border border-white/10"
          >
            Settings
          </TooltipContent>
        </Tooltip>
          </div>
<div className='px-2'>
        {/* Profile Dropdown */}
        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild  >
                <Button
                   variant='outline2'
          size='xl'
                  className="flex items-center  justify-between gap-3 w-full px-3  "
               
                >

<div className="flex items-center text-start gap-2 flex-1 min-w-0">

                  <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={ avatar}
                        alt={`${user?.name || 'User'}'s avatar`}
                      />
                      <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
            <div className="flex-1 min-w-0">
            
                <p className="text-xs font-medium ">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            
           
            </div>
          </div>
          <MenuIcon
            size={16}
            className="flex-shrink-0 text-muted-foreground  "
          />

                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={12}
              className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
            >
              {user?.name || 'Profile'}
            </TooltipContent>
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
        </Tooltip></div>
      </div>
      </div>
    </TooltipProvider>
  );
}