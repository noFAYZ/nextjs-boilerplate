# User Subscriptions Module - API Reference

**Base Path**: `/api/v1/user/subscriptions`

## Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/current` | Get current plan |
| GET | `/history` | Plan history |
| GET | `/features` | Available features |
| GET | `/usage` | Usage quota |
| POST | `/usage/check` | Check usage |

## Sample Responses

**GET /current** (200):
```json
{
  "success": true,
  "data": {
    "planId": "plan_pro",
    "planName": "PRO",
    "status": "active",
    "startDate": "2025-01-18",
    "endDate": "2025-02-18",
    "autoRenew": true,
    "features": ["defi_tracking", "nft_tracking", "advanced_analytics"]
  }
}
```

**GET /features** (200):
```json
{
  "success": true,
  "data": {
    "maxWallets": { "used": 5, "limit": 50 },
    "defiTracking": { "enabled": true },
    "nftTracking": { "enabled": true },
    "advancedAnalytics": { "enabled": true }
  }
}
```

**GET /usage** (200):
```json
{
  "success": true,
  "data": {
    "wallets": { "used": 5, "limit": 50, "percentage": 10 },
    "syncCount": { "used": 8, "limit": 120, "percentage": 6.67 }
  }
}
```
