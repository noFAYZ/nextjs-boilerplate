/**
 * Advanced Prefetching Strategies
 *
 * Intelligent prefetching based on user behavior, route transitions, viewport visibility,
 * and network conditions. Maximizes cache hits while minimizing unnecessary requests.
 */

import type { QueryClient } from '@tanstack/react-query';

// ============================================================================
// TYPES
// ============================================================================

export interface PrefetchIntent {
  type: 'hover' | 'route_transition' | 'scroll' | 'idle' | 'scheduled';
  confidence: number; // 0-1, how likely user will navigate
  delay?: number; // ms to wait before prefetching
  priority?: 'low' | 'normal' | 'high';
}

export interface SmartPrefetchConfig {
  /** Hover delay before prefetching (ms) */
  hoverDelayMs?: number;
  /** Confidence threshold to prefetch (0-1) */
  confidenceThreshold?: number;
  /** Use Intersection Observer for visibility */
  observeVisibility?: boolean;
  /** Prefetch when page is idle */
  prefetchOnIdle?: boolean;
  /** Network throttle detection */
  detectSlowNetwork?: boolean;
}

// ============================================================================
// ROUTE-BASED PREFETCHING
// ============================================================================

/**
 * Prefetch data for common route transitions
 * Analyzes user navigation patterns to prefetch likely next routes
 */
export function createRoutePrefetcher(
  queryClient: QueryClient,
  routes: Record<string, Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>>
) {
  const navigationHistory: string[] = [];
  const transitionProbs = new Map<string, Map<string, number>>();

  const recordNavigation = (from: string, to: string) => {
    navigationHistory.push(to);

    // Track transition probability
    if (!transitionProbs.has(from)) {
      transitionProbs.set(from, new Map());
    }

    const fromProbs = transitionProbs.get(from)!;
    const currentCount = fromProbs.get(to) || 0;
    fromProbs.set(to, currentCount + 1);
  };

  const getNextRouteProbability = (currentRoute: string): Map<string, number> => {
    return transitionProbs.get(currentRoute) || new Map();
  };

  const prefetchLikelyRoutes = async (currentRoute: string, threshold = 0.3) => {
    const probs = getNextRouteProbability(currentRoute);
    const total = Array.from(probs.values()).reduce((a, b) => a + b, 0);

    const likelyRoutes = Array.from(probs.entries())
      .map(([route, count]) => ({ route, prob: count / total }))
      .filter(({ prob }) => prob >= threshold)
      .sort((a, b) => b.prob - a.prob);

    // Prefetch top 3 likely routes
    for (const { route } of likelyRoutes.slice(0, 3)) {
      const queries = routes[route];
      if (queries) {
        for (const query of queries) {
          await queryClient.prefetchQuery({
            queryKey: query.queryKey as any,
            queryFn: query.queryFn,
          }).catch(() => {
            // Silently fail on prefetch errors
          });
        }
      }
    }
  };

  return {
    recordNavigation,
    getNextRouteProbability,
    prefetchLikelyRoutes,
    getHistogram: () => transitionProbs,
  };
}

// ============================================================================
// HOVER-BASED PREFETCHING
// ============================================================================

/**
 * Prefetch when user hovers over links/buttons
 * Uses a debounced timer to avoid excessive prefetching
 */
