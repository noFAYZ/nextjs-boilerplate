'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { ThemeSwitcher } from '../ui/theme-switcher';
import { CompactViewSwitcher } from '../ui/global-view-switcher';
import { MenuItem } from './types';


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
    <div className="flex h-full w-22 flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center">
        <Link href="/dashboard" className="flex items-center transition-transform hover:scale-105 group relative">
          <LogoMappr className="h-12 w-12" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            MoneyMappr Dashboard
          </div>
        </Link> 
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-4 overflow-visible z-50">
        <nav className="flex flex-col gap-4 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenuItem === item.id;
            const isSelected = selectedMenuItem === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isSelected ? "outline" : "ghost"}
                size="icon"
                className={cn(
                  "relative h-12 w-12 group",
                  isSelected && " relative  shadow-sm",
                  "hover:scale-105 active:scale-98"
                )}
                onClick={() => onMenuItemClick(item.id)}
                title={item.label}
              >
                <Icon className="h-7 w-7" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground animate-pulse">
                    {item.badge}
                  </span>
                )}
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3">
        <div className="flex flex-col gap-2 items-center content-center">
         {/*  <CompactViewSwitcher /> */}
          <ThemeSwitcher  />
         
          
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 transition-all duration-100  group relative z-50"
            title="Settings"
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="h-6 w-6 group-hover:rotate-30 duration-200" />
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 ">
              Settings
            </div>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-14 w-14 transition-all duration-100 rounded-full active:outline-0  focus-visible:ring-0 hover:bg-transparent group relative"
                title="Profile"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={profile?.profilePicture} />
                  <AvatarFallback className="text-sm">
                    {profile?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {profile?.firstName || 'Profile'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription" className="flex items-center gap-2 cursor-pointer">
                  <Crown className="h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 text-destructive cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}