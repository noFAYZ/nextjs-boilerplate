import type { ApiResponse, PaginationInfo } from './crypto';

// Enums
export type GoalType =
  | 'SAVINGS'
  | 'EMERGENCY_FUND'
  | 'INVESTMENT'
  | 'CRYPTO'
  | 'DEBT_PAYOFF'
  | 'NET_WORTH'
  | 'SPENDING_LIMIT'
  | 'INCOME'
  | 'CUSTOM';

export type GoalCategory =
  | 'PERSONAL'
  | 'FAMILY'
  | 'EDUCATION'
  | 'RETIREMENT'
  | 'TRAVEL'
  | 'HOME'
  | 'VEHICLE'
  | 'BUSINESS'
  | 'HEALTH'
  | 'OTHER';

export type GoalPriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW';

export type GoalSourceType =
  | 'MANUAL'
  | 'BANK_ACCOUNT'
  | 'CRYPTO_WALLET'
  | 'ACCOUNT_GROUP'
  | 'ALL_ACCOUNTS'
  | 'ALL_CRYPTO'
  | 'PORTFOLIO';

export type ContributionFrequency =
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY';

// Goal Milestone Interface
export interface GoalMilestone {
  id: string;
  goalId: string;
  name: string;
  description?: string;
  targetAmount: number;
  targetPercentage: number;
  isAchieved: boolean;
  achievedDate?: string;
  achievedAmount?: number;
  celebration?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Goal Snapshot Interface
export interface GoalSnapshot {
  id: string;
  goalId: string;
  currentAmount: number;
  progress: number;
  contributionAmount?: number;
  bankBalance?: number;
  cryptoBalance?: number;
  totalAssets?: number;
  dailyVelocity?: number;
  weeklyVelocity?: number;
  monthlyVelocity?: number;
  projectedCompletion?: string;
  daysToCompletion?: number;
  onTrack: boolean;
  snapshotDate: string;
  createdAt: string;
}

// Main Goal Interface
export interface Goal {
  id: string;
  userId: string;

  // Identification
  name: string;
  description?: string;
  icon?: string;
  color?: string;

  // Classification
  type: GoalType;
  category?: GoalCategory;
  priority: GoalPriority;

  // Financial targets
  targetAmount: number;
  startingAmount: number;
  currentAmount: number;
  currency: string;

  // Progress
  progress: number;
  isAchieved: boolean;
  onTrack: boolean;

  // Dates
  startDate: string;
  targetDate: string;
  achievedDate?: string;
  lastCalculatedAt?: string;

  // Contributions
  totalContributions: number;
  recurringAmount?: number;
  contributionFrequency?: ContributionFrequency;

  // Projections
  projectedCompletionDate?: string;
  estimatedMonthlyContribution?: number;
  daysRemaining: number;
  daysToTarget: number;
  amountRemaining: number;

  // Source
  sourceType: GoalSourceType;
  accountId?: string;
  cryptoWalletId?: string;
  accountGroupId?: string;
  trackAllAccounts: boolean;
  trackAllCrypto: boolean;
  sourceConfig?: Record<string, unknown>;

  // Populated relations
  account?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  cryptoWallet?: {
    id: string;
    name: string;
    address: string;
    network: string;
    totalBalanceUsd: number;
  };
  accountGroup?: {
    id: string;
    name: string;
  };

  // Milestones and snapshots
  milestones: GoalMilestone[];
  recentSnapshots?: GoalSnapshot[];

  // Metadata
  tags: string[];
  notes?: string;
  isActive: boolean;
  isArchived: boolean;
  notifyOnMilestone: boolean;
  notifyOnCompletion: boolean;
  lastNotificationAt?: string;

  createdAt: string;
  updatedAt: string;
}

// Create Goal Request
export interface CreateGoalRequest {
  // Required fields
  name: string;
  type: GoalType;
  targetAmount: number;
  targetDate: string;
  sourceType: GoalSourceType;

  // Optional fields
  description?: string;
  icon?: string;
  color?: string;
  category?: GoalCategory;
  priority?: GoalPriority;
  startingAmount?: number;
  currency?: string;
  startDate?: string;
  recurringAmount?: number;
  contributionFrequency?: ContributionFrequency;

  // Source configuration
  accountId?: string;
  cryptoWalletId?: string;
  accountGroupId?: string;
  trackAllAccounts?: boolean;
  trackAllCrypto?: boolean;
  sourceConfig?: Record<string, unknown>;

  // Milestones
  milestones?: Array<{
    name: string;
    description?: string;
    targetPercentage: number;
    celebration?: string;
    sortOrder?: number;
  }>;

  // Metadata
  tags?: string[];
  notes?: string;
  notifyOnMilestone?: boolean;
  notifyOnCompletion?: boolean;
}

// Update Goal Request
export interface UpdateGoalRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  type?: GoalType;
  category?: GoalCategory;
  priority?: GoalPriority;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  recurringAmount?: number;
  contributionFrequency?: ContributionFrequency;

