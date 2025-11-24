import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';

/**
 * Custom hook to track page views in PostHog
 * Automatically captures page views when component mounts or pathname changes
 */
export function usePostHogPageView(pageName?: string) {
  const pathname = usePathname();

  useEffect(() => {
    // Use provided name or derive from pathname
    const name = pageName || formatPageName(pathname);

    posthog.capture('$pageview', {
      $current_url: pathname,
      page_name: name,
    });
  }, [pathname, pageName]);
}

/**
 * Format pathname into readable page name
 * Examples: /accounts/wallet -> accounts_wallet, /portfolio/crypto -> portfolio_crypto
 */
function formatPageName(pathname: string): string {
  if (!pathname) return 'unknown';

  return pathname
    .split('/')
    .filter(Boolean)
    .map(segment => {
      // Remove dynamic route brackets and IDs
      if (segment.includes('[')) return null;
      if (/^[a-f0-9-]{36}$/.test(segment)) return null; // UUID
      if (/^\d+$/.test(segment)) return null; // numeric ID
      return segment;
    })
    .filter(Boolean)
    .join('_')
    .toLowerCase() || 'home';
}
