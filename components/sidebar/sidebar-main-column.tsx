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
import { LogoMappr } from '@/components/icons';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { authClient } from '@/lib/auth-client';
import { MenuItem } from './types';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { MapprLogoM, MapprLogoMT } from '../icons/icons';


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
  const { profile } = useUserProfile();

  const handleSignOut = React.useCallback(async () => {
    try {
      await authClient.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [router]);

  return (
    <div className="flex h-full w-16 flex-col bg-[#1a1a1a] border-r border-white/5">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-white/5">
        <Link
          href="/dashboard"
          className="group relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors"
        >
          <MapprLogoMT className=" w-8 h-8 text-white"  />

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            MoneyMappr
          </div>
        </Link>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-3 overflow-visible">
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Only mark as active if this is the most specific matching route
            const isActive = activeMenuItem === item.id;
            const isSelected = selectedMenuItem === item.id;

            const handleClick = (e: React.MouseEvent) => {
              if (item.href === '#') {
                e.preventDefault();
              }
              onMenuItemClick(item.id);
            };

            const content = (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative h-11 w-11 group rounded-xl transition-all",
                  isActive || isSelected
                    ? "bg-white/15  hover:bg-white/20 text-white hover:text-white"
                    : "text-white/60 hover:text-white hover:bg-white/15"
                )}
                title={item.label}
              >
                <Icon className="h-6.5 w-6.5 antialiased" stroke={'1.9'} />

                {/* Active indicator */}
                {(isActive || isSelected) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                )}

                {/* Badge */}
                {item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-[#1a1a1a]">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Button>
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
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all group relative"
          onClick={() => router.push('/dashboard/settings')}
        >
          <Settings className="h-5 w-5" />

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Settings
          </div>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-lg hover:bg-white/5 transition-all group relative p-0"
            >
              <Avatar className="h-8 w-8 ring-1 ring-white/10">
                <AvatarImage src={profile?.profilePicture} />
                <AvatarFallback className="text-xs font-semibold bg-white/10 text-white">
                  {profile?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {profile?.firstName || 'Profile'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-56 bg-[#2a2a2a] border-white/10 text-white">
            <div className="px-3 py-2 border-b border-white/10">
              <p className="text-sm font-medium text-white">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-xs text-white/60 truncate">{profile?.email}</p>
            </div>
            <DropdownMenuItem asChild className="text-white/80 focus:text-white focus:bg-white/10">
              <Link href="/dashboard/profile" className="flex items-center gap-3 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-white/80 focus:text-white focus:bg-white/10">
              <Link href="/dashboard/subscription" className="flex items-center gap-3 cursor-pointer">
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
      </div>
    </div>
  );
}