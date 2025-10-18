"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  onDateChange?: (date: Date | undefined) => void // Support both prop names
  placeholder?: string
  disabled?: boolean
  className?: string
  disablePastDates?: boolean // New prop to disable past dates
  minDate?: Date // Minimum selectable date
  maxDate?: Date // Maximum selectable date
}

export function DatePicker({
  date,
  onSelect,
  onDateChange,
  placeholder = "Pick a date",
  disabled,
  className,
  disablePastDates = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  // Use onDateChange if provided, otherwise fall back to onSelect
  const handleDateChange = onDateChange || onSelect;

  // Calculate disabled dates
  const getDisabledDates = React.useCallback((dateToCheck: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if past dates should be disabled
    if (disablePastDates && dateToCheck < today) {
      return true;
    }

    // Check against minDate
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (dateToCheck < min) {
        return true;
      }
    }

    // Check against maxDate
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (dateToCheck > max) {
        return true;
      }
    }

    return false;
  }, [disablePastDates, minDate, maxDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
          disabled={disabled ? true : getDisabledDates}
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  from?: Date
  to?: Date
  onSelect?: (range: { from?: Date; to?: Date }) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  from,
  to,
  onSelect,
  placeholder = "Pick a date range",
  disabled,
  className,
}: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !from && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? (
              <>
                {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
              </>
            ) : (
              format(from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={from}
          selected={{ from, to }}
          onSelect={(range) => onSelect?.(range || {})}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}