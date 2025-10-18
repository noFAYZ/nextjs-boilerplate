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
  type LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardAction, CardFooter } from "@/components/ui/card"
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
import { MageGoals, SolarCheckCircleBoldDuotone } from "../icons/icons"
import { motion } from "motion/react"
import { GoalSummary } from "./GoalSummary"

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
  if (progress >= 100) return "#3C6300" // emerald-500
  if (!onTrack) return "#ef4444" // red-500
  if (progress >= 75) return "#10b981" // emerald-500
  if (progress >= 50) return "#3b82f6" // blue-500
  if (progress >= 25) return "#f59e0b" // amber-500
  return "#f97316" // orange-500
}

function getProgressFillColor(progress: number, onTrack: boolean): string {
  if (progress >= 100) return "text-green-800"
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
    if (clampedProgress >= 100) return Star
    if (clampedProgress >= 75) return Rocket
    if (clampedProgress >= 50) return Flame
    if (clampedProgress >= 25) return Zap
    return Target
  }

  const DynamicIcon = Icon || getDynamicIcon()

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
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
          className="text-accent"
          fill="none"
          strokeDasharray="2 8"
        />

        {/* Glow layer underneath */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth + 4}
          fill="none"
          stroke={progressColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          opacity={0.2}
          filter={`url(#glow-${progress})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
      <motion.div
        className="absolute flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span
          className={cn(
            "text-lg font-bold",
            fillColor
          )}
          style={{
            textShadow: `0 2px 4px ${progressColor}20`
          }}
        >
          {clampedProgress.toFixed(0)}%
        </span>
      </motion.div>
    </div>
  )
}

function GoalCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card border-border/50 rounded-xl">
      <CardHeader className="p-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-14" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2.5 pt-0">
        <Skeleton className="h-10 w-10 rounded-full mx-auto" />
      </CardContent>
      <CardAction className="p-2.5">
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardAction>
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
    <TooltipProvider>
      <Card
        className={cn(
          "border-border p-2  gap-2 justify-between flex flex-col",
          !goal.isActive && "opacity-80",
          className
        )}
      >
        {/* Header with Overlapping Icon */}

          <div className="flex items-center gap-2 relative">
            <div className="relative ">
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center shadow-md bg-foreground dark:bg-muted "
                )}
              >
                {goal.icon && goal.icon !== 'null' ? (
                  <span className="text-lg">{goal.icon}</span>
                ) : (
                  <MageGoals className={cn("size-7", goal.color && goal.color !== 'null' ? `text-background` : "text-white/80 ")} stroke="2" />
                )}
              </div>
              {goal.isAchieved && (
                <SolarCheckCircleBoldDuotone className="absolute -top-2 -right-2 size-5 text-green-800" />
              )}
            </div>
            <div className="flex-1 min-w-0 mt-2">
              <h3 className="text-sm font-semibold truncate leading-tight">{goal.name}</h3>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                <Badge
                  variant={getPriorityBadgeVariant(goal.priority)}
                  size="sm"
                  className="text-[9px] h-4 px-1.5 font-medium"
                >
                  {goal.priority}
                </Badge>
                {goal.category && goal.category !== 'null' && (
                  <Badge variant="outline" size="sm" className="text-[9px] h-4 px-1.5 font-medium">
                    {goal.category}
                  </Badge>
                )}
                {!goal.isAchieved && !goal.onTrack && progressValue > 0 && (
                  <Badge variant="error-soft" size="sm" className="text-[9px] h-4 px-1.5">
                    <TrendingDown className="size-2.5 mr-0.5" />
                    Behind
                  </Badge>
                )}
                {!goal.isAchieved && goal.onTrack && progressValue > 0 && (
                  <Badge variant="success-soft" size="sm" className="text-[9px] h-4 px-1.5">
                    <TrendingUp className="size-2.5 mr-0.5" />
                    On Track
                  </Badge>
                )}
              </div>
            </div>
         
            
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="xs" className="h-6 w-6 p-0">
                      <MoreVertical className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 h-full">
                    {onViewDetails && (
                      <DropdownMenuItem onClick={() => onViewDetails(goal)} className="text-xs font-medium">
                        <ExternalLink className="mr-1 size-3" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(goal)} className="text-xs font-medium">
                        <Edit className="mr-1 size-3" />
                        Edit Goal
                      </DropdownMenuItem>
                    )}
                    {onCalculateProgress && (
                      <DropdownMenuItem onClick={() => onCalculateProgress(goal)} className="text-xs font-medium">
                        <RefreshCw className="mr-1 size-3" />
                        Refresh Progress
                      </DropdownMenuItem>
                    )}
                    {onAddContribution && !goal.isAchieved && (
                      <DropdownMenuItem onClick={() => onAddContribution(goal)} className="text-xs font-medium">
                        <PlusCircle className="mr-1 size-3" />
                        Add Contribution
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(goal)}
                          className="text-destructive text-xs font-medium"
                        >
                          <Trash2 className="mr-1 size-3" />
                          Delete Goal
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
            
      
          </div>
      
      

        {/* Content with Modern Layout */}
       
       
          <div className="flex items-center gap-4 justify-between">
            {/* Left: Amounts */}

<GoalSummary goal={{
            currentAmount: goal.currentAmount ,
            targetAmount: goal.targetAmount ,
            amountRemaining: goal.amountRemaining,
            isAchieved: goal.isAchieved,
            
          }} showMilestones nextMilestone={nextMilestone} />

            {/* Right: Circular Progress */}
            <div className="flex-shrink-0">
              <CircularProgress
                progress={progress}
                size={110}
                strokeWidth={20}
                progressColor={progressColor}
                fillColor={progressFillColor}
              />
            </div>
          </div>
    
    
 

        {/* Footer */}
        
          <div className="flex items-center justify-between w-full gap-2 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="size-3" />
                  <span className={cn("font-medium", isOverdue && "text-destructive")}>
                    {formatDate(goal.targetDate)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Target Date</TooltipContent>
            </Tooltip>

            {!goal.isAchieved && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-medium",
                    isOverdue ? "text-destructive" : isUrgent ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                  )}>
                    <Clock className="size-3" />
                    {getDaysRemainingText(goal.daysRemaining || 0)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {Math.abs(goal.daysRemaining || 0)} days {(goal.daysRemaining || 0) < 0 ? 'overdue' : 'remaining'}
                </TooltipContent>
              </Tooltip>
            )}

            {goal.isAchieved && (
              <Badge variant="success-icon" size={'sm'}  className="  ">

                Achieved
              </Badge>
            )}
          </div>
        
      </Card>
    </TooltipProvider>
  )
}