"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"

interface GlobalLoadingProps {
  isVisible: boolean
  message?: string
  className?: string
}

function GlobalLoading({ 
  isVisible, 
  message = "Loading...", 
  className 
}: GlobalLoadingProps) {
  if (!isVisible) return null

  return (
    <div 
      data-slot="global-loading"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export { GlobalLoading }