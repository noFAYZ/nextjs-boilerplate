# User Subscriptions Tracking API Documentation

## Overview
The User Subscriptions Tracking API enables users to track, manage, and analyze their recurring subscriptions (like Netflix, Spotify, Adobe, etc.). The system supports both manual subscription entry and automatic detection from bank transactions.

**Base URL**: `/api/v1/user-subscriptions`

**Authentication**: All endpoints require Bearer JWT token authentication 🔒

---

## Database Schema

### 1. UserSubscriptionTracking Model
Main model for tracking user subscriptions.

```prisma
model UserSubscriptionTracking {
  id                    String                      @id @default(cuid())
  userId                String

  // Subscription identification
  name                  String                      // e.g., "Netflix", "Spotify"
  description           String?
  category              SubscriptionCategory        @default(OTHER)

  // Pricing information
  amount                Decimal                     @db.Decimal(12, 2)
  currency              String                      @default("USD")
  billingCycle          SubscriptionBillingCycle    @default(MONTHLY)

  // Dates
  startDate             DateTime                    @default(now())
  nextBillingDate       DateTime?                   // Next expected charge date
  endDate               DateTime?                   // Cancellation/end date
  trialEndDate          DateTime?                   // Trial period end date

  // Status
  status                SubscriptionTrackingStatus  @default(ACTIVE)
  isActive              Boolean                     @default(true)

  // Source tracking
  sourceType            SubscriptionSourceType      @default(MANUAL)

  // Provider-specific fields (for auto-detected subscriptions)
  providerTransactionId String?                     // Link to original transaction
  providerName          IntegrationProvider?        // TELLER, STRIPE, PLAID, etc.
  merchantName          String?                     // Merchant/vendor name
  lastDetectedDate      DateTime?                   // Last time we detected a charge

  // Detection metadata (for auto-detected subscriptions)
  detectionConfidence   Decimal?                    @db.Decimal(3, 2)  // 0.00 to 1.00
  detectionMetadata     Json?                       // Detection algorithm metadata

  // Linked resources
  accountId             String?                     // Financial account if linked
  categoryId            String?                     // User's category for this subscription

  // Notifications & reminders
  notifyBeforeBilling   Boolean                     @default(true)
  notifyDaysBefore      Int                         @default(3)
  lastNotificationDate  DateTime?

  // Metadata
  logoUrl               String?                     // Service logo URL
  websiteUrl            String?                     // Service website
  notes                 String?                     // User notes
  tags                  String[]                    // User tags for organization

  // Auto-renewal tracking
  autoRenew             Boolean                     @default(true)
  cancellationUrl       String?                     // URL to cancel subscription

  // Cost tracking
  yearlyEstimate        Decimal?                    @db.Decimal(12, 2)  // Estimated yearly cost
  totalSpent            Decimal                     @default(0) @db.Decimal(12, 2)  // Total spent to date

  // Relations
  charges               SubscriptionCharge[]
  reminders             SubscriptionReminder[]

  createdAt             DateTime                    @default(now())
  updatedAt             DateTime                    @updatedAt

  user                  User                        @relation(fields: [userId], references: [id], onDelete: Cascade)
  account               FinancialAccount?           @relation(fields: [accountId], references: [id], onDelete: SetNull)
  userCategory          Category?                   @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([status])
  @@index([isActive])
  @@index([nextBillingDate])
  @@index([sourceType])
  @@index([providerName])
  @@index([merchantName])
  @@index([categoryId])
}
```

### 2. SubscriptionCharge Model
Individual charges/payments for a subscription.

```prisma
model SubscriptionCharge {
  id                    String                    @id @default(cuid())
  subscriptionId        String

  // Charge details
  amount                Decimal                   @db.Decimal(12, 2)
  currency              String                    @default("USD")
  chargeDate            DateTime                  @default(now())
  status                ChargeStatus              @default(COMPLETED)

  // Source tracking
  transactionId         String?                   // Link to Transaction model if available
  bankTransactionId     String?                   // Link to BankTransaction if available
  providerTransactionId String?                   // Original provider transaction ID

  // Metadata
  description           String?
  failureReason         String?                   // If charge failed
  metadata              Json?

  createdAt             DateTime                  @default(now())
  updatedAt             DateTime                  @updatedAt

  subscription          UserSubscriptionTracking  @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([subscriptionId])
  @@index([chargeDate])
  @@index([status])
}
```

