# 04. Database Schema & Models

**Complete Prisma ORM database schema documentation**

> **Tip**: For database models specific to a module, see the module's `Details.md` file (e.g., `modules/crypto/Details.md` for crypto-related tables).

## Database Overview

- **Database**: PostgreSQL 12+
- **ORM**: Prisma ORM
- **Connection**: Connection pooling via PgBouncer
- **Models**: 49+ tables
- **Relationships**: Complex relational structure
- **Indexing**: Strategic indexes for performance

---

## User & Authentication Models (5 tables)

### users
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  emailVerified   Boolean   @default(false)
  name            String?
  password        String
  image           String?
  role            String    @default("USER")  // USER, ADMIN
  plan            String    @default("FREE")  // FREE, PRO, ULTIMATE
  metadata        Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  sessions        Session[]
  accounts        account[]
  verifications   verification[]
  twoFactors      twoFactor[]
  organizations   Member[]
  cryptoWallets   CryptoWallet[]
  financialAccounts FinancialAccount[]
  transactions    Transaction[]
  subscription    Subscription?

  @@index([email])
  @@index([plan])
  @@index([createdAt])
}
```

### account (Better Auth OAuth)
```prisma
model account {
  id              String    @id @default(cuid())
  userId          String
  type            String    // oauth, oidc, jwt, etc
  provider        String
  providerAccountId String
  refresh_token   String?   @db.Text
  access_token    String?   @db.Text
  expires_at      Int?
  token_type      String?
  scope           String?
  id_token        String?   @db.Text
  session_state   String?

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

### session
```prisma
model session {
  id              String    @id @default(cuid())
  sessionToken    String    @unique
  userId          String
  expires         DateTime
  createdAt       DateTime  @default(now())

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([sessionToken])
}
```

### verification
```prisma
model verification {
  id              String    @id @default(cuid())
  userId          String
  token           String    @unique
  type            String    // email, password_reset, etc
  expiresAt       DateTime
  createdAt       DateTime  @default(now())

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}
```

### twoFactor
```prisma
model twoFactor {
  id              String    @id @default(cuid())
  userId          String    @unique
  secret          String
  backupCodes     String[]
  enabled         Boolean   @default(false)
  createdAt       DateTime  @default(now())

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Organization & Multi-Tenancy Models (3 tables)

### Organization
```prisma
model Organization {
  id              String    @id @default(cuid())
  name            String
  description     String?
  logo            String?
  metadata        Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  members         Member[]
  invitations     Invitation[]

  @@index([createdAt])
}
```

### Member
```prisma
model Member {
  id              String    @id @default(cuid())
  organizationId  String
  userId          String
  role            String    @default("MEMBER")  // OWNER, ADMIN, MEMBER
  joinedAt        DateTime  @default(now())

  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
  @@index([organizationId])
  @@index([userId])
}
```

### Invitation
```prisma
model Invitation {
  id              String    @id @default(cuid())
  organizationId  String
  email           String
  role            String
  token           String    @unique
  expiresAt       DateTime
  acceptedAt      DateTime?
  createdAt       DateTime  @default(now())

  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, email])
  @@index([email])
}
```

---

## Subscription & Billing Models (8 tables)

### Plan
```prisma
model Plan {
  id              String    @id @default(cuid())
  name            String    @unique  // FREE, PRO, ULTIMATE
  price           Decimal   @db.Decimal(10, 2)
  currency        String    @default("USD")
  billingPeriod   String    @default("MONTHLY")  // MONTHLY, YEARLY
  features        String[]
  limits          Json      // { wallets: 3, accounts: 2, ... }
  description     String?
  active          Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  subscriptions   Subscription[]

  @@index([name])
}
```

### Subscription
```prisma
model Subscription {
  id              String    @id @default(cuid())
  userId          String    @unique
  planId          String
  status          String    @default("active")  // active, canceled, past_due
  currentPeriodStart DateTime
  currentPeriodEnd DateTime
  canceledAt      DateTime?
  autoRenew       Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan            Plan      @relation(fields: [planId], references: [id])
  payments        Payment[]

  @@index([userId])
  @@index([status])
  @@index([planId])
}
```

### Payment
```prisma
model Payment {
  id              String    @id @default(cuid())
  subscriptionId  String
  amount          Decimal   @db.Decimal(10, 2)
  currency        String    @default("USD")
  status          String    @default("pending")  // pending, completed, failed, refunded
  provider        String    // stripe, polar, etc
  providerPaymentId String?
  description     String?
  metadata        Json?
  paidAt          DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  subscription    Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([subscriptionId])
  @@index([status])
  @@index([provider])
}
```

### UsageTracking
```prisma
model UsageTracking {
  id              String    @id @default(cuid())
  userId          String
  feature         String    // wallet_sync, api_call, etc
  count           Int       @default(1)
  date            DateTime  @db.Date
  createdAt       DateTime  @default(now())

  @@unique([userId, feature, date])
  @@index([userId])
  @@index([date])
}
```

### PaymentMethod
```prisma
model PaymentMethod {
  id              String    @id @default(cuid())
  userId          String
  type            String    // card, bank_account, etc
  provider        String    // stripe, polar, etc
  providerMethodId String
  lastFour        String?
  expiryDate      String?
  default         Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId])
}
```

### UserSubscriptionTracking (SaaS subscriptions)
```prisma
model UserSubscriptionTracking {
  id              String    @id @default(cuid())
  userId          String
  transactionId   String
  name            String    // Netflix, Spotify, etc
  amount          Decimal   @db.Decimal(10, 2)
  currency        String    @default("USD")
  billingCycle    String    // MONTHLY, YEARLY
  status          String    // ACTIVE, CANCELED, PAUSED
  nextBillingDate DateTime?
  detectedAt      DateTime  @default(now())
  lastChargeDate  DateTime?

  @@index([userId])
  @@index([detectedAt])
}
```

### SubscriptionCharge
```prisma
model SubscriptionCharge {
  id              String    @id @default(cuid())
  subscriptionTrackingId String
  date            DateTime
  amount          Decimal   @db.Decimal(10, 2)
  description     String?
  createdAt       DateTime  @default(now())
}
```

---

## Cryptocurrency Models (8 tables)

### CryptoWallet
```prisma
model CryptoWallet {
  id              String    @id @default(cuid())
  userId          String
  address         String    // 0x...
  network         String    // ethereum, polygon, arbitrum, etc
  name            String?
  type            String    @default("EOA")  // EOA, CONTRACT, SAFE, MULTISIG
  totalBalanceUsd Decimal?  @db.Decimal(15, 2)
  totalBalanceNative Decimal? @db.Decimal(20, 8)
  lastSyncAt      DateTime?
  lastSyncError   String?
  syncing         Boolean   @default(false)
  metadata        Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  positions       CryptoPosition[]
  transactions    CryptoTransaction[]
  nfts            CryptoNFT[]
  defiPositions   DeFiAppPosition[]

  @@unique([userId, address, network])
  @@index([userId])
  @@index([lastSyncAt])
  @@index([network])
}
```

### CryptoPosition
```prisma
model CryptoPosition {
  id              String    @id @default(cuid())
  walletId        String
  symbol          String
  name            String?
  contractAddress String?
  balance         Decimal   @db.Decimal(20, 8)
  balanceUsd      Decimal   @db.Decimal(15, 2)
  changeUsd       Decimal?  @db.Decimal(15, 2)
  changePercent   Decimal?  @db.Decimal(8, 4)
  priceUsd        Decimal?  @db.Decimal(15, 8)
  network         String?
  lastUpdatedAt   DateTime  @default(now())

  wallet          CryptoWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)

  @@unique([walletId, symbol, network])
  @@index([walletId])
  @@index([symbol])
}
```

### CryptoTransaction
```prisma
model CryptoTransaction {
  id              String    @id @default(cuid())
  walletId        String
  hash            String
  from            String
  to              String
  value           Decimal   @db.Decimal(20, 8)
  valueUsd        Decimal?  @db.Decimal(15, 2)
  type            String    // transfer, swap, mint, burn, approve, etc
  status          String    @default("completed")  // pending, completed, failed
  network         String
  gasUsed         Decimal?  @db.Decimal(20, 8)
  gasPrice        Decimal?  @db.Decimal(15, 8)
  nonce           Int?
  timestamp       DateTime
  blockNumber     BigInt?
  method          String?
  data            Json?

  wallet          CryptoWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)

  @@unique([walletId, hash, network])
  @@index([walletId])
  @@index([timestamp])
  @@index([network])
}
```

### CryptoNFT
```prisma
model CryptoNFT {
  id              String    @id @default(cuid())
  walletId        String
  contractAddress String
  tokenId         String
  name            String?
  description     String?
  image           String?
  collectionName  String?
  floorPriceUsd   Decimal?  @db.Decimal(15, 2)
  estimatedValueUsd Decimal? @db.Decimal(15, 2)
  network         String
  metadata        Json?
  lastUpdatedAt   DateTime  @default(now())

  wallet          CryptoWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)

  @@unique([walletId, contractAddress, tokenId, network])
  @@index([walletId])
  @@index([network])
}
```

### CryptoPortfolio
```prisma
model CryptoPortfolio {
  id              String    @id @default(cuid())
  userId          String
  walletId        String?
  totalBalanceUsd Decimal   @db.Decimal(15, 2)
  changeUsd       Decimal?  @db.Decimal(15, 2)
  changePercent   Decimal?  @db.Decimal(8, 4)
  assetCount      Int
  nftCount        Int
  defiPositionCount Int
  snapshot        Json?
  updatedAt       DateTime  @updatedAt

  @@unique([userId, walletId])
  @@index([userId])
}
```

### CryptoPortfolioSnapshot
```prisma
model CryptoPortfolioSnapshot {
  id              String    @id @default(cuid())
  userId          String
  walletId        String?
  totalBalanceUsd Decimal   @db.Decimal(15, 2)
  assetBreakdown  Json      // { ETH: 95000, USDC: 50000, ... }
  networkBreakdown Json     // { ethereum: 95000, polygon: 50000, ... }
  timestamp       DateTime  @default(now())

  @@index([userId])
  @@index([timestamp])
}
```

### CryptoAssetRegistry (Global deduplication)
```prisma
model CryptoAssetRegistry {
  id              String    @id @default(cuid())
  symbol          String    @unique
  name            String
  contractAddresses Json? // { ethereum: 0x..., polygon: 0x..., ... }
  coingeckoId     String?
  logoUrl         String?
  lastUpdatedAt   DateTime  @updatedAt

  @@index([symbol])
}
```

---

## Banking Models (7 tables)

### FinancialAccount
```prisma
model FinancialAccount {
  id              String    @id @default(cuid())
  userId          String
  institutionName String
  accountName     String
  accountNumber   String    // Masked: ***1234
  accountType     String    // checking, savings, money_market, credit_card, etc
  accountSubtype  String?
  balance         Decimal   @db.Decimal(15, 2)
  currency        String    @default("USD")
  provider        String    // plaid, teller, mx
  providerItemId  String
  providerAccountId String
  connected       Boolean   @default(true)
  syncStatus      String    @default("idle")  // idle, syncing, synced
  lastSyncAt      DateTime?
  lastSyncError   String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions    Transaction[]
  balanceHistory  AccountBalanceSnapshot[]

  @@unique([userId, providerItemId, providerAccountId])
  @@index([userId])
  @@index([lastSyncAt])
}
```

### AccountBalanceSnapshot
```prisma
model AccountBalanceSnapshot {
  id              String    @id @default(cuid())
  accountId       String
  balance         Decimal   @db.Decimal(15, 2)
  currency        String    @default("USD")
  date            DateTime  @db.Date
  createdAt       DateTime  @default(now())

  account         FinancialAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@unique([accountId, date])
  @@index([accountId])
  @@index([date])
}
```

### ProviderConnection
```prisma
model ProviderConnection {
  id              String    @id @default(cuid())
  userId          String
  provider        String    // plaid, teller, mx
  providerItemId  String
  accessToken     String    @db.Text  // Encrypted
  refreshToken    String?   @db.Text  // Encrypted
  expiresAt       DateTime?
  connectedAt     DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([provider, providerItemId])
  @@index([userId])
}
```

### BankingSyncLog
```prisma
model BankingSyncLog {
  id              String    @id @default(cuid())
  userId          String
  provider        String
  status          String    // started, completed, failed
  transactionsSynced Int
  accountsSynced  Int
  error           String?
  duration        Int?      // milliseconds
  startedAt       DateTime  @default(now())
  completedAt     DateTime?

  @@index([userId])
  @@index([startedAt])
}
```

### AccountReconciliation
```prisma
model AccountReconciliation {
  id              String    @id @default(cuid())
  accountId       String
  startDate       DateTime
  endDate         DateTime
  openingBalance  Decimal   @db.Decimal(15, 2)
  closingBalance  Decimal   @db.Decimal(15, 2)
  status          String    @default("pending")  // pending, completed, failed
  discrepancies   Int
  completedAt     DateTime?
  createdAt       DateTime  @default(now())

  @@index([accountId])
}
```

### SyncState
```prisma
model SyncState {
  id              String    @id @default(cuid())
  userId          String
  module          String    // crypto, banking, transactions
  lastSyncAt      DateTime?
  syncCursor      String?   // For incremental sync
  metadata        Json?
  updatedAt       DateTime  @updatedAt

  @@unique([userId, module])
}
```

---

## Transaction Models (8 tables)

### Transaction
```prisma
model Transaction {
  id              String    @id @default(cuid())
  userId          String
  accountId       String
  date            DateTime
  description     String
  amount          Decimal   @db.Decimal(15, 2)
  type            String    // debit, credit
  merchantId      String?
  categoryId      String?
  status          String    @default("active")  // active, deleted, pending
  reconciled      Boolean   @default(false)
  recurringPatternId String?
  parentTransactionId String?
  notes           String?
  tags            String[]
  metadata        Json?
  externalId      String?   // Bank's transaction ID
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  account         FinancialAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category        Category? @relation(fields: [categoryId], references: [id])
  merchant        Merchant? @relation(fields: [merchantId], references: [id])
  attachments     TransactionAttachment[]
  lifecycleEvents TransactionLifecycleEvent[]
  splits          Transaction[] @relation("splits")
  parent          Transaction? @relation("splits", fields: [parentTransactionId], references: [id])

  @@unique([accountId, externalId])
  @@index([userId])
  @@index([accountId])
  @@index([date])
  @@index([categoryId])
  @@index([merchantId])
  @@index([reconciled])
}
```

### Category
```prisma
model Category {
  id              String    @id @default(cuid())
  userId          String
  name            String
  group           String    // food, transport, utilities, etc
  icon            String?
  color           String?
  custom          Boolean   @default(false)
  order           Int?
  createdAt       DateTime  @default(now())

  transactions    Transaction[]

  @@unique([userId, name, custom])
  @@index([userId])
}
```

### Merchant
```prisma
model Merchant {
  id              String    @id @default(cuid())
  userId          String
  name            String
  category        String?
  logo            String?
  website         String?
  metadata        Json?
  createdAt       DateTime  @default(now())

  transactions    Transaction[]

  @@unique([userId, name])
  @@index([userId])
}
```

### TransactionAttachment
```prisma
model TransactionAttachment {
  id              String    @id @default(cuid())
  transactionId   String
  fileName        String
  fileType        String    // pdf, image, receipt, etc
  fileSize        Int
  s3Key           String
  uploadedAt      DateTime  @default(now())

  transaction     Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@index([transactionId])
}
```

### TransactionRule
```prisma
model TransactionRule {
  id              String    @id @default(cuid())
  userId          String
  name            String
  description     String?
  condition       Json      // { contains: "STARBUCKS", minAmount: 0, maxAmount: 100 }
  action          Json      // { category: "cat_1", tag: "business" }
  priority        Int
  enabled         Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId])
}
```

### TransactionLifecycleEvent
```prisma
model TransactionLifecycleEvent {
  id              String    @id @default(cuid())
  transactionId   String
  event           String    // created, categorized, reconciled, etc
  previousValue   Json?
  newValue        Json?
  createdAt       DateTime  @default(now())

  transaction     Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@index([transactionId])
}
```

---

## DeFi Models (3 tables)

### DeFiApp
```prisma
model DeFiApp {
  id              String    @id @default(cuid())
  name            String
  protocol        String    // Aave, Compound, Uniswap, etc
  logo            String?
  network         String
  category        String    // lending, dex, staking, etc
  tvl             Decimal?  @db.Decimal(20, 2)
  metadata        Json?
  updatedAt       DateTime  @updatedAt

  @@unique([protocol, network])
}
```

### DeFiAppPosition
```prisma
model DeFiAppPosition {
  id              String    @id @default(cuid())
  walletId        String
  appId           String
  type            String    // lending, liquidity, staking, etc
  baseTokenSymbol String
  baseTokenBalance Decimal  @db.Decimal(20, 8)
  baseTokenUsd    Decimal   @db.Decimal(15, 2)
  underlyingTokens Json?    // Multi-level token breakdown
  apy             Decimal?  @db.Decimal(8, 4)
  chainId         Int
  metadata        Json?
  lastUpdatedAt   DateTime  @default(now())

  wallet          CryptoWallet @relation(fields: [walletId], references: [id], onDelete: Cascade)

  @@index([walletId])
  @@index([appId])
}
```

---

## Indexes for Performance

```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_users_created ON users(createdAt DESC);

