# 01. System Architecture & Design Patterns

**Complete architectural documentation for the Mappr Backend application**

> **Note**: This document covers system-wide architecture and design patterns. For module-specific details, APIs, and types, see the individual module documentation in `modules/{module}/`.

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                               │
│  (Web, Mobile, Third-party Integrations)                           │
└───────────────┬─────────────────────────────────────────────────────┘
                │ HTTPS/WebSocket
┌───────────────▼─────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                               │
│  ├─ Express.js HTTP Server (Port 3000)                            │
│  ├─ Request Validation & Middleware                               │
│  ├─ Authentication & Authorization                                │
│  ├─ Rate Limiting & Plan Enforcement                              │
│  └─ CORS & Security Headers                                       │
└───────────────┬─────────────────────────────────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼──┐  ┌─────▼────┐  ┌──▼────┐
│Cache │  │Database  │  │Queue  │
│Redis │  │PostgreSQL│  │Redis  │
└──┬───┘  └─────▲────┘  └──▼────┘
   │            │           │
   └────────────┴───────────┘
       ▲
┌──────┴─────────────────────────────────────────────────────────────┐
│              BUSINESS LOGIC LAYER (Services)                      │
│  ├─ Crypto Services (15+ networks)                               │
│  ├─ Banking Services (Plaid, Teller, MX)                         │
│  ├─ Transaction Services                                          │
│  ├─ Auth & Subscription Services                                 │
│  ├─ External API Integration Services                            │
│  └─ Analytics & Monitoring Services                              │
└──────▲────────────────────────────────────────────────────────────┘
       │
    ┌──┴────────────────────────────────────────────────────────────┐
    │           CONTROLLER LAYER (API Endpoints)                   │
    │  ├─ Crypto Wallets, Portfolio, NFTs, DeFi                   │
    │  ├─ Banking Accounts, Sync, Reconciliation                  │
    │  ├─ Transactions, Categories, Rules                         │
    │  ├─ Auth, Users, Organizations                              │
    │  ├─ Subscriptions, Payments                                 │
    │  └─ Admin, Analytics                                         │
    └─────────────────────────────────────────────────────────────┘
        ▲
┌───────┴───────────────────────────────────────────────────────────┐
│         BACKGROUND PROCESSING LAYER (BullMQ)                      │
│  ├─ Crypto Sync Queue (SYNC_WALLET, SYNC_DEFI, etc.)            │
│  ├─ Transaction Sync Queue                                        │
│  ├─ Price Updates Queue                                           │
│  ├─ Notifications Queue                                           │
│  └─ Maintenance Queue                                             │
└─────────────────────────────────────────────────────────────────┘
        ▲
┌───────┴───────────────────────────────────────────────────────────┐
│         EXTERNAL SERVICE INTEGRATIONS                              │
│  ├─ Zerion SDK (Blockchain data - 15+ networks)                 │
│  ├─ Zapper GraphQL API (DeFi, NFTs, Social)                     │
│  ├─ Plaid API (Banking data)                                     │
│  ├─ Teller API (Alternative banking)                             │
│  ├─ MX Platform API (Alternative banking)                        │
│  ├─ Polar API (Payments)                                          │
│  └─ SMTP/Email Services                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Modular Structure

The application follows **Domain-Driven Design** with clear separation of concerns:

