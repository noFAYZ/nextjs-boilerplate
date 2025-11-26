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
    onSuccess: (data) => {
      // Invalidate list and tree caches
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.list(contextOrgId),
      });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.tree(contextOrgId),
      });

      // If account type was specified, invalidate type-specific cache
      if (data.appliedToTypes.length > 0) {
        data.appliedToTypes.forEach((type) => {
          queryClient.invalidateQueries({
            queryKey: categoriesKeys.byType(type, contextOrgId),
          });
        });
      }
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
    onSuccess: (data) => {
      // Invalidate specific category
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.details(categoryId, contextOrgId),
      });

      // Invalidate list and tree
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.list(contextOrgId),
      });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.tree(contextOrgId),
      });

      // Invalidate type-specific caches
      if (data.appliedToTypes.length > 0) {
        data.appliedToTypes.forEach((type) => {
          queryClient.invalidateQueries({
            queryKey: categoriesKeys.byType(type, contextOrgId),
          });
        });
      }
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
    onSuccess: () => {
      // Invalidate all category-related caches
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.list(contextOrgId),
      });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.tree(contextOrgId),
      });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.details(categoryId, contextOrgId),
      });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.withAccounts(categoryId, contextOrgId),
      });
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
    onSuccess: (_data, variables) => {
      // Invalidate category accounts
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.withAccounts(variables.categoryId, contextOrgId),
      });

      // Invalidate banking accounts to update customCategories
      queryClient.invalidateQueries({
        queryKey: ['banking', 'accounts'],
      });
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
    onSuccess: (_data, variables) => {
      // Invalidate category accounts
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.withAccounts(variables.categoryId, contextOrgId),
      });

      // Invalidate banking accounts to update customCategories
      queryClient.invalidateQueries({
        queryKey: ['banking', 'accounts'],
      });
    },
  });
}
