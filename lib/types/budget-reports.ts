/**
 * Budget Reports Types
 * Handles report generation and data exports
 */

export type ReportFormat = 'csv' | 'json' | 'pdf';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  organizationId?: string;
  envelopeIds?: string[];
  budgetIds?: string[];
}

export interface EnvelopeReportItem {
  envelopeName: string;
  status: string;
  type: string;
  allocatedAmount: number;
  spentAmount: number;
  availableBalance: number;
  spendRate: number;
  transactionCount: number;
  createdDate: string;
}

export interface TransactionReportItem {
  envelope: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
}

export interface GenerateEnvelopeReportCSVResponse {
  success: boolean;
  data: Blob; // CSV file
  filename: string;
}

export interface GenerateTransactionReportCSVResponse {
  success: boolean;
  data: Blob; // CSV file
  filename: string;
}

export interface AnalyticsReportSummary {
  totalEnvelopes: number;
  totalBudgets: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  averageSpendRate: number;
  totalTransactions: number;
}

export interface AnalyticsReport {
  reportDate: string;
  userId: string;
  organizationId?: string;
  summary: AnalyticsReportSummary;
  envelopes: Array<{
    id: string;
    name: string;
    allocatedAmount: number;
    spentAmount: number;
    remainingBalance: number;
    spendRate: number;
  }>;
  budgets: Array<{
    id: string;
    name: string;
    allocatedAmount: number;
    spentAmount: number;
    remainingBalance: number;
    spendRate: number;
  }>;
  topSpenders: Array<{
    name: string;
    spent: number;
    percentage: number;
  }>;
}

export interface GenerateAnalyticsReportJSONResponse {
  success: boolean;
  data: AnalyticsReport;
}

export interface BudgetComparisonItem {
  id: string;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'on_track' | 'warning' | 'exceeded';
}

export interface BudgetComparisonSummary {
  totalBudgets: number;
  totalAmount: number;
  totalSpent: number;
  activeCount: number;
  exceededCount: number;
}

export interface BudgetComparison {
  reportDate: string;
  budgets: BudgetComparisonItem[];
  summary: BudgetComparisonSummary;
}

export interface GenerateBudgetComparisonReportResponse {
  success: boolean;
  data: BudgetComparison;
}

export interface MonthlySummaryItem {
  month: string;
  totalSpent: number;
}

export interface MonthlySummaryStatistics {
  averageMonthlySpend: number;
  highestMonth: {
    month: string;
    totalSpent: number;
  };
  lowestMonth: {
    month: string;
    totalSpent: number;
  };
}

export interface MonthlySummary {
  reportDate: string;
  monthsAnalyzed: number;
  monthlySummary: MonthlySummaryItem[];
  statistics: MonthlySummaryStatistics;
}

export interface GenerateMonthlySummaryReportResponse {
  success: boolean;
  data: MonthlySummary;
}
