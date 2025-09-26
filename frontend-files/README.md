# Mappr Frontend Data Access Layer

This directory contains React hooks and Next.js Server Actions for the Mappr application, designed to provide type-safe, client-safe data access without direct Prisma usage on the frontend.

## 🚀 Quick Start

### Using Server Actions with Hooks
```typescript
import React from 'react';
import { useCrypto } from './hooks/useCrypto';

function CryptoPortfolio({ userId }: { userId: string }) {
  const { getAggregatedPortfolio, loading, error } = useCrypto({ userId });
  const [portfolio, setPortfolio] = React.useState(null);

  React.useEffect(() => {
    getAggregatedPortfolio().then((result) => {
      if (result?.success) {
        setPortfolio(result.data);
      }
    });
  }, [getAggregatedPortfolio]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Portfolio Value: ${portfolio?.totalBalanceUsd?.toLocaleString()}</h2>
      <p>Assets: {portfolio?.assetCount}</p>
      <p>NFTs: {portfolio?.nftCount}</p>
    </div>
  );
}
```

### Write Operations with Server Actions
```typescript
function WalletManager({ userId }: { userId: string }) {
  const { addWallet, updateWallet, removeWallet, loading, error } = useCrypto({ userId });

  const handleAddWallet = async () => {
    const walletData = {
      name: 'My Main Wallet',
      address: '0x1234567890123456789012345678901234567890',
      network: 'ETHEREUM' as const,
      notes: 'Primary trading wallet'
    };

    const result = await addWallet(walletData);
    if (result?.success) {
      console.log('Wallet added:', result.data);
    } else {
      console.error('Failed to add wallet:', result?.error);
    }
  };

  const handleUpdateWallet = async (walletId: string) => {
    const result = await updateWallet(walletId, {
      name: 'Updated Wallet Name',
      notes: 'Updated notes'
    });
    if (result?.success) {
      console.log('Wallet updated:', result.data);
    }
  };

  const handleRemoveWallet = async (walletId: string) => {
    const result = await removeWallet(walletId);
    if (result?.success) {
      console.log('Wallet removed successfully');
    }
  };

  return (
    <div>
      <button onClick={handleAddWallet} disabled={loading}>
        Add Wallet
      </button>
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

## 📁 Directory Structure

```
frontend-files/
├── actions/            # Next.js Server Actions (secure server-side operations)
│   ├── crypto.ts
│   ├── analytics.ts
│   ├── subscriptions.ts
│   ├── usage.ts
│   └── accountGroups.ts
├── hooks/              # React hooks for each service
│   ├── useCrypto.ts
│   ├── useAnalytics.ts
│   ├── useSubscriptions.ts
│   ├── useUsage.ts
│   └── useAccountGroups.ts
├── services/           # Legacy services (now deprecated - use actions instead)
├── providers/          # React context providers
│   └── MapprDataProvider.tsx
├── types/              # TypeScript type definitions
│   ├── crypto.ts
│   └── index.ts
└── README.md
```

## 🔧 Server Actions

All database operations are now handled through Next.js Server Actions marked with `'use server'`. These actions run securely on the server and provide consistent error handling.

### CryptoActions
Complete crypto wallet and portfolio management:

```typescript
import {
  createWallet,
  updateWallet,
  deleteWallet,
  getUserWallets,
  getWalletPortfolio,
  getAggregatedPortfolio
} from './actions/crypto';

// Add new wallet with validation
const result = await createWallet(userId, {
  name: 'My DeFi Wallet',
  address: '0x1234567890123456789012345678901234567890',
  network: 'ETHEREUM',
  notes: 'Used for DeFi protocols'
});

if (result.success) {
  console.log('Wallet created:', result.data);
} else {
  console.error('Error:', result.error);
}

// Get aggregated portfolio across all wallets
const portfolioResult = await getAggregatedPortfolio(userId);
if (portfolioResult.success) {
  const portfolio = portfolioResult.data;
  console.log('Total Balance:', portfolio.totalBalanceUsd);
}
```

### AnalyticsActions
System analytics and metrics:

```typescript
import {
  getApiAnalyticsSummary,
  getDashboardAnalytics,
  getUserAnalytics
} from './actions/analytics';

// Get API analytics summary
const apiStats = await getApiAnalyticsSummary({
  startDate: new Date('2024-01-01'),
  endDate: new Date(),
  userId: 'optional-user-id'
});

