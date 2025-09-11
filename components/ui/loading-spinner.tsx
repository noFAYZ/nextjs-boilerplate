import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
  variant?: "default" | "dots" | "pulse" | "bounce"
}

const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4", 
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

function LoadingSpinner({ 
  size = "md", 
  className,
  text,
  variant = "default"
}: LoadingSpinnerProps) {
  if (variant === "dots") {
    return (
      <div 
        data-slot="loading-spinner"
        className={cn("flex items-center gap-2", className)}
      >
        <div className="flex space-x-1">
          <div className={cn("rounded-full bg-current animate-bounce", sizeClasses[size])} style={{ animationDelay: "0ms" }} />
          <div className={cn("rounded-full bg-current animate-bounce", sizeClasses[size])} style={{ animationDelay: "150ms" }} />
          <div className={cn("rounded-full bg-current animate-bounce", sizeClasses[size])} style={{ animationDelay: "300ms" }} />
        </div>
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div 
        data-slot="loading-spinner"
        className={cn("flex items-center gap-2", className)}
      >
        <div className={cn("rounded-full bg-current animate-pulse", sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  if (variant === "bounce") {
    return (
      <div 
        data-slot="loading-spinner"
        className={cn("flex items-center gap-2", className)}
      >
        <div className={cn("rounded-full bg-current animate-bounce", sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  return (
    <div 
      data-slot="loading-spinner"
      className={cn("flex items-center gap-2", className)}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  className?: string
  spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "pulse" | "bounce"
}

function LoadingOverlay({ 
  isVisible, 
  text = "Loading...", 
  className,
  spinnerSize = "lg",
  variant = "default"
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={cn(
      "absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={spinnerSize} variant={variant} />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  variant?: "text" | "circular" | "rectangular"
}

function LoadingSkeleton({ 
  className, 
  lines = 1,
  variant = "text"
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded"
  
  const variantClasses = {
    text: "h-4 w-full",
    circular: "h-12 w-12 rounded-full",
    rectangular: "h-24 w-full"
  }

  if (lines === 1) {
    return (
      <div className={cn(baseClasses, variantClasses[variant], className)} />
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            baseClasses, 
            variantClasses[variant],
            i === lines - 1 && variant === "text" && "w-3/4"
          )} 
        />
      ))}
    </div>
  )
}

function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState)

  const startLoading = React.useCallback(() => setIsLoading(true), [])
  const stopLoading = React.useCallback(() => setIsLoading(false), [])
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  }
}

export { LoadingSpinner, LoadingOverlay, LoadingSkeleton, useLoading }