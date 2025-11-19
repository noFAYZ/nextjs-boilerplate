# Organization Switcher Debugging Guide

## Instructions

1. **Open your app in the browser**
2. **Open Developer Tools (F12) → Console tab**
3. **Change organizations from the switcher**
4. **Look for these logs in order:**

### Expected Log Sequence

```
[OrganizationSwitcher] User selected organization: org_abc123
[OrganizationSwitcher] Updated UI store
[OrganizationStore] Setting selected organization: org_abc123
[OrganizationSwitcher] Updated context store - should trigger data sync
[OrganizationDataSyncProvider] selectedOrgId changed: { previous: 'org_xyz', current: 'org_abc123' }
[OrganizationDataSyncProvider] Organization changed, invalidating queries { from: 'org_xyz', to: 'org_abc123' }
[useContextOrganizationId] Resolved org ID: { explicit: undefined, context: 'org_abc123', resolved: 'org_abc123' }
[useCryptoWallets] Query options: { orgId: 'org_abc123', queryKey: ['crypto', 'wallets', 'org_abc123'] }
```

## Checklist to Run in Console

Copy and paste this into the browser console:

```javascript
// Check 1: Is organization store initialized?
console.log('=== CHECK 1: Organization Store ===');
import('file:///lib/stores/organization-store.ts').then(mod => {
  const store = mod.useOrganizationStore.getState();
  console.log('Selected Org ID:', store.selectedOrganizationId);
  console.log('Is Initialized:', store.isInitialized);
});

// Check 2: Are API headers being set?
console.log('=== CHECK 2: API Client ===');
fetch('/api/v1/crypto/wallets', { credentials: 'include' })
  .then(r => {
    console.log('Request headers sent to backend');
    return r.json();
  });

// Check 3: Check localStorage
console.log('=== CHECK 3: LocalStorage ===');
console.log('Organization Store Data:', localStorage.getItem('organization-store'));
```

## What to Report

After switching organizations, tell me:

1. **Do you see the switcher logs?** (`[OrganizationSwitcher]`)
2. **Do you see the store logs?** (`[OrganizationStore]`)
3. **Do you see the data sync logs?** (`[OrganizationDataSyncProvider]`)
4. **Do you see the query logs?** (`[useContextOrganizationId]`, `[useCryptoWallets]`)
5. **What does the browser console show?** (copy entire log output)
6. **What organization ID is being set?** (org_abc123 vs something else?)

## Common Issues & Fixes

### Issue: No logs appear
**Problem**: Logging is not enabled or switcher not being called
**Solution**: Make sure you're looking at the Console tab (not Network/Elements), and that you're actually clicking the switcher

### Issue: Store log appears but not data sync log
**Problem**: Data sync provider not detecting the change
**Solution**: The context store might not be properly connected to the provider

### Issue: Query logs don't show
**Problem**: Queries are not being called or orgId is null
**Solution**: The organization might not be initialized before queries run

### Issue: New organization ID appears but data doesn't change
**Problem**: API is not receiving the organizationId header
**Solution**: Check if the backend is actually receiving and using the X-Organization-Id header

## Next Steps

Once you've checked these, paste the console output here and we can diagnose the exact issue.
