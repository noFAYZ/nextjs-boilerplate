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
import { DuoIconsBank, HeroiconsWallet16Solid, LetsIconsAddDuotone, MageDashboard, SolarHomeSmileBoldDuotone, TablerLayoutSidebarLeftExpandFilled } from '../icons/icons';
import { UserOrgSwitcher } from '../organization/user-org-switcher';

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
          isScrolled && sticky && ' ',
          className
        )}
        role="banner"
        aria-label="Main navigation"
      >
        {/* Simplified Header */}
        <div className="flex items-center justify-between h-14 md:h-16 px-4 lg:px-6">
          {/* Left Section - Logo, Organization Switcher, & Search */}
 
          <div className="relative group">
  <div
    className="
      flex items-center justify-start gap-2
      w-11 h-11 
      bg-card dark:bg-accent rounded-full shadow-lg border
      transition-all duration-200 overflow-hidden
      group-hover:rounded-xl group-hover:w-60 
    "
  >
    {/* Logo – stays visible always */}
    <Link
      href="/"
      className="flex items-center justify-center min-w-11 h-11 
                 text-[34px] font-bold text-orange-500"
    >
      𒀭
    </Link>

    {/* Button 1 */}

    {/* Button 2 */}
    <Button
      className="
        opacity-0 translate-x-4 
        group-hover:opacity-100 group-hover:translate-x-0 
        transition-all duration-300 delay-150
      "
      variant="ghost"
      size="icon-sm"
      icon={<SolarHomeSmileBoldDuotone className='w-6 h-6' />}
    >
     
    </Button>
      {/* Button 2 */}
      <Button
      className="
        opacity-0 translate-x-4 
        group-hover:opacity-100 group-hover:translate-x-0 
        transition-all duration-300 delay-150
      "
      variant="ghost"
      size="icon-sm"
      icon={<HeroiconsWallet16Solid className='w-6 h-6' />}
    >
      
    </Button>
    <Button
      className="
        opacity-0 translate-x-4 
        group-hover:opacity-100 group-hover:translate-x-0 
        transition-all duration-300 delay-150
      "
      variant="ghost"
      size="icon-sm"
      icon={<DuoIconsBank className='w-6 h-6' />}
    >
      
    </Button>
  </div>
</div>


          {/* Center Section - Command Palette Search */}
       

             {/* Center Section - Action Search Bar (Always Centered) 
             <div className="absolute left-1/2  -translate-x-1/2 top-1/2 transform -translate-y-1/2 w-full md:max-w-md px-3 sm:px-4 md:px-6">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette} />
          </div>*/}

          {/* Right Section - Actions */}

          <div className="relative group ml-auto">
  <div
    className="
      flex items-center gap-2
      h-11 px-2
      bg-card dark:bg-accent border shadow-lg rounded-full
      transition-all duration-200 overflow-hidden
    
    "
  >
    {/* Theme Switcher — always visible */}
    <div className="flex items-center">
      <ThemeSwitcher />
    </div>

    {/* UserOrgSwitcher — animates in */}

      <UserOrgSwitcher compact />
 
    {/* Add Button — animates in with stagger */}
    <Button
      variant="steel"
      size="icon-sm"
      className="
        rounded-full
      "
    >
      <LetsIconsAddDuotone className="h-6 w-6" />
    </Button>
  </div>
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