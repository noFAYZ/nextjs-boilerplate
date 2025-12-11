/**
 * Budget Reports API Service
 * Handles report generation and data exports
 */

import { apiClient } from '@/lib/api-client';
import type {
  ReportFilters,
  GenerateEnvelopeReportCSVResponse,
  GenerateTransactionReportCSVResponse,
  GenerateAnalyticsReportJSONResponse,
  GenerateBudgetComparisonReportResponse,
  GenerateMonthlySummaryReportResponse,
} from '@/lib/types/budget-reports';

class BudgetReportsApiService {
  private readonly basePath = '/budgets/envelopes/reports';

  /**
   * Generate CSV report of envelope spending
   */
  async generateEnvelopeReportCSV(
    organizationId?: string
  ): Promise<GenerateEnvelopeReportCSVResponse> {
    const searchParams = new URLSearchParams();

    if (organizationId) {
      searchParams.set('organizationId', organizationId);
    }

    const blob = await apiClient.get(`${this.basePath}/envelope-csv`, {
      params: searchParams,
      responseType: 'blob',
    });

    return {
      success: true,
      data: blob as unknown as Blob,
      filename: `envelope-report-${new Date().toISOString().split('T')[0]}.csv`,
    };
  }

  /**
   * Generate CSV report of transactions with filtering
   */
  async generateTransactionReportCSV(
    filters?: ReportFilters
  ): Promise<GenerateTransactionReportCSVResponse> {
    const searchParams = new URLSearchParams();

    if (filters?.startDate) {
      searchParams.set('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      searchParams.set('endDate', filters.endDate);
    }
    if (filters?.organizationId) {
      searchParams.set('organizationId', filters.organizationId);
    }
    if (filters?.envelopeIds?.length) {
      searchParams.set('envelopeIds', filters.envelopeIds.join(','));
    }

    const blob = await apiClient.get(`${this.basePath}/transactions-csv`, {
      params: searchParams,
      responseType: 'blob',
    });

    return {
      success: true,
      data: blob as unknown as Blob,
      filename: `transaction-report-${new Date().toISOString().split('T')[0]}.csv`,
    };
  }

  /**
   * Generate comprehensive analytics report in JSON format
   */
  async generateAnalyticsReportJSON(
    organizationId?: string
  ): Promise<GenerateAnalyticsReportJSONResponse> {
    const searchParams = new URLSearchParams();

    if (organizationId) {
      searchParams.set('organizationId', organizationId);
    }

    return apiClient.get(`${this.basePath}/analytics-json`, { params: searchParams });
  }

  /**
   * Generate budget comparison report
   */
  async generateBudgetComparisonReport(
    organizationId?: string
  ): Promise<GenerateBudgetComparisonReportResponse> {
    const searchParams = new URLSearchParams();

    if (organizationId) {
      searchParams.set('organizationId', organizationId);
    }

    return apiClient.get(`${this.basePath}/budget-comparison-json`, { params: searchParams });
  }

  /**
   * Generate monthly summary report
   */
  async generateMonthlySummaryReport(
    params?: { monthsBack?: number; organizationId?: string }
  ): Promise<GenerateMonthlySummaryReportResponse> {
    const searchParams = new URLSearchParams();

    if (params?.monthsBack) {
      searchParams.set('monthsBack', params.monthsBack.toString());
    }
    if (params?.organizationId) {
      searchParams.set('organizationId', params.organizationId);
    }

    return apiClient.get(`${this.basePath}/monthly-summary-json`, { params: searchParams });
  }
}

export const budgetReportsApi = new BudgetReportsApiService();
