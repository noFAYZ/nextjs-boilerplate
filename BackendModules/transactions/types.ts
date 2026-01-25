// Transactions Module Type Definitions

// ============================================================================
// ENUMS
// ============================================================================

export enum SourceType {
  BANKING = 'banking',
  CRYPTO = 'crypto',
  DEFI = 'defi',
  MANUAL = 'manual'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum CategoryConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  MANUAL = 'manual'
}

export enum CategorizationMethod {
  RULE_BASED = 'rule_based',
  PATTERN_MATCH = 'pattern_match',
  MACHINE_LEARNING = 'machine_learning',
  MANUAL = 'manual',
  UNCATEGORIZED = 'uncategorized'
}

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMIANNUAL = 'semiannual',
  ANNUAL = 'annual',
  IRREGULAR = 'irregular'
}

export enum RecurringStatus {
  PENDING_CONFIRMATION = 'pending_confirmation',
  CONFIRMED = 'confirmed',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable'
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Import Transaction
export interface ImportTransactionDTO {
  sourceType: SourceType;
  merchantName: string;
  description?: string;
  amount: number;
  currency: string;
  date: Date | string;
  accountId?: string;
  category?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

// Update Transaction
export interface UpdateTransactionDTO {
  category?: string;
  subcategory?: string;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Categorize Transaction
export interface CategorizeTransactionDTO {
  category: string;
  subcategory?: string;
  confidence?: number;
  method?: CategorizationMethod;
}

// Split Transaction
export interface SplitTransactionDTO {
  splits: Array<{
    category: string;
    amount?: number;
    percentage?: number;
    notes?: string;
  }>;
}

// Merge Transactions
export interface MergeTransactionsDTO {
  transactionIds: string[];
  mergedCategory: string;
  notes?: string;
}

// Search Query
export interface SearchTransactionDTO {
  q: string;
  category?: string;
  merchant?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// Confirm Recurring
export interface ConfirmRecurringDTO {
  recurringId: string;
  confirmed: boolean;
  frequency?: FrequencyType;
  notes?: string;
  budgetAmount?: number;
}

// Create Category
export interface CreateCategoryDTO {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
}

// ============================================================================
// MAIN TYPES
// ============================================================================

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  sourceType: SourceType;
  merchantName: string;
  description?: string;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  subcategory?: string;
  categoryConfidence: number;
  categoryMethod: CategorizationMethod;
  status: TransactionStatus;
  tags: string[];
  notes?: string;
  recurring: boolean;
  recurringId?: string;
  accountId?: string;
  transactionHash?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Summary (for list views)
export interface TransactionSummary {
  id: string;
  merchantName: string;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  status: TransactionStatus;
  recurring: boolean;
}

// Transaction Detail (full data)
export interface TransactionDetail extends Transaction {
  categoryId: string;
  categoryColor?: string;
  categoryIcon?: string;
  merchantId?: string;
  budgetedFor?: string;
  splits?: TransactionSplit[];
}

// Transaction Split
export interface TransactionSplit {
  id: string;
  transactionId: string;
  category: string;
  amount: number;
  percentage: number;
  notes?: string;
}

// Category
export interface Category {
  id: string;
  userId: string;
  name: string;
  parentCategoryId?: string;
  icon?: string;
  color?: string;
  description?: string;
  isCustom: boolean;
  isHidden: boolean;
  transactionCount: number;
  totalSpending: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category Hierarchy
export interface CategoryHierarchy {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  subcategories: CategoryHierarchy[];
}

// Recurring Transaction
export interface RecurringTransaction {
  id: string;
  userId: string;
  firstTransactionId: string;
  merchant: string;
  amount: number;
  averageAmount?: number;
  amountVariance?: number;
  category: string;
  frequency: FrequencyType;
  nextExpectedDate: Date;
  lastOccurredAt: Date;
  occurrences: number;
  status: RecurringStatus;
  budgetedAmount?: number;
  yearlyTotal: number;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Recurring Pattern Detection
export interface RecurringPattern {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  frequency: FrequencyType;
  confidence: number;
  occurrences: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  nextExpectedDate: Date;
}

// Transaction Tag
export interface TransactionTag {
  id: string;
  userId: string;
  name: string;
  color?: string;
  transactionCount: number;
  createdAt: Date;
}

// Budget
export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  rolloverUnused: boolean;
  alerts: BudgetAlert[];
  createdAt: Date;
  updatedAt: Date;
}

// Budget Alert
export interface BudgetAlert {
  id: string;
  budgetId: string;
  threshold: number; // percentage (e.g., 75 = 75%)
  alertType: 'email' | 'push' | 'in_app';
  triggered: boolean;
  triggeredAt?: Date;
}

// Transaction Analytics
export interface TransactionAnalytics {
  id: string;
  userId: string;
  period: string; // YYYY-MM
  totalTransactions: number;
  totalSpending: number;
  totalIncome: number;
  netCashFlow: number;
  averageTransaction: number;
  largestTransaction: number;
  smallestTransaction: number;
  generatedAt: Date;
}

// Analytics Summary
export interface AnalyticsSummary {
  period: string;
  totalTransactions: number;
  totalSpending: number;
  totalIncome: number;
  netCashFlow: number;
  averageTransaction: number;
  largestTransaction: number;
  smallestTransaction: number;
  percentageChange: number;
  comparison: {
    previous_period: number;
    change: number;
    changePercent: number;
  };
}

// Spending by Category
export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
  trend: TrendDirection;
  budgetAmount?: number;
  percentOfBudget?: number;
}

// Category Breakdown
export interface CategoryBreakdown {
  byCategory: SpendingByCategory[];
  topMerchants: Array<{
    merchant: string;
    amount: number;
    transactions: number;
    category: string;
  }>;
}

// Spending Trend
export interface SpendingTrend {
  date: string;
  spending: number;
  income: number;
  netCashFlow: number;
  transactionCount: number;
}

// Spending Trends Response
export interface SpendingTrendsResponse {
  trends: SpendingTrend[];
  averageSpending: number;
  highestSpendingPeriod: string;
  lowestSpendingPeriod: string;
  trend: TrendDirection;
}

// Balance History (for trends)
export interface BalanceTrend {
  date: string;
  balance: number;
  change?: number;
  changePercent?: number;
}

// Search Result
export interface SearchResult {
  id: string;
  merchantName: string;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  relevanceScore: number;
}

// Export Response
export interface ExportResponse {
  exportId: string;
  format: string;
  status: string;
  estimatedCompletionTime: Date;
  downloadUrl: string;
}

// ============================================================================
// FILTER/QUERY TYPES
// ============================================================================

export interface TransactionFilters {
  category?: string;
  merchant?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  status?: TransactionStatus;
  tags?: string[];
  recurring?: boolean;
  sourceType?: SourceType;
  sortBy?: 'date' | 'amount' | 'merchant';
  sortOrder?: 'asc' | 'desc';
}

export interface AnalyticsFilters {
  period?: string; // YYYY-MM
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  sourceType?: SourceType;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  cursor?: string;
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page?: number;
    limit?: number;
    total: number;
    offset?: number;
    hasMore: boolean;
    cursor?: string;
  };
  summary?: {
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: Date;
}

// ============================================================================
// INTERNAL TYPES
// ============================================================================

// Categorization Result
export interface CategorizationResult {
  category: string;
  subcategory?: string;
  confidence: number;
  method: CategorizationMethod;
  alternativeCategories?: Array<{
    category: string;
    confidence: number;
  }>;
}

// Merchant Match
export interface MerchantMatch {
  merchantId: string;
  merchantName: string;
  matchScore: number;
  category: string;
  standardizedName: string;
}

// ML Classification Result
export interface MLClassificationResult {
  predictions: Array<{
    category: string;
    confidence: number;
    score: number;
  }>;
  topPrediction: {
    category: string;
    confidence: number;
  };
}

// Rule Match
export interface RuleMatch {
  ruleId: string;
  category: string;
  conditions: Record<string, any>;
  matchScore: number;
}

// Recurring Detection Result
export interface RecurringDetectionResult {
  isRecurring: boolean;
  patterns: RecurringPattern[];
  bestMatch?: RecurringPattern;
  confidence: number;
}

// Cache Key
export interface CacheKey {
  type: 'transaction' | 'category' | 'analytics' | 'search';
  userId?: string;
  period?: string;
  ttl: number;
}

// Job Payload
export interface JobPayload {
  userId: string;
  transactionId: string;
  operation: string;
  data: Record<string, any>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class TransactionServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'TransactionServiceError';
  }
}

export class TransactionNotFoundError extends TransactionServiceError {
  constructor() {
    super('Transaction not found', 'TRANSACTION_NOT_FOUND', 404);
    this.name = 'TransactionNotFoundError';
  }
}

export class CategoryNotFoundError extends TransactionServiceError {
  constructor() {
    super('Category not found', 'CATEGORY_NOT_FOUND', 404);
    this.name = 'CategoryNotFoundError';
  }
}

export class InvalidCategoryError extends TransactionServiceError {
  constructor(reason: string) {
    super(`Cannot assign category: ${reason}`, 'INVALID_CATEGORY', 400);
    this.name = 'InvalidCategoryError';
  }
}

export class SearchError extends TransactionServiceError {
  constructor(message: string = 'Search indexing error') {
    super(message, 'SEARCH_ERROR', 500);
    this.name = 'SearchError';
  }
}

export class ImportFailedError extends TransactionServiceError {
  constructor(message: string = 'Transaction import failed') {
    super(message, 'IMPORT_FAILED', 503);
    this.name = 'ImportFailedError';
  }
}

export class RecurringError extends TransactionServiceError {
  constructor(message: string = 'Recurring detection failed') {
    super(message, 'RECURRING_ERROR', 500);
    this.name = 'RecurringError';
  }
}

export class InvalidSplitError extends TransactionServiceError {
  constructor(message: string = 'Invalid split amounts') {
    super(message, 'INVALID_SPLIT', 400);
    this.name = 'InvalidSplitError';
  }
}

export class InvalidMergeError extends TransactionServiceError {
  constructor(message: string = 'Cannot merge transactions') {
    super(message, 'INVALID_MERGE', 400);
    this.name = 'InvalidMergeError';
  }
}

export class ExportFailedError extends TransactionServiceError {
  constructor(message: string = 'Export generation failed') {
    super(message, 'EXPORT_FAILED', 503);
    this.name = 'ExportFailedError';
  }
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface TransactionRecord {
  id: string;
  user_id: string;
  source_type: string;
  merchant_name: string;
  description?: string;
  amount: string;
  currency: string;
  date: Date;
  category: string;
  subcategory?: string;
  category_confidence: string;
  category_method: string;
  status: string;
  tags: string[];
  notes?: string;
  recurring: boolean;
  recurring_id?: string;
  account_id?: string;
  transaction_hash?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryRecord {
  id: string;
  user_id: string;
  name: string;
  parent_category_id?: string;
  icon?: string;
  color?: string;
  description?: string;
  is_custom: boolean;
  is_hidden: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RecurringTransactionRecord {
  id: string;
  user_id: string;
  first_transaction_id: string;
  merchant: string;
  amount: string;
  average_amount?: string;
  amount_variance?: string;
  category: string;
  frequency: string;
  next_expected_date: Date;
  last_occurred_at: Date;
  occurrences: number;
  status: string;
  budgeted_amount?: string;
  yearly_total: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface BudgetRecord {
  id: string;
  user_id: string;
  category: string;
  amount: string;
  period: string;
  rollover_unused: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BudgetAlertRecord {
  id: string;
  budget_id: string;
  threshold: number;
  alert_type: string;
  triggered: boolean;
  triggered_at?: Date;
}

export interface TransactionSplitRecord {
  id: string;
  transaction_id: string;
  category: string;
  amount: string;
  percentage: number;
  notes?: string;
}
