'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User, Crown } from 'lucide-react';
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
import { LogoMappr } from '@/components/icons';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authClient } from '@/lib/auth-client';
import { MenuItem } from '../types';
import Image from 'next/image';

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

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full w-16 flex-col bg-black border-r border-white/10">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center">
        <Tooltip>
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
         {/*    <LogoMappr className='w-10 h-10' /> */}
            
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
          >
            MoneyMappr
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-3 overflow-visible">
        <nav className="flex flex-col gap-1 px-2">
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
                    size="icon"
                    className={cn(
                      "relative h-11 w-11 overflow-visible rounded-lg transition-all",
                      isHighlighted
                        ? "bg-white/15 hover:bg-white/20 text-white border border-white/15 hover:text-white"
                        : "text-white/60 hover:text-white hover:bg-white/15"
                    )}
                  >
                    <Icon className="h-6.5 w-6.5 antialiased" stroke={'1.9'} />

                    {/* Active indicator */}
                    {isHighlighted && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
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
      <div className="px-2 pb-3 space-y-0.5">

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => router.push('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
          >
            Settings
          </TooltipContent>
        </Tooltip>

        {/* Profile Dropdown */}
        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-lg hover:bg-white/5 transition-all p-0"
                >
                  <Avatar className="h-8 w-8 ring-1 ring-white/10">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="text-xs font-semibold bg-white/10 text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
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
        </Tooltip>
      </div>
      </div>
    </TooltipProvider>
  );
}