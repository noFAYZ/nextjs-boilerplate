/**
 * Secure logging utility for MoneyMappr Frontend
 * Prevents data leakage in production while maintaining development debugging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogData = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: LogData;
  userId?: string;
  sessionId?: string;
}

class SecureLogger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  // Sensitive fields that should never be logged
  private sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'authorization',
    'session',
    'cookie',
    'email',
    'phone',
    'ssn',
    'creditCard',
    'accountNumber',
    'routingNumber',
    'pin',
    'cvv',
    'apiKey',
    'privateKey',
    'accessToken',
    'refreshToken',
    'jwt',
    'bearer'
  ];

  /**
   * Sanitize data by removing sensitive information
   */
  private sanitizeData(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // Check if key contains sensitive information
      const isSensitive = this.sensitiveFields.some(field => 
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
   * Create a log entry with metadata
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: LogData,
    userId?: string,
    sessionId?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data: data ? this.sanitizeData(data) : undefined,
      userId,
      sessionId
    };
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, data?: LogData, userId?: string, sessionId?: string): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry('debug', message, data, userId, sessionId);
      console.debug('[DEBUG]', entry.timestamp, entry.message, entry.data || '');
    }
  }

  /**
   * Log info messages
   */
  info(message: string, data?: LogData, userId?: string, sessionId?: string): void {
    const entry = this.createLogEntry('info', message, data, userId, sessionId);
    
    if (this.isDevelopment) {
      console.info('[INFO]', entry.timestamp, entry.message, entry.data || '');
    } else if (this.isProduction) {
      // In production, send to logging service (e.g., Sentry, LogRocket)
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: LogData, userId?: string, sessionId?: string): void {
    const entry = this.createLogEntry('warn', message, data, userId, sessionId);
    
    if (this.isDevelopment) {
      console.warn('[WARN]', entry.timestamp, entry.message, entry.data || '');
    } else if (this.isProduction) {
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, data?: LogData, userId?: string, sessionId?: string): void {
    const errorData = error instanceof Error 
      ? { 
          name: error.name, 
          message: error.message, 
          stack: this.isDevelopment ? error.stack : undefined 
        }
      : error;

    const entry = this.createLogEntry('error', message, {
      ...data,
      error: errorData
    }, userId, sessionId);
    
    if (this.isDevelopment) {
      // Reduce noise from expected network errors when backend isn't running
      const isNetworkError = message.includes('Network error') || message.includes('Failed to fetch') || message.includes('fetch');
      if (isNetworkError) {
        console.warn('[NETWORK]', entry.timestamp, entry.message, '(Backend server not available)');
      } else {
        console.error('[ERROR]', entry.timestamp, entry.message, entry.data || '');
      }
    } else if (this.isProduction) {
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Send logs to external logging service in production
   */
  private sendToLoggingService(entry: LogEntry): void {
    try {
      // Send to your preferred logging service
      // Examples: Sentry, LogRocket, Datadog, etc.
      if (typeof window !== 'undefined' && window.gtag) {
        // Example: Send to Google Analytics
        window.gtag('event', 'log_entry', {
          custom_parameter: {
            level: entry.level,
            message: entry.message,
            timestamp: entry.timestamp
          }
        });
      }

      // Example: Send to Sentry (if configured)
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).Sentry) {
        ((window as Record<string, unknown>).Sentry as { addBreadcrumb: (breadcrumb: Record<string, unknown>) => void }).addBreadcrumb({
          message: entry.message,
          level: entry.level,
          data: entry.data,
          timestamp: entry.timestamp
        });
      }
    } catch (err) {
      // Fail silently in production to avoid cascading errors
      if (this.isDevelopment) {
        console.error('Failed to send log to service:', err);
      }
    }
  }

  /**
   * Log user actions for analytics (production-safe)
   */
  userAction(action: string, data?: LogData, userId?: string): void {
    const sanitizedData = data ? this.sanitizeData(data) : undefined;
    
    if (this.isDevelopment) {
      console.log('[USER_ACTION]', action, sanitizedData);
    } else if (this.isProduction) {
      // Send to analytics service
      this.sendToLoggingService({
        level: 'info',
        message: `User Action: ${action}`,
        timestamp: new Date().toISOString(),
        data: sanitizedData,
        userId
      });
    }
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, data?: LogData): void {
    if (this.isDevelopment) {
      console.log('[PERFORMANCE]', metric, value, data);
    } else if (this.isProduction && typeof window !== 'undefined') {
      // Send to performance monitoring service
      if ((window as Record<string, unknown>).gtag) {
        ((window as Record<string, unknown>).gtag as (...args: unknown[]) => void)('event', 'timing_complete', {
          name: metric,
          value: Math.round(value),
          ...data
        });
      }
    }
  }
}

// Export singleton instance
export const logger = new SecureLogger();

// Convenience exports for common use cases
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logUserAction = logger.userAction.bind(logger);
export const logPerformance = logger.performance.bind(logger);

// Development-only logger that's completely silent in production
export const devLog = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[DEV_ERROR]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[DEV_WARN]', ...args);
    }
  }
};

export default logger;