```
src/
├── modules/                        # Feature-based modules (13 total)
│   ├── crypto/                    # Cryptocurrency portfolio management
│   │   ├── controllers/           # HTTP handlers
│   │   ├── services/              # Business logic
│   │   ├── jobs/                  # Background processors
│   │   ├── routes/                # Route definitions
│   │   ├── types/                 # TypeScript interfaces
│   │   └── errors/                # Custom error classes
│   │
│   ├── banking/                   # Bank account integration
│   │   ├── controllers/           # HTTP handlers
│   │   ├── services/              # Plaid, Teller, MX integration
│   │   ├── providers/             # Provider abstractions
│   │   ├── jobs/                  # Sync jobs
│   │   └── webhooks/              # Webhook handlers
│   │
│   ├── transactions/              # Transaction management
│   │   ├── controllers/           # CRUD & advanced operations
│   │   ├── services/              # Categorization, search, rules
│   │   ├── jobs/                  # Processing jobs
│   │   └── types/                 # TypeScript definitions
│   │
│   ├── auth/                      # Authentication & authorization
│   │   ├── lib/                   # Better Auth configuration
│   │   ├── services/              # Auth logic
│   │   └── middleware/            # Auth middleware
│   │
│   ├── organizations/             # Multi-tenancy
│   │   ├── controllers/           # Org CRUD
│   │   ├── services/              # Org business logic
│   │   └── adapters/              # Data adapters
│   │
│   ├── subscriptions/             # Plan & billing
│   │   ├── controllers/           # Subscription CRUD
│   │   ├── services/              # Billing logic
│   │   └── webhooks/              # Stripe webhooks
│   │
│   ├── accounts/                  # Account grouping
│   │   ├── controllers/           # Account operations
│   │   └── services/              # Account logic
│   │
│   ├── external-apis/             # Third-party integrations
│   │   ├── zerion/                # Blockchain provider
│   │   ├── zapper/                # DeFi/NFT provider
│   │   └── polar/                 # Payment provider
│   │
│   ├── payments/                  # Payment processing
│   │   ├── controllers/           # Payment handlers
│   │   └── services/              # Payment logic
│   │
│   ├── usage/                     # Feature usage tracking
│   │   ├── controllers/           # Usage endpoints
│   │   └── services/              # Usage logic
│   │
│   ├── user-subscriptions/        # SaaS subscriptions
│   │   ├── controllers/           # SaaS endpoints
│   │   └── services/              # Detection logic
│   │
│   ├── integrations/              # Generic integrations
│   │   ├── core/                  # Base service
│   │   └── registry/              # Integration registry
│   │
│   ├── admin/                     # Admin functions
│   │   ├── controllers/           # Admin endpoints
│   │   └── routes/                # Admin routes
│   │
│   └── organizations/             # (shown earlier)
│
├── shared/                        # Cross-cutting concerns
│   ├── middleware/                # Middleware stack
│   │   ├── auth.ts                # Authentication
│   │   ├── rateLimitMiddleware.ts # Rate limiting
│   │   ├── errorHandler.ts        # Error handling
│   │   ├── metricsMiddleware.ts   # Metrics collection
│   │   └── ... (12+ more)
│   │
│   ├── services/                  # Shared services
│   │   ├── CacheService.ts        # Redis caching
│   │   ├── encryptionService.ts   # Encryption
│   │   ├── s3Service.ts           # File storage
│   │   ├── metricsService.ts      # Metrics
│   │   └── ... (9+ more)
│   │
│   ├── utils/                     # Utilities
│   │   ├── logger.ts              # Logging
│   │   ├── validation.ts          # Validation
│   │   ├── trackingDecorators.ts  # Tracking
│   │   └── ... (more)
│   │
│   ├── patterns/                  # Design patterns
│   │   └── CircuitBreaker.ts      # Circuit breaker
│   │
│   └── types/                     # Shared types
│       └── index.ts               # Type exports
│
├── config/                        # Configuration
│   ├── environment.ts             # Environment config
│   ├── database.ts                # Database setup
│   ├── queue.ts                   # Job queue config
│   ├── plans.ts                   # Plan definitions
│   └── swagger.ts                 # API documentation
│
├── types/                         # Global types
│   ├── crypto.ts                  # Crypto types
│   ├── banking.ts                 # Banking types
│   └── error.ts                   # Error types
│
├── routes/                        # Legacy route definitions
│   ├── api.ts                     # Main API routes
│   ├── auth.ts                    # Auth routes
│   └── ... (more)
│
├── server.ts                      # HTTP server entry
├── app.ts                         # Express app setup
├── worker.ts                      # Background worker
└── workers.ts                     # Worker management
```

## 🔄 Data Flow Architecture

### 1. Request Flow

