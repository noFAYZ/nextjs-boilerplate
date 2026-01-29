# Accounts Module - API Reference

**Base Path**: `/api/v1/accounts`

## Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/groups` | Create group | 10/min |
| GET | `/groups` | List groups | 50/15min |
| GET | `/groups/{id}` | Get group | 50/15min |
| PUT | `/groups/{id}` | Update group | 10/min |
| DELETE | `/groups/{id}` | Delete group | 5/min |
| POST | `/groups/{id}/members` | Add account to group | 10/min |
| DELETE | `/groups/{id}/members/{accountId}` | Remove account | 10/min |
| GET | `/groups/{id}/portfolio` | Get group portfolio | 50/15min |
| PUT | `/{accountId}/preferences` | Update preferences | 10/min |
| GET | `/{accountId}/preferences` | Get preferences | 50/15min |
| GET | `/preferences` | Get all preferences | 50/15min |

## Sample Responses

**POST /groups** (201):
```json
{
  "success": true,
  "data": {
    "id": "grp_123",
    "name": "Emergency Fund",
    "description": "Emergency savings accounts",
    "accountCount": 0,
    "createdAt": "2025-01-18T15:00:00Z"
  }
}
```

**GET /groups/{id}/portfolio** (200):
```json
{
  "success": true,
  "data": {
    "groupId": "grp_123",
    "totalBalance": 15000.00,
    "accounts": [
      {
        "id": "acc_123",
        "balance": 10000.00,
        "type": "savings"
      },
      {
        "id": "acc_124",
        "balance": 5000.00,
        "type": "checking"
      }
    ]
  }
}
```

## Error Codes

- GROUP_NOT_FOUND: 404
- ACCOUNT_NOT_FOUND: 404
- INVALID_GROUP: 400
