# Mappr Backend - Complete Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [External Service Integrations](#external-service-integrations)
6. [Background Jobs System](#background-jobs-system)
7. [Authentication & Authorization](#authentication--authorization)
8. [Services Layer](#services-layer)
9. [Development Guidelines](#development-guidelines)
10. [Configuration & Environment](#configuration--environment)

---

## Project Overview

**Mappr Backend** is a comprehensive financial management platform built with TypeScript and Node.js. It aggregates cryptocurrency portfolios, traditional banking data, and custom assets to provide users with a complete view of their net worth and financial health.

### Tech Stack

- **Runtime**: Node.js 20+ with TypeScript (strict mode)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ
- **Authentication**: Better Auth with JWT
- **External APIs**: Zerion SDK, Zapper GraphQL, Teller, Stripe, QuickBooks
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI 3.0

### Key Features

✅ **Cryptocurrency Portfolio Management**
- Multi-wallet tracking (15+ blockchain networks)
- DeFi position monitoring
- NFT collection tracking
- Dual provider system (Zerion + Zapper)

✅ **Traditional Banking Integration**
- Bank account connections via Teller and Stripe
- Transaction tracking and categorization
- Balance history and analytics
- Spending analytics

✅ **Net Worth Aggregation**
- Cross-account net worth calculation
- Asset and liability tracking
- Real estate, vehicles, and custom assets
- Historical snapshots and performance metrics

✅ **Financial Planning**
- Budget creation and tracking
- Financial goal management
- Subscription tracking
- Spending analytics

✅ **Business Integrations**
- QuickBooks Online integration
- Invoice and bill tracking
- Company data synchronization

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│  Express.js + Middleware (Auth, Rate Limiting, CORS)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Crypto  │ │ Banking  │ │ NetWorth │ │  Goals   │      │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Budgets  │ │   Auth   │ │Integration│ │Analytics │      │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                         │
│         Prisma ORM + Connection Pooling                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Services Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Zerion   │ │  Zapper  │ │  Teller  │ │  Stripe  │      │
│  │   SDK    │ │   API    │ │   API    │ │   API    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐                                               │
│  │QuickBooks│                                               │
│  │   API    │                                               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Background Processing Layer                     │
│         BullMQ Queues + Workers (Redis-backed)               │
└─────────────────────────────────────────────────────────────┘
```

### Modular Structure

```
src/
├── modules/                          # Feature modules
│   ├── auth/                        # Authentication & authorization
│   │   ├── lib/                    # Better Auth configuration
│   │   ├── middleware/             # Auth middleware
│   │   ├── services/               # Email service
│   │   └── controllers/            # Auth controllers
│   │
│   ├── crypto/                      # Cryptocurrency portfolio
│   │   ├── controllers/            # API endpoints
│   │   ├── services/               # Business logic
│   │   │   ├── cryptoService.ts
│   │   │   ├── assetCacheService.ts
│   │   │   ├── defiAppService.ts
│   │   │   └── userSyncProgressManager.ts
│   │   ├── jobs/                   # Background processors
│   │   └── routes/                 # Route definitions
│   │
│   ├── banking/                     # Traditional banking
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── bankingService.ts
│   │   │   ├── tellerService.ts
│   │   │   ├── stripeService.ts
│   │   │   └── spendingAnalyticsService.ts
│   │   ├── jobs/
│   │   └── routes/
│   │
│   ├── networth/                    # Net worth aggregation
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── networthService.ts
│   │   │   ├── accountAssetService.ts
│   │   │   ├── assetCategoryService.ts
│   │   │   └── depreciationService.ts
│   │   ├── jobs/
│   │   └── routes/
│   │
│   ├── budgets/                     # Budget management
│   ├── goals/                       # Financial goals
│   ├── integrations/                # Integration framework
│   │   ├── core/
│   │   │   ├── baseIntegrationService.ts
│   │   │   ├── oauth2Handler.ts
│   │   │   └── webhookManager.ts
│   │   └── registry/
│   │       └── integrationRegistry.ts
│   │
│   ├── quickbooks/                  # QuickBooks integration
│   ├── user-subscriptions/          # Subscription tracking
│   └── analytics/                   # System analytics
│
├── shared/                          # Shared utilities
│   ├── middleware/                 # Cross-cutting middleware
│   ├── services/                   # Shared services (Cache)
│   └── utils/                      # Utility functions
│
├── config/                          # Configuration
│   ├── database.ts
│   ├── redis.ts
│   ├── queue.ts
│   └── swagger.ts
│
├── types/                           # TypeScript definitions
├── workers.ts                       # Worker initialization
├── app.ts                           # Express app setup
└── server.ts                        # Application entry point
```

### Design Patterns Used

1. **Modular Architecture**: Domain-driven feature modules
2. **Service Layer Pattern**: Business logic separated from controllers
3. **Repository Pattern**: Data access abstraction (partial)
4. **Singleton Pattern**: Service registries and managers
5. **Factory Pattern**: Service creation with configuration
6. **Circuit Breaker**: External API fault tolerance
7. **Observer Pattern**: Event-driven job processing
8. **Adapter Pattern**: Provider abstraction (Zerion/Zapper)
9. **Decorator Pattern**: API tracking decorators

---

## API Endpoints

**Base URL**: `/api/v1`

**Authentication**: Bearer JWT tokens (unless specified otherwise)

**Response Format**:
```typescript
// Success Response
{
  success: true,
  data: { ... }
}

// Error Response
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

### Authentication Endpoints

**Base Path**: `/api/v1/auth`

#### Register
```http
POST /api/v1/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "currentPlan": "FREE",
      "emailVerified": false
    },
    "session": { ... }
  }
}
```

#### Login
```http
POST /api/v1/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { ... },
    "session": {
      "token": "jwt_token_here",
      "expiresAt": "2025-01-28T12:00:00Z"
    }
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "currentPlan": "PRO",
    "emailVerified": true
  }
}
```

### Crypto Portfolio Endpoints

**Base Path**: `/api/v1/crypto`

#### List Wallets
```http
GET /api/v1/crypto/wallets
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "wallet_123",
      "name": "Main Wallet",
      "address": "0x1234567890abcdef...",
      "network": "ETHEREUM",
      "type": "EXTERNAL",
      "totalBalanceUsd": 15234.56,
      "lastSyncAt": "2025-01-21T10:30:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Add Wallet
```http
POST /api/v1/crypto/wallets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Trading Wallet",
  "address": "0xabcdef1234567890...",
  "network": "POLYGON",
  "type": "EXTERNAL",
  "notes": "My polygon trading wallet"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "wallet_456",
    "name": "Trading Wallet",
    "address": "0xabcdef1234567890...",
    "network": "POLYGON",
    "totalBalanceUsd": 0,
    "syncStatus": "pending"
  }
}
```

#### Get Portfolio
```http
GET /api/v1/crypto/portfolio
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "totalBalanceUsd": 45678.90,
    "walletCount": 3,
    "assetCount": 12,
    "change24h": {
      "usd": 1234.56,
      "percent": 2.78
    },
    "topAssets": [
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "balance": "5.234",
        "balanceUsd": 12345.67,
        "price": 2358.90,
        "change24h": 3.45
      }
    ]
  }
}
```

#### Sync Wallet
```http
POST /api/v1/crypto/wallets/{walletId}/sync
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullSync": true,
  "syncTypes": ["assets", "transactions", "nfts", "defi"]
}

