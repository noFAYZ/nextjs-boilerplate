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
import { MobileFloatingMenu } from '../mobile/floating-menu';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { useAccount } from '@/lib/contexts/account-context';
import { useCommandPalette } from '@/components/command/command-palette';
import { SidebarMainColumn } from './main-column';
import { SidebarSecondaryColumn } from './secondary-column';
import { MenuItem, QuickAction } from '../types';
import { 
  FluentBuildingBank28Regular,
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
} from '@/components/icons/icons';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HugeiconsHome04,
    href: '/dashboard',
    submenu: [
      {
        id: 'overview',
        label: 'Overview',
        href: '/dashboard',
        description: 'Main dashboard view with key metrics',
        icon: TablerEyeDollar,
        tooltip: 'View your complete financial overview'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        description: 'Deep dive into your financial data',
        icon: HugeiconsAnalyticsUp,
        status: 'new',
        tooltip: 'Advanced analytics and insights'
      },
      {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        description: 'Generate and view financial reports',
        icon: StreamlinePlumpFileReport,
        tooltip: 'Custom reports and exports'
      },
      {
        id: 'widgets',
        label: 'Widgets',
        href: '/widgets',
        description: 'Customize your dashboard',
        icon: Settings,
        status: 'updated',
        tooltip: 'Manage dashboard widgets'
      }
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
    href: '/accounts',
    submenu: [
      {
        id: 'crypto-wallets',
        label: 'Crypto Wallets',
        href: '/accounts/wallet',
        icon: SolarWalletMoneyLinear,
        description: 'Track your cryptocurrency wallets',
        tooltip: 'Connect and manage crypto wallets across all chains',
        shortcut: '⌘W'
      },
      {
        id: 'bank-accounts',
        label: 'Bank Accounts',
        href: '/accounts/bank',
        icon: FluentBuildingBank28Regular,
        description: 'Monitor traditional bank accounts',
        tooltip: 'Link and track your bank accounts securely',
        shortcut: '⌘B'
      },
      {
        id: 'exchanges',
        label: 'Exchanges',
        href: '/accounts/exchange',
        icon: Building,
        description: 'Connect crypto exchange accounts',
        tooltip: 'Sync your exchange portfolios',
        status: 'beta'
      },
      {
        id: 'integrations',
        label: 'Integrations',
        href: '/accounts/integrations',
        icon: Plug,
        description: 'Manage third-party connections',
        tooltip: 'Connected apps and services',
        status: 'new'
      },
      {
        id: 'connection',
        label: 'Connect Account',
        href: '/accounts/connection',
        icon: Plus,
        description: 'Add a new financial account',
        tooltip: 'Connect new wallets, banks, or exchanges',
        iconColor: '#10b981'
      }
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
    href: '/accounts/integrations',
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
    href: '/portfolio',
    submenu: [
      {
        id: 'overview',
        label: 'Portfolio Overview',
        href: '/portfolio',
        icon: HugeiconsPieChart09,
        description: 'Complete portfolio snapshot',
        tooltip: 'View your entire portfolio at a glance'
      },
      {
        id: 'holdings',
        label: 'Holdings',
        href: '/portfolio/holdings',
        icon: Store,
        description: 'Detailed asset breakdown',
        tooltip: 'All your assets in one place'
      },
      {
        id: 'performance',
        label: 'Performance',
        href: '/portfolio/performance',
        icon: TrendingUp,
        description: 'Track portfolio performance',
        tooltip: 'Returns, gains, and performance metrics',
        status: 'updated'
      },
      {
        id: 'allocation',
        label: 'Asset Allocation',
        href: '/portfolio/allocation',
        icon: BarChart3,
        description: 'Analyze your asset distribution',
        tooltip: 'Diversification and allocation analysis'
      }
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
    href: '/transactions',
    submenu: [
      {
        id: 'all',
        label: 'All Transactions',
        href: '/transactions',
        icon: HugeiconsTransactionHistory,
        description: 'Complete transaction history',
        tooltip: 'View all your financial transactions'
      },
      {
        id: 'income',
        label: 'Income',
        href: '/dashboard/transactions/income',
        icon: TrendingUp,
        description: 'Track earnings and income',
        tooltip: 'All income sources and deposits',
        iconColor: '#10b981'
      },
      {
        id: 'expenses',
        label: 'Expenses',
        href: '/dashboard/transactions/expenses',
        icon: TrendingUp,
        description: 'Monitor spending patterns',
        tooltip: 'Track and categorize expenses',
        iconColor: '#ef4444'
      },
      {
        id: 'transfers',
        label: 'Transfers',
        href: '/dashboard/transactions/transfers',
        icon: RefreshCw,
        description: 'Internal account transfers',
        tooltip: 'Money moved between your accounts'
      }
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
    href: '/goals',
    submenu: [
      {
        id: 'active',
        label: 'Active Goals',
        href: '/goals',
        icon: Target,
        description: 'Your current financial goals',
        tooltip: 'Track progress on active goals'
      },
      {
        id: 'savings',
        label: 'Savings Goals',
        href: '/goals/savings',
        icon: SolarWallet2Outline,
        description: 'Short and long-term savings',
        tooltip: 'Emergency funds, vacation, etc.'
      },
      {
        id: 'investment',
        label: 'Investment Goals',
        href: '/goals/investment',
        icon: TrendingUp,
        description: 'Wealth building objectives',
        tooltip: 'Retirement, portfolio targets, etc.',
        requiresPro: true
      },
      {
        id: 'create',
        label: 'Create New Goal',
        href: '/goals/create',
        icon: Plus,
        description: 'Set a new financial target',
        tooltip: 'Define and track new financial goals',
        iconColor: '#10b981'
      }
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
    href: '/insights',
    submenu: [
      {
        id: 'overview',
        label: 'Insights Overview',
        href: '/insights',
        icon: Lightbulb,
        description: 'AI-powered financial insights',
        tooltip: 'Smart insights about your finances',
        status: 'new'
      },
      {
        id: 'market',
        label: 'Market Analysis',
        href: '/dashboard/insights/market',
        icon: BarChart3,
        description: 'Real-time market trends',
        tooltip: 'Stay updated on market movements',
        requiresPro: true
      },
      {
        id: 'trends',
        label: 'Spending Trends',
        href: '/dashboard/insights/trends',
        icon: TrendingUp,
        description: 'Analyze spending patterns',
        tooltip: 'Understand where your money goes'
      },
      {
        id: 'recommendations',
        label: 'AI Recommendations',
        href: '/dashboard/insights/recommendations',
        icon: Lightbulb,
        description: 'Personalized financial advice',
        tooltip: 'Get smart recommendations',
        status: 'beta',
        requiresPro: true
      }
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