/**
 * Query Analytics & Error Tracking
 *
 * Comprehensive error tracking, performance monitoring, and analytics for queries and mutations.
 * Integrates with monitoring services (Sentry, etc.) and provides local metrics.
 */

import type { QueryClient } from '@tanstack/react-query';

// ============================================================================
// TYPES
// ============================================================================

export interface QueryError {
  id: string;
  timestamp: number;
  type: 'query_error' | 'mutation_error' | 'network_error' | 'timeout' | 'validation_error';
  queryKey?: unknown[];
  mutationType?: string;
  error: {
    message: string;
    code?: string;
    status?: number;
    stack?: string;
  };
  context?: {
    variables?: unknown;
    retries?: number;
    duration?: number;
  };
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface QueryMetrics {
  totalQueries: number;
  totalMutations: number;
  totalErrors: number;
  cacheHitRate: number;
  avgQueryTime: number;
  avgMutationTime: number;
  errorRate: number;
  networkErrors: number;
  timeoutErrors: number;
  lastUpdated: number;
}

export interface MutationAnalytics {
  mutationType: string;
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  avgDuration: number;
  successRate: number;
  errors: Map<string, number>; // error message -> count
}

export interface AnalyticsConfig {
  /** Enable analytics collection */
  enabled?: boolean;
  /** Maximum errors to keep in memory */
  maxErrorsStored?: number;
  /** Report errors to external service */
  errorReporter?: (error: QueryError) => Promise<void>;
  /** Sample rate for analytics (0-1) */
  sampleRate?: number;
  /** User ID for context */
  userId?: string;
  /** Environment for context */
  environment?: string;
  /** Release version for context */
  release?: string;
}

// ============================================================================
// ANALYTICS MANAGER
// ============================================================================

export function createAnalyticsManager(config: AnalyticsConfig = {}) {
  const {
    enabled = true,
    maxErrorsStored = 100,
    errorReporter,
    sampleRate = 1,
    userId,
    environment = process.env.NODE_ENV,
    release,
  } = config;

  const errors: QueryError[] = [];
  const mutationAnalytics = new Map<string, MutationAnalytics>();
  const queryTiming = new Map<string, number[]>();
  const mutationTiming = new Map<string, number[]>();

  // ============================================================================
  // ERROR TRACKING
  // ============================================================================

  const recordError = async (error: Omit<QueryError, 'id' | 'timestamp'>) => {
    if (!enabled) return;

    const queryError: QueryError = {
      ...error,
      id: `${error.type}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      userId,
    };

    // Keep errors in memory
    errors.push(queryError);
    if (errors.length > maxErrorsStored) {
      errors.shift();
    }

    // Report to external service
    if (errorReporter && Math.random() < sampleRate) {
      try {
        await errorReporter(queryError);
      } catch (err) {
        console.error('Failed to report error:', err);
      }
    }

    // Log to console in development
    if (environment === 'development') {
      console.error('[Query Error]', queryError);
    }
  };

  const recordQueryError = (
    error: unknown,
    queryKey: unknown[],
    duration?: number
  ) => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Determine error type
    let type: QueryError['type'] = 'query_error';
    let status: number | undefined;

    if (error instanceof Error) {
      if (error.message.includes('timeout')) type = 'timeout';
      else if (error.message.includes('network')) type = 'network_error';
    } else if (typeof error === 'object' && error !== null) {
      const err = error as any;
      status = err.status;
      if (err.status && err.status >= 400 && err.status < 500) {
        type = 'validation_error';
      } else if (!status) {
        type = 'network_error';
      }
    }

    recordError({
      type,
      queryKey,
      error: {
        message: errorMessage,
        status,
        stack: error instanceof Error ? error.stack : undefined,
      },
      context: { duration },
      severity: status && status >= 500 ? 'critical' : 'high',
    });
  };

  const recordMutationError = (
    mutationType: string,
    error: unknown,
    variables?: unknown,
    duration?: number
  ) => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    recordError({
      type: 'mutation_error',
      mutationType,
      error: { message: errorMessage, stack: error instanceof Error ? error.stack : undefined },
      context: { variables, duration },
      severity: 'high',
    });

    // Update mutation analytics
    updateMutationAnalytics(mutationType, false, duration || 0, errorMessage);
  };

  // ============================================================================
  // TIMING METRICS
  // ============================================================================

  const recordQueryTiming = (queryKey: unknown[], duration: number) => {
    const key = JSON.stringify(queryKey);
    if (!queryTiming.has(key)) {
      queryTiming.set(key, []);
    }
    queryTiming.get(key)!.push(duration);

    // Keep only last 100 measurements
    const timings = queryTiming.get(key)!;
    if (timings.length > 100) {
      timings.shift();
    }
  };

  const recordMutationTiming = (mutationType: string, duration: number) => {
    if (!mutationTiming.has(mutationType)) {
      mutationTiming.set(mutationType, []);
    }
    mutationTiming.get(mutationType)!.push(duration);

    // Keep only last 100 measurements
    const timings = mutationTiming.get(mutationType)!;
    if (timings.length > 100) {
      timings.shift();
    }

    updateMutationAnalytics(mutationType, true, duration);
  };

  // ============================================================================
  // MUTATION ANALYTICS
  // ============================================================================

  const updateMutationAnalytics = (
    mutationType: string,
    success: boolean,
    duration: number,
    errorMessage?: string
  ) => {
    if (!mutationAnalytics.has(mutationType)) {
      mutationAnalytics.set(mutationType, {
        mutationType,
        totalAttempts: 0,
        successCount: 0,
        failureCount: 0,
        avgDuration: 0,
        successRate: 0,
        errors: new Map(),
      });
    }

    const analytics = mutationAnalytics.get(mutationType)!;

    // Update counters
    analytics.totalAttempts++;
    if (success) {
      analytics.successCount++;
    } else {
      analytics.failureCount++;
      if (errorMessage) {
        analytics.errors.set(
          errorMessage,
          (analytics.errors.get(errorMessage) || 0) + 1
        );
      }
    }

    // Update averages
    analytics.avgDuration =
      (analytics.avgDuration * (analytics.totalAttempts - 1) + duration) /
      analytics.totalAttempts;

    // Update success rate
    analytics.successRate = analytics.successCount / analytics.totalAttempts;
  };

  // ============================================================================
  // METRICS REPORTING
  // ============================================================================

  const getMetrics = (): QueryMetrics => {
    const allTimings = Array.from(queryTiming.values()).flat();
    const allMutationTimings = Array.from(mutationTiming.values()).flat();

    const avgQueryTime =
      allTimings.length > 0 ? allTimings.reduce((a, b) => a + b, 0) / allTimings.length : 0;

    const avgMutationTime =
      allMutationTimings.length > 0
        ? allMutationTimings.reduce((a, b) => a + b, 0) / allMutationTimings.length
        : 0;

    const totalAttempts = Array.from(mutationAnalytics.values()).reduce(
      (sum, m) => sum + m.totalAttempts,
      0
    );

    const totalSuccesses = Array.from(mutationAnalytics.values()).reduce(
      (sum, m) => sum + m.successCount,
      0
    );

    return {
      totalQueries: queryTiming.size,
      totalMutations: mutationAnalytics.size,
      totalErrors: errors.length,
      cacheHitRate: 0, // Would need to track from QueryClient
      avgQueryTime,
      avgMutationTime,
      errorRate: totalAttempts > 0 ? 1 - totalSuccesses / totalAttempts : 0,
      networkErrors: errors.filter(e => e.type === 'network_error').length,
      timeoutErrors: errors.filter(e => e.type === 'timeout').length,
      lastUpdated: Date.now(),
    };
  };

  const getMutationAnalytics = (mutationType: string) => {
    return mutationAnalytics.get(mutationType);
  };

  const getAllMutationAnalytics = () => {
    return Array.from(mutationAnalytics.values());
  };

  const getErrors = (filter?: { type?: QueryError['type']; severity?: QueryError['severity'] }) => {
    if (!filter) return [...errors];

    return errors.filter(e => {
      if (filter.type && e.type !== filter.type) return false;
      if (filter.severity && e.severity !== filter.severity) return false;
      return true;
    });
  };

  const clearErrors = () => {
    errors.length = 0;
  };

  const getAverageQueryTime = (queryKey: unknown[]) => {
    const key = JSON.stringify(queryKey);
    const timings = queryTiming.get(key);
    if (!timings || timings.length === 0) return 0;
    return timings.reduce((a, b) => a + b, 0) / timings.length;
  };

  const getAverageMutationTime = (mutationType: string) => {
    const timings = mutationTiming.get(mutationType);
    if (!timings || timings.length === 0) return 0;
    return timings.reduce((a, b) => a + b, 0) / timings.length;
  };

  return {
    recordError,
    recordQueryError,
    recordMutationError,
    recordQueryTiming,
    recordMutationTiming,
    getMetrics,
    getMutationAnalytics,
    getAllMutationAnalytics,
    getErrors,
    clearErrors,
    getAverageQueryTime,
    getAverageMutationTime,
  };
}

// ============================================================================
// INTEGRATION WITH QUERY CLIENT
// ============================================================================

/**
 * Enable error tracking on QueryClient
 * Automatically captures query and mutation errors
 */
export function enableErrorTracking(
  queryClient: QueryClient,
  analytics: ReturnType<typeof createAnalyticsManager>
) {
  // Track mutation errors
  const originalMutate = queryClient.getMutationCache();

  queryClient.getMutationCache().subscribe((event: any) => {
    if (event.type === 'updated' && event.mutation?.state?.error) {
      const mutation = event.mutation;
      analytics.recordMutationError(
        String(mutation.options.mutationKey?.[0]),
        mutation.state.error
      );
    }
  });

  // Track query errors
  queryClient.getQueryCache().subscribe((event: any) => {
    if (event.type === 'updated' && event.query?.state?.error) {
      const query = event.query;
      analytics.recordQueryError(query.state.error, query.queryKey as unknown[]);
    }
  });
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Monitor query performance and log slow queries
 */
export function createPerformanceMonitor(
  analytics: ReturnType<typeof createAnalyticsManager>,
  slowQueryThresholdMs = 1000
) {
  return {
    checkSlowQueries: () => {
      const allAnalytics = analytics.getAllMutationAnalytics();
      return allAnalytics.filter(m => m.avgDuration > slowQueryThresholdMs);
    },

    reportSlowQueries: () => {
      const slowQueries = this.checkSlowQueries();
      if (slowQueries.length > 0) {
        console.warn('[Performance] Slow queries detected:', slowQueries);
      }
      return slowQueries;
    },

    getPerformanceReport: () => {
      const metrics = analytics.getMetrics();
      return {
        metrics,
        slowMutations: this.checkSlowQueries(),
        criticalErrors: analytics.getErrors({ severity: 'critical' }),
      };
    },
  };
}

// ============================================================================
// ERROR SEVERITY CLASSIFICATION
// ============================================================================

/**
 * Classify error severity for monitoring
 */
export function classifyErrorSeverity(
  error: unknown,
  context: { retries?: number; type?: string } = {}
): QueryError['severity'] {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    // Critical errors
    if (msg.includes('authentication') || msg.includes('unauthorized')) {
      return 'critical';
    }
    if (msg.includes('database') || msg.includes('server error')) {
      return 'critical';
    }

    // High severity
    if (msg.includes('timeout') || msg.includes('connection')) {
      return context.retries && context.retries > 2 ? 'critical' : 'high';
    }

    // Medium severity
    if (msg.includes('validation') || msg.includes('not found')) {
      return 'medium';
    }

    // Low severity
    return 'low';
  }

  // For unknown errors
  return 'medium';
}

// ============================================================================
// BATCH ERROR REPORTING
// ============================================================================

/**
 * Batch error reports to reduce API calls
 */
export function createBatchErrorReporter(
  reportFn: (errors: QueryError[]) => Promise<void>,
  config = { batchSize: 10, flushIntervalMs: 30000 }
) {
  let batch: QueryError[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const flush = async () => {
    if (batch.length === 0) return;

    const toReport = batch;
    batch = [];
    timeoutId = null;

    try {
      await reportFn(toReport);
    } catch (error) {
      console.error('Failed to report errors:', error);
      // Re-add to batch for retry
      batch.unshift(...toReport);
    }
  };

  return {
    add: async (error: QueryError) => {
      batch.push(error);

      // Flush if batch is full
      if (batch.length >= config.batchSize) {
        if (timeoutId) clearTimeout(timeoutId);
        await flush();
      } else if (!timeoutId) {
        // Schedule flush
        timeoutId = setTimeout(flush, config.flushIntervalMs);
      }
    },

    flush,

    pending: () => batch.length,
  };
}
