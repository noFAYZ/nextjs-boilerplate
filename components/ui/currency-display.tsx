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
  variant?: 'default' | 'large' | 'small' | 'compact' | 'xl' | '2xl' | 'lg' | '3xl';
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
  const { formatAmount, currencySymbol } = useCurrencyFormat();

  // Loading skeleton
  if (isLoading || currencyLoading) {
    const skeletonClass = cn(
      'inline-block',
      {
        'h-20 w-60': variant === '3xl',
        'h-12 w-32': variant === '2xl',
        'h-10 w-28': variant === 'xl',
        'h-8 w-24': variant === 'large',
        'h-7 w-20': variant === 'lg',
        'h-6 w-20': variant === 'default',
        'h-4 w-16': variant === 'small',
        'h-3 w-12': variant === 'compact',
      },
      className
    );
    return <Skeleton className={skeletonClass} />;
  }

  // Error fallback
  if (error) {
    return (
      <span className={cn('text-muted-foreground', className)}>
        ${amountUSD?.toLocaleString()}
      </span>
    );
  }

  // Convert from USD to selected currency
  const convertedAmount = convertFromUSD(amountUSD);

  // Absolute value for formatting
  const absoluteAmount = Math.abs(convertedAmount);

  // Format the amount
  const formattedAmount = showSymbol
    ? formatAmount(absoluteAmount, formatOptions)
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...formatOptions,
      }).format(absoluteAmount);

  // Split integer and decimal parts
  const [integerPart, decimalPart] = formattedAmount.split('.');

  // Determine sign
  const sign = convertedAmount < 0 ? '-' : '';

  // Base styling
  const baseClass = cn(
    'font-medium',
    {
      'text-6xl font-medium': variant === '3xl',
      'text-4xl font-medium': variant === '2xl',
      'text-3xl font-bold': variant === 'xl',
      'text-2xl font-bold': variant === 'large',
      'text-lg': variant === 'lg',
      'text-base': variant === 'default',
      'text-[14px]': variant === 'small',
      'text-xs': variant === 'compact',

      // Color coding for positive/negative/zero
      'text-green-600 dark:text-green-400': colorCoded && convertedAmount > 0,
      'text-red-600 dark:text-red-400': colorCoded && convertedAmount < 0,
      'text-muted-foreground': colorCoded && convertedAmount == 0,
    },
    className
  );

  // Decimal styling (optional: inherit color from integer part)
  const decimalClass = cn(
    'font-medium',
    {
      'text-3xl font-medium': variant === '3xl',
      'text-xl font-medium': variant === '2xl',
      'text-lg font-bold': variant === 'xl',
      'text-sm font-bold': variant === 'large',
      'text-[12px]': variant === 'lg',
      'text-[11px]': variant === 'default',
      'text-[10px]': variant === 'small',
      'text-[9px]': variant === 'compact',

      // Decimal inherits main color
      'text-green-600 dark:text-green-400': colorCoded && convertedAmount > 0,
      'text-red-600 dark:text-red-400': colorCoded && convertedAmount < 0,
      'text-muted-foreground': colorCoded && convertedAmount == 0,
    }
  );

  return (
    <span className={baseClass} title={`${amountUSD?.toLocaleString()} USD`}>
      {sign}
      {integerPart}
      {decimalPart && (
        <span className={decimalClass}>.{decimalPart}</span>
      )}
    </span>
  );
}
