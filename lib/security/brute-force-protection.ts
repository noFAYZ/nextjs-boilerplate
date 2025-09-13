/**
 * Client-Side Brute Force Protection
 * Prevents rapid authentication attempts and implements progressive delays
 */

import { logger } from '@/lib/utils/logger';
import { config } from '@/lib/config/env';

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
}

interface BruteForceOptions {
  maxAttempts?: number;
  windowMs?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  blockDurationMs?: number;
}

class BruteForceProtection {
  private attempts: Map<string, AttemptRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  private readonly options: Required<BruteForceOptions>;

  constructor(options: BruteForceOptions = {}) {
    this.options = {
      maxAttempts: options.maxAttempts ?? config.security.maxLoginAttempts,
      windowMs: options.windowMs ?? config.security.loginAttemptWindow,
      baseDelayMs: options.baseDelayMs ?? 1000, // 1 second
      maxDelayMs: options.maxDelayMs ?? 30000, // 30 seconds
      blockDurationMs: options.blockDurationMs ?? 15 * 60 * 1000, // 15 minutes
    };

    // Clean up old attempts every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldAttempts();
    }, 5 * 60 * 1000);
  }

  /**
   * Get a unique identifier for the client
   */
  private getClientId(): string {
    // Use multiple factors to identify the client
    const factors = [
      typeof window !== 'undefined' ? window.location.hostname : 'server',
      typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      typeof window !== 'undefined' ? window.screen?.width + 'x' + window.screen?.height : 'unknown',
    ];

    // Simple hash function for client identification
    return factors.join('|').split('').reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0).toString(16);
  }

  /**
   * Check if an attempt is allowed for the current client
   */
  async checkAttempt(identifier?: string): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    nextAttemptIn: number;
    reason?: string;
  }> {
    const clientId = identifier || this.getClientId();
    const now = Date.now();
    const record = this.attempts.get(clientId);

    // No previous attempts - allow
    if (!record) {
      return {
        allowed: true,
        remainingAttempts: this.options.maxAttempts - 1,
        nextAttemptIn: 0,
      };
    }

    // Check if currently blocked
    if (record.blockedUntil && now < record.blockedUntil) {
      const timeRemaining = record.blockedUntil - now;
      logger.warn('Authentication attempt blocked', {
        clientId,
        attemptsCount: record.count,
        timeRemaining,
      });

      return {
        allowed: false,
        remainingAttempts: 0,
        nextAttemptIn: timeRemaining,
        reason: 'temporarily_blocked',
      };
    }

    // Check if outside the window (reset attempts)
    if (now - record.firstAttempt > this.options.windowMs) {
      this.attempts.delete(clientId);
      return {
        allowed: true,
        remainingAttempts: this.options.maxAttempts - 1,
        nextAttemptIn: 0,
      };
    }

    // Check if too many attempts within the window
    if (record.count >= this.options.maxAttempts) {
      const blockUntil = now + this.options.blockDurationMs;
      record.blockedUntil = blockUntil;
      this.attempts.set(clientId, record);

      logger.warn('Client blocked due to too many authentication attempts', {
        clientId,
        attemptsCount: record.count,
        blockDuration: this.options.blockDurationMs,
      });

      return {
        allowed: false,
        remainingAttempts: 0,
        nextAttemptIn: this.options.blockDurationMs,
        reason: 'max_attempts_exceeded',
      };
    }

    // Calculate progressive delay
    const attemptDelay = this.calculateDelay(record.count);
    const timeSinceLastAttempt = now - record.lastAttempt;

    if (timeSinceLastAttempt < attemptDelay) {
      const nextAttemptIn = attemptDelay - timeSinceLastAttempt;
      return {
        allowed: false,
        remainingAttempts: this.options.maxAttempts - record.count,
        nextAttemptIn,
        reason: 'rate_limited',
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.options.maxAttempts - record.count - 1,
      nextAttemptIn: 0,
    };
  }

  /**
   * Record a failed authentication attempt
   */
  async recordFailedAttempt(identifier?: string): Promise<void> {
    const clientId = identifier || this.getClientId();
    const now = Date.now();
    const record = this.attempts.get(clientId);

    if (!record) {
      this.attempts.set(clientId, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
    } else {
      // Reset if outside window
      if (now - record.firstAttempt > this.options.windowMs) {
        this.attempts.set(clientId, {
          count: 1,
          firstAttempt: now,
          lastAttempt: now,
        });
      } else {
        record.count += 1;
        record.lastAttempt = now;
        this.attempts.set(clientId, record);
      }
    }

    logger.warn('Failed authentication attempt recorded', {
      clientId,
      attemptsCount: this.attempts.get(clientId)?.count,
    });
  }

  /**
   * Record a successful authentication attempt (resets the counter)
   */
  async recordSuccessfulAttempt(identifier?: string): Promise<void> {
    const clientId = identifier || this.getClientId();
    this.attempts.delete(clientId);

    logger.info('Successful authentication - attempts counter reset', {
      clientId,
    });
  }

  /**
   * Calculate progressive delay based on attempt count
   */
  private calculateDelay(attemptCount: number): number {
    // Exponential backoff: delay = baseDelay * (2 ^ attemptCount)
    const delay = this.options.baseDelayMs * Math.pow(2, attemptCount);
    return Math.min(delay, this.options.maxDelayMs);
  }

  /**
   * Clean up old attempt records
   */
  private cleanupOldAttempts(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [clientId, record] of this.attempts.entries()) {
      const isExpired = now - record.firstAttempt > this.options.windowMs;
      const isNotBlocked = !record.blockedUntil || now > record.blockedUntil;

      if (isExpired && isNotBlocked) {
        expiredIds.push(clientId);
      }
    }

    expiredIds.forEach(id => this.attempts.delete(id));

    if (expiredIds.length > 0) {
      logger.debug('Cleaned up expired brute force records', {
        cleanedCount: expiredIds.length,
        remainingCount: this.attempts.size,
      });
    }
  }

  /**
   * Get current attempt statistics for a client
   */
  getAttemptStats(identifier?: string): {
    attemptsCount: number;
    remainingAttempts: number;
    isBlocked: boolean;
    blockedUntil?: number;
    nextAttemptIn: number;
  } {
    const clientId = identifier || this.getClientId();
    const record = this.attempts.get(clientId);
    const now = Date.now();

    if (!record) {
      return {
        attemptsCount: 0,
        remainingAttempts: this.options.maxAttempts,
        isBlocked: false,
        nextAttemptIn: 0,
      };
    }

    const isBlocked = Boolean(record.blockedUntil && now < record.blockedUntil);
    const nextAttemptDelay = isBlocked
      ? record.blockedUntil! - now
      : Math.max(0, this.calculateDelay(record.count) - (now - record.lastAttempt));

    return {
      attemptsCount: record.count,
      remainingAttempts: Math.max(0, this.options.maxAttempts - record.count),
      isBlocked,
      blockedUntil: record.blockedUntil,
      nextAttemptIn: nextAttemptDelay,
    };
  }

  /**
   * Reset all attempts for a client (admin function)
   */
  resetAttempts(identifier?: string): void {
    const clientId = identifier || this.getClientId();
    this.attempts.delete(clientId);
    logger.info('Brute force attempts reset for client', { clientId });
  }

  /**
   * Destroy the brute force protection instance
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.attempts.clear();
  }
}

// Export singleton instance
export const bruteForceProtection = new BruteForceProtection();

// Hook for using brute force protection in components
export function useBruteForceProtection() {
  return {
    checkAttempt: bruteForceProtection.checkAttempt.bind(bruteForceProtection),
    recordFailedAttempt: bruteForceProtection.recordFailedAttempt.bind(bruteForceProtection),
    recordSuccessfulAttempt: bruteForceProtection.recordSuccessfulAttempt.bind(bruteForceProtection),
    getAttemptStats: bruteForceProtection.getAttemptStats.bind(bruteForceProtection),
    resetAttempts: bruteForceProtection.resetAttempts.bind(bruteForceProtection),
  };
}

// Utility function to format time remaining
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '0s';
  
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export default bruteForceProtection;