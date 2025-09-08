# Account Groups Hook Optimization

## Problem Fixed

The original implementation was causing infinite API calls because:

1. **Unstable Options Object**: The `options` parameter was being recreated on every render
2. **Dependency Array Issues**: `useCallback` was depending on the constantly changing `options` object
3. **Chain Reaction**: This triggered `useEffect` repeatedly, causing infinite API calls

## Solution Implemented

### 1. Stable Options Keys
```typescript
// Helper function to create stable options key
function createOptionsKey(options: AccountGroupsQueryOptions): string {
  return JSON.stringify({
    details: options.details || false,
    includeAccounts: options.includeAccounts || false,
    includeWallets: options.includeWallets || false,
    includeChildren: options.includeChildren || false,
    includeCounts: options.includeCounts || false,
  });
}
```

### 2. Optimized Hook Pattern
```typescript
export function useAccountGroups(options: AccountGroupsQueryOptions = {}) {
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store the latest options to avoid infinite re-renders
  const optionsRef = useRef<AccountGroupsQueryOptions>(options);
  const optionsKey = useMemo(() => createOptionsKey(options), [
    options.details, 
    options.includeAccounts, 
    options.includeWallets, 
    options.includeChildren, 
    options.includeCounts
  ]);
  const lastOptionsKeyRef = useRef<string>('');
  
  // Update options ref when options change
  optionsRef.current = options;

  const fetchGroups = useCallback(async () => {
    // ... fetch logic using optionsRef.current
  }, []); // No dependencies - stable function

  useEffect(() => {
    // Only fetch if options have actually changed
    if (lastOptionsKeyRef.current !== optionsKey) {
      lastOptionsKeyRef.current = optionsKey;
      fetchGroups();
    }
  }, [optionsKey, fetchGroups]);

  // ... rest of the hook
}
```

### 3. Component Usage Optimization
```typescript
// ❌ BAD - Creates new object every render
function MyComponent() {
  const { groups } = useAccountGroups({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  });
  // This causes infinite re-renders!
}

// ✅ GOOD - Uses stable options object
function MyComponent() {
  const accountGroupsOptions = useMemo(() => ({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  }), []); // Stable - created once

  const { groups } = useAccountGroups(accountGroupsOptions);
  // No infinite re-renders!
}
```

### 4. API Client Caching
```typescript
// Simple cache to prevent duplicate requests
const requestCache = new Map<string, Promise<any>>();
const CACHE_TTL = 30000; // 30 seconds

// GET requests are cached automatically
static async getAccountGroups(options = {}) {
  const cacheKey = createCacheKey(this.BASE_PATH, searchParams);
  
  // Check cache first
  const cachedRequest = requestCache.get(cacheKey);
  if (cachedRequest && isCacheValid(cacheKey)) {
    return cachedRequest;
  }

  // Make new request and cache it
  const request = apiClient.get<AccountGroup[]>(endpoint);
  return cacheRequest(cacheKey, request);
}

// Mutations clear cache automatically
static async createAccountGroup(data) {
  const result = await apiClient.post<AccountGroup>(this.BASE_PATH, data);
  
  if (result.success) {
    this.clearCache(); // Clear cache after successful mutation
  }
  
  return result;
}
```

## Performance Benefits

### Before Optimization
- ❌ Infinite API calls to `/api/v1/account-groups?details=true&includeAccounts=true&includeWallets=true&includeCounts=true`
- ❌ Component re-rendering on every state change
- ❌ Network congestion and potential rate limiting
- ❌ Poor user experience with loading states

### After Optimization
- ✅ Single API call per unique options combination
- ✅ 30-second intelligent caching for GET requests
- ✅ Automatic cache invalidation on mutations
- ✅ Stable hook behavior with proper dependency management
- ✅ Optimal network usage and performance

## Key Optimizations Applied

1. **Stable Dependencies**: Used `useMemo` with explicit dependencies
2. **Ref Pattern**: Stored latest values in refs to avoid dependency issues
3. **Smart Caching**: Added request caching with TTL and invalidation
4. **Options Serialization**: Created stable string keys for options comparison
5. **Component Optimization**: Required stable options objects in components

## Usage Examples

### Basic Usage (Optimized)
```typescript
import { useAccountGroups } from '@/lib/hooks/use-account-groups';

function AccountsList() {
  // Create stable options - this is crucial!
  const options = useMemo(() => ({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  }), []);

  const { groups, isLoading, error, refetch } = useAccountGroups(options);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {groups.map(group => (
        <div key={group.id}>{group.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Advanced Usage with Hierarchy
```typescript
function HierarchicalView() {
  const hierarchyOptions = useMemo(() => ({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  }), []);

  const { hierarchy, isLoading } = useAccountGroupsHierarchy(hierarchyOptions);
  
  // Component renders efficiently without infinite loops
  return <HierarchyTree data={hierarchy} loading={isLoading} />;
}
```

## Monitoring

To monitor the optimization effectiveness:

1. **Network Tab**: Should see single request per options combination
2. **React DevTools**: No infinite re-renders in component profiler
3. **Console Logs**: No repeated API calls in development
4. **Performance**: Improved loading times and reduced network usage

## Best Practices Going Forward

1. **Always use `useMemo` for options objects** passed to hooks
2. **Check dependency arrays** in `useEffect` and `useCallback`
3. **Use refs for values** that change but shouldn't trigger effects
4. **Implement caching** for expensive or frequently called operations
5. **Clear cache after mutations** to ensure data consistency

This optimization ensures the account groups integration is both performant and reliable, providing a smooth user experience without unnecessary API calls.