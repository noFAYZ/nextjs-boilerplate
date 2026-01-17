# Organizations Management

## Overview

Organizations enable multi-tenant support in Mappr Backend, allowing users to create and manage organizations with multiple team members. Each organization has:

- **Owner-based permissions** - Full control by organization owner
- **Role-based access control** - Three roles: OWNER, EDITOR, VIEWER
- **Email-based invitations** - Invite team members via email with token/code-based acceptance
- **Personal organizations** - Automatically created default organization per user
- **Resource sharing** - Wallets, transactions, categories, and other resources organized per organization

## Architecture

### Module Structure

```
src/modules/organizations/
├── controllers/
│   ├── organizationController.ts    # Organization CRUD endpoints
│   ├── memberController.ts          # Member management
│   └── invitationController.ts      # Invitation handling
├── services/
│   ├── organizationService.ts       # Business logic
│   ├── organizationMemberService.ts # Member operations
│   └── invitationService.ts         # Invitation processing
├── adapters/
│   └── organizationAdapter.ts       # Better Auth adapter pattern
└── routes/
    └── index.ts                     # Route definitions
```

### Middleware

**Location:** `src/shared/middleware/organization.ts`

- `loadRequestContext()` - Unified context loading (session + org data)
- `extractOrganization()` - Extract organization from request
- `requireOrganization()` - Ensure organization context exists
- `requireRole()` - Enforce role-based access
- `checkPermission()` - Verify specific permissions

## Database Schema

### Organization Model

```typescript
model Organization {
  id              String                      @id @default(cuid())
  name            String                      // Organization name (required)
  slug            String                      @unique  // URL-friendly identifier (required)
  description     String?                     // Organization description
  icon            String?                     // Icon emoji or URL
  logoUrl         String?                     // Logo image URL
  ownerId         String                      // User who owns the organization
  isActive        Boolean                     @default(true)  // Active/inactive flag
  isPersonal      Boolean                     @default(false) // Auto-created personal org
  metadata        Json?                       // Better Auth extensible fields
  createdAt       DateTime                    @default(now())
  updatedAt       DateTime                    @updatedAt

  // Relations
  members         member[]        @relation("OrganizationMembers")
  invitations     invitation[]    @relation("OrganizationInvitations")
  accountGroups   AccountGroup[]
  accounts        FinancialAccount[]          @relation("OrganizationAccounts")
  categories      Category[]
  transactions    Transaction[]
  cryptoWallets   CryptoWallet[]
  // ... other resource relations

  @@index([ownerId])
  @@index([isPersonal])
  @@index([isActive])
  @@map("organizations")
}
```

### Member Model

```typescript
model member {
  id             String          @id @default(cuid())
  organizationId String          // FK to Organization
  userId         String          // FK to User
  role           OrganizationRole @default(VIEWER) // OWNER, EDITOR, VIEWER
  joinedAt       DateTime        @default(now())   // When user joined
  invitedBy      String?         // User ID who sent the invitation
  metadata       Json?           // Better Auth extensible fields
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  // Relations
  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade, name: "OrganizationMembers")
  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade, name: "MemberUser")

  @@unique([organizationId, userId]) // One member per user per organization
  @@index([userId, organizationId])   // Composite index for fast lookups
  @@index([organizationId])
  @@index([userId])
  @@index([role])
  @@map("organization_members")
}
```

### Invitation Model

```typescript
model invitation {
  id             String          @id @default(cuid())
  organizationId String          // FK to Organization
  email          String          // Invited email address
  role           OrganizationRole @default(VIEWER) // OWNER, EDITOR, VIEWER
  emailToken     String?         @unique          // Email-based acceptance token
  code           String?         @unique          // Code-based acceptance (shareable)
  status         InvitationStatus @default(PENDING) // PENDING, ACCEPTED, EXPIRED, REVOKED, CANCELLED
  acceptedAt     DateTime?       // When invitation was accepted
  expiresAt      DateTime        // Invitation expiry date (7 days)
  invitedBy      String          // User ID who sent the invitation
  metadata       Json?           // Better Auth extensible fields
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  // Relations
  invitedByUser  User            @relation(fields: [invitedBy], references: [id], onDelete: Cascade, name: "InvitedByUser")
  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade, name: "OrganizationInvitations")

  @@unique([organizationId, email]) // One pending invitation per email per org
  @@index([organizationId])
  @@index([email])
  @@index([status])
  @@index([expiresAt])
  @@index([emailToken])
  @@index([code])
  @@map("organization_invitations")
}
```

