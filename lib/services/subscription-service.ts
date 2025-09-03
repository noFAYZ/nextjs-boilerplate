import { apiClient } from '@/lib/api-client';
import type { 
  ApiResponse, 
  SubscriptionPlan,
  CurrentSubscription,
  CreateSubscriptionData,
  UpgradeSubscriptionData,
  CancelSubscriptionData,
  SubscriptionHistory,
  PaymentIntent,
  CreatePaymentIntentData,
  ProcessPaymentData,
  PaymentHistory,
  UsageStats,
  TrackUsageData,
  FeatureLimitCheck
} from '@/lib/types';

export class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans');
  }

  /**
   * Get plan comparison data
   */
  async getPlanComparison(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans/comparison');
  }

  /**
   * Get current user subscription
   */
  async getCurrentSubscription(): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.get<CurrentSubscription>('/subscriptions/current');
  }

  /**
   * Create new subscription
   */
  async createSubscription(data: CreateSubscriptionData): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.post<CurrentSubscription>('/subscriptions', data);
  }

  /**
   * Upgrade current subscription
   */
  async upgradeSubscription(data: UpgradeSubscriptionData): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.post<CurrentSubscription>('/subscriptions/upgrade', data);
  }

  /**
   * Cancel current subscription
   */
  async cancelSubscription(data: CancelSubscriptionData): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.post<CurrentSubscription>('/subscriptions/cancel', data);
  }

  /**
   * Get subscription history
   */
  async getSubscriptionHistory(): Promise<ApiResponse<SubscriptionHistory[]>> {
    return apiClient.get<SubscriptionHistory[]>('/subscriptions/history');
  }

  // Payment Methods
  /**
   * Create payment intent for subscription
   */
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<ApiResponse<PaymentIntent>> {
    return apiClient.post<PaymentIntent>('/payments/intent', data);
  }

  /**
   * Process payment
   */
  async processPayment(data: ProcessPaymentData): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/payments/process', data);
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<ApiResponse<PaymentHistory[]>> {
    return apiClient.get<PaymentHistory[]>('/payments/history');
  }

  /**
   * Retry failed payment
   */
  async retryPayment(paymentId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/payments/${paymentId}/retry`);
  }

  // Usage Tracking
  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<ApiResponse<UsageStats>> {
    return apiClient.get<UsageStats>('/usage/stats');
  }

  /**
   * Check feature limit
   */
  async checkFeatureLimit(feature: string): Promise<ApiResponse<FeatureLimitCheck>> {
    return apiClient.get<FeatureLimitCheck>(`/usage/check/${feature}`);
  }

  /**
   * Track usage manually
   */
  async trackUsage(data: TrackUsageData): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/usage/track', data);
  }

  // Utility Methods
  /**
   * Calculate subscription cost with tax
   */
  calculateSubscriptionCost(plan: SubscriptionPlan, billingPeriod: 'MONTHLY' | 'YEARLY', taxRate = 0): number {
    const basePrice = billingPeriod === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
    const tax = basePrice * taxRate;
    return basePrice + tax;
  }

  /**
   * Calculate yearly savings
   */
  calculateYearlySavings(plan: SubscriptionPlan): number {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyPrice = plan.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  }

  /**
   * Get savings percentage for yearly billing
   */
  getYearlySavingsPercentage(plan: SubscriptionPlan): number {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyPrice = plan.yearlyPrice;
    return ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
  }

  /**
   * Check if user can access feature
   */
  async canAccessFeature(feature: string): Promise<boolean> {
    try {
      const response = await this.checkFeatureLimit(feature);
      return response.success && response.data.allowed;
    } catch {
      return false;
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

export const subscriptionService = new SubscriptionService();