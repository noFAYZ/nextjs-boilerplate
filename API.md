# Mappr Backend - Complete API Documentation

**Version**: 2.0
**Last Updated**: January 2025
**Base URL**: `https://api.moneymappr.com/api/v1` (Production)
**Base URL**: `http://localhost:3000/api/v1` (Development)

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Authorization](#authorization)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Authentication Endpoints](#authentication-endpoints)
8. [Crypto Portfolio Endpoints](#crypto-portfolio-endpoints)
9. [Banking Endpoints](#banking-endpoints)
10. [Net Worth Endpoints](#net-worth-endpoints)
11. [Budget Endpoints](#budget-endpoints)
12. [Goals Endpoints](#goals-endpoints)
13. [Organization Endpoints](#organization-endpoints)
14. [Integration Endpoints](#integration-endpoints)
15. [Subscription Endpoints](#subscription-endpoints)
16. [Admin Endpoints](#admin-endpoints)
17. [Webhook Endpoints](#webhook-endpoints)

---

## API Overview

### Base Configuration
- **Protocol**: HTTPS (HTTP in development)
- **Version**: `/api/v1`
- **Content-Type**: `application/json`
- **Response Format**: Consistent JSON structure with `success` flag
- **Authentication**: Bearer JWT tokens in `Authorization` header

### Development Tools
- **Documentation**: Swagger UI at `/docs`
- **Health Check**: `GET /health`
- **API Version**: `/api/v1`

### API Tiers

| Tier | Requests/15 min | Requests/min | Wallets | Bank Accounts |
|------|-----------------|-------------|---------|---------------|
| **FREE** | 100 | 10 | 3 | 2 |
| **PRO** | 500 | 50 | 50 | 10 |
| **ULTIMATE** | 2000 | 200 | ∞ | ∞ |

### Multi-Tenant Organization Context (Implemented January 2025)

All API endpoints now support organization-scoped data access for multi-tenant deployments:

**Organization Context Sources** (in order of precedence):
1. URL path parameter: `/organizations/{organizationId}/resource`
2. Query parameter: `?organizationId=org_123`
3. Header: `X-Organization-Id: org_123`
4. Request body (for POST): `{"organizationId": "org_123", ...}`

**Example Multi-Tenant Requests**:

```bash
# Via query parameter (most common)
GET /api/v1/budgets?organizationId=org_123
Authorization: Bearer {token}

# Via header
GET /api/v1/budgets
X-Organization-Id: org_123
Authorization: Bearer {token}

# Via URL path
GET /api/v1/organizations/org_123/budgets
Authorization: Bearer {token}

# Via body (POST)
POST /api/v1/goals?organizationId=org_123
Content-Type: application/json
Authorization: Bearer {token}
{
  "name": "Save $10k",
  "organizationId": "org_123"
}
```

**Organization Roles & Permissions**:

| Role | Permissions |
|------|------------|
| **OWNER** | View, Create, Edit, Delete data; Manage members; Org settings |
| **EDITOR** | View, Create, Edit, Delete data |
| **VIEWER** | View data only |

**Data Isolation Guarantees**:
- All read/write operations are scoped to the specified organization
- A user can only access data if they are a member of that organization
- Users cannot access data from organizations they don't belong to
- Personal data (no organizationId) remains accessible only to the user
- Cross-organization data leakage is impossible due to enforced filtering at middleware + database level

**How to Switch Organizations**:
1. User gets list of their organizations: `GET /api/v1/organizations`
2. User picks an organization and uses its `organizationId`
3. All subsequent requests include `?organizationId=org_id`
4. Middleware validates user is member and extracts role
5. Only data for that organization is returned

---

## Using Organization Context with Other Endpoints

All data endpoints (Accounts, Budgets, Goals, Crypto, Banking, etc.) now support organization filtering.

**Examples**:

### Get Budgets for Organization
```bash
GET /api/v1/budgets?organizationId=org_company
Authorization: Bearer {jwt_token}
```

### Create Budget in Organization
```bash
POST /api/v1/budgets?organizationId=org_company
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Q1 Marketing Budget",
  "amount": 5000,
  "cycle": "MONTHLY",
  "organizationId": "org_company"
}
```

### Get Crypto Wallets for Organization
```bash
GET /api/v1/crypto/wallets?organizationId=org_company
Authorization: Bearer {jwt_token}
```

### Get Goals for Organization
```bash
GET /api/v1/goals?organizationId=org_company
Authorization: Bearer {jwt_token}
```

**All endpoints follow the same pattern**: Add `?organizationId=org_id` to scope data to that organization.

---

## Authentication

### Bearer Token Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```bash
Authorization: Bearer {jwt_token}
```

### Token Structure

```typescript
{
  "iss": "mappr-backend",
  "sub": "user_123",
  "aud": "mappr-web",
  "exp": 1234567890,        // Unix timestamp
  "iat": 1234567890,        // Unix timestamp
  "email": "user@example.com",
  "role": "USER",           // USER | PREMIUM | ADMIN
  "plan": "PRO"             // FREE | PRO | ULTIMATE
}
```

### Token Expiration

- **Access Token**: 1 hour
- **Refresh Token**: 7 days
- **Session**: 7 days (kept in database)

---

## Authorization

### User-Level Role-Based Access (RBAC)

| Resource | USER | PREMIUM | ADMIN |
|----------|------|---------|-------|
| Own wallets | ✅ | ✅ | ✅ |
| All wallets (admin) | ❌ | ❌ | ✅ |
| Own bank accounts | ✅ | ✅ | ✅ |
| Admin endpoints | ❌ | ❌ | ✅ |
| User management | ❌ | ❌ | ✅ |

### Organization-Level Role-Based Access (ORBAC)

When accessing organization data, user's role in that organization determines permissions:

| Operation | OWNER | EDITOR | VIEWER |
|-----------|-------|--------|--------|
| View organization data | ✅ | ✅ | ✅ |
| Create data (budgets, goals, etc) | ✅ | ✅ | ❌ |
| Edit data | ✅ | ✅ | ❌ |
| Delete data | ✅ | ✅ | ❌ |
| Manage members | ✅ | ❌ | ❌ |
| Change org settings | ✅ | ❌ | ❌ |
| Invite users | ✅ | ❌ | ❌ |
| Delete organization | ✅ | ❌ | ❌ |

### Plan-Based Access (PBAC)

| Feature | FREE | PRO | ULTIMATE |
|---------|------|------|-----------|
| Crypto wallets | 3 | 50 | ∞ |
| Bank accounts | 2 | 10 | ∞ |
| Budgets | 5 | 20 | ∞ |
| Goals | 3 | 10 | ∞ |
| Asset accounts | 5 | 20 | ∞ |
| Real-time sync | ❌ | ✅ | ✅ |
| API access | Limited | Full | Full |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example Resource"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    {"id": "1", "name": "Item 1"},
    {"id": "2", "name": "Item 2"}
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 523,
    "pages": 11
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "User-friendly error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "details": {
    "field": "email",
    "issue": "Email already registered"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions or plan limit |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | External service down (Zerion, Teller, etc.) |

### Common Error Codes

```
INVALID_INPUT              // Validation failed
MISSING_REQUIRED_FIELD     // Required field missing
EMAIL_ALREADY_REGISTERED   // User exists
INVALID_CREDENTIALS        // Wrong email/password
UNAUTHORIZED               // Missing/invalid token
FORBIDDEN                  // No permission
RESOURCE_NOT_FOUND         // Resource doesn't exist
PLAN_LIMIT_EXCEEDED        // Hit plan limit
RATE_LIMIT_EXCEEDED        // Too many requests
WALLET_ALREADY_ADDED       // Duplicate wallet
PROVIDER_ERROR             // External API error
CIRCUIT_BREAKER_OPEN       // Provider temporarily unavailable
INVALID_NETWORK            // Unsupported blockchain
SYNC_IN_PROGRESS           // Wallet already syncing
```

### Error Response Examples

```json
{
  "success": false,
  "error": "Wallet limit exceeded for your plan",
  "code": "PLAN_LIMIT_EXCEEDED",
  "statusCode": 403,
  "details": {
    "current": 3,
    "limit": 3,
    "plan": "FREE"
  }
}
```

```json
{
  "success": false,
  "error": "Invalid request body",
  "code": "INVALID_INPUT",
  "statusCode": 400,
  "details": {
    "errors": [
      {
        "field": "email",
        "message": "must be a valid email"
      },
      {
        "field": "password",
        "message": "must be at least 8 characters"
      }
    ]
  }
}
```

---

## Rate Limiting

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

### Rate Limit Tiers

```
General Endpoints:      100 requests / 15 minutes
Write Operations:       10 requests / minute
Sync Operations:        3 requests / 5 minutes
Live Data:              50 requests / minute
Admin Endpoints:        200 requests / hour
```

### Rate Limit Response (429)

```json
{
  "success": false,
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "statusCode": 429,
  "details": {
    "retryAfter": 45,
    "limitReset": 1234567890
  }
}
```

---

## Authentication Endpoints

### Base Path: `/auth`

#### Register

```http
POST /api/v1/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "currentPlan": "FREE",
      "emailVerified": false,
      "createdAt": "2025-01-21T10:30:00Z"
    },
    "session": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresAt": "2025-01-21T11:30:00Z",
      "refreshToken": "ref_token_123"
    }
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Email already registered",
  "code": "EMAIL_ALREADY_REGISTERED",
  "statusCode": 409
}
```

#### Login

```http
POST /api/v1/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "currentPlan": "PRO",
      "emailVerified": true
    },
    "session": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresAt": "2025-01-21T11:30:00Z",
      "refreshToken": "ref_token_456"
    }
  }
}
```

#### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "role": "USER",
    "currentPlan": "PRO",
    "emailVerified": true,
    "lastLoginAt": "2025-01-21T09:15:00Z",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
Cookie: session_token={refresh_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-01-21T12:30:00Z",
    "refreshToken": "ref_token_789"
  }
}
```

#### Logout

```http
POST /api/v1/auth/sign-out
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### Verify Email

```http
GET /api/v1/auth/verify-email?token={verification_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "emailVerified": true
    },
    "message": "Email verified successfully"
  }
}
```

#### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

#### Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_xyz",
  "password": "NewPassword123!"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

## Crypto Portfolio Endpoints

### Base Path: `/crypto`

#### List Wallets

```http
GET /api/v1/crypto/wallets
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |
| network | string | - | Filter by network |
| isActive | boolean | true | Filter by active status |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "wallet_123",
      "name": "Main Ethereum Wallet",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "network": "ETHEREUM",
      "type": "EXTERNAL",
      "totalBalanceUsd": 45678.90,
      "assetCount": 12,
      "lastSyncAt": "2025-01-21T10:30:00Z",
      "syncStatus": "completed",
      "isActive": true,
      "notes": "Main wallet for DeFi",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-21T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  }
}
```

#### Add Wallet

```http
POST /api/v1/crypto/wallets
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Trading Wallet",
  "address": "0xabcdef1234567890abcdef1234567890abcdef12",
  "network": "POLYGON",
  "type": "EXTERNAL",
  "notes": "My Polygon trading wallet"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "wallet_456",
    "name": "Trading Wallet",
    "address": "0xabcdef1234567890abcdef1234567890abcdef12",
    "network": "POLYGON",
    "type": "EXTERNAL",
    "totalBalanceUsd": 0,
    "assetCount": 0,
    "syncStatus": "pending",
    "isActive": true,
    "notes": "My Polygon trading wallet",
    "createdAt": "2025-01-21T11:00:00Z"
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Wallet already exists for this user",
  "code": "WALLET_ALREADY_ADDED",
  "statusCode": 409
}
```

```json
{
  "success": false,
  "error": "Wallet limit exceeded for your plan",
  "code": "PLAN_LIMIT_EXCEEDED",
  "statusCode": 403,
  "details": {
    "current": 3,
    "limit": 3,
    "plan": "FREE"
  }
}
```

#### Get Wallet Details

```http
GET /api/v1/crypto/wallets/{walletId}
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "wallet_123",
    "name": "Main Ethereum Wallet",
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "network": "ETHEREUM",
    "type": "EXTERNAL",
    "totalBalanceUsd": 45678.90,
    "assetCount": 12,
    "lastSyncAt": "2025-01-21T10:30:00Z",
    "syncStatus": "completed",
    "isActive": true,
    "notes": "Main wallet for DeFi",
    "createdAt": "2025-01-01T00:00:00Z",
    "positions": [
      {
        "id": "pos_123",
        "assetSymbol": "ETH",
        "assetName": "Ethereum",
        "balance": "5.234",
        "balanceUsd": 12345.67,
        "price": 2358.90,
        "change24h": 3.45,
        "updatedAt": "2025-01-21T10:30:00Z"
      },
      {
        "id": "pos_124",
        "assetSymbol": "USDC",
        "assetName": "USD Coin",
        "balance": "10000.00",
        "balanceUsd": 10000.00,
        "price": 1.00,
        "change24h": 0.02,
        "updatedAt": "2025-01-21T10:30:00Z"
      }
    ]
  }
}
```

#### Update Wallet

```http
PUT /api/v1/crypto/wallets/{walletId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated Wallet Name",
  "notes": "Updated notes",
  "isActive": true
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "wallet_123",
    "name": "Updated Wallet Name",
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "network": "ETHEREUM",
    "totalBalanceUsd": 45678.90,
    "notes": "Updated notes",
    "updatedAt": "2025-01-21T11:00:00Z"
  }
}
```

#### Delete Wallet

```http
DELETE /api/v1/crypto/wallets/{walletId}
Authorization: Bearer {jwt_token}
```

**Response: 204 No Content**

#### Get Portfolio (Aggregated)

```http
GET /api/v1/crypto/portfolio
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "totalBalanceUsd": 125789.45,
    "walletCount": 3,
    "assetCount": 25,
    "change24h": {
      "usd": 3456.78,
      "percent": 2.82
    },
    "topAssets": [
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "balance": "15.234",
        "balanceUsd": 35678.90,
        "price": 2358.90,
        "change24h": 3.45,
        "percentage": 28.3
      },
      {
        "symbol": "BTC",
        "name": "Bitcoin",
        "balance": "0.5",
        "balanceUsd": 20000.00,
        "price": 40000.00,
        "change24h": 2.15,
        "percentage": 15.9
      }
    ],
    "breakdown": {
      "byNetwork": {
        "ETHEREUM": 45678.90,
        "POLYGON": 35678.90,
        "ARBITRUM": 25678.90
      },
      "byCategory": {
        "stablecoin": 30000.00,
        "ethereum": 35678.90,
        "defi": 45678.90,
        "nft": 14432.65
      }
    },
    "lastSyncAt": "2025-01-21T10:30:00Z"
  }
}
```

#### Sync Wallet

```http
POST /api/v1/crypto/wallets/{walletId}/sync
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "syncTypes": ["assets", "transactions", "nfts", "defi"],
  "fullSync": false
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "walletId": "wallet_123",
    "jobId": "job_789xyz",
    "status": "queued",
    "estimatedCompletionTime": "2025-01-21T10:35:00Z",
    "syncTypes": ["assets", "transactions", "nfts", "defi"],
    "message": "Wallet sync queued successfully"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Sync already in progress for this wallet",
  "code": "SYNC_IN_PROGRESS",
  "statusCode": 409
}
```

#### Get Wallet Transactions

```http
GET /api/v1/crypto/wallets/{walletId}/transactions
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |
| startDate | ISO8601 | - | Start date filter |
| endDate | ISO8601 | - | End date filter |
| type | string | - | SWAP, TRANSFER, RECEIVE, etc. |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "walletId": "wallet_123",
      "hash": "0xabcdef...",
      "type": "SWAP",
      "from": {
        "symbol": "ETH",
        "name": "Ethereum",
        "amount": "1.5"
      },
      "to": {
        "symbol": "USDC",
        "name": "USD Coin",
        "amount": "2500.00"
      },
      "timestamp": "2025-01-21T08:30:00Z",
      "blockNumber": 19234567,
      "gasUsed": "123456",
      "gasFee": {
        "eth": "0.015",
        "usd": 35.40
      },
      "status": "completed",
      "chain": "ETHEREUM"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234,
    "pages": 5
  }
}
```

#### Get Wallet NFTs

```http
GET /api/v1/crypto/wallets/{walletId}/nfts
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |
| collection | string | - | Filter by collection |

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "id": "col_123",
        "name": "Bored Ape Yacht Club",
        "address": "0xbc4ca0eda7647a8ab7c...",
        "floorPrice": 34.5,
        "floorPriceUsd": 81750.50,
        "nftCount": 2,
        "totalValue": 163501.00,
        "change24h": 2.34,
        "nfts": [
          {
            "tokenId": "123",
            "name": "Bored Ape #123",
            "image": "ipfs://...",
            "floorPrice": 34.5,
            "floorPriceUsd": 81750.50,
            "rarity": "legendary"
          }
        ]
      }
    ],
    "totalValue": 163501.00
  }
}
```

#### Get DeFi Positions

```http
GET /api/v1/crypto/wallets/{walletId}/defi
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "id": "defi_123",
        "protocol": "AAVE",
        "type": "lending",
        "supplied": {
          "symbol": "ETH",
          "amount": "10.5",
          "value": 24768.90
        },
        "borrowed": {
          "symbol": "USDC",
          "amount": "5000.00",
          "value": 5000.00
        },
        "rewards": [
          {
            "symbol": "aAAVE",
            "amount": "2.34",
            "value": 456.78
          }
        ],
        "netValue": 20225.68,
        "healthFactor": 2.45,
        "lastUpdated": "2025-01-21T10:30:00Z"
      }
    ],
    "totalValue": 20225.68
  }
}
```

#### Real-time Sync Progress (SSE)

```http
GET /api/v1/crypto/user/sync/stream
Authorization: Bearer {jwt_token}
```

**Response: 200 OK (text/event-stream)**
```
data: {"type":"connection_established","timestamp":"2025-01-21T10:30:00Z"}

