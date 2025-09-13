/**
 * Automatic Token Refresh System
 * Handles token refresh, retry logic, and session management
 */

import { authClient } from '@/lib/auth-client';
import { logger } from '@/lib/utils/logger';
import { config } from '@/lib/config/env';

interface RefreshState {
  isRefreshing: boolean;
  refreshPromise: Promise<boolean> | null;
  lastRefresh: number;
  failureCount: number;
  nextRetry: number;
}

interface TokenRefreshOptions {
  refreshThreshold?: number; // Time before expiry to refresh (ms)
  maxRetries?: number;
  retryDelay?: number;
  onRefreshSuccess?: (token: any) => void;
  onRefreshFailure?: (error: any) => void;
  onSessionExpired?: () => void;
}

class TokenRefreshManager {
  private state: RefreshState = {
    isRefreshing: false,
    refreshPromise: null,
    lastRefresh: 0,
    failureCount: 0,
    nextRetry: 0,
  };

  private refreshTimer: NodeJS.Timeout | null = null;
  private checkInterval: NodeJS.Interval | null = null;
  private options: Required<TokenRefreshOptions>;

  constructor(options: TokenRefreshOptions = {}) {
    this.options = {
      refreshThreshold: options.refreshThreshold ?? config.security.tokenRefreshWindow,
      maxRetries: options.maxRetries ?? 3,
      retryDelay: options.retryDelay ?? 5000, // 5 seconds
      onRefreshSuccess: options.onRefreshSuccess ?? (() => {}),
      onRefreshFailure: options.onRefreshFailure ?? (() => {}),
      onSessionExpired: options.onSessionExpired ?? (() => {}),
    };
  }

  /**
   * Start the automatic token refresh monitoring
   */
  start(): void {
    if (this.checkInterval) {
      return; // Already started
    }

    logger.info('Starting automatic token refresh monitoring');

    // Check token status every minute
    this.checkInterval = setInterval(() => {
      this.checkAndRefreshToken();
    }, 60 * 1000);

    // Initial check
    this.checkAndRefreshToken();
  }

  /**
   * Stop the automatic token refresh monitoring
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    logger.info('Stopped automatic token refresh monitoring');
  }

  /**
   * Check if token needs refresh and refresh if necessary
   */
  private async checkAndRefreshToken(): Promise<void> {
    try {
      const sessionData = await authClient.getSession();
      const session = sessionData?.data;

      if (!session?.user) {
        logger.debug('No active session found, skipping token refresh');
        return;
      }

      // Get token expiration info
      const tokenInfo = await this.getTokenInfo();
      if (!tokenInfo) {
        logger.warn('Unable to get token information');
        return;
      }

      const { expiresAt, isExpired, timeUntilExpiry } = tokenInfo;

      // If token is already expired
      if (isExpired) {
        logger.warn('Token has already expired, attempting refresh');
        await this.refreshToken();
        return;
      }

      // If token is within refresh threshold
      if (timeUntilExpiry <= this.options.refreshThreshold) {
        logger.info('Token approaching expiration, refreshing preemptively', {
          timeUntilExpiry,
          refreshThreshold: this.options.refreshThreshold,
        });
        await this.refreshToken();
        return;
      }

      // Schedule next check at the refresh threshold
      if (!this.refreshTimer && timeUntilExpiry > this.options.refreshThreshold) {
        const scheduleIn = timeUntilExpiry - this.options.refreshThreshold;
        this.refreshTimer = setTimeout(() => {
          this.refreshTimer = null;
          this.checkAndRefreshToken();
        }, scheduleIn);

        logger.debug('Scheduled next token refresh check', {
          scheduleInMs: scheduleIn,
        });
      }
    } catch (error) {
      logger.error('Error checking token status', error);
    }
  }

