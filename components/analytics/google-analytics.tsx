/**
 * Google Analytics 4 (GA4) Component
 *
 * PURPOSE: Production-grade GA4 integration for Next.js 15 App Router
 * - Loads GA4 gtag.js script for event tracking and conversion measurement
 * - Only loads when GA4_MEASUREMENT_ID is configured
 * - Uses next/script for optimal loading strategy
 *
 * USAGE:
 * Add to root layout:
 * ```tsx
 * import { GoogleAnalytics4 } from '@/components/analytics/google-analytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <GoogleAnalytics4 />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function GoogleAnalytics4() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  useEffect(() => {
    if (measurementId) {
      console.log('GA4 initialized with Measurement ID:', measurementId);
    } else {
      console.warn('GA4 Measurement ID not configured. Set NEXT_PUBLIC_GA4_MEASUREMENT_ID in your environment.');
    }
  }, [measurementId]);

  // Don't render if GA4 Measurement ID is not configured
  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 - gtag.js Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('GA4 script loaded successfully');
        }}
        onError={(e) => {
          console.error('GA4 script failed to load:', e);
        }}
      />
      {/* GA4 Configuration Script */}
      <Script
        id="google-analytics-4"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}

/**
 * Helper function to send custom events to GA4
 *
 * USAGE:
 * ```tsx
 * import { trackGA4Event } from '@/components/analytics/google-analytics';
 *
 * // Track custom event
 * trackGA4Event('bank_account_connected', {
 *   account_type: 'checking',
 *   institution: 'Chase',
 * });
 *
 * // Track conversion
 * trackGA4Event('sign_up', {
 *   method: 'email',
 * });
 * ```
 */
export function trackGA4Event(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData || {});
  } else {
    console.warn('GA4 (gtag) is not available on this page.');
  }
}

// Extend Window type to include gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}
