"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Pause,
  Archive,
  Play,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StreamlineFlexFilter2 } from "../icons/icons"
import { Toggle } from "../ui/toggle"
import { Progress } from "@/components/ui/progress"
import type { Budget } from "@/lib/types/budget"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BudgetDataTableProps {
  budgets: Budget[]
  totalBudgeted: number
  totalSpent: number
  isLoading?: boolean
  onEdit?: (budget: Budget) => void
  onDelete?: (budget: Budget) => void
  onPause?: (budget: Budget) => void
  onResume?: (budget: Budget) => void
  onArchive?: (budget: Budget) => void
}

const ITEMS_PER_PAGE = 20

const getStatusColor = (budget: Budget) => {
  if (budget.status === "PAUSED") {
    return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
  }
  if (budget.isArchived) {
    return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
  }
  if (budget.isExceeded) {
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
  }
  if (budget.onTrack) {
    return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
  }
  return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
}

const getProgressColor = (budget: Budget) => {
  if (budget.isExceeded) return "bg-red-500"
  if (budget.percentageUsed >= 90) return "bg-orange-500"
  if (budget.percentageUsed >= 75) return "bg-yellow-500"
  return "bg-emerald-500"
}

const getStatusLabel = (budget: Budget) => {
  if (budget.status === "PAUSED") return "Paused"
  if (budget.isArchived) return "Archived"
  if (budget.isExceeded) return "Exceeded"
  if (budget.onTrack) return "On Track"
  return "Off Track"
}

const getCycleDisplay = (cycle: string) => {
  const cycles: Record<string, string> = {
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    YEARLY: "Yearly",
  }
  return cycles[cycle] || cycle
}

export function BudgetDataTable({
  budgets,
  totalBudgeted,
  totalSpent,
  isLoading,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onArchive,
}: BudgetDataTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "amount" | "spent" | "remaining" | "percentageUsed" | "currentPeriodEnd">("name")
  const [filterBy, setFilterBy] = useState<"all" | "active" | "paused" | "exceeded" | "on-track">("all")
  const [toggleFilters, setToggleFilters] = useState(false)

  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Filter and search budgets
  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.description?.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filterBy === "active") return budget.status === "ACTIVE" && !budget.isArchived
    if (filterBy === "paused") return budget.status === "PAUSED"
    if (filterBy === "exceeded") return budget.isExceeded
    if (filterBy === "on-track") return budget.onTrack && !budget.isExceeded
    return true
  })

  // Sort budgets
  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.amount - a.amount
      case "spent":
        return b.spent - a.spent
      case "remaining":
        return b.remaining - a.remaining
      case "percentageUsed":
        return b.percentageUsed - a.percentageUsed
      case "currentPeriodEnd":
        return new Date(a.currentPeriodEnd).getTime() - new Date(b.currentPeriodEnd).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Paginate budgets
  const totalPages = Math.ceil(sortedBudgets.length / ITEMS_PER_PAGE)
  const paginatedBudgets = sortedBudgets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="rounded-xl">
          <div className="h-12 bg-muted rounded-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
        {/* Left: Total Stats */}
        <div className="flex gap-6">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Total Budgeted
            </span>
            <div className="text-xl font-bold">
              {formatCurrency(totalBudgeted)}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Total Spent
            </span>
            <div className="text-xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
          </div>
        </div>

        {/* Right: Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search budgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Toggle
            className="px-2 gap-1.5"
            title="Filters"
            variant={"outline"}
            onClick={() => setToggleFilters(!toggleFilters)}
          >
            <StreamlineFlexFilter2 className="h-4 w-4" />
            Filters
          </Toggle>
        </div>
      </div>

      {/* Sort & Filter */}
      <div
        className={`px-4 gap-2 sm:justify-end ${
          toggleFilters ? "flex" : "hidden"
        }`}
      >
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as typeof sortBy)}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">By Name</SelectItem>
            <SelectItem value="amount">By Budget Amount</SelectItem>
            <SelectItem value="spent">By Spent</SelectItem>
            <SelectItem value="remaining">By Remaining</SelectItem>
            <SelectItem value="percentageUsed">By Progress</SelectItem>
            <SelectItem value="currentPeriodEnd">By Period End</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterBy}
          onValueChange={(value) => setFilterBy(value as typeof filterBy)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="exceeded">Exceeded</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="bg-card p-4 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[220px] font-bold">Budget</TableHead>
              <TableHead className="text-right font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Cycle</TableHead>
              <TableHead className="text-right font-bold">Budget Amount</TableHead>
              <TableHead className="text-right font-bold">Spent</TableHead>
              <TableHead className="text-right font-bold">Remaining</TableHead>
              <TableHead className="text-center font-bold w-[140px]">Progress</TableHead>
              <TableHead className="text-right font-bold">Period End</TableHead>
              <TableHead className="text-center font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBudgets.map((budget) => {
              return (
                <TableRow
                  key={budget.id}
                  onClick={() => router.push(`/budgets/${budget.id}`)}
                  className="group border-none cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {budget.icon && (
                        <div className="text-2xl flex-shrink-0">
                          {budget.icon}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {budget.name}
                        </p>
                        {budget.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {budget.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      className={cn(
                        "text-xs rounded-md",
                        getStatusColor(budget)
                      )}
                    >
                      {getStatusLabel(budget)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <p className="text-sm font-medium">
                      {getCycleDisplay(budget.cycle)}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCurrency(budget.amount, budget.currency)}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <p className={cn(
                      "text-sm font-medium",
                      budget.isExceeded ? "text-red-600 dark:text-red-400" : ""
                    )}>
                      {formatCurrency(budget.spent, budget.currency)}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {budget.onTrack ? (
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                      )}
                      <p className={cn(
                        "text-sm font-medium",
                        budget.remaining < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        {formatCurrency(budget.remaining, budget.currency)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <Progress
                        value={Math.min(budget.percentageUsed, 100)}
                        className="h-2"
                        indicatorClassName={getProgressColor(budget)}
                      />
                      <p className="text-xs text-center text-muted-foreground">
                        {budget.percentageUsed.toFixed(1)}%
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div>
                      <p className="text-sm font-medium">
                        {formatDate(budget.currentPeriodEnd)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {budget.daysRemaining === 0
                          ? "Today"
                          : budget.daysRemaining === 1
                          ? "Tomorrow"
                          : `${budget.daysRemaining} days`}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(budget)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {budget.status === "PAUSED" && onResume && (
                          <DropdownMenuItem onClick={() => onResume(budget)}>
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                          </DropdownMenuItem>
                        )}
                        {budget.status !== "PAUSED" && onPause && (
                          <DropdownMenuItem onClick={() => onPause(budget)}>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        {onArchive && (
                          <DropdownMenuItem onClick={() => onArchive(budget)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(budget)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredBudgets.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== "all"
              ? "No budgets match your criteria"
              : "No budgets found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first budget to start tracking spending"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredBudgets.length)} of{" "}
            {filteredBudgets.length} budgets
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded">
                {currentPage}
              </span>
              <span className="text-sm text-muted-foreground">
                of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
