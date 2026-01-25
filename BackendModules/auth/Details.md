# Auth Module - Details

**Path**: `src/modules/auth/`

## Overview

Modern authentication system with JWT tokens, Better Auth integration, email verification, 2FA support, and role-based access control. Secure session management with Redis backend and comprehensive audit logging.

**Status**: ✅ Production Ready
**Maturity**: High (Core security features complete)

---

## Features

### 1. JWT-Based Authentication
- **Access Tokens**: Short-lived tokens (15 minutes) for API requests
- **Refresh Tokens**: Long-lived tokens (7 days) for token renewal
- **Token Signing**: HS256 algorithm with secure secrets
- **Automatic Refresh**: Silent token refresh on expiry
- **Token Revocation**: Immediate token invalidation on logout
- **CORS Support**: Cross-origin request handling

### 2. Better Auth Integration
- **Multiple Providers**: Email/password, OAuth (Google, GitHub, etc.)
- **Account Linking**: Connect multiple authentication methods
- **Session Management**: Persistent sessions with Redis backend
- **Security**: CSRF protection, secure cookies
- **Email Verification**: Required verification before account activation
- **Account Recovery**: Password reset via email

### 3. User Roles & Permissions
- **Roles**: USER, PREMIUM, ADMIN
- **Plan-Based Access**: Different features per subscription tier
- **Permission Hierarchy**: Fine-grained access control
- **Role Enforcement**: Middleware-based permission checking
- **Audit Logging**: Track permission changes and access

### 4. Two-Factor Authentication (2FA)
- **TOTP Support**: Time-based one-time passwords
- **Backup Codes**: Recovery codes for account access
- **Optional/Required**: Can be optional or enforced per plan
- **Device Tracking**: Trusted device management
- **Recovery Options**: Email, TOTP, backup codes

### 5. Session Management
- **Redis Backend**: Distributed session storage
- **Session Timeout**: Configurable inactivity timeout
- **Multi-Device**: Support for multiple concurrent sessions
- **Device Tracking**: Show active sessions and devices
- **Session Revocation**: Force logout from any device

### 6. Email Verification
- **Verification Tokens**: Time-limited tokens sent to email
- **Resend Support**: Resend verification email
- **Verification Tracking**: Track verification status
- **Expiry Management**: Tokens expire after 24 hours
- **Welcome Email**: Automated welcome email on signup

### 7. Password Security
- **Bcrypt Hashing**: Secure password hashing with salt
- **Password Reset**: Secure reset via email token
- **Password History**: Track password changes
- **Password Requirements**: Enforce complexity rules
- **Reset Link Expiry**: 1-hour expiry on reset links

---

## How It Works

### Registration Flow
```
User submits: email, password, name
    ↓
Validate email format and password strength
    ├─ Email: valid email format
    ├─ Password: min 8 chars, uppercase, lowercase, number
    └─ If invalid: Return 400 error
    ↓
Check if email already exists
    ├─ If exists: Return 409 conflict
    └─ If new: Continue
    ↓
Hash password using bcrypt (10 rounds)
    ↓
Create user record in database
    ├─ Set role = USER (default)
    ├─ Set status = UNVERIFIED
    └─ Set createdAt = now
    ↓
Generate verification token
    ├─ Token expires in 24 hours
    ├─ Store hash in database
    └─ Send to user email
    ↓
Return success: "Check your email to verify"
    ↓
User receives email with verification link
    ↓
User clicks link → verification token exchanged
    ↓
Update user status = VERIFIED
    ↓
User can now login
```

### Login Flow
```
User submits: email, password
    ↓
Query user by email
    ├─ If not found: Return 401 (invalid credentials)
    └─ If found: Continue
    ↓
Verify password against stored hash
    ├─ If mismatch: Return 401 (invalid credentials)
    └─ If match: Continue
    ↓
Check user status
    ├─ If UNVERIFIED: Return 403 (email not verified)
    ├─ If SUSPENDED: Return 403 (account suspended)
    └─ If VERIFIED: Continue
    ↓
Generate JWT tokens
    ├─ Access Token (15 min): user.id, role, plan
    ├─ Refresh Token (7 days): user.id, version
    └─ Session ID: UUID
    ↓
Store session in Redis
    ├─ Key: session:{sessionId}
    ├─ Value: {userId, tokens, createdAt, expiresAt}
    └─ TTL: 7 days
    ↓
Return tokens to client
    ├─ accessToken (in Authorization header)
    ├─ refreshToken (in secure HttpOnly cookie)
    └─ User profile data
    ↓
Update lastLoginAt timestamp
    ↓
Log login event for audit
```