Response 200:
{
  "success": true,
  "data": {
    "walletId": "wallet_123",
    "jobId": "job_789",
    "status": "queued",
    "estimatedCompletionTime": "2025-01-21T10:35:00Z"
  }
}
```

#### Get Sync Status (Server-Sent Events)
```http
GET /api/v1/crypto/user/sync/stream
Authorization: Bearer {token}

Response: text/event-stream
data: {"type":"connection_established","timestamp":"2025-01-21T10:30:00Z"}

data: {"type":"sync_started","walletId":"wallet_123","status":"syncing"}

data: {"type":"progress","walletId":"wallet_123","progress":25,"status":"syncing_assets"}

data: {"type":"progress","walletId":"wallet_123","progress":50,"status":"syncing_transactions"}

data: {"type":"completed","walletId":"wallet_123","totalAssets":12}
```

### Banking Endpoints

**Base Path**: `/api/v1/banking`

#### Get Accounts Preview (Teller)
```http
POST /api/v1/banking/preview
Authorization: Bearer {token}
Content-Type: application/json

{
  "enrollment": {
    "accessToken": "test_token_abc123...",
    "enrollment": {
      "id": "enr_abc123",
      "institution": {
        "id": "chase",
        "name": "Chase Bank"
      }
    }
  }
}

Response 200:
{
  "success": true,
  "data": {
    "institutionName": "Chase Bank",
    "institutionId": "chase",
    "enrollmentId": "enr_abc123",
    "accounts": [
      {
        "id": "acc_xyz789",
        "name": "Chase Checking",
        "type": "CHECKING",
        "balance": 5432.10,
        "currency": "USD",
        "lastFour": "1234"
      }
    ]
  }
}
```

#### Connect Bank Accounts
```http
POST /api/v1/banking/connect
Authorization: Bearer {token}
Content-Type: application/json

{
  "enrollment": { ... },
  "selectedAccountIds": ["acc_xyz789", "acc_abc456"]
}

Response 201:
{
  "success": true,
  "data": [
    {
      "id": "fin_acc_123",
      "name": "Chase Checking",
      "type": "CHECKING",
      "balance": 5432.10,
      "institutionName": "Chase Bank",
      "lastSyncAt": "2025-01-21T10:30:00Z"
    }
  ]
}
```

#### Get Transactions
```http
GET /api/v1/banking/transactions?page=1&limit=50&startDate=2025-01-01&category=food
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "txn_123",
      "accountId": "fin_acc_123",
      "amount": -45.67,
      "description": "STARBUCKS COFFEE",
      "merchantName": "Starbucks",
      "category": "Food & Dining",
      "date": "2025-01-20T08:30:00Z",
      "pending": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 523,
    "pages": 11
  }
}
```

#### Get Spending Analytics
```http
GET /api/v1/banking/analytics/spending/categories?period=last_30_days&limit=10
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "category": "Food & Dining",
      "totalAmount": 1234.56,
      "transactionCount": 45,
      "percentOfTotal": 23.5,
      "trend": "up",
      "changePercent": 12.3
    }
  ]
}
```

### Net Worth Endpoints

**Base Path**: `/api/v1/networth`

#### Get Net Worth Summary
```http
GET /api/v1/networth
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "summary": {
      "totalNetWorth": 345678.90,
      "totalAssets": 456789.12,
      "totalLiabilities": 111110.22,
      "currency": "USD",
      "asOfDate": "2025-01-21T10:30:00Z"
    },
    "breakdown": {
      "cash": 25000.00,
      "crypto": 45678.90,
      "investments": 150000.00,
      "realEstate": 200000.00,
      "vehicles": 25000.00,
      "otherAssets": 11110.22,
      "loans": -50000.00,
      "creditCards": -5432.10,
      "mortgages": -55678.12
    },
    "performance": {
      "period": "1m",
      "change": 12345.67,
      "changePercent": 3.71,
      "startValue": 333333.23,
      "endValue": 345678.90
    }
  }
}
```

#### Get Net Worth History
```http
GET /api/v1/networth/history?period=1y&granularity=MONTHLY
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "period": "1y",
    "granularity": "MONTHLY",
    "dataPoints": [
      {
        "date": "2024-02-01",
        "netWorth": 300000.00,
        "assets": 400000.00,
        "liabilities": 100000.00
      },
      {
        "date": "2024-03-01",
        "netWorth": 315000.00,
        "assets": 420000.00,
        "liabilities": 105000.00
      }
      // ... more data points
    ]
  }
}
```

#### Create Asset Account
```http
POST /api/v1/networth/accounts/assets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Primary Residence",
  "type": "REAL_ESTATE",
  "balance": 350000.00,
  "currency": "USD",
  "assetDescription": "3BR/2BA Single Family Home",
  "originalValue": 300000.00,
  "purchaseDate": "2020-06-15",
  "appreciationRate": 3.5,
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94105",
  "hasLiability": true,
  "linkedLiabilityId": "mortgage_acc_123"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "asset_acc_456",
    "name": "Primary Residence",
    "type": "REAL_ESTATE",
    "balance": 350000.00,
    "currentValue": 350000.00
  }
}
```

### Budget Endpoints

**Base Path**: `/api/v1/budgets`

#### Create Budget
```http
POST /api/v1/budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Monthly Groceries",
  "amount": 600.00,
  "period": "MONTHLY",
  "sourceType": "CATEGORY",
  "sourceId": "cat_food_123",
  "alerts": [
    { "threshold": 50, "enabled": true },
    { "threshold": 75, "enabled": true },
    { "threshold": 90, "enabled": true }
  ]
}

