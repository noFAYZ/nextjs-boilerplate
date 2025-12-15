/**
 * Budget Forecasting API Service
 * Handles spending predictions and budget projections
 */

import { apiClient } from '@/lib/api-client';
import type {
  GetEnvelopeForecastParams,
  GetEnvelopeForecastResponse,
  GetBudgetForecastParams,
  GetBudgetForecastResponse,
  GetSpendingInsightsResponse,
  ForecastSpendingParams,
  ForecastSpendingResponse,
} from '@/lib/types/budget-forecasting';

class BudgetForecastingApiService {
  private readonly basePath = '/budgets/envelopes/forecast';

  /**
   * Get spending forecast for an envelope
   */
  async getEnvelopeForecast(
    envelopeId: string,
    params: GetEnvelopeForecastParams = {}
  ): Promise<GetEnvelopeForecastResponse> {
    const searchParams = new URLSearchParams();

    if (params.daysAhead) {
      searchParams.set('daysAhead', params.daysAhead.toString());
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/envelope/${envelopeId}`, { params: searchParams });
  }

  /**
   * Get spending forecast for a budget
   */
  async getBudgetForecast(
    budgetId: string,
    params: GetBudgetForecastParams = {}
  ): Promise<GetBudgetForecastResponse> {
    const searchParams = new URLSearchParams();

    if (params.daysAhead) {
      searchParams.set('daysAhead', params.daysAhead.toString());
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/budget/${budgetId}`, { params: searchParams });
  }

  /**
   * Get detailed spending insights for an envelope
   */
  async getSpendingInsights(
    envelopeId: string,
    organizationId?: string
  ): Promise<GetSpendingInsightsResponse> {
    const searchParams = new URLSearchParams();

    if (organizationId) {
      searchParams.set('organizationId', organizationId);
    }

    return apiClient.get(`${this.basePath}/insights/${envelopeId}`, { params: searchParams });
  }

  /**
   * Trigger forecast spending calculation (for caching/refreshing)
   */
  async forecastSpending(params: ForecastSpendingParams): Promise<ForecastSpendingResponse> {
    const searchParams = new URLSearchParams();

    if (params.envelopeId) {
      searchParams.set('envelopeId', params.envelopeId);
    }
    if (params.daysAhead) {
      searchParams.set('daysAhead', params.daysAhead.toString());
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.post(`${this.basePath}/calculate`, {
      envelopeId: params.envelopeId,
      daysAhead: params.daysAhead,
      organizationId: params.organizationId,
    });
  }
}

export const budgetForecastingApi = new BudgetForecastingApiService();
