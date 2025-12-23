# Account Charts & Net Worth API Documentation

This document describes the endpoints for retrieving account balance history, chart data, and net worth trends.

---

## 1. Get Account Balance History

**Endpoint:** `GET /api/v1/accounts/:id/history`

**Description:** Retrieve raw balance snapshots for an account with detailed statistics.

### Request

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | URL path | Yes | Account ID |
| `startDate` | ISO 8601 | Query | No | Start date for history (defaults to 365 days ago) |
| `endDate` | ISO 8601 | Query | No | End date for history (defaults to today) |
| `limit` | number | Query | No | Maximum snapshots to return (default: 365) |

### Example Request

```bash
curl -X GET \
  "http://localhost:3000/api/v1/accounts/clh4k5v1m0001lm0qh8k0j9z/history?startDate=2025-11-01&endDate=2025-12-24&limit=365" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Schema

```typescript
{
  success: boolean;
  data: {
    accountId: string;
    snapshots: BalanceSnapshot[];
    statistics: {
      lowestBalance: number;
      highestBalance: number;
      averageBalance: number;
      latestBalance: number;
      periodStartDate: Date;
      periodEndDate: Date;
    };
  };
}
```

### Response Example

```json
{
  "success": true,
  "data": {
    "accountId": "clh4k5v1m0001lm0qh8k0j9z",
    "snapshots": [
      {
        "id": "snap_001",
        "accountId": "clh4k5v1m0001lm0qh8k0j9z",
        "currentBalance": 5000.00,
        "availableBalance": 4500.00,
        "limitBalance": 10000.00,
        "capturedAt": "2025-11-01T00:00:00Z",
        "source": "account_created",
        "createdAt": "2025-11-01T14:30:00Z"
      },
      {
        "id": "snap_002",
        "accountId": "clh4k5v1m0001lm0qh8k0j9z",
        "currentBalance": 5250.50,
        "availableBalance": 4750.50,
        "limitBalance": 10000.00,
        "capturedAt": "2025-11-02T00:00:00Z",
        "source": "plaid_sync",
        "createdAt": "2025-11-02T08:15:00Z"
      },
      {
        "id": "snap_003",
        "accountId": "clh4k5v1m0001lm0qh8k0j9z",
        "currentBalance": 5100.00,
        "availableBalance": 4600.00,
        "limitBalance": 10000.00,
        "capturedAt": "2025-11-03T00:00:00Z",
        "source": "plaid_sync",
        "createdAt": "2025-11-03T09:45:00Z"
      }
    ],
    "statistics": {
      "lowestBalance": 5000.00,
      "highestBalance": 5250.50,
      "averageBalance": 5116.83,
      "latestBalance": 5100.00,
      "periodStartDate": "2025-11-01T00:00:00Z",
      "periodEndDate": "2025-12-24T00:00:00Z"
    }
  }
}
```

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid JWT token |
| 400 | Invalid Input | Organization context missing |
| 404 | Not Found | Account does not exist or doesn't belong to user |
| 500 | Server Error | Failed to fetch account history |

---

## 2. Get Account Chart Data

**Endpoint:** `GET /api/v1/accounts/:id/chart`

**Description:** Retrieve chart-formatted balance data with pre-calculated statistics for quick visualization.

### Request

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | URL path | Yes | Account ID |
| `period` | string | Query | No | Time period (7d, 30d, 90d, 1y, all; default: 30d) |

### Example Requests

```bash
# Get 30-day chart data (default)
curl -X GET \
  "http://localhost:3000/api/v1/accounts/clh4k5v1m0001lm0qh8k0j9z/chart" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get 1-year chart data
curl -X GET \
  "http://localhost:3000/api/v1/accounts/clh4k5v1m0001lm0qh8k0j9z/chart?period=1y" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all historical data
curl -X GET \
  "http://localhost:3000/api/v1/accounts/clh4k5v1m0001lm0qh8k0j9z/chart?period=all" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Schema

```typescript
{
  success: boolean;
  data: {
    period: string;
    dataPoints: ChartDataPoint[];
    summary: {
      currentBalance: number;
      highestBalance: number;
      lowestBalance: number;
      averageBalance: number;
      startDate: Date;
      endDate: Date;
    };
  };
}
```

### Response Example

