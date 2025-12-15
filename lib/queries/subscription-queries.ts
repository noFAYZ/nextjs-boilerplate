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
  ManualRenewalRequest,
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
    select: (data: ApiResponse<SubscriptionListResponse>) => {
      if (data.success && data.data) {
        return data.data; // Returns SubscriptionListResponse { data: [], pagination: {} }
      }
      return { data: [], pagination: null };
    },
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
    select: (data: ApiResponse<UserSubscription>) => {
      if (data.success && data.data) {
        return data.data; // Returns UserSubscription object
      }
      return null;
    },
  }),

  /**
   * Get subscription analytics
   */
  analytics: () => ({
    queryKey: subscriptionKeys.analytics(),
    queryFn: () => subscriptionsApi.getAnalytics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Auto-refresh every 10 minutes
    select: (data: ApiResponse<SubscriptionAnalytics>) => {
      if (data.success && data.data) {
        return data.data; // Returns SubscriptionAnalytics object
      }
      return null;
    },
  }),
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const subscriptionMutations = {
  /**
   * Create a new subscription
   * Strategy 1: Optimistic updates with rollback
   * Strategy 2: Direct cache updates from server response
   */
  useCreate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateSubscriptionRequest) => {
        const response = await subscriptionsApi.createSubscription(data);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to create subscription');
        }
        return response;
      },
      onMutate: async (newSubscriptionData) => {
        // Cancel any ongoing fetches
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.lists() });

        // Snapshot previous data for rollback
        const previousLists = queryClient.getQueriesData<SubscriptionListResponse>({
          queryKey: subscriptionKeys.lists(),
        });

        // Optimistically add to cache with temporary ID
        const optimisticSubscription = {
          id: `temp-${Date.now()}`,
          ...newSubscriptionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'ACTIVE' as const,
        } as any; // Cast as subscription type

        // Update ALL subscription list queries (regardless of filter keys)
        queryClient.setQueriesData(
          { queryKey: subscriptionKeys.lists() },
          (old: SubscriptionListResponse | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: [optimisticSubscription, ...old.data],
            };
          }
        );

        return { previousLists };
      },
      onSuccess: (response) => {
        if (response.success && response.data) {
          // Update ALL subscription list queries (regardless of filter keys)
          // This matches queries with any filter state from the UI store
          queryClient.setQueriesData(
            { queryKey: subscriptionKeys.lists() },
            (old: SubscriptionListResponse | undefined) => {
              if (!old?.data) return old;
              return {
                ...old,
                data: old.data.map((sub) =>
                  sub.id.startsWith('temp-') ? response.data : sub
                ),
              };
            }
          );
        }
      },
      onError: (error, _, context) => {
        // Rollback to previous state
        if (context?.previousLists) {
          context.previousLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
      },
    });
  },

  /**
   * Update an existing subscription
   * Strategy 1: Optimistic updates with rollback
   * Strategy 2: Direct cache updates from server response
   */
  useUpdate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        updates,
      }: {
        id: string;
        updates: UpdateSubscriptionRequest;
      }) => {
        const response = await subscriptionsApi.updateSubscription(id, updates);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to update subscription');
        }
        return response;
      },
      onMutate: async ({ id, updates }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.detail(id) });
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.lists() });

        // Snapshot previous values
        const previousSubscription = queryClient.getQueryData(
          subscriptionKeys.detail(id)
        );
        const previousLists = queryClient.getQueriesData<SubscriptionListResponse>({
          queryKey: subscriptionKeys.lists(),
        });

        // Optimistically update detail
        queryClient.setQueryData(
          subscriptionKeys.detail(id),
          (old: UserSubscription | null | undefined) => {
            if (!old) return old;
            return { ...old, ...updates };
          }
        );

        // Optimistically update ALL subscription list queries (regardless of filter keys)
        queryClient.setQueriesData(
          { queryKey: subscriptionKeys.lists() },
          (old: SubscriptionListResponse | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: old.data.map((sub: UserSubscription) =>
                sub.id === id ? { ...sub, ...updates } : sub
              ),
            };
          }
        );

        return { previousSubscription, previousLists };
      },
      onSuccess: (response, { id }) => {
        if (response.success && response.data) {
          // Update detail with server response
          queryClient.setQueryData(subscriptionKeys.detail(id), response.data);

          // Update ALL subscription list queries (regardless of filter keys)
          queryClient.setQueriesData(
            { queryKey: subscriptionKeys.lists() },
            (old: SubscriptionListResponse | undefined) => {
              if (!old?.data) return old;
              return {
                ...old,
                data: old.data.map((sub) =>
                  sub.id === id ? response.data : sub
                ),
              };
            }
          );

          // Invalidate analytics since subscription data changed
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
      onError: (error, { id }, context) => {
        // Rollback on error
        if (context?.previousSubscription) {
          queryClient.setQueryData(
            subscriptionKeys.detail(id),
            context.previousSubscription
          );
        }
        if (context?.previousLists) {
          context.previousLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
      },
    });
  },

  /**
   * Delete a subscription
   * Strategy 1: Optimistic removal with rollback
   * Strategy 2: Direct cache removal from server response
   */
  useDelete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (subscriptionId: string) => {
        const response = await subscriptionsApi.deleteSubscription(subscriptionId);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to delete subscription');
        }
        return response;
      },
      onMutate: async (subscriptionId) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.lists() });
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });

        // Snapshot previous lists
        const previousLists = queryClient.getQueriesData<SubscriptionListResponse>({
          queryKey: subscriptionKeys.lists(),
        });

        // Optimistically remove from ALL subscription list queries (regardless of filter keys)
        queryClient.setQueriesData(
          { queryKey: subscriptionKeys.lists() },
          (old: SubscriptionListResponse | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: old.data.filter((sub) => sub.id !== subscriptionId),
            };
          }
        );

        return { previousLists };
      },
      onSuccess: (response, subscriptionId) => {
        if (response.success) {
          // Remove detail query from cache
          queryClient.removeQueries({
            queryKey: subscriptionKeys.detail(subscriptionId),
          });

          // Remove from ALL subscription list queries (regardless of filter keys)
          queryClient.setQueriesData(
            { queryKey: subscriptionKeys.lists() },
            (old: SubscriptionListResponse | undefined) => {
              if (!old?.data) return old;
              return {
                ...old,
                data: old.data.filter((sub) => sub.id !== subscriptionId),
              };
            }
          );

          // Invalidate analytics since subscription data changed
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
      onError: (error, subscriptionId, context) => {
        // Rollback on error
        if (context?.previousLists) {
          context.previousLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
      },
    });
  },

  /**
   * Add a charge to a subscription
   * Strategy 2: Direct cache updates from server response
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
        if (response.success && response.data) {
          // Invalidate subscription detail to refetch with new charge data
          queryClient.invalidateQueries({
            queryKey: subscriptionKeys.detail(subscriptionId, {
              includeCharges: true,
            }),
          });

          // Invalidate analytics to update spending data
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
    });
  },

  /**
   * Manually renew a subscription
   * Strategy 1: Optimistic updates with rollback
   * Strategy 2: Direct cache updates from server response
   */
  useRenew: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        subscriptionId,
        renewalData,
      }: {
        subscriptionId: string;
        renewalData: ManualRenewalRequest;
      }) => subscriptionsApi.renewSubscription(subscriptionId, renewalData),
      onMutate: async ({ subscriptionId, renewalData }) => {
        // Cancel outgoing fetches
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
        await queryClient.cancelQueries({ queryKey: subscriptionKeys.lists() });

        // Snapshot previous data
        const previousDetail = queryClient.getQueryData<UserSubscription>(
          subscriptionKeys.detail(subscriptionId)
        );
        const previousLists = queryClient.getQueriesData<SubscriptionListResponse>({
          queryKey: subscriptionKeys.lists(),
        });

        // Optimistically update detail with renewal data
        queryClient.setQueryData<UserSubscription>(
          subscriptionKeys.detail(subscriptionId),
          (old) => (old ? { ...old, ...renewalData } : old)
        );

        // Optimistically update ALL subscription list queries (regardless of filter keys)
        queryClient.setQueriesData(
          { queryKey: subscriptionKeys.lists() },
          (old: SubscriptionListResponse | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: old.data.map((sub) =>
                sub.id === subscriptionId ? { ...sub, ...renewalData } : sub
              ),
            };
          }
        );

        return { previousDetail, previousLists };
      },
      onSuccess: (response, { subscriptionId }) => {
        if (response.success && response.data) {
          // Update detail with server response
          queryClient.setQueryData(subscriptionKeys.detail(subscriptionId), response.data);

          // Update ALL subscription list queries (regardless of filter keys)
          queryClient.setQueriesData(
            { queryKey: subscriptionKeys.lists() },
            (old: SubscriptionListResponse | undefined) => {
              if (!old?.data) return old;
              return {
                ...old,
                data: old.data.map((sub) =>
                  sub.id === subscriptionId ? response.data : sub
                ),
              };
            }
          );

          // Invalidate analytics to update spending data
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
      },
      onError: (error, { subscriptionId }, context) => {
        // Rollback on error
        if (context?.previousDetail) {
          queryClient.setQueryData(subscriptionKeys.detail(subscriptionId), context.previousDetail);
        }
        if (context?.previousLists) {
          context.previousLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
      },
    });
  },

  /**
   * Detect subscriptions from transactions
   * Strategy 2: Direct cache invalidation for detected items
   */
  useDetect: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => subscriptionsApi.detectSubscriptions(),
      onSuccess: (response) => {
        if (response.success && response.data.totalDetections > 0) {
          // Invalidate all subscription queries to refetch with new detections
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
          queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() });
        }
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
