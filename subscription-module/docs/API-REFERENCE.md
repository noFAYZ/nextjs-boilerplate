# API Reference

Complete reference for all hooks, components, services, and types in the subscription module.

## 📚 Table of Contents

- [Hooks](#hooks)
- [Components](#components)
- [Services](#services)
- [Stores](#stores)
- [Types](#types)

---

## 🎣 Hooks

### Query Hooks

#### `useSubscriptions(filters?)`

Fetches a list of subscriptions with optional filtering.

**Parameters:**
```tsx
filters?: SubscriptionFilters {
  category?: SubscriptionCategory
  status?: SubscriptionStatus
  isActive?: boolean
  sourceType?: 'MANUAL' | 'AUTO_DETECTED' | 'IMPORTED'
  billingCycle?: BillingCycle
  search?: string
  tags?: string
  minAmount?: number
  maxAmount?: number
  autoRenew?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
```

**Returns:**
```tsx
{
  data: UserSubscription[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
  isFetching: boolean
}
```

**Example:**
```tsx
const { data: subscriptions, isLoading } = useSubscriptions({
  status: 'ACTIVE',
  category: 'STREAMING',
  sortBy: 'amount',
  sortOrder: 'desc'
})
```

---

#### `useSubscription(id, options?)`

Fetches a single subscription by ID.

**Parameters:**
```tsx
id: string
options?: {
  includeCharges?: boolean
  includeReminders?: boolean
}
```

**Returns:**
```tsx
{
  data: UserSubscription
  isLoading: boolean
  error: Error | null
}
```

**Example:**
```tsx
const { data: subscription } = useSubscription('sub_123', {
  includeCharges: true
})
```

---

#### `useSubscriptionAnalytics()`

Fetches subscription analytics and insights.

**Returns:**
```tsx
{
  data: SubscriptionAnalytics {
    totalSubscriptions: number
    activeSubscriptions: number
    totalMonthlySpending: number
    totalYearlySpending: number
    upcomingBills: {
      next7Days: number
      next30Days: number
    }
    byCategory: Array<{
      category: string
      count: number
      totalSpending: number
    }>
    topExpensiveSubscriptions: UserSubscription[]
    spendingTrend: Array<{
      month: string
      amount: number
    }>
  }
}
```

---

### Mutation Hooks

#### `useCreateSubscription()`

Creates a new subscription.

**Returns:**
```tsx
{
  mutate: (data: CreateSubscriptionRequest) => void
  mutateAsync: (data: CreateSubscriptionRequest) => Promise<UserSubscription>
  isLoading: boolean
  error: Error | null
  isSuccess: boolean
}
```

**Example:**
```tsx
const { mutate: createSubscription, isLoading } = useCreateSubscription()

const handleCreate = () => {
  createSubscription({
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'MONTHLY',
    category: 'STREAMING',
    websiteUrl: 'https://netflix.com',
    autoRenew: true,
  })
}
```

---

#### `useUpdateSubscription()`

Updates an existing subscription.

**Returns:**
```tsx
{
  mutate: (params: { id: string, data: UpdateSubscriptionRequest }) => void
  isLoading: boolean
  error: Error | null
}
```

**Example:**
```tsx
const { mutate: updateSubscription } = useUpdateSubscription()

updateSubscription({
  id: 'sub_123',
  data: { amount: 19.99 }
})
```

---

#### `useDeleteSubscription()`

Deletes a subscription.

**Example:**
```tsx
const { mutate: deleteSubscription } = useDeleteSubscription()

deleteSubscription('sub_123')
```

---

#### `useDetectSubscriptions()`

Auto-detects recurring subscriptions from transaction data.

**Returns:**
```tsx
{
  mutate: () => void
  data: AutoDetectResponse {
    detected: UserSubscription[]
    count: number
  }
}
```

---

## 🎨 Components

### SubscriptionCard

Displays a subscription in card format with logo, pricing, and status.

**Props:**
```tsx
interface SubscriptionCardProps {
  subscription: UserSubscription
  onEdit?: (subscription: UserSubscription) => void
  onDelete?: (subscription: UserSubscription) => void
  onClick?: (subscription: UserSubscription) => void
}
```

**Example:**
```tsx
<SubscriptionCard
  subscription={subscription}
  onEdit={(sub) => openEditModal(sub)}
  onDelete={(sub) => confirmDelete(sub)}
  onClick={(sub) => openDetailsModal(sub)}
/>
```

**Features:**
- Company logo from logo.dev
- Status badge (Active, Trial, Cancelled, etc.)
- Auto-renew indicator
- Price with billing cycle
- Next billing date
- Total spent
- Hover effects
- Click to open details modal

---

### SubscriptionDetailsModal

Rich modal showing all subscription details with edit/delete actions.

**Props:**
```tsx
interface SubscriptionDetailsModalProps {
  subscription: UserSubscription | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (subscription: UserSubscription) => void
  onDelete?: (subscription: UserSubscription) => void
}
```

**Example:**
```tsx
const [isOpen, setIsOpen] = useState(false)
const [selectedSub, setSelectedSub] = useState(null)

<SubscriptionDetailsModal
  subscription={selectedSub}
  open={isOpen}
  onOpenChange={setIsOpen}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Sections:**
1. **Header**: Logo, name, merchant, status badges, actions
2. **Pricing Overview**: Current cost, yearly estimate, total spent
3. **Billing Schedule**: Start date, next billing, trial end, end date
4. **Notifications**: Billing reminders status
5. **Additional Details**: Description, notes, tags
6. **Quick Actions**: Visit website, cancel subscription
7. **Metadata**: Created, updated, source, billing cycle

---

### SubscriptionList

Grid or list view of subscriptions with automatic filtering.

**Props:**
```tsx
interface SubscriptionListProps {
  onEdit?: (subscription: UserSubscription) => void
  onDelete?: (subscription: UserSubscription) => void
  onSelect?: (subscription: UserSubscription) => void
  activeTab?: 'all' | 'active' | 'trial' | 'cancelled'
  className?: string
}
```

**Example:**
```tsx
<SubscriptionList
  activeTab="active"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onSelect={handleSelect}
/>
```

**Features:**
- Auto-filters based on activeTab
- Loading states
- Empty states
- Error handling
- Grid/list view (from store)
- Responsive layout

---

### SubscriptionFormModal

Create or edit subscription form with validation.

**Props:**
```tsx
interface SubscriptionFormModalProps {
  subscription?: UserSubscription // undefined = create mode
  open: boolean
  onOpenChange: (open: boolean) => void
}
```

**Example:**
```tsx
// Create mode
<SubscriptionFormModal
  open={isCreateOpen}
  onOpenChange={setIsCreateOpen}
/>

// Edit mode
<SubscriptionFormModal
  subscription={selectedSubscription}
  open={isEditOpen}
  onOpenChange={setIsEditOpen}
/>
```

**Form Fields:**
- Name (required)
- Merchant name
- Category (select)
- Amount (required)
- Currency (select)
- Billing cycle (select)
- Start date
- Next billing date
- Auto-renew (checkbox)
- Website URL
- Cancellation URL
- Description
- Notes
- Tags

---

### SubscriptionFiltersSheet

Advanced filtering sidebar with all filter options.

**Props:**
```tsx
interface SubscriptionFiltersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}
```

**Example:**
```tsx
<SubscriptionFiltersSheet
  open={isFiltersOpen}
  onOpenChange={setIsFiltersOpen}
/>
```

**Filter Options:**
- Status (Active, Trial, Cancelled, etc.)
- Category (Streaming, Software, etc.)
- Billing cycle (Monthly, Yearly, etc.)
- Amount range (min/max)
- Date range
- Auto-renew (yes/no)
- Search
- Tags

---

### SubscriptionAnalytics

Dashboard with charts, metrics, and insights.

**Props:**
```tsx
interface SubscriptionAnalyticsProps {
  className?: string
}
```

**Example:**
```tsx
<SubscriptionAnalytics />
```

**Sections:**
- **Metrics Cards**: Total subscriptions, monthly spending, yearly spending
- **Pie Chart**: Spending by category
- **Bar Chart**: Monthly spending trend
- **List**: Top expensive subscriptions
- **Upcoming Bills**: Next 7 days, next 30 days

---

## 🔧 Services

### subscriptionsApi

Main API service for subscription operations.

#### Methods

**`getSubscriptions(filters?)`**
```tsx
subscriptionsApi.getSubscriptions({
  status: 'ACTIVE',
  page: 1,
  limit: 20
})
```

**`getSubscription(id, options?)`**
```tsx
subscriptionsApi.getSubscription('sub_123', {
  includeCharges: true
})
```

**`createSubscription(data)`**
```tsx
subscriptionsApi.createSubscription({
  name: 'Netflix',
  amount: 15.99,
  // ...
})
```

**`updateSubscription(id, updates)`**
```tsx
subscriptionsApi.updateSubscription('sub_123', {
  amount: 19.99
})
```

**`deleteSubscription(id)`**
```tsx
subscriptionsApi.deleteSubscription('sub_123')
```

**`getAnalytics()`**
```tsx
subscriptionsApi.getAnalytics()
```

**`detectSubscriptions()`**
```tsx
subscriptionsApi.detectSubscriptions()
```

#### Utility Methods

**`calculateMonthlyEquivalent(amount, billingCycle)`**
```tsx
subscriptionsApi.calculateMonthlyEquivalent(99, 'YEARLY') // 8.25
```

**`calculateYearlyEstimate(amount, billingCycle)`**
```tsx
subscriptionsApi.calculateYearlyEstimate(9.99, 'MONTHLY') // 119.88
```

**`formatCurrency(amount, currency)`**
```tsx
subscriptionsApi.formatCurrency(15.99, 'USD') // '$15.99'
```

**`getCategoryDisplayName(category)`**
```tsx
subscriptionsApi.getCategoryDisplayName('STREAMING') // 'Streaming'
```

**`getBillingCycleDisplayName(cycle)`**
```tsx
subscriptionsApi.getBillingCycleDisplayName('MONTHLY') // 'Monthly'
```

**`getStatusDisplayInfo(status)`**
```tsx
subscriptionsApi.getStatusDisplayInfo('ACTIVE')
// { label: 'Active', color: 'green', variant: 'success' }
```

---

### logoService

Service for fetching company logos from logo.dev.

#### Methods

**`getLogoUrl(websiteUrl, options?)`**
```tsx
logoService.getLogoUrl('https://netflix.com', {
  size: 300,
  format: 'jpg',
  retina: true
})
// Returns: 'https://img.logo.dev/netflix.com?token=...&size=300&format=jpg&retina=true'
```

**`getDefaultLogoUrl(websiteUrl)`**
```tsx
logoService.getDefaultLogoUrl('https://netflix.com')
```

**`getRetinaLogoUrl(websiteUrl, size?)`**
```tsx
logoService.getRetinaLogoUrl('https://netflix.com', 256)
```

**`getSvgLogoUrl(websiteUrl)`**
```tsx
logoService.getSvgLogoUrl('https://netflix.com')
```

**`enrichSubscriptionWithLogo(subscription, options?)`**
```tsx
const enriched = logoService.enrichSubscriptionWithLogo(subscription)
// Adds logoUrl field
```

**`batchEnrichSubscriptions(subscriptions, options?)`**
```tsx
const enriched = logoService.batchEnrichSubscriptions(subscriptions)
```

---

## 🗄️ Stores

### useSubscriptionUIStore

Zustand store for UI state management.

#### State

```tsx
interface SubscriptionUIStore {
  // Filters
  filters: SubscriptionFilters
  setFilters: (filters: Partial<SubscriptionFilters>) => void
  clearFilters: () => void

  // View Preferences (persisted to localStorage)
  viewPreferences: {
    subscriptionsView: 'grid' | 'list'
    sortBy: 'name' | 'amount' | 'nextBillingDate'
    sortOrder: 'asc' | 'desc'
  }
  setSubscriptionsView: (view: 'grid' | 'list') => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void

  // Modals
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isFiltersSheetOpen: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
  toggleFiltersSheet: () => void

  // Selection
  selectedIds: Set<string>
  toggleSelection: (id: string) => void
  selectAll: () => void
  clearSelection: () => void
}
```

#### Usage

```tsx
// Get state
const { filters, viewPreferences } = useSubscriptionUIStore()

// Set filters
const { setFilters, clearFilters } = useSubscriptionUIStore()
setFilters({ status: 'ACTIVE' })
clearFilters()

// View preferences
const { setSubscriptionsView } = useSubscriptionUIStore()
setSubscriptionsView('grid')

// Modals
const { openCreateModal, closeCreateModal } = useSubscriptionUIStore()
```

---

## 📋 Types

### UserSubscription

```tsx
interface UserSubscription {
  id: string
  userId: string
  name: string
  description?: string
  category: SubscriptionCategory
  amount: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  nextBillingDate?: string
  endDate?: string
  trialEndDate?: string
  status: SubscriptionStatus
  isActive: boolean
  sourceType: 'MANUAL' | 'AUTO_DETECTED' | 'IMPORTED'
  merchantName?: string
  accountId?: string
  categoryId?: string
  notifyBeforeBilling: boolean
  notifyDaysBefore: number
  lastNotificationDate?: string
  logoUrl?: string
  websiteUrl?: string
  cancellationUrl?: string
  notes?: string
  tags?: string[]
  autoRenew: boolean
  yearlyEstimate: number
  monthlyEquivalent: number
  totalSpent: number
  daysUntilNextBilling?: number
  createdAt: string
  updatedAt: string
}
```

### SubscriptionStatus

```tsx
type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIAL'
  | 'PAUSED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'PAYMENT_FAILED'
```

### SubscriptionCategory

```tsx
type SubscriptionCategory =
  | 'STREAMING'
  | 'MUSIC'
  | 'SOFTWARE'
  | 'CLOUD_STORAGE'
  | 'GAMING'
  | 'NEWS_MEDIA'
  | 'FITNESS'
  | 'PRODUCTIVITY'
  | 'COMMUNICATION'
  | 'SECURITY'
  | 'FOOD_DELIVERY'
  | 'TRANSPORTATION'
  | 'EDUCATION'
  | 'SHOPPING'
  | 'FINANCE'
  | 'UTILITIES'
  | 'INSURANCE'
  | 'MEMBERSHIP'
  | 'DONATIONS'
  | 'OTHER'
```

### BillingCycle

```tsx
type BillingCycle =
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUAL'
  | 'YEARLY'
  | 'CUSTOM'
```

### CreateSubscriptionRequest

```tsx
interface CreateSubscriptionRequest {
  name: string
  description?: string
  category: SubscriptionCategory
  amount: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  nextBillingDate?: string
  merchantName?: string
  websiteUrl?: string
  cancellationUrl?: string
  notes?: string
  tags?: string[]
  autoRenew?: boolean
  notifyBeforeBilling?: boolean
  notifyDaysBefore?: number
  logoUrl?: string
}
```

### UpdateSubscriptionRequest

```tsx
interface UpdateSubscriptionRequest {
  name?: string
  description?: string
  category?: SubscriptionCategory
  amount?: number
  currency?: string
  billingCycle?: BillingCycle
  nextBillingDate?: string
  endDate?: string
  status?: SubscriptionStatus
  merchantName?: string
  websiteUrl?: string
  cancellationUrl?: string
  notes?: string
  tags?: string[]
  autoRenew?: boolean
  notifyBeforeBilling?: boolean
  notifyDaysBefore?: number
}
```

---

## 🔗 API Endpoints

The module expects these REST API endpoints:

### GET /user-subscriptions
Fetch all subscriptions with optional filtering.

**Query Parameters:**
- All SubscriptionFilters fields

**Response:**
```json
{
  "data": [UserSubscription[]],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /user-subscriptions/:id
Fetch single subscription.

**Response:** UserSubscription

### POST /user-subscriptions
Create subscription.

**Body:** CreateSubscriptionRequest

**Response:** UserSubscription

### PUT /user-subscriptions/:id
Update subscription.

**Body:** UpdateSubscriptionRequest

**Response:** UserSubscription

### DELETE /user-subscriptions/:id
Delete subscription.

**Response:** 204 No Content

### GET /user-subscriptions/analytics
Fetch analytics.

**Response:** SubscriptionAnalytics

### POST /user-subscriptions/detect
Auto-detect subscriptions.

**Response:** AutoDetectResponse

---

This completes the API reference. For usage examples, see [USAGE-GUIDE.md](./USAGE-GUIDE.md).
