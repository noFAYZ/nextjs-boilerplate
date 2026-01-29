/**
 * Categorization Rules Data Hooks
 * React Query hooks for all categorization rule operations
 * Provides queries and mutations for CRUD, testing, and bulk operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categorizationRulesApi } from '@/lib/services/categorization-rules-api';
import { invalidateByDependency } from '@/lib/query-invalidation';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

// Query keys for cache management
export const categorizationRulesKeys = {
  all: ['categorization-rules'] as const,
  lists: () => [...categorizationRulesKeys.all, 'list'] as const,
  list: () => [...categorizationRulesKeys.lists()] as const,
  details: () => [...categorizationRulesKeys.all, 'detail'] as const,
  detail: (id: string) => [...categorizationRulesKeys.details(), id] as const,
  stats: () => [...categorizationRulesKeys.all, 'stats'] as const,
  stat: (id: string) => [...categorizationRulesKeys.stats(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all categorization rules for the user
 */
export function useCategorizationRules(): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: categorizationRulesKeys.list(),
    queryFn: async () => {
      const response = await categorizationRulesApi.getRules();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get a specific rule by ID
 */
export function useCategorizationRule(
  ruleId: string | null
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: categorizationRulesKeys.detail(ruleId || ''),
    queryFn: async () => {
      if (!ruleId) return null;
      const response = await categorizationRulesApi.getRule(ruleId);
      return response.data;
    },
    enabled: !!ruleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get statistics for a rule
 */
export function useRuleStats(
  ruleId: string | null
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: categorizationRulesKeys.stat(ruleId || ''),
    queryFn: async () => {
      if (!ruleId) return null;
      const response = await categorizationRulesApi.getRuleStats(ruleId);
      return response.data;
    },
    enabled: !!ruleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// MUTATIONS - CREATE
// ============================================================================

/**
 * Create a new categorization rule
 */
export function useCreateCategorizationRule(): UseMutationResult<any, Error, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      merchantPattern: string;
      categoryId: string;
      confidence?: number;
      priority?: number;
      description?: string;
    }) => {
      const response = await categorizationRulesApi.createRule(data);
      return response.data;
    },
    onMutate: async (newData) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.list() });

      // Get previous data
      const previousRules = queryClient.getQueryData<any[]>(categorizationRulesKeys.list());

      // Optimistically add new rule to list
      if (previousRules) {
        queryClient.setQueryData(categorizationRulesKeys.list(), [
          ...previousRules,
          { ...newData, id: `temp-${Date.now()}`, createdAt: new Date() },
        ]);
      }

      return { previousRules };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousRules) {
        queryClient.setQueryData(categorizationRulesKeys.list(), context.previousRules);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:create');
    },
  });
}

// ============================================================================
// MUTATIONS - UPDATE
// ============================================================================

/**
 * Update an existing categorization rule
 */
export function useUpdateCategorizationRule(): UseMutationResult<any, Error, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ruleId,
      data,
    }: {
      ruleId: string;
      data: {
        merchantPattern?: string;
        categoryId?: string;
        confidence?: number;
        priority?: number;
        description?: string;
        isActive?: boolean;
      };
    }) => {
      const response = await categorizationRulesApi.updateRule(ruleId, data);
      return response.data;
    },
    onMutate: async ({ ruleId, data: updates }) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.list() });
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.detail(ruleId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categorizationRulesKeys.list());
      const previousDetail = queryClient.getQueryData(categorizationRulesKeys.detail(ruleId));

      // Optimistically update list
      if (previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), previousList.map(rule =>
          rule.id === ruleId ? { ...rule, ...updates } : rule
        ));
      }

      // Optimistically update detail
      if (previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), {
          ...previousDetail,
          ...updates,
        });
      }

      return { previousList, previousDetail };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(variables.ruleId), context.previousDetail);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:update');
    },
  });
}

/**
 * Enable a rule
 */
export function useEnableRule(): UseMutationResult<any, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string) => {
      const response = await categorizationRulesApi.enableRule(ruleId);
      return response.data;
    },
    onMutate: async (ruleId) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.list() });
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.detail(ruleId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categorizationRulesKeys.list());
      const previousDetail = queryClient.getQueryData(categorizationRulesKeys.detail(ruleId));

      // Optimistically enable in list
      if (previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), previousList.map(rule =>
          rule.id === ruleId ? { ...rule, isActive: true } : rule
        ));
      }

      // Optimistically enable in detail
      if (previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), {
          ...previousDetail,
          isActive: true,
        });
      }

      return { previousList, previousDetail };
    },
    onError: (error, ruleId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), context.previousDetail);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:enable');
    },
  });
}