Response 201:
{
  "success": true,
  "data": {
    "id": "budget_123",
    "name": "Monthly Groceries",
    "amount": 600.00,
    "spent": 0,
    "remaining": 600.00,
    "percentUsed": 0,
    "status": "ON_TRACK"
  }
}
```

### Integration Endpoints

**Base Path**: `/api/v1/integrations`

#### Get Available Providers
```http
GET /api/v1/integrations/providers

Response 200:
{
  "success": true,
  "data": {
    "providers": [
      {
        "provider": "QUICKBOOKS",
        "name": "QuickBooks Online",
        "description": "Sync invoices, bills, and business transactions",
        "authType": "oauth2",
        "webhookSupport": true,
        "features": ["invoices", "bills", "accounts", "customers"]
      }
    ],
    "count": 1
  }
}
```

#### Get Connected Integrations
```http
GET /api/v1/integrations
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "integrations": [
      {
        "id": "int_123",
        "provider": "QUICKBOOKS",
        "status": "ACTIVE",
        "lastSyncAt": "2025-01-21T09:00:00Z",
        "lastSyncStatus": "SUCCESS",
        "autoSync": true
      }
    ],
    "count": 1
  }
}
```

---

## Database Schema

### Core Models

#### User
```prisma
model User {
  id                 String       @id @default(cuid())
  email              String       @unique
  emailVerified      Boolean      @default(false)
  firstName          String
  lastName           String
  phone              String?
  dateOfBirth        DateTime?
  role               UserRole     @default(USER)       // USER, PREMIUM, ADMIN
  status             UserStatus   @default(PENDING_VERIFICATION)
  currentPlan        PlanType     @default(FREE)       // FREE, PRO, ULTIMATE
  monthlyIncome      Decimal?     @db.Decimal(12, 2)
  currency           String       @default("USD")
  timezone           String       @default("UTC")
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  lastLoginAt        DateTime?

  // Relations
  cryptoWallets      CryptoWallet[]
  financialAccounts  FinancialAccount[]
  transactions       Transaction[]
  budgets            Budget[]
  goals              Goal[]
  subscriptions      Subscription?
  integrations       Integration[]
}
```

#### CryptoWallet
```prisma
model CryptoWallet {
  id                String    @id @default(cuid())
  userId            String
  name              String
  address           String
  network           BlockchainNetwork  // ETHEREUM, POLYGON, ARBITRUM, etc.
  type              WalletType        // EXTERNAL, EXCHANGE, HARDWARE
  totalBalanceUsd   Decimal   @default(0) @db.Decimal(15, 2)
  lastSyncAt        DateTime?
  syncStatus        String?   @default("pending")
  notes             String?
  isActive          Boolean   @default(true)

  user              User      @relation(fields: [userId], references: [id])
  positions         CryptoPosition[]
  transactions      CryptoTransaction[]
  nfts              CryptoNFT[]
  defiPositions     DefiAppPosition[]

  @@unique([userId, address, network])
  @@index([userId])
  @@index([network])
}
```

#### FinancialAccount
```prisma
model FinancialAccount {
  id                String      @id @default(cuid())
  userId            String
  name              String
  type              AccountType  // CHECKING, SAVINGS, CREDIT_CARD, INVESTMENT, etc.
  institutionName   String?
  balance           Decimal     @default(0) @db.Decimal(12, 2)
  currency          String      @default("USD")
  isActive          Boolean     @default(true)

  // Provider integration
  provider              IntegrationProvider?  // TELLER, QUICKBOOKS, PLAID
  providerAccountId     String?
  lastProviderSync      DateTime?

  // Teller-specific fields
  tellerEnrollmentId    String?
  tellerAccountId       String?
  tellerType            TellerAccountType?    // depository, credit
  tellerSubtype         TellerAccountSubtype? // checking, savings, credit_card

  // Asset-specific fields (REAL_ESTATE, VEHICLE, OTHER_ASSET)
  assetDescription      String?
  originalValue         Decimal?  @db.Decimal(15, 2)
  purchaseDate          DateTime?
  appreciationRate      Decimal?  @db.Decimal(8, 4)

  // Depreciation tracking
  depreciationMethod    DepreciationMethod?
  depreciationRate      Decimal?  @db.Decimal(8, 4)
  usefulLifeYears       Int?

  // Location (for real estate, vehicles)
  address               String?
  city                  String?
  state                 String?
  country               String?
  postalCode            String?

  user              User          @relation(fields: [userId], references: [id])
  transactions      Transaction[]
  budgets           Budget[]
  goals             Goal[]
  valuationHistory  AccountValuation[]

  @@unique([userId, name])
  @@index([type])
  @@index([provider])
}
```

#### Transaction
```prisma
model Transaction {
  id                    String           @id @default(cuid())
  userId                String
  accountId             String
  categoryId            String?
  amount                Decimal          @db.Decimal(12, 2)
  description           String
  merchantName          String?
  date                  DateTime
  pending               Boolean          @default(false)

  provider              IntegrationProvider?
  providerTransactionId String?

  createdAt             DateTime         @default(now())
  updatedAt             DateTime         @updatedAt

  user                  User             @relation(fields: [userId], references: [id])
  account               FinancialAccount @relation(fields: [accountId], references: [id])
  category              Category?        @relation(fields: [categoryId], references: [id])

  @@index([userId])
  @@index([accountId])
  @@index([date])
  @@index([provider])
}
```

#### Budget
```prisma
model Budget {
  id                String       @id @default(cuid())
  userId            String
  name              String
  amount            Decimal      @db.Decimal(12, 2)
  period            BudgetPeriod @default(MONTHLY)  // MONTHLY, QUARTERLY, YEARLY
  sourceType        BudgetSourceType
  sourceId          String?
  startDate         DateTime     @default(now())
  endDate           DateTime?
  isActive          Boolean      @default(true)
  rolloverEnabled   Boolean      @default(false)

  user              User         @relation(fields: [userId], references: [id])
  alerts            BudgetAlert[]

  @@index([userId])
  @@index([period])
}
```

#### Goal
```prisma
model Goal {
  id                String       @id @default(cuid())
  userId            String
  name              String
  description       String?
  targetAmount      Decimal      @db.Decimal(12, 2)
  currentAmount     Decimal      @default(0) @db.Decimal(12, 2)
  targetDate        DateTime?
  sourceType        GoalSourceType
  sourceId          String?
  category          GoalCategory
  status            GoalStatus   @default(IN_PROGRESS)

  user              User         @relation(fields: [userId], references: [id])
  milestones        GoalMilestone[]

  @@index([userId])
  @@index([status])
}
```

#### Integration
```prisma
model Integration {
  id                    String              @id @default(cuid())
  userId                String
  provider              IntegrationProvider
  status                IntegrationStatus   @default(PENDING)
  providerAccountId     String?
  accessToken           String              // TODO: Encrypt this
  refreshToken          String?
  tokenExpiresAt        DateTime?
  lastSyncAt            DateTime?
  lastSyncStatus        SyncStatus?
  autoSync              Boolean             @default(true)
  syncFrequency         SyncFrequency       @default(DAILY)

  user                  User                @relation(fields: [userId], references: [id])
  syncLogs              IntegrationSyncLog[]

  @@unique([userId, provider])
  @@index([provider])
  @@index([status])
}
```

#### NetWorthSnapshot
```prisma
model NetWorthSnapshot {
  id                String              @id @default(cuid())
  userId            String
  snapshotDate      DateTime            @default(now())
  granularity       SnapshotGranularity

  // Net worth values
  totalNetWorth     Decimal             @db.Decimal(15, 2)
  totalAssets       Decimal             @db.Decimal(15, 2)
  totalLiabilities  Decimal             @db.Decimal(15, 2)

  // Breakdown by type
  cashBalance       Decimal             @default(0) @db.Decimal(15, 2)
  cryptoBalance     Decimal             @default(0) @db.Decimal(15, 2)
  investmentBalance Decimal             @default(0) @db.Decimal(15, 2)
  realEstateBalance Decimal             @default(0) @db.Decimal(15, 2)
  vehicleBalance    Decimal             @default(0) @db.Decimal(15, 2)

  user              User                @relation(fields: [userId], references: [id])

  @@unique([userId, snapshotDate, granularity])
  @@index([userId, granularity])
  @@index([snapshotDate])
}
```

### Enums

```prisma
enum UserRole {
  USER
  PREMIUM
  ADMIN
}

