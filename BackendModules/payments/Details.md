# Payments Module - Details

**Path**: `src/modules/payments/`

## Overview

Payment processing, transaction management, and payment method management. Integrates with Stripe for secure payment processing.

**Status**: ✅ Production Ready
**Maturity**: High

---

## Features

### 1. Payment Processing
- Stripe integration for payment processing
- One-time and recurring payments
- Multiple payment methods (card, bank transfer)
- Idempotent payment requests
- Payment confirmation and receipts

### 2. Payment Methods
- Save payment methods for future use
- Default payment method selection
- Secure tokenization via Stripe
- Method validation and verification

### 3. Payment History
- Transaction history tracking
- Payment status tracking (pending, completed, failed)
- Refund processing
- Invoice generation

---

## Key Methods

```
processPayment(userId, amount, paymentMethodId)
  → Process one-time payment

createPaymentMethod(userId, token)
  → Save payment method

getPaymentMethods(userId)
  → Get saved payment methods

getPaymentHistory(userId)
  → Get transaction history

refundPayment(paymentId, amount)
  → Process refund
```

---

## Database Models

- **PaymentMethod**: id, userId, stripeMethodId, type, last4, expiryMonth/Year
- **Payment**: id, userId, amount, status, stripePaymentId, createdAt
- **Invoice**: id, paymentId, amount, status, createdAt

---

## API Endpoints (6+)

- POST `/payment-methods` - Add payment method
- GET `/payment-methods` - List methods
- DELETE `/payment-methods/{id}` - Delete method
- POST `/payments` - Process payment
- GET `/payments` - Payment history
- GET `/payments/{id}` - Payment details
- POST `/payments/{id}/refund` - Refund payment
