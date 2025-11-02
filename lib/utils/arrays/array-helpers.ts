/**
 * Array Helper Utilities
 * Centralized helper functions for common array operations
 */

/**
 * Get top N items from array after sorting
 */
export function getTopN<T>(
  items: T[],
  n: number,
  getSortValue: (item: T) => number,
  descending: boolean = true
): T[] {
  const sorted = [...items].sort((a, b) => {
    const comparison = getSortValue(b) - getSortValue(a);
    return descending ? comparison : -comparison;
  });
  return sorted.slice(0, n);
}

/**
 * Map array to extract specific fields
 */
export function mapFields<T, R>(
  items: T[],
  mapper: (item: T, index: number) => R
): R[] {
  return items.map(mapper);
}

/**
 * Group array items by a key
 */
export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string | number
): Record<string | number, T[]> {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string | number, T[]>);
}

/**
 * Sum array values
 */
export function sumBy<T>(items: T[], getValue: (item: T) => number): number {
  return items.reduce((sum, item) => sum + getValue(item), 0);
}

/**
 * Average array values
 */
export function averageBy<T>(items: T[], getValue: (item: T) => number): number {
  if (items.length === 0) return 0;
  return sumBy(items, getValue) / items.length;
}

/**
 * Find min value in array
 */
export function minBy<T>(items: T[], getValue: (item: T) => number): T | null {
  if (items.length === 0) return null;
  return items.reduce((min, item) =>
    getValue(item) < getValue(min) ? item : min
  );
}

/**
 * Find max value in array
 */
export function maxBy<T>(items: T[], getValue: (item: T) => number): T | null {
  if (items.length === 0) return null;
  return items.reduce((max, item) =>
    getValue(item) > getValue(max) ? item : max
  );
}

/**
 * Partition array into two arrays based on predicate
 */
export function partition<T>(
  items: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  items.forEach((item) => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });

  return [truthy, falsy];
}

/**
 * Remove duplicates from array
 */
export function unique<T>(items: T[], getKey?: (item: T) => string | number): T[] {
  if (!getKey) {
    return Array.from(new Set(items));
  }

  const seen = new Set<string | number>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(items: T[][]): T[] {
  return items.reduce((flat, item) => flat.concat(item), []);
}

/**
 * Check if array is empty
 */
export function isEmpty<T>(items: T[] | null | undefined): boolean {
  return !items || items.length === 0;
}

/**
 * Safe array access (returns default if index out of bounds)
 */
export function safeGet<T>(items: T[], index: number, defaultValue: T): T {
  return items[index] !== undefined ? items[index] : defaultValue;
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
