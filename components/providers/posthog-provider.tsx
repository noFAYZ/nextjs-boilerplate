'use client';

import { ReactNode, useEffect } from 'react';
import { initPostHog } from '@/instrumentation-client';
import { useConsentManager } from '@/lib/hooks/useConsentManager';

export function PostHogProvider({ children }: { children: ReactNode }) {
  const { consent, isLoaded } = useConsentManager();

  useEffect(() => {
    if (isLoaded) {
      if (consent.analytics) {
        initPostHog();
      } else {
        console.log('PostHog disabled: User did not consent to analytics');
      }
    }
  }, [consent.analytics, isLoaded]);

  return <>{children}</>;
}
