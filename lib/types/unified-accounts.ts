// Unified Accounts API Types based on ACCOUNTS_API.md
// Now uses comprehensive account type system from banking.ts

import { AccountType, AccountCategory, IntegrationProvider } from './banking';

// Account Source - maps to IntegrationProvider
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
  // Enhanced fields matching Account-details.md schema
  lastSyncAt?: string | null;
  provider?: IntegrationProvider | null;
  providerAccountId?: string | null;
  icon?: string;
  color?: string;
  notes?: string | null;

  // Asset depreciation/appreciation
  depreciationMethod?: string | null;
  depreciationRate?: number | null;
  usefulLifeYears?: number | null;

  // Liability details
  linkedLiabilityId?: string | null;
  hasLiability?: boolean | null;

  // Bank account balance details
  availableBalance?: number | null;
  ledgerBalance?: number | null;

  // Bank-specific metadata
  banking?: {
    tellerAccountId?: string | null;
    tellerType?: string | null;
    tellerSubtype?: string | null;
    tellerLastFour?: string | null;
    tellerStatus?: string | null;
    lastTellerSync?: string | null;
    tellerSyncStatus?: string | null;
    plaidAccountId?: string | null;
    plaidMask?: string | null;
    lastPlaidSync?: string | null;
    plaidSyncStatus?: string | null;
    enrollment?: {
      id: string;
      institutionName?: string | null;
      institutionMetadata?: unknown;
      enrollmentId?: string | null;
    } | null;
    transactionCount?: number;
  } | null;

  // Performance data
  performance?: AccountPerformance;

  // Transaction statistics
  transactionStats?: TransactionStats;

  // Valuation history
  valuationHistory?: Array<{
    id: string;
    accountId: string;
    value: number;
    valuationDate: string;
    valuationType: string;
    source: string;
    createdAt: string;
    updatedAt: string;
  }> | null;

  // Enhanced metadata
  metadata?: {
    // For crypto
    network?: string | null;
    address?: string | null;
    walletType?: string | null;
    assetCount?: number | null;
    nftCount?: number | null;

    // For assets
    location?: string | null;
    protocol?: string | null;
    stakedAmount?: number | null;
    rewardsRate?: number | null;

    // For liabilities
    interestRate?: number | null;
    minimumPayment?: number | null;
    dueDate?: string | null;
    linkedAssetId?: string | null;

    [key: string]: unknown;
  } | null;
}

// Request Types
export interface CreateManualAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountSource: 'MANUAL' | 'LINKED'; // Required: specifies if manual or linked account
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

// ========================================================
// TRANSACTION CATEGORY TYPES (from CATEGORIES.md)
// ========================================================

// Transaction Category within a group
export interface TransactionCategory {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  icon?: string;                    // Icon identifier
  color?: string;                   // Hex color for UI
  emoji?: string;                   // Unicode emoji
  parentCategoryId?: string;
  sortOrder: number;
  isActive: boolean;
  isExpanded?: boolean;
  transactionCount: number;
  monthlySpending?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category Group for organizing categories (for envelope budgeting)
export interface TransactionCategoryGroup {
  id: string;
  userId: string;
  organizationId?: string | null;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  parentGroupId?: string | null;
  sortOrder: number;
  isDefault: boolean;
  isExpanded: boolean;
  categories?: TransactionCategory[];    // When includeCategories=true
  children?: TransactionCategoryGroup[]; // For hierarchy
  createdAt: Date;
  updatedAt: Date;
}

// Response for fetching category groups with categories
export interface CategoryGroupsResponse {
  success: boolean;
  data: TransactionCategoryGroup[];
}

// Flat categories response
export interface CategoriesResponse {
  success: boolean;
  data: TransactionCategory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Legacy account category type (keeping for backwards compatibility)
export interface CustomAccountCategory {
  id: string;
  organizationId?: string | null;
  userId: string;

  // Category Definition
  name: string;                    // e.g., "Real Estate Portfolio"
  slug: string;                    // URL-friendly: "real-estate-portfolio"
  description?: string | null;
  color?: string | null;           // Hex color for UI
  icon?: string | null;            // Icon identifier

  // Hierarchy Support
  parentId?: string | null;        // Parent category (self-referencing)
  depth: number;                   // Cached depth level (1, 2, 3, etc.)
  path: string;                    // Path-based: "assets/realestate/rental"

  // Configuration
  appliedToTypes: string[];        // Which account types this applies to
  isDefault: boolean;              // System-defined vs user-created
  sortOrder: number;

  // Relations
  children?: CustomAccountCategory[];
  parent?: CustomAccountCategory;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ========================================================
// TRANSACTION TYPES
// ========================================================
export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  organizationId: string | null;
  amount: number;
  description: string;
  date: string; // ISO 8601 format
  pending: boolean;