/**
 * Disable a rule
 */
export function useDisableRule(): UseMutationResult<any, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string) => {
      const response = await categorizationRulesApi.disableRule(ruleId);
      return response.data;
    },
    onMutate: async (ruleId) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.list() });
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.detail(ruleId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categorizationRulesKeys.list());
      const previousDetail = queryClient.getQueryData(categorizationRulesKeys.detail(ruleId));

      // Optimistically disable in list
      if (previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), previousList.map(rule =>
          rule.id === ruleId ? { ...rule, isActive: false } : rule
        ));
      }

      // Optimistically disable in detail
      if (previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), {
          ...previousDetail,
          isActive: false,
        });
      }

      return { previousList, previousDetail };
    },
    onError: (error, ruleId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), context.previousDetail);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:disable');
    },
  });
}

/**
 * Set rule priority
 */
export function useSetRulePriority(): UseMutationResult<any, Error, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ruleId,
      priority,
    }: {
      ruleId: string;
      priority: number;
    }) => {
      const response = await categorizationRulesApi.setPriority(ruleId, {
        priority,
      });
      return response.data;
    },
    onMutate: async ({ ruleId, priority }) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.list() });
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.detail(ruleId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categorizationRulesKeys.list());
      const previousDetail = queryClient.getQueryData(categorizationRulesKeys.detail(ruleId));

      // Optimistically update priority in list
      if (previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), previousList.map(rule =>
          rule.id === ruleId ? { ...rule, priority } : rule
        ));
      }

      // Optimistically update priority in detail
      if (previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), {
          ...previousDetail,
          priority,
        });
      }

      return { previousList, previousDetail };
    },
    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(variables.ruleId), context.previousDetail);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:setPriority');
    },
  });
}

/**
 * Duplicate a rule
 */
export function useDuplicateRule(): UseMutationResult<any, Error, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ruleId,
      newPriority,
    }: {
      ruleId: string;
      newPriority?: number;
    }) => {
      const response = await categorizationRulesApi.duplicateRule(ruleId, {
        newPriority,
      });
      return response.data;
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:create');
    },
  });
}

// ============================================================================
// MUTATIONS - DELETE
// ============================================================================

/**
 * Delete a categorization rule
 */
export function useDeleteCategorizationRule(): UseMutationResult<any, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string) => {
      const response = await categorizationRulesApi.deleteRule(ruleId);
      return response.data;
    },
    onMutate: async (ruleId) => {
      // Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.list() });
      await queryClient.cancelQueries({ queryKey: categorizationRulesKeys.detail(ruleId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categorizationRulesKeys.list());
      const previousDetail = queryClient.getQueryData(categorizationRulesKeys.detail(ruleId));

      // Optimistically remove from list
      if (previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), previousList.filter(rule => rule.id !== ruleId));
      }

      // Clear detail cache
      queryClient.removeQueries({ queryKey: categorizationRulesKeys.detail(ruleId) });

      return { previousList, previousDetail };
    },
    onError: (error, ruleId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categorizationRulesKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(categorizationRulesKeys.detail(ruleId), context.previousDetail);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:delete');
    },
  });
}

// ============================================================================
// MUTATIONS - TESTING
// ============================================================================

/**
 * Test a single rule
 */
export function useTestRule(): UseMutationResult<any, Error, any> {
  return useMutation({
    mutationFn: async ({
      ruleId,
      merchantName,
    }: {
      ruleId: string;
      merchantName: string;
    }) => {
      const response = await categorizationRulesApi.testRule(ruleId, {
        merchantName,
      });
      return response.data;
    },
  });
}

/**
 * Test all rules against a merchant name
 */
export function useTestAllRules(): UseMutationResult<any, Error, string> {
  return useMutation({
    mutationFn: async (merchantName: string) => {
      const response = await categorizationRulesApi.testAllRules({
        merchantName,
      });
      return response.data;
    },
  });
}

// ============================================================================
// MUTATIONS - BULK OPERATIONS
// ============================================================================

/**
 * Import rules from JSON
 */
export function useImportRules(): UseMutationResult<any, Error, any> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rules: Array<{
      merchantPattern: string;
      categoryId: string;
      confidence?: number;
      priority?: number;
      description?: string;
    }>) => {
      const response = await categorizationRulesApi.importRules({ rules });
      return response.data;
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'rules:create');
    },
  });
}

/**
 * Export all rules
 */
export function useExportRules(): UseMutationResult<any, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const response = await categorizationRulesApi.exportRules();
      return response.data;
    },
  });
}
