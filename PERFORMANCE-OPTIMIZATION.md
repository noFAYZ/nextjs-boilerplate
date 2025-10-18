# Frontend Data Fetching - Performance Optimization Report

## Executive Summary

**Critical Issues Identified:**
1. **20+ duplicate `/api/auth/get-session` calls** on page refresh
2. Multiple SSE connections being created and not properly cleaned up
3. No request deduplication strategy
4. Inefficient React Query configuration
5. Multiple components independently fetching the same data

**Estimated Performance Impact:**
- ~80% reduction in unnecessary API calls achievable
- ~50% reduction in initial page load time
- ~60% reduction in memory usage from SSE connections

---

## Issue #1: Excessive `/api/auth/get-session` Calls

### Root Cause Analysis

The auth session is being called multiple times due to:

1. **`AuthContext` (lines 199-204 in `lib/contexts/AuthContext.tsx`)**
   ```typescript
   useEffect(() => {
     // Initialize session on mount - only if AuthStore doesn't have a user
     if (!storeUser && !storeIsAuthenticated) {
       refreshSession(); // ← CALLS getSession()
     }
   }, [storeUser, storeIsAuthenticated]);
   ```

2. **Multiple Component Mounts**
   - Every component using `useAuthStore` triggers re-renders
   - Auth context refresh happens on every component that uses `useAuth()`
   - No shared cache for session data

3. **No Request Deduplication**
   - When 20 components mount simultaneously, 20 requests fire
   - Better Auth client has no built-in deduplication

### Solution

**Option A: Move to React Query for Session Management** (RECOMMENDED)
```typescript
// lib/queries/auth-queries.ts
import { useQuery } from '@tanstack/react-query';
import { getSession } from '@/lib/auth-client';

export const authKeys = {
  session: ['auth', 'session'] as const,
  user: ['auth', 'user'] as const,
};

export function useAuthSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const result = await getSession();
      return result?.data || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ← KEY: Only fetch once
    retry: 1,
  });
}
```

**Option B: Add Request Deduplication to Better Auth Client**
```typescript
// lib/auth-client.ts
let sessionPromise: Promise<any> | null = null;
let sessionCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

export const getSession = async () => {
  const now = Date.now();

  // Return cached data if fresh
  if (sessionCache && (now - sessionCache.timestamp) < CACHE_DURATION) {
    return sessionCache.data;
  }

  // Return in-flight request if exists
  if (sessionPromise) {
    return sessionPromise;
  }

  // Create new request
  sessionPromise = authClient.getSession().then((data) => {
    sessionCache = { data, timestamp: now };
    sessionPromise = null;
    return data;
  }).catch((error) => {
    sessionPromise = null;
    throw error;
  });

  return sessionPromise;
};
```

---

## Issue #2: Duplicate SSE Connections

### Current Behavior
```
SSE connection 0f793669-8286-48a2-a2c6-d56e4734d8a4-1760777138171-koa3oca6y
SSE connection 0f793669-8286-48a2-a2c6-d56e4734d8a4-1760777138190-k3rytpi1l
```

Two SSE connections are being established for the same user.

### Root Cause
Looking at the logs, SSE connections are created by:
1. `components/providers/portfolio-sync-provider.tsx`
2. `components/providers/banking-sync-provider.tsx`

Both likely mount simultaneously and create separate connections.

### Solution

**Create a Unified SSE Manager**
```typescript
// lib/services/sse-manager.ts
class SSEManager {
  private connection: EventSource | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    if (this.connection?.readyState === EventSource.OPEN) {
      return; // Already connected
    }

    this.connection = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/crypto/user/sync/stream`
    );

    this.connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data);
    };

    this.connection.onerror = () => {
      this.handleReconnect();
    };
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)!.add(callback);

    return () => {
      this.subscribers.get(channel)?.delete(callback);
    };
  }

  private notifySubscribers(channel: string, data: any) {
    this.subscribers.get(channel)?.forEach(cb => cb(data));
  }

  disconnect() {
    this.connection?.close();
    this.connection = null;
    this.subscribers.clear();
  }
}

export const sseManager = new SSEManager();
```

---

## Issue #3: Inefficient Data Fetching on Dashboard

### Current Behavior (From Logs)
On dashboard refresh, ALL these endpoints are hit:
```
✅ /api/v1/profile (multiple times)
✅ /api/v1/stats (multiple times)
✅ /api/v1/crypto/portfolio
✅ /api/v1/crypto/wallets
✅ /api/v1/banking/accounts/grouped
✅ /api/v1/banking/transactions
✅ /api/v1/banking/analytics/spending/trend
✅ /api/v1/banking/analytics/spending/categories (twice with different params)
✅ /api/v1/subscriptions/plans
✅ /api/v1/subscriptions/history
✅ /api/v1/subscriptions/current
✅ /api/v1/payments/history
✅ /api/v1/usage/stats
```

**Problem:** Some of these are not needed for the dashboard page!

### Solution: Lazy Load Non-Critical Data

**Implement Route-Specific Data Fetching**
```typescript
// app/dashboard/page.tsx
'use client';