```json
{
  "success": true,
  "data": {
    "period": "30d",
    "dataPoints": [
      {
        "timestamp": "2025-11-24T00:00:00Z",
        "value": 5000.00,
        "available": 4500.00
      },
      {
        "timestamp": "2025-11-25T00:00:00Z",
        "value": 5150.75,
        "available": 4650.75
      },
      {
        "timestamp": "2025-11-26T00:00:00Z",
        "value": 5100.00,
        "available": 4600.00
      },
      {
        "timestamp": "2025-11-27T00:00:00Z",
        "value": 5200.50,
        "available": 4700.50
      },
      {
        "timestamp": "2025-12-24T00:00:00Z",
        "value": 5450.25,
        "available": 4950.25
      }
    ],
    "summary": {
      "currentBalance": 5450.25,
      "highestBalance": 5450.25,
      "lowestBalance": 5000.00,
      "averageBalance": 5180.30,
      "startDate": "2025-11-24T00:00:00Z",
      "endDate": "2025-12-24T00:00:00Z"
    }
  }
}
```

### Period Options

| Period | Description | Range |
|--------|-------------|-------|
| `7d` | Last 7 days | Last week |
| `30d` | Last 30 days | Last month (default) |
| `90d` | Last 90 days | Last quarter |
| `1y` | Last 1 year | Last 12 months |
| `all` | All available data | Since account creation |

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid JWT token |
| 400 | Invalid Input | Organization context missing or invalid period |
| 404 | Not Found | Account does not exist or doesn't belong to user |
| 500 | Server Error | Failed to fetch chart data |

---

## 3. Get Net Worth Trend

**Endpoint:** `GET /api/v1/accounts/networth/trend`

**Description:** Retrieve net worth snapshots over time, showing how total wealth has changed across all accounts.

### Request

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `period` | string | Query | Yes | Time period (DAY, WEEK, MONTH, QUARTER, YEAR) |

### Example Requests

```bash
# Get daily net worth trend
curl -X GET \
  "http://localhost:3000/api/v1/accounts/networth/trend?period=DAY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get monthly net worth trend
curl -X GET \
  "http://localhost:3000/api/v1/accounts/networth/trend?period=MONTH" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get yearly net worth trend
curl -X GET \
  "http://localhost:3000/api/v1/accounts/networth/trend?period=YEAR" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Schema

```typescript
{
  success: boolean;
  data: {
    period: string;
    snapshots: NetWorthSnapshot[];
    startValue: number;
    endValue: number;
    change: number;
    changePercent: number;
  };
}
```

### Response Example

```json
{
  "success": true,
  "data": {
    "period": "MONTH",
    "snapshots": [
      {
        "id": "nw_snap_001",
        "userId": "user_123",
        "organizationId": "org_456",
        "snapshotDate": "2025-11-01T00:00:00Z",
        "granularity": "MONTHLY",
        "totalNetWorth": 50000.00,
        "totalAssets": 65000.00,
        "totalLiabilities": 15000.00,
        "cashValue": 10000.00,
        "investmentValue": 25000.00,
        "cryptoValue": 15000.00,
        "realEstateValue": 10000.00,
        "vehicleValue": 5000.00,
        "otherAssetValue": 0.00,
        "creditCardDebt": 5000.00,
        "loanDebt": 5000.00,
        "mortgageDebt": 5000.00,
        "currency": "USD",
        "createdAt": "2025-11-01T14:30:00Z"
      },
      {
        "id": "nw_snap_002",
        "userId": "user_123",
        "organizationId": "org_456",
        "snapshotDate": "2025-12-01T00:00:00Z",
        "granularity": "MONTHLY",
        "totalNetWorth": 52500.00,
        "totalAssets": 68000.00,
        "totalLiabilities": 15500.00,
        "cashValue": 11000.00,
        "investmentValue": 26000.00,
        "cryptoValue": 16000.00,
        "realEstateValue": 10000.00,
        "vehicleValue": 5000.00,
        "otherAssetValue": 0.00,
        "creditCardDebt": 5200.00,
        "loanDebt": 5000.00,
        "mortgageDebt": 5300.00,
        "currency": "USD",
        "createdAt": "2025-12-01T09:15:00Z"
      }
    ],
    "startValue": 50000.00,
    "endValue": 52500.00,
    "change": 2500.00,
    "changePercent": 5.00
  }
}
```

### Net Worth Snapshot Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalNetWorth` | number | Total assets minus total liabilities |
| `totalAssets` | number | Sum of all asset values |
| `totalLiabilities` | number | Sum of all liability values |
| `cashValue` | number | Cash and savings accounts |
| `investmentValue` | number | Stocks, bonds, retirement accounts |
| `cryptoValue` | number | Cryptocurrency holdings |
| `realEstateValue` | number | Property and real estate |
| `vehicleValue` | number | Vehicles and transportation |
| `otherAssetValue` | number | Valuables and other assets |
| `creditCardDebt` | number | Outstanding credit card balances |
| `loanDebt` | number | Personal and auto loans |
| `mortgageDebt` | number | Mortgage balances |