  // Category info
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;

  // Provider info
  provider: string | null; // e.g., "MANUAL", "TELLER", "PLAID"
  providerTransactionId: string | null;
  plaidTransactionId: string | null;

  // Manual transaction fields
  merchantName: string | null;
  notes?: string | null;

  // Bank transaction fields (from Teller/Plaid)
  tellerTransactionId?: string;
  status?: string; // "POSTED", "PENDING"
  processingStatus?: string; // "COMPLETE", "PENDING"
  type?: string; // "card_payment", "check", etc.
  runningBalance?: number | null;
  counterpartyName?: string | null;
  counterpartyType?: string | null;
  merchantCategory?: string | null;
  merchantLocation?: string | null;
  categoryConfidence?: number | null; // 0.00 to 1.00

  // Denormalized fields
  accountTellerType?: string | null;
  isDebit?: boolean | null;
  absoluteAmount?: number | null;
  transactionMonth?: string | null;
  dayOfWeek?: number | null; // 0=Sun to 6=Sat

  // Account relation data
  account?: {
    name: string;
    institutionName: string | null;
  };

  createdAt: string;
  updatedAt: string;
}

export interface TransactionSplit {
  customCategoryId: string; // Required - must reference existing category
  amount: number; // Required (must be > 0)
  description?: string; // Optional
  tags?: string[]; // Optional metadata
}

export interface AddTransactionRequest {
  // Required fields
  amount: number; // Required - always positive (>0)
  description: string; // Required
  date: string; // Required - ISO 8601 format (e.g., "2025-11-21")

  // Transaction direction
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER'; // Default: "EXPENSE"

  // Optional fields
  categoryId?: string; // Link to existing category (must exist!)
  merchantId?: string; // Link to existing merchant (must exist!)
  pending?: boolean; // Default: false
  notes?: string;
  provider?: string; // "TELLER", "PLAID", etc.
  providerTransactionId?: string;

  // NEW: Optional splits
  splits?: TransactionSplit[];

