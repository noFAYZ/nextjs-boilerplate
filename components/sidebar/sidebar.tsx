'use client';

import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  CreditCard,
  Target,
  PieChart,
  Bell,
  Search,
  Plus,
  ArrowRightLeft,
  ChevronRight,
  Menu,
  LogOut,
  User,
  Settings,
  Crown,
  FileText,
  Calculator,
  Download,
  Upload,
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FluentPanelLeftExpand28Filled, LogoMappr } from '@/components/icons';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { CompactViewSwitcher } from '../ui/global-view-switcher';
import {  GuidanceBank, HugeiconsAnalytics02, HugeiconsAnalyticsUp,  HugeiconsHome04, HugeiconsPieChart09, HugeiconsTransactionHistory, MageGoals, SolarCard2Outline, SolarWallet2Outline, StreamlinePlumpFileReport, StreamlineUltimateTradingPatternUp, TablerEyeDollar } from '../icons/icons';

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

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  shortcut?: string;
  badge?: string | number;
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

const QUICK_ACTIONS: QuickAction[] = [
  { 
    id: 'search', 
    label: 'Search', 
    icon: Search, 
    action: () => console.log('Search'),
    shortcut: '⌘K'
  },
  { 
    id: 'add-transaction', 
    label: 'Add Transaction', 
    icon: Plus, 
    action: () => console.log('Add Transaction'),
    shortcut: '⌘T'
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: Bell, 
    action: () => console.log('Notifications'),
    badge: 3
  },
  { 
    id: 'calculator', 
    label: 'Calculator', 
    icon: Calculator, 
    action: () => console.log('Calculator') 
  },
  { 
    id: 'export', 
    label: 'Export Data', 
    icon: Download, 
    action: () => console.log('Export') 
  },
  { 
    id: 'import', 
    label: 'Import Data', 
    icon: Upload, 
    action: () => console.log('Import') 
  }
];

export interface SidebarProps {
  className?: string;
  defaultExpanded?: boolean;
}

