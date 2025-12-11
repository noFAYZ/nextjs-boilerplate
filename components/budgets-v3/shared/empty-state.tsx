'use client';

/**
 * Empty State Component
 * Shows helpful message when no data is available
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InboxIcon, Plus, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'error' | 'no-data';
}

const getIcon = (variant: string, defaultIcon?: React.ReactNode) => {
  if (defaultIcon) return defaultIcon;
  if (variant === 'error') return <AlertCircle className="h-12 w-12 text-red-500" />;
  return <InboxIcon className="h-12 w-12 text-muted-foreground" />;
};

const getBackground = (variant: string): string => {
  if (variant === 'error') return 'bg-red-50';
  return 'bg-secondary/30';
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <Card className={getBackground(variant)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4">{getIcon(variant, icon)}</div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>

        {actionLabel && onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
