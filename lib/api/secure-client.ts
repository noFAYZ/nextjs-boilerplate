/**
 * Secure API Client with Enhanced Security Features
 * Includes request/response interceptors, token refresh, rate limiting, and data sanitization
 */

import { ApiResponse, AUTH_ERROR_CODES, AuthError, BetterAuthResponse } from '../types';
import { logger } from '../utils/logger';
import { tokenRefreshManager } from '../auth/token-refresh';
import { bruteForceProtection } from '../security/brute-force-protection';
import { config, env } from '../config/env';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retries?: number;
  timeout?: number;
  rateLimitKey?: string;
}

interface SecurityHeaders {
  'X-Request-ID': string;
  'X-Client-Version': string;
  'X-Timestamp': string;
  'X-CSRF-Token'?: string;
}

interface RequestMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  retryCount: number;
  endpoint: string;
  method: string;
  statusCode?: number;
  error?: unknown;
}

class SecureApiClient {
  private baseURL: string;
  private token: string | null = null;
  private requestQueue: Map<string, Promise<unknown>> = new Map();
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map();
  private requestMetrics: RequestMetrics[] = [];
  private maxMetricsHistory = 100;

  constructor() {
    this.baseURL = env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    this.startPeriodicCleanup();
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    logger.debug('API client token updated');
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Sanitize sensitive data from request/response
   */
  private sanitizeData(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth', 'authorization',
      'session', 'cookie', 'pin', 'cvv', 'ssn', 'creditCard',
      'accountNumber', 'routingNumber', 'privateKey', 'apiKey'
    ];

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field =>
        lowerKey.includes(field.toLowerCase())
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate CSRF token (simplified example)
   */
  private generateCSRFToken(): string {
    return btoa(`${Date.now()}_${Math.random().toString(36)}`);
  }

  /**
   * Get authentication token from session
   */
  private async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      try {
        const { authClient } = await import('@/lib/auth-client');
        const result = await authClient.getSession();
        
        if (result && typeof result === 'object') {
          if ('data' in result && result.data?.session?.token) {
            return result.data.session.token;
          }
          if ('session' in result && (result as BetterAuthResponse).session?.token) {
            return (result as BetterAuthResponse).session!.token;
          }
        }
        
        return null;
      } catch (error) {
        logger.error('Failed to get auth token from session', error);
        return this.token;
      }
    }
    return this.token;
  }

  /**
   * Generate security headers
   */
  private async getSecurityHeaders(): Promise<SecurityHeaders> {
    return {
      'X-Request-ID': this.generateRequestId(),
      'X-Client-Version': process.env.npm_package_version || '1.0.0',
      'X-Timestamp': new Date().toISOString(),
      'X-CSRF-Token': this.generateCSRFToken(),
    };
  }

  /**
   * Get complete headers for request
   */
  private async getHeaders(skipAuth = false): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add security headers
    const securityHeaders = await this.getSecurityHeaders();
    Object.assign(headers, securityHeaders);

    // Add authentication header
    if (!skipAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add environment-specific headers
    if (config.isDevelopment) {
      headers['X-Environment'] = 'development';
    }

    return headers;
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(rateLimitKey: string): boolean {
    const limit = config.rateLimiting.api;
    const windowMs = 15 * 60 * 1000; // 15 minutes

    const now = Date.now();
    const entry = this.rateLimitCache.get(rateLimitKey);

    if (!entry) {
      this.rateLimitCache.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (now > entry.resetTime) {
      this.rateLimitCache.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count >= limit) {
      logger.warn('Rate limit exceeded', { rateLimitKey, count: entry.count, limit });
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Handle HTTP errors with enhanced error information
   */
  private handleError(error: unknown, endpoint: string, method: string): AuthError {
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      
      // Network errors
      if (err.name === 'NetworkError' || err.name === 'TypeError' || !err.response) {
        logger.error('Network error occurred', { endpoint, method, error: err.message });
        return {
          code: AUTH_ERROR_CODES.NETWORK_ERROR,
          message: 'Network error. Please check your connection and try again.',
        };
      }

      // HTTP status errors
      if (err.response) {
        const response = err.response as { status: number; statusText: string };
        const status = response.status;
        const statusText = response.statusText;

        logger.error('HTTP error occurred', {
          endpoint,
          method,
          status,
          statusText,
          error: this.sanitizeData(err.details),
        });

        switch (status) {
          case 400:
            return {
              code: 'BAD_REQUEST',
              message: 'Invalid request. Please check your input.',
            };
          case 401:
            return {
              code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
              message: 'Authentication required. Please log in again.',
            };
          case 403:
            return {
              code: 'FORBIDDEN',
              message: 'You do not have permission to access this resource.',
            };
          case 404:
            return {
              code: 'NOT_FOUND',
              message: 'The requested resource was not found.',
            };
          case 422:
            return {
              code: 'VALIDATION_ERROR',
              message: (err.details as { message?: string })?.message || 'Validation failed.',
            };
          case 429:
            return {
              code: AUTH_ERROR_CODES.RATE_LIMITED,
              message: 'Too many requests. Please try again later.',
            };
          case 500:
            return {
              code: 'SERVER_ERROR',
              message: 'Server error. Please try again later.',
            };
          case 503:
            return {
              code: 'SERVICE_UNAVAILABLE',
              message: 'Service temporarily unavailable. Please try again later.',
            };
          default:
            return {
              code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
              message: `Request failed with status ${status}`,
            };
        }
      }

      return {
        code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
        message: (err.message as string) || 'An unexpected error occurred.',
        details: this.sanitizeData(error),
      };
    }

    logger.error('Unknown error occurred', { endpoint, method, error });
    return {
      code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
      message: 'An unexpected error occurred.',
    };
  }

  /**
   * Implement request timeout
   */
  private createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeoutMs);
    });
  }

  /**
   * Record request metrics
   */
  private recordMetrics(metrics: RequestMetrics): void {
    if (metrics.endTime) {
      metrics.duration = metrics.endTime - metrics.startTime;
    }

    this.requestMetrics.push(metrics);

    // Keep only recent metrics
    if (this.requestMetrics.length > this.maxMetricsHistory) {
      this.requestMetrics.shift();
    }

    // Log slow requests
    if (metrics.duration && metrics.duration > 5000) {
      logger.warn('Slow API request detected', {
        endpoint: metrics.endpoint,
        method: metrics.method,
        duration: metrics.duration,
      });
    }

    // Send to analytics in production
    if (config.isProduction && metrics.duration) {
      logger.performance('api_request', metrics.duration, {
        endpoint: metrics.endpoint,
        method: metrics.method,
        statusCode: metrics.statusCode,
      });
    }
  }

  /**
   * Core request method with all security features
   */
  async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      skipAuth = false,
      retries = 3,
      timeout = 30000,
      rateLimitKey = endpoint,
      ...fetchOptions
    } = options;

    const method = fetchOptions.method || 'GET';
    const requestId = this.generateRequestId();

    // Check rate limiting
    if (!this.checkRateLimit(rateLimitKey)) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.RATE_LIMITED,
          message: 'Too many requests. Please try again later.',
        },
      };
    }

    // Initialize metrics
    const metrics: RequestMetrics = {
      startTime: Date.now(),
      retryCount: 0,
      endpoint,
      method,
    };

    // Deduplicate identical requests
    const requestKey = `${method}:${endpoint}:${JSON.stringify(fetchOptions.body || {})}`;
    if (this.requestQueue.has(requestKey)) {
      logger.debug('Returning cached request promise', { endpoint, method });
      return this.requestQueue.get(requestKey) as Promise<ApiResponse<T>>;
    }

    const requestPromise = this.executeRequest<T>(
      endpoint,
      { ...fetchOptions, skipAuth, timeout },
      metrics,
      retries
    );

    this.requestQueue.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(requestKey);
      this.recordMetrics(metrics);
    }
  }

  /**
   * Execute the actual request with retry logic
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestConfig,
    metrics: RequestMetrics,
    maxRetries: number
  ): Promise<ApiResponse<T>> {
    const { skipAuth, timeout, ...fetchOptions } = options;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      metrics.retryCount = attempt;

      try {
        const url = `${this.baseURL}${endpoint}`;
        const headers = await this.getHeaders(skipAuth);

        logger.debug('Making API request', {
          url: this.sanitizeData(url),
          method: fetchOptions.method || 'GET',
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
        });

        const fetchPromise = fetch(url, {
          ...fetchOptions,
          headers,
          credentials: 'include',
        });

        // Add timeout
        const timeoutPromise = this.createTimeoutPromise(timeout || 30000);
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        metrics.statusCode = response.status;

        // Handle token refresh for 401 errors
        if (response.status === 401 && !skipAuth && attempt === 0) {
          logger.info('Received 401, attempting token refresh');
          const refreshSuccess = await tokenRefreshManager.forceRefresh();
          
          if (refreshSuccess) {
            logger.info('Token refreshed, retrying request');
            continue; // Retry with new token
          } else {
            logger.error('Token refresh failed, cannot retry request');
          }
        }

        const responseText = await response.text();
        let data: Record<string, unknown>;

        try {
          data = responseText ? JSON.parse(responseText) as Record<string, unknown> : {};
        } catch {
          data = { message: responseText };
        }

        metrics.endTime = Date.now();

        if (!response.ok) {
          // Check if this is a retryable error
          const isRetryable = response.status >= 500 || response.status === 429;
          
          if (isRetryable && attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff
            logger.warn('Request failed, retrying', {
              endpoint,
              attempt: attempt + 1,
              status: response.status,
              delay,
            });
            
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw {
            response,
            message: (data.error as { message?: string })?.message || (data.message as string) || 'Request failed',
            details: data,
          };
        }

        logger.debug('API request successful', {
          endpoint,
          method: fetchOptions.method || 'GET',
          status: response.status,
          duration: metrics.endTime - metrics.startTime,
        });

        return data as unknown as ApiResponse<T>;

      } catch (error) {
        metrics.error = error;

        // If this is the last attempt or a non-retryable error, throw
        if (attempt >= maxRetries) {
          metrics.endTime = Date.now();
          const authError = this.handleError(error, endpoint, fetchOptions.method || 'GET');
          
          return {
            success: false,
            error: {
              code: authError.code,
              message: authError.message,
              details: authError.details,
            },
          };
        }

        // Wait before retry
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        logger.warn('Request failed, retrying', {
          endpoint,
          attempt: attempt + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
          delay,
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Should never reach here, but just in case
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
        message: 'Request failed after all retries',
      },
    };
  }

  /**
   * Convenience methods
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Get request metrics for monitoring
   */
  getMetrics(): {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    slowRequestCount: number;
  } {
    const total = this.requestMetrics.length;
    if (total === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        slowRequestCount: 0,
      };
    }

    const totalTime = this.requestMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const errorCount = this.requestMetrics.filter(m => m.error || (m.statusCode && m.statusCode >= 400)).length;
    const slowRequests = this.requestMetrics.filter(m => m.duration && m.duration > 5000).length;

    return {
      totalRequests: total,
      averageResponseTime: totalTime / total,
      errorRate: errorCount / total,
      slowRequestCount: slowRequests,
    };
  }

  /**
   * Clear cached data and metrics
   */
  clearCache(): void {
    this.requestQueue.clear();
    this.rateLimitCache.clear();
    this.requestMetrics.length = 0;
    logger.info('API client cache cleared');
  }

  /**
   * Periodic cleanup of expired cache entries
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      
      // Clean up rate limit cache
      for (const [key, entry] of this.rateLimitCache.entries()) {
        if (now > entry.resetTime) {
          this.rateLimitCache.delete(key);
        }
      }

      logger.debug('Periodic cache cleanup completed', {
        rateLimitEntries: this.rateLimitCache.size,
        queuedRequests: this.requestQueue.size,
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}

// Export singleton instance
export const secureApiClient = new SecureApiClient();
export default secureApiClient;