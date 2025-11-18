/**
 * Organization Types
 * Defines all TypeScript interfaces for multi-tenant organization system
 */

export type OrganizationRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  logoUrl?: string | null;
  ownerId: string;
  isActive: boolean;
  isPersonal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: OrganizationRole;
  joinedAt: string;
  invitedBy?: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: OrganizationRole;
  status: 'PENDING' | 'ACCEPTED';
  code: string;
  emailToken?: string;
  expiresAt: string;
  createdAt: string;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface OrganizationResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  logoUrl?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  description?: string;
  icon?: string;
  logoUrl?: string;
}

export interface InviteUserInput {
  email: string;
  role: OrganizationRole;
  invitationType: 'email' | 'code';
}

export interface UpdateMemberRoleInput {
  role: OrganizationRole;
}

export interface AcceptInvitationInput {
  token: string;
}

export interface RedeemInvitationInput {
  code: string;
}

export interface AcceptInvitationResponse {
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
}

/**
 * Permission matrix for role-based access control
 */
export const ROLE_PERMISSIONS: Record<OrganizationRole, {
  VIEW_DATA: boolean;
  CREATE_DATA: boolean;
  UPDATE_DATA: boolean;
  DELETE_DATA: boolean;
  MANAGE_MEMBERS: boolean;
  DELETE_ORG: boolean;
  UPDATE_SETTINGS: boolean;
}> = {
  OWNER: {
    VIEW_DATA: true,
    CREATE_DATA: true,
    UPDATE_DATA: true,
    DELETE_DATA: true,
    MANAGE_MEMBERS: true,
    DELETE_ORG: true,
    UPDATE_SETTINGS: true,
  },
  EDITOR: {
    VIEW_DATA: true,
    CREATE_DATA: true,
    UPDATE_DATA: true,
    DELETE_DATA: true,
    MANAGE_MEMBERS: false,
    DELETE_ORG: false,
    UPDATE_SETTINGS: false,
  },
  VIEWER: {
    VIEW_DATA: true,
    CREATE_DATA: false,
    UPDATE_DATA: false,
    DELETE_DATA: false,
    MANAGE_MEMBERS: false,
    DELETE_ORG: false,
    UPDATE_SETTINGS: false,
  },
};
