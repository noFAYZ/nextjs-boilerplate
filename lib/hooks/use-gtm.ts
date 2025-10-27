/**
 * GTM Tracking Hooks
 *
 * PURPOSE: Production-grade hooks for Google Tag Manager event tracking
 * - Type-safe event tracking
 * - Automatic error handling
 * - Only tracks when GTM is enabled
 *
 * USAGE:
 * ```tsx
 * import { useGTM } from '@/lib/hooks/use-gtm';
 *
 * function WaitlistForm() {
 *   const { trackEvent } = useGTM();
 *
 *   const handleSubmit = () => {
 *     trackEvent({
 *       event: 'waitlist_signup',
 *       email: 'user@example.com',
 *       timestamp: new Date().toISOString(),
 *     });
 *   };
 * }
 * ```
 */

import { useCallback } from 'react';
import { pushToDataLayer } from '@/components/analytics/google-tag-manager';

// ============================================================================
// TYPES
// ============================================================================

export interface GTMEvent {
  event: string;
  [key: string]: unknown;
}

export interface GTMPageView {
  event: 'pageview';
  page: string;
  title?: string;
}

export interface GTMWaitlistEvent {
  event: 'waitlist_signup';
  email: string;
  firstName?: string;
  lastName?: string;
  timestamp: string;
}

export interface GTMUserEvent {
  event: 'user_login' | 'user_signup' | 'user_logout';
  userId?: string;
  method?: string;
  timestamp: string;
}

export interface GTMTransactionEvent {
  event: 'transaction';
  transactionId: string;
  value: number;
  currency: string;
  category?: string;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for tracking events with Google Tag Manager
 * Provides type-safe event tracking with automatic error handling
 */
export function useGTM() {
  const isEnabled = !!process.env.NEXT_PUBLIC_GTM_ID;

  /**
   * Track a generic event
   */
  const trackEvent = useCallback(
    (event: GTMEvent) => {
      if (!isEnabled) {
        console.debug('GTM not enabled, skipping event:', event);
        return;
      }

      try {
        pushToDataLayer(event);
        console.debug('GTM event tracked:', event);
      } catch (error) {
        console.error('Failed to track GTM event:', error);
      }
    },
    [isEnabled]
  );

  /**
   * Track page view
   */
  const trackPageView = useCallback(
    (page: string, title?: string) => {
      trackEvent({
        event: 'pageview',
        page,
        title: title || document.title,
      });
    },
    [trackEvent]
  );

  /**
   * Track waitlist signup
   */
  const trackWaitlistSignup = useCallback(
    (data: { email: string; firstName?: string; lastName?: string }) => {
      trackEvent({
        event: 'waitlist_signup',
        ...data,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  /**
   * Track user authentication events
   */
  const trackUserEvent = useCallback(
    (
      eventType: 'user_login' | 'user_signup' | 'user_logout',
      data?: { userId?: string; method?: string }
    ) => {
      trackEvent({
        event: eventType,
        ...data,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  /**
   * Track transaction/conversion events
   */
  const trackTransaction = useCallback(
    (data: {
      transactionId: string;
      value: number;
      currency: string;
      category?: string;
    }) => {
      trackEvent({
        event: 'transaction',
        ...data,
      });
    },
    [trackEvent]
  );

  /**
   * Track custom conversion events
   */
  const trackConversion = useCallback(
    (conversionName: string, data?: Record<string, unknown>) => {
      trackEvent({
        event: 'conversion',
        conversionName,
        ...data,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackPageView,
    trackWaitlistSignup,
    trackUserEvent,
    trackTransaction,
    trackConversion,
    isEnabled,
  };
}