export function Sidebar({ className, defaultExpanded = true }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserProfile();
  const pathname = usePathname();
  
  // Use the custom sidebar hook for better state management
  const {
    isExpanded: isSecondaryExpanded,
    selectedMenuItem,
    activeMenuItem,
    toggleExpanded,
    selectMenuItem
  } = useSidebar({ defaultExpanded });

  const handleSignOut = useCallback(async () => {
    try {
      await authClient.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [router]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle sidebar with Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggleExpanded();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleExpanded]);

  const handleMenuItemClick = useCallback((itemId: string) => {
    if (selectedMenuItem === itemId && isSecondaryExpanded) {
      selectMenuItem(null);
    } else {
      selectMenuItem(itemId);
    }
  }, [selectedMenuItem, isSecondaryExpanded, selectMenuItem]);

  const selectedMenuData = selectedMenuItem 
    ? MENU_ITEMS.find(item => item.id === selectedMenuItem)
    : null;

  const renderMainColumn = () => (
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
          {MENU_ITEMS.map((item) => {
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
                onClick={() => handleMenuItemClick(item.id)}
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
          <CompactViewSwitcher />
          <ThemeSwitcher  />
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 transition-all duration-200 hover:scale-105 active:scale-95 group relative z-50"
            title="Settings"
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="h-7 w-7" />
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
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

  const renderSecondaryColumn = () => (
    <div className={cn(
      "flex h-full flex-col bg-gradient-to-br from-muted/20 via-background/50 to-muted/30 backdrop-blur-xl border-l border-border/60 transition-all duration-300 ease-out relative overflow-hidden",
      isSecondaryExpanded ? "w-80" : "w-20"
    )}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_70%)]" />
      
      {/* Header */}
      <div className="relative flex h-20 items-center px-4 border-b border-border/30 bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm">
        {isSecondaryExpanded ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {selectedMenuData && (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 shadow-sm">
                  <selectedMenuData.icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  {selectedMenuData?.label || 'Quick Actions'}
                </h2>
                <p className="text-xs text-muted-foreground/80 font-medium">
                  {selectedMenuData?.submenu ? `${selectedMenuData.submenu.length} items` : `${QUICK_ACTIONS.length} actions available`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 transition-all duration-200 hover:scale-105 hover:bg-muted/60 active:scale-95 rounded-xl"
              onClick={toggleExpanded}
              title="Collapse sidebar"
            >
              <FluentPanelLeftExpand28Filled className="h-5 w-5 rotate-180" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 mx-auto transition-all duration-200 hover:scale-105 hover:bg-muted/60 active:scale-95 rounded-xl" 
            onClick={toggleExpanded}
            title="Expand sidebar"
          >
            <FluentPanelLeftExpand28Filled className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 py-6 relative">
        {isSecondaryExpanded ? (
          <div className="px-4">
            {selectedMenuData?.submenu ? (
              // Show submenu items with enhanced styling
              <div className="space-y-3">
                {selectedMenuData.submenu.map((subItem, index) => {
                  const SubIcon = subItem.icon;
                  const isActive = pathname === subItem.href;
                  
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={cn(
                        "group flex items-center gap-4 rounded-2xl px-4 py-4 text-sm transition-all duration-300 relative overflow-hidden",
                        "hover:bg-gradient-to-r hover:from-background/95 hover:to-muted/40 hover:shadow-xl hover:shadow-primary/8",
                        "hover:scale-[1.02] hover:translate-x-2 active:scale-[0.98] active:translate-x-1",
                        "border border-transparent hover:border-primary/20",
                        "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-8 before:bg-gradient-to-r before:from-primary/60 before:to-transparent before:transition-all before:duration-300 hover:before:w-1 before:rounded-r-full",
                        isActive && "bg-gradient-to-r from-primary/12 to-primary/4 text-primary font-semibold shadow-xl shadow-primary/12 border-primary/30 scale-[1.02] translate-x-2 before:w-1"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Animated background shimmer */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-primary/3 to-transparent animate-shimmer" />
                      
                      {/* Floating particles effect */}
                      <div className="absolute top-2 right-8 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-100" />
                      <div className="absolute bottom-3 right-12 w-0.5 h-0.5 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-300" />
                      
                      <div className={cn(
                        "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:rotate-3 group-hover:scale-110",
                        isActive 
                          ? "bg-gradient-to-br from-primary/25 to-primary/10 text-primary shadow-lg shadow-primary/25 border border-primary/40 rotate-3 scale-110" 
                          : "bg-gradient-to-br from-muted/70 to-muted/50 text-muted-foreground group-hover:from-primary/20 group-hover:to-primary/8 group-hover:text-primary group-hover:shadow-lg group-hover:border-primary/30 border border-muted/30"
                      )}>
                        {/* Icon glow effect */}
                        <div className={cn(
                          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                          isActive ? "bg-primary/10 opacity-100" : "bg-primary/5"
                        )} />
                        
                        {SubIcon ? (
                          <SubIcon className={cn(
                            "h-5 w-5 relative z-10 transition-all duration-300",
                            "group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                          )} />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-current relative z-10 group-hover:shadow-[0_0_8px_currentColor]" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className={cn(
                          "truncate font-semibold transition-all duration-200",
                          isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
                        )}>
                          {subItem.label}
                        </div>
                        {subItem.description && (
                          <div className="text-xs text-muted-foreground/70 truncate mt-1.5 group-hover:text-muted-foreground transition-colors duration-200">
                            {subItem.description}
                          </div>
                        )}
                      </div>
                      
                      {subItem.badge && (
                        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-bold text-primary border border-primary/40 shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-200 animate-pulse">
                          {subItem.badge}
                        </span>
                      )}
                      
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-all duration-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 group-hover:scale-110",
                        isActive ? "text-primary opacity-100 translate-x-2 scale-110" : "text-muted-foreground"
                      )} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              // Enhanced quick actions section
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-primary via-primary/60 to-primary/20 shadow-sm animate-pulse" />
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Quick Actions
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-border/40 via-border/20 to-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {QUICK_ACTIONS.map((action, index) => {
                    const ActionIcon = action.icon;
                    
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="group relative flex flex-col items-center gap-3 rounded-2xl p-5 text-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-background/95 hover:to-muted/50 hover:shadow-2xl hover:shadow-primary/15 hover:scale-[1.05] active:scale-[0.95] border border-transparent hover:border-primary/25 overflow-hidden"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        {/* Background glow with shimmer */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/4 via-transparent to-primary/4" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-primary/2 to-transparent animate-shimmer" />
                        
                        {/* Floating micro-particles */}
                        <div className="absolute top-3 right-4 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-200" />
                        <div className="absolute bottom-4 right-6 w-0.5 h-0.5 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-500" />
                        <div className="absolute top-6 left-4 w-0.5 h-0.5 bg-primary/35 rounded-full opacity-0 group-hover:opacity-100 animate-bounce delay-700" />
                        
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-muted/70 to-muted/50 transition-all duration-400 group-hover:from-primary/25 group-hover:to-primary/15 group-hover:shadow-xl group-hover:shadow-primary/25 group-hover:scale-110 group-hover:rotate-3 border border-muted/40 group-hover:border-primary/40">
                          {/* Icon glow ring */}
                          <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                          
                          <ActionIcon className="h-7 w-7 text-muted-foreground transition-all duration-400 group-hover:text-primary group-hover:drop-shadow-[0_0_10px_rgba(var(--primary),0.6)] relative z-10" />
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 relative z-10">
                          <span className="text-xs text-center font-bold leading-tight group-hover:text-foreground transition-colors duration-300">
                            {action.label}
                          </span>
                          {action.shortcut && (
                            <span className="text-[10px] text-muted-foreground/60 font-mono bg-muted/60 px-2 py-1 rounded-lg group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-md transition-all duration-300 border border-muted/30 group-hover:border-primary/30">
                              {action.shortcut}
                            </span>
                          )}
                        </div>
                        
                        {action.badge && (
                          <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-destructive via-destructive/90 to-destructive/80 text-[11px] font-black text-destructive-foreground border-2 border-background shadow-xl animate-pulse group-hover:animate-bounce">
                            <span className="relative z-10">{action.badge}</span>
                            <div className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                          </span>
                        )}
                        
                        {/* Hover ripple effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-ping" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Enhanced collapsed view with tooltips
          <div className="flex flex-col items-center gap-4 px-3 py-2">
            {selectedMenuData?.submenu ? (
              <>
                {/* Section indicator */}
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full shadow-sm" />
                
                {selectedMenuData.submenu.slice(0, 4).map((subItem, index) => {
                  const SubIcon = subItem.icon || FileText;
                  const isActive = pathname === subItem.href;
                  
                  return (
                    <Link key={subItem.id} href={subItem.href}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-12 w-12 transition-all duration-300 hover:scale-110 active:scale-95 relative group rounded-xl",
                          isActive 
                            ? "bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-lg shadow-primary/20 border border-primary/30 scale-105" 
                            : "hover:bg-gradient-to-br hover:from-muted/80 hover:to-muted/60 hover:shadow-md"
                        )}
                        title={subItem.label}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <SubIcon className={cn(
                          "h-6 w-6 transition-colors duration-200", 
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        
                        {/* Enhanced tooltip */}
                        <div className="absolute left-full ml-3 px-3 py-2 bg-popover/95 text-popover-foreground text-sm rounded-xl shadow-xl border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
                          <div className="font-medium">{subItem.label}</div>
                          {subItem.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">{subItem.description}</div>
                          )}
                        </div>
                        
                        {/* Active indicator dot */}
                        {isActive && (
                          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full shadow-sm" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
                
                {/* Show more indicator if there are more items */}
                {selectedMenuData.submenu.length > 4 && (
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">
                      +{selectedMenuData.submenu.length - 4} more
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Section indicator */}
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full shadow-sm" />
                
                {QUICK_ACTIONS.slice(0, 4).map((action, index) => {
                  const ActionIcon = action.icon;
                  
                  return (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 relative group transition-all duration-300 hover:scale-110 active:scale-95 rounded-xl hover:bg-gradient-to-br hover:from-muted/80 hover:to-muted/60 hover:shadow-md"
                      title={action.label}
                      onClick={action.action}
                    >
                      <ActionIcon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                      
                      {action.badge && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-destructive/80 text-[10px] font-bold text-destructive-foreground border-2 border-background shadow-md animate-pulse">
                          {action.badge}
                        </span>
                      )}
                      
                      {/* Enhanced tooltip */}
                      <div className="absolute left-full ml-3 px-3 py-2 bg-popover/95 text-popover-foreground text-sm rounded-xl shadow-xl border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
                        <div className="font-medium">{action.label}</div>
                        {action.shortcut && (
                          <div className="text-xs text-muted-foreground mt-1 font-mono">{action.shortcut}</div>
                        )}
                      </div>
                    </Button>
                  );
                })}
                
                {/* Show more indicator */}
                {QUICK_ACTIONS.length > 4 && (
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">
                      +{QUICK_ACTIONS.length - 4} more
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Pro Upgrade Banner */}
      <div className="p-4 border-t border-border/30">
        {isSecondaryExpanded ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-4 group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Sparkle effect */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            <div className="absolute top-4 right-6 w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-300" />
            
            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Upgrade to Pro</h3>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock advanced analytics, unlimited wallets, and premium features
              </p>
              
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 rounded-xl"
                onClick={() => router.push('/dashboard/subscription')}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
              
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/60">
                <span>✨</span>
                <span>7-day free trial</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 relative group transition-all duration-300 hover:scale-105 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 border border-primary/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20"
              title="Upgrade to Pro"
              onClick={() => router.push('/dashboard/subscription')}
            >
              <Crown className="h-6 w-6 text-primary" />
              
              {/* Pulse ring animation */}
              <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-75" />
              
              {/* Enhanced tooltip */}
              <div className="absolute left-full ml-3 px-3 py-2 bg-popover/95 text-popover-foreground text-sm rounded-xl shadow-xl border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
                <div className="font-bold text-primary">Upgrade to Pro</div>
                <div className="text-xs text-muted-foreground mt-1">Unlock premium features</div>
              </div>
            </Button>
            
            <div className="flex items-center justify-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse delay-150 mx-0.5" />
              <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMobileSidebar = () => (
    <div className="flex h-full ">
      <div className="w-20 shrink-0">
        {renderMainColumn()}
      </div>
      <div className="flex-1">
        {renderSecondaryColumn()}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-96">
            {renderMobileSidebar()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "hidden md:flex h-full bg-background",
          className
        )}
      >
        {renderMainColumn()}
        {renderSecondaryColumn()}
      </div>
    </>
  );
}