export default function DashboardPage() {
  // ✅ Critical data - load immediately
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiClient.get('/api/v1/stats'),
  });

  const { data: portfolio } = useQuery({
    queryKey: ['crypto', 'portfolio'],
    queryFn: () => apiClient.get('/api/v1/crypto/portfolio'),
  });

  // ❌ Don't load subscription data on dashboard
  // Only load on /subscription page

  // ✅ Defer non-critical data
  const { data: spending } = useQuery({
    queryKey: ['banking', 'analytics', 'spending'],
    queryFn: () => apiClient.get('/api/v1/banking/analytics/spending/categories'),
    enabled: !!stats, // Wait for critical data first
  });

  return (
    // ...
  );
}
```

---

## Issue #4: React Query Configuration

### Current Config Issues

```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3; // ← Retries 3 times for every failed request!
      },
      refetchOnWindowFocus: false, // ✅ Good
      refetchOnReconnect: true, // ← Could cause duplicate fetches
    },
  },
});
```

**Problems:**
1. No `refetchOnMount` configuration
2. Aggressive retry policy (3 retries = 4x traffic on failures)
3. `refetchOnReconnect: true` can cause data fetches when internet reconnects

### Optimized Configuration

```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (increased for better caching)
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Don't retry 4xx client errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Only retry once for 5xx errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // ← Changed
      refetchOnMount: false, // ← Added - use cached data
      networkMode: 'offlineFirst', // ← Added - serve from cache when offline
    },
    mutations: {
      retry: false,
    },
  },
});
```

---

## Issue #5: Dashboard-Specific Optimizations

### Implement Parallel Data Fetching with Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

function DashboardContent() {
  // All queries run in parallel, React Query handles deduplication
  const statsQuery = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const portfolioQuery = useQuery({ queryKey: ['portfolio'], queryFn: fetchPortfolio });
  const walletsQuery = useQuery({ queryKey: ['wallets'], queryFn: fetchWallets });

  return (
    <div>
      <NetWorthWidget data={statsQuery.data} />
      <CryptoAllocationWidget data={portfolioQuery.data} />
      <WalletsOverview data={walletsQuery.data} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
```

---

## Recommended Implementation Priority

### Phase 1: Critical (Immediate - This Sprint)
1. ✅ Add request deduplication to `getSession()`
2. ✅ Fix React Query retry policy
3. ✅ Add `refetchOnMount: false` to queries
4. ✅ Consolidate SSE connections

**Estimated Impact:** 70% reduction in duplicate requests

### Phase 2: High Priority (Next Sprint)
1. ✅ Move auth to React Query
2. ✅ Implement route-specific data fetching
3. ✅ Remove unnecessary data fetches from dashboard

**Estimated Impact:** 20% additional improvement

### Phase 3: Optimization (Future)
1. ✅ Implement service workers for offline support
2. ✅ Add request batching
3. ✅ Implement GraphQL for more efficient data fetching

**Estimated Impact:** 10% additional improvement

---

## Production-Grade Best Practices Checklist

### ✅ Caching Strategy
- [ ] Implement proper cache keys with versioning
- [ ] Add cache invalidation on mutations
- [ ] Use optimistic updates for better UX
- [ ] Implement background refetching for stale data

### ✅ Request Management
- [ ] Request deduplication (in-flight request tracking)
- [ ] Request cancellation on component unmount
- [ ] Request retry with exponential backoff
- [ ] Request timeout configuration

### ✅ Data Fetching Patterns
- [ ] Parallel data fetching where possible
- [ ] Waterfall prevention (avoid dependent queries)
- [ ] Lazy loading for below-the-fold content
- [ ] Prefetching for predicted user actions

### ✅ Error Handling
- [ ] Graceful degradation for failed requests
- [ ] User-friendly error messages
- [ ] Automatic retry for network errors only
- [ ] Error boundary implementation

### ✅ Monitoring
- [ ] Track API call frequency
- [ ] Monitor cache hit rates
- [ ] Alert on excessive API usage
- [ ] Performance metrics (FCP, LCP, TTI)

---

## Code Examples for Implementation

See the following files for implementation details:
- `lib/auth-client-optimized.ts` - Request deduplication
- `lib/query-client-optimized.ts` - Optimized React Query config
- `lib/services/sse-manager.ts` - Unified SSE connection
- `app/dashboard/page-optimized.tsx` - Route-specific fetching

---

## Metrics to Track

**Before Optimization:**
- Session API calls per page load: **~20**
- Total API calls on dashboard: **~15-20**
- SSE connections per user: **2-3**
- Memory usage: **554MB** (from logs)

**Target After Optimization:**
- Session API calls per page load: **1**
- Total API calls on dashboard: **~8-10** (only what's displayed)
- SSE connections per user: **1**
- Memory usage: **<300MB**

---

## Testing Checklist

- [ ] Test page refresh - verify only 1 session call
- [ ] Test route navigation - verify cache is used
- [ ] Test concurrent component mounts - verify deduplication
- [ ] Test SSE connection lifecycle - verify cleanup
- [ ] Test offline mode - verify cached data is served
- [ ] Test error scenarios - verify graceful degradation
- [ ] Load test with 100 concurrent users
- [ ] Monitor memory leaks with Chrome DevTools

---

**Generated:** 2025-10-18
**Priority:** 🔴 **CRITICAL**
**Estimated Effort:** 2-3 days for Phase 1
