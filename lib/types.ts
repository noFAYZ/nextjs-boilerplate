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