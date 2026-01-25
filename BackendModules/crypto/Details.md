# Crypto Module - Details

**Path**: `src/modules/crypto/`

## Overview

Core cryptocurrency portfolio management across 15+ blockchain networks. Supports multi-wallet tracking, real-time sync, asset positions, DeFi monitoring, and NFT collections.

**Status**: ✅ Production Ready
**Maturity**: High (Core features complete)

---

## Features

### 1. Multi-Network Support
- **15+ Networks**: Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, Solana, Fantom, Gnosis, Celo, Harmony, Moonbeam, zkSync, Linea, Scroll
- **Wallet Types**: EOA, Contract, Safe, Multisig, Hardware (read-only)
- **Real-time Data**: Live portfolio updates from Zerion & Zapper

### 2. Portfolio Management
- **Asset Tracking**: Token holdings with prices, balances, P&L
- **Aggregation**: Multi-wallet portfolio aggregation
- **History**: Portfolio snapshots for tracking changes
- **Charts**: 30-90 day portfolio value charts

### 3. Transaction History
- **Full History**: Complete blockchain transaction record
- **Types**: Transfers, swaps, mints, burns, approvals
- **Status**: Pending, completed, failed tracking
- **Gas Data**: Gas used, gas price, block number

### 4. NFT Collections
- **Metadata**: Collection name, image, token ID
- **Valuation**: Floor price tracking, estimated value
- **Collections**: Group NFTs by collection
- **Rarity**: (Future: rarity scoring)

### 5. DeFi Positions
- **Protocols**: Aave, Compound, Uniswap, Curve, Lido, etc.
- **Types**: Lending, liquidity, staking, farming
- **Yields**: APY/APR tracking
- **Breakdown**: Multi-level token composition
- **Value**: Real-time position valuations

### 6. Real-time Synchronization
- **On-Demand**: Manual sync trigger
- **Background Jobs**: Async processing with progress tracking
- **SSE Updates**: Real-time progress via Server-Sent Events
- **Circuit Breaker**: Fault tolerance with automatic retry
- **Provider Fallback**: Automatic switching between Zerion & Zapper

---

## How It Works

### Add Wallet Flow
```
User clicks "Add Wallet" (UI)
    ↓
User enters: address, network, name
    ↓
Backend validates address format
    ↓
Check plan limit (3 for FREE, 50 for PRO, unlimited for ULTIMATE)
    ↓
Create wallet record in database
    ↓
Queue SYNC_WALLET_FULL background job (HIGH priority)
    ↓
Return wallet to user immediately
    ↓
[Background] Job syncs assets, transactions, DeFi, NFTs
    ↓
User sees portfolio update in real-time
```

### Sync Flow
```
Background Job Started
    ↓
Fetch assets from Zerion (with circuit breaker)
    ├─ Multi-network scan
    ├─ Get token prices
    └─ Store in database + Redis cache
    ↓
[SSE Update: 20% - syncing_assets]
    ↓
Fetch transactions from Zerion
    ├─ Last 100+ transactions
    ├─ Parse transaction types
    └─ Store with metadata
    ↓
[SSE Update: 50% - syncing_transactions]
    ↓
Fetch DeFi positions from Zapper
    ├─ Find all protocol positions
    ├─ Parse underlying tokens (3+ levels)
    ├─ Calculate total value
    └─ Store position data
    ↓
[SSE Update: 75% - syncing_defi]
    ↓
Fetch NFTs from Zapper
    ├─ Get collection metadata
    ├─ Track floor prices
    └─ Estimate values
    ↓
[SSE Update: 90% - syncing_nfts]
    ↓
Calculate portfolio metrics
    ├─ Total balance USD
    ├─ 24h / 7d / 30d changes
    ├─ By-network breakdown
    └─ Top assets
    ↓
Create snapshot for history
    ↓
[SSE Update: 100% - completed]
    ↓
Emit wallet:synced event
    ↓
Send user notification (optional)
```

### Data Retrieval Flow
```
User requests: GET /crypto/portfolio
    ↓
Check cache (5 minute TTL)
    ├─ If cached: return immediately
    └─ If expired: continue
    ↓
Query all wallets for user
    ├─ Include positions
    ├─ Include NFTs
    └─ Include DeFi positions
    ↓
Aggregate data:
    ├─ Sum all balances → totalBalanceUsd
    ├─ Calculate changes → change USD & %
    ├─ Group by network
    ├─ Get top 10 assets
    └─ Build chart data
    ↓
Cache result for 5 minutes
    ↓
Return to user
```

---

## Architecture Components

### Controllers (4 files)
- `cryptoController.ts` - Main wallet & portfolio operations (48+ endpoints)
- `portfolioController.ts` - Analytics & charts
- `syncController.ts` - Sync management
- `walletController.ts` - Batch operations

### Services (7+ files)
- `cryptoService.ts` - Core business logic (30+ methods)
- `assetCacheService.ts` - Price caching
- `defiAppService.ts` - DeFi position management (14+ methods)
- `userSyncProgressManager.ts` - Real-time progress tracking

