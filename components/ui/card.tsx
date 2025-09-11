import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 border transition-all duration-100 relative overflow-hidden group ",
  {
    variants: {
      variant: {
        default: "rounded-xl shadow-sm hover:shadow-md border-border/50 ",
        elevated: "rounded-xl shadow-md hover:shadow-lg border-border/30",
        outlined: "rounded-xl border-2 shadow-sm hover:shadow-md hover:border-border/60 border-border/40",
        ghost: "border-transparent hover:bg-card/50 hover:border-border/20 rounded-lg",
        filled: "bg-muted/30 border-transparent hover:bg-muted/40 rounded-xl",
        gradient: "bg-gradient-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl rounded-xl backdrop-blur-sm border-border/20",
        success: "bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-800/50 shadow-md hover:shadow-lg rounded-xl",
        warning: "bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/50 shadow-md hover:shadow-lg rounded-xl",
        destructive: "bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/20 dark:to-rose-950/20 border-red-200/50 dark:border-red-800/50 shadow-md hover:shadow-lg rounded-xl",
        premium: "bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl rounded-xl",
        enterprise: "bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl rounded-xl backdrop-blur-sm",
      },
      size: {
        xs: "py-3 gap-3",
        sm: "py-4 gap-4",
        default: "py-6 gap-6", 
        lg: "py-8 gap-8",
        xl: "py-10 gap-10",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
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

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  loading?: boolean
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, loading, asChild = false, ...props }, ref) => {
    const Component = asChild ? React.Fragment : "div"
    
    if (asChild) {
      return <>{props.children}</>
    }

    return (
      <Component
        ref={ref}
        data-slot="card"
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-busy={loading}
        className={cn(cardVariants({ variant, size, interactive, loading, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
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
      className={cn("leading-none font-semibold text-lg", className)}
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
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
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
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end flex items-center gap-2",
        className
      )}
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
      className={cn("px-6 flex-1", className)}
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
      className={cn("flex items-center gap-3 px-6 mt-auto [.border-t]:pt-6", className)}
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
