'use client';

import { useEffect } from 'react';
import { useOrganizationCryptoPortfolio } from '@/lib/queries/use-organization-data-context';
import { useAuthStore } from '@/lib/stores/auth-store';

/**
 * PortfolioSyncProvider
 *
 * This provider ensures portfolio data is fetched and synced to the crypto store
 * so that widgets can access the data directly from the store without fetching.
 *
 * Place this high in your component tree (e.g., in RootLayout or DashboardLayout)
 */
export function PortfolioSyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { data: portfolio, isLoading, error } = useOrganizationCryptoPortfolio();

  // The usePortfolio hook automatically syncs data to the store
  // This component just ensures the hook is called at the top level
  useEffect(() => {
    if (user && portfolio) {
      console.log('[PortfolioSync] Portfolio data synced to store:', {
        totalValueUsd: portfolio.totalValueUsd,
        topAssetsCount: portfolio.topAssets?.length || 0,
        networksCount: portfolio.networkDistribution?.length || 0,
      });
    }
  }, [user, portfolio]);

  useEffect(() => {
    if (error) {
      console.error('[PortfolioSync] Error fetching portfolio:', error);
    }
  }, [error]);

  return <>{children}</>;
}
