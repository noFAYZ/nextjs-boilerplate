# Subscriptions Module - API Reference

**Base Path**: `/api/v1/subscriptions`

---

## Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| GET | `/plans` | List available plans | 50/15min |
| GET | `/current` | Get current subscription | 50/15min |
| POST | `/subscribe` | Create subscription | 5/min |
| PUT | `/upgrade` | Upgrade plan | 5/min |
| PUT | `/downgrade` | Downgrade plan | 5/min |
| DELETE | `/` | Cancel subscription | 5/min |
| POST | `/pause` | Pause subscription | 5/min |
| POST | `/resume` | Resume subscription | 5/min |
| GET | `/usage` | Get usage stats | 50/15min |
| GET | `/invoices` | List invoices | 50/15min |
| GET | `/invoices/{id}` | Get invoice | 50/15min |

---

## Key Endpoints

### List Plans
**GET /plans**
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_free",
      "name": "FREE",
      "priceMonthly": 0,
      "priceYearly": 0,
      "maxWallets": 3,
      "syncFrequency": 1,
      "features": ["basic_portfolio", "transaction_history"],
      "trialDays": 0
    },
    {
      "id": "plan_pro",
      "name": "PRO",
      "priceMonthly": 9.99,
      "priceYearly": 99.90,
      "maxWallets": 50,
      "syncFrequency": 4,
      "features": ["all_wallets", "defi_tracking", "nft_tracking"],
      "trialDays": 14
    }
  ]
}
```

### Get Current Subscription
**GET /current**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "plan": "PRO",
    "status": "active",
    "currentPeriodStart": "2025-01-18",
    "currentPeriodEnd": "2025-02-18",
    "nextBillingDate": "2025-02-18",
    "amount": 9.99,
    "billingCycle": "monthly",
    "autoRenew": true,
    "features": ["all_wallets", "defi_tracking", "nft_tracking"]
  }
}
```

### Upgrade Plan
**PUT /upgrade**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "plan": "ULTIMATE",
    "status": "active",
    "amount": 29.99,
    "upgradeApplied": true,
    "nextBillingDate": "2025-02-18"
  }
}
```

### Get Usage Stats
**GET /usage**
```json
{
  "success": true,
  "data": {
    "wallets": {
      "used": 5,
      "limit": 50,
      "percentage": 10
    },
    "transactions": {
      "used": 1250,
      "limit": "unlimited",
      "percentage": 0
    },
    "syncCount": {
      "used": 8,
      "limit": 120,
      "period": "monthly",
      "percentage": 6.67
    }
  }
}
```

### List Invoices
**GET /invoices**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_123",
      "date": "2025-01-18",
      "amount": 9.99,
      "tax": 0.80,
      "total": 10.79,
      "status": "paid",
      "paidAt": "2025-01-18",
      "downloadUrl": "https://api.mappr.com/invoices/inv_123/pdf"
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 20
  }
}
```

---

## Error Codes

| Code | Status |
|------|--------|
| PLAN_NOT_FOUND | 404 |
| SUBSCRIPTION_NOT_FOUND | 404 |
| INVALID_PLAN | 400 |
| PAYMENT_FAILED | 402 |
| CANNOT_DOWNGRADE | 400 |
| ALREADY_SUBSCRIBED | 409 |
