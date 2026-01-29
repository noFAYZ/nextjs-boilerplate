// Banking Types - Following the same patterns as crypto.ts

// ============================================================================
// NEW: Account Type System (128+ types across 13 categories)
// ============================================================================

/**
 * Comprehensive account type enumeration
 * 128+ types organized by category
 */
export enum AccountType {
  // CASH ACCOUNTS (14 types)
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  HIGH_YIELD_SAVINGS = 'HIGH_YIELD_SAVINGS',
  MONEY_MARKET = 'MONEY_MARKET',
  CERTIFICATE_OF_DEPOSIT = 'CERTIFICATE_OF_DEPOSIT',
  CASH_MANAGEMENT = 'CASH_MANAGEMENT',
  PREPAID_CARD = 'PREPAID_CARD',
  FOREIGN_CURRENCY_ACCOUNT = 'FOREIGN_CURRENCY_ACCOUNT',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  MOBILE_WALLET = 'MOBILE_WALLET',
  PAYMENT_PROCESSOR_BALANCE = 'PAYMENT_PROCESSOR_BALANCE',
  CASH_ON_HAND = 'CASH_ON_HAND',
  PETTY_CASH = 'PETTY_CASH',
  ESCROW_ACCOUNT = 'ESCROW_ACCOUNT',

  // INVESTMENT ACCOUNTS (23 types)
  BROKERAGE_ACCOUNT = 'BROKERAGE_ACCOUNT',
  RETIREMENT_401K = 'RETIREMENT_401K',
  RETIREMENT_403B = 'RETIREMENT_403B',
  RETIREMENT_457B = 'RETIREMENT_457B',
  RETIREMENT_IRA_TRADITIONAL = 'RETIREMENT_IRA_TRADITIONAL',
  RETIREMENT_IRA_ROTH = 'RETIREMENT_IRA_ROTH',
  RETIREMENT_IRA_SEP = 'RETIREMENT_IRA_SEP',
  RETIREMENT_IRA_SIMPLE = 'RETIREMENT_IRA_SIMPLE',
  PENSION = 'PENSION',
  ANNUITY = 'ANNUITY',
  EDUCATION_529_PLAN = 'EDUCATION_529_PLAN',
  MUTUAL_FUNDS = 'MUTUAL_FUNDS',
  ETF = 'ETF',
  STOCKS = 'STOCKS',
  BONDS = 'BONDS',
  TREASURY_SECURITIES = 'TREASURY_SECURITIES',
  PRIVATE_EQUITY = 'PRIVATE_EQUITY',
  HEDGE_FUND = 'HEDGE_FUND',
  COMMODITIES = 'COMMODITIES',
  REITS = 'REITS',
  FOREX = 'FOREX',
  CROWDFUNDING_INVESTMENTS = 'CROWDFUNDING_INVESTMENTS',
  STRUCTURED_PRODUCTS = 'STRUCTURED_PRODUCTS',

  // REAL ESTATE (9 types)
  PRIMARY_RESIDENCE = 'PRIMARY_RESIDENCE',
  INVESTMENT_PROPERTY = 'INVESTMENT_PROPERTY',
  VACATION_HOME = 'VACATION_HOME',
  RENTAL_PROPERTY = 'RENTAL_PROPERTY',
  TIMESHARE = 'TIMESHARE',
  LAND = 'LAND',
  COMMERCIAL_PROPERTY = 'COMMERCIAL_PROPERTY',
  INDUSTRIAL_PROPERTY = 'INDUSTRIAL_PROPERTY',
  DEVELOPMENT_LAND = 'DEVELOPMENT_LAND',

  // VEHICLE (13 types)
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  RV = 'RV',
  BOAT = 'BOAT',
  AIRCRAFT = 'AIRCRAFT',
  BICYCLE = 'BICYCLE',
  ELECTRIC_VEHICLE = 'ELECTRIC_VEHICLE',
  LUXURY_VEHICLE = 'LUXURY_VEHICLE',
  CLASSIC_CAR = 'CLASSIC_CAR',
  COMMERCIAL_VEHICLE = 'COMMERCIAL_VEHICLE',
  ATV = 'ATV',
  SCOOTER = 'SCOOTER',

