# CRITICAL: Redis Eviction Policy - Jobs Being Lost

**Date**: 2025-01-18
**Severity**: 🔴 CRITICAL - Production Breaking
**Issue**: Jobs queued but not syncing due to Redis eviction policy

---

## The Problem

Your Redis instance is configured with `volatile-lru` eviction policy, which **deletes job queue data when Redis memory fills up**.

**Symptom**: Jobs are queued successfully but never process:
```
[info]: Job added to queue successfully {"queueName":"banking-sync","jobType":"sync-incremental-transactions","jobId":"7265"}
[debug]: Queued incremental sync job {"connectionId":"cmkipd6vd000bpyp9iuk9xq49","syncStateCount":2}
```

But then NO processing logs appear (no "JOB_STARTED", no "JOB_COMPLETED").

**Root Cause**: With `volatile-lru` eviction:
1. Job stored in Redis
2. When Redis memory pressure occurs, Redis deletes keys with TTL
3. Job data is evicted before worker can process it
4. Job disappears from queue silently
5. No error, just gone

**Why This Breaks Your System**:
- Banking transactions scheduled but never synced
- Crypto wallets queued but never updated
- Users think data is syncing when it's actually being deleted

---

## The Solution

### Change Redis Eviction Policy to `noeviction`

**`noeviction`** means:
- Redis will NOT delete job queue data under memory pressure
- Instead, Redis will return an error if memory limit is reached
- This is SAFE for job queues because:
  - Errors can be logged and handled
  - Jobs are NOT silently deleted
  - You know when there's a problem

### How to Fix

#### Option A: Redis CLI (Immediate)
```bash
redis-cli CONFIG SET maxmemory-policy noeviction
redis-cli CONFIG REWRITE  # Make persistent
```

#### Option B: Redis Server Configuration File
Edit `/etc/redis/redis.conf` or your Redis config:
```
# OLD (WRONG):
maxmemory-policy volatile-lru

# NEW (CORRECT):
maxmemory-policy noeviction
```

Then restart Redis:
```bash
sudo systemctl restart redis
# or
redis-server /path/to/redis.conf
```

#### Option C: Docker Compose
```yaml
services:
  redis:
    image: redis:7
    command: redis-server --maxmemory-policy noeviction
    # or
    command: redis-server --maxmemory 2gb --maxmemory-policy noeviction
```

#### Option D: Redis Cloud / Managed Service
Most providers have a configuration panel:
1. Go to your Redis service dashboard
2. Find "Eviction Policy" setting
3. Change from `volatile-lru` to `noeviction`
4. Restart service (usually automatic)

**For Neon.tech / AWS ElastiCache / Azure / etc**: Check their UI for eviction policy settings

---

## Verify the Fix

After changing eviction policy, run:

```bash
# Check current policy
redis-cli CONFIG GET maxmemory-policy
# Should return: noeviction (not volatile-lru, volatile-ttl, etc)

# Check memory settings
redis-cli CONFIG GET maxmemory
# Should return a non-zero value (e.g., 1gb, 2gb)
```

### Automatic Diagnostics

The backend now performs Redis diagnostics on worker startup:

```bash
npm run start:worker
```

Look for these logs:

**✅ Good** (will see this):
```
[info]: Redis Configuration {
  maxmemory: "2gb",
  maxmemory_policy: "noeviction",
  used_memory: "512MB",
  ...
}
[info]: ✓ Redis configuration is optimal
```

**❌ Bad** (will see this if NOT fixed):
```
[error]: Redis Configuration Issues (MUST FIX) {
  issues: [
    "CRITICAL: Redis eviction policy is "volatile-lru" but should be "noeviction".
     This causes job queue data to be deleted when memory fills up, resulting in lost jobs.
     Fix: Run "redis-cli CONFIG SET maxmemory-policy noeviction" or configure Redis server."
  ]
}
```

---

## Why Your Jobs Aren't Processing

**Timeline of what's happening now**:

1. **User links bank account**
   ```
   [info]: Created banking jobs successful
   [info]: Job added to queue successfully (jobId: 7265)
   ```

2. **Worker picks up job from queue**
   - Worker looks for pending jobs
   - Job is there

3. **Redis evicts job due to memory pressure**
   - `volatile-lru` kicks in
   - Job is deleted from Redis
   - No error, just silently removed

4. **Worker finds empty queue**
   - No job to process
   - Logs nothing
   - Waits for next job
   - **User never gets their transactions**

---

## Implementation

### Deployment Steps

1. **Immediate (Required)**:
   ```bash
   # Change Redis eviction policy
   redis-cli CONFIG SET maxmemory-policy noeviction
   redis-cli CONFIG REWRITE
   ```

