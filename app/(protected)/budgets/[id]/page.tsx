"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Pause, Play, Archive, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
  useBudget,
  useDeleteBudget,
  usePauseBudget,
  useResumeBudget,
  useArchiveBudget,
  useRefreshBudget,
} from "@/lib/queries/use-budget-data"
import { BudgetFormModal } from "@/components/budgets/budget-form-modal"
import { useToast } from "@/lib/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Budget } from "@/lib/types/budget"
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

export default function BudgetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const budgetId = params.id as string

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  // Queries
  const {
    data: budget,
    isLoading,
    error,
  } = useBudget(budgetId, {
    includePeriods: true,
    includeAlerts: true,
    includeTransactions: true,
  })

  // Mutations
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()
  const { mutate: pauseBudget } = usePauseBudget()
  const { mutate: resumeBudget } = useResumeBudget()
  const { mutate: archiveBudget } = useArchiveBudget()
  const { mutate: refreshBudget, isPending: isRefreshing } = useRefreshBudget()

  const handleDelete = () => {
    deleteBudget(budgetId, {
      onSuccess: () => {
        toast({
          title: "Budget deleted",
          description: "The budget has been removed successfully.",
        })
        router.push("/budgets")
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

  const handlePause = () => {
    pauseBudget(budgetId, {
      onSuccess: () => {
        toast({
          title: "Budget paused",
          description: "Budget tracking has been paused.",
        })
      },
    })
  }

  const handleResume = () => {
    resumeBudget(budgetId, {
      onSuccess: () => {
        toast({
          title: "Budget resumed",
          description: "Budget tracking is now active.",
        })
      },
    })
  }

  const handleArchive = () => {
    archiveBudget(budgetId, {
      onSuccess: () => {
        toast({
          title: "Budget archived",
          description: "Budget has been archived.",
        })
      },
    })
  }

  const handleRefresh = () => {
    refreshBudget(budgetId, {
      onSuccess: () => {
        toast({
          title: "Budget refreshed",
          description: "Spending has been recalculated.",
        })
      },
    })
  }

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

  if (isLoading) {
    return <BudgetDetailSkeleton />
  }

  if (error || !budget) {
    return (
      <div className="max-5xl mx-auto flex-1 space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load budget details. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const getProgressColor = () => {
    if (budget.isExceeded) return "bg-red-500"
    if (budget.percentageUsed >= 90) return "bg-orange-500"
    if (budget.percentageUsed >= 75) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  return (
    <div className="max-5xl mx-auto flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/budgets")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {budget.icon && (
              <div className="text-3xl">{budget.icon}</div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{budget.name}</h1>
              {budget.description && (
                <p className="text-muted-foreground text-xs">{budget.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          {budget.status === "PAUSED" ? (
            <Button variant="outline" size="sm" onClick={handleResume}>
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handlePause}>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(budget.amount, budget.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budget.cycle} cycle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              budget.isExceeded ? "text-red-600 dark:text-red-400" : ""
            )}>
              {formatCurrency(budget.spent, budget.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budget.percentageUsed.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              budget.remaining < 0
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            )}>
              {formatCurrency(budget.remaining, budget.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budget.daysRemaining} days left
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Budget Progress</span>
              <span className="font-medium">{budget.percentageUsed.toFixed(1)}%</span>
            </div>
            <Progress
              value={Math.min(budget.percentageUsed, 100)}
              className="h-3"
              indicatorClassName={getProgressColor()}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Daily Average</p>
              <p className="text-sm font-medium">
                {formatCurrency(budget.dailyAverage, budget.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projected Total</p>
              <p className="text-sm font-medium">
                {formatCurrency(budget.projectedTotal, budget.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Recommended Daily</p>
              <p className="text-sm font-medium">
                {formatCurrency(budget.recommendedDailySpend, budget.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={budget.onTrack ? "default" : "destructive"} className="text-xs">
                {budget.onTrack ? "On Track" : "Off Track"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-4 border-t">
            <span className="text-muted-foreground">Period</span>
            <span className="font-medium">
              {formatDate(budget.currentPeriodStart)} - {formatDate(budget.currentPeriodEnd)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Periods, Transactions, Alerts */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList variant="card">
          <TabsTrigger value="details" variant="card">
            Details
          </TabsTrigger>
          <TabsTrigger value="periods" variant="card">
            Periods
          </TabsTrigger>
          <TabsTrigger value="transactions" variant="card">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="alerts" variant="card">
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Source Type</p>
                  <p className="text-sm font-medium">
                    {budget.sourceType === "ALL_SUBSCRIPTIONS" ? "All Subscriptions" :
                     budget.sourceType === "SUBSCRIPTION_CATEGORY" ? "Subscription Category" :
                     budget.sourceType === "MANUAL" ? "Manual Tracking" :
                     budget.sourceType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge>{budget.status}</Badge>
                </div>
                {budget.subscriptionCategory && (
                  <div>
                    <p className="text-xs text-muted-foreground">Subscription Category</p>
                    <p className="text-sm font-medium">{budget.subscriptionCategory}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Rollover Type</p>
                  <p className="text-sm font-medium">{budget.rolloverType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Auto Renew</p>
                  <p className="text-sm font-medium">{budget.autoRenew ? "Yes" : "No"}</p>
                </div>
              </div>

              {budget.notes && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{budget.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periods">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center py-8">
                Period history will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center py-8">
                Budget transactions will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center py-8">
                Budget alerts will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BudgetFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        budget={budget}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the budget "{budget.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function BudgetDetailSkeleton() {
  return (
    <div className="max-5xl mx-auto flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-24 w-full mt-4" />
        </CardContent>
      </Card>
    </div>
  )
}
