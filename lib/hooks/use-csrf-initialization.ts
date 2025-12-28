import { useEffect } from 'react';
import { getCSRFTokenFromCookie } from '@/lib/utils/csrf';
import { apiClient } from '@/lib/api-client';
import { logger } from '@/lib/utils/logger';

/**
 * Hook to initialize CSRF token on app startup
 * Attempts to get the token from the cookie first, then falls back to health check
 * This should be called once during app initialization
 */
export function useCSRFInitialization() {
  useEffect(() => {
    const initializeCSRF = async () => {
      try {
        // First, try to get token from cookie
        let csrfToken = getCSRFTokenFromCookie();

        if (!csrfToken) {
          // If not in cookie, make a GET request to initialize it
          // The backend will set the cookie and send the token in the response header
          logger.debug('CSRF token not found in cookie, initializing from backend');
          await apiClient.checkHealth();

          // After health check, token should be in the cookie
          csrfToken = getCSRFTokenFromCookie();
        }

        if (csrfToken) {
          logger.debug('CSRF token initialized successfully');
        } else {
          logger.warn('CSRF token initialization failed - token not available in cookie');
        }
      } catch (error) {
        logger.error('CSRF initialization error:', error);
        // Not critical - CSRF can still work if token is set later
      }
    };

    initializeCSRF();
  }, []);
}
