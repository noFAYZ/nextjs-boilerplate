"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const chartVariants = cva(
  "w-full h-full",
  {
    variants: {
      variant: {
        default: "",
        minimal: "border-none shadow-none bg-transparent",
        elevated: "shadow-lg",
      },
      size: {
        sm: "h-48",
        default: "h-64",
        lg: "h-80",
        xl: "h-96",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChartProps extends VariantProps<typeof chartVariants> {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  loading?: boolean
  error?: string
  actions?: React.ReactNode
}

export function Chart({
  title,
  description,
  children,
  variant,
  size,
  className,
  loading = false,
  error,
  actions,
}: ChartProps) {
  if (loading) {
    return (
      <Card className={cn(chartVariants({ variant, size, className }))}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading chart...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn(chartVariants({ variant, size, className }))}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-destructive">Error loading chart</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(chartVariants({ variant, size, className }))}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Simple Bar Chart Component
interface BarChartData {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: BarChartData[]
  className?: string
  showValues?: boolean
  animated?: boolean
}

export function SimpleBarChart({
  data,
  className,
  showValues = true,
  animated = true,
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            {showValues && (
              <span className="text-muted-foreground">{item.value}</span>
            )}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                item.color || "bg-primary",
                animated && "animate-in slide-in-from-left"
              )}
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                animationDelay: animated ? `${index * 100}ms` : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Simple Pie Chart Component (CSS-based)
interface PieChartData {
  label: string
  value: number
  color: string
}

interface SimplePieChartProps {
  data: PieChartData[]
  size?: number
  className?: string
  showLabels?: boolean
}

export function SimplePieChart({
  data,
  size = 200,
  className,
  showLabels = true,
}: SimplePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const previousPercentages = data
      .slice(0, index)
      .reduce((sum, prev) => sum + (prev.value / total) * 100, 0)
    
    return {
      ...item,
      percentage,
      offset: previousPercentages,
    }
  })

  return (
    <div className={cn("flex items-center gap-8", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 20) / 2}
            fill="transparent"
            stroke="hsl(var(--muted))"
            strokeWidth="2"
          />
          {segments.map((segment, index) => {
            const radius = (size - 20) / 2
            const circumference = 2 * Math.PI * radius
            const strokeDasharray = `${
              (segment.percentage / 100) * circumference
            } ${circumference}`
            const strokeDashoffset = -(
              (segment.offset / 100) * circumference
            )

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              />
            )
          })}
        </svg>
      </div>
      
      {showLabels && (
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Trend Chart Component (Simple line chart)
interface TrendData {
  label: string
  value: number
}

interface TrendChartProps {
  data: TrendData[]
  className?: string
  color?: string
  showDots?: boolean
  animated?: boolean
}

export function TrendChart({
  data,
  className,
  color = "hsl(var(--primary))",
  showDots = true,
  animated = true,
}: TrendChartProps) {
  const width = 300
  const height = 100
  const padding = 20

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
    const y = padding + (1 - (item.value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
    return { x, y, ...item }
  })

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x},${point.y}`
  }, '')

  return (
    <div className={cn("w-full", className)}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Trend line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className={cn("transition-all duration-1000", animated && "animate-in")}
        />
        
        {/* Data points */}
        {showDots && points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={color}
            className={cn("transition-all duration-500", animated && "animate-in")}
            style={{
              animationDelay: animated ? `${index * 100}ms` : undefined,
            }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}

export { chartVariants }