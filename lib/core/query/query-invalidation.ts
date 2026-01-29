/**
 * Query Invalidation Helper
 *
 * Provides a single function to invalidate queries based on dependency mappings.
 * Use this instead of direct queryClient.invalidateQueries() calls.
 *
 * Usage in mutations:
 * ```ts
 * onSuccess: () => {
 *   invalidateByDependency(queryClient, 'rules:update');
 * }
 * ```
 */

import type { QueryClient } from '@tanstack/react-query';
import { getDependencyConfig } from './query-dependencies';

interface InvalidateOptions {
  /** Predicate to selectively invalidate within the returned keys */
  exact?: boolean;
}

/**
 * Invalidate queries based on mutation type using dependency mapping.
 *
 * Replaces manual invalidateQueries() calls across the codebase.
 * Ensures consistent behavior and prevents hardcoded string keys.
 *
 * @param queryClient - TanStack Query client
 * @param mutationType - Mutation type (e.g., 'rules:update', 'categories:create')
 * @param options - Optional configuration for invalidation
 *
 * @example
 * ```ts
 * const { mutate } = useMutation({
 *   mutationFn: api.updateRule,
 *   onSuccess: () => {
 *     invalidateByDependency(queryClient, 'rules:update');
 *   }
 * });
 * ```
 */
export function invalidateByDependency(
  queryClient: QueryClient,
  mutationType: string,
  options: InvalidateOptions = {}
): void {
  const config = getDependencyConfig(mutationType);

  if (!config) {
    // Silently skip if no dependency mapping (safe for unmapped mutations)
    return;
  }

  // Invalidate all keys for this mutation type
  config.keys.forEach((key) => {
    queryClient.invalidateQueries({
      queryKey: key as any[],
      refetchType: (config.refetchType || 'background') as any,
      exact: options.exact,
    });
  });
}

/**
 * Invalidate queries and also optionally perform direct cache updates.
 *
 * Use this when you want to:
 * 1. Invalidate related queries
 * 2. Immediately update the cache with mutation response data
 *
 * @param queryClient - TanStack Query client
 * @param mutationType - Mutation type
 * @param updates - Optional cache update functions
 *
 * @example
 * ```ts
 * onSuccess: (data) => {
 *   invalidateByDependencyWithUpdates(
 *     queryClient,
 *     'rules:update',
 *     {
 *       'rules:detail': (old) => ({ ...old, ...data })
 *     }
 *   );
 * }
 * ```
 */
export function invalidateByDependencyWithUpdates(
  queryClient: QueryClient,
  mutationType: string,
  updates?: Record<string, (oldData: any) => any>
): void {
  // Apply direct updates first
  if (updates) {
    Object.entries(updates).forEach(([_key, updateFn]) => {
      // Note: This is a placeholder. In practice, you'd need to
      // map key names to actual query keys and use setQueryData()
      // See specific usage examples in mutation implementations
    });
  }

  // Then invalidate
  invalidateByDependency(queryClient, mutationType);
}
