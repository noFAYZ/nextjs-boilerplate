/**
 * Subscription Data Hooks
 *
 * PURPOSE: Production-grade React Query hooks for subscription data
 * - Single source of truth for ALL subscription server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: subscriptions, isLoading } = useSubscriptions();
 * const { mutate: createSubscription } = useCreateSubscription();
 * ```
 */

import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  subscriptionKeys,
  subscriptionQueries,
  subscriptionMutations,
} from './subscription-queries';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSubscriptionUIStore } from '@/lib/stores/subscription-ui-store';
import type {
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionFilters,
} from '@/lib/types/subscription';

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
// SUBSCRIPTION QUERIES
// ============================================================================

/**
 * Get all subscriptions with optional filtering
 * @param filters - Optional filters for subscriptions
 * @returns Subscriptions with pagination
 */
export function useSubscriptions(filters?: SubscriptionFilters) {
  const { isAuthReady } = useAuthReady();
  const uiFilters = useSubscriptionUIStore((state) => state.filters);

  // Merge UI store filters with provided filters
  const mergedFilters: SubscriptionFilters = {
    ...filters,
    category: filters?.category || (uiFilters?.categories?.length > 0 ? uiFilters.categories[0] : undefined),
    status: filters?.status || (uiFilters?.statuses?.length > 0 ? uiFilters.statuses[0] : undefined),
    search: filters?.search || uiFilters?.searchQuery || undefined,
    sortBy: filters?.sortBy || uiFilters?.sortBy,
    sortOrder: filters?.sortOrder || uiFilters?.sortOrder,
  };

  return useQuery({
    ...subscriptionQueries.list(mergedFilters),
    enabled: isAuthReady,
  });
}

/**
 * Get a single subscription by ID
 * @param subscriptionId - Subscription ID to fetch
 * @param options - Options for including charges/reminders
 * @returns Subscription data with loading/error states
 */
export function useSubscription(
  subscriptionId: string | null,
  options?: { includeCharges?: boolean; includeReminders?: boolean }
) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...subscriptionQueries.detail(subscriptionId!, options),
    enabled: isAuthReady && !!subscriptionId,
  });
}

/**
 * Get the currently selected subscription based on UI store
 * @returns Selected subscription data or null
 */
export function useSelectedSubscription() {
  const selectedSubscriptionId = useSubscriptionUIStore(
    (state) => state.selectedSubscriptionId
  );
  return useSubscription(selectedSubscriptionId, {
    includeCharges: true,
    includeReminders: true,
  });
}

/**
 * Get subscription analytics
 * @returns Analytics data with loading/error states
 */
export function useSubscriptionAnalytics() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...subscriptionQueries.analytics(),
    enabled: isAuthReady,
  });
}

// ============================================================================
// SUBSCRIPTION MUTATIONS
// ============================================================================

/**
 * Create a new subscription
 * @returns Mutation hook with optimistic updates
 */
export function useCreateSubscription() {
  const { closeCreateModal } = useSubscriptionUIStore();
  const createMutation = subscriptionMutations.useCreate();

  return {
    ...createMutation,
    mutate: (data: CreateSubscriptionRequest, options?: { onSuccess?: (response: ApiResponse<UserSubscription>, variables: CreateSubscriptionRequest, context: unknown) => void }) => {
      createMutation.mutate(data, {
        ...options,
        onSuccess: (response: ApiResponse<UserSubscription>, variables: CreateSubscriptionRequest, context: unknown) => {
          if (response.success) {
            closeCreateModal();
          }
          options?.onSuccess?.(response, variables, context);
        },
      });
    },
  };
}

/**
 * Update an existing subscription
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateSubscription() {
  const { closeEditModal } = useSubscriptionUIStore();
  const updateMutation = subscriptionMutations.useUpdate();

  return {
    ...updateMutation,
    mutate: (data: { id: string; updates: UpdateSubscriptionRequest }, options?: { onSuccess?: (response: ApiResponse<UserSubscription>, variables: { id: string; updates: UpdateSubscriptionRequest }, context: unknown) => void }) => {
      updateMutation.mutate(data, {
        ...options,
        onSuccess: (response: ApiResponse<UserSubscription>, variables: { id: string; updates: UpdateSubscriptionRequest }, context: unknown) => {
          if (response.success) {
            closeEditModal();
          }
          options?.onSuccess?.(response, variables, context);
        },
      });
    },
  };
}

/**
 * Delete a subscription
 * @returns Mutation hook with optimistic updates
 */
export function useDeleteSubscription() {
  const { closeDeleteModal, selectSubscription } = useSubscriptionUIStore();
  const deleteMutation = subscriptionMutations.useDelete();

  return {
    ...deleteMutation,
    mutate: (subscriptionId: string, options?: { onSuccess?: (response: ApiResponse<void>, variables: string, context: unknown) => void }) => {
      deleteMutation.mutate(subscriptionId, {
        ...options,
        onSuccess: (response: ApiResponse<void>, variables: string, context: unknown) => {
          if (response.success) {
            closeDeleteModal();
            selectSubscription(null);
          }
          options?.onSuccess?.(response, variables, context);
        },
      });
    },
  };
}

/**
 * Add a charge to a subscription
 * @returns Mutation hook
 */
export function useAddCharge() {
  return subscriptionMutations.useAddCharge();
}

/**
 * Detect subscriptions from transaction data
 * @returns Mutation hook
 */
export function useDetectSubscriptions() {
  return subscriptionMutations.useDetect();
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all subscription-related queries
 * @returns Invalidation functions
 */
export function useInvalidateSubscriptionCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) }),
    invalidateAnalytics: () =>
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.analytics() }),
  };
}

/**
 * Prefetch subscription data for performance
 * @returns Prefetch functions
 */
export function usePrefetchSubscriptionData() {
  const queryClient = useQueryClient();
  const { isAuthReady } = useAuthReady();

  return {
    prefetchSubscriptions: (filters?: SubscriptionFilters) => {
      if (isAuthReady) {
        queryClient.prefetchQuery(subscriptionQueries.list(filters));
      }
    },
    prefetchSubscription: (subscriptionId: string) => {
      if (isAuthReady) {
        queryClient.prefetchQuery(
          subscriptionQueries.detail(subscriptionId, {
            includeCharges: true,
            includeReminders: true,
          })
        );
      }
    },
    prefetchAnalytics: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(subscriptionQueries.analytics());
      }
    },
  };
}

/**
 * Get subscription summary stats (derived from list)
 * @returns Summary statistics
 */
export function useSubscriptionSummary() {
  const { data: subscriptions, isLoading } = useSubscriptions();

  if (isLoading || !subscriptions) {
    return {
      total: 0,
      active: 0,
      trial: 0,
      cancelled: 0,
      totalMonthlySpend: 0,
      totalYearlySpend: 0,
    };
  }

  const subs = subscriptions || [];

  return {
    total: subs.length,
    active: subs.filter((s) => s.status === 'ACTIVE').length,
    trial: subs.filter((s) => s.status === 'TRIAL').length,
    cancelled: subs.filter((s) => s.status === 'CANCELLED').length,
    totalMonthlySpend: subs.reduce((sum, s) => sum + s.monthlyEquivalent, 0),
    totalYearlySpend: subs.reduce((sum, s) => sum + s.yearlyEstimate, 0),
  };
}
