/**
 * Portfolio Chart Utility Functions
 * Extracted for better code organization and reusability
 */

export const FORMAT_OPTIONS = {
  currency: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  } as Intl.NumberFormatOptions,
} as const;

export const DATE_FORMAT_MAP = {
  '1D': { hour: '2-digit', minute: '2-digit', hour12: true },
  '7D': { month: 'short', day: 'numeric' },
  '1M': { month: 'short', day: 'numeric' },
  '3M': { month: 'short', day: 'numeric' },
  '6M': { month: 'short' },
  '1Y': { month: 'short' },
  'ALL': { month: 'short', year: '2-digit' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

export const AXIS_INTERVAL_MAP = {
  '1D': 10,
  '7D': 7,
  '1M': 5,
  '3M': 5,
  '6M': 6,
  '1Y': 12,
  'ALL': 10,
} as const;

/**
 * Format number as compact currency (e.g., $1.2M, $500k)
 */
export const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
};

/**
 * Format Y-axis labels with improved readability
 * No floating point - whole numbers only
 */
export const formatYAxisLabel = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M`;
  }

  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }

  return `$${Math.round(value)}`;
};

/**
 * Format number as full currency string
 */
export const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return `$${value.toLocaleString(undefined, {
      ...FORMAT_OPTIONS.currency,
      ...options,
    })}`;
  } catch {
    console.warn('[PortfolioChart] Currency formatting error');
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Format date based on time period
 */
export const formatDateByPeriod = (
  date: Date,
  period: string
): string => {
  try {
    const formatOptions = DATE_FORMAT_MAP[period as keyof typeof DATE_FORMAT_MAP];

    if (period === '1D') {
      return date.toLocaleTimeString('en-US', formatOptions as Intl.DateTimeFormatOptions);
    }

    return date.toLocaleDateString('en-US', formatOptions);
  } catch {
    console.warn('[PortfolioChart] Date formatting error');
    return '';
  }
};

/**
 * Calculate X-axis interval based on period and data length
 */
export const calculateXAxisInterval = (
  dataLength: number,
  period: string
): number => {
  const targetLabels = AXIS_INTERVAL_MAP[period as keyof typeof AXIS_INTERVAL_MAP] ?? 8;
  return Math.max(0, Math.floor(dataLength / targetLabels) - 1);
};

/**
 * Calculate Y-axis domain with minimal padding (5% or min 500)
 */
export const calculateYAxisDomain = (
  values: number[],
  padding: number = 0.05
): [number, number] => {
  if (values.length === 0) return [0, 100000];

  const validValues = values.filter(
    (v) => typeof v === 'number' && isFinite(v)
  );

  if (validValues.length === 0) return [0, 100000];

  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  const range = max - min || max; // Handle case where min === max
  const paddingAmount = Math.max(range * padding, 500); // Smaller min padding

  return [
    Math.max(0, Math.floor((min - paddingAmount) / 1000) * 1000),
    Math.ceil((max + paddingAmount) / 1000) * 1000,
  ];
};

/**
 * Calculate metrics (change, percent, etc.)
 */
export const calculateMetrics = (
  currentValue: number,
  previousValue: number
) => {
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

  return {
    change,
    changePercent,
    isPositive: change >= 0,
    isNeutral: Math.abs(changePercent) < 0.01,
  };
};
