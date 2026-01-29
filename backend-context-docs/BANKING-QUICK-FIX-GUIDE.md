# Banking Module - Quick Fix Guide

**Step-by-step resolution for transaction sync and performance issues**

---

## 🔴 IMMEDIATE ACTIONS (Do These First - 15 minutes)

### 1. Check If Worker Is Running
```bash
# Terminal 1: Check running processes
ps aux | grep -i worker
ps aux | grep -i "bullmq\|banking-sync"

# Terminal 2: Check if redis is running
redis-cli ping
# Expected response: PONG

# Terminal 3: Run worker if not running
npm run worker
# Watch for: "Worker started", "Queue processing started"
```

**If worker is NOT running**: This is why transactions aren't syncing!
```bash
# Start it in background
nohup npm run worker > worker.log 2>&1 &

# Monitor logs
tail -f worker.log | grep -E "SYNC|TRANSACTION|ERROR"
```

### 2. Check Queue Status
```bash
# See pending jobs
redis-cli LLEN bull:banking-sync:wait
redis-cli LLEN bull:banking-sync:active
redis-cli LLEN bull:banking-sync:failed

# Get specific job
redis-cli HGETALL bull:banking-sync:7252:progress

# Requeue stuck job if needed
redis-cli LPUSH bull:banking-sync:wait bull:banking-sync:7252:progress
```

### 3. Watch Logs for Job Processing
```bash
# Start app in debug mode
NODE_LOG_LEVEL=debug npm run dev

# In another terminal, relink the account to trigger new sync job
# Then watch logs for:
# ✅ "Job started"
# ✅ "Fetching transactions"
# ✅ "Transactions stored"
# ✅ "Sync completed"
```

---

## 🟡 CRITICAL FIXES (Next 2 hours - Do Before Production)

### Fix 1: Add Database Indexes (15 minutes)

**Step 1: Create migration file**
```bash
npx prisma migrate dev --name add_banking_performance_indexes
```

**Step 2: Edit the generated migration file** `prisma/migrations/[timestamp]_add_banking_performance_indexes/migration.sql`
```sql
-- Add these indexes to financial_accounts
CREATE INDEX idx_financial_accounts_user_org ON financial_accounts(user_id, organization_id);
CREATE INDEX idx_financial_accounts_user_provider ON financial_accounts(user_id, provider);
CREATE INDEX idx_financial_accounts_connection_status ON financial_accounts(connection_id, status);

-- Add these indexes to financial_connections
CREATE INDEX idx_financial_connections_user_provider ON financial_connections(user_id, provider);
CREATE UNIQUE INDEX idx_unique_user_provider_institution ON financial_connections(user_id, provider, institution_id);

-- Add these indexes for sync state queries
CREATE INDEX idx_financial_sync_state_account ON financial_sync_states(account_id, last_synced_at DESC);
```

**Step 3: Apply migration**
```bash
npx prisma migrate deploy
# Or for development:
npx prisma db push
```

**Expected Result**:
- Account list response: 2.3s → 100-200ms
- Account creation: 3s → 500ms

---

### Fix 2: Batch Account Creation (1 hour)

**Find the code**:
```bash
find src/modules/banking -name "*.ts" | xargs grep -l "financialAccount.create" | head -3
```

**Current (Slow) Code Pattern**:
```typescript
for (const plaidAccount of plaidAccounts) {
  await db.financialAccount.create({
    data: {
      userId,
      organizationId,
      provider: 'PLAID',
      providerAccountId: plaidAccount.account_id,
      balance: plaidAccount.balances.current,
      // ... more fields
    }
  })
  // Each iteration = 1 database roundtrip
}
// For 3 accounts = 3 queries = ~3 seconds
```

