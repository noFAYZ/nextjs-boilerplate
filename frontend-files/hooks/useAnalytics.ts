import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getAnalyticsAggregations,
  getApiAnalyticsSummary,
  getExternalApiAnalyticsSummary,
  getApiAnalyticsDetails,
  getExternalApiAnalyticsDetails,
  getDashboardAnalytics,
  getUserAnalytics,
  getSystemAnalytics,
  getAnalyticsTrends,
} from '../actions/analytics';

export interface UseAnalyticsConfig {
  userId?: string;
}

export const useAnalytics = ({ userId }: UseAnalyticsConfig = {}) => {
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

  // Analytics aggregations
  const getAggregations = useCallback(async (options: any) => {
    return await withLoading(() => getAnalyticsAggregations(options));
  }, [withLoading]);

  // API Analytics
  const getApiSummary = useCallback(async (options: any) => {
    return await withLoading(() => getApiAnalyticsSummary(options));
  }, [withLoading]);

  const getExternalApiSummary = useCallback(async (options: any) => {
    return await withLoading(() => getExternalApiAnalyticsSummary(options));
  }, [withLoading]);

  const getApiDetails = useCallback(async (options: any, pagination = { page: 1, limit: 50 }) => {
    return await withLoading(() => getApiAnalyticsDetails(options, pagination));
  }, [withLoading]);

  const getExternalApiDetails = useCallback(async (options: any, pagination = { page: 1, limit: 50 }) => {
    return await withLoading(() => getExternalApiAnalyticsDetails(options, pagination));
  }, [withLoading]);

  // Dashboard analytics
  const getDashboard = useCallback(async (startDate: Date, endDate: Date, userIdParam?: string) => {
    return await withLoading(() => getDashboardAnalytics(startDate, endDate, userIdParam || userId));
  }, [userId, withLoading]);

  // User-specific analytics
  const getUserStats = useCallback(async (startDate: Date, endDate: Date, userIdParam?: string) => {
    if (!userIdParam && !userId) {
      setError('User ID is required');
      return null;
    }
    return await withLoading(() => getUserAnalytics(userIdParam || userId!, startDate, endDate));
  }, [userId, withLoading]);

  // System analytics
  const getSystemStats = useCallback(async (startDate: Date, endDate: Date) => {
    return await withLoading(() => getSystemAnalytics(startDate, endDate));
  }, [withLoading]);

  // Analytics trends
  const getTrends = useCallback(async (
    startDate: Date,
    endDate: Date,
    granularity: 'HOURLY' | 'DAILY' | 'WEEKLY' = 'DAILY'
  ) => {
    return await withLoading(() => getAnalyticsTrends(startDate, endDate, granularity));
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
    getAggregations,
    getApiSummary,
    getExternalApiSummary,
    getApiDetails,
    getExternalApiDetails,
    getDashboard,
    getUserStats,
    getSystemStats,
    getTrends,
  };
};