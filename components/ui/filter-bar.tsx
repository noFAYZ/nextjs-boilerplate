"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, ChevronDown, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

const filterBarVariants = cva(
  "flex items-center gap-2 p-4 border-b bg-background",
  {
    variants: {
      variant: {
        default: "",
        compact: "p-2",
        floating: "rounded-lg border shadow-sm bg-card",
      },
      orientation: {
        horizontal: "flex-row flex-wrap",
        vertical: "flex-col items-start",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
    },
  }
)

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export type FilterValue = string | string[] | boolean | { from: Date; to: Date } | { min: number; max: number } | null

export interface FilterConfig {
  id: string
  label: string
  type: "select" | "multiselect" | "daterange" | "numberrange" | "search" | "checkbox"
  options?: FilterOption[]
  placeholder?: string
  icon?: React.ReactNode
  defaultValue?: FilterValue
}

export interface ActiveFilter {
  id: string
  label: string
  value: FilterValue
  displayValue: string
}

interface FilterBarProps extends VariantProps<typeof filterBarVariants> {
  filters: FilterConfig[]
  activeFilters: Record<string, FilterValue>
  onFilterChange: (filterId: string, value: FilterValue) => void
  onClearAll?: () => void
  showActiveFilters?: boolean
  showClearAll?: boolean
  className?: string
}

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  showActiveFilters = true,
  showClearAll = true,
  variant,
  orientation,
  className,
}: FilterBarProps) {
  const getActiveFiltersList = (): ActiveFilter[] => {
    return Object.entries(activeFilters)
      .filter(([_, value]) => {
        if (value === null || value === undefined || value === "") return false
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === "object" && value.from && value.to) return true
        return true
      })
      .map(([id, value]) => {
        const filter = filters.find(f => f.id === id)
        let displayValue = ""
        
        if (Array.isArray(value)) {
          displayValue = value.map(v => {
            const option = filter?.options?.find(opt => opt.value === v)
            return option?.label || v
          }).join(", ")
        } else if (typeof value === "object" && value.from && value.to) {
          displayValue = `${format(value.from, "MMM dd")} - ${format(value.to, "MMM dd")}`
        } else {
          const option = filter?.options?.find(opt => opt.value === value)
          displayValue = option?.label || String(value)
        }

        return {
          id,
          label: filter?.label || id,
          value,
          displayValue,
        }
      })
  }

  const activeFiltersList = getActiveFiltersList()

  const renderFilter = (filter: FilterConfig) => {
    const currentValue = activeFilters[filter.id]

    switch (filter.type) {
      case "select":
        return (
          <SelectFilter
            key={filter.id}
            filter={filter}
            value={currentValue}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        )

      case "multiselect":
        return (
          <MultiSelectFilter
            key={filter.id}
            filter={filter}
            value={currentValue || []}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        )

      case "daterange":
        return (
          <DateRangeFilter
            key={filter.id}
            filter={filter}
            value={currentValue}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        )

      case "numberrange":
        return (
          <NumberRangeFilter
            key={filter.id}
            filter={filter}
            value={currentValue}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        )

      case "search":
        return (
          <SearchFilter
            key={filter.id}
            filter={filter}
            value={currentValue}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        )

      case "checkbox":
        return (
          <CheckboxFilter
            key={filter.id}
            filter={filter}
            value={currentValue}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      {/* Filter Controls */}
      <div className={cn(filterBarVariants({ variant, orientation, className }))}>
        {filters.map(renderFilter)}
        
        {showClearAll && activeFiltersList.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="ml-auto"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {showActiveFilters && activeFiltersList.length > 0 && (
        <div className="flex items-center gap-2 px-4 pb-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-1">
            {activeFiltersList.map((filter) => (
              <Badge
                key={`${filter.id}-${filter.value}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span className="text-xs">
                  {filter.label}: {filter.displayValue}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => onFilterChange(filter.id, null)}
                >
                  <X className="size-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Individual Filter Components

function SelectFilter({ filter, value, onChange }: {
  filter: FilterConfig
  value: string
  onChange: (value: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          {filter.icon && <span className="mr-2">{filter.icon}</span>}
          {value ? filter.options?.find(opt => opt.value === value)?.label : filter.label}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value || ""} onValueChange={onChange}>
          <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
          {filter.options?.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {option.count && (
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                )}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MultiSelectFilter({ filter, value, onChange }: {
  filter: FilterConfig
  value: string[]
  onChange: (value: string[]) => void
}) {
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          {filter.icon && <span className="mr-2">{filter.icon}</span>}
          {value.length > 0 ? `${filter.label} (${value.length})` : filter.label}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filter.options?.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
          >
            <div className="flex items-center justify-between w-full">
              <span>{option.label}</span>
              {option.count && (
                <Badge variant="secondary" className="text-xs">
                  {option.count}
                </Badge>
              )}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DateRangeFilter({ filter, value, onChange }: {
  filter: FilterConfig
  value: { from: Date; to: Date } | null
  onChange: (value: { from: Date; to: Date } | null) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between min-w-48">
          <Calendar className="mr-2 size-4" />
          {value ? (
            `${format(value.from, "MMM dd")} - ${format(value.to, "MMM dd")}`
          ) : (
            filter.label
          )}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="range"
          selected={value}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onChange({ from: range.from, to: range.to })
              setIsOpen(false)
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

function NumberRangeFilter({ filter, value, onChange }: {
  filter: FilterConfig
  value: { min: number; max: number } | null
  onChange: (value: { min: number; max: number } | null) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(value || { min: 0, max: 100 })

  const handleApply = () => {
    onChange(localValue)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between">
          {filter.icon && <span className="mr-2">{filter.icon}</span>}
          {value ? `${value.min} - ${value.max}` : filter.label}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">{filter.label}</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="min">Min</Label>
              <Input
                id="min"
                type="number"
                value={localValue.min}
                onChange={(e) => setLocalValue({ ...localValue, min: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="max">Max</Label>
              <Input
                id="max"
                type="number"
                value={localValue.max}
                onChange={(e) => setLocalValue({ ...localValue, max: Number(e.target.value) })}
                placeholder="100"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SearchFilter({ filter, value, onChange }: {
  filter: FilterConfig
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium whitespace-nowrap">{filter.label}:</Label>
      <Input
        type="search"
        placeholder={filter.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-48"
      />
    </div>
  )
}

function CheckboxFilter({ filter, value, onChange }: {
  filter: FilterConfig
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Button
      variant={value ? "default" : "outline"}
      size="sm"
      onClick={() => onChange(!value)}
      className="flex items-center gap-2"
    >
      {filter.icon && filter.icon}
      {filter.label}
    </Button>
  )
}

export { filterBarVariants }