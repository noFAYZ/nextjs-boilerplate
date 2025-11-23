'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border text-xs font-medium w-fit whitespace-nowrap shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-100 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground  [a&]:hover:bg-primary/90 [a&]:hover:shadow-md",
        soft: "bg-background dark:bg-muted text-muted-foreground border",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground bg-card [a&]:hover:bg-background [a&]:hover:text-accent-foreground shadow-sm  border-border/80",

        success:
          "border-transparent bg-emerald-500 text-white shadow-sm [a&]:hover:bg-emerald-600 dark:bg-emerald-600 dark:[a&]:hover:bg-emerald-700",
        'success-icon':
          "border-transparent bg-lime-700 text-white/70 shadow-sm [a&]:hover:bg-lime-600 dark:bg-lime-800 dark:[a&]:hover:bg-lime-700",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm [a&]:hover:bg-amber-600 dark:bg-amber-600 dark:[a&]:hover:bg-amber-700",
        error:
          "border-transparent bg-red-500 text-white shadow-sm [a&]:hover:bg-red-600 dark:bg-red-600 dark:[a&]:hover:bg-red-700",
        info:
          "border-transparent bg-blue-500 text-white shadow-sm [a&]:hover:bg-blue-600 dark:bg-blue-600 dark:[a&]:hover:bg-blue-700",

        "success-soft":
          "border-emerald-200 bg-emerald-50 text-emerald-700 [a&]:hover:bg-emerald-100 [a&]:hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        "warning-soft":
          "border-amber-200 bg-amber-50 text-amber-700 [a&]:hover:bg-amber-100 [a&]:hover:border-amber-300 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
        "error-soft":
          "border-red-200 bg-red-50 text-red-700 [a&]:hover:bg-red-100 [a&]:hover:border-red-300 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        "info-soft":
          "border-blue-200 bg-blue-50 text-blue-700 [a&]:hover:bg-blue-100 [a&]:hover:border-blue-300 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",

        "gradient-primary":
          "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm [a&]:hover:from-blue-600 [a&]:hover:to-purple-700",
        "gradient-success":
          "border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm [a&]:hover:from-emerald-600 [a&]:hover:to-teal-700",
        "gradient-warning":
          "border-transparent bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm [a&]:hover:from-amber-600 [a&]:hover:to-orange-700",

        premium:
          "border-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow-lg [a&]:hover:shadow-xl [a&]:hover:from-yellow-500 [a&]:hover:to-yellow-700",
        pro:
          "border-transparent bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white shadow-lg [a&]:hover:shadow-xl",
          max:
          "border-transparent bg-gradient-to-br from-orange-500/70 via-amber-600/70 to-pink-600/70 text-white shadow-lg [a&]:hover:shadow-xl",
        new:
          "border-transparent bg-gradient-to-br from-pink-600 to-rose-700 text-white shadow-xs  ",

        subtle:
          "border-border/50 bg-muted/50 text-muted-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground",
        muted:
          "border-border/50 bg-muted/80 text-muted-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground",
        "subtle-primary":
          "border-primary/20 bg-primary/10 text-primary [a&]:hover:bg-primary/20 [a&]:hover:border-primary/30",

          cupertino:
          "bg-[rgba(255,255,255,0.55)] dark:bg-[rgba(40,40,40,0.55)] backdrop-blur-md   border border-white/20 dark:border-white/10 text-foreground shadow-sm",
        
        "cupertino-tint":
          "bg-primary/15 text-primary font-medium border border-primary/20     backdrop-blur-sm shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.4)]",
        
        glass:
          "relative bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-sm  before:absolute before:inset-0 before:rounded-md  before:bg-gradient-to-b before:from-white/30 before:to-transparent dark:before:from-white/10",
        
        frost:
          "backdrop-blur-lg bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(30,30,30,0.4)]   border border-white/30 dark:border-white/10 text-foreground shadow-sm",
        
        aqua:
          "bg-[linear-gradient(to_bottom_right,rgba(0,122,255,0.18),rgba(0,122,255,0.1))]   text-[rgb(0,122,255)] border border-[rgba(0,122,255,0.25)] backdrop-blur-sm",
        
        metal:
          "bg-gradient-to-br from-zinc-200/70 via-zinc-100/60 to-zinc-300/70     dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700   border border-zinc-400/40 dark:border-zinc-700/40   text-zinc-900 dark:text-zinc-100 shadow-inner",
        
        slate:
          "bg-[rgb(245,245,247)] dark:bg-[rgb(36,36,38)]    text-foreground border border-black/5 dark:border-white/5 shadow-sm",
        
        tag:
          "bg-primary/12 text-primary border border-transparent backdrop-blur-sm   shadow-[0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
        
      },
      size: {
        icon: "p-0.5 text-[10px]",
        sm: "px-1.5 py-0.5 text-[10px]",
        default: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  left?: React.ReactNode
  right?: React.ReactNode
}

export function Badge({
  className,
  variant,
  size,
  asChild = false,
  left,
  right,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, size }),
        "inline-flex items-center gap-1",
        className
      )}
      {...props}
    >
      {left && <span className="flex items-center">{left}</span>}
      <span className="truncate flex items-center gap-1">{children}</span>
      {right && <span className="flex items-center">{right}</span>}
    </Comp>
  )
}
