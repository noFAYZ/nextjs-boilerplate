/**
 * Example implementation of the enhanced submenu system
 * This file demonstrates all features available in the production-grade submenu
 */

import { SubMenuItem, SubMenuGroup } from './types';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  CreditCard,
  PieChart,
  Target,
  Lightbulb,
  Plus,
  Lock
} from 'lucide-react';

// ============================================================================
// EXAMPLE 1: Basic Submenu Items
// ============================================================================

export const basicSubmenuExample: SubMenuItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Main dashboard view'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    description: 'Detailed analytics'
  }
];

// ============================================================================
// EXAMPLE 2: Enhanced Submenu with All Features
// ============================================================================

export const enhancedSubmenuExample: SubMenuItem[] = [
  // New feature with tooltip and keyboard shortcut
  {
    id: 'new-feature',
    label: 'Market Insights',
    href: '/insights/market',
    icon: Lightbulb,
    description: 'AI-powered market analysis',
    tooltip: 'Get real-time insights about market trends',
    status: 'new',
    shortcut: '⌘M',
    count: 3,
    trackingId: 'market_insights_click'
  },

  // Pro feature with access control
  {
    id: 'advanced-analytics',
    label: 'Advanced Analytics',
    href: '/analytics/advanced',
    icon: BarChart3,
    description: 'Deep dive into your data',
    tooltip: 'Unlock powerful analytics with Pro',
    requiresPro: true,
    status: 'beta',
    iconColor: '#8b5cf6'
  },

  // Feature with dynamic count
  {
    id: 'goals',
    label: 'Active Goals',
    href: '/goals',
    icon: Target,
    description: 'Track your financial goals',
    count: 5,
    shortcut: '⌘G'
  },

  // Updated feature
  {
    id: 'portfolio',
    label: 'Portfolio',
    href: '/portfolio',
    icon: PieChart,
    description: 'View your complete portfolio',
    status: 'updated',
    tooltip: 'Now with improved performance tracking'
  },

  // Coming soon feature (disabled)
  {
    id: 'tax-optimization',
    label: 'Tax Optimization',
    href: '/tax',
    icon: Lock,
    description: 'Optimize your tax strategy',
    status: 'coming-soon',
    isDisabled: true,
    tooltip: 'Coming in Q2 2025'
  },

  // Loading state example
  {
    id: 'syncing-data',
    label: 'Sync Data',
    href: '/sync',
    description: 'Syncing with financial institutions',
    isLoading: true
  },

  // Custom action instead of navigation
  {
    id: 'add-account',
    label: 'Add Account',
    href: '#',
    icon: Plus,
    description: 'Connect a new account',
    iconColor: '#10b981',
    onClick: (e) => {
      e.preventDefault();
      console.log('Open add account modal');
      // openAddAccountModal();
    }
  },

  // External link
  {
    id: 'help-docs',
    label: 'Help & Documentation',
    href: 'https://docs.example.com',
    description: 'Learn more about features',
    externalLink: true
  }
];

// ============================================================================
// EXAMPLE 3: Grouped Submenu Items
// ============================================================================

export const groupedSubmenuExample: SubMenuGroup[] = [
  {
    id: 'accounts',
    label: 'Accounts',
    icon: Wallet,
    isCollapsible: true,
    defaultExpanded: true,
    order: 1,
    items: [
      {
        id: 'crypto-wallets',
        label: 'Crypto Wallets',
        href: '/accounts/crypto',
        icon: Wallet,
        description: 'Your cryptocurrency wallets',
        count: 3,
        shortcut: '⌘W'
      },
      {
        id: 'bank-accounts',
        label: 'Bank Accounts',
        href: '/accounts/bank',
        icon: CreditCard,
        description: 'Traditional bank accounts',
        count: 2,
        shortcut: '⌘B'
      }
    ]
  },
  {
    id: 'insights',
    label: 'Insights & Analytics',
    icon: TrendingUp,
    isCollapsible: true,
    defaultExpanded: false,
    order: 2,
    items: [
      {
        id: 'market-insights',
        label: 'Market Analysis',
        href: '/insights/market',
        icon: BarChart3,
        description: 'Real-time market trends',
        requiresPro: true,
        status: 'new'
      },
      {
        id: 'spending-trends',
        label: 'Spending Trends',
        href: '/insights/spending',
        icon: TrendingUp,
        description: 'Analyze your spending patterns'
      }
    ]
  }
];

