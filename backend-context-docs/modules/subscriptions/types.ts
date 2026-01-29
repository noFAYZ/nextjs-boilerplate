// Subscriptions Module Type Definitions

export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ULTIMATE = 'ULTIMATE'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// DTOs
export interface CreateSubscriptionDTO {
  planId: string;
  paymentMethodId?: string;
  billingCycle?: BillingCycle;
}

export interface UpgradeSubscriptionDTO {
  newPlanId: string;
}

export interface DowngradeSubscriptionDTO {
  newPlanId: string;
}

// Main Types
export interface Plan {
  id: string;
  name: PlanType;
  priceMonthly: number;
  priceYearly: number;
  maxWallets: number;
  maxAccounts: number;
  syncFrequency: number;
  features: string[];
  description?: string;
  trialDays: number;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  billingCycleDay: number;
  nextBillingDate: Date;
  autoRenew: boolean;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageTracking {
  id: string;
  subscriptionId: string;
  featureName: string;
  usageCount: number;
  limit: number;
  periodStart: Date;
  periodEnd: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface UsageStats {
  [key: string]: {
    used: number;
    limit: number | string;
    percentage: number;
  };
}

// Responses
export interface PlanResponse extends Plan {
  selected?: boolean;
}

export interface SubscriptionResponse {
  id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  amount: number;
  billingCycle: BillingCycle;
  autoRenew: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: Date;
}

// Error Types
export class SubscriptionServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'SubscriptionServiceError';
  }
}

// Database Records
export interface PlanRecord {
  id: string;
  name: string;
  price_monthly: string;
  price_yearly: string;
  max_wallets: number;
  max_accounts: number;
  sync_frequency: number;
  features: string[];
  trial_days: number;
  created_at: Date;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  next_billing_date: Date;
  auto_renew: boolean;
  trial_ends_at?: Date;
  cancelled_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceRecord {
  id: string;
  subscription_id: string;
  amount: string;
  tax: string;
  total: string;
  status: string;
  due_date: Date;
  paid_at?: Date;
  created_at: Date;
}
