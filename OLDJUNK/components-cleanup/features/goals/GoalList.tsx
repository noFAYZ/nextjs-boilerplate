"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CalendarDays } from "lucide-react"
import { useMemo } from "react"
import { MageGoals } from "../icons/icons"

interface GoalCardProps {
  title: string
  current: number
  target: number
  color?: string // hex or tailwind color (e.g. "#6366f1" or "hsl(var(--primary))")
  icon?: React.ReactNode
  progressIcon?: React.ReactNode
  deadline?: string
  onTrack?: boolean
}

export function GoalCardList({
  title,
  current,
  target,
  color = "#6366f1", // indigo-500 fallback
  icon,
  onTrack,
  progressIcon,
  deadline,
}: GoalCardProps) {
  const rawProgress = target > 0 ? (current / target) * 100 : 0
  const progress = Math.max(0, Math.min(100, rawProgress))
  const iconPercent = Math.max(1, Math.min(99, progress))
  
  function getProgressColor(progress: number, onTrack: boolean): string {
    if (progress >= 100) return "#3C6300" // emerald-500
    if (!onTrack) return "#ef4444" // red-500
    if (progress >= 75) return "#10b981" // emerald-500
    if (progress >= 50) return "#3b82f6" // blue-500
    if (progress >= 25) return "#f59e0b" // amber-500
    return "#f97316" // orange-500
  }
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  function getProgressFillColor(progress: number, onTrack: boolean): string {
    if (progress >= 100) return "text-green-800"
    if (!onTrack) return "text-red-500"
    if (progress >= 75) return "text-emerald-500"
    if (progress >= 50) return "text-blue-500"
    if (progress >= 25) return "text-amber-500"
    return "text-orange-500"
  }
  const formattedCurrent = useMemo(() => `$${current.toLocaleString()}`, [current])
  const formattedTarget = useMemo(() => `$${target.toLocaleString()}`, [target])
  const progressColor = getProgressColor(progress, onTrack || true)
  const progressFillColor = getProgressFillColor(progress, onTrack || true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-3 w-full bg-gradient-to-br from-background to-muted/40 border border-border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white/80 bg-primary/80 shadow-sm shrink-0"
            )}
            style={{ background: color }}
          >
           <MageGoals className="w-7 h-7 " stroke="2"/>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{title}</span>
            <span className="text-xs text-muted-foreground truncate">
              {formattedCurrent} / {formattedTarget}
            </span>
          </div>
        </div>

        {deadline && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <CalendarDays className="w-3 h-3" />
            <span>{formatDate(deadline)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 rounded-full overflow-visible mt-1">
        {/* Pattern background */}
        <div
          className="absolute inset-0 rounded-full z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Base track */}
        <div className="absolute inset-0 rounded-full bg-muted/60 z-[1]" />

        {/* Filled progress */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full rounded-full z-[2] bg-greadient ${color}"
          style={{
            background: progressColor,
          }}
        />

        {/* Progress Icon */}
        <motion.div
          initial={{ left: "1%" }}
          animate={{ left: `${iconPercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[3] pointer-events-none p-1 bo"
          style={{ width: 44, height: 44 }}
        >
          <div className={`w-8 h-8 p-1.5 flex items-center  justify-center rounded-full  shadow-sm text-white/80`}
          style={{
            background: progressColor,
          }}>
            {progressIcon ?? icon}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span className="font-medium">
          {progress < 100 ? `${(target - current).toLocaleString()} left` : "Goal achieved 🎉"}
        </span>
        <span className="font-semibold text-primary text-sm">
          {progress.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  )
}
