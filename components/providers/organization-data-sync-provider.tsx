'use client';

/**
 * Organization Data Sync Provider
 *
 * Manages the loading overlay state during organization refetch.
 * The actual query refetch is handled by useOrganizationRefetch hook.
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrganizationStore } from '@/lib/features/organization/stores';
import { useOrganizationRefetchStore } from '@/lib/features/organization/stores';

export function OrganizationDataSyncProvider() {
  const queryClient = useQueryClient();
  const selectedOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  const { startRefetch, completeRefetch } = useOrganizationRefetchStore();
  const prevOrgIdRef = useRef<string | null>(null);

  // Detect organization change
  useEffect(() => {
    if (prevOrgIdRef.current === selectedOrgId) return;

    const prevOrgId = prevOrgIdRef.current;
    prevOrgIdRef.current = selectedOrgId;

    if (prevOrgId === null && selectedOrgId === null) return;
    if (prevOrgId === null && selectedOrgId !== null) return;
    if (!selectedOrgId || !prevOrgId || selectedOrgId === prevOrgId) return;

    // Start overlay
    startRefetch(selectedOrgId);
  }, [selectedOrgId]);

  // Monitor query cache for refetch completion
  useEffect(() => {
    if (!selectedOrgId) return;

    const checkInterval = setInterval(() => {
      // Find critical queries that are currently fetching
      const allQueries = queryClient.getQueryCache().findAll();
      const criticalFetching = allQueries.filter((q) => {
        const key = q.queryKey;
        if (!Array.isArray(key)) return false;

        const keyStr = JSON.stringify(key);
        const isCritical = keyStr.includes('wallets') || keyStr.includes('accounts');
        const isFetching = q.state.fetchStatus === 'fetching';

        return isCritical && isFetching;
      });

      // Close overlay when no critical queries are fetching
      if (criticalFetching.length === 0) {
        completeRefetch();
        clearInterval(checkInterval);
      }
    }, 50);

    return () => clearInterval(checkInterval);
  }, [selectedOrgId, queryClient]);

  return null;
}
