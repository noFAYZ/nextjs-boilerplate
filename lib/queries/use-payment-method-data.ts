/**
 * Payment Method Data Hooks
 *
 * PURPOSE: Production-grade React Query hooks for payment method data
 * - Single source of truth for ALL payment method server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: paymentMethods, isLoading } = usePaymentMethods();
 * const { mutate: createPaymentMethod } = useCreatePaymentMethod();
 * ```
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  paymentMethodKeys,
  paymentMethodQueries,
  paymentMethodMutations,
} from './payment-method-queries';
import { useAuthStore } from '@/lib/stores/auth-store';

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
// PAYMENT METHOD QUERIES
// ============================================================================

/**
 * Get all payment methods for the current user
 * @returns Payment methods with loading/error states
 */
export function usePaymentMethods() {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...paymentMethodQueries.list(),
    enabled: isAuthReady,
  });
}

/**
 * Get a single payment method by ID
 * @param paymentMethodId - Payment method ID to fetch
 * @returns Payment method data with loading/error states
 */
export function usePaymentMethod(paymentMethodId: string | null) {
  const { isAuthReady } = useAuthReady();

  return useQuery({
    ...paymentMethodQueries.detail(paymentMethodId!),
    enabled: isAuthReady && !!paymentMethodId,
  });
}

/**
 * Get the default payment method
 * @returns Default payment method or null
 */
export function useDefaultPaymentMethod() {
  const { data: paymentMethods, isLoading, error } = usePaymentMethods();

  const defaultPaymentMethod = paymentMethods?.find((pm) => pm.isDefault) || null;

  return {
    data: defaultPaymentMethod,
    isLoading,
    error,
  };
}

// ============================================================================
// PAYMENT METHOD MUTATIONS
// ============================================================================

/**
 * Create a new payment method
 * @returns Mutation hook with optimistic updates
 */
export function useCreatePaymentMethod() {
  return paymentMethodMutations.useCreate();
}

/**
 * Update an existing payment method
 * @returns Mutation hook with optimistic updates
 */
export function useUpdatePaymentMethod() {
  return paymentMethodMutations.useUpdate();
}

/**
 * Delete a payment method
 * @returns Mutation hook with optimistic updates
 */
export function useDeletePaymentMethod() {
  return paymentMethodMutations.useDelete();
}

/**
 * Set a payment method as default
 * @returns Mutation hook with optimistic updates
 */
export function useSetDefaultPaymentMethod() {
  return paymentMethodMutations.useSetDefault();
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Invalidate all payment method-related queries
 * @returns Invalidation functions
 */
export function useInvalidatePaymentMethodCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all }),
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.detail(id) }),
  };
}

/**
 * Prefetch payment method data for performance
 * @returns Prefetch functions
 */
export function usePrefetchPaymentMethodData() {
  const queryClient = useQueryClient();
  const { isAuthReady } = useAuthReady();

  return {
    prefetchPaymentMethods: () => {
      if (isAuthReady) {
        queryClient.prefetchQuery(paymentMethodQueries.list());
      }
    },
    prefetchPaymentMethod: (paymentMethodId: string) => {
      if (isAuthReady) {
        queryClient.prefetchQuery(paymentMethodQueries.detail(paymentMethodId));
      }
    },
  };
}

/**
 * Get payment method summary stats
 * @returns Summary statistics
 */
export function usePaymentMethodSummary() {
  const { data: paymentMethods, isLoading } = usePaymentMethods();

  if (isLoading || !paymentMethods) {
    return {
      total: 0,
      active: 0,
      hasDefault: false,
      creditCards: 0,
      bankAccounts: 0,
    };
  }

  return {
    total: paymentMethods.length,
    active: paymentMethods.filter((pm) => pm.isActive).length,
    hasDefault: paymentMethods.some((pm) => pm.isDefault),
    creditCards: paymentMethods.filter(
      (pm) => pm.type === 'CREDIT_CARD' || pm.type === 'DEBIT_CARD'
    ).length,
    bankAccounts: paymentMethods.filter((pm) => pm.type === 'BANK_ACCOUNT').length,
  };
}
