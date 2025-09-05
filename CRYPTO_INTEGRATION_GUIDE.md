# Crypto API Integration Guide

This guide explains how to use the robust crypto integration we've built using Zustand for state management and TanStack Query for API management.

## 🏗️ Architecture Overview

Our crypto integration follows a layered architecture:

1. **API Layer** (`lib/services/crypto-api.ts`) - Raw API calls to backend
2. **Query Layer** (`lib/queries/crypto-queries.ts`) - TanStack Query configuration
3. **State Layer** (`lib/stores/crypto-store.ts`) - Zustand global state
4. **Hook Layer** (`lib/hooks/use-crypto.ts`) - Custom React hooks
5. **Component Layer** - React components using the hooks

## 📋 Features Implemented

### ✅ Completed Features

- **Wallet Management**: Add, update, delete, and sync crypto wallets
- **Portfolio Tracking**: Real-time portfolio data with time range filtering  
- **Transaction History**: Paginated transaction listings with filtering
- **NFT Management**: View and manage NFT collections
- **DeFi Positions**: Track DeFi protocol positions
- **Sync Operations**: Background wallet sync with status polling
- **Analytics**: Portfolio analytics with various metrics
- **Data Export**: Export portfolio data in multiple formats
- **State Management**: Centralized state with Zustand
- **Query Management**: Optimized caching and background updates with TanStack Query

### 🔄 Real-time Features

- Auto-refresh portfolio data every 5 minutes
- Sync status polling with 2-second intervals
- Optimistic updates for mutations
- Background refetching on window focus

## 🛠️ Usage Examples

### Basic Wallet Management

```typescript
import { useWallets, useCreateWallet } from '@/lib/hooks/use-crypto';

function WalletManager() {
  const { wallets, isLoading, error } = useWallets();
  const createWallet = useCreateWallet();

  const handleAddWallet = async () => {
    await createWallet.mutateAsync({
      name: 'My Ethereum Wallet',
      address: '0x742d35Cc6673C4532E4C6F5d72c4c2E2B9f1e4A7',
      network: 'ETHEREUM',
      type: 'HOT_WALLET',
    });
  };

  if (isLoading) return <div>Loading wallets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {wallets.map(wallet => (
        <div key={wallet.id}>
          <h3>{wallet.name}</h3>
          <p>{wallet.address}</p>
          <p>Balance: ${parseFloat(wallet.totalBalanceUsd).toLocaleString()}</p>
        </div>
      ))}
      <button onClick={handleAddWallet}>Add Wallet</button>
    </div>
  );
}
```

### Portfolio Dashboard

```typescript
import { usePortfolioManager } from '@/lib/hooks/use-crypto';

function PortfolioDashboard() {
  const {
    portfolio,
    isLoading,
    timeRange,
    changeTimeRange
  } = usePortfolioManager();

  return (
    <div>
      <div>
        {['24h', '7d', '30d', '1y'].map(range => (
          <button
            key={range}
            onClick={() => changeTimeRange(range)}
            className={timeRange === range ? 'active' : ''}
          >
            {range}
          </button>
        ))}
      </div>
      
      {portfolio && (
        <div>
          <h2>Total Value: ${portfolio.totalValueUsd.toLocaleString()}</h2>
          <p>24h Change: {portfolio.dayChangePct.toFixed(2)}%</p>
          <p>Assets: {portfolio.totalAssets}</p>
          <p>NFTs: {portfolio.totalNfts}</p>
        </div>
      )}
    </div>
  );
}
```

### Transaction History with Pagination

```typescript
import { useTransactions } from '@/lib/hooks/use-crypto';

function TransactionList() {
  const { transactions, pagination, isLoading } = useTransactions({
    limit: 20,
    page: 1
  });

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>
          <span>{tx.type}</span>
          <span>{tx.valueFormatted} {tx.assetSymbol}</span>
          <span>${tx.valueUsd?.toLocaleString()}</span>
          <span>{tx.status}</span>
        </div>
      ))}
      
      {pagination && (
        <div>
          Page {pagination.page} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
}
```

### Infinite Scroll Transactions

```typescript
import { useInfiniteTransactions } from '@/lib/hooks/use-crypto';

function InfiniteTransactionList() {
  const {
    transactions,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteTransactions();

  return (
    <div>
      {transactions.map(tx => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Sync Management

```typescript
import { useSyncManager } from '@/lib/hooks/use-crypto';

function SyncControls() {
  const {
    syncWallet,
    syncAllWallets,
    hasActiveSyncs,
    isSyncing,
    getActiveSyncs
  } = useSyncManager();

  return (
    <div>
      <button
        onClick={() => syncAllWallets()}
        disabled={isSyncing || hasActiveSyncs()}
      >
        {isSyncing ? 'Syncing...' : 'Sync All Wallets'}
      </button>
      
      {hasActiveSyncs() && (
        <div>
          Active syncs: {getActiveSyncs().length}
        </div>
      )}
    </div>
  );
}
```

### Advanced Filtering

```typescript
import { useFilterManager, useTransactions } from '@/lib/hooks/use-crypto';