### Token Refresh Flow
```
Client sends: Refresh Token
    ↓
Validate refresh token signature
    ├─ If invalid: Return 401 (token expired)
    └─ If valid: Continue
    ↓
Query session from Redis
    ├─ If not found: Token revoked, return 401
    ├─ If expired: Return 401
    └─ If valid: Continue
    ↓
Verify token hasn't been revoked
    ├─ Check revocation list
    └─ Check session version match
    ↓
Generate new access token
    ├─ Use same refresh token
    ├─ Update session lastActivityAt
    └─ TTL: 15 minutes
    ↓
Return new access token
```

### 2FA Setup Flow
```
User requests: Enable 2FA
    ↓
Generate TOTP secret
    ├─ Use crypto.randomBytes for entropy
    ├─ Encode with Base32
    └─ QR code for authenticator apps
    ↓
Return secret and QR code to client
    ↓
User scans QR code in authenticator app
    ↓
User provides first TOTP code
    ↓
Verify TOTP code
    ├─ Check code matches secret
    ├─ Verify within ±1 time window
    └─ If invalid: Return error, request retry
    ↓
Generate backup codes
    ├─ 10 codes, 8 characters each
    ├─ Encrypt before storing
    └─ One-time use only
    ↓
Enable 2FA on user account
    ├─ Store TOTP secret (encrypted)
    ├─ Store backup codes (encrypted)
    ├─ Set 2faEnabled = true
    └─ Send confirmation email
    ↓
User must save backup codes securely
```

### 2FA Login Flow
```
User submits: email, password
    ↓
Verify email/password (see login flow above)
    ↓
Check user 2faEnabled flag
    ├─ If false: Generate tokens normally
    └─ If true: Continue
    ↓
Generate temporary session with mfaPending = true
    ├─ TTL: 5 minutes
    └─ Requires MFA verification
    ↓
Return: "MFA required"
    ↓
Client prompts: "Enter 6-digit code"
    ↓
User enters TOTP or backup code
    ↓
Verify code
    ├─ If TOTP: Check against secret
    ├─ If backup code: Check in list, mark as used
    └─ If invalid: Return error
    ↓
Complete session
    ├─ Clear mfaPending flag
    ├─ Generate final tokens
    └─ Store session in Redis
    ↓
Return tokens and user data
```

---

## Architecture Components

### Controllers (2 files)
- `authController.ts` - Authentication endpoints (10+ endpoints)
- `sessionController.ts` - Session management

### Services (3 files)
- `authService.ts` - Core authentication logic
- `betterAuthService.ts` - Better Auth integration
- `emailService.ts` - Email notifications

### Middleware (4+ files)
- `authMiddleware.ts` - JWT validation
- `roleMiddleware.ts` - Role-based access control
- `rateLimitMiddleware.ts` - Brute force protection
- `auditMiddleware.ts` - Request logging

### External Integrations
- **Better Auth**: Multi-provider authentication
- **Email Service**: Email verification and password reset
- **Redis**: Session storage
- **JWT Library**: Token generation and validation

---

## Key Methods

### AuthService
```
register(email, password, name)
  → Create user account, send verification email

login(email, password)
  → Authenticate user, generate tokens

loginWithProvider(provider, providerData)
  → OAuth provider login

logout(userId, sessionId)
  → Revoke session and tokens

refreshToken(refreshToken)
  → Generate new access token

verifyEmail(email, token)
  → Verify email address

forgotPassword(email)
  → Send password reset email

resetPassword(email, token, newPassword)
  → Reset password with token

changePassword(userId, oldPassword, newPassword)
  → Change password (authenticated)

setupTwoFactor(userId)
  → Generate TOTP secret and backup codes

verifyTwoFactor(userId, code)
  → Verify TOTP code

disableTwoFactor(userId)
  → Disable 2FA

getSessions(userId)
  → Get all active sessions

revokeSession(userId, sessionId)
  → Revoke single session

revokeAllSessions(userId)
  → Revoke all sessions (force logout)
```

---

## Database Models

### User
- `id`, `email`, `password_hash`, `name`
- `role` (USER/PREMIUM/ADMIN), `status` (VERIFIED/UNVERIFIED/SUSPENDED)
- `email_verified`, `email_verified_at`
- `two_factor_enabled`, `two_factor_secret` (encrypted)
- `backup_codes` (encrypted), `last_login_at`
- `created_at`, `updated_at`

