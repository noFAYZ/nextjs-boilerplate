'use client';

/**
 * Organization Query Sync Provider
 *
 * Refetches all org-scoped queries when organization changes.
 * Uses the useOrganizationRefetch hook for robust handling.
 */

import { useOrganizationRefetch } from '@/lib/hooks/use-organization-refetch';

export function OrganizationQuerySyncProvider() {
  // Trigger refetch when org changes
  useOrganizationRefetch();

  return null;
}
