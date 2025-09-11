"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value?: number
  onChange?: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  showControls?: boolean
  controlsVariant?: "default" | "ghost"
  formatValue?: (value: number) => string
  parseValue?: (value: string) => number
  prefix?: string
  suffix?: string
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({
    className,
    value,
    onChange,
    min,
    max,
    step = 1,
    precision,
    showControls = false,
    controlsVariant = "default",
    formatValue,
    parseValue,
    prefix,
    suffix,
    disabled,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      value?.toString() || ""
    )

    const [focused, setFocused] = React.useState(false)

    React.useEffect(() => {
      if (!focused) {
        setInternalValue(value?.toString() || "")
      }
    }, [value, focused])

    const formatDisplayValue = (num: number) => {
      if (formatValue) return formatValue(num)
      if (precision !== undefined) return num.toFixed(precision)
      return num.toString()
    }

    const parseInputValue = (str: string) => {
      if (parseValue) return parseValue(str)
      const parsed = parseFloat(str)
      return isNaN(parsed) ? undefined : parsed
    }

    const validateValue = (val: number) => {
      if (min !== undefined && val < min) return min
      if (max !== undefined && val > max) return max
      return val
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setInternalValue(inputValue)
      
      const parsed = parseInputValue(inputValue)
      if (parsed !== undefined) {
        const validated = validateValue(parsed)
        onChange?.(validated)
      } else if (inputValue === "") {
        onChange?.(undefined)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      const parsed = parseInputValue(e.target.value)
      if (parsed !== undefined) {
        const validated = validateValue(parsed)
        setInternalValue(formatDisplayValue(validated))
        onChange?.(validated)
      }
      props.onBlur?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      props.onFocus?.(e)
    }

    const increment = () => {
      const currentValue = value || 0
      const newValue = validateValue(currentValue + step)
      onChange?.(newValue)
    }

    const decrement = () => {
      const currentValue = value || 0
      const newValue = validateValue(currentValue - step)
      onChange?.(newValue)
    }

    const displayValue = focused 
      ? internalValue 
      : value !== undefined 
        ? formatDisplayValue(value)
        : ""

    const fullDisplayValue = `${prefix || ""}${displayValue}${suffix || ""}`

    if (showControls) {
      return (
        <div className="flex items-center">
          <Button
            type="button"
            variant={controlsVariant}
            size="sm"
            onClick={decrement}
            disabled={disabled || (min !== undefined && (value || 0) <= min)}
            className="h-10 w-10 rounded-r-none border-r-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            {...props}
            ref={ref}
            type="text"
            inputMode="decimal"
            value={focused ? internalValue : fullDisplayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            className={cn(
              "rounded-none text-center",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              className
            )}
          />
          <Button
            type="button"
            variant={controlsVariant}
            size="sm"
            onClick={increment}
            disabled={disabled || (max !== undefined && (value || 0) >= max)}
            className="h-10 w-10 rounded-l-none border-l-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={focused ? internalValue : fullDisplayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        className={cn(
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export function useNumberInput(initialValue?: number) {
  const [value, setValue] = React.useState(initialValue)

  const handleChange = React.useCallback((newValue: number | undefined) => {
    setValue(newValue)
  }, [])

  const increment = React.useCallback((step = 1) => {
    setValue((prev) => (prev || 0) + step)
  }, [])

  const decrement = React.useCallback((step = 1) => {
    setValue((prev) => (prev || 0) - step)
  }, [])

  const reset = React.useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return {
    value,
    onChange: handleChange,
    increment,
    decrement,
    reset,
    setValue,
  }
}