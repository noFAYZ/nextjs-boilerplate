# Organization Switching Fix - Complete Summary

## The Problem

When switching organizations from the switcher, the data was not refreshing. The app still showed the previous organization's data instead of the new organization's data.

## Root Cause Analysis

After reviewing the `FRONTEND_ORGANIZATION_GUIDE.md`, I discovered the critical issue:

**The backend expects `organizationId` as a QUERY PARAMETER in the URL, not just in the header.**

### Wrong Approach (What was happening)
```bash
GET /api/v1/crypto/wallets
Headers: { X-Organization-Id: "org_123" }
❌ Backend cannot properly filter data
```

### Correct Approach (What we fixed)
```bash
GET /api/v1/crypto/wallets?organizationId=org_123
Headers: { X-Organization-Id: "org_123" }
✅ Backend filters data by organization
```

## What Was Fixed

### 1. **API Client - Query Parameter Injection** (`lib/api-client.ts`)
Updated the `request()` method to:
- Extract `organizationId` from context store if not explicitly provided
- Add it to the URL as a query parameter: `?organizationId={id}`
- Handle existing query parameters correctly: `?timeRange=24h&organizationId={id}`

```typescript
// Before (header-only)
GET /api/v1/crypto/wallets
❌ No query parameter

// After (header + query parameter)
GET /api/v1/crypto/wallets?organizationId=org_123
✅ Query parameter added
```

### 2. **Organization Switcher** (`components/organization/organization-switcher.tsx`)
Already fixed in previous commit:
- Updates BOTH stores when org selected:
  - UI Store (for visual feedback)
  - Context Store (for data scoping - this triggers queries to refetch)

### 3. **Query Hooks** (already fixed in previous commits)
- `useCryptoWallets()` - Uses context org ID
- `useBankingAccounts()` - Uses context org ID
- All other data hooks automatically scoped to current org

## How It Works Now (Complete Flow)

```
User clicks organization switcher
    ↓
selectOrganization('org_abc') → UI Store updated (visual feedback)
setSelectedOrganization('org_abc') → Context Store updated
    ↓
OrganizationDataSyncProvider detects context change
    ↓
Invalidates all cached queries
    ↓
Components re-fetch their data:

    useCryptoWallets() calls:
    ├─ useContextOrganizationId() → gets 'org_abc' from context
    ├─ cryptoQueries.wallets('org_abc')
    ├─ apiClient.get('/crypto/wallets', 'org_abc')
    ├─ URL built: GET /api/v1/crypto/wallets?organizationId=org_abc
    ↓
Backend receives request with organizationId query param
    ↓
Backend filters wallets for org_abc only
    ↓
Returns org-specific data to frontend
    ↓
UI updates with new organization's data ✅
```

## Key Code Changes

### API Client: Adding Query Parameters

```typescript
private async request(endpoint, options, organizationId?) {
  let url = `${this.baseURL}${endpoint}`;

  // Get org from context store if not provided
  let orgId = organizationId;
  if (!orgId) {
    const { useOrganizationStore } = require('@/lib/stores/organization-store');
    const selectedOrgId = useOrganizationStore.getState().selectedOrganizationId;
    if (selectedOrgId) orgId = selectedOrgId;
  }

  // ADD ORGANIZATION TO QUERY STRING
  if (orgId) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}organizationId=${orgId}`;
  }

  const response = await fetch(url, { headers, ...options });
  // ... rest of code
}
```

## What Queries Now Send

### Crypto Wallets
```
Before: GET /api/v1/crypto/wallets
After:  GET /api/v1/crypto/wallets?organizationId=org_123
```

### Budgets
```
Before: GET /api/v1/budgets
After:  GET /api/v1/budgets?organizationId=org_123
```

### Banking Accounts
```
Before: GET /api/v1/accounts
After:  GET /api/v1/accounts?organizationId=org_123
```

### Crypto Wallet with TimeRange
```
Before: GET /api/v1/crypto/wallets/{id}?timeRange=24h
After:  GET /api/v1/crypto/wallets/{id}?timeRange=24h&organizationId=org_123
```

## How to Verify It Works

### 1. Open Browser Developer Console (F12)
Go to Network tab

### 2. Switch Organizations
Click on a different organization in the switcher

### 3. Watch Network Requests
You should see:
- All API calls now include `?organizationId=org_123` (or whatever the new org ID is)
- Example: `GET /api/v1/crypto/wallets?organizationId=org_456`

### 4. Check Console Logs
You'll see:
```
[ApiClient] Adding organizationId to query string: {orgId: "org_456", finalUrl: "http://localhost:3000/api/v1/crypto/wallets?organizationId=org_456"}
```

### 5. Verify Data Changes
The displayed data should now be specific to the selected organization

## Files Modified

1. `lib/api-client.ts` - Added query parameter injection
2. `components/organization/organization-switcher.tsx` - Updated both stores
3. `lib/queries/use-crypto-data.ts` - Uses context org ID
4. `lib/queries/use-banking-data.ts` - Uses context org ID
5. `lib/stores/organization-store.ts` - Context store for org scope
6. `components/providers/organization-data-sync-provider.tsx` - Invalidates on org change
7. `components/providers/organization-url-sync-provider.tsx` - URL sync

## Commits Made

1. `e77e901` - feat: Implement multi-tenant organization context
2. `8cb2188` - fix: Ensure organization switcher updates context store
3. `346ca7b` - debug: Add comprehensive logging
4. `47070ff` - debug: Add API client logging
5. `24fce1e` - fix: Add organizationId as query parameter

## Testing Checklist

- [ ] Switch organizations in the switcher
- [ ] Verify new API requests include `?organizationId=...`
- [ ] Check that data changes to match new organization
- [ ] Verify no errors in console
- [ ] Check Network tab shows query parameters
- [ ] Try refreshing page - organization selection persists
- [ ] Try deep link with `?org=` parameter - loads correct org

## Now It Should Work!

When you:
1. **Switch organizations** → switcher updates both stores
2. **Context store changes** → data sync provider invalidates queries
3. **Queries re-run** → they include organizationId in URL
4. **API receives correct org** → filters data appropriately
5. **Data updates** → UI shows correct organization's data ✅

The flow is now complete and follows the `FRONTEND_ORGANIZATION_GUIDE` correctly!
