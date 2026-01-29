"use client"

import { motion } from "framer-motion"
import { Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CurrencyDisplay } from "@/components/ui/currency-display"

interface GoalSummaryProps {
  goal: {
    currentAmount: number
    targetAmount: number
    amountRemaining?: number
    isAchieved?: boolean
  }
  nextMilestone?: {
    name: string
    targetPercentage: number
  }
  showMilestones?: boolean
  compact?: boolean
}

export function GoalSummary({
  goal,
  nextMilestone,
  showMilestones,
  compact,
}: GoalSummaryProps) {
  const remaining = goal.amountRemaining ?? goal.targetAmount - goal.currentAmount
  const progressRatio = (goal.currentAmount / goal.targetAmount) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "relative w-full rounded-2xl border border-border/70 bg-gradient-to-br from-background to-muted/40 backdrop-blur-sm",
        "p-3 flex flex-col gap-3 transition-all duration-200  hover:shadow-sm"
      )}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Current
          </p>
          <p className="text-base sm:text-lg font-semibold text-foreground">
            <CurrencyDisplay amountUSD={goal.currentAmount || 0} variant="compact" />
          </p>
        </div>

        <div className="flex flex-col text-right">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Target
          </p>
          <p className="text-base sm:text-lg font-semibold text-primary">
            <CurrencyDisplay amountUSD={goal.targetAmount || 0} variant="compact" />
          </p>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-border/50 " />

      {/* Info Row */}
      <div className="flex flex-col gap-2 items-center justify-between text-xs sm:text-[13px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {!goal.isAchieved && remaining > 0 ? (
            <>
              <span className="font-medium text-foreground">Left:</span>
              <span className="font-semibold text-foreground/90">
                <CurrencyDisplay amountUSD={remaining} variant="compact" />
              </span>
            </>
          ) : (
            <span className="font-semibold text-green-800 ">
              Goal Achieved 🎉
            </span>
          )}
        </div>

        {showMilestones && nextMilestone && (
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
            <Award className="size-3 opacity-90" />
            <span className="truncate max-w-[90px] font-medium">
              {nextMilestone.name}
            </span>
            <Badge
              variant="soft"
              className="text-[10px] h-4 px-1 border-amber-300/40 bg-amber-100/10"
            >
              {nextMilestone.targetPercentage}%
            </Badge>
          </div>
        )}
      </div>

  
    </motion.div>
  )
}
