/**
 * Comprehensive Error Handling System
 * Provides centralized error handling with user-friendly messages and recovery strategies
 */

import { logger } from './logger';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  retryable: boolean;
  details?: unknown;
  timestamp: Date;
}

/**
 * Auth error code mappings from backend
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  MISSING_CREDENTIALS: 'Email and password are required',
  USER_NOT_FOUND: 'No account found with this email. Please sign up first.',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists. Please sign in instead.',
  INVALID_PASSWORD_LENGTH: 'Password must be between 8 and 128 characters',
  INVALID_EMAIL: 'Invalid email format',
  USER_NOT_VERIFIED: 'Please verify your email before signing in',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_EXPIRED: 'Token has expired',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_SESSION: 'Invalid session',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
  AUTHENTICATION_FAILED: 'Authentication failed',
  INVALID_CREDENTIALS: 'Invalid credentials provided',
  OAUTH_PROVIDER_ERROR: 'OAuth provider error',
  PROVIDER_NOT_ENABLED: 'OAuth provider is not enabled',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  INVALID_ROLE: 'Invalid role',
  USER_ALREADY_MEMBER: 'User is already a member of this organization',
  ACCESS_DENIED: 'Access denied',
  INVALID_ORGANIZATION_ID: 'Invalid organization ID',
  PASSWORD_RESET_FAILED: 'Password reset failed',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed',
  EMAIL_NOT_PROVIDED: 'Email is required',
  PASSWORD_NOT_PROVIDED: 'Password is required',
  NAME_REQUIRED: 'Name is required',
  INVALID_NAME: 'Invalid name',
  INVALID_REDIRECT_URL: 'Invalid redirect URL',
  CONTEXT_LOAD_FAILED: 'Failed to load request context',
  ORG_REQUIRED: 'Organization context required',
  INSUFFICIENT_ROLE: 'Insufficient role for this operation',
  PERSONAL_ORG_REQUIRED: 'This operation requires a personal organization',
  EMAIL_NOT_VERIFIED: 'Please verify your email before signing in'
};

export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  primary?: boolean;
}

export interface ErrorHandlingOptions {
  showToast?: boolean;
  logError?: boolean;
  throwError?: boolean;
  retryable?: boolean;
  userMessage?: string;
}

class ErrorHandler {
  private errorCounts = new Map<string, number>();
  private lastErrorTime = new Map<string, number>();
  private readonly MAX_RETRY_COUNT = 3;
  private readonly RETRY_RESET_TIME = 5 * 60 * 1000; // 5 minutes

  /**
   * Handle different types of errors with appropriate user messages
   */
  handleError(
    error: unknown, 
    context: string = 'general',
    options: ErrorHandlingOptions = {}
  ): AppError {
    const {
      showToast = true,
      logError = true,
      throwError = false,
      userMessage
    } = options;

    const appError = this.createAppError(error, context, userMessage);
    
    if (logError) {
      this.logError(appError, context);
    }

    if (showToast && typeof window !== 'undefined') {
      this.showErrorToast(appError);
    }

    // Track error frequency
    this.trackError(appError.code);

    if (throwError) {
      throw appError;
    }

    return appError;
  }

  /**
   * Convert various error types to standardized AppError
   */
  private createAppError(error: unknown, context: string, customUserMessage?: string): AppError {
    let code = 'UNKNOWN_ERROR';
    let message = 'An unexpected error occurred';
    let userMessage = customUserMessage || 'Something went wrong. Please try again.';
    let severity: AppError['severity'] = 'medium';
    let recoverable = true;
    let retryable = true;
    const details = error;

    // Authentication errors (check FIRST before generic API errors)
    if (this.isAuthError(error)) {
      const authError = error as {
        code?: string;
        message?: string;
        error?: { code?: string; message?: string };
        details?: { error?: { code?: string; message?: string } };
      };

      // Extract auth error code from various possible locations
      const errorCode = authError.code ||
                       authError.error?.code ||
                       authError.details?.error?.code;

      if (errorCode && AUTH_ERROR_MESSAGES[errorCode]) {
        code = errorCode;
        message = AUTH_ERROR_MESSAGES[errorCode];
        userMessage = customUserMessage || AUTH_ERROR_MESSAGES[errorCode];

        // Special handling for different error types
        if (errorCode.includes('NOT_FOUND') || errorCode === 'INVALID_EMAIL_OR_PASSWORD') {
          severity = 'medium';
          retryable = false;
        } else if (errorCode === 'RATE_LIMIT_EXCEEDED') {
          severity = 'medium';
          retryable = true;
        } else if (errorCode === 'SESSION_EXPIRED' || errorCode === 'UNAUTHORIZED') {
          severity = 'high';
          recoverable = true;
          retryable = false;
        }
      } else {
        code = 'AUTH_ERROR';
        message = 'Authentication failed';
        userMessage = customUserMessage || 'Please log in again to continue.';
        severity = 'high';
        recoverable = false;
        retryable = false;
      }
    }
    // Backend connection errors (ERR_CONNECTION_REFUSED, etc.)
    else if (this.isBackendConnectionError(error)) {
      code = 'BACKEND_UNREACHABLE';
      message = 'Backend server is unreachable';
      userMessage = 'Unable to connect to the backend server. Please check if the server is running and try again.';
      severity = 'critical';
      recoverable = true;
      retryable = true;
    }
    // Network/API errors
    else if (this.isNetworkError(error)) {
      code = 'NETWORK_ERROR';
      message = 'Network connection failed';
      userMessage = 'Connection problem. Check your internet and try again.';
      severity = 'high';
      retryable = true;
    }
    // Fetch errors
    else if (error instanceof TypeError && error.message.includes('fetch')) {
      code = 'FETCH_ERROR';
      message = 'Failed to connect to server';
      userMessage = 'Unable to connect to server. Please try again later.';
      severity = 'high';
      retryable = true;
    }
    // Plan limit errors
    else if (this.isPlanLimitError(error)) {
      const limitError = error as { details?: { error?: { code?: string; message?: string } } };
      code = limitError.details?.error?.code || 'PLAN_LIMIT_EXCEEDED';
      message = limitError.details?.error?.message || 'Plan limit exceeded';
      userMessage = customUserMessage || this.getPlanLimitUserMessage(limitError);
      severity = 'medium';
      recoverable = true;
      retryable = false;
    }
    // API response errors
    else if (this.isApiError(error)) {
      const apiError = error as { code?: string; message?: string; details?: { error?: { code?: string } } };
      code = apiError.code || 'API_ERROR';
      message = apiError.message || 'API request failed';

      // Check for plan limit errors in API responses
      if (apiError.details?.error?.code === 'WALLET_LIMIT_EXCEEDED' ||
          apiError.details?.error?.code?.includes('LIMIT_EXCEEDED')) {
        code = apiError.details.error.code;
        message = apiError.details.error.message;
        userMessage = customUserMessage || this.getPlanLimitUserMessage(apiError);
        severity = 'medium';
        recoverable = true;
        retryable = false;
      } else {
        switch (apiError.response?.status) {
          case 400:
            userMessage = 'Invalid request. Please check your input and try again.';
            severity = 'medium';
            retryable = false;
            break;
          case 401:
            code = 'UNAUTHORIZED';
            userMessage = 'Please log in again to continue.';
            severity = 'high';
            retryable = false;
            break;
          case 403:
            code = 'FORBIDDEN';
            userMessage = 'You do not have permission to perform this action.';
            severity = 'medium';
            retryable = false;
            break;
        case 404:
          code = 'NOT_FOUND';
          userMessage = 'The requested resource was not found.';
          severity = 'low';
          retryable = false;
          break;
        case 429:
          code = 'RATE_LIMITED';
          userMessage = 'Too many requests. Please wait a moment and try again.';
          severity = 'medium';
          retryable = true;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          code = 'SERVER_ERROR';
          userMessage = 'Server is experiencing issues. Please try again later.';
          severity = 'high';
          retryable = true;
          break;
        default:
          userMessage = 'Request failed. Please try again.';
        }
      }
    }
    // Validation errors
    else if (this.isValidationError(error)) {
      code = 'VALIDATION_ERROR';
      message = 'Input validation failed';
      userMessage = 'Please check your input and try again.';
      severity = 'medium';
      retryable = false;
    }
    // JavaScript errors
    else if (error instanceof Error) {
      message = error.message;
      
      // Specific error types
      if (error.name === 'AbortError') {
        code = 'REQUEST_CANCELLED';
        userMessage = 'Request was cancelled.';
        severity = 'low';
        retryable = true;
      } else if (error.name === 'TimeoutError') {
        code = 'REQUEST_TIMEOUT';
        userMessage = 'Request timed out. Please try again.';
        severity = 'medium';
        retryable = true;
      }
    }

    return {
      code,
      message,
      userMessage: customUserMessage || userMessage,
      severity,
      recoverable,
      retryable,
      details,
      timestamp: new Date()
    };
  }

  /**
   * Check if error should be retried
   */
  shouldRetry(error: AppError): boolean {
    if (!error.retryable) return false;

    const errorKey = `${error.code}_${error.message}`;
    const count = this.errorCounts.get(errorKey) || 0;
    const lastTime = this.lastErrorTime.get(errorKey) || 0;
    const now = Date.now();

    // Reset counter if enough time has passed
    if (now - lastTime > this.RETRY_RESET_TIME) {
      this.errorCounts.set(errorKey, 0);
    }

    return count < this.MAX_RETRY_COUNT;
  }

  /**
   * Get recovery actions for an error
   */
  getRecoveryActions(error: AppError, context: string): ErrorRecoveryAction[] {
    const actions: ErrorRecoveryAction[] = [];

    switch (error.code) {
      case 'BACKEND_UNREACHABLE':
      case 'BACKEND_DOWN':
        actions.push({
          label: 'Check Server Status',
          action: async () => {
            // Try to check if backend is available
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'https://api.moneymappr.com'}/health`);
              if (response.ok) {
                window.location.reload();
              } else {
                alert('Backend server is still unavailable. Please try again later.');
              }
            } catch {
              alert('Backend server is still unavailable. Please try again later.');
            }
          },
          primary: true
        });
        actions.push({
          label: 'Try Again',
          action: () => window.location.reload()
        });
        break;

      case 'NETWORK_ERROR':
      case 'FETCH_ERROR':
        actions.push({
          label: 'Retry',
          action: () => window.location.reload(),
          primary: true
        });
        break;

      case 'UNAUTHORIZED':
      case 'SESSION_EXPIRED':
      case 'INVALID_SESSION':
        actions.push({
          label: 'Log in again',
          action: () => {
            window.location.href = '/auth/login';
          },
          primary: true
        });
        break;

      case 'USER_NOT_FOUND':
        actions.push({
          label: 'Sign up',
          action: () => {
            window.location.href = '/auth/signup';
          },
          primary: true
        });
        actions.push({
          label: 'Back to login',
          action: () => {
            window.history.back();
          }
        });
        break;

      case 'EMAIL_ALREADY_EXISTS':
        actions.push({
          label: 'Sign in',
          action: () => {
            window.location.href = '/auth/login';
          },
          primary: true
        });
        break;

      case 'USER_NOT_VERIFIED':
      case 'EMAIL_NOT_VERIFIED':
        actions.push({
          label: 'Verify email',
          action: () => {
            window.location.href = '/auth/resend-verification';
          },
          primary: true
        });
        break;

      case 'TOKEN_EXPIRED':
      case 'INVALID_TOKEN':
        actions.push({
          label: 'Request new token',
          action: () => {
            window.location.href = '/auth/forgot-password';
          },
          primary: true
        });
        break;

      case 'RATE_LIMIT_EXCEEDED':
        actions.push({
          label: 'Wait and try again',
          action: async () => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            window.location.reload();
          },
          primary: true
        });
        break;

      case 'NOT_FOUND':
        if (context.includes('page')) {
          actions.push({
            label: 'Go back',
            action: () => window.history.back()
          }, {
            label: 'Go home',
            action: () => { window.location.href = '/'; }
          });
        }
        break;

      case 'RATE_LIMITED':
        actions.push({
          label: 'Wait and retry',
          action: async () => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            window.location.reload();
          },
          primary: true
        });
        break;

      case 'SERVER_ERROR':
        actions.push({
          label: 'Try again',
          action: () => window.location.reload(),
          primary: true
        });
        break;

      case 'WALLET_LIMIT_EXCEEDED':
      case 'ACCOUNT_LIMIT_EXCEEDED':
      case 'TRANSACTION_LIMIT_EXCEEDED':
      case 'CATEGORY_LIMIT_EXCEEDED':
      case 'BUDGET_LIMIT_EXCEEDED':
      case 'GOAL_LIMIT_EXCEEDED':
        actions.push({
          label: 'View Plans',
          action: () => {
            window.location.href = '/subscription';
          },
          primary: true
        });
        break;

      default:
        if (error.retryable) {
          actions.push({
            label: 'Try again',
            action: () => window.location.reload()
          });
        }
        break;
    }

    // Always provide a way to go back or home
    if (actions.length === 0) {
      actions.push({
        label: 'Go home',
        action: () => { window.location.href = '/'; }
      });
    }

    return actions;
  }

  /**
   * Handle critical errors that require immediate attention
   */
  handleCriticalError(error: unknown, context: string): never {
    const appError = this.createAppError(error, context);
    appError.severity = 'critical';
    
    this.logError(appError, context);
    
    // For critical errors, redirect to error page
    if (typeof window !== 'undefined') {
      const errorState = encodeURIComponent(JSON.stringify({
        code: appError.code,
        message: appError.userMessage,
        timestamp: appError.timestamp.toISOString()
      }));
      
      window.location.href = `/error?state=${errorState}`;
    }

    throw appError;
  }

  /**
   * Type guards for different error types
   */
  private isBackendConnectionError(error: unknown): boolean {
    if (typeof error === 'object' && error !== null) {
      const err = error as {
        name?: string;
        response?: { status: number };
        message?: string;
        cause?: { code?: string };
        code?: string;
      };

      // Check for actual connection errors only, not HTTP errors
      // HTTP errors (including 401, 404, 500) have a response object and should not be treated as connection errors
      return (err.message?.includes('ERR_CONNECTION_REFUSED') ||
              err.message?.includes('Failed to fetch') ||
              err.message?.includes('fetch') ||
              err.name === 'NetworkError' ||
              err.name === 'TypeError' ||
              err.cause?.code === 'ECONNREFUSED' ||
              err.cause?.code === 'ENOTFOUND' ||
              err.code === 'ERR_CONNECTION_REFUSED' ||
              err.code === 'BACKEND_UNREACHABLE' ||
              err.code === 'BACKEND_DOWN') &&
             !err.response; // Only treat as connection error if there's NO response
    }
    return false;
  }

  private isNetworkError(error: unknown): boolean {
    return error instanceof Error &&
           (error.name === 'NetworkError' ||
            error.message.toLowerCase().includes('network'));
  }

  private isApiError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;

    const err = error as { response?: any; status?: number; code?: string };
    // Check if it has a response/status (HTTP error) or if it's an auth error code
    return 'response' in error || 'status' in error ||
           (err.code && AUTH_ERROR_MESSAGES[err.code as keyof typeof AUTH_ERROR_MESSAGES]);
  }

  private isAuthError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;

    const err = error as {
      code?: string;
      message?: string;
      error?: { code?: string };
      details?: { error?: { code?: string } };
    };

    const code = err.code ||
                err.error?.code ||
                err.details?.error?.code;

    // Check if it's any of the auth error codes from backend
    return !!(code && AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES]) ||
           !!(err.code?.includes('AUTH')) ||
           !!(err.error?.code?.includes('AUTH'));
  }

  private isValidationError(error: unknown): boolean {
    return typeof error === 'object' &&
           error !== null &&
           ('name' in error && (error as { name?: string }).name === 'ValidationError');
  }

  private isPlanLimitError(error: unknown): boolean {
    return typeof error === 'object' &&
           error !== null &&
           ('details' in error &&
            (error as { details?: { error?: { code?: string } } }).details?.error?.code?.includes('LIMIT_EXCEEDED'));
  }

  private getPlanLimitUserMessage(error: { details?: { error?: { details?: { feature?: string; limit?: number; planType?: string } } } }): string {
    const details = error.details?.error?.details;
    if (!details) return 'You have reached your plan limit.';

    const feature = details.feature || 'feature';
    const limit = details.limit || 0;
    const planType = details.planType || 'current';

    const featureLabels: Record<string, string> = {
      maxWallets: 'wallet',
      maxAccounts: 'account',
      maxTransactions: 'transaction',
      maxCategories: 'category',
      maxBudgets: 'budget',
      maxGoals: 'goal'
    };

    const featureLabel = featureLabels[feature] || feature.replace('max', '').toLowerCase();

    return `You've reached your ${planType.toLowerCase()} plan limit of ${limit} ${featureLabel}${limit !== 1 ? 's' : ''}. Upgrade to add more.`;
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: AppError, context: string): void {
    const logData = {
      context,
      code: error.code,
      severity: error.severity,
      recoverable: error.recoverable,
      retryable: error.retryable,
      timestamp: error.timestamp
    };

    switch (error.severity) {
      case 'critical':
        logger.error(error.message, error.details, logData);
        break;
      case 'high':
        logger.error(error.message, error.details, logData);
        break;
      case 'medium':
        logger.warn(error.message, logData);
        break;
      case 'low':
        logger.info(error.message, logData);
        break;
    }
  }

  /**
   * Show user-friendly error toast
   */
  private showErrorToast(error: AppError): void {
    // This would integrate with your toast system
    // For now, just log to console in a user-friendly way
    if (error.severity === 'critical' || error.severity === 'high') {
      console.error('❌', error.userMessage);
    } else if (error.severity === 'medium') {
      console.warn('⚠️', error.userMessage);
    } else {
      console.info('ℹ️', error.userMessage);
    }
  }

  /**
   * Track error frequency for retry logic
   */
  private trackError(code: string): void {
    const now = Date.now();
    const count = (this.errorCounts.get(code) || 0) + 1;
    
    this.errorCounts.set(code, count);
    this.lastErrorTime.set(code, now);
  }

  /**
   * Clear error tracking (useful for tests or manual reset)
   */
  clearErrorTracking(): void {
    this.errorCounts.clear();
    this.lastErrorTime.clear();
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Utility functions
export function handleError(
  error: unknown, 
  context?: string, 
  options?: ErrorHandlingOptions
): AppError {
  return errorHandler.handleError(error, context, options);
}

export function handleCriticalError(error: unknown, context: string): never {
  return errorHandler.handleCriticalError(error, context);
}

export function shouldRetryError(error: AppError): boolean {
  return errorHandler.shouldRetry(error);
}

export function getErrorRecoveryActions(error: AppError, context: string): ErrorRecoveryAction[] {
  return errorHandler.getRecoveryActions(error, context);
}

// React hook for error handling
export function useErrorHandler() {
  return {
    handleError: (error: unknown, context?: string, options?: ErrorHandlingOptions) => 
      errorHandler.handleError(error, context, options),
    handleCriticalError: (error: unknown, context: string) => 
      errorHandler.handleCriticalError(error, context),
    shouldRetry: (error: AppError) => errorHandler.shouldRetry(error),
    getRecoveryActions: (error: AppError, context: string) => 
      errorHandler.getRecoveryActions(error, context)
  };
}

export default errorHandler;