**Replace With (Fast) Batch Code**:
```typescript
// Single batch insert
const createdAccounts = await db.financialAccount.createMany({
  data: plaidAccounts.map(acc => ({
    userId,
    organizationId,
    provider: 'PLAID',
    providerAccountId: acc.account_id,
    balance: acc.balances.current,
    accountType: acc.subtype,
    accountName: acc.name,
    institutionName: institutionData.name,
    // ... map all fields
  }))
})

// Then batch create sync states
if (createdAccounts.count > 0) {
  await db.financialSyncState.createMany({
    data: createdAccounts.map(acc => ({
      accountId: acc.id,
      lastSyncedAt: new Date(),
      status: 'PENDING'
    }))
  })
}

// Single cache invalidation
await cache.invalidate(`user:${userId}:banking:*`)
```

**Expected Result**:
- Token exchange: 9.1s → 400-600ms
- Scales to 100 accounts without slowdown

---

### Fix 3: Increase Memory Allocation (5 minutes)

**Option A: Local Development**
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run dev
```

**Option B: Production Docker**
```dockerfile
# In Dockerfile or docker-compose.yml
ENV NODE_OPTIONS="--max-old-space-size=2048"
```

**Option C: Directly in package.json scripts**
```json
{
  "scripts": {
    "dev": "NODE_OPTIONS=\"--max-old-space-size=2048\" ts-node src/server.ts",
    "worker": "NODE_OPTIONS=\"--max-old-space-size=2048\" node src/workers.ts"
  }
}
```

**Expected Result**:
- No more "High memory usage detected" warnings
- No OOM kills during peak load

---

### Fix 4: Add Job Lifecycle Logging (30 minutes)

**Find where banking queue is processed**:
```bash
find src/modules/banking -name "*.ts" | xargs grep -l "bankingQueue\|bull\|queue.process"
```

**Add event listeners** (likely in `src/modules/banking/jobs/bankingJobs.ts` or similar):
```typescript
import { bankingQueue } from './bankingQueue'

// Job lifecycle events
bankingQueue.on('active', (job) => {
  logger.info('Sync job started', {
    jobId: job.id,
    accountId: job.data.accountId,
    type: 'SYNC_STARTED',
    timestamp: new Date().toISOString()
  })
})

bankingQueue.on('progress', (job, progress) => {
  logger.debug('Sync job progress', {
    jobId: job.id,
    progress: progress
  })
})

bankingQueue.on('completed', (job, result) => {
  logger.info('Sync job completed', {
    jobId: job.id,
    accountId: job.data.accountId,
    result: result,
    type: 'SYNC_COMPLETED',
    duration: result?.duration || 0
  })
})

bankingQueue.on('failed', (job, err) => {
  logger.error('Sync job failed', {
    jobId: job.id,
    accountId: job.data.accountId,
    error: err.message,
    stack: err.stack,
    attempt: job.attemptsMade,
    maxAttempts: job.opts.attempts,
    type: 'SYNC_FAILED'
  })
})

// Monitor queue health
setInterval(async () => {
  const counts = await bankingQueue.getJobCounts()
  logger.debug('Queue health', {
    pending: counts.wait,
    active: counts.active,
    delayed: counts.delayed,
    failed: counts.failed,
    completed: counts.completed
  })
}, 60000) // Every 60 seconds
```

**Expected Result**:
- Visible job processing in logs
- Can see exactly where jobs fail
- Queue health metrics

---

### Fix 5: Add Retry Logic (20 minutes)

**Find where job is queued** (likely `src/modules/banking/services/bankingService.ts`):
```bash
grep -r "bankingQueue.add\|queue.add" src/modules/banking/ --include="*.ts"
```

**Add retry configuration**:
```typescript
// Current code (no retries)
await bankingQueue.add('sync-transactions', {
  accountId,
  userId,
  connectionId
})

// Fixed code (with retry logic)
await bankingQueue.add(
  'sync-transactions',
  {
    accountId,
    userId,
    connectionId
  },
  {
    // Retry configuration
    attempts: 5,              // Retry up to 5 times
    backoff: {
      type: 'exponential',
      delay: 2000             // Start with 2 seconds
                              // 2s → 4s → 8s → 16s → 32s
    },

    // Timeout configuration
    timeout: 60000,           // 60 second timeout per attempt

    // Job completion handling
    removeOnComplete: {
      age: 3600              // Delete after 1 hour if completed
    },
    removeOnFail: false,       // Keep failed jobs for debugging

    // Priority
    priority: 10              // HIGH priority for sync jobs
  }
)
```

**Expected Result**:
- Failed jobs automatically retry with increasing delays
- Don't overwhelm external APIs on failures
- Can see failure history

---

## 🟢 VERIFICATION STEPS (Do After Fixes)

### Verify Transaction Sync Now Works
```bash
# 1. Start fresh
redis-cli FLUSHDB  # WARNING: Clears all Redis data - dev only!

