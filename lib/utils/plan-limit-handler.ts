/**
 * Plan Limit Handler
 * Provides utilities for handling plan limit errors and showing upgrade dialogs
 */

import { handleError } from './error-handler';
import type { PlanLimitError } from '@/components/ui/plan-limit-dialog';

/**
 * Check if an error is a plan limit error
 */
export function isPlanLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const errorObj = error as Record<string, unknown>;

  // Check API response format (response.success = false)
  if (errorObj.success === false && errorObj.error) {
    const apiError = errorObj.error as Record<string, unknown>;
    return (
      (typeof apiError.code === 'string' && apiError.code.includes('LIMIT_EXCEEDED')) ||
      (apiError.details &&
       typeof apiError.details === 'object' &&
       (apiError.details as Record<string, unknown>).error &&
       typeof (apiError.details as Record<string, unknown>).error === 'object' &&
       typeof ((apiError.details as Record<string, unknown>).error as Record<string, unknown>).code === 'string' &&
       ((apiError.details as Record<string, unknown>).error as Record<string, unknown>).code.includes('LIMIT_EXCEEDED'))
    );
  }

  // Check thrown error format (from API client)
  return (
    (errorObj.details as Record<string, unknown>)?.error &&
    typeof (errorObj.details as Record<string, unknown>).error === 'object' &&
    typeof ((errorObj.details as Record<string, unknown>).error as Record<string, unknown>).code === 'string' &&
    ((errorObj.details as Record<string, unknown>).error as Record<string, unknown>).code.includes('LIMIT_EXCEEDED')
  ) ||
  (typeof errorObj.code === 'string' && errorObj.code.includes('LIMIT_EXCEEDED')) ||
  (errorObj.message === 'Insufficient permissions' && errorObj.code === 'FORBIDDEN');
}

/**
 * Extract plan limit error details from API error
 */
export function extractPlanLimitError(error: unknown): PlanLimitError | null {
  if (!isPlanLimitError(error)) return null;

  const errorObj = error as Record<string, unknown>;
  let errorDetails: Record<string, unknown> | undefined;

  // Handle API response format (response.success = false)
  if (errorObj.success === false && errorObj.error) {
    const apiError = errorObj.error as Record<string, unknown>;

    if (typeof apiError.code === 'string' && apiError.code.includes('LIMIT_EXCEEDED')) {
      errorDetails = apiError;
    } else if (apiError.details) {
      const details = apiError.details as Record<string, unknown>;
      if (details.error) {
        errorDetails = details.error as Record<string, unknown>;
      }
    }
  }

  // Handle thrown error format (from API client)
  if (!errorDetails) {
    errorDetails = (errorObj.details as Record<string, unknown>)?.error as Record<string, unknown>;

    // If error is already in the right format
    if (errorObj.code && errorObj.details) {
      errorDetails = errorObj;
    }

    // Fallback for simple error format
    if (!errorDetails && errorObj.message === 'Insufficient permissions' && errorObj.code === 'FORBIDDEN') {
      // Try to extract from nested structure
      const details = errorObj.details as Record<string, unknown>;
      if (details?.error) {
        errorDetails = details.error as Record<string, unknown>;
      }
    }
  }

  if (!errorDetails) return null;

  const details = errorDetails as Record<string, unknown>;
  const errorDetailsData = details.details as Record<string, unknown>;

  return {
    code: (details.code as string) || 'PLAN_LIMIT_EXCEEDED',
    message: (details.message as string) || 'Plan limit exceeded',
    details: {
      feature: (errorDetailsData?.feature as string) || 'maxWallets',
      currentCount: (errorDetailsData?.currentCount as number) || 0,
      limit: (errorDetailsData?.limit as number) || 0,
      planType: (errorDetailsData?.planType as 'FREE' | 'PRO' | 'ULTIMATE') || 'FREE',
      upgradeRequired: (errorDetailsData?.upgradeRequired as boolean) || true
    }
  };
}

/**
 * Handle plan limit error with proper error logging and user notification
 */
export function handlePlanLimitError(
  error: unknown,
  context: string = 'general',
  showDialog?: (error: PlanLimitError) => void
): PlanLimitError | null {
  const planLimitError = extractPlanLimitError(error);

  if (!planLimitError) return null;

  // Log the error with context
  handleError(error, context, {
    showToast: false, // We'll handle UI through the dialog
    logError: true,
    throwError: false,
    userMessage: planLimitError.details ?
      `You've reached your ${planLimitError.details.planType.toLowerCase()} plan limit for ${planLimitError.details.feature}.` :
      'You have reached your plan limit.'
  });

  // Show upgrade dialog if callback provided
  if (showDialog) {
    showDialog(planLimitError);
  }

  return planLimitError;
}

/**
 * Create a wrapper for API calls that handles plan limit errors
 */
export function withPlanLimitHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  apiCall: T,
  context: string,
  showDialog?: (error: PlanLimitError) => void
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      const planLimitError = handlePlanLimitError(error, context, showDialog);

      // If it's a plan limit error, don't re-throw to prevent double error handling
      if (planLimitError) {
        throw planLimitError; // Throw the structured error instead
      }

      // Re-throw other errors for normal error handling
      throw error;
    }
  }) as T;
}

/**
 * React hook for handling plan limit errors
 */
export function usePlanLimitHandler() {
  return {
    isPlanLimitError,
    extractPlanLimitError,
    handlePlanLimitError,
    withPlanLimitHandling
  };
}

const planLimitHandler = {
  isPlanLimitError,
  extractPlanLimitError,
  handlePlanLimitError,
  withPlanLimitHandling
};

export default planLimitHandler;