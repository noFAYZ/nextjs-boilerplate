import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createWallet,
  updateWallet,
  deleteWallet,
  getUserWallets,
  getWalletByIdOrAddress,
  getWalletPortfolio,
  getAggregatedPortfolio,
  getWalletTransactions,
  getWalletNFTs,
  getWalletDeFiPositions,
  searchWallets,
} from '../actions/crypto';
import type {
  CryptoWalletRequest,
  UpdateWalletRequest,
  PortfolioSummary,
  CryptoTransactionFilters,
  PaginationOptions,
  PaginatedResponse,
  NFTFilters,
  DeFiPositionFilters,
} from '../types/crypto';

export interface UseCryptoConfig {
  userId: string;
}

export const useCrypto = ({ userId }: UseCryptoConfig) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController>();

  // Cancel ongoing requests when component unmounts or new request starts
  const cancelPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
  }, []);

  useEffect(() => {
    return () => {
      cancelPendingRequests();
    };
  }, [cancelPendingRequests]);

  // Generic error handler
  const handleError = useCallback((err: unknown, fallback: string = 'An error occurred') => {
    const message = err instanceof Error ? err.message : fallback;
    setError(message);
    setLoading(false);
  }, []);

  // Generic loading wrapper
  const withLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      cancelPendingRequests();
      setLoading(true);
      setError(null);
      const result = await operation();
      setLoading(false);
      return result;
    } catch (err: any) {
      if (err.name === 'AbortError') return null;
      handleError(err);
      return null;
    }
  }, [cancelPendingRequests, handleError]);

  // ===============================
  // POST OPERATIONS (WRITE)
  // ===============================

  // Add new wallet
  const addWallet = useCallback(async (walletData: CryptoWalletRequest) => {
    return await withLoading(() => createWallet(userId, walletData));
  }, [userId, withLoading]);

  // Update existing wallet
  const updateWalletData = useCallback(async (walletId: string, updateData: UpdateWalletRequest) => {
    return await withLoading(() => updateWallet(userId, walletId, updateData));
  }, [userId, withLoading]);

  // Remove wallet
  const removeWallet = useCallback(async (walletId: string) => {
    return await withLoading(() => deleteWallet(userId, walletId));
  }, [userId, withLoading]);

  // ===============================
  // READ OPERATIONS (EXACT BACKEND STRUCTURE)
  // ===============================

  // User wallets
  const getUserWalletsData = useCallback(async () => {
    return await withLoading(() => getUserWallets(userId));
  }, [userId, withLoading]);

  // Wallet resolution
  const resolveWallet = useCallback(async (walletId?: string, address?: string) => {
    if (walletId) {
      return await withLoading(() => getWalletByIdOrAddress(userId, walletId));
    } else if (address) {
      return await withLoading(() => getWalletByIdOrAddress(userId, address));
    }
    return null;
  }, [userId, withLoading]);

  // Wallet portfolio - EXACT BACKEND STRUCTURE
  const getWalletPortfolioData = useCallback(async (walletId: string) => {
    return await withLoading(() => getWalletPortfolio(userId, walletId));
  }, [userId, withLoading]);

  // Aggregated portfolio - EXACT BACKEND STRUCTURE
  const getAggregatedPortfolioData = useCallback(async (): Promise<PortfolioSummary | null> => {
    return await withLoading(() => getAggregatedPortfolio(userId));
  }, [userId, withLoading]);

  // Wallet transactions - EXACT BACKEND STRUCTURE
  const getWalletTransactionsData = useCallback(async (
    walletId: string,
    filters: CryptoTransactionFilters = {},
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<any> | null> => {
    return await withLoading(() =>
      getWalletTransactions(userId, walletId, filters, options)
    );
  }, [userId, withLoading]);

  // Wallet NFTs - EXACT BACKEND STRUCTURE
  const getWalletNFTsData = useCallback(async (
    walletId: string,
    filters: NFTFilters = {},
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<any> | null> => {
    return await withLoading(() =>
      getWalletNFTs(userId, walletId, filters, options)
    );
  }, [userId, withLoading]);

  // Wallet DeFi positions - EXACT BACKEND STRUCTURE
  const getWalletDeFiPositionsData = useCallback(async (
    walletId: string,
    filters: DeFiPositionFilters = {},
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<any> | null> => {
    return await withLoading(() =>
      getWalletDeFiPositions(userId, walletId, filters, options)
    );
  }, [userId, withLoading]);

  // Single wallet - EXACT BACKEND STRUCTURE
  const getWallet = useCallback(async (walletId: string) => {
    return await withLoading(() => getWalletByIdOrAddress(userId, walletId));
  }, [userId, withLoading]);

  // Search wallets - EXACT BACKEND STRUCTURE
  const searchWalletsData = useCallback(async (
    query: string,
    paginationOptions: PaginationOptions = { page: 1, limit: 20 }
  ) => {
    return await withLoading(() =>
      searchWallets(userId, query, paginationOptions)
    );
  }, [userId, withLoading]);

  // ===============================
  // UTILITY HOOKS FOR COMMON PATTERNS
  // ===============================

  // Optimistic updates for wallet operations
  const addWalletOptimistic = useCallback(async (
    walletData: CryptoWalletRequest,
    onSuccess?: (wallet: any) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const result = await addWallet(walletData);
      if (result && onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to add wallet');
      }
      throw err;
    }
  }, [addWallet]);

  const updateWalletOptimistic = useCallback(async (
    walletId: string,
    updateData: UpdateWalletRequest,
    onSuccess?: (wallet: any) => void,
    onError?: (error: string) => void
  ) => {
    try {
      const result = await updateWalletData(walletId, updateData);
      if (result && onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to update wallet');
      }
      throw err;
    }
  }, [updateWalletData]);

  const removeWalletOptimistic = useCallback(async (
    walletId: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      const result = await removeWallet(walletId);
      if (result && onSuccess) {
        onSuccess();
      }
      return result;
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Failed to remove wallet');
      }
      throw err;
    }
  }, [removeWallet]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    clearError,

    // POST Operations (Write)
    addWallet,
    updateWallet: updateWalletData,
    removeWallet,

    // Optimistic update helpers
    addWalletOptimistic,
    updateWalletOptimistic,
    removeWalletOptimistic,

    // READ Operations (Exact Backend Structure)
    getUserWallets: getUserWalletsData,
    resolveWallet,
    getWalletPortfolio: getWalletPortfolioData,
    getAggregatedPortfolio: getAggregatedPortfolioData,
    getWalletTransactions: getWalletTransactionsData,
    getWalletNFTs: getWalletNFTsData,
    getWalletDeFiPositions: getWalletDeFiPositionsData,
    getWallet,
    searchWallets: searchWalletsData,
  };
};