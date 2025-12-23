import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  PlanType,
  SubscriptionPlan,
  CurrentSubscription,
  CreateSubscriptionData,
  UpgradeSubscriptionData,
  DowngradeSubscriptionData,
  CancelSubscriptionData,
  PaymentHistory,
  UsageStats,
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
   * Downgrade current subscription
   */
  async downgradeSubscription(data: DowngradeSubscriptionData): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.post<CurrentSubscription>('/subscriptions/downgrade', data);
  }

  /**
   * Cancel current subscription
   */
  async cancelSubscription(data: CancelSubscriptionData): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.post<CurrentSubscription>('/subscriptions/cancel', data);
  }

  /**
   * Reactivate cancelled subscription
   */
  async reactivateSubscription(): Promise<ApiResponse<CurrentSubscription>> {
    return apiClient.post<CurrentSubscription>('/subscriptions/reactivate', {});
  }

  /**
   * Get payment/subscription history (invoices)
   */
  async getPaymentHistory(): Promise<ApiResponse<PaymentHistory[]>> {
    return apiClient.get<PaymentHistory[]>('/subscriptions/history');
  }

  /**
   * Retry failed payment
   */
  async retryPayment(paymentId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/subscriptions/payments/${paymentId}/retry`);
  }

  // Utility Methods

  /**
   * Calculate subscription cost with tax
   */
  calculateSubscriptionCost(
    plan: SubscriptionPlan,
    billingPeriod: 'MONTHLY' | 'YEARLY',
    taxRate = 0
  ): number {
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
    if (monthlyTotal === 0) return 0;
    return ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
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

  /**
   * Check if plan A can upgrade to plan B
   */
  canUpgradeTo(fromPlan: PlanType, toPlan: PlanType): boolean {
    const hierarchy: Record<PlanType, number> = {
      FREE: 0,
      PRO: 1,
      ULTIMATE: 2,
    };
    return hierarchy[toPlan] > hierarchy[fromPlan];
  }

  /**
   * Check if plan A can downgrade to plan B
   */
  canDowngradeTo(fromPlan: PlanType, toPlan: PlanType): boolean {
    const hierarchy: Record<PlanType, number> = {
      FREE: 0,
      PRO: 1,
      ULTIMATE: 2,
    };
    return hierarchy[toPlan] < hierarchy[fromPlan];
  }
}

export const subscriptionService = new SubscriptionService();