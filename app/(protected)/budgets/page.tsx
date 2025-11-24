"use client"

import * as React from "react"
import { Plus, Search, Filter, LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BudgetList } from "@/components/budgets/budget-list"
import { BudgetStats } from "@/components/budgets/budget-stats"
import { BudgetFormModal } from "@/components/budgets/budget-form-modal"
import { useBudgetUIStore } from "@/lib/stores/ui-stores"
import {
  useBudgets,
  useActiveBudgets,
  useExceededBudgets,
  useBudgetSummary,
  useDeleteBudget,
  usePauseBudget,
  useResumeBudget,
  useArchiveBudget,
} from "@/lib/queries/use-budget-data"
import { useToast } from "@/lib/hooks/use-toast"
import type { Budget } from "@/lib/types/budget"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BudgetsPage() {
  usePostHogPageView('budgets')
  const { toast } = useToast()
  const [selectedBudget, setSelectedBudget] = React.useState<Budget | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [budgetToDelete, setBudgetToDelete] = React.useState<Budget | null>(null)

  const {
    viewPreferences,
    filters,
    setBudgetsView,
    setSearchQuery,
    setActiveTab,
    ui,
  } = useBudgetUIStore()

  // Queries
  const { data: budgetsData, isLoading: isLoadingBudgets, error: budgetsError } = useBudgets({
    search: filters.searchQuery,
    cycles: filters.cycles.length ? filters.cycles : undefined,
    statuses: filters.statuses.length ? filters.statuses : undefined,
    sourceTypes: filters.sourceTypes.length ? filters.sourceTypes : undefined,
    isExceeded: filters.isExceeded ?? undefined,
    sortBy: viewPreferences.sortBy,
    sortOrder: viewPreferences.sortOrder,
    includeArchived: viewPreferences.showArchived,
  })

  const { data: activeBudgetsData, isLoading: isLoadingActive } = useActiveBudgets()
  const { data: exceededBudgetsData, isLoading: isLoadingExceeded } = useExceededBudgets()
  const { data: summary } = useBudgetSummary()

  // Mutations
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()
  const { mutate: pauseBudget } = usePauseBudget()
  const { mutate: resumeBudget } = useResumeBudget()
  const { mutate: archiveBudget } = useArchiveBudget()

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget)
    setIsFormModalOpen(true)
  }

  const handleDelete = (budget: Budget) => {
    setBudgetToDelete(budget)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete.id, {
        onSuccess: () => {
          toast({
            title: "Budget deleted",
            description: "The budget has been removed successfully.",
          })
          setIsDeleteDialogOpen(false)
          setBudgetToDelete(null)
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete budget. Please try again.",
            variant: "destructive",
          })
        },
      })
    }
  }

  const handlePause = (budget: Budget) => {
    pauseBudget(budget.id, {
      onSuccess: () => {
        toast({
          title: "Budget paused",
          description: `${budget.name} has been paused.`,
        })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to pause budget.",
          variant: "destructive",
        })
      },
    })
  }

  const handleResume = (budget: Budget) => {
    resumeBudget(budget.id, {
      onSuccess: () => {
        toast({
          title: "Budget resumed",
          description: `${budget.name} is now active.`,
        })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to resume budget.",
          variant: "destructive",
        })
      },
    })
  }

  const handleArchive = (budget: Budget) => {
    archiveBudget(budget.id, {
      onSuccess: () => {
        toast({
          title: "Budget archived",
          description: `${budget.name} has been archived.`,
        })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to archive budget.",
          variant: "destructive",
        })
      },
    })
  }

  const handleAddNew = () => {
    setSelectedBudget(null)
    setIsFormModalOpen(true)
  }

  // Get budgets for current tab
  const getCurrentBudgets = () => {
    switch (ui.activeTab) {
      case "overview":
        return budgetsData?.data || []
      case "budgets":
        return budgetsData?.data || []
      case "analytics":
        return budgetsData?.data || []
      case "alerts":
        return exceededBudgetsData?.data || []
      default:
        return budgetsData?.data || []
    }
  }

  return (
    <div className="max-5xl mx-auto flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Budgets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-muted-foreground text-xs mt-1">
            Track your spending and stay within your budget goals
          </p>
        </div>
        <Button onClick={handleAddNew} size="xs">
          <Plus className="mr-1 h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Stats Summary */}
      {summary && <BudgetStats summary={summary} />}

      {/* Tabs */}
      <Tabs value={ui.activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <div className="flex items-center justify-between">
          <TabsList variant="card">
            <TabsTrigger value="overview" variant="card">
              Overview
            </TabsTrigger>
            <TabsTrigger value="budgets" variant="card">
              All Budgets
            </TabsTrigger>
            <TabsTrigger value="alerts" variant="card">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="analytics" variant="card">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Filters and View Controls */}
          <div className="flex items-center justify-between min-w-sm gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                <Input
                  placeholder="Search budgets..."
                  className="pl-9"
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-sm">
                    {viewPreferences.budgetsView === "grid" ? (
                      <LayoutGrid className="h-4 w-4" />
                    ) : viewPreferences.budgetsView === "list" ? (
                      <List className="h-4 w-4" />
                    ) : (
                      <SlidersHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setBudgetsView("grid")}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Grid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBudgetsView("list")}>
                    <List className="mr-2 h-4 w-4" />
                    List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBudgetsView("compact")}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Compact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon-sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="mt-6">
          <BudgetList
            budgets={getCurrentBudgets()}
            isLoading={isLoadingBudgets}
            error={budgetsError as Error}
            onCreateBudget={handleAddNew}
            onEditBudget={handleEdit}
            onDeleteBudget={handleDelete}
            onPauseBudget={handlePause}
            onResumeBudget={handleResume}
            onArchiveBudget={handleArchive}
          />
        </TabsContent>

        <TabsContent value="budgets" className="mt-6">
          <BudgetList
            budgets={getCurrentBudgets()}
            isLoading={isLoadingBudgets}
            error={budgetsError as Error}
            onCreateBudget={handleAddNew}
            onEditBudget={handleEdit}
            onDeleteBudget={handleDelete}
            onPauseBudget={handlePause}
            onResumeBudget={handleResume}
            onArchiveBudget={handleArchive}
          />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <BudgetList
            budgets={getCurrentBudgets()}
            isLoading={isLoadingExceeded}
            error={budgetsError as Error}
            onCreateBudget={handleAddNew}
            onEditBudget={handleEdit}
            onDeleteBudget={handleDelete}
            onPauseBudget={handlePause}
            onResumeBudget={handleResume}
            onArchiveBudget={handleArchive}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            Analytics view coming soon
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BudgetFormModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedBudget(null)
        }}
        budget={selectedBudget}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the budget "{budgetToDelete?.name}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
