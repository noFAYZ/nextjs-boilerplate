/**
 * Budget Templates API Service
 * Handles budget template operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  GetBudgetTemplatesResponse,
  GetBudgetTemplateResponse,
  ApplyBudgetTemplateRequest,
  ApplyBudgetTemplateResponse,
} from '@/lib/types/budget-templates';

class BudgetTemplatesApiService {
  private readonly basePath = '/budgets/templates';

  /**
   * Get all available budget templates
   */
  async getBudgetTemplates(): Promise<GetBudgetTemplatesResponse> {
    return apiClient.get(this.basePath);
  }

  /**
   * Get specific budget template details
   */
  async getBudgetTemplate(templateId: string): Promise<GetBudgetTemplateResponse> {
    return apiClient.get(`${this.basePath}/${templateId}`);
  }

  /**
   * Apply a budget template to create budgets and envelopes
   */
  async applyBudgetTemplate(
    templateId: string,
    data: ApplyBudgetTemplateRequest
  ): Promise<ApplyBudgetTemplateResponse> {
    return apiClient.post(`${this.basePath}/${templateId}/apply`, data);
  }
}

export const budgetTemplatesApi = new BudgetTemplatesApiService();
