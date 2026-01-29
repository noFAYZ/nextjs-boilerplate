# External APIs Module - API Reference

**Base Path**: `/api/v1/external-apis`

## Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/providers/status` | Provider health | 50/15min |
| GET | `/zerion/portfolio` | Zerion data | 50/15min |
| GET | `/zapper/portfolio` | Zapper data | 50/15min |
| GET | `/plaid/health` | Plaid status | 50/15min |
| POST | `/sync/trigger` | Trigger sync | 3/5min |
| GET | `/health` | Overall health | 50/15min |

## Sample Responses

**GET /providers/status** (200):
```json
{
  "success": true,
  "data": {
    "zerion": {
      "status": "healthy",
      "responseTime": 145,
      "lastChecked": "2025-01-18T16:00:00Z",
      "requestsPerDay": 8750,
      "circuitBreakerState": "CLOSED"
    },
    "zapper": {
      "status": "healthy",
      "responseTime": 267,
      "lastChecked": "2025-01-18T16:00:00Z",
      "requestsPerDay": 2100,
      "circuitBreakerState": "CLOSED"
    },
    "plaid": {
      "status": "degraded",
      "responseTime": 892,
      "lastChecked": "2025-01-18T16:00:00Z",
      "lastError": "Higher latency than usual",
      "circuitBreakerState": "HALF_OPEN"
    }
  }
}
```

**GET /health** (200):
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "providersHealthy": 5,
    "providersDegraded": 1,
    "providersDown": 0,
    "averageResponseTime": 261,
    "lastUpdated": "2025-01-18T16:00:00Z"
  }
}
```

## Error Codes

- PROVIDER_UNAVAILABLE: 503
- RATE_LIMITED: 429
- INVALID_REQUEST: 400
- AUTHENTICATION_FAILED: 401