  // Validation
  ensureTotalMatches?: boolean; // Validate splits sum (default: true)
}

export interface GetAccountTransactionsParams {
  page?: number; // Default: 1
  limit?: number; // Default: 50, max: 1000
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  category?: string; // Category ID or name
  type?: string; // Transaction type filter
  sortBy?: 'date' | 'amount'; // Default: date
  sortOrder?: 'asc' | 'desc'; // Default: desc
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AccountTransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: TransactionPagination;
  timestamp: string;
}


// ========================================================
// COMPLETE HUMAN-FRIENDLY DISPLAY LABELS FOR ALL TYPES
// ========================================================
export const DISPLAY_NAME_MAP: Record<AccountType, string> = {
  // ------------------------------------------------------
  // CASH ACCOUNTS
  // ------------------------------------------------------
  [AccountType.CHECKING]: "Checking Account",
  [AccountType.SAVINGS]: "Savings Account",
  [AccountType.HIGH_YIELD_SAVINGS]: "High-Yield Savings",
  [AccountType.MONEY_MARKET]: "Money Market Account",
  [AccountType.CERTIFICATE_OF_DEPOSIT]: "Certificate of Deposit (CD)",
  [AccountType.CASH_MANAGEMENT]: "Cash Management Account",
  [AccountType.PREPAID_CARD]: "Prepaid Card",
  [AccountType.FOREIGN_CURRENCY_ACCOUNT]: "Foreign Currency Account",
  [AccountType.DIGITAL_WALLET]: "Digital Wallet",
  [AccountType.MOBILE_WALLET]: "Mobile Wallet",
  [AccountType.PAYMENT_PROCESSOR_BALANCE]: "Payment Processor Balance",
  [AccountType.CASH_ON_HAND]: "Cash on Hand",
  [AccountType.PETTY_CASH]: "Petty Cash",
  [AccountType.ESCROW_ACCOUNT]: "Escrow Account",

  // ------------------------------------------------------
  // INVESTMENT ACCOUNTS
  // ------------------------------------------------------
  [AccountType.BROKERAGE_ACCOUNT]: "Brokerage Account",
  [AccountType.RETIREMENT_401K]: "401(k) Retirement Account",
  [AccountType.RETIREMENT_403B]: "403(b) Retirement Account",
  [AccountType.RETIREMENT_457B]: "457(b) Retirement Account",
  [AccountType.RETIREMENT_IRA_TRADITIONAL]: "Traditional IRA",
  [AccountType.RETIREMENT_IRA_ROTH]: "Roth IRA",
  [AccountType.RETIREMENT_IRA_SEP]: "SEP IRA",
  [AccountType.RETIREMENT_IRA_SIMPLE]: "SIMPLE IRA",
  [AccountType.PENSION]: "Pension",
  [AccountType.ANNUITY]: "Annuity",
  [AccountType.EDUCATION_529_PLAN]: "Education 529 Plan",
  [AccountType.MUTUAL_FUNDS]: "Mutual Funds",
  [AccountType.ETF]: "Exchange-Traded Fund (ETF)",
  [AccountType.STOCKS]: "Stocks",
  [AccountType.BONDS]: "Bonds",
  [AccountType.TREASURY_SECURITIES]: "Treasury Securities",
  [AccountType.PRIVATE_EQUITY]: "Private Equity",
  [AccountType.HEDGE_FUND]: "Hedge Fund",
  [AccountType.COMMODITIES]: "Commodities",
  [AccountType.REITS]: "Real Estate Investment Trust (REIT)",
  [AccountType.FOREX]: "Foreign Exchange (Forex)",
  [AccountType.CROWDFUNDING_INVESTMENTS]: "Crowdfunding Investments",
  [AccountType.STRUCTURED_PRODUCTS]: "Structured Products",

  // ------------------------------------------------------
  // REAL ESTATE
  // ------------------------------------------------------
  [AccountType.PRIMARY_RESIDENCE]: "Primary Residence",
  [AccountType.INVESTMENT_PROPERTY]: "Investment Property",
  [AccountType.VACATION_HOME]: "Vacation Home",
  [AccountType.RENTAL_PROPERTY]: "Rental Property",
  [AccountType.TIMESHARE]: "Timeshare",
  [AccountType.LAND]: "Land",
  [AccountType.COMMERCIAL_PROPERTY]: "Commercial Property",
  [AccountType.INDUSTRIAL_PROPERTY]: "Industrial Property",
  [AccountType.DEVELOPMENT_LAND]: "Development Land",

  // ------------------------------------------------------
  // VEHICLES
  // ------------------------------------------------------
  [AccountType.CAR]: "Car",
  [AccountType.TRUCK]: "Truck",
  [AccountType.MOTORCYCLE]: "Motorcycle",
  [AccountType.RV]: "Recreational Vehicle (RV)",
  [AccountType.BOAT]: "Boat",
  [AccountType.AIRCRAFT]: "Aircraft",
  [AccountType.BICYCLE]: "Bicycle",
  [AccountType.ELECTRIC_VEHICLE]: "Electric Vehicle (EV)",
  [AccountType.LUXURY_VEHICLE]: "Luxury Vehicle",
  [AccountType.CLASSIC_CAR]: "Classic Car",
  [AccountType.COMMERCIAL_VEHICLE]: "Commercial Vehicle",
  [AccountType.ATV]: "All-Terrain Vehicle (ATV)",
  [AccountType.SCOOTER]: "Scooter",

  // ------------------------------------------------------
  // VALUABLES
  // ------------------------------------------------------
  [AccountType.JEWELRY]: "Jewelry",
  [AccountType.FINE_ART]: "Fine Art",
  [AccountType.COLLECTIBLES]: "Collectibles",
  [AccountType.ANTIQUES]: "Antiques",
  [AccountType.WATCHES]: "Watches",
  [AccountType.PRECIOUS_METALS]: "Precious Metals",
  [AccountType.GEMSTONES]: "Gemstones",
  [AccountType.FIREARMS]: "Firearms",
  [AccountType.MEMORABILIA]: "Memorabilia",
  [AccountType.WINE_COLLECTION]: "Wine Collection",
  [AccountType.SPORTS_EQUIPMENT]: "Sports Equipment",

  // ------------------------------------------------------
  // CRYPTO
  // ------------------------------------------------------
  [AccountType.CRYPTO_WALLET_HOT]: "Hot Crypto Wallet",
  [AccountType.CRYPTO_WALLET_COLD]: "Cold Crypto Wallet",
  [AccountType.CRYPTO_EXCHANGE_ACCOUNT]: "Crypto Exchange Account",
  [AccountType.DEFI_PROTOCOL_POSITION]: "DeFi Protocol Position",
  [AccountType.STAKING_ACCOUNT]: "Staking Account",
  [AccountType.MINING_POOL_ACCOUNT]: "Mining Pool Account",
  [AccountType.NFT_COLLECTION]: "NFT Collection",
  [AccountType.WRAPPED_ASSET_ACCOUNT]: "Wrapped Asset Account",
  [AccountType.MULTI_SIG_WALLET]: "Multi-Sig Crypto Wallet",

  // ------------------------------------------------------
  // OTHER ASSETS
  // ------------------------------------------------------
  [AccountType.BUSINESS_OWNERSHIP]: "Business Ownership",
  [AccountType.PARTNERSHIP_INTEREST]: "Partnership Interest",
  [AccountType.STOCK_OPTIONS]: "Stock Options",
  [AccountType.RESTRICTED_STOCK]: "Restricted Stock",
  [AccountType.PATENTS_IP]: "Patents / Intellectual Property",
  [AccountType.ACCOUNTS_RECEIVABLE]: "Accounts Receivable",
  [AccountType.NOTES_RECEIVABLE]: "Notes Receivable",
  [AccountType.LIFE_INSURANCE_VALUE]: "Life Insurance Cash Value",
  [AccountType.EMPLOYEE_STOCK_PURCHASE]: "Employee Stock Purchase Plan (ESPP)",
  [AccountType.ROYALTY_INTEREST]: "Royalty Interest",
  [AccountType.TIMBER_RIGHTS]: "Timber Rights",
  [AccountType.MINERAL_RIGHTS]: "Mineral Rights",

  // ------------------------------------------------------
  // CREDIT CARDS
  // ------------------------------------------------------
  [AccountType.PERSONAL_CREDIT_CARD]: "Personal Credit Card",
  [AccountType.BUSINESS_CREDIT_CARD]: "Business Credit Card",
  [AccountType.SECURED_CREDIT_CARD]: "Secured Credit Card",
  [AccountType.STORE_CREDIT_CARD]: "Store Credit Card",
  [AccountType.GAS_CREDIT_CARD]: "Gas Credit Card",
  [AccountType.CHARGE_CARD]: "Charge Card",
  [AccountType.PREPAID_CREDIT_CARD]: "Prepaid Credit Card",

  // ------------------------------------------------------
  // MORTGAGE
  // ------------------------------------------------------
  [AccountType.MORTGAGE_PRIMARY]: "Primary Residence Mortgage",
  [AccountType.MORTGAGE_SECOND_HOME]: "Second Home Mortgage",
  [AccountType.MORTGAGE_RENTAL]: "Rental Property Mortgage",
  [AccountType.HOME_EQUITY_LINE]: "Home Equity Line of Credit (HELOC)",
  [AccountType.HOME_EQUITY_LOAN]: "Home Equity Loan",
  [AccountType.CONSTRUCTION_LOAN]: "Construction Loan",
  [AccountType.BRIDGE_LOAN]: "Bridge Loan",

  // ------------------------------------------------------
  // LOAN
  // ------------------------------------------------------
  [AccountType.PERSONAL_LOAN]: "Personal Loan",
  [AccountType.BUSINESS_LOAN]: "Business Loan",
  [AccountType.STUDENT_LOAN]: "Student Loan",
  [AccountType.AUTO_LOAN]: "Auto Loan",
  [AccountType.BOAT_LOAN]: "Boat Loan",
  [AccountType.RV_LOAN]: "RV Loan",
  [AccountType.CONSOLIDATED_LOAN]: "Debt Consolidation Loan",
  [AccountType.PAYDAY_LOAN]: "Payday Loan",
  [AccountType.PEER_TO_PEER_LOAN]: "Peer-to-Peer Loan",
  [AccountType.MICROLOAN]: "Microloan",

  // ------------------------------------------------------
  // OTHER LIABILITIES
  // ------------------------------------------------------
  [AccountType.ACCOUNT_PAYABLE]: "Accounts Payable",
  [AccountType.ACCRUED_EXPENSE]: "Accrued Expense",
  [AccountType.TAX_PAYABLE]: "Tax Payable",
  [AccountType.PENSION_LIABILITY]: "Pension Liability",
  [AccountType.DEFERRED_REVENUE]: "Deferred Revenue",
  [AccountType.WARRANTIES_LIABILITY]: "Warranty Liability",
  [AccountType.LEGAL_SETTLEMENT]: "Legal Settlement",
  [AccountType.BUSINESS_PAYABLE]: "Business Payable",
  [AccountType.LEASE_LIABILITY]: "Lease Liability",
  [AccountType.CONTINGENT_LIABILITY]: "Contingent Liability",

  // ------------------------------------------------------
  // DEPRECATED (KEEPING HUMAN-READABLE)
  // ------------------------------------------------------
  [AccountType.CREDIT_CARD]: "Credit Card (Legacy)",
  [AccountType.INVESTMENT]: "Investment (Legacy)",
  [AccountType.LOAN_LEGACY]: "Loan (Legacy)",
  [AccountType.MORTGAGE_LEGACY]: "Mortgage (Legacy)",
  [AccountType.CRYPTO_LEGACY]: "Crypto (Legacy)",
  [AccountType.REAL_ESTATE_LEGACY]: "Real Estate (Legacy)",
  [AccountType.VEHICLE_LEGACY]: "Vehicle (Legacy)",
  [AccountType.OTHER_ASSET_LEGACY]: "Other Asset (Legacy)",
};
function formatEnumKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getAccountTypeDisplayName(type: AccountType): string {
  return DISPLAY_NAME_MAP[type] || formatEnumKey(type);
}