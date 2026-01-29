"use client"

import * as React from "react"
import {
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Zap,
  Flag,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import type { GoalAnalytics, Goal, GoalPriority } from "@/lib/types/goals"
import { motion } from "motion/react"
import { MageGoals, SolarCheckCircleBoldDuotone, StreamlineUltimateCryptoCurrencyBitcoinDollarExchange } from "../icons/icons"

interface GoalAnalyticsDashboardProps {
  analytics: GoalAnalytics
  goals?: Goal[]
  loading?: boolean
  className?: string
}

interface CompactStatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  variant?: "default" | "success" | "warning" | "destructive" | "primary"
  className?: string
}

function CompactStatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  className
}: CompactStatCardProps) {
  const variantStyles = {
    success: "border-emerald-200/50 dark:border-emerald-800/30",
    warning: "border-amber-200/50 dark:border-amber-800/30",
    destructive: "border-red-200/50 dark:border-red-800/30",
    primary: "border-primary/20",
    default: "border-border/50"
  }

  const iconVariantStyles = {
    success: "bg-lime-600/50 dark:bg-lime-600/20 text-lime-800 dark:text-lime-500",
    warning: "bg-amber-600/50 dark:bg-amber-600 text-amber-800",
    destructive: "bg-red-500 dark:bg-red-600 text-red-800",
    primary: "bg-primary/60 dark:bg-primary/20 text-orange-800",
    default: "bg-foreground dark:bg-muted text-white/80"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("p-2 border-border bg-muted/60")}>
        <div className="flex items-center  gap-3">
        <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm", iconVariantStyles[variant])}>
            <Icon className="size-6 " />
          </div>
          <div className="">
            
            <p className="text-[10px] uppercase font-semibold text-muted-foreground ">{title}</p>
            <p className="text-xl font-bold truncate flex items-end gap-2 text-end">{value}  {/* {description && (
              <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
            )} */}</p>
           
          </div>
          
        </div>
      </Card>
    </motion.div>
  )
}

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
}

