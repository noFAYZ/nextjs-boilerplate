/**
 * Budget Alerts API Service
 * Handles budget threshold monitoring and alert management
 */

import { apiClient } from '@/lib/api-client';
import type {
  ProcessBudgetAlertsResponse,
  GetPendingAlertsParams,
  GetPendingAlertsResponse,
  DismissAlertRequest,
  DismissAlertResponse,
  GetAlertHistoryParams,
  GetAlertHistoryResponse,
} from '@/lib/types/budget-alerts';

class BudgetAlertsApiService {
  private readonly basePath = '/budgets/envelopes/alerts';

  /**
   * Manually trigger budget alert processing
   */
  async processBudgetAlerts(): Promise<ProcessBudgetAlertsResponse> {
    return apiClient.post(`${this.basePath}/process`, {});
  }

  /**
   * Get pending alerts
   */
  async getPendingAlerts(
    params: GetPendingAlertsParams = {}
  ): Promise<GetPendingAlertsResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.severity) {
      searchParams.set('severity', params.severity);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/pending`, { params: searchParams });
  }

  /**
   * Dismiss a specific alert
   */
  async dismissAlert(data: DismissAlertRequest): Promise<DismissAlertResponse> {
    const { alertId, organizationId } = data;
    const searchParams = new URLSearchParams();

    if (organizationId) {
      searchParams.set('organizationId', organizationId);
    }

    return apiClient.post(`${this.basePath}/${alertId}/dismiss`, {}, { params: searchParams });
  }

  /**
   * Get alert history
   */
  async getAlertHistory(
    params: GetAlertHistoryParams = {}
  ): Promise<GetAlertHistoryResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.offset) {
      searchParams.set('offset', params.offset.toString());
    }
    if (params.startDate) {
      searchParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      searchParams.set('endDate', params.endDate);
    }
    if (params.status) {
      searchParams.set('status', params.status);
    }
    if (params.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/history`, { params: searchParams });
  }
}

export const budgetAlertsApi = new BudgetAlertsApiService();
