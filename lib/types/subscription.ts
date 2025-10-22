/**
 * Subscription Type Definitions
 *
 * Based on API documentation in Subscriptions.md
 */

// ============================================================================
// ENUMS
// ============================================================================

export type SubscriptionCategory =
  | 'STREAMING'
  | 'MUSIC'
  | 'SOFTWARE'
  | 'CLOUD_STORAGE'
  | 'GAMING'
  | 'NEWS_MEDIA'
  | 'FITNESS'
  | 'PRODUCTIVITY'
  | 'COMMUNICATION'
  | 'SECURITY'
  | 'FOOD_DELIVERY'
  | 'TRANSPORTATION'
  | 'EDUCATION'
  | 'SHOPPING'
  | 'FINANCE'
  | 'UTILITIES'
  | 'INSURANCE'
  | 'MEMBERSHIP'
  | 'DONATIONS'
  | 'OTHER';

export type BillingCycle =
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUAL'
  | 'YEARLY'
  | 'CUSTOM';

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIAL'
  | 'PAUSED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'PAYMENT_FAILED';

export type SourceType =
  | 'MANUAL'
  | 'TELLER'
  | 'STRIPE'
  | 'PLAID'
  | 'TRANSACTION';

export type ChargeStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type ReminderType =
  | 'UPCOMING_CHARGE'
  | 'TRIAL_ENDING'
  | 'PRICE_INCREASE'
  | 'PAYMENT_FAILED'
  | 'RENEWAL_SOON'
  | 'CANCELLATION_REMINDER';

// ============================================================================
// CORE TYPES
// ============================================================================

export interface SubscriptionCharge {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  chargeDate: string;
  status: ChargeStatus;
  transactionId?: string;
  bankTransactionId?: string;
  providerTransactionId?: string;
  description?: string;
  failureReason?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionReminder {
  id: string;
  subscriptionId: string;
  reminderDate: string;
  reminderType: ReminderType;
  sent: boolean;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedAccount {
  id: string;
  name: string;
  type: string;
}

export interface UserCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category?: SubscriptionCategory;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: string;
  nextBillingDate?: string;
  endDate?: string | null;
  trialEndDate?: string | null;
  status: SubscriptionStatus;
  isActive: boolean;
  sourceType: SourceType;
  providerTransactionId?: string | null;
  providerName?: string | null;
  merchantName?: string;
  lastDetectedDate?: string | null;
  detectionConfidence?: number | null;
  detectionMetadata?: Record<string, unknown> | null;
  accountId?: string;
  categoryId?: string;
  notifyBeforeBilling: boolean;
  notifyDaysBefore: number;
  lastNotificationDate?: string | null;
  logoUrl?: string;
  websiteUrl?: string;
  notes?: string;
  tags?: string[];
  autoRenew: boolean;
  cancellationUrl?: string;
  yearlyEstimate: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  daysUntilNextBilling?: number;
  isInTrial: boolean;
  monthlyEquivalent: number;

  // Relations (optional)
  account?: LinkedAccount;
  userCategory?: UserCategory;
  charges?: SubscriptionCharge[];
  reminders?: SubscriptionReminder[];
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateSubscriptionRequest {
  name: string;
  description?: string;
  category?: SubscriptionCategory;
  amount: number;
  currency?: string;
  billingCycle?: BillingCycle;
  startDate?: string;
  nextBillingDate?: string;
  endDate?: string | null;
  trialEndDate?: string | null;
  status?: SubscriptionStatus;
  accountId?: string;
  categoryId?: string;
  merchantName?: string;
  logoUrl?: string;
  websiteUrl?: string;
  notes?: string;
  tags?: string[];
  autoRenew?: boolean;
  cancellationUrl?: string;
  notifyBeforeBilling?: boolean;
  notifyDaysBefore?: number;
}

export interface UpdateSubscriptionRequest {
  name?: string;
  description?: string;
  category?: SubscriptionCategory;
  amount?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  startDate?: string;
  nextBillingDate?: string;
  endDate?: string | null;
  trialEndDate?: string | null;
  status?: SubscriptionStatus;
  isActive?: boolean;
  accountId?: string;
  categoryId?: string;
  merchantName?: string;
  logoUrl?: string;
  websiteUrl?: string;
  notes?: string;
  tags?: string[];
  autoRenew?: boolean;
  cancellationUrl?: string;
  notifyBeforeBilling?: boolean;
  notifyDaysBefore?: number;
}

export interface AddChargeRequest {
  amount: number;
  currency?: string;
  chargeDate?: string;
  status?: ChargeStatus;
  transactionId?: string;
  bankTransactionId?: string;
  providerTransactionId?: string;
  description?: string;
  failureReason?: string;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionFilters {
  category?: SubscriptionCategory;
  status?: SubscriptionStatus;
  isActive?: boolean;
  sourceType?: SourceType;
  billingCycle?: BillingCycle;
  accountId?: string;
  categoryId?: string;
  search?: string;
  tags?: string;
  minAmount?: number;
  maxAmount?: number;
  autoRenew?: boolean;
  sortBy?: 'name' | 'amount' | 'nextBillingDate' | 'startDate' | 'createdAt' | 'totalSpent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  includeCharges?: boolean;
  includeReminders?: boolean;
  chargeLimit?: number;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  cancelledSubscriptions: number;
  trialSubscriptions: number;
  totalMonthlySpend: number;
  totalYearlySpend: number;
  averageSubscriptionCost: number;
  subscriptionsByCategory: Record<SubscriptionCategory, number>;
  subscriptionsByBillingCycle: Record<BillingCycle, number>;
  subscriptionsBySource: Record<SourceType, number>;
  topExpensiveSubscriptions: Array<{
    id: string;
    name: string;
    amount: number;
    billingCycle: BillingCycle;
    monthlyEquivalent: number;
  }>;
  upcomingCharges: Array<{
    id: string;
    subscriptionName: string;
    amount: number;
    nextBillingDate: string;
    daysUntil: number;
  }>;
  spendingTrend: {
    current30Days: number;
    previous30Days: number;
    percentageChange: number;
  };
  recommendations: Array<{
    type: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export interface DetectionResult {
  subscriptionId: string | null;
  isNewSubscription: boolean;
  confidence: number;
  merchantName: string;
  suggestedName: string;
  suggestedCategory: SubscriptionCategory;
  detectedBillingCycle: BillingCycle;
  amount: number;
  currency: string;
  transactionId: string;
  transactionDate: string;
  detectionMetadata: {
    matchingPattern: string;
    recurringCount: number;
    averageAmount: number;
    standardDeviation: number;
    lastOccurrence: string;
  };
}

export interface AutoDetectResponse {
  tellerDetections: DetectionResult[];
  stripeDetections: DetectionResult[];
  plaidDetections: DetectionResult[];
  manualDetections: DetectionResult[];
  totalDetections: number;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface SubscriptionListResponse {
  data: UserSubscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
