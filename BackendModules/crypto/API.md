# Crypto Module - API Reference

## Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/crypto/wallets` | Create wallet |
| GET | `/api/v1/crypto/wallets` | List user wallets |
| GET | `/api/v1/crypto/wallets/:id` | Get wallet details |
| PUT | `/api/v1/crypto/wallets/:id` | Update wallet |
| DELETE | `/api/v1/crypto/wallets/:id` | Delete wallet |
| GET | `/api/v1/crypto/portfolio` | Get aggregated portfolio |
| GET | `/api/v1/crypto/portfolio/chart` | Portfolio chart data |
| GET | `/api/v1/crypto/wallets/:id/transactions` | Get wallet transactions |
| GET | `/api/v1/crypto/wallets/:id/nfts` | Get wallet NFTs |
| GET | `/api/v1/crypto/wallets/:id/defi` | Get DeFi positions |
| POST | `/api/v1/crypto/wallets/:id/sync` | Trigger wallet sync |
| GET | `/api/v1/crypto/wallets/:id/sync/status` | Get sync status |
| GET | `/api/v1/crypto/user/sync/stream` | SSE real-time progress |
| GET | `/api/v1/crypto/providers/status` | Provider health status |

---

## Wallet Operations

### Create Wallet
```http
POST /api/v1/crypto/wallets
Authorization: Bearer <JWT>
Content-Type: application/json

Request Body:
{
  "address": "0x742d35Cc6634C0532925a3b844Bc555e5b11dBe",
  "network": "ethereum",
  "name": "My Main Wallet",
  "type": "EOA"
}

Response (201):
{
  "id": "wallet_abc123",
  "userId": "user_123",
  "address": "0x742d35Cc6634C0532925a3b844Bc555e5b11dBe",
  "network": "ethereum",
  "name": "My Main Wallet",
  "type": "EOA",
  "totalBalanceUsd": null,
  "totalBalanceNative": null,
  "lastSyncAt": null,
  "syncing": false,
  "createdAt": "2025-01-18T10:00:00Z",
  "updatedAt": "2025-01-18T10:00:00Z"
}
```

### Get User Wallets
```http
GET /api/v1/crypto/wallets?page=1&limit=10&network=ethereum
Authorization: Bearer <JWT>

Response (200):
{
  "data": [
    {
      "id": "wallet_1",
      "address": "0x742d35Cc6634C0532925a3b844Bc555e5b11dBe",
      "network": "ethereum",
      "name": "My Main Wallet",
      "totalBalanceUsd": 125000,
      "lastSyncAt": "2025-01-18T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "hasMore": false
  }
}
```

### Get Wallet Details
```http
GET /api/v1/crypto/wallets/wallet_abc123
Authorization: Bearer <JWT>

Response (200):
{
  "id": "wallet_abc123",
  "address": "0x742d35Cc6634C0532925a3b844Bc555e5b11dBe",
  "network": "ethereum",
  "name": "My Main Wallet",
  "type": "EOA",
  "totalBalanceUsd": 125000,
  "totalBalanceNative": 50.5,
  "lastSyncAt": "2025-01-18T09:00:00Z",
  "syncing": false,
  "assets": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "balance": 50.5,
      "balanceUsd": 95000,
      "priceUsd": 1881.19,
      "changePercent24h": 2.5
    },
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "balance": 30000,
      "balanceUsd": 30000,
      "priceUsd": 1.0,
      "changePercent24h": 0
    }
  ]
}
```

### Update Wallet
```http
PUT /api/v1/crypto/wallets/wallet_abc123
Authorization: Bearer <JWT>
Content-Type: application/json

Request Body:
{
  "name": "Updated Wallet Name"
}

Response (200):
{
  "id": "wallet_abc123",
  "name": "Updated Wallet Name",
  "updatedAt": "2025-01-18T10:05:00Z"
}
```

### Delete Wallet
```http
DELETE /api/v1/crypto/wallets/wallet_abc123
Authorization: Bearer <JWT>

Response (204): No Content
```

---

## Portfolio Operations

