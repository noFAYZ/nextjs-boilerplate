'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { currencyService, type FiatRates, type CurrencyInfo } from '@/lib/services/currency-api';

interface CurrencyContextValue {
  // Current state
  selectedCurrency: string;
  currencySymbol: string;
  exchangeRates: FiatRates | null;
  availableCurrencies: CurrencyInfo[];

  // Loading states
  isLoading: boolean;
  isChanging: boolean;
  error: string | null;

  // Actions
  changeCurrency: (currencyCode: string) => Promise<void>;
  refreshRates: () => Promise<void>;
  convertFromUSD: (amountUSD: number) => number;
  formatAmount: (amount: number, options?: Intl.NumberFormatOptions) => string;

  // Utilities
  getCurrencyInfo: (currencyCode?: string) => CurrencyInfo | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

interface CurrencyProviderProps {
  children: React.ReactNode;
  defaultCurrency?: string;
}

// Local storage key
const CURRENCY_STORAGE_KEY = 'moneymappr_selected_currency';

export function CurrencyProvider({ children, defaultCurrency = 'USD' }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(defaultCurrency);
  const [exchangeRates, setExchangeRates] = useState<FiatRates | null>(null);
  const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadCurrencyData();
  }, []);

  const loadCurrencyData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Loading currency data...');

      // Load rates and available currencies in parallel
      const [rates, currencies] = await Promise.all([
        currencyService.getFiatRates(),
        currencyService.getAllCurrencies(),
      ]);

      console.log('Currency data loaded:', { rates: Object.keys(rates).length, currencies: currencies.length });
      setExchangeRates(rates);
      setAvailableCurrencies(currencies);
    } catch (err) {
      console.error('Failed to load currency data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load currency data');

      // Set fallback data
      setExchangeRates({ USD: 1, EUR: 0.85, GBP: 0.73 });
      setAvailableCurrencies([
        { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
        { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
        { code: 'GBP', symbol: '£', rate: 0.73, name: 'British Pound' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const changeCurrency = useCallback(async (currencyCode: string) => {
    if (currencyCode === selectedCurrency) return;

    setIsChanging(true);
    setError(null);

    try {
      // Validate currency exists
      const currencyInfo = await currencyService.getCurrencyInfo(currencyCode);
      if (!currencyInfo) {
        throw new Error(`Currency ${currencyCode} not available`);
      }

      // Update state
      setSelectedCurrency(currencyCode.toUpperCase());

      // Save to localStorage
      localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode.toUpperCase());

      // Refresh rates to ensure we have latest data
      await refreshRates();
    } catch (err) {
      console.error('Failed to change currency:', err);
      setError(err instanceof Error ? err.message : 'Failed to change currency');
    } finally {
      setIsChanging(false);
    }
  }, [selectedCurrency]);

  const refreshRates = useCallback(async () => {
    try {
      const rates = await currencyService.getFiatRates();
      setExchangeRates(rates);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh rates:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh rates');
    }
  }, []);

  const convertFromUSD = useCallback((amountUSD: number): number => {
    if (!exchangeRates || selectedCurrency === 'USD') {
      return amountUSD;
    }

    const rate = exchangeRates[selectedCurrency];
    if (rate === undefined) {
      console.warn(`Exchange rate for ${selectedCurrency} not found`);
      return amountUSD;
    }

    return amountUSD * rate;
  }, [exchangeRates, selectedCurrency]);

  const formatAmount = useCallback((amount: number, options?: Intl.NumberFormatOptions): string => {
    return currencyService.formatAmount(amount, selectedCurrency, options);
  }, [selectedCurrency]);

  const getCurrencyInfo = useCallback((currencyCode?: string): CurrencyInfo | null => {
    const code = currencyCode || selectedCurrency;
    return availableCurrencies.find(c => c.code === code.toUpperCase()) || null;
  }, [availableCurrencies, selectedCurrency]);

  const currencySymbol = currencyService.getCurrencySymbol(selectedCurrency);

  const value: CurrencyContextValue = {
    // Current state
    selectedCurrency,
    currencySymbol,
    exchangeRates,
    availableCurrencies,

    // Loading states
    isLoading,
    isChanging,
    error,

    // Actions
    changeCurrency,
    refreshRates,
    convertFromUSD,
    formatAmount,

    // Utilities
    getCurrencyInfo,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Convenience hooks
export function useConvertFromUSD() {
  const { convertFromUSD } = useCurrency();
  return convertFromUSD;
}

export function useCurrencyFormat() {
  const { formatAmount, currencySymbol, selectedCurrency } = useCurrency();

  return {
    formatAmount,
    currencySymbol,
    selectedCurrency,
    formatCurrency: (amount: number, showSymbol = true) => {
      if (showSymbol) {
        return formatAmount(amount);
      }
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
  };
}

export function useSelectedCurrency() {
  const { selectedCurrency, currencySymbol, getCurrencyInfo } = useCurrency();

  return {
    currency: selectedCurrency,
    symbol: currencySymbol,
    info: getCurrencyInfo(),
  };
}