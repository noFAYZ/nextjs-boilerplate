"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, TrendingDown, Minus, MoreVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SimpleBarChart, TrendChart } from "@/components/ui/chart"

const statsCardVariants = cva(
  "transition-all duration-200 hover:shadow-md relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        gradient: "bg-gradient-to-br from-card to-card/80",
        bordered: "border-2",
        elevated: "shadow-lg hover:shadow-xl",
        minimal: "border-none shadow-none bg-transparent",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      trend: {
        positive: "border-l-4 border-l-emerald-500",
        negative: "border-l-4 border-l-red-500",
        neutral: "border-l-4 border-l-muted-foreground",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      trend: "none",
    },
  }
)

export interface StatsCardData {
  title: string
  value: string | number
  change?: {
    value: number
    period?: string
    isPercentage?: boolean
  }
  icon?: React.ReactNode
  description?: string
  chart?: {
    type: "bar" | "trend"
    data: Array<{ label: string; value: number }>
    color?: string
  }
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
  data: StatsCardData
  loading?: boolean
  className?: string
  showChart?: boolean
  animated?: boolean
}

function getTrendDirection(value: number): "positive" | "negative" | "neutral" {
  if (value > 0) return "positive"
  if (value < 0) return "negative"
  return "neutral"
}

function getTrendIcon(direction: "positive" | "negative" | "neutral") {
  switch (direction) {
    case "positive":
      return <TrendingUp className="size-3" />
    case "negative":
      return <TrendingDown className="size-3" />
    default:
      return <Minus className="size-3" />
  }
}

function getTrendColor(direction: "positive" | "negative" | "neutral") {
  switch (direction) {
    case "positive":
      return "text-emerald-600 dark:text-emerald-400"
    case "negative":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-muted-foreground"
  }
}

export function StatsCard({
  data,
  variant,
  size,
  trend,
  loading = false,
  className,
  showChart = false,
  animated = true,
}: StatsCardProps) {
  const trendDirection = data.change ? getTrendDirection(data.change.value) : "none"
  const effectiveTrend = trend || trendDirection

  if (loading) {
    return (
      <Card className={cn(statsCardVariants({ variant, size, trend: effectiveTrend, className }))}>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-8 bg-muted animate-pulse rounded w-2/3" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            </div>
            <div className="size-8 bg-muted animate-pulse rounded" />
          </div>
          {showChart && (
            <div className="h-16 bg-muted animate-pulse rounded" />
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(statsCardVariants({ variant, size, trend: effectiveTrend, className }))}>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {data.title}
            </p>
            <p 
              className={cn(
                "text-3xl font-bold tracking-tight",
                animated && "animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
              )}
            >
              {data.value}
            </p>
            
            {/* Change indicator */}
            {data.change && (
              <div className="flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className={cn(
                    "gap-1 text-xs font-medium px-2 py-1",
                    getTrendColor(trendDirection)
                  )}
                >
                  {getTrendIcon(trendDirection)}
                  {data.change.isPercentage !== false ? (
                    <>
                      {Math.abs(data.change.value).toFixed(1)}%
                    </>
                  ) : (
                    <>
                      {Math.abs(data.change.value)}
                    </>
                  )}
                </Badge>
                {data.change.period && (
                  <span className="text-xs text-muted-foreground">
                    {data.change.period}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {data.description && (
              <p className="text-xs text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>

          {/* Icon and Actions */}
          <div className="flex items-center gap-2">
            {data.icon && (
              <div className="text-muted-foreground opacity-60">
                {data.icon}
              </div>
            )}
            
            {data.actions && data.actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {data.actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Chart */}
        {showChart && data.chart && (
          <div className={cn("mt-4", animated && "animate-in fade-in-0 duration-1000 delay-300")}>
            {data.chart.type === "bar" ? (
              <SimpleBarChart
                data={data.chart.data}
                showValues={false}
                animated={animated}
              />
            ) : (
              <TrendChart
                data={data.chart.data}
                color={data.chart.color}
                animated={animated}
                showDots={false}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Stats Grid Component
interface StatsGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: "sm" | "md" | "lg"
  className?: string
}

export function StatsGrid({
  children,
  cols = 4,
  gap = "md",
  className,
}: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-1 sm:grid-cols-2": cols === 2,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": cols === 3,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": cols === 4,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5": cols === 5,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6": cols === 6,
        },
        {
          "gap-4": gap === "sm",
          "gap-6": gap === "md",
          "gap-8": gap === "lg",
        },
        className
      )}
    >
      {children}
    </div>
  )
}

// Comparison Stats Card
interface ComparisonStatsProps extends Omit<StatsCardProps, "data"> {
  current: StatsCardData
  previous: StatsCardData
  comparisonLabel?: string
}

export function ComparisonStatsCard({
  current,
  previous,
  comparisonLabel = "vs previous period",
  ...props
}: ComparisonStatsProps) {
  const currentValue = typeof current.value === "string" 
    ? parseFloat(current.value.replace(/[^\d.-]/g, "")) 
    : current.value
  
  const previousValue = typeof previous.value === "string"
    ? parseFloat(previous.value.replace(/[^\d.-]/g, ""))
    : previous.value

  const change = {
    value: ((currentValue - previousValue) / previousValue) * 100,
    period: comparisonLabel,
    isPercentage: true,
  }

  const enhancedData: StatsCardData = {
    ...current,
    change,
  }

  return <StatsCard {...props} data={enhancedData} />
}

export { statsCardVariants }