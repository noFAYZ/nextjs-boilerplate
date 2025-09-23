"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { LogoLoader, SuccessLoader, FailLoader } from "@/components/icons"
import { cn } from "@/lib/utils"

interface LoadingState {
  isLoading: boolean
  message?: string
  type?: "loading" | "success" | "error"
  progress?: number
}

interface LoadingContextType {
  // State
  state: LoadingState
  
  // Methods
  showLoading: (message?: string) => void
  showSuccess: (message?: string) => void
  showError: (message?: string) => void
  hideLoading: () => void
  setProgress: (progress: number) => void
  
  // Advanced methods
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
  className?: string
  overlayClassName?: string
}

export function LoadingProvider({ 
  children, 
  className,
  overlayClassName 
}: LoadingProviderProps) {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    message: undefined,
    type: "loading",
    progress: undefined
  })

  const showLoading = (message?: string) => {
    setState({
      isLoading: true,
      message,
      type: "loading",
      progress: undefined
    })
  }

  const showSuccess = (message?: string) => {
    setState({
      isLoading: true,
      message,
      type: "success",
      progress: undefined
    })
    
    // Auto-hide success after 2 seconds
    setTimeout(() => {
      hideLoading()
    }, 2000)
  }

  const showError = (message?: string) => {
    setState({
      isLoading: true,
      message,
      type: "error",
      progress: undefined
    })
    
    // Auto-hide error after 3 seconds
    setTimeout(() => {
      hideLoading()
    }, 3000)
  }

  const hideLoading = () => {
    setState({
      isLoading: false,
      message: undefined,
      type: "loading",
      progress: undefined
    })
  }

  const setProgress = (progress: number) => {
    setState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress))
    }))
  }

  const withLoading = async <T,>(promise: Promise<T>, message?: string): Promise<T> => {
    try {
      showLoading(message)
      const result = await promise
      showSuccess("Operation completed successfully")
      return result
    } catch (error) {
      showError(error instanceof Error ? error.message : "An error occurred")
      throw error
    }
  }

  const value: LoadingContextType = {
    state,
    showLoading,
    showSuccess,
    showError,
    hideLoading,
    setProgress,
    withLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {state.isLoading && (
        <LoadingOverlay 
          state={state}
          className={overlayClassName}
        />
      )}
    </LoadingContext.Provider>
  )
}

interface LoadingOverlayProps {
  state: LoadingState
  className?: string
}

function LoadingOverlay({ state, className }: LoadingOverlayProps) {
  const getIcon = () => {
    switch (state.type) {
      case "success":
        return <SuccessLoader className="w-16 h-16" />
      case "error":
        return <FailLoader className="w-16 h-16" />
      default:
        return <LogoLoader className="w-16 h-16" />
    }
  }

  const getMessage = () => {
    if (state.message) return state.message
    
    switch (state.type) {
      case "success":
        return "Success!"
      case "error":
        return "Something went wrong"
      default:
        return "Loading..."
    }
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        " backdrop-blur-sm",
        "transition-opacity duration-200",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-xl bg-muted px-18 py-10 rounded-2xl">
        {/* Icon */}
        <div className="flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium",
            state.type === "error" && "text-destructive",
            state.type === "success" && "text-green-600"
          )}>
            {getMessage()}
          </p>

          {/* Progress Bar */}
          {state.progress !== undefined && state.type === "loading" && (
            <div className="w-full max-w-xs">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(state.progress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

// Convenience hook for page-level loading
export const usePageLoading = () => {
  const { showLoading, hideLoading, withLoading, state } = useLoading()
  
  return {
    isLoading: state.isLoading,
    startLoading: (message?: string) => showLoading(message),
    stopLoading: hideLoading,
    withLoading,
  }
}