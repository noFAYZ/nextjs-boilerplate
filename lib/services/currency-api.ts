// Currency symbols mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  // Major currencies
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CHF: 'Fr',
  CAD: 'C$',
  AUD: 'A$',
  NZD: 'NZ$',

  // Asian currencies
  CNY: '¥',
  PKR: 'Rs',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  THB: '฿',

  // Middle East & Africa
  AED: 'د.إ',
  SAR: '﷼',
  ZAR: 'R',

  // Latin America
  BRL: 'R$',
  MXN: '$',
  ARS: '$',
  CLP: '$',

  // Europe
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  RUB: '₽',

  // Others
  TRY: '₺',
  ILS: '₪',

  // Fallback for unknown currencies
};

// Popular currencies list (ordered by usage)
export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'PKR', 'KRW'
];

export interface FiatRates {
  [currencyCode: string]: number;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  name?: string;
}

// Currency names mapping
export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CHF: 'Swiss Franc',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  NZD: 'New Zealand Dollar',
  CNY: 'Chinese Yuan',
  PKR: 'Pakistani Rupee',
  KRW: 'South Korean Won',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  THB: 'Thai Baht',
  AED: 'UAE Dirham',
  SAR: 'Saudi Riyal',
  ZAR: 'South African Rand',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  ARS: 'Argentine Peso',
  CLP: 'Chilean Peso',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  PLN: 'Polish Zloty',
  RUB: 'Russian Ruble',
  TRY: 'Turkish Lira',
  ILS: 'Israeli Shekel',
};

class CurrencyService {
  private cache: { rates: FiatRates | null; timestamp: number | null } = {
    rates: null,
    timestamp: null,
  };

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch fiat rates from Zapper API
   */
  async getFiatRates(): Promise<FiatRates> {
    // Check cache first
    if (this.cache.rates && this.cache.timestamp &&
        Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.rates;
    }

    try {
      const response = await fetch('https://zapper.xyz/z/v1/fiat-rates', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rates: FiatRates = await response.json();

      // Update cache
      this.cache.rates = rates;
      this.cache.timestamp = Date.now();

      return rates;
    } catch (error) {
      console.error('Error fetching fiat rates:', error);

      // Return cached data if available, otherwise fallback
      if (this.cache.rates) {
        return this.cache.rates;
      }

      // Fallback rates (USD base)
      return {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        AUD: 1.35,
        CAD: 1.25,
        CHF: 0.92,
        CNY: 6.45,
        PKR: 280,
        KRW: 1180,
      };
    }
  }

  /**
   * Get currency information including symbol and rate
   */
  async getCurrencyInfo(currencyCode: string): Promise<CurrencyInfo | null> {
    try {
      const rates = await this.getFiatRates();
      const rate = rates[currencyCode.toUpperCase()];

      if (rate === undefined) {
        return null;
      }

      return {
        code: currencyCode.toUpperCase(),
        symbol: this.getCurrencySymbol(currencyCode),
        rate,
        name: CURRENCY_NAMES[currencyCode.toUpperCase()],
      };
    } catch (error) {
      console.error(`Error getting currency info for ${currencyCode}:`, error);
      return null;
    }
  }

  /**
   * Get all available currencies with their info
   */
  async getAllCurrencies(): Promise<CurrencyInfo[]> {
    try {
      const rates = await this.getFiatRates();

      return Object.entries(rates).map(([code, rate]) => ({
        code,
        symbol: this.getCurrencySymbol(code),
        rate,
        name: CURRENCY_NAMES[code],
      })).sort((a, b) => {
        // Sort popular currencies first, then alphabetically
        const aPopular = POPULAR_CURRENCIES.indexOf(a.code);
        const bPopular = POPULAR_CURRENCIES.indexOf(b.code);

        if (aPopular !== -1 && bPopular !== -1) {
          return aPopular - bPopular;
        }
        if (aPopular !== -1) return -1;
        if (bPopular !== -1) return 1;

        return a.code.localeCompare(b.code);
      });
    } catch (error) {
      console.error('Error getting all currencies:', error);
      return [];
    }
  }

  /**
   * Convert amount from USD to target currency
   */
  async convertFromUSD(amountUSD: number, targetCurrency: string): Promise<number> {
    if (targetCurrency.toUpperCase() === 'USD') {
      return amountUSD;
    }

    try {
      const rates = await this.getFiatRates();
      const rate = rates[targetCurrency.toUpperCase()];

      if (rate === undefined) {
        console.warn(`Currency ${targetCurrency} not found, returning USD amount`);
        return amountUSD;
      }

      return amountUSD * rate;
    } catch (error) {
      console.error(`Error converting from USD to ${targetCurrency}:`, error);
      return amountUSD;
    }
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
      return amount;
    }

    try {
      const rates = await this.getFiatRates();
      const fromRate = rates[fromCurrency.toUpperCase()] || 1;
      const toRate = rates[toCurrency.toUpperCase()] || 1;

      // Convert to USD first, then to target currency
      const usdAmount = amount / fromRate;
      return usdAmount * toRate;
    } catch (error) {
      console.error(`Error converting ${fromCurrency} to ${toCurrency}:`, error);
      return amount;
    }
  }

  /**
   * Get currency symbol for a currency code
   */
  getCurrencySymbol(currencyCode: string): string {
    return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] || currencyCode.toUpperCase();
  }

  /**
   * Format amount with currency symbol
   */
  formatAmount(amount: number, currencyCode: string, options?: Intl.NumberFormatOptions): string {
    const symbol = this.getCurrencySymbol(currencyCode);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount);

    // For some currencies, symbol goes after
    if (['EUR', 'NOK', 'SEK', 'DKK'].includes(currencyCode.toUpperCase())) {
      return `${formatted} ${symbol}`;
    }

    return `${symbol}${formatted}`;
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();

// Helper hooks and utilities
export const useCurrencyRates = () => {
  const [rates, setRates] = useState<FiatRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const newRates = await currencyService.getFiatRates();
      setRates(newRates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  };

  return { rates, loading, error, fetchRates };
};

import { useState } from 'react';