```
Client Request
    ↓
[Express Middleware Chain]
    ├─ Parse JSON/Form
    ├─ Security Headers
    ├─ CORS Check
    ├─ Authentication (JWT/Session)
    ├─ Request Validation
    ├─ Rate Limiting
    ├─ Organization Context
    └─ Request Correlation ID
    ↓
[Route Handler]
    ↓
[Controller]
    └─ Extract & validate request data
    └─ Call appropriate service(s)
    ↓
[Service Layer]
    ├─ Apply business logic
    ├─ Validate authorization
    ├─ Transform data
    ├─ Database operations (Prisma)
    ├─ Cache operations (Redis)
    ├─ External API calls (Circuit Breaker)
    └─ Event emission
    ↓
[Response Transformation]
    ├─ Serialize data
    ├─ Format response
    └─ Add metadata
    ↓
[Error Handler]
    └─ Catch & format errors
    ↓
Client Response (JSON)
```

### 2. Background Job Flow

```
Trigger Event (API call, scheduled, event)
    ↓
[Job Creation]
    ├─ Create job with payload
    ├─ Set priority (CRITICAL → BACKGROUND)
    ├─ Schedule retry policy
    └─ Add correlation ID
    ↓
[Redis Queue]
    └─ Store job in BullMQ queue
    ↓
[Worker Process]
    ├─ Pick job from queue
    ├─ Check circuit breaker status
    ├─ Execute job handler
    ├─ Report progress (SSE)
    ├─ Handle errors with exponential backoff
    └─ Update job status
    ↓
[Completion]
    ├─ Store results in cache
    ├─ Update database
    ├─ Emit completion event
    ├─ Send notifications
    └─ Log metrics
```

### 3. Crypto Sync Flow (Real Example)

```
User clicks "Sync Wallet"
    ↓
[POST /api/v1/crypto/wallets/:id/sync]
    ↓
cryptoController.syncWallet()
    ├─ Validate wallet exists & user has access
    ├─ Check plan limits (wallet sync count)
    └─ Create sync job
    ↓
Queue SYNC_WALLET_FULL job (Priority: HIGH)
    ├─ Job payload: userId, walletId, syncTypes
    ├─ Retry: exponential backoff (3 attempts)
    └─ Store in BullMQ Redis queue
    ↓
Return immediate response to user
    └─ { jobId, status: "queued" }
    ↓
[Optional: SSE Connection]
User can connect to GET /api/v1/crypto/user/sync/stream
    └─ Real-time progress updates via UserSyncProgressManager
    ↓
[Worker Process - Async]
porfolioProcessor.processPortfolioSync()
    ├─ Update progress: "fetching_assets"
    ├─ Call Zerion SDK (with circuit breaker)
    ├─ Store assets in cache & database
    ├─ Update progress: "fetching_transactions"
    ├─ Call Zerion for transactions
    ├─ Store transactions
    ├─ Update progress: "fetching_defi"
    ├─ Call Zapper for DeFi positions
    ├─ Store DeFi data
    ├─ Update progress: "calculating_portfolio"
    ├─ Calculate portfolio metrics
    ├─ Create portfolio snapshot
    └─ Update progress: "completed"
    ↓
[Job Completion]
    ├─ Store results in Redis
    ├─ Update database lastSyncAt timestamp
    ├─ Emit sync_completed event
    ├─ Send push notification to user
    └─ Log metrics
```

## 🎨 Design Patterns Used

### 1. Service Pattern
**Purpose**: Centralize business logic separate from HTTP concerns

```typescript
// Controller delegates to service
@Post('/wallets')
async addWallet(req: Request, res: Response) {
  const wallet = await CryptoService.getInstance()
    .addWallet(req.user.id, req.body);
  res.json(wallet);
}

// Service handles all business logic
class CryptoService {
  async addWallet(userId: string, data: CreateWalletDTO) {
    // Validation
    if (!isValidAddress(data.address)) {
      throw new ValidationError('Invalid wallet address');
    }

    // Authorization check
    await this.enforceWalletLimit(userId);

    // Database operation
    const wallet = await prisma.cryptoWallet.create({
      data: {
        userId,
        address: data.address,
        network: data.network
      }
    });

    // Background job
    await this.scheduleWalletSync(userId, wallet.id);

    // Event emission
    await eventEmitter.emit('wallet:created', wallet);

    return wallet;
  }
}
```

