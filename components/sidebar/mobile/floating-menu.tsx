'use client';

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Menu,
  X,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  CreditCard,
  Target,
  PieChart,
  Bell,
  Search,
  Plus,
  Settings,
  User,
  LogOut,
  Crown,
  ChevronRight,
  Building,
  Store
} from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { useCommandPalette } from '@/components/command/command-palette';
import {
  GuidanceBank,
  HugeiconsAnalytics02,
  HugeiconsAnalyticsUp,
  HugeiconsHome04,
  HugeiconsPieChart09,
  HugeiconsTransactionHistory,
  MageGoals,
  SolarCard2Outline,
  SolarWallet2Outline,
  StreamlinePlumpFileReport,
  StreamlineUltimateTradingPatternUp,
  TablerEyeDollar
} from '@/components/icons/icons';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  submenu?: SubMenuItem[];
  badge?: string | number;
}

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string | number;
  description?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HugeiconsHome04,
    href: '/dashboard',
    submenu: [
      { id: 'overview', label: 'Overview', href: '/dashboard', description: 'Main dashboard view', icon:TablerEyeDollar},
      { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', description: 'Detailed analytics', icon:HugeiconsAnalyticsUp },
      { id: 'reports', label: 'Reports', href: '/dashboard/reports', description: 'Financial reports', icon:StreamlinePlumpFileReport }
    ]
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: SolarWallet2Outline,
    href: '/dashboard/accounts',
    submenu: [
      { id: 'crypto-wallets', label: 'Crypto Wallets', href: '/dashboard/accounts/wallet', icon: SolarWallet2Outline, description: 'Manage cryptocurrency wallets' },
      { id: 'bank-accounts', label: 'Bank Accounts', href: '/dashboard/accounts/bank', icon: GuidanceBank, description: 'Traditional banking accounts' },
      { id: 'exchanges', label: 'Exchanges', href: '/dashboard/accounts/exchange', icon: Building, description: 'Cryptocurrency exchanges' },
      { id: 'services', label: 'Business Services', href: '/dashboard/accounts/service', icon: Store, description: 'Shopify, QuickBooks, etc.' },
      { id: 'add-wallet', label: 'Add New Wallet', href: '/dashboard/accounts/wallet/add', icon: Plus, description: 'Connect a new crypto wallet' }
    ]
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: HugeiconsPieChart09,
    href: '/dashboard/portfolio',
    submenu: [
      { id: 'overview', label: 'Overview', href: '/dashboard/portfolio' },
      { id: 'holdings', label: 'Holdings', href: '/dashboard/portfolio/holdings' },
      { id: 'performance', label: 'Performance', href: '/dashboard/portfolio/performance' },
      { id: 'allocation', label: 'Asset Allocation', href: '/dashboard/portfolio/allocation' }
    ]
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: HugeiconsTransactionHistory,
    href: '/dashboard/transactions',
    submenu: [
      { id: 'all', label: 'All Transactions', href: '/dashboard/transactions' },
      { id: 'income', label: 'Income', href: '/dashboard/transactions/income' },
      { id: 'expenses', label: 'Expenses', href: '/dashboard/transactions/expenses' },
      { id: 'transfers', label: 'Transfers', href: '/dashboard/transactions/transfers' }
    ]
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: MageGoals,
    href: '/dashboard/goals',
    submenu: [
      { id: 'savings', label: 'Savings Goals', href: '/dashboard/goals/savings' },
      { id: 'investment', label: 'Investment Goals', href: '/dashboard/goals/investment' },
      { id: 'create', label: 'Create Goal', href: '/dashboard/goals/create', icon: Plus }
    ]
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: HugeiconsAnalytics02,
    href: '/dashboard/insights',
    submenu: [
      { id: 'market', label: 'Market Analysis', href: '/dashboard/insights/market' },
      { id: 'trends', label: 'Spending Trends', href: '/dashboard/insights/trends' },
      { id: 'recommendations', label: 'AI Recommendations', href: '/dashboard/insights/recommendations' }
    ]
  }
];

export interface MobileFloatingMenuProps {
  className?: string;
}

