'use client';

import { useSubscriptionContext } from '@/lib/contexts/subscription-context';
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
 * Custom hook for subscription management
 * 
 * This hook provides a clean interface to the subscription context,
 * exposing all subscription-related state and actions in a convenient way.
 * 
 * Features:
 * - Centralized state management via React Context
 * - Automatic data fetching with caching
 * - Optimistic updates for better UX
 * - Comprehensive error handling
 * - Type-safe API
 */
export function useSubscription(): UseSubscriptionReturn {
  const context = useSubscriptionContext();

  return {
    // State
    plans: context.plans,
    currentSubscription: context.currentSubscription,
    subscriptionHistory: context.subscriptionHistory,
    paymentHistory: context.paymentHistory,
    usageStats: context.usageStats,
    isLoading: context.isLoading,
    isInitialized: context.isInitialized,
    error: context.error,
    lastFetched: context.lastFetched,
    
    // Actions
    refetch: context.fetchSubscriptionData,
    createSubscription: context.createSubscription,
    upgradeSubscription: context.upgradeSubscription,
    cancelSubscription: context.cancelSubscription,
    canAccessFeature: context.canAccessFeature,
    resetState: context.resetState,
  };
}