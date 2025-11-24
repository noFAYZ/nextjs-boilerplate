'use client';

import { ReactNode, useEffect } from 'react';
import { initPostHog } from '@/instrumentation-client';

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
}
