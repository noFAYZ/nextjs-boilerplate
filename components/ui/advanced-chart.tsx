"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, MoreHorizontal, Download, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChartDataPoint {
  label: string
  value: number
  color?: string
  secondaryValue?: number
  category?: string
}

interface ChartProps {
  data: ChartDataPoint[]
  title?: string
  description?: string
  type: "line" | "bar" | "pie" | "area" | "donut" | "gauge" | "heatmap"
  height?: number
  showGrid?: boolean
  showAxis?: boolean
  showValues?: boolean
  showLegend?: boolean
  className?: string
  variant?: "default" | "minimal" | "card"
  trend?: { value: number; period: string }
  exportable?: boolean
  interactive?: boolean
}

// SVG Chart Components
function LineChart({ 
  data, 
  height = 200, 
  showGrid = true, 
  showValues = false,
  interactive = false 
}: Partial<ChartProps>) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  
  if (!data?.length) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  const width = 400
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + ((maxValue - point.value) / range) * chartHeight
    return { x, y, ...point }
  })

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={width - padding}
                y2={padding + ratio * chartHeight}
                stroke="currentColor"
                strokeWidth={0.5}
              />
            ))}
          </g>
        )}
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#gradient)"
          className="opacity-20"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={interactive && hoveredIndex === index ? 6 : 4}
            fill="hsl(var(--primary))"
            className={cn(
              "transition-all cursor-pointer",
              interactive && "hover:r-6"
            )}
            onMouseEnter={() => interactive && setHoveredIndex(index)}
            onMouseLeave={() => interactive && setHoveredIndex(null)}
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Values */}
        {showValues && points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={point.y - 10}
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-medium"
          >
            {point.value}
          </text>
        ))}
      </svg>
      
      {/* Hover tooltip */}
      {interactive && hoveredIndex !== null && (
        <div 
          className="absolute bg-background border rounded-lg p-2 shadow-lg pointer-events-none z-10"
          style={{
            left: points[hoveredIndex].x - 50,
            top: points[hoveredIndex].y - 60
          }}
        >
          <div className="text-xs font-medium">{data[hoveredIndex].label}</div>
          <div className="text-sm text-primary">{data[hoveredIndex].value}</div>
        </div>
      )}
    </div>
  )
}

function BarChart({ 
  data, 
  height = 200, 
  showValues = false,
  interactive = false 
}: Partial<ChartProps>) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  
  if (!data?.length) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const width = 400
  const padding = 40
  const chartHeight = height - 2 * padding
  const barWidth = (width - 2 * padding) / data.length * 0.8
  const barSpacing = (width - 2 * padding) / data.length * 0.2

  return (
    <div className="relative">
      <svg width={width} height={height}>
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * chartHeight
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
          const y = height - padding - barHeight
          const isHovered = hoveredIndex === index

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={point.color || "hsl(var(--primary))"}
                className={cn(
                  "transition-all",
                  interactive && "hover:opacity-80 cursor-pointer",
                  isHovered && "opacity-80"
                )}
                onMouseEnter={() => interactive && setHoveredIndex(index)}
                onMouseLeave={() => interactive && setHoveredIndex(null)}
              />
              
              {/* Value label */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-xs font-medium"
                >
                  {point.value}
                </text>
              )}
              
              {/* Category label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>
      
      {/* Hover tooltip */}
      {interactive && hoveredIndex !== null && (
        <div 
          className="absolute bg-background border rounded-lg p-2 shadow-lg pointer-events-none z-10"
          style={{
            left: padding + hoveredIndex * (barWidth + barSpacing) + barWidth / 2 - 30,
            top: height - padding - (data[hoveredIndex].value / Math.max(...data.map(d => d.value))) * chartHeight - 50
          }}
        >
          <div className="text-xs font-medium">{data[hoveredIndex].label}</div>
          <div className="text-sm text-primary">{data[hoveredIndex].value}</div>
        </div>
      )}
    </div>
  )
}