2. **Restart Worker** (after Redis change):
   ```bash
   npm run start:worker
   # Should see: "✓ Redis configuration is optimal"
   ```

3. **Monitor** (new startup diagnostics will help):
   ```bash
   # Worker now logs Redis config on startup
   npm run start:worker 2>&1 | grep "Redis Configuration"
   ```

4. **Requeue Stuck Jobs** (optional):
   ```bash
   # If there are pending jobs stuck in queue
   redis-cli LLEN bull:banking-sync:wait

   # Manually trigger sync for any stuck accounts
   curl -X POST http://localhost:3000/api/v1/banking/connections/{connectionId}/sync \
     -H "Authorization: Bearer <TOKEN>"
   ```

---

## Why This Wasn't Caught Earlier

1. **No Redis diagnostics** on startup → Didn't know policy was wrong
2. **Jobs queued successfully** → Looked like it was working
3. **Silent eviction** → No error messages to alert us
4. **Intermittent** → Works when memory is low, fails when memory is high

This is now fixed with automatic diagnostics that log warnings on startup.

---

## Additional Redis Recommendations

### Memory Settings
```bash
# Check current memory limits
redis-cli CONFIG GET maxmemory
redis-cli CONFIG GET maxmemory-policy

# Set memory limit (e.g., 2GB for production)
redis-cli CONFIG SET maxmemory 2gb

# Make it persistent
redis-cli CONFIG REWRITE
```

### Recommended Production Settings
```bash
maxmemory 2gb                  # Allocate enough for job queue
maxmemory-policy noeviction    # CRITICAL: Never evict jobs
```

### Monitor Queue Size
```bash
redis-cli LLEN bull:banking-sync:wait
redis-cli LLEN bull:banking-sync:active
redis-cli LLEN bull:banking-sync:failed

# If backing up, increase maxmemory or worker concurrency
```

---

## What Changed in Code

### 1. Added Redis Diagnostics (`src/config/redis-diagnostics.ts`)
- Checks eviction policy on worker startup
- Validates memory settings
- Reports issues in logs
- Provides actionable error messages

### 2. Worker Startup Check (`src/worker.ts`)
- Calls `logRedisStartupDiagnostics()` on startup
- Warns if eviction policy is wrong
- Shows memory configuration
- Alerts to connection pool issues

### 3. Build Includes Diagnostics
```bash
npm run build  # Now includes diagnostic logic
```

---

## Testing

### Local Test
```bash
# 1. Start Redis with wrong policy
redis-server --maxmemory 512mb --maxmemory-policy volatile-lru

# 2. Start worker - will show error
npm run start:worker
# Should show: CRITICAL error about volatile-lru

# 3. Fix Redis
redis-cli CONFIG SET maxmemory-policy noeviction
redis-cli CONFIG REWRITE

# 4. Restart worker - error should disappear
npm run start:worker
# Should show: ✓ Redis configuration is optimal
```

### Production Verification
```bash
# Check before deployment
redis-cli CONFIG GET maxmemory-policy
# Response should be: noeviction

# Tail logs after deployment
npm run start:worker 2>&1 | grep -E "Redis Configuration|Configuration Issues"
```

---

## FAQ

**Q: Will changing eviction policy cause Redis to run out of memory?**
A: Yes, if you don't allocate enough memory. Set `maxmemory` appropriately for your workload. BullMQ queues typically need 100-500MB.

**Q: What if Redis runs out of memory with `noeviction`?**
A: Redis will return errors. This is better than silent job loss because:
1. Errors are logged
2. You can increase memory
3. Jobs aren't lost
4. You can alert/scale infrastructure

**Q: Do I need to restart the application after changing eviction policy?**
A: Yes, restart the worker so it can verify the new configuration on startup.

**Q: Can I use `allkeys-lru` instead?**
A: NO. `allkeys-lru` deletes ALL keys, not just old ones. It will evict your job queue data.

**Q: What eviction policies should I NOT use for job queues?**
- `volatile-lru` ❌ (current problem)
- `volatile-ttl` ❌
- `volatile-random` ❌
- `allkeys-lru` ❌
- `allkeys-ttl` ❌
- `allkeys-random` ❌

**Only use: `noeviction` ✅**

---

## References

- [Redis Eviction Policies Docs](https://redis.io/docs/reference/eviction/)
- [BullMQ Job Queue Best Practices](https://docs.bullmq.io/)
- [Redis Memory Management](https://redis.io/docs/management/admin-api/)

---

**Status**: 🔴 CRITICAL - Fix immediately before production

After applying fix: ✅ Verified
