'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '@/lib/services/subscription-service';
import type { 
  SubscriptionPlan,
  CurrentSubscription,
  CreateSubscriptionData,
  UpgradeSubscriptionData,
  CancelSubscriptionData,
  SubscriptionHistory,
  PaymentHistory,
  UsageStats,
  ApiResponse
} from '@/lib/types';

interface UseSubscriptionReturn {
  plans: SubscriptionPlan[];
  currentSubscription: CurrentSubscription | null;
  subscriptionHistory: SubscriptionHistory[];
  paymentHistory: PaymentHistory[];
  usageStats: UsageStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createSubscription: (data: CreateSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  upgradeSubscription: (data: UpgradeSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  cancelSubscription: (data: CancelSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  canAccessFeature: (feature: string) => Promise<boolean>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        plansResponse,
        currentSubResponse,
        historyResponse,
        paymentResponse,
        usageResponse,
      ] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getSubscriptionHistory(),
        subscriptionService.getPaymentHistory(),
        subscriptionService.getUsageStats(),
      ]);

      if (plansResponse.success) {
        setPlans(plansResponse.data);
      }

      if (currentSubResponse.success) {
        setCurrentSubscription(currentSubResponse.data);
      }

      if (historyResponse.success) {
        setSubscriptionHistory(historyResponse.data);
      }

      if (paymentResponse.success) {
        setPaymentHistory(paymentResponse.data);
      }

      if (usageResponse.success) {
        setUsageStats(usageResponse.data);
      }

      // Set error only if critical calls fail
      if (!plansResponse.success || !currentSubResponse.success) {
        const plansError = !plansResponse.success ? plansResponse.error.message : '';
        const currentError = !currentSubResponse.success ? currentSubResponse.error.message : '';
        setError(plansError || currentError || 'Failed to fetch subscription data');
      }
    } catch (err) {
      setError('Failed to fetch subscription data');
      console.error('Error fetching subscription data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (data: CreateSubscriptionData): Promise<ApiResponse<CurrentSubscription>> => {
    try {
      setError(null);
      const response = await subscriptionService.createSubscription(data);
      
      if (response.success) {
        setCurrentSubscription(response.data);
        // Refetch usage stats as they might have changed
        const usageResponse = await subscriptionService.getUsageStats();
        if (usageResponse.success) {
          setUsageStats(usageResponse.data);
        }
      } else {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to create subscription';
      setError(errorMessage);
      console.error('Error creating subscription:', err);
      
      return {
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  const upgradeSubscription = useCallback(async (data: UpgradeSubscriptionData): Promise<ApiResponse<CurrentSubscription>> => {
    try {
      setError(null);
      const response = await subscriptionService.upgradeSubscription(data);
      
      if (response.success) {
        setCurrentSubscription(response.data);
        // Refetch usage stats as limits might have changed
        const usageResponse = await subscriptionService.getUsageStats();
        if (usageResponse.success) {
          setUsageStats(usageResponse.data);
        }
      } else {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to upgrade subscription';
      setError(errorMessage);
      console.error('Error upgrading subscription:', err);
      
      return {
        success: false,
        error: {
          code: 'UPGRADE_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  const cancelSubscription = useCallback(async (data: CancelSubscriptionData): Promise<ApiResponse<CurrentSubscription>> => {
    try {
      setError(null);
      const response = await subscriptionService.cancelSubscription(data);
      
      if (response.success) {
        setCurrentSubscription(response.data);
      } else {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to cancel subscription';
      setError(errorMessage);
      console.error('Error canceling subscription:', err);
      
      return {
        success: false,
        error: {
          code: 'CANCEL_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  const canAccessFeature = useCallback(async (feature: string): Promise<boolean> => {
    try {
      return await subscriptionService.canAccessFeature(feature);
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    plans,
    currentSubscription,
    subscriptionHistory,
    paymentHistory,
    usageStats,
    isLoading,
    error,
    refetch: fetchData,
    createSubscription,
    upgradeSubscription,
    cancelSubscription,
    canAccessFeature,
  };
}