import { create } from 'zustand';
import { logger } from '@/lib/utils/logger';

interface CSRFState {
  // State
  token: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  lastInitTime: number | null;

  // Actions
  setToken: (token: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const CSRF_TOKEN_COOKIE_NAME = 'csrf-token';
const CSRF_INIT_RETRY_DELAY = 1000; // 1 second
const CSRF_INIT_MAX_RETRIES = 3;

export const useCSRFStore = create<CSRFState>((set) => ({
  token: null,
  isInitialized: false,
  isInitializing: false,
  error: null,
  lastInitTime: null,

  setToken: (token) => {
    set({ token, error: null });
    if (token) {
      logger.debug('CSRF token stored:', token.substring(0, 8) + '...');
    }
  },

  setInitialized: (initialized) => {
    set({ isInitialized: initialized, lastInitTime: initialized ? Date.now() : null });
    if (initialized) {
      logger.info('CSRF initialization complete');
    }
  },

  setInitializing: (initializing) => {
    set({ isInitializing: initializing });
  },

  setError: (error) => {
    set({ error });
    if (error) {
      logger.error('CSRF store error:', error);
    }
  },

  reset: () => {
    set({
      token: null,
      isInitialized: false,
      isInitializing: false,
      error: null,
      lastInitTime: null,
    });
    logger.info('CSRF store reset');
  },
}));

/**
 * Initialize CSRF token by calling the backend health endpoint
 * Retries on failure with exponential backoff
 */
export async function initializeCSRFToken(): Promise<boolean> {
  const store = useCSRFStore.getState();

  // Already initialized or initializing
  if (store.isInitialized || store.isInitializing) {
    return store.isInitialized;
  }

  store.setInitializing(true);
  logger.info('Starting CSRF token initialization...');

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= CSRF_INIT_MAX_RETRIES; attempt++) {
    try {
      logger.debug(`CSRF init attempt ${attempt}/${CSRF_INIT_MAX_RETRIES}`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Health endpoint returned ${response.status}`);
      }

      // Try to get token from cookie (set by backend)
      const token = getCSRFTokenFromCookie();

      if (token) {
        store.setToken(token);
        store.setInitialized(true);
        store.setInitializing(false);
        logger.info('✓ CSRF token successfully initialized from cookie');
        return true;
      }

      // Try to get token from response header
      const headerToken = response.headers.get('X-CSRF-Token');
      if (headerToken) {
        store.setToken(headerToken);
        store.setInitialized(true);
        store.setInitializing(false);
        logger.info('✓ CSRF token successfully initialized from response header');
        return true;
      }

      throw new Error('CSRF token not found in cookie or response header');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`CSRF init attempt ${attempt} failed:`, lastError.message);

      // Wait before retrying (exponential backoff)
      if (attempt < CSRF_INIT_MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, CSRF_INIT_RETRY_DELAY * attempt));
      }
    }
  }

  // All retries failed
  const errorMsg = `CSRF initialization failed after ${CSRF_INIT_MAX_RETRIES} attempts: ${lastError?.message}`;
  store.setError(errorMsg);
  store.setInitializing(false);
  logger.error('✗', errorMsg);

  return false;
}

/**
 * Get CSRF token from cookie
 */
export function getCSRFTokenFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const name = `${CSRF_TOKEN_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }

  return null;
}

/**
 * Ensure CSRF token is available before making protected requests
 * This can be called multiple times - it will only initialize once
 */
export async function ensureCSRFToken(): Promise<string | null> {
  const store = useCSRFStore.getState();

  if (store.token) {
    return store.token;
  }

  if (store.isInitialized) {
    // Tried to init but failed
    return null;
  }

  // Need to initialize
  const success = await initializeCSRFToken();
  return success ? useCSRFStore.getState().token : null;
}

/**
 * Refresh CSRF token (useful after 403 CSRF errors)
 */
export async function refreshCSRFToken(): Promise<boolean> {
  logger.info('Refreshing CSRF token due to validation error...');
  useCSRFStore.getState().reset();
  return initializeCSRFToken();
}
