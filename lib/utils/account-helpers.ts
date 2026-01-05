import {
  Building2,
  CreditCard,
  Home,
  PiggyBank,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Zap,
  Link2,
  type LucideIcon,
} from 'lucide-react';
import type { UnifiedAccount, AccountCategory, AccountType } from '@/lib/types';

/**
 * Account type to icon mapping
 */
export const accountTypeIcons: Record<string, LucideIcon> = {
  // Checking/Savings
  CHECKING: PiggyBank,
  SAVINGS: PiggyBank,
  MONEY_MARKET: Wallet,

  // Credit
  CREDIT_CARD: CreditCard,
  CHARGE_CARD: CreditCard,
  SECURED_CREDIT_CARD: CreditCard,

  // Investment
  BROKERAGE: TrendingUp,
  STOCKS: TrendingUp,
  BONDS: TrendingUp,
  MUTUAL_FUND: TrendingUp,
  ETF: TrendingUp,
  '401K': TrendingUp,
  IRA: TrendingUp,
  ROTH_IRA: TrendingUp,
  INVESTMENT_ACCOUNT: TrendingUp,

  // Assets
  HOME: Home,
  VEHICLE: Wallet,
  CRYPTO_WALLET: Wallet,
  CRYPTO_EXCHANGE: Wallet,

  // Loans
  LOAN: AlertCircle,
  MORTGAGE: Home,
  AUTO_LOAN: AlertCircle,
  STUDENT_LOAN: AlertCircle,
  PERSONAL_LOAN: AlertCircle,

  // Default
  DEFAULT: Building2,
};

/**
 * Get icon for account type
 */
export function getAccountTypeIcon(type: string): LucideIcon {
  return accountTypeIcons[type] || accountTypeIcons.DEFAULT;
}

/**
 * Category to gradient background mapping
 */
export const categoryGradients: Record<string, string> = {
  CASH: 'from-emerald-500/10 to-teal-500/5',
  CREDIT: 'from-amber-500/10 to-orange-500/5',
  INVESTMENTS: 'from-blue-500/10 to-indigo-500/5',
  ASSETS: 'from-purple-500/10 to-pink-500/5',
  LIABILITIES: 'from-red-500/10 to-rose-500/5',
  CRYPTO: 'from-violet-500/10 to-purple-500/5',
  OTHER: 'from-gray-500/10 to-slate-500/5',
};

/**
 * Get gradient class for account category
 */
export function getCategoryGradient(category?: string): string {
  if (!category) return categoryGradients.OTHER;
  return categoryGradients[category] || categoryGradients.OTHER;
}

/**
 * Category to border color mapping
 */
export const categoryBorders: Record<string, string> = {
  CASH: 'border-emerald-500/20',
  CREDIT: 'border-amber-500/20',
  INVESTMENTS: 'border-blue-500/20',
  ASSETS: 'border-purple-500/20',
  LIABILITIES: 'border-red-500/20',
  CRYPTO: 'border-violet-500/20',
  OTHER: 'border-gray-500/20',
};

/**
 * Get border color for account category
 */
export function getCategoryBorder(category?: string): string {
  if (!category) return categoryBorders.OTHER;
  return categoryBorders[category] || categoryBorders.OTHER;
}

/**
 * Account source configuration
 */
export const sourceConfig: Record<string, { label: string; icon: string; color: string }> = {
  manual: {
    label: 'Manual',
    icon: '✏️',
    color: 'text-orange-600 dark:text-orange-500',
  },
  plaid: {
    label: 'Plaid',
    icon: '🔗',
    color: 'text-blue-600 dark:text-blue-500',
  },
  teller: {
    label: 'Teller',
    icon: '📡',
    color: 'text-emerald-600 dark:text-emerald-500',
  },
  zerion: {
    label: 'Zerion',
    icon: '🔐',
    color: 'text-purple-600 dark:text-purple-500',
  },
  stripe: {
    label: 'Stripe',
    icon: '💳',
    color: 'text-indigo-600 dark:text-indigo-500',
  },
};