function FilteredTransactions() {
  const {
    filters,
    setNetworkFilter,
    setTransactionTypeFilter,
    clearFilters,
    hasActiveFilters
  } = useFilterManager();

  const { transactions } = useTransactions();

  return (
    <div>
      <div>
        <button onClick={() => setNetworkFilter(['ETHEREUM'])}>
          Ethereum Only
        </button>
        <button onClick={() => setTransactionTypeFilter(['SEND', 'RECEIVE'])}>
          Send/Receive Only
        </button>
        {hasActiveFilters() && (
          <button onClick={clearFilters}>Clear Filters</button>
        )}
      </div>
      
      <TransactionList transactions={transactions} />
    </div>
  );
}
```

## 🎛️ State Management

### Zustand Store Usage

```typescript
import { useCryptoStore } from '@/lib/stores/crypto-store';

function DirectStoreAccess() {
  const {
    wallets,
    selectedWallet,
    selectWallet,
    portfolio,
    viewPreferences,
    setWalletsView
  } = useCryptoStore();

  return (
    <div>
      <button onClick={() => setWalletsView('grid')}>Grid View</button>
      <button onClick={() => setWalletsView('list')}>List View</button>
      
      {wallets.map(wallet => (
        <div
          key={wallet.id}
          onClick={() => selectWallet(wallet)}
          className={selectedWallet?.id === wallet.id ? 'selected' : ''}
        >
          {wallet.name}
        </div>
      ))}
    </div>
  );
}
```

### Store Selectors

```typescript
import { useCryptoStore, selectFilteredWallets, selectTotalPortfolioValue } from '@/lib/stores/crypto-store';

function AdvancedSelectors() {
  const filteredWallets = useCryptoStore(selectFilteredWallets);
  const totalValue = useCryptoStore(selectTotalPortfolioValue);

  return (
    <div>
      <h2>Total Portfolio Value: ${totalValue.toLocaleString()}</h2>
      <p>Filtered Wallets: {filteredWallets.length}</p>
    </div>
  );
}
```

## 🔧 API Service Direct Usage

For advanced use cases, you can use the API service directly:

```typescript
import { cryptoApi } from '@/lib/services/crypto-api';

async function advancedOperations() {
  // Get wallet summary with all related data
  const summary = await cryptoApi.getWalletSummary('wallet-id');
  
  // Bulk update multiple wallets
  await cryptoApi.bulkUpdateWallets([
    { walletId: 'wallet-1', updates: { isActive: false } },
    { walletId: 'wallet-2', updates: { name: 'Updated Name' } }
  ]);
  
  // Poll sync status with progress callback
  await cryptoApi.pollSyncStatus(
    'wallet-id',
    'job-id',
    (status) => console.log('Sync progress:', status.progress),
    30, // max attempts
    2000 // interval
  );
}
```

## 📊 Query Invalidation

```typescript
import { useInvalidateCryptoQueries } from '@/lib/queries/crypto-queries';

function DataRefresh() {
  const {
    invalidateAll,
    invalidateWallets,
    invalidatePortfolio
  } = useInvalidateCryptoQueries();

  return (
    <div>
      <button onClick={invalidateAll}>Refresh All Data</button>
      <button onClick={invalidateWallets}>Refresh Wallets</button>
      <button onClick={invalidatePortfolio}>Refresh Portfolio</button>
    </div>
  );
}
```

## 🎨 Demo Component

A comprehensive demo component is available at `components/crypto/crypto-dashboard-demo.tsx` showing:

- Portfolio overview with time range controls
- Wallet management with real-time sync status
- Transaction history with filtering
- Add new wallet form with validation
- Real-time data updates

To use the demo:

```typescript
import { CryptoDashboardDemo } from '@/components/crypto/crypto-dashboard-demo';

export default function CryptoPage() {
  return <CryptoDashboardDemo />;
}
```

## 🔐 Authentication

All API calls automatically include authentication headers through the existing API client. Make sure users are authenticated before accessing crypto features.

## 🐛 Error Handling

Errors are handled at multiple levels:

1. **API Level**: Network and HTTP errors
2. **Query Level**: Query-specific errors with retry logic
3. **Hook Level**: User-friendly error states
4. **Component Level**: Error boundaries and user feedback

## 🚀 Performance Features

- **Query Deduplication**: Identical queries are automatically deduped
- **Background Refetching**: Data stays fresh without user intervention
- **Optimistic Updates**: Immediate UI updates for mutations
- **Selective Invalidation**: Only relevant queries are refetched
- **Stale-While-Revalidate**: Show cached data while fetching fresh data

## 📈 Best Practices

1. **Use Custom Hooks**: Always use the provided custom hooks instead of raw queries
2. **Handle Loading States**: Always show loading indicators for better UX
3. **Error Boundaries**: Wrap crypto components in error boundaries
4. **Optimistic Updates**: Use mutations with optimistic updates for instant feedback
5. **Query Keys**: Use the provided query key factory for consistency
6. **State Management**: Use Zustand for complex UI state, TanStack Query for server state

This integration provides a robust, scalable foundation for crypto portfolio management with excellent developer experience and user performance.