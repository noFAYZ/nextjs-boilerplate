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
import { DuoIconsBank, HeroiconsWallet16Solid, LetsIconsAddDuotone, MageDashboard, SolarHomeSmileBoldDuotone, TablerLayoutSidebarLeftExpandFilled, WalletLogoIconOpen } from '../icons/icons';
import { UserOrgSwitcher } from '../organization/user-org-switcher';
import { useGlobalUIStore } from '@/lib/stores/global-ui-store';

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
  const openAddMenu = useGlobalUIStore((s) => s.openAddMenu);
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

  function NavIconButton({
    icon,
    label,
    delay = 0,
  }: {
    icon: React.ReactNode
    label: string
    delay?: number
  }) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={label}
        className="
          opacity-0
          translate-x-2
          group-hover:opacity-100 group-hover:translate-x-0
          group-focus-within:opacity-100 group-focus-within:translate-x-0
          transition duration-100 ease-out
        "
        style={{ transitionDelay: `${delay}ms` }}
        icon={icon}
      />
    )
  }
  

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
          <div className="relative">
  <nav
    className="
      group
      flex items-center
      h-11
      w-11
      rounded-full
      bg-card
      border border-border
      shadow-sm
      transition-[width,border-radius] duration-200 ease-out
      hover:w-56 hover:rounded-xl
      focus-within:w-56 focus-within:rounded-xl
      overflow-hidden
    "
    aria-label="Quick navigation"
  >
    {/* Anchor / Home */}
    <Link
      href="/"
      className="
        flex items-center justify-center
        w-11 h-11
        shrink-0
        text-orange-500
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary
      "
      aria-label="Home"
    >
      <WalletLogoIconOpen className="w-7 h-7" />
    </Link>

    {/* Actions */}
    <ul className="flex items-center gap-1 px-1">
      <li>
        <NavIconButton
          label="Dashboard"
          icon={<SolarHomeSmileBoldDuotone className="w-5 h-5" />}
          delay={80}
        />
      </li>
      <li>
        <NavIconButton
          label="Wallets"
          icon={<HeroiconsWallet16Solid className="w-5 h-5" />}
          delay={120}
        />
      </li>
      <li>
        <NavIconButton
          label="Banks"
          icon={<DuoIconsBank className="w-5 h-5" />}
          delay={160}
        />
      </li>
    </ul>
  </nav>
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
      onClick={openAddMenu}
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