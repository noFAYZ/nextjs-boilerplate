# Organizations Module - API Reference

**Base Path**: `/api/v1/organizations`

---

## Endpoints Overview

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/` | Create organization | 5/min |
| GET | `/` | List user organizations | 50/15min |
| GET | `/{id}` | Get organization | 100/15min |
| PUT | `/{id}` | Update organization | 10/min |
| DELETE | `/{id}` | Delete organization | 5/min |
| GET | `/{id}/members` | List members | 50/15min |
| POST | `/{id}/members/invite` | Invite members | 10/min |
| PUT | `/{id}/members/{userId}` | Update member role | 10/min |
| DELETE | `/{id}/members/{userId}` | Remove member | 10/min |
| GET | `/{id}/audit-log` | Get audit log | 50/15min |
| POST | `/{id}/roles` | Create custom role | 10/min |
| PUT | `/{id}/roles/{roleId}` | Update role | 10/min |
| DELETE | `/{id}/roles/{roleId}` | Delete role | 10/min |
| POST | `/invitations/accept/{token}` | Accept invitation | 10/min |
| GET | `/invitations/pending` | Pending invitations | 50/15min |

---

## Detailed Endpoints

### 1. Create Organization
Create new organization.

**Endpoint**: `POST /`

**Request**:
```json
{
  "name": "Acme Corporation",
  "description": "Our awesome company",
  "avatarUrl": "https://example.com/logo.png"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Acme Corporation",
    "description": "Our awesome company",
    "avatarUrl": "https://example.com/logo.png",
    "ownerId": "user_123",
    "status": "active",
    "memberCount": 1,
    "createdAt": "2025-01-18T14:00:00Z"
  },
  "timestamp": "2025-01-18T14:00:00Z"
}
```

---

### 2. List Organizations
Get all organizations for user.

**Endpoint**: `GET /`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "org_123",
      "name": "Acme Corporation",
      "avatarUrl": "https://example.com/logo.png",
      "role": "owner",
      "memberCount": 5,
      "createdAt": "2025-01-18T14:00:00Z"
    },
    {
      "id": "org_456",
      "name": "Tech Startup",
      "avatarUrl": "https://example.com/logo2.png",
      "role": "editor",
      "memberCount": 12,
      "createdAt": "2025-01-17T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 20
  },
  "timestamp": "2025-01-18T14:05:00Z"
}
```

---

### 3. Get Organization Details
Get specific organization.

**Endpoint**: `GET /{id}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Acme Corporation",
    "description": "Our awesome company",
    "avatarUrl": "https://example.com/logo.png",
    "ownerId": "user_123",
    "status": "active",
    "memberCount": 5,
    "settings": {
      "privacy": "private",
      "requireMFA": false,
      "dataEncryption": true
    },
    "createdAt": "2025-01-18T14:00:00Z",
    "updatedAt": "2025-01-18T14:00:00Z"
  },
  "timestamp": "2025-01-18T14:10:00Z"
}
```

---

### 4. Update Organization
Update organization details.

**Endpoint**: `PUT /{id}`

**Request**:
```json
{
  "name": "Acme Corp",
  "description": "Updated description",
  "settings": {
    "privacy": "public",
    "requireMFA": true
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Acme Corp",
    "description": "Updated description",
    "settings": {
      "privacy": "public",
      "requireMFA": true,
      "dataEncryption": true
    },
    "updatedAt": "2025-01-18T14:15:00Z"
  },
  "timestamp": "2025-01-18T14:15:00Z"
}
```

---

### 5. Delete Organization
Delete organization (soft delete).

**Endpoint**: `DELETE /{id}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "status": "deleted",
    "deletedAt": "2025-01-18T14:20:00Z",
    "message": "Organization deleted successfully"
  },
  "timestamp": "2025-01-18T14:20:00Z"
}
```

---

### 6. List Organization Members
Get all members in organization.

**Endpoint**: `GET /{id}/members`

