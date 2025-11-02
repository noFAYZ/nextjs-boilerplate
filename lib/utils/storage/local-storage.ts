/**
 * LocalStorage Utilities
 * Centralized localStorage operations with type safety and error handling
 */

/**
 * Safely get item from localStorage with JSON parsing
 */
export function getLocalStorageItem<T>(
  key: string,
  defaultValue?: T
): T | null {
  if (typeof window === 'undefined') {
    return defaultValue ?? null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue ?? null;
  }
}

/**
 * Safely set item in localStorage with JSON stringification
 */
export function setLocalStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if key exists in localStorage
 */
export function hasLocalStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Get all localStorage keys
 */
export function getLocalStorageKeys(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
}

/**
 * Get localStorage size (approximate in bytes)
 */
export function getLocalStorageSize(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
}

/**
 * Save with timestamp
 */
export function saveWithTimestamp<T>(key: string, value: T): boolean {
  return setLocalStorageItem(key, {
    data: value,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get with timestamp validation
 */
export function getWithTimestamp<T>(
  key: string,
  maxAgeMs?: number
): { data: T; timestamp: string } | null {
  const stored = getLocalStorageItem<{ data: T; timestamp: string }>(key);

  if (!stored || !stored.timestamp) {
    return null;
  }

  if (maxAgeMs) {
    const age = Date.now() - new Date(stored.timestamp).getTime();
    if (age > maxAgeMs) {
      removeLocalStorageItem(key);
      return null;
    }
  }

  return stored;
}
