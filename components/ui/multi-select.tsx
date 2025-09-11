"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxItems?: number
  disabled?: boolean
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  maxItems,
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  )

  const availableOptions = options.filter(
    (option) => !selected.includes(option.value)
  )

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      if (maxItems && selected.length >= maxItems) {
        return
      }
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onChange(selected.filter((item) => item !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-10 h-auto",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 max-w-[calc(100%-2rem)]">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  variant="secondary"
                  key={option.value}
                  className="mr-1 mb-1"
                >
                  {option.icon && (
                    <option.icon className="mr-1 h-3 w-3" />
                  )}
                  {option.label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(event) => handleRemove(option.value, event)}
                  />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {availableOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4" />
                  )}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function useMultiSelect(initialSelected: string[] = []) {
  const [selected, setSelected] = React.useState<string[]>(initialSelected)

  const handleChange = React.useCallback((newSelected: string[]) => {
    setSelected(newSelected)
  }, [])

  const add = React.useCallback((value: string) => {
    setSelected((prev) => 
      prev.includes(value) ? prev : [...prev, value]
    )
  }, [])

  const remove = React.useCallback((value: string) => {
    setSelected((prev) => prev.filter((item) => item !== value))
  }, [])

  const toggle = React.useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }, [])

  const clear = React.useCallback(() => {
    setSelected([])
  }, [])

  return {
    selected,
    onChange: handleChange,
    add,
    remove,
    toggle,
    clear,
  }
}