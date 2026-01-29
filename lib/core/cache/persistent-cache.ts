"use client";

// Optional: Add persistent cache for wallet data
export const CACHE_KEYS = {
  WALLETS: 'moneymappr_wallets_cache',
  PORTFOLIO: 'moneymappr_portfolio_cache',
  LAST_FETCH: 'moneymappr_last_fetch',
} as const;

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

export class PersistentCache {
  private static isExpired<T>(item: CacheItem<T>): boolean {
    return Date.now() > (item.timestamp + item.expiresIn);
  }

  static set<T>(key: string, data: T, expiresInMs: number = 5 * 60 * 1000): void {
    if (typeof window === 'undefined') return;

    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMs
      };

      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);

      if (this.isExpired(item)) {
        localStorage.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      localStorage.removeItem(key);
      return null;
    }
  }

  static clear(key?: string): void {
    if (typeof window === 'undefined') return;

    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        // Clear all MoneyMappr cache keys
        Object.values(CACHE_KEYS).forEach(cacheKey => {
          localStorage.removeItem(cacheKey);
        });
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  static getCacheInfo(key: string): { size: string; expires: string } | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const item: CacheItem<unknown> = JSON.parse(cached);
      const expiresAt = new Date(item.timestamp + item.expiresIn);

      return {
        size: `${(cached.length / 1024).toFixed(2)}KB`,
        expires: expiresAt.toLocaleString()
      };
    } catch {
      return null;
    }
  }
}