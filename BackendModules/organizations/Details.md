# Organizations Module - Details

**Path**: `src/modules/organizations/`

## Overview

Multi-tenancy and team management with role-based access control, organization hierarchies, member invitations, and audit logging. Support for workspaces and organization-wide permissions.

**Status**: ✅ Production Ready
**Maturity**: High

---

## Features

### 1. Organization Management
- **Create Organizations**: User can create multiple organizations
- **Organization Profiles**: Name, avatar, description, metadata
- **Organization Settings**: Privacy, billing contact, preferences
- **Organization Hierarchy**: Nested organizations support
- **Organization Deletion**: Soft delete with data retention period

### 2. Member Management
- **Member Invite**: Email-based invitations with role assignment
- **Member Roles**: Owner, Admin, Editor, Viewer
- **Member Permissions**: Fine-grained permission control
- **Member Activation**: Accept/reject invitations
- **Member Removal**: Remove from organization
- **Member Activity**: Track member actions

### 3. Role-Based Access Control (RBAC)
- **Predefined Roles**: Owner, Admin, Editor, Viewer
- **Custom Roles**: Create organization-specific roles
- **Permission Sets**: Group permissions into reusable sets
- **Inheritance**: Roles inherit parent organization permissions
- **Permission Checking**: Middleware-based enforcement

### 4. Data Isolation
- **Multi-Tenancy**: Complete data isolation between organizations
- **Query Filtering**: Automatic filtering by organization
- **Audit Isolation**: Separate audit logs per organization
- **Resource Ownership**: Track resource ownership by organization

### 5. Invitations & Onboarding
- **Email Invitations**: Send team member invitations
- **Invite Links**: Shareable invite links with expiry
- **Bulk Invites**: Invite multiple members at once
- **Invite Management**: Track pending invitations
- **Custom Welcome**: Customizable invite messages

### 6. Organization Analytics
- **Member Count**: Track team size
- **Activity Metrics**: Track organization activity
- **Audit Logs**: Complete audit trail
- **Usage Statistics**: Resource usage tracking

---

## Key Methods

### OrganizationService
```
createOrganization(userId, orgData)
  → Create new organization

updateOrganization(orgId, updates)
  → Update organization details

deleteOrganization(orgId)
  → Soft delete organization

getOrganization(orgId, userId)
  → Get organization with access check

listUserOrganizations(userId)
  → Get all organizations for user

getOrganizationMembers(orgId, filters)
  → Get members with pagination

inviteMembers(orgId, emails, role)
  → Send invitations

removeMember(orgId, memberId)
  → Remove member

updateMemberRole(orgId, memberId, newRole)
  → Change member role

getAuditLog(orgId, filters)
  → Get audit log entries
```

---

## Database Models

### Organization
- `id`, `name`, `description`, `avatar_url`
- `ownerId`, `parentOrgId` (for hierarchy)
- `status`, `metadata`, `settings`
- `created_at`, `updated_at`

### OrganizationMember
- `id`, `orgId`, `userId`, `email`
- `role`, `status` (invited/active/removed)
- `invitedAt`, `acceptedAt`, `removedAt`

### OrganizationRole
- `id`, `orgId`, `name`, `permissions`
- `isCustom`, `created_at`

### AuditLog
- `id`, `orgId`, `userId`, `action`
- `resourceType`, `resourceId`, `changes`
- `timestamp`

---

## Error Handling

| Error | Code | Status |
|-------|------|--------|
| Organization not found | ORG_NOT_FOUND | 404 |
| Insufficient permissions | INSUFFICIENT_PERMISSIONS | 403 |
| Member not found | MEMBER_NOT_FOUND | 404 |
| Invalid role | INVALID_ROLE | 400 |
| Email exists | EMAIL_EXISTS | 409 |
| Invite expired | INVITE_EXPIRED | 400 |

---

## Common Use Cases

### UC1: Create Team Organization
```
User creates organization "Acme Corp"
    ↓
Organization created with user as owner
    ↓
User invites team members via email
    ↓
Members receive invitations
    ↓
Members accept and join organization
    ↓
Complete team with roles assigned
```

### UC2: Manage Permissions
```
Organization admin views member list
    ↓
See all team members with roles
    ↓
Change member role from Editor to Viewer
    ↓
Member permissions updated immediately
    ↓
Change is logged in audit trail
```

---

## API Endpoints (15+)

- POST `/organizations` - Create organization
- GET `/organizations` - List user organizations
- GET `/organizations/{id}` - Get organization details
- PUT `/organizations/{id}` - Update organization
- DELETE `/organizations/{id}` - Delete organization
- GET `/organizations/{id}/members` - List members
- POST `/organizations/{id}/members/invite` - Invite members
- PUT `/organizations/{id}/members/{userId}` - Update member role
- DELETE `/organizations/{id}/members/{userId}` - Remove member
- GET `/organizations/{id}/audit-log` - Get audit log
- POST `/organizations/{id}/roles` - Create custom role
- PUT `/organizations/{id}/roles/{roleId}` - Update role
- DELETE `/organizations/{id}/roles/{roleId}` - Delete role
- POST `/invitations/accept/{token}` - Accept invitation
- GET `/invitations/pending` - Get pending invitations

---

## Performance Optimizations

- Member list caching: 5 minute TTL
- Role definitions caching: 1 hour TTL
- Audit log pagination: 50 per page
- Database indexes on `orgId`, `userId`, `status`
