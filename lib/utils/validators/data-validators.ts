/**
 * Data Validation Utilities
 * Centralized validation functions for data integrity
 */

/**
 * Validate if value is a valid number
 */
export function isValidNumber(value: unknown): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && isFinite(parsed);
  }
  return false;
}

/**
 * Validate if value is a valid positive number
 */
export function isPositiveNumber(value: unknown): boolean {
  return isValidNumber(value) && parseFloat(String(value)) > 0;
}

/**
 * Validate if string is not empty
 */
export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate if array is not empty
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Validate if object has required keys
 */
export function hasRequiredKeys<T extends Record<string, unknown>>(
  obj: unknown,
  requiredKeys: string[]
): obj is T {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return requiredKeys.every((key) => key in obj);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date string
 */
export function isValidDate(date: unknown): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  if (typeof date === 'string' || typeof date === 'number') {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }
  return false;
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: unknown, endDate: unknown): boolean {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }
  return new Date(startDate as string | Date) <= new Date(endDate as string | Date);
}

/**
 * Sanitize string (remove special characters)
 */
export function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, '');
}

/**
 * Validate amount is within range
 */
export function isAmountInRange(
  amount: number,
  min?: number,
  max?: number
): boolean {
  if (!isValidNumber(amount)) return false;
  if (min !== undefined && amount < min) return false;
  if (max !== undefined && amount > max) return false;
  return true;
}

/**
 * Validate percentage (0-100)
 */
export function isValidPercentage(value: number): boolean {
  return isValidNumber(value) && value >= 0 && value <= 100;
}

/**
 * Check if value exists (not null, undefined, or empty string)
 */
export function exists(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

/**
 * Validate currency code (3-letter ISO code)
 */
export function isValidCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}
