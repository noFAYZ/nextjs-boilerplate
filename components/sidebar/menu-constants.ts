import { Plus, Search, Bell, Calculator, Download, Upload, Building, Store, Plug } from 'lucide-react';
import { MenuItem, QuickAction } from './types';
import {
  FluentBuildingBank28Regular,
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

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HugeiconsHome04,
    href: '/dashboard',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: SolarWallet2Outline,
    href: '/dashboard/accounts',
    submenu: [
      { id: 'crypto-wallets', label: 'Crypto Wallets', href: '/dashboard/accounts/wallet', icon: SolarWallet2Outline, description: 'Manage cryptocurrency wallets' },
      { id: 'bank-accounts', label: 'Bank Accounts', href: '/dashboard/accounts/bank', icon: FluentBuildingBank28Regular, description: 'Traditional banking accounts' },
      { id: 'exchanges', label: 'Exchanges', href: '/dashboard/accounts/exchange', icon: Building, description: 'Cryptocurrency exchanges' },
      { id: 'add-wallet', label: 'Add New Wallet', href: '/dashboard/accounts/wallet/add', icon: Plus, description: 'Connect a new crypto wallet' }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Plug,
    href: '#',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: HugeiconsPieChart09,
    href: '/dashboard/portfolio',
    submenu: [
      { id: 'overview', label: 'Overview', href: '/dashboard/portfolio', icon: HugeiconsPieChart09, description: 'Complete portfolio overview' },
      { id: 'crypto', label: 'Crypto Portfolio', href: '/dashboard/portfolio/crypto', icon: SolarWallet2Outline, description: 'View all cryptocurrency holdings' },
      { id: 'banking', label: 'Banking Portfolio', href: '/dashboard/portfolio/banking', icon: FluentBuildingBank28Regular, description: 'View all bank accounts' }
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

export const QUICK_ACTIONS: QuickAction[] = [
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
  }
];