### 3. SubscriptionReminder Model
Reminders for subscription events.

```prisma
model SubscriptionReminder {
  id                    String                    @id @default(cuid())
  subscriptionId        String

  // Reminder configuration
  reminderDate          DateTime                  // When to send reminder
  reminderType          ReminderType              @default(UPCOMING_CHARGE)

  // Status
  sent                  Boolean                   @default(false)
  sentAt                DateTime?

  // Message
  message               String?

  createdAt             DateTime                  @default(now())
  updatedAt             DateTime                  @updatedAt

  subscription          UserSubscriptionTracking  @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([subscriptionId])
  @@index([reminderDate])
  @@index([sent])
}
```

### Enums

```prisma
enum SubscriptionCategory {
  STREAMING             // Netflix, Hulu, Disney+
  MUSIC                 // Spotify, Apple Music
  SOFTWARE              // Adobe, Microsoft 365
  CLOUD_STORAGE         // Dropbox, Google Drive
  GAMING                // Xbox Game Pass, PlayStation Plus
  NEWS_MEDIA            // New York Times, Medium
  FITNESS               // Peloton, Strava
  PRODUCTIVITY          // Notion, Evernote
  COMMUNICATION         // Slack, Zoom
  SECURITY              // VPN, Password Manager
  FOOD_DELIVERY         // DoorDash Dash Pass, Uber Eats Pass
  TRANSPORTATION        // Public transit pass
  EDUCATION             // Coursera, Udemy
  SHOPPING              // Amazon Prime, Costco
  FINANCE               // Banking fees, investment platforms
  UTILITIES             // Internet, Phone
  INSURANCE             // Health, Auto, Life
  MEMBERSHIP            // Gym, Club memberships
  DONATIONS             // Recurring charity donations
  OTHER                 // Other subscriptions
}

enum SubscriptionBillingCycle {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
  SEMI_ANNUAL
  YEARLY
  CUSTOM
}

enum SubscriptionTrackingStatus {
  ACTIVE                // Currently active
  TRIAL                 // In trial period
  PAUSED                // Temporarily paused
  CANCELLED             // Cancelled but still active until end date
  EXPIRED               // Ended/expired
  PAYMENT_FAILED        // Payment issues
}

enum SubscriptionSourceType {
  MANUAL                // Manually added by user
  TELLER                // Detected from Teller transactions
  STRIPE                // Detected from Stripe Financial Connections
  PLAID                 // Detected from Plaid transactions
  TRANSACTION           // Detected from manual transaction entries
}

enum ChargeStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

enum ReminderType {
  UPCOMING_CHARGE       // Upcoming billing reminder
  TRIAL_ENDING          // Trial ending soon
  PRICE_INCREASE        // Price increase detected
  PAYMENT_FAILED        // Payment failure alert
  RENEWAL_SOON          // Annual renewal coming up
  CANCELLATION_REMINDER // Remind to cancel if needed
}
```

---

## API Endpoints

### 1. Create Subscription 🔒
Create a new subscription manually.

