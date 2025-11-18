/**
 * Organization Data Hooks
 *
 * PURPOSE: Consolidated, production-grade hooks for organization and member management
 * - Multi-tenant organization management
 * - Member and role management
 * - Invitation system with email tokens and codes
 * - No useEffect patterns - React Query handles everything
 *
 * USAGE:
 * ```ts
 * const { data: organizations } = useOrganizations();
 * const { mutate: createOrg } = useCreateOrganization();
 * const { data: members } = useOrganizationMembers(orgId);
 * const { mutate: inviteUser } = useInviteUser(orgId);
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from '@/lib/services/organization-api';
import type {
  Organization,
  OrganizationMember,
  Invitation,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  InviteUserInput,
  UpdateMemberRoleInput,
  AcceptInvitationInput,
  RedeemInvitationInput,
} from '@/lib/types/organization';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...organizationKeys.lists(), { filters }] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  members: () => [...organizationKeys.all, 'members'] as const,
  membersList: (orgId: string) => [...organizationKeys.members(), orgId] as const,
  invitations: () => [...organizationKeys.all, 'invitations'] as const,
  invitationsPending: () => [...organizationKeys.invitations(), 'pending'] as const,
};

// ============================================================================
// ORGANIZATION QUERIES
// ============================================================================

/**
 * Get all organizations for current user
 * @param options - Query options including enabled flag
 * @returns List of organizations (includes personal workspace)
 */
export function useOrganizations(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: organizationKeys.lists(),
    queryFn: async () => {
      try {
        const response = await organizationApi.listOrganizations();
        if (response.success && response.data) {
          return response.data;
        }
        // If API returns error, throw to let React Query handle it
        throw new Error(response.error?.message || 'Failed to fetch organizations');
      } catch (error) {
        // Let the error propagate to React Query
        throw error;
      }
    },
    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Get specific organization details
 * @param organizationId - ID of the organization
 * @param options - Query options including enabled flag
 * @returns Organization details
 */
export function useOrganization(
  organizationId: string | null,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: organizationKeys.detail(organizationId || ''),
    queryFn: async () => {
      if (!organizationId) return null;
      const response = await organizationApi.getOrganization(organizationId);
      return response.success ? response.data : null;
    },
    enabled: (options.enabled !== false && !!organizationId) ?? true,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get personal organization (auto-created on signup)
 * @param options - Query options
 * @returns Personal/personal workspace
 */
export function usePersonalOrganization(options: { enabled?: boolean } = {}) {
  const { data: organizations, isLoading, error } = useOrganizations(options);

  return {
    data: organizations?.find((org) => org.isPersonal) || null,
    isLoading: isLoading || !organizations,
    error,
  };
}

// ============================================================================
// MEMBER QUERIES
// ============================================================================

/**
 * Get all members in an organization
 * @param organizationId - ID of the organization
 * @param options - Query options including enabled flag
 * @returns List of organization members
 */
export function useOrganizationMembers(
  organizationId: string | null,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: organizationKeys.membersList(organizationId || ''),
    queryFn: async () => {
      if (!organizationId) return [];
      const response = await organizationApi.getOrganizationMembers(organizationId);
      return response.success ? response.data : [];
    },
    enabled: (options.enabled !== false && !!organizationId) ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================================================
// INVITATION QUERIES
// ============================================================================

/**
 * Get pending invitations for current user
 * @param options - Query options including enabled flag
 * @returns List of pending invitations
 */
export function usePendingInvitations(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: organizationKeys.invitationsPending(),
    queryFn: async () => {
      const response = await organizationApi.getPendingInvitations();
      return response.success ? response.data : { data: [], total: 0 };
    },
    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

// ============================================================================
// ORGANIZATION MUTATIONS
// ============================================================================

/**
 * Create new organization
 * @returns Mutation hook with optimistic updates
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrganizationInput) => organizationApi.createOrganization(input),
    onMutate: async (input) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: organizationKeys.lists() });

      // Snapshot previous value
      const previousOrgs = queryClient.getQueryData(organizationKeys.lists());

      // Optimistically update
      queryClient.setQueryData(organizationKeys.lists(), (old: Organization[] = []) => [
        ...old,
        {
          id: `pending-${Date.now()}`,
          ...input,
          ownerId: '', // Will be set by server
          isActive: true,
          isPersonal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      return { previousOrgs };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousOrgs) {
        queryClient.setQueryData(organizationKeys.lists(), context.previousOrgs);
      }
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate queries to refetch
        queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      }
    },
  });
}

/**
 * Update organization (owner only)
 * @param organizationId - ID of the organization
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateOrganization(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateOrganizationInput) =>
      organizationApi.updateOrganization(organizationId, input),
    onMutate: async (input) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: organizationKeys.detail(organizationId) });

      // Snapshot previous value
      const previousOrg = queryClient.getQueryData(organizationKeys.detail(organizationId));

      // Optimistically update
      queryClient.setQueryData(
        organizationKeys.detail(organizationId),
        (old: Organization) => ({
          ...old,
          ...input,
          updatedAt: new Date().toISOString(),
        })
      );

      return { previousOrg };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousOrg) {
        queryClient.setQueryData(organizationKeys.detail(organizationId), context.previousOrg);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: organizationKeys.detail(organizationId) });
        queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      }
    },
  });
}

/**
 * Delete organization (owner only, cannot delete personal org)
 * @param organizationId - ID of the organization
 * @returns Mutation hook
 */
export function useDeleteOrganization(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => organizationApi.deleteOrganization(organizationId),
    onSuccess: (response) => {
      if (response.success) {
        // Remove from list
        queryClient.setQueryData(organizationKeys.lists(), (old: Organization[] = []) =>
          old.filter((org) => org.id !== organizationId)
        );

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      }
    },
  });
}

// ============================================================================
// MEMBER MUTATIONS
// ============================================================================

/**
 * Invite user to organization (owner only)
 * @param organizationId - ID of the organization
 * @returns Mutation hook
 */
export function useInviteUser(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InviteUserInput) => organizationApi.inviteUser(organizationId, input),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate members list
        queryClient.invalidateQueries({
          queryKey: organizationKeys.membersList(organizationId),
        });
      }
    },
  });
}

