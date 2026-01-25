# Admin Module - Details

**Path**: `src/modules/admin/`

## Overview

Administrative functions, system monitoring, user management, and analytics. Restricted to admin users only.

**Status**: ✅ Production Ready
**Maturity**: Medium

---

## Features

### 1. User Management
- View all users with filters
- User status management
- Suspend/unsuspend users
- View user subscriptions
- Reset user data

### 2. System Analytics
- Active user counts
- Feature adoption metrics
- Revenue analytics
- Error rate monitoring
- Performance metrics

### 3. Background Job Monitoring
- Queue status overview
- Job statistics
- Failed job tracking
- Job retry management
- Queue performance

### 4. Audit & Logging
- Access audit logs
- System event logs
- Error logs
- Performance logs
- Export logs

### 5. System Maintenance
- Database optimization
- Cache clearing
- Manual triggers for jobs
- System configuration updates
- Feature flags management

---

## Key Methods

```
listUsers(filters)
  → Get all users with pagination

getUserDetails(userId)
  → Get user information

suspendUser(userId, reason)
  → Suspend user account

getSystemAnalytics(period)
  → Get system metrics

getQueueStats()
  → Get background job queue stats

getAuditLogs(filters)
  → Get audit trail

clearCache(pattern)
  → Clear cache entries

triggerMaintenance(operation)
  → Run maintenance operation
```

---

## Database Models

- **AdminAction**: id, adminId, action, resourceType, resourceId, timestamp
- **SystemMetrics**: id, metricName, value, timestamp
- **SystemLog**: id, level, message, context, timestamp

---

## API Endpoints (10+)

- GET `/users` - List users
- GET `/users/{id}` - User details
- POST `/users/{id}/suspend` - Suspend user
- POST `/users/{id}/unsuspend` - Unsuspend user
- GET `/analytics` - System analytics
- GET `/queue/stats` - Queue statistics
- GET `/audit-logs` - Audit logs
- POST `/maintenance` - Run maintenance
- GET `/health` - System health
- POST `/features/toggle` - Toggle feature flag
