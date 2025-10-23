# Subscription Management Module

A comprehensive, production-ready subscription management module built with React, TypeScript, TanStack Query, and Zustand. This standalone module provides everything you need to build a SaaS subscription management system.

## 📦 Module Structure

```
subscription-module/
├── components/          # React UI components
│   ├── subscription-card.tsx
│   ├── subscription-details-modal.tsx
│   ├── subscription-list.tsx
│   ├── subscription-form-modal.tsx
│   ├── subscription-filters-sheet.tsx
│   └── subscription-analytics.tsx
├── hooks/              # TanStack Query hooks for data fetching
│   └── use-subscription-data.ts
├── queries/            # Query factory functions
│   └── subscription-queries.ts
├── stores/             # Zustand UI state management
│   └── subscription-ui-store.ts
├── services/           # API client and utilities
│   ├── subscriptions-api.ts
│   └── logo-service.ts
├── types/              # TypeScript type definitions
│   └── subscription.ts
├── docs/               # Documentation
│   ├── ARCHITECTURE.md
│   ├── API-REFERENCE.md
│   └── USAGE-GUIDE.md
└── README.md           # This file
```

## 🚀 Features

### Core Functionality
- ✅ **Complete CRUD Operations**: Create, read, update, and delete subscriptions
- ✅ **Advanced Filtering**: Filter by status, category, billing cycle, date range, and more
- ✅ **Smart Search**: Search across subscription names, merchants, and descriptions
- ✅ **Analytics Dashboard**: Track spending, upcoming bills, and subscription insights
- ✅ **Bulk Operations**: Manage multiple subscriptions at once
- ✅ **Auto-detection**: Detect recurring charges from transaction data

### Data Management
- ✅ **TanStack Query Integration**: Automatic caching, background sync, and optimistic updates
- ✅ **State Management**: Zustand for UI state (filters, preferences, modals)
- ✅ **Type Safety**: Full TypeScript support with comprehensive type definitions
- ✅ **Error Handling**: Robust error handling and user feedback

### UI/UX Features
- ✅ **Responsive Design**: Mobile-first, works on all screen sizes
- ✅ **Dark Mode Support**: Fully themed with light/dark mode
- ✅ **Logo Integration**: Automatic company logos via logo.dev API
- ✅ **Interactive Modals**: Rich subscription details with edit/delete actions
- ✅ **Loading States**: Skeleton loaders and loading indicators
- ✅ **Empty States**: User-friendly empty state messages

### Financial Features
- ✅ **Multi-Currency Support**: Handle any currency
- ✅ **Billing Cycles**: Daily, weekly, bi-weekly, monthly, quarterly, semi-annual, yearly
- ✅ **Cost Calculations**: Automatic monthly equivalent and yearly estimates
- ✅ **Spending Tracking**: Total spent, upcoming costs, and projections
- ✅ **Notifications**: Billing reminders and alerts

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Query v5** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives

### Key Libraries
- **lucide-react** - Icons
- **date-fns** - Date handling
- **recharts** - Data visualization

## 📋 Prerequisites

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

## 🚦 Quick Start

### 1. Install Dependencies

```bash
npm install @tanstack/react-query zustand
```

### 2. Setup TanStack Query

