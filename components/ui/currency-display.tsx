'use client';

import { useCurrency, useCurrencyFormat } from '@/lib/contexts/currency-context';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrencyDisplayProps {
  /** Amount in USD */
  amountUSD: number;
  /** Show currency symbol (default: true) */
  showSymbol?: boolean;
  /** Custom className */
  className?: string;
  /** Show loading skeleton */
  isLoading?: boolean;
  /** Number format options */
  formatOptions?: Intl.NumberFormatOptions;
  /** Color coding based on positive/negative values */
  colorCoded?: boolean;
  /** Variant styling */
  variant?: 'default' | 'large' | 'small' | 'compact';
}

export function CurrencyDisplay({
  amountUSD,
  showSymbol = true,
  className,
  isLoading = false,
  formatOptions,
  colorCoded = false,
  variant = 'default',
}: CurrencyDisplayProps) {
  const { convertFromUSD, isLoading: currencyLoading, error } = useCurrency();
  const { formatAmount, currencySymbol, selectedCurrency } = useCurrencyFormat();

  if (isLoading || currencyLoading) {
    const skeletonClass = cn(
      'inline-block',
      {
        'h-8 w-24': variant === 'large',
        'h-6 w-20': variant === 'default',
        'h-4 w-16': variant === 'small',
        'h-3 w-12': variant === 'compact',
      },
      className
    );
    return <Skeleton className={skeletonClass} />;
  }

  if (error) {
    return (
      <span className={cn('text-muted-foreground', className)}>
        ${amountUSD?.toLocaleString()}
      </span>
    );
  }

  // Convert from USD to selected currency
  const convertedAmount = convertFromUSD(amountUSD);

  // Format the amount
  const formattedAmount = showSymbol
    ? formatAmount(convertedAmount, formatOptions)
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...formatOptions,
      }).format(convertedAmount);

  // Split integer and decimal parts for styling
  const [integerPart, decimalPart] = formattedAmount.split('.');

  const baseClass = cn(
    'font-medium',
    {
      // Variant styles
      'text-2xl font-bold': variant === 'large',
      'text-base': variant === 'default',
      'text-sm': variant === 'small',
      'text-xs': variant === 'compact',

      // Color coding
      'text-green-600 dark:text-green-400': colorCoded && amountUSD > 0,
      'text-red-600 dark:text-red-400': colorCoded && amountUSD < 0,
      'text-muted-foreground': colorCoded && amountUSD === 0,
    },
    className
  );

  const decimalClass = cn(
    'font-medium',
    {
      // Variant styles
      'text-xl font-bold': variant === 'large',
      'text-sm': variant === 'default',
      'text-xs': variant === 'small',
      'text-[11px]': variant === 'compact',

      // Color coding
      'text-green-600 dark:text-green-400': colorCoded && amountUSD > 0,
      'text-red-600 dark:text-red-400': colorCoded && amountUSD < 0,
      'text-muted-foreground': colorCoded && amountUSD === 0,
    },
    className
  );

  return (
    <span className={baseClass} title={`${amountUSD?.toLocaleString()} USD`}>
      {integerPart}
      {decimalPart && (
        <span className={`${decimalClass} text-muted-foreground `}>.{decimalPart}</span>
      )}
    </span>
  );
}

interface CurrencySymbolProps {
  currency?: string;
  className?: string;
}

export function CurrencySymbol({ currency, className }: CurrencySymbolProps) {
  const { currencySymbol, selectedCurrency } = useCurrencyFormat();

  const symbol = currency
    ? (() => {
        try {
          const { currencyService } = require('@/lib/services/currency-api');
          return currencyService.getCurrencySymbol(currency);
        } catch {
          return currency;
        }
      })()
    : currencySymbol;

  return <span className={className}>{symbol}</span>;
}

interface CurrencyCodeProps {
  className?: string;
}

export function CurrencyCode({ className }: CurrencyCodeProps) {
  const { selectedCurrency } = useCurrencyFormat();
  return <span className={cn('font-mono text-xs', className)}>{selectedCurrency}</span>;
}

interface CurrencyInfoProps {
  showCode?: boolean;
  showSymbol?: boolean;
  className?: string;
  separator?: string;
}

export function CurrencyInfo({
  showCode = true,
  showSymbol = true,
  className,
  separator = ' ',
}: CurrencyInfoProps) {
  const { currencySymbol, selectedCurrency } = useCurrencyFormat();

  const parts = [];
  if (showSymbol) parts.push(currencySymbol);
  if (showCode) parts.push(selectedCurrency);

  return (
    <span className={cn('font-medium', className)}>
      {parts.join(separator)}
    </span>
  );
}