data: {"type":"sync_started","walletId":"wallet_123","walletName":"Main Wallet","timestamp":"2025-01-21T10:30:05Z"}

data: {"type":"progress","walletId":"wallet_123","progress":25,"status":"syncing_assets","message":"Fetching asset positions..."}

data: {"type":"progress","walletId":"wallet_123","progress":50,"status":"syncing_transactions","message":"Fetching transaction history..."}

data: {"type":"progress","walletId":"wallet_123","progress":75,"status":"syncing_nfts","message":"Fetching NFT collections..."}

data: {"type":"completed","walletId":"wallet_123","totalAssets":12,"totalTransactions":234,"totalNfts":5,"timestamp":"2025-01-21T10:35:00Z"}

data: {"type":"failed","walletId":"wallet_456","error":"Provider temporarily unavailable","timestamp":"2025-01-21T10:35:30Z"}
```

**Client Implementation:**
```typescript
const eventSource = new EventSource('/api/v1/crypto/user/sync/stream', {
  headers: { Authorization: `Bearer ${token}` }
});

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  switch(data.type) {
    case 'sync_started':
      console.log(`Sync started for ${data.walletName}`);
      break;
    case 'progress':
      updateProgressBar(data.progress);
      updateStatus(data.status);
      break;
    case 'completed':
      console.log(`Sync completed! Found ${data.totalAssets} assets`);
      break;
    case 'failed':
      console.error(`Sync failed: ${data.error}`);
      break;
  }
});
```

---

## Banking Endpoints

### Base Path: `/banking`

#### Get Account Preview (Before Connecting)

```http
POST /api/v1/banking/preview
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "enrollment": {
    "accessToken": "test_token_abc123...",
    "enrollment": {
      "id": "enr_abc123",
      "institution": {
        "id": "chase",
        "name": "Chase Bank"
      }
    }
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "institutionName": "Chase Bank",
    "institutionId": "chase",
    "enrollmentId": "enr_abc123",
    "accounts": [
      {
        "id": "acc_xyz789",
        "name": "Chase Checking Account",
        "type": "CHECKING",
        "subtype": "checking",
        "balance": 5432.10,
        "currency": "USD",
        "lastFour": "1234",
        "accountNumber": "****1234",
        "status": "open"
      },
      {
        "id": "acc_xyz790",
        "name": "Chase Savings Account",
        "type": "SAVINGS",
        "subtype": "savings",
        "balance": 25000.00,
        "currency": "USD",
        "lastFour": "5678",
        "accountNumber": "****5678",
        "status": "open"
      }
    ]
  }
}
```

#### Connect Bank Accounts

```http
POST /api/v1/banking/connect
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "enrollment": {
    "accessToken": "test_token_abc123...",
    "enrollment": {
      "id": "enr_abc123",
      "institution": {
        "id": "chase",
        "name": "Chase Bank"
      }
    }
  },
  "selectedAccountIds": ["acc_xyz789", "acc_xyz790"]
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": [
    {
      "id": "fin_acc_123",
      "name": "Chase Checking Account",
      "type": "CHECKING",
      "balance": 5432.10,
      "currency": "USD",
      "institutionName": "Chase Bank",
      "institutionId": "chase",
      "lastSyncAt": "2025-01-21T10:30:00Z",
      "syncStatus": "pending",
      "isActive": true
    },
    {
      "id": "fin_acc_124",
      "name": "Chase Savings Account",
      "type": "SAVINGS",
      "balance": 25000.00,
      "currency": "USD",
      "institutionName": "Chase Bank",
      "institutionId": "chase",
      "lastSyncAt": "2025-01-21T10:30:00Z",
      "syncStatus": "pending",
      "isActive": true
    }
  ]
}
```

#### List Bank Accounts

```http
GET /api/v1/banking/accounts
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |
| type | string | - | CHECKING, SAVINGS, CREDIT_CARD, INVESTMENT |
| isActive | boolean | true | Filter by active status |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "fin_acc_123",
      "name": "Chase Checking Account",
      "type": "CHECKING",
      "balance": 5432.10,
      "currency": "USD",
      "institutionName": "Chase Bank",
      "lastSyncAt": "2025-01-21T10:30:00Z",
      "syncStatus": "completed",
      "isActive": true,
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "pages": 1
  }
}
```

#### Get Account Details

```http
GET /api/v1/banking/accounts/{accountId}
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "fin_acc_123",
    "name": "Chase Checking Account",
    "type": "CHECKING",
    "balance": 5432.10,
    "currency": "USD",
    "institutionName": "Chase Bank",
    "institutionId": "chase",
    "lastFour": "1234",
    "lastSyncAt": "2025-01-21T10:30:00Z",
    "syncStatus": "completed",
    "isActive": true,
    "createdAt": "2025-01-15T00:00:00Z",
    "updatedAt": "2025-01-21T10:30:00Z",
    "recentTransactions": [
      {
        "id": "txn_001",
        "amount": -45.67,
        "description": "STARBUCKS COFFEE",
        "date": "2025-01-21T08:30:00Z",
        "pending": false
      }
    ]
  }
}
```

#### Get Transactions

```http
GET /api/v1/banking/transactions
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |
| accountId | string | - | Filter by account |
| category | string | - | Filter by category |
| startDate | ISO8601 | - | Start date filter |
| endDate | ISO8601 | - | End date filter |
| minAmount | number | - | Minimum amount |
| maxAmount | number | - | Maximum amount |
| searchText | string | - | Search merchant/description |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_001",
      "accountId": "fin_acc_123",
      "accountName": "Chase Checking Account",
      "amount": -45.67,
      "description": "STARBUCKS COFFEE",
      "merchantName": "Starbucks",
      "merchantCategory": "Coffee Shops",
      "category": "Food & Dining",
      "subcategory": "Coffee Shops",
      "date": "2025-01-21T08:30:00Z",
      "timestamp": "2025-01-21T08:30:15Z",
      "pending": false,
      "currencyCode": "USD",
      "transactionType": "debit"
    },
    {
      "id": "txn_002",
      "accountId": "fin_acc_124",
      "accountName": "Chase Savings Account",
      "amount": 1500.00,
      "description": "Direct Deposit",
      "merchantName": "EMPLOYER INC",
      "merchantCategory": "Payroll",
      "category": "Income",
      "subcategory": "Salary",
      "date": "2025-01-15T00:00:00Z",
      "timestamp": "2025-01-15T12:00:00Z",
      "pending": false,
      "currencyCode": "USD",
      "transactionType": "credit"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 523,
    "pages": 11
  },
  "summary": {
    "totalIncome": 3500.00,
    "totalExpenses": 1234.56,
    "netFlow": 2265.44,
    "transactionCount": 523
  }
}
```

#### Sync Account

```http
POST /api/v1/banking/accounts/{accountId}/sync
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "syncType": "full"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "accountId": "fin_acc_123",
    "jobId": "job_456abc",
    "status": "queued",
    "message": "Account sync queued successfully",
    "estimatedCompletionTime": "2025-01-21T10:35:00Z"
  }
}
```

#### Get Spending Analytics

```http
GET /api/v1/banking/analytics/spending/categories
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | last_30_days | last_7_days, last_30_days, last_90_days, ytd, custom |
| startDate | ISO8601 | - | Start date (for custom) |
| endDate | ISO8601 | - | End date (for custom) |
| limit | integer | 10 | Top N categories |
| accountId | string | - | Filter by account |

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "period": "last_30_days",
    "startDate": "2024-12-21",
    "endDate": "2025-01-21",
    "totalSpent": 5234.56,
    "categories": [
      {
        "category": "Food & Dining",
        "totalAmount": 1234.56,
        "percentOfTotal": 23.58,
        "transactionCount": 45,
        "change": -12.34,
        "changePercent": -0.98,
        "trend": "down",
        "topMerchants": [
          {
            "name": "Starbucks",
            "amount": 234.56,
            "count": 15
          }
        ]
      },
      {
        "category": "Shopping",
        "totalAmount": 987.65,
        "percentOfTotal": 18.87,
        "transactionCount": 12,
        "change": 45.67,
        "changePercent": 4.83,
        "trend": "up",
        "topMerchants": [
          {
            "name": "Amazon",
            "amount": 456.78,
            "count": 5
          }
        ]
      }
    ],
    "insights": [
      "Food & Dining spending is up 12% vs last month",
      "Shopping category has highest spending"
    ]
  }
}
```

---

## Net Worth Endpoints

### Base Path: `/networth`

#### Get Net Worth Summary

```http
GET /api/v1/networth
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalNetWorth": 457890.23,
      "totalAssets": 567890.12,
      "totalLiabilities": 110000.00,
      "currency": "USD",
      "asOfDate": "2025-01-21T10:30:00Z"
    },
    "breakdown": {
      "assets": {
        "cash": 35000.00,
        "crypto": 125789.45,
        "investments": 200000.00,
        "realEstate": 200000.00,
        "vehicles": 7100.67,
        "otherAssets": 0.00
      },
      "liabilities": {
        "creditCards": 5432.10,
        "loans": 30000.00,
        "mortgages": 74567.90
      }
    },
    "performance": {
      "period": "1m",
      "startValue": 445678.90,
      "endValue": 457890.23,
      "change": 12211.33,
      "changePercent": 2.74,
      "breakdownByCategory": {
        "crypto": { "change": 5678.90, "percent": 1.27 },
        "banking": { "change": 2345.67, "percent": 0.53 },
        "realEstate": { "change": 4186.76, "percent": 0.94 }
      }
    }
  }
}
```

#### Get Net Worth History

```http
GET /api/v1/networth/history
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | 1m | 1w, 1m, 3m, 6m, 1y, ytd, all |
| granularity | string | DAILY | DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY |

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "period": "1m",
    "granularity": "DAILY",
    "startDate": "2024-12-21",
    "endDate": "2025-01-21",
    "dataPoints": [
      {
        "date": "2024-12-21",
        "netWorth": 445678.90,
        "assets": 555678.90,
        "liabilities": 110000.00,
        "assetBreakdown": {
          "cash": 30000.00,
          "crypto": 120000.00,
          "investments": 200000.00,
          "realEstate": 200000.00,
          "vehicles": 5678.90
        }
      },
      {
        "date": "2024-12-22",
        "netWorth": 448123.45,
        "assets": 558123.45,
        "liabilities": 110000.00,
        "assetBreakdown": {
          "cash": 30000.00,
          "crypto": 122444.55,
          "investments": 200000.00,
          "realEstate": 200000.00,
          "vehicles": 5678.90
        }
      }
    ],
    "summary": {
      "startValue": 445678.90,
      "endValue": 457890.23,
      "change": 12211.33,
      "changePercent": 2.74,
      "highValue": 460000.00,
      "lowValue": 440000.00,
      "averageValue": 452345.67
    }
  }
}
```

#### Create Asset Account

```http
POST /api/v1/networth/accounts/assets
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Primary Residence",
  "type": "REAL_ESTATE",
  "balance": 350000.00,
  "currency": "USD",
  "assetDescription": "3BR/2BA Single Family Home",
  "originalValue": 300000.00,
  "purchaseDate": "2020-06-15",
  "appreciationRate": 3.5,
  "address": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94105"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "asset_acc_789",
    "name": "Primary Residence",
    "type": "REAL_ESTATE",
    "balance": 350000.00,
    "currency": "USD",
    "currentValue": 350000.00,
    "originalValue": 300000.00,
    "gain": 50000.00,
    "gainPercent": 16.67,
    "purchaseDate": "2020-06-15",
    "address": "123 Main Street, San Francisco, CA 94105",
    "createdAt": "2025-01-21T11:00:00Z"
  }
}
```

#### List Asset Accounts

```http
GET /api/v1/networth/accounts
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | string | - | REAL_ESTATE, VEHICLE, INVESTMENT, CUSTOM |
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "asset_acc_789",
      "name": "Primary Residence",
      "type": "REAL_ESTATE",
      "balance": 350000.00,
      "currency": "USD",
      "currentValue": 350000.00,
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 3,
    "pages": 1
  }
}
```

#### Update Asset Account

```http
PUT /api/v1/networth/accounts/{accountId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "balance": 375000.00,
  "appreciationRate": 4.0
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "asset_acc_789",
    "name": "Primary Residence",
    "balance": 375000.00,
    "currentValue": 375000.00,
    "updatedAt": "2025-01-21T11:15:00Z"
  }
}
```

#### Delete Asset Account

```http
DELETE /api/v1/networth/accounts/{accountId}
Authorization: Bearer {jwt_token}
```

**Response: 204 No Content**

#### Get Net Worth Snapshots

```http
GET /api/v1/networth/snapshots
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| granularity | string | DAILY | DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY |
| startDate | ISO8601 | - | Start date |
| endDate | ISO8601 | - | End date |
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "snap_123",
      "snapshotDate": "2025-01-21",
      "granularity": "DAILY",
      "totalNetWorth": 457890.23,
      "totalAssets": 567890.12,
      "totalLiabilities": 110000.00,
      "breakdown": {
        "cash": 35000.00,
        "crypto": 125789.45,
        "investments": 200000.00,
        "realEstate": 200000.00,
        "vehicles": 7100.67
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 92,
    "pages": 2
  }
}
```

---

## Budget Endpoints

### Base Path: `/budgets`

#### Create Budget

```http
POST /api/v1/budgets
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Monthly Groceries",
  "amount": 600.00,
  "period": "MONTHLY",
  "sourceType": "CATEGORY",
  "sourceId": "cat_food_123",
  "alerts": [
    { "threshold": 50, "enabled": true },
    { "threshold": 75, "enabled": true },
    { "threshold": 90, "enabled": true }
  ]
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "budget_123",
    "name": "Monthly Groceries",
    "amount": 600.00,
    "period": "MONTHLY",
    "sourceType": "CATEGORY",
    "sourceId": "cat_food_123",
    "spent": 0,
    "remaining": 600.00,
    "percentUsed": 0,
    "status": "ON_TRACK",
    "startDate": "2025-01-21",
    "endDate": "2025-02-20",
    "createdAt": "2025-01-21T11:00:00Z",
    "alerts": [
      {
        "id": "alert_001",
        "threshold": 50,
        "enabled": true,
        "triggered": false
      }
    ]
  }
}
```

#### List Budgets

```http
GET /api/v1/budgets
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | - | MONTHLY, QUARTERLY, YEARLY, CUSTOM |
| status | string | - | ON_TRACK, AT_RISK, EXCEEDED |
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "budget_123",
      "name": "Monthly Groceries",
      "amount": 600.00,
      "period": "MONTHLY",
      "spent": 450.00,
      "remaining": 150.00,
      "percentUsed": 75.0,
      "status": "AT_RISK",
      "startDate": "2025-01-21",
      "endDate": "2025-02-20",
      "createdAt": "2025-01-21T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 8,
    "pages": 1
  },
  "summary": {
    "totalBudgets": 8,
    "onTrack": 5,
    "atRisk": 2,
    "exceeded": 1,
    "totalBudgeted": 3500.00,
    "totalSpent": 2100.00
  }
}
```

#### Get Budget Details

```http
GET /api/v1/budgets/{budgetId}
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "budget_123",
    "name": "Monthly Groceries",
    "amount": 600.00,
    "period": "MONTHLY",
    "sourceType": "CATEGORY",
    "sourceId": "cat_food_123",
    "spent": 450.00,
    "remaining": 150.00,
    "percentUsed": 75.0,
    "status": "AT_RISK",
    "startDate": "2025-01-21",
    "endDate": "2025-02-20",
    "rolloverEnabled": false,
    "alerts": [
      {
        "id": "alert_001",
        "threshold": 50,
        "enabled": true,
        "triggered": true,
        "triggeredAt": "2025-01-20T15:30:00Z"
      }
    ],
    "transactions": [
      {
        "id": "txn_001",
        "amount": 45.67,
        "description": "STARBUCKS COFFEE",
        "date": "2025-01-20T08:30:00Z"
      }
    ],
    "createdAt": "2025-01-21T11:00:00Z"
  }
}
```

#### Update Budget

```http
PUT /api/v1/budgets/{budgetId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Monthly Groceries & Dining",
  "amount": 700.00,
  "alerts": [
    { "threshold": 50, "enabled": true },
    { "threshold": 75, "enabled": true },
    { "threshold": 90, "enabled": true },
    { "threshold": 100, "enabled": true }
  ]
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "budget_123",
    "name": "Monthly Groceries & Dining",
    "amount": 700.00,
    "spent": 450.00,
    "remaining": 250.00,
    "percentUsed": 64.3,
    "updatedAt": "2025-01-21T11:30:00Z"
  }
}
```

#### Delete Budget

```http
DELETE /api/v1/budgets/{budgetId}
Authorization: Bearer {jwt_token}
```

**Response: 204 No Content**

---

## Goals Endpoints

### Base Path: `/goals`

#### Create Goal

```http
POST /api/v1/goals
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "targetAmount": 30000.00,
  "category": "EMERGENCY_FUND",
  "targetDate": "2026-01-21",
  "sourceType": "ACCOUNT",
  "sourceId": "fin_acc_124"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "name": "Emergency Fund",
    "description": "Build 6 months of expenses",
    "targetAmount": 30000.00,
    "currentAmount": 5000.00,
    "category": "EMERGENCY_FUND",
    "targetDate": "2026-01-21",
    "status": "IN_PROGRESS",
    "percentComplete": 16.67,
    "daysRemaining": 365,
    "monthlyNeeded": 680.00,
    "createdAt": "2025-01-21T11:00:00Z"
  }
}
```

#### List Goals

```http
GET /api/v1/goals
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | - | IN_PROGRESS, COMPLETED, ABANDONED |
| category | string | - | EMERGENCY_FUND, RETIREMENT, INVESTMENT, etc. |
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "goal_123",
      "name": "Emergency Fund",
      "targetAmount": 30000.00,
      "currentAmount": 5000.00,
      "status": "IN_PROGRESS",
      "percentComplete": 16.67,
      "targetDate": "2026-01-21",
      "daysRemaining": 365,
      "monthlyNeeded": 680.00,
      "createdAt": "2025-01-21T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  }
}
```

#### Get Goal Details

```http
GET /api/v1/goals/{goalId}
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "name": "Emergency Fund",
    "description": "Build 6 months of expenses",
    "targetAmount": 30000.00,
    "currentAmount": 5000.00,
    "category": "EMERGENCY_FUND",
    "targetDate": "2026-01-21",
    "status": "IN_PROGRESS",
    "percentComplete": 16.67,
    "daysRemaining": 365,
    "monthlyNeeded": 680.00,
    "createdAt": "2025-01-21T11:00:00Z",
    "milestones": [
      {
        "id": "mile_001",
        "title": "Save $10,000",
        "targetAmount": 10000.00,
        "completed": false,
        "percentComplete": 50.0
      }
    ],
    "progress": [
      {
        "month": "2025-01-21",
        "amount": 5000.00,
        "contribution": 5000.00
      }
    ]
  }
}
```

#### Update Goal

```http
PUT /api/v1/goals/{goalId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "targetAmount": 35000.00,
  "targetDate": "2026-06-21"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "name": "Emergency Fund",
    "targetAmount": 35000.00,
    "currentAmount": 5000.00,
    "percentComplete": 14.29,
    "targetDate": "2026-06-21",
    "monthlyNeeded": 500.00,
    "updatedAt": "2025-01-21T11:30:00Z"
  }
}
```

#### Delete Goal

```http
DELETE /api/v1/goals/{goalId}
Authorization: Bearer {jwt_token}
```

**Response: 204 No Content**

---

## Organization Endpoints

### Base Path: `/organizations`

#### List User's Organizations (For Switching)

```http
GET /api/v1/organizations
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "org_personal",
      "name": "My Personal Workspace",
      "slug": "personal-workspace",
      "isPersonal": true,
      "role": "OWNER",
      "memberCount": 1,
      "createdAt": "2025-01-21T10:00:00Z"
    },
    {
      "id": "org_company",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "isPersonal": false,
      "role": "EDITOR",
      "memberCount": 5,
      "createdAt": "2025-01-15T14:30:00Z"
    }
  ]
}
```

**Note**: Use the `id` from this response as `organizationId` when calling other endpoints to switch organizations.

---

#### Create Organization



```http
POST /api/v1/organizations
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "My Company",
  "slug": "my-company",
  "description": "Manage team finances"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "My Company",
    "slug": "my-company",
    "description": "Manage team finances",
    "ownerId": "usr_123abc",
    "memberCount": 1,
    "createdAt": "2025-01-21T11:00:00Z"
  }
}
```

#### Get Organization

```http
GET /api/v1/organizations/{organizationId}
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "My Company",
    "slug": "my-company",
    "description": "Manage team finances",
    "ownerId": "usr_123abc",
    "memberCount": 3,
    "createdAt": "2025-01-21T11:00:00Z",
    "members": [
      {
        "userId": "usr_123abc",
        "role": "OWNER",
        "email": "owner@example.com",
        "joinedAt": "2025-01-21T11:00:00Z"
      }
    ]
  }
}
```

#### Invite Member

```http
POST /api/v1/organizations/{organizationId}/invite
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "email": "teammate@example.com",
  "role": "EDITOR"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "inv_123",
    "email": "teammate@example.com",
    "role": "EDITOR",
    "status": "PENDING",
    "expiresAt": "2025-01-28T11:00:00Z",
    "invitationLink": "https://app.moneymappr.com/invite?token=inv_123_token",
    "createdAt": "2025-01-21T11:00:00Z"
  }
}
```

#### Accept Invitation

```http
POST /api/v1/organizations/invitations/{invitationId}/accept
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "inv_123",
    "status": "ACCEPTED",
    "organizationId": "org_123",
    "organizationName": "My Company",
    "role": "EDITOR",
    "acceptedAt": "2025-01-21T12:00:00Z"
  }
}
```

#### Update Member Role (OWNER only)

```http
PUT /api/v1/organizations/{organizationId}/members/{memberId}/role
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "role": "VIEWER"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "member_123",
    "userId": "usr_456def",
    "role": "VIEWER",
    "email": "teammate@example.com",
    "updatedAt": "2025-01-21T13:00:00Z"
  }
}
```

#### Remove Member (OWNER only)

```http
DELETE /api/v1/organizations/{organizationId}/members/{memberId}
Authorization: Bearer {jwt_token}
```

**Response: 204 No Content**

---

## Subscription Endpoints

### Base Path: `/subscriptions`

#### Get Available Plans

```http
GET /api/v1/subscriptions/plans
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_free",
      "name": "Free",
      "description": "Perfect for getting started",
      "price": 0,
      "billingCycle": "monthly",
      "limits": {
        "maxWallets": 3,
        "maxBankAccounts": 2,
        "maxBudgets": 5,
        "maxGoals": 3,
        "maxAssetAccounts": 5
      },
      "features": [
        "Basic cryptocurrency tracking",
        "Up to 2 bank accounts",
        "Portfolio analytics",
        "Mobile app access"
      ]
    },
    {
      "id": "plan_pro",
      "name": "Pro",
      "description": "For serious investors",
      "price": 9.99,
      "billingCycle": "monthly",
      "limits": {
        "maxWallets": 50,
        "maxBankAccounts": 10,
        "maxBudgets": 20,
        "maxGoals": 10,
        "maxAssetAccounts": 20
      },
      "features": [
        "Unlimited crypto wallets",
        "Advanced DeFi tracking",
        "Bank account integration",
        "Budget planning",
        "Financial goals",
        "Priority support"
      ]
    }
  ]
}
```

#### Get Current Subscription

```http
GET /api/v1/subscriptions/current
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "userId": "usr_123abc",
    "planId": "plan_pro",
    "planName": "Pro",
    "status": "active",
    "startDate": "2025-01-01T00:00:00Z",
    "renewalDate": "2025-02-01T00:00:00Z",
    "price": 9.99,
    "billingCycle": "monthly",
    "autoRenew": true,
    "daysUntilRenewal": 11,
    "features": [
      "unlimited_wallets",
      "defi_tracking",
      "bank_integration"
    ]
  }
}
```

#### Subscribe to Plan

```http
POST /api/v1/subscriptions/subscribe
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "planId": "plan_pro",
  "paymentMethodId": "pm_123"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "sub_456",
    "planId": "plan_pro",
    "planName": "Pro",
    "status": "active",
    "startDate": "2025-01-21T12:00:00Z",
    "renewalDate": "2025-02-21T12:00:00Z",
    "message": "Subscription activated successfully"
  }
}
```

#### Change Plan

```http
PUT /api/v1/subscriptions/change-plan
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "planId": "plan_ultimate"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "planId": "plan_ultimate",
    "planName": "Ultimate",
    "status": "active",
    "effectiveDate": "2025-01-21T12:00:00Z",
    "message": "Plan changed to Ultimate"
  }
}
```

#### Cancel Subscription

```http
DELETE /api/v1/subscriptions/cancel
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "status": "cancelled",
    "cancellationDate": "2025-01-21T12:00:00Z",
    "lastBillingDate": "2025-01-21T12:00:00Z",
    "message": "Subscription cancelled"
  }
}
```

---

## Integration Endpoints

### Base Path: `/integrations`

#### Get Available Providers

```http
GET /api/v1/integrations/providers
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "provider": "QUICKBOOKS",
        "name": "QuickBooks Online",
        "description": "Sync invoices, bills, and business transactions",
        "authType": "oauth2",
        "webhookSupport": true,
        "features": ["invoices", "bills", "accounts", "customers"],
        "logo": "https://...",
        "status": "active"
      },
      {
        "provider": "PLAID",
        "name": "Plaid",
        "description": "Connect bank and investment accounts",
        "authType": "oauth2",
        "webhookSupport": true,
        "features": ["banking", "investments", "transactions"],
        "logo": "https://...",
        "status": "active"
      }
    ],
    "count": 2
  }
}
```

#### Get Connected Integrations

```http
GET /api/v1/integrations
Authorization: Bearer {jwt_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "id": "int_123",
        "provider": "QUICKBOOKS",
        "providerName": "QuickBooks Online",
        "status": "ACTIVE",
        "lastSyncAt": "2025-01-21T09:00:00Z",
        "lastSyncStatus": "SUCCESS",
        "autoSync": true,
        "syncFrequency": "DAILY",
        "connectedAt": "2025-01-15T00:00:00Z"
      }
    ],
    "count": 1
  }
}
```

#### Connect Integration

```http
POST /api/v1/integrations/{provider}/connect
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "code": "auth_code_from_provider",
  "state": "state_token"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "int_456",
    "provider": "QUICKBOOKS",
    "status": "ACTIVE",
    "connectedAt": "2025-01-21T12:00:00Z",
    "message": "QuickBooks integration connected successfully"
  }
}
```

#### Disconnect Integration

```http
DELETE /api/v1/integrations/{integrationId}
Authorization: Bearer {jwt_token}
```

**Response: 204 No Content**

---

## Admin Endpoints

### Base Path: `/admin`

**Requires**: ADMIN role

#### Get All Users

```http
GET /api/v1/admin/users
Authorization: Bearer {admin_token}
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| role | string | - | USER, PREMIUM, ADMIN |
| plan | string | - | FREE, PRO, ULTIMATE |
| page | integer | 1 | Page number |
| limit | integer | 50 | Items per page |
| search | string | - | Search email/name |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "usr_123abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "currentPlan": "PRO",
      "emailVerified": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "lastLoginAt": "2025-01-21T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "pages": 25
  }
}
```

#### Get Queue Statistics

```http
GET /api/v1/admin/queue-stats
Authorization: Bearer {admin_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "queues": [
      {
        "name": "crypto-sync",
        "processed": 1234,
        "failed": 23,
        "completed": 1211,
        "waiting": 45,
        "active": 5,
        "delayed": 0,
        "averageProcessingTime": 2345,
        "lastJobTimestamp": 1234567890,
        "healthStatus": "healthy"
      }
    ]
  }
}
```

#### Get System Analytics

```http
GET /api/v1/admin/analytics
Authorization: Bearer {admin_token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 5432,
      "active24h": 1234,
      "active7d": 3456,
      "newToday": 45
    },
    "wallets": {
      "total": 12345,
      "activeSync": 56,
      "recentSync24h": 789
    },
    "api": {
      "requestsTotal": 123456,
      "errorRate": 0.02,
      "averageResponseTime": 234,
      "topEndpoints": [
        {
          "endpoint": "GET /crypto/wallets",
          "count": 45678,
          "averageTime": 123
        }
      ]
    }
  }
}
```

---

## Webhook Endpoints

### QuickBooks Webhooks

**Base Path**: `/webhooks/quickbooks`

#### Webhook Signature Verification

```
Header: intuit-signature: sha256={signature}
```

#### Webhook Event Handler

```http
POST /api/v1/webhooks/quickbooks
Content-Type: application/json

