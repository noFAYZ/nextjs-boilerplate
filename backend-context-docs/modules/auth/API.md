# Auth Module - API Reference

**Base Path**: `/api/v1/auth`

---

## Endpoints Overview

| Method | Endpoint | Purpose | Auth | Rate Limit |
|--------|----------|---------|------|-----------|
| POST | `/register` | User registration | ❌ | 3/hour |
| POST | `/login` | User authentication | ❌ | 5/15min |
| POST | `/logout` | Session termination | ✅ | 10/min |
| POST | `/refresh` | Token refresh | ❌ | 20/min |
| GET | `/me` | Current user profile | ✅ | 100/15min |
| POST | `/verify-email` | Email verification | ❌ | 3/day |
| POST | `/resend-verification` | Resend verification email | ❌ | 3/day |
| POST | `/forgot-password` | Password reset request | ❌ | 3/day |
| POST | `/reset-password` | Reset password | ❌ | 3/day |
| POST | `/change-password` | Change password (auth) | ✅ | 5/min |
| POST | `/setup-2fa` | Setup 2FA | ✅ | 5/min |
| POST | `/verify-2fa` | Verify 2FA code | ❌ | 10/min |
| POST | `/disable-2fa` | Disable 2FA | ✅ | 5/min |
| GET | `/sessions` | List active sessions | ✅ | 50/15min |
| DELETE | `/sessions/{id}` | Revoke session | ✅ | 10/min |
| POST | `/sessions/revoke-all` | Revoke all sessions | ✅ | 5/min |

---

## Detailed Endpoints

### 1. Register
Create new user account.

**Endpoint**: `POST /register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "acceptTerms": true
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "message": "Registration successful. Please verify your email.",
    "verificationEmailSent": true
  },
  "timestamp": "2025-01-18T12:00:00Z"
}
```

**Error** (409):
```json
{
  "success": false,
  "error": "Email already registered",
  "code": "EMAIL_EXISTS",
  "timestamp": "2025-01-18T12:00:00Z"
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Password must be at least 8 characters with uppercase, lowercase, and number",
  "code": "WEAK_PASSWORD",
  "timestamp": "2025-01-18T12:00:00Z"
}
```

---

### 2. Login
Authenticate user with email and password.

**Endpoint**: `POST /login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "plan": "FREE",
      "emailVerified": true,
      "twoFactorEnabled": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh_token_abc123...",
      "expiresIn": 900
    },
    "session": {
      "id": "session_xyz789",
      "createdAt": "2025-01-18T12:05:00Z"
    }
  },
  "timestamp": "2025-01-18T12:05:00Z"
}
```

**Error** (401):
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS",
  "timestamp": "2025-01-18T12:05:00Z"
}
```

**Error** (403):
```json
{
  "success": false,
  "error": "Please verify your email before logging in",
  "code": "EMAIL_NOT_VERIFIED",
  "timestamp": "2025-01-18T12:05:00Z"
}
```

**Error** (403):
```json
{
  "success": false,
  "error": "2FA verification required",
  "code": "MFA_REQUIRED",
  "mfaPending": true,
  "timestamp": "2025-01-18T12:05:00Z"
}
```

---

### 3. Logout
Terminate user session.

**Endpoint**: `POST /logout`

**Request**:
```json
{
  "sessionId": "session_xyz789"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "timestamp": "2025-01-18T12:10:00Z"
}
```

---

### 4. Refresh Token
Generate new access token.

**Endpoint**: `POST /refresh`

**Request**:
```json
{
  "refreshToken": "refresh_token_abc123..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  },
  "timestamp": "2025-01-18T12:15:00Z"
}
```

**Error** (401):
```json
{
  "success": false,
  "error": "Refresh token expired or invalid",
  "code": "TOKEN_EXPIRED",
  "timestamp": "2025-01-18T12:15:00Z"
}
```

---

### 5. Get Current User
Get authenticated user profile.

**Endpoint**: `GET /me`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "plan": "FREE",
    "emailVerified": true,
    "twoFactorEnabled": false,
    "createdAt": "2025-01-10T08:00:00Z",
    "lastLoginAt": "2025-01-18T12:05:00Z",
    "profilePicture": "https://...",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  },
  "timestamp": "2025-01-18T12:20:00Z"
}
```

---

### 6. Verify Email
Verify email with token from email.

**Endpoint**: `POST /verify-email`

**Request**:
```json
{
  "email": "user@example.com",
  "token": "verify_token_xyz789..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "verified": true,
    "verifiedAt": "2025-01-18T12:25:00Z"
  },
  "timestamp": "2025-01-18T12:25:00Z"
}
```

**Error** (400):
```json
{
  "success": false,
  "error": "Verification token is invalid or expired",
  "code": "INVALID_TOKEN",
  "timestamp": "2025-01-18T12:25:00Z"
}
```

---

### 7. Resend Verification Email
Send new verification email.

**Endpoint**: `POST /resend-verification`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Verification email sent",
    "emailSent": true,
    "resendAfter": 300
  },
  "timestamp": "2025-01-18T12:30:00Z"
}
```

---

### 8. Forgot Password
Request password reset email.

**Endpoint**: `POST /forgot-password`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent",
    "emailSent": true,
    "expiresIn": 3600
  },
  "timestamp": "2025-01-18T12:35:00Z"
}
```

---

### 9. Reset Password
Reset password with token.

