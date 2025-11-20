'use client';

/**
 * Organization URL Sync Provider
 *
 * PURPOSE: Synchronizes the `org` URL query parameter with the organization context store
 * - When user navigates with ?org=<id>, updates the context store
 * - The selected organization persists across page reloads
 * - Direct URL navigation works correctly
 *
 * USAGE:
 * - No explicit usage needed, wrapped in providers.tsx
 * - URL: /dashboard?org=org_123 will automatically select that organization
 */

import { useEffect } from 'react';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { useOrganizations } from '@/lib/queries/use-organization-data';
import { logger } from '@/lib/utils/logger';

export function OrganizationURLSyncProvider() {
  const { setSelectedOrganization, setInitialized } = useOrganizationStore();
  const selectedOrgId = useOrganizationStore((state) => state.selectedOrganizationId);
  const isInitialized = useOrganizationStore((state) => state.isInitialized);

  // Load user's organizations
  const { data: organizations, isLoading: isLoadingOrgs } = useOrganizations({
    enabled: !isInitialized
  });

  // Initialize organization from URL, persisted storage, or default to personal org
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    // Only proceed if organizations are loaded
    if (!organizations || isLoadingOrgs) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const orgFromUrl = searchParams.get('org');

    logger.info('Initializing organization context', {
      urlOrg: orgFromUrl,
      orgsAvailable: organizations.length,
      persistedOrg: selectedOrgId,
    });

    let orgToSelect: string | null = null;

    // Priority 1: If URL specifies organization, validate it exists
    if (orgFromUrl) {
      const orgExists = organizations.some((org) => org.id === orgFromUrl);
      if (orgExists) {
        orgToSelect = orgFromUrl;
        logger.info('Using organization from URL', { orgId: orgFromUrl });
      } else {
        logger.warn('Organization from URL not found in user organizations', { orgId: orgFromUrl });
      }
    }

    // Priority 2: If persisted organization exists and is still valid, use it
    if (!orgToSelect && selectedOrgId) {
      const orgExists = organizations.some((org) => org.id === selectedOrgId);
      if (orgExists) {
        orgToSelect = selectedOrgId;
        logger.info('Using persisted organization', { orgId: selectedOrgId });
      }
    }

    // Priority 3: Default to personal organization
    if (!orgToSelect && organizations.length > 0) {
      const personalOrg = organizations.find((org) => org.isPersonal);
      if (personalOrg) {
        orgToSelect = personalOrg.id;
        logger.info('Using personal organization as default', { orgId: personalOrg.id });
      } else {
        // Fallback to first organization
        orgToSelect = organizations[0].id;
        logger.info('Using first available organization', { orgId: organizations[0].id });
      }
    }

    setSelectedOrganization(orgToSelect);
    setInitialized();

    // NOTE: We do NOT sync the selected organization back to the URL.
    // This keeps the URL clean and matches Vercel's team switching behavior.
  }, [isInitialized, organizations, isLoadingOrgs, selectedOrgId, setSelectedOrganization, setInitialized]);

  // NOTE: We intentionally do NOT sync URL when organization changes
  // URL stays clean (no ?org= parameter). Data updates via context store.
  // This provides a Vercel-like experience where switching teams doesn't change the URL.

  return null;
}
