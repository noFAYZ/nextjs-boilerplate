"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cryptoKeys } from "@/lib/queries/crypto-queries";
import { useCryptoStore } from "@/lib/stores/crypto-store";

/**
 * Cache management utilities for manual cache operations
 */
export function useCacheManager() {
  const queryClient = useQueryClient();
  const { clearAllData } = useCryptoStore();

  // Clear cache for a specific wallet
  const clearWalletCache = useCallback((walletId: string) => {
    // Remove specific wallet queries
    queryClient.removeQueries({ queryKey: cryptoKeys.wallet(walletId) });
    queryClient.removeQueries({ queryKey: cryptoKeys.walletTransactions(walletId) });
    queryClient.removeQueries({ queryKey: cryptoKeys.walletNfts(walletId) });
    queryClient.removeQueries({ queryKey: cryptoKeys.walletDefi(walletId) });
    queryClient.removeQueries({ queryKey: cryptoKeys.syncStatus(walletId) });

    // Invalidate global queries
    queryClient.invalidateQueries({ queryKey: cryptoKeys.wallets() });
    queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });

    console.log(`Cache cleared for wallet: ${walletId}`);
  }, [queryClient]);

  // Refresh wallet data (invalidate + refetch)
  const refreshWalletData = useCallback((walletId: string) => {
    queryClient.invalidateQueries({ queryKey: cryptoKeys.wallet(walletId) });
    queryClient.invalidateQueries({ queryKey: cryptoKeys.walletTransactions(walletId) });
    queryClient.invalidateQueries({ queryKey: cryptoKeys.walletNfts(walletId) });
    queryClient.invalidateQueries({ queryKey: cryptoKeys.walletDefi(walletId) });

    console.log(`Refreshing data for wallet: ${walletId}`);
  }, [queryClient]);

  // Clear portfolio cache
  const clearPortfolioCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cryptoKeys.portfolio() });
    queryClient.invalidateQueries({ queryKey: cryptoKeys.analytics() });

    console.log('Portfolio cache cleared');
  }, [queryClient]);

  // Clear all transaction cache
  const clearTransactionsCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cryptoKeys.transactions() });

    console.log('Transactions cache cleared');
  }, [queryClient]);

  // Clear all NFT cache
  const clearNFTsCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cryptoKeys.nfts() });

    console.log('NFTs cache cleared');
  }, [queryClient]);

  // Force refresh all data
  const refreshAllData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cryptoKeys.all });

    console.log('All crypto data refreshed');
  }, [queryClient]);

  // Clear all cache and local storage (nuclear option)
  const clearEverything = useCallback(() => {
    // Clear TanStack Query cache
    queryClient.clear();

    // Clear Zustand store
    clearAllData();

    // Clear relevant localStorage items
    if (typeof window !== 'undefined') {
      const keysToRemove = Object.keys(localStorage).filter(key =>
        key.startsWith('moneymappr_') &&
        !key.includes('theme') && // Keep theme preference
        !key.includes('onboarding') // Keep onboarding state
      );

      keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    console.log('All cache and storage cleared');
  }, [queryClient, clearAllData]);

  // Get cache information for debugging
  const getCacheInfo = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    return {
      totalQueries: queries.length,
      cryptoQueries: queries.filter(q =>
        Array.isArray(q.queryKey) && q.queryKey[0] === 'crypto'
      ).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      fetchingQueries: queries.filter(q => q.isFetching()).length,
    };
  }, [queryClient]);

  return {
    // Wallet-specific operations
    clearWalletCache,
    refreshWalletData,

    // Data-type specific operations
    clearPortfolioCache,
    clearTransactionsCache,
    clearNFTsCache,

    // Global operations
    refreshAllData,
    clearEverything,

    // Debugging
    getCacheInfo,
  };
}