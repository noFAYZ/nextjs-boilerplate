'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Settings, Menu, X, Crown, LogOut, User, Plus, HelpCircle, Newspaper, BookOpen, Puzzle, Code,  Play, ExternalLink, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogoMappr } from '../icons';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useCallback, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette';
import { BasilAppsSolid, StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold, SolarGalleryWideOutline, StreamlineUltimateTradingPatternUp, HugeiconsPieChart09 } from '../icons/icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { Separator } from '@/components/ui/separator';
import { ViewSwitcher } from '../crypto/view-switcher';
import { GlobalViewSwitcher } from '../ui/global-view-switcher';


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
  
  const { profile, isLoading: profileLoading } = useUserProfile();
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
          {/* Left Section - Logo & Search */}
            <div className='flex items-center gap-6'>
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group"
              aria-label="MoneyMappr Dashboard"
            >
              <div className="w-8 h-8 transition-transform group-hover:scale-105">
                <LogoMappr />
              </div>
              <span className="hidden sm:block text-lg font-semibold text-foreground">
                MoneyMappr
              </span>
            </Link>
          </div>


        
           
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'ghost'} icon={<BasilAppsSolid className='w-6 h-6'/>} size={'icon'} className='rounded-sm'></Button>
              </PopoverTrigger>
              <PopoverContent className='min-w-3xl p-6' align='start' sideOffset={8}>
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column - Products */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">Products</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted transition-colors">
                            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Integrations</div>
                            <div className="text-xs text-muted-foreground mt-1">Over 300 platforms supported. Choose your preferred crypto platform and connect.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted transition-colors">
                            <StreamlineUltimateTradingPatternUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Earn</div>
                            <div className="text-xs text-muted-foreground mt-1">Don't just hodl. Earn 20% on your crypto.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-muted   flex items-center justify-center flex-shrink-0  transition-colors">
                            <SolarGalleryWideOutline className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">NFT</div>
                            <div className="text-xs text-muted-foreground mt-1">Track your entire NFT collection right where you track your other crypto assets.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                            <HugeiconsPieChart09 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">DeFi Portfolio Tracker</div>
                            <div className="text-xs text-muted-foreground mt-1">Track more than 90 DeFi wallets across 10 different networks.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Main Links & Other */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">Products</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                            <StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Integrations</div>
                            <div className="text-xs text-muted-foreground mt-1">Over 300 platforms supported. Choose your preferred crypto platform and connect.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                            <StreamlineUltimateTradingPatternUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Earn</div>
                            <div className="text-xs text-muted-foreground mt-1">Don't just hodl. Earn 20% on your crypto.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                            <SolarGalleryWideOutline className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">NFT</div>
                            <div className="text-xs text-muted-foreground mt-1">Track your entire NFT collection right where you track your other crypto assets.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                            <HugeiconsPieChart09 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">DeFi Portfolio Tracker</div>
                            <div className="text-xs text-muted-foreground mt-1">Track more than 90 DeFi wallets across 10 different networks.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               
                </div>
              </PopoverContent>
            </Popover>
          
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
            {/* Currency Selector */}
            <div className="hidden md:block">
              <CurrencySelector variant="compact" showRefresh />
            </div>

           <div  className='hidden sm:flex' ><ThemeSwitcher  /></div> 
            <GlobalViewSwitcher size='sm' className='hidden sm:flex' />

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
                <Button variant="ghost" className="h-9 w-9 rounded-full">
                  {profileLoading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={profile?.profilePicture} 
                        alt={`${profile?.firstName || 'User'}'s avatar`}
                      />
                      <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                        {profile?.firstName?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <div className="p-3 border-b">
                  <div className="text-sm font-medium">{profile?.firstName || 'User'}</div>
                  <div className="text-xs text-muted-foreground truncate">{profile?.email}</div>
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