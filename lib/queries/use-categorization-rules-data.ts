/**
 * Categorization Rules Data Hooks
 * React Query hooks for all categorization rule operations
 * Provides queries and mutations for CRUD, testing, and bulk operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categorizationRulesApi } from '@/lib/services/categorization-rules-api';
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: categorizationRulesKeys.detail(data.id),
        });
      }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: categorizationRulesKeys.detail(data.id),
        });
      }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: categorizationRulesKeys.detail(data.id),
        });
      }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: categorizationRulesKeys.detail(data.id),
        });
      }
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
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
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
      queryClient.invalidateQueries({
        queryKey: categorizationRulesKeys.list(),
      });
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
