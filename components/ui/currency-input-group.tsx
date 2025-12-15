'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/lib/contexts/currency-context';
import { POPULAR_CURRENCIES } from '@/lib/services/currency-api';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

const currencyInputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 border bg-background/50 backdrop-blur-sm text-base transition-all duration-75 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: 'border-input rounded-lg shadow-sm hover:shadow-md focus-within:ring-0 focus-within:ring-primary/60 focus-within:ring-offset-0 focus-within:border-primary/60',
        filled: 'bg-muted border-transparent rounded-lg hover:bg-muted/80',
        underlined: 'border-0 border-b-2 border-input rounded-none bg-transparent hover:border-border focus-within:border-primary shadow-none',
        premium: 'border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-purple-500 focus-within:border-purple-500',
        enterprise: 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-slate-500 focus-within:border-slate-500 backdrop-blur-sm',
      },
      size: {
        sm: 'h-8 px-3 py-1 text-sm rounded-md',
        default: 'h-9 px-3 py-2',
        lg: 'h-10 px-4 py-2 text-base',
        xl: 'h-12 px-6 py-3 text-lg',
      },
      state: {
        default: '',
        error: 'border-destructive focus-within:ring-destructive focus-within:border-destructive',
        success: 'border-emerald-500 focus-within:ring-emerald-500 focus-within:border-emerald-500',
        warning: 'border-amber-500 focus-within:ring-amber-500 focus-within:border-amber-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>, VariantProps<typeof currencyInputVariants> {
  value?: number | string;
  onAmountChange?: (value: string) => void;
  currencyProps?: {
    disabled?: boolean;
    setValue?: UseFormSetValue<Record<string, unknown>>;
    watch?: UseFormWatch<Record<string, unknown>>;
    name?: string;
  };
  label?: string;
  labelClassName?: string;
  errorMessage?: string;
  clearable?: boolean;
  onClear?: () => void;
  register?: UseFormRegister<Record<string, unknown>>;
  name?: string;
}

export function CurrencyInput({
  className,
  variant = 'default',
  size = 'default',
  state = 'default',
  value,
  onAmountChange,
  currencyProps = { disabled: false, name: 'currency' },
  label,
  labelClassName,
  errorMessage,
  clearable = false,
  onClear,
  id,
  disabled = false,
  register,
  name = 'amount',
  ...inputProps
}: CurrencyInputProps) {
  const { availableCurrencies, isChanging } = useCurrency();
  const [open, setOpen] = React.useState(false);
  const inputId = id || React.useId();

  // Watch the form's currency field to control the Select value
  const currencyValue = currencyProps.watch && currencyProps.name ? currencyProps.watch(currencyProps.name) || 'USD' : 'USD';

  // Initialize form's currency field to USD if not set
  React.useEffect(() => {
    if (currencyProps.setValue && currencyProps.name && !currencyProps.watch?.(currencyProps.name)) {
      currencyProps.setValue(currencyProps.name, 'USD');
    }
  }, [currencyProps.setValue, currencyProps.name, currencyProps.watch]);

  const handleCurrencyChange = (currencyCode: string) => {
    if (currencyProps.setValue && currencyProps.name) {
      currencyProps.setValue(currencyProps.name, currencyCode); // Update form state
    }
    setOpen(false);
  };

  const handleClear = () => {
    if (currencyProps.setValue && name) {
      currencyProps.setValue(name, '');
    }
    onClear?.();
    onAmountChange?.('');
  };

  // Filter popular currencies
  const popularCurrencies = availableCurrencies.filter((c) => POPULAR_CURRENCIES.includes(c.code));

  const inputElement = (
    <div className={cn(
      currencyInputVariants({ variant, size, state }),
      'relative flex items-center w-full', // Ensure relative width
      className
    )}>
      <Select
        value={currencyValue} // Controlled by form state
        onValueChange={handleCurrencyChange}
        disabled={disabled || currencyProps.disabled || isChanging}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 h-full border-0 bg-transparent rounded-none focus:ring-0 focus:ring-offset-0 pl-3 pr-2',
            size === 'sm' && 'text-xs',
            size === 'lg' && 'text-base',
            size === 'xl' && 'text-lg'
          )}
          aria-label="Select currency"
        >
          <SelectValue>
            {isChanging ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-1 text-md font-medium">
              {popularCurrencies.find(c => c.code === currencyValue)?.symbol || '$'}
               
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {popularCurrencies.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No currencies available</div>
          ) : (
            popularCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <span className="text-md w-6 font-medium">{currency.symbol}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">{currency.code}</span>
                     
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <input
        id={inputId}
        type="text"
        inputMode="decimal"
        placeholder="15.99"
        disabled={disabled || isChanging}
        className={cn(
          'flex-1 bg-transparent outline-none w-full', // Ensure input takes full width
          variant === 'underlined' ? 'pl-20 pr-10' : 'pl-12 pr-10'
        )}
        aria-label={label || 'Amount'}
        aria-invalid={state === 'error'}
        {...(register && name ? register(name, {
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
          pattern: {
            value: /^-?\d*\.?\d{0,2}$/,
            message: 'Amount must have at most 2 decimal places',
          },
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            onAmountChange?.(e.target.value);
          },
        }) : { value, onChange: onAmountChange })}
        {...inputProps}
      />

      {clearable && currencyProps.watch && name && currencyProps.watch(name) && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
          aria-label="Clear amount"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5 w-full"> {/* Ensure outer container fits relatively */}
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-foreground',
            state === 'error' && 'text-destructive',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      {inputElement}
      {errorMessage && (
        <span className="text-xs text-destructive mt-1">{errorMessage}</span>
      )}
    </div>
  );
}