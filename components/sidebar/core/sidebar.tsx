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
  Plug,
  Wallet,
  LineChart,
  CreditCard,
  ShieldCheck,
  Banknote
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
  HeroiconsWallet,
  HeroiconsWallet16Solid,
  HugeiconsAnalytics02,
  HugeiconsAnalyticsUp,
  HugeiconsHome04,
  HugeiconsPieChart09,
  HugeiconsPuzzle,
  HugeiconsTransactionHistory,

  MageGoals,
  PhBrainDuotone,
  SolarAddSquareBoldDuotone,
  SolarBillListBoldDuotone,
  SolarCalculatorBoldDuotone,
  SolarChartSquareBoldDuotone,
  SolarClipboardListBoldDuotone,
  SolarDownloadBoldDuotone,
  SolarGraphUpBoldDuotone,
  SolarHomeSmileBoldDuotone,
  SolarInboxInBoldDuotone,
  SolarLibraryBoldDuotone,
  SolarPieChart2BoldDuotone,
  SolarWallet2Outline,
  SolarWalletMoneyBoldDuotone,
  SolarWalletMoneyLinear,
  SolarWidgetAddBoldDuotone,
  StreamlineFlexWallet,
  StreamlinePlumpFileReport,
  TablerEyeDollar
} from '@/components/icons/icons';
import { LetsIconsSettingLineDuotone } from '@/components/icons';

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: SolarHomeSmileBoldDuotone,
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
        href: '/dashboard/analytics',
        description: 'Deep dive into your financial data',
        icon: HugeiconsAnalyticsUp,
        status: 'new',
        tooltip: 'Advanced analytics and insights'
      },
      {
        id: 'reports',
        label: 'Reports',
        href: '/dashboard/reports',
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
    icon: SolarLibraryBoldDuotone,
    href: '/accounts',
    submenu: [
      {
        id: 'crypto-wallets',
        label: 'Crypto Wallets',
        href: '/accounts/wallet',
        icon: HeroiconsWallet,
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
        id: 'integrations',
        label: 'Integrations',
        href: '/accounts/integrations',
        icon: Plug,
        description: 'Manage third-party connections',
        tooltip: 'Connected apps and services',
        status: 'new'
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
    id: 'transactions',
    label: 'Transactions',
    icon: SolarBillListBoldDuotone,
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
        href: '/transactions/income',
        icon: TrendingUp,
        description: 'Track earnings and income',
        tooltip: 'All income sources and deposits',
        iconColor: '#10b981'
      },
      {
        id: 'expenses',
        label: 'Expenses',
        href: '/transactions/expenses',
        icon: TrendingUp,
        description: 'Monitor spending patterns',
        tooltip: 'Track and categorize expenses',
        iconColor: '#ef4444'
      },
      {
        id: 'transfers',
        label: 'Transfers',
        href: '/transactions/transfers',
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
    id: 'portfolio',
    label: 'Portfolio',
    icon: SolarPieChart2BoldDuotone,
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
    id: 'budgets',
    label: 'Budgets',
    icon: SolarCalculatorBoldDuotone,
    href: '/budgets',
    submenu: [
      {
        id: 'all-budgets',
        label: 'All Budgets',
        href: '/budgets',
        icon: SolarCalculatorBoldDuotone,
        description: 'View and manage all your budgets',
        tooltip: 'Track spending against your budgets'
      },
      {
        id: 'active-budgets',
        label: 'Active Budgets',
        href: '/budgets',
        icon: TrendingUp,
        description: 'Currently active budgets',
        tooltip: 'Your active budget plans'
      },
      {
        id: 'exceeded-budgets',
        label: 'Exceeded',
        href: '/budgets',
        icon: TrendingUp,
        description: 'Over-budget alerts',
        tooltip: 'Budgets you have exceeded',
        iconColor: '#ef4444'
      },
      {
        id: 'create-budget',
        label: 'Create Budget',
        href: '/budgets',
        icon: Plus,
        description: 'Create a new budget',
        tooltip: 'Set up a new spending budget',
        iconColor: '#10b981'
      }
    ],
    quickActions: [
      { id: 'create-budget', label: 'Create Budget', icon: Plus, action: () => {}, shortcut: '⌘U' },
      { id: 'budget-alerts', label: 'Budget Alerts', icon: Bell, action: () => {}, },
      { id: 'budget-insights', label: 'Budget Insights', icon: Lightbulb, action: () => {}, }
    ]
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: SolarInboxInBoldDuotone,
    href: '/subscriptions',

  },
  {
    id: 'investments',
    label: 'Investments',
    icon: SolarGraphUpBoldDuotone,
    href: '/investments',

  },
  {
    id: 'insights',
    label: 'Insights',
    icon: SolarChartSquareBoldDuotone,
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
        href: '/insights/market',
        icon: BarChart3,
        description: 'Real-time market trends',
        tooltip: 'Stay updated on market movements',
        requiresPro: true
      },
      {
        id: 'trends',
        label: 'Spending Trends',
        href: '/insights/trends',
        icon: TrendingUp,
        description: 'Analyze spending patterns',
        tooltip: 'Understand where your money goes'
      },
      {
        id: 'recommendations',
        label: 'AI Recommendations',
        href: '/insights/recommendations',
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
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: SolarWidgetAddBoldDuotone,
    href: '/accounts/integrations',
    quickActions: [
      { id: 'add-integration', label: 'Add Integration', icon: Plus, action: () => {}, },
      { id: 'sync-integrations', label: 'Sync All', icon: RefreshCw, action: () => {}, },
      { id: 'integration-settings', label: 'Settings', icon: Settings, action: () => {}, }
    ]
  },
  {
    id: 'ai',
    label: 'MapprAI',
    icon: PhBrainDuotone,
    href: '/ai',
    submenu: [
      {
        id: 'chat',
        label: 'Chat',
        href: '/ai',
        icon: PhBrainDuotone,
        description: 'Chat with MapprAI',
        tooltip: 'Ask questions and get insights'
      },
      {
        id: 'analysis',
        label: 'Analysis',
        href: '/ai/analysis',
        icon: BarChart3,
        description: 'AI-powered financial analysis',
        tooltip: 'Deep insights into your finances'
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        href: '/ai/recommendations',
        icon: Lightbulb,
        description: 'Personalized AI recommendations',
        tooltip: 'Smart suggestions for your finances'
      }
    ],
    quickActions: [
      { id: 'ask-ai', label: 'Ask MapprAI', icon: PhBrainDuotone, action: () => {}, shortcut: '⌘A' },
      { id: 'generate-report', label: 'Generate Report', icon: FileText, action: () => {}, },
      { id: 'ai-settings', label: 'AI Settings', icon: Settings, action: () => {}, }
    ]
  },
];

export const QUICK_ACTIONS: QuickAction[] = [

  {
    id: "add-wallet",
    label: "Add",
    icon: SolarAddSquareBoldDuotone,
    action: () => {}, // handled by command palette
    shortcut: "⌘W",
  },
 

  {
    id: "calculator",
    label: "Calculators",
    action: () => {}, // handled by command palette
    icon: SolarCalculatorBoldDuotone,
  },

  {
    id: "export-data",
    label: "Export",
    action: () => {}, // handled by command palette
    icon: SolarDownloadBoldDuotone,
  },

  {
    id: "subscriptions",
    label: "Subscription",
    icon: SolarInboxInBoldDuotone,
    action: () => {}, // handled by command palette
  },

  {
    id: "settings",
    label: "Settings",
    action: () => {}, // handled by command palette
    icon: LetsIconsSettingLineDuotone,
  },
]

export interface SidebarProps {
  className?: string;
  defaultExpanded?: boolean;
  mainColumnExpanded: boolean;
  onToggleMainColumn: () => void;
  selectedMenuItem?: string | null;
  activeMenuItem?: string | null;
  onMenuItemClick?: (itemId: string) => void;
}

export function Sidebar({
  className,
  defaultExpanded = true,
  mainColumnExpanded,
  onToggleMainColumn,
  selectedMenuItem: externalSelectedMenuItem,
  activeMenuItem: externalActiveMenuItem,
  onMenuItemClick: externalOnMenuItemClick
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { selectedAccount } = useAccount();
  const { openCommandPalette, CommandPalette } = useCommandPalette();
  const pathname = usePathname();

  // Use internal hook ONLY for secondary column and keyboard shortcuts
  // All main state (mainColumnExpanded, selectedMenuItem, activeMenuItem) comes from props
  const {
    isExpanded: isSecondaryExpanded,
    selectedMenuItem: internalSelectedMenuItem,
    activeMenuItem: internalActiveMenuItem,
    toggleExpanded,
    selectMenuItem: internalSelectMenuItem
  } = useSidebar({ defaultExpanded });

  // Use props if provided, otherwise fall back to internal state
  const selectedMenuItem = externalSelectedMenuItem !== undefined ? externalSelectedMenuItem : internalSelectedMenuItem;
  const activeMenuItem = externalActiveMenuItem !== undefined ? externalActiveMenuItem : internalActiveMenuItem;
  const selectMenuItem = externalOnMenuItemClick ? (itemId: string) => externalOnMenuItemClick(itemId) : internalSelectMenuItem;

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
    // Use external callback if provided, otherwise use internal state
    if (externalOnMenuItemClick) {
      externalOnMenuItemClick(itemId);
    } else {
      internalSelectMenuItem(itemId);
    }
  }, [externalOnMenuItemClick, internalSelectMenuItem]);

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
          mainColumnExpanded={mainColumnExpanded}
        />
       {/*  <SidebarSecondaryColumn
          isExpanded={isSecondaryExpanded}
          selectedMenuItem={selectedMenuItem}
          selectedMenuData={selectedMenuData}
          actions={QUICK_ACTIONS}
          onToggleExpanded={toggleExpanded}
          onMobileClose={() => {}}
          onOpenCommandPalette={openCommandPalette}
          onActionClick={handleActionClick}
        /> */}
      </div>
    </>
  );
}