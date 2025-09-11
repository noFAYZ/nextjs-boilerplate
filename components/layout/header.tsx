'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Settings, Menu, X, TrendingUp, Wallet, History, Crown, LogOut, User, Bell, ChevronDown, Plus, HelpCircle } from 'lucide-react';
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
        'w-full z-50',
        sticky && 'sticky top-0',
    
        'bg-sidebar',
        isScrolled && sticky && 'shadow-sm',
        className
      )}
      role="banner"
      aria-label="Main navigation"
    >
      {/* Enterprise SaaS Header */}
      <div className="flex items-center h-16 px-4 lg:px-6">
        {/* Left Section - Logo + Navigation */}
        <div className="flex items-center gap-8 flex-1">
          {/* Logo */}
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

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation">
            {MENU_ITEMS.slice(0, 4).map((item) => {
              const isActive = activeMenuItem?.id === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "text-foreground bg-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-12 h-9 bg-muted/30 border-0 focus:bg-background focus:ring-1 focus:ring-border"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden sm:inline-flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <ThemeSwitcher />

          {/* Create Button */}
          <Button size="sm" className="hidden sm:flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="p-3 border-b">
                <h4 className="text-sm font-semibold">Notifications</h4>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "border-b px-3 py-3 cursor-pointer hover:bg-accent/50 transition-colors last:border-b-0",
                        !notification.read && "bg-blue-50/30 dark:bg-blue-950/10"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
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
                <Link href="/dashboard/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
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

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/40 backdrop-blur-sm" onClick={() => setIsMobileSearchOpen(false)} />
          <div className="fixed top-16 left-4 right-4 bg-card border rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 border-0 p-2 h-auto bg-background focus:ring-0"
                autoFocus
              />
              <Button variant="ghost" size="sm" onClick={() => setIsMobileSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="px-4 py-4 space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = activeMenuItem?.id === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "text-foreground bg-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}