### Period Options

| Period | Granularity | Description |
|--------|------------|-------------|
| `DAY` | DAILY | Daily snapshots |
| `WEEK` | WEEKLY | Weekly snapshots (Monday start) |
| `MONTH` | MONTHLY | Monthly snapshots (1st of month) |
| `QUARTER` | QUARTERLY | Quarterly snapshots |
| `YEAR` | YEARLY | Yearly snapshots (Jan 1st) |

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid JWT token |
| 400 | Invalid Input | Organization context missing or invalid period |
| 404 | Not Found | No snapshots found for specified period |
| 500 | Server Error | Failed to fetch net worth trend |

---

## 4. Get Latest Net Worth

**Endpoint:** `GET /api/v1/accounts/networth/latest`

**Description:** Retrieve the most recent net worth snapshot with current breakdown by category.

### Request

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `granularity` | string | Query | No | Filter by granularity (DAILY, WEEKLY, MONTHLY, etc.) |

### Example Request

```bash
curl -X GET \
  "http://localhost:3000/api/v1/accounts/networth/latest?granularity=DAILY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Schema

Same as individual snapshot in net worth trend response.

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | No net worth snapshots exist |
| 500 | Server Error | Failed to fetch latest snapshot |

---

## 5. Get Net Worth Breakdown

**Endpoint:** `GET /api/v1/accounts/networth/breakdown`

**Description:** Get current net worth with detailed breakdown by asset and liability categories.

### Request

No parameters required (uses current user and organization context).

### Example Request

```bash
curl -X GET \
  "http://localhost:3000/api/v1/accounts/networth/breakdown" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Schema

```typescript
{
  success: boolean;
  data: {
    summary: {
      totalNetWorth: number;
      totalAssets: number;
      totalLiabilities: number;
      accountCount: number;
      currency: string;
      lastUpdated: Date;
    };
    assetBreakdown: {
      cash: number;
      investments: number;
      crypto: number;
      realEstate: number;
      vehicles: number;
      other: number;
    };
    liabilityBreakdown: {
      creditCard: number;
      loans: number;
      mortgage: number;
    };
  };
}
```

### Response Example

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalNetWorth": 52500.00,
      "totalAssets": 68000.00,
      "totalLiabilities": 15500.00,
      "accountCount": 12,
      "currency": "USD",
      "lastUpdated": "2025-12-24T14:30:00Z"
    },
    "assetBreakdown": {
      "cash": 11000.00,
      "investments": 26000.00,
      "crypto": 16000.00,
      "realEstate": 10000.00,
      "vehicles": 5000.00,
      "other": 0.00
    },
    "liabilityBreakdown": {
      "creditCard": 5200.00,
      "loans": 5000.00,
      "mortgage": 5300.00
    }
  }
}
```

### Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid JWT token |
| 500 | Server Error | Failed to calculate net worth |

---

## Authentication

All endpoints require JWT authentication via the `Authorization` header:

```bash
Authorization: Bearer <jwt_token>
```

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <jwt_token>` | Yes |
| `Content-Type` | `application/json` | For POST requests |

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Chart endpoints**: 50 requests per minute
- **Net worth endpoints**: 20 requests per minute

---

## Frontend Integration Example

### React Hook for Account Chart

```typescript
import { useEffect, useState } from 'react';

export function useAccountChart(accountId: string, period: '7d' | '30d' | '90d' | '1y' | 'all' = '30d') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await fetch(
          `/api/v1/accounts/${accountId}/chart?period=${period}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` }
          }
        );
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [accountId, period]);

  return { data, loading, error };
}
```

### React Hook for Net Worth Trend

```typescript
export function useNetWorthTrend(period: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' = 'MONTH') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const response = await fetch(
          `/api/v1/accounts/networth/trend?period=${period}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` }
          }
        );
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, [period]);

  return { data, loading, error };
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Balance values are returned as numbers (decimal currency)
- Chart endpoints automatically calculate statistics for optimization
- Snapshots are created daily; historical data spans back to account creation date
- Net worth snapshots are created automatically when accounts are added or transactions sync
