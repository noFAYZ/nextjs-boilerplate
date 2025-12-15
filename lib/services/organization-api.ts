/**
 * Organization API Service
 * Handles all API calls related to organization and member management
 */

import { apiClient } from '@/lib/api-client';
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
  AcceptInvitationResponse,
  OrganizationResponse,
} from '@/lib/types/organization';

export const organizationApi = {
  // Organization endpoints

  /**
   * Get all organizations for the current user
   */
  async listOrganizations() {
    return apiClient.get<Organization[]>('/organizations');
  },

  /**
   * Create a new organization
   */
  async createOrganization(input: CreateOrganizationInput) {
    return apiClient.post<Organization>('/organizations', input);
  },

  /**
   * Get organization details
   */
  async getOrganization(organizationId: string) {
    return apiClient.get<Organization>(`/organizations/${organizationId}`);
  },

  /**
   * Update organization (owner only)
   */
  async updateOrganization(organizationId: string, input: UpdateOrganizationInput) {
    return apiClient.put<Organization>(`/organizations/${organizationId}`, input);
  },

  /**
   * Delete organization (owner only, cannot delete personal org)
   */
  async deleteOrganization(organizationId: string) {
    return apiClient.delete<{ message: string }>(`/organizations/${organizationId}`);
  },

  // Member endpoints

  /**
   * Get all members in an organization
   */
  async getOrganizationMembers(organizationId: string) {
    return apiClient.get<OrganizationMember[]>(`/organizations/${organizationId}/members`);
  },

  /**
   * Invite a user to organization (owner only)
   */
  async inviteUser(organizationId: string, input: InviteUserInput) {
    return apiClient.post<Invitation>(`/organizations/${organizationId}/members`, input);
  },

  /**
   * Update member role (owner only)
   */
  async updateMemberRole(organizationId: string, userId: string, input: UpdateMemberRoleInput) {
    return apiClient.put<OrganizationMember>(
      `/organizations/${organizationId}/members/${userId}`,
      input
    );
  },

  /**
   * Remove member from organization (owner only)
   */
  async removeMember(organizationId: string, userId: string) {
    return apiClient.delete<{ message: string }>(
      `/organizations/${organizationId}/members/${userId}`
    );
  },

  // Invitation endpoints

  /**
   * Get pending invitations for current user
   */
  async getPendingInvitations() {
    return apiClient.get<{
      data: Invitation[];
      total: number;
    }>('/invitations/pending');
  },

  /**
   * Accept invitation using email token
   */
  async acceptInvitationByToken(input: AcceptInvitationInput) {
    return apiClient.post<AcceptInvitationResponse>('/invitations/accept', input);
  },

  /**
   * Accept invitation using shareable code
   */
  async acceptInvitationByCode(input: RedeemInvitationInput) {
    return apiClient.post<AcceptInvitationResponse>('/invitations/redeem', input);
  },

  /**
   * Revoke/delete an invitation (owner only)
   */
  async revokeInvitation(organizationId: string, invitationId: string) {
    return apiClient.delete<{ message: string }>(
      `/organizations/${organizationId}/invitations/${invitationId}`
    );
  },
};

export type { Organization, OrganizationMember, Invitation };
