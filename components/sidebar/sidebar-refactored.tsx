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
  Menu,
  BarChart3,
  FileText,
  TrendingUp,
  Target,
  Lightbulb,
  RefreshCw,
  Filter,
  Calendar,
  Share,
  Settings,
  Plug
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileFloatingMenu } from './mobile-floating-menu';
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
  HugeiconsPuzzle, 
  HugeiconsTransactionHistory, 
  MageGoals, 
  SolarWallet2Outline, 
  SolarWalletMoneyLinear, 
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
    ],
    quickActions: [
      { id: 'refresh-data', label: 'Refresh Data', icon: RefreshCw, action: () => window.location.reload(), shortcut: '⌘R' },
      { id: 'export-dashboard', label: 'Export Dashboard', icon: Download, action: () => {}, shortcut: '⌘E' },
      { id: 'dashboard-settings', label: 'Dashboard Settings', icon: Settings, action: () => {}, },
      { id: 'filter-data', label: 'Filter Data', icon: Filter, action: () => {}, shortcut: '⌘F' },
      { id: 'schedule-report', label: 'Schedule Report', icon: Calendar, action: () => {}, },
      { id: 'share-dashboard', label: 'Share Dashboard', icon: Share, action: () => {}, }
    ]
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: SolarWalletMoneyLinear,
    href: '/dashboard/accounts',
    submenu: [
      { id: 'crypto-wallets', label: 'Crypto Wallets', href: '/dashboard/accounts/wallet', icon: SolarWallet2Outline, description: 'Manage cryptocurrency wallets' },
      { id: 'bank-accounts', label: 'Bank Accounts', href: '/dashboard/accounts/bank', icon: GuidanceBank, description: 'Traditional banking accounts' },
      { id: 'exchanges', label: 'Exchanges', href: '/dashboard/accounts/exchange', icon: Building, description: 'Cryptocurrency exchanges' },
      { id: 'add-wallet', label: 'Add New Wallet', href: '/dashboard/accounts/wallet/add', icon: Plus, description: 'Connect a new crypto wallet' }
    ],
    quickActions: [
      { id: 'add-account', label: 'Add Account', icon: Plus, action: () => {}, shortcut: '⌘A' },
      { id: 'sync-accounts', label: 'Sync All Accounts', icon: RefreshCw, action: () => {}, shortcut: '⌘S' },
      { id: 'export-accounts', label: 'Export Accounts', icon: Download, action: () => {}, },
      { id: 'account-settings', label: 'Account Settings', icon: Settings, action: () => {}, },
      { id: 'bulk-actions', label: 'Bulk Actions', icon: BarChart3, action: () => {}, }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: HugeiconsPuzzle,
    href: '/dashboard/accounts/integrations',
    quickActions: [
      { id: 'add-integration', label: 'Add Integration', icon: Plus, action: () => {}, },
      { id: 'sync-integrations', label: 'Sync All', icon: RefreshCw, action: () => {}, },
      { id: 'integration-settings', label: 'Settings', icon: Settings, action: () => {}, }
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
    ],
    quickActions: [
      { id: 'rebalance', label: 'Rebalance Portfolio', icon: BarChart3, action: () => {}, },
      { id: 'analyze-performance', label: 'Analyze Performance', icon: TrendingUp, action: () => {}, shortcut: '⌘P' },
      { id: 'export-portfolio', label: 'Export Portfolio', icon: Download, action: () => {}, },
      { id: 'portfolio-alerts', label: 'Set Alerts', icon: Bell, action: () => {}, },
      { id: 'compare-benchmarks', label: 'Compare Benchmarks', icon: BarChart3, action: () => {}, }
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
    ],
    quickActions: [
      { id: 'add-transaction', label: 'Add Transaction', icon: Plus, action: () => {}, shortcut: '⌘T' },
      { id: 'import-csv', label: 'Import CSV', icon: Upload, action: () => {}, },
      { id: 'export-transactions', label: 'Export Transactions', icon: Download, action: () => {}, },
      { id: 'categorize-bulk', label: 'Bulk Categorize', icon: Filter, action: () => {}, },
      { id: 'transaction-rules', label: 'Auto-Rules', icon: Settings, action: () => {}, }
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
    ],
    quickActions: [
      { id: 'create-goal', label: 'Create Goal', icon: Plus, action: () => {}, shortcut: '⌘G' },
      { id: 'track-progress', label: 'Track Progress', icon: Target, action: () => {}, },
      { id: 'goal-insights', label: 'Goal Insights', icon: Lightbulb, action: () => {}, },
      { id: 'share-goals', label: 'Share Goals', icon: Share, action: () => {}, },
      { id: 'goal-reminders', label: 'Set Reminders', icon: Bell, action: () => {}, }
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
    ],
    quickActions: [
      { id: 'generate-insights', label: 'Generate Insights', icon: Lightbulb, action: () => {}, shortcut: '⌘I' },
      { id: 'market-alerts', label: 'Market Alerts', icon: Bell, action: () => {}, },
      { id: 'custom-report', label: 'Custom Report', icon: FileText, action: () => {}, },
      { id: 'insight-history', label: 'Insight History', icon: Calendar, action: () => {}, },
      { id: 'share-insights', label: 'Share Insights', icon: Share, action: () => {}, }
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
    shortcut: '⌘T'
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: Bell, 
    badge: 3
  },
  { 
    id: 'calculator', 
    label: 'Calculator', 
    icon: Calculator, 
  },
  { 
    id: 'export', 
    label: 'Export Data', 
    icon: Download, 
  },
  { 
    id: 'import', 
    label: 'Import Data', 
    icon: Upload, 
  }
];

export interface SidebarProps {
  className?: string;
  defaultExpanded?: boolean;
}

export function Sidebar({ className, defaultExpanded = true }: SidebarProps) {
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


  return (
    <>
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Mobile Floating Menu */}
      <div className="md:hidden">
        <MobileFloatingMenu />
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
          onMobileClose={() => {}}
          onOpenCommandPalette={openCommandPalette}
          onActionClick={handleActionClick}
        />
      </div>
    </>
  );
}