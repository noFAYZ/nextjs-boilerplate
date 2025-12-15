/**
 * Category Matching Types
 * Handles transaction-to-envelope suggestions and merchant matching
 */

export type MatchType = 'primary_category' | 'secondary_category' | 'merchant_pattern' | 'behavioral' | 'mapping_rule' | 'fallback';

export interface EnvelopeSuggestion {
  envelopeId: string;
  envelopeName: string;
  confidence: number; // 0-1 (0% - 100%)
  matchType: MatchType;
  reasoning: string;
  score: number; // 0-100
}

export interface GetEnvelopeSuggestionsParams {
  transactionId: string;
  organizationId?: string;
}

export interface GetEnvelopeSuggestionsResponse {
  success: boolean;
  data: {
    transactionId: string;
    suggestions: EnvelopeSuggestion[];
    recommendedEnvelopeId: string;
  };
  timestamp: string;
}

export interface CategorySuggestion {
  categoryId: string;
  categoryName: string;
  confidence: number;
  matchType: MatchType;
}

export interface GetCategorySuggestionsParams {
  merchantName: string;
  amount: number;
  organizationId?: string;
}

export interface GetCategorySuggestionsResponse {
  success: boolean;
  data: {
    merchantName: string;
    amount: number;
    suggestions: CategorySuggestion[];
  };
  timestamp: string;
}

export interface MerchantMatch {
  envelopeId: string;
  envelopeName: string;
  matchCount: number;
  lastMatched: string;
  percentage: number; // percentage of times this merchant was matched to this envelope
}

export interface GetMerchantMatchesParams {
  merchantName: string;
  organizationId?: string;
}

export interface GetMerchantMatchesResponse {
  success: boolean;
  data: {
    merchantName: string;
    matches: MerchantMatch[];
    recommendedEnvelopeId: string;
  };
  timestamp: string;
}

export interface BulkSuggestion {
  transactionId: string;
  recommendedEnvelopeId: string;
  confidence: number;
}

export interface GetBulkSuggestionsRequest {
  transactionIds: string[];
  organizationId?: string;
}

export interface GetBulkSuggestionsResponse {
  success: boolean;
  data: {
    suggestions: BulkSuggestion[];
    totalProcessed: number;
    averageConfidence: number;
  };
  timestamp: string;
}

export interface MappingRule {
  id: string;
  name: string;
  merchantNamePattern: string;
  amountRange?: {
    min: number;
    max: number;
  };
  targetEnvelopeId: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMappingRuleRequest {
  name: string;
  merchantNamePattern: string;
  amountRange?: {
    min: number;
    max: number;
  };
  targetEnvelopeId: string;
  priority?: number;
  isActive?: boolean;
}

export interface CreateMappingRuleResponse {
  success: boolean;
  data: MappingRule;
  timestamp: string;
}

export interface ApplyMappingRulesRequest {
  transactionId: string;
  organizationId?: string;
}

export interface ApplyMappingRulesResponse {
  success: boolean;
  data: {
    transactionId: string;
    appliedRuleId: string;
    targetEnvelopeId: string;
    allocation: {
      previousEnvelopeId?: string;
      newEnvelopeId: string;
    };
    timestamp: string;
  };
}