  /**
   * Get token information including expiration
   */
  private async getTokenInfo(): Promise<{
    expiresAt: number;
    isExpired: boolean;
    timeUntilExpiry: number;
  } | null> {
    try {
      // This is a simplified example - adjust based on your token structure
      const sessionData = await authClient.getSession();
      const session = sessionData?.data;

      if (!session?.user) {
        return null;
      }

      // Extract token expiration from the session
      // This will depend on your auth implementation
      const expiresAt = session.expiresAt || Date.now() + (30 * 60 * 1000); // Default 30 mins if not available
      const now = Date.now();
      const isExpired = now >= expiresAt;
      const timeUntilExpiry = Math.max(0, expiresAt - now);

      return {
        expiresAt,
        isExpired,
        timeUntilExpiry,
      };
    } catch (error) {
      logger.error('Error getting token info', error);
      return null;
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<boolean> {
    // If already refreshing, return the existing promise
    if (this.state.isRefreshing && this.state.refreshPromise) {
      return this.state.refreshPromise;
    }

    // Check if we should retry based on failure count and retry delay
    const now = Date.now();
    if (this.state.failureCount > 0 && now < this.state.nextRetry) {
      logger.debug('Skipping token refresh due to retry delay', {
        failureCount: this.state.failureCount,
        nextRetryIn: this.state.nextRetry - now,
      });
      return false;
    }

    // Check if max retries exceeded
    if (this.state.failureCount >= this.options.maxRetries) {
      logger.error('Max token refresh retries exceeded, session expired');
      this.handleSessionExpired();
      return false;
    }

    this.state.isRefreshing = true;
    this.state.refreshPromise = this.performRefresh();

    return this.state.refreshPromise;
  }

  /**
   * Perform the actual token refresh
   */
  private async performRefresh(): Promise<boolean> {
    try {
      logger.info('Attempting to refresh authentication token', {
        attempt: this.state.failureCount + 1,
        maxRetries: this.options.maxRetries,
      });

      const refreshResult = await authClient.refresh();

      if (refreshResult?.data) {
        // Success
        this.state.lastRefresh = Date.now();
        this.state.failureCount = 0;
        this.state.nextRetry = 0;
        this.state.isRefreshing = false;
        this.state.refreshPromise = null;

        logger.info('Token refresh successful');
        this.options.onRefreshSuccess(refreshResult.data);

        return true;
      } else {
        throw new Error('Refresh returned no data');
      }
    } catch (error) {
      // Failure
      this.state.failureCount += 1;
      this.state.nextRetry = Date.now() + (this.options.retryDelay * this.state.failureCount);
      this.state.isRefreshing = false;
      this.state.refreshPromise = null;

      logger.error('Token refresh failed', error, {
        attempt: this.state.failureCount,
        maxRetries: this.options.maxRetries,
        nextRetryIn: this.state.nextRetry - Date.now(),
      });

      this.options.onRefreshFailure(error);

      // If max retries exceeded, handle session expiration
      if (this.state.failureCount >= this.options.maxRetries) {
        this.handleSessionExpired();
      }

      return false;
    }
  }

  /**
   * Handle session expiration
   */
  private handleSessionExpired(): void {
    logger.warn('Session has expired, triggering expiration handler');
    
    // Reset state
    this.state.failureCount = 0;
    this.state.nextRetry = 0;
    this.state.isRefreshing = false;
    this.state.refreshPromise = null;

    // Stop monitoring
    this.stop();

    // Trigger expiration callback
    this.options.onSessionExpired();
  }

  /**
   * Force an immediate token refresh
   */
  async forceRefresh(): Promise<boolean> {
    // Reset failure state to allow immediate refresh
    this.state.failureCount = 0;
    this.state.nextRetry = 0;
    
    return this.refreshToken();
  }

  /**
   * Get current refresh state
   */
  getState(): {
    isRefreshing: boolean;
    lastRefresh: number;
    failureCount: number;
    canRetry: boolean;
    nextRetryIn: number;
  } {
    const now = Date.now();
    return {
      isRefreshing: this.state.isRefreshing,
      lastRefresh: this.state.lastRefresh,
      failureCount: this.state.failureCount,
      canRetry: this.state.failureCount < this.options.maxRetries,
      nextRetryIn: Math.max(0, this.state.nextRetry - now),
    };
  }

  /**
   * Reset the refresh state
   */
  reset(): void {
    this.state = {
      isRefreshing: false,
      refreshPromise: null,
      lastRefresh: 0,
      failureCount: 0,
      nextRetry: 0,
    };

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Export singleton instance
export const tokenRefreshManager = new TokenRefreshManager({
  onRefreshSuccess: (token) => {
    logger.info('Token refresh successful, session extended');
  },
  onRefreshFailure: (error) => {
    logger.error('Token refresh failed', error);
  },
  onSessionExpired: () => {
    logger.warn('Session expired, redirecting to login');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?reason=session_expired';
    }
  },
});

// Hook for using token refresh in components
export function useTokenRefresh() {
  return {
    start: () => tokenRefreshManager.start(),
    stop: () => tokenRefreshManager.stop(),
    forceRefresh: () => tokenRefreshManager.forceRefresh(),
    getState: () => tokenRefreshManager.getState(),
    reset: () => tokenRefreshManager.reset(),
  };
}

// Auto-start token refresh when module loads (client-side only)
if (typeof window !== 'undefined') {
  // Start after a brief delay to allow auth initialization
  setTimeout(() => {
    tokenRefreshManager.start();
  }, 1000);
}

export default tokenRefreshManager;