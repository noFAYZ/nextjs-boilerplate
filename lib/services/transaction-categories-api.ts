import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types/crypto';

/**
 * Transaction Categories API Service
 * Handles all transaction category operations
 *
 * Base path: /categories
 */
class TransactionCategoriesApiService {
  private readonly basePath = '/categories';

  // ============================================================================
  // CATEGORIES QUERIES
  // ============================================================================

  /**
   * Get all categories grouped by category group
   * GET /api/v1/categories
   */
  async getCategories(organizationId?: string): Promise<ApiResponse<{
    groups: Array<{
      groupId: string;
      groupName: string;
      groupColor?: string;
      groupIcon?: string;
      groupDescription?: string;
      categories: Array<{
        id: string;
        name: string;
        displayName: string;
        emoji?: string;
        color?: string;
        description?: string;
        isDefault: boolean;
        isCustom: boolean;
      }>;
    }>;
    totalGroups: number;
    totalCategories: number;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.get(`${this.basePath}${query}`, organizationId);
  }

  // ============================================================================
  // CUSTOM CATEGORIES OPERATIONS
  // ============================================================================

  /**
   * Create a new custom category under a category group
   * POST /api/v1/categories/custom
   */
  async createCustomCategory(
    data: {
      groupId: string;
      name: string;
      displayName?: string;
      emoji?: string;
      color?: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<{
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
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.post(`${this.basePath}/custom${query}`, data, organizationId);
  }

  /**
   * Update a custom category
   * PUT /api/v1/categories/:id
   */
  async updateCategory(
    categoryId: string,
    data: {
      name?: string;
      displayName?: string;
      emoji?: string;
      color?: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<{
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
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.put(`${this.basePath}/${categoryId}${query}`, data, organizationId);
  }

  /**
   * Delete a custom category
   * DELETE /api/v1/categories/:id
   */
  async deleteCategory(
    categoryId: string,
    organizationId?: string
  ): Promise<ApiResponse<{
    message: string;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.delete(`${this.basePath}/${categoryId}${query}`, organizationId);
  }

  // ============================================================================
  // CATEGORY INITIALIZATION
  // ============================================================================

  /**
   * Initialize default categories for organization
   * POST /api/v1/categories/initialize
   */
  async initializeCategories(organizationId?: string): Promise<ApiResponse<{
    userId: string;
    organizationId: string;
    groupsCount: number;
    categoriesCount: number;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.post(`${this.basePath}/initialize${query}`, {}, organizationId);
  }

  /**
   * Toggle category enabled/disabled status
   * PATCH /api/v1/categories/:id/status
   */
  async toggleCategoryStatus(
    categoryId: string,
    enabled: boolean,
    organizationId?: string
  ): Promise<ApiResponse<{
    id: string;
    name: string;
    groupId: string;
    enabled: boolean;
    isDefault: boolean;
    displayName: string;
    emoji?: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.patch(`${this.basePath}/${categoryId}/status${query}`, { enabled }, organizationId);
  }

  // ============================================================================
  // CATEGORY GROUPS OPERATIONS
  // ============================================================================

  /**
   * Get all category groups with their categories
   * GET /api/v1/category-groups
   */
  async getCategoryGroups(organizationId?: string): Promise<ApiResponse<{
    groups: Array<{
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
    }>;
    totalGroups: number;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.get(`/category-groups${query}`, organizationId);
  }

  /**
   * Create a new custom category group
   * POST /api/v1/category-groups
   */
  async createCategoryGroup(
    data: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.post(`/category-groups${query}`, data, organizationId);
  }

  /**
   * Update a custom category group
   * PUT /api/v1/category-groups/:id
   */
  async updateCategoryGroup(
    groupId: string,
    data: {
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
    },
    organizationId?: string
  ): Promise<ApiResponse<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.put(`/category-groups/${groupId}${query}`, data, organizationId);
  }

  /**
   * Delete a custom category group
   * DELETE /api/v1/category-groups/:id
   */
  async deleteCategoryGroup(
    groupId: string,
    organizationId?: string
  ): Promise<ApiResponse<{
    message: string;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.delete(`/category-groups/${groupId}${query}`, organizationId);
  }

  /**
   * Toggle category group enabled/disabled status
   * PATCH /api/v1/category-groups/:id/status
   */
  async toggleCategoryGroupStatus(
    groupId: string,
    enabled: boolean,
    organizationId?: string
  ): Promise<ApiResponse<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    enabled: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  }>> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.patch(`/category-groups/${groupId}/status${query}`, { enabled }, organizationId);
  }
}

export const transactionCategoriesApi = new TransactionCategoriesApiService();
