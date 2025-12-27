/**
 * Offline Mutation Queue
 *
 * Queues mutations when offline and automatically retries when connection is restored.
 * Persists queue to storage and maintains order across sessions.
 */

import type { QueryClient } from '@tanstack/react-query';

// ============================================================================
// TYPES
// ============================================================================

export interface QueuedMutation {
  id: string;
  timestamp: number;
  mutationType: string;
  variables: unknown;
  retries: number;
  lastError?: string;
  metadata?: {
    optimisticKey?: unknown[];
    rollbackData?: unknown;
  };
}

export interface OfflineQueueConfig {
  /** Storage key for persisting queue */
  storageKey?: string;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Retry delay base in ms (exponential backoff) */
  retryDelayMs?: number;
  /** Enable persistence to localStorage */
  persist?: boolean;
  /** Callback when mutation succeeds */
  onSuccess?: (mutation: QueuedMutation) => void;
  /** Callback when mutation fails permanently */
  onError?: (mutation: QueuedMutation, error: Error) => void;
}

// ============================================================================
// OFFLINE QUEUE MANAGER
// ============================================================================

export function createOfflineQueue(
  executeCallback: (mutation: QueuedMutation) => Promise<void>,
  config: OfflineQueueConfig = {}
) {
  const {
    storageKey = 'moneymappr_offline_queue',
    maxRetries = 3,
    retryDelayMs = 1000,
    persist = true,
    onSuccess,
    onError,
  } = config;

  let queue: QueuedMutation[] = [];
  let isProcessing = false;
  let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // ============================================================================
  // STORAGE
  // ============================================================================

  const loadFromStorage = () => {
    if (!persist || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        queue = JSON.parse(stored) as QueuedMutation[];
      }
    } catch (error) {
      console.error('Failed to load offline queue from storage:', error);
    }
  };

  const saveToStorage = () => {
    if (!persist || typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline queue to storage:', error);
    }
  };

  const clearStorage = () => {
    if (!persist || typeof window === 'undefined') return;
    localStorage.removeItem(storageKey);
  };

  // ============================================================================
  // QUEUE MANAGEMENT
  // ============================================================================

  const add = (mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retries' | 'lastError'>) => {
    const queued: QueuedMutation = {
      ...mutation,
      id: `${mutation.mutationType}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    queue.push(queued);
    saveToStorage();

    // Try to process immediately if online
    if (isOnline) {
      process();
    }

    return queued;
  };

  const remove = (id: string) => {
    queue = queue.filter(m => m.id !== id);
    saveToStorage();
  };

  const getById = (id: string) => {
    return queue.find(m => m.id === id);
  };

  const getAll = () => [...queue];

  const clear = () => {
    queue = [];
    clearStorage();
  };

  // ============================================================================
  // RETRY LOGIC
  // ============================================================================

  const getRetryDelay = (retries: number) => {
    // Exponential backoff: 1s, 2s, 4s, 8s, ...
    return retryDelayMs * Math.pow(2, retries);
  };

  const process = async () => {
    if (isProcessing || !isOnline || queue.length === 0) return;

    isProcessing = true;

    try {
      while (queue.length > 0 && isOnline) {
        const mutation = queue[0];

        try {
          // Execute the mutation
          await executeCallback(mutation);

          // Success: remove from queue
          queue.shift();
          saveToStorage();

          // Callback
          onSuccess?.(mutation);

          // Small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          // Increment retries
          mutation.retries++;
          mutation.lastError = errorMessage;

          if (mutation.retries >= maxRetries) {
            // Max retries exceeded: give up
            queue.shift();
            saveToStorage();

            // Callback
            onError?.(mutation, error instanceof Error ? error : new Error(errorMessage));
          } else {
            // Retry later
            const delay = getRetryDelay(mutation.retries);
            saveToStorage();

            // Wait before retrying this mutation
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    } finally {
      isProcessing = false;
    }
  };

  // ============================================================================
  // CONNECTION MONITORING
  // ============================================================================

  const setupOnlineDetection = () => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('[Offline Queue] Back online, processing queue...');
      isOnline = true;
      process();
    };

    const handleOffline = () => {
      console.log('[Offline Queue] Went offline');
      isOnline = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  // Initialize
  loadFromStorage();
  const cleanup = setupOnlineDetection();

  return {
    /** Add a mutation to the queue */
    add,

    /** Remove a queued mutation */
    remove,

    /** Get queued mutation by ID */
    getById,

    /** Get all queued mutations */
    getAll,

    /** Clear all queued mutations */
    clear,

    /** Process queue (called automatically when online) */
    process,

    /** Get current online status */
    isOnline: () => isOnline,

    /** Manually set online status (for testing) */
    setOnline: (online: boolean) => {
      isOnline = online;
      if (online) process();
    },

    /** Get queue size */
    size: () => queue.length,

    /** Cleanup resources */
    cleanup: () => cleanup?.(),
  };
}

// ============================================================================
// REACT HOOK
// ============================================================================

export function useOfflineQueue(
  executeCallback: (mutation: QueuedMutation) => Promise<void>,
  config: OfflineQueueConfig = {}
) {
  if (typeof window === 'undefined') {
    // SSR: return no-op
    return {
      add: () => ({} as QueuedMutation),
      getAll: () => [],
      size: () => 0,
      isOnline: () => true,
    };
  }

  // In a real implementation, you'd use useRef and useEffect to maintain singleton
  // For now, create a module-level instance
  if (!globalThis._offlineQueue) {
    globalThis._offlineQueue = createOfflineQueue(executeCallback, config);
  }

  return globalThis._offlineQueue;
}

// ============================================================================
// INTEGRATION WITH MUTATIONS
// ============================================================================

/**
 * Create a mutation wrapper that queues offline
 * Usage in useMutation onError:
 *
 * const offlineQueue = useOfflineQueue(executeMutation);
 *
 * return useMutation({
 *   mutationFn: async (data) => {
 *     // try to execute online
 *     try {
 *       return await api.doSomething(data);
 *     } catch (error) {
 *       // Queue if offline
 *       if (!navigator.onLine) {
 *         offlineQueue.add({
 *           mutationType: 'doSomething',
 *           variables: data,
 *         });
 *         return { queued: true };
 *       }
 *       throw error;
 *     }
 *   },
 * });
 */

export function createOfflineAwareMutation<TVariables, TResponse>(
  mutationFn: (variables: TVariables) => Promise<TResponse>,
  offlineQueue: ReturnType<typeof createOfflineQueue>,
  mutationType: string
) {
  return async (variables: TVariables): Promise<TResponse | { queued: true }> => {
    try {
      return await mutationFn(variables);
    } catch (error) {
      // If offline, queue the mutation
      if (!offlineQueue.isOnline()) {
        console.log(`[Offline Queue] Queueing mutation: ${mutationType}`);
        offlineQueue.add({
          mutationType,
          variables,
        });
        return { queued: true } as any;
      }

      // If online, rethrow
      throw error;
    }
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get estimated time until retry
 */
export function getRetryETA(mutation: QueuedMutation, baseRetryDelayMs = 1000): number {
  const delay = baseRetryDelayMs * Math.pow(2, mutation.retries);
  return Date.now() + delay;
}

/**
 * Format queue status for UI
 */
export function formatQueueStatus(mutations: QueuedMutation[]) {
  return {
    total: mutations.length,
    byType: mutations.reduce(
      (acc, m) => {
        acc[m.mutationType] = (acc[m.mutationType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    oldestTimestamp: mutations.length > 0 ? mutations[0].timestamp : null,
    totalRetries: mutations.reduce((sum, m) => sum + m.retries, 0),
  };
}
