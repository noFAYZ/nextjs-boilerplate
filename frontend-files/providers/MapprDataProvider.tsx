import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { PrismaClient } from '@prisma/client';

// Import services
import { FrontendCryptoService } from '../services/cryptoService';
import { FrontendAnalyticsService } from '../services/analyticsService';
import { FrontendSubscriptionService } from '../services/subscriptionService';
import { FrontendUsageService } from '../services/usageService';
import { FrontendAccountGroupService } from '../services/accountGroupService';

// Import hooks
import { useCrypto } from '../hooks/useCrypto';
import { useAnalytics } from '../hooks/useAnalytics';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useUsage } from '../hooks/useUsage';
import { useAccountGroups } from '../hooks/useAccountGroups';

export interface MapprDataContextValue {
  // Services (direct access for advanced users)
  services: {
    crypto: FrontendCryptoService;
    analytics: FrontendAnalyticsService;
    subscriptions: FrontendSubscriptionService;
    usage: FrontendUsageService;
    accountGroups: FrontendAccountGroupService;
  };

  // Hooks (recommended way to use services)
  hooks: {
    crypto: ReturnType<typeof useCrypto>;
    analytics: ReturnType<typeof useAnalytics>;
    subscriptions: ReturnType<typeof useSubscriptions>;
    usage: ReturnType<typeof useUsage>;
    accountGroups: ReturnType<typeof useAccountGroups>;
  };

  // User context
  userId: string;
}

export interface MapprDataProviderProps {
  children: ReactNode;
  prisma: PrismaClient;
  userId: string;
}

const MapprDataContext = createContext<MapprDataContextValue | null>(null);

export const MapprDataProvider: React.FC<MapprDataProviderProps> = ({
  children,
  prisma,
  userId,
}) => {
  // Create service instances (memoized to prevent recreation)
  const services = useMemo(() => ({
    crypto: new FrontendCryptoService(prisma),
    analytics: new FrontendAnalyticsService(prisma),
    subscriptions: new FrontendSubscriptionService(prisma),
    usage: new FrontendUsageService(prisma),
    accountGroups: new FrontendAccountGroupService(prisma),
  }), [prisma]);

  // Create hooks with services
  const hooks = useMemo(() => ({
    crypto: useCrypto({ cryptoService: services.crypto, userId }),
    analytics: useAnalytics({ analyticsService: services.analytics, userId }),
    subscriptions: useSubscriptions({ subscriptionService: services.subscriptions, userId }),
    usage: useUsage({ usageService: services.usage, userId }),
    accountGroups: useAccountGroups({ accountGroupService: services.accountGroups, userId }),
  }), [services, userId]);

  const value = useMemo(() => ({
    services,
    hooks,
    userId,
  }), [services, hooks, userId]);

  return (
    <MapprDataContext.Provider value={value}>
      {children}
    </MapprDataContext.Provider>
  );
};

// Custom hook to use the Mappr data context
export const useMapprData = (): MapprDataContextValue => {
  const context = useContext(MapprDataContext);
  if (!context) {
    throw new Error('useMapprData must be used within a MapprDataProvider');
  }
  return context;
};

// Individual context hooks for convenience
export const useMapprCrypto = () => {
  const { hooks } = useMapprData();
  return hooks.crypto;
};

export const useMapprAnalytics = () => {
  const { hooks } = useMapprData();
  return hooks.analytics;
};

export const useMapprSubscriptions = () => {
  const { hooks } = useMapprData();
  return hooks.subscriptions;
};

export const useMapprUsage = () => {
  const { hooks } = useMapprData();
  return hooks.usage;
};

export const useMapprAccountGroups = () => {
  const { hooks } = useMapprData();
  return hooks.accountGroups;
};

// Hook to get services directly (for advanced usage)
export const useMapprServices = () => {
  const { services } = useMapprData();
  return services;
};

// Hook to get user context
export const useMapprUser = () => {
  const { userId } = useMapprData();
  return { userId };
};

// Higher-order component for wrapping components that need Mappr data
export const withMapprData = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { prisma: PrismaClient; userId: string }> => {
  return ({ prisma, userId, ...props }) => (
    <MapprDataProvider prisma={prisma} userId={userId}>
      <Component {...props as P} />
    </MapprDataProvider>
  );
};

// Example usage components to demonstrate patterns

export const CryptoPortfolioWidget: React.FC = () => {
  const { getAggregatedPortfolio, loading, error } = useMapprCrypto();
  const [portfolio, setPortfolio] = React.useState(null);

  React.useEffect(() => {
    getAggregatedPortfolio().then(setPortfolio);
  }, [getAggregatedPortfolio]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!portfolio) return <div>No portfolio data</div>;

  return (
    <div>
      <h3>Total Portfolio Value</h3>
      <p>${portfolio.totalValueUsd?.toLocaleString()}</p>
      <p>{portfolio.totalAssets} assets across {portfolio.topAssets?.length || 0} positions</p>
    </div>
  );
};