export function createHoverPrefetcher(
  queryClient: QueryClient,
  config: SmartPrefetchConfig = {}
) {
  const { hoverDelayMs = 200 } = config;

  const activeHovers = new Map<string, NodeJS.Timeout>();
  const prefetched = new Set<string>();

  const onHover = (element: HTMLElement, queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
    const key = element.getAttribute('data-prefetch-key') || String(Math.random());

    // Cancel existing timeout for this element
    if (activeHovers.has(key)) {
      clearTimeout(activeHovers.get(key)!);
    }

    const timeoutId = setTimeout(() => {
      if (!prefetched.has(key)) {
        prefetchQueries(queries);
        prefetched.add(key);
      }
    }, hoverDelayMs);

    activeHovers.set(key, timeoutId);
  };

  const onMouseLeave = (element: HTMLElement) => {
    const key = element.getAttribute('data-prefetch-key') || String(Math.random());
    if (activeHovers.has(key)) {
      clearTimeout(activeHovers.get(key)!);
      activeHovers.delete(key);
    }
  };

  const prefetchQueries = async (queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
    for (const query of queries) {
      await queryClient.prefetchQuery({
        queryKey: query.queryKey as any,
        queryFn: query.queryFn,
      }).catch(() => {});
    }
  };

  // Setup global delegation if element provided
  const setupDelegation = (container?: HTMLElement) => {
    const target = container || (typeof document !== 'undefined' ? document : null);
    if (!target) return;

    const handleMouseEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const queries = el.getAttribute('data-prefetch-queries');
      if (queries) {
        try {
          const parsed = JSON.parse(queries);
          onHover(el, parsed);
        } catch (err) {
          console.warn('Invalid prefetch queries:', queries);
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      onMouseLeave(e.target as HTMLElement);
    };

    target.addEventListener('mouseenter', handleMouseEnter, true);
    target.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      target.removeEventListener('mouseenter', handleMouseEnter, true);
      target.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  };

  return {
    onHover,
    onMouseLeave,
    prefetchQueries,
    setupDelegation,
  };
}

// ============================================================================
// INTERSECTION OBSERVER PREFETCHING
// ============================================================================

/**
 * Prefetch when elements become visible
 * Useful for lazy-loading and infinite scroll
 */
export function createVisibilityPrefetcher(queryClient: QueryClient) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Return no-op for SSR
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
    };
  }

  const queryMap = new Map<Element, Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>>();
  let observer: IntersectionObserver | null = null;

  const initObserver = () => {
    if (!observer) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const queries = queryMap.get(entry.target);
              if (queries) {
                prefetchQueries(queries);
                observer?.unobserve(entry.target);
                queryMap.delete(entry.target);
              }
            }
          });
        },
        { rootMargin: '100px' }
      );
    }
  };

  const prefetchQueries = async (queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
    for (const query of queries) {
      await queryClient.prefetchQuery({
        queryKey: query.queryKey as any,
        queryFn: query.queryFn,
      }).catch(() => {});
    }
  };

  const observe = (element: Element, queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
    initObserver();
    queryMap.set(element, queries);
    observer?.observe(element);
  };

  const unobserve = (element: Element) => {
    observer?.unobserve(element);
    queryMap.delete(element);
  };

  const disconnect = () => {
    observer?.disconnect();
    observer = null;
    queryMap.clear();
  };

  return {
    observe,
    unobserve,
    disconnect,
  };
}

// ============================================================================
// IDLE PREFETCHING
// ============================================================================

/**
 * Prefetch during browser idle time
 * Uses requestIdleCallback for non-blocking prefetching
 */
export function createIdlePrefetcher(
  queryClient: QueryClient,
  config = { timeout: 2000 }
) {
  if (typeof window === 'undefined' || !('requestIdleCallback' in window)) {
    // Fallback to setTimeout
    const queue: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }> = [];

    return {
      queueForIdle: (query: { queryKey: unknown[]; queryFn: () => Promise<any> }) => {
        queue.push(query);
        setTimeout(() => {
          if (queue.length > 0) {
            const q = queue.shift();
            if (q) prefetchQueries([q]);
          }
        }, 100);
      },
      flush: () => {
        const toFlush = [...queue];
        queue.length = 0;
        prefetchQueries(toFlush);
      },
    };
  }

  const queue: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }> = [];
  let idleCallbackId: number | null = null;

  const prefetchQueries = async (queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
    for (const query of queries) {
      await queryClient.prefetchQuery({
        queryKey: query.queryKey as any,
        queryFn: query.queryFn,
      }).catch(() => {});
    }
  };

  const scheduleIdle = () => {
    if (idleCallbackId !== null) return;

    idleCallbackId = requestIdleCallback(() => {
      prefetchQueries(queue);
      queue.length = 0;
      idleCallbackId = null;
    }, { timeout: config.timeout });
  };

  return {
    queueForIdle: (query: { queryKey: unknown[]; queryFn: () => Promise<any> }) => {
      queue.push(query);
      scheduleIdle();
    },

    flush: () => {
      if (idleCallbackId !== null) {
        cancelIdleCallback(idleCallbackId);
        idleCallbackId = null;
      }
      prefetchQueries(queue);
      queue.length = 0;
    },
  };
}

// ============================================================================
// NETWORK-AWARE PREFETCHING
// ============================================================================

/**
 * Adapt prefetching strategy based on network conditions
 * Reduces prefetching on slow/metered connections
 */
export function createNetworkAwarePrefetcher(
  queryClient: QueryClient,
  config = { detectSlowNetwork: true }
) {
  let isSlowNetwork = false;
  let isMeteredConnection = false;

  // Detect network conditions
  if (typeof navigator !== 'undefined' && (navigator as any).connection) {
    const connection = (navigator as any).connection;

    const updateNetworkStatus = () => {
      isSlowNetwork = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      isMeteredConnection = connection.saveData || connection.saveData === true;
    };

    updateNetworkStatus();
    connection.addEventListener?.('change', updateNetworkStatus);
  }

  const shouldPrefetch = (priority: 'low' | 'normal' | 'high' = 'normal'): boolean => {
    if (isMeteredConnection && priority === 'low') {
      return false;
    }
    if (isSlowNetwork && priority !== 'high') {
      return false;
    }
    return true;
  };

  const prefetchIfAllowed = async (
    query: { queryKey: unknown[]; queryFn: () => Promise<any> },
    priority?: 'low' | 'normal' | 'high'
  ) => {
    if (shouldPrefetch(priority)) {
      return queryClient.prefetchQuery({
        queryKey: query.queryKey as any,
        queryFn: query.queryFn,
      }).catch(() => {});
    }
  };

  return {
    shouldPrefetch,
    prefetchIfAllowed,
    isSlowNetwork: () => isSlowNetwork,
    isMeteredConnection: () => isMeteredConnection,
    getConnectionInfo: () => ({
      isSlowNetwork,
      isMeteredConnection,
    }),
  };
}

