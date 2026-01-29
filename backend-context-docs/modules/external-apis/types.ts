// External APIs Module Type Definitions

export enum ProviderStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  DOWN = 'down'
}

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export interface ProviderHealth {
  provider: string;
  status: ProviderStatus;
  responseTime: number;
  lastChecked: Date;
  requestsPerDay?: number;
  lastError?: string;
  circuitBreakerState: CircuitBreakerState;
}

export interface ExternalApiLog {
  id: string;
  provider: string;
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  errorMessage?: string;
  timestamp: Date;
}

export interface ApiRateLimit {
  provider: string;
  remainingRequests: number;
  totalRequests: number;
  resetTime: Date;
  limitPerSecond: number;
}

export interface CircuitBreaker {
  state: CircuitBreakerState;
  failureCount: number;
  failureThreshold: number;
  lastFailureTime?: Date;
  nextRetryTime?: Date;
  successCount: number;
  successThreshold: number;
}

export interface OverallHealth {
  status: ProviderStatus;
  providersHealthy: number;
  providersDegraded: number;
  providersDown: number;
  averageResponseTime: number;
  lastUpdated: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export class ExternalApiError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ExternalApiError';
  }
}
