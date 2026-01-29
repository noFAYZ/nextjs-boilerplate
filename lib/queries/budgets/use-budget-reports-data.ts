/**
 * Budget Reports Data Hooks
 * Consumer hooks for report generation and export features
 */

import { useMutation } from '@tanstack/react-query';
import {
  budgetReportsMutations,
  downloadBlob,
} from './budget-reports-queries';
import { useAuthStore } from '@/lib/stores/auth-store';

/**
 * Generate envelope report as CSV
 */
export function useGenerateEnvelopeReportCSV() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    ...budgetReportsMutations.generateEnvelopeReportCSV,
    onSuccess: (data) => {
      // Download the blob
      const filename = `envelope-report-${new Date().toISOString().split('T')[0]}.csv`;
      downloadBlob(data as Blob, filename);
    },
  });
}

/**
 * Generate transaction report as CSV
 */
export function useGenerateTransactionReportCSV() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    ...budgetReportsMutations.generateTransactionReportCSV,
    onSuccess: (data) => {
      // Download the blob
      const filename = `transaction-report-${new Date().toISOString().split('T')[0]}.csv`;
      downloadBlob(data as Blob, filename);
    },
  });
}

/**
 * Generate analytics report as JSON
 */
export function useGenerateAnalyticsReportJSON() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    ...budgetReportsMutations.generateAnalyticsReportJSON,
    onSuccess: (data) => {
      // Download the blob
      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      downloadBlob(data as Blob, filename);
    },
  });
}

/**
 * Generate budget comparison report as JSON
 */
export function useGenerateBudgetComparisonReport() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    ...budgetReportsMutations.generateBudgetComparisonReport,
    onSuccess: (data) => {
      // Download the blob
      const filename = `budget-comparison-${new Date().toISOString().split('T')[0]}.json`;
      downloadBlob(data as Blob, filename);
    },
  });
}

/**
 * Generate monthly summary report as JSON
 */
export function useGenerateMonthlySummaryReport() {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    ...budgetReportsMutations.generateMonthlySummaryReport,
    onSuccess: (data) => {
      // Download the blob
      const filename = `monthly-summary-${new Date().toISOString().split('T')[0]}.json`;
      downloadBlob(data as Blob, filename);
    },
  });
}
