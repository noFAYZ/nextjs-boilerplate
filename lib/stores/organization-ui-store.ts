/**
 * Organization UI Store
 *
 * PURPOSE: Manages UI-only state for organization features
 * - Selected organization, modal states, filters
 * - Does NOT fetch or store server data
 * - Server data comes from TanStack Query hooks in lib/queries/
 *
 * STATE BOUNDARIES:
 * ✅ UI State (this store): selected org, modal states, view preferences
 * ❌ Server Data (TanStack Query): organizations, members, invitations
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// STATE TYPES
// ============================================================================

interface OrganizationUIState {
  // Selection State (persistent - survives reload)
  selectedOrganizationId: string | null;

  // Modal States
  ui: {
    isCreateOrgModalOpen: boolean;
    isEditOrgModalOpen: boolean;
    isDeleteOrgModalOpen: boolean;
    isInviteMemberModalOpen: boolean;
    isInvitationAcceptanceModalOpen: boolean;
    isMembersListOpen: boolean;
  };

  // Context State
  context: {
    orgIdForAction: string | null; // Track which org is being edited/deleted
    memberIdForAction: string | null; // Track which member is being managed
    invitationIdForAction: string | null; // Track which invitation is being revoked
  };
}

interface OrganizationUIActions {
  // Selection Actions
  selectOrganization: (orgId: string | null) => void;

  // Modal Actions
  openCreateOrgModal: () => void;
  closeCreateOrgModal: () => void;
  openEditOrgModal: (orgId: string) => void;
  closeEditOrgModal: () => void;
  openDeleteOrgModal: (orgId: string) => void;
  closeDeleteOrgModal: () => void;
  openInviteMemberModal: (orgId: string) => void;
  closeInviteMemberModal: () => void;
  openInvitationAcceptanceModal: () => void;
  closeInvitationAcceptanceModal: () => void;
  openMembersListModal: (orgId: string) => void;
  closeMembersListModal: () => void;

  // Context Actions
  setMemberIdForAction: (memberId: string | null) => void;
  setInvitationIdForAction: (invitationId: string | null) => void;

  // Utility Actions
  resetUIState: () => void;
}

type OrganizationUIStore = OrganizationUIState & OrganizationUIActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: OrganizationUIState = {
  selectedOrganizationId: null,
  ui: {
    isCreateOrgModalOpen: false,
    isEditOrgModalOpen: false,
    isDeleteOrgModalOpen: false,
    isInviteMemberModalOpen: false,
    isInvitationAcceptanceModalOpen: false,
    isMembersListOpen: false,
  },
  context: {
    orgIdForAction: null,
    memberIdForAction: null,
    invitationIdForAction: null,
  },
};

// ============================================================================
// STORE
// ============================================================================

export const useOrganizationUIStore = create<OrganizationUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // Selection Actions
        selectOrganization: (orgId) => {
          set((state) => {
            state.selectedOrganizationId = orgId;
          });
        },

        // Modal Actions
        openCreateOrgModal: () => {
          set((state) => {
            state.ui.isCreateOrgModalOpen = true;
          });
        },
        closeCreateOrgModal: () => {
          set((state) => {
            state.ui.isCreateOrgModalOpen = false;
          });
        },

        openEditOrgModal: (orgId) => {
          set((state) => {
            state.ui.isEditOrgModalOpen = true;
            state.context.orgIdForAction = orgId;
          });
        },
        closeEditOrgModal: () => {
          set((state) => {
            state.ui.isEditOrgModalOpen = false;
            state.context.orgIdForAction = null;
          });
        },

        openDeleteOrgModal: (orgId) => {
          set((state) => {
            state.ui.isDeleteOrgModalOpen = true;
            state.context.orgIdForAction = orgId;
          });
        },
        closeDeleteOrgModal: () => {
          set((state) => {
            state.ui.isDeleteOrgModalOpen = false;
            state.context.orgIdForAction = null;
          });
        },

        openInviteMemberModal: (orgId) => {
          set((state) => {
            state.ui.isInviteMemberModalOpen = true;
            state.context.orgIdForAction = orgId;
          });
        },
        closeInviteMemberModal: () => {
          set((state) => {
            state.ui.isInviteMemberModalOpen = false;
            state.context.orgIdForAction = null;
          });
        },

        openInvitationAcceptanceModal: () => {
          set((state) => {
            state.ui.isInvitationAcceptanceModalOpen = true;
          });
        },
        closeInvitationAcceptanceModal: () => {
          set((state) => {
            state.ui.isInvitationAcceptanceModalOpen = false;
          });
        },

        openMembersListModal: (orgId) => {
          set((state) => {
            state.ui.isMembersListOpen = true;
            state.context.orgIdForAction = orgId;
          });
        },
        closeMembersListModal: () => {
          set((state) => {
            state.ui.isMembersListOpen = false;
            state.context.orgIdForAction = null;
          });
        },

        // Context Actions
        setMemberIdForAction: (memberId) => {
          set((state) => {
            state.context.memberIdForAction = memberId;
          });
        },
        setInvitationIdForAction: (invitationId) => {
          set((state) => {
            state.context.invitationIdForAction = invitationId;
          });
        },

        // Utility Actions
        resetUIState: () => {
          set(() => initialState);
        },
      })),
      {
        name: 'organization-ui-store',
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

export const organizationUISelectors = {
  selectSelectedOrganizationId: (state: OrganizationUIState) =>
    state.selectedOrganizationId,
  selectCreateOrgModalOpen: (state: OrganizationUIState) =>
    state.ui.isCreateOrgModalOpen,
  selectEditOrgModalOpen: (state: OrganizationUIState) => state.ui.isEditOrgModalOpen,
  selectDeleteOrgModalOpen: (state: OrganizationUIState) =>
    state.ui.isDeleteOrgModalOpen,
  selectInviteMemberModalOpen: (state: OrganizationUIState) =>
    state.ui.isInviteMemberModalOpen,
  selectMembersListOpen: (state: OrganizationUIState) => state.ui.isMembersListOpen,
  selectOrgIdForAction: (state: OrganizationUIState) =>
    state.context.orgIdForAction,
  selectMemberIdForAction: (state: OrganizationUIState) =>
    state.context.memberIdForAction,
  selectInvitationIdForAction: (state: OrganizationUIState) =>
    state.context.invitationIdForAction,
};
