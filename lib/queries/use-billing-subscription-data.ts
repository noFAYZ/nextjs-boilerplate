/**
 * Billing Subscription Data Hooks
 *
 * PURPOSE: Production-grade React Query hooks for billing subscription data
 * - Single source of truth for ALL billing/subscription server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: plans } = useSubscriptionPlans();
 * const { data: currentSubscription } = useCurrentBillingSubscription();
 * const { mutate: upgradeSubscription } = useUpgradeBillingSubscription();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuthStore } from '@/lib/stores/auth-store';
import type {
  SubscriptionPlan,
  CurrentSubscription,
  CreateSubscriptionData,
  UpgradeSubscriptionData,
  CancelSubscriptionData,
  SubscriptionHistory,
  PaymentHistory,
  UsageStats,
  ApiResponse,
} from '@/lib/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const billingSubscriptionKeys = {
  all: ['billing-subscription'] as const,
  plans: () => [...billingSubscriptionKeys.all, 'plans'] as const,
  plansComparison: () => [...billingSubscriptionKeys.all, 'plans', 'comparison'] as const,
  current: () => [...billingSubscriptionKeys.all, 'current'] as const,
  history: () => [...billingSubscriptionKeys.all, 'history'] as const,
  payments: () => [...billingSubscriptionKeys.all, 'payments'] as const,
  usage: () => [...billingSubscriptionKeys.all, 'usage'] as const,
  featureLimit: (feature: string) => [...billingSubscriptionKeys.all, 'feature', feature] as const,
};

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

// ============================================================================
// SUBSCRIPTION PLAN QUERIES
// ============================================================================

/**
 * Get all available subscription plans
 * @returns All subscription plans with pricing
 */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: billingSubscriptionKeys.plans(),
    queryFn: async () => {
      const response = await subscriptionService.getPlans();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - plans don't change often
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Get plan comparison data
 * @returns Plans with detailed feature comparison
 */
export function useSubscriptionPlansComparison() {
  return useQuery({
    queryKey: billingSubscriptionKeys.plansComparison(),
    queryFn: async () => {
      const response = await subscriptionService.getPlanComparison();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// ============================================================================
// CURRENT SUBSCRIPTION QUERIES
// ============================================================================

/**
 * Get current user subscription
 * @returns Current subscription details with status
 */
export function useCurrentBillingSubscription() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: billingSubscriptionKeys.current(),
    queryFn: async () => {
      const response = await subscriptionService.getCurrentSubscription();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: isAuthReady,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

// ============================================================================
// SUBSCRIPTION HISTORY QUERIES
// ============================================================================

/**
 * Get subscription history
 * @returns All past and current subscriptions
 */
export function useSubscriptionHistory() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: billingSubscriptionKeys.history(),
    queryFn: async () => {
      const response = await subscriptionService.getSubscriptionHistory();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: isAuthReady,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ============================================================================
// PAYMENT HISTORY QUERIES
// ============================================================================

/**
 * Get payment history
 * @returns All payment transactions
 */
export function usePaymentHistory() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: billingSubscriptionKeys.payments(),
    queryFn: async () => {
      const response = await subscriptionService.getPaymentHistory();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: isAuthReady,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

// ============================================================================
// USAGE STATS QUERIES
// ============================================================================

/**
 * Get usage statistics
 * @returns Current usage against plan limits
 */
export function useUsageStats() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: billingSubscriptionKeys.usage(),
    queryFn: async () => {
      const response = await subscriptionService.getUsageStats();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: isAuthReady,
    staleTime: 1000 * 60 * 2, // 2 minutes - usage changes frequently
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });
}

/**
 * Check feature access limit
 * @param feature - Feature identifier to check
 * @returns Whether user can access the feature
 */
export function useFeatureLimit(feature: string) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    queryKey: billingSubscriptionKeys.featureLimit(feature),
    queryFn: async () => {
      const response = await subscriptionService.checkFeatureLimit(feature);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: isAuthReady && !!feature,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================================================
// SUBSCRIPTION MUTATIONS
// ============================================================================

/**
 * Invalidate all subscription caches
 */
function invalidateSubscriptionCaches(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: billingSubscriptionKeys.current() });
  queryClient.invalidateQueries({ queryKey: billingSubscriptionKeys.history() });
  queryClient.invalidateQueries({ queryKey: billingSubscriptionKeys.usage() });
  queryClient.invalidateQueries({ queryKey: billingSubscriptionKeys.payments() });
}

/**
 * Create a new subscription
 * @returns Mutation hook with optimistic updates
 */
export function useCreateBillingSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionData) =>
      subscriptionService.createSubscription(data),
    onSuccess: (response) => {
      if (response.success) {
        // Update cache with new subscription
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          response.data
        );
        // Invalidate related caches
        invalidateSubscriptionCaches(queryClient);
      }
    },
  });
}

/**
 * Upgrade current subscription
 * @returns Mutation hook with optimistic updates
 */
