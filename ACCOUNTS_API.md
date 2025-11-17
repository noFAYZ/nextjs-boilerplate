# Unified Accounts API Documentation

## Overview

The backend now provides a **unified account structure** similar to Monarch Money, allowing users to manage all their accounts (financial, crypto, assets, liabilities) in one place with a consistent API interface.

## Features Implemented

### ✅ 1. Unified Account Grouping by Category

All accounts are automatically grouped into these categories:

- **Cash**: Checking, Savings accounts
- **Credit**: Credit cards
- **Investments**: Investment accounts, Crypto wallets
- **Assets**: Real estate, Vehicles, Other assets
- **Liabilities**: Loans, Mortgages
- **Other**: Any other account types

### ✅ 2. Manual Account Creation

Users can manually add any type of account:
- Bank accounts (checking, savings)
- Credit cards
- Assets (real estate, vehicles, property)
- Investments
- Loans and liabilities

### ✅ 3. Performance Chart Data

Each account includes comprehensive performance tracking:
- Historical chart data
- Performance metrics for multiple periods (1D, 1W, 1M, 3M, 6M, YTD, 1Y, ALL)
- All-time high/low
- Average balance tracking

### ✅ 4. Account Details with Analytics

Detailed account information including:
- Transaction statistics
- Valuation history (for assets)
- Performance trends
- Change percentages

## API Endpoints

### 1. Get All Accounts (Grouped by Category)

```http
GET /api/v1/accounts
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalNetWorth": 125000.00,
      "totalAssets": 150000.00,
      "totalLiabilities": 25000.00,
      "accountCount": 8,
      "currency": "USD",
      "lastUpdated": "2025-11-15T08:00:00Z"
    },
    "groups": {
      "cash": {
        "category": "CASH",
        "totalBalance": 15000.00,
        "accountCount": 2,
        "accounts": [
          {
            "id": "abc123",
            "name": "Main Checking",
            "type": "CHECKING",
            "category": "CASH",
            "balance": 10000.00,
            "currency": "USD",
            "isActive": true,
            "source": "manual",
            "createdAt": "2024-01-01T00:00:00Z"
          }
        ]
      },
      "credit": {
        "category": "CREDIT",
        "totalBalance": -5000.00,
        "accountCount": 1,
        "accounts": [...]
      },
      "investments": {
        "category": "INVESTMENTS",
        "totalBalance": 50000.00,
        "accountCount": 3,
        "accounts": [...]
      },
      "assets": {
        "category": "ASSETS",
        "totalBalance": 85000.00,
        "accountCount": 1,
        "accounts": [...]
      },
      "liabilities": {
        "category": "LIABILITIES",
        "totalBalance": -20000.00,
        "accountCount": 1,
        "accounts": [...]
      },
      "other": {
        "category": "OTHER",
        "totalBalance": 0,
        "accountCount": 0,
        "accounts": []
      }
    }
  }
}
```

### 2. Create Manual Account

```http
POST /api/v1/accounts/manual
```

**Request Body:**
```json
{
  "name": "Main Checking Account",
  "type": "CHECKING",
  "balance": 5000.00,
  "currency": "USD",
  "institutionName": "Chase Bank",
  "accountNumber": "****1234",
  "groupId": "optional-group-id"
}
```

**Account Types Supported:**
- `CHECKING` - Checking account
- `SAVINGS` - Savings account
- `CREDIT_CARD` - Credit card
- `INVESTMENT` - Investment account
- `LOAN` - Loan
- `MORTGAGE` - Mortgage
- `CRYPTO` - Cryptocurrency wallet
- `REAL_ESTATE` - Real estate property
- `VEHICLE` - Vehicle
- `OTHER_ASSET` - Other assets

