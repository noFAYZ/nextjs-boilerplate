"use client"

import * as React from "react"
import {
  Filter,
  X,
  Tag,
  Calendar,
  Target,
  Flag,
  FolderTree,
  Link,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { Separator } from "@/components/ui/separator"
import { useGoalsStore } from "@/lib/stores/goals-store"
import type {
  GoalType,
  GoalCategory,
  GoalPriority,
  GoalSourceType
} from "@/lib/types/goals"

interface GoalFiltersSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GOAL_TYPES: MultiSelectOption[] = [
  { value: "SAVINGS", label: "Savings" },
  { value: "EMERGENCY_FUND", label: "Emergency Fund" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "CRYPTO", label: "Cryptocurrency" },
  { value: "DEBT_PAYOFF", label: "Debt Payoff" },
  { value: "NET_WORTH", label: "Net Worth" },
  { value: "SPENDING_LIMIT", label: "Spending Limit" },
  { value: "INCOME", label: "Income Goal" },
  { value: "CUSTOM", label: "Custom" },
]

const GOAL_CATEGORIES: MultiSelectOption[] = [
  { value: "PERSONAL", label: "Personal" },
  { value: "FAMILY", label: "Family" },
  { value: "EDUCATION", label: "Education" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "TRAVEL", label: "Travel" },
  { value: "HOME", label: "Home" },
  { value: "VEHICLE", label: "Vehicle" },
  { value: "BUSINESS", label: "Business" },
  { value: "HEALTH", label: "Health" },
  { value: "OTHER", label: "Other" },
]

const PRIORITIES: MultiSelectOption[] = [
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
]

const SOURCE_TYPES: MultiSelectOption[] = [
  { value: "MANUAL", label: "Manual Tracking" },
  { value: "BANK_ACCOUNT", label: "Bank Account" },
  { value: "CRYPTO_WALLET", label: "Crypto Wallet" },
  { value: "ACCOUNT_GROUP", label: "Account Group" },
  { value: "ALL_ACCOUNTS", label: "All Accounts" },
  { value: "ALL_CRYPTO", label: "All Crypto" },
  { value: "PORTFOLIO", label: "Portfolio" },
]

export function GoalFiltersSheet({ open, onOpenChange }: GoalFiltersSheetProps) {
  const {
    filters,
    setTypeFilter,
    setCategoryFilter,
    setPriorityFilter,
    setSourceTypeFilter,
    setShowAchieved,
    setShowInactive,
    setShowArchived,
    setOnTrackOnly,
    setSelectedTags,
    setDateRangeFilter,
    clearFilters,
  } = useGoalsStore()

  const [selectedTags, setLocalSelectedTags] = React.useState<string[]>(filters.selectedTags)
  const [customTag, setCustomTag] = React.useState("")

  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.types.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.priorities.length > 0) count++
    if (filters.sourceTypes.length > 0) count++
    if (filters.showAchieved) count++
    if (filters.showInactive) count++
    if (filters.showArchived) count++
    if (filters.onTrackOnly) count++
    if (filters.selectedTags.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }, [filters])

  const handleClearAll = () => {
    clearFilters()
    setLocalSelectedTags([])
  }

  const handleAddTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      const newTags = [...selectedTags, customTag.trim()]
      setLocalSelectedTags(newTags)
      setSelectedTags(newTags)
      setCustomTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag)
    setLocalSelectedTags(newTags)
    setSelectedTags(newTags)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="size-5" />
            Filter Goals
            {activeFilterCount > 0 && (
              <Badge variant="info-soft" className="ml-1">
                {activeFilterCount} active
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Refine your goal list by applying filters
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Goal Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" />
              <Label>Goal Types</Label>
            </div>
            <MultiSelect
              options={GOAL_TYPES}
              selected={filters.types}
              onChange={(values) => setTypeFilter(values as GoalType[])}
              placeholder="Select goal types..."
              searchPlaceholder="Search types..."
            />
          </div>

          <Separator />

          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderTree className="size-4 text-muted-foreground" />
              <Label>Categories</Label>
            </div>
            <MultiSelect
              options={GOAL_CATEGORIES}
              selected={filters.categories}
              onChange={(values) => setCategoryFilter(values as GoalCategory[])}
              placeholder="Select categories..."
              searchPlaceholder="Search categories..."
            />
          </div>

          <Separator />

          {/* Priority Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flag className="size-4 text-muted-foreground" />
              <Label>Priorities</Label>
            </div>
            <MultiSelect
              options={PRIORITIES}
              selected={filters.priorities}
              onChange={(values) => setPriorityFilter(values as GoalPriority[])}
              placeholder="Select priorities..."
              searchPlaceholder="Search priorities..."
            />
          </div>

          <Separator />

          {/* Source Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link className="size-4 text-muted-foreground" />
              <Label>Source Types</Label>
            </div>
            <MultiSelect
              options={SOURCE_TYPES}
              selected={filters.sourceTypes}
              onChange={(values) => setSourceTypeFilter(values as GoalSourceType[])}
              placeholder="Select source types..."
              searchPlaceholder="Search source types..."
            />
          </div>

          <Separator />

          {/* Date Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <Label>Target Date Range</Label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">From</Label>
                <DatePicker
                  date={filters.dateRange.from}
                  onDateChange={(date) => setDateRangeFilter(date, filters.dateRange.to)}
                  placeholder="Start date"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">To</Label>
                <DatePicker
                  date={filters.dateRange.to}
                  onDateChange={(date) => setDateRangeFilter(filters.dateRange.from, date)}
                  placeholder="End date"
                />
              </div>
            </div>

            {(filters.dateRange.from || filters.dateRange.to) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRangeFilter(null, null)}
                className="w-full"
              >
                <X className="size-4 mr-1" />
                Clear Date Range
              </Button>
            )}
          </div>

          <Separator />

          {/* Tags Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              <Label>Tags</Label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!customTag.trim()}
              >
                Add
              </Button>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Status Toggles */}
          <div className="space-y-4">
            <Label>Status Filters</Label>

            <div className="space-y-3">
              {/* Show Achieved */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <Label htmlFor="show-achieved" className="font-normal">
                    Show Achieved Goals
                  </Label>
                </div>
                <Switch
                  id="show-achieved"
                  checked={filters.showAchieved}
                  onCheckedChange={setShowAchieved}
                />
              </div>

              {/* Show Inactive */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-muted-foreground" />
                  <Label htmlFor="show-inactive" className="font-normal">
                    Show Inactive Goals
                  </Label>
                </div>
                <Switch
                  id="show-inactive"
                  checked={filters.showInactive}
                  onCheckedChange={setShowInactive}
                />
              </div>

              {/* Show Archived */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderTree className="size-4 text-muted-foreground" />
                  <Label htmlFor="show-archived" className="font-normal">
                    Show Archived Goals
                  </Label>
                </div>
                <Switch
                  id="show-archived"
                  checked={filters.showArchived}
                  onCheckedChange={setShowArchived}
                />
              </div>

              {/* On Track Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" />
                  <Label htmlFor="on-track-only" className="font-normal">
                    On Track Only
                  </Label>
                </div>
                <Switch
                  id="on-track-only"
                  checked={filters.onTrackOnly}
                  onCheckedChange={setOnTrackOnly}
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t pt-4">
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="flex-1"
              disabled={activeFilterCount === 0}
            >
              <X className="size-4 mr-1" />
              Clear All
            </Button>
            <SheetClose asChild>
              <Button className="flex-1">
                Apply Filters
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
