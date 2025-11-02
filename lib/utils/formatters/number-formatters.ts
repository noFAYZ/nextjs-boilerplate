/**
 * Number Formatting Utilities
 * Centralized number and currency formatting
 */

/**
 * Format number as compact notation (1K, 1M, 1B)
 */
export function formatCompactNumber(num: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
  return formatter.format(num);
}

/**
 * Format number with thousand separators
 */
export function formatNumberWithSeparators(
  num: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format percentage with sign
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  showSign: boolean = true
): string {
  const formatted = value.toFixed(decimals);
  if (showSign && value > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/**
 * Format crypto amount (higher precision)
 */
export function formatCryptoAmount(
  amount: number,
  decimals: number = 8
): string {
  if (amount === 0) return '0';
  if (amount < 0.00000001) return '<0.00000001';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Parse string to number safely
 */
export function safeParseFloat(value: string | number, fallback: number = 0): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Round to decimal places
 */
export function roundToDecimals(num: number, decimals: number = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate absolute value of string or number
 */
export function absoluteValue(value: string | number): number {
  return Math.abs(safeParseFloat(value));
}
