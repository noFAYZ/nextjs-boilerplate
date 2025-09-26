import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getUserWallets,
  getWalletPortfolio,
  getAggregatedPortfolio,
  createWallet,
  updateWallet,
  deleteWallet,
  getWalletTransactions,
  getWalletNFTs,
  getWalletDeFiPositions,
  getDeFiAnalytics,
  getWallet,
  getUserProgress,
} from '@/lib/actions/crypto-actions';
import type {
  CryptoWalletRequest,
  UpdateWalletRequest,
  CryptoTransactionFilters,
  NFTFilters,
  DeFiPositionFilters,
  PaginationOptions,
} from '@/docs/types/crypto';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'sonner';

// Query Keys
export const cryptoQueryKeys = {
  // Wallets
  wallets: ['crypto', 'wallets'] as const,
  wallet: (walletId: string) => ['crypto', 'wallet', walletId] as const,
  walletPortfolio: (walletId: string) => ['crypto', 'wallet', walletId, 'portfolio'] as const,

  // Portfolio
  aggregatedPortfolio: ['crypto', 'portfolio', 'aggregated'] as const,

  // Transactions
  walletTransactions: (walletId: string, filters?: CryptoTransactionFilters, options?: PaginationOptions) =>
    ['crypto', 'wallet', walletId, 'transactions', { filters, options }] as const,

  // NFTs
  walletNFTs: (walletId: string, filters?: NFTFilters, options?: PaginationOptions) =>
    ['crypto', 'wallet', walletId, 'nfts', { filters, options }] as const,

  // DeFi
  walletDefi: (walletId: string, filters?: DeFiPositionFilters, options?: PaginationOptions) =>
    ['crypto', 'wallet', walletId, 'defi', { filters, options }] as const,
  defiAnalytics: (walletId: string) => ['crypto', 'wallet', walletId, 'defi', 'analytics'] as const,

  // Progress
  userProgress: ['crypto', 'progress'] as const,
};

// ===============================
// WALLET HOOKS
// ===============================

/**
 * Hook to get all user wallets
 */
export function useWalletsNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.wallets,
    queryFn: getUserWallets(user.id),
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get single wallet data
 */
export function useWalletNew(walletId: string | undefined | null) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.wallet(walletId!),
    queryFn: () => getWallet(walletId!),
    enabled: !!user && !authLoading && !!walletId && walletId !== 'add',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get wallet portfolio data
 */
export function useWalletPortfolioNew(walletId: string | undefined | null) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.walletPortfolio(walletId!),
    queryFn: () => getWalletPortfolio(walletId!),
    enabled: !!user && !authLoading && !!walletId && walletId !== 'add',
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get aggregated portfolio
 */
export function useAggregatedPortfolioNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.aggregatedPortfolio,
    queryFn: getAggregatedPortfolio,
    enabled: !!user && !authLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ===============================
// TRANSACTION HOOKS
// ===============================

/**
 * Hook to get wallet transactions with pagination and filters
 */
export function useWalletTransactionsNew(
  walletId: string | undefined | null,
  filters: CryptoTransactionFilters = {},
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.walletTransactions(walletId!, filters, options),
    queryFn: () => getWalletTransactions(walletId!, filters, options),
    enabled: !!user && !authLoading && !!walletId && walletId !== 'add',
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// ===============================
// NFT HOOKS
// ===============================

/**
 * Hook to get wallet NFTs with pagination and filters
 */
export function useWalletNFTsNew(
  walletId: string | undefined | null,
  filters: NFTFilters = {},
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.walletNFTs(walletId!, filters, options),
    queryFn: () => getWalletNFTs(walletId!, filters, options),
    enabled: !!user && !authLoading && !!walletId && walletId !== 'add',
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ===============================
// DEFI HOOKS
// ===============================

/**
 * Hook to get wallet DeFi positions with pagination and filters
 */
export function useWalletDeFiPositionsNew(
  walletId: string | undefined | null,
  filters: DeFiPositionFilters = {},
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.walletDefi(walletId!, filters, options),
    queryFn: () => getWalletDeFiPositions(walletId!, filters, options),
    enabled: !!user && !authLoading && !!walletId && walletId !== 'add',
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to get DeFi analytics for a wallet
 */
export function useDeFiAnalyticsNew(walletId: string | undefined | null) {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.defiAnalytics(walletId!),
    queryFn: () => getDeFiAnalytics(walletId!),
    enabled: !!user && !authLoading && !!walletId && walletId !== 'add',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// ===============================
// UTILITY HOOKS
// ===============================

/**
 * Hook to get user sync progress
 */
export function useUserProgressNew() {
  const { user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: cryptoQueryKeys.userProgress,
    queryFn: getUserProgress,
    enabled: !!user && !authLoading,
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 2,
  });
}

// ===============================
// MUTATION HOOKS
// ===============================

/**
 * Hook to create a new wallet
 */
export function useCreateWalletNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CryptoWalletRequest) => createWallet(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch wallet queries
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.wallets });
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.aggregatedPortfolio });

        toast.success('Wallet created successfully');
      } else {
        toast.error(result.error || 'Failed to create wallet');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create wallet');
    },
  });
}