  // VALUABLES (11 types)
  JEWELRY = 'JEWELRY',
  FINE_ART = 'FINE_ART',
  COLLECTIBLES = 'COLLECTIBLES',
  ANTIQUES = 'ANTIQUES',
  WATCHES = 'WATCHES',
  PRECIOUS_METALS = 'PRECIOUS_METALS',
  GEMSTONES = 'GEMSTONES',
  FIREARMS = 'FIREARMS',
  MEMORABILIA = 'MEMORABILIA',
  WINE_COLLECTION = 'WINE_COLLECTION',
  SPORTS_EQUIPMENT = 'SPORTS_EQUIPMENT',

  // CRYPTO (9 types)
  CRYPTO_WALLET_HOT = 'CRYPTO_WALLET_HOT',
  CRYPTO_WALLET_COLD = 'CRYPTO_WALLET_COLD',
  CRYPTO_EXCHANGE_ACCOUNT = 'CRYPTO_EXCHANGE_ACCOUNT',
  DEFI_PROTOCOL_POSITION = 'DEFI_PROTOCOL_POSITION',
  STAKING_ACCOUNT = 'STAKING_ACCOUNT',
  MINING_POOL_ACCOUNT = 'MINING_POOL_ACCOUNT',
  NFT_COLLECTION = 'NFT_COLLECTION',
  WRAPPED_ASSET_ACCOUNT = 'WRAPPED_ASSET_ACCOUNT',
  MULTI_SIG_WALLET = 'MULTI_SIG_WALLET',

  // OTHER ASSETS (12 types)
  BUSINESS_OWNERSHIP = 'BUSINESS_OWNERSHIP',
  PARTNERSHIP_INTEREST = 'PARTNERSHIP_INTEREST',
  STOCK_OPTIONS = 'STOCK_OPTIONS',
  RESTRICTED_STOCK = 'RESTRICTED_STOCK',
  PATENTS_IP = 'PATENTS_IP',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  NOTES_RECEIVABLE = 'NOTES_RECEIVABLE',
  LIFE_INSURANCE_VALUE = 'LIFE_INSURANCE_VALUE',
  EMPLOYEE_STOCK_PURCHASE = 'EMPLOYEE_STOCK_PURCHASE',
  ROYALTY_INTEREST = 'ROYALTY_INTEREST',
  TIMBER_RIGHTS = 'TIMBER_RIGHTS',
  MINERAL_RIGHTS = 'MINERAL_RIGHTS',

  // CREDIT CARD (7 types)
  PERSONAL_CREDIT_CARD = 'PERSONAL_CREDIT_CARD',
  BUSINESS_CREDIT_CARD = 'BUSINESS_CREDIT_CARD',
  SECURED_CREDIT_CARD = 'SECURED_CREDIT_CARD',
  STORE_CREDIT_CARD = 'STORE_CREDIT_CARD',
  GAS_CREDIT_CARD = 'GAS_CREDIT_CARD',
  CHARGE_CARD = 'CHARGE_CARD',
  PREPAID_CREDIT_CARD = 'PREPAID_CREDIT_CARD',

  // MORTGAGE (7 types)
  MORTGAGE_PRIMARY = 'MORTGAGE_PRIMARY',
  MORTGAGE_SECOND_HOME = 'MORTGAGE_SECOND_HOME',
  MORTGAGE_RENTAL = 'MORTGAGE_RENTAL',
  HOME_EQUITY_LINE = 'HOME_EQUITY_LINE',
  HOME_EQUITY_LOAN = 'HOME_EQUITY_LOAN',
  CONSTRUCTION_LOAN = 'CONSTRUCTION_LOAN',
  BRIDGE_LOAN = 'BRIDGE_LOAN',

  // LOAN (10 types)
  PERSONAL_LOAN = 'PERSONAL_LOAN',
  BUSINESS_LOAN = 'BUSINESS_LOAN',
  STUDENT_LOAN = 'STUDENT_LOAN',
  AUTO_LOAN = 'AUTO_LOAN',
  BOAT_LOAN = 'BOAT_LOAN',
  RV_LOAN = 'RV_LOAN',
  CONSOLIDATED_LOAN = 'CONSOLIDATED_LOAN',
  PAYDAY_LOAN = 'PAYDAY_LOAN',
  PEER_TO_PEER_LOAN = 'PEER_TO_PEER_LOAN',
  MICROLOAN = 'MICROLOAN',

