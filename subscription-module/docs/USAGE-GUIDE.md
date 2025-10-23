# Usage Guide

Step-by-step guide to using the subscription management module in your React application.

## 📑 Table of Contents

1. [Basic Setup](#basic-setup)
2. [Displaying Subscriptions](#displaying-subscriptions)
3. [Creating Subscriptions](#creating-subscriptions)
4. [Updating Subscriptions](#updating-subscriptions)
5. [Deleting Subscriptions](#deleting-subscriptions)
6. [Filtering & Searching](#filtering--searching)
7. [Analytics Dashboard](#analytics-dashboard)
8. [Advanced Patterns](#advanced-patterns)

---

## 🚀 Basic Setup

### Step 1: Install Dependencies

```bash
npm install @tanstack/react-query zustand
```

### Step 2: Setup TanStack Query Provider

```tsx
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.Node }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 3,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Step 3: Wrap Your App

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### Step 4: Configure API Base URL

```tsx
// lib/api-client.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

class ApiClient {
  async get<T>(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        'Authorization': `Bearer ${getAuthToken()}`
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  }

  // Implement post, put, delete similarly
}

export const apiClient = new ApiClient()
```

---

## 📋 Displaying Subscriptions

### Basic List

```tsx
// app/subscriptions/page.tsx
'use client'

import { SubscriptionList } from '@/subscription-module/components/subscription-list'
import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading, error } = useSubscriptions()

  if (isLoading) {
    return <div>Loading subscriptions...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Subscriptions</h1>
      <SubscriptionList />
    </div>
  )
}
```

### With Tabs

```tsx
'use client'

import { useState } from 'react'
import { SubscriptionList } from '@/subscription-module/components/subscription-list'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="trial">Trial</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <SubscriptionList activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Custom Card Grid

```tsx
'use client'

import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'
import { SubscriptionCard } from '@/subscription-module/components/subscription-card'

export default function CustomGrid() {
  const { data: subscriptions } = useSubscriptions()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {subscriptions?.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onClick={(sub) => console.log('Clicked:', sub.name)}
        />
      ))}
    </div>
  )
}
```

---

## ➕ Creating Subscriptions

### Using Form Modal

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SubscriptionFormModal } from '@/subscription-module/components/subscription-form-modal'
import { Plus } from 'lucide-react'

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Subscription
      </Button>

      <SubscriptionFormModal
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  )
}
```

### Programmatic Creation

```tsx
'use client'

import { useCreateSubscription } from '@/subscription-module/hooks/use-subscription-data'
import { Button } from '@/components/ui/button'

export default function QuickAdd() {
  const { mutate: createSubscription, isLoading } = useCreateSubscription()

  const handleQuickAdd = () => {
    createSubscription({
      name: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      billingCycle: 'MONTHLY',
      category: 'STREAMING',
      startDate: new Date().toISOString(),
      websiteUrl: 'https://netflix.com',
      autoRenew: true,
      notifyBeforeBilling: true,
      notifyDaysBefore: 3,
    })
  }

  return (
    <Button onClick={handleQuickAdd} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add Netflix'}
    </Button>
  )
}
```

### With Success Callback

```tsx
const { mutate: createSubscription } = useCreateSubscription()

const handleCreate = () => {
  createSubscription(
    {
      name: 'Spotify Premium',
      amount: 10.99,
      // ... other fields
    },
    {
      onSuccess: (data) => {
        toast.success(`${data.name} added successfully!`)
        router.push(`/subscriptions/${data.id}`)
      },
      onError: (error) => {
        toast.error(`Failed to add subscription: ${error.message}`)
      },
    }
  )
}
```

---

## ✏️ Updating Subscriptions

### Using Form Modal

```tsx
'use client'

import { useState } from 'react'
import { SubscriptionFormModal } from '@/subscription-module/components/subscription-form-modal'
import { SubscriptionCard } from '@/subscription-module/components/subscription-card'

export default function EditableCard({ subscription }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)

  const handleEdit = (sub) => {
    setSelectedSub(sub)
    setIsEditOpen(true)
  }

  return (
    <>
      <SubscriptionCard
        subscription={subscription}
        onEdit={handleEdit}
      />

      <SubscriptionFormModal
        subscription={selectedSub}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  )
}
```

### Programmatic Update

```tsx
'use client'

import { useUpdateSubscription } from '@/subscription-module/hooks/use-subscription-data'

export default function PriceIncreaseButton({ subscriptionId }) {
  const { mutate: updateSubscription } = useUpdateSubscription()

  const handlePriceIncrease = () => {
    updateSubscription({
      id: subscriptionId,
      data: {
        amount: 19.99, // New price
      }
    })
  }

  return (
    <Button onClick={handlePriceIncrease}>
      Update Price
    </Button>
  )
}
```

### Bulk Update

```tsx
'use client'

import { useUpdateSubscription } from '@/subscription-module/hooks/use-subscription-data'

export default function BulkPauseButton({ subscriptionIds }) {
  const { mutate: updateSubscription } = useUpdateSubscription()

  const handleBulkPause = async () => {
    for (const id of subscriptionIds) {
      updateSubscription({
        id,
        data: { status: 'PAUSED' }
      })
    }
  }

  return (
    <Button onClick={handleBulkPause}>
      Pause Selected ({subscriptionIds.length})
    </Button>
  )
}
```

---

## 🗑️ Deleting Subscriptions

### With Confirmation Dialog

```tsx
'use client'

import { useDeleteSubscription } from '@/subscription-module/hooks/use-subscription-data'
import { SubscriptionCard } from '@/subscription-module/components/subscription-card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

export default function DeletableCard({ subscription }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { mutate: deleteSubscription } = useDeleteSubscription()

  const handleDelete = () => {
    deleteSubscription(subscription.id, {
      onSuccess: () => {
        toast.success('Subscription deleted')
        setIsDeleteOpen(false)
      }
    })
  }

  return (
    <>
      <SubscriptionCard
        subscription={subscription}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {subscription.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subscription and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
```

---

## 🔍 Filtering & Searching

### Basic Filtering

```tsx
'use client'

import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'
import { SubscriptionList } from '@/subscription-module/components/subscription-list'

export default function FilteredList() {
  const { data: activeSubscriptions } = useSubscriptions({
    status: 'ACTIVE',
    sortBy: 'amount',
    sortOrder: 'desc'
  })

  return <SubscriptionList />
}
```

### Using Filter Sheet

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SubscriptionFiltersSheet } from '@/subscription-module/components/subscription-filters-sheet'
import { SubscriptionList } from '@/subscription-module/components/subscription-list'
import { Filter } from 'lucide-react'

export default function FilterableList() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Subscriptions</h1>
        <Button onClick={() => setIsFiltersOpen(true)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <SubscriptionList />

      <SubscriptionFiltersSheet
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
      />
    </div>
  )
}
```

### Search Implementation

```tsx
'use client'

import { useState } from 'react'
import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'
import { Input } from '@/components/ui/input'
import { SubscriptionList } from '@/subscription-module/components/subscription-list'
import { Search } from 'lucide-react'

export default function SearchableList() {
  const [search, setSearch] = useState('')

  const { data: subscriptions } = useSubscriptions({
    search,
  })

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <SubscriptionList />
    </div>
  )
}
```

### Category Filter

```tsx
'use client'

import { useState } from 'react'
import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'
import { Select } from '@/components/ui/select'

export default function CategoryFilter() {
  const [category, setCategory] = useState('all')

  const { data: subscriptions } = useSubscriptions({
    category: category === 'all' ? undefined : category
  })

  return (
    <div>
      <Select value={category} onValueChange={setCategory}>
        <option value="all">All Categories</option>
        <option value="STREAMING">Streaming</option>
        <option value="SOFTWARE">Software</option>
        <option value="GAMING">Gaming</option>
        {/* ... more categories */}
      </Select>

      {/* Display filtered subscriptions */}
    </div>
  )
}
```

---

## 📊 Analytics Dashboard

### Basic Dashboard

```tsx
'use client'

import { SubscriptionAnalytics } from '@/subscription-module/components/subscription-analytics'

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subscription Analytics</h1>
      <SubscriptionAnalytics />
    </div>
  )
}
```

### Custom Metrics

```tsx
'use client'

import { useSubscriptionAnalytics } from '@/subscription-module/hooks/use-subscription-data'
import { Card } from '@/components/ui/card'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default function CustomDashboard() {
  const { data: analytics } = useSubscriptionAnalytics()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Spending</p>
            <p className="text-2xl font-bold">
              ${analytics?.totalMonthlySpending.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500/10">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Yearly Projection</p>
            <p className="text-2xl font-bold">
              ${analytics?.totalYearlySpending.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next 7 Days</p>
            <p className="text-2xl font-bold">
              {analytics?.upcomingBills.next7Days}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

---

## 🎯 Advanced Patterns

### Prefetching

```tsx
'use client'

import { useQueryClient } from '@tanstack/react-query'
import { subscriptionQueries } from '@/subscription-module/queries/subscription-queries'
import Link from 'next/link'

export default function SubscriptionLink({ id, name }) {
  const queryClient = useQueryClient()

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: subscriptionQueries.detail(id).queryKey,
      queryFn: subscriptionQueries.detail(id).queryFn,
    })
  }

  return (
    <Link
      href={`/subscriptions/${id}`}
      onMouseEnter={handleMouseEnter}
    >
      {name}
    </Link>
  )
}
```

### Optimistic Updates

```tsx
'use client'

import { useUpdateSubscription } from '@/subscription-module/hooks/use-subscription-data'
import { Toggle } from '@/components/ui/toggle'

export default function AutoRenewToggle({ subscription }) {
  const { mutate: updateSubscription } = useUpdateSubscription()

  const handleToggle = (enabled: boolean) => {
    updateSubscription({
      id: subscription.id,
      data: { autoRenew: enabled }
    })
  }

  return (
    <Toggle
      pressed={subscription.autoRenew}
      onPressedChange={handleToggle}
    >
      Auto-Renew
    </Toggle>
  )
}
```

### Polling for Real-time Updates

```tsx
'use client'

import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'

export default function RealTimeList() {
  const { data: subscriptions } = useSubscriptions(undefined, {
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: true,
  })

  return (
    <div>
      {/* Display subscriptions */}
    </div>
  )
}
```

### Dependent Queries

```tsx
'use client'

import { useSubscription } from '@/subscription-module/hooks/use-subscription-data'
import { useQuery } from '@tanstack/react-query'

export default function SubscriptionWithCharges({ id }) {
  // First: Fetch subscription
  const { data: subscription } = useSubscription(id)

  // Second: Fetch charges (only if subscription exists)
  const { data: charges } = useQuery({
    queryKey: ['charges', id],
    queryFn: () => fetchCharges(id),
    enabled: !!subscription, // Only run if subscription exists
  })

  return (
    <div>
      <h2>{subscription?.name}</h2>
      <ul>
        {charges?.map(charge => (
          <li key={charge.id}>{charge.amount}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 🎨 Customization

### Custom Theme

```css
/* app/globals.css */
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --border: 214.3 31.8% 91.4%;
}

.dark {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --muted: 217.2 32.6% 17.5%;
  --border: 217.2 32.6% 17.5%;
}
```

### Custom Logo Service Config

```tsx
// subscription-module/services/logo-service.ts
private readonly LOGO_DEV_API_TOKEN = 'your-api-key'
private readonly DEFAULT_SIZE = 300
private readonly DEFAULT_FORMAT = 'jpg'
private readonly DEFAULT_RETINA = true
```

---

This completes the usage guide. For more details, see [API-REFERENCE.md](./API-REFERENCE.md).
