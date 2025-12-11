/**
 * Budget Analytics Types
 * Handles financial metrics, health scoring, and analytics
 */

export type HealthRating = 'excellent' | 'good' | 'fair' | 'poor';

export interface DashboardMetrics {
  totalEnvelopes: number;
  activeEnvelopes: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  averageSpendRate: number;
  topSpendingCategory: string;
  atRiskCount: number;
  budgets: Array<{
    id: string;
    name: string;
    amount: number;
    spent: number;
  }>;
  trends: {
    weeklyTrend: 'stable' | 'increasing' | 'decreasing';
    monthlyTrend: 'stable' | 'increasing' | 'decreasing';
    yearlyTrend: 'stable' | 'increasing' | 'decreasing';
  };
}

export interface GetDashboardMetricsResponse {
  success: boolean;
  data: DashboardMetrics;
  timestamp: string;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  totalSpent: number;
  percentage: number;
  envelopeCount: number;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface GetSpendingByCategoryParams {
  limit?: number;
  organizationId?: string;
}

export interface GetSpendingByCategoryResponse {
  success: boolean;
  data: {
    breakdown: CategorySpending[];
  };
  timestamp: string;
}

export interface PeriodMetrics {
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface PeriodComparison {
  currentPeriod: PeriodMetrics;
  previousPeriod: PeriodMetrics;
  comparison: {
    spendingChange: number; // percentage change
    budgetChange: number;
    recommendation: string;
  };
}

export interface GetPeriodComparisonResponse {
  success: boolean;
  data: PeriodComparison;
  timestamp: string;
}

export interface EnvelopeRank {
  rank: number;
  envelopeId: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  spendRate: number;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface GetEnvelopeRankingParams {
  limit?: number;
  organizationId?: string;
}

export interface GetEnvelopeRankingResponse {
  success: boolean;
  data: {
    ranking: EnvelopeRank[];
  };
  timestamp: string;
}

export interface SpendingVelocity {
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface GetSpendingVelocityResponse {
  success: boolean;
  data: SpendingVelocity;
  timestamp: string;
}

export interface HealthScoreComponent {
  budgetAdherence: number; // 0-25
  spendingConsistency: number; // 0-25
  savingsRate: number; // 0-25
  riskExposure: number; // 0-25
}

export interface FinancialHealthScore {
  overallScore: number; // 0-100
  components: HealthScoreComponent;
  rating: HealthRating;
  insights: string[];
}

export interface GetFinancialHealthScoreResponse {
  success: boolean;
  data: FinancialHealthScore;
  timestamp: string;
}

// Combined analytics state type
export interface BudgetAnalyticsData {
  metrics: DashboardMetrics;
  healthScore: FinancialHealthScore;
  spendingByCategory: CategorySpending[];
  periodComparison: PeriodComparison;
  ranking: EnvelopeRank[];
  velocity: SpendingVelocity;
}