**For Asset Accounts (Real Estate, Vehicle, Other):**
```json
{
  "name": "Family Home",
  "type": "REAL_ESTATE",
  "balance": 450000.00,
  "currency": "USD",
  "assetDescription": "3BR/2BA single family home",
  "originalValue": 400000.00,
  "purchaseDate": "2020-01-15",
  "appreciationRate": 3.5,
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94102"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid_generated_id",
    "name": "Main Checking Account",
    "type": "CHECKING",
    "category": "CASH",
    "balance": 5000.00,
    "currency": "USD",
    "isActive": true,
    "source": "manual",
    "createdAt": "2025-11-15T08:00:00Z"
  },
  "message": "Manual account created successfully"
}
```

### 3. Get Account Details with Performance

```http
GET /api/v1/accounts/{accountId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Main Checking",
    "type": "CHECKING",
    "category": "CASH",
    "balance": 10000.00,
    "currency": "USD",
    "isActive": true,
    "source": "manual",
    "institutionName": "Chase Bank",
    "performance": {
      "periods": {
        "1D": {
          "startValue": 9950.00,
          "endValue": 10000.00,
          "change": 50.00,
          "changePercent": 0.50,
          "startDate": "2025-11-14T08:00:00Z",
          "endDate": "2025-11-15T08:00:00Z"
        },
        "1W": {
          "startValue": 9500.00,
          "endValue": 10000.00,
          "change": 500.00,
          "changePercent": 5.26,
          "startDate": "2025-11-08T08:00:00Z",
          "endDate": "2025-11-15T08:00:00Z"
        },
        "1M": { ... },
        "3M": { ... },
        "6M": { ... },
        "YTD": { ... },
        "1Y": { ... },
        "ALL": { ... }
      },
      "chartData": [
        {
          "date": "2025-11-01T00:00:00Z",
          "balance": 9500.00,
          "change": 100.00,
          "changePercent": 1.06
        },
        {
          "date": "2025-11-02T00:00:00Z",
          "balance": 9550.00,
          "change": 50.00,
          "changePercent": 0.53
        }
      ],
      "currentBalance": 10000.00,
      "allTimeHigh": 12000.00,
      "allTimeLow": 5000.00,
      "averageBalance": 9250.00
    },
    "transactionStats": {
      "totalTransactions": 124,
      "lastTransactionDate": "2025-11-14T15:30:00Z",
      "averageMonthlySpending": 2500.00,
      "largestTransaction": 5000.00
    },
    "valuationHistory": [],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2025-11-15T08:00:00Z"
  }
}
```

### 4. Update Account

```http
PUT /api/v1/accounts/{accountId}
```

**Request Body:**
```json
{
  "name": "Updated Account Name",
  "balance": 10500.00,
  "isActive": true,
  "institutionName": "New Bank Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... updated account ... },
  "message": "Account updated successfully"
}
```

### 5. Delete/Deactivate Account

```http
DELETE /api/v1/accounts/{accountId}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Note:** This performs a soft delete by setting `isActive` to `false`. The account data is preserved.

## Account Categories Explained

### Cash Accounts
- **Type**: CHECKING, SAVINGS
- **Purpose**: Day-to-day banking
- **Balance**: Positive (assets)

### Credit Accounts
- **Type**: CREDIT_CARD
- **Purpose**: Credit cards and revolving credit
- **Balance**: Typically negative (liabilities)

### Investment Accounts
- **Type**: INVESTMENT, CRYPTO
- **Purpose**: Long-term investments and cryptocurrency
- **Balance**: Positive (assets)
- **Features**: Performance tracking, portfolio analytics

### Asset Accounts
- **Type**: REAL_ESTATE, VEHICLE, OTHER_ASSET
- **Purpose**: Physical assets and property
- **Balance**: Positive (assets)
- **Features**: Valuation tracking, appreciation/depreciation

### Liability Accounts
- **Type**: LOAN, MORTGAGE
- **Purpose**: Debts and long-term liabilities
- **Balance**: Negative (liabilities)
- **Features**: Interest rate tracking, payment due dates

## Usage Examples

### Example 1: Get Overview of All Accounts

```javascript
const response = await fetch('/api/v1/accounts', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const { data } = await response.json();
console.log(`Net Worth: $${data.summary.totalNetWorth}`);
console.log(`Total Accounts: ${data.summary.accountCount}`);

// Access accounts by category
data.groups.cash.accounts.forEach(account => {
  console.log(`${account.name}: $${account.balance}`);
});
```

### Example 2: Create a Manual Checking Account

```javascript
const response = await fetch('/api/v1/accounts/manual', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Emergency Fund',
    type: 'SAVINGS',
    balance: 10000.00,
    currency: 'USD',
    institutionName: 'Ally Bank'
  })
});

