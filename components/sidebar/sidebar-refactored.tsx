'use client';

import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Search,
  Plus,
  Bell,
  Calculator,
  Download,
  Upload,
  Building,
  Store,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { useAccount } from '@/lib/contexts/account-context';
import { useCommandPalette } from '../command/command-palette';
import { SidebarMainColumn } from './sidebar-main-column';
import { SidebarSecondaryColumn } from './sidebar-secondary-column';
import { MenuItem, QuickAction } from './types';
import { 
  GuidanceBank, 
  HugeiconsAnalytics02, 
  HugeiconsAnalyticsUp,  
  HugeiconsHome04, 
  HugeiconsPieChart09, 
  HugeiconsTransactionHistory, 
  MageGoals, 
  SolarWallet2Outline, 
  StreamlinePlumpFileReport, 
  TablerEyeDollar 
} from '../icons/icons';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HugeiconsHome04,
    href: '/dashboard',
    submenu: [
      { id: 'overview', label: 'Overview', href: '/dashboard', description: 'Main dashboard view', icon: TablerEyeDollar},
      { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics', description: 'Detailed analytics', icon: HugeiconsAnalyticsUp },
      { id: 'reports', label: 'Reports', href: '/dashboard/reports', description: 'Financial reports', icon: StreamlinePlumpFileReport }
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
    action: () => {}, // Will be handled by command palette
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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { selectedAccount } = useAccount();
  const { openCommandPalette, CommandPalette } = useCommandPalette();
  const pathname = usePathname();
  
  // Use the custom sidebar hook for better state management
  const {
    isExpanded: isSecondaryExpanded,
    selectedMenuItem,
    activeMenuItem,
    toggleExpanded,
    selectMenuItem
  } = useSidebar({ defaultExpanded });

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

  const handleActionClick = useCallback((actionId: string) => {
    const action = QUICK_ACTIONS.find(a => a.id === actionId);
    if (action) {
      if (actionId === 'search') {
        openCommandPalette();
      } else {
        action.action();
      }
    }
  }, [openCommandPalette]);

  const selectedMenuData = selectedMenuItem 
    ? MENU_ITEMS.find(item => item.id === selectedMenuItem)
    : null;

  const renderMobileSidebar = () => (
    <div className="flex h-full ">
      <div className="w-20 shrink-0">
        <SidebarMainColumn
          menuItems={MENU_ITEMS}
          activeMenuItem={activeMenuItem}
          selectedMenuItem={selectedMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />
      </div>
      <div className="flex-1">
        <SidebarSecondaryColumn
          isExpanded={true}
          selectedMenuItem={selectedMenuItem}
          selectedMenuData={selectedMenuData}
          actions={QUICK_ACTIONS}
          onToggleExpanded={toggleExpanded}
          onMobileClose={() => setIsMobileOpen(false)}
          onOpenCommandPalette={openCommandPalette}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Command Palette */}
      <CommandPalette />
      
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
        <SidebarMainColumn
          menuItems={MENU_ITEMS}
          activeMenuItem={activeMenuItem}
          selectedMenuItem={selectedMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />
        <SidebarSecondaryColumn
          isExpanded={isSecondaryExpanded}
          selectedMenuItem={selectedMenuItem}
          selectedMenuData={selectedMenuData}
          actions={QUICK_ACTIONS}
          onToggleExpanded={toggleExpanded}
          onMobileClose={() => setIsMobileOpen(false)}
          onOpenCommandPalette={openCommandPalette}
          onActionClick={handleActionClick}
        />
      </div>
    </>
  );
}