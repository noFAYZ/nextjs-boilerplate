'use client';

import {
  useSubscriptionPlans,
  useCurrentBillingSubscription,
  usePaymentHistory,
  useUsageStats,
  useCreateBillingSubscription,
  useUpgradeBillingSubscription,
  useCancelBillingSubscription,
  useInvalidateBillingSubscriptionCache,
} from '@/lib/queries/use-billing-subscription-data';
import { subscriptionService } from '@/lib/services/subscription-service';
import type {
  SubscriptionPlan,
  CurrentSubscription,
  CreateSubscriptionData,
  UpgradeSubscriptionData,
  CancelSubscriptionData,
  PaymentHistory,
  UsageStats,
  ApiResponse
} from '@/lib/types';

interface UseSubscriptionReturn {
  plans: SubscriptionPlan[];
  currentSubscription: CurrentSubscription | null;
  paymentHistory: PaymentHistory[];
  usageStats: UsageStats | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastFetched: Date | null;
  refetch: (force?: boolean) => Promise<void>;
  createSubscription: (data: CreateSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  upgradeSubscription: (data: UpgradeSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  cancelSubscription: (data: CancelSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  canAccessFeature: (feature: string) => Promise<boolean>;
  resetState: () => void;
}

/**
 * Custom hook for billing subscription management
 *
 * PRODUCTION-GRADE IMPLEMENTATION using TanStack Query
 *
 * This hook provides a clean interface to billing subscription data,
 * exposing all subscription-related state and actions in a convenient way.
 *
 * Features:
 * - TanStack Query for server state management
 * - Automatic caching with configurable stale times
 * - Optimistic updates for better UX
 * - Comprehensive error handling
 * - Type-safe API
 * - NO unnecessary API calls on every page
 *
 * Usage:
 * ```ts
 * const { plans, currentSubscription, upgradeSubscription } = useSubscription();
 * ```
 */
export function useSubscription(): UseSubscriptionReturn {
  // Queries
  const plansQuery = useSubscriptionPlans();
  const currentQuery = useCurrentBillingSubscription();
  const paymentsQuery = usePaymentHistory();
  const usageQuery = useUsageStats();

  // Mutations
  const createMutation = useCreateBillingSubscription();
  const upgradeMutation = useUpgradeBillingSubscription();
  const cancelMutation = useCancelBillingSubscription();

  // Utilities
  const { invalidateAll } = useInvalidateBillingSubscriptionCache();

  // Aggregate loading states
  const isLoading =
    plansQuery.isLoading ||
    currentQuery.isLoading ||
    paymentsQuery.isLoading ||
    usageQuery.isLoading;

  const isInitialized =
    plansQuery.isSuccess &&
    currentQuery.isSuccess;

  // Aggregate errors (prioritize current subscription errors)
  const error =
    currentQuery.error?.message ||
    plansQuery.error?.message ||
    paymentsQuery.error?.message ||
    usageQuery.error?.message ||
    null;

  // Track last fetched time (use the most recent)
  const lastFetched = new Date(
    Math.max(
      plansQuery.dataUpdatedAt || 0,
      currentQuery.dataUpdatedAt || 0,
      paymentsQuery.dataUpdatedAt || 0,
      usageQuery.dataUpdatedAt || 0
    )
  );

  // Refetch all data
  const refetch = async (force = false) => {
    if (force) {
      invalidateAll();
    }
    await Promise.all([
      plansQuery.refetch(),
      currentQuery.refetch(),
      paymentsQuery.refetch(),
      usageQuery.refetch(),
    ]);
  };

  // Wrap mutations to match old API
  const createSubscription = async (
    data: CreateSubscriptionData
  ): Promise<ApiResponse<CurrentSubscription>> => {
    return new Promise((resolve) => {
      createMutation.mutate(data, {
        onSuccess: (response) => resolve(response),
        onError: (error) =>
          resolve({
            success: false,
            error: {
              code: 'CREATE_FAILED',
              message: error instanceof Error ? error.message : 'Create failed',
            },
          }),
      });
    });
  };

  const upgradeSubscription = async (
    data: UpgradeSubscriptionData
  ): Promise<ApiResponse<CurrentSubscription>> => {
    return new Promise((resolve) => {
      upgradeMutation.mutate(data, {
        onSuccess: (response) => resolve(response),
        onError: (error) =>
          resolve({
            success: false,
            error: {
              code: 'UPGRADE_FAILED',
              message: error instanceof Error ? error.message : 'Upgrade failed',
            },
          }),
      });
    });
  };

  const cancelSubscription = async (
    data: CancelSubscriptionData
  ): Promise<ApiResponse<CurrentSubscription>> => {
    return new Promise((resolve) => {
      cancelMutation.mutate(data, {
        onSuccess: (response) => resolve(response),
        onError: (error) =>
          resolve({
            success: false,
            error: {
              code: 'CANCEL_FAILED',
              message: error instanceof Error ? error.message : 'Cancel failed',
            },
          }),
      });
    });
  };

  // Check feature access
  const canAccessFeature = async (feature: string): Promise<boolean> => {
    return subscriptionService.canAccessFeature(feature);
  };

  // Reset state (clear all caches)
  const resetState = () => {
    invalidateAll();
  };

  return {
    // State
    plans: plansQuery.data || [],
    currentSubscription: currentQuery.data || null,
    paymentHistory: paymentsQuery.data || [],
    usageStats: usageQuery.data || null,
    isLoading,
    isInitialized,
    error,
    lastFetched,

    // Actions
    refetch,
    createSubscription,
    upgradeSubscription,
    cancelSubscription,
    canAccessFeature,
    resetState,
  };
}