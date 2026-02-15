'use client';

/**
 * Transactions Filter Sidebar
 *
 * Modern floating sidebar with date range picker and select filters
 * Features:
 * - Date range picker
 * - shadcn/ui Select components
 * - Sticky floating behavior
 * - Clean minimal design
 */

import React, { memo, useState } from 'react';
import { X, Calendar, RotateCcw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';

export interface TransactionsFilterSidebarProps {
  typeFilter: string;
  statusFilter: string;
  sourceFilter: string;
  categoryFilter: string;
  accountFilter: string;
  merchantFilter: string;
  amountMin?: number;
  amountMax?: number;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSourceFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onAccountFilterChange: (value: string) => void;
  onMerchantFilterChange: (value: string) => void;
  onAmountMinChange: (value?: number) => void;
  onAmountMaxChange: (value?: number) => void;
  dateRange: { from?: Date; to?: Date } | null;
  onDateRangeChange: (from?: Date, to?: Date) => void;
  onClearDateRange: () => void;
  categories: any[];
  accounts: any[];
  merchants: any[];
  isCategoriesLoading?: boolean;
  isAccountsLoading?: boolean;
  isMerchantsLoading?: boolean;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}

const TRANSACTION_TYPES = [
  { value: 'SEND', label: 'Send' },
  { value: 'RECEIVE', label: 'Receive' },
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'EXPENSE', label: 'Expense' },
  { value: 'INCOME', label: 'Income' },
  { value: 'SWAP', label: 'Swap' },
];

const TRANSACTION_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
];

const TRANSACTION_SOURCES = [
  { value: 'BANKING', label: 'Banking' },
  { value: 'CRYPTO', label: 'Crypto' },
];

function TransactionsFilterSidebarComponent({
  typeFilter,
  statusFilter,
  sourceFilter,
  categoryFilter,
  accountFilter,
  merchantFilter,
  amountMin,
  amountMax,
  onTypeFilterChange,
  onStatusFilterChange,
  onSourceFilterChange,
  onCategoryFilterChange,
  onAccountFilterChange,
  onMerchantFilterChange,
  onAmountMinChange,
  onAmountMaxChange,
  dateRange,
  onDateRangeChange,
  onClearDateRange,
  categories,
  accounts,
  merchants,
  isCategoriesLoading = false,
  isAccountsLoading = false,
  isMerchantsLoading = false,
  hasActiveFilters,
  onClearAllFilters,
}: TransactionsFilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDateRange = dateRange?.from || dateRange?.to;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onDateRangeChange(range?.from, range?.to);
  };

  return (
    <div className="hidden lg:flex flex-col w-80 sticky">
      {/* Header */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-2.5 ">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Filter className="h-4 w-4 " />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground -mb-1">Filters</h3>
              <Badge variant={hasActiveFilters  ? 'success' : 'muted'} size='sm' >
                {hasActiveFilters ? 'Active' : 'None'}
              </Badge>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-8 w-8 p-0 hover:bg-muted/60"
              title="Reset all filters"
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>
       
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Range Picker */}
        <div className="space-y-1 ">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Date Range
          </label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline3"
                className="w-full justify-start text-left font-normal  hover:bg-muted border-border "
              >
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'MMM dd')} -{' '}
                        {format(dateRange.to, 'MMM dd')}
                      </>
                    ) : (
                      format(dateRange.from, 'MMM dd, yyyy')
                    )
                  ) : (
                    'Select dates'
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange as DateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Separator   />

        {/* Type Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Type
          </label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-full" variant='outline3'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Status
          </label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full" variant='outline3'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {TRANSACTION_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Source Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Source
          </label>
          <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
            <SelectTrigger className="w-full" variant='outline3'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {TRANSACTION_SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Account Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Account
          </label>
          <Select value={accountFilter} onValueChange={onAccountFilterChange} disabled={isAccountsLoading}>
            <SelectTrigger className="w-full" variant='outline3'>
              <SelectValue placeholder={isAccountsLoading ? "Loading accounts..." : "All Accounts"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {isAccountsLoading ? (
                <SelectItem value="__loading" disabled className="text-xs">Loading accounts...</SelectItem>
              ) : accounts && accounts.length > 0 ? (
                accounts.map((account: any) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled className="text-xs">No accounts available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Category
          </label>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange} disabled={isCategoriesLoading}>
            <SelectTrigger className="w-full" variant='outline3'>
              <SelectValue placeholder={isCategoriesLoading ? "Loading categories..." : "All Categories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {isCategoriesLoading ? (
                <SelectItem value="__loading" disabled className="text-xs">Loading categories...</SelectItem>
              ) : categories && categories.length > 0 ? (
                categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled className="text-xs">No categories available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Merchant Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Merchant
          </label>
          <Select value={merchantFilter} onValueChange={onMerchantFilterChange} disabled={isMerchantsLoading}>
            <SelectTrigger className="w-full" variant='outline3'>
              <SelectValue placeholder={isMerchantsLoading ? "Loading merchants..." : "All Merchants"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Merchants</SelectItem>
              {isMerchantsLoading ? (
                <SelectItem value="__loading" disabled className="text-xs">Loading merchants...</SelectItem>
              ) : merchants && merchants.length > 0 ? (
                merchants.map((merchant: any) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled className="text-xs">No merchants available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <Separator  />

        {/* Amount Range Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide block">
            Amount Range
          </label>
          <div className="space-y-3">
            <Slider
              value={[amountMin ?? 0, amountMax ?? 10000]}
              onValueChange={(values) => {
                onAmountMinChange(values[0] > 0 ? values[0] : undefined);
                onAmountMaxChange(values[1] < 10000 ? values[1] : undefined);
              }}
              min={0}
              max={10000}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={amountMin ?? ''}
                  onChange={(e) => onAmountMinChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="h-8 w-22 text-xs"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={amountMax ?? ''}
                  onChange={(e) => onAmountMaxChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="h-8 w-22 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer 
      {hasActiveFilters && (
        <>
          <Separator className="bg-border/50" />
          <div className="px-5 py-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAllFilters}
              className="w-full text-xs bg-muted/40 hover:bg-muted/60 border-border/50 h-8"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Clear All
            </Button>
          </div>
        </>
      )}*/}
    </div>
  );
}

export const TransactionsFilterSidebar = memo(TransactionsFilterSidebarComponent);