function ProgressRing({ progress, size = 130, strokeWidth = 16 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const progressColor = progress >= 75 ? "#10b981" : progress >= 50 ? "#3b82f6" : progress >= 25 ? "#f59e0b" : "#ef4444"

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`progress-gradient-${progress}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColor} stopOpacity="1" />
            <stop offset="100%" stopColor={progressColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-accent"
          strokeDasharray="4 8"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progress-gradient-${progress})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {Math.round(progress)}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium mt-1">COMPLETE</span>
      </div>
    </div>
  )
}

export function GoalAnalyticsDashboard({
  analytics,
  goals = [],
  loading = false,
  className
}: GoalAnalyticsDashboardProps) {
  const completionRate = analytics.totalGoals > 0
    ? (analytics.completedGoals / analytics.totalGoals) * 100
    : 0

  const onTrackRate = analytics.activeGoals > 0
    ? (analytics.onTrackGoals / analytics.activeGoals) * 100
    : 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Hero Stats Grid - Matching Goals Page Style */}
   

      {/* Financial Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
           <Card className="max-w-md p-3 border-border ">
      <div className="flex items-center gap-2 ">
              <div className="size-6 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center shadow-sm">
                <MageGoals className="size-3.5 text-white/80" />
              </div>
              <h3 className="text-xs font-semibold">Goals Progress</h3>
            </div>
        <div className="grid grid-cols-2 gap-3">
        <CompactStatCard
          title="Total Goals"
          value={analytics.totalGoals}
          icon={MageGoals}
          description={`${analytics.activeGoals} currently active`}
          variant="primary"
        />

        <CompactStatCard
          title="Completed"
          value={analytics.completedGoals}
          icon={SolarCheckCircleBoldDuotone}
          description={`${completionRate.toFixed(0)}% success rate`}
          variant="success"
        />

        <CompactStatCard
          title="On Track"
          value={analytics.onTrackGoals}
          icon={TrendingUp}
          description={`${onTrackRate.toFixed(0)}% of active goals`}
          variant={analytics.onTrackGoals > analytics.offTrackGoals ? "success" : "warning"}
        />

        <CompactStatCard
          title="Avg Progress"
          value={`${analytics.averageProgress.toFixed(0)}%`}
          icon={Activity}
          description="Across all goals"
          variant="default"
        />
      </div>
      </Card>
      
        {/* Overall Progress Widget */}
        <Card className="border-border p-3">
        <div className="flex items-center gap-2 ">
              <div className="size-6 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center shadow-sm">
                <MageGoals className="size-3.5 text-white/80" />
              </div>
              <h3 className="text-xs font-semibold">Overall Progress</h3>
            </div>
          <div className="flex flex-col items-center">
        
            <ProgressRing progress={analytics.totalProgress} />
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              Financial Goal Achievement Rate
            </p>
          </div>
        </Card>

        {/* Target & Current Amount 
        <Card className="border-border p-4">
          <div className="flex items-start gap-2 mb-3">
            <div className="size-7 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center shadow-sm flex-shrink-0">
              <Flag className="size-3.5 text-white dark:text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold mb-0.5">Target Amount</h3>
              <p className="text-[10px] text-muted-foreground">Total financial goal</p>
            </div>
          </div>
          <CurrencyDisplay
            amountUSD={analytics.totalTargetAmount}
            className="text-2xl font-bold mb-3"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Current Progress</span>
              <span className="font-bold">{analytics.totalProgress.toFixed(1)}%</span>
            </div>
            <Progress value={analytics.totalProgress} className="h-2" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">Current</span>
              <CurrencyDisplay
                amountUSD={analytics.totalCurrentAmount}
                className="text-xs font-bold text-primary"
              />
            </div>
          </div>
        </Card>*/}

        {/* Amount Remaining 
        <Card className="border-border p-4 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/10 dark:to-amber-900/5">
          <div className="flex items-start gap-2 mb-3">
            <div className="size-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <Zap className="size-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold mb-0.5">Remaining</h3>
              <p className="text-[10px] text-muted-foreground">To reach target</p>
            </div>
          </div>
          <CurrencyDisplay
            amountUSD={analytics.totalTargetAmount - analytics.totalCurrentAmount}
            className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3"
          />
          {analytics.averageDaysToCompletion && (
            <div className="flex items-center gap-2 pt-2 border-t border-amber-200/50 dark:border-amber-800/30">
              <Calendar className="size-3 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Est. Completion</p>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  ~{Math.round(analytics.averageDaysToCompletion)} days
                </p>
              </div>
            </div>
          )}
        </Card>*/}

        {/* Priority Distribution */}
        <Card className="border-border p-3">
       
          <div className="flex items-center gap-2 ">
              <div className="size-6 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center shadow-sm">
                <StreamlineUltimateCryptoCurrencyBitcoinDollarExchange className="size-3.5 text-white/80" />
              </div>
              <div>
              <h3 className="text-xs font-semibold leading-none">Priority</h3>
              <p className="text-[10px] text-muted-foreground ">Distribution by level</p>
            </div>
            </div>
          <div className="space-y-2.5">
            {Object.entries(analytics.goalsByPriority).map(([priority, count]) => {
              const total = Object.values(analytics.goalsByPriority).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? ((count as number) / total) * 100 : 0

              const priorityConfig = {
                CRITICAL: { color: "bg-red-500", label: "Critical", variant: "destructive" as const },
                HIGH: { color: "bg-amber-500", label: "High", variant: "warning" as const },
                MEDIUM: { color: "bg-blue-500", label: "Medium", variant: "default" as const },
                LOW: { color: "bg-gray-500", label: "Low", variant: "secondary" as const }
              }

              const config = priorityConfig[priority as GoalPriority] || priorityConfig.MEDIUM

              return (
                <div key={priority} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={cn("size-2 rounded-full", config.color)} />
                      <span className="font-semibold">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-medium">{count}</span>
                      <Badge variant={config.variant} size="sm" className="text-[9px] h-4 px-1.5 min-w-[38px] justify-center font-bold">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-1" />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Type Distribution */}
        <Card className="border-border p-3">
   
          <div className="flex items-center gap-2 ">
              <div className="size-6 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center shadow-sm">
                <MageGoals className="size-3.5 text-white/80" />
              </div>
              <div>
              <h3 className="text-xs font-semibold leading-none">Goal Types</h3>
              <p className="text-[10px] text-muted-foreground ">Top categories</p>
            </div>
            </div>
          <div className="space-y-1.5">
            {Object.entries(analytics.goalsByType)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 6)
              .map(([type, count]) => {
                const total = Object.values(analytics.goalsByType).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? ((count as number) / total) * 100 : 0

                return (
                  <div key={type} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-accent transition-colors">
                    <span className="text-xs font-semibold truncate flex-1">{type.replace(/_/g, " ")}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="h-1 w-12" />
                      <span className="text-[10px] font-bold text-muted-foreground w-6 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>
      </div>

  

      {/* Performance Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Performers */}
        {analytics.topPerformingGoals.length > 0 && (
          <Card className="border-border  p-4">
        

            <div className="flex items-center gap-2 ">
              <div className="size-6 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center shadow-sm">
                <Award className="size-3.5 text-white/80" />
              </div>
              <div>
              <h3 className="text-xs font-semibold leading-none">Top Performers</h3>
              <p className="text-[10px] text-muted-foreground ">Highest progress rates</p>
            </div>
            </div>


            <div className="space-y-1.5">
              {analytics.topPerformingGoals.slice(0, 5).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <Badge variant="outline" size="sm" className="size-5 rounded-full p-0 flex items-center justify-center font-bold text-[9px] flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-xs font-semibold truncate flex-1">{goal.name}</span>
                  <div className="flex items-center gap-1.5">
                    <Progress value={goal.progress || 0} className="w-12 h-1" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 w-8 text-right">
                      {(goal.progress || 0).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Urgent Goals */}
        {analytics.urgentGoals.length > 0 && (
          <Card className="border-border p-4">
     

            <div className="flex items-center gap-2 ">
              <div className="size-6 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm">
                <AlertTriangle className="size-3.5 text-white/80" />
              </div>
              <div>
              <h3 className="text-xs font-semibold leading-none">Needs Attention</h3>
              <p className="text-[10px] text-muted-foreground ">Urgent deadlines</p>
            </div>
            </div>


            <div className="space-y-1.5">
              {analytics.urgentGoals.slice(0, 5).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Clock className="size-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-semibold truncate">{goal.name}</span>
                  </div>
                  <Badge variant="warning-soft" size="sm" className="text-[9px] h-4 px-1.5 flex-shrink-0 font-bold">
                    {goal.daysRemaining}d
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>

    
    </div>
  )
}