## Types & Enums

### OrganizationRole Enum

```typescript
export enum OrganizationRole {
  OWNER = 'OWNER',     // Full access - can manage members, delete org
  EDITOR = 'EDITOR',   // Can create/edit/delete data
  VIEWER = 'VIEWER',   // Read-only access to data
}
```

### InvitationStatus Enum

```typescript
export enum InvitationStatus {
  PENDING = 'PENDING',       // Awaiting acceptance
  ACCEPTED = 'ACCEPTED',     // User accepted and joined
  EXPIRED = 'EXPIRED',       // Invitation expired (7-day window)
  REVOKED = 'REVOKED',       // Manually revoked by owner
  CANCELLED = 'CANCELLED',   // Cancelled by sender
}
```

### Permission Matrix

```typescript
ROLE_PERMISSIONS = {
  OWNER: [
    'view:data',
    'create:data',
    'update:data',
    'delete:data',
    'manage:members',
    'delete:organization',
    'update:settings',
  ],
  EDITOR: [
    'view:data',
    'create:data',
    'update:data',
    'delete:data'
  ],
  VIEWER: [
    'view:data'
  ]
}

// Helper function
hasPermission(role: OrganizationRole, permission: string): boolean
```

### Core Interfaces

#### IOrganization

```typescript
interface IOrganization {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  logoUrl?: string | null;
  ownerId: string;
  isActive: boolean;
  isPersonal: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### IOrganizationMember

```typescript
interface IOrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  joinedAt: Date;
  invitedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### IOrganizationInvitation

```typescript
interface IOrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  emailToken?: string;
  code?: string;
  status: InvitationStatus;
  acceptedAt?: Date;
  expiresAt: Date;
  invitedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### RequestContext

```typescript
interface RequestContext {
  user: {
    id: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  };
  organization: {
    id: string;
    role: OrganizationRole;
  };
}
```

## API Endpoints

Base URL: `/api/v1`

All endpoints require authentication (Bearer JWT token) except noted otherwise.

### Organization Management

#### Get User's Organizations

```http
GET /organizations
```

**Description:** Retrieve all organizations the user is a member of. Personal organizations are returned first.

**Authorization:** Required

**Response:**

```typescript
interface ListOrganizationsResponse {
  success: true;
  data: IOrganizationResponse[];
}

interface IOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  logoUrl?: string | null;
  ownerId: string;
  isActive: boolean;
  isPersonal: boolean;
  memberCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "org_1234567890",
      "name": "My Personal Org",
      "slug": "my-personal-org",
      "description": null,
      "ownerId": "user_123",
      "isActive": true,
      "isPersonal": true,
      "memberCount": 1,
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    },
    {
      "id": "org_9876543210",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "description": "Finance management for ACME",
      "icon": "🏢",
      "logoUrl": "https://example.com/logo.png",
      "ownerId": "user_456",
      "isActive": true,
      "isPersonal": false,
      "memberCount": 5,
      "createdAt": "2025-01-01T08:00:00Z",
      "updatedAt": "2025-01-10T14:30:00Z"
    }
  ]
}
```

---

#### Create Organization

```http
POST /organizations
```

**Description:** Create a new organization. The authenticated user becomes the owner.

**Authorization:** Required

**Request Body:**

```typescript
interface ICreateOrganizationRequest {
  name: string;           // Required, 1-100 characters
  slug?: string;          // Optional, auto-generated if not provided
  description?: string;   // Optional, org description
  icon?: string;          // Optional, emoji or icon
  logoUrl?: string;       // Optional, logo image URL
}
```

**Request Example:**

```json
{
  "name": "Finance Team",
  "slug": "finance-team",
  "description": "Team finance tracking and planning",
  "icon": "💰",
  "logoUrl": "https://example.com/finance-logo.png"
}
```

**Response:**

```typescript
interface CreateOrganizationResponse {
  success: true;
  data: IOrganizationResponse;
}
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "id": "org_new123456",
    "name": "Finance Team",
    "slug": "finance-team",
    "description": "Team finance tracking and planning",
    "icon": "💰",
    "logoUrl": "https://example.com/finance-logo.png",
    "ownerId": "user_123",
    "isActive": true,
    "isPersonal": false,
    "memberCount": 1,
    "createdAt": "2025-01-16T12:00:00Z",
    "updatedAt": "2025-01-16T12:00:00Z"
  }
}
```

**Error Responses:**

```json
// Duplicate slug
{
  "success": false,
  "error": "Organization slug already exists",
  "code": "SLUG_EXISTS"
}

