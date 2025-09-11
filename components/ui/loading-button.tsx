"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2, Check, X, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const loadingButtonVariants = cva("", {
  variants: {
    state: {
      idle: "",
      loading: "cursor-wait",
      success: "bg-emerald-600 hover:bg-emerald-700 text-white",
      error: "bg-red-600 hover:bg-red-700 text-white",
      warning: "bg-amber-600 hover:bg-amber-700 text-white",
    },
  },
  defaultVariants: {
    state: "idle",
  },
})

type LoadingState = "idle" | "loading" | "success" | "error" | "warning"

interface LoadingButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof loadingButtonVariants> {
  loadingState?: LoadingState
  loadingText?: string
  successText?: string
  errorText?: string
  warningText?: string
  autoResetDelay?: number
  onStateChange?: (state: LoadingState) => void
}

export function LoadingButton({
  children,
  className,
  loadingState = "idle",
  loadingText,
  successText,
  errorText,
  warningText,
  autoResetDelay = 2000,
  onStateChange,
  disabled,
  onClick,
  ...props
}: LoadingButtonProps) {
  const [internalState, setInternalState] = React.useState<LoadingState>("idle")
  const currentState = loadingState !== "idle" ? loadingState : internalState

  React.useEffect(() => {
    if (currentState === "success" || currentState === "error" || currentState === "warning") {
      const timer = setTimeout(() => {
        setInternalState("idle")
        onStateChange?.("idle")
      }, autoResetDelay)
      
      return () => clearTimeout(timer)
    }
  }, [currentState, autoResetDelay, onStateChange])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (currentState === "loading" || !onClick) return

    setInternalState("loading")
    onStateChange?.("loading")

    try {
      await onClick(e)
      setInternalState("success")
      onStateChange?.("success")
    } catch (error) {
      setInternalState("error")
      onStateChange?.("error")
    }
  }

  const getContent = () => {
    switch (currentState) {
      case "loading":
        return (
          <>
            <Loader2 className="size-4 animate-spin" />
            {loadingText || "Loading..."}
          </>
        )
      case "success":
        return (
          <>
            <Check className="size-4" />
            {successText || "Success!"}
          </>
        )
      case "error":
        return (
          <>
            <X className="size-4" />
            {errorText || "Error!"}
          </>
        )
      case "warning":
        return (
          <>
            <AlertTriangle className="size-4" />
            {warningText || "Warning!"}
          </>
        )
      default:
        return children
    }
  }

  const getVariant = () => {
    switch (currentState) {
      case "success":
        return "success" as const
      case "error":
        return "destructive" as const
      case "warning":
        return "warning" as const
      default:
        return props.variant
    }
  }

  return (
    <Button
      {...props}
      variant={getVariant()}
      className={cn(
        loadingButtonVariants({ state: currentState }),
        className
      )}
      disabled={disabled || currentState === "loading"}
      onClick={handleClick}
    >
      {getContent()}
    </Button>
  )
}

// Hook for managing loading button state
export function useLoadingButton() {
  const [state, setState] = React.useState<LoadingState>("idle")

  const setLoading = () => setState("loading")
  const setSuccess = () => setState("success")
  const setError = () => setState("error")
  const setWarning = () => setState("warning")
  const setIdle = () => setState("idle")

  return {
    state,
    setState,
    setLoading,
    setSuccess,
    setError,
    setWarning,
    setIdle,
    isLoading: state === "loading",
    isSuccess: state === "success",
    isError: state === "error",
    isWarning: state === "warning",
    isIdle: state === "idle",
  }
}