export function MobileFloatingMenu({ className }: MobileFloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useUserProfile();
  const { openCommandPalette, CommandPalette } = useCommandPalette();

  const handleSignOut = useCallback(async () => {
    try {
      await authClient.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [router]);

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedMenuItem(null);
    }
  }, [isOpen]);

  const handleMenuItemClick = useCallback((itemId: string) => {
    if (selectedMenuItem === itemId) {
      setSelectedMenuItem(null);
    } else {
      setSelectedMenuItem(itemId);
    }
  }, [selectedMenuItem]);

  const handleNavigation = useCallback((href: string) => {
    router.push(href);
    setIsOpen(false);
    setSelectedMenuItem(null);
  }, [router]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-floating-menu')) {
        setIsOpen(false);
        setSelectedMenuItem(null);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Find active menu item
  const activeMenuItem = MENU_ITEMS.find(item => 
    pathname === item.href || 
    item.submenu?.some(subItem => pathname === subItem.href)
  )?.id;

  const selectedMenuData = selectedMenuItem 
    ? MENU_ITEMS.find(item => item.id === selectedMenuItem)
    : null;

  return (
    <>
      <CommandPalette />
      
      <div className={cn("mobile-floating-menu", className)}>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleMenu}
            className={cn(
              "h-14 w-14 rounded-full shadow-2xl  border-0",
              isOpen 
                ? "bg-destructive/90 hover:bg-destructive scale-110 rotate-45" 
                : "bg-primary hover:bg-primary/90 scale-100 rotate-0 hover:scale-110"
            )}
            size="icon"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-primary-foreground" />
            )}
          </Button>
        </div>

        {/* Drawer Menu */}
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[70vh] overflow-hidden">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 slide-in-from-right-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 transition-transform hover:scale-105"
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <LogoMappr className="h-8 w-8" />
                  <span className="font-bold text-lg text-foreground">MoneyMappr</span>
                </Link>
                
                {/* Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg"
                  onClick={openCommandPalette}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {!selectedMenuItem ? (
                  // Main Menu
                  <div className="p-2">
                    {MENU_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeMenuItem === item.id;
                      
                      return (
                        <div key={item.id}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-between h-auto p-4 rounded-xl mb-2 ",
                              isActive && "bg-primary/10 text-primary border border-primary/20"
                            )}
                            onClick={() => {
                              if (item.submenu) {
                                handleMenuItemClick(item.id);
                              } else {
                                handleNavigation(item.href);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                isActive 
                                  ? "bg-primary/20 text-primary" 
                                  : "bg-muted/50 text-muted-foreground"
                              )}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{item.label}</div>
                                {item.submenu && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.submenu.length} items
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              {item.submenu && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Submenu
                  <div className="p-2">
                    {/* Back Button */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-4 rounded-xl mb-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedMenuItem(null)}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                      Back to Menu
                    </Button>

                    {/* Submenu Items */}
                    {selectedMenuData?.submenu?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isActive = pathname === subItem.href;
                      
                      return (
                        <Button
                          key={subItem.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-auto p-4 rounded-xl mb-2 ",
                            isActive && "bg-primary/10 text-primary border border-primary/20"
                          )}
                          onClick={() => handleNavigation(subItem.href)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={cn(
                              "p-2 rounded-lg",
                              isActive 
                                ? "bg-primary/20 text-primary" 
                                : "bg-muted/50 text-muted-foreground"
                            )}>
                              {SubIcon ? (
                                <SubIcon className="h-4 w-4" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-current" />
                              )}
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-xs text-muted-foreground">
                                  {subItem.description}
                                </div>
                              )}
                            </div>
                            {subItem.badge && (
                              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  {/* Profile */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.profilePicture} />
                          <AvatarFallback className="text-xs">
                            {profile?.firstName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="text-sm font-medium">{profile?.firstName || 'User'}</div>
                          <div className="text-xs text-muted-foreground">View Profile</div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="top" className="w-56">
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
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          Settings
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

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg relative"
                      title="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg"
                      onClick={() => handleNavigation('/dashboard/accounts/wallet/add')}
                      title="Add Account"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}