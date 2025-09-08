export type OperationStatus = 'pending' | 'processing' | 'success' | 'error' | 'cancelled';

export interface OperationItem {
  id: string;
  name: string;
  status: OperationStatus;
  error?: string;
  progress?: number; // 0-100 for individual item progress
}

export interface ProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OperationItem[];
  onConfirm: (itemIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  destructive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBgColor?: string;
}

export interface ProgressOperationResult {
  success: string[];
  failed: string[];
  cancelled?: string[];
}

export type ProgressCallback = (itemId: string, status: OperationStatus, error?: string) => void;

// Pre-configured operation types for common use cases
export interface DeleteOperationConfig {
  type: 'delete';
  title: string;
  description: string;
  confirmButtonText: string;
  warningMessage: string;
}

export interface SyncOperationConfig {
  type: 'sync';
  title: string;
  description: string;
  confirmButtonText: string;
  progressMessage: string;
}

export interface BulkOperationConfig {
  type: 'bulk';
  title: string;
  description: string;
  confirmButtonText: string;
  processingMessage: string;
}

export type OperationConfig = DeleteOperationConfig | SyncOperationConfig | BulkOperationConfig;

// Helper functions
export const createOperationItem = (
  id: string, 
  name: string, 
  status: OperationStatus = 'pending'
): OperationItem => ({
  id,
  name,
  status
});

export const getStatusIcon = (status: OperationStatus) => {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'processing':
      return 'processing';
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'cancelled':
      return 'cancelled';
  }
};

export const getStatusColor = (status: OperationStatus) => {
  switch (status) {
    case 'pending':
      return 'text-muted-foreground';
    case 'processing':
      return 'text-blue-600';
    case 'success':
      return 'text-green-600';
    case 'error':
      return 'text-red-600';
    case 'cancelled':
      return 'text-orange-600';
  }
};

export const getStatusBadgeVariant = (status: OperationStatus) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'outline';
    case 'success':
      return 'outline';
    case 'error':
      return 'destructive';
    case 'cancelled':
      return 'secondary';
  }
};

export const getStatusText = (status: OperationStatus) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing...';
    case 'success':
      return 'Success';
    case 'error':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
  }
};