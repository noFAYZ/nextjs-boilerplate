// Admin Module Type Definitions

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum MaintenanceOperation {
  OPTIMIZE_DATABASE = 'optimize_database',
  CLEAR_CACHE = 'clear_cache',
  REBUILD_INDEXES = 'rebuild_indexes',
  CLEANUP_OLD_DATA = 'cleanup_old_data',
  RESET_RATE_LIMITS = 'reset_rate_limits'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  status: string;
  createdAt: Date;
  lastLoginAt?: Date;
  walletCount: number;
  accountCount: number;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  timestamp: Date;
}

export interface SystemMetrics {
  activeUsers: number;
  totalUsers: number;
  monthlyRecurringRevenue: number;
  totalRevenue: number;
  errorRate: number;
  avgResponseTime: number;
  period: string;
}

export interface QueueStats {
  name: string;
  pending: number;
  active: number;
  delayed: number;
  failed: number;
  avgProcessTime: number;
}

export interface SystemHealth {
  status: string;
  database: string;
  redis: string;
  externalApis: string;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface SystemLog {
  id: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
}

export interface SuspendUserDTO {
  reason: string;
  duration?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export class AdminServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AdminServiceError';
  }
}

export class UnauthorizedError extends AdminServiceError {
  constructor() {
    super('Admin role required', 'UNAUTHORIZED', 403);
    this.name = 'UnauthorizedError';
  }
}

export interface DatabaseRecord {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes?: Record<string, any>;
  timestamp: Date;
}
