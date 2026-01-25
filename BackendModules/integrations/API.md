# Integrations Module - API Reference

**Base Path**: `/api/v1/integrations`

## Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/` | List integrations | 50/15min |
| POST | `/connect` | Connect service | 5/min |
| POST | `/disconnect` | Disconnect | 5/min |
| GET | `/{service}` | Get status | 50/15min |
| POST | `/{service}/sync` | Trigger sync | 3/5min |
| GET | `/logs/{service}` | Get logs | 50/15min |
| POST | `/webhooks` | Register webhook | 10/min |
| GET | `/webhooks` | List webhooks | 50/15min |
| DELETE | `/webhooks/{id}` | Delete webhook | 10/min |
| POST | `/webhooks/test/{id}` | Test webhook | 5/min |

## Sample Responses

**GET /** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "integ_123",
      "serviceName": "plaid",
      "status": "connected",
      "connectedAt": "2025-01-18",
      "lastSyncAt": "2025-01-18T15:00:00Z"
    }
  ]
}
```

**POST /connect** (201):
```json
{
  "success": true,
  "data": {
    "id": "integ_124",
    "serviceName": "teller",
    "status": "connected",
    "connectedAt": "2025-01-18T16:00:00Z"
  }
}
```

**POST /webhooks** (201):
```json
{
  "success": true,
  "data": {
    "id": "wh_123",
    "event": "portfolio_updated",
    "url": "https://example.com/webhook",
    "active": true,
    "secret": "wh_secret_xyz"
  }
}
```
