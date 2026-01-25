// Organizations Module Type Definitions

// ============================================================================
// ENUMS
// ============================================================================

export enum OrganizationRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum MemberStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REMOVED = 'removed'
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum AuditAction {
  ORG_CREATED = 'org_created',
  ORG_UPDATED = 'org_updated',
  ORG_DELETED = 'org_deleted',
  MEMBER_INVITED = 'member_invited',
  MEMBER_ADDED = 'member_added',
  MEMBER_ROLE_UPDATED = 'member_role_updated',
  MEMBER_REMOVED = 'member_removed',
  ROLE_CREATED = 'role_created',
  ROLE_UPDATED = 'role_updated',
  ROLE_DELETED = 'role_deleted',
  SETTINGS_UPDATED = 'settings_updated'
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateOrganizationDTO {
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface UpdateOrganizationDTO {
  name?: string;
  description?: string;
  avatarUrl?: string;
  settings?: OrganizationSettings;
}

export interface InviteMembersDTO {
  emails: string[];
  role: OrganizationRole;
  message?: string;
}

export interface UpdateMemberRoleDTO {
  role: OrganizationRole;
}

export interface CreateRoleDTO {
  name: string;
  permissions: string[];
  description?: string;
}

// ============================================================================
// MAIN TYPES
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  ownerId: string;
  parentOrgId?: string;
  status: 'active' | 'inactive' | 'deleted';
  memberCount: number;
  settings: OrganizationSettings;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface OrganizationSettings {
  privacy?: 'private' | 'public';
  requireMFA?: boolean;
  dataEncryption?: boolean;
  allowExternalSharingencryption?: boolean;
  auditLoggingEnabled?: boolean;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId?: string;
  email: string;
  name?: string;
  role: OrganizationRole;
  status: MemberStatus;
  joinedAt?: Date;
  invitedAt?: Date;
  invitedBy?: string;
  removedAt?: Date;
  lastActivityAt?: Date;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  status: InvitationStatus;
  token: string;
  invitedBy: string;
  invitedAt: Date;
  acceptedAt?: Date;
  expiresAt: Date;
  message?: string;
}

export interface CustomRole {
  id: string;
  organizationId: string;
  name: string;
  permissions: string[];
  description?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  changes: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface OrganizationStats {
  memberCount: number;
  activeMembers: number;
  pendingInvitations: number;
  lastActivityAt: Date;
  createdAt: Date;
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page?: number;
    limit?: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: Date;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class OrganizationServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'OrganizationServiceError';
  }
}

export class OrganizationNotFoundError extends OrganizationServiceError {
  constructor() {
    super('Organization not found', 'ORG_NOT_FOUND', 404);
    this.name = 'OrganizationNotFoundError';
  }
}

export class InsufficientPermissionsError extends OrganizationServiceError {
  constructor() {
    super('Insufficient permissions', 'INSUFFICIENT_PERMISSIONS', 403);
    this.name = 'InsufficientPermissionsError';
  }
}

export class MemberNotFoundError extends OrganizationServiceError {
  constructor() {
    super('Member not found', 'MEMBER_NOT_FOUND', 404);
    this.name = 'MemberNotFoundError';
  }
}

export class InvalidRoleError extends OrganizationServiceError {
  constructor() {
    super('Invalid role specified', 'INVALID_ROLE', 400);
    this.name = 'InvalidRoleError';
  }
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface OrganizationRecord {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  owner_id: string;
  parent_org_id?: string;
  status: string;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface OrganizationMemberRecord {
  id: string;
  organization_id: string;
  user_id?: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  joined_at?: Date;
  invited_at?: Date;
  invited_by?: string;
  removed_at?: Date;
  last_activity_at?: Date;
}

export interface InvitationRecord {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  invited_by: string;
  invited_at: Date;
  accepted_at?: Date;
  expires_at: Date;
  message?: string;
}

export interface CustomRoleRecord {
  id: string;
  organization_id: string;
  name: string;
  permissions: string[];
  description?: string;
  is_custom: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLogRecord {
  id: string;
  organization_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  changes: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}
