/**
 * Query Helper Utilities
 *
 * Centralized helpers used across all query hooks.
 * Eliminates duplication and provides single source of truth for common patterns.
 */

import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';

/**
 * Ensures queries only run when user is authenticated and initialized
 */
export function useAuthReady() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  return { isAuthReady: !!user && isInitialized };
}

/**
 * Helper to get organization ID from context store or explicit parameter
 */
export function useContextOrganizationId(organizationId?: string) {
  const contextOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  return organizationId || contextOrgId;
}
