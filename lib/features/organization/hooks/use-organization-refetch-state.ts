/**
 * Hook to access organization refetch loading state
 *
 * Use in components to show loading indicators when organization data is being refetched
 *
 * Example:
 * ```ts
 * const { isRefetching } = useOrganizationRefetchState();
 *
 * if (isRefetching) {
 *   return <LoadingSpinner />;
 * }
 * ```
 */

import { useOrganizationRefetchStore } from '@/lib/stores/organization-refetch-store';

export function useOrganizationRefetchState() {
  const isRefetching = useOrganizationRefetchStore((state) => state.isRefetching);
  const refetchingToOrgId = useOrganizationRefetchStore((state) => state.refetchingToOrgId);

  return {
    isRefetching,
    refetchingToOrgId,
  };
}
