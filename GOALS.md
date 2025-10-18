# Goals System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Reference](#api-reference)
5. [Request/Response Examples](#requestresponse-examples)
6. [Background Jobs](#background-jobs)
7. [Integration Guide](#integration-guide)
8. [Business Logic](#business-logic)
9. [Error Handling](#error-handling)
10. [Testing](#testing)

---

## Overview

The Goals System is a comprehensive financial goal tracking solution that integrates with both cryptocurrency portfolios and traditional banking accounts. It enables users to set financial targets and automatically track progress using real-time data from connected accounts.

### Key Features
- **9 Goal Types**: Savings, Emergency Fund, Investment, Crypto, Debt Payoff, Net Worth, Spending Limit, Income, Custom
- **Multi-Source Tracking**: Bank accounts, crypto wallets, account groups, or entire portfolio
- **Real-time Progress**: Auto-calculated from linked sources
- **Milestone System**: Track progress with custom checkpoints
- **Historical Snapshots**: Daily progress history
- **Velocity Tracking**: Monitor contribution rates (daily/weekly/monthly)
- **Smart Projections**: AI-powered completion date predictions
- **Plan-Based Limits**: FREE (2 goals), PRO (10 goals), ULTIMATE (unlimited)

---

## Architecture

### Module Structure
```
src/modules/goals/
├── types/
│   └── index.ts                  # TypeScript interfaces, enums, DTOs
├── services/
│   └── goalsService.ts          # Business logic & calculations
├── controllers/
│   └── goalsController.ts       # API request handlers
├── routes/
│   └── index.ts                 # Express routes
├── jobs/
│   └── goalsJobs.ts             # Background job processors
└── README.md                     # Module documentation
```

### Tech Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Redis with BullMQ
- **API**: Express.js with JWT authentication
- **External APIs**: Zerion SDK, Zapper GraphQL

### Data Flow
```
User Request → Controller → Service → Database
                                    ↓
                            External APIs (Bank/Crypto)
                                    ↓
                            Background Jobs → Snapshots
```

---

## Database Schema

### Goal Model
```prisma
model Goal {
  id                   String            @id @default(cuid())
  userId               String

  // Identification
  name                 String
  description          String?
  icon                 String?           // Emoji or icon identifier
  color                String?           // Hex color for UI

  // Classification
  type                 GoalType
  category             GoalCategory?
  priority             GoalPriority      @default(MEDIUM)

  // Financial targets
  targetAmount         Decimal           @db.Decimal(12, 2)
  startingAmount       Decimal           @default(0) @db.Decimal(12, 2)
  currentAmount        Decimal           @default(0) @db.Decimal(12, 2)
  currency             String            @default("USD")

  // Dates
  startDate            DateTime          @default(now())
  targetDate           DateTime
  achievedDate         DateTime?

  // Progress tracking
  isAchieved           Boolean           @default(false)
  progress             Decimal           @default(0) @db.Decimal(5, 2)
  lastCalculatedAt     DateTime?

  // Contribution tracking
  totalContributions   Decimal           @default(0) @db.Decimal(12, 2)
  recurringAmount      Decimal?          @db.Decimal(12, 2)
  contributionFrequency String?

  // Projections
  projectedCompletionDate DateTime?
  estimatedMonthlyContribution Decimal? @db.Decimal(12, 2)
  onTrack              Boolean           @default(true)

  // Source configuration
  sourceType           GoalSourceType    @default(MANUAL)
  accountId            String?
  cryptoWalletId       String?
  accountGroupId       String?
  trackAllAccounts     Boolean           @default(false)
  trackAllCrypto       Boolean           @default(false)
  sourceConfig         Json?

  // Relations
  milestones           GoalMilestone[]
  snapshots            GoalSnapshot[]
  account              FinancialAccount? @relation(fields: [accountId], references: [id])
  cryptoWallet         CryptoWallet?     @relation(fields: [cryptoWalletId], references: [id])
  accountGroup         AccountGroup?     @relation(fields: [accountGroupId], references: [id])
  user                 User              @relation(fields: [userId], references: [id])

  // Metadata
  tags                 String[]
  notes                String?
  isActive             Boolean           @default(true)
  isArchived           Boolean           @default(false)
  notifyOnMilestone    Boolean           @default(true)
  notifyOnCompletion   Boolean           @default(true)
  lastNotificationAt   DateTime?

  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  @@index([userId])
  @@index([type])
  @@index([category])
  @@index([isAchieved])
  @@index([isActive])
  @@index([targetDate])
  @@index([priority])
  @@map("goals")
}
```

### GoalMilestone Model
```prisma
model GoalMilestone {
  id               String    @id @default(cuid())
  goalId           String

  name             String
  description      String?
  targetAmount     Decimal   @db.Decimal(12, 2)
  targetPercentage Decimal   @db.Decimal(5, 2)

  isAchieved       Boolean   @default(false)
  achievedDate     DateTime?
  achievedAmount   Decimal?  @db.Decimal(12, 2)

  celebration      String?   // Custom celebration message
  sortOrder        Int       @default(0)

  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  goal             Goal      @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@index([goalId])
  @@index([isAchieved])
  @@map("goal_milestones")
}
```

### GoalSnapshot Model
```prisma
model GoalSnapshot {
  id                  String    @id @default(cuid())
  goalId              String

  // Snapshot data
  currentAmount       Decimal   @db.Decimal(12, 2)
  progress            Decimal   @db.Decimal(5, 2)
  contributionAmount  Decimal?  @db.Decimal(12, 2)

  // Context data
  bankBalance         Decimal?  @db.Decimal(12, 2)
  cryptoBalance       Decimal?  @db.Decimal(12, 2)
  totalAssets         Decimal?  @db.Decimal(12, 2)

  // Velocity tracking
  dailyVelocity       Decimal?  @db.Decimal(12, 2)
  weeklyVelocity      Decimal?  @db.Decimal(12, 2)
  monthlyVelocity     Decimal?  @db.Decimal(12, 2)

  // Projections
  projectedCompletion DateTime?
  daysToCompletion    Int?
  onTrack             Boolean   @default(true)

  snapshotDate        DateTime  @default(now())
  createdAt           DateTime  @default(now())

  goal                Goal      @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@index([goalId])
  @@index([snapshotDate])
  @@map("goal_snapshots")
}
```

### Enums

```prisma
enum GoalType {
  SAVINGS           // General savings goal
  EMERGENCY_FUND    // Emergency fund goal
  INVESTMENT        // Investment portfolio goal
  CRYPTO            // Crypto portfolio goal
  DEBT_PAYOFF       // Debt reduction goal
  NET_WORTH         // Net worth target
  SPENDING_LIMIT    // Monthly spending limit
  INCOME            // Income target
  CUSTOM            // Custom goal type
}

enum GoalCategory {
  PERSONAL          // Personal finance
  FAMILY            // Family savings
  EDUCATION         // Education fund
  RETIREMENT        // Retirement savings
  TRAVEL            // Travel fund
  HOME              // Home purchase/improvement
  VEHICLE           // Vehicle purchase
  BUSINESS          // Business investment
  HEALTH            // Healthcare/wellness
  OTHER             // Other category
}

enum GoalPriority {
  CRITICAL          // Critical/urgent goal
  HIGH              // High priority
  MEDIUM            // Medium priority
  LOW               // Low priority
}

enum GoalSourceType {
  MANUAL            // Manual updates only
  BANK_ACCOUNT      // Track specific bank account
  CRYPTO_WALLET     // Track specific crypto wallet
  ACCOUNT_GROUP     // Track account group
  ALL_ACCOUNTS      // Track all bank accounts
  ALL_CRYPTO        // Track all crypto wallets
  PORTFOLIO         // Track entire portfolio (bank + crypto)
}
```

---

## API Reference

### Base URL
```
/api/v1/goals
```

### Authentication
All endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

### 1. Create Goal

**Endpoint:** `POST /api/v1/goals`

**Description:** Create a new financial goal with optional milestones.

**Request Schema:**
```typescript
{
  // Required fields
  name: string;                    // Goal name (max 100 chars)
  type: GoalType;                  // Goal type enum
  targetAmount: number;            // Target amount (USD)
  targetDate: string;              // ISO 8601 date
  sourceType: GoalSourceType;      // Source type enum

  // Optional fields
  description?: string;            // Goal description (max 500 chars)
  icon?: string;                   // Icon/emoji identifier
  color?: string;                  // Hex color (#RRGGBB)
  category?: GoalCategory;         // Category enum
  priority?: GoalPriority;         // Priority enum (default: MEDIUM)
  startingAmount?: number;         // Starting amount (default: 0)
  currency?: string;               // Currency code (default: USD)
  startDate?: string;              // ISO 8601 date (default: now)
  recurringAmount?: number;        // Monthly contribution target
  contributionFrequency?: string;  // DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY

  // Source configuration (conditional based on sourceType)
  accountId?: string;              // Required if sourceType = BANK_ACCOUNT
  cryptoWalletId?: string;         // Required if sourceType = CRYPTO_WALLET
  accountGroupId?: string;         // Required if sourceType = ACCOUNT_GROUP
  trackAllAccounts?: boolean;      // For ALL_ACCOUNTS or PORTFOLIO
  trackAllCrypto?: boolean;        // For ALL_CRYPTO or PORTFOLIO
  sourceConfig?: object;           // Additional source config

  // Milestones
  milestones?: Array<{
    name: string;
    description?: string;
    targetPercentage: number;      // 0-100
    celebration?: string;
    sortOrder?: number;
  }>;

  // Metadata
  tags?: string[];
  notes?: string;
  notifyOnMilestone?: boolean;     // Default: true
  notifyOnCompletion?: boolean;    // Default: true
}
```

**Request Example:**
```json
{
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses for financial security",
  "icon": "💰",
  "color": "#22C55E",
  "type": "EMERGENCY_FUND",
  "category": "PERSONAL",
  "priority": "CRITICAL",
  "targetAmount": 30000,
  "startingAmount": 5000,
  "currency": "USD",
  "startDate": "2025-01-15T00:00:00Z",
  "targetDate": "2025-12-31T23:59:59Z",
  "sourceType": "BANK_ACCOUNT",
  "accountId": "clx1234567890",
  "recurringAmount": 1200,
  "contributionFrequency": "MONTHLY",
  "tags": ["emergency", "savings", "priority"],
  "notes": "Aiming for 6 months of living expenses",
  "milestones": [
    {
      "name": "First Quarter",
      "description": "25% complete",
      "targetPercentage": 25,
      "celebration": "Great start! Keep up the momentum!",
      "sortOrder": 0
    },
    {
      "name": "Halfway Point",
      "description": "50% complete",
      "targetPercentage": 50,
      "celebration": "You're halfway there! 🎉",
      "sortOrder": 1
    },
    {
      "name": "Three Quarters",
      "description": "75% complete",
      "targetPercentage": 75,
      "celebration": "Almost there! Final push!",
      "sortOrder": 2
    },
    {
      "name": "Goal Complete",
      "description": "100% complete",
      "targetPercentage": 100,
      "celebration": "Congratulations! Goal achieved! 🎊",
      "sortOrder": 3
    }
  ],
  "notifyOnMilestone": true,
  "notifyOnCompletion": true
}
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    userId: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    type: GoalType;
    category?: GoalCategory;
    priority: GoalPriority;

    // Amounts
    targetAmount: number;
    startingAmount: number;
    currentAmount: number;
    currency: string;

    // Progress
    progress: number;              // 0-100
    isAchieved: boolean;
    onTrack: boolean;

    // Dates
    startDate: string;             // ISO 8601
    targetDate: string;            // ISO 8601
    achievedDate?: string;         // ISO 8601
    lastCalculatedAt?: string;     // ISO 8601

    // Contributions
    totalContributions: number;
    recurringAmount?: number;
    contributionFrequency?: string;

    // Projections
    projectedCompletionDate?: string;  // ISO 8601
    estimatedMonthlyContribution?: number;
    daysRemaining: number;
    daysToTarget: number;
    amountRemaining: number;

    // Source
    sourceType: GoalSourceType;
    accountId?: string;
    cryptoWalletId?: string;
    accountGroupId?: string;
    trackAllAccounts: boolean;
    trackAllCrypto: boolean;

    // Populated relations (optional)
    account?: {
      id: string;
      name: string;
      type: string;
      balance: number;
    };
    cryptoWallet?: {
      id: string;
      name: string;
      address: string;
      network: string;
      totalBalanceUsd: number;
    };
    accountGroup?: {
      id: string;
      name: string;
    };

    // Milestones
    milestones: Array<{
      id: string;
      goalId: string;
      name: string;
      description?: string;
      targetAmount: number;
      targetPercentage: number;
      isAchieved: boolean;
      achievedDate?: string;       // ISO 8601
      achievedAmount?: number;
      celebration?: string;
      sortOrder: number;
      createdAt: string;           // ISO 8601
      updatedAt: string;           // ISO 8601
    }>;

    // Metadata
    tags: string[];
    notes?: string;
    isActive: boolean;
    isArchived: boolean;

    createdAt: string;             // ISO 8601
    updatedAt: string;             // ISO 8601
  };
  message: string;
}
```

**Response Example (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "userId": "clx1111111111",
    "name": "Emergency Fund",
    "description": "Build 6 months of expenses for financial security",
    "icon": "💰",
    "color": "#22C55E",
    "type": "EMERGENCY_FUND",
    "category": "PERSONAL",
    "priority": "CRITICAL",
    "targetAmount": 30000,
    "startingAmount": 5000,
    "currentAmount": 5000,
    "currency": "USD",
    "progress": 16.67,
    "isAchieved": false,
    "onTrack": true,
    "startDate": "2025-01-15T00:00:00.000Z",
    "targetDate": "2025-12-31T23:59:59.000Z",
    "achievedDate": null,
    "lastCalculatedAt": "2025-01-15T10:30:00.000Z",
    "totalContributions": 0,
    "recurringAmount": 1200,
    "contributionFrequency": "MONTHLY",
    "projectedCompletionDate": "2025-11-15T00:00:00.000Z",
    "estimatedMonthlyContribution": 2272.73,
    "daysRemaining": 350,
    "daysToTarget": 350,
    "amountRemaining": 25000,
    "sourceType": "BANK_ACCOUNT",
    "accountId": "clx1234567890",
    "cryptoWalletId": null,
    "accountGroupId": null,
    "trackAllAccounts": false,
    "trackAllCrypto": false,
    "account": {
      "id": "clx1234567890",
      "name": "Chase Savings",
      "type": "SAVINGS",
      "balance": 5000
    },
    "milestones": [
      {
        "id": "clx8888888888",
        "goalId": "clx9876543210",
        "name": "First Quarter",
        "description": "25% complete",
        "targetAmount": 7500,
        "targetPercentage": 25,
        "isAchieved": false,
        "achievedDate": null,
        "achievedAmount": null,
        "celebration": "Great start! Keep up the momentum!",
        "sortOrder": 0,
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "tags": ["emergency", "savings", "priority"],
    "notes": "Aiming for 6 months of living expenses",
    "isActive": true,
    "isArchived": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Goal created successfully"
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "error": "Account ID is required for bank account source",
  "code": "INVALID_SOURCE"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

**403 Forbidden - Plan Limit:**
```json
{
  "success": false,
  "error": "You have reached the maximum number of goals for your plan. Upgrade to create more.",
  "code": "PLAN_LIMIT_EXCEEDED"
}
```

**404 Not Found - Source Not Found:**
```json
{
  "success": false,
  "error": "Bank account not found",
  "code": "INVALID_SOURCE"
}
```

---

### 2. Get All Goals

**Endpoint:** `GET /api/v1/goals`

**Description:** Retrieve all goals for the authenticated user with optional filtering, sorting, and pagination.

**Query Parameters:**
```typescript
{
  // Filters
  type?: string;                   // Filter by goal type (SAVINGS, CRYPTO, etc.)
  category?: string;               // Filter by category
  priority?: string;               // Filter by priority (CRITICAL, HIGH, MEDIUM, LOW)
  isAchieved?: boolean;            // true = completed goals, false = incomplete
  isActive?: boolean;              // true = active, false = inactive
  sourceType?: string;             // Filter by source type
  onTrack?: boolean;               // true = on track, false = off track
  search?: string;                 // Search in name and description
  tags?: string;                   // Comma-separated tag list (e.g., "savings,emergency")

  // Date range filters
  targetDateFrom?: string;         // ISO 8601 date
  targetDateTo?: string;           // ISO 8601 date

  // Sorting
  sortBy?: string;                 // name, priority, progress, targetDate, targetAmount, createdAt, updatedAt
  sortOrder?: string;              // asc or desc (default: desc)

  // Pagination
  page?: number;                   // Page number (default: 1)
  limit?: number;                  // Results per page (default: 20, max: 100)

  // Include options
  includeArchived?: boolean;       // Include archived goals (default: false)
  includeMilestones?: boolean;     // Include milestone data (default: true)
  includeSnapshots?: boolean;      // Include recent snapshots (default: false)
  snapshotLimit?: number;          // Max snapshots to include (default: 5)
}
```

**Request Example:**
```
GET /api/v1/goals?type=SAVINGS&type=EMERGENCY_FUND&priority=CRITICAL&isAchieved=false&sortBy=progress&sortOrder=desc&page=1&limit=10&includeMilestones=true
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: Goal[];                    // Array of Goal objects (same structure as Create Goal response)
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx9876543210",
      "name": "Emergency Fund",
      "type": "EMERGENCY_FUND",
      "progress": 45.5,
      "currentAmount": 13650,
      "targetAmount": 30000,
      "amountRemaining": 16350,
      "priority": "CRITICAL",
      "onTrack": true,
      "daysRemaining": 200
      // ... full goal object
    },
    {
      "id": "clx5555555555",
      "name": "House Down Payment",
      "type": "SAVINGS",
      "progress": 32.0,
      "currentAmount": 16000,
      "targetAmount": 50000,
      "amountRemaining": 34000,
      "priority": "HIGH",
      "onTrack": false,
      "daysRemaining": 180
      // ... full goal object
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### 3. Get Single Goal

**Endpoint:** `GET /api/v1/goals/:id`

**Description:** Retrieve detailed information about a specific goal.

**Path Parameters:**
- `id` (string, required): Goal ID

**Query Parameters:**
```typescript
{
  includeSnapshots?: boolean;      // Include historical snapshots (default: false)
}
```

**Request Example:**
```
GET /api/v1/goals/clx9876543210?includeSnapshots=true
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: Goal;                      // Full Goal object with optional snapshots
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "userId": "clx1111111111",
    "name": "Emergency Fund",
    "type": "EMERGENCY_FUND",
    "progress": 45.5,
    "currentAmount": 13650,
    "targetAmount": 30000,
    "milestones": [
      {
        "id": "clx8888888888",
        "name": "First Quarter",
        "targetPercentage": 25,
        "isAchieved": true,
        "achievedDate": "2025-03-15T14:22:00.000Z"
      }
    ],
    "recentSnapshots": [
      {
        "id": "clx7777777777",
        "currentAmount": 13650,
        "progress": 45.5,
        "contributionAmount": 1200,
        "dailyVelocity": 40,
        "weeklyVelocity": 280,
        "monthlyVelocity": 1200,
        "onTrack": true,
        "snapshotDate": "2025-10-14T00:00:00.000Z"
      }
    ]
    // ... full goal object
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Goal not found",
  "code": "GOAL_NOT_FOUND"
}
```

---

### 4. Update Goal

**Endpoint:** `PUT /api/v1/goals/:id`

**Description:** Update an existing goal's properties.

**Path Parameters:**
- `id` (string, required): Goal ID

**Request Schema:**
```typescript
{
  // All fields are optional
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  type?: GoalType;
  category?: GoalCategory;
  priority?: GoalPriority;
  targetAmount?: number;
  currentAmount?: number;          // Manual override (use with caution)
  targetDate?: string;             // ISO 8601 date
  recurringAmount?: number;
  contributionFrequency?: string;

  // Source configuration
  sourceType?: GoalSourceType;
  accountId?: string;
  cryptoWalletId?: string;
  accountGroupId?: string;
  trackAllAccounts?: boolean;
  trackAllCrypto?: boolean;

  // Metadata
  tags?: string[];
  notes?: string;
  isActive?: boolean;
  isArchived?: boolean;
  notifyOnMilestone?: boolean;
  notifyOnCompletion?: boolean;
}
```

**Request Example:**
```json
{
  "targetAmount": 35000,
  "targetDate": "2026-06-30T23:59:59Z",
  "priority": "HIGH",
  "recurringAmount": 1500,
  "notes": "Updated target based on new expenses calculation"
}
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: Goal;                      // Updated Goal object
  message: string;
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "targetAmount": 35000,
    "targetDate": "2026-06-30T23:59:59.000Z",
    "priority": "HIGH",
    "recurringAmount": 1500,
    "progress": 39,
    "amountRemaining": 21350
    // ... full goal object
  },
  "message": "Goal updated successfully"
}
```

---

### 5. Delete Goal

**Endpoint:** `DELETE /api/v1/goals/:id`

**Description:** Permanently delete a goal and all associated milestones and snapshots.

**Path Parameters:**
- `id` (string, required): Goal ID

**Request Example:**
```
DELETE /api/v1/goals/clx9876543210
```

**Response Schema:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

### 6. Calculate Goal Progress

**Endpoint:** `POST /api/v1/goals/:id/calculate`

**Description:** Manually trigger progress calculation for a goal. Fetches latest balances from linked sources and updates progress, velocity, and projections.

**Path Parameters:**
- `id` (string, required): Goal ID

**Request Example:**
```
POST /api/v1/goals/clx9876543210/calculate
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: {
    goalId: string;
    previousAmount: number;
    currentAmount: number;
    progress: number;              // 0-100
    changeAmount: number;          // Current - Previous
    changePercentage: number;      // % change
    milestonesAchieved: string[];  // Array of milestone IDs achieved in this calculation
    isCompleted: boolean;
    projectedCompletionDate?: string;  // ISO 8601
    onTrack: boolean;
    velocity: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  message: string;
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "goalId": "clx9876543210",
    "previousAmount": 13650,
    "currentAmount": 15100,
    "progress": 50.33,
    "changeAmount": 1450,
    "changePercentage": 10.62,
    "milestonesAchieved": ["clx8888888889"],
    "isCompleted": false,
    "projectedCompletionDate": "2025-11-20T00:00:00.000Z",
    "onTrack": true,
    "velocity": {
      "daily": 48.33,
      "weekly": 338.31,
      "monthly": 1450
    }
  },
  "message": "Goal progress calculated successfully"
}
```

**Note:** This endpoint is automatically called:
- When a goal is created (for automated sources)
- By background jobs (daily at midnight)
- When linked accounts/wallets are synced
- Can be manually triggered by the user

---

### 7. Add Manual Contribution

**Endpoint:** `POST /api/v1/goals/:id/contribute`

**Description:** Add a manual contribution to a goal. Only works for goals with `sourceType: MANUAL`.

**Path Parameters:**
- `id` (string, required): Goal ID

**Request Schema:**
```typescript
{
  amount: number;                  // Required: Contribution amount (positive number)
  note?: string;                   // Optional: Note about this contribution
  date?: string;                   // Optional: ISO 8601 date (default: now)
}
```

**Request Example:**
```json
{
  "amount": 500,
  "note": "Tax refund contribution",
  "date": "2025-10-14T10:00:00Z"
}
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: Goal;                      // Updated Goal object
  message: string;
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "currentAmount": 15600,
    "progress": 52,
    "totalContributions": 10600,
    "amountRemaining": 14400
    // ... full goal object
  },
  "message": "Contribution added successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Manual contributions are only allowed for manual goals",
  "code": "INVALID_SOURCE"
}
```

---

### 8. Get Goal Analytics

**Endpoint:** `GET /api/v1/goals/analytics`

**Description:** Retrieve comprehensive analytics for all goals of the authenticated user.

**Request Example:**
```
GET /api/v1/goals/analytics
```

**Response Schema:**
```typescript
{
  success: boolean;
  data: {
    // Summary metrics
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    archivedGoals: number;

    // Financial metrics
    totalTargetAmount: number;
    totalCurrentAmount: number;
    totalProgress: number;         // Average progress across all goals

    // Breakdown by classification
    goalsByType: Record<GoalType, number>;
    goalsByCategory: Record<string, number>;
    goalsByPriority: Record<GoalPriority, number>;

    // Performance metrics
    onTrackGoals: number;
    offTrackGoals: number;
    averageProgress: number;
    averageDaysToCompletion?: number;

    // Top performers
    topPerformingGoals: Array<{
      id: string;
      name: string;
      progress: number;
    }>;

    // Urgent goals
    urgentGoals: Array<{
      id: string;
      name: string;
      daysRemaining: number;
    }>;
  };
}
```

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalGoals": 8,
    "activeGoals": 6,
    "completedGoals": 2,
    "archivedGoals": 0,
    "totalTargetAmount": 185000,
    "totalCurrentAmount": 78500,
    "totalProgress": 42.43,
    "goalsByType": {
      "SAVINGS": 3,
      "EMERGENCY_FUND": 1,
      "CRYPTO": 2,
      "DEBT_PAYOFF": 1,
      "NET_WORTH": 1
    },
    "goalsByCategory": {
      "PERSONAL": 4,
      "RETIREMENT": 2,
      "TRAVEL": 1,
      "HOME": 1
    },
    "goalsByPriority": {
      "CRITICAL": 2,
      "HIGH": 3,
      "MEDIUM": 2,
      "LOW": 1
    },
    "onTrackGoals": 5,
    "offTrackGoals": 1,
    "averageProgress": 42.43,
    "averageDaysToCompletion": 245,
    "topPerformingGoals": [
      {
        "id": "clx9876543210",
        "name": "Emergency Fund",
        "progress": 75.5
      },
      {
        "id": "clx5555555555",
        "name": "Bitcoin Goal",
        "progress": 68.2
      }
    ],
    "urgentGoals": [
      {
        "id": "clx3333333333",
        "name": "Vacation Fund",
        "daysRemaining": 15
      }
    ]
  }
}
```

---

## Request/Response Examples

### Example 1: Create Crypto Portfolio Goal

**Request:**
```bash
curl -X POST https://api.mappr.app/api/v1/goals \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bitcoin $100k Goal",
    "description": "Accumulate $100k worth of Bitcoin",
    "icon": "₿",
    "color": "#F7931A",
    "type": "CRYPTO",
    "category": "INVESTMENT",
    "priority": "HIGH",
    "targetAmount": 100000,
    "startingAmount": 25000,
    "targetDate": "2026-12-31T23:59:59Z",
    "sourceType": "CRYPTO_WALLET",
    "cryptoWalletId": "clx_wallet_btc_001",
    "tags": ["crypto", "bitcoin", "investment"],
    "milestones": [
      {"name": "$50k Milestone", "targetPercentage": 50},
      {"name": "$75k Milestone", "targetPercentage": 75}
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx_goal_crypto_001",
    "name": "Bitcoin $100k Goal",
    "type": "CRYPTO",
    "progress": 25,
    "currentAmount": 25000,
    "targetAmount": 100000,
    "cryptoWallet": {
      "id": "clx_wallet_btc_001",
      "name": "Main BTC Wallet",
      "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "network": "BITCOIN",
      "totalBalanceUsd": 25000
    },
    "onTrack": true,
    "projectedCompletionDate": "2026-10-15T00:00:00.000Z"
  },
  "message": "Goal created successfully"
}
```

### Example 2: Create Portfolio Net Worth Goal

**Request:**
```bash
curl -X POST https://api.mappr.app/api/v1/goals \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Millionaire Status",
    "description": "Reach $1M total net worth across all assets",
    "icon": "💎",
    "type": "NET_WORTH",
    "category": "RETIREMENT",
    "priority": "CRITICAL",
    "targetAmount": 1000000,
    "targetDate": "2030-12-31T23:59:59Z",
    "sourceType": "PORTFOLIO",
    "trackAllAccounts": true,
    "trackAllCrypto": true,
    "milestones": [
      {"name": "$250k", "targetPercentage": 25, "celebration": "Quarter million!"},
      {"name": "$500k", "targetPercentage": 50, "celebration": "Halfway to a million!"},
      {"name": "$750k", "targetPercentage": 75, "celebration": "Almost there!"},
      {"name": "$1M", "targetPercentage": 100, "celebration": "Millionaire status achieved! 🎊"}
    ]
  }'
```

### Example 3: Query Goals with Filters

**Request:**
```bash
curl -X GET 'https://api.mappr.app/api/v1/goals?type=CRYPTO&type=INVESTMENT&priority=HIGH&isAchieved=false&onTrack=true&sortBy=progress&sortOrder=desc&limit=5' \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx_goal_crypto_001",
      "name": "Bitcoin $100k Goal",
      "type": "CRYPTO",
      "progress": 68.5,
      "onTrack": true
    },
    {
      "id": "clx_goal_inv_002",
      "name": "Stock Portfolio",
      "type": "INVESTMENT",
      "progress": 54.2,
      "onTrack": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 2,
    "totalPages": 1
  }
}
```

### Example 4: Manual Contribution

**Request:**
```bash
curl -X POST https://api.mappr.app/api/v1/goals/clx_goal_manual_001/contribute \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500,
    "note": "Monthly salary contribution",
    "date": "2025-10-15T00:00:00Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx_goal_manual_001",
    "currentAmount": 18500,
    "progress": 37,
    "totalContributions": 13500
  },
  "message": "Contribution added successfully"
}
```

---

## Background Jobs

### Job Queue Configuration

**Queue Name:** `goals`

**Redis Configuration:**
```typescript
{
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
}
```

**Worker Concurrency:** 5 jobs simultaneously

**Job Retention:**
- Completed jobs: 24 hours (max 1000 jobs)
- Failed jobs: 7 days

**Retry Configuration:**
- Max attempts: 3
- Backoff: Exponential (2s, 4s, 8s)

---

### Job Types

#### 1. Calculate Goal Progress

**Job Name:** `calculate-goal-progress`

**Description:** Calculates progress for a single goal by fetching latest balances from linked sources.

**Data:**
```typescript
{
  goalId: string;
  userId: string;
}
```

**Trigger:**
```typescript
import { addCalculateGoalProgressJob } from '@/modules/goals/jobs/goalsJobs';

await addCalculateGoalProgressJob('clx_goal_001', 'clx_user_001', 75);
// Priority: 75 (HIGH)
```

**Priority Levels:**
- CRITICAL: 100
- HIGH: 75
- NORMAL: 50
- LOW: 25
- BACKGROUND: 10

**Processing:**
1. Fetch goal from database
2. Calculate balance from source (bank/crypto)
3. Update current amount and progress
4. Check milestone achievements
5. Calculate velocity from snapshots
6. Update projections
7. Create snapshot record

**Job Duration:** ~200-500ms per goal

#### 2. Calculate All User Goals

**Job Name:** `calculate-all-user-goals`

**Description:** Batch calculates progress for all active automated goals of a user.

**Data:**
```typescript
{
  userId: string;
}
```

**Trigger:**
```typescript
import { addCalculateAllUserGoalsJob } from '@/modules/goals/jobs/goalsJobs';

await addCalculateAllUserGoalsJob('clx_user_001');
```

**Processing:**
1. Fetch all active automated goals for user
2. For each goal:
   - Calculate progress
   - 100ms delay between calculations
3. Return summary with success/failure counts

**Job Duration:** ~300-500ms per goal (sequential)

**Use Cases:**
- User manually triggers "Refresh All Goals"
- After bulk account sync
- After crypto wallet sync completion

#### 3. Daily Goal Snapshot

**Job Name:** `daily-goal-snapshot`

**Description:** Creates daily snapshots for all active automated goals across all users.

**Schedule:** Daily at midnight (cron: `0 0 * * *`)

**Data:**
```typescript
{} // No data required
```

**Processing:**
1. Fetch all active automated goals (all users)
2. Group goals by user
3. For each goal:
   - Calculate progress
   - Create snapshot
   - 200ms delay between goals
4. Return aggregated stats

**Job Duration:** Variable (depends on total goals)
- ~300-500ms per goal
- Example: 1000 goals = ~5-8 minutes

**Metrics Tracked:**
- Total goals processed
- Total users affected
- Success count
- Failure count

---

### Worker Management

#### Initialize Workers
```typescript
// src/workers.ts
import { goalsWorker, initializeGoalScheduledJobs } from '@/modules/goals/jobs/goalsJobs';

export async function initializeWorkers() {
  // Initialize scheduled jobs
  await initializeGoalScheduledJobs();

  logger.info('All workers initialized');
}
```

#### Graceful Shutdown
```typescript
import { shutdownGoalWorker } from '@/modules/goals/jobs/goalsJobs';

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await shutdownGoalWorker();
  process.exit(0);
});
```

#### Monitor Queue Health
```typescript
import { goalsQueue } from '@/modules/goals/jobs/goalsJobs';

// Get queue stats
const jobCounts = await goalsQueue.getJobCounts();
console.log('Active:', jobCounts.active);
console.log('Waiting:', jobCounts.waiting);
console.log('Completed:', jobCounts.completed);
console.log('Failed:', jobCounts.failed);

// Get failed jobs
const failedJobs = await goalsQueue.getFailed();
```

---

## Integration Guide

### Step 1: Database Migration

```bash
# Push schema changes to database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name add_goals_system

# Generate Prisma client
npx prisma generate
```

### Step 2: Register Routes

**File:** `src/server.ts`

```typescript
import express from 'express';
import goalsRoutes from './modules/goals/routes';

const app = express();

// ... middleware setup

// Register goals routes
app.use('/api/v1/goals', goalsRoutes);

// ... error handlers
```

### Step 3: Initialize Background Workers

**File:** `src/workers.ts`

```typescript
import {
  goalsWorker,
  initializeGoalScheduledJobs,
  shutdownGoalWorker
} from './modules/goals/jobs/goalsJobs';
import { logger } from './shared/utils/logger';

export async function initializeWorkers() {
  try {
    logger.info('Initializing workers...');

    // Initialize goals scheduled jobs
    await initializeGoalScheduledJobs();

    logger.info('All workers initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize workers', { error });
    throw error;
  }
}

// Graceful shutdown
export async function shutdownWorkers() {
  logger.info('Shutting down workers...');
  await shutdownGoalWorker();
  logger.info('Workers shut down successfully');
}

// Auto-initialize on module load
if (process.env.NODE_ENV !== 'test') {
  initializeWorkers();
}
```

**File:** `src/server.ts` (add graceful shutdown)

```typescript
import { shutdownWorkers } from './workers';

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');

  // Close server
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Shutdown workers
  await shutdownWorkers();

  // Close database
  await prisma.$disconnect();

  process.exit(0);
});
```

### Step 4: Add Plan Limits Middleware (Optional)

**File:** `src/modules/goals/middleware/planLimits.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const enforcePlanGoalLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userPlan = req.user?.currentPlan || 'FREE';

    // Get current goal count
    const goalCount = await prisma.goal.count({
      where: { userId, isArchived: false }
    });

    // Plan limits
    const limits = {
      FREE: 2,
      PRO: 10,
      ULTIMATE: -1 // Unlimited
    };

    const limit = limits[userPlan] || limits.FREE;

    if (limit !== -1 && goalCount >= limit) {
      res.status(403).json({
        success: false,
        error: `Goal limit exceeded for ${userPlan} plan. Upgrade to create more goals.`,
        code: 'PLAN_LIMIT_EXCEEDED',
        currentCount: goalCount,
        limit: limit
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
```

**Update routes:**
```typescript
import { enforcePlanGoalLimit } from '../middleware/planLimits';

// Apply to create goal endpoint
router.post('/', enforcePlanGoalLimit, goalsController.createGoal.bind(goalsController));
```

### Step 5: Trigger Goal Calculations After Syncs

**Crypto Wallet Sync** (`src/modules/crypto/services/cryptoService.ts`):

```typescript
import { addCalculateAllUserGoalsJob } from '@/modules/goals/jobs/goalsJobs';

export class CryptoService {
  async syncWallet(walletId: string, userId: string) {
    // ... existing sync logic

    // Trigger goal calculations after sync
    await addCalculateAllUserGoalsJob(userId);

    logger.info('Triggered goal calculations after crypto sync', { userId, walletId });
  }
}
```

**Bank Account Sync** (`src/modules/banking/services/bankingService.ts`):

```typescript
import { addCalculateAllUserGoalsJob } from '@/modules/goals/jobs/goalsJobs';

export class BankingService {
  async syncAccounts(userId: string) {
    // ... existing sync logic

    // Trigger goal calculations after sync
    await addCalculateAllUserGoalsJob(userId);

    logger.info('Triggered goal calculations after bank sync', { userId });
  }
}
```

### Step 6: Update Swagger/OpenAPI Configuration

**File:** `src/config/swagger.ts`

```typescript
export const swaggerOptions = {
  definition: {
    // ... existing config
    tags: [
      // ... existing tags
      {
        name: 'Goals',
        description: 'Financial goal management endpoints'
      }
    ]
  },
  apis: ['./src/modules/*/routes/*.ts']
};
```

### Step 7: Environment Variables

**File:** `.env`

```env
# Redis Configuration (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Optional: Redis password
REDIS_PASSWORD=

# Optional: Redis database number
REDIS_DB=0
```

---

## Business Logic

### Progress Calculation Algorithm

#### 1. Balance Fetching

```typescript
async calculateBalance(goal): Promise<BalanceResult> {
  switch (goal.sourceType) {
    case 'MANUAL':
      return { totalBalance: goal.currentAmount };

    case 'BANK_ACCOUNT':
      const account = await prisma.financialAccount.findUnique({
        where: { id: goal.accountId }
      });
      return { totalBalance: account.balance };

    case 'CRYPTO_WALLET':
      const wallet = await prisma.cryptoWallet.findUnique({
        where: { id: goal.cryptoWalletId }
      });
      return { totalBalance: wallet.totalBalanceUsd };

    case 'ACCOUNT_GROUP':
      const accounts = await prisma.financialAccount.findMany({
        where: { groupId: goal.accountGroupId }
      });
      const wallets = await prisma.cryptoWallet.findMany({
        where: { groupId: goal.accountGroupId }
      });
      return {
        totalBalance: sum(accounts.balance) + sum(wallets.totalBalanceUsd)
      };

    case 'ALL_ACCOUNTS':
      const allAccounts = await prisma.financialAccount.findMany({
        where: { userId: goal.userId }
      });
      return { totalBalance: sum(allAccounts.balance) };

    case 'ALL_CRYPTO':
      const allWallets = await prisma.cryptoWallet.findMany({
        where: { userId: goal.userId }
      });
      return { totalBalance: sum(allWallets.totalBalanceUsd) };

    case 'PORTFOLIO':
      const portfolioAccounts = await prisma.financialAccount.findMany({
        where: { userId: goal.userId }
      });
      const portfolioWallets = await prisma.cryptoWallet.findMany({
        where: { userId: goal.userId }
      });
      return {
        totalBalance:
          sum(portfolioAccounts.balance) +
          sum(portfolioWallets.totalBalanceUsd)
      };
  }
}
```

#### 2. Progress Percentage

```typescript
const progress = Math.min(100, (currentAmount / targetAmount) * 100);
```

#### 3. Velocity Calculation

```typescript
calculateVelocity(snapshots: Snapshot[]): Velocity {
  if (snapshots.length < 2) {
    return { daily: 0, weekly: 0, monthly: 0, trend: 'stable' };
  }

  // Sort snapshots by date (ascending)
  const sorted = snapshots.sort((a, b) =>
    new Date(a.snapshotDate) - new Date(b.snapshotDate)
  );

  // Calculate daily velocity from last 7 snapshots
  const recent = sorted.slice(-7);
  let totalChange = 0;
  let totalDays = 0;

  for (let i = 1; i < recent.length; i++) {
    const change = recent[i].currentAmount - recent[i-1].currentAmount;
    const days = daysBetween(recent[i].snapshotDate, recent[i-1].snapshotDate);
    totalChange += change;
    totalDays += days;
  }

  const dailyVelocity = totalDays > 0 ? totalChange / totalDays : 0;
  const weeklyVelocity = dailyVelocity * 7;
  const monthlyVelocity = dailyVelocity * 30;

  // Determine trend
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
  const firstAvg = average(firstHalf.map(s => s.currentAmount));
  const secondAvg = average(secondHalf.map(s => s.currentAmount));

  let trend = 'stable';
  if (secondAvg > firstAvg * 1.05) trend = 'increasing';
  else if (secondAvg < firstAvg * 0.95) trend = 'decreasing';

  return { dailyVelocity, weeklyVelocity, monthlyVelocity, trend };
}
```

#### 4. Completion Projection

```typescript
calculateProjection(
  currentAmount: number,
  targetAmount: number,
  targetDate: Date,
  velocity: Velocity
): Projection {
  const remaining = targetAmount - currentAmount;
  const now = new Date();
  const daysToTarget = daysBetween(now, targetDate);

  if (remaining <= 0) {
    return {
      projectedCompletionDate: now,
      daysToCompletion: 0,
      estimatedMonthlyContribution: 0,
      onTrack: true,
      confidenceScore: 100
    };
  }

  let daysToCompletion = daysToTarget;
  let onTrack = true;
  let confidenceScore = 50;

  if (velocity.dailyVelocity > 0) {
    daysToCompletion = Math.ceil(remaining / velocity.dailyVelocity);
    onTrack = daysToCompletion <= daysToTarget;

    // Confidence: 100% if perfect, decreases with deviation
    const deviation = Math.abs(daysToCompletion - daysToTarget) / daysToTarget;
    confidenceScore = Math.min(100, Math.max(0, 100 - (deviation * 100)));
  } else {
    onTrack = false;
    confidenceScore = 20;
  }

  const projectedCompletionDate = addDays(now, daysToCompletion);
  const estimatedMonthlyContribution = daysToTarget > 0
    ? (remaining / daysToTarget) * 30
    : remaining;

  return {
    projectedCompletionDate,
    daysToCompletion,
    estimatedMonthlyContribution,
    onTrack,
    confidenceScore
  };
}
```

#### 5. Milestone Achievement Detection

```typescript
async checkMilestones(goalId: string, progress: number): Promise<string[]> {
  const milestones = await prisma.goalMilestone.findMany({
    where: { goalId, isAchieved: false },
    orderBy: { targetPercentage: 'asc' }
  });

  const achieved: string[] = [];

  for (const milestone of milestones) {
    if (progress >= milestone.targetPercentage) {
      await prisma.goalMilestone.update({
        where: { id: milestone.id },
        data: {
          isAchieved: true,
          achievedDate: new Date(),
          achievedAmount: currentAmount
        }
      });

      achieved.push(milestone.id);

      // Trigger notification (if enabled)
      if (goal.notifyOnMilestone) {
        await notificationService.sendMilestoneNotification(
          goal.userId,
          goal.id,
          milestone.name,
          milestone.celebration
        );
      }
    }
  }

  return achieved;
}
```

---

## Error Handling

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `GOAL_NOT_FOUND` | 404 | Goal doesn't exist or user unauthorized |
| `INVALID_SOURCE` | 400 | Invalid source configuration |
| `INVALID_AMOUNT` | 400 | Invalid amount value |
| `INVALID_DATE` | 400 | Invalid date value |
| `MILESTONE_NOT_FOUND` | 404 | Milestone not found |
| `CALCULATION_ERROR` | 500 | Error calculating progress |
| `PLAN_LIMIT_EXCEEDED` | 403 | User has reached plan limit |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `VALIDATION_ERROR` | 400 | Request validation failed |

### Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

### Error Handling in Service

```typescript
import { GoalError, GoalErrorCode } from '../types';

// Throw custom error
throw new GoalError(
  'Goal not found',
  GoalErrorCode.GOAL_NOT_FOUND,
  404
);

// Catch and handle
try {
  await goalsService.getGoal(goalId, userId);
} catch (error) {
  if (error instanceof GoalError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code
    });
  } else {
    // Unknown error
    logger.error('Unexpected error', { error });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
}
```

---

## Testing

### Manual Testing

#### 1. Create Test User & Accounts

```bash
# Create user (via auth endpoints)
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login to get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Save the token
export TOKEN="your_jwt_token_here"
```

#### 2. Create Test Goal

```bash
curl -X POST http://localhost:3000/api/v1/goals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Emergency Fund",
    "type": "EMERGENCY_FUND",
    "targetAmount": 10000,
    "targetDate": "2025-12-31T23:59:59Z",
    "sourceType": "MANUAL"
  }'
```

#### 3. Add Contributions

```bash
curl -X POST http://localhost:3000/api/v1/goals/{GOAL_ID}/contribute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "note": "Test contribution"
  }'
```

#### 4. Get All Goals

```bash
curl -X GET 'http://localhost:3000/api/v1/goals?limit=10' \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Get Analytics

```bash
curl -X GET http://localhost:3000/api/v1/goals/analytics \
  -H "Authorization: Bearer $TOKEN"
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Database Testing

```bash
# Reset database
npx prisma migrate reset

# Push schema
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

---

## Performance Considerations

### Database Indexes

All critical fields are indexed:
- `Goal.userId` - Fast user goal lookups
- `Goal.type`, `Goal.category`, `Goal.priority` - Fast filtering
- `Goal.isAchieved`, `Goal.isActive` - Fast status filtering
- `Goal.targetDate` - Fast date range queries
- `GoalSnapshot.goalId`, `GoalSnapshot.snapshotDate` - Fast historical queries

### Query Optimization

```typescript
// Efficient pagination with cursor-based approach
const goals = await prisma.goal.findMany({
  where: { userId },
  skip: (page - 1) * limit,
  take: limit,
  include: {
    milestones: true,  // Only when needed
    snapshots: {
      take: 5,         // Limit snapshot count
      orderBy: { snapshotDate: 'desc' }
    }
  }
});

// Avoid N+1 queries - use include/select
const goal = await prisma.goal.findUnique({
  where: { id: goalId },
  include: {
    account: true,
    cryptoWallet: true,
    milestones: { orderBy: { sortOrder: 'asc' } }
  }
});
```

### Caching Strategy

**Redis Caching (Future Enhancement):**
```typescript
// Cache goal data for 5 minutes
const cacheKey = `goal:${goalId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const goal = await goalsService.getGoal(goalId, userId);
await redis.setex(cacheKey, 300, JSON.stringify(goal));
```

### Background Job Optimization

- **Sequential with delays:** 100-200ms between goal calculations prevents overwhelming external APIs
- **Batch processing:** Group goals by user for efficient processing
- **Priority queue:** Critical goals calculated first
- **Error isolation:** Failed goal calculation doesn't affect others

---

## Best Practices

### 1. Always Use TypeScript Types

```typescript
import { CreateGoalDTO, GoalResponse } from '@/modules/goals/types';

// Good
const createGoal = async (data: CreateGoalDTO): Promise<GoalResponse> => {
  // ...
};

// Bad
const createGoal = async (data: any): Promise<any> => {
  // ...
};
```

### 2. Validate Source Configuration

```typescript
// Always validate that the source exists and belongs to the user
if (sourceType === 'BANK_ACCOUNT') {
  const account = await prisma.financialAccount.findFirst({
    where: { id: accountId, userId }
  });

  if (!account) {
    throw new GoalError('Bank account not found', 'INVALID_SOURCE', 404);
  }
}
```

### 3. Use Transactions for Multi-Step Operations

```typescript
await prisma.$transaction(async (tx) => {
  // Create goal
  const goal = await tx.goal.create({ data: goalData });

  // Create milestones
  await tx.goalMilestone.createMany({
    data: milestones.map(m => ({ ...m, goalId: goal.id }))
  });

  // Create initial snapshot
  await tx.goalSnapshot.create({
    data: { goalId: goal.id, currentAmount: goal.currentAmount }
  });
});
```

### 4. Handle Decimal Precision

```typescript
import { Decimal } from '@prisma/client/runtime/library';

// Always use Decimal for financial calculations
const targetAmount = new Decimal(data.targetAmount);
const currentAmount = new Decimal(data.currentAmount);
const progress = currentAmount.div(targetAmount).mul(100);

// Convert to number only for response
return {
  targetAmount: targetAmount.toNumber(),
  progress: progress.toNumber()
};
```

### 5. Log Important Events

```typescript
logger.info('Goal created', {
  goalId: goal.id,
  userId,
  type: goal.type,
  targetAmount: goal.targetAmount.toNumber()
});

logger.error('Failed to calculate goal progress', {
  goalId,
  userId,
  error: error.message,
  stack: error.stack
});
```

---

## Changelog

### Version 1.0.0 (2025-10-14)

**Initial Release**

- Complete goals system with 9 goal types
- Multi-source tracking (bank, crypto, portfolio)
- Milestone system with celebrations
- Historical snapshots
- Velocity tracking and projections
- Background job processing
- Comprehensive analytics
- Full API with Swagger documentation
- TypeScript with strict type safety
- Database schema with proper indexes
- Error handling with custom error codes

---

## Support & Contributing

For questions or issues:
1. Check this documentation
2. Review the module README at `src/modules/goals/README.md`
3. Check main project docs at `CLAUDE.md`
4. Create an issue in the repository

---

**End of Documentation**
