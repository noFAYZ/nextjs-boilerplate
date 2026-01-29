/**
 * Billing Subscription Type Definitions
 *
 * Types for MoneyMappr's own subscription billing system (not user subscriptions).
 * Includes plan types, subscription management, and payment history.
 *
 * Based on API documentation in SUBSCRIPTION.md
 */

// ============================================================================
// ENUMS
// ============================================================================

export type PlanType = 'FREE' | 'PRO' | 'ULTIMATE';

export type BillingPeriod = 'MONTHLY' | 'YEARLY';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED' | 'CANCELED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// ============================================================================
// PLAN TYPES
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  type: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isActive: boolean;

  // Limits
  maxAccounts: number;
  maxWallets: number;
  maxTransactions: number;
  maxCategories: number;
  maxBudgets: number;
  maxAssetAccounts: number;

  // Features
  aiInsights: boolean;
  advancedReports: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  exportData: boolean;
  customCategories: boolean;
  bankSync: boolean;
  multiCurrency: boolean;
  collaborativeAccounts: boolean;
  investmentTracking: boolean;
  taxReporting: boolean;
  mobileApp: boolean;

  // Pricing info
  popular?: boolean;
  yearlyDiscount?: number;
  trialDays: number;

  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export interface Subscription {
  id: string;
  userId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  paymentProvider?: string;
  amount: number;
  currency: string;

  // Billing dates
  startDate: string;
  endDate?: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;

  // Cancellation
  cancelAt?: string | null;
  canceledAt?: string | null;

  // Trial period
  trialStart?: string | null;
  trialEnd?: string | null;

  // Last payment
  lastPaymentDate?: string | null;

  // Provider integration
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  polarCustomerId?: string | null;
  polarSubscriptionId?: string | null;
  polarProductId?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CurrentSubscription {
  currentPlan: PlanType;
  subscription: Subscription | null;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId?: string | null;
  invoiceId?: string | null;
  paymentMethod?: string | null;

  // Billing period
  periodStart?: string | null;
  periodEnd?: string | null;

  paymentDate: string;
  processedAt?: string | null;
  failureReason?: string | null;
  lastPaymentDate?: string | null;
  metadata?: Record<string, unknown> | null;

  // Provider integration
  stripePaymentIntentId?: string | null;
  stripeChargeId?: string | null;
  polarOrderId?: string | null;
  polarInvoiceId?: string | null;

  createdAt: string;
  updatedAt: string;

  // Relations
  subscription?: Subscription;
}

export interface PaymentHistory extends Payment {
  invoiceNumber?: string;
  description?: string;
}

export interface SubscriptionHistory {
  id: string;
  subscriptionId: string;
  status: SubscriptionStatus;
  planType: PlanType;
  billingPeriod: BillingPeriod;
  amount: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateSubscriptionData {
  planType: PlanType;
  billingPeriod: BillingPeriod;
  paymentMethodId?: string;
}

export interface UpgradeSubscriptionData {
  planType: PlanType;
  billingPeriod?: BillingPeriod;
}

export interface DowngradeSubscriptionData {
  planType: PlanType;
  billingPeriod?: BillingPeriod;
}

export interface CancelSubscriptionData {
  immediately?: boolean;
}

export interface UpdateSubscriptionData {
  planType?: PlanType;
  billingPeriod?: BillingPeriod;
}

// ============================================================================
// USAGE & LIMITS TYPES
// ============================================================================

export interface LimitDetail {
  current: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export interface LimitCheckResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
  planType: PlanType;
  feature: string;
}

export interface UserLimitsOverview {
  planType: PlanType;
  limits: {
    wallets: LimitDetail;
    accounts: LimitDetail;
    transactions: LimitDetail;
    categories: LimitDetail;
  };
}

export interface UsageStats {
  wallets: LimitDetail;
  accounts: LimitDetail;
  transactions: LimitDetail;
  categories: LimitDetail;
  budgets: LimitDetail;
}

export interface FeatureLimitCheck {
  allowed: boolean;
  feature: string;
  remaining?: number;
  limit?: number;
  planType?: PlanType;
}

export interface TrackUsageData {
  feature: string;
  amount: number;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface SubscriptionListResponse {
  data: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentHistoryResponse {
  data: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
