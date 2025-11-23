/**
 * Crypto Data Hooks
 *
 * PURPOSE: Consolidated, production-grade React Query hooks for crypto data
 * - Single source of truth for ALL crypto server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: wallets, isLoading } = useCryptoWallets();
 * const { mutate: createWallet } = useCreateCryptoWallet();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { cryptoKeys, cryptoQueries, cryptoMutations } from './crypto-queries';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { useCryptoUIStore } from '@/lib/stores/crypto-ui-store';
import type {
  CryptoWallet,
  PortfolioParams,
  TransactionParams,
  NFTParams,
} from '@/lib/types/crypto';

// ============================================================================
// AUTH-READY WRAPPER
// ============================================================================

/**
 * Ensures queries only run when user is authenticated and initialized
 */
function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

/**
 * Helper to get organization ID from context store or explicit parameter
 */
function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}

// ============================================================================
// WALLET QUERIES
// ============================================================================

/**
 * Get all crypto wallets for the authenticated user
 * @param organizationId - Optional organization ID to scope data (uses context store if not provided)
 * @returns All wallets with loading/error states
 */
export function useCryptoWallets(organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.wallets(orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get a single crypto wallet by ID
 * @param walletId - Wallet ID to fetch
 * @param timeRange - Time range for charts (default: '24h')
 * @param organizationId - Optional organization ID to scope data
 * @returns Wallet data with loading/error states
 */
export function useCryptoWallet(walletId: string | null, timeRange?: string, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const portfolioTimeRange = useCryptoUIStore((state) => state.viewPreferences.portfolioTimeRange);
  const orgId = useContextOrganizationId(organizationId);

  const effectiveTimeRange = timeRange || portfolioTimeRange;

  return useQuery({
    ...cryptoQueries.wallet(walletId!, effectiveTimeRange, orgId),
    enabled: isAuthReady && !!walletId,
  });
}

/**
 * Get the currently selected wallet based on UI store
 * @param organizationId - Optional organization ID to scope data
 * @returns Selected wallet data or null
 */
export function useSelectedCryptoWallet(organizationId?: string) {
  const selectedWalletId = useCryptoUIStore((state) => state.selectedWalletId);
  const orgId = useContextOrganizationId(organizationId);
  return useCryptoWallet(selectedWalletId, undefined, orgId);
}

/**
 * Get aggregated wallet data across all user wallets
 * @param organizationId - Optional organization ID to scope data
 * @returns Aggregated wallet data with loading/error states
 */
export function useAggregatedCryptoWallet(organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.aggregatedWallet(orgId),
    enabled: isAuthReady,
  });
}

// ============================================================================
// PORTFOLIO QUERIES
// ============================================================================

/**
 * Get portfolio overview with aggregated data
 * @param params - Portfolio parameters (optional)
 * @param organizationId - Optional organization ID to scope data
 * @returns Portfolio data with loading/error states
 */
export function useCryptoPortfolio(params?: PortfolioParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const timeRange = useCryptoUIStore((state) => state.viewPreferences.portfolioTimeRange);
  const orgId = useContextOrganizationId(organizationId);

  const effectiveParams: PortfolioParams = {
    timeRange,
    ...params,
  };

  return useQuery({
    ...cryptoQueries.portfolio(effectiveParams, orgId),
    enabled: isAuthReady,
  });
}

// ============================================================================
// TRANSACTION QUERIES
// ============================================================================

/**
 * Get all transactions with optional filtering
 * @param params - Transaction filter parameters
 * @param organizationId - Optional organization ID to scope data
 * @returns Transactions with pagination
 */
export function useCryptoTransactions(params?: TransactionParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.transactions(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get transactions for a specific wallet
 * @param walletId - Wallet ID
 * @param params - Transaction filter parameters
 * @param organizationId - Optional organization ID to scope data
 * @returns Wallet transactions with pagination
 */
export function useWalletTransactions(walletId: string | null, params?: TransactionParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.walletTransactions(walletId!, params, orgId),
    enabled: isAuthReady && !!walletId,
  });
}

/**
 * Get transactions for the currently selected wallet
 * @param params - Transaction filter parameters
 * @param organizationId - Optional organization ID to scope data
 * @returns Selected wallet transactions
 */
export function useSelectedWalletTransactions(params?: TransactionParams, organizationId?: string) {
  const selectedWalletId = useCryptoUIStore((state) => state.selectedWalletId);
  const orgId = useContextOrganizationId(organizationId);
  return useWalletTransactions(selectedWalletId, params, orgId);
}

// ============================================================================
// NFT QUERIES
// ============================================================================

