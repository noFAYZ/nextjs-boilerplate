/**
 * CSRF Token Utility
 * Handles retrieval and management of CSRF tokens for the double-submit pattern
 */

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Gets the CSRF token from the document cookies
 * @returns The CSRF token string, or null if not found
 */
export function getCSRFTokenFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const name = `${CSRF_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }

  return null;
}

/**
 * Gets the CSRF token from API response header
 * Useful for initializing the token on first API call
 * @param response - The fetch Response object
 * @returns The CSRF token from header, or null if not present
 */
export function getCSRFTokenFromResponseHeader(response: Response): string | null {
  return response.headers.get(CSRF_HEADER_NAME);
}

/**
 * Check if CSRF protection is needed for the given HTTP method
 * CSRF protection is required for state-changing requests
 * @param method - The HTTP method
 * @returns true if CSRF protection is needed
 */
export function isCSRFProtectionRequired(method: string): boolean {
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  return stateChangingMethods.includes(method.toUpperCase());
}

/**
 * Gets the CSRF header object to include in requests
 * @returns Object with CSRF header or empty object if not needed
 */
export function getCSRFHeader(): Record<string, string> {
  const token = getCSRFTokenFromCookie();
  if (!token) {
    return {};
  }
  return { [CSRF_HEADER_NAME]: token };
}

/**
 * Check if an error is due to CSRF token validation failure
 * @param status - HTTP status code
 * @param errorCode - Error code from response body
 * @returns true if error is CSRF validation failure
 */
export function isCSRFValidationError(status: number, errorCode?: string): boolean {
  return status === 403 && (
    errorCode === 'CSRF_VALIDATION_FAILED' ||
    errorCode === 'CSRF_TOKEN_INVALID' ||
    errorCode === 'CSRF_TOKEN_MISSING'
  );
}
