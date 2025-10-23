# Subscription Module Architecture

## 🏗️ Architecture Overview

The subscription module follows a **modern React architecture** with clear separation of concerns, unidirectional data flow, and production-ready patterns.

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         COMPONENTS                           │
│         (Pure UI, no data fetching, no side effects)        │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   UI STATE   │  │   SERVER STATE   │
│   (Zustand)  │  │ (TanStack Query) │
└──────┬───────┘  └────────┬─────────┘
       │                   │
       │                   ▼
       │          ┌─────────────────┐
       │          │ QUERY FACTORIES │
       │          └────────┬────────┘
       │                   │
       │                   ▼
       │          ┌─────────────────┐
       │          │   API SERVICES  │
       │          └────────┬────────┘
       │                   │
       │                   ▼
       │          ┌─────────────────┐
       │          │   API CLIENT    │
       │          └────────┬────────┘
       │                   │
       │                   ▼
       │          ┌─────────────────┐
       └─────────►│  BACKEND API    │
                  └─────────────────┘
```

## 🔑 Key Principles

### 1. **Single Responsibility Principle**
Each layer has one responsibility:
- **Components**: Render UI
- **Hooks**: Fetch and mutate data
- **Stores**: Manage UI state
- **Services**: Communicate with API
- **Types**: Define data structures

### 2. **Unidirectional Data Flow**
```
User Action → Component → Hook → Service → API
                  ↑                        │
                  └────── Response ────────┘
```

### 3. **State Colocation**
- **Server State**: In TanStack Query (never duplicated)
- **UI State**: In Zustand (never contains server data)
- **Local State**: In components (ephemeral UI state)

## 📁 Layer Breakdown

### 1. Components Layer (`/components`)

**Purpose**: Pure presentation components that render UI.

**Rules**:
- ❌ NO direct API calls
- ❌ NO useEffect for data fetching
- ❌ NO business logic
- ✅ Use hooks from `/hooks` for data
- ✅ Use stores from `/stores` for UI state
- ✅ Handle user interactions
- ✅ Render based on props

**Example**:
```tsx
// ✅ CORRECT
function SubscriptionCard({ subscription, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Card onClick={() => setIsModalOpen(true)}>
      {/* UI */}
    </Card>
  )
}

// ❌ WRONG
function SubscriptionCard({ subscriptionId }) {
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // ❌ Never fetch data in components!
    fetch(`/api/subscriptions/${subscriptionId}`)
      .then(res => res.json())
      .then(data => setSubscription(data))
  }, [subscriptionId])
}
```

### 2. Hooks Layer (`/hooks`)

**Purpose**: TanStack Query hooks for data fetching and mutations.

**File**: `use-subscription-data.ts`

**What it provides**:
- Query hooks for fetching data
- Mutation hooks for CRUD operations
- Automatic caching and refetching
- Loading and error states
- Optimistic updates

**Example**:
```tsx
export function useSubscriptions(filters?: SubscriptionFilters) {
  return useQuery({
    queryKey: subscriptionQueries.list(filters).queryKey,
    queryFn: subscriptionQueries.list(filters).queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) =>
      subscriptionsApi.createSubscription(data),
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({
        queryKey: subscriptionQueries.lists()
      })
    },
  })
}
```

### 3. Queries Layer (`/queries`)

**Purpose**: Query factory functions that define how data is fetched.

**File**: `subscription-queries.ts`

**Pattern**: Query Key Factory
```tsx
export const subscriptionQueries = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionQueries.all, 'list'] as const,
  list: (filters?: SubscriptionFilters) =>
    [...subscriptionQueries.lists(), filters] as const,
  details: () => [...subscriptionQueries.all, 'detail'] as const,
  detail: (id: string) =>
    [...subscriptionQueries.details(), id] as const,
}
```

**Benefits**:
- Centralized query key management
- Type-safe query keys
- Easy cache invalidation
- Prevents key collisions

### 4. Stores Layer (`/stores`)

**Purpose**: Zustand stores for UI state management.

**File**: `subscription-ui-store.ts`

**What it manages**:
- Filter selections
- View preferences (grid/list)
- Modal states (open/closed)
- Selected items for bulk operations
- Sorting and pagination

**Example**:
```tsx
interface SubscriptionUIStore {
  // Filters
  filters: SubscriptionFilters
  setFilters: (filters: Partial<SubscriptionFilters>) => void
  clearFilters: () => void