**Benefits**:
- Business logic separated from HTTP
- Easy to test and mock
- Reusable across multiple controllers
- Centralized error handling

### 2. Circuit Breaker Pattern
**Purpose**: Prevent cascading failures when external APIs fail

```typescript
class ExternalServiceClient {
  private circuitBreaker = {
    failures: 0,
    lastFailureTime: null,
    state: 'CLOSED' // CLOSED | OPEN | HALF_OPEN
  };

  async makeRequest(operation: () => Promise<any>) {
    // Check circuit state
    if (this.circuitBreaker.state === 'OPEN') {
      const timeElapsed = Date.now() - this.circuitBreaker.lastFailureTime;
      if (timeElapsed > 60000) { // Reset after 60s
        this.circuitBreaker.state = 'HALF_OPEN';
      } else {
        throw new CircuitBreakerError('Service temporarily unavailable');
      }
    }

    try {
      const result = await operation();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure() {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailureTime = Date.now();

    if (this.circuitBreaker.failures >= 5) {
      this.circuitBreaker.state = 'OPEN';
    }
  }

  private recordSuccess() {
    this.circuitBreaker.failures = 0;
    this.circuitBreaker.state = 'CLOSED';
  }
}
```

**Used for**: Zerion API, Zapper API, Banking APIs

**Benefits**:
- Graceful degradation on API failures
- Automatic recovery attempts
- Prevents resource exhaustion

### 3. Event-Driven Architecture
**Purpose**: Loose coupling between modules via events

```typescript
// Event emission
class TransactionService {
  async createTransaction(data: CreateTransactionDTO) {
    const transaction = await prisma.transaction.create({ data });

    // Emit event - other modules subscribe
    await eventEmitter.emit('transaction:created', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      category: transaction.category
    });

    return transaction;
  }
}

// Event subscription
class NotificationService {
  constructor() {
    eventEmitter.on('transaction:created', (event) => {
      this.sendTransactionAlert(event.userId, event);
    });
  }
}

class AnalyticsService {
  constructor() {
    eventEmitter.on('transaction:created', (event) => {
      this.recordMetric('transaction_created', event);
    });
  }
}
```

**Benefits**:
- Loose coupling between modules
- Easy to add new subscribers
- Asynchronous processing

### 4. Real-time Progress Tracking (SSE)
**Purpose**: Stream real-time updates to clients during long operations

```typescript
class UserSyncProgressManager {
  private connections = new Map<string, Response>();

  addConnection(userId: string, res: Response) {
    this.connections.set(userId, res);

    // Send heartbeat to keep connection alive
    const interval = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    res.on('close', () => {
      this.connections.delete(userId);
      clearInterval(interval);
    });
  }

  updateProgress(userId: string, walletId: string, data: any) {
    const res = this.connections.get(userId);
    if (res) {
      res.write(`data: ${JSON.stringify({
        walletId,
        ...data,
        timestamp: new Date().toISOString()
      })}\n\n`);
    }
  }
}

// Usage in background job
async function processSyncJob(job: Job) {
  const { userId, walletId } = job.data;
  const progressManager = UserSyncProgressManager.getInstance();

  // Job starts
  progressManager.updateProgress(userId, walletId, {
    status: 'syncing_assets',
    progress: 20
  });

  // Fetch data
  const assets = await zerionService.getAssets(walletId);

  // Update progress
  progressManager.updateProgress(userId, walletId, {
    status: 'syncing_transactions',
    progress: 50
  });

  // More work...
}
```

**Benefits**:
- Users see real-time progress
- No need for polling
- Efficient WebSocket alternative

### 5. Multi-Tenancy with Organizations
**Purpose**: Isolated data per organization while sharing infrastructure