const { data } = await response.json();
console.log(`Created account: ${data.id}`);
```

### Example 3: Add a Real Estate Property

```javascript
const response = await fetch('/api/v1/accounts/manual', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Investment Property',
    type: 'REAL_ESTATE',
    balance: 350000.00,
    currency: 'USD',
    assetDescription: 'Rental property - 2BR condo',
    originalValue: 300000.00,
    purchaseDate: '2022-06-15',
    appreciationRate: 5.0,
    address: '456 Oak Avenue',
    city: 'Austin',
    state: 'TX',
    postalCode: '78701'
  })
});
```

### Example 4: Get Account Performance Data

```javascript
const response = await fetch('/api/v1/accounts/abc123', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const { data } = await response.json();

// Display 1-month performance
const monthPerf = data.performance.periods['1M'];
console.log(`1-Month Change: $${monthPerf.change} (${monthPerf.changePercent}%)`);

// Chart the data
data.performance.chartData.forEach(point => {
  console.log(`${point.date}: $${point.balance}`);
});
```

## Database Models

The unified accounts system uses these database models:

- `FinancialAccount` - Traditional bank accounts, credit cards, loans
- `CryptoWallet` - Cryptocurrency wallets (from existing crypto module)
- `AccountValuation` - Historical valuations for assets
- `Transaction` - Transaction history for accounts
- `CryptoPortfolioSnapshot` - Historical snapshots for crypto wallets

## Features for Frontend Integration

### Net Worth Calculation
- Total assets (cash + investments + assets)
- Total liabilities (credit + loans)
- Net worth = assets - liabilities

### Account Grouping
- Automatic categorization
- Easy filtering by category
- Summary statistics per category

### Performance Tracking
- Multiple time period views
- Historical chart data
- Change indicators (positive/negative)

### Manual Account Management
- Add any account type
- Track assets manually
- Valuation history

## Notes

1. **Automatic Categorization**: Accounts are automatically assigned to categories based on their type
2. **Soft Deletes**: Deleting an account sets `isActive` to false but preserves data
3. **Valuation History**: Asset accounts automatically create valuation records when balance is updated
4. **Performance Data**: Based on historical snapshots (crypto) or valuation records (financial)
5. **Plan Limits**: Manual account creation enforces plan-based limits (FREE: 3, PRO: 50, ULTIMATE: unlimited)

## Migration from Existing Code

If you have existing code using separate account endpoints:

**Before:**
```javascript
// Separate endpoints for different account types
const financial = await fetch('/api/v1/financial-accounts');
const crypto = await fetch('/api/v1/crypto/wallets');
const assets = await fetch('/api/v1/accounts/assets');
```

**After:**
```javascript
// Single unified endpoint
const allAccounts = await fetch('/api/v1/accounts');
// All account types grouped by category
```

## Future Enhancements

Potential additions to consider:
- [ ] Account reconciliation
- [ ] Recurring transaction detection
- [ ] Budget allocation per account
- [ ] Account-level goals
- [ ] Multi-currency support improvements
- [ ] Export account data (CSV, PDF)
- [ ] Account sharing/joint accounts

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2025-11-15
