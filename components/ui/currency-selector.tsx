'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, DollarSign, Loader2, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/lib/contexts/currency-context';
import { POPULAR_CURRENCIES } from '@/lib/services/currency-api';

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  showRefresh?: boolean;
  disabled?: boolean;
}

export function CurrencySelector({
  variant = 'default',
  className,
  showRefresh = true,
  disabled = false,
}: CurrencySelectorProps) {
  const {
    selectedCurrency,
    currencySymbol,
    availableCurrencies,
    isLoading,
    isChanging,
    error,
    changeCurrency,
    refreshRates,
    getCurrencyInfo,
  } = useCurrency();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort currencies
  const filteredCurrencies = useMemo(() => {
    let filtered = availableCurrencies;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (currency) =>
          currency.code.toLowerCase().includes(query) ||
          currency.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [availableCurrencies, searchQuery]);

  // Group currencies
  const groupedCurrencies = useMemo(() => {
    const popular = filteredCurrencies.filter((c) =>
      POPULAR_CURRENCIES.includes(c.code)
    );
    const others = filteredCurrencies.filter(
      (c) => !POPULAR_CURRENCIES.includes(c.code)
    );

    return { popular, others };
  }, [filteredCurrencies]);

  const currentCurrency = getCurrencyInfo();

  const handleCurrencyChange = async (currencyCode: string) => {
    try {
      await changeCurrency(currencyCode);
      setOpen(false);
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to change currency:', err);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshRates();
    } catch (err) {
      console.error('Failed to refresh rates:', err);
    }
  };

  console.log('CurrencySelector render:', filteredCurrencies )
  // Compact variant (for mobile/tight spaces)
  if (variant === 'compact') {
    const popularCurrencies = availableCurrencies.filter(c => POPULAR_CURRENCIES.includes(c.code));

    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Select
          value={selectedCurrency}
          onValueChange={handleCurrencyChange}
          disabled={disabled || isChanging}
        >
          <SelectTrigger className="w-full h-5 text-xs">
            <SelectValue>
              {isChanging ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className=" text-xs">{currencySymbol}</span>
                  <span className=" text-xs font-medium">{selectedCurrency}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {popularCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code} className='cursor-pointer'>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{currency.symbol}</span>
                  <span className="text-xs font-mono ">{currency.code}</span>
                  <span className="text-xs font-medium text-lime-700 truncate">- {Number(currency.rate).toFixed(2)}</span>
              
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Minimal variant (just symbol + code) - using Select instead of Popover for now
  if (variant === 'minimal') {
    const popularCurrencies = availableCurrencies.filter(c => POPULAR_CURRENCIES.includes(c.code));

    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Select
          value={selectedCurrency}
          onValueChange={handleCurrencyChange}
          disabled={disabled || isChanging}
        >
          <SelectTrigger className="w-auto h-8 px-2 gap-1 text-xs font-mono border-0 bg-transparent hover:bg-muted/80">
            <SelectValue>
              {isChanging ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className="flex items-center gap-1">
                  <span>{currencySymbol}</span>
                  <span>{selectedCurrency}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {popularCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center gap-2">
                  <span className="text-lg w-6">{currency.symbol}</span>
                  <span className="font-mono">{currency.code}</span>
                  <span className="text-xs text-muted-foreground">{currency.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Default variant (full feature)
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-w-[160px]"
            disabled={disabled || isChanging}
          >
            {isChanging ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Changing...</span>
              </div>
            ) : currentCurrency ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentCurrency.symbol}</span>
                <div className="flex flex-col text-left">
                  <span className="font-semibold">{currentCurrency.code}</span>
                  {currentCurrency.name && (
                    <span className="text-xs text-muted-foreground truncate">
                      {currentCurrency.name}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Select currency</span>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search currencies..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-10 w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <CommandList className="max-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading currencies...</span>
                </div>
              ) : filteredCurrencies.length === 0 ? (
                <CommandEmpty>No currencies found.</CommandEmpty>
              ) : (
                <>
                  {/* Popular currencies */}
                  {groupedCurrencies.popular.length > 0 && (
                    <CommandGroup heading="Popular">
                      {groupedCurrencies.popular.map((currency) => (
                        <CommandItem
                          key={currency.code}
                          value={currency.code}
                          onSelect={() => handleCurrencyChange(currency.code)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center">
                              {currency.symbol}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium">{currency.code}</span>
                              {currency.name && (
                                <span className="text-xs text-muted-foreground">
                                  {currency.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {currency.rate.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              })}
                            </Badge>
                            {currency.code === selectedCurrency && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Other currencies */}
                  {groupedCurrencies.others.length > 0 && (
                    <CommandGroup heading="All Currencies">
                      {groupedCurrencies.others.map((currency) => (
                        <CommandItem
                          key={currency.code}
                          value={currency.code}
                          onSelect={() => handleCurrencyChange(currency.code)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center">
                              {currency.symbol}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium">{currency.code}</span>
                              {currency.name && (
                                <span className="text-xs text-muted-foreground">
                                  {currency.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {currency.rate.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4,
                              })}
                            </Badge>
                            {currency.code === selectedCurrency && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>

            {/* Footer with refresh */}
            {showRefresh && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full text-xs"
                >
                  <RefreshCw className={cn("h-3 w-3 mr-2", isLoading && "animate-spin")} />
                  Refresh Rates
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <div className="text-xs text-red-500 max-w-[200px] truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
}