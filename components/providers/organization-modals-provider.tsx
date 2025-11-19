'use client';

/**
 * Organization Modals Provider
 *
 * Global provider that renders all organization-related modals
 * based on Zustand store state. This ensures modals can be opened
 * from anywhere in the app using the useOrganizationUIStore hook.
 */

import { CreateOrganizationModal } from '@/components/organization';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';

export function OrganizationModalsProvider() {
  // Get modal states from Zustand store
  const isCreateOrgModalOpen = useOrganizationUIStore(
    (state) => state.ui.isCreateOrgModalOpen
  );
  const closeCreateOrgModal = useOrganizationUIStore(
    (state) => state.closeCreateOrgModal
  );

  return (
    <>
      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isCreateOrgModalOpen}
        onClose={closeCreateOrgModal}
      />
    </>
  );
}
