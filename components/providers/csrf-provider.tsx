'use client';

import { ReactNode } from 'react';
import { useCSRFInitialization } from '@/lib/hooks/use-csrf-initialization';

/**
 * CSRF Provider Component
 * Initializes CSRF token on app startup
 * Should be placed near the top of the provider hierarchy
 */
function CSRFInitializer() {
  useCSRFInitialization();
  return null;
}

export function CSRFProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <CSRFInitializer />
      {children}
    </>
  );
}