  // OTHER LIABILITY (10 types)
  ACCOUNT_PAYABLE = 'ACCOUNT_PAYABLE',
  ACCRUED_EXPENSE = 'ACCRUED_EXPENSE',
  TAX_PAYABLE = 'TAX_PAYABLE',
  PENSION_LIABILITY = 'PENSION_LIABILITY',
  DEFERRED_REVENUE = 'DEFERRED_REVENUE',
  WARRANTIES_LIABILITY = 'WARRANTIES_LIABILITY',
  LEGAL_SETTLEMENT = 'LEGAL_SETTLEMENT',
  BUSINESS_PAYABLE = 'BUSINESS_PAYABLE',
  LEASE_LIABILITY = 'LEASE_LIABILITY',
  CONTINGENT_LIABILITY = 'CONTINGENT_LIABILITY',

  // DEPRECATED - Legacy types (kept for backward compatibility)
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN_LEGACY = 'LOAN',
  MORTGAGE_LEGACY = 'MORTGAGE',
  CRYPTO_LEGACY = 'CRYPTO',
  REAL_ESTATE_LEGACY = 'REAL_ESTATE',
  VEHICLE_LEGACY = 'VEHICLE',
  OTHER_ASSET_LEGACY = 'OTHER_ASSET',
}

/**
 * Account categories - 13 hierarchical categories
 */
export enum AccountCategory {
  // Asset Categories
  ASSETS = 'ASSETS',
  CASH = 'CASH',
  INVESTMENTS = 'INVESTMENTS',
  REAL_ESTATE = 'REAL_ESTATE',
  VEHICLE = 'VEHICLE',
  VALUABLES = 'VALUABLES',
  CRYPTO = 'CRYPTO',
  OTHER_ASSET = 'OTHER_ASSET',

  // Liability Categories
  LIABILITIES = 'LIABILITIES',
  CREDIT_CARD = 'CREDIT_CARD',
  MORTGAGE = 'MORTGAGE',
  LOAN = 'LOAN',
  OTHER_LIABILITY = 'OTHER_LIABILITY',

  // Legacy
  CREDIT = 'CREDIT',
  OTHER = 'OTHER',
}

/**
 * Integration provider types
 */
export enum IntegrationProvider {
  TELLER = 'TELLER',
  PLAID = 'PLAID',
  STRIPE = 'STRIPE',
  MANUAL = 'MANUAL',
}

// Backward compatibility alias
export type BankAccountType = AccountType | string;
export type BankingSyncStatus = 'connected' | 'syncing' | 'error' | 'disconnected';
export type TellerEnrollmentStatus = 'active' | 'expired' | 'error';

/**
 * Bank Account - Enhanced with new account type system
 */
export interface BankAccount {
  // Primary identifiers
  id: string;
  userId: string;
  organizationId?: string;

  // Core Account Information
  name: string;
  type: AccountType | BankAccountType;  // New enum-based type
  category?: AccountCategory;            // Automatically enriched
  displayName?: string;                  // Human-readable (enriched)
  icon?: string;                         // Emoji icon (enriched)
  isAsset?: boolean;                     // Determined by type (enriched)
  isLiability?: boolean;                 // Determined by type (enriched)
  subtype?: string;                      // Optional sub-classification

  // Financial Information
  balance: number;
  currency: string;
  institutionName?: string;
  accountNumber?: string;
  ledgerBalance?: string;
  availableBalance?: string;

  // Provider & Integration Information
  provider?: IntegrationProvider | string;  // TELLER, PLAID, STRIPE, MANUAL
  tellerAccountId?: string;
  tellerEnrollmentId?: string;
  tellerInstitutionId?: string;
  tellerInstitutionData?: Record<string, unknown>;
  tellerRawData?: Record<string, unknown>;
  plaidAccountId?: string;
  plaidMetadata?: Record<string, unknown>;
  stripeAccountId?: string;

  // Status & Sync Information
  isActive: boolean;
  syncStatus: BankingSyncStatus;
  lastTellerSync?: string;
  lastPlaidSync?: string;
  plaidSyncStatus?: string;

  // Custom Organization & Grouping
  groupId?: string;
  groupName?: string;
  customCategories?: Array<{
    id: string;
    name: string;
    priority: number; // 1=primary, 2=secondary
  }>;

