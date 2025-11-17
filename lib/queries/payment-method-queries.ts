/**
 * Payment Method Query Factories
 *
 * PURPOSE: Query and mutation factories for payment method data
 * - Centralizes all payment method-related query logic
 * - Implements optimistic updates and cache invalidation
 * - Follows TanStack Query best practices
 */

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { paymentMethodsApi } from '@/lib/services/payment-methods-api';
import type { PaymentMethod, CreatePaymentMethodRequest, UpdatePaymentMethodRequest } from '@/lib/types/subscription';
import type { ApiResponse } from '@/lib/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: () => [...paymentMethodKeys.lists()] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentMethodKeys.details(), id] as const,
};

// ============================================================================
// QUERY FACTORIES
// ============================================================================

export const paymentMethodQueries = {
  /**
   * Get all payment methods
   */
  list: () =>
    queryOptions({
      queryKey: paymentMethodKeys.list(),
      queryFn: async () => {
        const response = await paymentMethodsApi.getPaymentMethods();
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to fetch payment methods');
        }
        return response.data || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    }),

  /**
   * Get a single payment method
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: paymentMethodKeys.detail(id),
      queryFn: async () => {
        const response = await paymentMethodsApi.getPaymentMethod(id);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to fetch payment method');
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }),
};

// ============================================================================
// MUTATION FACTORIES
// ============================================================================

export const paymentMethodMutations = {
  /**
   * Create a new payment method
   */
  useCreate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: CreatePaymentMethodRequest) => paymentMethodsApi.createPaymentMethod(data),
      onSuccess: (response: ApiResponse<PaymentMethod>) => {
        // Invalidate payment methods list
        queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });

        // If this is set as default, invalidate subscriptions that might show payment method info
        if (response.data?.isDefault) {
          queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        }
      },
    });
  },

  /**
   * Update an existing payment method
   */
  useUpdate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, updates }: { id: string; updates: UpdatePaymentMethodRequest }) =>
        paymentMethodsApi.updatePaymentMethod(id, updates),
      onMutate: async ({ id, updates }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: paymentMethodKeys.detail(id) });

        // Snapshot the previous value
        const previousPaymentMethod = queryClient.getQueryData<PaymentMethod>(
          paymentMethodKeys.detail(id)
        );

        // Optimistically update the cache
        if (previousPaymentMethod) {
          queryClient.setQueryData<PaymentMethod>(paymentMethodKeys.detail(id), {
            ...previousPaymentMethod,
            ...updates,
          });
        }

        return { previousPaymentMethod };
      },
      onError: (err, { id }, context) => {
        // Revert optimistic update on error
        if (context?.previousPaymentMethod) {
          queryClient.setQueryData(paymentMethodKeys.detail(id), context.previousPaymentMethod);
        }
      },
      onSuccess: (response, { id }) => {
        // Update the detail query
        if (response.data) {
          queryClient.setQueryData(paymentMethodKeys.detail(id), response.data);
        }

        // Invalidate list to reflect changes
        queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });

        // If default status changed, invalidate subscriptions
        if (response.data?.isDefault) {
          queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        }
      },
    });
  },

  /**
   * Delete a payment method
   */
  useDelete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => paymentMethodsApi.deletePaymentMethod(id),
      onMutate: async (id: string) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: paymentMethodKeys.list() });

        // Snapshot the previous value
        const previousPaymentMethods = queryClient.getQueryData<PaymentMethod[]>(
          paymentMethodKeys.list()
        );

        // Optimistically remove from the list
        if (previousPaymentMethods) {
          queryClient.setQueryData<PaymentMethod[]>(
            paymentMethodKeys.list(),
            previousPaymentMethods.filter((pm) => pm.id !== id)
          );
        }

        return { previousPaymentMethods };
      },
      onError: (err, id, context) => {
        // Revert optimistic update on error
        if (context?.previousPaymentMethods) {
          queryClient.setQueryData(paymentMethodKeys.list(), context.previousPaymentMethods);
        }
      },
      onSuccess: (response, id) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: paymentMethodKeys.detail(id) });

        // Invalidate list
        queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });

        // Invalidate subscriptions that might reference this payment method
        queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      },
    });
  },

  /**
   * Set a payment method as default
   */
  useSetDefault: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => paymentMethodsApi.setDefaultPaymentMethod(id),
      onMutate: async (id: string) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: paymentMethodKeys.list() });

        // Snapshot the previous value
        const previousPaymentMethods = queryClient.getQueryData<PaymentMethod[]>(
          paymentMethodKeys.list()
        );

        // Optimistically update: unset all defaults and set the new one
        if (previousPaymentMethods) {
          queryClient.setQueryData<PaymentMethod[]>(
            paymentMethodKeys.list(),
            previousPaymentMethods.map((pm) => ({
              ...pm,
              isDefault: pm.id === id,
            }))
          );
        }

        return { previousPaymentMethods };
      },
      onError: (err, id, context) => {
        // Revert optimistic update on error
        if (context?.previousPaymentMethods) {
          queryClient.setQueryData(paymentMethodKeys.list(), context.previousPaymentMethods);
        }
      },
      onSuccess: (response, id) => {
        // Update the detail query
        if (response.data) {
          queryClient.setQueryData(paymentMethodKeys.detail(id), response.data);
        }

        // Invalidate list to reflect changes
        queryClient.invalidateQueries({ queryKey: paymentMethodKeys.list() });

        // Invalidate subscriptions that might show default payment method
        queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      },
    });
  },
};
