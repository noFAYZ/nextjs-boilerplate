"use client"

import * as React from "react"
import { Plus, LayoutGrid, List } from "lucide-react"
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function BudgetsPage() {
  usePostHogPageView('budgets')
  const { toast } = useToast()
  const [selectedBudget, setSelectedBudget] = React.useState<Budget | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [budgetToDelete, setBudgetToDelete] = React.useState<Budget | null>(null)

  const { setActiveTab, ui, viewPreferences, setBudgetsView } = useBudgetUIStore()

  // Queries
  const { data: allBudgetsData = { data: [] }, isLoading: isLoadingBudgets, error: budgetsError } = useBudgets()
  const { data: activeBudgetsData = { data: [] } } = useActiveBudgets()
  const { data: exceededBudgetsData = { data: [] } } = useExceededBudgets()
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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Budgets</h1>
          <p className="text-muted-foreground text-xs">
            Track your spending and stay within your budget goals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            <Button
              variant={viewPreferences.budgetsView === "grid" ? "outline2" : "ghost"}
              size="xs"
              onClick={() => setBudgetsView("grid")}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewPreferences.budgetsView === "list" ? "outline2" : "ghost"}
              size="xs"
              onClick={() => setBudgetsView("list")}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddNew} size="xs">
            <Plus className="mr-1 h-4 w-4" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      {summary && <BudgetStats summary={summary} />}

      {/* Tabs */}
      <Tabs value={ui.activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList variant="pill">
          <TabsTrigger value="active" variant="pill">
            Active
          </TabsTrigger>
          <TabsTrigger value="exceeded" variant="pill">
            Exceeded
          </TabsTrigger>
          <TabsTrigger value="all" variant="pill">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 pb-32">
          <BudgetList
            budgets={activeBudgetsData.data || []}
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

        <TabsContent value="exceeded" className="mt-6 pb-32">
          <BudgetList
            budgets={exceededBudgetsData.data || []}
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

        <TabsContent value="all" className="mt-6 pb-32">
          <BudgetList
            budgets={allBudgetsData.data || []}
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