**Endpoint**: `POST /api/v1/user-subscriptions`

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "name": "Netflix Premium",
  "description": "Family streaming plan",
  "category": "STREAMING",
  "amount": 19.99,
  "currency": "USD",
  "billingCycle": "MONTHLY",
  "startDate": "2025-01-01T00:00:00Z",
  "nextBillingDate": "2025-02-01T00:00:00Z",
  "accountId": "account_123",
  "categoryId": "category_456",
  "merchantName": "Netflix",
  "logoUrl": "https://example.com/netflix-logo.png",
  "websiteUrl": "https://netflix.com",
  "notes": "Shared with family",
  "tags": ["entertainment", "family"],
  "autoRenew": true,
  "cancellationUrl": "https://netflix.com/cancel",
  "notifyBeforeBilling": true,
  "notifyDaysBefore": 3
}
```

**Required Fields**:
- `name` (string): Subscription name
- `amount` (number): Subscription cost

**Optional Fields**:
- `description` (string): Additional description
- `category` (SubscriptionCategory): Category (default: OTHER)
- `currency` (string): Currency code (default: USD)
- `billingCycle` (SubscriptionBillingCycle): Billing frequency (default: MONTHLY)
- `startDate` (string): Start date (default: now)
- `nextBillingDate` (string): Next billing date
- `endDate` (string): End date if applicable
- `trialEndDate` (string): Trial end date
- `status` (SubscriptionTrackingStatus): Status (default: ACTIVE)
- `accountId` (string): Link to financial account
- `categoryId` (string): User's category
- `merchantName` (string): Merchant/vendor name
- `logoUrl` (string): Logo URL
- `websiteUrl` (string): Website URL
- `notes` (string): User notes
- `tags` (string[]): Tags for organization
- `autoRenew` (boolean): Auto-renewal (default: true)
- `cancellationUrl` (string): Cancellation URL
- `notifyBeforeBilling` (boolean): Enable notifications (default: true)
- `notifyDaysBefore` (number): Days before billing to notify (default: 3)

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "sub_abc123",
    "userId": "user_xyz789",
    "name": "Netflix Premium",
    "description": "Family streaming plan",
    "category": "STREAMING",
    "amount": 19.99,
    "currency": "USD",
    "billingCycle": "MONTHLY",
    "startDate": "2025-01-01T00:00:00Z",
    "nextBillingDate": "2025-02-01T00:00:00Z",
    "endDate": null,
    "trialEndDate": null,
    "status": "ACTIVE",
    "isActive": true,
    "sourceType": "MANUAL",
    "providerTransactionId": null,
    "providerName": null,
    "merchantName": "Netflix",
    "lastDetectedDate": null,
    "detectionConfidence": null,
    "detectionMetadata": null,
    "accountId": "account_123",
    "categoryId": "category_456",
    "notifyBeforeBilling": true,
    "notifyDaysBefore": 3,
    "lastNotificationDate": null,
    "logoUrl": "https://example.com/netflix-logo.png",
    "websiteUrl": "https://netflix.com",
    "notes": "Shared with family",
    "tags": ["entertainment", "family"],
    "autoRenew": true,
    "cancellationUrl": "https://netflix.com/cancel",
    "yearlyEstimate": 239.88,
    "totalSpent": 0,
    "createdAt": "2025-01-21T10:00:00Z",
    "updatedAt": "2025-01-21T10:00:00Z",
    "daysUntilNextBilling": 11,
    "isInTrial": false,
    "monthlyEquivalent": 19.99
  },
  "message": "Subscription created successfully"
}
```

**Error Responses**:

`400 Bad Request` - Validation error
```json
{
  "success": false,
  "error": "Validation error message",
  "code": "VALIDATION_ERROR"
}
```

`404 Not Found` - Account or category not found
```json
{
  "success": false,
  "error": "Financial account not found",
  "code": "VALIDATION_ERROR"
}
```

---

### 2. Get All Subscriptions 🔒
Retrieve all subscriptions for the current user with filtering, sorting, and pagination.

**Endpoint**: `GET /api/v1/user-subscriptions`

**Authentication**: Required (Bearer Token)

