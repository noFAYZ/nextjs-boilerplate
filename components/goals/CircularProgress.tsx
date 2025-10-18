"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Zap,
  Rocket,
  Flame,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react"

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
  size = 90,
  strokeWidth = 10,
  className,
  progressColor = "#60a5fa", // Tailwind sky-400 fallback
  fillColor = "text-foreground",
  icon: Icon,
}: CircularProgressProps) {
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(progress, 100)
  const offset = circumference - (clamped / 100) * circumference

  // Smooth angle for icon or particle positioning
  const angle = (clamped / 100) * 2 * Math.PI - Math.PI / 2
  const tipX = size / 2 + radius * Math.cos(angle)
  const tipY = size / 2 + radius * Math.sin(angle)

  // Dynamic icon based on progress (if none provided)
  const getDynamicIcon = () => {
    if (clamped >= 100) return Star
    if (clamped >= 75) return Rocket
    if (clamped >= 50) return Flame
    if (clamped >= 25) return Zap
    return Target
  }

  const ActiveIcon = Icon || getDynamicIcon()

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
        style={{ overflow: "visible" }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="hsl(var(--muted-foreground)/0.15)"
          fill="none"
        />

        {/* Smooth Progress Path */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={progressColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 6px ${progressColor}40)`,
          }}
        />

        {/* Subtle trailing glow for progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth - 2}
          fill="none"
          stroke={progressColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          opacity={0.1}
          animate={{
            strokeDashoffset: [offset + 15, offset],
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Tiny pulse at tip of progress */}
        {clamped > 0 && (
          <motion.circle
            cx={tipX}
            cy={tipY}
            r={strokeWidth / 5}
            fill={progressColor}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>

      {/* Center progress + icon */}
      <motion.div
        className="absolute flex flex-col items-center justify-center gap-1"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ActiveIcon
          className="w-5 h-5"
          style={{
            color: progressColor,
            filter: `drop-shadow(0 0 4px ${progressColor}40)`,
          }}
        />
        <span
          className={cn(
            "text-sm font-semibold tracking-tight",
            fillColor
          )}
        >
          {clamped.toFixed(0)}%
        </span>
      </motion.div>
    </div>
  )
}
