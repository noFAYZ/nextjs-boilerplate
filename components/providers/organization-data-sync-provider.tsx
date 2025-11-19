'use client';

/**
 * Organization Data Sync Provider
 *
 * PURPOSE: Manages automatic data fetching when organization changes
 * - Watches for organization selection changes in the context store
 * - Invalidates and refetches all organization-scoped queries
 * - Handles cache cleanup when switching organizations
 *
 * BEHAVIOR:
 * 1. When user switches organization, all organization-scoped queries are invalidated
 * 2. Components using org-scoped queries (crypto, banking, budgets, etc) automatically refetch
 * 3. Previous organization's cached data is preserved for fast switching
 * 4. Loading states handled by React Query automatically
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { cryptoKeys } from '@/lib/queries/crypto-queries';
import { bankingKeys } from '@/lib/queries/banking-queries';
import { budgetKeys } from '@/lib/queries/budget-queries';
import { goalKeys } from '@/lib/queries/use-goal-data';
import { networthKeys } from '@/lib/queries/networth-queries';
import { organizationKeys } from '@/lib/queries/use-organization-data';
import { logger } from '@/lib/utils/logger';

export function OrganizationDataSyncProvider() {
  const queryClient = useQueryClient();
  const selectedOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  const previousOrgIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('[OrganizationDataSyncProvider] selectedOrgId changed:', {
      previous: previousOrgIdRef.current,
      current: selectedOrgId,
    });

    // Only process if organization has actually changed
    if (previousOrgIdRef.current === selectedOrgId) {
      console.log('[OrganizationDataSyncProvider] No change detected, skipping');
      return;
    }

    const previousOrgId = previousOrgIdRef.current;
    previousOrgIdRef.current = selectedOrgId;

    // Skip initial setup (first render when both are null)
    if (previousOrgId === null && selectedOrgId === null) {
      console.log('[OrganizationDataSyncProvider] Initial setup skip (both null)');
      return;
    }

    console.log('[OrganizationDataSyncProvider] Organization changed, invalidating queries', {
      from: previousOrgId,
      to: selectedOrgId,
    });
    logger.info('Organization changed, invalidating queries', {
      from: previousOrgId,
      to: selectedOrgId,
    });

    // Invalidate all organization-specific data queries
    // This causes them to refetch with the new organization context
    Promise.all([
      // Crypto data
      queryClient.invalidateQueries({
        queryKey: cryptoKeys.all,
        exact: false,
      }),

      // Banking data
      queryClient.invalidateQueries({
        queryKey: bankingKeys.all,
        exact: false,
      }),

      // Budget data
      queryClient.invalidateQueries({
        queryKey: budgetKeys.all,
        exact: false,
      }),

      // Goal data
      queryClient.invalidateQueries({
        queryKey: goalKeys.all,
        exact: false,
      }),

      // Net worth data
      queryClient.invalidateQueries({
        queryKey: networthKeys.all,
        exact: false,
      }),

      // Organization data (refresh members, invitations, etc)
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
        exact: false,
      }),
    ]).catch((error) => {
      logger.error('Error during query invalidation', error);
    });
  }, [selectedOrgId, queryClient]);

  return null;
}
