"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Filter, SortAsc, SortDesc, Loader2, Search as SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

const searchVariants = cva(
  "relative flex items-center",
  {
    variants: {
      variant: {
        default: "w-full",
        compact: "w-auto min-w-64",
        floating: "absolute top-4 left-1/2 -translate-x-1/2 z-10",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SearchFilter {
  id: string
  label: string
  value: string | boolean | number
  type: "text" | "select" | "checkbox" | "range" | "date"
  options?: Array<{ label: string; value: string }>
}

export interface SearchSort {
  field: string
  direction: "asc" | "desc"
  label?: string
}

export interface SearchState {
  query: string
  filters: Record<string, string | boolean | number | string[]>
  sort: SearchSort | null
  page: number
  pageSize: number
}

interface SearchProps extends VariantProps<typeof searchVariants> {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (state: SearchState) => void
  filters?: SearchFilter[]
  sortOptions?: Array<{ field: string; label: string }>
  defaultSort?: SearchSort
  loading?: boolean
  results?: number
  showFilters?: boolean
  showSort?: boolean
  showResults?: boolean
  debounceMs?: number
  className?: string
}

export function Search({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  filters = [],
  sortOptions = [],
  defaultSort,
  loading = false,
  results,
  showFilters = true,
  showSort = true,
  showResults = true,
  debounceMs = 300,
  variant,
  size,
  className,
}: SearchProps) {
  const [query, setQuery] = React.useState(value)
  const [appliedFilters, setAppliedFilters] = React.useState<Record<string, string | boolean | number | string[]>>({})
  const [sort, setSort] = React.useState<SearchSort | null>(defaultSort || null)
  const [isOpen, setIsOpen] = React.useState(false)

  // Debounce search
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const debouncedSearch = React.useMemo(() => {
    
    return (searchValue: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        onChange?.(searchValue)
        onSearch?.({
          query: searchValue,
          filters: appliedFilters,
          sort,
          page: 1,
          pageSize: 10,
        })
      }, debounceMs)
    }
  }, [onChange, onSearch, appliedFilters, sort, debounceMs])

  React.useEffect(() => {
    if (query !== value) {
      debouncedSearch(query)
    }
  }, [query, value, debouncedSearch])

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  const handleClearSearch = () => {
    setQuery("")
    onChange?.("")
  }

  const handleFilterChange = (filterId: string, filterValue: string | boolean | number | string[] | null) => {
    const newFilters = { ...appliedFilters }
    if (filterValue === null) {
      delete newFilters[filterId]
    } else {
      newFilters[filterId] = filterValue
    }
    setAppliedFilters(newFilters)
    
    onSearch?.({
      query,
      filters: newFilters,
      sort,
      page: 1,
      pageSize: 10,
    })
  }

  const handleSortChange = (newSort: SearchSort) => {
    setSort(newSort)
    
    onSearch?.({
      query,
      filters: appliedFilters,
      sort: newSort,
      page: 1,
      pageSize: 10,
    })
  }

  const getActiveFilters = () => {
    return Object.entries(appliedFilters)
      .filter(([, value]) => {
        if (typeof value === "boolean") return value
        if (typeof value === "string") return value.length > 0
        if (Array.isArray(value)) return value.length > 0
        return value !== null && value !== undefined
      })
      .map(([key, value]) => {
        const filter = filters.find(f => f.id === key)
        return {
          id: key,
          label: filter?.label || key,
          value,
          displayValue: Array.isArray(value) ? value.join(", ") : String(value)
        }
      })
  }

  const activeFilters = getActiveFilters()

  return (
    <div className={cn(searchVariants({ variant, size, className }))}>
      <div className="flex-1 relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          leftIcon={loading ? <Loader2 className="size-4 animate-spin" /> : <SearchIcon className="size-4" />}
          rightIcon={query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleClearSearch}
            >
              <X className="size-3" />
            </Button>
          )}
          className="pr-24"
        />
        
        {/* Filter and Sort Controls */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {showFilters && filters.length > 0 && (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 relative">
                  <Filter className="size-3" />
                  {activeFilters.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                    >
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters.map(filter => (
                  <FilterItem
                    key={filter.id}
                    filter={filter}
                    value={appliedFilters[filter.id]}
                    onChange={(value) => handleFilterChange(filter.id, value)}
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {showSort && sortOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {sort?.direction === "desc" ? (
                    <SortDesc className="size-3" />
                  ) : (
                    <SortAsc className="size-3" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sort ? `${sort.field}-${sort.direction}` : ""}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-")
                    const option = sortOptions.find(opt => opt.field === field)
                    if (option && (direction === "asc" || direction === "desc")) {
                      handleSortChange({
                        field,
                        direction,
                        label: option.label,
                      })
                    }
                  }}
                >
                  {sortOptions.map(option => (
                    <React.Fragment key={option.field}>
                      <DropdownMenuRadioItem value={`${option.field}-asc`}>
                        {option.label} (A-Z)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value={`${option.field}-desc`}>
                        {option.label} (Z-A)
                      </DropdownMenuRadioItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Results count */}
      {showResults && typeof results === "number" && (
        <div className="ml-4 text-sm text-muted-foreground whitespace-nowrap">
          {results} result{results !== 1 ? "s" : ""}
        </div>
      )}
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <Badge
              key={filter.id}
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
                onClick={() => handleFilterChange(filter.id, null)}
              >
                <X className="size-2" />
              </Button>
            </Badge>
          ))}
          
          {activeFilters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setAppliedFilters({})}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface FilterItemProps {
  filter: SearchFilter
  value: string | boolean | number | string[] | null | undefined
  onChange: (value: string | boolean | number | string[] | null) => void
}

function FilterItem({ filter, value, onChange }: FilterItemProps) {
  switch (filter.type) {
    case "checkbox":
      return (
        <DropdownMenuCheckboxItem
          checked={Boolean(value)}
          onCheckedChange={onChange}
        >
          {filter.label}
        </DropdownMenuCheckboxItem>
      )
      
    case "select":
      return (
        <>
          <DropdownMenuLabel className="px-2 text-xs">
            {filter.label}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={String(value || "")} onValueChange={onChange}>
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            {filter.options?.map(option => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </>
      )
      
    default:
      return (
        <div className="p-2">
          <label className="text-xs font-medium text-muted-foreground">
            {filter.label}
          </label>
          <Input
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 h-8 px-3 py-1 text-sm rounded-md"
          />
        </div>
      )
  }
}

// Quick Search Component (simpler version)
interface QuickSearchProps {
  placeholder?: string
  onSearch: (query: string) => void
  results?: Array<{ id: string; title: string; description?: string; href?: string }>
  loading?: boolean
  className?: string
}

export function QuickSearch({
  placeholder = "Quick search...",
  onSearch,
  results = [],
  loading = false,
  className,
}: QuickSearchProps) {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const debouncedSearch = React.useMemo(() => {
    
    return (searchValue: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        onSearch(searchValue)
      }, 200)
    }
  }, [onSearch])

  React.useEffect(() => {
    debouncedSearch(query)
    setIsOpen(query.length > 0)
  }, [query, debouncedSearch])

  return (
    <div className={cn("relative", className)}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(query.length > 0)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        leftIcon={loading ? <Loader2 className="size-4 animate-spin" /> : <SearchIcon className="size-4" />}
        clearable
        onClear={() => setQuery("")}
      />
      
      {isOpen && (results.length > 0 || loading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-auto">
          <CardContent className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin mr-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map(result => (
                  <button
                    key={result.id}
                    className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                    onClick={() => {
                      // Handle result selection
                      setIsOpen(false)
                    }}
                  >
                    <div className="font-medium text-sm">{result.title}</div>
                    {result.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { searchVariants }