"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { createContext, useContext, useReducer, useCallback } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
        success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
        warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
      },
      size: {
        sm: "text-sm py-2 px-3",
        default: "text-sm py-3 px-4",
        lg: "text-base py-4 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  size?: "sm" | "default" | "lg"
  duration?: number
  dismissible?: boolean
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "UPDATE_TOAST"; id: string; toast: Partial<Toast> }

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, dismissing: true } : t
        ),
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      }
    default:
      return state
  }
}

const ToastContext = createContext<{
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
  update: (id: string, toast: Partial<Toast>) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  const toast = useCallback((toastData: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toastData,
    }

    dispatch({ type: "ADD_TOAST", toast: newToast })

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", id })
        setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", id })
        }, 300)
      }, newToast.duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", id })
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", id })
    }, 300)
  }, [])

  const update = useCallback((id: string, toastData: Partial<Toast>) => {
    dispatch({ type: "UPDATE_TOAST", id, toast: toastData })
  }, [])

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        toast,
        dismiss,
        update,
      }}
    >
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastViewport() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

interface ToastComponentProps {
  toast: Toast
}

function ToastComponent({ toast }: ToastComponentProps) {
  const { dismiss } = useToast()

  const getIcon = () => {
    switch (toast.variant) {
      case "success":
        return <CheckCircle className="size-4 shrink-0" />
      case "destructive":
        return <AlertCircle className="size-4 shrink-0" />
      case "warning":
        return <AlertTriangle className="size-4 shrink-0" />
      case "info":
        return <Info className="size-4 shrink-0" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        toastVariants({ variant: toast.variant, size: toast.size }),
        "animate-in slide-in-from-bottom-full fade-in-0 sm:slide-in-from-right-full"
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        {getIcon()}
        <div className="flex-1 space-y-1">
          {toast.title && (
            <div className="text-sm font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {toast.action && (
          <Button
            size="sm"
            variant="ghost"
            onClick={toast.action.onClick}
            className="h-8 px-3 text-xs"
          >
            {toast.action.label}
          </Button>
        )}
        
        {toast.dismissible && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dismiss(toast.id)}
            className="h-8 w-8 p-0"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Convenience functions
export const toastPresets = {
  success: (message: string, options?: Partial<Toast>) => ({
    variant: "success" as const,
    title: "Success",
    description: message,
    ...options,
  }),
  
  error: (message: string, options?: Partial<Toast>) => ({
    variant: "destructive" as const,
    title: "Error", 
    description: message,
    ...options,
  }),
  
  warning: (message: string, options?: Partial<Toast>) => ({
    variant: "warning" as const,
    title: "Warning",
    description: message,
    ...options,
  }),
  
  info: (message: string, options?: Partial<Toast>) => ({
    variant: "info" as const,
    title: "Info",
    description: message,
    ...options,
  }),
  
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) => {
    // Implementation for promise-based toasts
    return promise
  },
}

export { toastVariants }