/**
 * Update member role (owner only)
 * @param organizationId - ID of the organization
 * @param userId - ID of the user
 * @returns Mutation hook with optimistic updates
 */
export function useUpdateMemberRole(organizationId: string, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMemberRoleInput) =>
      organizationApi.updateMemberRole(organizationId, userId, input),
    onMutate: async (input) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: organizationKeys.membersList(organizationId),
      });

      // Snapshot previous value
      const previousMembers = queryClient.getQueryData(
        organizationKeys.membersList(organizationId)
      );

      // Optimistically update
      queryClient.setQueryData(
        organizationKeys.membersList(organizationId),
        (old: OrganizationMember[] = []) =>
          old.map((member) => (member.userId === userId ? { ...member, ...input } : member))
      );

      return { previousMembers };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousMembers) {
        queryClient.setQueryData(
          organizationKeys.membersList(organizationId),
          context.previousMembers
        );
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate queries
        queryClient.invalidateQueries({
          queryKey: organizationKeys.membersList(organizationId),
        });
      }
    },
  });
}

/**
 * Remove member from organization (owner only)
 * @param organizationId - ID of the organization
 * @param userId - ID of the user
 * @returns Mutation hook
 */
export function useRemoveMember(organizationId: string, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => organizationApi.removeMember(organizationId, userId),
    onSuccess: (response) => {
      if (response.success) {
        // Remove from list
        queryClient.setQueryData(
          organizationKeys.membersList(organizationId),
          (old: OrganizationMember[] = []) =>
            old.filter((member) => member.userId !== userId)
        );

        // Invalidate queries
        queryClient.invalidateQueries({
          queryKey: organizationKeys.membersList(organizationId),
        });
      }
    },
  });
}

// ============================================================================
// INVITATION MUTATIONS
// ============================================================================

/**
 * Accept invitation using email token (from invitation link)
 * @returns Mutation hook
 */
export function useAcceptInvitationByToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AcceptInvitationInput) =>
      organizationApi.acceptInvitationByToken(input),
    onSuccess: () => {
      // Invalidate organizations and pending invitations
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.invitationsPending() });
    },
  });
}

/**
 * Accept invitation using shareable code
 * @returns Mutation hook
 */
export function useAcceptInvitationByCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RedeemInvitationInput) =>
      organizationApi.acceptInvitationByCode(input),
    onSuccess: () => {
      // Invalidate organizations and pending invitations
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.invitationsPending() });
    },
  });
}

/**
 * Revoke/delete invitation (owner only)
 * @param organizationId - ID of the organization
 * @param invitationId - ID of the invitation
 * @returns Mutation hook
 */
export function useRevokeInvitation(organizationId: string, invitationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => organizationApi.revokeInvitation(organizationId, invitationId),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: organizationKeys.membersList(organizationId),
      });
    },
  });
}
