/**
 * Transaction Categories Data Hooks
 * React Query hooks for transaction category operations
 * Uses actual backend endpoints from /api/v1/categories
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionCategoriesApi } from '@/lib/services/transaction-categories-api';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  displayName: string;
  emoji?: string;
  color?: string;
  description?: string;
  isDefault: boolean;
  isCustom: boolean;
}

interface CategoryGroup {
  groupId: string;
  groupName: string;
  groupColor?: string;
  groupIcon?: string;
  groupDescription?: string;
  categories: Category[];
}

interface CategoriesResponse {
  groups: CategoryGroup[];
  totalGroups: number;
  totalCategories: number;
}

interface CreateCategoryResponse {
  id: string;
  userId: string;
  organizationId: string;
  groupId: string;
  name: string;
  displayName: string;
  emoji?: string;
  color?: string;
  description?: string;
  icon?: string;
  isDefault: boolean;
  isSystem: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface InitializeCategoriesResponse {
  userId: string;
  organizationId: string;
  groupsCount: number;
  categoriesCount: number;
}

// Query keys for cache management
export const transactionCategoriesKeys = {
  all: ['transaction-categories'] as const,
  lists: () => [...transactionCategoriesKeys.all, 'list'] as const,
  list: () => [...transactionCategoriesKeys.lists()] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all transaction categories grouped by category group
 */
export function useTransactionCategories(): UseQueryResult<CategoriesResponse, Error> {
  return useQuery({
    queryKey: transactionCategoriesKeys.list(),
    queryFn: async () => {
      const response = await transactionCategoriesApi.getCategories();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// MUTATIONS - CREATE
// ============================================================================

/**
 * Create a new custom category
 */
export function useCreateCustomCategory(): UseMutationResult<CreateCategoryResponse, Error, { groupId: string; name: string; displayName?: string; emoji?: string; color?: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      groupId: string;
      name: string;
      displayName?: string;
      emoji?: string;
      color?: string;
    }) => {
      const response = await transactionCategoriesApi.createCustomCategory(data);
      return response.data;
    },
    onSuccess: (newCategory, data) => {
      // Optimistic update: add new category to cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            groups: oldData.groups.map(group =>
              group.groupId === newCategory.groupId
                ? {
                    ...group,
                    categories: [
                      ...group.categories,
                      {
                        id: newCategory.id,
                        name: newCategory.name,
                        displayName: newCategory.displayName,
                        emoji: newCategory.emoji,
                        color: newCategory.color,
                        description: newCategory.description,
                        isDefault: newCategory.isDefault,
                        isCustom: !newCategory.isDefault,
                        enabled: newCategory.enabled,
                      },
                    ],
                  }
                : group
            ),
            totalCategories: (oldData.totalCategories || 0) + 1,
          };
        }
      );

      // Background refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

// ============================================================================
// MUTATIONS - UPDATE
// ============================================================================

/**
 * Update a custom category
 */
export function useUpdateCategory(): UseMutationResult<CreateCategoryResponse, Error, { categoryId: string; data: { name?: string; displayName?: string; emoji?: string; color?: string } }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: {
        name?: string;
        displayName?: string;
        emoji?: string;
        color?: string;
      };
    }) => {
      const response = await transactionCategoriesApi.updateCategory(categoryId, data);
      return response.data;
    },
    onSuccess: (updatedCategory) => {
      // Optimistic update: modify category in cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            groups: oldData.groups.map(group => ({
              ...group,
              categories: group.categories.map(cat =>
                cat.id === updatedCategory.id
                  ? {
                      ...cat,
                      name: updatedCategory.name,
                      displayName: updatedCategory.displayName,
                      emoji: updatedCategory.emoji,
                      color: updatedCategory.color,
                      description: updatedCategory.description,
                    }
                  : cat
              ),
            })),
          };
        }
      );

      // Background refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

// ============================================================================
// MUTATIONS - DELETE
// ============================================================================

/**
 * Delete a custom category
 */
export function useDeleteCategory(): UseMutationResult<{ message: string }, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await transactionCategoriesApi.deleteCategory(categoryId);
      return response.data;
    },
    onSuccess: (_, categoryId) => {
      // Optimistic update: remove category from cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          let deletedCount = 0;
          const updated = {
            ...oldData,
            groups: oldData.groups
              .map(group => ({
                ...group,
                categories: group.categories.filter(cat => {
                  if (cat.id === categoryId) {
                    deletedCount++;
                    return false;
                  }
                  return true;
                }),
              }))
              .filter(group => group.categories.length > 0),
          };

          return {
            ...updated,
            totalCategories: Math.max(0, (oldData.totalCategories || 0) - deletedCount),
          };
        }
      );

      // Background refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

// ============================================================================
// MUTATIONS - INITIALIZATION
// ============================================================================

/**
 * Initialize default categories
 */
export function useInitializeCategories(): UseMutationResult<InitializeCategoriesResponse, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await transactionCategoriesApi.initializeCategories();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
      });
    },
  });
}

/**
 * Toggle category enabled/disabled status
 */
