/**
 * Budget Forecasting Types
 * Handles spending predictions and budget projections
 */

export type SpendingTrend = 'increasing' | 'stable' | 'decreasing';

export interface HistoricalDataPoint {
  date: string;
  amount: number;
}

export interface ProjectedDataPoint {
  date: string;
  amount: number;
  upperBound: number;
  lowerBound: number;
}

export interface GetEnvelopeForecastParams {
  daysAhead?: number;
  organizationId?: string;
}

export interface EnvelopeForecast {
  envelopeId: string;
  envelopeName: string;
  currentSpent: number;
  allocatedAmount: number;
  forecastedSpend: number;
  forecastedRemaining: number;
  confidence: number; // 0-1 (0% - 100%)
  trend: SpendingTrend;
  daysAnalyzed: number;
  projectedExceededDate?: string; // ISO date if projected to exceed
  recommendations: string[];
  historical: HistoricalDataPoint[];
  projected: ProjectedDataPoint[];
}

export interface GetEnvelopeForecastResponse {
  success: boolean;
  data: EnvelopeForecast;
  timestamp: string;
}

export interface BudgetForecastEnvelope {
  envelopeId: string;
  envelopeName: string;
  forecastedSpend: number;
  confidence: number;
}

export interface GetBudgetForecastParams {
  daysAhead?: number;
  organizationId?: string;
}

export interface BudgetForecast {
  budgetId: string;
  totalAllocated: number;
  totalCurrentSpend: number;
  totalForecastedSpend: number;
  aggregateConfidence: number;
  envelopes: BudgetForecastEnvelope[];
  budgetProjection: {
    willExceed: boolean;
    projectedExceedanceDate?: string;
    recommendedAction: string;
  };
}

export interface GetBudgetForecastResponse {
  success: boolean;
  data: BudgetForecast;
  timestamp: string;
}

export interface SpendingInsight {
  insight: string;
}

export interface TopSpendingDay {
  date: string;
  amount: number;
}

export interface SpendingInsights {
  envelopeId: string;
  insights: SpendingInsight[];
  topSpendingDays: TopSpendingDay[];
  averageTransaction: number;
  largestTransaction: number;
  transactionFrequency: number; // transactions per day
}

export interface GetSpendingInsightsResponse {
  success: boolean;
  data: SpendingInsights;
  timestamp: string;
}

export interface ForecastSpendingParams {
  envelopeId: string;
  daysAhead?: number;
  organizationId?: string;
}

export interface ForecastSpendingResponse {
  success: boolean;
  data: {
    envelopeId: string;
    forecast: EnvelopeForecast;
    insights: SpendingInsights;
  };
  timestamp: string;
}

// Combined type for use in components
export interface EnvelopeForecastWithInsights extends EnvelopeForecast {
  insights: SpendingInsights;
}
