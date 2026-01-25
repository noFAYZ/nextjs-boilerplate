# Usage Module - API Reference

**Base Path**: `/api/v1/usage`

## Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/{feature}` | Get feature usage |
| GET | `/` | All usage |
| POST | `/check` | Check quota |
| GET | `/analytics` | Usage analytics |

## Responses

**GET /{feature}** (200):
```json
{
  "success": true,
  "data": {
    "feature": "wallets",
    "used": 5,
    "limit": 50,
    "percentage": 10,
    "periodEnd": "2025-02-18"
  }
}
```

**POST /check** (200):
```json
{
  "success": true,
  "data": {
    "allowed": true,
    "remaining": 45
  }
}
```