```typescript
// Middleware extracts organization context
app.use(organizationMiddleware);

declare global {
  namespace Express {
    interface Request {
      organizationId?: string;
      user?: { id: string; organizations: string[] };
    }
  }
}

// All queries automatically scoped to organization
class TransactionService {
  async getTransactions(userId: string, filters?: any) {
    return prisma.transaction.findMany({
      where: {
        userId,
        organizationId: getCurrentOrganizationId(), // Added automatically
        ...filters
      }
    });
  }
}

// Authorization middleware
async function enforceOrganizationAccess(req, res, next) {
  const userId = req.user?.id;
  const organizationId = req.organizationId;

  const member = await prisma.member.findUnique({
    where: {
      userId_organizationId: { userId, organizationId }
    }
  });

  if (!member) {
    return res.status(403).json({
      error: 'Unauthorized access to organization'
    });
  }

  next();
}
```

**Benefits**:
- Complete data isolation
- Shared infrastructure & costs
- Easy to add per-organization features

### 6. Plan-Based Access Control
**Purpose**: Enforce feature limits based on subscription plan

```typescript
async function enforceWalletLimit(
  userId: string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: { include: { plan: true } } }
  });

  const walletCount = await prisma.cryptoWallet.count({
    where: { userId }
  });

  const limits = {
    FREE: 3,
    PRO: 50,
    ULTIMATE: -1 // Unlimited
  };

  const limit = limits[user.subscription.plan.name];

  if (limit !== -1 && walletCount >= limit) {
    return res.status(403).json({
      success: false,
      error: 'Wallet limit exceeded for your plan',
      code: 'PLAN_LIMIT_EXCEEDED',
      current: walletCount,
      limit: limit
    });
  }

  next();
}
```

**Benefits**:
- Enforce monetization strategy
- Different features per plan
- Easy to change limits

### 7. Dependency Injection via Singleton
**Purpose**: Single instance of services across app

```typescript
class CryptoService {
  private static instance: CryptoService;

  private constructor() {
    // Private to prevent multiple instantiation
  }

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  // Service methods...
}

// Usage
const cryptoService = CryptoService.getInstance();
const wallets = await cryptoService.getWallets(userId);
```

**Benefits**:
- One instance per application
- Shared state & cache
- Easy to mock in tests

### 8. Error Handling Hierarchy
**Purpose**: Structured error responses with proper HTTP status codes

```typescript
class ServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends ServiceError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString()
    });
  }

  // Unknown error
  logger.error('Unexpected error', { error, path: req.path });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
});
```

**Benefits**:
- Consistent error response format
- Proper HTTP status codes
- Easy client-side error handling

## 🌊 Data Flow Examples

### Example 1: User adds a cryptocurrency wallet

```
1. User clicks "Add Wallet"
   ↓
2. POST /api/v1/crypto/wallets
   body: { address: "0x...", network: "ethereum", name: "My Wallet" }
   ↓
3. Middleware chain:
   ├─ Auth: Verify JWT token
   ├─ Validation: Check address format
   ├─ RateLimit: Check rate limit
   └─ Organization: Extract organizationId
   ↓
4. cryptoController.addWallet()
   ├─ Extract userId, organizationId
   └─ Call CryptoService.addWallet()
   ↓
5. CryptoService.addWallet()
   ├─ Validate address (isValidAddress)
   ├─ Check plan limit (MAX wallets for plan)
   ├─ Prisma transaction:
   │  ├─ INSERT into crypto_wallets
   │  └─ INSERT into sync_state (lastSyncAt = null)
   ├─ Queue SYNC_WALLET_FULL job (HIGH priority)
   └─ Emit 'wallet:created' event
   ↓
6. Event subscribers notified:
   ├─ AnalyticsService: log wallet_created metric
   └─ NotificationService: send confirmation email
   ↓
7. Return response to user:
   {
     id: "wallet_123",
     address: "0x...",
     network: "ethereum",
     name: "My Wallet",
     totalBalanceUsd: null,  // Will be populated after sync
     lastSyncAt: null,
     createdAt: "2025-01-18T10:00:00Z"
   }
   ↓
8. [Background] Worker picks up SYNC_WALLET_FULL job
   ├─ Call Zerion SDK (with circuit breaker)
   ├─ Get assets, transactions, DeFi positions
   ├─ Store in cache & database
   ├─ Calculate portfolio
   ├─ Send progress updates via SSE
   └─ Mark sync complete
   ↓
9. User sees updated portfolio in real-time (if SSE connected)
```