/**
 * Get all NFTs across all wallets
 * @param params - NFT filter parameters
 * @param organizationId - Optional organization ID to scope data
 * @returns NFTs with pagination
 */
export function useCryptoNFTs(params?: NFTParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.nfts(params, orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get NFTs for a specific wallet
 * @param walletId - Wallet ID
 * @param params - NFT filter parameters
 * @param organizationId - Optional organization ID to scope data
 * @returns Wallet NFTs with pagination
 */
export function useWalletNFTs(walletId: string | null, params?: NFTParams, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.walletNfts(walletId!, params, orgId),
    enabled: isAuthReady && !!walletId,
  });
}

// ============================================================================
// DEFI QUERIES
// ============================================================================

/**
 * Get all DeFi positions across all wallets
 * @param organizationId - Optional organization ID to scope data
 * @returns DeFi positions
 */
export function useCryptoDeFi(organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.defi(orgId),
    enabled: isAuthReady,
  });
}

/**
 * Get DeFi positions for a specific wallet
 * @param walletId - Wallet ID
 * @param organizationId - Optional organization ID to scope data
 * @returns Wallet DeFi positions
 */
export function useWalletDeFi(walletId: string | null, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.walletDefi(walletId!, orgId),
    enabled: isAuthReady && !!walletId,
  });
}

// ============================================================================
// SYNC QUERIES
// ============================================================================

/**
 * Get sync status for a wallet
 * @param walletId - Wallet ID
 * @param jobId - Optional sync job ID
 * @param organizationId - Optional organization ID to scope data
 * @returns Sync status (polls automatically while syncing)
 */
export function useWalletSyncStatus(walletId: string | null, jobId?: string, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.syncStatus(walletId!, jobId, orgId),
    enabled: isAuthReady && !!walletId && !!jobId,
  });
}

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

/**
 * Get crypto analytics data
 * @param params - Analytics parameters
 * @param organizationId - Optional organization ID to scope data
 * @returns Analytics data
 */
export function useCryptoAnalytics(params?: Record<string, unknown>, organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const orgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...cryptoQueries.analytics(params, orgId),
    enabled: isAuthReady,
  });
}

// ============================================================================
// WALLET MUTATIONS
// ============================================================================

/**
 * Create a new crypto wallet
 * @returns Mutation hook with optimistic updates
 */
export function useCreateCryptoWallet() {
  // Simply return the mutation from cryptoMutations
  // The mutation already has all the necessary logic including mutationFn
  return cryptoMutations.useCreateWallet();
}

/**
 * Update an existing crypto wallet
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateCryptoWallet() {
  // Simply return the mutation from cryptoMutations
  // The mutation already has all the necessary logic including mutationFn
  return cryptoMutations.useUpdateWallet();
}

/**
 * Delete a crypto wallet
 * @returns Mutation hook with optimistic updates
 */
export function useDeleteCryptoWallet() {
  // Simply return the mutation from cryptoMutations
  // The mutation already has all the necessary logic including mutationFn
  return cryptoMutations.useDeleteWallet();
}

// ============================================================================
// SYNC MUTATIONS
// ============================================================================

/**
 * Trigger sync for a wallet
 * @returns Mutation hook
 */
export function useSyncCryptoWallet() {
  // Simply return the mutation from cryptoMutations
  // The mutation already has all the necessary logic including mutationFn
  return cryptoMutations.useSyncWallet();
}

/**
 * Sync all crypto wallets
 * @returns Mutation hook
 */
export function useSyncAllCryptoWallets() {
  return cryptoMutations.useSyncAllWallets();
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all crypto-related queries
 * @returns Invalidation functions
 */
export function useInvalidateCryptoCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: cryptoKeys.all }),
    invalidateWallets: () => queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() }),
    invalidateWallet: (id: string) => queryClient.invalidateQueries({ queryKey: cryptoKeys.wallet(id) }),
    invalidatePortfolio: () => queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() }),
    invalidateTransactions: () => queryClient.invalidateQueries({ queryKey: cryptoKeys.transactions() }),
  };
}

/**
 * Prefetch crypto data for performance
 * @returns Prefetch functions
 */
export function usePrefetchCryptoData() {
  const queryClient = useQueryClient();
  const { isAuthReady } = useAuthReady();

  return {
    prefetchWallets: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(cryptoQueries.wallets());
      }
    },
    prefetchWallet: (walletId: string) => {
      if (isAuthReady) {
        queryClient.prefetchQuery(cryptoQueries.wallet(walletId));
      }
    },
    prefetchPortfolio: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(cryptoQueries.portfolio());
      }
    },
  };
}
