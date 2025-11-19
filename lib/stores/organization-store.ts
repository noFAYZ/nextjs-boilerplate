/**
 * Organization Context Store
 *
 * PURPOSE: Manages the current organization context for multi-tenant data scoping
 * - Tracks selected organization ID for all data fetches
 * - Persists organization selection across sessions
 * - Automatically set from URL parameters or default to personal org
 * - Used by all queries to scope data to current organization
 *
 * STATE BOUNDARIES:
 * ✅ Context State (this store): selectedOrganizationId, loading state
 * ❌ Server Data: Use TanStack Query hooks (use-organization-data.ts)
 * ❌ UI State: Use organization-ui-store.ts for modals, filters, etc.
 *
 * USAGE:
 * ```ts
 * // Get selected org
 * const orgId = useOrganizationStore((state) => state.selectedOrganizationId);
 *
 * // Change org
 * const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);
 * setSelectedOrganization('org_123');
 *
 * // Pass to queries
 * const { data: wallets } = useCryptoWallets(orgId);
 * ```
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// STATE TYPES
// ============================================================================

interface OrganizationContextState {
  // Current organization for data scoping
  selectedOrganizationId: string | null;

  // Track if initialization is complete
  isInitialized: boolean;

  // Loading state when setting org
  isChangingOrg: boolean;
}

interface OrganizationContextActions {
  // Set the selected organization (for data scoping)
  setSelectedOrganization: (orgId: string | null) => void;

  // Mark as initialized
  setInitialized: () => void;

  // Reset to null
  resetOrganization: () => void;
}

type OrganizationContextStore = OrganizationContextState & OrganizationContextActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: OrganizationContextState = {
  selectedOrganizationId: null,
  isInitialized: false,
  isChangingOrg: false,
};

// ============================================================================
// STORE
// ============================================================================

export const useOrganizationStore = create<OrganizationContextStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setSelectedOrganization: (orgId: string | null) => {
          console.log('[OrganizationStore] Setting selected organization:', orgId);
          set((state) => {
            state.selectedOrganizationId = orgId;
            state.isChangingOrg = false;
          });
        },

        setInitialized: () => {
          set((state) => {
            state.isInitialized = true;
          });
        },

        resetOrganization: () => {
          set(() => ({
            selectedOrganizationId: null,
            isInitialized: false,
            isChangingOrg: false,
          }));
        },
      })),
      {
        name: 'organization-store',
        partialize: (state) => ({
          selectedOrganizationId: state.selectedOrganizationId,
        }),
      }
    )
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const organizationSelectors = {
  selectSelectedOrganizationId: (state: OrganizationContextState) =>
    state.selectedOrganizationId,
  selectIsInitialized: (state: OrganizationContextState) =>
    state.isInitialized,
  selectIsChangingOrg: (state: OrganizationContextState) =>
    state.isChangingOrg,
};