**Query**: `?page=1&limit=20&role=editor`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "mem_123",
      "userId": "user_123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "owner",
      "status": "active",
      "joinedAt": "2025-01-18T14:00:00Z"
    },
    {
      "id": "mem_124",
      "userId": "user_456",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "editor",
      "status": "active",
      "joinedAt": "2025-01-18T14:05:00Z"
    },
    {
      "id": "mem_125",
      "userId": null,
      "email": "bob@example.com",
      "role": "viewer",
      "status": "invited",
      "invitedAt": "2025-01-18T14:10:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3
  },
  "timestamp": "2025-01-18T14:25:00Z"
}
```

---

### 7. Invite Members
Send invitations to join organization.

**Endpoint**: `POST /{id}/members/invite`

**Request**:
```json
{
  "emails": ["alice@example.com", "bob@example.com"],
  "role": "editor",
  "message": "Join our organization!"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "invitations": [
      {
        "id": "inv_123",
        "email": "alice@example.com",
        "role": "editor",
        "status": "pending",
        "invitedAt": "2025-01-18T14:30:00Z",
        "expiresAt": "2025-01-25T14:30:00Z"
      },
      {
        "id": "inv_124",
        "email": "bob@example.com",
        "role": "editor",
        "status": "pending",
        "invitedAt": "2025-01-18T14:30:00Z",
        "expiresAt": "2025-01-25T14:30:00Z"
      }
    ],
    "sentCount": 2
  },
  "timestamp": "2025-01-18T14:30:00Z"
}
```

---

### 8. Update Member Role
Change member role.

**Endpoint**: `PUT /{id}/members/{userId}`

**Request**:
```json
{
  "role": "admin"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "mem_124",
    "userId": "user_456",
    "email": "jane@example.com",
    "role": "admin",
    "updatedAt": "2025-01-18T14:35:00Z"
  },
  "timestamp": "2025-01-18T14:35:00Z"
}
```

---

### 9. Remove Member
Remove member from organization.

**Endpoint**: `DELETE /{id}/members/{userId}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "mem_124",
    "email": "jane@example.com",
    "removedAt": "2025-01-18T14:40:00Z",
    "message": "Member removed successfully"
  },
  "timestamp": "2025-01-18T14:40:00Z"
}
```

---

### 10. Get Audit Log
Get organization audit trail.

**Endpoint**: `GET /{id}/audit-log`

**Query**: `?action=member_added&dateFrom=2025-01-01&limit=50`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "log_123",
      "timestamp": "2025-01-18T14:30:00Z",
      "userId": "user_123",
      "action": "member_invited",
      "resourceType": "member",
      "resourceId": "mem_125",
      "changes": {
        "email": "bob@example.com",
        "role": "viewer"
      }
    },
    {
      "id": "log_124",
      "timestamp": "2025-01-18T14:35:00Z",
      "userId": "user_123",
      "action": "member_role_updated",
      "resourceType": "member",
      "resourceId": "mem_124",
      "changes": {
        "oldRole": "editor",
        "newRole": "admin"
      }
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50
  },
  "timestamp": "2025-01-18T14:45:00Z"
}
```

---

### 11. Create Custom Role
Create organization-specific role.

**Endpoint**: `POST /{id}/roles`

**Request**:
```json
{
  "name": "Financial Officer",
  "permissions": [
    "transactions:read",
    "transactions:export",
    "budgets:manage",
    "reports:view"
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "role_123",
    "name": "Financial Officer",
    "permissions": [
      "transactions:read",
      "transactions:export",
      "budgets:manage",
      "reports:view"
    ],
    "isCustom": true,
    "createdAt": "2025-01-18T14:50:00Z"
  },
  "timestamp": "2025-01-18T14:50:00Z"
}
```

---

### 12. Accept Invitation
Accept organization invitation.

**Endpoint**: `POST /invitations/accept/{token}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "organizationId": "org_123",
    "organizationName": "Acme Corporation",
    "role": "editor",
    "message": "Successfully joined organization"
  },
  "timestamp": "2025-01-18T14:55:00Z"
}
```

---

### 13. Get Pending Invitations
Get invitations pending acceptance.

**Endpoint**: `GET /invitations/pending`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_456",
      "organizationId": "org_789",
      "organizationName": "Tech Startup",
      "role": "editor",
      "invitedBy": "alice@example.com",
      "invitedAt": "2025-01-17T10:00:00Z",
      "expiresAt": "2025-01-24T10:00:00Z",
      "acceptToken": "token_xyz789..."
    }
  ],
  "pagination": {
    "total": 1
  },
  "timestamp": "2025-01-18T15:00:00Z"
}
```

---

## Error Codes

| Code | Status |
|------|--------|
| ORG_NOT_FOUND | 404 |
| INSUFFICIENT_PERMISSIONS | 403 |
| MEMBER_NOT_FOUND | 404 |
| INVALID_ROLE | 400 |
| EMAIL_EXISTS | 409 |
| INVITE_EXPIRED | 400 |
