# Usage Module - Details

**Path**: `src/modules/usage/`

## Overview

Feature usage tracking and quota management. Monitors user activity and enforces plan-based limits on features.

**Status**: ✅ Production Ready
**Maturity**: Medium

---

## Features

### 1. Usage Tracking
- Track all feature usage events
- Real-time usage counters
- Usage per billing cycle
- Historical usage data

### 2. Quota Management
- Plan-based quotas
- Hard limits enforcement
- Soft limits with warnings
- Grace periods

### 3. Analytics
- Usage statistics per user
- Feature adoption metrics
- Usage trends
- Billing cycle analysis

---

## Key Methods

```
recordUsage(userId, featureName, amount)
  → Record usage event

getUsage(userId, featureName)
  → Get current usage

checkQuota(userId, featureName, amount)
  → Check if usage allowed

resetMonthlyUsage()
  → Reset usage at cycle end

getUsageAnalytics(userId, period)
  → Get usage statistics
```

---

## Database Models

- **UsageEvent**: id, userId, featureName, amount, timestamp
- **UsageQuota**: id, subscriptionId, featureName, used, limit, periodEnd

---

## API Endpoints (3+)

- GET `/usage/{feature}` - Get feature usage
- GET `/usage` - All usage
- POST `/usage/check` - Check if usage allowed
