/**
 * Subscription Mutations - Stub implementations for subscription operations
 */

import { useQuery } from '@tanstack/react-query';

// Payment Method Query Keys Factory
export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (params?: any) => [...paymentMethodKeys.lists(), params] as const,
  detail: (id: string) => [...paymentMethodKeys.all, 'detail', id] as const,
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/subscriptions/plans`);
        if (!response.ok) throw new Error('Failed to fetch plans');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch subscription plans:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });
}

export function useUpgradeBillingSubscription() {
  return {
    mutate: async (planId: string) => {
      try {
        const response = await fetch(`/api/subscriptions/upgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });
        if (!response.ok) throw new Error('Failed to upgrade subscription');
        return response.json();
      } catch (error) {
        console.error('Failed to upgrade subscription:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useUsageStats() {
  return useQuery({
    queryKey: ['subscriptions', 'usage'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/subscriptions/usage`);
        if (!response.ok) throw new Error('Failed to fetch usage stats');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
        return { success: false, data: null };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