### Example 2: Bank account synchronization

```
1. User initiates bank account link
   ↓
2. POST /api/v1/banking/plaid/link-token
   ↓
3. bankingController.generatePlaidLinkToken()
   ├─ Get user details
   └─ Call PlaidProviderService.generateLinkToken()
   ↓
4. Return to user with Plaid Link token
   ↓
5. User completes Plaid flow (OAuth)
   ↓
6. POST /api/v1/banking/plaid/exchange-token
   body: { publicToken: "..." }
   ↓
7. bankingController.exchangePlaidToken()
   ├─ Call PlaidProviderService.exchangePublicToken()
   └─ Call BankingSyncService.createConnection()
   ↓
8. BankingSyncService:
   ├─ Store access token (encrypted)
   ├─ Fetch accounts from Plaid
   ├─ Create FinancialAccount records
   ├─ Queue initial SYNC_BANK_ACCOUNTS job
   └─ Return connected accounts
   ↓
9. [Background] Worker processes initial sync
   ├─ Fetch 3+ months of transactions
   ├─ Deduplicate against existing
   ├─ Categorize transactions
   ├─ Create balance snapshots
   └─ Generate sync report
   ↓
10. [Ongoing] Daily sync jobs pick up new transactions
    (via BullMQ scheduled jobs)
```

### Example 3: Transaction categorization

```
1. New transaction synced from bank
   ↓
2. TransactionService.createTransaction()
   ├─ Store transaction in DB
   └─ Emit 'transaction:created' event
   ↓
3. CategorizationService subscribes to event
   ├─ Analyze merchant name
   ├─ Check transaction rules
   ├─ Run ML model for category prediction
   ├─ Store suggested category
   └─ Emit 'transaction:categorized' event
   ↓
4. User can accept or override suggestion
   ↓
5. PUT /api/v1/transactions/:id
   body: { category: "groceries" }
   ↓
6. TransactionService.updateTransaction()
   ├─ Update category
   ├─ Track category change history
   ├─ Retrain categorization model
   └─ Emit 'transaction:updated' event
   ↓
7. AnalyticsService updates spending metrics
   ├─ Category spending totals
   ├─ Merchant statistics
   └─ Budget tracking
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User registration/login
   ↓
2. Better Auth creates session
   ↓
3. JWT token issued with claims:
   {
     sub: userId,
     org: organizationId,
     plan: "PRO",
     iat: 1705593600,
     exp: 1705680000
   }
   ↓
4. Each request includes: Authorization: Bearer <JWT>
   ↓
5. Auth middleware verifies:
   ├─ Token signature
   ├─ Token expiration
   ├─ User still exists & active
   └─ User still has access to organization
   ↓
6. Request context populated with user info
```

### Plan Enforcement
```
User makes API request
    ↓
Middleware checks:
├─ Rate limit (10-200 requests depending on endpoint)
├─ Feature access (is this feature in user's plan?)
└─ Quota (how many wallets/accounts can user create?)
    ↓
If limit exceeded:
    ├─ Return 429 (Rate Limit)
    └─ Return 403 (Plan Limit)
    ↓
If allowed: Process request
```

## 🎯 Performance Architecture

### Caching Strategy

**Level 1: Browser Cache**
- Swagger documentation
- Static assets

**Level 2: HTTP Cache**
- Exchange rates: 1 hour
- Provider status: 5 minutes
- Asset metadata: 24 hours

**Level 3: Redis Cache**
- Portfolio data: 5 minutes
- Asset prices: 5 minutes
- User preferences: 1 hour
- Transaction search indexes: 30 minutes

**Level 4: Database**
- Primary data source
- Optimized with indexes
- Connection pooling

