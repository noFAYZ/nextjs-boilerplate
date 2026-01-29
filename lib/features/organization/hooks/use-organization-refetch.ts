'use client';

/**
 * useOrganizationRefetch Hook
 *
 * Production-grade hook that refetches all org-scoped queries
 * when organization changes. Works with better-auth org switching.
 *
 * Usage:
 *   useOrganizationRefetch(); // Add to any component or provider
 *
 * This hook:
 * 1. Watches organization selection changes
 * 2. Removes all old org cache
 * 3. Force refetches all new org queries
 * 4. Is safe with inconsistent query key structures
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { useOrganizationRefetchStore } from '@/lib/stores/organization-refetch-store';

/**
 * List of query patterns that are organization-scoped.
 * Any query key containing these strings will be refetched on org change.
 *
 * These patterns match the query key factories in:
 * - banking-queries.ts: ['banking', ...]
 * - transactions-queries.ts: ['transactions', ...]
 * - accounts-queries.ts: ['accounts', ...] | ['unified-accounts', ...]
 * - crypto-queries.ts: ['crypto', ...]
 * - And all other org-dependent queries
 */
const ORG_SCOPED_PATTERNS = [
  // Banking & Accounts
  'banking',
  'accounts',
  'unified-accounts',
  'connections',

  // Transactions
  'transactions',

  // Crypto
  'crypto',

  // Categories & Organization
  'categories',
  'organization',
  'organizations',

  // Financial Planning
  'budgets',
  'goals',
  'networth',
  'envelopes',
  'income-allocation',

  // Integrations & Providers
  'integrations',
  'payment-method',

  // Analytics
  'dashboard',
  'analytics',
];

/**
 * List of query patterns that are GLOBAL (NOT org-scoped).
 * These will NOT be removed on org change.
 *
 * Global queries persist across org switches because they're not
 * dependent on the active organization.
 */
const GLOBAL_PATTERNS = [
  'auth',
  'currency',
  'subscription',
  'billing-subscription',
  'settings',
  'categorization-rules',
  'transaction-categories',
  'waitlist',
  'user',
  'session',
];

export function useOrganizationRefetch() {
  const queryClient = useQueryClient();
  const selectedOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  const { startRefetch, completeRefetch } = useOrganizationRefetchStore();
  const prevOrgIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if org hasn't changed
    if (prevOrgIdRef.current === selectedOrgId) return;

    const previousOrgId = prevOrgIdRef.current;
    prevOrgIdRef.current = selectedOrgId;

    // Skip on first render
    if (previousOrgId === null && selectedOrgId === null) return;

    // Skip initial load (null → first org) - don't show overlay
    if (previousOrgId === null && selectedOrgId !== null) return;

    // Only process actual org-to-org switches
    if (!previousOrgId || !selectedOrgId || previousOrgId === selectedOrgId) return;

    // Start refetch overlay
    startRefetch(selectedOrgId);

    // ========================================================================
    // STEP 1: Remove all old org-scoped queries
    // ========================================================================
    queryClient.removeQueries({
      predicate: (query) => {
        const key = query.queryKey;
        if (!Array.isArray(key)) return false;

        // Don't remove global queries
        const keyStr = JSON.stringify(key);
        if (GLOBAL_PATTERNS.some((pattern) => keyStr.includes(pattern))) {
          return false;
        }

        // Remove if key contains previous org ID
        return key.includes(previousOrgId);
      },
    });

    // ========================================================================
    // STEP 2: Force refetch all new org-scoped queries
    // ========================================================================
    const refetchPromises: Promise<any>[] = [];

    // Find all queries and refetch those matching new org
    const allQueries = queryClient.getQueryCache().findAll();
    allQueries.forEach((query) => {
      const key = query.queryKey;
      if (!Array.isArray(key)) return;

      const keyStr = JSON.stringify(key);

      // Check if it's org-scoped (matches one of our patterns)
      const isOrgScoped = ORG_SCOPED_PATTERNS.some((pattern) => keyStr.includes(pattern));
      if (!isOrgScoped) return;

      // Check if it contains the new org ID
      if (!key.includes(selectedOrgId)) return;

      // Refetch this query
      refetchPromises.push(
        queryClient.refetchQueries({
          queryKey: key,
          type: 'active',
        })
      );
    });

    // ========================================================================
    // STEP 3: Close overlay when critical queries finish
    // ========================================================================
    if (refetchPromises.length === 0) {
      completeRefetch();
    } else {
      // Wait for all refetches, then complete overlay
      Promise.allSettled(refetchPromises)
        .then(() => {
          completeRefetch();
        })
        .catch(() => {
          // Even on error, close overlay
          completeRefetch();
        });
    }
  }, [selectedOrgId, queryClient]);
}