enum PlanType {
  FREE
  PRO
  ULTIMATE
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
  INVESTMENT
  LOAN
  MORTGAGE
  CRYPTO
  REAL_ESTATE
  VEHICLE
  OTHER_ASSET
}

enum BlockchainNetwork {
  ETHEREUM
  POLYGON
  ARBITRUM
  OPTIMISM
  BASE
  BINANCE_SMART_CHAIN
  AVALANCHE
  FANTOM
  CRONOS
  GNOSIS
  AURORA
  HARMONY
  MOONBEAM
  MOONRIVER
  CELO
}

enum IntegrationProvider {
  TELLER
  STRIPE
  PLAID
  QUICKBOOKS
  SQUARE
}

enum BudgetPeriod {
  MONTHLY
  QUARTERLY
  YEARLY
  CUSTOM
}

enum GoalCategory {
  EMERGENCY_FUND
  RETIREMENT
  INVESTMENT
  SAVINGS
  DEBT_PAYOFF
  PURCHASE
  VACATION
  EDUCATION
  NET_WORTH
  CUSTOM
}

enum SnapshotGranularity {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}
```

---

## External Service Integrations

### 1. Zerion SDK Integration

**Purpose**: Primary blockchain data provider for cryptocurrency portfolios

**Service**: `src/modules/external-apis/zerion/services/zerionService.ts`

**Features**:
- Multi-network portfolio aggregation (15+ chains)
- Real-time asset positions and balances
- Transaction history with metadata
- DeFi protocol position tracking
- Circuit breaker pattern for fault tolerance
- Exponential backoff with jitter

**Configuration**:
```typescript
{
  apiKey: process.env.ZERION_API_KEY,
  timeout: 30000,
  retries: 3,
  circuitBreakerThreshold: 5,
  circuitBreakerTimeout: 60000,
  enableMetrics: true
}
```

**Key Methods**:
- `getWalletPortfolio(address: string)` - Get wallet assets and balances
- `getWalletTransactions(address: string)` - Get transaction history
- `getDefiPositions(address: string)` - Get DeFi positions
- `getAssetDetails(assetId: string)` - Get asset metadata

**Rate Limits**: Not specified in SDK (handled by circuit breaker)

### 2. Zapper GraphQL Integration

**Purpose**: Secondary provider with specialized DeFi and NFT features

**Service**: `src/modules/external-apis/zapper/services/zapperService.ts`

**Features**:
- Advanced DeFi position breakdown with underlying tokens
- NFT collection tracking and floor prices
- Farcaster social integration
- Multi-level token composition analysis
- GraphQL-based flexible data fetching
- Concurrent request management

**Configuration**:
```typescript
{
  apiKey: process.env.ZAPPER_API_KEY,
  baseUrl: 'https://public.zapper.xyz',
  rateLimit: {
    requestsPerSecond: 10,
    maxConcurrent: 5
  }
}
```

**Key Methods**:
- `getPortfolio(address: string)` - Get portfolio data
- `getNFTs(address: string)` - Get NFT collections
- `getDefiPositions(address: string)` - Get DeFi positions with deep breakdown
- `resolveFarcasterAddress(username: string)` - Resolve Farcaster to wallet

**Rate Limits**: 10 requests/second, 5 concurrent requests

### 3. Teller API Integration

**Purpose**: Bank account and transaction aggregation

**Service**: `src/modules/banking/services/tellerService.ts`

**Features**:
- Bank account connection via OAuth
- Account balance tracking
- Transaction history retrieval
- mTLS certificate support
- Circuit breaker protection

**Authentication**: mTLS (mutual TLS) with certificates

**Configuration**:
```typescript
{
  apiBaseUrl: 'https://api.teller.io',
  applicationId: process.env.TELLER_APPLICATION_ID,
  certificatePath: process.env.TELLER_CERTIFICATE_PATH,
  certificateKeyPath: process.env.TELLER_CERTIFICATE_KEY_PATH,
  timeout: 30000
}
```

**Key Methods**:
- `getAccounts(enrollmentId: string)` - Get bank accounts
- `getAccountBalance(accountId: string)` - Get account balance
- `getTransactions(accountId: string)` - Get transactions

**Rate Limits**: Standard banking API limits apply

### 4. Stripe Financial Connections

**Purpose**: Alternative bank account connection provider

**Service**: `src/modules/banking/services/stripeService.ts`

**Features**:
- Financial Connections session creation
- Account linking and verification
- Transaction sync via Stripe API
- Webhook support for real-time updates

**Authentication**: API Key

**Configuration**:
```typescript
{
  apiKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
}
```

**Key Methods**:
- `createFinancialConnectionsSession()` - Create session for account linking
- `getLinkedAccounts(customerId: string)` - Get connected accounts
- `syncAccountData(accountId: string)` - Sync account data

### 5. QuickBooks Online Integration

**Purpose**: Business accounting and invoice management

**Service**: `src/modules/quickbooks/services/quickbooksService.ts`

**Features**:
- OAuth2 integration
- Account, transaction, invoice, and bill synchronization
- Company information retrieval
- Webhook event handling
- Realm ID management for multi-company support

**Authentication**: OAuth 2.0

**Configuration**:
```typescript
{
  clientId: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
  environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
  webhookVerifierToken: process.env.QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN
}
```

**Key Methods**:
- `getAuthorizationUrl(userId: string)` - Get OAuth URL
- `handleOAuthCallback(code: string, state: string)` - Handle OAuth callback
- `syncAccounts(userId: string, realmId: string)` - Sync QB accounts
- `syncInvoices(userId: string, realmId: string)` - Sync invoices
- `handleWebhook(payload: any)` - Process webhook events

**Webhooks Supported**:
- Invoice created/updated/deleted
- Bill created/updated/deleted
- Payment created/updated

---

## Background Jobs System

### Architecture

The application uses **BullMQ** (Redis-backed job queue) for background processing with the following architecture:

```
┌─────────────────────────────────────────┐
│         Queue Manager (Singleton)        │
│  - Manages all queues and workers       │
│  - Health monitoring                     │
│  - Metrics collection                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│            Queue Types                   │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ crypto-sync  │  │banking-sync  │    │
│  │ (Priority: H)│  │ (Priority: H)│    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐    │
│  │crypto-prices │  │notifications │    │
│  │(Priority: CR)│  │(Priority: CR)│    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐                       │
│  │ maintenance  │                       │
│  │ (Priority: B)│                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Workers (Processors)             │
│  - Process jobs concurrently            │
│  - Retry logic with backoff             │
│  - Progress tracking                     │
└─────────────────────────────────────────┘
```

### Queue Configuration

**Location**: `src/config/queue.ts`

**Queue Names**:
```typescript
QUEUE_NAMES = {
  CRYPTO_SYNC: 'crypto-sync',
  CRYPTO_PRICES: 'crypto-prices',
  CRYPTO_ANALYTICS: 'crypto-analytics',
  NOTIFICATIONS: 'notifications',
  MAINTENANCE: 'maintenance'
}
```

**Job Priorities**:
```typescript
JOB_PRIORITIES = {
  CRITICAL: 100,    // Price updates, notifications
  HIGH: 75,         // Wallet sync, transactions
  NORMAL: 50,       // Portfolio calculations
  LOW: 25,          // NFT sync, DeFi positions
  BACKGROUND: 10    // Snapshots, cleanup
}
```

**Default Job Options**:
```typescript
{
  removeOnComplete: 100,    // Keep last 100 completed jobs
  removeOnFail: 50,         // Keep last 50 failed jobs
  attempts: 3,              // Retry up to 3 times
  backoff: {
    type: 'exponential',
    delay: 2000             // Start with 2s, exponential backoff
  }
}
```

### Job Types

#### Crypto Jobs

**File**: `src/modules/crypto/jobs/cryptoJobs.ts`

**Job Types**:
```typescript
// High priority
SYNC_WALLET: 'sync-wallet'                    // Quick wallet sync
SYNC_WALLET_FULL: 'sync-wallet-full'          // Comprehensive sync

