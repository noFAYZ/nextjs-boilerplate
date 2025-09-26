import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getPlans,
  getPlanById,
  getPlanByType,
  getUserSubscription,
  getSubscriptionById,
  getUserSubscriptions,
  getSubscriptionAnalytics,
  getPlanAnalytics,
  getRevenueAnalytics,
  getSubscriptionTrends,
  updateUserPlan,
} from '../actions/subscriptions';
import { PlanType } from '@prisma/client';

export interface UseSubscriptionsConfig {
  userId: string;
}

export const useSubscriptions = ({ userId }: UseSubscriptionsConfig) => {
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

  // Plan operations
  const getAllPlans = useCallback(async () => {
    return await withLoading(() => getPlans());
  }, [withLoading]);

  const getPlan = useCallback(async (planId: string) => {
    return await withLoading(() => getPlanById(planId));
  }, [withLoading]);

  const getPlanByTypeName = useCallback(async (planType: PlanType) => {
    return await withLoading(() => getPlanByType(planType));
  }, [withLoading]);

  // User subscription operations
  const getCurrentSubscription = useCallback(async () => {
    return await withLoading(() => getUserSubscription(userId));
  }, [userId, withLoading]);

  const getSubscription = useCallback(async (subscriptionId: string) => {
    return await withLoading(() => getSubscriptionById(userId, subscriptionId));
  }, [userId, withLoading]);

  const getSubscriptions = useCallback(async (filters = {}, pagination = { page: 1, limit: 20 }) => {
    return await withLoading(() => getUserSubscriptions(userId, filters, pagination));
  }, [userId, withLoading]);

  // Plan management
  const changePlan = useCallback(async (newPlanType: PlanType) => {
    return await withLoading(() => updateUserPlan(userId, newPlanType));
  }, [userId, withLoading]);

  // Analytics operations
  const getAnalytics = useCallback(async (startDate: Date, endDate: Date) => {
    return await withLoading(() => getSubscriptionAnalytics(startDate, endDate));
  }, [withLoading]);

  const getPlansAnalytics = useCallback(async (planType?: PlanType) => {
    return await withLoading(() => getPlanAnalytics(planType));
  }, [withLoading]);

  const getRevenue = useCallback(async (startDate: Date, endDate: Date, granularity = 'MONTHLY' as const) => {
    return await withLoading(() => getRevenueAnalytics(startDate, endDate, granularity));
  }, [withLoading]);

  const getTrends = useCallback(async (startDate: Date, endDate: Date, granularity = 'MONTHLY' as const) => {
    return await withLoading(() => getSubscriptionTrends(startDate, endDate, granularity));
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

    // Plan operations
    getAllPlans,
    getPlan,
    getPlanByTypeName,

    // Subscription operations
    getCurrentSubscription,
    getSubscription,
    getSubscriptions,
    changePlan,

    // Analytics
    getAnalytics,
    getPlansAnalytics,
    getRevenue,
    getTrends,
  };
};