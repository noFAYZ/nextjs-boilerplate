// User Subscriptions Module Type Definitions

export interface UserSubscription {
  userId: string;
  planId: string;
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  features: string[];
}

export interface SubscriptionHistory {
  planId: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface FeatureAccess {
  [key: string]: {
    enabled: boolean;
    used?: number;
    limit?: number;
    percentage?: number;
  };
}

export interface UsageQuota {
  [key: string]: {
    used: number;
    limit: number | string;
    percentage: number;
  };
}

export interface CurrentPlanResponse {
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  features: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
