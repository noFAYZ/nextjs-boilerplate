/**
 * CSRF Token Utilities
 * Helpers for managing CSRF tokens for API security
 */

/**
 * Get CSRF token from cookies
 * The token is typically stored in a cookie like 'csrf-token' or 'XSRF-TOKEN'
 * @returns CSRF token string or null if not found
 */
export function getCSRFTokenFromCookie(cookieName: string = 'csrf-token'): string | null {
  if (typeof document === 'undefined') {
    // Server-side rendering
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName || name === 'XSRF-TOKEN' || name === 'X-CSRF-TOKEN') {
      return decodeURIComponent(value);
    }
  }

  return null;
}

/**
 * Set CSRF token in cookies
 * @param token The CSRF token to store
 * @param cookieName Cookie name (defaults to 'csrf-token')
 * @param options Optional cookie options
 */
export function setCSRFTokenCookie(
  token: string,
  cookieName: string = 'csrf-token',
  options?: {
    path?: string;
    domain?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }
): void {
  if (typeof document === 'undefined') {
    // Server-side rendering
    return;
  }

  const {
    path = '/',
    domain,
    maxAge = 3600, // 1 hour default
    secure = true,
    sameSite = 'Lax',
  } = options || {};

  let cookieString = `${cookieName}=${encodeURIComponent(token)}`;
  cookieString += `; Path=${path}`;
  if (domain) cookieString += `; Domain=${domain}`;
  if (maxAge) cookieString += `; Max-Age=${maxAge}`;
  if (secure) cookieString += '; Secure';
  if (sameSite) cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Extract CSRF token from response headers
 * The token is typically in a header like 'X-CSRF-Token' or 'XSRF-Token'
 * @param headers Response headers
 * @returns CSRF token or null
 */
export function getCSRFTokenFromHeaders(headers: Headers | Record<string, string>): string | null {
  const headerMap = headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers;

  // Check common header names
  for (const key of Object.keys(headerMap)) {
    if (
      key.toLowerCase() === 'x-csrf-token' ||
      key.toLowerCase() === 'xsrf-token' ||
      key.toLowerCase() === 'x-xsrf-token'
    ) {
      return headerMap[key];
    }
  }

  return null;
}

/**
 * Validate CSRF token format
 * Checks if the token looks valid (basic format check)
 * @param token Token to validate
 * @returns true if token appears valid
 */
export function isValidCSRFToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  // Basic check: token should be at least 20 characters
  return token.length >= 20;
}

/**
 * Get CSRF token from either cookies or a fallback value
 * @param cookieName Cookie name to check
 * @param fallbackToken Optional fallback token
 * @returns CSRF token or null
 */
export function getCSRFToken(cookieName?: string, fallbackToken?: string): string | null {
  const token = getCSRFTokenFromCookie(cookieName);
  return token || fallbackToken || null;
}
