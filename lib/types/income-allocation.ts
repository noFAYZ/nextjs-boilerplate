/**
 * Income Allocation Types
 * Handles AI-powered income distribution across envelopes
 */

export type AllocationTemplate = '50-30-20' | 'ynab' | 'envelope' | 'custom';

export interface AllocationSuggestion {
  suggestionId: string;
  envelopeId: string;
  envelopeName: string;
  suggestedAmount: number;
  percentage: number;
  confidence: number; // 0-1 (0% - 100%)
  reasoning: string;
  alternativeSuggestions?: Array<{
    amount: number;
    percentage: number;
    reasoning: string;
  }>;
}

export interface GetIncomeAllocationSuggestionsParams {
  incomeAmount: number;
  templateType?: AllocationTemplate;
  organizationId?: string;
}

export interface GetIncomeAllocationSuggestionsResponse {
  success: boolean;
  data: {
    incomeAmount: number;
    suggestions: AllocationSuggestion[];
    templateType: AllocationTemplate;
    totalAllocated: number;
  };
  timestamp: string;
}

export interface AllocationInput {
  envelopeId: string;
  amount: number;
  suggestion?: boolean;
}

export interface AllocateIncomeRequest {
  incomeAmount: number;
  allocations: AllocationInput[];
}

export interface AllocationResult {
  envelopeId: string;
  previousBalance: number;
  allocatedAmount: number;
  newBalance: number;
}

export interface AllocateIncomeResponse {
  success: boolean;
  data: {
    incomeAllocationId: string;
    incomeAmount: number;
    totalAllocated: number;
    allocations: AllocationResult[];
    timestamp: string;
  };
}

export interface IncomeAllocationHistoryItem {
  id: string;
  incomeAmount: number;
  totalAllocated: number;
  allocations: Array<{
    envelopeId: string;
    amount: number;
  }>;
  timestamp: string;
}

export interface GetIncomeAllocationHistoryParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  organizationId?: string;
}

export interface GetIncomeAllocationHistoryResponse {
  success: boolean;
  data: {
    allocations: IncomeAllocationHistoryItem[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}

export interface AllocationRecommendation {
  recommendationId: string;
  title: string;
  description: string;
  suggestedChange?: {
    fromEnvelope: string;
    toEnvelope: string;
    amount: number;
  };
  impact: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface GetIncomeRecommendationsParams {
  period?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  organizationId?: string;
}

export interface GetIncomeRecommendationsResponse {
  success: boolean;
  data: {
    recommendations: AllocationRecommendation[];
    overallHealthScore: number;
    nextReviewDate: string;
  };
}

export interface AllocationFeedback {
  allocationId: string;
  feedback: 'helpful' | 'unhelpful' | 'partial';
  rating: number; // 1-5
  comment?: string;
}

export type RecordAllocationFeedbackRequest = AllocationFeedback;

export interface RecordAllocationFeedbackResponse {
  success: boolean;
  data: {
    feedbackId: string;
    received: boolean;
    timestamp: string;
  };
}