**Query Parameters**:
- `category` (string): Filter by category
- `status` (string): Filter by status (ACTIVE, TRIAL, PAUSED, CANCELLED, EXPIRED, PAYMENT_FAILED)
- `isActive` (boolean): Filter by active status
- `sourceType` (string): Filter by source (MANUAL, TELLER, STRIPE, PLAID, TRANSACTION)
- `billingCycle` (string): Filter by billing cycle
- `providerName` (string): Filter by provider
- `accountId` (string): Filter by account
- `categoryId` (string): Filter by category
- `search` (string): Search in name, description, merchantName
- `tags` (string): Comma-separated tags
- `minAmount` (number): Minimum amount filter
- `maxAmount` (number): Maximum amount filter
- `autoRenew` (boolean): Filter by auto-renew status
- `sortBy` (string): Sort field (name, amount, nextBillingDate, startDate, createdAt, totalSpent)
- `sortOrder` (string): Sort order (asc, desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `includeCharges` (boolean): Include charge history
- `includeReminders` (boolean): Include reminders
- `chargeLimit` (number): Max charges to return (default: 10)

**Request Example**:
```
GET /api/v1/user-subscriptions?category=STREAMING&isActive=true&sortBy=amount&sortOrder=desc&page=1&limit=10
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_001",
      "userId": "user_xyz789",
      "name": "Netflix Premium",
      "category": "STREAMING",
      "amount": 19.99,
      "currency": "USD",
      "billingCycle": "MONTHLY",
      "status": "ACTIVE",
      "isActive": true,
      "sourceType": "MANUAL",
      "nextBillingDate": "2025-02-01T00:00:00Z",
      "yearlyEstimate": 239.88,
      "totalSpent": 59.97,
      "daysUntilNextBilling": 11,
      "monthlyEquivalent": 19.99,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-20T00:00:00Z"
    },
    {
      "id": "sub_002",
      "name": "Spotify Premium",
      "category": "MUSIC",
      "amount": 10.99,
      "billingCycle": "MONTHLY",
      "status": "ACTIVE",
      "monthlyEquivalent": 10.99
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### 3. Get Single Subscription 🔒
Retrieve a specific subscription by ID.

**Endpoint**: `GET /api/v1/user-subscriptions/:id`

**Authentication**: Required (Bearer Token)

**Query Parameters**:
- `includeCharges` (boolean): Include charge history
- `includeReminders` (boolean): Include reminders

**Request Example**:
```
GET /api/v1/user-subscriptions/sub_abc123?includeCharges=true&includeReminders=true
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "sub_abc123",
    "userId": "user_xyz789",
    "name": "Netflix Premium",
    "description": "Family streaming plan",
    "category": "STREAMING",
    "amount": 19.99,
    "currency": "USD",
    "billingCycle": "MONTHLY",
    "startDate": "2025-01-01T00:00:00Z",
    "nextBillingDate": "2025-02-01T00:00:00Z",
    "status": "ACTIVE",
    "isActive": true,
    "sourceType": "MANUAL",
    "tags": ["entertainment", "family"],
    "autoRenew": true,
    "yearlyEstimate": 239.88,
    "totalSpent": 59.97,
    "daysUntilNextBilling": 11,
    "monthlyEquivalent": 19.99,
    "charges": [
      {
        "id": "charge_001",
        "subscriptionId": "sub_abc123",
        "amount": 19.99,
        "currency": "USD",
        "chargeDate": "2025-01-01T00:00:00Z",
        "status": "COMPLETED",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      },
      {
        "id": "charge_002",
        "amount": 19.99,
        "chargeDate": "2024-12-01T00:00:00Z",
        "status": "COMPLETED"
      }
    ],
    "reminders": [
      {
        "id": "reminder_001",
        "subscriptionId": "sub_abc123",
        "reminderDate": "2025-01-29T00:00:00Z",
        "reminderType": "UPCOMING_CHARGE",
        "sent": false,
        "sentAt": null,
        "message": "Your Netflix subscription will be charged in 3 days",
        "createdAt": "2025-01-21T00:00:00Z"
      }
    ],
    "account": {
      "id": "account_123",
      "name": "Chase Checking",
      "type": "CHECKING"
    },
    "userCategory": {
      "id": "category_456",
      "name": "Entertainment",
      "icon": "🎬",
      "color": "#FF0000"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-20T00:00:00Z"
  }
}
```

**Error Response**: `404 Not Found`
```json
{
  "success": false,
  "error": "Subscription not found",
  "code": "SUBSCRIPTION_NOT_FOUND"
}
```

---

### 4. Update Subscription 🔒
Update an existing subscription.

**Endpoint**: `PUT /api/v1/user-subscriptions/:id`

**Authentication**: Required (Bearer Token)

**Request Body** (all fields optional):
```json
{
  "name": "Netflix Standard",
  "amount": 15.49,
  "billingCycle": "MONTHLY",
  "status": "ACTIVE",
  "isActive": true,
  "nextBillingDate": "2025-02-15T00:00:00Z",
  "notes": "Downgraded from Premium",
  "tags": ["entertainment"]
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "sub_abc123",
    "name": "Netflix Standard",
    "amount": 15.49,
    "billingCycle": "MONTHLY",
    "yearlyEstimate": 185.88,
    "updatedAt": "2025-01-21T11:00:00Z"
  },
  "message": "Subscription updated successfully"
}
```

---

### 5. Delete Subscription 🔒
Delete a subscription permanently.

**Endpoint**: `DELETE /api/v1/user-subscriptions/:id`

**Authentication**: Required (Bearer Token)

**Request**: None

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

**Error Response**: `404 Not Found`
```json
{
  "success": false,
  "error": "Subscription not found",
  "code": "SUBSCRIPTION_NOT_FOUND"
}
```

---

### 6. Add Charge to Subscription 🔒
Add a charge/payment record to a subscription.

**Endpoint**: `POST /api/v1/user-subscriptions/:id/charges`

**Authentication**: Required (Bearer Token)

**Request Body**:
```json
{
  "amount": 19.99,
  "currency": "USD",
  "chargeDate": "2025-01-21T00:00:00Z",
  "status": "COMPLETED",
  "transactionId": "txn_123",
  "bankTransactionId": "bank_txn_456",
  "providerTransactionId": "provider_789",
  "description": "Monthly subscription charge",
  "failureReason": null,
  "metadata": {
    "paymentMethod": "credit_card",
    "lastFour": "4242"
  }
}
```

**Required Fields**:
- `amount` (number): Charge amount

**Optional Fields**:
- `currency` (string): Currency code (defaults to subscription currency)
- `chargeDate` (string): Charge date (default: now)
- `status` (ChargeStatus): Charge status (default: COMPLETED)
- `transactionId` (string): Link to Transaction model
- `bankTransactionId` (string): Link to BankTransaction
- `providerTransactionId` (string): Provider's transaction ID
- `description` (string): Charge description
- `failureReason` (string): Reason if failed
- `metadata` (object): Additional metadata

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "charge_abc123",
    "subscriptionId": "sub_abc123",
    "amount": 19.99,
    "currency": "USD",
    "chargeDate": "2025-01-21T00:00:00Z",
    "status": "COMPLETED",
    "transactionId": "txn_123",
    "bankTransactionId": "bank_txn_456",
    "providerTransactionId": "provider_789",
    "description": "Monthly subscription charge",
    "failureReason": null,
    "metadata": {
      "paymentMethod": "credit_card",
      "lastFour": "4242"
    },
    "createdAt": "2025-01-21T10:00:00Z",
    "updatedAt": "2025-01-21T10:00:00Z"
  },
  "message": "Charge added successfully"
}
```