// Medium priority
SYNC_TRANSACTIONS: 'sync-transactions'        // Transaction sync
CALCULATE_PORTFOLIO: 'calculate-portfolio'    // Portfolio calculation

// Low priority
SYNC_NFTS: 'sync-nfts'                        // NFT collection sync
SYNC_DEFI: 'sync-defi'                        // DeFi position sync
CREATE_SNAPSHOT: 'create-snapshot'            // Historical snapshot
```

**Worker Configuration**:
```typescript
{
  connection: redisConfig,
  concurrency: 5,              // Process 5 jobs concurrently
  limiter: {
    max: 10,                   // Max 10 jobs
    duration: 1000             // per second
  }
}
```

**Job Processor**: `src/modules/crypto/jobs/cryptoJobProcessor.ts`

**Example Job Data**:
```typescript
{
  userId: "user_123",
  walletId: "wallet_456",
  syncTypes: ["assets", "transactions", "nfts"],
  fullSync: true
}
```

#### Banking Jobs

**File**: `src/modules/banking/jobs/bankingJobs.ts`

**Job Types**:
```typescript
syncAccount: 'syncAccount'           // Sync account balance
syncTransactions: 'syncTransactions' // Sync transactions
syncBalance: 'syncBalance'           // Quick balance update
```

**Worker Configuration**:
```typescript
{
  connection: redisConfig,
  concurrency: 3,              // Process 3 banking jobs concurrently
  limiter: {
    max: 5,                    // Max 5 jobs
    duration: 1000             // per second
  }
}
```

**Job Processor**: `src/modules/banking/jobs/bankingJobProcessor.ts`

#### Net Worth Jobs

**File**: `src/modules/networth/jobs/networthJobs.ts`

**Job Types**:
```typescript
createSnapshot: 'createSnapshot'              // Create net worth snapshot
createSnapshotForAllUsers: 'createSnapshotForAllUsers'
```

**Scheduler**: `src/modules/networth/jobs/snapshotScheduler.ts`

**Recurring Schedule**:
```typescript
// Daily at 1 AM UTC
schedule: '0 1 * * *'
granularity: 'DAILY'
```

### Real-Time Progress Tracking

**Service**: `UserSyncProgressManager` (Singleton)

**Location**: `src/modules/crypto/services/userSyncProgressManager.ts`

**Features**:
- Server-Sent Events (SSE) for real-time updates
- Connection pooling with per-user limits
- Automatic connection cleanup
- Heartbeat mechanism
- Memory monitoring

**Connection Limits**:
```typescript
MAX_CONNECTIONS_PER_USER: 10
CONNECTION_TIMEOUT: 5 minutes
```

**Progress Events**:
```typescript
{
  type: 'sync_started' | 'progress' | 'completed' | 'failed',
  walletId: 'wallet_123',
  progress: 0-100,
  status: 'syncing_assets' | 'syncing_transactions' | 'syncing_nfts',
  message?: string,
  error?: string
}
```

**Usage Example**:
```typescript
// Client connects to SSE endpoint
GET /api/v1/crypto/user/sync/stream

