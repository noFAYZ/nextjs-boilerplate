"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
  CircleArrowOutUpRight,
} from "lucide-react"
import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"
import { SolarCheckCircleBoldDuotone } from "../icons/icons"
import { Button } from "./button"

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full gap-3 rounded-lg border p-2 shadow-2xl backdrop-blur-2xl transition-all animate-toast-in overflow-visible",
  {
    variants: {
      variant: {
        default:
          "border-border bg-gradient-to-br from-muted to-muted/80 text-foreground shadow-lg hover:shadow-xl",
        success:
          "border-emerald-400/40 bg-gradient-to-br from-emerald-50/90 via-emerald-50/60 to-emerald-100/40 text-emerald-900 dark:from-emerald-950/60 dark:via-emerald-900/40 dark:to-emerald-950/30 dark:text-emerald-50 dark:border-emerald-400/30",
        destructive:
          "border-red-400/40 bg-gradient-to-br from-red-50/90 via-red-50/60 to-red-100/40 text-red-900 dark:from-red-950/60 dark:via-red-900/40 dark:to-red-950/30 dark:text-red-50 dark:border-red-400/30",
        warning:
          "border-amber-400/40 bg-gradient-to-br from-amber-50/90 via-amber-50/60 to-amber-100/40 text-amber-900 dark:from-amber-950/60 dark:via-amber-900/40 dark:to-amber-950/30 dark:text-amber-50 dark:border-amber-400/30",
        info:
          "border-blue-400/40 bg-gradient-to-br from-blue-50/90 via-blue-50/60 to-blue-100/40 text-blue-900 dark:from-blue-950/60 dark:via-blue-900/40 dark:to-blue-950/30 dark:text-blue-50 dark:border-blue-400/30",
        loading:
          "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10",
      },
      size: {
        sm: "text-xs min-w-[260px]",
        default: "text-sm min-w-[320px] max-w-[420px]",
        lg: "text-base min-w-[380px] max-w-[480px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type ToastVariant =
  | "default"
  | "success"
  | "destructive"
  | "warning"
  | "info"
  | "loading"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  variant?: ToastVariant
  size?: "sm" | "default" | "lg"
  duration?: number
  dismissible?: boolean
  dismissing?: boolean
}

interface ToastState {
  toasts: Toast[]
}

/* -------------------------------------------------------------------------- */
/*                                   Reducer                                  */
/* -------------------------------------------------------------------------- */

const MAX_TOASTS = 5

type Action =
  | { type: "ADD"; toast: Toast }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; patch: Partial<Toast> }

function reducer(state: ToastState, action: Action): ToastState {
  switch (action.type) {
    case "ADD":
      return {
        toasts: [...state.toasts, action.toast].slice(-MAX_TOASTS),
      }
    case "DISMISS":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, dismissing: true } : t
        ),
      }
    case "REMOVE":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) }
    case "UPDATE":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t
        ),
      }
    default:
      return state
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
  update: (id: string, patch: Partial<Toast>) => void
  promise: <T>(
    p: Promise<T>,
    opts: {
      loading: string
      success: string | ((v: T) => string)
      error: string | ((e: unknown) => string)
    }
  ) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/* -------------------------------------------------------------------------- */
