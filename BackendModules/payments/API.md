# Payments Module - API Reference

**Base Path**: `/api/v1/payments`

## Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | `/payment-methods` | Add payment method | 5/min |
| GET | `/payment-methods` | List payment methods | 50/15min |
| DELETE | `/payment-methods/{id}` | Delete method | 10/min |
| POST | `/payments` | Process payment | 10/min |
| GET | `/payments` | Payment history | 50/15min |
| GET | `/payments/{id}` | Payment details | 50/15min |
| POST | `/payments/{id}/refund` | Refund payment | 5/min |

## Sample Responses

**POST /payment-methods** (201):
```json
{
  "success": true,
  "data": {
    "id": "pm_123",
    "type": "card",
    "last4": "4242",
    "expiryMonth": 12,
    "expiryYear": 2026,
    "isDefault": false,
    "createdAt": "2025-01-18T15:30:00Z"
  }
}
```

**POST /payments** (201):
```json
{
  "success": true,
  "data": {
    "id": "pay_123",
    "amount": 99.90,
    "currency": "USD",
    "status": "completed",
    "description": "PRO Plan Subscription",
    "createdAt": "2025-01-18T15:35:00Z",
    "receiptUrl": "https://..."
  }
}
```

**GET /payments** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "pay_123",
      "amount": 99.90,
      "status": "completed",
      "description": "PRO Plan",
      "date": "2025-01-18T15:35:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20
  }
}
```

## Error Codes

- PAYMENT_METHOD_NOT_FOUND: 404
- PAYMENT_NOT_FOUND: 404
- PAYMENT_FAILED: 402
- INVALID_AMOUNT: 400