if (apiStats.success) {
  console.log('API Stats:', apiStats.data);
}
```

### SubscriptionActions
User subscription and plan management:

```typescript
import {
  getPlans,
  getUserSubscription,
  updateUserPlan
} from './actions/subscriptions';

// Get available plans
const plansResult = await getPlans();
if (plansResult.success) {
  console.log('Available plans:', plansResult.data);
}

// Change user plan
const upgradeResult = await updateUserPlan(userId, 'PRO');
if (upgradeResult.success) {
  console.log('Plan upgraded to PRO');
}
```

### UsageActions
Feature usage tracking and limits:

```typescript
import {
  getUserUsageStats,
  checkFeatureLimit,
  trackFeatureUsage
} from './actions/usage';

// Get user's usage statistics
const usageResult = await getUserUsageStats(userId);
if (usageResult.success) {
  const usage = usageResult.data;
  console.log('Wallets used:', usage.crypto_wallets.current);
  console.log('Wallets remaining:', usage.crypto_wallets.remaining);
}

// Check if user can create more wallets
const limitResult = await checkFeatureLimit(userId, 'crypto_wallets');
if (limitResult.success && limitResult.data.allowed) {
  console.log('User can create more wallets');
}
```

### AccountGroupActions
Account organization and hierarchy:

```typescript
import {
  getUserAccountGroups,
  createAccountGroup,
  getAccountGroupHierarchy
} from './actions/accountGroups';

// Get user's account groups with hierarchy
const groupsResult = await getUserAccountGroups(userId);
if (groupsResult.success) {
  console.log('Account groups:', groupsResult.data);
}

// Create new account group
const newGroupResult = await createAccountGroup(userId, {
  name: 'DeFi Investments',
  description: 'DeFi protocol investments',
  color: '#3B82F6',
  icon: 'defi'
});
```

## 🪝 React Hooks

Each service has a corresponding React hook with loading states, error handling, and request cancellation:

### useCrypto

```typescript
import { useCrypto } from './hooks/useCrypto';

function CryptoComponent({ userId }: { userId: string }) {
  const {
    getUserWallets,
    getWalletPortfolio,
    getAggregatedPortfolio,
    addWallet,
    updateWallet,
    removeWallet,
    loading,
    error,
    clearError
  } = useCrypto({ userId });

  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    getUserWallets().then((result) => {
      if (result?.success) {
        setWallets(result.data);
      }
    });
  }, [getUserWallets]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && (
        <div>
          Error: {error}
          <button onClick={clearError}>Clear</button>
        </div>
      )}
      {wallets.map(wallet => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
```

### useSubscriptions

```typescript
import { useSubscriptions } from './hooks/useSubscriptions';

function SubscriptionManager({ userId }: { userId: string }) {
  const {
    getAllPlans,
    getCurrentSubscription,
    changePlan,
    loading,
    error
  } = useSubscriptions({ userId });

  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);

  useEffect(() => {
    Promise.all([
      getAllPlans(),
      getCurrentSubscription()
    ]).then(([plansResult, subResult]) => {
      if (plansResult?.success) setPlans(plansResult.data);
      if (subResult?.success) setCurrentSub(subResult.data);
    });
  }, [getAllPlans, getCurrentSubscription]);

  const handleUpgrade = async (planType: string) => {
    const result = await changePlan(planType);
    if (result?.success) {
      setCurrentSub(result.data);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <h3>Current Plan: {currentSub?.currentPlan}</h3>
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onUpgrade={() => handleUpgrade(plan.type)}
        />
      ))}
    </div>
  );
}
```

## 🎯 Advanced Usage

### Error Handling

All server actions return a consistent response format:

```typescript
type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Custom Hook with Caching

```typescript
import { useCallback, useState, useEffect } from 'react';
import { useCrypto } from './hooks/useCrypto';

export const useCachedPortfolio = (userId: string, cacheTime = 5 * 60 * 1000) => {
  const { getAggregatedPortfolio } = useCrypto({ userId });
  const [portfolio, setPortfolio] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = useCallback(async (force = false) => {
    if (!force && lastFetch && Date.now() - lastFetch < cacheTime) {
      return portfolio;
    }

    setLoading(true);
    try {
      const result = await getAggregatedPortfolio();
      if (result?.success) {
        setPortfolio(result.data);
        setLastFetch(Date.now());
        return result.data;
      }
    } finally {
      setLoading(false);
    }
  }, [getAggregatedPortfolio, portfolio, lastFetch, cacheTime]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return { portfolio, loading, refetch: () => fetchPortfolio(true) };
};
```

