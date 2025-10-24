"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BudgetSummary } from "@/lib/types/budget"

interface BudgetStatsProps {
  summary: BudgetSummary
  currency?: string
}

export function BudgetStats({ summary, currency = "USD" }: BudgetStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const stats = [
    {
      title: "Total Budgeted",
      value: formatCurrency(summary.totalBudgeted),
      description: `${summary.activeBudgets} of ${summary.totalBudgets} active`,
      icon: Target,
      trend: null,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Spent",
      value: formatCurrency(summary.totalSpent),
      description: `${summary.overallPercentageUsed.toFixed(1)}% of budget`,
      icon: DollarSign,
      trend: summary.overallPercentageUsed > 80 ? "up" : null,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Remaining",
      value: formatCurrency(summary.totalRemaining),
      description: summary.totalRemaining < 0 ? "Over budget" : "Available",
      icon: summary.totalRemaining >= 0 ? CheckCircle2 : AlertTriangle,
      trend: summary.totalRemaining >= 0 ? "down" : "up",
      color: summary.totalRemaining >= 0
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400",
      bgColor: summary.totalRemaining >= 0
        ? "bg-emerald-500/10"
        : "bg-red-500/10",
    },
    {
      title: "On Track",
      value: `${summary.budgetsOnTrack}`,
      description: `${summary.budgetsOffTrack} off track, ${summary.exceededBudgets} exceeded`,
      icon: CheckCircle2,
      trend: summary.budgetsOnTrack > summary.budgetsOffTrack ? "down" : "up",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className={cn("text-2xl font-bold", stat.color)}>
                {stat.value}
              </div>
              {stat.trend && (
                <div className={cn(
                  "flex items-center text-xs",
                  stat.trend === "up" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                )}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-0.5" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface BudgetProgressRingProps {
  percentage: number
  label: string
  color?: string
  size?: "sm" | "md" | "lg"
}

export function BudgetProgressRing({
  percentage,
  label,
  color = "emerald",
  size = "md"
}: BudgetProgressRingProps) {
  const sizes = {
    sm: { width: 60, height: 60, strokeWidth: 4, fontSize: "text-xs" },
    md: { width: 80, height: 80, strokeWidth: 6, fontSize: "text-sm" },
    lg: { width: 120, height: 120, strokeWidth: 8, fontSize: "text-lg" },
  }

  const { width, height, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (percentage >= 100) return "stroke-red-500"
    if (percentage >= 90) return "stroke-orange-500"
    if (percentage >= 75) return "stroke-yellow-500"
    return `stroke-${color}-500`
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="transform -rotate-90">
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/20"
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-500", getColor())}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", fontSize)}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">
        {label}
      </span>
    </div>
  )
}
