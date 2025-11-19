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

  const effectiveTimeRange = timeRange || portfolioTimeRange;

  return useQuery({
    ...cryptoQueries.wallet(walletId!, effectiveTimeRange, organizationId),
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
  return useCryptoWallet(selectedWalletId, undefined, organizationId);
}

/**
 * Get aggregated wallet data across all user wallets
 * @param organizationId - Optional organization ID to scope data
 * @returns Aggregated wallet data with loading/error states
 */
export function useAggregatedCryptoWallet(organizationId?: string) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...cryptoQueries.aggregatedWallet(organizationId),
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

  const effectiveParams: PortfolioParams = {
    timeRange,
    ...params,
  };

  return useQuery({
    ...cryptoQueries.portfolio(effectiveParams, organizationId),
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

  return useQuery({
    ...cryptoQueries.transactions(params, organizationId),
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

  return useQuery({
    ...cryptoQueries.walletTransactions(walletId!, params, organizationId),
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
  return useWalletTransactions(selectedWalletId, params, organizationId);
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

  return useQuery({
    ...cryptoQueries.nfts(params, organizationId),
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

  return useQuery({
    ...cryptoQueries.walletNfts(walletId!, params, organizationId),
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

  return useQuery({
    ...cryptoQueries.defi(organizationId),
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

  return useQuery({
    ...cryptoQueries.walletDefi(walletId!, organizationId),
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

  return useQuery({
    ...cryptoQueries.syncStatus(walletId!, jobId, organizationId),
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

  return useQuery({
    ...cryptoQueries.analytics(params, organizationId),
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
  const queryClient = useQueryClient();
  const mutation = cryptoMutations.useCreateWallet();
  const { closeCreateWalletModal } = useCryptoUIStore();

  return useMutation({
    ...mutation,
    onSuccess: (response) => {
      if (response.success) {
        closeCreateWalletModal();

        // Optimistic UI update
        queryClient.setQueryData(cryptoKeys.wallets(), (old: unknown) => {
          if (!old || typeof old !== 'object' || !('data' in old)) return old;
          return {
            ...old,
            data: [...(old.data as CryptoWallet[]), response.data],
          };
        });
      }
      mutation.onSuccess?.(response, {} as CreateWalletRequest, undefined);
    },
  });
}

/**
 * Update an existing crypto wallet
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateCryptoWallet() {
  const queryClient = useQueryClient();
  const mutation = cryptoMutations.useUpdateWallet();
  const { closeEditWalletModal } = useCryptoUIStore();

  return useMutation({
    ...mutation,
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cryptoKeys.wallet(id) });
      await queryClient.cancelQueries({ queryKey: cryptoKeys.wallets() });

      // Snapshot previous value
      const previousWallet = queryClient.getQueryData(cryptoKeys.wallet(id));
      const previousWallets = queryClient.getQueryData(cryptoKeys.wallets());

      // Optimistically update wallet
      queryClient.setQueryData(cryptoKeys.wallet(id), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: { ...(old.data as CryptoWallet), ...updates },
        };
      });

      // Optimistically update wallet list
      queryClient.setQueryData(cryptoKeys.wallets(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: (old.data as CryptoWallet[]).map((w: CryptoWallet) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        };
      });

      return { previousWallet, previousWallets };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousWallet) {
        queryClient.setQueryData(cryptoKeys.wallet(_variables.id), context.previousWallet);
      }
      if (context?.previousWallets) {
        queryClient.setQueryData(cryptoKeys.wallets(), context.previousWallets);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        closeEditWalletModal();
      }
      mutation.onSuccess?.(response, { id: '', updates: {} as UpdateWalletRequest }, undefined);
    },
  });
}

/**
 * Delete a crypto wallet
 * @returns Mutation hook with optimistic updates
 */
export function useDeleteCryptoWallet() {
  const queryClient = useQueryClient();
  const mutation = cryptoMutations.useDeleteWallet();
  const { closeDeleteWalletModal, selectWallet } = useCryptoUIStore();

  return useMutation({
    ...mutation,
    onMutate: async (walletId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cryptoKeys.wallets() });

      // Snapshot previous value
      const previousWallets = queryClient.getQueryData(cryptoKeys.wallets());

      // Optimistically remove wallet
      queryClient.setQueryData(cryptoKeys.wallets(), (old: unknown) => {
        if (!old || typeof old !== 'object' || !('data' in old)) return old;
        return {
          ...old,
          data: (old.data as CryptoWallet[]).filter((w: CryptoWallet) => w.id !== walletId),
        };
      });

      return { previousWallets };
    },
    onError: (_error, _walletId, context) => {
      // Rollback on error
      if (context?.previousWallets) {
        queryClient.setQueryData(cryptoKeys.wallets(), context.previousWallets);
      }
    },
    onSuccess: (response, walletId) => {
      if (response.success) {
        closeDeleteWalletModal();
        selectWallet(null); // Deselect if deleted
      }
      mutation.onSuccess?.(response, walletId, undefined);
    },
  });
}

// ============================================================================
// SYNC MUTATIONS
// ============================================================================

/**
 * Trigger sync for a wallet
 * @returns Mutation hook
 */
export function useSyncCryptoWallet() {
  const { closeSyncModal } = useCryptoUIStore();
  const mutation = cryptoMutations.useSyncWallet();

  return useMutation({
    ...mutation,
    onSuccess: (response) => {
      if (response.success) {
        closeSyncModal();
      }
      mutation.onSuccess?.(response, {} as SyncRequest, undefined);
    },
  });
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