// Validation error
{
  "success": false,
  "error": "Organization name is required",
  "code": "VALIDATION_ERROR"
}
```

---

#### Get Organization Details

```http
GET /organizations/{organizationId}
```

**Description:** Retrieve detailed information about a specific organization.

**Authorization:** Required (must be a member)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID (cuid format)
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "org_1234567890",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "description": "Finance management for ACME",
    "icon": "🏢",
    "logoUrl": "https://example.com/logo.png",
    "ownerId": "user_456",
    "isActive": true,
    "isPersonal": false,
    "memberCount": 5,
    "createdAt": "2025-01-01T08:00:00Z",
    "updatedAt": "2025-01-10T14:30:00Z"
  }
}
```

**Error Responses:**

```json
// Organization not found
{
  "success": false,
  "error": "Organization not found",
  "code": "NOT_FOUND"
}

// User is not a member
{
  "success": false,
  "error": "Access denied",
  "code": "FORBIDDEN"
}
```

---

#### Update Organization

```http
PUT /organizations/{organizationId}
```

**Description:** Update organization details. Owner only.

**Authorization:** Required (OWNER role)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID
}
```

**Request Body:**

```typescript
interface IUpdateOrganizationRequest {
  name?: string;          // Update organization name
  description?: string;   // Update description
  icon?: string;          // Update icon emoji
  logoUrl?: string;       // Update logo URL
}
```

**Request Example:**

```json
{
  "name": "Acme Corporation",
  "description": "Updated finance management",
  "logoUrl": "https://example.com/new-logo.png"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "org_1234567890",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "description": "Updated finance management",
    "icon": "🏢",
    "logoUrl": "https://example.com/new-logo.png",
    "ownerId": "user_456",
    "isActive": true,
    "isPersonal": false,
    "memberCount": 5,
    "createdAt": "2025-01-01T08:00:00Z",
    "updatedAt": "2025-01-16T15:00:00Z"
  }
}
```

**Error Responses:**

```json
// Not authorized (not owner)
{
  "success": false,
  "error": "Only organization owner can update organization",
  "code": "FORBIDDEN"
}
```

---

#### Delete Organization

```http
DELETE /organizations/{organizationId}
```

**Description:** Delete an organization. Owner only. All associated data is cascaded deleted.

**Authorization:** Required (OWNER role)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Organization deleted successfully"
  }
}
```

**Error Responses:**

```json
// Not authorized
{
  "success": false,
  "error": "Only organization owner can delete organization",
  "code": "FORBIDDEN"
}

// Cannot delete personal organization
{
  "success": false,
  "error": "Cannot delete personal organization",
  "code": "CANNOT_DELETE_PERSONAL"
}
```

---

### Member Management

#### Get Organization Members

```http
GET /organizations/{organizationId}/members
```

**Description:** List all members of an organization with their roles and details.

