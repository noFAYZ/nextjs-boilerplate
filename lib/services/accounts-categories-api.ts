import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types/crypto';
import type {
  CustomAccountCategory,
  CreateCustomCategoryRequest,
  UpdateCustomCategoryRequest,
  CustomCategoryWithAccounts,
  MapAccountToCategoryRequest,
  ListCategoriesParams,
  MapAccountResponse,
  DeleteCategoryResponse,
  ListCategoriesResponse,
  CategoryDetailsResponse,
  CreateCategoryResponse,
} from '@/lib/types/custom-categories';

class AccountsCategoriesApiService {
  private readonly basePath = '/accounts/categories';

  // ============================================================================
  // CUSTOM CATEGORIES MANAGEMENT
  // ============================================================================

  /**
   * Create a new custom account category
   */
  async createCategory(
    data: CreateCustomCategoryRequest,
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory>> {
    return apiClient.post(this.basePath, data, organizationId);
  }

  /**
   * List all custom categories
   */
  async listCategories(
    params?: ListCategoriesParams,
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory[]>> {
    const searchParams = new URLSearchParams();

    if (params?.organizationId) searchParams.set('organizationId', params.organizationId);
    if (params?.includeChildren !== undefined) searchParams.set('includeChildren', String(params.includeChildren));
    if (params?.includeAccounts !== undefined) searchParams.set('includeAccounts', String(params.includeAccounts));
    if (params?.appliedToType) searchParams.set('appliedToType', params.appliedToType);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));

    const query = searchParams.toString();
    return apiClient.get(`${this.basePath}${query ? `?${query}` : ''}`, organizationId);
  }

  /**
   * Get a specific category by ID
   */
  async getCategoryDetails(
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory>> {
    return apiClient.get(`${this.basePath}/${categoryId}`, organizationId);
  }

  /**
   * Update a custom category
   */
  async updateCategory(
    categoryId: string,
    data: UpdateCustomCategoryRequest,
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory>> {
    return apiClient.put(`${this.basePath}/${categoryId}`, data, organizationId);
  }

  /**
   * Delete a custom category
   * @param categoryId - Category ID to delete
   * @param reassignTo - Optional category ID to reassign accounts to
   */
  async deleteCategory(
    categoryId: string,
    reassignTo?: string,
    organizationId?: string
  ): Promise<ApiResponse<DeleteCategoryResponse>> {
    const query = reassignTo ? `?reassignTo=${reassignTo}` : '';
    return apiClient.delete(`${this.basePath}/${categoryId}${query}`, organizationId);
  }

  // ============================================================================
  // CATEGORY-ACCOUNT MAPPING
  // ============================================================================

  /**
   * Get all accounts in a category (including descendants)
   */
  async getCategoryAccounts(
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<CustomCategoryWithAccounts>> {
    return apiClient.get(`${this.basePath}/${categoryId}/accounts`, organizationId);
  }

  /**
   * Map an account to a category
   */
  async mapAccountToCategory(
    accountId: string,
    categoryId: string,
    data: MapAccountToCategoryRequest,
    organizationId?: string
  ): Promise<ApiResponse<MapAccountResponse>> {
    return apiClient.post(
      `/accounts/${accountId}/categories/${categoryId}`,
      data,
      organizationId
    );
  }

  /**
   * Unmap an account from a category
   */
  async unmapAccountFromCategory(
    accountId: string,
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<MapAccountResponse>> {
    return apiClient.delete(
      `/accounts/${accountId}/categories/${categoryId}`,
      organizationId
    );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get category hierarchy (tree view)
   */
  async getCategoryTree(
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory[]>> {
    return this.listCategories({ includeChildren: true }, organizationId);
  }

  /**
   * Get categories by account type
   */
  async getCategoriesByType(
    accountType: string,
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory[]>> {
    return this.listCategories({ appliedToType: accountType }, organizationId);
  }

  /**
   * Batch map accounts to category
   */
  async batchMapAccountsToCategory(
    categoryId: string,
    accountIds: string[],
    priority: number = 1,
    organizationId?: string
  ): Promise<ApiResponse<{ success: number; failed: number }>> {
    try {
      const results = await Promise.allSettled(
        accountIds.map(accountId =>
          this.mapAccountToCategory(
            accountId,
            categoryId,
            { priority },
            organizationId
          )
        )
      );

      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: true,
        data: { success, failed }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BATCH_OPERATION_FAILED',
          message: 'Failed to batch map accounts',
          details: error
        }
      };
    }
  }

  /**
   * Create hierarchical category structure
   */
  async createCategoryHierarchy(
    categories: Array<{
      name: string;
      appliedToTypes: string[];
      children?: Array<{
        name: string;
        appliedToTypes: string[];
      }>;
      color?: string;
      icon?: string;
    }>,
    organizationId?: string
  ): Promise<ApiResponse<CustomAccountCategory[]>> {
    try {
      const created: CustomAccountCategory[] = [];

      for (const category of categories) {
        const parentResponse = await this.createCategory(
          {
            name: category.name,
            appliedToTypes: category.appliedToTypes,
            color: category.color,
            icon: category.icon
          },
          organizationId
        );

        if (parentResponse.success) {
          created.push(parentResponse.data);

          // Create child categories if provided
          if (category.children) {
            for (const child of category.children) {
              const childResponse = await this.createCategory(
                {
                  name: child.name,
                  appliedToTypes: child.appliedToTypes,
                  parentId: parentResponse.data.id
                },
                organizationId
              );

              if (childResponse.success) {
                created.push(childResponse.data);
              }
            }
          }
        }
      }

      return {
        success: true,
        data: created
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HIERARCHY_CREATION_FAILED',
          message: 'Failed to create category hierarchy',
          details: error
        }
      };
    }
  }
}

export const accountsCategoriesApi = new AccountsCategoriesApiService();
export default accountsCategoriesApi;
