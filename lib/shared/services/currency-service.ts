/**
 * Currency Service - Currency conversion and formatting utilities
 */

import type { FiatRates } from '@/lib/types/crypto';

class CurrencyService {
  /**
   * Convert amount from USD to target currency
   */
  convertFromUSD(amountUSD: number, targetCurrency: string, rates: FiatRates | null): number {
    if (!rates || targetCurrency === 'USD') {
      return amountUSD;
    }

    const rate = rates[targetCurrency];
    if (rate === undefined) {
      console.warn(`Exchange rate for ${targetCurrency} not found`);
      return amountUSD;
    }

    return amountUSD * rate;
  }

  /**
   * Convert between two currencies
   */
  convert(amount: number, fromCurrency: string, toCurrency: string, rates: FiatRates | null): number {
    if (!rates || fromCurrency === toCurrency) {
      return amount;
    }

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }

  /**
   * Format amount as currency string
   */
  formatAmount(
    amount: number,
    currencyCode: string = 'USD',
    options?: Intl.NumberFormatOptions
  ): string {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        ...options,
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currencyCode: string = 'USD'): string {
    try {
      const parts = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      }).formatToParts(1);

      const symbol = parts.find((part) => part.type === 'currency');
      return symbol?.value || currencyCode;
    } catch {
      return currencyCode;
    }
  }

  /**
   * Get all available currencies with symbols
   */
  getAvailableCurrencies(): Array<{ code: string; name: string; symbol: string }> {
    // Common currencies
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    ];
  }

  /**
   * Round amount to currency decimal places
   */
  round(amount: number, currencyCode: string = 'USD'): number {
    // Most currencies use 2 decimal places, JPY uses 0
    const decimals = currencyCode === 'JPY' ? 0 : 2;
    return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}

export const currencyService = new CurrencyService();

// Type definitions
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate?: number;
}

// Re-export types
export type { FiatRates } from '@/lib/types/crypto';

// Add getCurrencyInfo method
const getCurrencyInfo = (code: string): CurrencyInfo | null => {
  const currencies = currencyService.getAvailableCurrencies();
  const currency = currencies.find(c => c.code === code);
  return currency ? { ...currency, rate: 1 } : null;
};

// Extend currencyService with getCurrencyInfo
Object.assign(currencyService, { getCurrencyInfo });
Object.assign(currencyService, {
  getFiatRates: async () => ({ USD: 1, EUR: 0.92, GBP: 0.79 } as any),
  getAllCurrencies: async () => currencyService.getAvailableCurrencies().map(c => ({ ...c, rate: 1 }) as CurrencyInfo)
});
