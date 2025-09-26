import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getUserUsageStats,
  checkFeatureLimit,
  getUserUsageTracking,
  getUsageAnalytics,
  getUsageTrends,
  getPlanUsageComparison,
  trackFeatureUsage,
  resetUserUsage,
} from '../actions/usage';
import type { UsageStats, FeatureLimitCheck } from '../actions/usage';

export interface UseUsageConfig {
  userId: string;
}

export const useUsage = ({ userId }: UseUsageConfig) => {
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

  // Usage statistics
  const getUsageStats = useCallback(async () => {
    return await withLoading(() => getUserUsageStats(userId));
  }, [userId, withLoading]);

  const checkLimit = useCallback(async (feature: string) => {
    return await withLoading(() => checkFeatureLimit(userId, feature));
  }, [userId, withLoading]);

  // Usage tracking
  const getUsageTracking = useCallback(async (filters = {}, pagination = { page: 1, limit: 50 }) => {
    return await withLoading(() => getUserUsageTracking(userId, filters, pagination));
  }, [userId, withLoading]);

  const trackUsage = useCallback(async (feature: string, metadata?: any) => {
    return await withLoading(() => trackFeatureUsage(userId, feature, metadata));
  }, [userId, withLoading]);

  const resetUsage = useCallback(async (feature?: string) => {
    return await withLoading(() => resetUserUsage(userId, feature));
  }, [userId, withLoading]);

  // Analytics
  const getAnalytics = useCallback(async (filters = {}, pagination = { page: 1, limit: 50 }) => {
    return await withLoading(() => getUsageAnalytics(filters, pagination));
  }, [withLoading]);

  const getTrends = useCallback(async (
    startDate: Date,
    endDate: Date,
    granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY'
  ) => {
    return await withLoading(() => getUsageTrends(startDate, endDate, granularity));
  }, [withLoading]);

  const getPlanComparison = useCallback(async () => {
    return await withLoading(() => getPlanUsageComparison());
  }, [withLoading]);

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
    getUsageStats,
    checkLimit,
    getUsageTracking,
    trackUsage,
    resetUsage,
    getAnalytics,
    getTrends,
    getPlanComparison,
  };
};