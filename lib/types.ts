// User related types
export type UserRole = 'USER' | 'ADMIN' | 'PREMIUM';
export type UserPlan = 'FREE' | 'PRO' | 'ULTIMATE';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  currentPlan: UserPlan;
  status: UserStatus;
  emailVerified: boolean;
  profilePicture?: string;
  phone?: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionResponse {
  success: boolean;
  data: {
    user: User;
    session: Session;
  };
}

// API Response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Authentication form types
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ResendEmailFormData {
  email: string;
}

// Error types
export interface FormError {
  field?: string;
  message: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}

// Loading and state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

// Common error codes
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];

// Better-auth response types
export interface BetterAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  [key: string]: unknown;
}

export interface BetterAuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface BetterAuthResponse {
  data?: {
    user: BetterAuthUser;
    session: BetterAuthSession;
  } | null;
  user?: BetterAuthUser;
  session?: BetterAuthSession;
}

export type ErrorState = AuthError | null;

// User Profile Management Types
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  currentPlan: UserPlan;
  status: UserStatus;
  emailVerified: boolean;
  profilePicture?: string;
  phone?: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  currency?: string;
  timezone?: string;
  profilePicture?: string;
}

export interface UserStats {
  accounts: number;
  transactions: number;
  categories: number;
  budgets: number;
  goals: number;
  currentPlan: UserPlan;
}

// Subscription Management Types
export type SubscriptionPlanType = 'FREE' | 'PRO' | 'ULTIMATE';
export type BillingPeriod = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';

export interface SubscriptionPlan {
  type: SubscriptionPlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  popular?: boolean;
  trialDays?: number;
  features: {
    maxAccounts: number; // -1 for unlimited
    maxTransactions: number;
    maxCategories: number;
    maxBudgets: number;
    maxGoals: number;
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
  };
}

export interface CurrentSubscription {
  id: string;
  planType: SubscriptionPlanType;
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  nextBillingDate?: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionData {
  planType: SubscriptionPlanType;
  billingPeriod: BillingPeriod;
  paymentMethodId: string;
}

export interface UpgradeSubscriptionData {
  planType: SubscriptionPlanType;
  billingPeriod: BillingPeriod;
}

export interface CancelSubscriptionData {
  immediately: boolean;
}

export interface SubscriptionHistory {
  id: string;
  planType: SubscriptionPlanType;
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  amount: number;
  currency: string;
  createdAt: string;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CreatePaymentIntentData {
  planType: SubscriptionPlanType;
  billingPeriod: BillingPeriod;
  currency: string;
}

export interface ProcessPaymentData {
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
}

export interface PaymentHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
  createdAt: string;
}

// Usage Tracking Types
export interface UsageLimit {
  current: number;
  limit: number; // -1 for unlimited
  remaining: number; // -1 for unlimited
  percentage: number;
}

export interface UsageStats {
  accounts: UsageLimit;
  transactions: UsageLimit;
  categories: UsageLimit;
  budgets: UsageLimit;
  goals: UsageLimit;
}

export interface TrackUsageData {
  feature: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export interface FeatureLimitCheck {
  allowed: boolean;
  limit: number;
  current: number;
  remaining: number;
}