"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
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
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Select option",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found",
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  )

  const displayLabel = normalizeLabel(selectedOption?.label)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild >
        <Button
          variant="outlinemuted2"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-start gap-2 px-2 py-1",
            className
          )}
        >
   {selectedOption?.logo ?   <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium flex-shrink-0">
          <Avatar className="h-7 w-7 rounded-full border border-border">
          <AvatarImage
           src={selectedOption.logo}
           alt={selectedOption.label || "Option"}
            className="rounded-full"
          />
          <AvatarFallback className="bg-card rounded-full">
          {selectedOption.label.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

           
          </div> : null}
     
          <span className="truncate">
            {displayLabel || placeholder}
          </span>
        
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />

          <CommandList className="max-h-[260px]">
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const label = normalizeLabel(option.label)
                const isSelected = value === option.value

                return (
                  <CommandItem
                    key={option.value}
                    value={buildSearchValue(option)}
                    onSelect={() => {
                      if (disabled) return
                      onSelect(option.value)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                 
<div className="flex">
                    {option.logo ? (
                      <Avatar className="mr-2 h-6 w-6 border">
                        <AvatarImage
                          src={option.logo}
                          alt={label || "Option"}
                        />
                        <AvatarFallback>
                          {label.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}

                    <span className="truncate text-xs">{label}</span>
</div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

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
