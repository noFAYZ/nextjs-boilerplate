/**
 * Custom hook for fetching and managing portfolio chart data
 */

import { useEffect, useState, useCallback } from 'react';
import { zerionChartService } from '@/lib/features/crypto/services';
import { formatDateByPeriod } from './portfolio-chart-utils';

export interface ChartDataPoint {
  timestamp?: number;
  date?: string;
  value?: number;
  totalNetWorth?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  formattedDate?: string;
}

export type TimePeriod = '1D' | '7D' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface UsePortfolioDataOptions {
  walletAddress?: string;
  period: TimePeriod;
  enabled?: boolean;
}

interface UsePortfolioDataReturn {
  data: ChartDataPoint[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePortfolioData({
  walletAddress,
  period,
  enabled = true,
}: UsePortfolioDataOptions): UsePortfolioDataReturn {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!walletAddress || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const chartData = await zerionChartService.getPortfolioTimeline({
        address: walletAddress,
        period,
        currency: 'usd',
      });

      const transformed: ChartDataPoint[] = (chartData as Array<Record<string, unknown>>).map(
        (point) => ({
          ...point,
          value: point.value as number,
          formattedDate: formatDateByPeriod(
            new Date(point.date as string),
            period
          ),
        })
      );

      setData(transformed);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load chart data');
      console.error('Failed to load chart data:', error);
      setError(error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, period, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
