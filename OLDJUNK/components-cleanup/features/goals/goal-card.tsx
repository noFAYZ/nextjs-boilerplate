import * as React from "react"
import {
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Edit,
  Trash2,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  MoreVertical,
  ExternalLink,
  Award,
  TrendingDown,
  Star,
  Flame,
  Rocket,
  Zap,
  type LucideIcon,
  Trophy,
  Medal,
  Gauge,
  Goal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import type { Goal } from "@/lib/types/goals"
import { MageGoals, SolarCalendarBoldDuotone, SolarCheckCircleBoldDuotone, SolarClockCircleBoldDuotone } from "../icons/icons"
import { motion } from "motion/react"

interface GoalCardProps {
  goal: Goal
  viewMode?: "grid" | "list"
  showMilestones?: boolean
  compactMode?: boolean
  loading?: boolean
  onEdit?: (goal: Goal) => void
  onDelete?: (goal: Goal) => void
  onCalculateProgress?: (goal: Goal) => void
  onAddContribution?: (goal: Goal) => void
  onViewDetails?: (goal: Goal) => void
  className?: string
}

function getPriorityBadgeVariant(priority: Goal["priority"]) {
  switch (priority) {
    case "CRITICAL": return "destructive"
    case "HIGH": return "warning"
    case "MEDIUM": return "default"
    case "LOW": return "secondary"
    default: return "default"
  }
}

function getProgressColor(progress: number, onTrack: boolean): string {
  if (progress >= 100) return "#54850F" // emerald-500
  if (!onTrack) return "#ef4444" // red-500
  if (progress >= 75) return "#10b981" // emerald-500
  if (progress >= 50) return "#3b82f6" // blue-500
  if (progress >= 25) return "#f59e0b" // amber-500
  return "#f97316" // orange-500
}

function getProgressFillColor(progress: number, onTrack: boolean): string {
  if (progress >= 100) return "text-lime-800"
  if (!onTrack) return "text-red-500"
  if (progress >= 75) return "text-emerald-500"
  if (progress >= 50) return "text-blue-500"
  if (progress >= 25) return "text-amber-500"
  return "text-orange-500"
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getDaysRemainingText(days: number) {
  if (days < 0) return "Overdue"
  if (days === 0) return "Due today"
  if (days === 1) return "1 day left"
  return `${days} days left`
}

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  progressColor?: string // any color string or tailwind class
  fillColor?: string
  icon?: LucideIcon
}

export function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 10,
  className,
  progressColor = "", // fallback blue
  fillColor = "text-foreground",
  icon: Icon = Zap,
}: CircularProgressProps) {
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(progress, 100)
  const offset = circumference - (clampedProgress / 100) * circumference

  // Compute icon position along circle path
  const angle = (clampedProgress / 100) * 2 * Math.PI - Math.PI / 2
  const tipX = size / 2 + radius * Math.cos(angle)
  const tipY = size / 2 + radius * Math.sin(angle)

  // Get dynamic icon based on progress
  const getDynamicIcon = () => {
    if (clampedProgress >= 100) return Trophy        // Achievement
    if (clampedProgress >= 75) return Medal         // Excellence / near-complete
    if (clampedProgress >= 50) return Gauge         // Strong progress
    if (clampedProgress >= 25) return TrendingUp    // Building momentum
    return Goal                                     // Starting point
  }

  const DynamicIcon = Icon || getDynamicIcon()

  return (
    <div className={cn("relative flex items-center justify-center bg-muted rounded-full", className)}>
      <svg
        width={size}
        height={size}
        className="transform rotate-[-90deg]"
        style={{ overflow: "visible" }}
      >
        {/* Define gradient for progress stroke */}
        <defs>
          <linearGradient id={`gradient-${progress}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColor} stopOpacity="1" />
            <stop offset="50%" stopColor={progressColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={progressColor} stopOpacity="1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`glow-${progress}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shimmer effect */}
          <linearGradient id={`shimmer-${progress}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={progressColor} stopOpacity="0.3">
              <animate
                attributeName="offset"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor={progressColor} stopOpacity="0.8">
              <animate
                attributeName="offset"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={progressColor} stopOpacity="0.3">
              <animate
                attributeName="offset"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* Background Circle with dots pattern */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-foreground/20"
          fill="none"
          strokeDasharray="2 8"
        />

 

        {/* Main Progress Circle with gradient */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={`url(#gradient-${progress})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className={'shadow-lg drop-shadow-2xl backdrop-blur-3xl'}
        />

        {/* Shimmer overlay on progress */}
        {clampedProgress > 10 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth / 2}
            fill="none"
            stroke={`url(#shimmer-${progress})`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            opacity={0.6}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        )}

        {/* Particle trail dots */}
        {clampedProgress > 0 && Array.from({ length: Math.min(Math.floor(clampedProgress / 10), 8) }).map((_, i) => {
          const particleAngle = ((clampedProgress - (i * 10)) / 100) * 2 * Math.PI - Math.PI / 2
          const particleX = size / 2 + radius * Math.cos(particleAngle)
          const particleY = size / 2 + radius * Math.sin(particleAngle)

          return (
            <motion.circle
              key={i}
              cx={particleX}
              cy={particleY}
              r={strokeWidth / 6}
              fill={progressColor}
              opacity={0.4 - (i * 0.04)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4 - (i * 0.04), scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          )
        })}

      </svg>

      {/* Center text with enhanced styling */}
      <div
        className="absolute flex flex-col items-center justify-center"
  
      >
        <span
          className={cn(
            "text-sm font-bold",
            fillColor
          )}
          style={{
            textShadow: `0 2px 4px ${progressColor}20`
          }}
        >{clampedProgress >=100 ? <>   <SolarCheckCircleBoldDuotone className="size-8 text-lime-700" /></> : <>{clampedProgress.toFixed(0)}%</>}
         
        </span>
      </div>
    </div>
  )
}

function GoalCardSkeleton() {
  return (
    <Card className="border border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        {/* Left */}
        <div className="flex items-start gap-3 flex-1">
          <Skeleton className="size-10 sm:size-12 rounded-lg flex-shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-end justify-between gap-3 sm:gap-4 sm:flex-col sm:items-end flex-1 sm:flex-none w-full sm:w-auto">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="size-16 rounded-full flex-shrink-0" />
        </div>
      </div>

      <div className="h-px bg-border/50 my-2.5" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-6" />
      </div>
    </Card>
  )
}

export function GoalCard({
  goal,
  viewMode = "grid",
  showMilestones = true,
  compactMode = false,
  loading = false,
  onEdit,
  onDelete,
  onCalculateProgress,
  onAddContribution,
  onViewDetails,
  className,
}: GoalCardProps) {
  const progressValue = goal.progress || 0
  const progressColor = getProgressColor(progressValue, goal.onTrack)
  const progressFillColor = getProgressFillColor(progressValue, goal.onTrack)
  const isOverdue = (goal.daysRemaining || 0) < 0
  const isUrgent = (goal.daysRemaining || 0) > 0 && (goal.daysRemaining || 0) <= 7
  const activeMilestones = goal.milestones?.filter(m => !m.isAchieved) || []
  const nextMilestone = activeMilestones[0]

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  if (loading) {
    return <GoalCardSkeleton />
  }

  return (
      <Card
        className={cn(
          "group relative border border-border/50",
          "cursor-pointer transition-all hover:shadow-md hover:border-border/80",
          !goal.isActive && "opacity-70",
          className
        )}
        onClick={() => onViewDetails?.(goal)}
        interactive
      >
  <div className="grid grid-cols-[1fr_auto] gap-4 h-full">
  <div className="flex flex-col min-h-full justify-between">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          {/* Left: Icon & Title */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Icon Badge */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "size-10 sm:size-12 rounded-full flex items-center shadow justify-center border",
                  "bg-muted/50 group-hover:bg-muted group-hover:ring-border/80"
                )}
              >
                {goal.icon && goal.icon !== 'null' ? (
                  <span className="text-lg sm:text-xl">{goal.icon}</span>
                ) : (
                  <MageGoals className="size-5 sm:size-6 text-muted-foreground" stroke="1.5" />
                )}
              </div>
      
{goal.isAchieved || progress >=100 && (
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5 shadow-md">
                  <SolarCheckCircleBoldDuotone className="h-5 w-5 text-lime-700" />
                </div>
              )}
            </div>

            {/* Title & Status */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-semibold truncate text-foreground">
                  {goal.name}
                </h3>
                {goal.isAchieved && (
                  <Badge variant="outline" size="sm" className="text-[10px] h-5 px-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Achieved
                  </Badge>
                )}
                    {goal.category && goal.category !== 'null' && (
                  <Badge variant="soft" size="sm" className="text-[9px] h-4 px-1.5 font-medium">
                    {goal.category}
                  </Badge>
                )}
              </div>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={getPriorityBadgeVariant(goal.priority)}
                      size="sm"
                      className="text-[9px] h-4 px-1.5 font-medium cursor-help"
                    >
                      {goal.priority}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Priority Level</TooltipContent>
                </Tooltip>

            

                {!goal.isAchieved && !goal.onTrack && progressValue > 0 && (
                  <Badge variant="error-soft" size="sm" className="text-[9px] h-4 px-1.5 flex items-center gap-0.5">
                    <TrendingDown className="size-2.5" />
                    Behind
                  </Badge>
                )}

                {!goal.isAchieved && goal.onTrack && progressValue > 0 && (
                  <Badge variant="success-soft" size="sm" className="text-[9px] h-4 px-1.5 flex items-center gap-0.5">
                    <TrendingUp className="size-2.5" />
                    On Track
                  </Badge>
                )}
              </div>
            </div>
          </div>

       
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 my-2.5" />

        {/* Footer: Timeline & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">

              {/* Amount & Timeline */}
              <div className="flex  items-end gap-1">
           <CurrencyDisplay amountUSD={goal.currentAmount || 0} variant="small" className="font-semibold" />
               
             /
           
                 <CurrencyDisplay amountUSD={goal.targetAmount || 0} variant="small" className="text-muted-foreground font-semibold" />
         
            </div>

          {/* Left: Date & Days */}
          <div className="flex items-center gap-3 text-xs">
      {/*       <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-help">
                  <SolarCalendarBoldDuotone className="size-4 flex-shrink-0" />
                  <span className={cn("font-medium", isOverdue && "text-destructive")}>
                    {formatDate(goal.targetDate)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Target Date</TooltipContent>
            </Tooltip> */}

            {!goal.isAchieved && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center gap-1.5 font-medium cursor-help transition-colors",
                    isOverdue
                      ? "text-destructive"
                      : isUrgent
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                    <SolarClockCircleBoldDuotone className="size-4 flex-shrink-0" />
                    {getDaysRemainingText(goal.daysRemaining || 0)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {Math.abs(goal.daysRemaining || 0)} days {(goal.daysRemaining || 0) < 0 ? 'overdue' : 'remaining'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Right: Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(goal)} className="text-xs cursor-pointer">
                  <ExternalLink className="mr-2 size-3" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(goal)} className="text-xs cursor-pointer">
                  <Edit className="mr-2 size-3" />
                  Edit Goal
                </DropdownMenuItem>
              )}
              {onCalculateProgress && (
                <DropdownMenuItem onClick={() => onCalculateProgress(goal)} className="text-xs cursor-pointer">
                  <RefreshCw className="mr-2 size-3" />
                  Refresh Progress
                </DropdownMenuItem>
              )}
              {onAddContribution && !goal.isAchieved && (
                <DropdownMenuItem onClick={() => onAddContribution(goal)} className="text-xs cursor-pointer">
                  <PlusCircle className="mr-2 size-3" />
                  Add Contribution
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(goal)}
                    className="text-destructive text-xs cursor-pointer"
                  >
                    <Trash2 className="mr-2 size-3" />
                    Delete Goal
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>

         {/* RIGHT COLUMN: FULL HEIGHT PROGRESS */}
    <div className="flex items-center justify-center ">
      <CircularProgress
        progress={progress}
        size={85}
        strokeWidth={13}
        progressColor={progressColor}
        fillColor={progressFillColor}
      />
    </div>

        </div>
      </Card>

      
  
  )
}