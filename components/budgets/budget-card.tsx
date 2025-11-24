"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CheckCircle2,
  Pause,
  Play,
  Archive,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: budget.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    PAUSED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  }

  const getStatusIcon = () => {
    if (budget.isExceeded) {
      return <AlertCircle className="w-3.5 h-3.5" />
    }
    if (budget.status === "PAUSED") {
      return <Pause className="w-3.5 h-3.5" />
    }
    if (budget.onTrack) {
      return <CheckCircle2 className="w-3.5 h-3.5" />
    }
    return null
  }

  const getStatusText = () => {
    if (budget.status === "PAUSED") return "paused"
    if (budget.isExceeded) return "exceeded"
    if (budget.onTrack) return "on track"
    return "off track"
  }

  const getStatusColorClass = () => {
    if (budget.status === "PAUSED") return getStatusColor.PAUSED
    if (budget.isExceeded) return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
    if (budget.onTrack) return getStatusColor.ACTIVE
    return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
  }

  const handleCardClick = () => {
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
      interactive
      className={cn(
        "group relative flex flex-col justify-between border border-border/50",
        "cursor-pointer"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="text-2xl flex-shrink-0">{budget.icon || "📊"}</div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">
              {budget.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {budget.description || budget.cycle}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg">
              {formatCurrency(budget.spent)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            of {formatCurrency(budget.amount)}
          </span>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full",
              getStatusColorClass()
            )}
          >
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
            {budget.percentageUsed.toFixed(0)}%
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
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
                <Play className="mr-2 h-4 w-4" />
                Resume
              </DropdownMenuItem>
            )}
            {budget.status !== "PAUSED" && onPause && (
              <DropdownMenuItem onClick={(e) => handleMenuAction(e, () => onPause(budget))}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={(e) => handleMenuAction(e, () => onArchive(budget))}>
                <Archive className="mr-2 h-4 w-4" />
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
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