  // View preferences
  viewPreferences: {
    subscriptionsView: 'grid' | 'list'
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  setSubscriptionsView: (view: 'grid' | 'list') => void

  // Modals
  isCreateModalOpen: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
}
```

**Rules**:
- ❌ NEVER store server data (use TanStack Query)
- ✅ Store only UI-related state
- ✅ Persist to localStorage if needed
- ✅ Keep it simple and flat

### 5. Services Layer (`/services`)

**Purpose**: API communication and business logic.

**Files**:
- `subscriptions-api.ts` - Main API service
- `logo-service.ts` - Logo fetching utility

**What it provides**:
- API methods (CRUD operations)
- Data transformation
- Error handling
- Utility functions

**Example**:
```tsx
class SubscriptionsApi {
  private readonly BASE_PATH = '/user-subscriptions'

  async getSubscriptions(filters?: SubscriptionFilters) {
    const params = new URLSearchParams()
    // Build query string

    const response = await apiClient.get<SubscriptionListResponse>(
      `${this.BASE_PATH}?${params}`
    )

    // Enrich with logos
    if (response.success && response.data?.data) {
      response.data.data = logoService.batchEnrichSubscriptions(
        response.data.data
      )
    }

    return response
  }
}
```

### 6. Types Layer (`/types`)

**Purpose**: TypeScript type definitions.

**File**: `subscription.ts`

**What it defines**:
- Data models (UserSubscription)
- Request/Response types
- Filter types
- Analytics types
- Enums (status, category, billing cycle)

**Example**:
```tsx
export interface UserSubscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: BillingCycle
  status: SubscriptionStatus
  // ... 30+ fields
}

export interface SubscriptionFilters {
  category?: SubscriptionCategory
  status?: SubscriptionStatus
  search?: string
  dateRange?: { from: Date; to: Date }
  // ... filter options
}
```

## 🔄 Data Flow Examples

### Example 1: Fetching Subscriptions

```
1. Component renders
   └─> SubscriptionList.tsx

2. Component calls hook
   └─> const { data } = useSubscriptions()

3. Hook uses query factory
   └─> subscriptionQueries.list(filters)

4. Query calls service
   └─> subscriptionsApi.getSubscriptions(filters)

5. Service makes API call
   └─> apiClient.get('/user-subscriptions')

6. Response flows back
   └─> API → Service → Query → Hook → Component

7. Component re-renders with data
```

### Example 2: Creating a Subscription

```
1. User fills form
   └─> SubscriptionFormModal.tsx

2. User submits
   └─> handleSubmit(formData)

3. Component calls mutation hook
   └─> const { mutate } = useCreateSubscription()
   └─> mutate(formData)

4. Mutation calls service
   └─> subscriptionsApi.createSubscription(formData)

5. Service enriches data
   └─> Add logo URL from logo.dev

6. Service makes API call
   └─> apiClient.post('/user-subscriptions', data)

7. On success, invalidate cache
   └─> queryClient.invalidateQueries(['subscriptions'])

8. TanStack Query refetches data
   └─> useSubscriptions() gets fresh data

9. All components re-render with new data
```

### Example 3: Filtering Subscriptions

```
1. User selects filter
   └─> SubscriptionFiltersSheet.tsx

2. Component updates Zustand store
   └─> setFilters({ status: 'ACTIVE' })

3. Store notifies subscribers
   └─> All components using useSubscriptionUIStore re-render

4. List component gets new filters
   └─> const { filters } = useSubscriptionUIStore()

5. Hook refetches with new filters
   └─> useSubscriptions(filters)

6. Query cache checks for cached data
   └─> Different query key = new fetch