```typescript
// Multi-level caching example
async function getAssetPrice(symbol: string) {
  // L1: Memory cache (milliseconds)
  const memory = memoryCache.get(`price:${symbol}`);
  if (memory && !isExpired(memory)) return memory.value;

  // L2: Redis cache (microseconds)
  const redis = await redisClient.get(`price:${symbol}`);
  if (redis) {
    const value = JSON.parse(redis);
    memoryCache.set(`price:${symbol}`, { value, expires: now + 5min });
    return value;
  }

  // L3: External API (milliseconds)
  const price = await externalService.getPrice(symbol);

  // Cache for next time
  await redisClient.setex(`price:${symbol}`, 300, JSON.stringify(price));
  memoryCache.set(`price:${symbol}`, { value: price, expires: now + 5min });

  return price;
}
```

### Database Optimization

**Indexing Strategy**:
```
PRIMARY INDEXES:
├─ users(id) PRIMARY KEY
├─ crypto_wallets(userId, network)
├─ crypto_positions(walletId)
├─ transactions(userId, date DESC)
├─ categories(userId)
└─ financial_accounts(userId)

COMPOSITE INDEXES:
├─ transactions(userId, date, categoryId)
├─ crypto_wallets(userId, lastSyncAt)
├─ financial_accounts(userId, status)
└─ sync_state(userId, lastSyncAt)
```

### Query Optimization

**N+1 Query Prevention**:
```typescript
// ❌ Bad: N+1 queries
const wallets = await prisma.cryptoWallet.findMany();
const portfolios = wallets.map(w =>
  prisma.cryptoPosition.findMany({ where: { walletId: w.id } })
);

// ✅ Good: Single query with eager loading
const wallets = await prisma.cryptoWallet.findMany({
  include: {
    positions: true,
    transactions: true,
    nfts: true
  }
});
```

**Pagination**:
```typescript
// Cursor-based pagination for large datasets
async function getTransactionsPaginated(
  userId: string,
  cursor?: string,
  limit = 20
) {
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(cursor && { id: { lt: cursor } })
    },
    orderBy: { timestamp: 'desc' },
    take: limit + 1,
    include: {
      category: { select: { name: true } },
      merchant: { select: { name: true } }
    }
  });
}
```

## 📊 Scalability Architecture

### Horizontal Scaling
- Stateless Express servers (can add load balancer)
- Centralized Redis session store
- Shared PostgreSQL database with connection pooling
- Distributed background jobs (multiple workers)

### Vertical Scaling
- Database connection pooling (PgBouncer)
- Redis memory management
- Worker concurrency tuning
- Node.js heap size optimization

### Queue Management
```
BullMQ Setup:
├─ Multiple queue handlers
├─ Configurable concurrency (default: 5)
├─ Max attempts with backoff
├─ Circuit breaker for external APIs
└─ Memory monitoring
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────┐
│          Load Balancer (NGINX)          │
└──────────────┬──────────────────────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
  ┌──▼─┐   ┌──▼─┐   ┌──▼─┐
  │API-1│   │API-2│   │API-N│  (Stateless replicas)
  └──┬──┘   └──┬──┘   └──┬──┘
     │         │         │
     └─────────┼─────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼──┐  ┌────▼─────┐ ┌──▼─────┐
│Redis │  │PostgreSQL│ │Workers │
│Cache │  │Database  │ │(BullMQ)│
└──────┘  └──────────┘ └────────┘
```

**Deployment Options**:
- Docker containers on Kubernetes
- AWS ECS with load balancer
- Heroku with worker dynos
- DigitalOcean App Platform

---

## Summary

The Mappr Backend uses a **layered, modular architecture** with:
- **Domain-Driven Design** separating concerns by business domain
- **Service Pattern** centralizing business logic
- **Circuit Breakers** for fault tolerance
- **Event-Driven** communication between modules
- **Real-time Streaming** for user updates
- **Multi-Tenancy** with organization isolation
- **Plan-Based** access control
- **Background Jobs** for async processing
- **Multi-level Caching** for performance
- **Horizontal Scaling** support

This architecture enables building complex financial applications with reliability, scalability, and maintainability.
