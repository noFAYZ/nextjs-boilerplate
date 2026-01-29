/**
 * Organization Refetch State Store
 *
 * Tracks when organization data is being refetched
 * Used to show loading states in components when switching organizations
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrganizationRefetchState {
  // Is organization data currently refetching?
  isRefetching: boolean;

  // Which organization is being switched to (for progress tracking)
  refetchingToOrgId: string | null;
}

interface OrganizationRefetchActions {
  // Start refetching
  startRefetch: (toOrgId: string) => void;

  // Complete refetching
  completeRefetch: () => void;
}

type OrganizationRefetchStore = OrganizationRefetchState & OrganizationRefetchActions;

export const useOrganizationRefetchStore = create<OrganizationRefetchStore>()(
  devtools(
    (set) => ({
      isRefetching: false,
      refetchingToOrgId: null,

      startRefetch: (toOrgId: string) => {
        set({
          isRefetching: true,
          refetchingToOrgId: toOrgId,
        });
      },

      completeRefetch: () => {
        set({
          isRefetching: false,
          refetchingToOrgId: null,
        });
      },
    }),
    {
      name: 'organization-refetch-store',
    }
  )
);
