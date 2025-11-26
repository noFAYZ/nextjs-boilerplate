import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { accountsCategoriesApi } from '@/lib/services/accounts-categories-api';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type {
  CustomAccountCategory,
  CreateCustomCategoryRequest,
  UpdateCustomCategoryRequest,
  CustomCategoryWithAccounts,
  MapAccountToCategoryRequest,
  ListCategoriesParams,
} from '@/lib/types/custom-categories';
import type { ApiResponse } from '@/lib/types/crypto';

// Query Keys Factory
export const categoriesKeys = {
  all: ['categories'] as const,

  // Categories
  list: (orgId?: string) => [...categoriesKeys.all, 'list', orgId] as const,
  tree: (orgId?: string) => [...categoriesKeys.all, 'tree', orgId] as const,
  details: (id: string, orgId?: string) => [...categoriesKeys.list(orgId), id] as const,
  byType: (type: string, orgId?: string) => [...categoriesKeys.list(orgId), 'byType', type] as const,
  withAccounts: (id: string, orgId?: string) => [...categoriesKeys.details(id, orgId), 'accounts'] as const,
};

// Helper to get organization ID
function getCurrentOrganizationId(explicitOrgId?: string): string | undefined {
  if (explicitOrgId) return explicitOrgId;

  try {
    const orgId = useOrganizationStore.getState().selectedOrganizationId;
    return orgId || undefined;
  } catch {
    return undefined;
  }
}

// Query Options Factory
export const categoriesQueries = {
  // List all categories
  list: (params?: ListCategoriesParams, orgId?: string) => ({
    queryKey: categoriesKeys.list(orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.listCategories(params, currentOrgId);
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),

  // Get category tree (with children)
  tree: (orgId?: string) => ({
    queryKey: categoriesKeys.tree(orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.getCategoryTree(currentOrgId);
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),

  // Get category details
  details: (id: string, orgId?: string) => ({
    queryKey: categoriesKeys.details(id, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.getCategoryDetails(id, currentOrgId);
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to fetch category details');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),

  // Get categories by type
  byType: (type: string, orgId?: string) => ({
    queryKey: categoriesKeys.byType(type, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.getCategoriesByType(type, currentOrgId);
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),

  // Get category with accounts
  withAccounts: (id: string, orgId?: string) => ({
    queryKey: categoriesKeys.withAccounts(id, orgId),
    queryFn: async () => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.getCategoryAccounts(id, currentOrgId);
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to fetch category accounts');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),
};

// Mutations Factory
export const categoriesMutations = {
  // Create category
  create: (orgId?: string) => ({
    mutationFn: async (data: CreateCustomCategoryRequest) => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.createCategory(data, currentOrgId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to create category');
    },
  }),

  // Update category
  update: (categoryId: string, orgId?: string) => ({
    mutationFn: async (data: UpdateCustomCategoryRequest) => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.updateCategory(categoryId, data, currentOrgId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to update category');
    },
  }),

  // Delete category
  delete: (categoryId: string, orgId?: string) => ({
    mutationFn: async (reassignTo?: string) => {
      const currentOrgId = getCurrentOrganizationId(orgId);
      const response = await accountsCategoriesApi.deleteCategory(categoryId, reassignTo, currentOrgId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to delete category');
    },
  }),

  // Map account to category
  mapAccount: (organizationId?: string) => ({
    mutationFn: async ({
      accountId,
      categoryId,
      priority,
    }: {
      accountId: string;
      categoryId: string;
      priority?: number;
    }) => {
      const currentOrgId = getCurrentOrganizationId(organizationId);
      const response = await accountsCategoriesApi.mapAccountToCategory(
        accountId,
        categoryId,
        { priority: priority || 1 },
        currentOrgId
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to map account');
    },
  }),

  // Unmap account from category
  unmapAccount: (organizationId?: string) => ({
    mutationFn: async ({
      accountId,
      categoryId,
    }: {
      accountId: string;
      categoryId: string;
    }) => {
      const currentOrgId = getCurrentOrganizationId(organizationId);
      const response = await accountsCategoriesApi.unmapAccountFromCategory(
        accountId,
        categoryId,
        currentOrgId
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to unmap account');
    },
  }),
};