// Manager sends events as jobs progress
progressManager.updateProgress(userId, walletId, {
  progress: 25,
  status: 'syncing_transactions'
});
```

### Queue Health Monitoring

**Metrics Tracked**:
- Processed jobs count
- Failed jobs count
- Completed jobs count
- Average processing time
- Last job timestamp
- Retry count

**Health Checks**:
```typescript
// High failure rate (>10%)
if (failed > completed * 0.1) {
  issues.push('High failure rate');
}

// Large backlog (>1000 waiting)
if (waiting > 1000) {
  issues.push('Large backlog');
}

// Slow processing (>1 minute average)
if (averageProcessingTime > 60000) {
  issues.push('Slow processing');
}

// No recent activity (>5 minutes)
if (timeSinceLastJob > 300000) {
  issues.push('No recent activity');
}
```

**Admin Endpoints**:
```http
GET /api/v1/admin/queue-stats
GET /api/v1/admin/queue-health
POST /api/v1/admin/queues/{queueName}/pause
POST /api/v1/admin/queues/{queueName}/resume
POST /api/v1/admin/queues/cleanup
```

---

## Authentication & Authorization

### Better Auth Integration

**Framework**: Better Auth (https://www.better-auth.com/)

**Configuration**: `src/modules/auth/lib/auth.ts`

**Database Adapter**: Prisma

**Features Enabled**:
1. Email & Password authentication
2. Email verification
3. Password reset
4. Two-factor authentication (2FA)
5. Bearer token support for API access
6. Session management with Redis

### Authentication Flow

#### 1. Registration Flow

```
1. User submits registration form
   POST /api/v1/auth/sign-up
   { email, password, firstName, lastName }

2. Better Auth validates input and creates user
   - Password hashed with bcrypt (12 rounds)
   - User created with status: PENDING_VERIFICATION
   - Verification token generated

3. Verification email sent
   - Email service sends verification link
   - Link contains JWT token

4. User clicks verification link
   GET /api/v1/auth/verify-email?token={jwt}

5. Account activated
   - emailVerified set to true
   - status changed to ACTIVE
   - User automatically signed in
```

#### 2. Login Flow

```
1. User submits credentials
   POST /api/v1/auth/sign-in
   { email, password }

2. Better Auth validates credentials
   - Password verified with bcrypt
   - Email verification status checked

3. Session created
   - JWT token generated
   - Session stored in database
   - Cookie set (httpOnly, secure in production)

4. Response with user data and token
   { user: {...}, session: { token, expiresAt } }
```

#### 3. Token Refresh Flow

```
1. Client detects token expiration
   - Checks expiresAt timestamp

2. Request new token
   POST /api/v1/auth/refresh
   Cookie: session_token={old_token}

3. Better Auth validates session
   - Checks if session exists and not expired
   - Checks if user is still active

4. New token issued
   - Old session invalidated
   - New session created
   - New cookie set
```

### Authorization Levels

#### Role-Based Access Control (RBAC)

**Roles**:
```typescript
enum UserRole {
  USER      // Standard user
  PREMIUM   // Premium subscriber
  ADMIN     // Administrator
}
```

**Plan-Based Access Control**:
```typescript
enum PlanType {
  FREE      // Limited features
  PRO       // Standard features
  ULTIMATE  // All features
}
```

#### Feature Limits by Plan

```typescript
const PLAN_LIMITS = {
  FREE: {
    maxWallets: 3,
    maxBankAccounts: 2,
    maxBudgets: 5,
    maxGoals: 3,
    maxAssetAccounts: 5,
    syncFrequency: 'DAILY'
  },
  PRO: {
    maxWallets: 50,
    maxBankAccounts: 10,
    maxBudgets: 20,
    maxGoals: 10,
    maxAssetAccounts: 20,
    syncFrequency: 'HOURLY'
  },
  ULTIMATE: {
    maxWallets: -1,        // Unlimited
    maxBankAccounts: -1,
    maxBudgets: -1,
    maxGoals: -1,
    maxAssetAccounts: -1,
    syncFrequency: 'REALTIME'
  }
}
```

### Authentication Middleware

**File**: `src/shared/middleware/auth.ts`

**Usage**:
```typescript
import { authenticate } from '@/shared/middleware/auth';

