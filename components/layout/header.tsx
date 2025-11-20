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
import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { GlobalViewSwitcher } from '../ui/global-view-switcher';
import { ProductPopover } from './ProductPopover';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { OrganizationSwitcher } from '@/components/organization';

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
  
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // PRODUCTION-GRADE: Use AuthStore directly instead of fetching profile
  // No API calls - just read from memory
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const profileLoading = !isInitialized;

  const pathname = usePathname();
  const router = useRouter();
  const commandPalette = useCommandPalette();

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
    <>
      <header 
        ref={headerRef}
        className={cn(
          'w-full z-50',
          sticky && 'sticky top-0',
          'bg-background dark:bg-card shadow-sm ',
          isScrolled && sticky && 'shadow-sm',
          className
        )}
        role="banner"
        aria-label="Main navigation"
      >
        {/* Simplified Header */}
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left Section - Logo, Organization Switcher, & Search */}
            <div className='flex items-center gap-4'>
          <div className="flex items-center">
          <Link
                href="/"
                className="flex items-center gap-2 group relative   "

              >
                  <Image
                  src="/logo/mappr.svg"
                  alt="MoneyMappr logo"
                  width={52}
                  height={52}
                  className="object-contain w-12 h-12  transition-transform group-hover:scale-102"
                  priority
                />
             {/*  <LogoMappr className='w-10 h-10 antialiased'/> */}
                <div className="flex flex-col">
                  <span className="text-base sm:text-base font-bold tracking-tight">
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
          <div className="flex-1 max-w-xl mx-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-muted-foreground  h-10 px-4 bg-muted border hover:bg-muted/80"
              onClick={() => commandPalette.setOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline-block">Search or type a command...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Currency Selector 
            <div className="hidden md:block">
              <CurrencySelector variant="compact" showRefresh />
            </div>*/}

           <div  className='hidden sm:flex' ><ThemeSwitcher  /></div> 
           <GlobalViewSwitcher size="sm" />
      
            {/* Create Button
            <Button size="sm" className="hidden sm:flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New
            </Button>

           
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <HelpCircle className="h-4 w-4" />
            </Button> */}

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary"  className="rounded-full p-1 p pr-2 border ">
                  {profileLoading && !user ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className='flex gap-1 items-center rounded-full'>
               
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={ avatar}
                        alt={`${user?.name || 'User'}'s avatar`}
                      />
                      <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    {String(user?.name)?.split(' ')[0] || 'User'}
                    
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <div className="p-3 border-b">
                  <div className="text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                  {/*  <GlobalViewSwitcher size='sm' className='hidden sm:flex' /> */}
                </div>

               

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
               
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
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
    
           <GlobalViewSwitcher size="sm" />
            <CurrencySelector variant="compact" />
            
        </div>
 

  

    </nav>
  </div>
)}

      </header>

      {/* Command Palette */}
      <CommandPalette
        open={commandPalette.open}
        onOpenChange={commandPalette.setOpen}
      />
    </>
  );
}