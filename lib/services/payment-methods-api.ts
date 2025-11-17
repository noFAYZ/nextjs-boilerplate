/**
 * Payment Methods API Service
 *
 * PURPOSE: Centralized API client for payment method operations
 * - All payment method API calls go through this service
 * - Never called directly from components (use TanStack Query hooks)
 * - Provides type-safe API methods for payment method management
 */

import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/lib/types';
import type {
  PaymentMethod,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  PaymentMethodType,
} from '@/lib/types/subscription';

class PaymentMethodsApi {
  private readonly BASE_PATH = '/user-subscriptions/payment-methods';

  /**
   * Get all payment methods for the current user
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get<PaymentMethod[]>(this.BASE_PATH);
  }

  /**
   * Get a single payment method by ID
   */
  async getPaymentMethod(id: string): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.get<PaymentMethod>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Create a new payment method
   */
  async createPaymentMethod(
    data: CreatePaymentMethodRequest
  ): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post<PaymentMethod>(this.BASE_PATH, data);
  }

  /**
   * Update an existing payment method
   */
  async updatePaymentMethod(
    id: string,
    updates: UpdatePaymentMethodRequest
  ): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.put<PaymentMethod>(`${this.BASE_PATH}/${id}`, updates);
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Set a payment method as default
   */
  async setDefaultPaymentMethod(id: string): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post<PaymentMethod>(`${this.BASE_PATH}/${id}/set-default`);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get payment method type display name
   */
  getPaymentMethodTypeDisplayName(type: PaymentMethodType): string {
    const typeNames: Record<PaymentMethodType, string> = {
      CREDIT_CARD: 'Credit Card',
      DEBIT_CARD: 'Debit Card',
      BANK_ACCOUNT: 'Bank Account',
      PAYPAL: 'PayPal',
      VENMO: 'Venmo',
      CASH_APP: 'Cash App',
      APPLE_PAY: 'Apple Pay',
      GOOGLE_PAY: 'Google Pay',
      OTHER: 'Other',
    };

    return typeNames[type] || type;
  }

  /**
   * Get card brand icon/display name
   */
  getCardBrandDisplayName(brand?: string): string {
    if (!brand) return 'Card';

    const brandNames: Record<string, string> = {
      VISA: 'Visa',
      MASTERCARD: 'Mastercard',
      AMEX: 'American Express',
      DISCOVER: 'Discover',
      DINERS: 'Diners Club',
      JCB: 'JCB',
      UNIONPAY: 'UnionPay',
    };

    return brandNames[brand.toUpperCase()] || brand;
  }

  /**
   * Format payment method display string
   */
  formatPaymentMethodDisplay(paymentMethod: PaymentMethod): string {
    if (paymentMethod.nickname) {
      return paymentMethod.nickname;
    }

    switch (paymentMethod.type) {
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return `${this.getCardBrandDisplayName(paymentMethod.cardBrand)} ****${paymentMethod.cardLastFour}`;
      case 'BANK_ACCOUNT':
        return `${paymentMethod.bankName || 'Bank'} ****${paymentMethod.accountLastFour}`;
      case 'PAYPAL':
        return 'PayPal';
      case 'VENMO':
        return 'Venmo';
      case 'CASH_APP':
        return 'Cash App';
      case 'APPLE_PAY':
        return 'Apple Pay';
      case 'GOOGLE_PAY':
        return 'Google Pay';
      default:
        return 'Payment Method';
    }
  }

  /**
   * Check if card is expired
   */
  isCardExpired(expiryMonth?: number, expiryYear?: number): boolean {
    if (!expiryMonth || !expiryYear) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear) return true;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return true;

    return false;
  }

  /**
   * Check if card is expiring soon (within 3 months)
   */
  isCardExpiringSoon(expiryMonth?: number, expiryYear?: number): boolean {
    if (!expiryMonth || !expiryYear) return false;

    const now = new Date();
    const threeMonthsFromNow = new Date(now.setMonth(now.getMonth() + 3));
    const expiryDate = new Date(expiryYear, expiryMonth - 1);

    return expiryDate <= threeMonthsFromNow && !this.isCardExpired(expiryMonth, expiryYear);
  }
}

export const paymentMethodsApi = new PaymentMethodsApi();
