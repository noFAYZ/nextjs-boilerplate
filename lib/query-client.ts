import { QueryClient } from '@tanstack/react-query';

/**
 * Optimized React Query client configuration for production
 *
 * Key optimizations:
 * - Extended cache duration for better performance
 * - Reduced retry attempts to minimize unnecessary traffic
 * - Disabled refetchOnMount to use cached data
 * - Disabled refetchOnReconnect to prevent duplicate fetches
 * - Offline-first network mode for better UX
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - increased for better caching
      retry: (failureCount, error: { response?: { status?: number } }) => {
        // Don't retry auth errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Don't retry 4xx client errors
        if (error?.response?.status && error.response.status >= 400 && error.response.status < 500) {
          return false;
        }
        // Only retry once for 5xx server errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect (prevents duplicate calls)
      refetchOnMount: false, // Use cached data instead of refetching on mount
      networkMode: 'offlineFirst' as const, // Serve from cache when offline
    },
    mutations: {
      retry: false,
      onError: (error: unknown) => {
        // Global error handling for mutations
        console.error('Mutation error:', error);
      },
    },
  },
});

export default queryClient;