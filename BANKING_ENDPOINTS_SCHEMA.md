# Banking Connection API Schemas

## POST /api/v1/banking/connections/:connectionId/reconnect

**Purpose:** Reactivate a disconnected connection without re-linking through Plaid

### Request
```typescript
URL Params:
  connectionId: string (uuid) - The ID of disconnected connection

Headers:
  Authorization: Bearer <jwt_token>
  Content-Type: application/json

Body: {} (empty)
```

### Response (Success - 200 OK)
```typescript
{
  "success": true,
  "message": "Connection reconnected successfully. Full sync will begin automatically.",
  "data": {
    "id": "conn_abc123",
    "userId": "user_123",
    "organizationId": "org_456",
    "provider": "PLAID",
    "status": "ACTIVE",
    "plaidItemId": "item_xyz",
    "plaidInstitutionId": "ins_123",
    "institutionName": "Chase Bank",
    "institutionLogo": "https://cdn.plaid.com/...",
    "institutionUrl": "https://www.chase.com",
    "lastSyncAt": "2025-01-21T12:30:00Z",
    "lastSyncStatus": "SUCCESS",
    "autoSync": true,
    "syncFrequency": "6h",
    "lastError": null,
    "errorCount": 0,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-21T12:30:00Z"
  }
}
```

### Error Responses

**400 Bad Request** - Connection not disconnected
```typescript
{
  "success": false,
  "error": "Connection is not disconnected. Only disconnected connections can be reconnected.",
  "code": "CONNECTION_ALREADY_EXISTS",
  "statusCode": 400
}
```

**400 Bad Request** - Provider credentials expired
```typescript
{
  "success": false,
  "error": "Plaid access token has expired. Please re-link your account.",
  "code": "CONNECTION_ALREADY_EXISTS",
  "statusCode": 400
}
```

**400 Bad Request** - Active connection exists for same account
```typescript
{
  "success": false,
  "error": "An active connection already exists for this Plaid account",
  "code": "CONNECTION_ALREADY_EXISTS",
  "statusCode": 400
}
```

**403 Forbidden** - Unauthorized access
```typescript
{
  "success": false,
  "error": "You do not have access to this connection",
  "code": "FORBIDDEN",
  "statusCode": 403
}
```

**404 Not Found** - Connection does not exist
```typescript
{
  "success": false,
  "error": "Provider connection not found",
  "code": "CONNECTION_NOT_FOUND",
  "statusCode": 404
}
```

---

## DELETE /api/v1/banking/connections/:connectionId

**Purpose:** Permanently delete a connection with cascading cleanup of related data

### Request
```typescript
URL Params:
  connectionId: string (uuid) - The ID of connection to delete

Headers:
  Authorization: Bearer <jwt_token>
  Content-Type: application/json

Body: {} (empty)
```

### Response (Success - 200 OK)
```typescript
{
  "success": true,
  "message": "Connection deleted successfully"
}
```

### Cascade Deletion Details
When a connection is deleted, the following are automatically removed:
1. All financial accounts linked to this connection
2. All transactions for those accounts
3. All sync states (progress tracking)
4. All banking sync logs
5. The connection itself

### Error Responses

**403 Forbidden** - Unauthorized access
```typescript
{
  "success": false,
  "error": "You do not have access to this connection",
  "code": "FORBIDDEN",
  "statusCode": 403
}
```

**404 Not Found** - Connection does not exist
```typescript
{
  "success": false,
  "error": "Provider connection not found",
  "code": "CONNECTION_NOT_FOUND",
  "statusCode": 404
}
```

---

## Common Request Headers

All endpoints require:
```typescript
Authorization: Bearer <jwt_token>   // Required
Content-Type: application/json       // For requests with body
```

## Authentication

- User must be logged in (JWT token required)
- User must own the connection (verified by userId)
- Organization context is extracted from JWT claims

## Cache Invalidation

Both endpoints automatically invalidate cache for:
- Connection data: `connectionId:${connectionId}`
- User connections list: `user:${userId}:connections`
- User accounts list: `user:${userId}:accounts`

## Provider Types

Supported provider values:
- `PLAID` - Plaid banking aggregator
- `TELLER` - Teller banking provider (coming soon)
- `MX` - MX data aggregation (coming soon)

## Connection Status

Possible status values:
- `ACTIVE` - Connection is actively syncing
- `DISCONNECTED` - Connection temporarily disabled (can be reconnected)
- `FAILED` - Connection has permanent errors (requires full re-link)

## Sync Status

Possible sync status values:
- `PENDING` - Awaiting sync
- `IN_PROGRESS` - Currently syncing
- `SUCCESS` - Last sync succeeded
- `FAILED` - Last sync failed
- `PAUSED` - Sync is paused
