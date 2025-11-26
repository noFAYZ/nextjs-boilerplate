// Unified Accounts API Types based on ACCOUNTS_API.md

// Account Types
export type AccountType =
  | 'CHECKING'
  | 'SAVINGS'
  | 'CREDIT_CARD'
  | 'INVESTMENT'
  | 'LOAN'
  | 'MORTGAGE'
  | 'CRYPTO'
  | 'REAL_ESTATE'
  | 'VEHICLE'
  | 'OTHER_ASSET';

// Account Categories
export type AccountCategory = 'CASH' | 'CREDIT' | 'INVESTMENTS' | 'ASSETS' | 'LIABILITIES' | 'OTHER';

// Account Source
export type AccountSource = 'manual' | 'plaid' | 'teller' | 'zerion';

// Base Account Interface
export interface UnifiedAccount {
  id: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
  currency: string;
  isActive: boolean;
  source: AccountSource;
  institutionName?: string | null;
  accountNumber?: string | null;
  createdAt: string;
  updatedAt?: string;

  // NEW FIELDS - Account Subtypes and Categorization
  subtype?: string;
  groupId?: string | null;
  groupName?: string | null;
  customCategories?: Array<{
    id: string;
    name: string;
    priority: number; // 1=primary, 2=secondary
  }>;

  // Optional fields for different account types
  assetDescription?: string | null;
  originalValue?: number | null;
  purchaseDate?: string | null;
  appreciationRate?: number | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;

  // Enhanced metadata
  metadata?: {
    appreciationRate?: number;
    originalValue?: number;
    protocol?: string; // For DeFi
    stakedAmount?: number;
    linkedAssetId?: string;
    [key: string]: unknown;
  };
}

// Account Group by Category
export interface AccountCategoryGroup {
  category: AccountCategory;
  totalBalance: number;
  accountCount: number;
  accounts: UnifiedAccount[];
}

// Summary Statistics
export interface AccountsSummary {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  accountCount: number;
  currency: string;
  lastUpdated: string;
}

// Main Response Structure
export interface UnifiedAccountsResponse {
  summary: AccountsSummary;
  groups: {
    cash: AccountCategoryGroup;
    credit: AccountCategoryGroup;
    investments: AccountCategoryGroup;
    assets: AccountCategoryGroup;
    liabilities: AccountCategoryGroup;
    other: AccountCategoryGroup;
  };
}

// Performance Data Types
export interface PerformancePeriod {
  startValue: number;
  endValue: number;
  change: number;
  changePercent: number;
  startDate: string;
  endDate: string;
}

export interface ChartDataPoint {
  date: string;
  balance: number;
  change: number;
  changePercent: number;
}

export interface AccountPerformance {
  periods: {
    '1D': PerformancePeriod;
    '1W': PerformancePeriod;
    '1M': PerformancePeriod;
    '3M': PerformancePeriod;
    '6M': PerformancePeriod;
    'YTD': PerformancePeriod;
    '1Y': PerformancePeriod;
    'ALL': PerformancePeriod;
  };
  chartData: ChartDataPoint[];
  currentBalance: number;
  allTimeHigh: number;
  allTimeLow: number;
  averageBalance: number;
}

export interface TransactionStats {
  totalTransactions: number;
  lastTransactionDate?: string | null;
  averageMonthlySpending?: number | null;
  largestTransaction?: number | null;
}

// Account Details Response
export interface UnifiedAccountDetails extends UnifiedAccount {
  performance?: AccountPerformance;
  transactionStats?: TransactionStats;
  valuationHistory?: unknown[];
}

// Request Types
export interface CreateManualAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institutionName?: string;
  accountNumber?: string;
  groupId?: string;

  // NEW FIELDS
  subtype?: string; // Fine-grained account classification
  customCategoryIds?: string[]; // Map to custom categories

  // For asset accounts
  assetDescription?: string;
  originalValue?: number;
  purchaseDate?: string;
  appreciationRate?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateAccountRequest {
  name?: string;
  balance?: number;
  isActive?: boolean;
  institutionName?: string;

  // NEW FIELDS
  subtype?: string;
  customCategoryIds?: string[];
  groupId?: string | null;
}