**Endpoint**: `POST /reset-password`

**Request**:
```json
{
  "email": "user@example.com",
  "token": "reset_token_abc123...",
  "newPassword": "NewSecurePass456!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully",
    "resetAt": "2025-01-18T12:40:00Z"
  },
  "timestamp": "2025-01-18T12:40:00Z"
}
```

---

### 10. Change Password
Change password (authenticated user).

**Endpoint**: `POST /change-password`

**Request**:
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully",
    "changedAt": "2025-01-18T12:45:00Z"
  },
  "timestamp": "2025-01-18T12:45:00Z"
}
```

---

### 11. Setup 2FA
Enable two-factor authentication.

**Endpoint**: `POST /setup-2fa`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEBLW64TMMQ======",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "backupCodes": [
      "ABC123DEF",
      "GHI456JKL",
      "MNO789PQR",
      "STU012VWX",
      "YZA345BCD",
      "EFG678HIJ",
      "KLM901NOP",
      "QRS234TUV",
      "WXY567ZAB",
      "CDE890FGH"
    ],
    "message": "Scan QR code with authenticator app and enter code to confirm"
  },
  "timestamp": "2025-01-18T12:50:00Z"
}
```

---

### 12. Verify 2FA
Verify TOTP code to complete 2FA setup.

**Endpoint**: `POST /verify-2fa`

**Request**:
```json
{
  "code": "123456",
  "tempToken": "temp_token_xyz789..." // From setup endpoint
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "2FA enabled successfully",
    "twoFactorEnabled": true,
    "enabledAt": "2025-01-18T12:55:00Z"
  },
  "timestamp": "2025-01-18T12:55:00Z"
}
```

---

### 13. Disable 2FA
Disable two-factor authentication.

**Endpoint**: `POST /disable-2fa`

**Request**:
```json
{
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "2FA disabled successfully",
    "twoFactorEnabled": false,
    "disabledAt": "2025-01-18T13:00:00Z"
  },
  "timestamp": "2025-01-18T13:00:00Z"
}
```

---

### 14. List Sessions
Get all active sessions.

**Endpoint**: `GET /sessions`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_xyz789",
        "deviceName": "Chrome on Windows",
        "ipAddress": "192.168.1.100",
        "lastActivityAt": "2025-01-18T13:05:00Z",
        "createdAt": "2025-01-18T12:05:00Z",
        "expiresAt": "2025-01-25T12:05:00Z",
        "isCurrent": true
      },
      {
        "id": "session_abc123",
        "deviceName": "Safari on iPhone",
        "ipAddress": "203.0.113.50",
        "lastActivityAt": "2025-01-17T15:30:00Z",
        "createdAt": "2025-01-15T10:20:00Z",
        "expiresAt": "2025-01-22T10:20:00Z",
        "isCurrent": false
      }
    ],
    "count": 2
  },
  "timestamp": "2025-01-18T13:10:00Z"
}
```

---

### 15. Revoke Session
Revoke specific session.

**Endpoint**: `DELETE /sessions/{id}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Session revoked successfully",
    "revokedAt": "2025-01-18T13:15:00Z"
  },
  "timestamp": "2025-01-18T13:15:00Z"
}
```

---

### 16. Revoke All Sessions
Logout from all devices.

**Endpoint**: `POST /sessions/revoke-all`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "All sessions revoked successfully",
    "revokedCount": 2,
    "revokedAt": "2025-01-18T13:20:00Z"
  },
  "timestamp": "2025-01-18T13:20:00Z"
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| EMAIL_NOT_VERIFIED | 403 | Email verification required |
| ACCOUNT_SUSPENDED | 403 | Account locked |
| TOKEN_EXPIRED | 401 | JWT or refresh token expired |
| INVALID_TOKEN | 401 | JWT or refresh token invalid |
| EMAIL_EXISTS | 409 | Email already registered |
| WEAK_PASSWORD | 400 | Password doesn't meet requirements |
| MFA_REQUIRED | 403 | 2FA verification needed |
| MFA_INVALID | 401 | 2FA code incorrect |
| SESSION_NOT_FOUND | 404 | Session doesn't exist |
| RATE_LIMITED | 429 | Too many attempts |

---

## Rate Limits

- **Registration**: 3 requests/hour per IP
- **Login**: 5 requests/15min per IP + email
- **Logout**: 10 requests/min
- **Refresh**: 20 requests/min
- **Get Me**: 100 requests/15min
- **Verify Email**: 3 requests/day per email
- **Forgot Password**: 3 requests/day per email
- **Reset Password**: 3 requests/day per email
- **Change Password**: 5 requests/min
- **2FA Setup**: 5 requests/min
- **2FA Verify**: 10 requests/min (includes backup codes)
- **Sessions**: 50 requests/15min
- **Revoke Session**: 10 requests/min

---

## Authentication

All protected endpoints require:
- **Header**: `Authorization: Bearer {accessToken}`
- **Cookie**: Optional `refreshToken` (HttpOnly)

---

## Token Structure

**Access Token JWT**:
```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "role": "USER",
  "plan": "FREE",
  "iat": 1705590000,
  "exp": 1705590900
}
```

**Refresh Token JWT**:
```json
{
  "sub": "user_123",
  "type": "refresh",
  "version": 1,
  "iat": 1705590000,
  "exp": 1706195000
}
```
