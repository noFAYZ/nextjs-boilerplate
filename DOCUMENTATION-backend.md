# Mappr Backend Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Module Documentation](#module-documentation)
6. [Database Design](#database-design)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [Performance & Scalability](#performance--scalability)
10. [Monitoring & Analytics](#monitoring--analytics)
11. [Deployment Architecture](#deployment-architecture)

## System Overview

Mappr Backend is a comprehensive TypeScript/Node.js financial management platform specializing in cryptocurrency portfolio tracking, DeFi analytics, and blockchain data aggregation. The system is built with a microservices-inspired modular architecture designed for high-scale SaaS operations.

### Key Features
- **Multi-blockchain Portfolio Tracking**: Support for 15+ blockchain networks
- **Real-time Data Synchronization**: Live updates from external providers
- **DeFi Protocol Integration**: Advanced position tracking and yield monitoring
- **NFT Collection Management**: Comprehensive NFT tracking with valuations
- **Background Job Processing**: Scalable async operations with BullMQ
- **Advanced Analytics**: System metrics and user behavior tracking
- **Enterprise Authentication**: Better Auth with 2FA support

## Architecture Principles

### 1. Domain-Driven Design (DDD)
- **Modular Structure**: Each business domain is isolated in its own module
- **Bounded Contexts**: Clear boundaries between functional areas
- **Ubiquitous Language**: Consistent terminology across the codebase

### 2. Clean Architecture
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Separation of Concerns**: Controllers, services, and data access are separated
- **Single Responsibility**: Each module has a single, well-defined responsibility

### 3. Microservices Patterns
- **Service Isolation**: Modules can be deployed independently
- **API Gateway Pattern**: Centralized routing and middleware
- **Circuit Breaker Pattern**: Fault tolerance for external services
- **Event-Driven Architecture**: Background job processing with queues

## Technology Stack

### Core Technologies
```typescript
{
  // Runtime & Framework
  "node.js": "20+",
  "typescript": "5.3.3",
  "express.js": "4.18.2",

  // Database & ORM
  "postgresql": "Latest",
  "prisma": "5.7.1",
  "redis": "Latest",

  // Authentication & Security
  "better-auth": "1.3.7",
  "bcryptjs": "2.4.3",
  "helmet": "7.1.0",

  // Background Processing
  "bullmq": "4.15.5",
  "ioredis": "5.3.2",

  // External APIs
  "zerion-sdk-ts": "1.0.5",
  "axios": "1.12.2",

  // Validation & Types
  "zod": "3.22.4",
  "joi": "18.0.1",

  // Monitoring & Logging
  "winston": "3.11.0",
  "morgan": "1.10.0"
}
```

### Development Tools
- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **Nodemon**: Development hot reloading
- **Swagger**: API documentation

## System Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                   API GATEWAY LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Express   │ │   Helmet    │ │ Rate Limit  │           │
│  │   Router    │ │  Security   │ │   Middleware│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                 BUSINESS LOGIC LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Crypto    │ │    Auth     │ │  Analytics  │           │
│  │   Module    │ │   Module    │ │   Module    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Payments  │ │   Usage     │ │   Admin     │           │
│  │   Module    │ │   Module    │ │   Module    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                  DATA ACCESS LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Prisma    │ │   Redis     │ │  External   │           │
│  │    ORM      │ │   Cache     │ │    APIs     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                   PERSISTENCE LAYER                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ PostgreSQL  │ │   Redis     │ │   Zerion    │           │
│  │  Database   │ │   Store     │ │   & Zapper  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Architecture
```
Client Request
     ↓
[Express Middleware Chain]
     ↓
[Authentication & Authorization]
     ↓
[Rate Limiting & Validation]
     ↓
[Module Controller]
     ↓
[Service Layer]
     ↓
[Data Access Layer]
     ↓
[Database/Cache/External APIs]
     ↓
[Response Middleware]
     ↓
Client Response
```

## Module Documentation

### 1. Crypto Module (`/src/modules/crypto/`)
**Purpose**: Core cryptocurrency portfolio management and blockchain data processing

#### Components:
- **Controllers**: API endpoint handlers for wallets, portfolios, and sync operations
- **Services**: Business logic for crypto operations and data processing
- **Jobs**: Background processing for data synchronization
- **Routes**: API route definitions and middleware

#### Key Features:
- Multi-wallet portfolio tracking (15+ networks)
- Real-time sync with external providers
- DeFi position monitoring
- NFT collection tracking
- Transaction history analysis

#### File Structure:
```
crypto/
├── controllers/
│   ├── cryptoController.ts      # Main crypto operations
│   ├── portfolioController.ts   # Portfolio analytics
│   ├── walletController.ts      # Wallet CRUD operations
│   └── syncController.ts        # Data synchronization
├── services/
│   ├── cryptoService.ts         # Core business logic
│   ├── assetCacheService.ts     # Asset price caching
│   ├── defiAppService.ts        # DeFi protocol management
│   └── userSyncProgressManager.ts # Real-time sync tracking
├── jobs/
│   ├── cryptoJobs.ts           # Job definitions and workers
│   ├── portfolio/              # Portfolio calculation jobs
│   ├── positions/              # Asset position updates
│   └── transactions/           # Transaction sync jobs
└── routes/
    └── crypto.ts               # API route definitions
```

### 2. External APIs Module (`/src/modules/external-apis/`)
**Purpose**: Third-party blockchain data provider integrations

#### Zerion Integration (`/zerion/`)
- **Advanced circuit breaker pattern** for fault tolerance
- **Exponential backoff with jitter** for retries
- **Request correlation and performance tracking**
- **Comprehensive health monitoring**

#### Zapper Integration (`/zapper/`)
- **GraphQL client with rate limiting**
- **Advanced DeFi position breakdown**
- **NFT metadata and valuation tracking**
- **Multi-level token composition parsing**

#### File Structure:
```
external-apis/
├── zerion/
│   ├── services/zerionService.ts  # Primary blockchain data
│   ├── circuitBreaker.ts          # Fault tolerance
│   ├── metrics.ts                 # Performance tracking
│   └── types.ts                   # Type definitions
└── zapper/
    ├── services/zapperService.ts  # Secondary DeFi/NFT data
    └── utils/
        ├── appBalanceParser.ts    # Balance parsing logic
        └── zapperMapper.ts        # Data transformation
```

### 3. Authentication Module (`/src/modules/auth/`)
**Purpose**: User authentication, authorization, and session management

#### Features:
- **Better Auth integration** with multiple providers
- **JWT token management** with secure refresh
- **Role-based access control** (USER, PREMIUM, ADMIN)
- **Plan-based feature limitations**
- **Email verification and 2FA support**

#### File Structure:
```
auth/
├── lib/
│   └── auth.ts                  # Better Auth configuration
├── services/
│   └── email.ts                 # Email service with templates
└── middleware/
    └── authMiddleware.ts        # Authentication middleware
```

### 4. Analytics Module (`/src/modules/analytics/`)
**Purpose**: System monitoring, metrics collection, and performance tracking

#### Features:
- **API request/response analytics**
- **External service performance tracking**
- **User behavior metrics**
- **Real-time dashboard data**
- **Error aggregation and alerting**

### 5. Subscription & Payment Modules
**Purpose**: User plan management and payment processing

#### Subscription Module:
- Plan management (FREE, PRO, ULTIMATE)
- Feature limitation enforcement
- Subscription lifecycle management

#### Payment Module:
- Payment processing integration
- Subscription billing management
- Payment history tracking

### 6. Usage Module
**Purpose**: Feature usage tracking and analytics

#### Features:
- Feature usage monitoring
- Plan limit enforcement
- Usage analytics and reporting

### 7. Admin Module
**Purpose**: Administrative functions and system management

#### Features:
- User management
- System analytics
- Queue monitoring
- Maintenance operations

## Database Design

### Schema Overview
The database uses PostgreSQL with Prisma ORM, featuring comprehensive schemas for:

#### Core User Management
```sql
-- Users with roles, plans, and metadata
users (id, email, role, currentPlan, ...)

-- OAuth accounts (Better Auth)
account (id, userId, providerId, ...)

-- Sessions with Redis backend
session (id, userId, token, expiresAt, ...)
```

#### Cryptocurrency Portfolio Schema
```sql
-- Multi-network wallet support
crypto_wallets (id, userId, address, network, ...)

-- Asset position tracking with P&L
crypto_positions (id, walletId, assetId, balance, balanceUsd, ...)

-- Transaction history
crypto_transactions (id, walletId, hash, type, status, ...)

-- NFT collections
crypto_nfts (id, walletId, contractAddress, tokenId, ...)
```

#### DeFi Integration Schema
```sql
-- DeFi protocol registry
defi_apps (id, slug, network, displayName, ...)

-- Normalized DeFi positions
defi_app_positions (id, walletId, appId, contractAddress, ...)

-- Legacy DeFi positions (being migrated)
defi_positions (id, walletId, protocolName, ...)
```

#### Subscription & Payment Schema
```sql
-- Subscription plans
plans (id, type, name, maxWallets, maxTransactions, ...)

-- User subscriptions
subscriptions (id, userId, planType, status, ...)

-- Payment history
payments (id, subscriptionId, amount, status, ...)
```

#### Analytics Schema
```sql
-- API request analytics
api_analytics (id, endpoint, method, responseTime, ...)

-- External API monitoring
external_api_analytics (id, provider, endpoint, responseTime, ...)

-- Pre-computed analytics
analytics_aggregations (id, date, granularity, scope, ...)
```

### Key Database Features
- **Comprehensive indexing** for performance
- **Foreign key constraints** for data integrity
- **Enum types** for data validation
- **JSON fields** for flexible metadata storage
- **Unique constraints** for data consistency

## API Design

### RESTful API Structure
Base URL: `/api/v1`

#### Authentication Endpoints
```
POST /auth/register           # User registration
POST /auth/login              # User authentication
POST /auth/logout             # Session termination
GET  /auth/me                 # Current user profile
POST /auth/forgot-password    # Password reset
```

#### Crypto Portfolio Endpoints
```
# Wallet Management
GET    /crypto/wallets            # List user wallets
POST   /crypto/wallets            # Add new wallet
GET    /crypto/wallets/{id}       # Get wallet details
PUT    /crypto/wallets/{id}       # Update wallet
DELETE /crypto/wallets/{id}       # Remove wallet

# Portfolio Analytics
GET    /crypto/portfolio          # Aggregated portfolio
GET    /crypto/analytics          # Performance metrics

# Live Data
GET    /crypto/wallet/portfolio/live    # Live portfolio data
GET    /crypto/wallet/transactions/live # Live transactions

# Synchronization
POST   /crypto/wallets/{id}/sync        # Trigger sync
GET    /crypto/user/sync/stream         # SSE sync progress
```

#### Subscription Endpoints
```
GET    /subscriptions/plans       # Available plans
GET    /subscriptions/current     # Current subscription
POST   /subscriptions/subscribe   # Create subscription
PUT    /subscriptions/change-plan # Change plan
```

### API Response Format
```typescript
// Success Response
{
  success: true,
  data: T,
  timestamp: string
}

// Error Response
{
  success: false,
  error: string,
  code: string,
  timestamp: string
}

// Paginated Response
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

### Rate Limiting Strategy
- **General API**: 100 requests per 15 minutes
- **Write Operations**: 10 requests per minute
- **Sync Operations**: 3 requests per 5 minutes
- **Live Data**: 50 requests per minute

## Security Architecture

### Authentication & Authorization
- **Better Auth** with JWT tokens
- **Role-based access control** (RBAC)
- **Plan-based feature restrictions**
- **Session management** with Redis
- **2FA support** with backup codes

### Security Middleware Stack
```typescript
// Security headers
helmet()

// CORS configuration
cors({
  origin: production ? allowedOrigins : true,
  credentials: true
})

// Rate limiting
rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

// Request validation
joi.validate(schema)

// Authentication
authenticate()

// Authorization
requireRole(['ADMIN', 'PREMIUM'])
```

### Data Protection
- **Environment variable management** for secrets
- **Database encryption** for sensitive data
- **API key rotation** support
- **Request/response sanitization**
- **SQL injection prevention** via Prisma ORM

## Performance & Scalability

### Caching Strategy
```typescript
// Multi-level caching
Level 1: Memory cache (5 minutes)
Level 2: Redis cache (15 minutes)
Level 3: External API (fallback)
```

### Background Job Processing
```typescript
// Queue priorities
CRITICAL: 100    // Price updates, notifications
HIGH: 75         // Wallet sync, transactions
NORMAL: 50       // Portfolio calculations
LOW: 25          // NFT sync, DeFi positions
BACKGROUND: 10   // Snapshots, cleanup
```

### Database Optimization
- **Connection pooling** with Prisma
- **Query optimization** with proper indexing
- **Pagination** for large datasets
- **Batch operations** for bulk updates

### Circuit Breaker Pattern
```typescript
// External API fault tolerance
{
  failures: 0,
  lastFailureTime: null,
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN',
  threshold: 5,
  timeout: 60000
}
```

## Monitoring & Analytics

### Comprehensive Metrics Collection
- **API Performance**: Response times, error rates, throughput
- **External APIs**: Success rates, latency, quota usage
- **User Behavior**: Feature usage, plan utilization
- **System Health**: Memory usage, queue status, database performance

### Real-time Monitoring
- **Server-Sent Events** for sync progress
- **Queue health monitoring**
- **Database connection status**
- **External API availability**

### Analytics Dashboard Data
- **Request volume trends**
- **Error rate analysis**
- **Performance percentiles** (P95, P99)
- **User engagement metrics**

## Deployment Architecture

### Environment Configuration
```typescript
// Environment-specific settings
{
  development: {
    database: 'local_postgres',
    redis: 'local_redis',
    externalApis: 'sandbox_mode'
  },
  production: {
    database: 'production_postgres_cluster',
    redis: 'production_redis_cluster',
    externalApis: 'live_api_keys'
  }
}
```

### Scalability Considerations
- **Horizontal scaling** ready with stateless design
- **Load balancing** support via sticky sessions
- **Database read replicas** for query optimization
- **Redis clustering** for cache and queue scaling

### Health Checks
```
GET /health
{
  status: 'OK',
  checks: {
    database: 'connected',
    redis: 'connected',
    externalApis: 'operational'
  },
  timestamp: '2025-01-21T12:00:00Z'
}
```

### Graceful Shutdown
- **Background worker cleanup**
- **Database connection closure**
- **In-flight request completion**
- **Signal handling** (SIGTERM, SIGINT)

---

## Summary

The Mappr Backend represents a well-architected, scalable solution for cryptocurrency portfolio management. With its modular design, comprehensive security features, and robust external API integrations, it provides a solid foundation for financial technology applications.

Key architectural strengths:
- **Modular, domain-driven design**
- **Comprehensive security implementation**
- **Scalable background processing**
- **Robust external API integration**
- **Extensive monitoring and analytics**
- **Production-ready deployment architecture**

The system is designed to handle enterprise-scale operations while maintaining code quality, performance, and maintainability.