// ============================================================================
// PRIORITY QUEUE PREFETCHER
// ============================================================================

/**
 * Prefetch with priority scheduling
 * Higher priority prefetches execute immediately, lower priority when idle
 */
export function createPriorityPrefetcher(queryClient: QueryClient) {
  const highPriority: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }> = [];
  const normalPriority: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }> = [];
  const lowPriority: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }> = [];

  const prefetchQueue = async (queue: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>) => {
    for (const query of queue) {
      await queryClient.prefetchQuery({
        queryKey: query.queryKey as any,
        queryFn: query.queryFn,
      }).catch(() => {});
    }
    queue.length = 0;
  };

  return {
    add: (
      query: { queryKey: unknown[]; queryFn: () => Promise<any> },
      priority: 'low' | 'normal' | 'high' = 'normal'
    ) => {
      if (priority === 'high') {
        highPriority.push(query);
        prefetchQueue([query]); // Execute immediately
      } else if (priority === 'normal') {
        normalPriority.push(query);
        // Execute soon
        setTimeout(() => prefetchQueue([query]), 50);
      } else {
        lowPriority.push(query);
        // Execute when idle
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(() => prefetchQueue([query]));
        } else {
          setTimeout(() => prefetchQueue([query]), 1000);
        }
      }
    },

    flushAll: async () => {
      await prefetchQueue([...highPriority, ...normalPriority, ...lowPriority]);
    },

    pending: () => highPriority.length + normalPriority.length + lowPriority.length,
  };
}

// ============================================================================
// RESPONSIVE PREFETCHING
// ============================================================================

/**
 * Adapt prefetching based on viewport size and device capabilities
 * Reduces prefetching on mobile/constrained devices
 */
export function createResponsivePrefetcher(
  queryClient: QueryClient,
  config = {
    mobileThreshold: 768,
    desktopPrefetchCount: 5,
    mobilePrefetchCount: 2,
  }
) {
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < config.mobileThreshold;
  };

  const getPrefetchCount = () => {
    return isMobile() ? config.mobilePrefetchCount : config.desktopPrefetchCount;
  };

  const prefetchTop = async (
    queries: Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>
  ) => {
    const count = getPrefetchCount();
    const toFetch = queries.slice(0, count);

    for (const query of toFetch) {
      await queryClient.prefetchQuery({
        queryKey: query.queryKey as any,
        queryFn: query.queryFn,
      }).catch(() => {});
    }
  };

  return {
    isMobile,
    getPrefetchCount,
    prefetchTop,
    getDeviceClass: () => (isMobile() ? 'mobile' : 'desktop'),
  };
}

// ============================================================================
// COMBINED SMART PREFETCHER
// ============================================================================

/**
 * Combines multiple prefetching strategies intelligently
 */
export function createSmartPrefetcher(
  queryClient: QueryClient,
  routes: Record<string, Array<{ queryKey: unknown[]; queryFn: () => Promise<any> }>>,
  config: SmartPrefetchConfig = {}
) {
  const routePrefetcher = createRoutePrefetcher(queryClient, routes);
  const hoverPrefetcher = createHoverPrefetcher(queryClient, config);
  const idlePrefetcher = createIdlePrefetcher(queryClient);
  const networkAwarePrefetcher = createNetworkAwarePrefetcher(queryClient);
  const responsivePrefetcher = createResponsivePrefetcher(queryClient);

  let currentRoute = '/';

  return {
    navigate: async (from: string, to: string) => {
      routePrefetcher.recordNavigation(from, to);
      currentRoute = to;

      // Prefetch likely next routes
      await routePrefetcher.prefetchLikelyRoutes(to, 0.2);
    },

    setupHoverPrefetch: (container?: HTMLElement) => {
      return hoverPrefetcher.setupDelegation(container);
    },

    queueIdlePrefetch: (query: { queryKey: unknown[]; queryFn: () => Promise<any> }) => {
      if (networkAwarePrefetcher.shouldPrefetch('low')) {
        idlePrefetcher.queueForIdle(query);
      }
    },

    getIntel: () => ({
      isSlowNetwork: networkAwarePrefetcher.isSlowNetwork(),
      isMobile: responsivePrefetcher.isMobile(),
      routeHistory: routePrefetcher.getHistogram(),
    }),
  };
}