---

### 7. Get Subscription Analytics 🔒
Get comprehensive analytics for all user subscriptions.

**Endpoint**: `GET /api/v1/user-subscriptions/analytics`

**Authentication**: Required (Bearer Token)

**Request**: None

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalSubscriptions": 12,
    "activeSubscriptions": 10,
    "pausedSubscriptions": 1,
    "cancelledSubscriptions": 1,
    "trialSubscriptions": 2,
    "totalMonthlySpend": 156.89,
    "totalYearlySpend": 1882.68,
    "averageSubscriptionCost": 15.69,
    "subscriptionsByCategory": {
      "STREAMING": 3,
      "MUSIC": 2,
      "SOFTWARE": 2,
      "CLOUD_STORAGE": 1,
      "PRODUCTIVITY": 2,
      "FITNESS": 1,
      "SECURITY": 1
    },
    "subscriptionsByBillingCycle": {
      "MONTHLY": 9,
      "YEARLY": 2,
      "QUARTERLY": 1
    },
    "subscriptionsBySource": {
      "MANUAL": 8,
      "TELLER": 3,
      "STRIPE": 1
    },
    "topExpensiveSubscriptions": [
      {
        "id": "sub_001",
        "name": "Adobe Creative Cloud",
        "amount": 54.99,
        "billingCycle": "MONTHLY",
        "monthlyEquivalent": 54.99
      },
      {
        "id": "sub_002",
        "name": "Netflix Premium",
        "amount": 19.99,
        "billingCycle": "MONTHLY",
        "monthlyEquivalent": 19.99
      },
      {
        "id": "sub_003",
        "name": "Microsoft 365",
        "amount": 99.99,
        "billingCycle": "YEARLY",
        "monthlyEquivalent": 8.33
      }
    ],
    "upcomingCharges": [
      {
        "id": "sub_001",
        "subscriptionName": "Netflix Premium",
        "amount": 19.99,
        "nextBillingDate": "2025-01-25T00:00:00Z",
        "daysUntil": 4
      },
      {
        "id": "sub_002",
        "subscriptionName": "Spotify Premium",
        "amount": 10.99,
        "nextBillingDate": "2025-01-28T00:00:00Z",
        "daysUntil": 7
      }
    ],
    "spendingTrend": {
      "current30Days": 176.88,
      "previous30Days": 156.89,
      "percentageChange": 12.73
    },
    "recommendations": []
  }
}
```

---

### 8. Auto-Detect Subscriptions 🔒
Automatically detect subscriptions from bank transactions.

**Endpoint**: `POST /api/v1/user-subscriptions/detect`

**Authentication**: Required (Bearer Token)

**Request**: None (analyzes all user transactions)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalDetections": 5,
    "newSubscriptions": 3,
    "matchedExisting": 2,
    "detections": [
      {
        "subscriptionId": null,
        "isNewSubscription": true,
        "confidence": 0.95,
        "merchantName": "SPOTIFY",
        "suggestedName": "Spotify",
        "suggestedCategory": "MUSIC",
        "detectedBillingCycle": "MONTHLY",
        "amount": 10.99,
        "currency": "USD",
        "transactionId": "txn_123",
        "transactionDate": "2025-01-15T00:00:00Z",
        "detectionMetadata": {
          "matchingPattern": "SPOTIFY",
          "recurringCount": 6,
          "averageAmount": 10.99,
          "standardDeviation": 0.0,
          "lastOccurrence": "2025-01-15T00:00:00Z"
        }
      },
      {
        "subscriptionId": "sub_existing_123",
        "isNewSubscription": false,
        "confidence": 0.98,
        "merchantName": "NETFLIX",
        "suggestedName": "Netflix",
        "amount": 19.99,
        "detectionMetadata": {
          "recurringCount": 12,
          "averageAmount": 19.99
        }
      }
    ]
  },
  "message": "Found 5 potential subscriptions"
}
```

