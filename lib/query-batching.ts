/**
 * Query Batching Utilities
 *
 * Combine multiple concurrent API requests into single batched requests.
 * Reduces network overhead and server load for frequently called endpoints.
 */

import type { QueryClient } from '@tanstack/react-query';

// ============================================================================
// BATCH REQUEST TYPES
// ============================================================================

interface BatchItem<TRequest, TResponse> {
  key: string;
  request: TRequest;
  resolve: (value: TResponse) => void;
  reject: (error: Error) => void;
}

interface BatchConfig {
  /** Time window to collect requests before executing batch (ms) */
  windowMs?: number;
  /** Maximum requests in a single batch */
  maxBatchSize?: number;
  /** Custom batch executor function */
  executor?: (requests: any[]) => Promise<any[]>;
}

// ============================================================================
// BATCH MANAGER
// ============================================================================

/**
 * Manages request batching for a specific endpoint
 * Collects requests over a time window and executes them together
 */
export function createBatchManager<TRequest, TResponse>(
  batchExecutor: (requests: TRequest[]) => Promise<TResponse[]>,
  config: BatchConfig = {}
) {
  const { windowMs = 10, maxBatchSize = 100 } = config;

  let batch: BatchItem<TRequest, TResponse>[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const executeBatch = async () => {
    if (batch.length === 0) return;

    const currentBatch = batch;
    batch = [];
    timeoutId = null;

    try {
      const requests = currentBatch.map(item => item.request);
      const responses = await batchExecutor(requests);

      // Distribute responses back to individual handlers
      currentBatch.forEach((item, index) => {
        if (index < responses.length) {
          item.resolve(responses[index]);
        } else {
          item.reject(new Error('Missing response for batched request'));
        }
      });
    } catch (error) {
      // On batch error, reject all requests
      currentBatch.forEach(item => {
        item.reject(error instanceof Error ? error : new Error(String(error)));
      });
    }
  };

  return {
    async add(request: TRequest): Promise<TResponse> {
      return new Promise<TResponse>((resolve: any, reject: any) => {
        batch.push({
          key: String(batch.length),
          request,
          resolve,
          reject,
        });

        // Execute immediately if batch is full
        if (batch.length >= maxBatchSize) {
          if (timeoutId) clearTimeout(timeoutId);
          executeBatch();
        } else if (!timeoutId) {
          // Schedule batch execution
          timeoutId = setTimeout(executeBatch, windowMs);
        }
      });
    },

    async flush() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        await executeBatch();
      }
    },

    size: () => batch.length,
  };
}

// ============================================================================
// MULTI-FETCH BATCHING
// ============================================================================

/**
 * Batch multiple fetch requests efficiently
 * Useful for loading related data like multiple wallets, accounts, etc.
 */
export async function batchFetch<T>(
  requests: Array<{ key: string; url: string; options?: RequestInit }>,
  options = { parallel: true, maxParallel: 5 }
): Promise<Record<string, T>> {
  if (options.parallel) {
    const results: Record<string, T> = {};

    // Process in parallel with concurrency limit
    for (let i = 0; i < requests.length; i += options.maxParallel) {
      const chunk = requests.slice(i, i + options.maxParallel);
      const responses = await Promise.all(
        chunk.map(req =>
          fetch(req.url, req.options)
            .then(res => res.json())
            .catch(err => {
              console.error(`Failed to fetch ${req.key}:`, err);
              return null;
            })
        )
      );

      chunk.forEach((req, index) => {
        results[req.key] = responses[index];
      });
    }

    return results;
  } else {
    // Sequential execution
    const results: Record<string, T> = {};
    for (const req of requests) {
      try {
        const res = await fetch(req.url, req.options);
        results[req.key] = await res.json();
      } catch (error) {
        console.error(`Failed to fetch ${req.key}:`, error);
      }
    }
    return results;
  }
}

// ============================================================================
// QUERY-BASED BATCHING
// ============================================================================

/**
 * Batch prefetch queries efficiently
 * Instead of prefetching one query at a time, batch them together
 */
export async function batchPrefetch(
  queryClient: QueryClient,
  queries: Array<{
    queryKey: unknown[];
    queryFn: () => Promise<any>;
  }>,
  options = { batchSize: 5 }
) {
  const results: any[] = [];

  for (let i = 0; i < queries.length; i += options.batchSize) {
    const batch = queries.slice(i, i + options.batchSize);

    const batchResults = await Promise.allSettled(
      batch.map(q =>
        queryClient.prefetchQuery({
          queryKey: q.queryKey as any,
          queryFn: q.queryFn,
        })
      )
    );

    results.push(...batchResults);
  }

  return results;
}

// ============================================================================
// INVALIDATION BATCHING
// ============================================================================

/**
 * Batch invalidate multiple queries at once
 * More efficient than calling invalidateQueries multiple times
 */
