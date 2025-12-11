/**
 * Budget Reports Query Factories
 * Defines query keys and options for TanStack Query
 */

import { useMutation } from '@tanstack/react-query';
import { budgetReportsApi } from '@/lib/services/budget-reports-api';
import type { ReportFilters } from '@/lib/types/budget-reports';

/**
 * Query key factory for budget reports queries
 */
export const budgetReportsKeys = {
  all: ['budget-reports'] as const,
  envelopeCSV: () => [...budgetReportsKeys.all, 'envelope-csv'] as const,
  transactionCSV: (filters?: ReportFilters) =>
    [...budgetReportsKeys.all, 'transaction-csv', filters] as const,
  analyticsJSON: () => [...budgetReportsKeys.all, 'analytics-json'] as const,
  budgetComparisonJSON: () =>
    [...budgetReportsKeys.all, 'budget-comparison-json'] as const,
  monthlySummaryJSON: (monthsBack?: number) =>
    [...budgetReportsKeys.all, 'monthly-summary-json', monthsBack] as const,
} as const;

/**
 * Mutation factory for budget reports mutations
 * Reports are primarily mutations since they generate files
 */
export const budgetReportsMutations = {
  generateEnvelopeReportCSV: {
    mutationFn: budgetReportsApi.generateEnvelopeReportCSV.bind(budgetReportsApi),
  },
  generateTransactionReportCSV: {
    mutationFn: budgetReportsApi.generateTransactionReportCSV.bind(budgetReportsApi),
  },
  generateAnalyticsReportJSON: {
    mutationFn: budgetReportsApi.generateAnalyticsReportJSON.bind(budgetReportsApi),
  },
  generateBudgetComparisonReport: {
    mutationFn: budgetReportsApi.generateBudgetComparisonReport.bind(budgetReportsApi),
  },
  generateMonthlySummaryReport: {
    mutationFn: budgetReportsApi.generateMonthlySummaryReport.bind(budgetReportsApi),
  },
} as const;

/**
 * Helper function to download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