  // Relationships & Metadata
  createdAt: string;
  updatedAt: string;
  tellerEnrollment?: TellerEnrollment;
  _count?: {
    bankTransactions: number;
  };
}

/**
 * Create Bank Account Request - for manual account creation
 */
export interface CreateBankAccountRequest {
  // For Teller/Plaid OAuth flow
  enrollment?: {
    accessToken: string;
    enrollment: {
      id: string;
      institution: {
        id: string;
        name: string;
      };
    };
  };

  // For manual account creation
  name?: string;
  type?: AccountType | string;
  subtype?: string;
  balance?: number;
  currency?: string;
  institutionName?: string;
  accountNumber?: string;
  provider?: IntegrationProvider | string;
}

/**
 * Update Bank Account Request
 */
export interface UpdateBankAccountRequest {
  name?: string;
  type?: AccountType | string;
  subtype?: string;
  isActive?: boolean;
  balance?: number;
  currency?: string;
  institutionName?: string;
  accountNumber?: string;
  groupId?: string | null;
  customCategoryIds?: string[];
}

// Bank Transaction Types
export type BankTransactionType = 'debit' | 'credit';
export type BankTransactionStatus = 'pending' | 'posted';
export type BankTransactionProcessingStatus = 'pending' | 'complete';

// Teller Transaction Enums
export enum TellerTransactionCategory {
  Accommodation = "accommodation",
  Advertising = "advertising",
  Bar = "bar",
  Charity = "charity",
  Clothing = "clothing",
  Dining = "dining",
  Education = "education",
  Electronics = "electronics",
  Entertainment = "entertainment",
  Fuel = "fuel",
  General = "general",
  Groceries = "groceries",
  Health = "health",
  Home = "home",
  Income = "income",
  Insurance = "insurance",
  Investment = "investment",
  Loan = "loan",
  Office = "office",
  Phone = "phone",
  Service = "service",
  Shopping = "shopping",
  Software = "software",
  Sport = "sport",
  Tax = "tax",
  Transport = "transport",
  Transportation = "transportation",
  Utilities = "utilities",
}

export type CounterpartyType = "organization" | "person";

export interface TransactionCounterparty {
  name?: string | null;
  type?: CounterpartyType | null;
}

export interface TransactionDetails {
  [key: string]: unknown;
}

export interface TransactionLinks {
  self: string;
  account: string;
}

// Teller Transaction Response
export interface TellerTransaction {
  id: string;
  account_id: string;
  amount: string;
  date: string;
  description: string;
  details: TransactionDetails;
  processing_status: BankTransactionProcessingStatus;
  category?: TellerTransactionCategory | null;
  counterparty?: TransactionCounterparty;
  status: BankTransactionStatus;
  links: TransactionLinks;
  running_balance?: string | null;
  type: string;
}

// Internal Bank Transaction Type
export interface BankTransaction {
  id: string;
  userId: string;
  accountId: string;
  tellerTransactionId: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  status: BankTransactionStatus;
  type: BankTransactionType;
  merchantName?: string;
  counterpartyName?: string;
  counterpartyType?: CounterpartyType;
  processingStatus?: BankTransactionProcessingStatus;
  runningBalance?: number;
  tellerType?: string;
  tellerRawData?: TellerTransaction;
  createdAt: string;
  updatedAt: string;
  account: {
    name: string;
    institutionName: string;
  };
}

export interface BankTransactionParams {
  page?: number;
  limit?: number;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: BankTransactionType;
}

// Teller Enrollment Types
export interface TellerEnrollment {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  enrollmentId: string;
  status: TellerEnrollmentStatus;
  expiresAt?: string;
  lastSyncAt?: string;
  totalLedgerBalance?: string;
  totalAvailableBalance?: string;
  lastBalanceUpdate?: string;
  createdAt: string;
  updatedAt: string;
}

// Banking Overview Types
export interface BankingOverview {
  totalAccounts: number;
  totalBalance: number;
  accountsByType: Record<string, number>;
  recentTransactions: BankTransaction[];
  lastSyncAt: string | null;
}

// Sync Types
export type BankSyncType = 'full' | 'incremental' | 'transactions_only';
export type BankSyncJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface BankSyncRequest {
  fullSync?: boolean;
}