```tsx
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 3. Configure API Base URL

```tsx
// lib/api-client.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
```

### 4. Use Components

```tsx
import { SubscriptionList } from '@/subscription-module/components/subscription-list'
import { useSubscriptions } from '@/subscription-module/hooks/use-subscription-data'

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptions()

  return (
    <div>
      <h1>My Subscriptions</h1>
      <SubscriptionList />
    </div>
  )
}
```

## 📖 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Learn about the module architecture
- **[API Reference](./docs/API-REFERENCE.md)** - Complete API documentation
- **[Usage Guide](./docs/USAGE-GUIDE.md)** - Step-by-step usage examples

## 🎯 Key Concepts

### 1. Server State (TanStack Query)
All subscription data from the API is managed by TanStack Query:
- Automatic caching and background sync
- Optimistic updates for instant UI feedback
- Error handling and retry logic
- Loading and error states

### 2. UI State (Zustand)
UI preferences and filters are managed by Zustand:
- Filter selections (status, category, date range)
- View preferences (grid/list, sorting)
- Modal states (open/closed)
- Selected items for bulk operations

### 3. Separation of Concerns
- **Components**: Pure presentation, no data fetching
- **Hooks**: Data fetching and mutations
- **Services**: API communication
- **Stores**: UI state management
- **Types**: Type definitions

## 🔌 API Integration

The module expects a REST API with the following endpoints:

```
GET    /user-subscriptions
GET    /user-subscriptions/:id
POST   /user-subscriptions
PUT    /user-subscriptions/:id
DELETE /user-subscriptions/:id
GET    /user-subscriptions/analytics
POST   /user-subscriptions/detect
```

See [API Reference](./docs/API-REFERENCE.md) for detailed endpoint documentation.

## 🎨 Customization

### Theming
The module uses Tailwind CSS with CSS variables for theming:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --border: 214.3 31.8% 91.4%;
}
```

### Logo Service
Configure logo.dev API:

```tsx
// services/logo-service.ts
private readonly LOGO_DEV_API_TOKEN = 'your-api-key'
private readonly DEFAULT_SIZE = 300
private readonly DEFAULT_FORMAT = 'jpg'
```

## 📊 Components Overview

### Core Components

#### SubscriptionCard
Displays a single subscription in card format.
```tsx
<SubscriptionCard
  subscription={subscription}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onClick={handleClick}
/>
```

#### SubscriptionDetailsModal
Rich modal showing all subscription details.
```tsx
<SubscriptionDetailsModal
  subscription={subscription}
  open={isOpen}
  onOpenChange={setIsOpen}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### SubscriptionList
Grid or list view of subscriptions with filtering.
```tsx
<SubscriptionList
  onEdit={handleEdit}
  onDelete={handleDelete}
  activeTab="active"
/>
```

#### SubscriptionFormModal
Create or edit subscription form.
```tsx
<SubscriptionFormModal
  subscription={subscription} // undefined for create
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

#### SubscriptionFiltersSheet
Advanced filtering sidebar.
```tsx
<SubscriptionFiltersSheet
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

#### SubscriptionAnalytics
Dashboard with charts and insights.
```tsx
<SubscriptionAnalytics />
```

## 🔐 Security Considerations

1. **API Authentication**: Ensure your API client includes authentication tokens
2. **Input Validation**: All form inputs are validated before submission
3. **XSS Protection**: All user input is sanitized
4. **HTTPS**: Use HTTPS in production for API calls

## 🧪 Testing

The module is designed to be testable:

```tsx
// Example test
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubscriptionCard } from './subscription-card'

const queryClient = new QueryClient()

test('renders subscription card', () => {
  const subscription = {
    id: '1',
    name: 'Netflix',
    amount: 15.99,
    // ... other fields
  }

  render(
    <QueryClientProvider client={queryClient}>
      <SubscriptionCard subscription={subscription} />
    </QueryClientProvider>
  )

  expect(screen.getByText('Netflix')).toBeInTheDocument()
})
```

## 🚀 Performance Optimization

The module includes several performance optimizations:

1. **Query Caching**: TanStack Query caches all API responses
2. **Optimistic Updates**: Instant UI feedback on mutations
3. **Request Deduplication**: Multiple identical requests are merged
4. **Background Refetching**: Data stays fresh without blocking UI
5. **Lazy Loading**: Components load on demand
6. **Memoization**: Expensive calculations are memoized

## 📝 License

This module is part of MoneyMappr and follows the same license.

## 🤝 Contributing

Contributions are welcome! Please ensure:
1. TypeScript types are properly defined
2. Components follow the existing patterns
3. Documentation is updated
4. Tests are included for new features

## 🔗 Related Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 📧 Support

For issues or questions:
1. Check the [documentation](./docs/)
2. Review existing issues
3. Create a new issue with details

---

**Built with ❤️ for subscription management**
