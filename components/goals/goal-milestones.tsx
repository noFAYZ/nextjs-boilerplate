"use client"

import * as React from "react"
import {
  CheckCircle,
  Circle,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Goal, GoalMilestone } from "@/lib/types/goals"

interface GoalMilestonesProps {
  goal: Goal
  showDetails?: boolean
  compact?: boolean
  className?: string
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return "Not achieved"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface MilestoneItemProps {
  milestone: GoalMilestone
  goal: Goal
  isNext: boolean
  compact?: boolean
}

function MilestoneItem({ milestone, goal, isNext, compact }: MilestoneItemProps) {
  const targetAmount = (milestone.targetPercentage / 100) * goal.targetAmount
  const isAchieved = milestone.isAchieved
  const progress = (goal.progress / milestone.targetPercentage) * 100

  return (
    <div className={cn(
      "relative flex gap-4 pb-6",
      compact && "pb-4"
    )}>
      {/* Milestone indicator */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "flex items-center justify-center size-10 rounded-full border-2 transition-all",
          isAchieved
            ? "bg-emerald-100 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
            : isNext
            ? "bg-primary/10 border-primary text-primary animate-pulse"
            : "bg-muted border-border text-muted-foreground"
        )}>
          {isAchieved ? (
            <CheckCircle className="size-5" />
          ) : isNext ? (
            <Target className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </div>

        {/* Connecting line */}
        <div className={cn(
          "w-0.5 flex-1 mt-2",
          isAchieved ? "bg-emerald-500" : "bg-border"
        )} />
      </div>

      {/* Milestone content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{milestone.name}</h4>
              <Badge
                variant={isAchieved ? "success-soft" : isNext ? "default" : "outline"}
                size="sm"
              >
                {milestone.targetPercentage}%
              </Badge>
            </div>

            {milestone.description && !compact && (
              <p className="text-sm text-muted-foreground">
                {milestone.description}
              </p>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold">
              {formatCurrency(targetAmount, goal.currency)}
            </div>
            {isAchieved && milestone.achievedDate && (
              <div className="text-xs text-muted-foreground">
                {formatDate(milestone.achievedDate)}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for next milestone */}
        {!isAchieved && isNext && (
          <div className="space-y-1 mb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress to milestone</span>
              <span>{Math.min(progress, 100).toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-1.5" />
          </div>
        )}

        {/* Celebration message */}
        {isAchieved && milestone.celebration && !compact && (
          <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {milestone.celebration}
            </p>
          </div>
        )}

        {/* Achievement details */}
        {isAchieved && !compact && (
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {milestone.achievedAmount && (
              <div className="flex items-center gap-1">
                <TrendingUp className="size-3" />
                <span>Achieved at {formatCurrency(milestone.achievedAmount, goal.currency)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function GoalMilestones({
  goal,
  showDetails = true,
  compact = false,
  className
}: GoalMilestonesProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  if (!goal.milestones || goal.milestones.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Target className="size-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No milestones set for this goal</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add milestones to track incremental progress
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedMilestones = [...goal.milestones].sort((a, b) => a.sortOrder - b.sortOrder)
  const achievedCount = sortedMilestones.filter(m => m.isAchieved).length
  const totalCount = sortedMilestones.length
  const nextMilestone = sortedMilestones.find(m => !m.isAchieved)
  const completionRate = (achievedCount / totalCount) * 100

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Milestones
            </CardTitle>
            <CardDescription className="mt-1">
              Track your progress with key milestones
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              {achievedCount}/{totalCount}
            </div>
            <div className="text-xs text-muted-foreground">
              {completionRate.toFixed(0)}% complete
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="space-y-2 pt-4">
          <Progress value={completionRate} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Milestone Progress</span>
            <Badge variant={achievedCount === totalCount ? "success" : "default"} size="sm">
              {achievedCount} achieved
            </Badge>
          </div>
        </div>

        {/* Next milestone highlight */}
        {nextMilestone && (
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Target className="size-4 text-primary" />
              <span className="text-sm font-semibold">Next Milestone</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{nextMilestone.name}</span>
              <Badge variant="outline" size="sm">
                {nextMilestone.targetPercentage}% - {formatCurrency((nextMilestone.targetPercentage / 100) * goal.targetAmount, goal.currency)}
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className="space-y-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" size="sm">
              <span className="text-sm font-medium">
                {isExpanded ? "Hide" : "Show"} Milestone Details
              </span>
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="pt-4">
              {sortedMilestones.map((milestone, index) => (
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  goal={goal}
                  isNext={milestone.id === nextMilestone?.id}
                  compact={compact}
                />
              ))}

              {/* Final goal indicator */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex items-center justify-center size-10 rounded-full border-2 transition-all",
                    goal.isAchieved
                      ? "bg-emerald-100 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "bg-muted border-border text-muted-foreground"
                  )}>
                    {goal.isAchieved ? (
                      <Trophy className="size-5" />
                    ) : (
                      <Target className="size-5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        Goal Complete
                        <Badge variant={goal.isAchieved ? "success" : "outline"} size="sm">
                          100%
                        </Badge>
                      </h4>
                      {goal.isAchieved && goal.achievedDate && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Achieved on {formatDate(goal.achievedDate)}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {formatCurrency(goal.targetAmount, goal.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}

// Compact milestone list for use in cards
interface MilestoneListProps {
  milestones: GoalMilestone[]
  goal: Goal
  maxDisplay?: number
  className?: string
}

export function MilestoneList({
  milestones,
  goal,
  maxDisplay = 3,
  className
}: MilestoneListProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.sortOrder - b.sortOrder)
  const displayMilestones = sortedMilestones.slice(0, maxDisplay)
  const remainingCount = sortedMilestones.length - maxDisplay

  return (
    <div className={cn("space-y-2", className)}>
      {displayMilestones.map((milestone) => {
        const targetAmount = (milestone.targetPercentage / 100) * goal.targetAmount

        return (
          <div
            key={milestone.id}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg transition-colors",
              milestone.isAchieved
                ? "bg-emerald-50 dark:bg-emerald-900/10"
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-2">
              {milestone.isAchieved ? (
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span className={cn(
                "text-sm font-medium",
                milestone.isAchieved && "text-emerald-700 dark:text-emerald-300"
              )}>
                {milestone.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={milestone.isAchieved ? "success-soft" : "outline"}
                size="sm"
              >
                {milestone.targetPercentage}%
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(targetAmount, goal.currency)}
              </span>
            </div>
          </div>
        )
      })}

      {remainingCount > 0 && (
        <div className="text-center py-1">
          <span className="text-xs text-muted-foreground">
            +{remainingCount} more milestone{remainingCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}

// Milestone progress indicator for use in headers
interface MilestoneProgressProps {
  milestones: GoalMilestone[]
  className?: string
}

export function MilestoneProgress({ milestones, className }: MilestoneProgressProps) {
  const achievedCount = milestones.filter(m => m.isAchieved).length
  const totalCount = milestones.length

  if (totalCount === 0) return null

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {milestones.slice(0, 5).map((milestone) => (
          <div
            key={milestone.id}
            className={cn(
              "size-2 rounded-full transition-colors",
              milestone.isAchieved
                ? "bg-emerald-500"
                : "bg-muted-foreground/30"
            )}
          />
        ))}
        {totalCount > 5 && (
          <span className="text-xs text-muted-foreground ml-1">
            +{totalCount - 5}
          </span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {achievedCount}/{totalCount}
      </span>
    </div>
  )
}
