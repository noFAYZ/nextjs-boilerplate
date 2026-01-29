"use client"

import * as React from "react"
import { BudgetCard } from "./budget-card"
import { BudgetDataTable } from "./budget-data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Budget } from "@/lib/types/budget"
import { useBudgetUIStore } from "@/lib/stores/budget-ui-store"
import { Card } from "../ui/card"

interface BudgetListProps {
  budgets: Budget[]
  isLoading?: boolean
  error?: Error | null
  onCreateBudget?: () => void
  onEditBudget?: (budget: Budget) => void
  onDeleteBudget?: (budget: Budget) => void
  onPauseBudget?: (budget: Budget) => void
  onResumeBudget?: (budget: Budget) => void
  onArchiveBudget?: (budget: Budget) => void
}

export function BudgetList({
  budgets,
  isLoading,
  error,
  onCreateBudget,
  onEditBudget,
  onDeleteBudget,
  onPauseBudget,
  onResumeBudget,
  onArchiveBudget,
}: BudgetListProps) {
  const budgetsView = useBudgetUIStore((state) => state.viewPreferences.budgetsView)

  // Calculate totals for table view
  const totalBudgeted = React.useMemo(() =>
    budgets.reduce((sum, budget) => sum + budget.amount, 0),
    [budgets]
  )
  const totalSpent = React.useMemo(() =>
    budgets.reduce((sum, budget) => sum + budget.spent, 0),
    [budgets]
  )

  if (isLoading) {
    return <BudgetListSkeleton view={budgetsView} />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load budgets: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Inbox className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
          Create your first budget to start tracking your spending and stay on top of your finances.
        </p>
        {onCreateBudget && (
          <Button onClick={onCreateBudget}>
            Create Budget
          </Button>
        )}
      </div>
    )
  }

  // Render table view
  if (budgetsView === 'table') {
    return (
      <BudgetDataTable
        budgets={budgets}
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        isLoading={isLoading}
        onEdit={onEditBudget}
        onDelete={onDeleteBudget}
        onPause={onPauseBudget}
        onResume={onResumeBudget}
        onArchive={onArchiveBudget}
      />
    )
  }

  // Render card views
  const gridClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    list: "flex flex-col gap-3",
    compact: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",
  }

  return (
    <div className={gridClasses[budgetsView as keyof typeof gridClasses]}>
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={onEditBudget}
          onDelete={onDeleteBudget}
          onPause={onPauseBudget}
          onResume={onResumeBudget}
          onArchive={onArchiveBudget}
        />
      ))}
    </div>
  )
}

function BudgetListSkeleton({ view }: { view: 'grid' | 'list' | 'compact' }) {
  const gridClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    list: "flex flex-col gap-3",
    compact: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",
  }

  const count = view === 'compact' ? 8 : view === 'grid' ? 6 : 4

  return (
    <div className={gridClasses[view]}>
      {Array.from({ length: count }).map((_, i) => (
        <BudgetCardSkeleton key={i} />
      ))}
    </div>
  )
}

function BudgetCardSkeleton() {
  return (
    <Card className="border border-border  space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>

      <Skeleton className="h-8 w-full" />
    </Card>
  )
}
