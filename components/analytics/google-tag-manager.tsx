/**
 * Google Tag Manager Component
 *
 * PURPOSE: Production-grade GTM integration for Next.js 15 App Router
 * - Loads GTM scripts with optimal performance
 * - Includes both <head> and <body> snippets as per Google's requirements
 * - Only loads when GTM_ID is configured
 * - Uses next/script for optimal loading strategy
 *
 * USAGE:
 * Add to root layout:
 * ```tsx
 * import { GoogleTagManager } from '@/components/analytics/google-tag-manager';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <GoogleTagManager />
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (gtmId) {
      console.log('GTM initialized with ID:', gtmId);
    } else {
      console.warn('GTM ID not configured. Set NEXT_PUBLIC_GTM_ID in your environment.');
    }
  }, [gtmId]);

  // Don't render if GTM ID is not configured
  if (!gtmId) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - Head Script */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
        onLoad={() => {
          console.log('GTM script loaded successfully');
        }}
        onError={(e) => {
          console.error('GTM script failed to load:', e);
        }}
      />
    </>
  );
}

/**
 * Google Tag Manager NoScript Component
 *
 * This should be placed immediately after the opening <body> tag
 * Required for users with JavaScript disabled
 */
export function GoogleTagManagerNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // Don't render if GTM ID is not configured
  if (!gtmId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

/**
 * Helper function to push custom events to GTM dataLayer
 *
 * USAGE:
 * ```tsx
 * import { pushToDataLayer } from '@/components/analytics/google-tag-manager';
 *
 * // Track custom event
 * pushToDataLayer({
 *   event: 'waitlist_signup',
 *   email: 'user@example.com',
 * });
 *
 * // Track page view (usually automatic, but useful for SPA navigation)
 * pushToDataLayer({
 *   event: 'pageview',
 *   page: '/dashboard',
 * });
 * ```
 */
export function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
}

// Extend Window type to include dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