export function useUpgradeBillingSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpgradeSubscriptionData) =>
      subscriptionService.upgradeSubscription(data),
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: billingSubscriptionKeys.current(),
      });

      // Snapshot previous value
      const previousSubscription = queryClient.getQueryData(
        billingSubscriptionKeys.current()
      );

      // Optimistically update to new plan
      queryClient.setQueryData(
        billingSubscriptionKeys.current(),
        (old: CurrentSubscription | undefined) => {
          if (!old) return old;
          return {
            ...old,
            planType: data.planType,
            billingPeriod: data.billingPeriod,
          };
        }
      );

      return { previousSubscription };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousSubscription) {
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          context.previousSubscription
        );
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Update with server response
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          response.data
        );
        // Invalidate related caches
        invalidateSubscriptionCaches(queryClient);
      }
    },
  });
}

/**
 * Cancel current subscription
 * @returns Mutation hook with optimistic updates
 */
export function useCancelBillingSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CancelSubscriptionData) =>
      subscriptionService.cancelSubscription(data),
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: billingSubscriptionKeys.current(),
      });

      // Snapshot previous value
      const previousSubscription = queryClient.getQueryData(
        billingSubscriptionKeys.current()
      );

      // Optimistically update cancellation status
      if (data.immediately) {
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          (old: CurrentSubscription | undefined) => {
            if (!old) return old;
            return {
              ...old,
              status: 'CANCELLED' as const,
              cancelAtPeriodEnd: true,
            };
          }
        );
      } else {
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          (old: CurrentSubscription | undefined) => {
            if (!old) return old;
            return {
              ...old,
              cancelAtPeriodEnd: true,
            };
          }
        );
      }

      return { previousSubscription };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousSubscription) {
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          context.previousSubscription
        );
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Update with server response
        queryClient.setQueryData(
          billingSubscriptionKeys.current(),
          response.data
        );
        // Invalidate related caches
        invalidateSubscriptionCaches(queryClient);
      }
    },
  });
}

/**
 * Retry failed payment
 * @returns Mutation hook
 */
export function useRetryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) =>
      subscriptionService.retryPayment(paymentId),
    onSuccess: () => {
      // Invalidate payment history
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.payments(),
      });
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all billing subscription-related queries
 * @returns Invalidation functions
 */
export function useInvalidateBillingSubscriptionCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.all,
      }),
    invalidatePlans: () =>
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.plans(),
      }),
    invalidateCurrent: () =>
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.current(),
      }),
    invalidateHistory: () =>
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.history(),
      }),
    invalidatePayments: () =>
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.payments(),
      }),
    invalidateUsage: () =>
      queryClient.invalidateQueries({
        queryKey: billingSubscriptionKeys.usage(),
      }),
  };
}

/**
 * Prefetch subscription data for performance
 * @returns Prefetch functions
 */
export function usePrefetchBillingSubscriptionData() {
  const queryClient = useQueryClient();
  const { isAuthReady } = useAuthReady();

  return {
    prefetchPlans: () => {
      queryClient.prefetchQuery({
        queryKey: billingSubscriptionKeys.plans(),
        queryFn: async () => {
          const response = await subscriptionService.getPlans();
          if (!response.success) throw new Error(response.error.message);
          return response.data;
        },
        staleTime: 1000 * 60 * 30,
      });
    },
    prefetchCurrent: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery({
          queryKey: billingSubscriptionKeys.current(),
          queryFn: async () => {
            const response = await subscriptionService.getCurrentSubscription();
            if (!response.success) throw new Error(response.error.message);
            return response.data;
          },
          staleTime: 1000 * 60 * 5,
        });
      }
    },
    prefetchAll: () => {
      if (isAuthReady) {
        // Prefetch all subscription data in parallel
        Promise.all([
          queryClient.prefetchQuery({
            queryKey: billingSubscriptionKeys.plans(),
            queryFn: async () => {
              const response = await subscriptionService.getPlans();
              if (!response.success) throw new Error(response.error.message);
              return response.data;
            },
          }),
          queryClient.prefetchQuery({
            queryKey: billingSubscriptionKeys.current(),
            queryFn: async () => {
              const response = await subscriptionService.getCurrentSubscription();
              if (!response.success) throw new Error(response.error.message);
              return response.data;
            },
          }),
          queryClient.prefetchQuery({
            queryKey: billingSubscriptionKeys.usage(),
            queryFn: async () => {
              const response = await subscriptionService.getUsageStats();
              if (!response.success) throw new Error(response.error.message);
              return response.data;
            },
          }),
        ]);
      }
    },
  };
}

/**
 * Check if user can access a feature
 * @param feature - Feature to check
 * @returns Whether user can access the feature
 */
export function useCanAccessFeature(feature: string) {
  const { data, isLoading } = useFeatureLimit(feature);

  return {
    canAccess: data?.allowed ?? false,
    isLoading,
    remaining: data?.remaining,
    limit: data?.limit,
  };
}
