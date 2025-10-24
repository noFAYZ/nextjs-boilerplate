"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Pause,
  Archive,
  MoreVertical,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Budget } from "@/lib/types/budget"
import { useBudgetUIStore } from "@/lib/stores/budget-ui-store"

interface BudgetCardProps {
  budget: Budget
  onEdit?: (budget: Budget) => void
  onDelete?: (budget: Budget) => void
  onPause?: (budget: Budget) => void
  onResume?: (budget: Budget) => void
  onArchive?: (budget: Budget) => void
  onClick?: (budget: Budget) => void
}

export function BudgetCard({
  budget,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onArchive,
  onClick,
}: BudgetCardProps) {
  const router = useRouter()
  const highlightExceeded = useBudgetUIStore((state) => state.viewPreferences.highlightExceeded)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: budget.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = () => {
    if (budget.isExceeded && highlightExceeded) {
      return "text-red-600 dark:text-red-400"
    }
    if (budget.percentageUsed >= 90) {
      return "text-orange-600 dark:text-orange-400"
    }
    if (budget.onTrack) {
      return "text-emerald-600 dark:text-emerald-400"
    }
    return "text-yellow-600 dark:text-yellow-400"
  }

  const getProgressColor = () => {
    if (budget.isExceeded) return "bg-red-500"
    if (budget.percentageUsed >= 90) return "bg-orange-500"
    if (budget.percentageUsed >= 75) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  const getStatusBadge = () => {
    if (budget.status === "PAUSED") {
      return (
        <Badge className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20">
          <Pause className="w-3 h-3" />
          Paused
        </Badge>
      )
    }
    if (budget.isArchived) {
      return (
        <Badge className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20">
          <Archive className="w-3 h-3" />
          Archived
        </Badge>
      )
    }
    if (budget.isExceeded) {
      return (
        <Badge className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <AlertCircle className="w-3 h-3" />
          Exceeded
        </Badge>
      )
    }
    if (budget.onTrack) {
      return (
        <Badge className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          On Track
        </Badge>
      )
    }
    return (
      <Badge className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
        <TrendingUp className="w-3 h-3" />
        Off Track
      </Badge>
    )
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[role="button"]')) {
      return
    }
    onClick?.(budget)
    router.push(`/budgets/${budget.id}`)
  }

  const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted/30 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]",
        "cursor-pointer",
        budget.isExceeded && highlightExceeded && "ring-2 ring-red-500/20"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {budget.icon && (
            <div className="text-2xl flex-shrink-0">{budget.icon}</div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{budget.name}</h3>
            {budget.description && (
              <p className="text-xs text-muted-foreground truncate">
                {budget.description}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={(e) => handleMenuAction(e, () => onEdit(budget))}>
                Edit
              </DropdownMenuItem>
            )}
            {budget.status === "PAUSED" && onResume && (
              <DropdownMenuItem onClick={(e) => handleMenuAction(e, () => onResume(budget))}>
                Resume
              </DropdownMenuItem>
            )}
            {budget.status !== "PAUSED" && onPause && (
              <DropdownMenuItem onClick={(e) => handleMenuAction(e, () => onPause(budget))}>
                Pause
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={(e) => handleMenuAction(e, () => onArchive(budget))}>
                Archive
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction(e, () => onDelete(budget))}
                  className="text-red-600 dark:text-red-400"
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Amount and Progress */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={cn("font-bold text-lg", getStatusColor())}>
                {formatCurrency(budget.spent)}
              </span>
              <span className="text-xs text-muted-foreground">
                of {formatCurrency(budget.amount)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {budget.onTrack ? (
                <TrendingDown className="w-3 h-3 text-emerald-500" />
              ) : (
                <TrendingUp className="w-3 h-3 text-orange-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatCurrency(budget.remaining)} remaining
              </span>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress
            value={Math.min(budget.percentageUsed, 100)}
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{budget.percentageUsed.toFixed(1)}% used</span>
            <span>{budget.daysRemaining} days left</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs border-t border-border/60 pt-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ends {formatDate(budget.currentPeriodEnd)}</span>
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
            {budget.cycle}
          </Badge>
        </div>

        {/* Category/Source Info */}
        {(budget.category || budget.account || budget.sourceType) && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>•</span>
            <span className="truncate">
              {budget.category?.name ||
               budget.account?.name ||
               (budget.sourceType === "ALL_SUBSCRIPTIONS" ? "All Subscriptions" :
                budget.sourceType === "SUBSCRIPTION_CATEGORY" ? `${budget.subscriptionCategory || "Subscription"} Category` :
                budget.sourceType === "MANUAL" ? "Manual Tracking" :
                budget.sourceType)}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