### Get Aggregated Portfolio
```http
GET /api/v1/crypto/portfolio?includeChart=true&days=30
Authorization: Bearer <JWT>

Response (200):
{
  "totalBalanceUsd": 250000,
  "totalChangeUsd": 12500,
  "totalChangePercent": 5.25,
  "lastUpdatedAt": "2025-01-18T10:00:00Z",
  "wallets": [
    {
      "id": "wallet_1",
      "address": "0x742d35Cc6634C0532925a3b844Bc555e5b11dBe",
      "network": "ethereum",
      "balanceUsd": 180000,
      "assetCount": 8,
      "nftCount": 3,
      "defiPositionCount": 2,
      "lastSyncAt": "2025-01-18T09:00:00Z"
    },
    {
      "id": "wallet_2",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "network": "polygon",
      "balanceUsd": 70000,
      "assetCount": 5,
      "nftCount": 0,
      "defiPositionCount": 1,
      "lastSyncAt": "2025-01-18T08:30:00Z"
    }
  ],
  "topAssets": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "balance": 50.5,
      "balanceUsd": 95000,
      "priceUsd": 1881.19,
      "changePercent24h": 2.5,
      "network": "ethereum"
    },
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "balance": 50000,
      "balanceUsd": 50000,
      "priceUsd": 1.0,
      "changePercent24h": 0,
      "network": "ethereum"
    }
  ],
  "byNetwork": {
    "ethereum": 180000,
    "polygon": 70000
  },
  "chart": [
    {
      "date": "2025-01-18",
      "value": 250000,
      "change": 5000
    },
    {
      "date": "2025-01-17",
      "value": 245000,
      "change": 8000
    }
  ]
}
```

### Get Portfolio Chart
```http
GET /api/v1/crypto/portfolio/chart?days=30&granularity=daily
Authorization: Bearer <JWT>

Response (200):
{
  "data": [
    {
      "date": "2025-01-18",
      "value": 250000,
      "change": 5000,
      "changePercent": 2.04
    },
    {
      "date": "2025-01-17",
      "value": 245000,
      "change": -3000,
      "changePercent": -1.21
    }
  ],
  "summary": {
    "min": 220000,
    "max": 250000,
    "avg": 237500,
    "current": 250000,
    "totalChange": 12500,
    "totalChangePercent": 5.25
  }
}
```

---

## Transactions

### Get Wallet Transactions
```http
GET /api/v1/crypto/wallets/wallet_abc123/transactions?limit=20&offset=0
Authorization: Bearer <JWT>

Response (200):
{
  "total": 342,
  "transactions": [
    {
      "id": "txn_abc",
      "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "from": "0x742d35Cc6634C0532925a3b844Bc555e5b11dBe",
      "to": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "value": 10.5,
      "valueUsd": 31500,
      "type": "transfer",
      "status": "completed",
      "network": "ethereum",
      "gasUsed": "21000",
      "gasPrice": "45.5",
      "timestamp": "2025-01-18T09:15:00Z",
      "blockNumber": 19123456
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 20,
    "total": 342,
    "hasMore": true
  }
}
```

---

## NFTs

### Get Wallet NFTs
```http
GET /api/v1/crypto/wallets/wallet_abc123/nfts
Authorization: Bearer <JWT>

Response (200):
{
  "total": 5,
  "nfts": [
    {
      "id": "nft_abc",
      "contractAddress": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
      "tokenId": "1",
      "name": "BAYC #1",
      "description": "Bored Ape Yacht Club",
      "image": "https://ipfs.io/ipfs/QmRRPWG96cmgM4vwNYcmgTVajt8Ls2fnVYPBDNKVEQVSaN",
      "collectionName": "Bored Ape Yacht Club",
      "floorPriceUsd": 45000,
      "estimatedValueUsd": 45000,
      "network": "ethereum"
    },
    {
      "id": "nft_def",
      "contractAddress": "0x49cf6f5d44e70224e2e23fdcdd2c053f30289574",
      "tokenId": "5843",
      "name": "Pudgy Penguin #5843",
      "collectionName": "Pudgy Penguins",
      "floorPriceUsd": 2500,
      "estimatedValueUsd": 2500,
      "network": "ethereum"
    }
  ]
}
```

---

## DeFi Positions

### Get DeFi Positions
```http
GET /api/v1/crypto/wallets/wallet_abc123/defi
Authorization: Bearer <JWT>

Response (200):
{
  "positions": [
    {
      "id": "defi_pos_1",
      "appId": "aave-v3",
      "protocol": "Aave",
      "protocolVersion": "v3",
      "type": "lending",
      "network": "ethereum",
      "baseToken": {
        "symbol": "USDC",
        "name": "USD Coin",
        "balance": 50000,
        "balanceUsd": 50000,
        "decimals": 6
      },
      "underlyingTokens": [
        {
          "symbol": "USDC",
          "balance": 50000,
          "balanceUsd": 50000
        }
      ],
      "apy": 4.25,
      "totalValueUsd": 50000,
      "updatedAt": "2025-01-18T10:00:00Z"
    },
    {
      "id": "defi_pos_2",
      "appId": "uniswap-v3",
      "protocol": "Uniswap",
      "type": "liquidity",
      "network": "ethereum",
      "baseToken": {
        "symbol": "ETH-USDC",
        "name": "ETH-USDC LP",
        "balance": 1.5,
        "balanceUsd": 2850,
        "decimals": 18
      },
      "underlyingTokens": [
        {
          "symbol": "ETH",
          "balance": 1.2,
          "balanceUsd": 2268
        },
        {
          "symbol": "USDC",
          "balance": 582,
          "balanceUsd": 582
        }
      ],
      "apy": null,
      "totalValueUsd": 2850,
      "updatedAt": "2025-01-18T10:00:00Z"
    }
  ],
  "totalDefiValueUsd": 52850,
  "protocolBreakdown": {
    "aave": 50000,
    "uniswap": 2850
  }
}
```