export interface BankSyncJob {
  id: string;
  userId: string;
  accountId?: string;
  jobId: string;
  status: BankSyncJobStatus;
  progress: number;
  message?: string;
  errorMessage?: string;
  syncType: BankSyncType;
  startedAt?: string;
  completedAt?: string;
  syncedData?: string[];
  createdAt: string;
  updatedAt: string;
}

// Teller Connect Types
export interface TellerConnectEnrollment {
  accessToken: string;
  enrollment: {
    id: string;
    institution: {
      id: string;
      name: string;
    };
  };
}

export interface TellerConnectConfig {
  applicationId: string;
  environment: 'sandbox' | 'production';
  onSuccess: (enrollment: TellerConnectEnrollment) => void;
  onExit: () => void;
  onEvent?: (event: unknown) => void;
}

// Banking Service Health Types
export interface BankingHealthCheck {
  status: 'OK' | 'ERROR';
  timestamp: string;
  checks: {
    teller: 'connected' | 'disconnected';
    circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    requestCount: number;
    uptime: number;
  };
  error?: string;
}

// Real-time Sync Event Types (based on BANKING_API_DOCUMENTATION.md)
export type BankingSyncEventType =
  | 'connection_established'
  | 'syncing_bank'
  | 'syncing_transactions_bank'
  | 'completed_bank'
  | 'failed_bank'
  | 'heartbeat';

// Connection Established Event
export interface BankingConnectionEstablishedEvent {
  type: 'connection_established';
  userId: string;
  connectionId: string;
  timestamp: string;
  message: string;
  totalConnections: number;
}

// Syncing Bank Event (Initial sync phase)
export interface BankingSyncingBankEvent {
  type: 'syncing_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  progress: number;
  message?: string;
  timestamp: string;
}

// Syncing Transactions Bank Event (Transaction sync phase)
export interface BankingSyncingTransactionsBankEvent {
  type: 'syncing_transactions_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  progress: number;
  message?: string;
  timestamp: string;
}

// Bank Sync Completed Event
export interface BankingSyncCompletedBankEvent {
  type: 'completed_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  message: string;
  syncedData?: string[];
  timestamp: string;
  duration?: number;
}

// Bank Sync Failed Event
export interface BankingSyncFailedBankEvent {
  type: 'failed_bank';
  userId: string;
  accountId: string;
  enrollmentId?: string;
  error: string;
  message: string;
  timestamp: string;
}

// Heartbeat Event
export interface BankingHeartbeatEvent {
  type: 'heartbeat';
  timestamp: string;
  totalConnections: number;
}

// Union type for all banking sync events
export type BankingSyncEvent =
  | BankingConnectionEstablishedEvent
  | BankingSyncingBankEvent
  | BankingSyncingTransactionsBankEvent
  | BankingSyncCompletedBankEvent
  | BankingSyncFailedBankEvent
  | BankingHeartbeatEvent;

// Error Types
export type BankingErrorCode =
  | 'PLAN_LIMIT_EXCEEDED'
  | 'TELLER_UNAUTHORIZED'
  | 'TELLER_RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'ACCOUNT_NOT_FOUND'
  | 'INVALID_ENROLLMENT'
  | 'SYNC_IN_PROGRESS'
  | 'INTERNAL_ERROR';

export interface BankingError extends Error {
  code: BankingErrorCode;
  details?: Record<string, unknown>;
}

// Account Summary Types (for dashboard integration)
export interface BankAccountSummary {
  id: string;
  name: string;
  type: BankAccountType;
  institutionName: string;
  balance: number;
  currency: string;
  lastSyncAt: string;
  syncStatus: BankingSyncStatus;
  transactionCount: number;
}

export interface BankingDashboardData {
  totalBalance: number;
  accountCount: number;
  recentTransactionCount: number;
  accounts: BankAccountSummary[];
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
}

// Export Types (following crypto pattern)
export interface BankingExportRequest {
  format: 'csv' | 'json' | 'xlsx';
  dataTypes: ('transactions' | 'accounts')[];
  dateRange?: {
    from: string;
    to: string;
  };
  accountIds?: string[];
}

export interface BankingExportResponse {
  jobId: string;
  downloadUrl: string;
  expiresAt: string;
}