# User Subscriptions Module - Details

**Path**: `src/modules/user-subscriptions/`

## Overview

User subscription lifecycle management, plan tracking, and feature entitlements. Manages active subscriptions, trial periods, and plan changes.

**Status**: ✅ Production Ready
**Maturity**: High

---

## Features

### 1. Subscription Tracking
- Track active user subscriptions
- Plan assignment and management
- Trial period tracking
- Subscription status monitoring

### 2. Plan Limits Enforcement
- Enforce plan-based feature limits
- Wallet limits, sync frequency, storage
- Usage quota management
- Upgrade prompts when limits approached

### 3. Plan Changes
- Track plan history
- Upgrade/downgrade tracking
- Proration calculations
- Grace periods for downgrades

---

## Key Methods

```
getCurrentPlan(userId)
  → Get active plan and entitlements

checkFeatureAccess(userId, feature)
  → Check if feature is available

getUsageQuota(userId, feature)
  → Get usage limit for feature

recordUsage(userId, feature, amount)
  → Record feature usage

updatePlan(userId, newPlanId)
  → Change user's plan
```

---

## Database Models

- **UserSubscription**: id, userId, planId, status, startDate, endDate
- **SubscriptionHistory**: id, userId, planId, startDate, endDate
- **FeatureAccess**: id, userId, featureName, enabled, limit

---

## API Endpoints (5+)

- GET `/current` - Get current plan
- GET `/history` - Plan history
- GET `/features` - Available features
- GET `/usage` - Usage quota
- POST `/upgrade-prompt` - Check upgrade suggestion