---

## Response Types

### SubscriptionResponse
```typescript
{
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: SubscriptionCategory;
  amount: number;
  currency: string;
  billingCycle: SubscriptionBillingCycle;
  startDate: Date;
  nextBillingDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  status: SubscriptionTrackingStatus;
  isActive: boolean;
  sourceType: SubscriptionSourceType;
  providerTransactionId?: string;
  providerName?: IntegrationProvider;
  merchantName?: string;
  lastDetectedDate?: Date;
  detectionConfidence?: number;  // 0.0 to 1.0
  detectionMetadata?: object;
  accountId?: string;
  categoryId?: string;
  notifyBeforeBilling: boolean;
  notifyDaysBefore: number;
  lastNotificationDate?: Date;
  logoUrl?: string;
  websiteUrl?: string;
  notes?: string;
  tags: string[];
  autoRenew: boolean;
  cancellationUrl?: string;
  yearlyEstimate?: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;

  // Computed fields
  daysUntilNextBilling?: number;
  isInTrial?: boolean;
  monthlyEquivalent?: number;

  // Related data (optional)
  charges?: SubscriptionChargeResponse[];
  reminders?: SubscriptionReminderResponse[];
  account?: { id: string; name: string; type: string; };
  userCategory?: { id: string; name: string; icon?: string; color?: string; };
}
```

