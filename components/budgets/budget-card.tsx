"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  isExceeded?: boolean
  onTrack?: boolean
}

function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  isExceeded = false,
  onTrack = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference

  // Color based on status
  const getColors = () => {
    if (isExceeded) {
      return {
        from: "#ef4444",
        to: "#dc2626",
        glow: "#ef4444",
      }
    }
    if (percentage >= 90) {
      return {
        from: "#f97316",
        to: "#ea580c",
        glow: "#f97316",
      }
    }
    if (percentage >= 75) {
      return {
        from: "#eab308",
        to: "#ca8a04",
        glow: "#eab308",
      }
    }
    return {
      from: "#10b981",
      to: "#059669",
      glow: "#10b981",
    }
  }

  const colors = getColors()
  const gradientId = `budget-gradient-${percentage.toFixed(0)}`
  const glowId = `budget-glow-${percentage.toFixed(0)}`

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          {/* Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>

          {/* Glow effect */}
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          filter={`url(#${glowId})`}
        />

        {/* Shimmer overlay */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth / 2}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          opacity={0.3}
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
          <div className="text-[10px] text-muted-foreground">used</div>
        </motion.div>
      </div>
    </div>
  )
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
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted/30 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]",
        "cursor-pointer",
        budget.isExceeded && highlightExceeded && "ring-2 ring-red-500/20"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
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

      {/* Main Content with Circular Progress */}
      <div className="flex items-center gap-6 mb-4">
        {/* Circular Progress */}
        <div className="flex-shrink-0">
          <CircularProgress
            percentage={budget.percentageUsed}
            size={120}
            strokeWidth={8}
            isExceeded={budget.isExceeded}
            onTrack={budget.onTrack}
          />
        </div>

        {/* Budget Info */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={cn("font-bold text-xl", getStatusColor())}>
                {formatCurrency(budget.spent)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              of {formatCurrency(budget.amount)}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {budget.onTrack ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {formatCurrency(budget.remaining)} remaining
            </span>
          </div>

          <div>{getStatusBadge()}</div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="space-y-2 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ends {formatDate(budget.currentPeriodEnd)}</span>
          </div>
          <span className="text-muted-foreground">{budget.daysRemaining} days left</span>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
            {budget.cycle}
          </Badge>
          {(budget.category || budget.account || budget.sourceType) && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 max-w-[60%]">
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
      </div>
    </Card>
  )
}
