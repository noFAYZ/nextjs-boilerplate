"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ComboboxOption {
  value: string
  label: string
  searchValue?: string
  logo?: string | null
}

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'outline2' | 'outlinemuted' | 'outlinemuted2' | 'ghost' | 'link' | 'brand' | 'soft'

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  buttonVariant?: ButtonVariant
  buttonClassName?: string
  popoverWidth?: string
  popoverStyle?: React.CSSProperties
}

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

function normalizeLabel(label?: string) {
  return label?.trim() ?? ""
}

function buildSearchValue(option: ComboboxOption) {
  return `${normalizeLabel(option.label)} ${option.searchValue ?? ""}`
    .toLowerCase()
    .trim()
}

/* -------------------------------------------------------------------------- */
/* ComboboxItem Component                                                     */
/* -------------------------------------------------------------------------- */

interface ComboboxItemProps {
  option: ComboboxOption
  isSelected: boolean
  onSelect: (value: string) => void
}

const ComboboxItem = React.memo(function ComboboxItem({
  option,
  isSelected,
  onSelect,
}: ComboboxItemProps) {
  const label = normalizeLabel(option.label)

  return (
    <CommandItem
      key={option.value}
      value={buildSearchValue(option)}
      onSelect={() => onSelect(option.value)}
      className="cursor-pointer"
    >
      <div className="flex items-center flex-1">
        {option.logo ? (
          <Avatar className="mr-2 h-6 w-6 border flex-shrink-0">
            <AvatarImage src={option.logo} alt={label || "Option"} />
            <AvatarFallback>{label.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : null}
        <span className="truncate text-xs">{label}</span>
      </div>
      <Check
        className={cn("mr-2 h-4 w-4 flex-shrink-0", isSelected ? "opacity-100" : "opacity-0")}
      />
    </CommandItem>
  )
})

/* -------------------------------------------------------------------------- */
/* Combobox Component                                                         */
/* -------------------------------------------------------------------------- */

function ComboboxComponent({
  options,
  value,
  onSelect,
  placeholder = "Select option",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found",
  disabled = false,
  className,
  buttonVariant = "outlinemuted2",
  buttonClassName,
  popoverWidth = "w-[320px]",
  popoverStyle,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  )

  const displayLabel = normalizeLabel(selectedOption?.label)

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (disabled) return
      onSelect(selectedValue)
      setOpen(false)
    },
    [disabled, onSelect]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full max-w-full justify-start gap-2 px-2 py-1 h-auto overflow-hidden border border-transparent hover:border-border",
            className,
            buttonClassName
          )}
        >
          {selectedOption?.logo && (
            <Avatar className="h-7 w-7 rounded-full border border-border flex-shrink-0">
              <AvatarImage
                src={selectedOption.logo}
                alt={selectedOption.label || "Option"}
                className="rounded-full"
              />
              <AvatarFallback className="bg-card rounded-full">
                {selectedOption.label.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="truncate">{displayLabel || placeholder}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(popoverWidth, "p-0")} style={popoverStyle}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-[260px]">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <ComboboxItem
                  key={option.value}
                  option={option}
                  isSelected={value === option.value}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const Combobox = React.memo(ComboboxComponent)

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useCombobox(initialValue = "") {
  const [value, setValue] = React.useState(initialValue)

  const onSelect = React.useCallback((next: string) => {
    setValue(next)
  }, [])

  return {
    value,
    onSelect,
    setValue,
  }
}
