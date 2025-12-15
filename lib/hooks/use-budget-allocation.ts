'use client';

/**
 * Budget Allocation Hook
 * Handles allocating funds to budgets
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '@/lib/services/budget-api';
import { budgetKeys } from '@/lib/queries/budget-queries';

interface AllocateRequest {
  budgetId: string;
  amount: number;
  organizationId?: string;
}

export function useBudgetAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, amount, organizationId }: AllocateRequest) => {
      // Get current budget
      const budgetResponse = await budgetApi.getBudget(budgetId, {}, organizationId);

      if (!budgetResponse.success || !budgetResponse.data) {
        throw new Error('Failed to fetch budget');
      }

      const currentBudget = budgetResponse.data;

      // Add the new allocation to existing allocated amount
      const newAllocatedAmount = (currentBudget.allocatedAmount || 0) + amount;

      // Update the budget with new allocated amount
      const response = await budgetApi.updateBudget(
        budgetId,
        {
          allocatedAmount: newAllocatedAmount,
        },
        organizationId
      );

      if (!response.success) {
        throw response;
      }

      return response;
    },
    onMutate: async ({ budgetId, amount, organizationId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: budgetKeys.detail(budgetId) });

      // Snapshot previous value
      const previousBudget = queryClient.getQueryData(budgetKeys.detail(budgetId));

      return { previousBudget };
    },
    onSuccess: async (response, { budgetId, organizationId }) => {
      if (response.success) {
        // Invalidate budget queries to refetch
        queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
        queryClient.invalidateQueries({ queryKey: budgetKeys.detail(budgetId) });
        queryClient.invalidateQueries({ queryKey: budgetKeys.analytics() });
        queryClient.invalidateQueries({ queryKey: budgetKeys.summary() });
      }
    },
    onError: (error: any) => {
      console.error('Failed to allocate budget:', error);
    },
  });
}
