'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { cn } from '@/lib/utils';

export type TimePeriod = 'this_week' | 'this_month' | 'last_6_months' | 'this_year';

export interface TimePeriodOption {
  value: TimePeriod;
  label: string;
}

export const TIME_PERIOD_OPTIONS: TimePeriodOption[] = [
  { value: 'this_week', label: 'Week' },
  { value: 'this_month', label: 'Month' },
  { value: 'last_6_months', label: '6 Months' },
  { value: 'this_year', label: 'Year' },
];

export interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'default';
  variant?: 'default' | 'ghost';
  showIcon?: boolean;
  options?: TimePeriodOption[];
}

export function TimePeriodSelector({
  value,
  onChange,
  className,
  size = 'xs',
  variant = 'ghost',
  showIcon = true,
  options = TIME_PERIOD_OPTIONS,
}: TimePeriodSelectorProps) {
  const selectedOption = options.find(opt => opt.value === value);

  const sizeClasses = {
    xs: 'text-[10px] h-6 px-2 gap-1',
    sm: 'text-xs h-7 px-2.5 gap-1.5',
    default: 'text-sm h-9 px-3 gap-2',
  };

  const variantClasses = {
    default: 'border border-border bg-background hover:bg-accent',
    ghost: 'hover:bg-accent/60',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {showIcon && <Calendar className="h-3 w-3" />}
        <span className="truncate">{selectedOption?.label || 'Select Period'}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-28">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer text-xs',
              value === option.value && 'bg-accent'
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
