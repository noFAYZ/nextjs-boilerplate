# Accounts Module - Details

**Path**: `src/modules/accounts/`

## Overview

Account management with grouping, preferences, and portfolio management. Allows users to organize their financial and crypto accounts into logical groups.

**Status**: ✅ Production Ready
**Maturity**: Medium

---

## Features

### 1. Account Grouping
- Create logical account groups (e.g., "Emergency Fund", "Trading")
- Organize crypto wallets and bank accounts together
- Set group preferences and visibility

### 2. Account Preferences
- Per-account custom settings
- Include/exclude from portfolio
- Auto-sync settings
- Custom labels and notes

### 3. Portfolio Management
- Group-level portfolio aggregation
- Balance tracking per group
- Group-level analytics

---

## Key Methods

```
createAccountGroup(userId, groupData)
  → Create new group

addAccountToGroup(userId, groupId, accountId)
  → Add account to group

removeAccountFromGroup(userId, groupId, accountId)
  → Remove account from group

updateGroupPreferences(userId, groupId, prefs)
  → Update group settings

getGroupPortfolio(userId, groupId)
  → Get aggregated group portfolio
```

---

## Database Models

- **AccountGroup**: id, userId, name, description, createdAt
- **GroupMember**: id, groupId, accountId (crypto/banking), addedAt
- **AccountPreference**: id, accountId, includeInPortfolio, autoSync

---

## API Endpoints (10+)

- POST `/groups` - Create group
- GET `/groups` - List groups
- GET `/groups/{id}` - Get group
- PUT `/groups/{id}` - Update group
- DELETE `/groups/{id}` - Delete group
- POST `/groups/{id}/members` - Add account
- DELETE `/groups/{id}/members/{accountId}` - Remove account
- GET `/groups/{id}/portfolio` - Group portfolio
- PUT `/accounts/{id}/preferences` - Update preferences
- GET `/accounts/{id}/preferences` - Get preferences