// ============================================================================
// EXAMPLE 4: Real-World Dashboard Menu
// ============================================================================

export const dashboardMenuExample: SubMenuItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Main dashboard with key metrics',
    tooltip: 'View your complete financial overview',
    shortcut: '⌘1'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    description: 'Deep dive into your financial data',
    tooltip: 'Advanced analytics and insights',
    status: 'new',
    shortcut: '⌘2'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: PieChart,
    description: 'Generate and view financial reports',
    tooltip: 'Custom reports and exports',
    shortcut: '⌘3'
  },
  {
    id: 'widgets',
    label: 'Widgets',
    href: '/dashboard/widgets',
    description: 'Customize your dashboard',
    status: 'updated',
    tooltip: 'Manage dashboard widgets',
    shortcut: '⌘4'
  }
];

// ============================================================================
// EXAMPLE 5: Permission-Based Menu
// ============================================================================

export const permissionBasedMenuExample: SubMenuItem[] = [
  // Available to all users
  {
    id: 'basic-view',
    label: 'Basic View',
    href: '/basic',
    icon: BarChart3,
    description: 'Basic financial overview'
  },

  // Requires 'analyst' permission
  {
    id: 'analyst-tools',
    label: 'Analyst Tools',
    href: '/analyst',
    icon: TrendingUp,
    description: 'Advanced analysis tools',
    requiredPermissions: ['analyst', 'admin']
  },

  // Requires 'admin' permission
  {
    id: 'admin-panel',
    label: 'Admin Panel',
    href: '/admin',
    icon: Lock,
    description: 'Administrative controls',
    requiredPermissions: ['admin']
  },

  // Requires Pro subscription
  {
    id: 'premium-features',
    label: 'Premium Features',
    href: '/premium',
    icon: Lightbulb,
    description: 'Unlock advanced capabilities',
    requiresPro: true
  },

  // Requires both Pro and specific permission
  {
    id: 'enterprise-tools',
    label: 'Enterprise Tools',
    href: '/enterprise',
    icon: Target,
    description: 'Enterprise-level features',
    requiresPro: true,
    requiredPermissions: ['enterprise']
  }
];

// ============================================================================
// EXAMPLE 6: Status Indicator Showcase
// ============================================================================

export const statusShowcaseExample: SubMenuItem[] = [
  {
    id: 'new-item',
    label: 'New Feature',
    href: '/new',
    status: 'new',
    description: 'Recently added feature'
  },
  {
    id: 'beta-item',
    label: 'Beta Feature',
    href: '/beta',
    status: 'beta',
    description: 'Feature in testing phase'
  },
  {
    id: 'updated-item',
    label: 'Updated Feature',
    href: '/updated',
    status: 'updated',
    description: 'Recently improved feature'
  },
  {
    id: 'deprecated-item',
    label: 'Legacy Feature',
    href: '/legacy',
    status: 'deprecated',
    description: 'Being phased out'
  },
  {
    id: 'coming-item',
    label: 'Future Feature',
    href: '/future',
    status: 'coming-soon',
    isDisabled: true,
    description: 'Coming soon'
  }
];

// ============================================================================
// USAGE EXAMPLE IN COMPONENT
// ============================================================================

/**
 * Example usage in a React component:
 *
 * import { SidebarMenuContentEnhanced } from './sidebar-menu-content-enhanced';
 * import { enhancedSubmenuExample } from './submenu-example';
 *
 * function MyComponent() {
 *   return (
 *     <SidebarMenuContentEnhanced
 *       submenu={enhancedSubmenuExample}
 *       enableKeyboardNav={true}
 *       onItemClick={(item) => {
 *         console.log('Clicked:', item.label);
 *       }}
 *     />
 *   );
 * }
 *
 * // With groups:
 * function MyGroupedComponent() {
 *   return (
 *     <SidebarMenuContentEnhanced
 *       groups={groupedSubmenuExample}
 *       enableKeyboardNav={true}
 *     />
 *   );
 * }
 */
