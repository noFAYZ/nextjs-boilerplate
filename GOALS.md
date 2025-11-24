### 7. Goals Module

**Base Path**: `/api/v1/goals`

**Authentication**: Required for all endpoints

#### Create Goal

**Endpoint**: `POST /`

**Description**: Create new financial goal

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Save for Vacation",
  "description": "Trip to Hawaii",
  "type": "SAVINGS",
  "category": "TRAVEL",
  "priority": "HIGH",
  "targetAmount": 5000.00,
  "targetDate": "2025-12-31",
  "sourceType": "BANK_ACCOUNT",
  "accountId": "bank_acc_1",
  "milestones": [
    {
      "amount": 2500.00,
      "date": "2025-11-30",
      "description": "Halfway there"
    }
  ]
}
```

**Goal Types**: `SAVINGS`, `EMERGENCY_FUND`, `INVESTMENT`, `CRYPTO`, `DEBT_PAYOFF`, `NET_WORTH`, `SPENDING_LIMIT`, `INCOME`, `CUSTOM`

**Categories**: `PERSONAL`, `FAMILY`, `EDUCATION`, `RETIREMENT`, `TRAVEL`, `HOME`, `VEHICLE`, `BUSINESS`, `HEALTH`, `OTHER`

**Priorities**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "name": "Save for Vacation",
    "description": "Trip to Hawaii",
    "type": "SAVINGS",
    "category": "TRAVEL",
    "priority": "HIGH",
    "targetAmount": 5000.00,
    "currentAmount": 0.00,
    "progress": 0,
    "targetDate": "2025-12-31",
    "createdAt": "2025-11-20T10:30:00Z"
  },
  "message": "Goal created successfully"
}
```

---

#### Get Goals

**Endpoint**: `GET /`

**Description**: Get all user goals

**Authentication**: Required

**Query Parameters**:
```
page=1 (integer, optional)
limit=20 (integer, optional)
type=SAVINGS (string, optional)
category=TRAVEL (string, optional)
status=ACTIVE (optional: ACTIVE|ACHIEVED|ABANDONED)
sortBy=targetDate (optional: targetDate|progress|createdAt)
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "goal_123",
        "name": "Save for Vacation",
        "type": "SAVINGS",
        "category": "TRAVEL",
        "targetAmount": 5000.00,
        "currentAmount": 2500.00,
        "progress": 50,
        "targetDate": "2025-12-31",
        "priority": "HIGH",
        "status": "ON_TRACK"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

---

#### Get Goal Details

**Endpoint**: `GET /:id`

**Description**: Get detailed goal information

**Authentication**: Required

**Path Parameters**:
```
id: string (required) - Goal ID
```

**Query Parameters**:
```
includeSnapshots=false (boolean, optional)
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "name": "Save for Vacation",
    "description": "Trip to Hawaii",
    "type": "SAVINGS",
    "category": "TRAVEL",
    "priority": "HIGH",
    "targetAmount": 5000.00,
    "currentAmount": 2500.00,
    "progress": 50,
    "targetDate": "2025-12-31",
    "daysRemaining": 41,
    "dailyRequiredAmount": 60.98,
    "sourceType": "BANK_ACCOUNT",
    "accountId": "bank_acc_1",
    "status": "ON_TRACK",
    "createdAt": "2025-11-20T10:30:00Z",
    "milestones": [
      {
        "id": "ms_1",
        "amount": 2500.00,
        "date": "2025-11-30",
        "description": "Halfway there",
        "completed": false
      }
    ],
    "contributions": [
      {
        "amount": 1000.00,
        "date": "2025-11-10",
        "source": "bank_acc_1"
      }
    ]
  }
}
```

---

#### Update Goal

**Endpoint**: `PUT /:id`

**Description**: Update goal details

**Authentication**: Required

**Path Parameters**:
```
id: string (required) - Goal ID
```

**Request Body** (all optional):
```json
{
  "name": "Updated Name",
  "targetAmount": 6000.00,
  "targetDate": "2026-01-31"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "name": "Updated Name",
    "targetAmount": 6000.00,
    "targetDate": "2026-01-31",
    "updatedAt": "2025-11-20T10:30:00Z"
  },
  "message": "Goal updated successfully"
}
```

---

#### Add Manual Contribution

**Endpoint**: `POST /:id/contribute`

**Description**: Add manual contribution to goal

**Authentication**: Required

**Path Parameters**:
```
id: string (required) - Goal ID
```

**Request Body**:
```json
{
  "amount": 500.00,
  "date": "2025-11-20",
  "note": "Monthly savings deposit"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "goal_123",
    "currentAmount": 3000.00,
    "progress": 60,
    "contribution": {
      "amount": 500.00,
      "date": "2025-11-20",
      "note": "Monthly savings deposit"
    }
  },
  "message": "Contribution added successfully"
}
```

---

#### Get Goal Analytics

**Endpoint**: `GET /analytics`

**Description**: Get goals analytics and progress

**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalGoals": 3,
    "onTrack": 2,
    "atRisk": 1,
    "achieved": 0,
    "totalTargetAmount": 15000.00,
    "totalCurrentAmount": 8500.00,
    "overallProgress": 56.7,
    "averageDaysToAchieve": 45,
    "goalsByCategory": {
      "TRAVEL": {
        "count": 1,
        "totalTarget": 5000.00,
        "totalCurrent": 2500.00
      }
    }
  }
}
```

---
