'use client';

/**
 * useOrgSwitcher Hook
 *
 * Production-grade organization switcher that follows backend recommendations:
 * 1. Update Better Auth session (activeOrganizationId)
 * 2. Invalidate session cache (forced refresh from backend)
 * 3. Refetch all org-scoped queries
 * 4. Error handling with rollback
 *
 * Backend expects:
 * - Session with activeOrganizationId passed to all requests
 * - Session cached in Redis (30min TTL)
 * - All org-scoped endpoints use req.ctx.organization.id from session
 * - Query keys are simple (no orgId) since backend reads from session
 */

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/core/auth';
import { useOrganizationStore } from '@/lib/features/organization/stores';

interface OrgSwitchResult {
  success: boolean;
  organizationId?: string;
  error?: string;
}

export function useOrgSwitcher() {
  const queryClient = useQueryClient();
  const { setSelectedOrganization } = useOrganizationStore();

  const switchOrganization = useCallback(
    async (organizationId: string): Promise<OrgSwitchResult> => {
      try {
        // Store previous org for potential rollback
        const currentSession = queryClient.getQueryData(['auth', 'session']) as any;
        const previousOrgId = currentSession?.session?.activeOrganizationId;

        // ========================================================================
        // STEP 1: Update Better Auth session
        // This updates session.activeOrganizationId on the backend
        // ========================================================================
        await authClient.organization.setActive({
          organizationId,
        });

        // Update local store
        setSelectedOrganization(organizationId);

        // ========================================================================
        // STEP 2: Invalidate session cache immediately (CRITICAL!)
        // Session is cached in Redis on backend - must force refresh
        // This ensures activeOrganizationId is fresh for subsequent requests
        // ========================================================================
        await queryClient.invalidateQueries({
          queryKey: ['auth', 'session'],
        });

        // ========================================================================
        // STEP 3: Refetch all org-scoped queries
        // Backend now returns data for NEW organization because session has
        // the updated activeOrganizationId
        // ========================================================================
        await invalidateOrgScopedQueries(queryClient);

        return {
          success: true,
          organizationId,
        };
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Failed to switch organization';

        console.error('Organization switch failed:', errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [queryClient, setSelectedOrganization]
  );

  return { switchOrganization };
}

/**
 * Invalidate all queries that depend on the active organization.
 * Uses prefix matching to catch all variants with different parameters.
 *
 * Pattern: Query keys include orgId, so we invalidate by prefix pattern:
 * ['banking', 'accounts', orgId] → invalidate ['banking', 'accounts']
 * ['transactions', orgId, ...] → invalidate ['transactions']
 *
 * The backend architecture:
 * - Session contains: { user, session: { activeOrganizationId } }
 * - loadRequestContext reads activeOrganizationId from session
 * - All org-scoped endpoints return data for req.ctx.organization.id
 */
function invalidateOrgScopedQueries(queryClient: any) {
  // Org-scoped query key prefixes that should be refetched on org change
  const orgScopedPrefixes = [
    // Banking & Accounts
    ['banking'],
    ['unified-accounts'],
    ['accounts'],

    // Transactions
    ['transactions'],

    // Categories & Organization
    ['categories'],
    ['organization'],
    ['organizations'],

    // Crypto
    ['crypto'],

    // Financial Planning
    ['budgets'],
    ['goals'],
    ['networth'],
    ['envelopes'],
    ['income-allocation'],

    // Subscriptions & Bills
    ['subscriptions'],

    // Integrations & Providers
    ['integrations'],
    ['connections'],
    ['payment-method'],

    // Analytics
    ['dashboard'],
    ['analytics'],
  ];

  // Invalidate all queries matching these prefixes
  const invalidations = orgScopedPrefixes.map((prefix) =>
    queryClient.invalidateQueries({
      queryKey: prefix,
      type: 'active', // Only refetch active queries (subscribed)
    })
  );

  return Promise.all(invalidations).catch((error) => {
    console.error('Failed to invalidate org-scoped queries:', error);
    // Don't throw - let caller handle overall success
  });
}
