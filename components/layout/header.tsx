'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Settings, Menu, Crown, LogOut, User} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogoMappr } from '../icons';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCallback, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import { CommandPalette } from '@/components/ui/command-palette';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { GlobalViewSwitcher } from '../ui/global-view-switcher';
import { ProductPopover } from './ProductPopover';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { OrganizationSwitcher } from '@/components/organization';
import { ActionSearchBar } from '../ui/action-search-bar';
import { useCommandPalette } from '../command/command-palette';
import { LetsIconsAddDuotone } from '../icons/icons';

interface HeaderProps {
  className?: string;
  sticky?: boolean;
  blur?: boolean;
  border?: boolean;
}


export function Header({ 
  className, 
  sticky = true, 
  blur = true, 
  border = true 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { openCommandPalette } = useCommandPalette();
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // PRODUCTION-GRADE: Use AuthStore directly instead of fetching profile
  // No API calls - just read from memory
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const profileLoading = !isInitialized;

  const pathname = usePathname();
  const router = useRouter();


  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
    };

    if (sticky) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [sticky]);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const handleSignOut = useCallback(async () => {
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

  const avatar = createAvatar(avataaarsNeutral, {
    size: 128,
    seed: user.name,
    radius: 20,
  }).toDataUri();

  return (
    <>
      <header 
        ref={headerRef}
        className={cn(
          'w-full z-50',
          sticky && 'sticky top-0',
          '  ',
          isScrolled && sticky && ' border-b border-border/80  bg-sidebar',
          className
        )}
        role="banner"
        aria-label="Main navigation"
      >
        {/* Simplified Header */}
        <div className="flex items-center justify-between h-14 md:h-16 px-4 lg:px-6">
          {/* Left Section - Logo, Organization Switcher, & Search */}
            <div className='flex items-center gap-8'>
          <div className="flex items-center">
          <Link
                href="/"
                className="flex items-center gap-2 group relative   "

              >
               <span  className="flex  group text-[42px] font-bold text-orange-500">
             {/*    <Image src="/logo/mappr.svg" alt="Mappr logo" width={56} height={56} className="w-9 h-9 object-contain" priority /> */}
             𒀭
              </span>
                <div className="flex flex-col">
                  <span className="text-base sm:text-base font-bold ">
                    MoneyMappr
                  </span>
                  <span className="text-[10px] sm:text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
                    Financial Intelligence
                  </span>
                </div>
              </Link>

    



          </div>

        


{/* Product Popover (hover to open) */}
<ProductPopover />

          
          </div>

          {/* Center Section - Command Palette Search */}
       

             {/* Center Section - Action Search Bar (Always Centered) */}
             <div className="absolute left-1/2  -translate-x-1/2 top-1/2 transform -translate-y-1/2 w-full md:max-w-md px-3 sm:px-4 md:px-6">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette} />
          </div>

          {/* Right Section - Actions */}

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
             {/* Currency Selector 
            <div className="hidden md:block">
              <CurrencySelector variant="compact" showRefresh />
            </div>*/}
          <div className="hidden sm:block"> <GlobalViewSwitcher size="sm" className="items-start justify-start mx-0" /> </div>
            <ThemeSwitcher />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline2"
                  className="rounded-full h-9 w-9 flex items-center justify-center hover:bg-muted"
                >
                  {profileLoading || !user.id ? (
                    <Skeleton className="h-7 w-7 rounded-full" />
                  ) : (
                    <Avatar className="h-7 w-7 rounded-full flex-shrink-0">
                      <AvatarImage src={user?.image ?? avatar} className="rounded-full" />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" /> Subscription
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add button */}
            <Button variant="steel" size="icon-sm">
              <LetsIconsAddDuotone className="h-6 w-6" />
            </Button>
          </div>


        </div>

        {/* Mobile Menu - Now showing help and profile options */}
        {isMobileMenuOpen && (
  <div className="lg:hidden border-t bg-card">
    <nav className="px-4 py-4 space-y-6">
      
      {/* Theme + Currency */}
 
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
    
         {/*   <GlobalViewSwitcher size="sm" />
            <CurrencySelector variant="compact" /> */}
            
        </div>
 

  

    </nav>
  </div>
)}

      </header>

  
    </>
  );
}