export const AddWalletForm: React.FC = () => {
  const { addWallet, loading, error, clearError } = useMapprCrypto();
  const [formData, setFormData] = React.useState({
    name: '',
    address: '',
    network: 'ETHEREUM' as any,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await addWallet(formData);
    if (result) {
      alert('Wallet added successfully!');
      setFormData({ name: '', address: '', network: 'ETHEREUM', notes: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Wallet Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label>Network:</label>
        <select
          value={formData.network}
          onChange={(e) => setFormData({ ...formData, network: e.target.value as any })}
        >
          <option value="ETHEREUM">Ethereum</option>
          <option value="POLYGON">Polygon</option>
          <option value="ARBITRUM">Arbitrum</option>
          <option value="BASE">Base</option>
        </select>
      </div>
      <div>
        <label>Notes (optional):</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Wallet'}
      </button>
    </form>
  );
};

export const WalletManagementWidget: React.FC = () => {
  const {
    getUserWallets,
    updateWallet,
    removeWallet,
    loading,
    error,
    clearError
  } = useMapprCrypto();
  const [wallets, setWallets] = React.useState([]);
  const [editingWallet, setEditingWallet] = React.useState<string | null>(null);

  React.useEffect(() => {
    getUserWallets().then(setWallets);
  }, [getUserWallets]);

  const handleUpdateWallet = async (walletId: string, updates: any) => {
    clearError();
    const result = await updateWallet(walletId, updates);
    if (result) {
      setEditingWallet(null);
      // Refresh wallets list
      getUserWallets().then(setWallets);
    }
  };

  const handleRemoveWallet = async (walletId: string) => {
    if (confirm('Are you sure you want to remove this wallet?')) {
      clearError();
      const result = await removeWallet(walletId);
      if (result) {
        // Refresh wallets list
        getUserWallets().then(setWallets);
      }
    }
  };

  if (loading) return <div>Loading wallets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>My Wallets ({wallets.length})</h3>
      {wallets.map((wallet: any) => (
        <div key={wallet.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px' }}>
          {editingWallet === wallet.id ? (
            <EditWalletForm
              wallet={wallet}
              onSave={(updates) => handleUpdateWallet(wallet.id, updates)}
              onCancel={() => setEditingWallet(null)}
            />
          ) : (
            <div>
              <h4>{wallet.name}</h4>
              <p>Address: {wallet.address}</p>
              <p>Network: {wallet.network}</p>
              <p>Balance: ${wallet.totalBalanceUsd?.toLocaleString() || '0'}</p>
              <p>Assets: {wallet.assetCount || 0} | NFTs: {wallet.nftCount || 0}</p>
              <button onClick={() => setEditingWallet(wallet.id)}>Edit</button>
              <button onClick={() => handleRemoveWallet(wallet.id)}>Remove</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const EditWalletForm: React.FC<{
  wallet: any;
  onSave: (updates: any) => void;
  onCancel: () => void;
}> = ({ wallet, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: wallet.name,
    notes: wallet.notes || '',
    isWatching: wallet.isWatching,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Wallet Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label>Notes:</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.isWatching}
            onChange={(e) => setFormData({ ...formData, isWatching: e.target.checked })}
          />
          Watch this wallet
        </label>
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export const SubscriptionStatusWidget: React.FC = () => {
  const { getUserSubscription, loading, error } = useMapprSubscriptions();
  const [subscription, setSubscription] = React.useState(null);

  React.useEffect(() => {
    getUserSubscription().then(setSubscription);
  }, [getUserSubscription]);

  if (loading) return <div>Loading subscription...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!subscription) return <div>No subscription data</div>;

  return (
    <div>
      <h3>Current Plan</h3>
      <p>Plan: {subscription.currentPlan}</p>
      <p>Status: {subscription.subscription?.status}</p>
    </div>
  );
};

export const UsageStatsWidget: React.FC = () => {
  const { getUserUsageStats, loading, error } = useMapprUsage();
  const [usage, setUsage] = React.useState(null);

  React.useEffect(() => {
    getUserUsageStats().then(setUsage);
  }, [getUserUsageStats]);

  if (loading) return <div>Loading usage stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!usage) return <div>No usage data</div>;

  return (
    <div>
      <h3>Usage Statistics</h3>
      <p>Crypto Wallets: {usage.crypto_wallets.current}/{usage.crypto_wallets.limit === -1 ? '∞' : usage.crypto_wallets.limit}</p>
      <p>Accounts: {usage.accounts.current}/{usage.accounts.limit === -1 ? '∞' : usage.accounts.limit}</p>
      <p>Categories: {usage.categories.current}/{usage.categories.limit === -1 ? '∞' : usage.categories.limit}</p>
    </div>
  );
};