# Admin Module - API Reference

**Base Path**: `/api/v1/admin`

**Authentication**: Admin role required

## Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/users` | List users | 50/15min |
| GET | `/users/{id}` | User details | 50/15min |
| POST | `/users/{id}/suspend` | Suspend user | 10/min |
| POST | `/users/{id}/unsuspend` | Unsuspend user | 10/min |
| DELETE | `/users/{id}` | Delete user | 5/min |
| GET | `/analytics` | System analytics | 50/15min |
| GET | `/queue/stats` | Queue statistics | 50/15min |
| GET | `/audit-logs` | Audit logs | 50/15min |
| POST | `/maintenance` | Run maintenance | 5/min |
| GET | `/health` | System health | 50/15min |
| POST | `/features/toggle` | Toggle feature flag | 10/min |
| GET | `/logs` | System logs | 50/15min |

## Sample Responses

**GET /users** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "plan": "PRO",
      "status": "active",
      "createdAt": "2024-12-01",
      "lastLoginAt": "2025-01-18T14:00:00Z"
    }
  ],
  "pagination": {
    "total": 5432,
    "limit": 20,
    "page": 1
  }
}
```

**GET /analytics** (200):
```json
{
  "success": true,
  "data": {
    "activeUsers": 2150,
    "totalUsers": 5432,
    "monthlyRecurringRevenue": 45670.50,
    "totalRevenue": 185420.00,
    "errorRate": 0.23,
    "avgResponseTime": 245,
    "period": "today"
  }
}
```

**GET /queue/stats** (200):
```json
{
  "success": true,
  "data": {
    "queues": [
      {
        "name": "crypto-sync",
        "pending": 150,
        "active": 25,
        "delayed": 10,
        "failed": 2,
        "avgProcessTime": 4500
      },
      {
        "name": "notifications",
        "pending": 320,
        "active": 50,
        "delayed": 0,
        "failed": 0,
        "avgProcessTime": 250
      }
    ]
  }
}
```

**GET /health** (200):
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "redis": "connected",
    "externalApis": "healthy",
    "uptime": 87654,
    "memoryUsage": 1234567890,
    "cpuUsage": 45.2
  }
}
```

## Error Codes

- UNAUTHORIZED: 403 (Not admin)
- USER_NOT_FOUND: 404
- INVALID_OPERATION: 400