---

## Sync Operations

### Trigger Wallet Sync
```http
POST /api/v1/crypto/wallets/wallet_abc123/sync
Authorization: Bearer <JWT>
Content-Type: application/json

Request Body:
{
  "syncTypes": ["assets", "transactions", "defi", "nfts"]
}

Response (202):
{
  "jobId": "job_abc123def456",
  "status": "queued",
  "walletId": "wallet_abc123",
  "message": "Wallet sync initiated"
}
```

### Get Sync Status
```http
GET /api/v1/crypto/wallets/wallet_abc123/sync/status
Authorization: Bearer <JWT>

Response (200):
{
  "walletId": "wallet_abc123",
  "jobId": "job_abc123def456",
  "syncStatus": "in_progress",
  "progress": 45,
  "startedAt": "2025-01-18T10:00:00Z",
  "estimatedCompletionTime": "2025-01-18T10:05:00Z",
  "lastSyncAt": "2025-01-18T09:30:00Z",
  "stages": {
    "assets": { "status": "completed", "progress": 100 },
    "transactions": { "status": "in_progress", "progress": 45 },
    "defi": { "status": "pending", "progress": 0 },
    "nfts": { "status": "pending", "progress": 0 }
  }
}
```

### Real-time Sync Progress (SSE)
```http
GET /api/v1/crypto/user/sync/stream
Authorization: Bearer <JWT>

Response (200):
Content-Type: text/event-stream
Transfer-Encoding: chunked
Cache-Control: no-cache
Connection: keep-alive

event: sync_progress
data: {
  "walletId": "wallet_abc123",
  "status": "syncing_assets",
  "progress": 20,
  "timestamp": "2025-01-18T10:00:00Z"
}

event: sync_progress
data: {
  "walletId": "wallet_abc123",
  "status": "syncing_transactions",
  "progress": 50,
  "timestamp": "2025-01-18T10:00:05Z"
}

event: sync_progress
data: {
  "walletId": "wallet_abc123",
  "status": "syncing_defi",
  "progress": 75,
  "timestamp": "2025-01-18T10:00:10Z"
}

event: sync_complete
data: {
  "walletId": "wallet_abc123",
  "progress": 100,
  "totalTime": 15234,
  "timestamp": "2025-01-18T10:00:15Z"
}
```

---

## Provider Status

### Check Provider Health
```http
GET /api/v1/crypto/providers/status
Authorization: Bearer <JWT>

Response (200):
{
  "zerion": {
    "status": "healthy",
    "responseTime": 234,
    "lastChecked": "2025-01-18T10:00:00Z",
    "requestsPerDay": 1250,
    "lastError": null
  },
  "zapper": {
    "status": "healthy",
    "responseTime": 456,
    "lastChecked": "2025-01-18T10:00:00Z",
    "requestsPerDay": 890,
    "lastError": null
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid wallet address format",
  "code": "INVALID_WALLET",
  "statusCode": 400,
  "timestamp": "2025-01-18T10:00:00Z"
}
```

### 403 Forbidden (Plan Limit)
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
  },
  "timestamp": "2025-01-18T10:00:00Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Wallet not found",
  "code": "WALLET_NOT_FOUND",
  "statusCode": 404,
  "timestamp": "2025-01-18T10:00:00Z"
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "error": "Failed to sync wallet",
  "code": "WALLET_SYNC_FAILED",
  "statusCode": 503,
  "details": {
    "provider": "zerion",
    "message": "Provider temporarily unavailable"
  },
  "timestamp": "2025-01-18T10:00:00Z"
}
```

---

## Query Parameters

### Pagination
- `page` (default: 1) - Page number
- `limit` (default: 20, max: 100) - Items per page
- `offset` - Alternative to page

### Filtering
- `network` - Filter by blockchain network
- `type` - Filter by wallet type (EOA, CONTRACT, SAFE)
- `status` - Filter by sync status

### Chart Data
- `days` - Time period (7, 30, 90)
- `granularity` - hourly, daily, weekly

---

## Rate Limits

- **General**: 100 requests per 15 minutes
- **Sync**: 3 requests per 5 minutes per wallet
- **Live Data**: 50 requests per minute

Remaining quota in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705596000
```