### SubscriptionChargeResponse
```typescript
{
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  chargeDate: Date;
  status: ChargeStatus;
  transactionId?: string;
  bankTransactionId?: string;
  providerTransactionId?: string;
  description?: string;
  failureReason?: string;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Business Logic

### Billing Cycle Calculations

The system automatically calculates:

1. **Yearly Estimate**: Total annual cost based on billing cycle
   - `DAILY`: amount × 365
   - `WEEKLY`: amount × 52
   - `BIWEEKLY`: amount × 26
   - `MONTHLY`: amount × 12
   - `QUARTERLY`: amount × 4
   - `SEMI_ANNUAL`: amount × 2
   - `YEARLY`: amount × 1

2. **Monthly Equivalent**: Monthly cost for comparison
   - `DAILY`: amount × 30
   - `WEEKLY`: amount × 4.33
   - `BIWEEKLY`: amount × 2.17
   - `MONTHLY`: amount × 1
   - `QUARTERLY`: amount × 0.33
   - `SEMI_ANNUAL`: amount × 0.167
   - `YEARLY`: amount × 0.083

3. **Days Until Next Billing**: Calculated from `nextBillingDate`

### Subscription Detection

The auto-detection system:
1. Analyzes transactions from all sources (Teller, Stripe, Plaid, manual)
2. Identifies recurring patterns (minimum 3 occurrences)
3. Calculates confidence score (0.0 to 1.0) based on:
   - Pattern consistency
   - Amount stability (standard deviation)
   - Frequency regularity
   - Merchant name matching
4. Suggests subscription details (name, category, billing cycle)
5. Can match to existing subscriptions or create new ones

Minimum thresholds:
- **Min Confidence**: 0.7 (70%)
- **Min Recurring Count**: 3 transactions

---

## Categories & Use Cases

### Popular Categories

#### STREAMING (Netflix, Hulu, Disney+)
Typical cost: $5-20/month

#### MUSIC (Spotify, Apple Music, YouTube Music)
Typical cost: $10-15/month

#### SOFTWARE (Adobe, Microsoft 365, Figma)
Typical cost: $10-100/month

#### CLOUD_STORAGE (Dropbox, Google Drive, iCloud)
Typical cost: $5-20/month

#### GAMING (Xbox Game Pass, PlayStation Plus, Nintendo Online)
Typical cost: $10-15/month

#### FITNESS (Peloton, Strava, Apple Fitness+)
Typical cost: $10-40/month

#### PRODUCTIVITY (Notion, Evernote, Todoist)
Typical cost: $5-15/month

#### SECURITY (VPN, Password Manager, Antivirus)
Typical cost: $3-10/month

---

## Error Handling

### Error Codes

```typescript
enum SubscriptionErrorCode {
  SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_SUBSCRIPTION = 'DUPLICATE_SUBSCRIPTION',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DETECTION_ERROR = 'DETECTION_ERROR',
  CHARGE_ERROR = 'CHARGE_ERROR',
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Code Examples

### Create a Subscription (JavaScript)

```javascript
const response = await fetch('/api/v1/user-subscriptions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    name: 'Netflix Premium',
    amount: 19.99,
    category: 'STREAMING',
    billingCycle: 'MONTHLY',
    nextBillingDate: '2025-02-01T00:00:00Z',
    tags: ['entertainment', 'family']
  })
});

const result = await response.json();
console.log(result.data);
```

### Get Active Subscriptions with Filters (JavaScript)

```javascript
const params = new URLSearchParams({
  isActive: 'true',
  sortBy: 'amount',
  sortOrder: 'desc',
  includeCharges: 'true',
  limit: '20'
});

const response = await fetch(`/api/v1/user-subscriptions?${params}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const { data, pagination } = await response.json();
console.log(`Total subscriptions: ${pagination.total}`);
```

### Get Analytics (JavaScript)

```javascript
const response = await fetch('/api/v1/user-subscriptions/analytics', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const { data } = await response.json();
console.log(`Total monthly spend: $${data.totalMonthlySpend}`);
console.log(`Total yearly spend: $${data.totalYearlySpend}`);
```

### Auto-Detect Subscriptions (JavaScript)

```javascript
const response = await fetch('/api/v1/user-subscriptions/detect', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const result = await response.json();
console.log(`Found ${result.data.totalDetections} potential subscriptions`);
```

---

## Best Practices

### 1. Subscription Management
- Always set `nextBillingDate` for accurate reminders
- Use appropriate `category` for better analytics
- Add `tags` for flexible organization
- Set `cancellationUrl` to help users manage subscriptions

### 2. Cost Tracking
- Add charges when payments occur to track `totalSpent`
- Use `yearlyEstimate` for annual budget planning
- Monitor `monthlyEquivalent` for consistent comparisons

### 3. Notifications
- Enable `notifyBeforeBilling` to prevent surprise charges
- Set `notifyDaysBefore` based on user preference (typically 3-7 days)
- Update `nextBillingDate` after each charge

### 4. Detection
- Run detection periodically (monthly) to catch new subscriptions
- Review detected subscriptions with confidence < 0.8
- Match detected subscriptions to existing ones to avoid duplicates

---

## Use Cases

### Personal Finance Management
Track all recurring expenses in one place to:
- Understand monthly/yearly subscription costs
- Identify subscriptions to cancel
- Get alerts before charges
- Export data for budgeting tools

### Business Expense Tracking
Monitor company subscriptions:
- Track SaaS tools and licenses
- Allocate costs to departments/projects
- Identify redundant subscriptions
- Plan annual budget

### Family Subscription Management
Manage shared subscriptions:
- Track who uses which services
- Split costs among family members
- Avoid duplicate subscriptions
- Monitor kids' subscriptions

---

## Version History

- **v1.0.0** (2025-01-21): Initial API documentation