{
  "eventNotifications": [
    {
      "realmId": "1234567890",
      "dataChangeEvent": {
        "eventIds": ["123456789"],
        "entities": [
          {
            "name": "Invoice",
            "id": "456",
            "operation": "Create",
            "lastUpdated": "2025-01-21T10:30:00Z"
          }
        ]
      }
    }
  ]
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "message": "Webhook processed successfully"
  }
}
```

---

## Error Response Examples

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request body",
  "code": "INVALID_INPUT",
  "statusCode": 400,
  "details": {
    "errors": [
      {
        "field": "email",
        "message": "must be a valid email"
      },
      {
        "field": "password",
        "message": "must be at least 8 characters"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Missing or invalid authentication token",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Wallet limit exceeded for your plan",
  "code": "PLAN_LIMIT_EXCEEDED",
  "statusCode": 403,
  "details": {
    "current": 3,
    "limit": 3,
    "plan": "FREE"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Wallet not found",
  "code": "RESOURCE_NOT_FOUND",
  "statusCode": 404
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "statusCode": 429,
  "details": {
    "retryAfter": 45,
    "limitReset": 1234567890
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "statusCode": 500,
  "details": {
    "requestId": "req_123abc",
    "message": "Please contact support with this request ID"
  }
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "error": "External service temporarily unavailable",
  "code": "PROVIDER_ERROR",
  "statusCode": 503,
  "details": {
    "provider": "zerion",
    "retryAfter": 60
  }
}
```