# 2. Restart services
npm run dev &
npm run worker &

# 3. Create test account (via API or frontend)
curl -X POST http://localhost:3000/api/v1/banking/plaid/exchange-token \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"publicToken":"public_sandbox_...", "metadata":{...}}'

# 4. Watch logs for job processing
# Should see:
# ✅ "Job started"
# ✅ "Fetching transactions from Plaid"
# ✅ "Stored N transactions"
# ✅ "Job completed"

# 5. Verify database
psql mappr_db -c "SELECT COUNT(*) FROM transactions WHERE account_id = 'NEW_ACCOUNT_ID';"
# Should show transaction count > 0
```

### Verify Performance Improved
```bash
# Test response times with timeout
time curl -X GET http://localhost:3000/api/v1/banking/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should see:
# ✅ Response time < 500ms (was 2.3s)
# ✅ Status 200 OK
# ✅ Account list in response
```

### Verify Memory Stable
```bash
# Watch memory usage over 5 minutes
watch -n 2 'node --version && free -h && ps aux | grep node'

# Should see:
# ✅ Heap usage stable around 50-60%
# ✅ No "High memory usage" warnings
# ✅ No OOM killer events
```

---

## 📋 Checklist Before Production

- [ ] Worker process is running and monitoring shows 0 failed jobs
- [ ] Database indexes created and applied
- [ ] Batch account creation implemented (9.1s reduced to <600ms)
- [ ] Memory increased to 2GB (heap 97% → 50%)
- [ ] Job lifecycle event handlers logging properly
- [ ] Retry logic with exponential backoff in place
- [ ] Test account linked and transactions visible
- [ ] Performance test shows <500ms response times
- [ ] No warnings in production logs (24 hour baseline)
- [ ] Load test with 10+ accounts simultaneously succeeds

---

## 🆘 If Things Still Don't Work

### Transaction Sync Still Not Running
```bash
# 1. Check Redis is actually running
redis-cli info stats | grep connected_clients

# 2. Check for errors in worker process
grep -i "error\|failed" worker.log | tail -20

# 3. Verify BullMQ is properly initialized
grep -r "new Queue\|createQueue" src/

# 4. Check if job processor is registered
grep -r "bankingQueue.process" src/

# 5. Nuclear option: clear queue and restart
redis-cli DEL bull:banking-sync:*
npm run worker &
```

### Still Getting Slow Response Times
```bash
# 1. Verify indexes were created
psql mappr_db -c "\d financial_accounts" | grep -i index

# 2. Check query plan for slow query
psql mappr_db -c "EXPLAIN ANALYZE SELECT * FROM financial_accounts WHERE user_id = '...' AND organization_id = '...';"
# Should show: "Index Scan" (not "Seq Scan")

# 3. If still sequential scan, indexes didn't apply
# Force reload:
psql mappr_db -c "REINDEX TABLE financial_accounts;"

# 4. Restart application
npm run dev
```

### Memory Issues Persist
```bash
# 1. Verify NODE_OPTIONS is set
echo $NODE_OPTIONS

# 2. Check actual heap size
node -e "console.log(require('v8').getHeapStatistics())"

# 3. Look for memory leaks
# Install clinic.js
npm install -g clinic

# 4. Profile with clinic
clinic doctor -- npm run dev
# Leave running for 5 minutes, then Ctrl+C
# Open clinic report and look for memory growth
```

---

## 📞 Questions?

Check the full production analysis in: `context-docs/BANKING-PRODUCTION-ANALYSIS.md`

For Banking module API details: `context-docs/modules/banking/API.md`

For Banking module architecture: `context-docs/modules/banking/Details.md`
