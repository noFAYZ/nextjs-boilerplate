# External APIs Module - Details

**Path**: `src/modules/external-apis/`

## Overview

Third-party API client implementations and integrations. Manages connections to Zerion, Zapper, Plaid, Teller, MX, and other external services.

**Status**: ✅ Production Ready
**Maturity**: High

---

## Features

### 1. Zerion Integration
- Multi-network portfolio aggregation
- Asset positions and balances
- Transaction history retrieval
- DeFi position tracking
- Circuit breaker pattern for reliability

### 2. Zapper Integration
- Advanced DeFi position analysis
- NFT metadata and valuation
- Multi-level token composition
- Farcaster social integration
- GraphQL API client

### 3. Banking APIs
- **Plaid**: Account linking and data aggregation
- **Teller**: Real-time account data
- **MX**: Account aggregation and data enrichment

### 4. Provider Health & Monitoring
- Health status checking
- Rate limit tracking
- Response time monitoring
- Circuit breaker state management
- Automatic failover handling

### 5. Request Management
- Request deduplication
- Response caching
- Rate limit awareness
- Request prioritization
- Timeout handling

---

## Key Methods

### ZerionService
```
getPortfolio(address, networks)
  → Get multi-network portfolio

getTransactions(address, limit)
  → Get transaction history

getDefiPositions(address)
  → Get DeFi positions

getProviderHealth()
  → Check Zerion status
```

### ZapperService
```
getPortfolioBreakdown(address)
  → Get portfolio details

getNFTs(address)
  → Get NFT collection

getDefiApps(address)
  → Get DeFi protocols

getFarcasterUser(username)
  → Resolve Farcaster user
```

---

## Database Models

- **ExternalApiLog**: id, provider, endpoint, status, responseTime, timestamp
- **ProviderHealth**: provider, status, lastChecked, metrics
- **ApiRateLimit**: provider, remainingRequests, resetTime

---

## API Endpoints (5+)

- GET `/providers/status` - Check provider health
- GET `/zerion/portfolio` - Zerion portfolio
- GET `/zapper/portfolio` - Zapper portfolio
- POST `/sync/trigger` - Trigger data sync
- GET `/health` - Overall health check