### Combining Multiple Services

```typescript
import { useCrypto, useUsage, useSubscriptions } from './hooks';

function UserDashboard({ userId }: { userId: string }) {
  const crypto = useCrypto({ userId });
  const usage = useUsage({ userId });
  const subscriptions = useSubscriptions({ userId });

  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const loadDashboard = async () => {
      const [portfolioResult, usageResult, subResult] = await Promise.all([
        crypto.getAggregatedPortfolio(),
        usage.getUsageStats(),
        subscriptions.getCurrentSubscription()
      ]);

      setDashboardData({
        portfolio: portfolioResult?.success ? portfolioResult.data : null,
        usage: usageResult?.success ? usageResult.data : null,
        subscription: subResult?.success ? subResult.data : null
      });
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard">
      <PortfolioOverview data={dashboardData.portfolio} />
      <UsageMetrics data={dashboardData.usage} />
      <SubscriptionStatus data={dashboardData.subscription} />
    </div>
  );
}
```

## 🎨 Integration with UI Libraries

### With React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrypto } from './hooks/useCrypto';

function CryptoWallets({ userId }: { userId: string }) {
  const { getUserWallets, addWallet } = useCrypto({ userId });
  const queryClient = useQueryClient();

  const { data: wallets, isLoading, error } = useQuery({
    queryKey: ['wallets', userId],
    queryFn: async () => {
      const result = await getUserWallets();
      if (result?.success) return result.data;
      throw new Error(result?.error || 'Failed to fetch wallets');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addWalletMutation = useMutation({
    mutationFn: addWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets', userId] });
    },
  });

  return (
    <div>
      {isLoading && <div>Loading wallets...</div>}
      {error && <div>Error: {error.message}</div>}
      {wallets?.map(wallet => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
      <button
        onClick={() => addWalletMutation.mutate({
          name: 'New Wallet',
          address: '0x...',
          network: 'ETHEREUM'
        })}
        disabled={addWalletMutation.isPending}
      >
        Add Wallet
      </button>
    </div>
  );
}
```

### With SWR

```typescript
import useSWR from 'swr';
import { useCrypto } from './hooks/useCrypto';

function Portfolio({ userId }: { userId: string }) {
  const { getAggregatedPortfolio } = useCrypto({ userId });

  const { data: portfolio, error, mutate } = useSWR(
    ['portfolio', userId],
    async () => {
      const result = await getAggregatedPortfolio();
      if (result?.success) return result.data;
      throw new Error(result?.error || 'Failed to fetch portfolio');
    },
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  return (
    <div>
      {!portfolio && !error && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {portfolio && (
        <div>
          <h2>Total Value: ${portfolio.totalBalanceUsd.toLocaleString()}</h2>
          <button onClick={() => mutate()}>Refresh</button>
        </div>
      )}
    </div>
  );
}
```

## 🔒 Security Features

1. **Server-Side Execution**: All database operations run on the server with `'use server'`
2. **User Context Validation**: User ID validation in all server actions
3. **Data Sanitization**: Input validation and sanitization in server actions
4. **Error Handling**: Consistent error responses without exposing sensitive data
5. **Type Safety**: Full TypeScript support for all operations

## 📊 Performance Tips

1. **Automatic Caching**: Next.js automatically caches server action results
2. **Revalidation**: Use `revalidatePath()` for cache invalidation
3. **Pagination**: All list operations support pagination
4. **Optimistic Updates**: Use optimistic update patterns in hooks
5. **Request Cancellation**: Built-in request cancellation in hooks

## 🚀 Migration from Services

If you're migrating from the old service-based approach:

### Before (Services):
```typescript
const cryptoService = new FrontendCryptoService(prisma);
const wallet = await cryptoService.addWallet(userId, walletData);
```

### After (Server Actions):
```typescript
const { addWallet } = useCrypto({ userId });
const result = await addWallet(walletData);
if (result.success) {
  console.log('Wallet added:', result.data);
}
```

## 🤝 Contributing

When adding new operations:

1. Add server action to appropriate file in `actions/`
2. Update corresponding hook in `hooks/`
3. Update TypeScript types
4. Add error handling and validation
5. Test with different user permissions
6. Update this README with examples

## 📝 License

This code is part of the Mappr backend and follows the same licensing terms.