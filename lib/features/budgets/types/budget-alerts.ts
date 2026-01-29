/**
 * Budget Alerts Types
 * Handles budget threshold monitoring and alert management
 */

export type BudgetAlertType = 'WARNING_50' | 'WARNING_75' | 'WARNING_90' | 'EXCEEDED' | 'CUSTOM';
export type AlertStatus = 'PENDING' | 'SENT' | 'FAILED' | 'DISMISSED';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BudgetAlert {
  id: string;
  budgetId: string;
  budgetName?: string;
  type: BudgetAlertType;
  status: AlertStatus;
  severity: AlertSeverity;
  title: string;
  message: string;
  threshold: number; // percentage
  currentAmount: number;
  budgetAmount: number;
  metadata?: Record<string, unknown>;
  sentAt?: string;
  dismissedAt?: string;
  retryCount: number;
  failureReason?: string;
  createdAt: string;
}

export interface ProcessBudgetAlertsResponse {
  success: boolean;
  data: {
    processed: number;
    alertsCreated: number;
    alertsFailures: number;
    timestamp: string;
  };
}

export interface GetPendingAlertsParams {
  limit?: number;
  severity?: AlertSeverity;
  organizationId?: string;
}

export interface GetPendingAlertsResponse {
  success: boolean;
  data: {
    alerts: BudgetAlert[];
    pagination: {
      total: number;
      limit: number;
    };
  };
  timestamp: string;
}

export interface DismissAlertRequest {
  alertId: string;
  organizationId?: string;
}

export interface DismissAlertResponse {
  success: boolean;
  data: {
    alertId: string;
    status: AlertStatus;
    dismissedAt: string;
  };
}

export interface GetAlertHistoryParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  status?: AlertStatus;
  organizationId?: string;
}

export interface GetAlertHistoryResponse {
  success: boolean;
  data: {
    alerts: BudgetAlert[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
  timestamp: string;
}
