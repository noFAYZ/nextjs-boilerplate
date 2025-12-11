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
import { BudgetHeader } from "@/components/budgets/budget-header"
import { useToast } from "@/lib/hooks/use-toast"
import { cn } from "@/lib/utils"
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
    <div className="max-w-3xl mx-auto  space-y-3">
      {/* Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/budgets")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/budgets">Budgets</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{budget.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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

      {/* Budget Header with Chart */}
      <BudgetHeader budget={budget} progress={budget.percentageUsed} progressColor={getProgressColor()} />

      {/* Tabs for Periods, Transactions, Alerts */}
      <Tabs defaultValue="details" className="space-y-2">
        <TabsList variant="pill">
          <TabsTrigger value="details" variant="pill">
            Details
          </TabsTrigger>
          <TabsTrigger value="periods" variant="pill">
            Periods
          </TabsTrigger>
          <TabsTrigger value="transactions" variant="pill">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="alerts" variant="pill">
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
              This will permanently delete the budget &quot;{budget.name}&quot;. This action cannot be undone.
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
