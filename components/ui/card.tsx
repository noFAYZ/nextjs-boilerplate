"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col relative overflow-hidden group border transition-all duration-75 ease-in-out",
  {
    variants: {
      variant: {
        default: "rounded-xl border-border/90 shadow-sm hover:shadow-md",
        elevated: "rounded-xl shadow-md hover:shadow-lg border-border/40",
        outlined: "rounded-xl border-2 border-border/40 hover:border-border/60 shadow-sm hover:shadow-md",
        ghost: "rounded-lg border-transparent hover:bg-card/40 hover:border-border/20",
        filled: "rounded-xl bg-muted/30 hover:bg-muted/40 border-transparent",
        gradient: "rounded-xl bg-gradient-to-br from-card via-card/95 to-card/90 border-border/20 shadow-lg hover:shadow-xl backdrop-blur-sm",
        success: "rounded-xl bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-800/50 shadow-md hover:shadow-lg",
        warning: "rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/50 shadow-md hover:shadow-lg",
        destructive: "rounded-xl bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/20 dark:to-rose-950/20 border-red-200/50 dark:border-red-800/50 shadow-md hover:shadow-lg",
        premium: "rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl",
        enterprise: "rounded-xl bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl backdrop-blur-sm",
      },
      size: {
        xs: "p-2 ",
        sm: "p-2 ",
        default: "p-2 ",
        lg: "p-4 gap-2",
        xl: "p-6 gap-3",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
        false: "",
      },
      loading: {
        true: "animate-pulse cursor-wait pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
      loading: false,
    },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  loading?: boolean
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, loading, asChild = false, ...props }, ref) => {
    if (asChild) return <>{props.children}</>

    return (
      <div
        ref={ref}
        data-slot="card"
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-busy={loading}
        className={cn(cardVariants({ variant, size, interactive, loading }), className)}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

// --- Subcomponents ---
const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "grid grid-cols-[1fr_auto] items-start gap-2 px-3 pt-3 ",
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn("flex items-center justify-end gap-2", className)}
      {...props}
    />
  )
)
CardAction.displayName = "CardAction"

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("flex-1 px-6 py-4", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center justify-between gap-2 px-3 pb-3  border-t border-border/30", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
