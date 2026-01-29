/**
 * Use Async Operation Hook
 * Manages loading, error, and success states for async operations
 */

import { useState, useCallback } from 'react';

interface UseAsyncOperationState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  success: boolean;
}

interface UseAsyncOperationReturn<T> extends UseAsyncOperationState<T> {
  execute: (fn: () => Promise<T>) => Promise<void>;
  reset: () => void;
  setError: (error: Error | null) => void;
  setData: (data: T) => void;
}

export function useAsyncOperation<T = unknown>(
  initialData: T | null = null
): UseAsyncOperationReturn<T> {
  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (fn: () => Promise<T>) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
    }));

    try {
      const result = await fn();
      setState((prev) => ({
        ...prev,
        data: result,
        isLoading: false,
        success: true,
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        error,
        isLoading: false,
        success: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      success: false,
    });
  }, [initialData]);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const setData = useCallback((data: T) => {
    setState((prev) => ({
      ...prev,
      data,
      success: true,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setError,
    setData,
  };
}

/**
 * Use Mutation Hook
 * Simpler async operation for mutations with onSuccess/onError callbacks
 */
interface UseMutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

interface UseMutationReturn<T, V> {
  mutate: (data: V) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useMutation<T = unknown, V = unknown>(
  fn: (data: V) => Promise<T>,
  options?: UseMutationOptions<T, V>
): UseMutationReturn<T, V> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (data: V) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fn(data);
        options?.onSuccess?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
      } finally {
        setIsLoading(false);
        options?.onSettled?.();
      }
    },
    [fn, options]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    reset,
  };
}
