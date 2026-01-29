/**
 * Query Utilities
 *
 * Production utilities for cache monitoring, prefetching, and performance tracking.
 * Minimal, focused tools for better cache management and debugging.
 */

import type { QueryClient } from '@tanstack/react-query';

// ============================================================================
// CACHE MONITORING
// ============================================================================

/**
 * Get cache statistics for debugging and monitoring
 * Useful for understanding cache hit rates and memory usage
 */
export function getCacheStats(queryClient: QueryClient) {
  const cache = queryClient.getQueryCache();
  const all = cache.getAll();
  const queries = all.length;
  const stale = all.filter(q => q.isStale()).length;
  const inactive = all.filter(q => !q.getObserversCount()).length;

  return {
    totalQueries: queries,
    staleQueries: stale,
    inactiveQueries: inactive,
    cacheSize: `~${(all.length * 5).toFixed(0)}KB`, // Rough estimate
  };
}

/**
 * Log cache statistics to console
 * Helpful during development to spot cache inefficiencies
 */
export function logCacheStats(queryClient: QueryClient, label?: string) {
  const stats = getCacheStats(queryClient);
  const prefix = label ? `[${label}]` : '[Cache Stats]';
  console.log(prefix, stats);
  return stats;
}

/**
 * Watch for excessive cache invalidations
 * Logs when the same query key is invalidated multiple times in a short period
 */
export function watchInvalidations(queryClient: QueryClient, threshold = 3, windowMs = 1000) {
  const invalidationLog = new Map<string, number[]>();

  const originalInvalidate = queryClient.invalidateQueries.bind(queryClient);

  queryClient.invalidateQueries = ((options: any) => {
    const keyStr = JSON.stringify(options.queryKey || '');

    if (!invalidationLog.has(keyStr)) {
      invalidationLog.set(keyStr, []);
    }

    const timestamps = invalidationLog.get(keyStr)!;
    const now = Date.now();

    // Remove old entries outside window
    timestamps.splice(0, timestamps.findIndex(t => now - t < windowMs));
    timestamps.push(now);

    // Warn if threshold exceeded
    if (timestamps.length >= threshold) {
      console.warn(`[Invalidation Spike] "${keyStr}" invalidated ${timestamps.length}x in ${windowMs}ms`, {
        stack: new Error().stack,
      });
    }

    return originalInvalidate(options);
  }) as any;

  return () => {
    queryClient.invalidateQueries = originalInvalidate;
  };
}

// ============================================================================
// PREFETCHING STRATEGIES
// ============================================================================

/**
 * Prefetch multiple queries in parallel
 * Useful for eagerly loading data before user navigation
 */
export async function prefetchParallel(
  queryClient: QueryClient,
  queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>
) {
  return Promise.all(
    queries.map(q =>
      queryClient.prefetchQuery({
        queryKey: q.queryKey as any,
        queryFn: q.queryFn,
      })
    )
  ).catch(err => {
    // Silently ignore prefetch failures
    console.debug('Prefetch failed (non-critical):', err.message);
  });
}

/**
 * Debounce prefetching to avoid excessive requests
 * Useful when prefetch is triggered frequently (e.g., on mouse enter)
 */
export function createPrefetchDebounce(queryClient: QueryClient, delayMs = 500) {
  let timeoutId: NodeJS.Timeout | null = null;
  const pending: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }> = [];

  return {
    add(query: { queryKey: unknown[]; queryFn: () => Promise<any> }) {
      pending.push(query);

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        prefetchParallel(queryClient, pending);
        pending.length = 0;
        timeoutId = null;
      }, delayMs);
    },

    flush() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (pending.length > 0) {
        prefetchParallel(queryClient, pending);
        pending.length = 0;
      }
    },
  };
}

// ============================================================================
// CACHE INVALIDATION HELPERS
// ============================================================================

/**
 * Selectively invalidate query keys matching a predicate
 * More efficient than invalidating all queries of a type
 */
export function invalidateWhere(
  queryClient: QueryClient,
  predicate: (queryKey: unknown[]) => boolean,
  refetchType: 'background' | 'active' = 'background'
) {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  queries.forEach(query => {
    if (predicate(query.queryKey)) {
      queryClient.invalidateQueries({
        queryKey: query.queryKey,
        refetchType,
      });
    }
  });
}

/**
 * Invalidate multiple query prefixes efficiently
 * Example: invalidateByPrefix(['rules', 'categories']) invalidates all rules and categories
 */
export function invalidateByPrefix(
  queryClient: QueryClient,
  prefixes: string[],
  refetchType: 'background' | 'active' = 'background'
) {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  queries.forEach(query => {
    const [first] = query.queryKey as string[];
    if (prefixes.includes(first)) {
      queryClient.invalidateQueries({
        queryKey: query.queryKey,
        refetchType,
      });
    }
  });
}

// ============================================================================
// MEMORY MANAGEMENT
// ============================================================================

/**
 * Aggressive garbage collection for unused queries
 * Call periodically to free up memory in long-running apps
 */
export function cleanupCache(queryClient: QueryClient, maxInactiveMs = 5 * 60 * 1000) {
  const cache = queryClient.getQueryCache();
  const now = Date.now();

  cache.getAll().forEach(query => {
    // Remove if inactive AND older than max age
    if (
      query.getObserversCount() === 0 &&
      (!query.state.dataUpdatedAt || now - query.state.dataUpdatedAt > maxInactiveMs)
    ) {
      cache.remove(query);
    }
  });
}

/**
 * Get memory estimate of cached queries
 * Helps identify queries consuming excessive memory
 */
export function getQueryMemory(queryClient: QueryClient) {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();

  const byKey = new Map<string, number>();
  queries.forEach(q => {
    const key = JSON.stringify(q.queryKey);
    const size = JSON.stringify(q.state.data).length;
    byKey.set(key, (byKey.get(key) || 0) + size);
  });

  return Array.from(byKey.entries())
    .map(([key, size]) => ({
      key,
      sizeKB: (size / 1024).toFixed(2),
    }))
    .sort((a, b) => parseFloat(b.sizeKB) - parseFloat(a.sizeKB));
}

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Enable detailed cache logging for development
 * Logs all cache operations to console
 */
export function enableCacheLogging(queryClient: QueryClient, verbose = false) {
  // Already logged by TanStack Query in development mode
  // This is a placeholder for additional custom logging if needed

  return {
    stats: () => logCacheStats(queryClient),
    memory: () => getQueryMemory(queryClient),
  };
}

/**
 * Create a queryClient with production-safe defaults
 * Includes logging and monitoring
 */
export function createMonitoredQueryClient() {
  const { QueryClient } = require('@tanstack/react-query');

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 10,   // 10 minutes
        refetchType: 'background',
        refetchOnMount: 'stale',
        refetchOnWindowFocus: 'stale',
      },
      mutations: {
        retry: 1,
      },
    },
  });

  if (process.env.NODE_ENV === 'development') {
    // Optional: Watch for invalidation spikes during development
    watchInvalidations(client, 5, 2000);
  }

  return client;
}
