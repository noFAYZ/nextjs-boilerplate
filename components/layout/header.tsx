'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Settings, Sparkles, Menu, X, TrendingUp, Wallet, History, Crown, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { AccountSelector } from '@/components/sidebar/account-selector';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { LogoMappr } from '../icons';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { GlobalViewSwitcher } from '../ui/global-view-switcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { authClient } from '@/lib/auth-client';
import { MENU_ITEMS } from '@/components/sidebar/menu-constants';
import { Skeleton } from '@/components/ui/skeleton';


interface HeaderProps {
  className?: string;
  sticky?: boolean;
  blur?: boolean;
  border?: boolean;
}

interface SearchResult {
  type: 'token' | 'address' | 'recent' | 'transaction';
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  verified?: boolean;
  price?: string;
  change?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const searchSuggestions: SearchResult[] = [
  { 
    type: 'token', 
    label: 'Bitcoin', 
    value: 'BTC', 
    icon: TrendingUp,
    description: 'BTC',
    verified: true,
    price: '$65,420',
    change: '+2.4%'
  },
  { 
    type: 'token', 
    label: 'Ethereum', 
    value: 'ETH', 
    icon: TrendingUp,
    description: 'ETH',
    verified: true,
    price: '$3,240',
    change: '+1.2%'
  },
  { 
    type: 'token', 
    label: 'Solana', 
    value: 'SOL', 
    icon: TrendingUp,
    description: 'SOL',
    verified: true,
    price: '$142',
    change: '-0.8%'
  },
  { 
    type: 'address', 
    label: '0x742d3...2A4b1C', 
    value: '0x742d35Cc6634C0532925a3b8D982C9A42A4b1C', 
    icon: Wallet,
    description: 'Ethereum Address'
  },
  { 
    type: 'address', 
    label: 'bc1qxy2...k5fq9p', 
    value: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 
    icon: Wallet,
    description: 'Bitcoin Address'
  },
  { 
    type: 'recent', 
    label: 'Recent transaction', 
    value: 'recent-tx-1', 
    icon: History,
    description: 'Swap ETH for USDC'
  },
  { 
    type: 'recent', 
    label: 'Portfolio analysis', 
    value: 'portfolio', 
    icon: History,
    description: 'Last viewed 2 hours ago'
  },
];

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Transaction Confirmed',
    description: 'Your ETH swap has been confirmed',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Price Alert',
    description: 'BTC reached your target price of $65,000',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'Security Update',
    description: 'New login detected from Chrome on Windows',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    type: 'warning'
  },
];