export function batchInvalidate(
  queryClient: QueryClient,
  queryKeys: unknown[][]
) {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: key, refetchType: 'background' });
  });
}

// ============================================================================
// MUTATION BATCHING
// ============================================================================

/**
 * Batch multiple mutations of the same type
 * Useful for bulk operations like bulk categorize transactions
 */
export function createMutationBatcher<TPayload, TResponse>(
  executor: (payloads: TPayload[]) => Promise<TResponse[]>,
  config: { windowMs?: number; maxBatchSize?: number } = {}
) {
  const { windowMs = 50, maxBatchSize = 50 } = config;

  let queue: Array<{
    payload: TPayload;
    resolve: (value: TResponse) => void;
    reject: (error: Error) => void;
  }> = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const processBatch = async () => {
    if (queue.length === 0) return;

    const currentQueue = queue;
    queue = [];
    timeoutId = null;

    try {
      const payloads = currentQueue.map(item => item.payload);
      const responses = await executor(payloads);

      currentQueue.forEach((item, index) => {
        if (index < responses.length) {
          item.resolve(responses[index]);
        }
      });
    } catch (error) {
      currentQueue.forEach(item => {
        item.reject(error instanceof Error ? error : new Error(String(error)));
      });
    }
  };

  return {
    async add(payload: TPayload): Promise<TResponse> {
      return new Promise<TResponse>((resolve: any, reject: any) => {
        queue.push({ payload, resolve, reject });

        if (queue.length >= maxBatchSize) {
          if (timeoutId) clearTimeout(timeoutId);
          processBatch();
        } else if (!timeoutId) {
          timeoutId = setTimeout(processBatch, windowMs);
        }
      });
    },

    async flush() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        await processBatch();
      }
    },

    pending: () => queue.length,
  };
}

// ============================================================================
// DEDUPLICATION BATCHING
// ============================================================================

/**
 * Deduplicate and batch identical requests
 * Only send one request per unique key, all awaiting the same response
 */
export function createDeduplicatingBatcher<TResponse>(
  executor: (key: string) => Promise<TResponse>,
  config: { windowMs?: number } = {}
) {
  const { windowMs = 10 } = config;

  const pending = new Map<string, Promise<TResponse>>();
  const timeoutIds = new Map<string, NodeJS.Timeout>();

  return {
    async get(key: string): Promise<TResponse> {
      // If already pending for this key, return same promise
      if (pending.has(key)) {
        return pending.get(key)!;
      }

      // Create new promise and start timer
      const promise = new Promise<TResponse>((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            const result = await executor(key);
            pending.delete(key);
            timeoutIds.delete(key);
            resolve(result);
          } catch (error) {
            pending.delete(key);
            timeoutIds.delete(key);
            reject(error);
          }
        }, windowMs);

        timeoutIds.set(key, timeoutId);
      });

      pending.set(key, promise);
      return promise;
    },

    async flush(key?: string) {
      if (key && timeoutIds.has(key)) {
        clearTimeout(timeoutIds.get(key)!);
        return pending.get(key);
      } else if (!key) {
        // Flush all
        Array.from(timeoutIds.values()).forEach(clearTimeout);
        timeoutIds.clear();
      }
    },

    pending: () => pending.size,
  };
}

// ============================================================================
// RATE-LIMITED BATCHING
// ============================================================================

/**
 * Batch requests while respecting rate limits
 * Ensures requests are spread across time to not exceed rate limit
 */
export function createRateLimitedBatcher<TRequest, TResponse>(
  executor: (request: TRequest) => Promise<TResponse>,
  config: {
    requestsPerSecond?: number;
    windowMs?: number;
  } = {}
) {
  const { requestsPerSecond = 10, windowMs = 10 } = config;
  const minDelayBetweenRequests = 1000 / requestsPerSecond;

  let lastRequestTime = 0;
  let pendingRequests: Array<{
    request: TRequest;
    resolve: (value: TResponse) => void;
    reject: (error: Error) => void;
  }> = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const processPending = async () => {
    while (pendingRequests.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;

      if (timeSinceLastRequest >= minDelayBetweenRequests) {
        const item = pendingRequests.shift();
        if (!item) break;

        try {
          lastRequestTime = Date.now();
          const response = await executor(item.request);
          item.resolve(response);
        } catch (error) {
          item.reject(error instanceof Error ? error : new Error(String(error)));
        }
      } else {
        // Wait for rate limit window
        timeoutId = setTimeout(processPending, minDelayBetweenRequests - timeSinceLastRequest);
        return;
      }
    }

    timeoutId = null;
  };

  return {
    async add(request: TRequest): Promise<TResponse> {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ request, resolve, reject });

        if (!timeoutId) {
          processPending();
        }
      });
    },

    async flush() {
      while (pendingRequests.length > 0) {
        await processPending();
      }
    },

    pending: () => pendingRequests.length,
  };
}
