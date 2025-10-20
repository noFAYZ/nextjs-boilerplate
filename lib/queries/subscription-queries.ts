/**
 * Subscription Query Factory
 *
 * PURPOSE: Centralized query configuration for subscriptions
 * - Query keys for cache management
 * - Query options with proper stale times
 * - Mutation functions with optimistic updates
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/services/subscriptions-api';
import type {
  UserSubscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  AddChargeRequest,
  SubscriptionFilters,
  SubscriptionListResponse,
  SubscriptionAnalytics,
} from '@/lib/types/subscription';
import type { ApiResponse } from '@/lib/types';

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const subscriptionKeys = {
  all: ['subscriptions'] as const,

  // Subscription lists
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters?: SubscriptionFilters) =>
    [...subscriptionKeys.lists(), filters] as const,

  // Single subscription
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (
    id: string,
    options?: { includeCharges?: boolean; includeReminders?: boolean }
  ) => [...subscriptionKeys.details(), id, options] as const,

  // Analytics
  analytics: () => [...subscriptionKeys.all, 'analytics'] as const,

  // Detection
  detection: () => [...subscriptionKeys.all, 'detection'] as const,
};

// ============================================================================
// QUERY OPTIONS FACTORY
// ============================================================================

export const subscriptionQueries = {
  /**
   * Get all subscriptions with optional filtering
   */
  list: (filters?: SubscriptionFilters) => ({
    queryKey: subscriptionKeys.list(filters),
    queryFn: () => subscriptionsApi.getSubscriptions(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    select: (data: ApiResponse<SubscriptionListResponse>) =>
      data.success ? data.data : { data: [], pagination: null },
  }),

  /**
   * Get a single subscription by ID
   */
  detail: (
    id: string,
    options?: { includeCharges?: boolean; includeReminders?: boolean }
  ) => ({
    queryKey: subscriptionKeys.detail(id, options),
    queryFn: () => subscriptionsApi.getSubscription(id, options),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    select: (data: ApiResponse<UserSubscription>) =>
      data.success ? data.data : null,
  }),

  /**
   * Get subscription analytics
   */
  analytics: () => ({
    queryKey: subscriptionKeys.analytics(),
    queryFn: () => subscriptionsApi.getAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Auto-refresh every 10 minutes
    select: (data: ApiResponse<SubscriptionAnalytics>) =>
      data.success ? data.data : null,
  }),
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const subscriptionMutations = {
  /**
   * Create a new subscription
   */
  useCreate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: CreateSubscriptionRequest) =>
        subscriptionsApi.createSubscription(data),
      onSuccess: (response) => {
        if (response.success) {
          // Invalidate all subscription-related queries
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });

          // Optimistically add to cache
          queryClient.setQueryData(
            subscriptionKeys.list({}),
            (old: ApiResponse<SubscriptionListResponse> | undefined) => {
              if (!old?.data) return old;
              return {
                ...old,
                data: {
                  ...old.data,
                  data: [response.data, ...old.data.data],
                },
              };
            }
          );
        }
      },
      onError: (error) => {
        console.error('Failed to create subscription:', error);
      },
    });
  },

  /**
   * Update an existing subscription
   */
  useUpdate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        updates,
      }: {
        id: string;
        updates: UpdateSubscriptionRequest;
      }) => subscriptionsApi.updateSubscription(id, updates),
      onMutate: async ({ id, updates }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.detail(id) });
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.lists() });

        // Snapshot previous values
        const previousSubscription = queryClient.getQueryData(
          subscriptionKeys.detail(id)
        );
        const previousList = queryClient.getQueryData(subscriptionKeys.list({}));

        // Optimistically update detail
        queryClient.setQueryData(
          subscriptionKeys.detail(id),
          (old: ApiResponse<UserSubscription> | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: { ...old.data, ...updates },
            };
          }
        );

        // Optimistically update list
        queryClient.setQueryData(
          subscriptionKeys.list({}),
          (old: ApiResponse<SubscriptionListResponse> | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                ...old.data,
                data: old.data.data.map((sub: UserSubscription) =>
                  sub.id === id ? { ...sub, ...updates } : sub
                ),
              },
            };
          }
        );

        return { previousSubscription, previousList };
      },
      onError: (_error, { id }, context) => {
        // Rollback on error
        if (context?.previousSubscription) {
          queryClient.setQueryData(
            subscriptionKeys.detail(id),
            context.previousSubscription
          );
        }
        if (context?.previousList) {
          queryClient.setQueryData(subscriptionKeys.list({}), context.previousList);
        }
      },
      onSuccess: (response, { id }) => {
        if (response.success) {
          // Invalidate to ensure consistency
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
    });
  },

  /**
   * Delete a subscription
   */
  useDelete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (subscriptionId: string) =>
        subscriptionsApi.deleteSubscription(subscriptionId),
      onMutate: async (subscriptionId) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.lists() });

        // Snapshot previous list
        const previousList = queryClient.getQueryData(subscriptionKeys.list({}));

        // Optimistically remove from list
        queryClient.setQueryData(
          subscriptionKeys.list({}),
          (old: ApiResponse<SubscriptionListResponse> | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                ...old.data,
                data: old.data.data.filter(
                  (sub: UserSubscription) => sub.id !== subscriptionId
                ),
              },
            };
          }
        );

        return { previousList };
      },
      onError: (_error, _subscriptionId, context) => {
        // Rollback on error
        if (context?.previousList) {
          queryClient.setQueryData(subscriptionKeys.list({}), context.previousList);
        }
      },
      onSuccess: (response, subscriptionId) => {
        if (response.success) {
          // Remove detail query from cache
          queryClient.removeQueries({
            queryKey: subscriptionKeys.detail(subscriptionId),
          });

          // Invalidate all subscription queries
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
    });
  },

  /**
   * Add a charge to a subscription
   */
  useAddCharge: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        subscriptionId,
        chargeData,
      }: {
        subscriptionId: string;
        chargeData: AddChargeRequest;
      }) => subscriptionsApi.addCharge(subscriptionId, chargeData),
      onSuccess: (response, { subscriptionId }) => {
        if (response.success) {
          // Invalidate subscription detail to refetch with new charge
          queryClient.invalidateQueries({
            queryKey: subscriptionKeys.detail(subscriptionId, {
              includeCharges: true,
            }),
          });

          // Invalidate analytics to update spending data
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
      onError: (error) => {
        console.error('Failed to add charge:', error);
      },
    });
  },

  /**
   * Detect subscriptions from transactions
   */
  useDetect: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => subscriptionsApi.detectSubscriptions(),
      onSuccess: (response) => {
        if (response.success && response.data.totalDetections > 0) {
          // Invalidate all subscription queries to refetch with new detections
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        }
      },
      onError: (error) => {
        console.error('Failed to detect subscriptions:', error);
      },
    });
  },
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to invalidate all subscription-related queries
 */
export const useInvalidateSubscriptionQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
    invalidateAnalytics: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
    },
  };
};
