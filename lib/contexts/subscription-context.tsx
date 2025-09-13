'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuth } from '@/lib/contexts/AuthContext';
import type { 
  SubscriptionPlan,
  CurrentSubscription,
  CreateSubscriptionData,
  UpgradeSubscriptionData,
  CancelSubscriptionData,
  SubscriptionHistory,
  PaymentHistory,
  UsageStats,
  ApiResponse
} from '@/lib/types';

// State interface
interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentSubscription: CurrentSubscription | null;
  subscriptionHistory: SubscriptionHistory[];
  paymentHistory: PaymentHistory[];
  usageStats: UsageStats | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastFetched: Date | null;
}

// Action types
type SubscriptionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PLANS'; payload: SubscriptionPlan[] }
  | { type: 'SET_CURRENT_SUBSCRIPTION'; payload: CurrentSubscription | null }
  | { type: 'SET_SUBSCRIPTION_HISTORY'; payload: SubscriptionHistory[] }
  | { type: 'SET_PAYMENT_HISTORY'; payload: PaymentHistory[] }
  | { type: 'SET_USAGE_STATS'; payload: UsageStats | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LAST_FETCHED'; payload: Date }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: SubscriptionState = {
  plans: [],
  currentSubscription: null,
  subscriptionHistory: [],
  paymentHistory: [],
  usageStats: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  lastFetched: null,
};

