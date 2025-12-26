import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types/crypto';

/**
 * Categorization Rules API Service
 * Handles all custom categorization rule operations including CRUD, testing, and bulk operations
 *
 * Base path: /categorization-rules
 */
class CategorizationRulesApiService {
  private readonly basePath = '/categorization-rules';

  // ============================================================================
  // RULES CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all rules for the authenticated user
   */
  async getRules(organizationId?: string): Promise<ApiResponse<{
    data: Array<{
      id: string;
      userId: string;
      merchantPattern: string;
      categoryId: string;
      confidence: number;
      priority: number;
      isActive: boolean;
      appliedCount: number;
      lastAppliedAt?: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
    }>;
    count: number;
  }>> {
    return apiClient.get(`${this.basePath}`, organizationId);
  }

  /**
   * Create a new custom categorization rule
   */
  async createRule(data: {
    merchantPattern: string;
    categoryId: string;
    confidence?: number;
    priority?: number;
    description?: string;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    userId: string;
    merchantPattern: string;
    categoryId: string;
    confidence: number;
    priority: number;
    isActive: boolean;
    appliedCount: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}`, data, organizationId);
  }

  /**
   * Get a specific rule by ID
   */
  async getRule(ruleId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    userId: string;
    merchantPattern: string;
    categoryId: string;
    confidence: number;
    priority: number;
    isActive: boolean;
    appliedCount: number;
    lastAppliedAt?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.get(`${this.basePath}/${ruleId}`, organizationId);
  }

  /**
   * Update a rule
   */
  async updateRule(ruleId: string, data: {
    merchantPattern?: string;
    categoryId?: string;
    confidence?: number;
    priority?: number;
    description?: string;
    isActive?: boolean;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    userId: string;
    merchantPattern: string;
    categoryId: string;
    confidence: number;
    priority: number;
    isActive: boolean;
    appliedCount: number;
    lastAppliedAt?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.put(`${this.basePath}/${ruleId}`, data, organizationId);
  }

  /**
   * Delete a rule
   */
  async deleteRule(ruleId: string, organizationId?: string): Promise<ApiResponse<{
    message: string;
  }>> {
    return apiClient.delete(`${this.basePath}/${ruleId}`, organizationId);
  }

  // ============================================================================
  // RULES TESTING & VALIDATION
  // ============================================================================

  /**
   * Test a single rule against a merchant name
   */
  async testRule(ruleId: string, data: {
    merchantName: string;
  }, organizationId?: string): Promise<ApiResponse<{
    ruleId: string;
    merchantName: string;
    matches: boolean;
  }>> {
    return apiClient.post(`${this.basePath}/${ruleId}/test`, data, organizationId);
  }

  /**
   * Test all user rules against a merchant name (returns first match)
   */
  async testAllRules(data: {
    merchantName: string;
  }, organizationId?: string): Promise<ApiResponse<{
    merchantName: string;
    matched: boolean;
    matchedRule?: {
      id: string;
      userId: string;
      merchantPattern: string;
      categoryId: string;
      confidence: number;
      priority: number;
      isActive: boolean;
      appliedCount: number;
      lastAppliedAt?: string;
      description?: string;
      createdAt: string;
      updatedAt: string;
    };
  }>> {
    return apiClient.post(`${this.basePath}/test-all`, data, organizationId);
  }

  // ============================================================================
  // RULES MANAGEMENT OPERATIONS
  // ============================================================================

  /**
   * Enable a disabled rule
   */
  async enableRule(ruleId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    isActive: boolean;
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${ruleId}/enable`, {}, organizationId);
  }

  /**
   * Disable a rule
   */
  async disableRule(ruleId: string, organizationId?: string): Promise<ApiResponse<{
    id: string;
    isActive: boolean;
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${ruleId}/disable`, {}, organizationId);
  }

  /**
   * Set the priority of a rule
   */
  async setPriority(ruleId: string, data: {
    priority: number;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    priority: number;
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${ruleId}/priority`, data, organizationId);
  }

  /**
   * Get statistics for a rule
   */
  async getRuleStats(ruleId: string, organizationId?: string): Promise<ApiResponse<{
    ruleId: string;
    appliedCount: number;
    lastAppliedAt?: string;
    successRate: number;
  }>> {
    return apiClient.get(`${this.basePath}/${ruleId}/stats`, organizationId);
  }

  /**
   * Duplicate a rule
   */
  async duplicateRule(ruleId: string, data?: {
    newPriority?: number;
  }, organizationId?: string): Promise<ApiResponse<{
    id: string;
    userId: string;
    merchantPattern: string;
    categoryId: string;
    confidence: number;
    priority: number;
    isActive: boolean;
    appliedCount: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    return apiClient.post(`${this.basePath}/${ruleId}/duplicate`, data || {}, organizationId);
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk import rules from JSON array
   */
  async importRules(data: {
    rules: Array<{
      merchantPattern: string;
      categoryId: string;
      confidence?: number;
      priority?: number;
      description?: string;
    }>;
  }, organizationId?: string): Promise<ApiResponse<{
    created: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
  }>> {
    return apiClient.post(`${this.basePath}/import`, data, organizationId);
  }

  /**
   * Export all user rules as JSON file
   */
  async exportRules(organizationId?: string): Promise<any> {
    const response = await apiClient.get(`${this.basePath}/export`, organizationId);
    return response;
  }
}

export const categorizationRulesApi = new CategorizationRulesApiService();
