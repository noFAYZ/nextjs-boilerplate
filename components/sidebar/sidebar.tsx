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
  Upload
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
import { HugeiconsAnalytics02, HugeiconsHome04, HugeiconsPieChart09, HugeiconsTransactionHistory, MageGoals, SolarWallet2Outline, StreamlineUltimateTradingPatternUp } from '../icons/icons';

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
      { id: 'overview', label: 'Overview', href: '/dashboard', description: 'Main dashboard view' },
      { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', description: 'Detailed analytics' },
      { id: 'reports', label: 'Reports', href: '/dashboard/reports', description: 'Financial reports' }
    ]
  },
  {
    id: 'wallets',
    label: 'Wallets',
    icon: SolarWallet2Outline,
    href: '/dashboard/wallets',
    submenu: [
      { id: 'crypto-wallets', label: 'Crypto Wallets', href: '/dashboard/wallets/crypto', icon: Wallet },
      { id: 'bank-accounts', label: 'Bank Accounts', href: '/dashboard/wallets/bank', icon: CreditCard },
      { id: 'add-wallet', label: 'Add New Wallet', href: '/dashboard/wallets/add', icon: Plus }
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
        <Link href="/dashboard" className="flex items-center transition-transform hover:scale-105">
          <LogoMappr className="h-12 w-12" />
        </Link> 
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-4">
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
                  "relative h-12 w-12 ",
                 
                  isSelected && "  shadow-sm",
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
              
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3">
        <div className="flex flex-col gap-2 items-center content-center">
          <ThemeSwitcher  />
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 transition-all duration-200 hover:scale-105 active:scale-95"
            title="Settings"
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="h-7 w-7" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-14 w-14 transition-all duration-100 rounded-full active:outline-0  focus-visible:ring-0 hover:bg-transparent"
                title="Profile"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={profile?.profilePicture} />
                  <AvatarFallback className="text-sm">
                    {profile?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
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
      "flex h-full flex-col bg-muted/20 transition-all duration-300 ease-in-out",
      isSecondaryExpanded ? "w-72" : "w-20"
    )}>
      {/* Header */}
      <div className="flex h-20 items-center px-4">
        {isSecondaryExpanded ? (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-sm font-semibold text-foreground truncate">
              {selectedMenuData?.label || 'Quick Actions'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 transition-all duration-200 hover:scale-102 active:scale-95"
              onClick={toggleExpanded}
              title="Collapse sidebar"
            >
            <FluentPanelLeftExpand28Filled className="h-8 w-8 rotate-180" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 mx-auto transition-all duration-200 hover:scale-102 active:scale-95" 
            onClick={toggleExpanded}
            title="Expand sidebar"
          >
            <FluentPanelLeftExpand28Filled className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {isSecondaryExpanded ? (
          <div className="px-4">
            {selectedMenuData?.submenu ? (
              // Show submenu items
              <nav className="space-y-1">
                {selectedMenuData.submenu.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isActive = pathname === subItem.href;
                  
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                        "hover:bg-background/80",
                        isActive && "bg-background text-primary font-medium shadow-sm"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {SubIcon && <SubIcon className="h-4 w-4 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{subItem.label}</div>
                        {subItem.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {subItem.description}
                          </div>
                        )}
                      </div>
                      {subItem.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              // Show quick actions when no menu item is selected
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Actions
                </h3>
                <nav className="space-y-1">
                  {QUICK_ACTIONS.map((action) => {
                    const ActionIcon = action.icon;
                    
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-background/80"
                      >
                        <ActionIcon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate text-left">{action.label}</span>
                        {action.shortcut && (
                          <span className="text-xs text-muted-foreground">
                            {action.shortcut}
                          </span>
                        )}
                        {action.badge && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                            {action.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        ) : (
          // Show only icons when collapsed
          <div className="flex flex-col items-center gap-3 px-2">
            {selectedMenuData?.submenu ? (
              selectedMenuData.submenu.slice(0, 4).map((subItem) => {
                const SubIcon = subItem.icon || FileText;
                const isActive = pathname === subItem.href;
                
                return (
                  <Link key={subItem.id} href={subItem.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-10 w-10 transition-all duration-200 hover:scale-105 active:scale-95",
                        isActive && "bg-primary/10 text-primary shadow-sm"
                      )}
                      title={subItem.label}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <SubIcon className="h-5 w-5" />
                    </Button>
                  </Link>
                );
              })
            ) : (
              QUICK_ACTIONS.slice(0, 4).map((action) => {
                const ActionIcon = action.icon;
                
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 relative transition-all duration-200 hover:scale-105 active:scale-95"
                    title={action.label}
                    onClick={action.action}
                  >
                    <ActionIcon className="h-5 w-5" />
                    {action.badge && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground animate-pulse">
                        {action.badge}
                      </span>
                    )}
                  </Button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderMobileSidebar = () => (
    <div className="flex h-full overflow-hidden">
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