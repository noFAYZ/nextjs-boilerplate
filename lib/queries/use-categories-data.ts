/**
 * Custom Account Categories Data Hooks
 *
 * PURPOSE: Consolidated, production-grade React Query hooks for custom account categories
 * - Single source of truth for ALL category server state
 * - No useEffect patterns - React Query handles everything
 * - Optimistic updates built-in
 * - Automatic cache invalidation
 *
 * USAGE:
 * ```ts
 * const { data: categories, isLoading } = useCategories();
 * const { mutate: createCategory } = useCreateCategory();
 * ```
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  categoriesKeys,
  categoriesQueries,
  categoriesMutations,
} from './categories-queries';
import { invalidateByDependency } from '@/lib/query-invalidation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  CustomAccountCategory,
  CreateCustomCategoryRequest,
  UpdateCustomCategoryRequest,
  CustomCategoryWithAccounts,
  ListCategoriesParams,
} from '@/lib/types/custom-categories';

// ============================================================================
// AUTH-READY WRAPPER
// ============================================================================

function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

/**
 * Helper to get organization ID from context store or explicit parameter
 */
function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all categories
 * @param params - Query parameters for filtering
 * @param organizationId - Optional organization ID to scope data
 * @returns All categories with loading/error states
 */
export function useCategories(
  params?: ListCategoriesParams,
  organizationId?: string
) {
  const { isAuthReady } = useAuthReady();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...categoriesQueries.list(params, contextOrgId),
    enabled: isAuthReady,
  });
}

/**
 * Get category hierarchy (tree view with children)
 * @param organizationId - Optional organization ID to scope data
 * @returns Category tree with loading/error states
 */
export function useCategoryTree(organizationId?: string) {
  const { isAuthReady } = useAuthReady();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...categoriesQueries.tree(contextOrgId),
    enabled: isAuthReady,
  });
}

/**
 * Get a single category by ID
 * @param categoryId - Category ID to fetch
 * @param organizationId - Optional organization ID to scope data
 * @returns Category data with loading/error states
 */
export function useCategory(
  categoryId: string | null,
  organizationId?: string
) {
  const { isAuthReady } = useAuthReady();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...categoriesQueries.details(categoryId || '', contextOrgId),
    enabled: isAuthReady && !!categoryId,
  });
}

/**
 * Get categories by account type
 * @param accountType - Account type to filter by
 * @param organizationId - Optional organization ID to scope data
 * @returns Filtered categories with loading/error states
 */
export function useCategoriesByType(
  accountType: string,
  organizationId?: string
) {
  const { isAuthReady } = useAuthReady();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...categoriesQueries.byType(accountType, contextOrgId),
    enabled: isAuthReady && !!accountType,
  });
}

/**
 * Get category with all its accounts (including nested categories)
 * @param categoryId - Category ID to fetch accounts for
 * @param organizationId - Optional organization ID to scope data
 * @returns Category with accounts data with loading/error states
 */
export function useCategoryWithAccounts(
  categoryId: string | null,
  organizationId?: string
) {
  const { isAuthReady } = useAuthReady();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useQuery({
    ...categoriesQueries.withAccounts(categoryId || '', contextOrgId),
    enabled: isAuthReady && !!categoryId,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new category
 * @param organizationId - Optional organization ID to scope data
 * @returns Mutation object with mutate function
 */
export function useCreateCategory(organizationId?: string) {
  const queryClient = useQueryClient();
  const contextOrgId = useContextOrganizationId(organizationId);
  const { isAuthReady } = useAuthReady();

  return useMutation({
    ...categoriesMutations.create(contextOrgId),
    onMutate: async (newCategory) => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: categoriesKeys.list(contextOrgId) });
      await queryClient.cancelQueries({ queryKey: categoriesKeys.tree(contextOrgId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categoriesKeys.list(contextOrgId));
      const previousTree = queryClient.getQueryData<any[]>(categoriesKeys.tree(contextOrgId));

      // Optimistically add to list
      if (previousList) {
        queryClient.setQueryData(categoriesKeys.list(contextOrgId), [
          ...previousList,
          { ...newCategory, id: `temp-${Date.now()}`, createdAt: new Date() },
        ]);
      }

      // Optimistically add to tree
      if (previousTree) {
        queryClient.setQueryData(categoriesKeys.tree(contextOrgId), [
          ...previousTree,
          { ...newCategory, id: `temp-${Date.now()}`, children: [], createdAt: new Date() },
        ]);
      }

      return { previousList, previousTree };
    },
    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categoriesKeys.list(contextOrgId), context.previousList);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(categoriesKeys.tree(contextOrgId), context.previousTree);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'categories:create');
    },
  });
}

/**
 * Update a category
 * @param categoryId - Category ID to update
 * @param organizationId - Optional organization ID to scope data
 * @returns Mutation object with mutate function
 */
export function useUpdateCategory(
  categoryId: string,
  organizationId?: string
) {
  const queryClient = useQueryClient();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useMutation({
    ...categoriesMutations.update(categoryId, contextOrgId),
    onMutate: async (updates) => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: categoriesKeys.list(contextOrgId) });
      await queryClient.cancelQueries({ queryKey: categoriesKeys.tree(contextOrgId) });
      await queryClient.cancelQueries({ queryKey: categoriesKeys.details(categoryId, contextOrgId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categoriesKeys.list(contextOrgId));
      const previousTree = queryClient.getQueryData<any[]>(categoriesKeys.tree(contextOrgId));
      const previousDetail = queryClient.getQueryData(categoriesKeys.details(categoryId, contextOrgId));

      // Update list
      if (previousList) {
        queryClient.setQueryData(categoriesKeys.list(contextOrgId), previousList.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        ));
      }

      // Update tree
      if (previousTree) {
        queryClient.setQueryData(categoriesKeys.tree(contextOrgId), previousTree.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        ));
      }

      // Update detail
      if (previousDetail) {
        queryClient.setQueryData(categoriesKeys.details(categoryId, contextOrgId), {
          ...previousDetail,
          ...updates,
        });
      }

      return { previousList, previousTree, previousDetail };
    },
    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categoriesKeys.list(contextOrgId), context.previousList);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(categoriesKeys.tree(contextOrgId), context.previousTree);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(categoriesKeys.details(categoryId, contextOrgId), context.previousDetail);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'categories:update');
    },
  });
}

