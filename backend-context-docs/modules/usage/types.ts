// Usage Module Type Definitions

export interface UsageEvent {
  id: string;
  userId: string;
  featureName: string;
  amount: number;
  timestamp: Date;
}

export interface UsageQuota {
  featureName: string;
  used: number;
  limit: number;
  percentage: number;
  periodEnd: Date;
}

export interface UsageAnalytics {
  feature: string;
  used: number;
  limit: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  periodEnd: Date;
}

export interface CheckQuotaDTO {
  featureName: string;
  amount?: number;
}

export interface CheckQuotaResponse {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
