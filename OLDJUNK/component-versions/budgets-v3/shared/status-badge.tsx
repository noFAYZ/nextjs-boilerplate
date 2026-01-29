'use client';

/**
 * Status Badge Component
 * Flexible status indicator for different statuses
 */

import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Info,
  Zap,
} from 'lucide-react';

type StatusType = 'success' | 'warning' | 'error' | 'pending' | 'info' | 'active';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  success: {
    color: 'bg-green-500',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Success',
  },
  warning: {
    color: 'bg-yellow-500',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Warning',
  },
  error: {
    color: 'bg-red-500',
    icon: <XCircle className="h-4 w-4" />,
    label: 'Error',
  },
  pending: {
    color: 'bg-gray-500',
    icon: <Clock className="h-4 w-4" />,
    label: 'Pending',
  },
  info: {
    color: 'bg-blue-500',
    icon: <Info className="h-4 w-4" />,
    label: 'Info',
  },
  active: {
    color: 'bg-purple-500',
    icon: <Zap className="h-4 w-4" />,
    label: 'Active',
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const paddingClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <Badge className={`${config.color} text-white ${paddingClass[size]} flex items-center gap-1.5`}>
      {showIcon && config.icon}
      {label}
    </Badge>
  );
}

/**
 * Status Indicator Dot
 */
interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  animated?: boolean;
}

export function StatusIndicator({
  status,
  label,
  animated = true,
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${config.color} ${
          animated ? 'animate-pulse' : ''
        }`}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