/**
 * Delete a category
 * @param categoryId - Category ID to delete
 * @param organizationId - Optional organization ID to scope data
 * @returns Mutation object with mutate function
 */
export function useDeleteCategory(
  categoryId: string,
  organizationId?: string
) {
  const queryClient = useQueryClient();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useMutation({
    ...categoriesMutations.delete(categoryId, contextOrgId),
    onMutate: async () => {
      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: categoriesKeys.list(contextOrgId) });
      await queryClient.cancelQueries({ queryKey: categoriesKeys.tree(contextOrgId) });
      await queryClient.cancelQueries({ queryKey: categoriesKeys.details(categoryId, contextOrgId) });
      await queryClient.cancelQueries({ queryKey: categoriesKeys.withAccounts(categoryId, contextOrgId) });

      // Get previous data
      const previousList = queryClient.getQueryData<any[]>(categoriesKeys.list(contextOrgId));
      const previousTree = queryClient.getQueryData<any[]>(categoriesKeys.tree(contextOrgId));

      // Remove from list
      if (previousList) {
        queryClient.setQueryData(categoriesKeys.list(contextOrgId), previousList.filter(cat => cat.id !== categoryId));
      }

      // Remove from tree
      if (previousTree) {
        queryClient.setQueryData(categoriesKeys.tree(contextOrgId), previousTree.filter(cat => cat.id !== categoryId));
      }

      // Clear related caches
      queryClient.removeQueries({ queryKey: categoriesKeys.details(categoryId, contextOrgId) });
      queryClient.removeQueries({ queryKey: categoriesKeys.withAccounts(categoryId, contextOrgId) });

      return { previousList, previousTree };
    },
    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(categoriesKeys.list(contextOrgId), context.previousList);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(categoriesKeys.tree(contextOrgId), context.previousTree);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'categories:delete');
    },
  });
}

/**
 * Map an account to a category
 * @param organizationId - Optional organization ID to scope data
 * @returns Mutation object with mutate function
 */
export function useMapAccountToCategory(organizationId?: string) {
  const queryClient = useQueryClient();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useMutation({
    ...categoriesMutations.mapAccount(contextOrgId),
    onMutate: async ({ categoryId }) => {
      // Import here to avoid circular deps
      const { categoriesKeys: cKeys } = await import('./categories-queries');
      const { bankingKeys: bKeys } = await import('./banking-queries');

      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: cKeys.withAccounts(categoryId, contextOrgId) });
      await queryClient.cancelQueries({ queryKey: bKeys.accounts() });

      // Get previous data
      const previousCategoryAccounts = queryClient.getQueryData(cKeys.withAccounts(categoryId, contextOrgId));
      const previousBankingAccounts = queryClient.getQueryData(bKeys.accounts());

      return { previousCategoryAccounts, previousBankingAccounts };
    },
    onError: (error, variables, context) => {
      const { categoriesKeys: cKeys } = require('./categories-queries');
      const { bankingKeys: bKeys } = require('./banking-queries');

      if (context?.previousCategoryAccounts) {
        queryClient.setQueryData(cKeys.withAccounts(variables.categoryId, contextOrgId), context.previousCategoryAccounts);
      }
      if (context?.previousBankingAccounts) {
        queryClient.setQueryData(bKeys.accounts(), context.previousBankingAccounts);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'categories:mapAccount');
    },
  });
}

/**
 * Unmap an account from a category
 * @param organizationId - Optional organization ID to scope data
 * @returns Mutation object with mutate function
 */
export function useUnmapAccountFromCategory(organizationId?: string) {
  const queryClient = useQueryClient();
  const contextOrgId = useContextOrganizationId(organizationId);

  return useMutation({
    ...categoriesMutations.unmapAccount(contextOrgId),
    onMutate: async ({ categoryId }) => {
      // Import here to avoid circular deps
      const { categoriesKeys: cKeys } = await import('./categories-queries');
      const { bankingKeys: bKeys } = await import('./banking-queries');

      // Cancel refetches
      await queryClient.cancelQueries({ queryKey: cKeys.withAccounts(categoryId, contextOrgId) });
      await queryClient.cancelQueries({ queryKey: bKeys.accounts() });

      // Get previous data
      const previousCategoryAccounts = queryClient.getQueryData(cKeys.withAccounts(categoryId, contextOrgId));
      const previousBankingAccounts = queryClient.getQueryData(bKeys.accounts());

      return { previousCategoryAccounts, previousBankingAccounts };
    },
    onError: (error, variables, context) => {
      const { categoriesKeys: cKeys } = require('./categories-queries');
      const { bankingKeys: bKeys } = require('./banking-queries');

      if (context?.previousCategoryAccounts) {
        queryClient.setQueryData(cKeys.withAccounts(variables.categoryId, contextOrgId), context.previousCategoryAccounts);
      }
      if (context?.previousBankingAccounts) {
        queryClient.setQueryData(bKeys.accounts(), context.previousBankingAccounts);
      }
    },
    onSuccess: () => {
      invalidateByDependency(queryClient, 'categories:unmapAccount');
    },
  });
}