**Authorization:** Required (must be a member)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID
}
```

**Query Parameters:**

```typescript
{
  page?: number;     // Pagination page (default: 1)
  limit?: number;    // Items per page (default: 20, max: 100)
  role?: OrganizationRole; // Filter by role (OWNER, EDITOR, VIEWER)
}
```

**Response:**

```typescript
interface GetMembersResponse {
  success: true;
  data: {
    members: IMemberResponse[];
    total: number;
    page: number;
    limit: number;
  };
}

interface IMemberResponse {
  id: string;                        // Member ID (cuid)
  userId: string;                    // User ID
  email: string;                     // User email
  name: string;                      // User full name
  role: OrganizationRole;            // OWNER, EDITOR, VIEWER
  joinedAt: Date;                    // When user joined
  invitedBy: string | null;          // ID of user who invited them
}
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "mem_123",
        "userId": "user_456",
        "email": "john@acme.com",
        "name": "John Smith",
        "role": "OWNER",
        "joinedAt": "2025-01-01T08:00:00Z",
        "invitedBy": null
      },
      {
        "id": "mem_124",
        "userId": "user_789",
        "email": "jane@acme.com",
        "name": "Jane Doe",
        "role": "EDITOR",
        "joinedAt": "2025-01-10T14:00:00Z",
        "invitedBy": "user_456"
      },
      {
        "id": "mem_125",
        "userId": "user_101",
        "email": "bob@acme.com",
        "name": "Bob Johnson",
        "role": "VIEWER",
        "joinedAt": "2025-01-15T09:00:00Z",
        "invitedBy": "user_456"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 20
  }
}
```

---

#### Invite User to Organization

```http
POST /organizations/{organizationId}/members
```

**Description:** Send an invitation to a user to join the organization. Owner only.

**Authorization:** Required (OWNER role)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID
}
```

**Request Body:**

```typescript
interface IInviteUserRequest {
  email: string;                     // Email to invite (required)
  role?: OrganizationRole;           // Role to assign (default: VIEWER)
  invitationType?: 'email' | 'code'; // Invitation type (default: 'email')
}
```

**Request Example:**

```json
{
  "email": "newuser@acme.com",
  "role": "EDITOR",
  "invitationType": "email"
}
```

**Response:**

```typescript
interface InvitationResponse {
  success: true;
  data: IInvitationResponse;
}

interface IInvitationResponse {
  id: string;                        // Invitation ID
  email: string;                     // Invited email
  role: OrganizationRole;            // OWNER, EDITOR, VIEWER
  status: InvitationStatus;          // PENDING, ACCEPTED, etc.
  invitationLink?: string;           // Shareable invitation link (for code-based)
  expiresAt: Date;                   // When invitation expires
  createdAt: Date;                   // When invitation was sent
}
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "id": "inv_123",
    "email": "newuser@acme.com",
    "role": "EDITOR",
    "status": "PENDING",
    "invitationLink": "https://mappr.app/join/invite_code_123456",
    "expiresAt": "2025-01-23T12:00:00Z",
    "createdAt": "2025-01-16T12:00:00Z"
  }
}
```

**Error Responses:**

```json
// Not authorized
{
  "success": false,
  "error": "Only organization owner can invite members",
  "code": "FORBIDDEN"
}

// User already a member
{
  "success": false,
  "error": "User is already a member of this organization",
  "code": "ALREADY_MEMBER"
}

// Duplicate invitation
{
  "success": false,
  "error": "Invitation already sent to this email",
  "code": "DUPLICATE_INVITATION"
}
```

---

#### Update Member Role

```http
PUT /organizations/{organizationId}/members/{memberId}
```

**Description:** Change a member's role. Owner only.