router.get('/protected', authenticate, handler);
```

**Implementation**:
```typescript
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  // 1. Extract token from Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '');

  // 2. Verify token with Better Auth
  const session = await auth.api.getSession({ headers: req.headers });

  // 3. Attach user to request
  if (session?.user) {
    req.user = session.user;
    next();
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}
```

### Plan Limit Enforcement

**Middleware**: `src/shared/middleware/assetAccountLimits.ts`

**Example**:
```typescript
export const enforceWalletLimit = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const userPlan = req.user?.currentPlan || 'FREE';

  const walletCount = await prisma.cryptoWallet.count({
    where: { userId, isActive: true }
  });

  const limit = PLAN_LIMITS[userPlan].maxWallets;

  if (limit !== -1 && walletCount >= limit) {
    return res.status(403).json({
      success: false,
      error: 'Wallet limit exceeded for your plan',
      code: 'PLAN_LIMIT_EXCEEDED',
      currentCount: walletCount,
      limit: limit
    });
  }

  next();
};
```

### Security Features

1. **Password Security**:
   - Minimum 8 characters
   - Hashed with bcrypt (12 rounds)
   - Password reset with time-limited tokens

2. **Session Security**:
   - JWT tokens with expiration
   - Session stored in database for revocation
   - Secure cookies (httpOnly, secure in production)
   - CSRF protection (in production)

3. **Rate Limiting**:
   ```typescript
   rateLimit: {
     enabled: true,
     window: 60000,        // 1 minute
     max: 100              // 100 requests per minute
   }
   ```

4. **Email Verification**:
   - Required before account activation
   - Time-limited verification tokens
   - Automatic email on signup

5. **Two-Factor Authentication**:
   - TOTP-based 2FA
   - Backup codes generation
   - Recovery options

### API Authentication Examples

```typescript
// Standard authenticated request
GET /api/v1/crypto/wallets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Admin-only request
GET /api/v1/admin/users
Authorization: Bearer {admin_token}

// Public endpoint (no auth required)
GET /api/v1/integrations/providers
```

---

## Services Layer

### Service Architecture Overview

The application implements a sophisticated **service layer pattern** with 27+ specialized service classes organized into feature modules. Services encapsulate business logic, external API integrations, and data access operations.

### Core Service Patterns

#### 1. Singleton Pattern
Used for services requiring single instance:
```typescript
class QuickBooksService {
  private static instance: QuickBooksService;

  public static getInstance(): QuickBooksService {
    if (!QuickBooksService.instance) {
      QuickBooksService.instance = new QuickBooksService();
    }
    return QuickBooksService.instance;
  }
}
```

#### 2. Dependency Injection
Used in controllers and modular services:
```typescript
class BankingController {
  constructor(private bankingService: BankingService) {}
}
```

#### 3. Factory Pattern
Used for configured service creation:
```typescript
export function createZerionService(config: ZerionServiceConfig): ZerionService {
  return new ZerionService(config);
}
```

### Key Services

#### CryptoService
**Location**: `src/modules/crypto/services/cryptoService.ts`

**Responsibilities**:
- Multi-wallet portfolio management
- Wallet CRUD operations
- Provider coordination (Zerion + Zapper)
- Sync orchestration

**Key Methods**:
```typescript
async addWallet(userId: string, data: AddWalletDTO): Promise<CryptoWallet>
async getWalletPortfolio(walletId: string, userId: string): Promise<Portfolio>
async syncWallet(walletId: string, syncTypes: string[]): Promise<SyncResult>
async deleteWallet(walletId: string, userId: string): Promise<void>
```

#### BankingService
**Location**: `src/modules/banking/services/bankingService.ts`

**Responsibilities**:
- Bank account connection (Teller/Stripe)
- Transaction retrieval and categorization
- Balance tracking
- Sync management

**Key Methods**:
```typescript
async getAccountsPreview(enrollmentData: any): Promise<AccountPreview>
async connectBank(userId: string, enrollmentData: any, selectedIds: string[]): Promise<Account[]>
async getTransactions(userId: string, filters: TransactionFilters): Promise<Transaction[]>
async syncAccount(accountId: string): Promise<SyncResult>
```

#### NetWorthService
**Location**: `src/modules/networth/services/networthService.ts`

**Responsibilities**:
- Net worth aggregation across all account types
- Asset-liability categorization
- Performance metrics calculation
- Historical data tracking

**Key Methods**:
```typescript
async getNetWorth(userId: string): Promise<NetWorthSummary>
async getNetWorthBreakdown(userId: string): Promise<Breakdown>
async getNetWorthPerformance(userId: string, period: string): Promise<Performance>
async createSnapshot(userId: string, granularity: string): Promise<Snapshot>
```

#### ZerionService
**Location**: `src/modules/external-apis/zerion/services/zerionService.ts`

**Advanced Features**:
- Circuit breaker pattern
- Exponential backoff with jitter
- Request metrics tracking
- Health monitoring

**Circuit Breaker Implementation**:
```typescript
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: Date | null;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

async execute<T>(operation: () => Promise<T>): Promise<T> {
  if (this.state.state === 'OPEN') {
    if (this.shouldAttemptReset()) {
      this.state.state = 'HALF_OPEN';
    } else {
      throw new Error('Circuit breaker is OPEN');
    }
  }

  try {
    const result = await operation();
    this.onSuccess();
    return result;
  } catch (error) {
    this.onFailure();
    throw error;
  }
}
```

#### CacheService
**Location**: `src/shared/services/CacheService.ts`

**Features**:
- Redis-backed caching with graceful degradation
- Cache-aside pattern
- Tag-based invalidation
- Portfolio-specific methods

**Cache-Aside Pattern**:
```typescript
async getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try cache first
  const cached = await this.get<T>(key);
  if (cached !== null) return cached;

  // Fetch from source
  const value = await fetcher();

  // Cache in background
  this.set(key, value, options).catch(error => {
    logger.error('Cache set failed', { key, error });
  });

  return value;
}
```

### Error Handling Pattern

All services use custom error classes:

```typescript
class CryptoServiceError extends Error {
  constructor(
    message: string,
    public code: CryptoErrorCodes,
    public statusCode: number
  ) {
    super(message);
    this.name = 'CryptoServiceError';
  }
}

// Usage
throw new CryptoServiceError(
  'Wallet synchronization failed',
  CryptoErrorCodes.SYNC_FAILED,
  503
);
```

### Logging Pattern

Structured logging with Winston:

```typescript
logger.info('Wallet sync initiated', {
  userId: user.id,
  walletId: wallet.id,
  syncTypes: ['assets', 'transactions'],
  correlationId: req.correlationId
});