export function useToggleCategoryStatus(): UseMutationResult<unknown, Error, { categoryId: string; enabled: boolean }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, enabled }: { categoryId: string; enabled: boolean }) => {
      const response = await transactionCategoriesApi.toggleCategoryStatus(categoryId, enabled);
      return response.data;
    },
    onSuccess: (_, { categoryId, enabled }) => {
      // Optimistic update: toggle category status in cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            groups: oldData.groups.map(group => ({
              ...group,
              categories: group.categories.map(cat =>
                cat.id === categoryId
                  ? { ...cat, enabled }
                  : cat
              ),
            })),
          };
        }
      );

      // Background refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

// ============================================================================
// CATEGORY GROUPS
// ============================================================================

interface CategoryGroupResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryCount: number;
  categories: Array<{
    id: string;
    name: string;
    isDefault: boolean;
  }>;
}

interface CreateCategoryGroupResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryGroupsKeys = {
  all: ['category-groups'] as const,
  lists: () => [...categoryGroupsKeys.all, 'list'] as const,
  list: () => [...categoryGroupsKeys.lists()] as const,
};

/**
 * Get all category groups
 */
export function useCategoryGroups(): UseQueryResult<{ groups: CategoryGroupResponse[]; totalGroups: number }, Error> {
  return useQuery({
    queryKey: categoryGroupsKeys.list(),
    queryFn: async () => {
      const response = await transactionCategoriesApi.getCategoryGroups();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Create a new custom category group
 */
export function useCreateCategoryGroup(): UseMutationResult<CreateCategoryGroupResponse, Error, { name: string; description?: string; icon?: string; color?: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; icon?: string; color?: string }) => {
      const response = await transactionCategoriesApi.createCategoryGroup(data);
      return response.data;
    },
    onSuccess: (newGroup, data) => {
      // Optimistic update: add new group to cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            groups: [
              ...oldData.groups,
              {
                groupId: newGroup.id,
                groupName: newGroup.name,
                groupColor: newGroup.color,
                groupIcon: newGroup.icon,
                groupDescription: newGroup.description,
                categories: [],
              },
            ],
            totalGroups: (oldData.totalGroups || 0) + 1,
          };
        }
      );

      // Background refetch for category groups
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.list(),
        refetchType: 'background',
      });

      // Background refetch for all categories
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

/**
 * Update a custom category group
 */
export function useUpdateCategoryGroup(): UseMutationResult<CreateCategoryGroupResponse, Error, { groupId: string; data: { name?: string; description?: string; icon?: string; color?: string } }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, data }: { groupId: string; data: { name?: string; description?: string; icon?: string; color?: string } }) => {
      const response = await transactionCategoriesApi.updateCategoryGroup(groupId, data);
      return response.data;
    },
    onSuccess: (updatedGroup, { groupId }) => {
      // Optimistic update: modify group in cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            groups: oldData.groups.map(group =>
              group.groupId === groupId
                ? {
                    ...group,
                    groupName: updatedGroup.name,
                    groupColor: updatedGroup.color,
                    groupIcon: updatedGroup.icon,
                    groupDescription: updatedGroup.description,
                  }
                : group
            ),
          };
        }
      );

      // Background refetch for category groups
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.list(),
        refetchType: 'background',
      });

      // Background refetch for all categories
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

/**
 * Delete a custom category group
 */
export function useDeleteCategoryGroup(): UseMutationResult<{ message: string }, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      const response = await transactionCategoriesApi.deleteCategoryGroup(groupId);
      return response.data;
    },
    onSuccess: (_, groupId) => {
      // Optimistic update: remove group and its categories from cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          let deletedCategoryCount = 0;
          const filteredGroups = oldData.groups.filter(group => {
            if (group.groupId === groupId) {
              deletedCategoryCount = group.categories.length;
              return false;
            }
            return true;
          });

          return {
            ...oldData,
            groups: filteredGroups,
            totalGroups: Math.max(0, (oldData.totalGroups || 0) - 1),
            totalCategories: Math.max(0, (oldData.totalCategories || 0) - deletedCategoryCount),
          };
        }
      );

      // Background refetch for category groups
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.list(),
        refetchType: 'background',
      });

      // Background refetch for all categories
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}

/**
 * Toggle category group enabled/disabled status
 */
export function useToggleCategoryGroupStatus(): UseMutationResult<unknown, Error, { groupId: string; enabled: boolean }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, enabled }: { groupId: string; enabled: boolean }) => {
      const response = await transactionCategoriesApi.toggleCategoryGroupStatus(groupId, enabled);
      return response.data;
    },
    onSuccess: (_, { groupId, enabled }) => {
      // Optimistic update: toggle group status in cache
      queryClient.setQueryData(
        transactionCategoriesKeys.list(),
        (oldData: CategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            groups: oldData.groups.map(group =>
              group.groupId === groupId
                ? {
                    ...group,
                    enabled,
                  }
                : group
            ),
          };
        }
      );

      // Background refetch for category groups
      queryClient.invalidateQueries({
        queryKey: categoryGroupsKeys.list(),
        refetchType: 'background',
      });

      // Background refetch for all categories
      queryClient.invalidateQueries({
        queryKey: transactionCategoriesKeys.list(),
        refetchType: 'background',
      });
    },
  });
}