export function Header({ 
  className, 
  sticky = true, 
  blur = true, 
  border = true 
}: HeaderProps) {
  const { isProMode } = useViewMode();
  const [searchValue, setSearchValue] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  const headerRef = useRef<HTMLElement>(null);
  
  const { profile, isLoading: profileLoading } = useUserProfile();
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

  // Search debouncing
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    if (searchValue) {
      setIsSearchLoading(true);
      searchDebounceRef.current = setTimeout(() => {
        setIsSearchLoading(false);
      }, 300);
    } else {
      setIsSearchLoading(false);
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchValue]);

  // Find active menu item and submenu based on current path
  const activeMenuItem = useMemo(() => {
    return MENU_ITEMS.find(item => 
      pathname === item.href || 
      item.submenu?.some(sub => pathname === sub.href)
    );
  }, [pathname]);

  const activeSubmenu = useMemo(() => {
    return activeMenuItem?.submenu || [];
  }, [activeMenuItem]);

  // Filter search results
  const filteredSearchResults = useMemo(() => {
    if (!searchValue) return searchSuggestions;
    return searchSuggestions.filter(item => 
      item.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.value.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  // Unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    return mockNotifications.filter(n => !n.read).length;
  }, []);

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

  const handleSearchSelect = useCallback((result: SearchResult) => {
    setSearchValue(result.label);
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
    
    // Navigate based on result type
    switch (result.type) {
      case 'token':
        router.push(`/dashboard/tokens/${result.value.toLowerCase()}`);
        break;
      case 'address':
        router.push(`/dashboard/address/${result.value}`);
        break;
      case 'recent':
        // Handle recent searches
        break;
      default:
        break;
    }
  }, [router]);

  const handleNotificationClick = useCallback((notification: NotificationItem) => {
    // Mark as read and handle navigation
    console.log('Notification clicked:', notification);
  }, []);

  // Format timestamp for notifications
  const formatTimestamp = useCallback((timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsDesktopSearchOpen(true);
      }
      // Escape to close modals
      if (event.key === 'Escape') {
        setIsDesktopSearchOpen(false);
        setIsMobileSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header 
      ref={headerRef}
      className={cn(
        'w-full  z-50',
        sticky && 'sticky top-0',
        border && 'border-b',
        blur && 'backdrop-blur-xl supports-[backdrop-filter]:bg-background/80',
        !blur && 'bg-background',
        isScrolled && sticky && 'shadow-sm bg-background/95',
        className
      )}
      role="banner"
      aria-label="Main navigation"
    >
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 min-h-[4rem] w-full">
        {/* Left Section - Logo + Primary Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 flex-1">
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 font-bold text-lg group "
            aria-label="MoneyMappr Dashboard"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:rotate-12">
              <LogoMappr />
            </div>
            <span className="hidden sm:block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              MoneyMappr
            </span>
          </Link>

          {/* Primary Navigation - Sidebar Menu Items */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Primary navigation">
            {MENU_ITEMS.map((item) => {
              const isActive = activeMenuItem?.id === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-lg hover:bg-accent/50",
                    isActive 
                      ? "text-primary bg-accent/70 shadow-sm border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 ml-1">
                      {item.badge}
                    </Badge>
                  )}
               
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                className={cn(
                  "absolute inset-0 ",
                  isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )} 
              />
              <X 
                className={cn(
                  "absolute inset-0 ",
                  isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )} 
              />
            </div>
          </Button>
        </div>

        {/* Center Section - Enhanced Search Combobox */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <Popover open={isDesktopSearchOpen} onOpenChange={setIsDesktopSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isDesktopSearchOpen}
                className="w-full justify-between text-muted-foreground hover:text-foreground hover:border-primary/50 h-10 bg-background/50"
                aria-label="Search tokens, addresses, and more"
              >
                <div className="flex items-center flex-1 text-left">
                  <Search className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {searchValue || "Search tokens, addresses..."}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[480px] p-0" align="center" sideOffset={8}>
              <Command>
                <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    placeholder="Search tokens, addresses, transactions..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {isSearchLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  )}
                </div>
                <CommandList className="max-h-[300px] overflow-y-auto">
                  {filteredSearchResults.length === 0 ? (
                    <CommandEmpty>
                      <div className="flex flex-col items-center justify-center py-6">
                        <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No results found</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Try searching for tokens, addresses, or transactions
                        </p>
                      </div>
                    </CommandEmpty>
                  ) : (
                    <>
                      {/* Tokens */}
                      {filteredSearchResults.filter(item => item.type === 'token').length > 0 && (
                        <CommandGroup heading="Tokens">
                          {filteredSearchResults
                            .filter(item => item.type === 'token')
                            .map((item) => {
                              const IconComponent = item.icon;
                              return (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={() => handleSearchSelect(item)}
                                  className="flex items-center justify-between py-3 cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <IconComponent className="mr-3 h-4 w-4 text-primary" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.label}</span>
                                        {item.verified && (
                                          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground">{item.description}</span>
                                    </div>
                                  </div>
                                  <div className="text-right text-xs">
                                    <div className="font-medium">{item.price}</div>
                                    <div className={cn(
                                      "text-xs",
                                      item.change?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    )}>
                                      {item.change}
                                    </div>
                                  </div>
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      )}

                      {/* Addresses */}
                      {filteredSearchResults.filter(item => item.type === 'address').length > 0 && (
                        <>
                          <CommandSeparator />
                          <CommandGroup heading="Addresses">
                            {filteredSearchResults
                              .filter(item => item.type === 'address')
                              .map((item) => {
                                const IconComponent = item.icon;
                                return (
                                  <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => handleSearchSelect(item)}
                                    className="py-3 cursor-pointer"
                                  >
                                    <IconComponent className="mr-3 h-4 w-4 text-primary" />
                                    <div>
                                      <div className="font-mono text-sm">{item.label}</div>
                                      <div className="text-xs text-muted-foreground">{item.description}</div>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </>
                      )}

                      {/* Recent */}
                      {filteredSearchResults.filter(item => item.type === 'recent').length > 0 && (
                        <>
                          <CommandSeparator />
                          <CommandGroup heading="Recent">
                            {filteredSearchResults
                              .filter(item => item.type === 'recent')
                              .map((item) => {
                                const IconComponent = item.icon;
                                return (
                                  <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => handleSearchSelect(item)}
                                    className="py-3 cursor-pointer"
                                  >
                                    <IconComponent className="mr-3 h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <div className="font-medium">{item.label}</div>
                                      <div className="text-xs text-muted-foreground">{item.description}</div>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </>
                      )}
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Section - Enhanced Action Buttons */}
        <div className="flex items-center gap-4 sm:gap-2">
          {/* Mobile Search Button */}
          <Popover open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden hover:bg-accent transition-colors" 
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] max-w-sm p-0" align="end" sideOffset={8}>
              <Command>
                <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    placeholder="Search tokens, addresses..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <CommandList className="max-h-[250px] overflow-y-auto">
                  {filteredSearchResults.length === 0 ? (
                    <CommandEmpty>No results found.</CommandEmpty>
                  ) : (
                    filteredSearchResults.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={() => handleSearchSelect(item)}
                          className="py-3 cursor-pointer"
                        >
                          <IconComponent className="mr-3 h-4 w-4" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

        

          {/* View Mode Switcher */}
          <GlobalViewSwitcher />

          {/* Theme Switcher */}
          <ThemeSwitcher />

            {/* Notifications */}
          <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} >
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative hover:bg-accent transition-colors"
                aria-label={`Notifications (${unreadNotificationsCount} unread)`}
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-90 p-0 text-xs" align="end" sideOffset={8}>
     
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "border-b px-4 py-2 text-xs cursor-pointer hover:bg-accent/50 transition-colors",
                        !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground ">
                            {notification.description}
                          </p>
                       
                        </div>
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          notification.type === 'success' && 'bg-green-500',
                          notification.type === 'error' && 'bg-red-500',
                          notification.type === 'warning' && 'bg-yellow-500',
                          notification.type === 'info' && 'bg-blue-500'
                        )} />
                      </div>
                      <p className="text-[10px] text-end text-muted-foreground/70 ">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                    </div>
                  ))
                )}
              </div>
              {mockNotifications.length > 0 && (
                <div className="border-t p-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Mark all as read
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-accent  focus-visible:ring-0 "
                aria-label="User menu"
              >
                {profileLoading ? (
                  <Skeleton className="h-10 w-10 rounded-full" />
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={profile?.profilePicture} 
                      alt={`${profile?.firstName || 'User'}'s avatar`}
                    />
                    <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {profile?.firstName?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
            
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{profile?.firstName || 'User'}</div>
                <div className="text-xs text-muted-foreground truncate">{profile?.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription" className="flex items-center gap-2 cursor-pointer">
                  <Crown className="h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
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
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            ref={menuRef}
            id="mobile-menu"
            className="lg:hidden fixed top-16 left-0 right-0 bg-background border-b shadow-xl z-50 animate-in slide-in-from-top-2 duration-300"
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 sm:px-6 py-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Mobile Primary Navigation */}
              <nav className="space-y-1" role="navigation" aria-label="Mobile primary navigation">
                {MENU_ITEMS.map((item) => {
                  const isActive = activeMenuItem?.id === item.id;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 text-base font-medium  rounded-lg",
                        isActive 
                          ? "text-primary bg-accent/70 shadow-sm" 
                          : "text-foreground hover:text-primary hover:bg-accent/50"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Submenu for Active Item */}
              {activeSubmenu.length > 0 && (
                <div className="space-y-3 pt-2 border-t">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                    {activeMenuItem?.label}
                  </h3>
                  <nav className="space-y-1 pl-3" role="navigation" aria-label="Mobile submenu">
                    {activeSubmenu.map((subItem) => {
                      const isActiveSubItem = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm font-medium  rounded-lg",
                            isActiveSubItem
                              ? "text-primary bg-accent/50"
                              : "text-muted-foreground hover:text-primary hover:bg-accent/30"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                          aria-current={isActiveSubItem ? 'page' : undefined}
                        >
                          {subItem.label}
                          {subItem.badge && (
                            <Badge variant="secondary" className="text-xs ml-auto">
                              {subItem.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Mobile Quick Actions */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-center relative overflow-hidden group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25 "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                      Launch
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Button>
                  
                  <Button 
                    className="justify-center relative group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Connect
                    </span>
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Button>
                </div>

                {/* Mobile Account Selector */}
                <div className="pt-2">
                  <AccountSelector collapsed={false} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Secondary Navigation Row - Active Menu Submenu */}
      {activeSubmenu.length > 0 && (
        <div className="border-t bg-gradient-to-r from-background to-muted/20 px-4 sm:px-6 py-3 w-full">
          <nav 
            className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-1" 
            role="navigation" 
            aria-label="Secondary navigation"
          >
            {activeSubmenu.map((subItem) => {
              const isActiveSubItem = pathname === subItem.href;
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={cn(
                    "relative flex items-center gap-2 text-xs font-medium whitespace-nowrap px-3 py-2 rounded-lg hover:bg-accent/50",
                    isActiveSubItem
                      ? "text-primary bg-muted shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActiveSubItem ? 'page' : undefined}
                >
                  {subItem.label}
                  {subItem.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {subItem.badge}
                    </Badge>
                  )}
               
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}