// Auth Module Type Definitions

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export enum VerificationTokenType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  MFA_VERIFICATION = 'mfa_verification'
}

export enum LoginAttemptResult {
  SUCCESS = 'success',
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  ACCOUNT_SUSPENDED = 'account_suspended',
  MFA_REQUIRED = 'mfa_required',
  RATE_LIMITED = 'rate_limited'
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
  APPLE = 'apple'
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Registration
export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

// Login
export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Verify Email
export interface VerifyEmailDTO {
  email: string;
  token: string;
}

// Resend Verification
export interface ResendVerificationDTO {
  email: string;
}

// Forgot Password
export interface ForgotPasswordDTO {
  email: string;
}

// Reset Password
export interface ResetPasswordDTO {
  email: string;
  token: string;
  newPassword: string;
}

// Change Password
export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Refresh Token
export interface RefreshTokenDTO {
  refreshToken: string;
}

// Verify 2FA
export interface Verify2FADTO {
  code: string;
  tempToken?: string;
}

// Disable 2FA
export interface Disable2FADTO {
  password: string;
}

// ============================================================================
// MAIN TYPES
// ============================================================================

// User
export interface User {
  id: string;
  email: string;
  password_hash?: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string; // encrypted
  backupCodes?: string[]; // encrypted
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Profile (public data)
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  profilePicture?: string;
  preferences?: UserPreferences;
}

// User Preferences
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  twoFactorRequired?: boolean;
}

// Session
export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  deviceName?: string;
  lastActivityAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

// Session Details (for user)
export interface SessionDetails {
  id: string;
  deviceName: string;
  ipAddress: string;
  lastActivityAt: Date;
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
}

// Verification Token
export interface VerificationToken {
  id: string;
  userId: string;
  tokenHash: string;
  type: VerificationTokenType;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

// Login Attempt
export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  success: boolean;
  reason?: string;
  userAgent?: string;
  createdAt: Date;
}

// OAuth Account Link
export interface OAuthAccount {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerUserId: string;
  email?: string;
  displayName?: string;
  linkedAt: Date;
}

// JWT Tokens
export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// Token Claims
export interface TokenClaims {
  sub: string; // user ID
  email: string;
  role: UserRole;
  plan: string;
  iat: number;
  exp: number;
}

// Refresh Token Claims
export interface RefreshTokenClaims {
  sub: string;
  type: 'refresh';
  version: number;
  iat: number;
  exp: number;
}

// Login Response
export interface LoginResponse {
  user: UserProfile;
  tokens: JWTTokens;
  session: {
    id: string;
    createdAt: Date;
  };
}

// Register Response
export interface RegisterResponse {
  userId: string;
  email: string;
  name: string;
  message: string;
  verificationEmailSent: boolean;
}

// 2FA Setup Response
export interface Setup2FAResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  message: string;
}

// Password Reset Response
export interface PasswordResetResponse {
  message: string;
  resetAt: Date;
}

// ============================================================================
// FILTER/QUERY TYPES
// ============================================================================

export interface SessionFilters {
  userId: string;
  active?: boolean;
  expiredIncluded?: boolean;
}

export interface LoginAttemptFilters {
  email?: string;
  ipAddress?: string;
  success?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
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

// Password Validation Result
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

// Password Requirements
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

// Rate Limit Status
export interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetAt: Date;
  isLimited: boolean;
}

// TOTP Setup
export interface TOTPSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  tempToken: string;
}

// MFA Verification
export interface MFAVerification {
  method: 'totp' | 'backup_code';
  verified: boolean;
  verifiedAt?: Date;
}

// Device Fingerprint
export interface DeviceFingerprint {
  userAgent: string;
  ipAddress: string;
  deviceName: string;
  fingerprint: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AuthServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export class InvalidCredentialsError extends AuthServiceError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class EmailNotVerifiedError extends AuthServiceError {
  constructor() {
    super('Please verify your email before logging in', 'EMAIL_NOT_VERIFIED', 403);
    this.name = 'EmailNotVerifiedError';
  }
}

export class AccountSuspendedError extends AuthServiceError {
  constructor() {
    super('Account is suspended', 'ACCOUNT_SUSPENDED', 403);
    this.name = 'AccountSuspendedError';
  }
}

export class TokenExpiredError extends AuthServiceError {
  constructor(tokenType: string = 'token') {
    super(`${tokenType} has expired`, 'TOKEN_EXPIRED', 401);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends AuthServiceError {
  constructor() {
    super('Invalid or malformed token', 'INVALID_TOKEN', 401);
    this.name = 'InvalidTokenError';
  }
}

export class EmailExistsError extends AuthServiceError {
  constructor() {
    super('Email already registered', 'EMAIL_EXISTS', 409);
    this.name = 'EmailExistsError';
  }
}

export class WeakPasswordError extends AuthServiceError {
  constructor(message: string = 'Password does not meet complexity requirements') {
    super(message, 'WEAK_PASSWORD', 400);
    this.name = 'WeakPasswordError';
  }
}

export class MFARequiredError extends AuthServiceError {
  constructor() {
    super('MFA verification required', 'MFA_REQUIRED', 403);
    this.name = 'MFARequiredError';
  }
}

export class MFAInvalidError extends AuthServiceError {
  constructor() {
    super('Invalid MFA code', 'MFA_INVALID', 401);
    this.name = 'MFAInvalidError';
  }
}

export class SessionNotFoundError extends AuthServiceError {
  constructor() {
    super('Session not found', 'SESSION_NOT_FOUND', 404);
    this.name = 'SessionNotFoundError';
  }
}

export class RateLimitedError extends AuthServiceError {
  constructor(retryAfter: number = 900) {
    super(`Rate limited. Retry after ${retryAfter} seconds`, 'RATE_LIMITED', 429);
    this.name = 'RateLimitedError';
    this.statusCode = 429;
  }
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  status: string;
  email_verified: boolean;
  email_verified_at?: Date;
  two_factor_enabled: boolean;
  two_factor_secret?: string; // encrypted
  backup_codes?: string; // encrypted JSON
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SessionRecord {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  device_name?: string;
  last_activity_at: Date;
  expires_at: Date;
  created_at: Date;
}

export interface VerificationTokenRecord {
  id: string;
  user_id: string;
  token_hash: string;
  type: string;
  expires_at: Date;
  used_at?: Date;
  created_at: Date;
}

export interface LoginAttemptRecord {
  id: string;
  email: string;
  ip_address: string;
  success: boolean;
  reason?: string;
  user_agent?: string;
  created_at: Date;
}

export interface OAuthAccountRecord {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  email?: string;
  display_name?: string;
  linked_at: Date;
}

export interface UserPreferencesRecord {
  id: string;
  user_id: string;
  theme?: string;
  language?: string;
  notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_required: boolean;
  created_at: Date;
  updated_at: Date;
}