/*                                  Provider                                  */
/* -------------------------------------------------------------------------- */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { toasts: [] })
  const timers = useRef<Record<string, number>>({})

  const remove = (id: string) => {
    window.clearTimeout(timers.current[id])
    delete timers.current[id]
    dispatch({ type: "REMOVE", id })
  }

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "DISMISS", id })
    timers.current[id] = window.setTimeout(() => remove(id), 250)
  }, [])

  const toast = useCallback((data: Omit<Toast, "id">) => {
    const id = crypto.randomUUID()
    const isLoading = data.variant === "loading"
    const duration = isLoading ? undefined : data.duration ?? 4500

    dispatch({
      type: "ADD",
      toast: {
        id,
        dismissible: !isLoading,
        duration,
        ...data,
      },
    })

    if (duration && duration > 0 && !isLoading) {
      timers.current[id] = window.setTimeout(() => dismiss(id), duration)
    }

    return id
  }, [dismiss])

  const update = useCallback((id: string, patch: Partial<Toast>) => {
    dispatch({ type: "UPDATE", id, patch })

    // If duration is provided, set up auto-dismiss timer
    if (patch.duration && patch.duration > 0) {
      // Clear any existing timer first
      window.clearTimeout(timers.current[id])
      // Set new timer
      timers.current[id] = window.setTimeout(() => dismiss(id), patch.duration)
    }
  }, [dismiss])

  const promise = useCallback(<T,>(
    p: Promise<T>,
    opts: ToastContextValue["promise"] extends (
      p: Promise<T>,
      opts: infer O
    ) => any
      ? O
      : never
  ) => {
    const id = toast({ title: opts.loading, variant: "loading" })

    p.then((res) => {
      update(id, {
        title: typeof opts.success === "function" ? opts.success(res) : opts.success,
        variant: "success",
        dismissible: true,
        duration: 4000,
      })
    }).catch((err) => {
      update(id, {
        title: typeof opts.error === "function" ? opts.error(err) : opts.error,
        variant: "destructive",
        dismissible: true,
        duration: 5000,
      })
    })
  }, [toast, update])

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss, update, promise }}>
      <ToastStyles />
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Hook                                     */
/* -------------------------------------------------------------------------- */

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}

/* -------------------------------------------------------------------------- */
/*                                  Viewport                                  */
/* -------------------------------------------------------------------------- */

function ToastViewport() {
  const ctx = useContext(ToastContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!ctx || !mounted) return null

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-h-screen "
      aria-live="polite"
      aria-label="Notifications"
    >
      {ctx.toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>,
    document.body
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Toast Item                                */
/* -------------------------------------------------------------------------- */

function ToastItem({ toast }: { toast: Toast }) {
  const { dismiss } = useToast()

  const variantConfig = {
    success: {
      icon: <SolarCheckCircleBoldDuotone className="w-5 h-5" />,
      iconBg: "bg-lime-400 dark:bg-lime-900/40",
      iconColor: "text-lime-800 dark:text-lime-400",
      glow: "bg-lime-400/20",
    },
    destructive: {
      icon: <AlertCircle className="w-5 h-5" />,
      iconBg: "bg-red-100 dark:bg-red-900/40",
      iconColor: "text-red-600 dark:text-red-400",
      glow: "bg-red-400/20",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-400",
      glow: "bg-amber-400/20",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      glow: "bg-blue-400/20",
    },
    loading: {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      iconBg: "bg-primary/15 dark:bg-primary/25",
      iconColor: "text-primary",
      glow: "bg-primary/15",
    },
    default: {
      icon: null,
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      glow: "bg-muted/20",
    },
  }

  const config = variantConfig[toast.variant ?? "default"]

  return (
    <div
      className={cn(
        toastVariants({variant:'default', size: toast.size }),
        toast.dismissing && "animate-toast-out", ""
      )}
      role={toast.variant === "destructive" ? "alert" : "status"}
    >
      {/* Icon with glow background */}
      {config.icon && (
        <div className="relative flex-shrink-0 flex items-start justify-center">
          {/* Glow effect */}
      

          {/* Icon background circle */}
          <div className={cn("relative flex items-center justify-center w-9 h-9 rounded-full border shadow-inner", config.iconBg, )}>
            <div className={cn("w-5 h-5 flex items-center justify-center", config.iconColor)}>
              {config.icon}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold leading-tight text-sm ">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-xs opacity-85 leading-relaxed">{toast.description}</div>
        )}
        {toast.action && (
          <Button
            onClick={toast.action.onClick}
           variant='outline2'
           className="gap-1 py-0.5 "
           size="xs"
           icon={<CircleArrowOutUpRight className="w-2.5 h-2.5" />}
           iconPosition="right"
          >
            {toast.action.label} 
          </Button>
        )}
      </div>

      {/* Close button */}
      {toast.dismissible && (
        <Button
          onClick={() => dismiss(toast.id)}
          variant="outlinemuted"
          className="absolute -top-1 -right-1 w-4.5 h-4.5"
          size="icon-xs"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Animations Styles                            */
/* -------------------------------------------------------------------------- */

const animationStyles = `
  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(384px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes toast-out {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(384px) scale(0.9);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  .animate-toast-in {
    animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-toast-out {
    animation: toast-out 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
`

function ToastStyles() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
}
