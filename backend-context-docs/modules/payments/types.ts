// Payments Module Type Definitions

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account'
}

export interface PaymentMethod {
  id: string;
  userId: string;
  stripeMethodId: string;
  type: PaymentMethodType;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  stripePaymentId: string;
  paymentMethodId: string;
  receiptUrl?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  paymentId: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  createdAt: Date;
}

export interface ProcessPaymentDTO {
  amount: number;
  currency?: string;
  paymentMethodId: string;
  description?: string;
  idempotencyKey?: string;
}

export interface AddPaymentMethodDTO {
  stripeToken: string;
  setAsDefault?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export class PaymentServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'PaymentServiceError';
  }
}