---

## Pagination

All list endpoints support pagination with the following parameters:

```
page=1&limit=50
```

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 523,
    "pages": 11
  }
}
```

---

## Sorting & Filtering

### Sorting

```
GET /api/v1/crypto/wallets?sort=-createdAt
```

Prefix with `-` for descending order.

### Filtering

```
GET /api/v1/banking/transactions?category=Food&minAmount=10&maxAmount=100
```

---

## Useful Curl Examples

### Get Authentication Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Add Crypto Wallet
```bash
curl -X POST http://localhost:3000/api/v1/crypto/wallets \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Wallet",
    "address": "0x1234567890abcdef...",
    "network": "ETHEREUM"
  }'
```

### Get Portfolio
```bash
curl -H "Authorization: Bearer {jwt_token}" \
  http://localhost:3000/api/v1/crypto/portfolio
```

### Connect Bank Account
```bash
curl -X POST http://localhost:3000/api/v1/banking/connect \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "enrollment": {...},
    "selectedAccountIds": ["acc_xyz789"]
  }'
```

---

## Testing the API

### Using Postman
1. Import the Swagger spec from `/docs`
2. Set Bearer token in authorization
3. Use pre-built request examples

### Using cURL
See examples above

### Using JavaScript/Node
```typescript
const response = await fetch('http://localhost:3000/api/v1/crypto/wallets', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

---

## API Status & Support

**Current Status**: Production Ready (v1.0)
**Swagger UI**: Available at `/docs`
**Support**: Email support@moneymappr.com

---

**Version**: 2.0
**Last Updated**: January 2025
**Maintained By**: Mappr Development Team