  // Source configuration
  sourceType?: GoalSourceType;
  accountId?: string;
  cryptoWalletId?: string;
  accountGroupId?: string;
  trackAllAccounts?: boolean;
  trackAllCrypto?: boolean;

  // Metadata
  tags?: string[];
  notes?: string;
  isActive?: boolean;
  isArchived?: boolean;
  notifyOnMilestone?: boolean;
  notifyOnCompletion?: boolean;
}

// Manual Contribution Request
export interface AddContributionRequest {
  amount: number;
  note?: string;
  date?: string;
}

// Query Parameters
export interface GetGoalsParams {
  // Filters
  type?: GoalType | GoalType[];
  category?: GoalCategory;
  priority?: GoalPriority;
  isAchieved?: boolean;
  isActive?: boolean;
  sourceType?: GoalSourceType;
  onTrack?: boolean;
  search?: string;
  tags?: string;

  // Date range filters
  targetDateFrom?: string;
  targetDateTo?: string;

  // Sorting
  sortBy?: 'name' | 'priority' | 'progress' | 'targetDate' | 'targetAmount' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';

  // Pagination
  page?: number;
  limit?: number;

  // Include options
  includeArchived?: boolean;
  includeMilestones?: boolean;
  includeSnapshots?: boolean;
  snapshotLimit?: number;
}

// Calculate Progress Response
export interface CalculateProgressResponse {
  goalId: string;
  previousAmount: number;
  currentAmount: number;
  progress: number;
  changeAmount: number;
  changePercentage: number;
  milestonesAchieved: string[];
  isCompleted: boolean;
  projectedCompletionDate?: string;
  onTrack: boolean;
  velocity: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

// Goal Analytics
export interface GoalAnalytics {
  // Summary metrics
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  archivedGoals: number;

  // Financial metrics
  totalTargetAmount: number;
  totalCurrentAmount: number;
  totalProgress: number;

  // Breakdown by classification
  goalsByType: Record<GoalType, number>;
  goalsByCategory: Record<string, number>;
  goalsByPriority: Record<GoalPriority, number>;

  // Performance metrics
  onTrackGoals: number;
  offTrackGoals: number;
  averageProgress: number;
  averageDaysToCompletion?: number;

  // Top performers
  topPerformingGoals: Array<{
    id: string;
    name: string;
    progress: number;
  }>;

  // Urgent goals
  urgentGoals: Array<{
    id: string;
    name: string;
    daysRemaining: number;
  }>;
}

// API Response Types
export interface GetGoalsResponse {
  success: boolean;
  data: Goal[];
  pagination: PaginationInfo;
}

export interface GetGoalResponse {
  success: boolean;
  data: Goal;
  message?: string;
}

export interface CreateGoalResponse {
  success: boolean;
  data: Goal;
  message: string;
}

export interface UpdateGoalResponse {
  success: boolean;
  data: Goal;
  message: string;
}

export interface DeleteGoalResponse {
  success: boolean;
  message: string;
}

export interface CalculateGoalProgressResponse {
  success: boolean;
  data: CalculateProgressResponse;
  message: string;
}

export interface AddContributionResponse {
  success: boolean;
  data: Goal;
  message: string;
}

export interface GetAnalyticsResponse {
  success: boolean;
  data: GoalAnalytics;
}

// Error Types
export type GoalErrorCode =
  | 'GOAL_NOT_FOUND'
  | 'INVALID_SOURCE'
  | 'INVALID_AMOUNT'
  | 'INVALID_DATE'
  | 'MILESTONE_NOT_FOUND'
  | 'CALCULATION_ERROR'
  | 'PLAN_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR';

export interface GoalError extends Error {
  code: GoalErrorCode;
  details?: Record<string, unknown>;
}

// Helper Types
export interface GoalFormData extends Omit<CreateGoalRequest, 'targetDate' | 'startDate'> {
  targetDate: Date;
  startDate?: Date;
}

export interface GoalFilters {
  types: GoalType[];
  categories: GoalCategory[];
  priorities: GoalPriority[];
  sourceTypes: GoalSourceType[];
  showAchieved: boolean;
  showInactive: boolean;
  showArchived: boolean;
  onTrackOnly: boolean;
  searchQuery: string;
  selectedTags: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

// View Preferences
export interface GoalViewPreferences {
  viewMode: 'grid' | 'list' | 'table';
  sortBy: GetGoalsParams['sortBy'];
  sortOrder: GetGoalsParams['sortOrder'];
  showMilestones: boolean;
  showProgress: boolean;
  showProjections: boolean;
  cardsPerRow: 2 | 3 | 4;
  compactMode: boolean;
}