-- Crypto queries
CREATE INDEX idx_crypto_wallets_user ON crypto_wallets(userId);
CREATE INDEX idx_crypto_wallets_sync ON crypto_wallets(lastSyncAt DESC);
CREATE INDEX idx_crypto_positions_wallet ON crypto_positions(walletId);
CREATE INDEX idx_crypto_transactions_wallet_date ON crypto_transactions(walletId, timestamp DESC);

-- Banking queries
CREATE INDEX idx_financial_accounts_user ON financial_accounts(userId);
CREATE INDEX idx_financial_accounts_sync ON financial_accounts(lastSyncAt DESC);
CREATE INDEX idx_account_balance_snapshot_date ON account_balance_snapshot(accountId, date DESC);

-- Transaction queries
CREATE INDEX idx_transactions_user_date ON transactions(userId, date DESC);
CREATE INDEX idx_transactions_account_date ON transactions(accountId, date DESC);
CREATE INDEX idx_transactions_category ON transactions(categoryId);
CREATE INDEX idx_transactions_merchant ON transactions(merchantId);

-- Sync queries
CREATE INDEX idx_sync_state_user_module ON sync_state(userId, module);

-- Recurring patterns
CREATE INDEX idx_transactions_recurring ON transactions(recurringPatternId);
```

---

## Composite Keys & Constraints

```
Unique Constraints:
- users: email
- account: (provider, providerAccountId)
- session: sessionToken
- verification: token
- Organization.Member: (organizationId, userId)
- Invitation: (organizationId, email)
- CryptoWallet: (userId, address, network)
- CryptoPosition: (walletId, symbol, network)
- CryptoTransaction: (walletId, hash, network)
- CryptoNFT: (walletId, contractAddress, tokenId, network)
- FinancialAccount: (userId, providerItemId, providerAccountId)
- Transaction: (accountId, externalId)
- Category: (userId, name, custom)
- Merchant: (userId, name)
```

---

## Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_feature_name

# Apply pending migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio GUI
npx prisma studio

# Push schema changes (dev only)
npx prisma db push

# Reset database (dev only)
npx prisma migrate reset
```

---

See [02-MODULES.md](./02-MODULES.md) for module-specific model details and relationships.
