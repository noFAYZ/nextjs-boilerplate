import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getUserAccountGroups,
  getAccountGroupById,
  createAccountGroup,
  updateAccountGroup,
  deleteAccountGroup,
  getRootAccountGroups,
  getAccountGroupHierarchy,
  moveAccountGroup,
  assignFinancialAccountToGroup,
  assignCryptoWalletToGroup,
  removeAccountFromGroup,
} from '../actions/accountGroups';
import type { AccountGroupWithDetails } from '../actions/accountGroups';

export interface UseAccountGroupsConfig {
  userId: string;
}

export const useAccountGroups = ({ userId }: UseAccountGroupsConfig) => {
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

  // Account group operations
  const getAccountGroups = useCallback(async () => {
    return await withLoading(() => getUserAccountGroups(userId));
  }, [userId, withLoading]);

  const getAccountGroup = useCallback(async (groupId: string) => {
    return await withLoading(() => getAccountGroupById(userId, groupId));
  }, [userId, withLoading]);

  const createGroup = useCallback(async (groupData: any) => {
    return await withLoading(() => createAccountGroup(userId, groupData));
  }, [userId, withLoading]);

  const updateGroup = useCallback(async (groupId: string, updateData: any) => {
    return await withLoading(() => updateAccountGroup(userId, groupId, updateData));
  }, [userId, withLoading]);

  const deleteGroup = useCallback(async (groupId: string) => {
    return await withLoading(() => deleteAccountGroup(userId, groupId));
  }, [userId, withLoading]);

  const getRootGroups = useCallback(async () => {
    return await withLoading(() => getRootAccountGroups(userId));
  }, [userId, withLoading]);

  const getHierarchy = useCallback(async () => {
    return await withLoading(() => getAccountGroupHierarchy(userId));
  }, [userId, withLoading]);

  const moveGroup = useCallback(async (groupId: string, newParentId: string | null) => {
    return await withLoading(() => moveAccountGroup(userId, groupId, newParentId));
  }, [userId, withLoading]);

  const assignFinancialAccount = useCallback(async (accountId: string, groupId: string) => {
    return await withLoading(() => assignFinancialAccountToGroup(userId, accountId, groupId));
  }, [userId, withLoading]);

  const assignCryptoWallet = useCallback(async (walletId: string, groupId: string) => {
    return await withLoading(() => assignCryptoWalletToGroup(userId, walletId, groupId));
  }, [userId, withLoading]);

  const removeAccount = useCallback(async (accountId: string, accountType: 'financial' | 'crypto') => {
    return await withLoading(() => removeAccountFromGroup(userId, accountId, accountType));
  }, [userId, withLoading]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    clearError,

    // Operations
    getAccountGroups,
    getAccountGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getRootGroups,
    getHierarchy,
    moveGroup,
    assignFinancialAccount,
    assignCryptoWallet,
    removeAccount,
  };
};