**Authorization:** Required (OWNER role)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID
  memberId: string;       // Member ID
}
```

**Request Body:**

```typescript
interface IUpdateMemberRoleRequest {
  role: OrganizationRole; // New role (OWNER, EDITOR, VIEWER)
}
```

**Request Example:**

```json
{
  "role": "OWNER"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "mem_124",
    "userId": "user_789",
    "email": "jane@acme.com",
    "name": "Jane Doe",
    "role": "OWNER",
    "joinedAt": "2025-01-10T14:00:00Z",
    "invitedBy": "user_456"
  }
}
```

**Error Responses:**

```json
// Not authorized
{
  "success": false,
  "error": "Only organization owner can update member roles",
  "code": "FORBIDDEN"
}

// Cannot demote last owner
{
  "success": false,
  "error": "Cannot demote the last owner. Assign another owner first.",
  "code": "LAST_OWNER"
}

// Member not found
{
  "success": false,
  "error": "Member not found",
  "code": "NOT_FOUND"
}
```

---

#### Remove Member from Organization

```http
DELETE /organizations/{organizationId}/members/{memberId}
```

**Description:** Remove a member from the organization. Owner only.

**Authorization:** Required (OWNER role)

**Path Parameters:**

```typescript
{
  organizationId: string; // Organization ID
  memberId: string;       // Member ID
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Member removed successfully"
  }
}
```

**Error Responses:**

```json
// Not authorized
{
  "success": false,
  "error": "Only organization owner can remove members",
  "code": "FORBIDDEN"
}

// Cannot remove last owner
{
  "success": false,
  "error": "Cannot remove the last owner",
  "code": "LAST_OWNER"
}
```

---

### Invitation Management

#### Get Pending Invitations

```http
GET /invitations/pending
```

**Description:** Get all pending invitations for the authenticated user.

**Authorization:** Required

**Response:**

```typescript
interface PendingInvitationsResponse {
  success: true;
  data: IInvitationResponse[];
}
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": "inv_123",
      "email": "user@example.com",
      "role": "EDITOR",
      "status": "PENDING",
      "expiresAt": "2025-01-23T12:00:00Z",
      "createdAt": "2025-01-16T12:00:00Z"
    },
    {
      "id": "inv_124",
      "email": "user@example.com",
      "role": "VIEWER",
      "status": "PENDING",
      "expiresAt": "2025-01-25T08:00:00Z",
      "createdAt": "2025-01-18T10:00:00Z"
    }
  ]
}
```

---

#### Accept Invitation by Token

```http
POST /invitations/accept
```

**Description:** Accept an invitation sent via email token.

**Authorization:** Required

**Request Body:**

```typescript
interface IAcceptInvitationRequest {
  token: string; // Email token from invitation email
}
```

**Request Example:**

```json
{
  "token": "email_token_abc123xyz"
}
```

**Response:**

```typescript
interface AcceptInvitationResponse {
  success: true;
  data: {
    organizationId: string;
    membershipId: string;
    role: OrganizationRole;
    message: string;
  };
}
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "organizationId": "org_123",
    "membershipId": "mem_456",
    "role": "EDITOR",
    "message": "Successfully joined organization"
  }
}
```

**Error Responses:**

```json
// Invalid or expired token
{
  "success": false,
  "error": "Invalid or expired invitation token",
  "code": "INVALID_TOKEN"
}

// Already a member
{
  "success": false,
  "error": "You are already a member of this organization",
  "code": "ALREADY_MEMBER"
}
```

---

#### Accept Invitation by Code

```http
POST /invitations/redeem
```

**Description:** Accept an invitation using a shareable code. Useful for public/shareable invitations.

**Authorization:** Required

**Request Body:**

```typescript
interface IAcceptInvitationRequest {
  code: string; // Shareable invitation code
}
```

**Request Example:**

```json
{
  "code": "INVITE123ABC"
}
```

**Response:** Same as Accept by Token

**Error Responses:** Same as Accept by Token

---

#### Revoke Invitation

```http
DELETE /organizations/{organizationId}/invitations/{invitationId}
```

**Description:** Revoke a pending invitation. Owner only.

**Authorization:** Required (OWNER role)

**Path Parameters:**

```typescript
{
  organizationId: string;  // Organization ID
  invitationId: string;    // Invitation ID
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Invitation revoked successfully"
  }
}
```

**Error Responses:**

```json
// Not authorized
{
  "success": false,
  "error": "Only organization owner can revoke invitations",
  "code": "FORBIDDEN"
}

