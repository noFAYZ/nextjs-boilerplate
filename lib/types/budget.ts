// Budget Module Types
// Following MoneyMappr architecture pattern

// ============================================================================
// ENUMS
// ============================================================================

export enum BudgetCycle {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum BudgetStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum BudgetSourceType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ALL_SUBSCRIPTIONS = 'ALL_SUBSCRIPTIONS',
  SUBSCRIPTION_CATEGORY = 'SUBSCRIPTION_CATEGORY',
  CATEGORY = 'CATEGORY',
  ACCOUNT_GROUP = 'ACCOUNT_GROUP',
  MANUAL = 'MANUAL'
}

export enum BudgetRolloverType {
  NONE = 'NONE',
  REMAINING = 'REMAINING',
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export enum BudgetAlertType {
  WARNING_50 = 'WARNING_50',
  WARNING_75 = 'WARNING_75',
  WARNING_90 = 'WARNING_90',
  EXCEEDED = 'EXCEEDED',
  APPROACHING_END = 'APPROACHING_END',
  ROLLOVER = 'ROLLOVER',
  CUSTOM = 'CUSTOM'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DISMISSED = 'DISMISSED'
}

// ============================================================================
// CORE TYPES
// ============================================================================

export interface BudgetCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface BudgetAccount {
  id: string;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

export interface BudgetSubscription {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface BudgetAccountGroup {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface BudgetPeriod {
  id: string;
  budgetId: string;
  periodNumber: number;
  periodStart: string;
  periodEnd: string;
  budgetAmount: number;
  totalSpent: number;
  percentageUsed: number;
  wasExceeded: boolean;
  isClosed: boolean;
  rolloverAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  type: BudgetAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  status: AlertStatus;
  sentAt?: string;
  dismissedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTransaction {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
  transactionDate: string;
  sourceType: string;
  sourceId?: string;
  categoryId?: string;
  categoryName?: string;
  merchantName?: string;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  amount: number;
  currency: string;
  cycle: BudgetCycle;
  status: BudgetStatus;
  sourceType: BudgetSourceType;
  accountId?: string;
  subscriptionId?: string;
  subscriptionCategory?: string;
  categoryId?: string;
  accountGroupId?: string;
  startDate?: string;
  endDate?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  daysRemaining: number;
  daysElapsed: number;
  progressDays: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isExceeded: boolean;
  totalSpent: number;
  totalBudgeted: number;
  periodsCount: number;
  rolloverType: BudgetRolloverType;
  rolloverPercentage?: number;
  rolloverAmount?: number;
  rolloverBalance: number;
  enableAlerts: boolean;
  alert50Percent: boolean;
  alert75Percent: boolean;
  alert90Percent: boolean;
  alertExceeded: boolean;
  alertDaysBefore: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  lastAlertSent?: string;
  lastAlertType?: BudgetAlertType;
  autoRenew: boolean;
  autoAdjust: boolean;
  averageSpending?: number;
  predictedSpending?: number;
  spendingTrend?: number;
  lastCalculatedAt?: string;
  dailyAverage: number;
  projectedTotal: number;
  recommendedDailySpend: number;
  onTrack: boolean;
  tags: string[];
  notes?: string;
  isActive: boolean;
  isArchived: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  account?: BudgetAccount | null;
  subscription?: BudgetSubscription | null;
  category?: BudgetCategory | null;
  accountGroup?: BudgetAccountGroup | null;
  periods?: BudgetPeriod[];
  recentAlerts?: BudgetAlert[];
  recentTransactions?: BudgetTransaction[];
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateBudgetRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  amount: number;
  currency?: string;
  cycle?: BudgetCycle;
  sourceType: BudgetSourceType;
  accountId?: string;
  subscriptionId?: string;
  subscriptionCategory?: string;
  categoryId?: string;
  accountGroupId?: string;
  startDate?: string;
  endDate?: string;
  rolloverType?: BudgetRolloverType;
  rolloverPercentage?: number;
  rolloverAmount?: number;
  enableAlerts?: boolean;
  alert50Percent?: boolean;
  alert75Percent?: boolean;
  alert90Percent?: boolean;
  alertExceeded?: boolean;
  alertDaysBefore?: number;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  autoRenew?: boolean;
  autoAdjust?: boolean;
  tags?: string[];
  notes?: string;
  priority?: number;
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {}

export interface GetBudgetsParams {
  page?: number;
  limit?: number;
  cycle?: BudgetCycle;
  status?: BudgetStatus;
  sourceType?: BudgetSourceType;
  isActive?: boolean;
  isExceeded?: boolean;
  accountId?: string;
  subscriptionId?: string;
  categoryId?: string;
  search?: string;
  tags?: string;
  sortBy?: 'name' | 'amount' | 'spent' | 'remaining' | 'percentageUsed' | 'currentPeriodEnd' | 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  includeArchived?: boolean;
  includePeriods?: boolean;
  includeAlerts?: boolean;
  includeTransactions?: boolean;
}

export interface GetBudgetParams {
  includePeriods?: boolean;
  includeAlerts?: boolean;
  includeTransactions?: boolean;
}

export interface AddBudgetTransactionRequest {
  amount: number;
  description: string;
  transactionDate?: string;
  sourceType?: string;
  sourceId?: string;
  categoryId?: string;
  categoryName?: string;
  merchantName?: string;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface BudgetRefreshResponse {
  totalSpent: number;
  transactionCount: number;
  averageDailySpend: number;
  projectedTotal: number;
  remaining: number;
  percentageUsed: number;
  isExceeded: boolean;
  onTrack: boolean;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface BudgetSpendingBudget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  percentageUsed: number;
}

export interface BudgetExceededBudget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  exceededBy: number;
}

export interface BudgetPeriodEndingSoon {
  id: string;
  budgetName: string;
  periodEnd: string;
  daysRemaining: number;
  spent: number;
  remaining: number;
}

export interface BudgetSpendingTrend {
  current30Days: number;
  previous30Days: number;
  percentageChange: number;
}

export interface BudgetAnalytics {
  totalBudgets: number;
  activeBudgets: number;
  pausedBudgets: number;
  exceededBudgets: number;
  archivedBudgets: number;
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentageUsed: number;
  budgetsOnTrack: number;
  budgetsOffTrack: number;
  averagePercentageUsed: number;
  budgetsByCycle: Record<BudgetCycle, number>;
  spendingByCycle: Record<BudgetCycle, number>;
  budgetsBySource: Record<BudgetSourceType, number>;
  spendingBySource: Record<BudgetSourceType, number>;
  topSpendingBudgets: BudgetSpendingBudget[];
  mostExceededBudgets: BudgetExceededBudget[];
  totalAlerts: number;
  pendingAlerts: number;
  recentAlerts: BudgetAlert[];
  periodsEndingSoon: BudgetPeriodEndingSoon[];
  spendingTrend: BudgetSpendingTrend;
  recommendations: any[];
}

export interface BudgetSummary {
  totalBudgets: number;
  activeBudgets: number;
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentageUsed: number;
  exceededBudgets: number;
  budgetsOnTrack: number;
  budgetsOffTrack: number;
  pendingAlerts: number;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface BudgetPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BudgetsResponse {
  success: boolean;
  data: Budget[];
  pagination: BudgetPagination;
}

export interface BudgetResponse {
  success: boolean;
  data: Budget;
  message?: string;
}

export interface BudgetAnalyticsResponse {
  success: boolean;
  data: BudgetAnalytics;
}

export interface BudgetSummaryResponse {
  success: boolean;
  data: BudgetSummary;
}

export interface BudgetTransactionResponse {
  success: boolean;
  data: BudgetTransaction;
}

export interface BudgetRefreshApiResponse {
  success: boolean;
  data: BudgetRefreshResponse;
}

export interface DeleteBudgetResponse {
  success: boolean;
  message: string;
}
