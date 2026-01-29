/**
 * Currency Data Hooks
 *
 * PURPOSE: Production-grade React Query hooks for fiat currency rates
 * - 24-hour caching for fiat exchange rates
 * - No useEffect patterns - React Query handles everything
 * - Smart background refetching
 *
 * USAGE:
 * ```ts
 * const { data: rates } = useFiatRates();
 * const { data: currencies } = useAvailableCurrencies();
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import { currencyService } from '@/lib/services/currency-api';
import type { FiatRates, CurrencyInfo } from '@/lib/services/currency-api';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const currencyKeys = {
  all: ['currency'] as const,
  rates: () => [...currencyKeys.all, 'fiat-rates'] as const,
  currencies: () => [...currencyKeys.all, 'available-currencies'] as const,
  info: (code: string) => [...currencyKeys.all, 'info', code] as const,
};

// ============================================================================
// FIAT RATES QUERIES
// ============================================================================

/**
 * Get fiat exchange rates
 *
 * PRODUCTION-GRADE: 24-hour caching as requested
 * - Fetches once per 24 hours
 * - Background refetch after 23 hours
 * - Persists in memory cache
 *
 * @returns Fiat exchange rates with USD as base
 */
export function useFiatRates() {
  return useQuery({
    queryKey: currencyKeys.rates(),
    queryFn: () => currencyService.getFiatRates(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - data stays fresh for 24h
    gcTime: 1000 * 60 * 60 * 24 * 2, // 48 hours - keep in cache for 2 days
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    refetchOnMount: false, // Don't refetch on component mount if cache is valid
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Get all available currencies with their information
 *
 * @returns List of available currencies sorted by popularity
 */
export function useAvailableCurrencies() {
  return useQuery({
    queryKey: currencyKeys.currencies(),
    queryFn: () => currencyService.getAllCurrencies(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 2, // 48 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

/**
 * Get specific currency information
 *
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Currency information including symbol, rate, and name
 */
export function useCurrencyInfo(currencyCode: string) {
  return useQuery({
    queryKey: currencyKeys.info(currencyCode),
    queryFn: () => currencyService.getCurrencyInfo(currencyCode),
    enabled: !!currencyCode,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 2, // 48 hours
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Get conversion function with real-time rates
 *
 * @returns Function to convert from USD to selected currency
 */
export function useConvertFromUSD(targetCurrency: string) {
  const { data: rates } = useFiatRates();

  return (amountUSD: number): number => {
    if (!rates || targetCurrency === 'USD') {
      return amountUSD;
    }

    const rate = rates[targetCurrency];
    if (rate === undefined) {
      console.warn(`Exchange rate for ${targetCurrency} not found`);
      return amountUSD;
    }

    return amountUSD * rate;
  };
}

/**
 * Get currency formatting function
 *
 * @param currencyCode - Currency code to format amounts in
 * @returns Formatting function
 */
export function useCurrencyFormatter(currencyCode: string) {
  return (amount: number, options?: Intl.NumberFormatOptions): string => {
    return currencyService.formatAmount(amount, currencyCode, options);
  };
}

/**
 * Convert between two currencies
 *
 * @returns Function to convert between currencies
 */
export function useCurrencyConversion() {
  const { data: rates } = useFiatRates();

  return (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (!rates || fromCurrency === toCurrency) {
      return amount;
    }

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };
}