function PieChart({ 
  data, 
  height = 200,
  interactive = false 
}: Partial<ChartProps>) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  
  if (!data?.length) return null

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const size = height
  const radius = size / 2 - 20
  const centerX = size / 2
  const centerY = size / 2

  let currentAngle = 0
  const slices = data.map((point, index) => {
    const angle = (point.value / total) * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const largeArcFlag = angle > Math.PI ? 1 : 0
    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return {
      ...point,
      pathData,
      startAngle,
      endAngle,
      percentage: (point.value / total) * 100
    }
  })

  return (
    <div className="relative flex items-center">
      <svg width={size} height={size}>
        {slices.map((slice, index) => {
          const isHovered = hoveredIndex === index
          return (
            <path
              key={index}
              d={slice.pathData}
              fill={slice.color || `hsl(${index * 137.5 % 360}, 70%, 60%)`}
              className={cn(
                "transition-all",
                interactive && "hover:opacity-80 cursor-pointer",
                isHovered && "opacity-80 scale-105 origin-center"
              )}
              onMouseEnter={() => interactive && setHoveredIndex(index)}
              onMouseLeave={() => interactive && setHoveredIndex(null)}
              style={isHovered ? { transformOrigin: `${centerX}px ${centerY}px` } : undefined}
            />
          )
        })}
      </svg>
      
      {/* Legend */}
      <div className="ml-6 space-y-2">
        {slices.map((slice, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 text-sm transition-opacity",
              hoveredIndex !== null && hoveredIndex !== index && "opacity-50"
            )}
          >
            <div
              className="size-3 rounded-full"
              style={{
                backgroundColor: slice.color || `hsl(${index * 137.5 % 360}, 70%, 60%)`
              }}
            />
            <span className="font-medium">{slice.label}</span>
            <span className="text-muted-foreground">
              {slice.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GaugeChart({
  data,
  height = 200,
}: Partial<ChartProps>) {
  if (!data?.length) return null

  const value = data[0].value
  const maxValue = 100 // Assuming gauge goes to 100
  const percentage = Math.min(value / maxValue, 1)
  
  const size = height
  const radius = size / 2 - 20
  const strokeWidth = 12
  const center = size / 2
  const circumference = Math.PI * radius // Half circle

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 40}>
        {/* Background arc */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos(Math.PI * (1 - percentage))} ${center + radius * Math.sin(Math.PI * (1 - percentage))}`}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        
        {/* Center text */}
        <text
          x={center}
          y={center + 8}
          textAnchor="middle"
          className="text-2xl font-bold fill-foreground"
        >
          {value}%
        </text>
      </svg>
      
      <div className="text-center mt-2">
        <div className="font-medium">{data[0].label}</div>
      </div>
    </div>
  )
}

export function AdvancedChart({
  data,
  title,
  description,
  type,
  height = 200,
  showGrid = true,
  showAxis = true,
  showValues = false,
  showLegend = true,
  className,
  variant = "card",
  trend,
  exportable = false,
  interactive = true,
}: ChartProps) {
  const handleExport = () => {
    console.log("Exporting chart data:", data)
    // Implement export functionality
  }

  const renderChart = () => {
    switch (type) {
      case "line":
      case "area":
        return (
          <LineChart
            data={data}
            height={height}
            showGrid={showGrid}
            showValues={showValues}
            interactive={interactive}
          />
        )
      case "bar":
        return (
          <BarChart
            data={data}
            height={height}
            showValues={showValues}
            interactive={interactive}
          />
        )
      case "pie":
      case "donut":
        return (
          <PieChart
            data={data}
            height={height}
            interactive={interactive}
          />
        )
      case "gauge":
        return (
          <GaugeChart
            data={data}
            height={height}
          />
        )
      default:
        return (
          <LineChart
            data={data}
            height={height}
            showGrid={showGrid}
            showValues={showValues}
            interactive={interactive}
          />
        )
    }
  }

  const content = (
    <div className="space-y-4">
      {(title || description || trend || exportable) && (
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && <h3 className="font-semibold tracking-tight">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                {trend.value > 0 ? (
                  <TrendingUp className="size-4 text-green-500" />
                ) : (
                  <TrendingDown className="size-4 text-red-500" />
                )}
                <span className={cn(
                  "font-medium",
                  trend.value > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {trend.value > 0 ? "+" : ""}{trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.period}</span>
              </div>
            )}
          </div>
          
          {exportable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="size-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="size-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize2 className="size-4 mr-2" />
                  View Fullscreen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      
      <div className="flex justify-center">
        {renderChart()}
      </div>
    </div>
  )

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-4", className)}>
        {content}
      </div>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        {content}
      </CardContent>
    </Card>
  )
}

export type { ChartDataPoint, ChartProps }