7. Fresh data returned and displayed
```

## 🎯 Best Practices

### 1. Component Patterns

```tsx
// ✅ CORRECT: Production-grade component
export function SubscriptionList() {
  // 1. Server data from hooks
  const { data: subscriptions, isLoading, error } = useSubscriptions()

  // 2. UI state from store
  const { filters, viewPreferences } = useSubscriptionUIStore()

  // 3. Mutations
  const { mutate: deleteSubscription } = useDeleteSubscription()

  // 4. Local state
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 5. Derived state (memoized)
  const filteredData = useMemo(() =>
    subscriptions?.filter(s => s.status === filters.status),
    [subscriptions, filters.status]
  )

  // 6. Event handlers (memoized if passed to children)
  const handleDelete = useCallback((id: string) => {
    deleteSubscription(id)
  }, [deleteSubscription])

  // 7. Early returns
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!subscriptions?.length) return <EmptyState />

  // 8. Main render
  return (
    <div>
      {filteredData.map(subscription => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
```

### 2. Error Handling

```tsx
// Hook level
export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionsApi.getSubscriptions,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Component level
if (error) {
  return (
    <div className="text-destructive">
      <p>Failed to load subscriptions</p>
      <Button onClick={() => refetch()}>Retry</Button>
    </div>
  )
}
```

### 3. Optimistic Updates

```tsx
export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      subscriptionsApi.updateSubscription(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['subscriptions'] })

      // Snapshot current value
      const previous = queryClient.getQueryData(['subscriptions'])

      // Optimistically update cache
      queryClient.setQueryData(['subscriptions'], (old) => {
        return old.map(sub => sub.id === id ? { ...sub, ...data } : sub)
      })

      return { previous }
    },

    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['subscriptions'], context.previous)
    },

    // Refetch on success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}
```

## 🔍 Advanced Patterns

### 1. Infinite Queries (Pagination)

```tsx
export function useInfiniteSubscriptions() {
  return useInfiniteQuery({
    queryKey: ['subscriptions', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      subscriptionsApi.getSubscriptions({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.prevPage,
  })
}
```

### 2. Prefetching

```tsx
export function prefetchSubscription(queryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: subscriptionQueries.detail(id).queryKey,
    queryFn: subscriptionQueries.detail(id).queryFn,
  })
}

// Usage in component
<Link
  href={`/subscriptions/${id}`}
  onMouseEnter={() => prefetchSubscription(queryClient, id)}
>
```

### 3. Dependent Queries

```tsx
export function useSubscriptionWithAnalytics(id: string) {
  // First query
  const { data: subscription } = useSubscription(id)

  // Second query depends on first
  const { data: analytics } = useQuery({
    queryKey: ['subscription-analytics', id],
    queryFn: () => subscriptionsApi.getAnalytics(id),
    enabled: !!subscription, // Only run if subscription exists
  })

  return { subscription, analytics }
}
```

## 📊 Performance Considerations

### 1. Query Caching Strategy

```tsx
// Frequent updates: Short stale time
staleTime: 1000 * 30 // 30 seconds

// Infrequent updates: Long stale time
staleTime: 1000 * 60 * 5 // 5 minutes

// Static data: Infinity
staleTime: Infinity
```

### 2. React Optimization

```tsx
// Memoize expensive calculations
const sortedData = useMemo(() =>
  data?.sort((a, b) => b.amount - a.amount),
  [data]
)

// Memoize callbacks
const handleClick = useCallback((id: string) => {
  // ...
}, [dependencies])

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'
```

### 3. Bundle Size

```tsx
// Lazy load heavy components
const SubscriptionAnalytics = lazy(() =>
  import('./subscription-analytics')
)

// Code split by route
const SubscriptionsPage = lazy(() =>
  import('@/app/subscriptions/page')
)
```

## 🧪 Testing Strategy

### 1. Unit Tests

```tsx
// Test hooks
import { renderHook, waitFor } from '@testing-library/react'
import { useSubscriptions } from './use-subscription-data'

test('useSubscriptions fetches data', async () => {
  const { result } = renderHook(() => useSubscriptions(), {
    wrapper: createQueryWrapper()
  })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toBeDefined()
})
```

### 2. Integration Tests

```tsx
// Test components with real hooks
test('SubscriptionList displays subscriptions', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <SubscriptionList />
    </QueryClientProvider>
  )

  await waitFor(() => {
    expect(screen.getByText('Netflix')).toBeInTheDocument()
  })
})
```

### 3. E2E Tests

```tsx
// Test full user flows
test('user can create subscription', async () => {
  // 1. Open modal
  // 2. Fill form
  // 3. Submit
  // 4. Verify in list
})
```

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] API base URL set correctly
- [ ] Authentication tokens included
- [ ] Error tracking enabled (Sentry)
- [ ] Performance monitoring enabled
- [ ] Analytics configured
- [ ] TypeScript strict mode enabled
- [ ] ESLint configured
- [ ] Tests passing
- [ ] Bundle size optimized

---

This architecture ensures a **scalable, maintainable, and performant** subscription management system.