### Background Jobs
- `cryptoJobs.ts` - Job definitions
- `portfolio/portfolioProcessor.ts` - Portfolio calculation
- `positions/positionProcessor.ts` - Asset position updates
- `transactions/transactionProcessor.ts` - Transaction sync

### External Integrations
- **Zerion SDK**: Multi-network portfolio, transactions, positions
- **Zapper GraphQL**: DeFi apps, NFTs, token composition, Farcaster

---

## Key Methods

### CryptoService
```
addWallet(userId, walletData)
  → Creates wallet & queues sync job

removeWallet(userId, walletId)
  → Deletes wallet & associated data

getWalletPortfolio(walletId)
  → Get portfolio for single wallet

getAggregatedPortfolio(userId)
  → Aggregate all wallets with caching

manualSync(userId, walletId, syncTypes)
  → Queue manual sync with specific types

getProviderStatus()
  → Check Zerion & Zapper health

getZapperFarcasterData(username)
  → Resolve Farcaster address to wallets
```

---

## Database Models

### CryptoWallet
- `id`, `userId`, `address`, `network`
- `name`, `type` (EOA/CONTRACT/SAFE)
- `totalBalanceUsd`, `totalBalanceNative`
- `lastSyncAt`, `lastSyncError`, `syncing`
- Relationships: positions, transactions, nfts, defiPositions

### CryptoPosition
- `id`, `walletId`, `symbol`, `name`
- `balance`, `balanceUsd`, `priceUsd`
- `changeUsd`, `changePercent`
- `network`, `lastUpdatedAt`

### CryptoTransaction
- `id`, `walletId`, `hash`
- `from`, `to`, `value`, `valueUsd`
- `type` (transfer/swap/mint/burn)
- `status` (pending/completed/failed)
- `network`, `timestamp`, `blockNumber`

### CryptoNFT
- `id`, `walletId`, `contractAddress`, `tokenId`
- `name`, `image`, `collectionName`
- `floorPriceUsd`, `estimatedValueUsd`
- `network`, `metadata` (JSON)

---

## Performance Optimizations

### Caching
- Portfolio data: 5 minutes (Redis + Memory)
- Asset prices: 5 minutes
- Provider status: 5 minutes
- Exchange rates: 24 hours

### Database Indexing
- `crypto_wallets(userId, network)`
- `crypto_wallets(userId, lastSyncAt DESC)`
- `crypto_positions(walletId, symbol)`
- `crypto_transactions(walletId, timestamp DESC)`

### Pagination
- Transactions: limit 100, cursor-based
- Default page size: 20

---

## Error Handling

| Error | Code | Status | Reason |
|-------|------|--------|--------|
| Invalid address | INVALID_WALLET | 400 | Bad address format |
| Wallet not found | WALLET_NOT_FOUND | 404 | Wallet ID invalid |
| Sync failed | WALLET_SYNC_FAILED | 503 | External API error |
| Network not supported | NETWORK_NOT_SUPPORTED | 400 | Unknown network |
| Plan limit exceeded | PLAN_LIMIT_EXCEEDED | 403 | Too many wallets |
| Sync in progress | SYNC_IN_PROGRESS | 409 | Already syncing |

---

## Common Use Cases

### UC1: Track Multi-Network Portfolio
```
User adds 5 wallets (Ethereum, Polygon, Arbitrum, etc.)
    ↓
Each wallet syncs independently
    ↓
User views portfolio
    ↓
See aggregated $500K total
    ├─ By network breakdown
    ├─ Top assets (ETH, USDC, etc.)
    └─ 7-day chart
```

### UC2: Monitor DeFi Positions
```
User's wallet has 50K USDC in Aave v3
    ↓
Sync fetches Aave position via Zapper
    ↓
Shows:
├─ Protocol: Aave v3
├─ Type: Lending
├─ Asset: USDC
├─ Amount: 50K
├─ APY: 5.45%
└─ Value: $50K
```

### UC3: Track NFT Collection
```
User holds 3 Bored Apes + other NFTs
    ↓
Sync fetches NFT metadata from Zapper
    ↓
Shows:
├─ Collection: Bored Ape Yacht Club
├─ Floor: $45K each
├─ Count: 3
├─ Total Value: ~$135K
└─ Images in gallery view
```

---

## Limits by Plan

| Feature | FREE | PRO | ULTIMATE |
|---------|------|-----|----------|
| Wallets | 3 | 50 | ∞ |
| Networks | 5 | 15+ | 15+ |
| Sync frequency | 1/day | 4/day | Unlimited |
| Real-time updates | ❌ | ✅ | ✅ |
| DeFi tracking | ❌ | ✅ | ✅ |
| NFT tracking | ❌ | ✅ | ✅ |

---

## Future Enhancements

- **Rarity Scoring**: NFT rarity calculation
- **Gas Optimization**: Gas fee alerts
- **Yield Farming**: Track farming rewards
- **Liquidation Alerts**: Warn on liquidation risk
- **Tax Reporting**: Gain/loss calculations
- **Wallet Alerts**: Price & position alerts
- **Sentiment Analysis**: Community sentiment
