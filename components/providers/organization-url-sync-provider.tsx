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

  // Initialize organization from URL or default to personal org
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
    });

    let orgToSelect: string | null = null;

    // If URL specifies organization, validate it exists
    if (orgFromUrl) {
      const orgExists = organizations.some((org) => org.id === orgFromUrl);
      if (orgExists) {
        orgToSelect = orgFromUrl;
        logger.info('Using organization from URL', { orgId: orgFromUrl });
      } else {
        logger.warn('Organization from URL not found in user organizations', { orgId: orgFromUrl });
      }
    }

    // If no valid URL org, default to personal organization
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

    // Update URL if organization changed
    if (orgToSelect && orgFromUrl !== orgToSelect) {
      const url = new URL(window.location);
      url.searchParams.set('org', orgToSelect);
      window.history.replaceState({}, '', url);
    }
  }, [isInitialized, organizations, isLoadingOrgs, setSelectedOrganization, setInitialized]);

  // Sync URL when selected organization changes (after initialization)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const orgFromUrl = searchParams.get('org');

    if (selectedOrgId && orgFromUrl !== selectedOrgId) {
      logger.info('Syncing organization to URL', { orgId: selectedOrgId });
      const url = new URL(window.location);
      url.searchParams.set('org', selectedOrgId);
      window.history.replaceState({}, '', url);
    }
  }, [selectedOrgId, isInitialized]);

  return null;
}