/**
 * Hook to update a wallet
 */
export function useUpdateWalletNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string; data: UpdateWalletRequest }) =>
      updateWallet(walletId, data),
    onSuccess: (result, { walletId }) => {
      if (result.success) {
        // Invalidate and refetch specific wallet and wallet list queries
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.wallet(walletId) });
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.walletPortfolio(walletId) });
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.wallets });
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.aggregatedPortfolio });

        toast.success('Wallet updated successfully');
      } else {
        toast.error(result.error || 'Failed to update wallet');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update wallet');
    },
  });
}

/**
 * Hook to delete a wallet
 */
export function useDeleteWalletNew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletId: string) => deleteWallet(walletId),
    onSuccess: (result, walletId) => {
      if (result.success) {
        // Remove specific wallet queries from cache
        queryClient.removeQueries({ queryKey: cryptoQueryKeys.wallet(walletId) });
        queryClient.removeQueries({ queryKey: cryptoQueryKeys.walletPortfolio(walletId) });

        // Invalidate wallet list and portfolio queries
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.wallets });
        queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.aggregatedPortfolio });

        toast.success('Wallet deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete wallet');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete wallet');
    },
  });
}

// ===============================
// COMBINED HOOKS FOR COMPLEX OPERATIONS
// ===============================

/**
 * Hook that combines wallet data with its portfolio for a complete view
 */
export function useWalletWithPortfolioNew(walletId: string | undefined | null) {
  const wallet = useWalletNew(walletId);
  const portfolio = useWalletPortfolioNew(walletId);

  return {
    wallet: wallet.data?.data,
    portfolio: portfolio.data?.data,
    isLoading: wallet.isLoading || portfolio.isLoading,
    error: wallet.error || portfolio.error,
    refetch: () => {
      wallet.refetch();
      portfolio.refetch();
    },
  };
}

/**
 * Hook that combines wallet data with transactions for dashboard views
 */
export function useWalletDashboardDataNew(
  walletId: string | undefined | null,
  transactionOptions: PaginationOptions = { page: 1, limit: 10 }
) {
  const wallet = useWalletNew(walletId);
  const portfolio = useWalletPortfolioNew(walletId);
  const transactions = useWalletTransactionsNew(walletId, {}, transactionOptions);
  const defiPositions = useWalletDeFiPositionsNew(walletId, {}, { page: 1, limit: 5 });

  return {
    wallet: wallet.data?.data,
    portfolio: portfolio.data?.data,
    transactions: transactions.data?.data,
    defiPositions: defiPositions.data?.data,
    isLoading: wallet.isLoading || portfolio.isLoading || transactions.isLoading,
    error: wallet.error || portfolio.error || transactions.error || defiPositions.error,
    refetch: () => {
      wallet.refetch();
      portfolio.refetch();
      transactions.refetch();
      defiPositions.refetch();
    },
  };
}

// ===============================
// CACHE MANAGEMENT UTILITIES
// ===============================

/**
 * Hook to invalidate all crypto-related queries
 */
export function useInvalidateCryptoQueriesNew() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto'] });
    },
    invalidateWallets: () => {
      queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.wallets });
    },
    invalidateWallet: (walletId: string) => {
      queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.wallet(walletId) });
    },
    invalidatePortfolio: () => {
      queryClient.invalidateQueries({ queryKey: cryptoQueryKeys.aggregatedPortfolio });
    },
  };
}