### Session
- `id`, `userId`, `sessionToken`
- `ipAddress`, `userAgent`, `deviceName`
- `lastActivityAt`, `expiresAt`
- `createdAt`

### VerificationToken
- `id`, `userId`, `token_hash`, `type` (email/password_reset)
- `expiresAt`, `usedAt`
- `createdAt`

### LoginAttempt
- `id`, `email`, `ipAddress`
- `success`, `reason` (if failed)
- `createdAt`

---

## Performance Optimizations

### Caching
- User data: 5 minute TTL (Redis)
- Session data: TTL per session
- Role permissions: 1 hour TTL

### Database Indexing
- `users(email)` - UNIQUE
- `sessions(userId, expiresAt DESC)`
- `verification_tokens(token_hash, type)`
- `login_attempts(email, createdAt DESC)`

### Rate Limiting
- Login attempts: 5 per 15 minutes (per IP + email)
- Registration: 3 per hour (per IP)
- Password reset: 3 per day (per email)
- Email verification: 3 per day (per email)

---

## Error Handling

| Error | Code | Status | Reason |
|-------|------|--------|--------|
| Invalid credentials | INVALID_CREDENTIALS | 401 | Email or password wrong |
| Email not verified | EMAIL_NOT_VERIFIED | 403 | Email verification required |
| Account suspended | ACCOUNT_SUSPENDED | 403 | Account locked/suspended |
| Token expired | TOKEN_EXPIRED | 401 | JWT token expired |
| Invalid token | INVALID_TOKEN | 401 | JWT token invalid |
| Email exists | EMAIL_EXISTS | 409 | Email already registered |
| Weak password | WEAK_PASSWORD | 400 | Password doesn't meet requirements |
| MFA required | MFA_REQUIRED | 403 | 2FA verification needed |
| MFA invalid | MFA_INVALID | 401 | 2FA code incorrect |
| Session not found | SESSION_NOT_FOUND | 404 | Session doesn't exist |
| Rate limited | RATE_LIMITED | 429 | Too many attempts |

---

## Security Features

### Password Security
- Bcrypt with 10 salt rounds
- No plain-text storage
- Password history tracking
- Minimum 8 characters, complexity requirements
- Secure reset links (1-hour expiry)

### Token Security
- HS256 signing algorithm
- Short-lived access tokens (15 min)
- Refresh token rotation on use
- Token revocation on logout
- Secure HttpOnly cookies for refresh tokens

### Session Security
- Redis session storage
- Session timeout on inactivity
- Multi-device support with tracking
- Device fingerprinting
- Secure session IDs (UUID v4)

### Rate Limiting
- Brute force protection (5 login attempts/15 min)
- Registration throttling (3 per hour)
- Password reset throttling (3 per day)
- Email verification throttling (3 per day)
- IP-based and email-based limiting

### Audit Logging
- All login attempts logged
- Password changes tracked
- 2FA modifications logged
- Session creation/revocation logged
- Failed authentication attempts tracked

---

## Common Use Cases

### UC1: User Registration
```
User visits signup page
    ↓
Enters email, password, name
    ↓
Backend validates and creates account
    ↓
Verification email sent
    ↓
User clicks link in email
    ↓
Account verified, ready to login
```

### UC2: Login with 2FA
```
User logs in with email/password
    ↓
Server requires 2FA code
    ↓
User opens authenticator app
    ↓
Enters 6-digit code
    ↓
Server verifies code
    ↓
User authenticated, tokens issued
```

### UC3: Forgotten Password
```
User clicks "Forgot Password"
    ↓
Enters email address
    ↓
Server sends reset link
    ↓
User receives email
    ↓
User clicks link
    ↓
Enters new password
    ↓
Password reset complete
```

---

## Limits by Plan

| Feature | FREE | PRO | ULTIMATE |
|---------|------|-----|----------|
| Sessions | 1 | 5 | Unlimited |
| 2FA | Optional | Optional | Required |
| Devices | 1 | 3 | Unlimited |
| Token lifetime | 15 min | 15 min | 24 hours |
| Session timeout | 1 hour | 2 hours | Never |

---

## Future Enhancements

- **Passwordless Auth**: Magic links and authentication codes
- **WebAuthn**: Biometric and security key support
- **Social OAuth**: More provider integrations
- **SAML SSO**: Enterprise single sign-on
- **Audit Trail**: Detailed activity logging
- **Account Linking**: Link multiple auth methods
- **Risk-Based Auth**: Adaptive authentication
- **Device Trust**: Automatic trusted device setup
