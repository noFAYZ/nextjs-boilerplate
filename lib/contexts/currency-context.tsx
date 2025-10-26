'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { currencyService, type FiatRates, type CurrencyInfo } from '@/lib/services/currency-api';
import { useFiatRates, useAvailableCurrencies } from '@/lib/queries/use-currency-data';

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
  const [isChanging, setIsChanging] = useState(false);

  // PRODUCTION-GRADE: Use TanStack Query with 24-hour caching
  // No useEffect, no manual fetching - React Query handles everything
  const {
    data: exchangeRates,
    isLoading: ratesLoading,
    error: ratesError,
    refetch: refetchRates,
  } = useFiatRates();

  const {
    data: availableCurrencies,
    isLoading: currenciesLoading,
  } = useAvailableCurrencies();

  const isLoading = ratesLoading || currenciesLoading;
  const error = ratesError ? (ratesError instanceof Error ? ratesError.message : 'Failed to load currency data') : null;

  // Initialize from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = useCallback(async (currencyCode: string) => {
    if (currencyCode === selectedCurrency) return;

    setIsChanging(true);

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
    } catch (err) {
      console.error('Failed to change currency:', err);
    } finally {
      setIsChanging(false);
    }
  }, [selectedCurrency]);

  // Manual refresh function (refetches from TanStack Query)
  const refreshRates = useCallback(async () => {
    try {
      await refetchRates();
    } catch (err) {
      console.error('Failed to refresh rates:', err);
    }
  }, [refetchRates]);

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
    return availableCurrencies?.find(c => c.code === code.toUpperCase()) || null;
  }, [availableCurrencies, selectedCurrency]);

  const currencySymbol = currencyService.getCurrencySymbol(selectedCurrency);

  const value: CurrencyContextValue = {
    // Current state
    selectedCurrency,
    currencySymbol,
    exchangeRates: exchangeRates || null,
    availableCurrencies: availableCurrencies || [],

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