"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, TrendingDown, Minus, MoreVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

const metricCardVariants = cva(
  "transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "",
        success: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20",
        warning: "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
        danger: "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
        info: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type TrendDirection = "up" | "down" | "neutral"

export interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  title: string
  value: string | number
  previousValue?: string | number
  trend?: {
    value: number
    direction?: TrendDirection
    period?: string
  }
  description?: string
  icon?: React.ReactNode
  loading?: boolean
  actions?: Array<{
    label: string
    onClick: () => void
  }>
  className?: string
  children?: React.ReactNode
}

function formatTrendValue(value: number): string {
  return Math.abs(value).toFixed(1)
}

function getTrendColor(direction: TrendDirection): string {
  switch (direction) {
    case "up":
      return "text-emerald-600 dark:text-emerald-400"
    case "down":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-muted-foreground"
  }
}

function getTrendIcon(direction: TrendDirection) {
  switch (direction) {
    case "up":
      return <TrendingUp className="size-3" />
    case "down":
      return <TrendingDown className="size-3" />
    default:
      return <Minus className="size-3" />
  }
}

function getTrendDirection(current: number, previous: number): TrendDirection {
  if (current > previous) return "up"
  if (current < previous) return "down"
  return "neutral"
}

export function MetricCard({
  title,
  value,
  previousValue,
  trend,
  description,
  icon,
  loading = false,
  actions,
  variant,
  size,
  className,
  children,
}: MetricCardProps) {
  const calculatedTrend = React.useMemo(() => {
    if (trend) return trend

    if (previousValue !== undefined && typeof value === "number" && typeof previousValue === "number") {
      const change = ((value - previousValue) / previousValue) * 100
      return {
        value: Math.abs(change),
        direction: getTrendDirection(value, previousValue),
      }
    }

    return undefined
  }, [trend, value, previousValue])

  if (loading) {
    return (
      <Card className={cn(metricCardVariants({ variant, size }), className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          {icon && <Skeleton className="size-4" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(metricCardVariants({ variant, size }), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-3" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center gap-2">
            {calculatedTrend && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 text-xs font-medium",
                  getTrendColor(calculatedTrend.direction || "neutral")
                )}
              >
                {getTrendIcon(calculatedTrend.direction || "neutral")}
                {formatTrendValue(calculatedTrend.value)}%
                {calculatedTrend.period && ` ${calculatedTrend.period}`}
              </Badge>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children && <div className="mt-3">{children}</div>}
      </CardContent>
    </Card>
  )
}

// Compound component for metric card grid
export function MetricCardGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}

export { metricCardVariants }