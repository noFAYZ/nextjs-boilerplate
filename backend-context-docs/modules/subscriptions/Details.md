# Subscriptions Module - Details

**Path**: `src/modules/subscriptions/`

## Overview

SaaS subscription management with plan definitions, feature entitlements, usage tracking, billing cycles, and subscription lifecycle management. Integrates with payment providers for recurring billing.

**Status**: ✅ Production Ready
**Maturity**: High

---

## Features

### 1. Subscription Plans
- **Plan Types**: FREE, PRO, ULTIMATE with different feature sets
- **Pricing**: Recurring monthly/yearly billing
- **Feature Tiers**: Free: basic features, Pro: advanced, Ultimate: all features
- **Custom Plans**: Enterprise custom pricing available
- **Trial Period**: 14-day free trial for new users

### 2. Feature Entitlements
- **Plan-Based Access**: Features enabled based on subscription tier
- **Usage Limits**: Wallet limits, sync frequency, storage limits
- **Quota Tracking**: Real-time usage vs limits comparison
- **Feature Flags**: Enable/disable features per plan
- **Grandfathering**: Legacy users keep previous plan pricing

### 3. Billing & Payments
- **Recurring Billing**: Monthly/yearly subscription cycles
- **Payment Processing**: Stripe integration for payments
- **Invoice Generation**: Automatic invoice creation
- **Payment Retry**: Automatic retry on failed payments
- **Tax Calculation**: Automatic tax calculation

### 4. Subscription Lifecycle
- **Upgrade**: Change to higher tier plan
- **Downgrade**: Change to lower tier plan
- **Pause**: Temporarily pause subscription
- **Resume**: Resume paused subscription
- **Cancellation**: Cancel with retention period
- **Status Tracking**: Pending, active, paused, cancelled

### 5. Usage Analytics
- **Usage Tracking**: Monitor feature usage
- **Quota Alerts**: Alert when approaching limits
- **Usage Reports**: Monthly usage reports
- **Trend Analysis**: Usage trends over time

### 6. Billing History
- **Invoice Management**: View and download invoices
- **Payment History**: Track all payments
- **Billing Receipts**: Email receipts on payment
- **Tax Documents**: Tax summary for region

---

## Key Methods

### SubscriptionService
```
getCurrentSubscription(userId)
  → Get active subscription

getAvailablePlans()
  → Get all available plans

createSubscription(userId, planId, paymentMethod)
  → Create new subscription

upgradeSubscription(userId, newPlanId)
  → Upgrade to higher tier

downgradeSubscription(userId, newPlanId)
  → Downgrade to lower tier

cancelSubscription(userId, reason)
  → Cancel subscription

pauseSubscription(userId)
  → Pause subscription

resumeSubscription(userId)
  → Resume paused subscription

getUsageStats(userId)
  → Get usage vs limits

getInvoices(userId, filters)
  → Get invoice history

getPaymentMethods(userId)
  → Get saved payment methods
```

---

## Database Models

### Plan
- `id`, `name` (FREE/PRO/ULTIMATE)
- `priceMonthly`, `priceYearly`
- `maxWallets`, `syncFrequency`
- `features`, `description`
- `trial_days`, `created_at`

### Subscription
- `id`, `userId`, `planId`
- `status` (active/paused/cancelled)
- `currentPeriodStart`, `currentPeriodEnd`
- `billingCycleDay`, `nextBillingDate`
- `autoRenew`, `cancelledAt`
- `created_at`, `updated_at`

### UsageTracking
- `id`, `subscriptionId`, `featureName`
- `usageCount`, `limit`, `periodStart`, `periodEnd`
- `updated_at`

### Invoice
- `id`, `subscriptionId`, `amount`, `tax`
- `status` (draft/sent/paid/failed)
- `dueDate`, `paidAt`
- `createdAt`

---

## Error Handling

| Error | Code | Status |
|-------|------|--------|
| Plan not found | PLAN_NOT_FOUND | 404 |
| Subscription not found | SUBSCRIPTION_NOT_FOUND | 404 |
| Invalid plan | INVALID_PLAN | 400 |
| Payment failed | PAYMENT_FAILED | 402 |
| Cannot downgrade | CANNOT_DOWNGRADE | 400 |
| Already subscribed | ALREADY_SUBSCRIBED | 409 |

---

## Common Use Cases

### UC1: Free to Pro Upgrade
```
User on FREE plan clicks "Upgrade"
    ↓
See PRO plan features and pricing
    ↓
Enter payment method
    ↓
Upgrade processed
    ↓
User immediately gets PRO features
    ↓
First invoice generated
```

### UC2: Usage Limit Alert
```
User approaching wallet limit (3 wallets on FREE)
    ↓
System shows warning: "2 of 3 wallets used"
    ↓
Suggest upgrade to PRO (50 wallets)
    ↓
User clicks upgrade button
```

---

## API Endpoints (6+)

- GET `/plans` - List available plans
- GET `/subscription` - Get current subscription
- POST `/subscribe` - Create subscription
- PUT `/subscription/upgrade` - Upgrade plan
- PUT `/subscription/downgrade` - Downgrade plan
- DELETE `/subscription` - Cancel subscription
- POST `/subscription/pause` - Pause subscription
- POST `/subscription/resume` - Resume subscription
- GET `/usage` - Get usage stats
- GET `/invoices` - List invoices
- GET `/invoices/{id}` - Get invoice details

---

## Plans & Limits

| Feature | FREE | PRO | ULTIMATE |
|---------|------|-----|----------|
| Wallets | 3 | 50 | ∞ |
| Sync/day | 1 | 4 | ∞ |
| Accounts | 1 | 5 | ∞ |
| DeFi Tracking | ❌ | ✅ | ✅ |
| NFT Tracking | ❌ | ✅ | ✅ |
| Price | Free | $9.99/mo | $29.99/mo |

---

## Performance

- Plan definitions cached: 24 hours
- Usage stats cached: 1 hour
- Invoice pagination: 20 per page
- Database indexes on userId, planId, status