/**
 * Get source label
 */
export function getSourceLabel(source?: string): string {
  if (!source) return 'Unknown';
  return sourceConfig[source]?.label || 'Unknown';
}

/**
 * Get source color
 */
export function getSourceColor(source?: string): string {
  if (!source) return '';
  return sourceConfig[source]?.color || '';
}

/**
 * Get source icon
 */
export function getSourceIcon(source?: string): string {
  if (!source) return '❓';
  return sourceConfig[source]?.icon || '❓';
}

/**
 * Account type display name (human-friendly)
 */
export const accountTypeDisplayNames: Record<string, string> = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  MONEY_MARKET: 'Money Market',
  CREDIT_CARD: 'Credit Card',
  CHARGE_CARD: 'Charge Card',
  SECURED_CREDIT_CARD: 'Secured Credit Card',
  BROKERAGE: 'Brokerage',
  STOCKS: 'Stocks',
  BONDS: 'Bonds',
  MUTUAL_FUND: 'Mutual Fund',
  ETF: 'ETF',
  '401K': '401(k)',
  IRA: 'IRA',
  ROTH_IRA: 'Roth IRA',
  INVESTMENT_ACCOUNT: 'Investment',
  HOME: 'Home',
  VEHICLE: 'Vehicle',
  CRYPTO_WALLET: 'Crypto Wallet',
  CRYPTO_EXCHANGE: 'Exchange',
  LOAN: 'Loan',
  MORTGAGE: 'Mortgage',
  AUTO_LOAN: 'Auto Loan',
  STUDENT_LOAN: 'Student Loan',
  PERSONAL_LOAN: 'Personal Loan',
};

/**
 * Get display name for account type
 */
export function getAccountTypeDisplayName(type: string): string {
  return accountTypeDisplayNames[type] || type;
}

/**
 * Status badge variant based on account state
 */
export function getStatusVariant(isActive: boolean): 'success' | 'subtle' | 'destructive' {
  return isActive ? 'success' : 'subtle';
}

/**
 * Format account number (mask sensitive data)
 */
export function formatAccountNumber(accountNumber?: string): string {
  if (!accountNumber || accountNumber.length < 4) {
    return accountNumber || '••••';
  }
  const lastFour = accountNumber.slice(-4);
  return `••• ${lastFour}`;
}

/**
 * Get logo URL for institution
 */
export function getInstitutionLogoUrl(institutionUrl?: string): string | undefined {
  return institutionUrl;
}

/**
 * Check if account is an asset
 */
export function isAssetAccount(category?: string): boolean {
  const assetCategories = ['CASH', 'INVESTMENTS', 'ASSETS', 'CRYPTO'];
  return category ? assetCategories.includes(category) : false;
}

/**
 * Check if account is a liability
 */
export function isLiabilityAccount(category?: string): boolean {
  const liabilityCategories = ['CREDIT', 'LIABILITIES', 'LOAN'];
  return category ? liabilityCategories.includes(category) : false;
}

/**
 * Account status descriptions
 */
export const statusDescriptions: Record<string, string> = {
  connected: 'Connected and syncing',
  syncing: 'Syncing transactions...',
  error: 'Sync error',
  disconnected: 'Not connected',
};

/**
 * Get status description
 */
export function getStatusDescription(status: string): string {
  return statusDescriptions[status] || status;
}

/**
 * Last sync display text
 */
export function getLastSyncText(lastSync?: string): string {
  if (!lastSync) return 'Never synced';

  const date = new Date(lastSync);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

/**
 * Determine if balance should be shown as asset or liability
 */
export function getBalanceDisplay(account: UnifiedAccount): {
  amount: number;
  isNegative: boolean;
} {
  const isLiability = isLiabilityAccount(account.category);
  return {
    amount: Math.abs(account.balance),
    isNegative: isLiability ? account.balance > 0 : account.balance < 0,
  };
}
