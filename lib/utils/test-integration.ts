/**
 * Integration test utilities for API services
 * This file contains utilities to test the integration with backend APIs
 */

import { userService } from '@/lib/services/user-service';
import { subscriptionService } from '@/lib/services/subscription-service';

/**
 * Test user service integration
 * This would typically be run in a test environment with mock data
 */
export async function testUserServiceIntegration() {
  console.log('Testing User Service Integration...');
  
  try {
    // Test getting user profile
    const profileResponse = await userService.getProfile();
    console.log('Profile Response:', profileResponse.success ? 'Success' : 'Error');
    
    // Test getting user stats
    const statsResponse = await userService.getStats();
    console.log('Stats Response:', statsResponse.success ? 'Success' : 'Error');
    
    return {
      profile: profileResponse.success,
      stats: statsResponse.success,
    };
  } catch (error) {
    console.error('User Service Integration Test Failed:', error);
    return {
      profile: false,
      stats: false,
    };
  }
}

/**
 * Test subscription service integration
 * This would typically be run in a test environment with mock data
 */
export async function testSubscriptionServiceIntegration() {
  console.log('Testing Subscription Service Integration...');
  
  try {
    // Test getting subscription plans
    const plansResponse = await subscriptionService.getPlans();
    console.log('Plans Response:', plansResponse.success ? 'Success' : 'Error');
    
    // Test getting current subscription
    const currentResponse = await subscriptionService.getCurrentSubscription();
    console.log('Current Subscription Response:', currentResponse.success ? 'Success' : 'Error');
    
    // Test getting usage stats
    const usageResponse = await subscriptionService.getUsageStats();
    console.log('Usage Stats Response:', usageResponse.success ? 'Success' : 'Error');
    
    return {
      plans: plansResponse.success,
      current: currentResponse.success,
      usage: usageResponse.success,
    };
  } catch (error) {
    console.error('Subscription Service Integration Test Failed:', error);
    return {
      plans: false,
      current: false,
      usage: false,
    };
  }
}

/**
 * Test all integrations
 */
export async function testAllIntegrations() {
  console.log('Running Integration Tests...');
  
  const userTests = await testUserServiceIntegration();
  const subscriptionTests = await testSubscriptionServiceIntegration();
  
  const results = {
    user: userTests,
    subscription: subscriptionTests,
    overall: {
      success: Object.values(userTests).every(Boolean) && 
               Object.values(subscriptionTests).every(Boolean),
    },
  };
  
  console.log('Integration Test Results:', results);
  return results;
}

/**
 * Validate API response structure
 */
export function validateApiResponse(response: unknown): boolean {
  if (typeof response !== 'object' || response === null) {
    return false;
  }
  
  const apiResponse = response as Record<string, unknown>;
  
  // Check if it has the required success property
  if (typeof apiResponse.success !== 'boolean') {
    return false;
  }
  
  // If success is true, should have data
  if (apiResponse.success && !apiResponse.data) {
    return false;
  }
  
  // If success is false, should have error
  if (!apiResponse.success && !apiResponse.error) {
    return false;
  }
  
  return true;
}

/**
 * Mock data generators for testing
 */
export const mockData = {
  userProfile: {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER' as const,
    currentPlan: 'FREE' as const,
    status: 'ACTIVE' as const,
    emailVerified: true,
    currency: 'USD',
    timezone: 'UTC',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  subscriptionPlan: {
    type: 'PRO' as const,
    name: 'Pro Plan',
    description: 'Professional features for power users',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    yearlyDiscount: 17,
    popular: true,
    trialDays: 14,
    features: {
      maxAccounts: 10,
      maxTransactions: 10000,
      maxCategories: 100,
      maxBudgets: 50,
      maxGoals: 25,
      aiInsights: true,
      advancedReports: true,
      prioritySupport: true,
      apiAccess: true,
      exportData: true,
      customCategories: true,
      bankSync: true,
      multiCurrency: true,
      collaborativeAccounts: false,
      investmentTracking: true,
      taxReporting: false,
      mobileApp: true,
    },
  },
  
  usageStats: {
    accounts: { current: 3, limit: 10, remaining: 7, percentage: 30 },
    transactions: { current: 1250, limit: 10000, remaining: 8750, percentage: 12.5 },
    categories: { current: 15, limit: 100, remaining: 85, percentage: 15 },
    budgets: { current: 5, limit: 50, remaining: 45, percentage: 10 },
    goals: { current: 3, limit: 25, remaining: 22, percentage: 12 },
  },
};

/**
 * Error scenarios for testing
 */
export const mockErrors = {
  networkError: {
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
    },
  },
  
  unauthorized: {
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    },
  },
  
  forbidden: {
    success: false,
    error: {
      code: 'FORBIDDEN',
      message: 'Insufficient permissions',
    },
  },
  
  rateLimited: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please try again later.',
    },
  },
  
  validationError: {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: [
        {
          path: ['email'],
          message: 'Invalid email format',
        },
      ],
    },
  },
};