// Reducer
function subscriptionReducer(state: SubscriptionState, action: SubscriptionAction): SubscriptionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PLANS':
      return { ...state, plans: action.payload };
    case 'SET_CURRENT_SUBSCRIPTION':
      return { ...state, currentSubscription: action.payload };
    case 'SET_SUBSCRIPTION_HISTORY':
      return { ...state, subscriptionHistory: action.payload };
    case 'SET_PAYMENT_HISTORY':
      return { ...state, paymentHistory: action.payload };
    case 'SET_USAGE_STATS':
      return { ...state, usageStats: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'SET_LAST_FETCHED':
      return { ...state, lastFetched: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Context interface
interface SubscriptionContextType {
  // State
  plans: SubscriptionPlan[];
  currentSubscription: CurrentSubscription | null;
  subscriptionHistory: SubscriptionHistory[];
  paymentHistory: PaymentHistory[];
  usageStats: UsageStats | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastFetched: Date | null;
  
  // Actions
  fetchSubscriptionData: (force?: boolean) => Promise<void>;
  createSubscription: (data: CreateSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  upgradeSubscription: (data: UpgradeSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  cancelSubscription: (data: CancelSubscriptionData) => Promise<ApiResponse<CurrentSubscription>>;
  canAccessFeature: (feature: string) => Promise<boolean>;
  resetState: () => void;
}

// Create context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Provider props
interface SubscriptionProviderProps {
  children: ReactNode;
}

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Provider component
export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const { user, loading: authLoading } = useAuth();

  // Check if data is stale
  const isDataStale = useCallback(() => {
    if (!state.lastFetched) return true;
    return Date.now() - state.lastFetched.getTime() > CACHE_DURATION;
  }, [state.lastFetched]);

  // Fetch all subscription data
  const fetchSubscriptionData = useCallback(async (force = false) => {
    // Don't fetch if user is not authenticated
    if (!user) {
      return;
    }

    // Don't refetch if data is fresh and not forced
    if (!force && state.isInitialized && !isDataStale()) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Fetch all data in parallel
      const [
        plansResponse,
        currentSubResponse,
        historyResponse,
        paymentResponse,
        usageResponse,
      ] = await Promise.allSettled([
        subscriptionService.getPlans(),
        subscriptionService.getCurrentSubscription(),
        subscriptionService.getSubscriptionHistory(),
        subscriptionService.getPaymentHistory(),
        subscriptionService.getUsageStats(),
      ]);

      // Handle plans
      if (plansResponse.status === 'fulfilled' && plansResponse.value.success) {
        dispatch({ type: 'SET_PLANS', payload: plansResponse.value.data });
      }

      // Handle current subscription
      if (currentSubResponse.status === 'fulfilled' && currentSubResponse.value.success) {
        dispatch({ type: 'SET_CURRENT_SUBSCRIPTION', payload: currentSubResponse.value.data });
      }

      // Handle subscription history
      if (historyResponse.status === 'fulfilled' && historyResponse.value.success) {
        dispatch({ type: 'SET_SUBSCRIPTION_HISTORY', payload: historyResponse.value.data });
      }

      // Handle payment history
      if (paymentResponse.status === 'fulfilled' && paymentResponse.value.success) {
        dispatch({ type: 'SET_PAYMENT_HISTORY', payload: paymentResponse.value.data });
      }

      // Handle usage stats
      if (usageResponse.status === 'fulfilled' && usageResponse.value.success) {
        dispatch({ type: 'SET_USAGE_STATS', payload: usageResponse.value.data });
      }

      // Check for critical errors (plans and current subscription are most important)
      const criticalErrors: string[] = [];
      
      // Helper function to check if error is due to unimplemented endpoint
      const isNotImplementedError = (response: any) => {
        return response.status === 'rejected' && 
               (response.reason?.code === 'NOT_IMPLEMENTED' || 
                response.reason?.message?.includes('API endpoint not found'));
      };
      
      if (plansResponse.status === 'rejected' || (plansResponse.status === 'fulfilled' && !plansResponse.value.success)) {
        if (!isNotImplementedError(plansResponse)) {
          criticalErrors.push('Failed to load subscription plans');
        }
      }
      
      if (currentSubResponse.status === 'rejected' || (currentSubResponse.status === 'fulfilled' && !currentSubResponse.value.success)) {
        if (!isNotImplementedError(currentSubResponse)) {
          criticalErrors.push('Failed to load current subscription');
        }
      }

      if (criticalErrors.length > 0) {
        dispatch({ type: 'SET_ERROR', payload: criticalErrors.join(', ') });
      } else if (isNotImplementedError(plansResponse) || isNotImplementedError(currentSubResponse)) {
        // Set a development-friendly message for unimplemented endpoints
        console.info('Subscription features not yet implemented on backend - using default state');
      }

      dispatch({ type: 'SET_LAST_FETCHED', payload: new Date() });
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch subscription data' });
      console.error('Error fetching subscription data:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.isInitialized, isDataStale, user]);

  // Create subscription
  const createSubscription = useCallback(async (data: CreateSubscriptionData): Promise<ApiResponse<CurrentSubscription>> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await subscriptionService.createSubscription(data);
      
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_SUBSCRIPTION', payload: response.data });
        // Refetch usage stats as they might have changed
        const usageResponse = await subscriptionService.getUsageStats();
        if (usageResponse.success) {
          dispatch({ type: 'SET_USAGE_STATS', payload: usageResponse.data });
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to create subscription';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error creating subscription:', err);
      
      return {
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  // Upgrade subscription
  const upgradeSubscription = useCallback(async (data: UpgradeSubscriptionData): Promise<ApiResponse<CurrentSubscription>> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await subscriptionService.upgradeSubscription(data);
      
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_SUBSCRIPTION', payload: response.data });
        // Refetch usage stats as limits might have changed
        const usageResponse = await subscriptionService.getUsageStats();
        if (usageResponse.success) {
          dispatch({ type: 'SET_USAGE_STATS', payload: usageResponse.data });
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to upgrade subscription';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error upgrading subscription:', err);
      
      return {
        success: false,
        error: {
          code: 'UPGRADE_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async (data: CancelSubscriptionData): Promise<ApiResponse<CurrentSubscription>> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await subscriptionService.cancelSubscription(data);
      
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_SUBSCRIPTION', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
      }
      
      return response;
    } catch (err) {
      const errorMessage = 'Failed to cancel subscription';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error canceling subscription:', err);
      
      return {
        success: false,
        error: {
          code: 'CANCEL_FAILED',
          message: errorMessage,
          details: err,
        },
      };
    }
  }, []);

  // Check feature access
  const canAccessFeature = useCallback(async (feature: string): Promise<boolean> => {
    try {
      return await subscriptionService.canAccessFeature(feature);
    } catch {
      return false;
    }
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // Initialize data on mount - only for authenticated users
  useEffect(() => {
    // Only fetch subscription data if user is authenticated and auth is not loading
    if (user && !authLoading && !state.isInitialized) {
      fetchSubscriptionData();
    }
  }, [user, authLoading, state.isInitialized, fetchSubscriptionData]);

  const contextValue: SubscriptionContextType = {
    // State
    plans: state.plans,
    currentSubscription: state.currentSubscription,
    subscriptionHistory: state.subscriptionHistory,
    paymentHistory: state.paymentHistory,
    usageStats: state.usageStats,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,
    lastFetched: state.lastFetched,
    
    // Actions
    fetchSubscriptionData,
    createSubscription,
    upgradeSubscription,
    cancelSubscription,
    canAccessFeature,
    resetState,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook to use subscription context
export function useSubscriptionContext(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}