logger.error('External API failure', {
  provider: 'zerion',
  endpoint: 'wallet/portfolio',
  error: error.message,
  retryAttempt: 2,
  userId: user.id
});
```

---

## Development Guidelines

### Project Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

### Code Standards

#### TypeScript
- **Strict mode enabled**: `noImplicitAny`, `strictNullChecks`
- **Explicit return types** for all functions
- **No `any` types** unless absolutely necessary
- **Interface over type** for object shapes

#### File Naming
- **Controllers**: `{feature}Controller.ts` (PascalCase)
- **Services**: `{feature}Service.ts` (PascalCase)
- **Routes**: `{feature}.ts` or `index.ts` (camelCase)
- **Types**: `{feature}.types.ts` (camelCase)

#### Import Organization
```typescript
// 1. External packages
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// 2. Internal imports (using @ alias)
import { authenticate } from '@/shared/middleware/auth';
import { logger } from '@/shared/utils/logger';

// 3. Local imports
import { CryptoService } from './services/cryptoService';
```

### Testing (TODO - P0 Priority)

**Current Status**: Zero test coverage

**Required**:
- Unit tests for services (70%+ coverage)
- Integration tests for API endpoints
- E2E tests for critical flows

**Framework**: Jest + Supertest

**Example Structure**:
```
src/modules/crypto/
├── services/
│   ├── cryptoService.ts
│   └── __tests__/
│       └── cryptoService.test.ts
├── controllers/
│   ├── cryptoController.ts
│   └── __tests__/
│       └── cryptoController.test.ts
```

### Database Patterns

#### Transactions
```typescript
const result = await prisma.$transaction(async (tx) => {
  await tx.budget.update({
    where: { id: budgetId },
    data: { status: 'ACTIVE' }
  });

  await tx.budgetAlert.create({
    data: { budgetId, threshold: 50 }
  });

  return { success: true };
});
```

#### Pagination
```typescript
const [data, total] = await Promise.all([
  prisma.transaction.findMany({
    where: filters,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { date: 'desc' }
  }),
  prisma.transaction.count({ where: filters })
]);

return {
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
};
```

### API Design Principles

1. **RESTful conventions**: Use proper HTTP methods
2. **Consistent responses**: All responses follow same format
3. **Proper status codes**: 200, 201, 400, 401, 403, 404, 500
4. **Pagination**: Use `page` and `limit` query params
5. **Filtering**: Use query parameters for filtering
6. **Versioning**: All routes under `/api/v1`

### Performance Best Practices

1. **Database Indexes**: Add indexes on frequently queried fields
2. **Caching**: Cache expensive operations (portfolio calculations)
3. **Batch Operations**: Use `createMany`, `updateMany` where possible
4. **Connection Pooling**: Prisma handles this automatically
5. **Background Jobs**: Offload heavy operations to queues

---

## Configuration & Environment

### Required Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development|production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mappr

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_BASE_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret

# Frontend
FRONTEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@moneymappr.com

# Crypto Data Providers
ZERION_API_KEY=your-zerion-api-key
ZAPPER_API_KEY=your-zapper-api-key
CRYPTO_PRIMARY_PROVIDER=zapper
CRYPTO_FALLBACK_PROVIDER=zerion

# Banking Providers
TELLER_APPLICATION_ID=your-teller-app-id
TELLER_CERTIFICATE_PATH=/path/to/cert.pem
TELLER_CERTIFICATE_KEY_PATH=/path/to/key.pem

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# QuickBooks
QUICKBOOKS_CLIENT_ID=your-qb-client-id
QUICKBOOKS_CLIENT_SECRET=your-qb-client-secret
QUICKBOOKS_REDIRECT_URI=http://localhost:3000/api/v1/integrations/quickbooks/callback
QUICKBOOKS_ENVIRONMENT=sandbox|production
QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN=your-webhook-token
```

### Development vs Production

**Development** (`NODE_ENV=development`):
- Detailed error messages
- Ethereal email (test mode)
- Relaxed CORS
- Verbose logging
- Local Redis optional

**Production** (`NODE_ENV=production`):
- Generic error messages
- Real SMTP email
- Strict CORS
- Error-level logging only
- Redis required
- HTTPS enforced

### Docker Support

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: mappr
      POSTGRES_PASSWORD: mappr
      POSTGRES_DB: mappr
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://mappr:mappr@postgres:5432/mappr
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

### Logging Configuration

**Winston Configuration** (`src/shared/utils/logger.ts`):

```typescript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mappr-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});
```

---

## Deployment

### Build Process

```bash
# Install production dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Run database migrations
npx prisma migrate deploy

# Start production server
npm start
```

### Health Checks

```http
GET /health
Response: 200
{
  "status": "healthy",
  "timestamp": "2025-01-21T10:30:00Z",
  "uptime": 86400,
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "zerion": "healthy",
    "zapper": "healthy"
  }
}
```

### Monitoring

**Recommended Tools**:
- **APM**: Datadog, New Relic, or Application Insights
- **Logs**: CloudWatch, Papertrail, or Loggly
- **Metrics**: Prometheus + Grafana
- **Uptime**: Pingdom, UptimeRobot

**Key Metrics to Track**:
- API response times (P50, P95, P99)
- Error rates by endpoint
- Queue depth and processing times
- External API success rates
- Database query performance
- Redis cache hit rates

---

## API Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "RESOURCE_NOT_FOUND",
  "statusCode": 404
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 523,
    "pages": 11
  }
}
```

---

## Troubleshooting

### Common Issues

**1. Redis Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
Solution: Start Redis server or check REDIS_URL
```

**2. Database Migration Failed**
```
Error: P1001: Can't reach database server
Solution: Check DATABASE_URL and ensure Postgres is running
```

**3. JWT Token Invalid**
```
Error: Invalid token
Solution: Check BETTER_AUTH_SECRET matches between requests
```

**4. Rate Limit Exceeded**
```
Error: Too many requests
Solution: Wait or upgrade plan for higher rate limits
```

---

## Contributing

### Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push to remote: `git push origin feature/my-feature`
4. Create pull request

### Commit Message Convention

```
feat: add user authentication
fix: resolve wallet sync issue
docs: update API documentation
refactor: simplify crypto service
test: add unit tests for banking service
chore: update dependencies
```

---

## License

Proprietary - All rights reserved

---

## Support

For issues and questions:
- **GitHub Issues**: https://github.com/your-org/mappr-backend/issues
- **Documentation**: This file
- **API Reference**: `/docs` (Swagger UI when server is running)

---

**Last Updated**: January 21, 2025
**Version**: 1.0.0
**Maintainers**: Mappr Development Team
