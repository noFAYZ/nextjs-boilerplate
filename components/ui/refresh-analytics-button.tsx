'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankingApi } from '@/lib/services/banking-api';
import { bankingKeys } from '@/lib/queries/banking-queries';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RefreshAnalyticsButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
  onRefreshComplete?: () => void;
}

export function RefreshAnalyticsButton({
  variant = 'ghost',
  size = 'sm',
  className,
  showText = false,
  onRefreshComplete,
}: RefreshAnalyticsButtonProps) {
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(false);

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await bankingApi.refreshAnalytics();
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to refresh analytics');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate all analytics queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: [...bankingKeys.all, 'analytics'] });

      // Also invalidate legacy analytics queries
      queryClient.invalidateQueries({ queryKey: bankingKeys.spendingCategories() });
      queryClient.invalidateQueries({ queryKey: bankingKeys.monthlyTrend() });

      // Trigger animation completion
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        onRefreshComplete?.();
      }, 1000);
    },
    onError: (error) => {
      console.error('Failed to refresh analytics:', error);
      setIsAnimating(false);
    },
  });

  const handleRefresh = () => {
    setIsAnimating(true);
    refreshMutation.mutate();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={refreshMutation.isPending}
      className={cn('gap-2', className)}
      title="Refresh analytics data"
    >
      <RefreshCw
        className={cn(
          'h-4 w-4',
          (refreshMutation.isPending || isAnimating) && 'animate-spin'
        )}
      />
      {showText && (
        <span className="text-xs">
          {refreshMutation.isPending ? 'Refreshing...' : 'Refresh'}
        </span>
      )}
    </Button>
  );
}
