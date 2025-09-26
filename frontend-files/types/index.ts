// Re-export all types for easy importing
export * from './crypto';

// ===============================
// COMMON TYPES
// ===============================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===============================
// ERROR TYPES
// ===============================

export interface AppErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
  field?: string;
  details?: Record<string, any>;
}

export class FrontendServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500,
    public field?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'FrontendServiceError';
  }
}

// ===============================
// LOADING STATES
// ===============================

export interface LoadingState {
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// ===============================
// HOOK RETURN TYPES
// ===============================

export interface BaseHookReturn extends LoadingState {
  clearError: () => void;
}

// ===============================
// FILTER AND SORT TYPES
// ===============================

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: SortOption[];
  filters?: FilterOption[];
  search?: string;
}

// ===============================
// DATE RANGE TYPES
// ===============================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateRangePreset {
  label: string;
  value: string;
  range: DateRange;
}

export type DateGranularity = 'hour' | 'day' | 'week' | 'month' | 'year';

// ===============================
// ANALYTICS TYPES
// ===============================

export interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  change?: number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage' | 'bytes';
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  size: 'small' | 'medium' | 'large';
  data: any;
  config?: Record<string, any>;
}

// ===============================
// USER PREFERENCE TYPES
// ===============================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    sharePerformanceData: boolean;
  };
}

// ===============================
// FEATURE FLAG TYPES
// ===============================

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: Record<string, any>;
}

export interface FeatureFlags {
  [key: string]: FeatureFlag;
}

// ===============================
// NOTIFICATION TYPES
// ===============================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
}

// ===============================
// BREADCRUMB TYPES
// ===============================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// ===============================
// MENU/NAVIGATION TYPES
// ===============================

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
  permission?: string;
}

// ===============================
// TABLE TYPES
// ===============================

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  format?: 'currency' | 'percentage' | 'date' | 'number';
}

export interface TableState {
  page: number;
  limit: number;
  sort?: SortOption;
  filters: Record<string, any>;
  search?: string;
  selectedRows: string[];
}

// ===============================
// FORM TYPES
// ===============================

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

// ===============================
// CHART TYPES
// ===============================

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: Record<string, any>;
  scales?: Record<string, any>;
}

// ===============================
// EXPORT/IMPORT TYPES
// ===============================

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  fields?: string[];
  filters?: Record<string, any>;
  dateRange?: DateRange;
}

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  errors?: string[];
}

// ===============================
// WEBSOCKET TYPES
// ===============================

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error?: string;
  lastMessage?: WebSocketMessage;
}

// ===============================
// CACHE TYPES
// ===============================

export interface CacheItem<T> {
  data: T;
  timestamp: Date;
  expiresAt: Date;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  strategy?: 'lru' | 'fifo';
}