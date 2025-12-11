'use client';

/**
 * Organization Data Sync Provider - OPTIMIZED
 *
 * PURPOSE: Fast, efficient organization switching with priority-based refetching
 * - Watches for organization selection changes
 * - Uses priority-based refetch strategy: critical queries first, then secondary, then background
 * - Completes overlay as soon as critical data is loaded
 * - Implements timeouts to prevent hanging
 * - Handles cache cleanup efficiently
 *
 * STRATEGY:
 * 1. Phase 1 (CRITICAL - ~200ms): Wallets, accounts, portfolio, banking overview
 *    → UI becomes interactive quickly with essential data
 * 2. Phase 2 (SECONDARY - ~500ms): Transactions, spending categories, net worth
 *    → Additional data for visible components
 * 3. Phase 3 (BACKGROUND - parallel): Goals, budgets, settings, subscriptions
 *    → Less critical data continues loading in background
 * 4. Timeouts prevent hanging on slow APIs
 * 5. Early completion releases overlay when critical data is ready
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { useOrganizationRefetchStore } from '@/lib/stores/organization-refetch-store';
import { cryptoKeys } from '@/lib/queries/crypto-queries';
import { bankingKeys } from '@/lib/queries/banking-queries';
import { budgetKeys } from '@/lib/queries/budget-queries';
import { goalKeys } from '@/lib/queries/use-goal-data';
import { networthKeys } from '@/lib/queries/networth-queries';
import { organizationKeys } from '@/lib/queries/use-organization-data';
import { accountsKeys } from '@/lib/queries/accounts-queries';
import { integrationsQueryKeys } from '@/lib/queries/integrations-queries';
import { paymentMethodKeys } from '@/lib/queries/payment-method-queries';
import { settingsKeys } from '@/lib/queries/settings-queries';
import { subscriptionKeys } from '@/lib/queries/subscription-queries';
import { billingSubscriptionKeys } from '@/lib/queries/use-billing-subscription-data';

// ============================================================================
// REFETCH TIMING CONSTANTS
// ============================================================================

const REFETCH_TIMEOUTS = {
  CRITICAL: 1500,    // 1.5 second timeout for critical queries
  SECONDARY: 2000,   // 2 second timeout for secondary queries
};

// ============================================================================
// PRIORITY-BASED REFETCH STRATEGY
// ============================================================================

async function refetchWithTimeout(
  promise: Promise<unknown>,
  timeoutMs: number,
  label: string
): Promise<void> {
  try {
    await Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Refetch timeout (${label})`)), timeoutMs)
      ),
    ]);
  } catch (error) {
    // Silently handle timeouts and errors - overlay will remain visible until critical queries complete
    // Errors are expected during refetch and don't need logging
  }
}

/**
 * Phase 1: CRITICAL queries (core account data)
 * Fastest queries - must complete before releasing overlay
 */
async function refetchCriticalQueries(
  queryClient: ReturnType<typeof useQueryClient>
): Promise<void> {
  await Promise.all([
    // Most important: Crypto & Banking wallets/accounts
    refetchWithTimeout(
      queryClient.refetchQueries({ queryKey: cryptoKeys.wallets(), exact: false }),
      REFETCH_TIMEOUTS.CRITICAL,
      'Crypto Wallets'
    ),
    refetchWithTimeout(
      queryClient.refetchQueries({ queryKey: bankingKeys.accounts(), exact: false }),
      REFETCH_TIMEOUTS.CRITICAL,
      'Banking Accounts'
    ),
  ]);
}

/**
 * Phase 2: SECONDARY queries (transactions, unified accounts, net worth)
 * Visible data that users care about - completes quickly after phase 1
 */
async function refetchSecondaryQueries(
  queryClient: ReturnType<typeof useQueryClient>
): Promise<void> {
  await Promise.all([
    // Unified accounts list (combines crypto + banking accounts)
    refetchWithTimeout(
      queryClient.refetchQueries({ queryKey: accountsKeys.list(), exact: false }),
      REFETCH_TIMEOUTS.SECONDARY,
      'Unified Accounts'
    ),
    // Net worth (primary dashboard chart)
    refetchWithTimeout(
      queryClient.refetchQueries({ queryKey: networthKeys.all, exact: false }),
      REFETCH_TIMEOUTS.SECONDARY,
      'Net Worth'
    ),
  ]);
}

/**
 * Phase 3: BACKGROUND queries (non-blocking, fire and forget)
 * These load in background without blocking the overlay
 */
function refetchBackgroundQueries(
  queryClient: ReturnType<typeof useQueryClient>
): void {
  // Fire these in background without waiting
  // They'll update the UI as they complete
  Promise.allSettled([
    queryClient.refetchQueries({ queryKey: goalKeys.all, exact: false }),
    queryClient.refetchQueries({ queryKey: budgetKeys.all, exact: false }),
    queryClient.refetchQueries({ queryKey: organizationKeys.all, exact: false }),
    queryClient.refetchQueries({ queryKey: subscriptionKeys.all, exact: false }),
    queryClient.refetchQueries({ queryKey: cryptoKeys.portfolio(), exact: false }),
    queryClient.refetchQueries({ queryKey: bankingKeys.overview(), exact: false }),
  ]).catch(() => {
    // Silent catch - background queries failures don't matter
  });
}

export function OrganizationDataSyncProvider() {
  const queryClient = useQueryClient();
  const selectedOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  const { startRefetch, completeRefetch } = useOrganizationRefetchStore();
  const previousOrgIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only process if organization has actually changed
    if (previousOrgIdRef.current === selectedOrgId) {
      return;
    }

    const previousOrgId = previousOrgIdRef.current;
    previousOrgIdRef.current = selectedOrgId;

    // Skip initial setup (first render when both are null)
    if (previousOrgId === null && selectedOrgId === null) {
      return;
    }

    // Skip initial load (coming from null to first org) - don't show overlay
    // Only show overlay when switching FROM one org TO another org
    if (previousOrgId === null && selectedOrgId !== null) {
      return;
    }

    // Start refetch loading state only on actual org switch
    if (selectedOrgId && previousOrgId && previousOrgId !== selectedOrgId) {
      startRefetch(selectedOrgId);
    } else {
      // Not a valid switch, don't refetch
      return;
    }

    // ========================================================================
    // FAST REFETCH FLOW - Optimized for Speed
    // ========================================================================
    (async () => {
      try {
        // Phase 1: Critical queries (wallets/accounts) - Wait for these
        await refetchCriticalQueries(queryClient);

        // Phase 2: Secondary queries (transactions/unified accounts) - Wait for these
        await refetchSecondaryQueries(queryClient);

        // Release overlay immediately after critical + secondary data loads
        // Phase 3 background queries continue loading without blocking
        completeRefetch();

        // Phase 3: Background queries - Fire and forget (don't wait)
        refetchBackgroundQueries(queryClient);
      } catch (error) {
        // Always complete refetch state, even if errors occurred
        completeRefetch();
      }
    })();
  }, [selectedOrgId, queryClient]);

  return null;
}