// Invitation already accepted
{
  "success": false,
  "error": "Cannot revoke accepted invitation",
  "code": "ALREADY_ACCEPTED"
}
```

---

## Features

### ✅ Implemented

- **Multi-organization support** - Users can create and belong to multiple organizations
- **Role-based access control** - Three granular roles (OWNER, EDITOR, VIEWER)
- **Permission matrix system** - Flexible permission checking per role
- **Personal organization auto-creation** - Every user gets an auto-created personal org
- **Email-based invitations** - Token and code-based invitation acceptance
- **7-day invitation expiry** - Automatic expiration prevents stale invitations
- **Owner protection** - Prevents last owner demotion or removal
- **Request context middleware** - Unified org context loading in ~50-100ms
- **Composite unique constraints** - Prevents duplicate memberships and invitations
- **Efficient queries with indexes** - Optimized database performance

### 📋 Planned/Future

- **Better Auth native plugin** - Migration path via adapter pattern (environment-configurable)
- **Organization-level subscriptions** - Plan-based features per organization
- **Organization settings/preferences** - Customizable org configurations
- **Audit logging** - Track all organization changes (members, roles, settings)
- **Bulk member operations** - Import/batch invite multiple users
- **Team roles** - Custom role definitions per organization
- **Resource permissions** - Fine-grained resource-level permissions
- **SSO integration** - Single sign-on for organizations

## Usage Examples

### Create Organization

```typescript
// POST /api/v1/organizations
const response = await fetch('/api/v1/organizations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Engineering Team',
    slug: 'eng-team',
    description: 'Finance tracking for engineering',
    icon: '⚙️'
  })
});

const org = await response.json();
console.log(org.data.id); // org_123456
```

### Invite Team Member

```typescript
// POST /api/v1/organizations/{organizationId}/members
const response = await fetch(
  '/api/v1/organizations/org_123456/members',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'alice@example.com',
      role: 'EDITOR'
    })
  }
);

const invitation = await response.json();
// Send invitation.data.invitationLink to user
```

### Accept Invitation

```typescript
// POST /api/v1/invitations/accept
const response = await fetch('/api/v1/invitations/accept', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    token: 'email_token_from_email'
  })
});

const result = await response.json();
console.log(result.data.organizationId); // org_123456
```

### Check User Permissions

```typescript
// In a service or middleware
import { hasPermission, OrganizationRole } from '@/types/organization';

const userRole = OrganizationRole.EDITOR;
if (hasPermission(userRole, 'delete:data')) {
  // User can delete data
}
```

## Security Considerations

1. **Owner Protection** - Cannot demote or remove the last owner
2. **Token-based Invitations** - Uses secure, unique tokens and codes
3. **Expiring Invitations** - 7-day default expiry prevents stale invites
4. **Role-based Access Control** - All sensitive operations enforce role checks
5. **Cascade Deletion** - Deleting org removes all members and invitations
6. **Permission Matrix** - Centralized permission definitions prevent inconsistencies
7. **Request Context** - Unified context loading prevents multiple DB queries

## Performance Optimizations

1. **Composite Indexes** - (organizationId, userId), (userId, organizationId) for fast lookups
2. **Unified Context Loading** - Single query to load session + organization data (~50-100ms)
3. **Efficient Pagination** - Built-in pagination with limit/offset
4. **Database Indexes** - Separate indexes on frequently queried fields (ownerId, isPersonal, isActive)
5. **Query Optimization** - Include relations only when needed

## Related Resources

- **Accounts Module** - Organizations contain financial accounts
- **Transactions Module** - Transactions are scoped to organizations
- **Categories Module** - Categories organized by organization
- **Crypto Module** - Wallets managed per organization
- **Auth Module** - User authentication and JWT tokens
